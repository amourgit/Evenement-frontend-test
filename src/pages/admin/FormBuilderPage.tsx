import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  buildFormConfiguration,
  configToBuilderDoc,
  createBlankBuilderDoc,
  downloadFormConfiguration,
  hydrateBuilderDocFromConfiguration,
  parseFormConfigurationFile,
  verifyChecksum,
  InvalidConfigurationError,
} from "@/lib/utils/formConfig";
import { historyReducer, createHistoryState } from "@/components/builder/builderReducer";
import type { Selection } from "@/components/builder/builderReducer";
import { formConfigApi } from "@/lib/api/formConfig";
import { BuilderTopBar } from "@/components/builder/BuilderTopBar";
import { BuilderLeftPanel } from "@/components/builder/BuilderLeftPanel";
import { BuilderCanvas } from "@/components/builder/BuilderCanvas";
import { BuilderRightPanel } from "@/components/builder/BuilderRightPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

type Device = "desktop" | "mobile";

interface FormBuilderPageProps {
  eventId?: string;
  onBack: () => void;
  onEventCreated?: (eventId: string) => void;
}

/**
 * Editeur d'evenement plein ecran, en trois zones (a la Figma) :
 *  - gauche  : navigateur d'objets (sections/champs) + reglages globaux
 *              (informations, theme, IA)
 *  - centre  : canevas live du formulaire, objets selectionnables
 *  - droite  : inspecteur des proprietes de l'objet selectionne
 *
 * A chaque enregistrement, un JSON de configuration COMPLET est construit
 * (voir lib/utils/formConfig.ts) et envoye au backend en un seul appel.
 * Ce meme JSON peut etre exporte/importe pour cloner une configuration.
 */
export function FormBuilderPage({ eventId: propEventId = "new", onBack, onEventCreated }: FormBuilderPageProps) {
  const eventId = propEventId;
  const isNew = eventId === "new";
  const { toast } = useToast();

  const [history, dispatch] = useReducer(historyReducer, undefined, () =>
    createHistoryState(createBlankBuilderDoc())
  );
  const doc = history.present;

  const [selection, setSelection] = useState<Selection>(null);
  const [device, setDevice] = useState<Device>("desktop");
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);

  const lastSavedSnapshot = useRef<string>(JSON.stringify(createBlankBuilderDoc()));

  useEffect(() => {
    if (isNew) return;
    formConfigApi
      .get(eventId)
      .then((config) => {
        const loaded = configToBuilderDoc(config);
        dispatch({ kind: "LOAD_DOC", doc: loaded });
        lastSavedSnapshot.current = JSON.stringify(loaded);
      })
      .catch(() => toast({ title: "Impossible de charger cet evenement.", variant: "destructive" }))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, isNew]);

  const isDirty = useMemo(() => JSON.stringify(doc) !== lastSavedSnapshot.current, [doc]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const config = buildFormConfiguration(doc, { sourceEventId: doc.event.id });
      const response =
        doc.event.id === null
          ? await formConfigApi.create(config)
          : await formConfigApi.save(doc.event.id, config);

      const nextDoc = configToBuilderDoc(response.configuration);
      dispatch({ kind: "LOAD_DOC", doc: nextDoc });
      lastSavedSnapshot.current = JSON.stringify(nextDoc);
      toast({ title: "Configuration enregistree." });

      if (isNew && response.event_id) {
        // Signal to parent to update the eventId
        onEventCreated?.(response.event_id);
      }
    } catch (err) {
      toast({ title: "L'enregistrement a echoue. Reessayez.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }, [doc, isNew, onBack, toast]);

  const handleExport = useCallback(() => {
    const config = buildFormConfiguration(doc, { sourceEventId: doc.event.id });
    downloadFormConfiguration(config);
    toast({ title: "Fichier de configuration telecharge." });
  }, [doc, toast]);

  const handleImportFile = useCallback(
    async (file: File) => {
      try {
        const parsed = await parseFormConfigurationFile(file);
        if (!verifyChecksum(parsed)) {
          toast({ title: "Attention : le checksum du fichier ne correspond pas (fichier modifie manuellement)." });
        }
        const confirmed = confirm(
          `Importer « ${parsed.event.title} » ? Cela remplacera le theme, l'IA, les sections et les champs actuels de cet editeur (non enregistre tant que vous ne cliquez pas sur Enregistrer).`
        );
        if (!confirmed) return;

        const hydrated = hydrateBuilderDocFromConfiguration(parsed, doc.event.id);
        dispatch({ kind: "LOAD_DOC", doc: hydrated });
        setSelection(null);
        toast({ title: "Configuration importee. Verifiez puis enregistrez." });
      } catch (err) {
        toast({ title: err instanceof InvalidConfigurationError ? err.message : "Le fichier n'a pas pu etre importe.", variant: "destructive" });
      }
    },
    [doc.event.id, toast]
  );

  // Raccourcis clavier : Ctrl/Cmd+Z (annuler), Ctrl/Cmd+Maj+Z (retablir), Suppr (retirer la selection)
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isEditing = ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) dispatch({ kind: "REDO" });
        else dispatch({ kind: "UNDO" });
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        dispatch({ kind: "REDO" });
        return;
      }
      if (!isEditing && (e.key === "Delete" || e.key === "Backspace") && selection) {
        e.preventDefault();
        if (selection.type === "field") dispatch({ kind: "DELETE_FIELD", id: selection.id });
        else dispatch({ kind: "DELETE_SECTION", id: selection.id });
        setSelection(null);
        return;
      }
      if (!isEditing && e.key === "Escape") {
        setSelection(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selection]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-base">
        <Skeleton className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-base text-ink">
      <BuilderTopBar
        title={doc.event.title}
        status={doc.event.status}
        isDirty={isDirty}
        isSaving={isSaving}
        canUndo={history.past.length > 0}
        canRedo={history.future.length > 0}
        device={device}
        onDeviceChange={setDevice}
        onSave={handleSave}
        onExport={handleExport}
        onImportFile={handleImportFile}
        onUndo={() => dispatch({ kind: "UNDO" })}
        onRedo={() => dispatch({ kind: "REDO" })}
        previewUrl={doc.event.id && doc.event.slug ? `/e/${doc.event.slug}` : undefined}
      />

      <div className="flex flex-1 overflow-hidden">
        <BuilderLeftPanel doc={doc} selection={selection} onSelect={setSelection} dispatch={dispatch} />
        <BuilderCanvas doc={doc} selection={selection} onSelect={setSelection} dispatch={dispatch} device={device} />
        <BuilderRightPanel doc={doc} selection={selection} onSelect={setSelection} dispatch={dispatch} />
      </div>
    </div>
  );
}

import { useState } from "react";
import type { BuilderDoc } from "@/lib/utils/formConfig";
import type { BuilderAction, Selection } from "./builderReducer";
import { StructureTree } from "./StructureTree";
import { FieldPalette } from "./FieldPalette";
import { EventThemeEditor } from "../admin/EventThemeEditor";
import { AIPromptUploader } from "../admin/AIPromptUploader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type LeftTab = "structure" | "general" | "theme" | "ai";

interface BuilderLeftPanelProps {
  doc: BuilderDoc;
  selection: Selection;
  onSelect: (s: Selection) => void;
  dispatch: (action: BuilderAction) => void;
}

const TABS: { id: LeftTab; label: string }[] = [
  { id: "structure", label: "Structure" },
  { id: "general", label: "General" },
  { id: "theme", label: "Design" },
  { id: "ai", label: "IA" },
];

export function BuilderLeftPanel({ doc, selection, onSelect, dispatch }: BuilderLeftPanelProps) {
  const [tab, setTab] = useState<LeftTab>("structure");
  const [showPalette, setShowPalette] = useState(false);

  const targetSectionId =
    selection?.type === "section"
      ? selection.id
      : selection?.type === "field"
      ? doc.fields.find((f) => f.id === selection.id)?.section_id ?? null
      : doc.sections[0]?.id ?? null;

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-base-border bg-base-raised">
      <div className="flex border-b border-base-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "focus-ring flex-1 border-b-2 px-2 py-2.5 text-xs font-medium transition-colors",
              tab === t.id
                ? "border-signal text-ink"
                : "border-transparent text-ink-faint hover:text-ink-muted"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {tab === "structure" && (
          <div className="space-y-3">
            <div className="flex gap-1.5">
              <Button size="sm" variant="ghost" className="flex-1" onClick={() => dispatch({ kind: "ADD_SECTION" })}>
                + Section
              </Button>
              <Button size="sm" className="flex-1" onClick={() => setShowPalette((v) => !v)}>
                + Champ
              </Button>
            </div>

            {showPalette && (
              <FieldPalette
                className="rounded border border-base-border bg-base-surface p-2"
                onPick={(type) => {
                  dispatch({ kind: "ADD_FIELD", dataType: type, sectionId: targetSectionId });
                  setShowPalette(false);
                }}
              />
            )}

            <StructureTree
              sections={doc.sections}
              fields={doc.fields}
              selection={selection}
              onSelect={onSelect}
              dispatch={dispatch}
            />
          </div>
        )}

        {tab === "general" && (
          <div className="space-y-4">
            <Field label="Titre">
              <Input
                value={doc.event.title}
                onChange={(e) => dispatch({ kind: "SET_EVENT_META", payload: { title: e.target.value } })}
              />
            </Field>
            <Field label="Identifiant URL (slug)">
              <Input
                className="font-mono"
                value={doc.event.slug}
                onChange={(e) => dispatch({ kind: "SET_EVENT_META", payload: { slug: e.target.value } })}
              />
            </Field>
            <Field label="Description courte">
              <Textarea
                rows={2}
                value={doc.event.short_description}
                onChange={(e) =>
                  dispatch({ kind: "SET_EVENT_META", payload: { short_description: e.target.value } })
                }
              />
            </Field>
            <Field label="Description longue">
              <Textarea
                rows={4}
                value={doc.event.long_description}
                onChange={(e) =>
                  dispatch({ kind: "SET_EVENT_META", payload: { long_description: e.target.value } })
                }
              />
            </Field>
            <Field label="Statut">
              <Select
                value={doc.event.status}
                onValueChange={(value) =>
                  dispatch({ kind: "SET_EVENT_META", payload: { status: value as any } })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="open">Ouvert</SelectItem>
                  <SelectItem value="closed">Cloture</SelectItem>
                  <SelectItem value="archived">Archive</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Debut">
              <Input
                type="datetime-local"
                value={doc.event.starts_at ?? ""}
                onChange={(e) => dispatch({ kind: "SET_EVENT_META", payload: { starts_at: e.target.value } })}
              />
            </Field>
            <Field label="Date limite d'inscription">
              <Input
                type="datetime-local"
                value={doc.event.registration_deadline ?? ""}
                onChange={(e) =>
                  dispatch({ kind: "SET_EVENT_META", payload: { registration_deadline: e.target.value } })
                }
              />
            </Field>
            <Field label="Capacite (optionnel)">
              <Input
                type="number"
                value={doc.event.capacity ?? ""}
                onChange={(e) =>
                  dispatch({
                    kind: "SET_EVENT_META",
                    payload: { capacity: e.target.value ? Number(e.target.value) : null },
                  })
                }
              />
            </Field>
          </div>
        )}

        {tab === "theme" && (
          <EventThemeEditor theme={doc.theme} onChange={(theme) => dispatch({ kind: "SET_THEME", payload: theme })} />
        )}

        {tab === "ai" && (
          <div className="space-y-4">
            <Field label="Assistant active">
              <label className="flex items-center gap-2 text-xs text-ink-muted">
                <input
                  type="checkbox"
                  className="accent-signal"
                  checked={doc.ai_config.enabled}
                  onChange={(e) =>
                    dispatch({
                      kind: "SET_AI_CONFIG",
                      payload: { ...doc.ai_config, enabled: e.target.checked },
                    })
                  }
                />
                Afficher l'assistant sur la page publique
              </label>
            </Field>
            <Field label="Ton">
              <Select
                value={doc.ai_config.tone}
                onValueChange={(value) =>
                  dispatch({ kind: "SET_AI_CONFIG", payload: { ...doc.ai_config, tone: value as any } })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chaleureux">Chaleureux</SelectItem>
                  <SelectItem value="formel">Formel</SelectItem>
                  <SelectItem value="neutre">Neutre</SelectItem>
                  <SelectItem value="dynamique">Dynamique</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Instructions systeme">
              <Textarea
                rows={4}
                value={doc.ai_config.system_prompt}
                onChange={(e) =>
                  dispatch({
                    kind: "SET_AI_CONFIG",
                    payload: { ...doc.ai_config, system_prompt: e.target.value },
                  })
                }
              />
            </Field>

            {doc.event.id ? (
              <AIPromptUploader eventId={doc.event.id} />
            ) : (
              <p className="rounded border border-base-border bg-base-surface px-3 py-2.5 text-xs text-ink-faint">
                Enregistrez l'evenement une premiere fois pour televerser des fichiers/prompts de
                contexte et activer les suggestions IA.
              </p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs text-ink-muted">{label}</label>
      {children}
    </div>
  );
}

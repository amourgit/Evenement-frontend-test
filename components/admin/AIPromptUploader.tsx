import { useEffect, useState } from "react";
import type { AIPromptSource } from "../../src/types/ai";
import { aiApi } from "@/lib/api/ai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface AIPromptUploaderProps {
  eventId: string;
}

/**
 * Permet a l'admin de televerser un prompt (texte libre ou fichier) qui
 * sert de base de connaissance a l'IA pour : generer automatiquement la
 * description/analyse de l'evenement, et repondre aux questions des
 * utilisateurs via l'assistant vocal/textuel.
 */
export function AIPromptUploader({ eventId }: AIPromptUploaderProps) {
  const [sources, setSources] = useState<AIPromptSource[]>([]);
  const [textLabel, setTextLabel] = useState("");
  const [textContent, setTextContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    aiApi.listPromptSources(eventId).then(setSources).catch(() => setSources([]));
  }, [eventId]);

  async function handleAddText() {
    if (!textLabel.trim() || !textContent.trim()) return;
    setIsUploading(true);
    try {
      const source = await aiApi.uploadPromptSource(eventId, {
        label: textLabel,
        kind: "text",
        content: textContent,
      });
      setSources((prev) => [...prev, source]);
      setTextLabel("");
      setTextContent("");
      toast({ title: "Prompt ajoute a la base de connaissance." });
    } catch {
      toast({ title: "Impossible d'ajouter ce prompt.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  }

  async function handleFile(file: File) {
    setIsUploading(true);
    try {
      const source = await aiApi.uploadPromptSource(eventId, {
        label: file.name,
        kind: "file",
        file,
      });
      setSources((prev) => [...prev, source]);
      toast({ title: "Fichier televerse." });
    } catch {
      toast({ title: "Echec du televersement.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  }

  async function handleRemove(sourceId: string) {
    await aiApi.removePromptSource(eventId, sourceId);
    setSources((prev) => prev.filter((s) => s.id !== sourceId));
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="font-display text-sm font-semibold">Base de connaissance IA</h3>
        <p className="mt-1 text-xs text-ink-muted">
          Televersez un texte ou un fichier decrivant l'evenement. L'IA s'en sert pour generer
          les descriptions, suggerer une structure de champs et repondre aux utilisateurs.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Input
            placeholder="Nom du prompt (ex: Brief organisateur)"
            value={textLabel}
            onChange={(e) => setTextLabel(e.target.value)}
          />
          <Textarea
            placeholder="Collez ici le contexte, le programme, les regles d'inscription..."
            rows={4}
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <label className="focus-ring cursor-pointer rounded text-xs text-ink-muted underline-offset-2 hover:text-ink hover:underline">
              ou televerser un fichier (.txt, .md, .pdf, .docx)
              <input
                type="file"
                accept=".txt,.md,.pdf,.docx"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </label>
            <Button size="sm" onClick={handleAddText} disabled={isUploading}>
              Ajouter le prompt
            </Button>
          </div>
        </div>

        {sources.length > 0 && (
          <ul className="space-y-2 border-t border-base-border pt-4">
            {sources.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between rounded border border-base-border bg-base-surface px-3 py-2 text-xs"
              >
                <span className="truncate text-ink-muted">
                  <span className="font-mono uppercase text-ink-faint">[{s.kind}]</span> {s.label}
                </span>
                <button onClick={() => handleRemove(s.id)} className="focus-ring text-ink-faint hover:text-state-closed">
                  Retirer
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

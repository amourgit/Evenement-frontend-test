import { useState } from "react";
import type { AISchemaSuggestion } from "@/src/types/ai";
import { aiApi } from "@/lib/api/ai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

interface AISuggestionsPanelProps {
  eventId: string;
  onApplied: () => void;
}

/**
 * Permet a l'admin de :
 *  1. generer automatiquement description/analyse a partir des prompts televerses,
 *  2. demander a l'IA une structure de champs/sections optimisee,
 *  3. affiner cette structure par un echange conversationnel avant de l'appliquer.
 */
export function AISuggestionsPanel({ eventId, onApplied }: AISuggestionsPanelProps) {
  const [refinementPrompt, setRefinementPrompt] = useState("");
  const [suggestion, setSuggestion] = useState<AISchemaSuggestion | null>(null);
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [generatedCopy, setGeneratedCopy] = useState<{
    short_description: string;
    long_description: string;
  } | null>(null);
  const { toast } = useToast();

  async function handleGenerateCopy() {
    setIsGeneratingCopy(true);
    try {
      const result = await aiApi.generateEventCopy(eventId);
      setGeneratedCopy(result);
      toast({ title: "Description generee. Verifiez-la avant publication." });
    } catch {
      toast({ title: "La generation a echoue. Ajoutez au moins un prompt de contexte.", variant: "destructive" });
    } finally {
      setIsGeneratingCopy(false);
    }
  }

  async function handleSuggestSchema() {
    setIsSuggesting(true);
    try {
      const result = await aiApi.suggestSchema({
        event_id: eventId,
        prompt:
          refinementPrompt ||
          "Propose une structure de champs adaptee a cet evenement, en te basant sur le contexte fourni.",
      });
      setSuggestion(result);
    } catch {
      toast({ title: "Impossible de generer une suggestion pour le moment.", variant: "destructive" });
    } finally {
      setIsSuggesting(false);
    }
  }

  async function handleApply() {
    if (!suggestion) return;
    setIsApplying(true);
    try {
      await aiApi.applySchemaSuggestion(eventId, suggestion.id);
      toast({ title: "Structure appliquee a l'evenement." });
      setSuggestion(null);
      onApplied();
    } catch {
      toast({ title: "L'application de la structure a echoue.", variant: "destructive" });
    } finally {
      setIsApplying(false);
    }
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <h3 className="font-display text-sm font-semibold">Description automatique</h3>
          <p className="mt-1 text-xs text-ink-muted">
            Genere un titre court et une description longue a partir des prompts televerses.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button size="sm" onClick={handleGenerateCopy} disabled={isGeneratingCopy}>
            Generer la description
          </Button>
          {generatedCopy && (
            <div className="space-y-2 rounded border border-base-border bg-base-surface p-3 text-sm">
              <p className="font-medium text-ink">{generatedCopy.short_description}</p>
              <p className="text-ink-muted">{generatedCopy.long_description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="font-display text-sm font-semibold">Structure de champs suggeree par l'IA</h3>
          <p className="mt-1 text-xs text-ink-muted">
            Precisez vos attentes pour affiner la proposition, puis appliquez-la a l'evenement.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            rows={2}
            placeholder="Ex: ajoute un champ allergie alimentaire, et separe les infos billetterie dans leur propre section"
            value={refinementPrompt}
            onChange={(e) => setRefinementPrompt(e.target.value)}
          />
          <Button size="sm" variant="ghost" onClick={handleSuggestSchema} disabled={isSuggesting}>
            {suggestion ? "Regenerer la suggestion" : "Suggerer une structure"}
          </Button>

          {isSuggesting && (
            <div className="flex items-center gap-2 text-xs text-ink-muted">
              <Skeleton className="h-4 w-4" /> Analyse du contexte en cours...
            </div>
          )}

          {suggestion && (
            <div className="space-y-4 rounded border border-base-border bg-base-surface p-4">
              <p className="text-sm text-ink-muted">{suggestion.rationale}</p>
              {suggestion.suggested_sections.map((section, i) => (
                <div key={i} className="space-y-2">
                  <div className="font-display text-sm font-semibold text-ink">{section.title}</div>
                  {section.description && (
                    <p className="text-xs text-ink-muted">{section.description}</p>
                  )}
                  <ul className="space-y-1.5">
                    {section.fields.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs">
                        <Badge>{f.data_type}</Badge>
                        <span>
                          <span className="text-ink">{f.label}</span>{" "}
                          <span className="text-ink-faint">— {f.reason}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <Button size="sm" onClick={handleApply} disabled={isApplying}>
                Appliquer cette structure a l'evenement
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

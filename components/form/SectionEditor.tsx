import { useState } from "react";
import type { FieldSection } from "../../src/types/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface SectionEditorProps {
  initial: Omit<FieldSection, "id" | "event_id">;
  onSave: (input: Omit<FieldSection, "id" | "event_id">) => void;
  onCancel: () => void;
}

export function SectionEditor({ initial, onSave, onCancel }: SectionEditorProps) {
  const [draft, setDraft] = useState(initial);

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-xs text-ink-muted">Titre de la section</label>
        <Input value={draft.title} onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))} />
      </div>
      <div>
        <label className="mb-1 block text-xs text-ink-muted">Description (optionnelle)</label>
        <Textarea
          rows={2}
          value={draft.description ?? ""}
          onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))}
        />
      </div>
      <div className="flex justify-end gap-2 border-t border-base-border pt-4">
        <Button variant="ghost" type="button" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="button" onClick={() => onSave(draft)}>
          Enregistrer la section
        </Button>
      </div>
    </div>
  );
}

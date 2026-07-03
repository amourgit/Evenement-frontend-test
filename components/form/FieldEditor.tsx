import { useState } from "react";
import type { FieldDefinitionInput, FieldDataType, FieldOption } from "@/src/types/field";
import { FIELD_TYPE_LABELS } from "@/src/types/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface FieldEditorProps {
  initial: FieldDefinitionInput;
  sectionOptions: { id: string; title: string }[];
  onSave: (input: FieldDefinitionInput) => void;
  onCancel: () => void;
}

const TYPES_WITH_OPTIONS: FieldDataType[] = ["single_select", "multi_select"];
const TYPES_WITH_LENGTH: FieldDataType[] = ["short_text", "long_text"];
const TYPES_WITH_RANGE: FieldDataType[] = ["number", "decimal", "rating"];
const TYPES_WITH_FILE: FieldDataType[] = ["file", "image"];

/**
 * Formulaire d'edition d'un champ, exposant TOUS les attributs persistes en
 * base (type de donnees, longueur, is_null, unicite, regex, options...).
 * C'est ce composant qui garantit une personnalisation complete cote admin.
 */
export function FieldEditor({ initial, sectionOptions, onSave, onCancel }: FieldEditorProps) {
  const [draft, setDraft] = useState<FieldDefinitionInput>(initial);

  function set<K extends keyof FieldDefinitionInput>(key: K, value: FieldDefinitionInput[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function addOption() {
    const options = draft.options ?? [];
    const newOption: FieldOption = {
      id: crypto.randomUUID(),
      label: "",
      value: "",
    };
    set("options", [...options, newOption]);
  }

  function updateOption(id: string, patch: Partial<FieldOption>) {
    set("options", (draft.options ?? []).map((o) => (o.id === id ? { ...o, ...patch } : o)));
  }

  function removeOption(id: string) {
    set("options", (draft.options ?? []).filter((o) => o.id !== id));
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs text-ink-muted">Libelle affiche</label>
          <Input value={draft.label} onChange={(e) => set("label", e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-ink-muted">Cle technique (snake_case)</label>
          <Input
            value={draft.key}
            onChange={(e) => set("key", e.target.value.replace(/\s+/g, "_").toLowerCase())}
            className="font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs text-ink-muted">Type de donnee</label>
          <Select
            value={draft.data_type}
            onValueChange={(value) => set("data_type", value as FieldDataType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(FIELD_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-ink-muted">Section</label>
          <Select
            value={draft.section_id ?? ""}
            onValueChange={(value) => set("section_id", value || null)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Aucune section</SelectItem>
              {sectionOptions.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs text-ink-muted">Texte d'aide (optionnel)</label>
        <Textarea
          value={draft.help_text ?? ""}
          onChange={(e) => set("help_text", e.target.value)}
          rows={2}
        />
      </div>

      <div className="flex flex-wrap gap-4 rounded border border-base-border bg-base-surface px-4 py-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="is_required"
            checked={draft.is_required}
            onCheckedChange={(checked) => set("is_required", checked as boolean)}
          />
          <label htmlFor="is_required" className="text-xs">Obligatoire</label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="is_nullable"
            checked={draft.is_nullable}
            onCheckedChange={(checked) => set("is_nullable", checked as boolean)}
          />
          <label htmlFor="is_nullable" className="text-xs">Autorise une valeur vide (is_null)</label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="is_unique"
            checked={draft.is_unique}
            onCheckedChange={(checked) => set("is_unique", checked as boolean)}
          />
          <label htmlFor="is_unique" className="text-xs">Valeur unique par evenement</label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="is_readonly"
            checked={Boolean(draft.is_readonly)}
            onCheckedChange={(checked) => set("is_readonly", checked as boolean)}
          />
          <label htmlFor="is_readonly" className="text-xs">Lecture seule</label>
        </div>
      </div>

      {TYPES_WITH_LENGTH.includes(draft.data_type) && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-ink-muted">Longueur min. (caracteres)</label>
            <Input
              type="number"
              value={draft.min_length ?? ""}
              onChange={(e) => set("min_length", e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-ink-muted">Longueur max. (caracteres)</label>
            <Input
              type="number"
              value={draft.max_length ?? ""}
              onChange={(e) => set("max_length", e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>
      )}

      {TYPES_WITH_RANGE.includes(draft.data_type) && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-ink-muted">Valeur minimale</label>
            <Input
              type="number"
              value={draft.min_value ?? ""}
              onChange={(e) => set("min_value", e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-ink-muted">Valeur maximale</label>
            <Input
              type="number"
              value={draft.max_value ?? ""}
              onChange={(e) => set("max_value", e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>
      )}

      {TYPES_WITH_FILE.includes(draft.data_type) && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-ink-muted">Types MIME acceptes (separes par virgule)</label>
            <Input
              value={(draft.accepted_mime_types ?? []).join(",")}
              onChange={(e) =>
                set(
                  "accepted_mime_types",
                  e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                )
              }
              placeholder="image/png,image/jpeg,application/pdf"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-ink-muted">Taille max. (Mo)</label>
            <Input
              type="number"
              value={draft.max_file_size_mb ?? ""}
              onChange={(e) =>
                set("max_file_size_mb", e.target.value ? Number(e.target.value) : undefined)
              }
            />
          </div>
        </div>
      )}

      <div>
        <label className="mb-1 block text-xs text-ink-muted">
          Motif de validation regex (optionnel)
        </label>
        <Input
          className="font-mono"
          value={draft.regex_pattern ?? ""}
          onChange={(e) => set("regex_pattern", e.target.value)}
          placeholder="^[A-Z0-9]{6}$"
        />
        {draft.regex_pattern && (
          <Input
            className="mt-2"
            value={draft.regex_error_message ?? ""}
            onChange={(e) => set("regex_error_message", e.target.value)}
            placeholder="Message d'erreur affiche si le format est invalide"
          />
        )}
      </div>

      {TYPES_WITH_OPTIONS.includes(draft.data_type) && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs text-ink-muted">Options</label>
            <Button type="button" variant="ghost" size="sm" onClick={addOption}>
              + Ajouter une option
            </Button>
          </div>
          <div className="space-y-2">
            {(draft.options ?? []).map((opt) => (
              <div key={opt.id} className="flex gap-2">
                <Input
                  placeholder="Libelle"
                  value={opt.label}
                  onChange={(e) => updateOption(opt.id, { label: e.target.value })}
                />
                <Input
                  placeholder="Valeur"
                  className="font-mono"
                  value={opt.value}
                  onChange={(e) => updateOption(opt.id, { value: e.target.value })}
                />
                <Button type="button" variant="danger" size="sm" onClick={() => removeOption(opt.id)}>
                  ✕
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 border-t border-base-border pt-4">
        <Button variant="ghost" onClick={onCancel} type="button">
          Annuler
        </Button>
        <Button onClick={() => onSave(draft)} type="button">
          Enregistrer le champ
        </Button>
      </div>
    </div>
  );
}

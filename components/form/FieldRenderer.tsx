import type { FieldDefinition } from "../../src/types/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils/cn";

type AnswerValue = string | number | boolean | string[] | null;

interface FieldRendererProps {
  field: FieldDefinition;
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
  error?: string;
  onAskAssistant?: (field: FieldDefinition) => void;
}

/**
 * Rend le bon controle pour un champ selon sa `data_type`, en appliquant
 * ses attributs (min/max, options, requis...) tels que persistes en DB.
 * C'est le meme composant qui sert au formulaire public ET a l'apercu admin.
 */
export function FieldRenderer({ field, value, onChange, error, onAskAssistant }: FieldRendererProps) {
  const commonProps = {
    id: field.id,
    name: field.key,
    required: field.is_required,
    disabled: field.is_readonly,
    error,
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={field.id} className="block text-sm font-medium text-ink">
          {field.label}
          {field.is_required && <span className="ml-1 text-signal">*</span>}
        </label>
        {onAskAssistant && (
          <button
            type="button"
            onClick={() => onAskAssistant(field)}
            className="focus-ring rounded font-mono text-[10px] uppercase tracking-wide text-ink-faint hover:text-signal"
            title="Demander a l'assistant d'expliquer ce champ"
          >
            aide ?
          </button>
        )}
      </div>

      {field.help_text && <p className="text-xs text-ink-muted">{field.help_text}</p>}

      {renderControl(field, value, onChange, commonProps)}

      {error && <p className="text-xs text-state-closed">{error}</p>}
    </div>
  );
}

function renderControl(
  field: FieldDefinition,
  value: AnswerValue,
  onChange: (value: AnswerValue) => void,
  common: { id: string; name: string; required: boolean; disabled?: boolean; error?: string }
) {
  switch (field.data_type) {
    case "long_text":
      return (
        <Textarea
          {...common}
          placeholder={field.placeholder}
          maxLength={field.max_length}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "boolean":
      return (
        <div className="flex items-center gap-2">
          <Checkbox
            {...common}
            checked={Boolean(value)}
            onCheckedChange={(checked) => onChange(checked)}
          />
          <label htmlFor={field.id} className="text-sm">{field.placeholder ?? "Oui"}</label>
        </div>
      );

    case "single_select":
      return (
        <Select
          {...common}
          value={(value as string) ?? ""}
          onValueChange={(val) => onChange(val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selectionner..." />
          </SelectTrigger>
          <SelectContent>
            {(field.options ?? []).map((opt) => (
              <SelectItem key={opt.id} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "multi_select": {
      const selected = new Set(Array.isArray(value) ? value : []);
      return (
        <div className="flex flex-wrap gap-3 rounded border border-base-border bg-base-surface px-3 py-2.5">
          {(field.options ?? []).map((opt) => (
            <div key={opt.id} className="flex items-center gap-2">
              <Checkbox
                id={`${field.id}-${opt.id}`}
                checked={selected.has(opt.value)}
                onCheckedChange={(checked) => {
                  const next = new Set(selected);
                  checked ? next.add(opt.value) : next.delete(opt.value);
                  onChange(Array.from(next));
                }}
              />
              <label htmlFor={`${field.id}-${opt.id}`} className="text-sm">{opt.label}</label>
            </div>
          ))}
        </div>
      );
    }

    case "date":
      return (
        <Input
          {...common}
          type="date"
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "datetime":
      return (
        <Input
          {...common}
          type="datetime-local"
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "number":
      return (
        <Input
          {...common}
          type="number"
          step={1}
          min={field.min_value}
          max={field.max_value}
          value={(value as number) ?? ""}
          onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
        />
      );

    case "decimal":
      return (
        <Input
          {...common}
          type="number"
          step="any"
          min={field.min_value}
          max={field.max_value}
          value={(value as number) ?? ""}
          onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
        />
      );

    case "rating": {
      const max = field.max_value ?? 5;
      const current = Number(value ?? 0);
      return (
        <div className="flex gap-1" role="radiogroup" aria-label={field.label}>
          {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={current === n}
              onClick={() => onChange(n)}
              className={cn(
                "focus-ring h-8 w-8 rounded border font-mono text-xs transition-colors",
                current >= n
                  ? "border-signal bg-signal text-white"
                  : "border-base-border text-ink-faint hover:border-signal"
              )}
            >
              {n}
            </button>
          ))}
        </div>
      );
    }

    case "file":
    case "image":
      return (
        <input
          id={common.id}
          name={common.name}
          required={common.required}
          disabled={common.disabled}
          type="file"
          accept={field.accepted_mime_types?.join(",")}
          onChange={(e) => onChange(e.target.files?.[0]?.name ?? null)}
          className="w-full rounded border border-dashed border-base-border bg-base-surface px-3 py-2.5 text-xs text-ink-muted file:mr-3 file:rounded file:border-0 file:bg-signal/10 file:px-3 file:py-1.5 file:text-xs file:text-signal"
        />
      );

    case "email":
      return (
        <Input
          {...common}
          type="email"
          placeholder={field.placeholder}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "phone":
      return (
        <Input
          {...common}
          type="tel"
          placeholder={field.placeholder}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "url":
      return (
        <Input
          {...common}
          type="url"
          placeholder={field.placeholder}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "signature":
      return (
        <Input
          {...common}
          placeholder="Tapez votre nom complet en guise de signature"
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="italic"
        />
      );

    case "short_text":
    default:
      return (
        <Input
          {...common}
          type="text"
          maxLength={field.max_length}
          placeholder={field.placeholder}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}

import { useMemo, useState } from "react";
import type { EventRecord } from "@/src/types/event";
import type { SubmissionAnswers } from "@/src/types/submission";
import type { FieldDefinition } from "@/src/types/field";
import { FieldRenderer } from "./FieldRenderer";
import { Button } from "@/components/ui/button";
import { isFieldVisible, validateSubmission } from "@/lib/validation/fieldValidator";
import { submissionsApi } from "@/lib/api/submissions";

interface DynamicFormRendererProps {
  event: EventRecord;
  onSubmitted: (referenceCode: string) => void;
  onAskAssistant?: (field: FieldDefinition) => void;
}

/**
 * Assemble le formulaire complet d'un evenement a partir de ses sections et
 * champs persistes en DB. La validation cote client est un simple confort ;
 * la soumission finale est toujours revalidee et arbitree par le backend.
 */
export function DynamicFormRenderer({ event, onSubmitted, onAskAssistant }: DynamicFormRendererProps) {
  const [answers, setAnswers] = useState<SubmissionAnswers>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const orderedSections = useMemo(
    () => [...event.sections].sort((a, b) => a.display_order - b.display_order),
    [event.sections]
  );

  const fieldsBySection = useMemo(() => {
    const map = new Map<string | null, FieldDefinition[]>();
    for (const field of event.fields) {
      const list = map.get(field.section_id) ?? [];
      list.push(field);
      map.set(field.section_id, list);
    }
    for (const list of map.values()) list.sort((a, b) => a.display_order - b.display_order);
    return map;
  }, [event.fields]);

  function setAnswer(fieldId: string, value: SubmissionAnswers[string]) {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
    setErrors((prev) => {
      if (!prev[fieldId]) return prev;
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const validationErrors = validateSubmission(event.fields, answers);
    if (validationErrors.length > 0) {
      setErrors(Object.fromEntries(validationErrors.map((err) => [err.field_id, err.message])));
      document.getElementById(validationErrors[0].field_id)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submissionsApi.submit({ event_id: event.id, answers });
      if (result.success && result.submission) {
        onSubmitted(result.submission.reference_code);
      } else if (result.errors) {
        setErrors(Object.fromEntries(result.errors.map((err) => [err.field_id, err.message])));
      }
    } catch (err) {
      setFormError("Une erreur est survenue lors de l'envoi. Merci de reessayer.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10" noValidate>
      {orderedSections.map((section) => {
        const fields = (fieldsBySection.get(section.id) ?? []).filter((f) =>
          isFieldVisible(f, answers)
        );
        if (fields.length === 0) return null;

        return (
          <fieldset key={section.id} className="space-y-5">
            <legend className="mb-1 w-full border-b border-base-border pb-3">
              <span className="font-display text-base font-semibold text-ink">{section.title}</span>
              {section.description && (
                <p className="mt-1 text-sm text-ink-muted">{section.description}</p>
              )}
            </legend>
            {fields.map((field) => (
              <FieldRenderer
                key={field.id}
                field={field}
                value={answers[field.id] ?? field.default_value ?? null}
                onChange={(value) => setAnswer(field.id, value)}
                error={errors[field.id]}
                onAskAssistant={onAskAssistant}
              />
            ))}
          </fieldset>
        );
      })}

      {/* Champs sans section (rares, mais possibles) */}
      {(fieldsBySection.get(null) ?? [])
        .filter((f) => isFieldVisible(f, answers))
        .map((field) => (
          <FieldRenderer
            key={field.id}
            field={field}
            value={answers[field.id] ?? field.default_value ?? null}
            onChange={(value) => setAnswer(field.id, value)}
            error={errors[field.id]}
            onAskAssistant={onAskAssistant}
          />
        ))}

      {formError && (
        <p className="rounded border border-state-closed/40 bg-state-closed/5 px-4 py-3 text-sm text-state-closed">
          {formError}
        </p>
      )}

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Envoi en cours..." : "Confirmer mon inscription"}
      </Button>
    </form>
  );
}

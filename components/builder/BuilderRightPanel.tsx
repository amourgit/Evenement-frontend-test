import type { BuilderDoc } from "@/lib/utils/formConfig";
import type { Selection } from "./builderReducer";
import type { BuilderAction } from "./builderReducer";
import { FieldEditor } from "../form/FieldEditor";
import { SectionEditor } from "../form/SectionEditor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BuilderRightPanelProps {
  doc: BuilderDoc;
  selection: Selection;
  onSelect: (s: Selection) => void;
  dispatch: (action: BuilderAction) => void;
}

/**
 * Panneau des proprietes — reflete l'objet actuellement selectionne dans le
 * canevas ou le navigateur, dans l'esprit du panneau "Design" de Figma.
 */
export function BuilderRightPanel({ doc, selection, onSelect, dispatch }: BuilderRightPanelProps) {
  const selectedField =
    selection?.type === "field" ? doc.fields.find((f) => f.id === selection.id) ?? null : null;
  const selectedSection =
    selection?.type === "section" ? doc.sections.find((s) => s.id === selection.id) ?? null : null;

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-l border-base-border bg-base-raised">
      <div className="border-b border-base-border px-4 py-3">
        <h2 className="font-display text-sm font-semibold text-ink">
          {selectedField ? "Champ" : selectedSection ? "Section" : "Vue d'ensemble"}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {selectedField && (
          <div className="space-y-4">
            <FieldEditor
              initial={{
                section_id: selectedField.section_id,
                key: selectedField.key,
                label: selectedField.label,
                help_text: selectedField.help_text,
                placeholder: selectedField.placeholder,
                data_type: selectedField.data_type,
                is_required: selectedField.is_required,
                is_nullable: selectedField.is_nullable,
                is_unique: selectedField.is_unique,
                is_readonly: selectedField.is_readonly,
                min_length: selectedField.min_length,
                max_length: selectedField.max_length,
                min_value: selectedField.min_value,
                max_value: selectedField.max_value,
                regex_pattern: selectedField.regex_pattern,
                regex_error_message: selectedField.regex_error_message,
                default_value: selectedField.default_value,
                options: selectedField.options,
                accepted_mime_types: selectedField.accepted_mime_types,
                max_file_size_mb: selectedField.max_file_size_mb,
                display_order: selectedField.display_order,
                condition: selectedField.condition,
              }}
              sectionOptions={doc.sections.map((s) => ({ id: s.id, title: s.title }))}
              onSave={(input) => dispatch({ kind: "UPDATE_FIELD", id: selectedField.id, payload: input })}
              onCancel={() => onSelect(null)}
            />
            <div className="flex gap-2 border-t border-base-border pt-4">
              <Button
                size="sm"
                variant="ghost"
                className="flex-1"
                onClick={() => dispatch({ kind: "DUPLICATE_FIELD", id: selectedField.id })}
              >
                Dupliquer
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="flex-1 text-destructive"
                onClick={() => {
                  dispatch({ kind: "DELETE_FIELD", id: selectedField.id });
                  onSelect(null);
                }}
              >
                Supprimer
              </Button>
            </div>
          </div>
        )}

        {selectedSection && (
          <div className="space-y-4">
            <SectionEditor
              initial={{
                title: selectedSection.title,
                description: selectedSection.description,
                display_order: selectedSection.display_order,
                icon: selectedSection.icon,
              }}
              onSave={(input) =>
                dispatch({ kind: "UPDATE_SECTION", id: selectedSection.id, payload: input })
              }
              onCancel={() => onSelect(null)}
            />
            <Button
              size="sm"
              variant="ghost"
              className="w-full text-destructive"
              onClick={() => {
                dispatch({ kind: "DELETE_SECTION", id: selectedSection.id });
                onSelect(null);
              }}
            >
              Supprimer la section (les champs sont conserves)
            </Button>
          </div>
        )}

        {!selectedField && !selectedSection && (
          <div className="space-y-4">
            <p className="text-xs text-ink-muted">
              Selectionnez un objet dans le canevas ou le navigateur pour en modifier les
              proprietes.
            </p>
            <div className="space-y-2 rounded border border-base-border bg-base-surface p-3">
              <StatRow label="Sections" value={doc.sections.length} />
              <StatRow label="Champs" value={doc.fields.length} />
              <StatRow label="Obligatoires" value={doc.fields.filter((f) => f.is_required).length} />
              <StatRow label="Uniques" value={doc.fields.filter((f) => f.is_unique).length} />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from(new Set(doc.fields.map((f) => f.data_type))).map((type) => (
                <Badge key={type}>
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-ink-muted">{label}</span>
      <span className="font-mono text-ink">{value}</span>
    </div>
  );
}

import { useState } from "react";
import type { FieldDefinition, FieldSection } from "@/types/field";
import { FIELD_TYPE_LABELS } from "@/types/field";
import type { BuilderAction, Selection } from "./builderReducer";
import { cn } from "@/lib/utils/cn";

interface StructureTreeProps {
  sections: FieldSection[];
  fields: FieldDefinition[];
  selection: Selection;
  onSelect: (selection: Selection) => void;
  dispatch: (action: BuilderAction) => void;
}

/**
 * Navigateur d'objets, dans l'esprit du panneau "Layers" de Figma : liste
 * organisee de toutes les sections et de tous les champs, avec selection et
 * reorganisation par glisser-deposer.
 */
export function StructureTree({ sections, fields, selection, onSelect, dispatch }: StructureTreeProps) {
  const [draggedFieldId, setDraggedFieldId] = useState<string | null>(null);
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);
  const [dropHint, setDropHint] = useState<string | null>(null);

  const orderedSections = [...sections].sort((a, b) => a.display_order - b.display_order);
  const fieldsBySection = (sectionId: string | null) =>
    fields.filter((f) => f.section_id === sectionId).sort((a, b) => a.display_order - b.display_order);
  const orphanFields = fieldsBySection(null);

  function handleFieldDrop(targetSectionId: string | null, targetFieldId: string | null) {
    if (!draggedFieldId) return;
    const dragged = fields.find((f) => f.id === draggedFieldId);
    if (!dragged) return;

    if (dragged.section_id !== targetSectionId) {
      dispatch({ kind: "MOVE_FIELD_TO_SECTION", fieldId: draggedFieldId, sectionId: targetSectionId });
    }

    const siblings = fieldsBySection(targetSectionId).filter((f) => f.id !== draggedFieldId);
    const targetIndex = targetFieldId ? siblings.findIndex((f) => f.id === targetFieldId) : siblings.length;
    const ids = siblings.map((f) => f.id);
    ids.splice(targetIndex < 0 ? ids.length : targetIndex, 0, draggedFieldId);

    dispatch({ kind: "REORDER_FIELDS", sectionId: targetSectionId, orderedIds: ids });
    setDraggedFieldId(null);
    setDropHint(null);
  }

  function handleSectionDrop(targetSectionId: string) {
    if (!draggedSectionId || draggedSectionId === targetSectionId) return;
    const ids = orderedSections.map((s) => s.id).filter((id) => id !== draggedSectionId);
    const targetIndex = ids.indexOf(targetSectionId);
    ids.splice(targetIndex, 0, draggedSectionId);
    dispatch({ kind: "REORDER_SECTIONS", orderedIds: ids });
    setDraggedSectionId(null);
    setDropHint(null);
  }

  return (
    <div className="space-y-1">
      {orderedSections.map((section) => (
        <div key={section.id}>
          <div
            draggable
            onDragStart={() => setDraggedSectionId(section.id)}
            onDragOver={(e) => {
              e.preventDefault();
              setDropHint(`section:${section.id}`);
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (draggedSectionId) handleSectionDrop(section.id);
              else handleFieldDrop(section.id, null);
            }}
            onClick={() => onSelect({ type: "section", id: section.id })}
            className={cn(
              "focus-ring flex cursor-pointer items-center gap-1.5 rounded px-2 py-1.5 text-xs font-medium transition-colors",
              selection?.type === "section" && selection.id === section.id
                ? "bg-signal/15 text-signal"
                : "text-ink hover:bg-base-surface",
              dropHint === `section:${section.id}` && "ring-1 ring-signal/50"
            )}
          >
            <span className="text-ink-faint">▤</span>
            <span className="truncate">{section.title || "Section sans titre"}</span>
            <span className="ml-auto font-mono text-[10px] text-ink-faint">
              {fieldsBySection(section.id).length}
            </span>
          </div>

          <div className="ml-4 space-y-0.5 border-l border-base-border pl-2">
            {fieldsBySection(section.id).map((field) => (
              <FieldLeaf
                key={field.id}
                field={field}
                selected={selection?.type === "field" && selection.id === field.id}
                isDropTarget={dropHint === `field:${field.id}`}
                onSelect={() => onSelect({ type: "field", id: field.id })}
                onDragStart={() => setDraggedFieldId(field.id)}
                onDragOver={() => setDropHint(`field:${field.id}`)}
                onDrop={() => handleFieldDrop(section.id, field.id)}
              />
            ))}
            <DropZone onDrop={() => handleFieldDrop(section.id, null)} />
          </div>
        </div>
      ))}

      {orphanFields.length > 0 && (
        <div>
          <div className="px-2 py-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
            Sans section
          </div>
          <div className="ml-4 space-y-0.5 border-l border-base-border pl-2">
            {orphanFields.map((field) => (
              <FieldLeaf
                key={field.id}
                field={field}
                selected={selection?.type === "field" && selection.id === field.id}
                isDropTarget={dropHint === `field:${field.id}`}
                onSelect={() => onSelect({ type: "field", id: field.id })}
                onDragStart={() => setDraggedFieldId(field.id)}
                onDragOver={() => setDropHint(`field:${field.id}`)}
                onDrop={() => handleFieldDrop(null, field.id)}
              />
            ))}
          </div>
        </div>
      )}

      {sections.length === 0 && fields.length === 0 && (
        <p className="px-2 py-4 text-center text-xs text-ink-faint">
          Aucun objet. Ajoutez une section ou un champ ci-dessus.
        </p>
      )}
    </div>
  );
}

function FieldLeaf({
  field,
  selected,
  isDropTarget,
  onSelect,
  onDragStart,
  onDragOver,
  onDrop,
}: {
  field: FieldDefinition;
  selected: boolean;
  isDropTarget: boolean;
  onSelect: () => void;
  onDragStart: () => void;
  onDragOver: () => void;
  onDrop: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver();
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop();
      }}
      onClick={onSelect}
      className={cn(
        "focus-ring flex cursor-pointer items-center gap-1.5 rounded px-2 py-1 text-xs transition-colors",
        selected ? "bg-signal/15 text-signal" : "text-ink-muted hover:bg-base-surface hover:text-ink",
        isDropTarget && "ring-1 ring-signal/50"
      )}
    >
      <span className="text-ink-faint">⠿</span>
      <span className="truncate">{field.label || "Champ sans titre"}</span>
      {field.is_required && <span className="text-signal">*</span>}
      <span className="ml-auto shrink-0 font-mono text-[9px] uppercase text-ink-faint">
        {FIELD_TYPE_LABELS[field.data_type].slice(0, 3)}
      </span>
    </div>
  );
}

function DropZone({ onDrop }: { onDrop: () => void }) {
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onDrop();
      }}
      className="h-2"
    />
  );
}

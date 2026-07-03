import { useState } from "react";
import type { BuilderDoc } from "@/lib/utils/formConfig";
import type { BuilderAction, Selection } from "./builderReducer";
import { CanvasFieldBlock } from "./CanvasFieldBlock";
import { eventThemeStyle } from "@/lib/utils/theme";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

type Device = "desktop" | "mobile";

interface BuilderCanvasProps {
  doc: BuilderDoc;
  selection: Selection;
  onSelect: (s: Selection) => void;
  dispatch: (action: BuilderAction) => void;
  device: Device;
}

export function BuilderCanvas({ doc, selection, onSelect, dispatch, device }: BuilderCanvasProps) {
  const [draggedFieldId, setDraggedFieldId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  const orderedSections = [...doc.sections].sort((a, b) => a.display_order - b.display_order);
  const fieldsFor = (sectionId: string | null) =>
    doc.fields.filter((f) => f.section_id === sectionId).sort((a, b) => a.display_order - b.display_order);

  function reorderWithinSection(sectionId: string | null, targetFieldId: string | null) {
    if (!draggedFieldId) return;
    const siblings = fieldsFor(sectionId).filter((f) => f.id !== draggedFieldId);
    const idx = targetFieldId ? siblings.findIndex((f) => f.id === targetFieldId) : siblings.length;
    const ids = siblings.map((f) => f.id);
    ids.splice(idx < 0 ? ids.length : idx, 0, draggedFieldId);
    dispatch({ kind: "REORDER_FIELDS", sectionId, orderedIds: ids });
    setDraggedFieldId(null);
    setDropTargetId(null);
  }

  return (
    <div className="flex-1 overflow-y-auto bg-base ledger-grain" onClick={() => onSelect(null)}>
      <div className="flex justify-center px-8 py-10">
        <div
          data-event-theme="true"
          style={eventThemeStyle(doc.theme)}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "min-h-[70vh] w-full rounded border border-base-border bg-base shadow-2xl transition-all",
            device === "mobile" ? "max-w-[375px]" : "max-w-[640px]"
          )}
        >
          {doc.theme.cover_image_url && (
            <div
              className="h-32 w-full rounded-t bg-cover bg-center"
              style={{ backgroundImage: `url(${doc.theme.cover_image_url})` }}
            />
          )}

          <div className="space-y-8 p-6">
            <div className="space-y-2">
              <Badge>{doc.event.status}</Badge>
              <h1 className="font-display text-xl font-semibold text-ink">
                {doc.event.title || "Titre de l'evenement"}
              </h1>
              <p className="text-sm text-ink-muted">
                {doc.event.short_description || "Description courte de l'evenement..."}
              </p>
            </div>

            {orderedSections.length === 0 && doc.fields.length === 0 && (
              <div className="rounded border border-dashed border-base-border py-16 text-center text-sm text-ink-faint">
                Votre formulaire est vide.
                <br />
                Ajoutez une section et des champs depuis le panneau de gauche.
              </div>
            )}

            {orderedSections.map((section) => (
              <div key={section.id} className="space-y-3">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect({ type: "section", id: section.id });
                  }}
                  className={cn(
                    "cursor-pointer rounded border border-dashed px-2 py-1.5 transition-colors",
                    selection?.type === "section" && selection.id === section.id
                      ? "border-solid border-signal bg-signal/[0.04]"
                      : "border-transparent hover:border-base-border"
                  )}
                >
                  <div className="font-display text-base font-semibold text-ink">{section.title}</div>
                  {section.description && (
                    <p className="mt-0.5 text-sm text-ink-muted">{section.description}</p>
                  )}
                </div>

                <div className="space-y-2">
                  {fieldsFor(section.id).map((field) => (
                    <CanvasFieldBlock
                      key={field.id}
                      field={field}
                      selected={selection?.type === "field" && selection.id === field.id}
                      isDropTarget={dropTargetId === field.id}
                      onSelect={() => onSelect({ type: "field", id: field.id })}
                      onDuplicate={() => dispatch({ kind: "DUPLICATE_FIELD", id: field.id })}
                      onDelete={() => dispatch({ kind: "DELETE_FIELD", id: field.id })}
                      onDragStart={() => setDraggedFieldId(field.id)}
                      onDragOver={() => setDropTargetId(field.id)}
                      onDrop={() => reorderWithinSection(section.id, field.id)}
                    />
                  ))}
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      reorderWithinSection(section.id, null);
                    }}
                    className="h-3"
                  />
                </div>
              </div>
            ))}

            {fieldsFor(null).length > 0 && (
              <div className="space-y-2 border-t border-dashed border-base-border pt-4">
                {fieldsFor(null).map((field) => (
                  <CanvasFieldBlock
                    key={field.id}
                    field={field}
                    selected={selection?.type === "field" && selection.id === field.id}
                    isDropTarget={dropTargetId === field.id}
                    onSelect={() => onSelect({ type: "field", id: field.id })}
                    onDuplicate={() => dispatch({ kind: "DUPLICATE_FIELD", id: field.id })}
                    onDelete={() => dispatch({ kind: "DELETE_FIELD", id: field.id })}
                    onDragStart={() => setDraggedFieldId(field.id)}
                    onDragOver={() => setDropTargetId(field.id)}
                    onDrop={() => reorderWithinSection(null, field.id)}
                  />
                ))}
              </div>
            )}

            <button
              type="button"
              className="focus-ring w-full rounded px-4 py-2.5 text-center text-sm font-medium text-white opacity-90"
              style={{ backgroundColor: "var(--event-accent)", borderRadius: "var(--event-radius)" }}
              onClick={(e) => e.stopPropagation()}
            >
              Confirmer mon inscription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

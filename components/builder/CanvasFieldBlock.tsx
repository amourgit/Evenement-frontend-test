import type { FieldDefinition } from "@/types/field";
import { FieldRenderer } from "@/components/form/FieldRenderer";
import { cn } from "@/lib/utils/cn";

interface CanvasFieldBlockProps {
  field: FieldDefinition;
  selected: boolean;
  isDropTarget: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onDragStart: () => void;
  onDragOver: () => void;
  onDrop: () => void;
}

export function CanvasFieldBlock({
  field,
  selected,
  isDropTarget,
  onSelect,
  onDuplicate,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
}: CanvasFieldBlockProps) {
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
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={cn(
        "group relative rounded border border-dashed px-3 py-2.5 transition-colors",
        selected
          ? "border-solid border-signal bg-signal/[0.04]"
          : "border-transparent hover:border-base-border",
        isDropTarget && "border-solid border-signal/60"
      )}
    >
      <div
        className={cn(
          "absolute -top-3 right-2 z-10 hidden items-center gap-1 rounded border border-base-border bg-base-raised px-1 py-0.5 shadow-md group-hover:flex",
          selected && "flex"
        )}
      >
        <span className="cursor-grab px-1 font-mono text-[10px] text-ink-faint" title="Deplacer">
          ⠿
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          className="focus-ring px-1.5 py-0.5 font-mono text-[10px] text-ink-faint hover:text-signal"
          title="Dupliquer"
        >
          ⧉
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="focus-ring px-1.5 py-0.5 font-mono text-[10px] text-ink-faint hover:text-state-closed"
          title="Supprimer"
        >
          ✕
        </button>
      </div>

      <div className="pointer-events-none">
        <FieldRenderer field={field} value={null} onChange={() => {}} />
      </div>
    </div>
  );
}

import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

type Device = "desktop" | "mobile";

interface BuilderTopBarProps {
  title: string;
  status: string;
  isDirty: boolean;
  isSaving: boolean;
  canUndo: boolean;
  canRedo: boolean;
  device: Device;
  onDeviceChange: (device: Device) => void;
  onSave: () => void;
  onExport: () => void;
  onImportFile: (file: File) => void;
  onUndo: () => void;
  onRedo: () => void;
  previewUrl?: string;
}

export function BuilderTopBar({
  title,
  status,
  isDirty,
  isSaving,
  canUndo,
  canRedo,
  device,
  onDeviceChange,
  onSave,
  onExport,
  onImportFile,
  onUndo,
  onRedo,
  previewUrl,
}: BuilderTopBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-base-border bg-base-raised px-4">
      <div className="flex items-center gap-3">
        <Link
          to="/admin/events"
          className="focus-ring rounded px-2 py-1 text-ink-faint hover:text-ink"
          title="Retour aux evenements"
        >
          ←
        </Link>
        <div className="h-5 w-px bg-base-border" />
        <span className="max-w-[220px] truncate font-display text-sm font-semibold text-ink">
          {title || "Nouvel evenement"}
        </span>
        <Badge>
          {status}
        </Badge>
        <span className={cn("font-mono text-[10px] uppercase tracking-wider", isDirty ? "text-state-draft" : "text-ink-faint")}>
          {isDirty ? "Non enregistre" : "A jour"}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Annuler (Ctrl+Z)"
          className="focus-ring rounded px-2 py-1.5 text-xs text-ink-muted hover:bg-base-surface hover:text-ink disabled:opacity-30"
        >
          ↺
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Retablir (Ctrl+Maj+Z)"
          className="focus-ring rounded px-2 py-1.5 text-xs text-ink-muted hover:bg-base-surface hover:text-ink disabled:opacity-30"
        >
          ↻
        </button>

        <div className="mx-2 flex items-center rounded border border-base-border bg-base-surface p-0.5">
          <button
            onClick={() => onDeviceChange("desktop")}
            className={cn(
              "focus-ring rounded px-2 py-1 text-[10px] font-mono uppercase",
              device === "desktop" ? "bg-signal text-white" : "text-ink-faint"
            )}
          >
            Bureau
          </button>
          <button
            onClick={() => onDeviceChange("mobile")}
            className={cn(
              "focus-ring rounded px-2 py-1 text-[10px] font-mono uppercase",
              device === "mobile" ? "bg-signal text-white" : "text-ink-faint"
            )}
          >
            Mobile
          </button>
        </div>

        {previewUrl && (
          <a href={previewUrl} target="_blank" rel="noreferrer">
            <Button size="sm" variant="ghost">
              Apercu public ↗
            </Button>
          </a>
        )}

        <Button size="sm" variant="ghost" onClick={onExport}>
          Exporter JSON
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImportFile(file);
            e.target.value = "";
          }}
        />
        <Button size="sm" variant="ghost" onClick={() => fileInputRef.current?.click()}>
          Importer JSON
        </Button>

        <Button size="sm" onClick={onSave} disabled={isSaving}>
          Enregistrer
        </Button>
      </div>
    </header>
  );
}

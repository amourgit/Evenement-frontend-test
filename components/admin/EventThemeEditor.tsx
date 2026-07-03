import type { EventTheme } from "@/src/types/event";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { eventThemeStyle } from "@/lib/utils/theme";

interface EventThemeEditorProps {
  theme: EventTheme;
  onChange: (theme: EventTheme) => void;
}

/**
 * Permet de personnaliser completement l'identite visuelle d'un evenement :
 * couleur d'accent, forme des coins, mise en page, police, images. Chaque
 * evenement peut ainsi avoir un design radicalement different d'un autre.
 */
export function EventThemeEditor({ theme, onChange }: EventThemeEditorProps) {
  function set<K extends keyof EventTheme>(key: K, value: EventTheme[K]) {
    onChange({ ...theme, [key]: value });
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-xs text-ink-muted">Couleur d'accent</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={theme.accent_color}
              onChange={(e) => set("accent_color", e.target.value)}
              className="h-9 w-12 cursor-pointer rounded border border-base-border bg-transparent"
            />
            <Input
              className="font-mono"
              value={theme.accent_color}
              onChange={(e) => set("accent_color", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-ink-muted">Forme des coins</label>
          <Select value={theme.radius} onValueChange={(value) => set("radius", value as EventTheme["radius"])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sharp">Nette (0px)</SelectItem>
              <SelectItem value="soft">Douce (6px)</SelectItem>
              <SelectItem value="round">Arrondie (16px)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-1 block text-xs text-ink-muted">Mise en page</label>
          <Select value={theme.layout} onValueChange={(value) => set("layout", value as EventTheme["layout"])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="centered">Colonne centree</SelectItem>
              <SelectItem value="split">Deux colonnes (image + formulaire)</SelectItem>
              <SelectItem value="fullbleed">Image plein cadre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-1 block text-xs text-ink-muted">Police d'affichage</label>
          <Select
            value={theme.display_font ?? "space_grotesk"}
            onValueChange={(value) => set("display_font", value as EventTheme["display_font"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="space_grotesk">Space Grotesk — technique / structure</SelectItem>
              <SelectItem value="playfair">Playfair Display — elegant / ceremonie</SelectItem>
              <SelectItem value="sora">Sora — moderne / neutre</SelectItem>
              <SelectItem value="inter">Inter — sobre / institutionnel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-1 block text-xs text-ink-muted">Image de couverture (URL)</label>
          <Input
            value={theme.cover_image_url ?? ""}
            onChange={(e) => set("cover_image_url", e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-ink-muted">Logo (URL)</label>
          <Input
            value={theme.logo_url ?? ""}
            onChange={(e) => set("logo_url", e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs text-ink-muted">Apercu</label>
        <div
          data-event-theme="true"
          style={eventThemeStyle(theme)}
          className="overflow-hidden rounded border border-base-border bg-base"
        >
          {theme.cover_image_url && (
            <div
              className="h-24 w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${theme.cover_image_url})` }}
            />
          )}
          <div className="space-y-3 p-4">
            <span
              className="inline-block rounded px-2 py-1 text-xs font-semibold text-white"
              style={{ backgroundColor: "var(--event-accent)", borderRadius: "var(--event-radius)" }}
            >
              Bouton d'action
            </span>
            <div
              className="rounded border border-base-border p-3"
              style={{ borderRadius: "var(--event-radius)" }}
            >
              <div className="mb-1 text-xs text-ink-muted">Nom complet *</div>
              <div className="h-8 rounded bg-base-surface" style={{ borderRadius: "var(--event-radius)" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

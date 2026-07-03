import type { CSSProperties } from "react";
import type { EventTheme } from "@/types/event";

const RADIUS_MAP: Record<EventTheme["radius"], string> = {
  sharp: "0px",
  soft: "6px",
  round: "16px",
};

const FONT_MAP: Record<NonNullable<EventTheme["display_font"]>, string> = {
  space_grotesk: "'Space Grotesk', sans-serif",
  playfair: "'Playfair Display', serif",
  sora: "'Sora', sans-serif",
  inter: "'Inter', sans-serif",
};

/**
 * Applique le theme d'un evenement sur un element DOM (generalement le
 * conteneur racine de la page publique) via des variables CSS scoped.
 * Chaque evenement reste ainsi visuellement distinct sans dupliquer de CSS.
 */
export function applyEventTheme(el: HTMLElement, theme: EventTheme) {
  el.dataset.eventTheme = "true";
  el.style.setProperty("--event-accent", theme.accent_color);
  el.style.setProperty("--event-accent-soft", theme.accent_soft_color ?? theme.accent_color);
  el.style.setProperty("--event-radius", RADIUS_MAP[theme.radius]);
  if (theme.display_font) {
    el.style.setProperty("--event-font-display", FONT_MAP[theme.display_font]);
  }
}

/** Variante React : produit un objet style pret a poser sur un conteneur */
export function eventThemeStyle(theme: EventTheme): CSSProperties {
  return {
    ["--event-accent" as string]: theme.accent_color,
    ["--event-accent-soft" as string]: theme.accent_soft_color ?? theme.accent_color,
    ["--event-radius" as string]: RADIUS_MAP[theme.radius],
    ["--event-font-display" as string]: theme.display_font
      ? FONT_MAP[theme.display_font]
      : undefined,
  } as CSSProperties;
}

import type { ReactNode } from "react";
import type { EventTheme } from "../../src/types/event";
import { eventThemeStyle } from "@/lib/utils/theme";

interface PublicLayoutProps {
  children: ReactNode;
  theme?: EventTheme;
  coverImageUrl?: string;
  logoUrl?: string;
  onGoToAdmin?: () => void;
}

/**
 * Coquille des pages publiques (inscription, confirmation). Le style est
 * pilote par le theme de l'evenement, permettant a chaque evenement d'avoir
 * une identite visuelle distincte sans dupliquer de mise en page.
 */
export function PublicLayout({ children, theme, coverImageUrl, logoUrl, onGoToAdmin }: PublicLayoutProps) {
  const layout = theme?.layout ?? "centered";

  return (
    <div
      data-event-theme={theme ? "true" : undefined}
      style={theme ? eventThemeStyle(theme) : undefined}
      className="min-h-screen bg-base text-ink"
    >
      {coverImageUrl && layout !== "centered" && (
        <div
          className="h-56 w-full bg-cover bg-center sm:h-72"
          style={{ backgroundImage: `url(${coverImageUrl})` }}
        />
      )}

      <header className="border-b border-base-border">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-5 py-4">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt="" className="h-8 w-8 rounded object-cover" />
            ) : (
              <span
                className="flex h-8 w-8 items-center justify-center rounded font-mono text-xs font-semibold"
                style={{ backgroundColor: "var(--color-accent)", color: "#0B0D10" }}
              >
                C
              </span>
            )}
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">
              CIVITAS Forms
            </span>
          </div>
          {onGoToAdmin && (
            <button
              onClick={onGoToAdmin}
              className="text-xs text-ink-faint hover:text-ink underline-offset-2 hover:underline"
            >
              Admin
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-10 sm:py-14">{children}</main>

      <footer className="mx-auto max-w-2xl px-5 py-8 text-center text-xs text-ink-faint">
        Enregistrement securise · vos donnees ne servent qu'a cet evenement.
      </footer>
    </div>
  );
}

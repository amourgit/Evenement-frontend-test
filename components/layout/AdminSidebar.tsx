import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/context/AuthContext";

interface AdminSidebarProps {
  activeTab?: 'dashboard' | 'events' | 'editor';
  setActiveTab?: (tab: 'dashboard' | 'events' | 'editor') => void;
  onLogout?: () => void;
  onGoToPublic?: () => void;
}

const NAV_ITEMS = [
  { id: 'dashboard' as const, label: "Tableau de bord" },
  { id: 'events' as const, label: "Evenements" },
];

export function AdminSidebar({ activeTab, setActiveTab, onLogout, onGoToPublic }: AdminSidebarProps) {
  const { user } = useAuth();

  return (
    <aside className="flex h-full w-60 flex-col border-r border-base-border bg-base-raised">
      <div className="border-b border-base-border px-5 py-4">
        <span className="font-display text-sm font-semibold tracking-tight">CIVITAS Forms</span>
        <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
          Backoffice
        </div>
      </div>

      <nav className="flex-1 px-2 py-4">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab?.(item.id)}
            className={cn(
              "block w-full rounded px-3 py-2 text-sm transition-colors focus-ring text-left",
              activeTab === item.id
                ? "bg-signal/10 text-signal"
                : "text-ink-muted hover:bg-base-surface hover:text-ink"
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="border-t border-base-border px-4 py-4 space-y-2">
        <div className="truncate text-xs text-ink-muted">{user?.email}</div>
        <button
          onClick={onGoToPublic}
          className="focus-ring block w-full text-xs text-ink-faint underline-offset-2 hover:text-ink hover:underline text-left"
        >
          Retour a l'espace public
        </button>
        <button
          onClick={onLogout}
          className="focus-ring block w-full text-xs text-ink-faint underline-offset-2 hover:text-ink hover:underline text-left"
        >
          Se deconnecter
        </button>
      </div>
    </aside>
  );
}

// ============================================================
// components/dev/MockModeBanner.tsx
// Bandeau discret rappelant que le backoffice tourne en mode
// donnees fictives (voir lib/api/config.ts / lib/mock/*).
// ============================================================

import { USE_MOCK_API } from "@/lib/api/config";

export function MockModeBanner() {
  if (!USE_MOCK_API) return null;

  return (
    <div className="flex items-center justify-center gap-2 border-b border-signal/30 bg-signal/10 px-4 py-1.5 text-center font-mono text-[10px] uppercase tracking-wider text-signal">
      Mode demonstration — donnees fictives, aucun backend reel connecte
    </div>
  );
}

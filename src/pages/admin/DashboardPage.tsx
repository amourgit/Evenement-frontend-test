import { useEffect, useState } from "react";
import type { EventSummary } from "@/src/types/event";
import { eventsApi } from "@/lib/api/events";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardPageProps {
  onNavigateToBuilder: (eventId: string) => void;
  onCreateNew: () => void;
}

export function DashboardPage({ onNavigateToBuilder, onCreateNew }: DashboardPageProps) {
  const [events, setEvents] = useState<EventSummary[] | null>(null);

  useEffect(() => {
    eventsApi.listMine().then(setEvents).catch(() => setEvents([]));
  }, []);

  const openCount = events?.filter((e) => e.status === "open").length ?? 0;
  const totalSubmissions = events?.reduce((sum, e) => sum + e.submissions_count, 0) ?? 0;

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold">Tableau de bord</h1>
          <p className="mt-1 text-sm text-ink-muted">Vue d'ensemble de vos dossiers d'evenements.</p>
        </div>
        <Button onClick={onCreateNew}>+ Nouvel evenement</Button>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-4">
        <StatCard label="Evenements" value={events?.length ?? "—"} />
        <StatCard label="Ouverts" value={openCount} tone="open" />
        <StatCard label="Inscriptions totales" value={totalSubmissions} />
      </div>

      <h2 className="mb-3 font-mono text-[11px] uppercase tracking-wider text-ink-faint">
        Dossiers recents
      </h2>

      {events === null ? (
        <Skeleton className="h-8 w-full" />
      ) : events.length === 0 ? (
        <Card>
          <CardContent className="text-center text-sm text-ink-muted">
            Aucun evenement pour le moment. Creez-en un pour commencer a recevoir des inscriptions.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {events.map((event) => (
            <button
              key={event.id}
              onClick={() => onNavigateToBuilder(event.id)}
              className="w-full text-left"
            >
              <Card className="transition-colors hover:border-signal/40">
                <CardContent className="flex items-center justify-between">
                  <div>
                    <div className="font-display text-sm font-semibold">{event.title}</div>
                    <p className="mt-0.5 text-xs text-ink-muted">{event.short_description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-ink-faint">
                      {event.submissions_count} inscrit(s)
                    </span>
                    <Badge>
                      {event.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone?: "open";
}) {
  return (
    <Card>
      <CardContent>
        <div className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">{label}</div>
        <div className={`mt-1 font-display text-2xl font-semibold ${tone === "open" ? "text-state-open" : "text-ink"}`}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

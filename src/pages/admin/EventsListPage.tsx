import { useEffect, useState } from "react";
import type { EventSummary } from "@/src/types/event";
import { eventsApi } from "@/lib/api/events";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

interface EventsListPageProps {
  onEditForm: (eventId: string) => void;
  onCreateNew: () => void;
}

export function EventsListPage({ onEditForm, onCreateNew }: EventsListPageProps) {
  const [events, setEvents] = useState<EventSummary[] | null>(null);
  const { toast } = useToast();

  function reload() {
    eventsApi.listMine().then(setEvents).catch(() => setEvents([]));
  }

  useEffect(reload, []);

  async function handleDuplicate(id: string) {
    const copy = await eventsApi.duplicate(id);
    toast({ title: "Evenement duplique." });
    onEditForm(copy.id);
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer definitivement cet evenement et ses inscriptions ?")) return;
    await eventsApi.remove(id);
    toast({ title: "Evenement supprime." });
    reload();
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-xl font-semibold">Evenements</h1>
        <Button onClick={onCreateNew}>+ Nouvel evenement</Button>
      </div>

      {events === null ? (
        <Skeleton className="h-8 w-full" />
      ) : (
        <div className="space-y-2">
          {events.map((event) => (
            <Card key={event.id}>
              <CardContent className="flex items-center justify-between">
                <button
                  onClick={() => onEditForm(event.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="font-display text-sm font-semibold">{event.title}</div>
                  <p className="mt-0.5 truncate text-xs text-ink-muted">{event.short_description}</p>
                </button>
                <div className="flex items-center gap-2">
                  <Badge>
                    {event.status}
                  </Badge>
                  <Button size="sm" variant="ghost" onClick={() => handleDuplicate(event.id)}>
                    Dupliquer
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(event.id)}>
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

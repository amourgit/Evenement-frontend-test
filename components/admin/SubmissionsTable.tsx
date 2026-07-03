import { useEffect, useState } from "react";
import type { EventRecord } from "@/src/types/event";
import type { SubmissionRecord } from "@/src/types/submission";
import { submissionsApi } from "@/lib/api/submissions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface SubmissionsTableProps {
  event: EventRecord;
}

/** Table des inscriptions — colonnes generees dynamiquement a partir des FieldDefinition de l'evenement */
export function SubmissionsTable({ event }: SubmissionsTableProps) {
  const [items, setItems] = useState<SubmissionRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const visibleFields = [...event.fields]
    .sort((a, b) => a.display_order - b.display_order)
    .slice(0, 6); // colonnes principales ; le detail complet reste accessible via export CSV

  useEffect(() => {
    setIsLoading(true);
    submissionsApi
      .listForEvent(event.id, { page, search })
      .then((res) => {
        setItems(res.items);
        setTotal(res.total);
      })
      .finally(() => setIsLoading(false));
  }, [event.id, page, search]);

  async function handleExport() {
    const url = await submissionsApi.exportCsvUrl(event.id);
    window.open(url, "_blank");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Input
          placeholder="Rechercher une inscription..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-xs"
        />
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-ink-faint">{total} inscription(s)</span>
          <Button size="sm" variant="ghost" onClick={handleExport}>
            Exporter en CSV
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded border border-base-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-base-surface font-mono text-[10px] uppercase tracking-wider text-ink-faint">
            <tr>
              <th className="px-3 py-2">Reference</th>
              {visibleFields.map((f) => (
                <th key={f.id} className="px-3 py-2">
                  {f.label}
                </th>
              ))}
              <th className="px-3 py-2">Recu le</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={visibleFields.length + 2} className="px-3 py-8 text-center">
                  <Skeleton className="mx-auto h-4 w-4" />
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleFields.length + 2}
                  className="px-3 py-8 text-center text-xs text-ink-faint"
                >
                  Aucune inscription pour le moment.
                </td>
              </tr>
            ) : (
              items.map((submission) => (
                <tr key={submission.id} className="border-t border-base-border hover:bg-base-surface">
                  <td className="px-3 py-2 font-mono text-xs text-signal">
                    {submission.reference_code}
                  </td>
                  {visibleFields.map((f) => (
                    <td key={f.id} className="px-3 py-2 text-ink-muted">
                      {formatAnswer(submission.answers[f.id])}
                    </td>
                  ))}
                  <td className="px-3 py-2 text-xs text-ink-faint">
                    {new Date(submission.submitted_at).toLocaleString("fr-FR")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {total > 25 && (
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Precedent
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={page * 25 >= total}
            onClick={() => setPage((p) => p + 1)}
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
}

function formatAnswer(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "Oui" : "Non";
  return String(value);
}

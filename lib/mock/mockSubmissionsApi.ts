import { ApiError } from "@/lib/api/client";
import type { SubmissionInput, SubmissionResult, SubmissionRecord } from "@/types/submission";
import { validateSubmission } from "@/lib/validation/fieldValidator";
import { getDb, saveDb, mockDelay, newId } from "./mockDb";
import { getCurrentMockAdmin } from "./mockAuthApi";
import { deepClone } from "./mockUtils";

function nextReferenceCode(eventId: string, slug: string): string {
  const db = getDb();
  const count = db.submissions.filter((s) => s.event_id === eventId).length + 1;
  const prefix = slug.slice(0, 3).toUpperCase() || "EVT";
  return `${prefix}-${String(count).padStart(6, "0")}`;
}

export const mockSubmissionsApi = {
  async submit(input: SubmissionInput): Promise<SubmissionResult> {
    await mockDelay(400);
    const db = getDb();
    const event = db.events.find((e) => e.id === input.event_id);
    if (!event) throw new ApiError("Evenement introuvable.", 404);
    if (event.status !== "open") {
      return { success: false, errors: [{ field_id: "", message: "Les inscriptions sont fermees." }] };
    }

    const validationErrors = validateSubmission(event.fields, input.answers);

    // Unicite : verifie les champs `is_unique` contre les soumissions existantes
    const existing = db.submissions.filter((s) => s.event_id === event.id);
    for (const field of event.fields) {
      if (!field.is_unique) continue;
      const value = input.answers[field.id];
      if (value === undefined || value === null || value === "") continue;
      const clash = existing.some((s) => s.answers[field.id] === value);
      if (clash) {
        validationErrors.push({
          field_id: field.id,
          message: `« ${field.label} » : cette valeur est deja utilisee.`,
        });
      }
    }

    if (validationErrors.length > 0) {
      return { success: false, errors: validationErrors };
    }

    const submission: SubmissionRecord = {
      id: newId("sub"),
      event_id: event.id,
      reference_code: nextReferenceCode(event.id, event.slug),
      answers: input.answers,
      submitted_at: new Date().toISOString(),
      status: "confirmed",
    };
    db.submissions.push(submission);
    saveDb(db);
    return { success: true, submission: deepClone(submission) };
  },

  async getConfirmation(eventId: string, referenceCode: string): Promise<SubmissionRecord> {
    await mockDelay();
    const submission = getDb().submissions.find(
      (s) => s.event_id === eventId && s.reference_code === referenceCode
    );
    if (!submission) throw new ApiError("Inscription introuvable.", 404);
    return deepClone(submission);
  },

  async listForEvent(
    eventId: string,
    params?: { page?: number; pageSize?: number; search?: string }
  ): Promise<{ items: SubmissionRecord[]; total: number }> {
    await mockDelay();
    getCurrentMockAdmin();
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 25;
    const search = params?.search?.trim().toLowerCase();

    let items = getDb().submissions.filter((s) => s.event_id === eventId);
    if (search) {
      items = items.filter((s) => {
        const haystack = [s.reference_code, ...Object.values(s.answers).map(String)]
          .join(" ")
          .toLowerCase();
        return haystack.includes(search);
      });
    }
    items = [...items].sort(
      (a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
    );

    const total = items.length;
    const start = (page - 1) * pageSize;
    return { items: deepClone(items.slice(start, start + pageSize)), total };
  },

  async exportCsvUrl(eventId: string): Promise<string> {
    await mockDelay();
    const db = getDb();
    const event = db.events.find((e) => e.id === eventId);
    if (!event) throw new ApiError("Evenement introuvable.", 404);
    const submissions = db.submissions.filter((s) => s.event_id === eventId);

    const fields = [...event.fields].sort((a, b) => a.display_order - b.display_order);
    const headers = ["reference_code", "submitted_at", ...fields.map((f) => f.key)];
    const rows = submissions.map((s) => [
      s.reference_code,
      s.submitted_at,
      ...fields.map((f) => {
        const v = s.answers[f.id];
        if (v === null || v === undefined) return "";
        return Array.isArray(v) ? v.join("|") : String(v);
      }),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    return URL.createObjectURL(blob);
  },

  async remove(eventId: string, submissionId: string): Promise<void> {
    await mockDelay();
    getCurrentMockAdmin();
    const db = getDb();
    db.submissions = db.submissions.filter(
      (s) => !(s.event_id === eventId && s.id === submissionId)
    );
    saveDb(db);
  },
};

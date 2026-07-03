import { api } from "./client";
import type { SubmissionInput, SubmissionResult, SubmissionRecord } from "@/src/types/submission";
import { USE_MOCK_API } from "./config";
import { mockSubmissionsApi } from "@/lib/mock/mockSubmissionsApi";

const realSubmissionsApi = {
  /**
   * Public — soumet une inscription. Le backend est seul responsable de
   * revalider chaque reponse contre les FieldDefinition persistees
   * (type, longueur, unicite, obligatoire, regex, etc.) avant ecriture.
   */
  async submit(input: SubmissionInput): Promise<SubmissionResult> {
    return api.post<SubmissionResult>(`/events/${input.event_id}/submissions`, input);
  },

  async getConfirmation(eventId: string, referenceCode: string): Promise<SubmissionRecord> {
    return api.get<SubmissionRecord>(
      `/events/${eventId}/submissions/${encodeURIComponent(referenceCode)}`
    );
  },

  /** Backoffice — liste paginee des inscriptions d'un evenement */
  async listForEvent(
    eventId: string,
    params?: { page?: number; pageSize?: number; search?: string }
  ): Promise<{ items: SubmissionRecord[]; total: number }> {
    return api.get<{ items: SubmissionRecord[]; total: number }>(
      `/admin/events/${eventId}/submissions`,
      {
        auth: true,
        query: {
          page: params?.page ?? 1,
          pageSize: params?.pageSize ?? 25,
          search: params?.search,
        },
      }
    );
  },

  async exportCsvUrl(eventId: string): Promise<string> {
    const res = await api.get<{ url: string }>(
      `/admin/events/${eventId}/submissions/export`,
      { auth: true }
    );
    return res.url;
  },

  async remove(eventId: string, submissionId: string): Promise<void> {
    return api.delete<void>(`/admin/events/${eventId}/submissions/${submissionId}`, {
      auth: true,
    });
  },
};

/** Helper pour compatibilite avec EventRegistrationPage */
export async function createSubmission(eventId: string, answers: Record<string, any>): Promise<{ id: string }> {
  const result = await submissionsApi.submit({ event_id: eventId, answers });
  return { id: result.submission?.reference_code || result.submission?.id || '' };
}

/** Voir src/mock/mockSubmissionsApi.ts : donnees fictives tant que USE_MOCK_API est actif */
export const submissionsApi: typeof realSubmissionsApi = USE_MOCK_API
  ? mockSubmissionsApi
  : realSubmissionsApi;

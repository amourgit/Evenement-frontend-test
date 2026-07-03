import { api } from "./client";
import type {
  AIPromptSource,
  AISchemaSuggestion,
  AISchemaSuggestionRequest,
  AIChatRequest,
  AIChatResponse,
} from "@/types/ai";
import { USE_MOCK_API } from "./config";
import { mockAiApi } from "@/mock/mockAiApi";

const realAiApi = {
  /** Backoffice — televerse un texte ou fichier de prompt pour nourrir l'IA d'un evenement */
  async uploadPromptSource(
    eventId: string,
    input: { label: string } & (
      | { kind: "text"; content: string }
      | { kind: "file"; file: File }
    )
  ): Promise<AIPromptSource> {
    if (input.kind === "file") {
      const form = new FormData();
      form.append("label", input.label);
      form.append("kind", "file");
      form.append("file", input.file);
      return api.post<AIPromptSource>(`/admin/events/${eventId}/ai/sources`, form, {
        auth: true,
        isFormData: true,
      });
    }
    return api.post<AIPromptSource>(
      `/admin/events/${eventId}/ai/sources`,
      { label: input.label, kind: "text", content: input.content },
      { auth: true }
    );
  },

  async listPromptSources(eventId: string): Promise<AIPromptSource[]> {
    return api.get<AIPromptSource[]>(`/admin/events/${eventId}/ai/sources`, { auth: true });
  },

  async removePromptSource(eventId: string, sourceId: string): Promise<void> {
    return api.delete<void>(`/admin/events/${eventId}/ai/sources/${sourceId}`, { auth: true });
  },

  /** Backoffice — demande a l'IA de generer description/analyse a partir des sources televersees */
  async generateEventCopy(eventId: string): Promise<{ short_description: string; long_description: string }> {
    return api.post(`/admin/events/${eventId}/ai/generate-copy`, undefined, { auth: true });
  },

  /** Backoffice — demande a l'IA une structure de champs/sections optimisee */
  async suggestSchema(input: AISchemaSuggestionRequest): Promise<AISchemaSuggestion> {
    return api.post<AISchemaSuggestion>(
      `/admin/events/${input.event_id}/ai/suggest-schema`,
      input,
      { auth: true }
    );
  },

  /** Backoffice — applique une suggestion acceptee comme sections/champs reels */
  async applySchemaSuggestion(eventId: string, suggestionId: string): Promise<void> {
    return api.post<void>(
      `/admin/events/${eventId}/ai/suggestions/${suggestionId}/apply`,
      undefined,
      { auth: true }
    );
  },

  /**
   * Public — chat conversationnel avec l'assistant vocal/textuel de l'evenement.
   * Utilise par VoiceAssistant pour discuter des champs, du deroule, etc.
   */
  async chat(input: AIChatRequest): Promise<AIChatResponse> {
    return api.post<AIChatResponse>(`/events/${input.event_id}/ai/chat`, input);
  },
};

/** Voir src/mock/mockAiApi.ts : reponses fictives (regles simples) tant que USE_MOCK_API est actif */
export const aiApi: typeof realAiApi = USE_MOCK_API ? mockAiApi : realAiApi;

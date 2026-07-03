import { ApiError } from "@/lib/api/client";
import type {
  AIPromptSource,
  AISchemaSuggestion,
  AISchemaSuggestionRequest,
  AIChatRequest,
  AIChatResponse,
  AIChatMessage,
} from "@/types/ai";
import type { FieldDataType } from "@/types/field";
import { getDb, saveDb, mockDelay, newId } from "./mockDb";
import { deepClone } from "./mockUtils";

/**
 * Implementation FICTIVE de l'assistant IA : reponses generees par des
 * regles simples a partir des donnees locales (pas d'appel a un vrai
 * modele de langage). Suffisant pour tester bout-en-bout l'UI de l'IA
 * (upload de prompts, generation de copy, suggestion de structure, chat)
 * sans dependance reseau.
 */

const pendingSuggestions = new Map<string, AISchemaSuggestion>();

function requireEvent(eventId: string) {
  const event = getDb().events.find((e) => e.id === eventId);
  if (!event) throw new ApiError("Evenement introuvable.", 404);
  return event;
}

export const mockAiApi = {
  async uploadPromptSource(
    eventId: string,
    input: { label: string } & (
      | { kind: "text"; content: string }
      | { kind: "file"; file: File }
    )
  ): Promise<AIPromptSource> {
    await mockDelay(400);
    requireEvent(eventId);
    const db = getDb();
    const source: AIPromptSource = {
      id: newId("src"),
      event_id: eventId,
      label: input.label,
      kind: input.kind,
      content: input.kind === "text" ? input.content : `[Fichier fictif] ${input.file.name}`,
      file_name: input.kind === "file" ? input.file.name : undefined,
      created_at: new Date().toISOString(),
    };
    db.ai_prompt_sources.push(source);
    saveDb(db);
    return deepClone(source);
  },

  async listPromptSources(eventId: string): Promise<AIPromptSource[]> {
    await mockDelay(150);
    return deepClone(getDb().ai_prompt_sources.filter((s) => s.event_id === eventId));
  },

  async removePromptSource(eventId: string, sourceId: string): Promise<void> {
    await mockDelay();
    const db = getDb();
    db.ai_prompt_sources = db.ai_prompt_sources.filter(
      (s) => !(s.event_id === eventId && s.id === sourceId)
    );
    saveDb(db);
  },

  async generateEventCopy(
    eventId: string
  ): Promise<{ short_description: string; long_description: string }> {
    await mockDelay(900);
    const event = requireEvent(eventId);
    const sources = getDb().ai_prompt_sources.filter((s) => s.event_id === eventId);
    const context = sources.map((s) => s.content).join(" ") || event.short_description;

    return {
      short_description: `${event.title} — inscriptions ${
        event.status === "open" ? "ouvertes" : "bientot ouvertes"
      }. ${context.slice(0, 90)}...`,
      long_description:
        `${event.title} vous accueille avec un programme pense pour l'occasion. ` +
        `D'apres les elements fournis par l'organisation : ${context.slice(0, 280)}` +
        (context.length > 280 ? "..." : "") +
        `\n\n(Texte genere automatiquement — a relire avant publication.)`,
    };
  },

  async suggestSchema(input: AISchemaSuggestionRequest): Promise<AISchemaSuggestion> {
    await mockDelay(1100);
    const event = requireEvent(input.event_id);
    const wantsAllergy = /allerg/i.test(input.prompt);
    const wantsTicketing = /billet|ticket/i.test(input.prompt);

    const suggestion: AISchemaSuggestion = {
      id: newId("sugg"),
      event_id: event.id,
      rationale:
        `Structure proposee a partir du contexte de « ${event.title} » ` +
        `et de votre demande : "${input.prompt.slice(0, 140)}".`,
      suggested_sections: [
        {
          title: "Identite du participant",
          description: "Coordonnees de base necessaires a toute inscription.",
          fields: [
            {
              key: "nom_complet",
              label: "Nom complet",
              data_type: "short_text" as FieldDataType,
              is_required: true,
              reason: "Identification minimale requise pour tout enregistrement.",
            },
            {
              key: "email",
              label: "Adresse email",
              data_type: "email" as FieldDataType,
              is_required: true,
              reason: "Necessaire pour l'envoi de la confirmation.",
            },
          ],
        },
        ...(wantsAllergy
          ? [
              {
                title: "Sante & confort",
                fields: [
                  {
                    key: "allergies",
                    label: "Allergies alimentaires",
                    data_type: "long_text" as FieldDataType,
                    is_required: false,
                    reason: "Demande explicite : permet d'adapter la restauration.",
                  },
                ],
              },
            ]
          : []),
        ...(wantsTicketing
          ? [
              {
                title: "Billetterie",
                fields: [
                  {
                    key: "type_billet",
                    label: "Type de billet",
                    data_type: "single_select" as FieldDataType,
                    is_required: true,
                    reason: "Demande explicite : separe les infos de billetterie.",
                  },
                ],
              },
            ]
          : []),
      ],
      created_at: new Date().toISOString(),
    };

    pendingSuggestions.set(suggestion.id, suggestion);
    return deepClone(suggestion);
  },

  async applySchemaSuggestion(eventId: string, suggestionId: string): Promise<void> {
    await mockDelay(400);
    const suggestion = pendingSuggestions.get(suggestionId);
    if (!suggestion) throw new ApiError("Suggestion expiree, merci de la regenerer.", 404);
    const db = getDb();
    const event = db.events.find((e) => e.id === eventId);
    if (!event) throw new ApiError("Evenement introuvable.", 404);

    const now = new Date().toISOString();
    let sectionOrder = event.sections.length;
    let fieldOrder = 0;

    for (const s of suggestion.suggested_sections) {
      const sectionId = newId("sec");
      event.sections.push({
        id: sectionId,
        event_id: eventId,
        title: s.title,
        description: s.description,
        display_order: sectionOrder++,
      });
      s.fields.forEach((f, i) => {
        event.fields.push({
          id: newId("fld"),
          event_id: eventId,
          section_id: sectionId,
          key: f.key,
          label: f.label,
          data_type: f.data_type as FieldDataType,
          is_required: f.is_required,
          is_nullable: !f.is_required,
          is_unique: false,
          display_order: i,
          condition: null,
          created_at: now,
          updated_at: now,
        });
        fieldOrder++;
      });
    }
    void fieldOrder;
    event.updated_at = now;
    saveDb(db);
    pendingSuggestions.delete(suggestionId);
  },

  async chat(input: AIChatRequest): Promise<AIChatResponse> {
    await mockDelay(700);
    const event = requireEvent(input.event_id);
    const lastUserMessage = [...input.messages].reverse().find((m) => m.role === "user");
    const text = lastUserMessage?.content ?? "";

    let reply: string;
    const focusField = input.focus_field_id
      ? event.fields.find((f) => f.id === input.focus_field_id)
      : undefined;

    if (focusField) {
      reply = describeField(focusField.label, focusField.help_text, focusField.is_required);
    } else if (/date|quand|horaire/i.test(text)) {
      reply = event.starts_at
        ? `L'evenement debute le ${new Date(event.starts_at).toLocaleString("fr-FR")}.`
        : "La date n'a pas encore ete communiquee par les organisateurs.";
    } else if (/lieu|ou/i.test(text)) {
      reply = "Le lieu exact est precise dans la description de l'evenement ci-dessus.";
    } else if (/prix|tarif|gratuit|cout/i.test(text)) {
      reply =
        "Le detail des tarifs figure dans la description de l'evenement ou dans le champ dedie au type de billet, si present.";
    } else {
      reply = `A propos de « ${event.title} » : ${event.short_description} N'hesitez pas a me demander des precisions sur un champ du formulaire.`;
    }

    const message: AIChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: reply,
      created_at: new Date().toISOString(),
    };
    return { message };
  },
};

function describeField(label: string, helpText: string | undefined, required: boolean): string {
  const base = helpText
    ? `Pour « ${label} » : ${helpText}`
    : `« ${label} » sert a recueillir cette information pour votre inscription.`;
  return required ? `${base} Ce champ est obligatoire.` : `${base} Ce champ est facultatif.`;
}

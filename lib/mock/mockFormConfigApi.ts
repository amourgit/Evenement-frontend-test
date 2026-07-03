import { ApiError } from "@/lib/api/client";
import type { FormConfiguration, FormConfigurationSaveResponse } from "@/types/formConfig";
import { buildFormConfiguration, type BuilderDoc } from "@/lib/utils/formConfig";
import type { EventRecord } from "@/types/event";
import { getDb, saveDb, mockDelay, newId } from "./mockDb";
import { getCurrentMockAdmin } from "./mockAuthApi";
import { ensureUniqueSlug, slugify } from "./mockUtils";

function eventToBuilderDoc(event: EventRecord): BuilderDoc {
  return {
    event: {
      id: event.id,
      slug: event.slug,
      title: event.title,
      short_description: event.short_description,
      long_description: event.long_description ?? "",
      status: event.status,
      starts_at: event.starts_at,
      ends_at: event.ends_at,
      registration_deadline: event.registration_deadline,
      capacity: event.capacity,
    },
    theme: event.theme,
    ai_config: event.ai_config,
    sections: event.sections,
    fields: event.fields,
  };
}

function toResponse(event: EventRecord): FormConfigurationSaveResponse {
  return {
    event_id: event.id,
    configuration: buildFormConfiguration(eventToBuilderDoc(event), { sourceEventId: event.id }),
  };
}

export const mockFormConfigApi = {
  async create(config: FormConfiguration): Promise<FormConfigurationSaveResponse> {
    await mockDelay(500);
    const admin = getCurrentMockAdmin();
    const db = getDb();

    const slug = ensureUniqueSlug(
      slugify(config.event.slug || config.event.title),
      db.events.map((e) => e.slug)
    );
    const eventId = newId("evt");
    const now = new Date().toISOString();

    const event: EventRecord = {
      id: eventId,
      owner_id: admin.id,
      slug,
      title: config.event.title,
      short_description: config.event.short_description,
      long_description: config.event.long_description,
      status: config.event.status,
      starts_at: config.event.starts_at,
      ends_at: config.event.ends_at,
      registration_deadline: config.event.registration_deadline,
      capacity: config.event.capacity,
      theme: config.theme,
      ai_config: config.ai_config,
      sections: config.sections.map((s) => ({ ...s, event_id: eventId })),
      fields: config.fields.map((f) => ({ ...f, event_id: eventId })),
      created_at: now,
      updated_at: now,
    };

    db.events.push(event);
    saveDb(db);
    return toResponse(event);
  },

  async save(eventId: string, config: FormConfiguration): Promise<FormConfigurationSaveResponse> {
    await mockDelay(500);
    const admin = getCurrentMockAdmin();
    const db = getDb();
    const event = db.events.find((e) => e.id === eventId);
    if (!event) throw new ApiError("Evenement introuvable.", 404);
    if (event.owner_id !== admin.id) throw new ApiError("Action non autorisee.", 403);

    if (config.event.slug && config.event.slug !== event.slug) {
      event.slug = ensureUniqueSlug(
        slugify(config.event.slug),
        db.events.filter((e) => e.id !== eventId).map((e) => e.slug)
      );
    }

    event.title = config.event.title;
    event.short_description = config.event.short_description;
    event.long_description = config.event.long_description;
    event.status = config.event.status;
    event.starts_at = config.event.starts_at;
    event.ends_at = config.event.ends_at;
    event.registration_deadline = config.event.registration_deadline;
    event.capacity = config.event.capacity;
    event.theme = config.theme;
    event.ai_config = config.ai_config;
    event.sections = config.sections.map((s) => ({ ...s, event_id: eventId }));
    event.fields = config.fields.map((f) => ({ ...f, event_id: eventId }));
    event.updated_at = new Date().toISOString();

    saveDb(db);
    return toResponse(event);
  },

  async get(eventId: string): Promise<FormConfiguration> {
    await mockDelay(300);
    getCurrentMockAdmin();
    const event = getDb().events.find((e) => e.id === eventId);
    if (!event) throw new ApiError("Evenement introuvable.", 404);
    return buildFormConfiguration(eventToBuilderDoc(event), { sourceEventId: event.id });
  },
};

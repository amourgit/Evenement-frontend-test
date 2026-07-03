import { ApiError } from "@/lib/api/client";
import type { EventRecord, EventSummary, EventInput } from "@/src/types/event";
import { getDb, saveDb, mockDelay, newId } from "./mockDb";
import { getCurrentMockAdmin } from "./mockAuthApi";
import { deepClone, ensureUniqueSlug, slugify } from "./mockUtils";

function toSummary(event: EventRecord, submissionsCount: number): EventSummary {
  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    short_description: event.short_description,
    status: event.status,
    starts_at: event.starts_at,
    capacity: event.capacity,
    theme: event.theme,
    submissions_count: submissionsCount,
  };
}

function submissionsCountFor(eventId: string): number {
  return getDb().submissions.filter((s) => s.event_id === eventId).length;
}

export const mockEventsApi = {
  async listPublic(): Promise<EventSummary[]> {
    await mockDelay();
    return getDb()
      .events.filter((e) => e.status === "open" || e.status === "closed")
      .map((e) => toSummary(e, submissionsCountFor(e.id)));
  },

  async getBySlug(slug: string): Promise<EventRecord> {
    await mockDelay();
    const event = getDb().events.find((e) => e.slug === slug);
    if (!event) throw new ApiError("Evenement introuvable.", 404);
    return deepClone(event);
  },

  async listMine(): Promise<EventSummary[]> {
    await mockDelay();
    const admin = getCurrentMockAdmin();
    return getDb()
      .events.filter((e) => e.owner_id === admin.id)
      .map((e) => toSummary(e, submissionsCountFor(e.id)));
  },

  async getById(id: string): Promise<EventRecord> {
    await mockDelay();
    getCurrentMockAdmin(); // exige une session valide
    const event = getDb().events.find((e) => e.id === id);
    if (!event) throw new ApiError("Evenement introuvable.", 404);
    return deepClone(event);
  },

  async create(input: EventInput): Promise<EventRecord> {
    await mockDelay();
    const admin = getCurrentMockAdmin();
    const db = getDb();
    const slugBase = slugify(input.slug || input.title);
    const slug = ensureUniqueSlug(
      slugBase,
      db.events.map((e) => e.slug)
    );
    const now = new Date().toISOString();
    const event: EventRecord = {
      id: newId("evt"),
      owner_id: admin.id,
      slug,
      title: input.title,
      short_description: input.short_description,
      long_description: input.long_description,
      status: input.status,
      starts_at: input.starts_at,
      ends_at: input.ends_at,
      registration_deadline: input.registration_deadline,
      capacity: input.capacity,
      theme: input.theme,
      ai_config: input.ai_config,
      sections: [],
      fields: [],
      created_at: now,
      updated_at: now,
    };
    db.events.push(event);
    saveDb(db);
    return deepClone(event);
  },

  async update(id: string, input: Partial<EventInput>): Promise<EventRecord> {
    await mockDelay();
    const admin = getCurrentMockAdmin();
    const db = getDb();
    const event = db.events.find((e) => e.id === id);
    if (!event) throw new ApiError("Evenement introuvable.", 404);
    if (event.owner_id !== admin.id) throw new ApiError("Action non autorisee.", 403);

    if (input.slug && input.slug !== event.slug) {
      event.slug = ensureUniqueSlug(
        slugify(input.slug),
        db.events.filter((e) => e.id !== id).map((e) => e.slug)
      );
    }
    Object.assign(event, {
      title: input.title ?? event.title,
      short_description: input.short_description ?? event.short_description,
      long_description: input.long_description ?? event.long_description,
      status: input.status ?? event.status,
      starts_at: input.starts_at !== undefined ? input.starts_at : event.starts_at,
      ends_at: input.ends_at !== undefined ? input.ends_at : event.ends_at,
      registration_deadline:
        input.registration_deadline !== undefined
          ? input.registration_deadline
          : event.registration_deadline,
      capacity: input.capacity !== undefined ? input.capacity : event.capacity,
      theme: input.theme ?? event.theme,
      ai_config: input.ai_config ?? event.ai_config,
    });
    event.updated_at = new Date().toISOString();
    saveDb(db);
    return deepClone(event);
  },

  async updateStatus(id: string, status: EventRecord["status"]): Promise<EventRecord> {
    await mockDelay(150);
    const admin = getCurrentMockAdmin();
    const db = getDb();
    const event = db.events.find((e) => e.id === id);
    if (!event) throw new ApiError("Evenement introuvable.", 404);
    if (event.owner_id !== admin.id) throw new ApiError("Action non autorisee.", 403);
    event.status = status;
    event.updated_at = new Date().toISOString();
    saveDb(db);
    return deepClone(event);
  },

  async remove(id: string): Promise<void> {
    await mockDelay();
    const admin = getCurrentMockAdmin();
    const db = getDb();
    const event = db.events.find((e) => e.id === id);
    if (!event) throw new ApiError("Evenement introuvable.", 404);
    if (event.owner_id !== admin.id) throw new ApiError("Action non autorisee.", 403);

    db.events = db.events.filter((e) => e.id !== id);
    db.submissions = db.submissions.filter((s) => s.event_id !== id);
    db.ai_prompt_sources = db.ai_prompt_sources.filter((s) => s.event_id !== id);
    saveDb(db);
  },

  async duplicate(id: string): Promise<EventRecord> {
    await mockDelay();
    const admin = getCurrentMockAdmin();
    const db = getDb();
    const original = db.events.find((e) => e.id === id);
    if (!original) throw new ApiError("Evenement introuvable.", 404);

    const sectionIdMap = new Map<string, string>();
    const newEventId = newId("evt");
    const now = new Date().toISOString();

    const sections = original.sections.map((s) => {
      const sid = newId("sec");
      sectionIdMap.set(s.id, sid);
      return { ...s, id: sid, event_id: newEventId };
    });
    const fields = original.fields.map((f) => ({
      ...f,
      id: newId("fld"),
      event_id: newEventId,
      section_id: f.section_id ? sectionIdMap.get(f.section_id) ?? null : null,
      created_at: now,
      updated_at: now,
    }));

    const copy: EventRecord = {
      ...deepClone(original),
      id: newEventId,
      owner_id: admin.id,
      slug: ensureUniqueSlug(
        `${original.slug}-copie`,
        db.events.map((e) => e.slug)
      ),
      title: `${original.title} (copie)`,
      status: "draft",
      sections,
      fields,
      created_at: now,
      updated_at: now,
    };
    db.events.push(copy);
    saveDb(db);
    return deepClone(copy);
  },
};

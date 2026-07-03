import { ApiError } from "@/lib/api/client";
import type { FieldDefinition, FieldDefinitionInput, FieldSection } from "@/types/field";
import { getDb, saveDb, mockDelay, newId } from "./mockDb";
import { getCurrentMockAdmin } from "./mockAuthApi";
import { deepClone } from "./mockUtils";

function requireOwnedEvent(eventId: string) {
  const admin = getCurrentMockAdmin();
  const db = getDb();
  const event = db.events.find((e) => e.id === eventId);
  if (!event) throw new ApiError("Evenement introuvable.", 404);
  if (event.owner_id !== admin.id) throw new ApiError("Action non autorisee.", 403);
  return { db, event };
}

export const mockFieldsApi = {
  async listSections(eventId: string): Promise<FieldSection[]> {
    await mockDelay();
    const { event } = requireOwnedEvent(eventId);
    return deepClone(event.sections);
  },

  async createSection(
    eventId: string,
    input: Omit<FieldSection, "id" | "event_id">
  ): Promise<FieldSection> {
    await mockDelay();
    const { db, event } = requireOwnedEvent(eventId);
    const section: FieldSection = { ...input, id: newId("sec"), event_id: eventId };
    event.sections.push(section);
    event.updated_at = new Date().toISOString();
    saveDb(db);
    return deepClone(section);
  },

  async updateSection(
    eventId: string,
    sectionId: string,
    input: Partial<Omit<FieldSection, "id" | "event_id">>
  ): Promise<FieldSection> {
    await mockDelay();
    const { db, event } = requireOwnedEvent(eventId);
    const section = event.sections.find((s) => s.id === sectionId);
    if (!section) throw new ApiError("Section introuvable.", 404);
    Object.assign(section, input);
    event.updated_at = new Date().toISOString();
    saveDb(db);
    return deepClone(section);
  },

  async removeSection(eventId: string, sectionId: string): Promise<void> {
    await mockDelay();
    const { db, event } = requireOwnedEvent(eventId);
    event.sections = event.sections.filter((s) => s.id !== sectionId);
    event.fields = event.fields.filter((f) => f.section_id !== sectionId);
    event.updated_at = new Date().toISOString();
    saveDb(db);
  },

  async listFields(eventId: string): Promise<FieldDefinition[]> {
    await mockDelay();
    const { event } = requireOwnedEvent(eventId);
    return deepClone(event.fields);
  },

  async createField(eventId: string, input: FieldDefinitionInput): Promise<FieldDefinition> {
    await mockDelay();
    const { db, event } = requireOwnedEvent(eventId);
    const now = new Date().toISOString();
    const field: FieldDefinition = {
      section_id: null,
      key: "",
      label: "",
      data_type: "short_text",
      is_required: false,
      is_nullable: true,
      is_unique: false,
      display_order: 0,
      ...input,
      id: newId("fld"),
      event_id: eventId,
      created_at: now,
      updated_at: now,
    } as FieldDefinition;
    event.fields.push(field);
    event.updated_at = now;
    saveDb(db);
    return deepClone(field);
  },

  async updateField(
    eventId: string,
    fieldId: string,
    input: Partial<FieldDefinitionInput>
  ): Promise<FieldDefinition> {
    await mockDelay();
    const { db, event } = requireOwnedEvent(eventId);
    const field = event.fields.find((f) => f.id === fieldId);
    if (!field) throw new ApiError("Champ introuvable.", 404);
    Object.assign(field, input);
    field.updated_at = new Date().toISOString();
    event.updated_at = field.updated_at;
    saveDb(db);
    return deepClone(field);
  },

  async removeField(eventId: string, fieldId: string): Promise<void> {
    await mockDelay();
    const { db, event } = requireOwnedEvent(eventId);
    event.fields = event.fields.filter((f) => f.id !== fieldId);
    event.updated_at = new Date().toISOString();
    saveDb(db);
  },

  async reorderFields(eventId: string, orderedFieldIds: string[]): Promise<void> {
    await mockDelay(150);
    const { db, event } = requireOwnedEvent(eventId);
    orderedFieldIds.forEach((id, index) => {
      const field = event.fields.find((f) => f.id === id);
      if (field) field.display_order = index;
    });
    event.updated_at = new Date().toISOString();
    saveDb(db);
  },
};

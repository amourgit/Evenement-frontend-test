import { api } from "./client";
import type { FieldDefinition, FieldDefinitionInput, FieldSection } from "@/src/types/field";
import { USE_MOCK_API } from "./config";
import { mockFieldsApi } from "@/lib/mock/mockFieldsApi";

// ============================================================================
// MODERN API (used by FormBuilderPage, etc.)
// Uses FieldDefinition, FieldSection types (snake_case)
// ============================================================================

const realFieldsApi = {
  async listSections(eventId: string): Promise<FieldSection[]> {
    return api.get<FieldSection[]>(`/admin/events/${eventId}/sections`, { auth: true });
  },

  async createSection(
    eventId: string,
    input: Omit<FieldSection, "id" | "event_id">
  ): Promise<FieldSection> {
    return api.post<FieldSection>(`/admin/events/${eventId}/sections`, input, { auth: true });
  },

  async updateSection(
    eventId: string,
    sectionId: string,
    input: Partial<Omit<FieldSection, "id" | "event_id">>
  ): Promise<FieldSection> {
    return api.patch<FieldSection>(
      `/admin/events/${eventId}/sections/${sectionId}`,
      input,
      { auth: true }
    );
  },

  async removeSection(eventId: string, sectionId: string): Promise<void> {
    return api.delete<void>(`/admin/events/${eventId}/sections/${sectionId}`, { auth: true });
  },

  async listFields(eventId: string): Promise<FieldDefinition[]> {
    return api.get<FieldDefinition[]>(`/admin/events/${eventId}/fields`, { auth: true });
  },

  async createField(eventId: string, input: FieldDefinitionInput): Promise<FieldDefinition> {
    return api.post<FieldDefinition>(`/admin/events/${eventId}/fields`, input, { auth: true });
  },

  async updateField(
    eventId: string,
    fieldId: string,
    input: Partial<FieldDefinitionInput>
  ): Promise<FieldDefinition> {
    return api.patch<FieldDefinition>(
      `/admin/events/${eventId}/fields/${fieldId}`,
      input,
      { auth: true }
    );
  },

  async removeField(eventId: string, fieldId: string): Promise<void> {
    return api.delete<void>(`/admin/events/${eventId}/fields/${fieldId}`, { auth: true });
  },

  async reorderFields(eventId: string, orderedFieldIds: string[]): Promise<void> {
    return api.post<void>(
      `/admin/events/${eventId}/fields/reorder`,
      { ordered_field_ids: orderedFieldIds },
      { auth: true }
    );
  },
};

/** Voir src/mock/mockFieldsApi.ts : donnees fictives tant que USE_MOCK_API est actif */
export const fieldsApi: typeof realFieldsApi = USE_MOCK_API ? mockFieldsApi : realFieldsApi;

// ============================================================================
// LEGACY LOCAL STORAGE API (used by EventEditorPage)
// Uses FormField, FormSection types (camelCase)
// ============================================================================

import { FormField, FormSection } from '@/src/types/field';
import { updateEvent, fetchEventById } from './events';

export async function addSection(eventId: string, section: Omit<FormSection, 'id'>): Promise<FormSection> {
  const event = await fetchEventById(eventId);
  if (!event) throw new Error('Event not found');

  const newSection: FormSection = {
    ...section,
    id: 'sec_' + Date.now()
  };

  const updatedSections = [...(event.sections || []), newSection];
  await updateEvent(eventId, { sections: updatedSections });
  return newSection;
}

export async function addField(eventId: string, field: Omit<FormField, 'id'>): Promise<FormField> {
  const event = await fetchEventById(eventId);
  if (!event) throw new Error('Event not found');

  const newField: FormField = {
    ...field,
    id: 'f_' + Date.now()
  };

  const updatedFields = [...(event.fields || []), newField];
  await updateEvent(eventId, { fields: updatedFields });
  return newField;
}

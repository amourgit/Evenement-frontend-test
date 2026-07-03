import { api } from "./client";
import type { EventRecord, EventSummary, EventInput } from "@/src/types/event";
import { USE_MOCK_API } from "./config";
import { mockEventsApi } from "@/lib/mock/mockEventsApi";

// ============================================================================
// MODERN API (used by EventsListPage, FormBuilderPage, etc.)
// Uses EventRecord, EventSummary, EventInput types
// ============================================================================

const realEventsApi = {
  /** Public — page d'accueil ou listing (si l'admin choisit de le rendre visible) */
  async listPublic(): Promise<EventSummary[]> {
    return api.get<EventSummary[]>("/events");
  },

  /** Public — recupere un evenement complet (sections + champs) par son slug, pour le formulaire */
  async getBySlug(slug: string): Promise<EventRecord> {
    return api.get<EventRecord>(`/events/slug/${encodeURIComponent(slug)}`);
  },

  /** Backoffice — liste des evenements du compte connecte */
  async listMine(): Promise<EventSummary[]> {
    return api.get<EventSummary[]>("/admin/events", { auth: true });
  },

  async getById(id: string): Promise<EventRecord> {
    return api.get<EventRecord>(`/admin/events/${id}`, { auth: true });
  },

  async create(input: EventInput): Promise<EventRecord> {
    return api.post<EventRecord>("/admin/events", input, { auth: true });
  },

  async update(id: string, input: Partial<EventInput>): Promise<EventRecord> {
    return api.patch<EventRecord>(`/admin/events/${id}`, input, { auth: true });
  },

  async updateStatus(id: string, status: EventRecord["status"]): Promise<EventRecord> {
    return api.patch<EventRecord>(`/admin/events/${id}/status`, { status }, { auth: true });
  },

  async remove(id: string): Promise<void> {
    return api.delete<void>(`/admin/events/${id}`, { auth: true });
  },

  async duplicate(id: string): Promise<EventRecord> {
    return api.post<EventRecord>(`/admin/events/${id}/duplicate`, undefined, { auth: true });
  },
};

/** Voir src/mock/mockEventsApi.ts : donnees fictives tant que USE_MOCK_API est actif */
export const eventsApi: typeof realEventsApi = USE_MOCK_API ? mockEventsApi : realEventsApi;

// ============================================================================
// LEGACY LOCAL STORAGE API (used by EventEditorPage, EventDetailPage, EventRegistrationPage)
// Uses Event type (legacy) with camelCase fields
// ============================================================================

import { Event } from '@/src/types/event';
import { getStoredEvents, saveStoredEvents } from './client';

export async function fetchEvents(): Promise<Event[]> {
  return getStoredEvents();
}

export async function fetchEventById(id: string): Promise<Event | null> {
  const events = getStoredEvents();
  return events.find(e => e.id === id) || null;
}

export async function createEvent(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> {
  const events = getStoredEvents();
  const newEvent: Event = {
    ...event,
    id: 'e_' + Date.now(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const updatedEvents = [...events, newEvent];
  saveStoredEvents(updatedEvents);
  return newEvent;
}

export async function updateEvent(id: string, updates: Partial<Event>): Promise<Event> {
  const events = getStoredEvents();
  let updatedEvent: Event | null = null;

  const updatedEvents = events.map(e => {
    if (e.id === id) {
      updatedEvent = {
        ...e,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return updatedEvent;
    }
    return e;
  });

  if (!updatedEvent) {
    throw new Error(`Event with id ${id} not found.`);
  }

  saveStoredEvents(updatedEvents);
  return updatedEvent;
}

export async function deleteEvent(id: string): Promise<void> {
  const events = getStoredEvents();
  const filtered = events.filter(e => e.id !== id);
  saveStoredEvents(filtered);
}

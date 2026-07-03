import { FormField, FormSection, FieldSection, FieldDefinition } from './field';

export type EventStatus = 'draft' | 'published' | 'archived' | 'open' | 'closed';

export interface EventTheme {
  primaryColor: string;
  backgroundColor: string;
  cardStyle: 'flat' | 'rounded' | 'bordered';
  bannerUrl?: string;
  cover_image_url?: string;
  fontFamily: string;

  // New fields (made optional for backwards compatibility)
  accent_color?: string;
  accent_soft_color?: string;
  background_style?: string;
  radius?: 'sharp' | 'soft' | 'round';
  layout?: 'centered' | 'split' | 'fullbleed';
  display_font?: 'space_grotesk' | 'playfair' | 'sora' | 'inter';
  logo_url?: string;
}

export interface EventAIConfig {
  enabled: boolean;
  tone: 'chaleureux' | 'formel' | 'neutre' | 'dynamique';
  system_prompt: string;
  knowledge_source_ids?: string[];
  can_explain_fields?: boolean;
  can_summarize_event?: boolean;
  can_suggest_schema?: boolean;
}

export const DEFAULT_EVENT_THEME: EventTheme = {
  primaryColor: '#0078d4',
  backgroundColor: '#f3f2f1',
  cardStyle: 'rounded',
  fontFamily: 'Inter',
  bannerUrl: '',
  cover_image_url: '',
  accent_color: '#0078d4',
  accent_soft_color: '#3B3FBF',
  background_style: 'light',
  radius: 'soft',
  layout: 'centered',
  display_font: 'inter',
  logo_url: ''
};

export const DEFAULT_AI_CONFIG: EventAIConfig = {
  enabled: false,
  tone: 'neutre',
  system_prompt: ''
};

// Legacy type for local storage approach (used by some pages)
export interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  date: string;
  location: string;
  category: string;
  status: EventStatus;
  organizer: string;
  theme: EventTheme;
  sections: FormSection[];
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

// Modern API types (used by eventsApi, fieldsApi, formConfigApi)
export interface EventSummary {
  id: string;
  slug?: string;
  title: string;
  short_description?: string;
  submissions_count: number;
  status: EventStatus;
  starts_at?: string | null;
  capacity?: number | null;
  theme?: EventTheme;
}

export interface EventRecord {
  id: string;
  owner_id: string;
  slug: string;
  title: string;
  short_description?: string;
  long_description?: string;
  status: EventStatus;
  starts_at?: string | null;
  ends_at?: string | null;
  registration_deadline?: string | null;
  capacity?: number | null;
  theme: EventTheme;
  ai_config: EventAIConfig;
  sections: FieldSection[];
  fields: FieldDefinition[];
  created_at: string;
  updated_at: string;
}

export interface EventInput {
  slug?: string;
  title: string;
  short_description?: string;
  long_description?: string;
  status: EventStatus;
  starts_at?: string | null;
  ends_at?: string | null;
  registration_deadline?: string | null;
  capacity?: number | null;
  theme: EventTheme;
  ai_config: EventAIConfig;
}

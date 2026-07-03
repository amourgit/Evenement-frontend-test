import { EventTheme, EventAIConfig, EventStatus } from './event';
import { FieldSection, FieldDefinition } from './field';

export const FORM_CONFIG_FORMAT = "civitas-config";
export const FORM_CONFIG_SCHEMA_VERSION = "1.0.0";

export interface FormConfiguration {
  meta: {
    format: string;
    schema_version: string;
    generated_at: string;
    generated_by: {
      app: string;
      app_version: string;
    };
    source_event_id: string | null;
    cloned_from_event_id: string | null;
    checksum: string;
    stats: {
      sections_count: number;
      fields_count: number;
      required_fields_count: number;
      unique_fields_count: number;
    };
  };
  event: {
    id: string | null;
    slug: string;
    title: string;
    short_description: string;
    long_description: string;
    status: EventStatus;
    starts_at: string | null;
    ends_at: string | null;
    registration_deadline: string | null;
    capacity: number | null;
  };
  theme: EventTheme;
  ai_config: EventAIConfig;
  sections: FieldSection[];
  fields: FieldDefinition[];
}

export interface FormConfigurationSaveResponse {
  event_id: string;
  configuration: FormConfiguration;
}

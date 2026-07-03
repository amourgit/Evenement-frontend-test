import { FormField, FormSection, FieldDataType } from './field';

export interface AISuggestionResponse {
  sections: FormSection[];
  fields: FormField[];
  theme: {
    primaryColor: string;
    backgroundColor: string;
    fontFamily: string;
  };
}

export interface AIPromptRequest {
  prompt: string;
  category: string;
}

export interface AIPromptSource {
  id: string;
  event_id: string;
  label: string;
  kind: "text" | "file";
  content: string;
  file_name?: string;
  created_at: string;
}

export interface AISchemaSuggestion {
  id: string;
  event_id: string;
  rationale: string;
  suggested_sections: {
    title: string;
    description?: string;
    fields: {
      key: string;
      label: string;
      data_type: FieldDataType;
      is_required: boolean;
      reason: string;
    }[];
  }[];
  created_at: string;
}

export interface AISchemaSuggestionRequest {
  event_id: string;
  prompt: string;
}

export interface AIChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface AIChatRequest {
  event_id: string;
  messages: AIChatMessage[];
  focus_field_id?: string;
}

export interface AIChatResponse {
  message: AIChatMessage;
}

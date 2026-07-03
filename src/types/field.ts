export type FieldType = 'text' | 'number' | 'email' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date';

export interface FieldValidation {
  required: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  errorMessage?: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  options?: string[]; // for select, radio
  validation: FieldValidation;
  sectionId?: string;
  order: number;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  order: number;
}

// Builder types
export type FieldDataType =
  | "short_text"
  | "long_text"
  | "email"
  | "phone"
  | "number"
  | "decimal"
  | "boolean"
  | "date"
  | "datetime"
  | "single_select"
  | "multi_select"
  | "file"
  | "image"
  | "url"
  | "rating"
  | "signature";

/** Labels affiches dans l'interface admin pour chaque type de champ */
export const FIELD_TYPE_LABELS: Record<FieldDataType, string> = {
  short_text: "Texte court",
  long_text: "Texte long",
  email: "Email",
  phone: "Telephone",
  number: "Nombre entier",
  decimal: "Nombre decimal",
  boolean: "Case a cocher (Oui/Non)",
  date: "Date",
  datetime: "Date et heure",
  single_select: "Liste deroulante (choix unique)",
  multi_select: "Cases a cocher (choix multiples)",
  file: "Fichier",
  image: "Image",
  url: "URL / Lien",
  rating: "Note (etoiles)",
  signature: "Signature",
};

export interface FieldOption {
  id: string;
  label: string;
  value: string;
}

export interface FieldCondition {
  field_id: string;
  equals?: string | number | boolean;
  oneOf?: (string | number | boolean)[];
}

export interface FieldDefinition {
  id: string;
  event_id: string;
  section_id: string | null;
  key: string;
  label: string;
  data_type: FieldDataType;
  is_required: boolean;
  is_nullable: boolean;
  is_unique: boolean;
  is_readonly?: boolean;
  display_order: number;
  condition?: FieldCondition | null;
  created_at: string;
  updated_at: string;
  options?: FieldOption[];
  max_length?: number;
  min_length?: number;
  min_value?: number;
  max_value?: number;
  regex_pattern?: string;
  regex_error_message?: string;
  default_value?: any;
  max_file_size_mb?: number;
  accepted_mime_types?: string[];
  help_text?: string;
  placeholder?: string;
}

export type FieldDefinitionInput = Partial<FieldDefinition>;

export interface FieldSection {
  id: string;
  event_id: string;
  title: string;
  description?: string;
  display_order: number;
  icon?: string;
}


import type { FieldDefinition } from "@/src/types/field";
import type { SubmissionAnswers } from "@/src/types/submission";
import type { FormField } from "@/src/types/field";

export interface FieldValidationError {
  field_id: string;
  message: string;
}

/**
 * Valide une valeur unique contre les attributs persistes d'un champ.
 * Ce validateur est un MIROIR de la validation backend : il permet un retour
 * immediat dans l'UI, mais chaque soumission est de toute facon revalidee
 * par le serveur avant ecriture en base (unicite, regles metier, securite).
 */
export function validateFieldValue(
  field: FieldDefinition,
  value: string | number | boolean | string[] | null | undefined
): string | null {
  const isEmpty =
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0);

  if (isEmpty) {
    if (field.is_required || !field.is_nullable) {
      return `« ${field.label} » est obligatoire.`;
    }
    return null;
  }

  switch (field.data_type) {
    case "short_text":
    case "long_text": {
      const str = String(value);
      if (field.min_length && str.length < field.min_length) {
        return `« ${field.label} » doit contenir au moins ${field.min_length} caracteres.`;
      }
      if (field.max_length && str.length > field.max_length) {
        return `« ${field.label} » ne doit pas depasser ${field.max_length} caracteres.`;
      }
      break;
    }
    case "email": {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(String(value))) {
        return `« ${field.label} » doit etre une adresse email valide.`;
      }
      break;
    }
    case "phone": {
      const phonePattern = /^[+()\d][\d\s().-]{5,}$/;
      if (!phonePattern.test(String(value))) {
        return `« ${field.label} » doit etre un numero de telephone valide.`;
      }
      break;
    }
    case "url": {
      try {
        new URL(String(value));
      } catch {
        return `« ${field.label} » doit etre une URL valide.`;
      }
      break;
    }
    case "number":
    case "decimal":
    case "rating": {
      const num = Number(value);
      if (Number.isNaN(num)) return `« ${field.label} » doit etre un nombre.`;
      if (field.data_type === "number" && !Number.isInteger(num)) {
        return `« ${field.label} » doit etre un nombre entier.`;
      }
      if (field.min_value !== undefined && num < field.min_value) {
        return `« ${field.label} » doit etre superieur ou egal a ${field.min_value}.`;
      }
      if (field.max_value !== undefined && num > field.max_value) {
        return `« ${field.label} » doit etre inferieur ou egal a ${field.max_value}.`;
      }
      break;
    }
    case "single_select": {
      const allowed = (field.options ?? []).map((o) => o.value);
      if (!allowed.includes(String(value))) {
        return `« ${field.label} » : valeur non reconnue.`;
      }
      break;
    }
    case "multi_select": {
      const allowed = new Set((field.options ?? []).map((o) => o.value));
      const values = Array.isArray(value) ? value : [String(value)];
      if (values.some((v) => !allowed.has(v))) {
        return `« ${field.label} » : une ou plusieurs valeurs non reconnues.`;
      }
      break;
    }
    default:
      break;
  }

  if (field.regex_pattern) {
    try {
      const re = new RegExp(field.regex_pattern);
      if (!re.test(String(value))) {
        return field.regex_error_message ?? `« ${field.label} » a un format invalide.`;
      }
    } catch {
      // motif regex invalide cote config — ignore silencieusement cote client
    }
  }

  return null;
}

/** Verifie la visibilite d'un champ selon sa `condition` et les reponses actuelles */
export function isFieldVisible(field: FieldDefinition, answers: SubmissionAnswers): boolean {
  if (!field.condition) return true;
  const currentValue = answers[field.condition.field_id];
  if (field.condition.equals !== undefined) {
    return currentValue === field.condition.equals;
  }
  if (field.condition.oneOf) {
    return field.condition.oneOf.includes(currentValue as string | number | boolean);
  }
  return true;
}

/** Valide l'ensemble des reponses d'un formulaire contre ses definitions de champs */
export function validateSubmission(
  fields: FieldDefinition[],
  answers: SubmissionAnswers
): FieldValidationError[] {
  const errors: FieldValidationError[] = [];
  for (const field of fields) {
    if (!isFieldVisible(field, answers)) continue;
    const message = validateFieldValue(field, answers[field.id]);
    if (message) errors.push({ field_id: field.id, message });
  }
  return errors;
}

/**
 * Validateur legacy pour EventRegistrationPage (utilise FormField au lieu de FieldDefinition)
 * Convertit le champ legacy vers le format moderne et utilise validateFieldValue
 */
export function validateField(field: FormField, value: any): string | null {
  // Mapping simple des types legacy vers modernes
  const typeMapping: Record<FormField['type'], FieldDefinition['data_type']> = {
    'text': 'short_text',
    'number': 'number',
    'email': 'email',
    'textarea': 'long_text',
    'select': 'single_select',
    'checkbox': 'boolean',
    'radio': 'single_select',
    'date': 'date'
  };

  const modernField: FieldDefinition = {
    id: field.id,
    event_id: '',
    section_id: field.sectionId || null,
    key: field.id,
    label: field.label,
    data_type: typeMapping[field.type] || 'short_text',
    is_required: field.validation.required,
    is_nullable: !field.validation.required,
    is_unique: false,
    display_order: field.order,
    condition: null,
    created_at: '',
    updated_at: '',
    options: field.options?.map((opt, idx) => ({ id: `opt_${idx}`, label: opt, value: opt })),
    max_length: field.validation.max,
    min_length: field.validation.min,
    regex_pattern: field.validation.pattern,
    regex_error_message: field.validation.errorMessage,
    default_value: field.defaultValue,
    placeholder: field.placeholder
  };

  return validateFieldValue(modernField, value);
}

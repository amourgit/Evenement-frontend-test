import type { FieldDataType, FieldDefinition, FieldDefinitionInput, FieldSection } from "@/types/field";
import type { EventTheme, EventAIConfig } from "@/types/event";
import type { BuilderDoc, EventMetaDraft } from "@/lib/utils/formConfig";

export type Selection =
  | { type: "field"; id: string }
  | { type: "section"; id: string }
  | null;

export type BuilderAction =
  | { kind: "SET_EVENT_META"; payload: Partial<EventMetaDraft> }
  | { kind: "SET_THEME"; payload: EventTheme }
  | { kind: "SET_AI_CONFIG"; payload: EventAIConfig }
  | { kind: "ADD_SECTION" }
  | { kind: "UPDATE_SECTION"; id: string; payload: Omit<FieldSection, "id" | "event_id"> }
  | { kind: "DELETE_SECTION"; id: string }
  | { kind: "REORDER_SECTIONS"; orderedIds: string[] }
  | { kind: "ADD_FIELD"; dataType: FieldDataType; sectionId: string | null }
  | { kind: "UPDATE_FIELD"; id: string; payload: FieldDefinitionInput }
  | { kind: "DELETE_FIELD"; id: string }
  | { kind: "DUPLICATE_FIELD"; id: string }
  | { kind: "REORDER_FIELDS"; sectionId: string | null; orderedIds: string[] }
  | { kind: "MOVE_FIELD_TO_SECTION"; fieldId: string; sectionId: string | null }
  | { kind: "LOAD_DOC"; doc: BuilderDoc };

export interface HistoryState {
  past: BuilderDoc[];
  present: BuilderDoc;
  future: BuilderDoc[];
}

const MAX_HISTORY = 60;

const DEFAULT_LABELS: Record<FieldDataType, string> = {
  short_text: "Nouveau champ texte",
  long_text: "Nouveau champ texte long",
  email: "Adresse email",
  phone: "Numero de telephone",
  number: "Nombre",
  decimal: "Nombre decimal",
  boolean: "Case a cocher",
  date: "Date",
  datetime: "Date et heure",
  single_select: "Choix unique",
  multi_select: "Choix multiple",
  file: "Fichier",
  image: "Image",
  url: "Lien",
  rating: "Note",
  signature: "Signature",
};

function createDefaultField(
  dataType: FieldDataType,
  sectionId: string | null,
  order: number
): FieldDefinition {
  const now = new Date().toISOString();
  const base: FieldDefinition = {
    id: crypto.randomUUID(),
    event_id: "",
    section_id: sectionId,
    key: `champ_${Math.random().toString(36).slice(2, 7)}`,
    label: DEFAULT_LABELS[dataType],
    data_type: dataType,
    is_required: dataType !== "boolean",
    is_nullable: dataType === "boolean",
    is_unique: false,
    display_order: order,
    condition: null,
    created_at: now,
    updated_at: now,
  };

  if (dataType === "single_select" || dataType === "multi_select") {
    base.options = [
      { id: crypto.randomUUID(), label: "Option 1", value: "option_1" },
      { id: crypto.randomUUID(), label: "Option 2", value: "option_2" },
    ];
  }
  if (dataType === "short_text") base.max_length = 120;
  if (dataType === "long_text") base.max_length = 2000;
  if (dataType === "rating") {
    base.min_value = 1;
    base.max_value = 5;
  }
  if (dataType === "file" || dataType === "image") {
    base.max_file_size_mb = 10;
    base.accepted_mime_types = dataType === "image" ? ["image/png", "image/jpeg"] : undefined;
  }

  return base;
}

/** Reducer PUR sur le document du builder (sans gestion d'historique) */
function docReducer(doc: BuilderDoc, action: BuilderAction): BuilderDoc {
  switch (action.kind) {
    case "SET_EVENT_META":
      return { ...doc, event: { ...doc.event, ...action.payload } };

    case "SET_THEME":
      return { ...doc, theme: action.payload };

    case "SET_AI_CONFIG":
      return { ...doc, ai_config: action.payload };

    case "ADD_SECTION": {
      const section: FieldSection = {
        id: crypto.randomUUID(),
        event_id: doc.event.id ?? "",
        title: `Section ${doc.sections.length + 1}`,
        description: "",
        display_order: doc.sections.length,
      };
      return { ...doc, sections: [...doc.sections, section] };
    }

    case "UPDATE_SECTION":
      return {
        ...doc,
        sections: doc.sections.map((s) => (s.id === action.id ? { ...s, ...action.payload } : s)),
      };

    case "DELETE_SECTION":
      return {
        ...doc,
        sections: doc.sections.filter((s) => s.id !== action.id),
        fields: doc.fields.map((f) => (f.section_id === action.id ? { ...f, section_id: null } : f)),
      };

    case "REORDER_SECTIONS": {
      const order = new Map(action.orderedIds.map((id, i) => [id, i]));
      return {
        ...doc,
        sections: doc.sections
          .map((s) => ({ ...s, display_order: order.get(s.id) ?? s.display_order }))
          .sort((a, b) => a.display_order - b.display_order),
      };
    }

    case "ADD_FIELD": {
      const siblingCount = doc.fields.filter((f) => f.section_id === action.sectionId).length;
      const field = createDefaultField(action.dataType, action.sectionId, siblingCount);
      return { ...doc, fields: [...doc.fields, field] };
    }

    case "UPDATE_FIELD":
      return {
        ...doc,
        fields: doc.fields.map((f) =>
          f.id === action.id
            ? { ...f, ...action.payload, updated_at: new Date().toISOString() }
            : f
        ),
      };

    case "DELETE_FIELD":
      return { ...doc, fields: doc.fields.filter((f) => f.id !== action.id) };

    case "DUPLICATE_FIELD": {
      const original = doc.fields.find((f) => f.id === action.id);
      if (!original) return doc;
      const now = new Date().toISOString();
      const copy: FieldDefinition = {
        ...original,
        id: crypto.randomUUID(),
        key: `${original.key}_copie`,
        label: `${original.label} (copie)`,
        display_order: original.display_order + 0.5,
        created_at: now,
        updated_at: now,
      };
      return { ...doc, fields: normalizeOrders([...doc.fields, copy], copy.section_id) };
    }

    case "REORDER_FIELDS": {
      const order = new Map(action.orderedIds.map((id, i) => [id, i]));
      return {
        ...doc,
        fields: doc.fields.map((f) =>
          f.section_id === action.sectionId && order.has(f.id)
            ? { ...f, display_order: order.get(f.id)! }
            : f
        ),
      };
    }

    case "MOVE_FIELD_TO_SECTION": {
      const siblingCount = doc.fields.filter((f) => f.section_id === action.sectionId).length;
      return {
        ...doc,
        fields: doc.fields.map((f) =>
          f.id === action.fieldId
            ? { ...f, section_id: action.sectionId, display_order: siblingCount }
            : f
        ),
      };
    }

    case "LOAD_DOC":
      return action.doc;

    default:
      return doc;
  }
}

function normalizeOrders(fields: FieldDefinition[], sectionId: string | null): FieldDefinition[] {
  const siblings = fields
    .filter((f) => f.section_id === sectionId)
    .sort((a, b) => a.display_order - b.display_order);
  const orderMap = new Map(siblings.map((f, i) => [f.id, i]));
  return fields.map((f) => (orderMap.has(f.id) ? { ...f, display_order: orderMap.get(f.id)! } : f));
}

export function createHistoryState(doc: BuilderDoc): HistoryState {
  return { past: [], present: doc, future: [] };
}

/** Reducer avec historique — utilise par le hook du builder (Ctrl+Z / Ctrl+Shift+Z) */
export function historyReducer(
  state: HistoryState,
  action: BuilderAction | { kind: "UNDO" } | { kind: "REDO" }
): HistoryState {
  if (action.kind === "UNDO") {
    if (state.past.length === 0) return state;
    const previous = state.past[state.past.length - 1];
    return {
      past: state.past.slice(0, -1),
      present: previous,
      future: [state.present, ...state.future],
    };
  }
  if (action.kind === "REDO") {
    if (state.future.length === 0) return state;
    const next = state.future[0];
    return {
      past: [...state.past, state.present],
      present: next,
      future: state.future.slice(1),
    };
  }

  const nextPresent = docReducer(state.present, action as BuilderAction);
  if (nextPresent === state.present) return state;

  return {
    past: [...state.past, state.present].slice(-MAX_HISTORY),
    present: nextPresent,
    future: [],
  };
}

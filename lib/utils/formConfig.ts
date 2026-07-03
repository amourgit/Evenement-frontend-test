import type { EventTheme, EventAIConfig, EventStatus } from "@/src/types/event";
import { DEFAULT_EVENT_THEME, DEFAULT_AI_CONFIG } from "@/src/types/event";
import type { FieldDefinition, FieldSection } from "@/src/types/field";
import type { FormConfiguration } from "@/src/types/formConfig";
import { FORM_CONFIG_FORMAT, FORM_CONFIG_SCHEMA_VERSION } from "@/src/types/formConfig";

const APP_NAME = "CIVITAS Forms Builder";
const APP_VERSION = "0.1.0";

export interface EventMetaDraft {
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
}

/** Etat complet edite dans le builder — c'est la source de verite locale */
export interface BuilderDoc {
  event: EventMetaDraft;
  theme: EventTheme;
  ai_config: EventAIConfig;
  sections: FieldSection[];
  fields: FieldDefinition[];
}

/**
 * Hash deterministe simple (FNV-1a, 32 bits) — suffisant pour detecter une
 * corruption/alteration accidentelle d'un fichier de configuration importe.
 * Ce n'est PAS un hash cryptographique et ne remplace pas une validation
 * d'integrite cote serveur.
 */
function fnv1aHash(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

interface BuildOptions {
  sourceEventId?: string | null;
  clonedFromEventId?: string | null;
}

/**
 * Construit le JSON complet et structure d'une configuration a partir de
 * l'etat du builder. Fonction PURE : aucun effet de bord, aucun appel reseau.
 * C'est ce JSON, tel quel, qui est envoye au backend a l'enregistrement.
 */
export function buildFormConfiguration(doc: BuilderDoc, options: BuildOptions = {}): FormConfiguration {
  const sortedSections = [...doc.sections].sort((a, b) => a.display_order - b.display_order);
  const sortedFields = [...doc.fields].sort((a, b) => a.display_order - b.display_order);

  const stats = {
    sections_count: sortedSections.length,
    fields_count: sortedFields.length,
    required_fields_count: sortedFields.filter((f) => f.is_required).length,
    unique_fields_count: sortedFields.filter((f) => f.is_unique).length,
  };

  const payloadForChecksum = JSON.stringify({
    event: doc.event,
    theme: doc.theme,
    ai_config: doc.ai_config,
    sections: sortedSections,
    fields: sortedFields,
  });

  return {
    meta: {
      format: FORM_CONFIG_FORMAT,
      schema_version: FORM_CONFIG_SCHEMA_VERSION,
      generated_at: new Date().toISOString(),
      generated_by: { app: APP_NAME, app_version: APP_VERSION },
      source_event_id: options.sourceEventId ?? doc.event.id,
      cloned_from_event_id: options.clonedFromEventId ?? null,
      checksum: fnv1aHash(payloadForChecksum),
      stats,
    },
    event: {
      id: doc.event.id,
      slug: doc.event.slug,
      title: doc.event.title,
      short_description: doc.event.short_description,
      long_description: doc.event.long_description,
      status: doc.event.status,
      starts_at: doc.event.starts_at,
      ends_at: doc.event.ends_at,
      registration_deadline: doc.event.registration_deadline,
      capacity: doc.event.capacity,
    },
    theme: doc.theme,
    ai_config: doc.ai_config,
    sections: sortedSections,
    fields: sortedFields,
  };
}

/** Recalcule le checksum d'une configuration deja construite (utile apres edition manuelle du JSON) */
export function recomputeChecksum(config: FormConfiguration): string {
  const payload = JSON.stringify({
    event: config.event,
    theme: config.theme,
    ai_config: config.ai_config,
    sections: config.sections,
    fields: config.fields,
  });
  return fnv1aHash(payload);
}

export function verifyChecksum(config: FormConfiguration): boolean {
  return recomputeChecksum(config) === config.meta.checksum;
}

/** Declenche le telechargement du JSON de configuration dans le navigateur */
export function downloadFormConfiguration(config: FormConfiguration) {
  const json = JSON.stringify(config, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const filename = `${config.event.slug || "evenement"}.civitas-config.json`;
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export class InvalidConfigurationError extends Error {}

/** Valide la forme minimale attendue d'un fichier importe avant de s'en servir */
function assertValidConfiguration(data: unknown): asserts data is FormConfiguration {
  if (!data || typeof data !== "object") {
    throw new InvalidConfigurationError("Le fichier n'est pas un JSON valide.");
  }
  const obj = data as Record<string, unknown>;
  if (obj.meta === undefined || (obj.meta as any)?.format !== FORM_CONFIG_FORMAT) {
    throw new InvalidConfigurationError(
      "Ce fichier n'est pas une configuration CIVITAS Forms reconnue."
    );
  }
  if (!obj.event || !Array.isArray(obj.sections) || !Array.isArray(obj.fields)) {
    throw new InvalidConfigurationError("La configuration est incomplete (event/sections/fields manquants).");
  }
}

/** Lit et valide un fichier .json importe par l'utilisateur */
export async function parseFormConfigurationFile(file: File): Promise<FormConfiguration> {
  const text = await file.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new InvalidConfigurationError("Le fichier n'a pas pu etre lu comme du JSON.");
  }
  assertValidConfiguration(data);
  // On n'empeche pas l'import si le checksum ne correspond plus (le fichier
  // a pu etre edite volontairement) — c'est a l'appelant d'avertir
  // l'utilisateur via verifyChecksum() avant d'appliquer la configuration.
  return data;
}

/** Etat vierge du builder pour la creation d'un tout nouvel evenement */
export function createBlankBuilderDoc(): BuilderDoc {
  return {
    event: {
      id: null,
      slug: "",
      title: "",
      short_description: "",
      long_description: "",
      status: "draft",
      starts_at: null,
      ends_at: null,
      registration_deadline: null,
      capacity: null,
    },
    theme: { ...DEFAULT_EVENT_THEME },
    ai_config: { ...DEFAULT_AI_CONFIG },
    sections: [],
    fields: [],
  };
}

/**
 * Convertit une configuration recuperee depuis le backend (chargement normal
 * d'un evenement existant) en BuilderDoc, SANS regenerer les identifiants —
 * contrairement a hydrateBuilderDocFromConfiguration qui sert au clonage/import.
 */
export function configToBuilderDoc(config: FormConfiguration): BuilderDoc {
  return {
    event: { ...config.event },
    theme: config.theme,
    ai_config: config.ai_config,
    sections: config.sections,
    fields: config.fields,
  };
}

/**
 * Convertit une configuration importee/clonee en BuilderDoc pret a etre
 * charge dans l'editeur. Regenere systematiquement les identifiants locaux
 * de sections/champs pour eviter toute collision avec l'evenement cible,
 * et reattache les references `section_id` correspondantes.
 */
export function hydrateBuilderDocFromConfiguration(
  config: FormConfiguration,
  targetEventId: string | null = null
): BuilderDoc {
  const sectionIdMap = new Map<string, string>();
  const sections: FieldSection[] = config.sections.map((s) => {
    const newId = crypto.randomUUID();
    sectionIdMap.set(s.id, newId);
    return { ...s, id: newId, event_id: targetEventId ?? "" };
  });

  const fields: FieldDefinition[] = config.fields.map((f) => ({
    ...f,
    id: crypto.randomUUID(),
    event_id: targetEventId ?? "",
    section_id: f.section_id ? sectionIdMap.get(f.section_id) ?? null : null,
  }));

  return {
    event: {
      id: targetEventId,
      slug: targetEventId ? config.event.slug : `${config.event.slug || "evenement"}-copie`,
      title: targetEventId ? config.event.title : `${config.event.title} (copie)`,
      short_description: config.event.short_description,
      long_description: config.event.long_description,
      status: "draft",
      starts_at: config.event.starts_at,
      ends_at: config.event.ends_at,
      registration_deadline: config.event.registration_deadline,
      capacity: config.event.capacity,
    },
    theme: config.theme,
    ai_config: config.ai_config,
    sections,
    fields,
  };
}

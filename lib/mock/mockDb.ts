import seed from "./db.seed.json";
import type { EventRecord } from "@/types/event";
import type { AIPromptSource } from "@/types/ai";
import type { SubmissionRecord } from "@/types/submission";

/**
 * BASE DE DONNEES FICTIVE (mode developpement)
 * =============================================
 * Tant que `VITE_USE_MOCK_API=true` (valeur par defaut en dev, voir
 * lib/api/config.ts), AUCUN appel reseau n'est fait : toutes les donnees
 * lues/ecrites par l'application transitent par ce store en memoire,
 * initialise depuis src/mock/db.seed.json et persiste dans le
 * localStorage du navigateur pour survivre aux rechargements de page.
 *
 * Comptes de test (voir db.seed.json) :
 *   - admin@civitas.test     / Admin!2026     (owner, 2 evenements)
 *   - editrice@civitas.test  / Editrice!2026   (editor, 1 evenement)
 *   - viewer@civitas.test    / Viewer!2026     (viewer, aucun evenement)
 */

export interface MockAdmin {
  id: string;
  email: string;
  password: string;
  full_name: string;
  role: "owner" | "editor" | "viewer";
  created_at: string;
}

export interface MockDb {
  admins: MockAdmin[];
  events: EventRecord[];
  submissions: SubmissionRecord[];
  ai_prompt_sources: AIPromptSource[];
}

const STORAGE_KEY = "civitas_mock_db_v1";
const SEED_VERSION = (seed as any).meta?.seed_version ?? "1.0.0";

function cloneSeedAsDb(): MockDb {
  const raw = JSON.parse(JSON.stringify(seed)) as typeof seed;
  return {
    admins: raw.admins as MockAdmin[],
    events: raw.events as unknown as EventRecord[],
    submissions: raw.submissions as unknown as SubmissionRecord[],
    ai_prompt_sources: raw.ai_prompt_sources as unknown as AIPromptSource[],
  };
}

let cachedDb: MockDb | null = null;

function loadFromStorage(): MockDb | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { version: string; db: MockDb };
    if (parsed.version !== SEED_VERSION) return null; // seed a evolue : on repart de zero
    return parsed.db;
  } catch {
    return null;
  }
}

function persist(db: MockDb) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: SEED_VERSION, db }));
  } catch {
    // stockage indisponible (mode prive, quota...) — on continue en memoire uniquement
  }
}

/** Recupere le store courant, l'initialise depuis le seed au premier appel */
export function getDb(): MockDb {
  if (cachedDb) return cachedDb;
  cachedDb = loadFromStorage() ?? cloneSeedAsDb();
  if (!loadFromStorage()) persist(cachedDb);
  return cachedDb;
}

/** A appeler apres toute mutation du store pour la persister */
export function saveDb(db: MockDb) {
  cachedDb = db;
  persist(db);
}

/** Reinitialise entierement la base fictive a son etat d'origine (bouton "Reinitialiser" en dev) */
export function resetMockDb(): MockDb {
  const fresh = cloneSeedAsDb();
  cachedDb = fresh;
  persist(fresh);
  return fresh;
}

/** Simule une latence reseau realiste pour un rendu d'interface credible */
export function mockDelay(ms = 320): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function newId(prefix: string): string {
  const rand = crypto.randomUUID().split("-")[0];
  return `${prefix}_${rand}`;
}

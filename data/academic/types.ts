// ============================================================
// data/academic/types.ts
// Modèle de la hiérarchie académique EDUGABON.
// Organisation (tenant, déjà déterminée par le sous-domaine)
//    → Établissement → Département → Filière → Parcours
//
// Chaque entité est définie séparément, comme les ressources
// distinctes d'une API backend (un type = un endpoint).
// ============================================================

export type AcademicNodeType =
  | 'ESTABLISHMENT'
  | 'DEPARTMENT'
  | 'PROGRAM'
  | 'TRACK';

export type DegreeLevel = 'LICENCE' | 'MASTER' | 'DOCTORAT';

/** Enveloppe générique imitant une réponse brute d'API paginée */
export interface BackendListResponse<T> {
  data: T[];
  meta: {
    total: number;
    source: string;
    fetchedAt: string;
  };
}

// ── Établissement (Faculté / Institut / École) ──────────────
export interface Establishment {
  id: string;
  code: string;
  name: string;
  shortName: string;
  type: 'FACULTY' | 'INSTITUTE' | 'SCHOOL';
  description?: string;
  isActive: boolean;
  createdAt: string;
}

// ── Département ──────────────────────────────────────────────
export interface Department {
  id: string;
  establishmentId: string;
  code: string;
  name: string;
  headOfDepartment?: string;
  isActive: boolean;
  createdAt: string;
}

// ── Filière (Program) ────────────────────────────────────────
export interface Program {
  id: string;
  departmentId: string;
  code: string;
  name: string;
  degreeLevel: DegreeLevel;
  durationYears: number;
  isActive: boolean;
  createdAt: string;
}

// ── Parcours (Track) ─────────────────────────────────────────
export interface Track {
  id: string;
  programId: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

/**
 * Nœud unifié de l'arbre de navigation, tel que recommandé :
 * chaque colonne du méga menu affiche une liste de ContextNode.
 */
export interface AcademicContextNode {
  id: string;
  parentId?: string;
  type: AcademicNodeType;
  name: string;
  code: string;
  hasChildren: boolean;
  /** Chemin lisible complet, de l'établissement jusqu'à ce nœud */
  path: string[];
  /** Métadonnées propres au type d'entité (degreeLevel, headOfDepartment, ...) */
  meta?: Record<string, unknown>;
  /** Enfants déjà résolus (l'arbre est construit en une fois par getAcademicContextTree) */
  children?: AcademicContextNode[];
}

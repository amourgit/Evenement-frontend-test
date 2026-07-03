// ============================================================
// data/academic/programs.ts
// Ressource "filières" — imite la réponse brute de
// GET /api/academic/programs
// ============================================================

import type { BackendListResponse, Program } from './types';

const PROGRAMS: Program[] = [
  // Département Informatique (dep_info)
  {
    id: 'prog_genie_logiciel',
    departmentId: 'dep_info',
    code: 'GL',
    name: 'Génie Logiciel',
    degreeLevel: 'LICENCE',
    durationYears: 3,
    isActive: true,
    createdAt: '2019-09-10T00:00:00.000Z',
  },
  {
    id: 'prog_reseaux_telecom',
    departmentId: 'dep_info',
    code: 'RT',
    name: 'Réseaux & Télécom',
    degreeLevel: 'LICENCE',
    durationYears: 3,
    isActive: true,
    createdAt: '2019-09-10T00:00:00.000Z',
  },
  {
    id: 'prog_data_science',
    departmentId: 'dep_info',
    code: 'DS',
    name: 'Data Science',
    degreeLevel: 'MASTER',
    durationYears: 2,
    isActive: true,
    createdAt: '2022-09-01T00:00:00.000Z',
  },

  // Département Mathématiques (dep_maths)
  {
    id: 'prog_maths_appliquees',
    departmentId: 'dep_maths',
    code: 'MA',
    name: 'Mathématiques Appliquées',
    degreeLevel: 'LICENCE',
    durationYears: 3,
    isActive: true,
    createdAt: '2019-09-10T00:00:00.000Z',
  },

  // Département Physique (dep_physique)
  {
    id: 'prog_physique_energie',
    departmentId: 'dep_physique',
    code: 'PE',
    name: 'Physique & Énergies Renouvelables',
    degreeLevel: 'LICENCE',
    durationYears: 3,
    isActive: true,
    createdAt: '2019-09-10T00:00:00.000Z',
  },

  // Département Droit Privé (dep_droit_prive)
  {
    id: 'prog_droit_affaires',
    departmentId: 'dep_droit_prive',
    code: 'DAFF',
    name: 'Droit des Affaires',
    degreeLevel: 'MASTER',
    durationYears: 2,
    isActive: true,
    createdAt: '2019-09-10T00:00:00.000Z',
  },

  // Département Droit Public (dep_droit_public)
  {
    id: 'prog_sciences_politiques',
    departmentId: 'dep_droit_public',
    code: 'SPOL',
    name: 'Sciences Politiques',
    degreeLevel: 'LICENCE',
    durationYears: 3,
    isActive: true,
    createdAt: '2019-09-10T00:00:00.000Z',
  },

  // Département Médecine Générale (dep_medecine_generale)
  {
    id: 'prog_medecine',
    departmentId: 'dep_medecine_generale',
    code: 'MED',
    name: 'Médecine',
    degreeLevel: 'DOCTORAT',
    durationYears: 7,
    isActive: true,
    createdAt: '2020-01-25T00:00:00.000Z',
  },

  // Département Pharmacie (dep_pharmacie)
  {
    id: 'prog_pharmacie',
    departmentId: 'dep_pharmacie',
    code: 'PHA',
    name: 'Pharmacie',
    degreeLevel: 'DOCTORAT',
    durationYears: 6,
    isActive: true,
    createdAt: '2020-01-25T00:00:00.000Z',
  },

  // Département Réseaux & Systèmes (dep_reseaux)
  {
    id: 'prog_admin_systemes',
    departmentId: 'dep_reseaux',
    code: 'AS',
    name: 'Administration Systèmes & Réseaux',
    degreeLevel: 'LICENCE',
    durationYears: 2,
    isActive: true,
    createdAt: '2021-03-20T00:00:00.000Z',
  },
];

export function fetchPrograms(departmentId?: string): BackendListResponse<Program> {
  const data = departmentId
    ? PROGRAMS.filter(p => p.departmentId === departmentId)
    : PROGRAMS;

  return {
    data,
    meta: {
      total: data.length,
      source: 'academic-context-service',
      fetchedAt: new Date().toISOString(),
    },
  };
}

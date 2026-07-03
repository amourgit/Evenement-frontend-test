// ============================================================
// data/academic/departments.ts
// Ressource "départements" — imite la réponse brute de
// GET /api/academic/departments
// ============================================================

import type { BackendListResponse, Department } from './types';

const DEPARTMENTS: Department[] = [
  // Faculté des Sciences (est_sciences)
  {
    id: 'dep_info',
    establishmentId: 'est_sciences',
    code: 'INFO',
    name: 'Informatique',
    headOfDepartment: 'Pr. Ondo Nzé',
    isActive: true,
    createdAt: '2019-09-05T00:00:00.000Z',
  },
  {
    id: 'dep_maths',
    establishmentId: 'est_sciences',
    code: 'MATH',
    name: 'Mathématiques',
    headOfDepartment: 'Pr. Mba Allogho',
    isActive: true,
    createdAt: '2019-09-05T00:00:00.000Z',
  },
  {
    id: 'dep_physique',
    establishmentId: 'est_sciences',
    code: 'PHYS',
    name: 'Physique',
    headOfDepartment: 'Pr. Ella Nguema',
    isActive: true,
    createdAt: '2019-09-05T00:00:00.000Z',
  },

  // Faculté de Droit (est_droit)
  {
    id: 'dep_droit_prive',
    establishmentId: 'est_droit',
    code: 'DPRIV',
    name: 'Droit Privé',
    headOfDepartment: 'Pr. Nguema Obame',
    isActive: true,
    createdAt: '2019-09-05T00:00:00.000Z',
  },
  {
    id: 'dep_droit_public',
    establishmentId: 'est_droit',
    code: 'DPUB',
    name: 'Droit Public',
    headOfDepartment: 'Pr. Assoumou Bibang',
    isActive: true,
    createdAt: '2019-09-05T00:00:00.000Z',
  },

  // Faculté de Médecine (est_medecine)
  {
    id: 'dep_medecine_generale',
    establishmentId: 'est_medecine',
    code: 'MGEN',
    name: 'Médecine Générale',
    headOfDepartment: 'Pr. Bongo Ondimba',
    isActive: true,
    createdAt: '2020-01-20T00:00:00.000Z',
  },
  {
    id: 'dep_pharmacie',
    establishmentId: 'est_medecine',
    code: 'PHARM',
    name: 'Pharmacie',
    headOfDepartment: 'Pr. Moussavou Ivanga',
    isActive: true,
    createdAt: '2020-01-20T00:00:00.000Z',
  },

  // Institut Technologique (est_tech)
  {
    id: 'dep_reseaux',
    establishmentId: 'est_tech',
    code: 'RES',
    name: 'Réseaux & Systèmes',
    headOfDepartment: 'M. Nze Bekale',
    isActive: true,
    createdAt: '2021-03-15T00:00:00.000Z',
  },
];

export function fetchDepartments(establishmentId?: string): BackendListResponse<Department> {
  const data = establishmentId
    ? DEPARTMENTS.filter(d => d.establishmentId === establishmentId)
    : DEPARTMENTS;

  return {
    data,
    meta: {
      total: data.length,
      source: 'academic-context-service',
      fetchedAt: new Date().toISOString(),
    },
  };
}

// ============================================================
// data/academic/establishments.ts
// Ressource "établissements" — imite la réponse brute de
// GET /api/academic/establishments
// ============================================================

import type { BackendListResponse, Establishment } from './types';

const ESTABLISHMENTS: Establishment[] = [
  {
    id: 'est_sciences',
    code: 'FS',
    name: 'Faculté des Sciences',
    shortName: 'Sciences',
    type: 'FACULTY',
    description: 'Sciences fondamentales, informatique et technologies.',
    isActive: true,
    createdAt: '2019-09-01T00:00:00.000Z',
  },
  {
    id: 'est_droit',
    code: 'FD',
    name: 'Faculté de Droit et Sciences Politiques',
    shortName: 'Droit',
    type: 'FACULTY',
    description: 'Droit privé, droit public et sciences politiques.',
    isActive: true,
    createdAt: '2019-09-01T00:00:00.000Z',
  },
  {
    id: 'est_medecine',
    code: 'FM',
    name: 'Faculté de Médecine',
    shortName: 'Médecine',
    type: 'FACULTY',
    description: 'Sciences médicales et paramédicales.',
    isActive: true,
    createdAt: '2020-01-15T00:00:00.000Z',
  },
  {
    id: 'est_tech',
    code: 'IT',
    name: 'Institut Technologique',
    shortName: 'Institut Tech',
    type: 'INSTITUTE',
    description: 'Formations technologiques courtes et professionnalisantes.',
    isActive: true,
    createdAt: '2021-03-10T00:00:00.000Z',
  },
];

export function fetchEstablishments(): BackendListResponse<Establishment> {
  return {
    data: ESTABLISHMENTS,
    meta: {
      total: ESTABLISHMENTS.length,
      source: 'academic-context-service',
      fetchedAt: new Date().toISOString(),
    },
  };
}

// ============================================================
// data/academic/tracks.ts
// Ressource "parcours" — imite la réponse brute de
// GET /api/academic/tracks
// ============================================================

import type { BackendListResponse, Track } from './types';

const TRACKS: Track[] = [
  // Filière Génie Logiciel (prog_genie_logiciel)
  {
    id: 'track_dev_web',
    programId: 'prog_genie_logiciel',
    code: 'WEB',
    name: 'Développement Web',
    description: 'Applications web full-stack, architectures modernes.',
    isActive: true,
    createdAt: '2019-09-15T00:00:00.000Z',
  },
  {
    id: 'track_dev_mobile',
    programId: 'prog_genie_logiciel',
    code: 'MOB',
    name: 'Développement Mobile',
    description: 'Applications natives et cross-platform (iOS, Android).',
    isActive: true,
    createdAt: '2019-09-15T00:00:00.000Z',
  },
  {
    id: 'track_ia',
    programId: 'prog_genie_logiciel',
    code: 'IA',
    name: 'Intelligence Artificielle',
    description: 'Machine learning, vision par ordinateur, NLP.',
    isActive: true,
    createdAt: '2022-09-01T00:00:00.000Z',
  },

  // Filière Réseaux & Télécom (prog_reseaux_telecom)
  {
    id: 'track_cloud',
    programId: 'prog_reseaux_telecom',
    code: 'CLOUD',
    name: 'Cloud Computing',
    description: 'Infrastructures cloud, virtualisation, DevOps.',
    isActive: true,
    createdAt: '2021-09-01T00:00:00.000Z',
  },
  {
    id: 'track_cybersecurite',
    programId: 'prog_reseaux_telecom',
    code: 'CYBER',
    name: 'Cybersécurité',
    description: 'Sécurité des réseaux et des systèmes d\'information.',
    isActive: true,
    createdAt: '2021-09-01T00:00:00.000Z',
  },

  // Filière Droit des Affaires (prog_droit_affaires)
  {
    id: 'track_droit_bancaire',
    programId: 'prog_droit_affaires',
    code: 'DBANK',
    name: 'Droit Bancaire & Financier',
    isActive: true,
    createdAt: '2019-09-15T00:00:00.000Z',
  },
];

export function fetchTracks(programId?: string): BackendListResponse<Track> {
  const data = programId
    ? TRACKS.filter(t => t.programId === programId)
    : TRACKS;

  return {
    data,
    meta: {
      total: data.length,
      source: 'academic-context-service',
      fetchedAt: new Date().toISOString(),
    },
  };
}

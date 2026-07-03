// ============================================================
// data/academic/index.ts
// Assemble les 4 ressources indépendantes (établissements,
// départements, filières, parcours) en un arbre de navigation
// unifié (AcademicContextNode), consommé par le méga menu en
// cascade de la TopBar.
//
// Chaque ressource reste isolée (fichier + fonction fetch dédiés,
// comme des endpoints backend distincts) ; c'est uniquement ici
// qu'on les relie entre elles via parentId.
// ============================================================

import { fetchEstablishments } from './establishments';
import { fetchDepartments } from './departments';
import { fetchPrograms } from './programs';
import { fetchTracks } from './tracks';
import type { AcademicContextNode } from './types';

export type {
  AcademicContextNode,
  AcademicNodeType,
  Establishment as AcademicEstablishment,
  Department as AcademicDepartment,
  Program as AcademicProgram,
  Track as AcademicTrack,
} from './types';

/**
 * Construit l'arbre complet Établissement → Département → Filière → Parcours.
 * Ne garde que les entités actives (isActive: true), comme le ferait
 * un vrai endpoint de résolution de contexte académique.
 */
export function getAcademicContextTree(): AcademicContextNode[] {
  const establishments = fetchEstablishments().data.filter(e => e.isActive);
  const departments = fetchDepartments().data.filter(d => d.isActive);
  const programs = fetchPrograms().data.filter(p => p.isActive);
  const tracks = fetchTracks().data.filter(t => t.isActive);

  return establishments.map((est): AcademicContextNode => {
    const estDepartments = departments.filter(d => d.establishmentId === est.id);

    const departmentNodes: AcademicContextNode[] = estDepartments.map((dep) => {
      const depPrograms = programs.filter(p => p.departmentId === dep.id);

      const programNodes: AcademicContextNode[] = depPrograms.map((prog) => {
        const progTracks = tracks.filter(t => t.programId === prog.id);

        const trackNodes: AcademicContextNode[] = progTracks.map((track) => ({
          id: track.id,
          parentId: prog.id,
          type: 'TRACK',
          name: track.name,
          code: track.code,
          hasChildren: false,
          path: [est.shortName, dep.name, prog.name, track.name],
          meta: { description: track.description },
        }));

        return {
          id: prog.id,
          parentId: dep.id,
          type: 'PROGRAM',
          name: prog.name,
          code: prog.code,
          hasChildren: trackNodes.length > 0,
          path: [est.shortName, dep.name, prog.name],
          meta: { degreeLevel: prog.degreeLevel, durationYears: prog.durationYears },
          children: trackNodes,
        };
      });

      return {
        id: dep.id,
        parentId: est.id,
        type: 'DEPARTMENT',
        name: dep.name,
        code: dep.code,
        hasChildren: programNodes.length > 0,
        path: [est.shortName, dep.name],
        meta: { headOfDepartment: dep.headOfDepartment },
        children: programNodes,
      };
    });

    return {
      id: est.id,
      type: 'ESTABLISHMENT',
      name: est.name,
      code: est.code,
      hasChildren: departmentNodes.length > 0,
      path: [est.shortName],
      meta: { type: est.type },
      children: departmentNodes,
    };
  });
}

/**
 * Client HTTP legacy pour compatibilité avec les APIs mockées.
 * 
 * Ce fichier contient les fonctions localStorage de l'ancienne architecture
 * pour permettre aux APIs mockées de fonctionner. Ces fonctions sont utilisées
 * uniquement en mode développement/mock et ne devraient pas être utilisées en production.
 * 
 * Pour les requêtes HTTP réelles, utilisez lib/http-client.ts qui utilise
 * tokenManager et Keycloak pour une authentification sécurisée.
 */

import { Event } from '../../src/types/event';
import { Submission } from '../../src/types/submission';
import { User } from '../../src/types/user';

// Local storage keys
const EVENTS_KEY = 'civitas_events';
const SUBMISSIONS_KEY = 'civitas_submissions';
const USERS_KEY = 'civitas_users';
const CURRENT_USER_KEY = 'civitas_current_user';

// Mock Events Initial Seed
const SEED_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Forum des Associations de la Ville 2026',
    description: 'Participez au grand rassemblement annuel des associations culturelles, sportives et humanitaires de notre commune. Réservez votre stand ou inscrivez-vous en tant que bénévole en remplissant ce formulaire de candidature d\'inscription.',
    shortDescription: 'Inscriptions des exposants et des bénévoles pour la rentrée associative commune.',
    date: '2026-09-12',
    location: 'Gymnase Omnisports Central, Allée des Sports',
    category: 'Citoyenneté & Vie Locale',
    status: 'published',
    organizer: 'Mairie de Civitas - Service Associations',
    theme: {
      primaryColor: '#0078d4',
      backgroundColor: '#f3f2f1',
      cardStyle: 'rounded',
      bannerUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
      fontFamily: 'Inter'
    },
    sections: [
      { id: 'sec_1', title: 'Informations Générales de l\'Association', order: 1 },
      { id: 'sec_2', title: 'Besoins Logistiques & Matériel', order: 2 },
      { id: 'sec_3', title: 'Engagement et Sécurité', order: 3 }
    ],
    fields: [
      {
        id: 'f1_1',
        type: 'text',
        label: 'Nom officiel de l\'Association',
        placeholder: 'Ex: Les Amis de la Musique Civitas',
        validation: { required: true },
        sectionId: 'sec_1',
        order: 1
      },
      {
        id: 'f1_2',
        type: 'email',
        label: 'Adresse email de contact principal',
        placeholder: 'Ex: contact@monasso.fr',
        validation: { required: true, pattern: '^\\S+@\\S+\\.\\S+$', errorMessage: 'Format d\'adresse email invalide.' },
        sectionId: 'sec_1',
        order: 2
      },
      {
        id: 'f1_3',
        type: 'select',
        label: 'Thématique ou domaine d\'activité',
        options: ['Sport', 'Culture & Musique', 'Solidarité & Humanitaire', 'Loisirs & Environnement'],
        validation: { required: true },
        sectionId: 'sec_1',
        order: 3
      },
      {
        id: 'f1_4',
        type: 'textarea',
        label: 'Brève description de vos activités et de votre stand',
        placeholder: 'Saisissez ici le descriptif de vos activités...',
        validation: { required: true, min: 10 },
        sectionId: 'sec_1',
        order: 4
      },
      {
        id: 'f1_5',
        type: 'number',
        label: 'Nombre de tables souhaitées (L: 2m)',
        defaultValue: '1',
        validation: { required: true, min: 1, max: 4 },
        sectionId: 'sec_2',
        order: 1
      },
      {
        id: 'f1_6',
        type: 'checkbox',
        label: 'Besoin d\'un raccordement électrique (220V)',
        validation: { required: false },
        sectionId: 'sec_2',
        order: 2
      },
      {
        id: 'f1_7',
        type: 'radio',
        label: 'Type d\'emplacement désiré',
        options: ['Intérieur (Gymnase)', 'Extérieur (Parvis sous chapiteau)'],
        defaultValue: 'Intérieur (Gymnase)',
        validation: { required: true },
        sectionId: 'sec_2',
        order: 3
      },
      {
        id: 'f1_8',
        type: 'checkbox',
        label: 'Je certifie avoir lu et approuvé le règlement intérieur de sécurité du gymnase.',
        validation: { required: true, errorMessage: 'Vous devez approuver le règlement.' },
        sectionId: 'sec_3',
        order: 1
      }
    ],
    createdAt: '2026-07-01T10:00:00Z',
    updatedAt: '2026-07-01T10:00:00Z'
  },
  {
    id: 'e2',
    title: 'Fête de la Musique Civitas 2026',
    description: 'La commission culturelle organise le grand concert de la Fête de la Musique ! Groupes locaux, chorales, fanfares et solistes : déposez votre candidature pour vous produire sur l\'une des 5 scènes ouvertes installées dans les parcs et places de la ville.',
    shortDescription: 'Appel aux artistes et groupes locaux pour les scènes ouvertes de la Fête de la Musique.',
    date: '2026-06-21',
    location: 'Places publiques de Civitas',
    category: 'Culture & Événementiel',
    status: 'published',
    organizer: 'Direction des Affaires Culturelles de Civitas',
    theme: {
      primaryColor: '#a4371b',
      backgroundColor: '#fdf3f0',
      cardStyle: 'bordered',
      bannerUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80',
      fontFamily: 'Inter'
    },
    sections: [
      { id: 'sec_m1', title: 'Présentation de l\'Artiste / Groupe', order: 1 },
      { id: 'sec_m2', title: 'Fiche Technique & Setlist', order: 2 }
    ],
    fields: [
      {
        id: 'fm_1',
        type: 'text',
        label: 'Nom de scène du Groupe / Artiste',
        placeholder: 'Ex: The Rocking Citizens',
        validation: { required: true },
        sectionId: 'sec_m1',
        order: 1
      },
      {
        id: 'fm_2',
        type: 'select',
        label: 'Style musical principal',
        options: ['Rock / Métal', 'Pop / Folk', 'Jazz / Blues', 'Chanson Française', 'Classique / Chorale', 'Électro / Hip-Hop'],
        validation: { required: true },
        sectionId: 'sec_m1',
        order: 2
      },
      {
        id: 'fm_3',
        type: 'number',
        label: 'Nombre de musiciens présents sur scène',
        defaultValue: '1',
        validation: { required: true, min: 1, max: 20 },
        sectionId: 'sec_m1',
        order: 3
      },
      {
        id: 'fm_4',
        type: 'textarea',
        label: 'Liste du matériel de sonorisation et d\'amplification requis',
        placeholder: 'Ex: 3 micros chant, 2 retours, 1 alimentation DI guitare...',
        validation: { required: true },
        sectionId: 'sec_m2',
        order: 1
      },
      {
        id: 'fm_5',
        type: 'text',
        label: 'Durée estimée de votre prestation (en minutes)',
        defaultValue: '45',
        validation: { required: true },
        sectionId: 'sec_m2',
        order: 2
      }
    ],
    createdAt: '2026-06-15T09:00:00Z',
    updatedAt: '2026-06-15T09:00:00Z'
  },
  {
    id: 'e3',
    title: 'Conseil Municipal de Rentrée - Séance d\'Interpellation Citoyenne',
    description: 'Inscrivez-vous pour assister à la séance publique du conseil municipal et réservez votre temps de parole pour poser une question directe à l\'équipe municipale concernant les aménagements urbains et la transition écologique locale.',
    shortDescription: 'Inscription du public et questions citoyennes posées aux élus municipaux.',
    date: '2026-09-05',
    location: 'Hôtel de Ville de Civitas, Salle des Délibérations',
    category: 'Citoyenneté & Vie Locale',
    status: 'published',
    organizer: 'Mairie de Civitas - Secrétariat Général',
    theme: {
      primaryColor: '#107c41',
      backgroundColor: '#f0f9f4',
      cardStyle: 'flat',
      bannerUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
      fontFamily: 'Inter'
    },
    sections: [
      { id: 'sec_c1', title: 'Vos Coordonnées Citoyennes', order: 1 },
      { id: 'sec_c2', title: 'Votre Question aux Élus', order: 2 }
    ],
    fields: [
      {
        id: 'fc_1',
        type: 'text',
        label: 'Nom complet du citoyen ou de la citoyenne',
        placeholder: 'Ex: Jean Dupont',
        validation: { required: true },
        sectionId: 'sec_c1',
        order: 1
      },
      {
        id: 'fc_2',
        type: 'text',
        label: 'Quartier de résidence principal',
        placeholder: 'Ex: Centre-Ville, Quartier de la Gare, Les Plaines',
        validation: { required: true },
        sectionId: 'sec_c1',
        order: 2
      },
      {
        id: 'fc_3',
        type: 'textarea',
        label: 'Texte complet de la question ou de l\'intervention prévue',
        placeholder: 'Veuillez rédiger précisément la question que vous souhaitez aborder devant le conseil...',
        validation: { required: true, max: 1000 },
        sectionId: 'sec_c2',
        order: 1
      },
      {
        id: 'fc_4',
        type: 'checkbox',
        label: 'Je demande l\'autorisation d\'enregistrer en audio/vidéo ma prise de parole.',
        validation: { required: false },
        sectionId: 'sec_c2',
        order: 2
      }
    ],
    createdAt: '2026-06-25T14:00:00Z',
    updatedAt: '2026-06-25T14:00:00Z'
  }
];

// Mock Submissions Initial Seed
const SEED_SUBMISSIONS: Submission[] = [
  {
    id: 's1',
    eventId: 'e1',
    answers: {
      f1_1: 'La Chorale de Civitas',
      f1_2: 'chorale@civitas.org',
      f1_3: 'Culture & Musique',
      f1_4: 'Chant choral polyphonique ouvert à tous les habitants de la commune, répétitions hebdomadaires et concerts réguliers.',
      f1_5: '2',
      f1_6: true,
      f1_7: 'Intérieur (Gymnase)',
      f1_8: true
    },
    submittedAt: '2026-07-02T10:00:00Z',
    status: 'approved'
  },
  {
    id: 's2',
    eventId: 'e1',
    answers: {
      f1_1: 'Civitas Vélo Club',
      f1_2: 'veloclub@gmail.com',
      f1_3: 'Sport',
      f1_4: 'Club cyclotouristique et VTT pour enfants et adultes. Sorties de groupe le dimanche matin, initiation et sécurité routière.',
      f1_5: '1',
      f1_6: false,
      f1_7: 'Extérieur (Parvis sous chapiteau)',
      f1_8: true
    },
    submittedAt: '2026-07-02T11:15:00Z',
    status: 'pending'
  },
  {
    id: 's3',
    eventId: 'e2',
    answers: {
      fm_1: 'Neon Citizens',
      fm_2: 'Rock / Métal',
      fm_3: '4',
      fm_4: '2 micros chant, 1 micro repiquage ampli guitare, 1 liaison basse DI, 4 micros batterie de base.',
      fm_5: '60'
    },
    submittedAt: '2026-07-02T12:00:00Z',
    status: 'approved'
  }
];

// Initialize Storage if empty
export function initDb() {
  if (!localStorage.getItem(EVENTS_KEY)) {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(SEED_EVENTS));
  }
  if (!localStorage.getItem(SUBMISSIONS_KEY)) {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(SEED_SUBMISSIONS));
  }
  if (!localStorage.getItem(USERS_KEY)) {
    const defaultAdmin: User = {
      id: 'admin_1',
      email: 'admin@civitas.fr',
      name: 'Adeline Dubois (Régisseuse Générale)',
      role: 'admin',
      createdAt: '2026-01-01T00:00:00Z'
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([defaultAdmin]));
  }
}

// Getters & Setters
export function getStoredEvents(): Event[] {
  initDb();
  return JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
}

export function saveStoredEvents(events: Event[]) {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

export function getStoredSubmissions(): Submission[] {
  initDb();
  return JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
}

export function saveStoredSubmissions(submissions: Submission[]) {
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
}

export function getStoredUsers(): User[] {
  initDb();
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

export function saveStoredUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getLoggedUser(): User | null {
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  if (!userJson) return null;
  return JSON.parse(userJson);
}

export function setLoggedUser(user: User | null) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

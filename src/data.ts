import { Establishment, Course, AppNotification, AppItem, HelpTopic } from './types';

export const ESTABLISHMENTS: Establishment[] = [
  {
    id: 'general',
    name: 'Espace Général',
    type: 'general',
    logoText: 'EG',
    color: 'indigo',
    domain: 'tenant.edu-general.org',
    address: 'Services administratifs centraux',
    description: 'Portail central du Tenant Éducatif. Vue consolidée, statistiques globales, et configuration des services partagés.',
    stats: {
      students: 4850,
      teachers: 320,
      coursesCount: 145,
    },
    currentUser: {
      id: 'usr_global',
      name: 'Lucas Bernard',
      email: 'l.bernard@tenant-edu.fr',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      profile: 'Administration',
      matricule: 'DIR-782190',
      department: 'Direction Générale'
    }
  },
  {
    id: 'lycee_descartes',
    name: 'Lycée René Descartes',
    type: 'lycee',
    logoText: 'LD',
    color: 'emerald',
    domain: 'descartes.tenant-edu.fr',
    address: '12 Avenue des Sciences, 75005 Paris',
    description: 'Établissement d\'enseignement secondaire d\'excellence, spécialisé dans les parcours scientifiques et littéraires.',
    stats: {
      students: 1200,
      teachers: 85,
      coursesCount: 42,
    },
    currentUser: null, // Initially unauthenticated -> Captive Portal
  },
  {
    id: 'univ_sciences',
    name: 'Université des Sciences & Technologie',
    type: 'university',
    logoText: 'US',
    color: 'sky',
    domain: 'ust.tenant-edu.fr',
    address: 'Avenue de la Recherche, 91400 Orsay',
    description: 'Pôle d\'excellence universitaire de recherche, de technologie et de formation supérieure de haut niveau.',
    stats: {
      students: 3100,
      teachers: 210,
      coursesCount: 88,
    },
    currentUser: null, // Initially unauthenticated -> Captive Portal
  },
  {
    id: 'institut_arts',
    name: 'Institut National des Arts Visuels',
    type: 'institut',
    logoText: 'IA',
    color: 'rose',
    domain: 'arts-visuels.tenant-edu.fr',
    address: '45 Rue du Faubourg Saint-Antoine, 75011 Paris',
    description: 'Académie prestigieuse formant aux arts plastiques, au design numérique et à la scénographie moderne.',
    stats: {
      students: 550,
      teachers: 45,
      coursesCount: 24,
    },
    currentUser: null, // Initially unauthenticated -> Captive Portal
  }
];

export const MOCK_COURSES: Record<string, Course[]> = {
  general: [
    {
      id: 'g1',
      title: 'Introduction au Système d\'Information Tenant',
      code: 'INF-001',
      teacherName: 'Mme. Sophie Laurent (Admin)',
      schedule: 'Lundi 09:00 - 10:30',
      room: 'Vidéoconférence Centrale',
      progress: 90
    },
    {
      id: 'g2',
      title: 'Charte d\'utilisation de la plateforme numérique',
      code: 'CHR-100',
      teacherName: 'M. Jean-Marc Dupont',
      schedule: 'En ligne (Asynchrone)',
      room: 'E-learning',
      progress: 100
    }
  ],
  lycee_descartes: [
    {
      id: 'ld1',
      title: 'Mathématiques Expertes : Analyse et Algèbre',
      code: 'MATH-TS1',
      teacherName: 'M. Pierre Gauthier',
      schedule: 'Mardi 08:30 - 10:30',
      room: 'Salle 302 - Bâtiment A',
      progress: 45
    },
    {
      id: 'ld2',
      title: 'Physique-Chimie : Optique & Thermodynamique',
      code: 'PHYS-TS1',
      teacherName: 'Mme. Hélène Richard',
      schedule: 'Mercredi 14:00 - 17:00 (TP)',
      room: 'Labo Chimie 1',
      progress: 60
    },
    {
      id: 'ld3',
      title: 'Philosophie : La Conscience et le Temps',
      code: 'PHIL-TS1',
      teacherName: 'Mme. Claire Vidal',
      schedule: 'Vendredi 10:45 - 12:45',
      room: 'Salle 112 - Bâtiment C',
      progress: 30
    }
  ],
  univ_sciences: [
    {
      id: 'us1',
      title: 'Algorithmique & Structures de Données Avancées',
      code: 'INFO-M102',
      teacherName: 'Prof. Marc Delmas',
      schedule: 'Lundi 14:00 - 16:30',
      room: 'Amphi Curie',
      progress: 75
    },
    {
      id: 'us2',
      title: 'Calcul Matriciel et Analyse Numérique',
      code: 'MATH-L301',
      teacherName: 'Dr. Audrey Simon',
      schedule: 'Jeudi 09:00 - 11:30',
      room: 'Salle TD 4',
      progress: 50
    },
    {
      id: 'us3',
      title: 'Intelligence Artificielle & Réseaux de Neurones',
      code: 'IA-M204',
      teacherName: 'Prof. Thomas Durand',
      schedule: 'Vendredi 13:30 - 16:30',
      room: 'Amphi Turing',
      progress: 20
    }
  ],
  institut_arts: [
    {
      id: 'ia1',
      title: 'Théorie de la Couleur & Scénographie de l\'Espace',
      code: 'ART-DS1',
      teacherName: 'Mme. Camille Moreau',
      schedule: 'Lundi 10:00 - 13:00',
      room: 'Atelier Peinture 3',
      progress: 80
    },
    {
      id: 'ia2',
      title: 'Modélisation 3D pour les Arts Visuels',
      code: 'ART-NUM3',
      teacherName: 'M. Vincent Roy',
      schedule: 'Jeudi 14:00 - 18:00',
      room: 'Labo Numérique B',
      progress: 40
    }
  ]
};

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'Mise à jour système',
    content: 'La plateforme générale du Tenant sera indisponible pour maintenance ce dimanche de 2h à 4h.',
    time: 'Il y a 10 min',
    isRead: false,
    type: 'info'
  },
  {
    id: 'n2',
    title: 'Nouveau cours ajouté',
    content: 'Le cours "Réseaux et Systèmes" a été planifié pour le semestre prochain.',
    time: 'Il y a 2 h',
    isRead: false,
    type: 'success'
  },
  {
    id: 'n3',
    title: 'Alerte administrative',
    content: 'Pensez à valider votre charte informatique avant la date limite du 15 juillet.',
    time: 'Hier',
    isRead: true,
    type: 'warning'
  }
];

export const MOCK_APPS: AppItem[] = [
  {
    id: 'app_ent',
    name: 'Mon ENT',
    iconName: 'GraduationCap',
    category: 'Scolarité',
    description: 'Espace Numérique de Travail pour suivre vos cours, devoirs et ressources.'
  },
  {
    id: 'app_calendar',
    name: 'Emploi du temps',
    iconName: 'Calendar',
    category: 'Scolarité',
    description: 'Consultez les plannings de cours, examens et réunions d\'établissement.'
  },
  {
    id: 'app_mail',
    name: 'Messagerie',
    iconName: 'Mail',
    category: 'Communication',
    description: 'Échangez avec les enseignants, étudiants et l\'administration de l\'établissement.'
  },
  {
    id: 'app_grades',
    name: 'Relevés de notes',
    iconName: 'Award',
    category: 'Scolarité',
    description: 'Accédez à vos relevés officiels et bulletins de notes périodiques.'
  },
  {
    id: 'app_cloud',
    name: 'Stockage Cloud',
    iconName: 'Cloud',
    category: 'Outils',
    description: 'Espace de stockage partagé de 100 Go pour vos documents scolaires.'
  },
  {
    id: 'app_settings',
    name: 'Gestion Tenant',
    iconName: 'Sliders',
    category: 'Administration',
    description: 'Panneau de configuration globale du Tenant pour les administrateurs.'
  }
];

export const MOCK_HELP: HelpTopic[] = [
  {
    id: 'h1',
    title: 'Comment changer d\'établissement ?',
    content: 'Cliquez sur le bouton tout à gauche de la barre supérieure pour ouvrir la liste des établissements. Sélectionnez celui que vous souhaitez consulter. Si vous n\'êtes pas encore connecté à celui-ci, vous serez redirigé vers son portail captif.'
  },
  {
    id: 'h2',
    title: 'Qu\'est-ce que le profil local ?',
    content: 'Une même personne possède un compte distinct adapté à chaque établissement du tenant (ex. Enseignant dans un lycée, mais Étudiant dans une université du même groupe). Le portail captif vous permet d\'authentifier chaque profil.'
  },
  {
    id: 'h3',
    title: 'Comment utiliser les applications ?',
    content: 'Le lanceur d\'applications (icône de grille tout à droite) vous donne un accès direct aux outils comme l\'ENT, la messagerie, l\'emploi du temps, et le cloud éducatif.'
  }
];

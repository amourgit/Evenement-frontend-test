export interface SharePointPostData {
  id: string;
  category: string;
  title: string;
  author: string;
  authorAvatar: string;
  views: number;
  date: string;
  imageUrl: string;
  headerImg: string;
  
  // Two main top headings & paragraphs
  heading1: string;
  heading1Bold: string;
  heading1Text: string;
  
  heading2: string;
  heading2Bold: string;
  heading2Text: string;
  
  // Slideshow section
  slideshowTitleA: string;
  slideshowImagesA: string[];
  slideshowTitleB: string;
  slideshowImagesB: string[];
  
  // Location/Map section (Left) & Custom Section (Right)
  locationTitle: string;
  locationName: string;
  locationAddress: string;
  locationQuoteTitle: string;
  locationQuoteText: string;
  
  rightSectionTitle: string;
  rightSectionText1: string;
  rightSectionList: string[];
  rightSectionText2: string;
  
  // Bottom Gallery
  galleryImages: string[];
  
  // Detailed Multi-columns section
  bulletsTitle: string;
  bulletsIntro: string;
  bulletsList: string[];
  bulletsOutro: string;
  
  numberedTitle: string;
  numberedIntro: string;
  numberedList: {
    title: string;
    subItems?: string[];
  }[];
  numberedOutro: string;
  
  // Additional Resources
  additionalResources: {
    siteName: string;
    title: string;
    description: string;
    url: string;
  }[];
  
  // Comments
  comments: {
    id: string;
    author: string;
    avatar: string;
    text: string;
    date: string;
  }[];
}

export const SHAREPOINT_POSTS: Record<string, SharePointPostData> = {
  n1: {
    id: 'n1',
    category: 'Campagne d\'Orientation',
    title: 'Objectifs d\'admission post-bac pour l\'année académique 2026',
    author: 'Directeur Académique',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    views: 96,
    date: 'Aujourd\'hui',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=400&q=80',
    headerImg: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    
    heading1: 'S’orienter avec succès : Nouvelles directives d’affectation',
    heading1Bold: 'Pellentesque sodales, nunc sit amet vehicula condimentum, augue lorem porta tortor, id scelerisque felis erat ac augue. Praesent sed justo vitae urna rhoncus aliquet. Suspendisse in pulvinar dolor, eget feugiat augue.',
    heading1Text: 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce tristique elit urna, sed tincidunt ante tristique ut. Nunc vestibulum est nec nisl pellentesque sodales. Praesent ut risus quis nunc pellentesque.',
    
    heading2: 'Rapprocher lycées et filières d’enseignement supérieur',
    heading2Bold: 'Nullam tortor. Suspendisse potenti. Nunc quis turpis eget nulla faucibus molestie. Cras hendrerit erat. Maecenas eu tellus eu velit scelerisque convallis. Sed luctus, nisi sit amet sodales fermentum, sem erat.',
    heading2Text: 'Nam vel neque. Nullam quis sem eu mi hendrerit adipiscing. Sed egestas lobortis mauris. Integer aliquam consectetuer eros. Etiam eu risus. Pellentesque viverra ligula vel risus. Nullam eget neque. Nunc quis turpis eget nulla faucibus molestie.',
    
    slideshowTitleA: 'Diaporama Lycée - A',
    slideshowImagesA: [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'
    ],
    slideshowTitleB: 'Diaporama Lycée - B',
    slideshowImagesB: [
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80'
    ],
    
    locationTitle: 'Siège du Rectorat Académique',
    locationName: 'Rectorat Centre-Est',
    locationAddress: '9255 Avenue de la République, Bâtiment C, 75011 Paris, France',
    locationQuoteTitle: 'Parole de la Directrice d’Académie',
    locationQuoteText: '"Notre objectif premier pour 2026 est de garantir que chaque bachelier trouve une filière d\'orientation en phase avec ses ambitions et le marché de l\'emploi local."',
    
    rightSectionTitle: 'Directives d\'admission post-bac 2026',
    rightSectionText1: 'Pour fluidifier les processus de candidature, le rectorat innove en proposant des passerelles directes avec les universités du réseau.',
    rightSectionList: [
      '1. Soumission anticipée du dossier académique dès le second trimestre.',
      '2. Entretiens de motivation personnalisés avec des conseillers spécialisés.',
      '3. Validation des prérequis via la plateforme unifiée du Hub Scolaire.'
    ],
    rightSectionText2: 'Tous les lycées de la région académique appliqueront cette nouvelle feuille de route dès la rentrée prochaine pour maximiser le taux de réussite post-bac.',
    
    galleryImages: [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=300&q=80'
    ],
    
    bulletsTitle: 'Détails de la campagne d\'orientation',
    bulletsIntro: 'Nous mettons en place des comités de suivi regroupant des enseignants de lycée et des professeurs d\'université.',
    bulletsList: [
      'Création de 45 nouveaux espaces de tutorat d\'excellence.',
      'Mise à disposition de simulateurs de parcours de formation de licence.',
      'Accompagnement spécifique pour les élèves boursiers de recherche.'
    ],
    bulletsOutro: 'Pour plus de détails, prenez contact avec le secrétariat pédagogique de votre établissement ou téléchargez le livret d\'orientation.',
    
    numberedTitle: 'Calendrier des opérations administratives',
    numberedIntro: 'Le calendrier d\'affectation et de validation des dossiers d\'admission respecte les étapes ci-dessous :',
    numberedList: [
      {
        title: 'Phase de pré-inscription (Janvier - Mars)',
        subItems: [
          'Saisie des vœux d\'orientation sur la plateforme.',
          'Validation par le conseil de classe du deuxième trimestre.'
        ]
      },
      {
        title: 'Phase d\'examen des dossiers (Avril - Mai)',
        subItems: [
          'Étude des dossiers par les commissions inter-universitaires.',
          'Entretiens d\'admission pour les filières sélectives.'
        ]
      }
    ],
    numberedOutro: 'Les notifications de décision seront transmises via l\'application d\'orientation du portail à partir du 15 juin 2026.',
    
    additionalResources: [
      {
        siteName: 'Portail National Orientation',
        title: 'Kit complet de l\'étudiant - Orientation Post-Bac',
        description: 'Téléchargez les ressources, les fiches métiers, et le guide complet pour préparer au mieux vos vœux d\'orientation académique.',
        url: 'https://orientation.education.gouv.fr'
      },
      {
        siteName: 'Ministère de l\'Enseignement Supérieur',
        title: 'Charte nationale de l\'accompagnement vers le supérieur',
        description: 'Découvrez le cadre national et les engagements des établissements d\'enseignement supérieur pour l\'accueil des bacheliers.',
        url: 'https://enseignementsup.gouv.fr'
      }
    ],
    
    comments: [
      {
        id: 'c1_1',
        author: 'M. Pierre Gauthier',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
        text: 'Une excellente initiative. Cela va grandement rassurer nos lycéens de terminale qui s\'inquiètent des critères de sélection universitaires.',
        date: 'Aujourd\'hui à 14:15'
      },
      {
        id: 'c1_2',
        author: 'Mme. Claire Vidal',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
        text: 'Est-il possible d\'intégrer ce calendrier d\'orientation directement dans les agendas individuels des professeurs principaux ?',
        date: 'Aujourd\'hui à 15:30'
      }
    ]
  },
  n2: {
    id: 'n2',
    category: 'Bourses Nationales',
    title: 'Obtenez une aide financière pour les études supérieures de recherche',
    author: 'Ministère Éducation',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    views: 124,
    date: 'Aujourd\'hui',
    imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80',
    headerImg: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80',
    
    heading1: 'Aides de recherche : Financements ministériels accrus',
    heading1Bold: 'Le Ministère de l’Éducation s’engage à soutenir les étudiants chercheurs à hauteur d’une enveloppe record de 12 millions d’euros pour l’année académique 2026. Cette mesure vise à booster la recherche d’innovation.',
    heading1Text: 'Ces bourses s’adressent prioritairement aux étudiants inscrits en master ou doctorat de recherche au sein des universités habilitées. Le processus de dépôt des dossiers est entièrement dématérialisé sur ce portail.',
    
    heading2: 'Critères d’attribution basés sur l’excellence et les critères sociaux',
    heading2Bold: 'Pour garantir l’équité, l’attribution se fera sous l’égide d’un jury mixte national. Les dossiers académiques exceptionnels se verront attribuer des bourses complémentaires.',
    heading2Text: 'Les dossiers seront examinés conjointement par le secrétariat des bourses régionales et la commission de recherche universitaire, avec des barèmes tenant compte de l’éloignement et du projet scientifique proposé.',
    
    slideshowTitleA: 'Laboratoire de Recherche - A',
    slideshowImagesA: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80'
    ],
    slideshowTitleB: 'Laboratoire de Recherche - B',
    slideshowImagesB: [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=800&q=80'
    ],
    
    locationTitle: 'Centre National des Œuvres Universitaires',
    locationName: 'CNOUS Secrétariat Général',
    locationAddress: '6 Rue Albert Einstein, 75013 Paris, France',
    locationQuoteTitle: 'Déclaration du Ministre délégué aux bourses',
    locationQuoteText: '"Aucun étudiant chercheur ne doit renoncer à sa thèse ou son master de recherche par manque de ressources financières. Nous doublons l\'aide de recherche en 2026."',
    
    rightSectionTitle: 'Constitution du Dossier Social de Recherche',
    rightSectionText1: 'Pour candidater aux aides de recherche ministérielles, l\'étudiant doit respecter scrupuleusement la liste des pièces requises.',
    rightSectionList: [
      '1. Lettre d\'approbation du projet de recherche signée par le directeur de thèse.',
      '2. Relevés de notes officiels de Licence 3, Master 1 et Master 2.',
      '3. Justificatif de ressources familiales et attestation de scolarité active.'
    ],
    rightSectionText2: 'L\'absence de l\'un de ces documents entraînera le rejet automatique du dossier par la commission.',
    
    galleryImages: [
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=300&q=80'
    ],
    
    bulletsTitle: 'Avantages complémentaires de la bourse d\'excellence',
    bulletsIntro: 'Outre l\'aide mensuelle, les lauréats de la bourse d\'excellence bénéficient d\'avantages exclusifs :',
    bulletsList: [
      'Prise en charge intégrale des frais d\'inscription universitaire.',
      'Priorité absolue sur les logements étudiants du réseau CROUS.',
      'Crédit de recherche annuel de 1 500 € pour l\'achat d\'équipements scientifiques.'
    ],
    bulletsOutro: 'Les candidatures en ligne ferment le 30 septembre 2026 à minuit.',
    
    numberedTitle: 'Étapes d\'évaluation des candidatures',
    numberedIntro: 'Le processus d\'attribution se déroule selon la chronologie suivante :',
    numberedList: [
      {
        title: 'Dépôt des candidatures (Juillet - Septembre)',
        subItems: [
          'Saisie des données et versement des justificatifs.',
          'Dépôt de la fiche projet validée par le laboratoire de recherche.'
        ]
      },
      {
        title: 'Délibération et versement (Octobre - Novembre)',
        subItems: [
          'Délibération de la commission mixte nationale.',
          'Mise en paiement rétroactive au 1er octobre 2026.'
        ]
      }
    ],
    numberedOutro: 'Les résultats nominatifs seront publiés sur le portail et notifiés individuellement par email.',
    
    additionalResources: [
      {
        siteName: 'CNOUS France',
        title: 'Simulateur de bourse nationale de recherche',
        description: 'Vérifiez instantanément votre éligibilité sociale et calculez le montant prévisionnel de vos aides de recherche.',
        url: 'https://cnous.fr'
      }
    ],
    
    comments: [
      {
        id: 'c2_1',
        author: 'Prof. Marc Delmas',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
        text: 'C\'est une excellente nouvelle pour nos laboratoires ! Cela va nous permettre d\'attirer des profils de grande qualité.',
        date: 'Hier à 11:45'
      }
    ]
  },
  n3: {
    id: 'n3',
    category: 'Recherche & Innovation',
    title: 'Lancement du nouveau pôle inter-universitaire de robotique',
    author: 'Prof. Lucas Bernard',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    views: 57,
    date: 'Hier',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80',
    headerImg: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    
    heading1: 'RoboTech : Unir les forces universitaires en ingénierie',
    heading1Bold: 'Trois universités majeures s\'unissent pour créer le pôle "RoboTech Centre-Est". Ce hub d\'ingénierie avancée, de mécatronique et d\'intelligence artificielle permettra de former plus de 300 ingénieurs par an.',
    heading1Text: 'Ce pôle regroupera des salles blanches, des parcs d\'imprimantes 3D industrielles, et des bancs d\'essai pour les algorithmes de pilotage autonome de drones et bras articulés de précision.',
    
    heading2: 'Un pôle ouvert aux start-ups et à la recherche académique',
    heading2Bold: 'En partenariat avec la région académique, RoboTech proposera un incubateur d\'entreprises de robotique médicale et agricole, des secteurs à forte croissance technologique.',
    heading2Text: 'Les projets d\'étudiants en fin d\'études de Master d\'ingénierie pourront ainsi être accompagnés et directement transférés vers des brevets industriels, créant de l\'emploi local.',
    
    slideshowTitleA: 'Pôle RoboTech - Équipement',
    slideshowImagesA: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80'
    ],
    slideshowTitleB: 'Pôle RoboTech - Projets',
    slideshowImagesB: [
      'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80'
    ],
    
    locationTitle: 'Site Technologique RoboTech',
    locationName: 'Pôle RoboTech Campus Est',
    locationAddress: '24 Avenue de l\'Innovation, Bâtiment F, 91400 Orsay, France',
    locationQuoteTitle: 'Avis du Coordinateur Scientifique',
    locationQuoteText: '"RoboTech fusionne la théorie des systèmes embarqués avec la pratique des machines automatisées de demain. C\'est un tournant majeur pour la recherche de pointe."',
    
    rightSectionTitle: 'Accès et réservation du matériel de pointe',
    rightSectionText1: 'Le matériel du pôle RoboTech est réservable en ligne par tous les enseignants-chercheurs et doctorants affiliés.',
    rightSectionList: [
      '1. Réservation des créneaux horaires d\'utilisation des machines CNC et d\'usinage.',
      '2. Validation obligatoire de l\'habilitation d\'utilisation du matériel de sécurité.',
      '3. Enregistrement des données de diagnostic robotique après chaque session.'
    ],
    rightSectionText2: 'L\'accès aux salles blanches nécessite un badge spécifique disponible auprès du secrétariat d\'accueil.',
    
    galleryImages: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=300&q=80'
    ],
    
    bulletsTitle: 'Axes de recherche prioritaires de RoboTech',
    bulletsIntro: 'Trois axes principaux de recherche ont été validés par le comité de pilotage :',
    bulletsList: [
      'Robotique chirurgicale assistée de précision chirurgicale.',
      'Systèmes de motricité autonomes pour drones agricoles d\'analyse écologique.',
      'Prothèses de membres bioniques intelligentes commandées par impulsions musculaires.'
    ],
    bulletsOutro: 'Pour proposer un projet de recherche conjoint, déposez votre candidature dans la rubrique incubateur.',
    
    numberedTitle: 'Processus d\'incubation des start-ups',
    numberedIntro: 'Le programme de transfert de brevets vers l\'incubateur suit un protocole rigoureux :',
    numberedList: [
      {
        title: 'Phase de pré-étude de brevet (3 mois)',
        subItems: [
          'Analyse d\'antériorité de la technologie.',
          'Rédaction de l\'architecture matérielle du prototype.'
        ]
      },
      {
        title: 'Phase de prototypage et test (6 mois)',
        subItems: [
          'Usinage des pièces au pôle RoboTech.',
          'Validation fonctionnelle en conditions réelles simulées.'
        ]
      }
    ],
    numberedOutro: 'Les start-ups incubées disposent de bureaux dédiés au cœur du pôle RoboTech.',
    
    additionalResources: [
      {
        siteName: 'RoboTech Hub',
        title: 'Base de données des publications de robotique',
        description: 'Consultez les articles de brevet, de recherche et les thèses soutenues en robotique au sein de la région académique.',
        url: 'https://robotech-academique.org'
      }
    ],
    
    comments: [
      {
        id: 'c3_1',
        author: 'Dr. Audrey Simon',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
        text: 'Formidable ! Notre laboratoire d\'informatique embarquée va pouvoir tester nos réseaux de neurones en temps réel sur du matériel industriel.',
        date: 'Hier à 16:30'
      }
    ]
  },
  
  // Generic fallback post for fallback IDs like sn1, e1, etc.
  generic: {
    id: 'generic',
    category: 'Actualité Académique',
    title: 'Note d’information générale - Service partagé du Tenant Éducatif',
    author: 'Administration Centrale',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    views: 45,
    date: 'Aujourd\'hui',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=80',
    headerImg: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    
    heading1: 'Modernisation des outils de communication',
    heading1Bold: 'Le déploiement progressif de notre plateforme d\'intranet et de suivi de scolarité se poursuit avec succès sur l\'ensemble des lycées et universités affiliés.',
    heading1Text: 'Cette modernisation s\'accompagne d\'une mise à jour de nos serveurs LDAP centraux pour garantir des temps de latence minimaux, en particulier lors des phases de forte affluence comme les inscriptions et examens.',
    
    heading2: 'Des ressources communes pour l’orientation et la pédagogie',
    heading2Bold: 'En connectant nos systèmes d\'information, nous offrons une visibilité inédite sur les événements académiques nationaux et régionaux.',
    heading2Text: 'Les bacheliers comme les doctorants bénéficient désormais d\'un guichet unique d\'informations administratives, de bourses et d\'aide à la vie étudiante, favorisant une insertion académique fluide et réussie.',
    
    slideshowTitleA: 'Espace Numérique de Travail - A',
    slideshowImagesA: [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80'
    ],
    slideshowTitleB: 'Espace Numérique de Travail - B',
    slideshowImagesB: [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'
    ],
    
    locationTitle: 'Rectorat Central & Support',
    locationName: 'Bureau de l\'Innovation Numérique',
    locationAddress: '15 Rue de l\'Éducation, 75005 Paris, France',
    locationQuoteTitle: 'Rappel de la charte informatique',
    locationQuoteText: '"Le bon fonctionnement de nos outils collaboratifs dépend du respect par chacun de la charte numérique approuvée à l\'ouverture du compte."',
    
    rightSectionTitle: 'Principaux services ouverts à distance',
    rightSectionText1: 'Le portail central propose une suite d\'applications intégrées destinées à simplifier la gestion quotidienne :',
    rightSectionList: [
      '1. Annuaire LDAP unifié pour la messagerie académique et l\'accès aux cours.',
      '2. Formulaires de demande d\'assistance et support technique d\'établissement.',
      '3. Téléchargement des relevés de notes et diplômes certifiés par blockchain.'
    ],
    rightSectionText2: 'Pour toute difficulté de connexion, rapprochez-vous du correspondant informatique de votre école.',
    
    galleryImages: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300&q=80'
    ],
    
    bulletsTitle: 'Thématiques clés du système éducatif centralisé',
    bulletsIntro: 'Nos actions de support s\'articulent autour de trois priorités stratégiques :',
    bulletsList: [
      'Interopérabilité complète des bases de données d\'étudiants.',
      'Sécurité et traçabilité des accès aux serveurs d\'apprentissage.',
      'Inclusion des parcours et accompagnement adapté aux handicaps.'
    ],
    bulletsOutro: 'Les rapports complets d\'analyse sont mis à disposition des directeurs d\'écoles chaque trimestre.',
    
    numberedTitle: 'Protocole de déclaration d\'incidents réseaux',
    numberedIntro: 'En cas d\'interruption ou d\'anomalie sur nos services partagés, le protocole suivant est activé :',
    numberedList: [
      {
        title: 'Phase de détection et alerte automatique (10 min)',
        subItems: [
          'Enregistrement de l\'alerte sur nos sondes de latence.',
          'Mise en route de la cellule technique d\'astreinte.'
        ]
      },
      {
        title: 'Résolution et information des usagers (1 heure)',
        subItems: [
          'Application du correctif d\'infrastructure.',
          'Publication d\'un rapport d\'incident dans le fil d\'actualité.'
        ]
      }
    ],
    numberedOutro: 'La cellule de support technique peut être contactée via le numéro vert académique.',
    
    additionalResources: [
      {
        siteName: 'Hub Support Technique',
        title: 'FAQ - Aide et assistance informatique',
        description: 'Consultez les réponses aux questions fréquentes sur la messagerie académique, l\'activation de compte et l\'inscription aux cours.',
        url: 'https://support.tenant-edu.fr'
      }
    ],
    
    comments: [
      {
        id: 'c_gen_1',
        author: 'Mme. Sophie Laurent',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80',
        text: 'La mise à jour de l\'annuaire LDAP a résolu tous les problèmes d\'accès de nos nouveaux élèves. Bravo à l\'équipe réseau !',
        date: 'Aujourd\'hui à 09:12'
      }
    ]
  }
};

export function getSharePointPost(id: string): SharePointPostData {
  return SHAREPOINT_POSTS[id] || {
    ...SHAREPOINT_POSTS.generic,
    id: id,
    title: id.startsWith('sn') 
      ? `Brève Administrative - ${id.toUpperCase()}`
      : id.startsWith('e') 
      ? `Événement Académique - ${id.toUpperCase()}`
      : `Actualité - ${id.toUpperCase()}`
  };
}

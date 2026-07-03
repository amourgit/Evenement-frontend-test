import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, Clock, Eye, ChevronRight, ExternalLink, BookOpen, 
  Sparkles, FileText, Compass, Search, Plus, ThumbsUp, MessageSquare, 
  Star, Share2, ArrowUpRight, GraduationCap, Users, Shield, Link,
  Check, CheckCircle2, UserCheck, BarChart2, Trash2, Edit2, Settings
} from 'lucide-react';
import { BreadcrumbItem } from '@/src/types';

interface GeneralHomeProps {
  onNavigateDeep: (path: BreadcrumbItem[]) => void;
  searchQuery: string;
}

// Interfaces specifically for SharePoint-style view
interface NewsItem {
  id: string;
  category: string;
  title: string;
  author: string;
  views: number;
  imageUrl: string;
  date: string;
}

interface SidebarNews {
  id: string;
  category: string;
  title: string;
}

interface EventItem {
  id: string;
  month: string;
  day: string;
  category: string;
  title: string;
  time: string;
  location: string;
}

interface QuickLink {
  id: string;
  title: string;
  iconBg: string;
  iconName: 'book' | 'search' | 'file' | 'bulb' | 'calc';
}

interface TopSite {
  id: string;
  title: string;
  color: string;
  iconName: 'giving' | 'sales' | 'onboarding' | 'benefits';
  starred: boolean;
  activities: {
    id: string;
    user: string;
    avatar: string;
    action: string;
    time: string;
  }[];
}

export default function GeneralHome({ onNavigateDeep, searchQuery }: GeneralHomeProps) {
  const [starredSites, setStarredSites] = useState<Record<string, boolean>>({
    's1': true,
    's2': true,
    's3': true,
    's4': true
  });

  const toggleStar = (id: string) => {
    setStarredSites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Configurable Quick Links State
  const [configurableLinks, setConfigurableLinks] = useState<any[]>([
    { id: 'c1', title: 'Vision Éducative 2030', url: 'https://vision2030.education.gouv.fr', iconName: 'Compass' },
    { id: 'c2', title: 'Tarifs & Droits', url: '/bourses', iconName: 'FileText' },
    { id: 'c3', title: 'Rapports Hub', url: '/rapports', iconName: 'BarChart2' },
    { id: 'c4', title: 'Sécurité Réseau', url: '/security', iconName: 'Shield' },
    { id: 'c5', title: 'Charte Académique', url: '/charte', iconName: 'BookOpen' },
    { id: 'c6', title: 'Équipe Support', url: '/support', iconName: 'Users' },
    { id: 'c7', title: 'Gestion LDAP', url: '/ldap', iconName: 'Settings' },
    { id: 'c8', title: 'Calendrier National', url: '/calendrier', iconName: 'Calendar' }
  ]);

  const [isConfiguring, setIsConfiguring] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState('');
  const [tempUrl, setTempUrl] = useState('');
  const [tempIconName, setTempIconName] = useState('Compass');

  const handleAddLink = () => {
    const newId = 'c_' + Date.now();
    const defaultIcons = ['Compass', 'BookOpen', 'FileText', 'Shield', 'Users', 'BarChart2', 'Settings', 'Calendar'];
    const randomIcon = defaultIcons[Math.floor(Math.random() * defaultIcons.length)];
    setConfigurableLinks(prev => [
      ...prev,
      { id: newId, title: 'Nouveau lien', url: '#', iconName: randomIcon }
    ]);
    handleEditLink(newId);
  };

  const handleEditLink = (id: string) => {
    const link = configurableLinks.find(l => l.id === id);
    if (link) {
      setEditingLinkId(id);
      setTempTitle(link.title);
      setTempUrl(link.url);
      setTempIconName(link.iconName || 'Link');
    }
  };

  const handleSaveEdit = () => {
    setConfigurableLinks(prev => prev.map(l => {
      if (l.id === editingLinkId) {
        return { ...l, title: tempTitle, url: tempUrl, iconName: tempIconName };
      }
      return l;
    }));
    setEditingLinkId(null);
  };

  const handleDeleteLink = (id: string) => {
    setConfigurableLinks(prev => prev.filter(l => l.id !== id));
    if (editingLinkId === id) {
      setEditingLinkId(null);
    }
  };

  const renderFavIconByName = (name: string) => {
    switch(name) {
      case 'Compass': return <Compass className="w-5 h-5 text-white" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-white" />;
      case 'FileText': return <FileText className="w-5 h-5 text-white" />;
      case 'Shield': return <Shield className="w-5 h-5 text-white" />;
      case 'Users': return <Users className="w-5 h-5 text-white" />;
      case 'BarChart2': return <BarChart2 className="w-5 h-5 text-white" />;
      case 'Settings': return <Settings className="w-5 h-5 text-white" />;
      case 'Calendar': return <Calendar className="w-5 h-5 text-white" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-white" />;
      default: return <Link className="w-5 h-5 text-white" />;
    }
  };

  // Mock Data perfectly structured to replicate the exact layout in the image
  const mainNews: NewsItem[] = [
    {
      id: 'n1',
      category: 'Campagne d\'Orientation',
      title: 'Objectifs d\'admission post-bac pour l\'année académique 2026',
      author: 'Directeur Académique',
      views: 96,
      date: 'Aujourd\'hui',
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'n2',
      category: 'Bourses Nationales',
      title: 'Obtenez une aide financière pour les études supérieures de recherche',
      author: 'Ministère Éducation',
      views: 124,
      date: 'Aujourd\'hui',
      imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'n3',
      category: 'Recherche & Innovation',
      title: 'Lancement du nouveau pôle inter-universitaire de robotique',
      author: 'Prof. Lucas Bernard',
      views: 57,
      date: 'Hier',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'n4',
      category: 'Tenant Administration',
      title: 'Foire aux questions : Financements et subventions des lycées',
      author: 'Secrétariat Général',
      views: 13,
      date: 'Hier',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'n5',
      category: 'Échanges Internationaux',
      title: 'La diversité culturelle fait la force de nos campus',
      author: 'Coordinatrice Erasmus',
      views: 214,
      date: 'Il y a 2 jours',
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'n6',
      category: 'Portes Ouvertes 2026',
      title: 'Retour en images sur la journée d\'accueil des futurs bacheliers',
      author: 'Équipe Communication',
      views: 10,
      date: 'Il y a 3 jours',
      imageUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const sidebarNews: SidebarNews[] = [
    {
      id: 'sn1',
      category: 'Relations Internationales',
      title: 'Candidatures ouvertes pour les bourses de mobilité d\'été'
    },
    {
      id: 'sn2',
      category: 'Affaires Étudiantes',
      title: 'Renforcement du soutien psychologique et tutorat sur les campus'
    },
    {
      id: 'sn3',
      category: 'Recherche Appliquée',
      title: 'Pour mieux aider les doctorants, notre guichet unique déménage'
    },
    {
      id: 'sn4',
      category: 'Tenant Administration',
      title: 'Destinations de recherche d\'été préférées des enseignants'
    },
    {
      id: 'sn5',
      category: 'Ressources Numériques',
      title: 'Mise à niveau de l\'infrastructure cloud de stockage d\'établissement'
    },
    {
      id: 'sn6',
      category: 'Vie associative',
      title: 'Lancement du grand tournoi de football inter-établissements'
    }
  ];

  const events: EventItem[] = [
    {
      id: 'e1',
      month: 'JUIL',
      day: '15',
      category: 'Événement Ministériel',
      title: 'Tout savoir sur la réforme du baccalauréat scientifique',
      time: 'Vendredi 14:00 - 16:30',
      location: 'Grand Amphi Central'
    },
    {
      id: 'e2',
      month: 'AOÛ',
      day: '04',
      category: 'Séminaire Recherche',
      title: 'Conférence exceptionnelle avec le Professeur Laurent Roy',
      time: 'Jeudi 12:00 - 14:00',
      location: 'Salle de visioconférence 3'
    },
    {
      id: 'e3',
      month: 'AOÛ',
      day: '18',
      category: 'Rentrée Académique',
      title: 'Journée d\'intégration et d\'accueil des nouveaux enseignants',
      time: 'Mardi - Toute la journée',
      location: 'Hôtel de Région'
    }
  ];

  const quickLinks: QuickLink[] = [
    {
      id: 'ql1',
      title: 'Livret d\'accueil de l\'Étudiant',
      iconBg: 'bg-blue-600',
      iconName: 'book'
    },
    {
      id: 'ql2',
      title: 'Processus d\'inscription et transfert',
      iconBg: 'bg-indigo-600',
      iconName: 'search'
    },
    {
      id: 'ql3',
      title: 'Postes vacants & Concours enseignants',
      iconBg: 'bg-amber-500',
      iconName: 'file'
    },
    {
      id: 'ql4',
      title: 'Opportunités de formation professionnelle',
      iconBg: 'bg-emerald-600',
      iconName: 'bulb'
    },
    {
      id: 'ql5',
      title: 'Calculateur des droits de scolarité',
      iconBg: 'bg-rose-500',
      iconName: 'calc'
    }
  ];

  const topSites: TopSite[] = [
    {
      id: 's1',
      title: 'Portail des Lycées',
      color: 'bg-emerald-600',
      iconName: 'giving',
      starred: true,
      activities: [
        {
          id: 'act1_1',
          user: 'M. Pierre Gauthier',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
          action: 'a modifié l\'emploi du temps de Terminale S',
          time: 'Il y a 41 min'
        },
        {
          id: 'act1_2',
          user: 'Mme. Claire Vidal',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
          action: 'a partagé le cours de Philosophie d\'orientation',
          time: 'Il y a 1 h'
        }
      ]
    },
    {
      id: 's2',
      title: 'Université des Sciences',
      color: 'bg-sky-600',
      iconName: 'sales',
      starred: true,
      activities: [
        {
          id: 'act2_1',
          user: 'Prof. Marc Delmas',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
          action: 'a modifié l\'examen d\'Algorithmique Avancée',
          time: 'Il y a 45 min'
        },
        {
          id: 'act2_2',
          user: 'Dr. Audrey Simon',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
          action: 'a partagé la feuille de route de Licence 3',
          time: 'Il y a 4 h'
        }
      ]
    },
    {
      id: 's3',
      title: 'Intégration Enseignants',
      color: 'bg-violet-600',
      iconName: 'onboarding',
      starred: true,
      activities: [
        {
          id: 'act3_1',
          user: 'Lucas Bernard',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
          action: 'a partagé la charte numérique des enseignants',
          time: 'Il y a 45 min'
        },
        {
          id: 'act3_2',
          user: 'Mme. Sophie Laurent',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80',
          action: 'a modifié le guide d\'accueil LDAP',
          time: 'Il y a 3 h'
        }
      ]
    },
    {
      id: 's4',
      title: 'Bourses & Services',
      color: 'bg-rose-600',
      iconName: 'benefits',
      starred: true,
      activities: [
        {
          id: 'act4_1',
          user: 'Équipe Logistique',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
          action: 'a modifié la FAQ des aides sociales',
          time: 'Il y a 23 min'
        },
        {
          id: 'act4_2',
          user: 'Secrétariat Social',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80',
          action: 'a publié le calendrier des paiements',
          time: 'Il y a 1 jour'
        }
      ]
    }
  ];

  // Helper to render lucide icons dynamically
  const renderQuickLinkIcon = (name: string) => {
    switch(name) {
      case 'book': return <BookOpen className="w-4 h-4 text-white" />;
      case 'search': return <Search className="w-4 h-4 text-white" />;
      case 'file': return <FileText className="w-4 h-4 text-white" />;
      case 'bulb': return <Sparkles className="w-4 h-4 text-white" />;
      default: return <Clock className="w-4 h-4 text-white" />;
    }
  };

  const filteredNews = mainNews.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="sharepoint-home" className="space-y-6 select-none max-w-7xl mx-auto py-2">
      
      {/* =========================================================================
          SHAREPOINT BRANDING HEADER BAR (Identical to SharePoint layout)
          ========================================================================= */}
      <div className="bg-white border border-slate-200 rounded-[4px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Left: Site Logo and Title */}
          <div className="flex items-center gap-4">
            {/* Multi-person network team icon matching the screenshot logo */}
            <div className="w-12 h-12 bg-indigo-600 rounded-[4px] flex items-center justify-center text-white shrink-0 shadow-sm">
              <Compass className="w-7 h-7" />
            </div>
            
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-none">
                  Portail Central Tenant Éducatif
                </h1>
                <span className="text-[9px] font-mono font-bold bg-indigo-50 text-indigo-700 px-1 py-0.5 rounded border border-indigo-100 uppercase leading-none">
                  GLOBAL
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Réseau d'orientation nationale, événements publics & communications ministérielles</p>
            </div>
          </div>

          {/* Right: Follow, Share and Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => alert('Vous suivez désormais cet espace global dans vos favoris Office 365.')}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-[11px] font-bold text-slate-600 rounded-[2px] transition-colors cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                Suivre
              </button>

              <button 
                onClick={() => alert('Lien d\'accès copié dans le presse-papiers !')}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-[11px] font-bold text-slate-600 rounded-[2px] transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                Partager
              </button>
            </div>

            {/* Site search input matching SharePoint */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input 
                type="text" 
                placeholder="Rechercher sur ce hub..."
                className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 hover:bg-white border border-slate-200 rounded-[2px] focus:bg-white focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Bottom row: Navigation Links & Tabs matching the mockup */}
        <div className="border-t border-slate-100 pt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="flex flex-wrap items-center gap-1.5">
            <button className="px-3 py-1 text-indigo-700 bg-indigo-50/70 border border-indigo-100 rounded-[2px] font-bold cursor-pointer">
              Accueil Hub
            </button>
            <button 
              onClick={() => alert('Ouverture de la charte de mission éducative nationale.')}
              className="px-3 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-[2px] font-bold cursor-pointer"
            >
              Mission Éducative
            </button>
            <button 
              onClick={() => alert('Affichage des publications officielles du Ministère de l\'Éducation.')}
              className="px-3 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-[2px] font-bold cursor-pointer"
            >
              Communications
            </button>
            <button 
              onClick={() => alert('Accès aux espaces de travail de chaque école.')}
              className="px-3 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-[2px] font-bold cursor-pointer"
            >
              Espaces de Travail
            </button>
            <button 
              onClick={() => alert('Consultation des programmes d\'activité et d\'aide aux étudiants.')}
              className="px-3 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-[2px] font-bold cursor-pointer"
            >
              Vie Administrative & Lycées
            </button>
            <button 
              onClick={() => alert('Liste de tous les secrétariats académiques régionaux.')}
              className="px-3 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-[2px] font-bold cursor-pointer"
            >
              Contacts Académiques
            </button>
          </div>

          <button 
            onClick={() => alert('Passage en mode édition du portail SharePoint central (Réservé aux administrateurs).')}
            className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 hover:underline cursor-pointer"
          >
            Modifier la page
          </button>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: NEWS FROM AROUND YOUR HUB (Actualités du hub)
          ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h2 className="text-sm font-bold text-slate-800 tracking-tight uppercase flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-blue-600" />
            Actualités du Réseau Académique Global
          </h2>
          <span className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-0.5">
            Voir tout
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Columns (3/4 Width): News Grid */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-5">
            {filteredNews.slice(0, 6).map((news) => (
              <div 
                key={news.id}
                onClick={() => onNavigateDeep([
                  { id: 'general', label: 'Espace Général' },
                  { id: `sp_post_${news.id}`, label: news.title }
                ])}
                className="bg-white border border-slate-200 rounded-[4px] overflow-hidden hover:shadow-md transition-all duration-200 group flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Photo with subtle hover scale effect */}
                  <div className="h-32 w-full overflow-hidden relative bg-slate-100">
                    <img 
                      src={news.imageUrl} 
                      alt={news.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-[2px] text-[8px] font-bold bg-white/90 text-blue-900 border border-slate-200/50 uppercase tracking-wider">
                      {news.category}
                    </div>
                  </div>

                  <div className="p-3 space-y-1.5">
                    <h3 className="text-[11px] font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                      {news.title}
                    </h3>
                  </div>
                </div>

                <div className="p-3 pt-0 border-t border-slate-50 mt-2 flex items-center justify-between text-[9px] text-slate-400">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-600 truncate max-w-[100px]">{news.author}</span>
                    <span>{news.date}</span>
                  </div>
                  <span className="flex items-center gap-0.5 font-mono">
                    <Eye className="w-3 h-3" />
                    {news.views}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column (1/4 Width): Quick Links AND Text Links Stack */}
          <div className="lg:col-span-1 space-y-5 flex flex-col">
            
            {/* Quick Links (Liens Rapides Favoris) Container - MS SharePoint Style */}
            <div className="bg-white border border-slate-200 rounded-[4px] p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-[#0078d4] fill-[#0078d4]" />
                  Raccourcis Favoris (Quick Links)
                </span>
                
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setIsConfiguring(!isConfiguring);
                      setEditingLinkId(null);
                    }}
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-[2px] border transition-colors cursor-pointer ${
                      isConfiguring 
                        ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' 
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isConfiguring ? 'Terminer' : 'Configurer'}
                  </button>
                  {isConfiguring && (
                    <button
                      onClick={handleAddLink}
                      className="text-[9px] bg-[#0078d4] hover:bg-[#005a9e] text-white font-bold px-1.5 py-0.5 rounded-[2px] transition-colors flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      Ajouter
                    </button>
                  )}
                </div>
              </div>

              {/* Grid of blue/teal SharePoint-style square cards */}
              <div className="grid grid-cols-2 gap-2">
                {configurableLinks.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (isConfiguring) {
                        handleEditLink(item.id);
                      } else {
                        alert(`Redirection vers le raccourci favori :\n• Nom : ${item.title}\n• URL : ${item.url}`);
                      }
                    }}
                    className="relative group bg-[#0078d4] hover:bg-[#005a9e] p-3 rounded-[3px] aspect-square flex flex-col items-center justify-center text-white cursor-pointer shadow-sm hover:shadow-md transition-all duration-150 text-center select-none overflow-hidden"
                  >
                    {/* Icon container */}
                    <div className="transform group-hover:scale-110 transition-transform duration-200 flex items-center justify-center">
                      {renderFavIconByName(item.iconName)}
                    </div>
                    
                    {/* Title */}
                    <span className="text-[10px] font-bold mt-2 leading-tight break-words px-1 text-center w-full block">
                      {item.title}
                    </span>

                    {/* Edit/Configure overlay in config mode */}
                    {isConfiguring && (
                      <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditLink(item.id);
                          }}
                          className="px-1.5 py-0.5 bg-[#0078d4] hover:bg-[#005a9e] text-white text-[8px] font-bold rounded-[2px] flex items-center gap-0.5 cursor-pointer"
                        >
                          <Edit2 className="w-2 h-2" /> Modif.
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLink(item.id);
                          }}
                          className="px-1.5 py-0.5 bg-red-600 hover:bg-red-700 text-white text-[8px] font-bold rounded-[2px] flex items-center gap-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-2 h-2" /> Suppr.
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Inline Edit form if editing a card */}
              {editingLinkId && (
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-[4px] space-y-2 mt-2">
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Modifier le favori</span>
                  
                  <div className="space-y-1.5">
                    <div>
                      <label className="text-[8px] font-bold text-slate-400 uppercase">Libellé</label>
                      <input 
                        type="text" 
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        className="w-full text-[10px] px-1.5 py-1 bg-white border border-slate-200 rounded outline-none font-semibold focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] font-bold text-slate-400 uppercase">URL / Chemin</label>
                      <input 
                        type="text" 
                        value={tempUrl}
                        onChange={(e) => setTempUrl(e.target.value)}
                        className="w-full text-[10px] px-1.5 py-1 bg-white border border-slate-200 rounded outline-none font-mono focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] font-bold text-slate-400 uppercase block">Icône</label>
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {['Compass', 'BookOpen', 'FileText', 'Shield', 'Users', 'BarChart2', 'Settings', 'Calendar'].map((icon) => (
                          <button
                            key={icon}
                            type="button"
                            onClick={() => setTempIconName(icon)}
                            className={`p-1.5 border rounded flex items-center justify-center transition-colors ${
                              tempIconName === icon 
                                ? 'bg-[#0078d4]/10 border-[#0078d4] text-[#0078d4]' 
                                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            <span className="text-slate-800 scale-90 flex items-center justify-center bg-[#0078d4] p-1 rounded-sm">
                              {renderFavIconByName(icon)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-1.5 pt-1.5">
                    <button
                      onClick={() => setEditingLinkId(null)}
                      className="px-2 py-0.5 border border-slate-200 text-slate-500 rounded text-[9px] font-bold hover:bg-slate-100 cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[9px] font-bold cursor-pointer"
                    >
                      Enregistrer
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Brèves administratives Container */}
            <div className="bg-white border border-slate-200 rounded-[4px] p-4 divide-y divide-slate-100 flex flex-col justify-between flex-1">
              <div className="space-y-3 pb-3">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Brèves administratives</span>
                <div className="space-y-4">
                  {sidebarNews.slice(0, 5).map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => onNavigateDeep([
                        { id: 'general', label: 'Espace Général' },
                        { id: `sp_post_${item.id}`, label: item.title }
                      ])}
                      className="space-y-1 group cursor-pointer"
                    >
                      <span className="text-[8px] font-bold text-blue-600 uppercase tracking-wider block leading-none">
                        {item.category}
                      </span>
                      <h4 className="text-[11px] font-semibold text-slate-700 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 font-medium hover:text-slate-600 cursor-pointer flex items-center justify-center gap-1">
                  Plus d'annonces ministérielles
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* =========================================================================
          SECTION 2: EVENTS & QUICK LINKS (Superposé / Alignement SharePoint)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Calendar Events */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="text-sm font-bold text-slate-800 tracking-tight uppercase flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              Agenda Académique & Événements Publics
            </h2>
            <span className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
              Tout voir
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {events.map((evt) => (
              <div 
                key={evt.id}
                onClick={() => onNavigateDeep([
                  { id: 'general', label: 'Espace Général' },
                  { id: `sp_post_${evt.id}`, label: evt.title }
                ])}
                className="bg-white border border-slate-200 rounded-[4px] p-4 flex flex-col justify-between hover:shadow-md transition-shadow group relative cursor-pointer"
              >
                <div className="space-y-3">
                  {/* Calendar Widget Day Display */}
                  <div className="w-12 h-12 border border-slate-300 rounded-[4px] flex flex-col overflow-hidden text-center mx-auto">
                    <div className="bg-slate-100 text-[8px] font-bold py-0.5 text-slate-600 uppercase border-b border-slate-200">
                      {evt.month}
                    </div>
                    <div className="font-display font-bold text-base text-slate-800 flex-1 flex items-center justify-center bg-white">
                      {evt.day}
                    </div>
                  </div>

                  <div className="space-y-1 text-center md:text-left pt-1">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">
                      {evt.category}
                    </span>
                    <h3 className="text-[11px] font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {evt.title}
                    </h3>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-500 space-y-1">
                  <p className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {evt.time}
                  </p>
                  <p className="font-semibold text-slate-600">
                    Lieu : {evt.location}
                  </p>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`L'événement "${evt.title}" a été ajouté à votre calendrier Outlook/Scolarité.`);
                    }}
                    className="w-full mt-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold border border-slate-200 rounded-[2px] transition-colors flex items-center justify-center gap-1 text-[9px] cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    Ajouter au calendrier
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Column: Quick Links */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="text-sm font-bold text-slate-800 tracking-tight uppercase flex items-center gap-1.5">
              <Link className="w-4 h-4 text-blue-600" />
              Liens Rapides Tenant
            </h2>
            <span className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
              Gérer
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-[4px] p-4 divide-y divide-slate-100 space-y-1">
            {quickLinks.map((link) => (
              <div 
                key={link.id}
                className="flex items-center gap-3 py-2.5 hover:bg-slate-50 px-2 rounded-[2px] transition-colors cursor-pointer group"
              >
                <div className={`w-7 h-7 rounded-[4px] flex items-center justify-center ${link.iconBg} shadow-sm`}>
                  {renderQuickLinkIcon(link.iconName)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[11px] font-bold text-slate-700 group-hover:text-blue-700 transition-colors truncate">
                    {link.title}
                  </h4>
                  <p className="text-[9px] text-slate-400">Ressource académique officielle</p>
                </div>
                <ArrowUpRight className="w-3 h-3 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* =========================================================================
          SECTION 3: TOP SITES (Sites populaires avec flux d'activité)
          ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h2 className="text-sm font-bold text-slate-800 tracking-tight uppercase flex items-center gap-1.5">
            <Star className="w-4 h-4 text-blue-600" />
            Portails Populaires & Activité Récente
          </h2>
          <span className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
            Voir tout
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {topSites.map((site) => {
            const isStarred = starredSites[site.id];

            return (
              <div 
                key={site.id}
                className="bg-white border border-slate-200 rounded-[4px] overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Site Header Colored block with Star rating */}
                <div className={`${site.color} p-3 flex items-center justify-between text-white`}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-white/20 flex items-center justify-center">
                      <GraduationCap className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-[11px] font-bold tracking-tight">{site.title}</span>
                  </div>

                  <button 
                    onClick={() => toggleStar(site.id)}
                    className="text-white hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star className={`w-4.5 h-4.5 ${isStarred ? 'fill-yellow-400 stroke-yellow-400 text-yellow-400' : 'text-white'}`} />
                  </button>
                </div>

                {/* Activity log inside the card, identical to SharePoint */}
                <div className="p-3.5 space-y-3.5 bg-white">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Activité récente :</span>
                  
                  <div className="space-y-3.5">
                    {site.activities.map((act) => (
                      <div key={act.id} className="flex gap-2.5 items-start">
                        <img 
                          src={act.avatar} 
                          alt={act.user}
                          referrerPolicy="no-referrer"
                          className="w-5.5 h-5.5 rounded-full object-cover border border-slate-200 shrink-0 mt-0.5"
                        />
                        <div className="flex-1 min-w-0 text-[10px]">
                          <p className="text-slate-600 leading-normal">
                            <span className="font-bold text-slate-800">{act.user}</span> {act.action}
                          </p>
                          <span className="text-[8px] text-slate-400 block mt-0.5 font-medium">{act.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 border-t border-slate-100 text-center bg-slate-50/50">
                  <span className="text-[9px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer inline-flex items-center gap-0.5">
                    Accéder au site
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

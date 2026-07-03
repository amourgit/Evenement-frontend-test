// ============================================================
// components/pages/general/GeneralPageContent.tsx
// Portail "Espace Général" : TopBar + BreadcrumbBar + hub SharePoint
// (GeneralHome) + bascule vers les portails d'établissements
// (CaptivePortal / Dashboard). Suit le meme patron que
// components/pages/home/HomePageContent.tsx : ce composant porte
// toute la logique, la page dans src/pages/ ne fait que l'appeler.
//
// Autonome : n'utilise que le routeur (react-router) et les
// donnees deja disponibles dans ce projet (src/types, src/data).
// Les portails "Civitas Forms" (evenements) et "Administration"
// sont deja des pages/routes dediees de ce projet (/events, /admin) :
// on y navigue simplement au lieu de les re-implementer ici.
// ============================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Composants du portail général
import TopBar from '@/components/general/TopBar';
import BreadcrumbBar from '@/components/general/BreadcrumbBar';
import GeneralHome from '@/components/general/GeneralHome';
import Dashboard from '@/components/general/Dashboard';
import CaptivePortal from '@/components/general/CaptivePortal';
import SharePointDetailPage from '@/components/general/SharePointDetailPage';

// Données mock & types (déjà présents dans le projet)
import { ESTABLISHMENTS, MOCK_APPS, MOCK_NOTIFICATIONS, MOCK_HELP } from '@/src/data';
import { Establishment, AppNotification, AppItem, HelpTopic, BreadcrumbItem, LocalUser } from '@/src/types';

interface GeneralPageContentProps {
  /** Chemin de base du routeur (utile si l'app est montée sous un sous-chemin) */
  basePath?: string;
}

export default function GeneralPageContent({ basePath = '' }: GeneralPageContentProps) {
  const navigate = useNavigate();

  // Tenant states
  const [establishments, setEstablishments] = useState<Establishment[]>(ESTABLISHMENTS);
  const [currentEstId, setCurrentEstId] = useState<string>('general');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // Dynamic slot content states for TopBar
  const [slotContent, setSlotContent] = useState<React.ReactNode | null>(null);
  const [slotOutlineActive, setSlotOutline] = useState<boolean>(false);
  const [schoolSubPath, setSchoolSubPath] = useState<BreadcrumbItem[]>([]);

  const activeEstablishment = establishments.find(e => e.id === currentEstId) || establishments[0];

  const [appsList] = useState<AppItem[]>(() => [
    ...MOCK_APPS,
    {
      id: 'app_civitas_forms',
      name: 'Civitas Forms',
      iconName: 'FileText',
      category: 'Municipal',
      description: 'Plateforme citoyenne de gestion d\'événements et formulaires municipaux.'
    }
  ]);

  const [helpTopics] = useState<HelpTopic[]>(MOCK_HELP);

  // Mark a notification as read
  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  // Clear all notifications
  const handleClearNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Handle local captive portal login success
  const handleLoginSuccess = (localUser: LocalUser) => {
    setEstablishments(prev => prev.map(est => {
      if (est.id === currentEstId) {
        return { ...est, currentUser: localUser };
      }
      return est;
    }));
  };

  // Handle local logout context
  const handleLogoutContext = () => {
    setEstablishments(prev => prev.map(est => {
      if (est.id === currentEstId) {
        return { ...est, currentUser: null };
      }
      return est;
    }));
    setSchoolSubPath([]);
  };

  // Handle select app from launcher
  const handleSelectApp = (appId: string) => {
    if (appId === 'app_civitas_forms') {
      navigate(`${basePath}/events`);
    } else if (appId === 'app_settings') {
      navigate(`${basePath}/admin`);
    } else {
      alert(`Redirection vers l'application : ${appId}`);
    }
  };

  // Calculate dynamic breadcrumb path
  const getBreadcrumbPath = (): BreadcrumbItem[] => {
    if (activeEstablishment.id === 'general') {
      if (selectedPostId !== null) {
        return [
          { id: 'general', label: 'Espace Général', clickable: true },
          { id: 'sp_post_detail', label: 'Article SharePoint' }
        ];
      }
      return [{ id: 'general', label: 'Espace Général' }];
    } else {
      const path: BreadcrumbItem[] = [
        { id: activeEstablishment.id, label: activeEstablishment.name, clickable: schoolSubPath.length > 0 }
      ];
      if (activeEstablishment.currentUser === null) {
        path.push({ id: 'auth', label: 'Authentification' });
      } else if (schoolSubPath.length > 0) {
        path.push(...schoolSubPath);
      }
      return path;
    }
  };

  const handleBreadcrumbNavigate = (index: number) => {
    const path = getBreadcrumbPath();
    const clickedItem = path[index];
    if (!clickedItem) return;

    if (clickedItem.id === 'general') {
      setCurrentEstId('general');
      setSelectedPostId(null);
    } else if (clickedItem.id === currentEstId) {
      setSchoolSubPath([]);
    }
  };

  // Handle selection of establishment in TopBar dropdown
  const handleSelectEstablishment = (id: string) => {
    setCurrentEstId(id);
    setSelectedPostId(null);
    setSchoolSubPath([]);
  };

  // Render content depending on tenant state
  const renderContent = () => {
    if (activeEstablishment.id === 'general') {
      if (selectedPostId !== null) {
        return (
          <SharePointDetailPage
            postId={selectedPostId}
            onBack={() => setSelectedPostId(null)}
          />
        );
      }

      return (
        <div className="bg-slate-50 min-h-screen py-4 px-4 md:px-8">
          {/* Promo banner to enter Civitas Forms */}
          <div className="max-w-7xl mx-auto mb-6 bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-5 rounded-[4px] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="bg-white/10 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">NOUVEAU SERVICE CITOYEN</span>
              <h3 className="text-sm md:text-base font-bold tracking-tight">Civitas Forms - Plateforme Municipale</h3>
              <p className="text-xs text-blue-100">Inscrivez-vous aux événements de la ville et remplissez des formulaires intelligents et interactifs.</p>
            </div>
            <button
              onClick={() => navigate(`${basePath}/events`)}
              className="bg-white text-blue-800 hover:bg-blue-50 font-bold text-xs px-4 py-2.5 rounded-[4px] transition-colors shadow-sm self-start md:self-auto cursor-pointer"
            >
              Accéder à l'Espace Public Civitas Forms
            </button>
          </div>

          <GeneralHome
            searchQuery={searchQuery}
            onNavigateDeep={(path) => {
              if (path.length > 1 && path[1].id.startsWith('sp_post_')) {
                const postId = path[1].id.replace('sp_post_', '');
                setSelectedPostId(postId);
              }
            }}
          />
        </div>
      );
    } else {
      // School establishments (Descartes, Sciences, Arts)
      const est = activeEstablishment;
      if (est.currentUser === null) {
        return (
          <div className="bg-slate-50 min-h-screen py-10 px-4">
            <CaptivePortal
              establishment={est}
              onLoginSuccess={handleLoginSuccess}
              onCancel={() => handleSelectEstablishment('general')}
            />
          </div>
        );
      }

      return (
        <div className="bg-slate-50 min-h-screen py-6 px-4 md:px-8">
          <Dashboard
            establishment={est}
            searchQuery={searchQuery}
            onNavigateDeep={(path) => setSchoolSubPath(path.slice(1))}
            setSlotContent={setSlotContent}
            setSlotOutline={setSlotOutline}
            slotOutlineActive={slotOutlineActive}
          />
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Level 1 TopBar */}
      <TopBar
        establishments={establishments}
        currentEstablishment={activeEstablishment}
        onSelectEstablishment={handleSelectEstablishment}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onClearNotifications={handleClearNotifications}
        apps={appsList}
        helpTopics={helpTopics}
        onLogoutContext={handleLogoutContext}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        demoSlotContent={slotContent}
        showSlotOutline={slotOutlineActive}
        onSelectApp={handleSelectApp}
      />

      {/* Level 2 BreadcrumbBar */}
      <BreadcrumbBar
        path={getBreadcrumbPath()}
        onNavigate={handleBreadcrumbNavigate}
        currentEstablishment={activeEstablishment}
      />

      {/* Sub-view Content */}
      <main className="flex-1">
        {renderContent()}
      </main>
    </div>
  );
}

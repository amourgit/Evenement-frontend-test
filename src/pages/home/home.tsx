import GeneralHome from "@/components/general/GeneralHome";
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useAppRouter } from './routes/router';
import { Establishment, AppItem, HelpTopic, AppNotification, LocalUser, BreadcrumbItem } from './types';
import { MOCK_APPS, MOCK_HELP, MOCK_NOTIFICATIONS, ESTABLISHMENTS } from './data';

export default function HomePage () {
  const { route, navigate } = useAppRouter();
  const { user, logout } = useAuth();
  const [adminTab, setAdminTab] = useState<'dashboard' | 'events' | 'editor'>('dashboard');
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Tenant states
  const [establishments, setEstablishments] = useState<Establishment[]>(ESTABLISHMENTS);
  const [currentEstId, setCurrentEstId] = useState<string>('general');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [civitasActive, setCivitasActive] = useState<boolean>(false);
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

  const handleEditForm = (eventId: string) => {
    setEditingEventId(eventId);
    setAdminTab('editor');
  };

  // Handle select app from launcher
  const handleSelectApp = (appId: string) => {
    if (appId === 'app_civitas_forms') {
      setCurrentEstId('general');
      setSelectedPostId(null);
      setCivitasActive(true);
      navigate('home');
    } else if (appId === 'app_settings') {
      navigate('admin_login');
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
      if (civitasActive) {
        const path: BreadcrumbItem[] = [
          { id: 'general', label: 'Espace Général', clickable: true },
          { id: 'civitas_forms', label: 'Civitas Forms - Plateforme Municipale', clickable: route.path !== 'home' }
        ];
        if (route.path === 'details') {
          path.push({ id: 'details', label: 'Détails de l\'événement' });
        } else if (route.path === 'register') {
          path.push({ id: 'register', label: 'Inscription' });
        } else if (route.path === 'confirmation') {
          path.push({ id: 'confirmation', label: 'Confirmation' });
        }
        return path;
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
      setCivitasActive(false);
      navigate('home');
    } else if (clickedItem.id === 'civitas_forms') {
      setCivitasActive(true);
      navigate('home');
    } else if (clickedItem.id === currentEstId) {
      setSchoolSubPath([]);
    }
  };

  // Handle selection of establishment in TopBar dropdown
  const handleSelectEstablishment = (id: string) => {
    setCurrentEstId(id);
    setSelectedPostId(null);
    setSchoolSubPath([]);
    // If they switched to general, default to SharePoint hub
    if (id === 'general') {
      setCivitasActive(false);
    }
  };
  return (
      <GeneralHome
        searchQuery={searchQuery}
        onNavigateDeep={(path) => {
          if (path.length > 1 && path[1].id.startsWith('sp_post_')) {
            const postId = path[1].id.replace('sp_post_', '');
            setSelectedPostId(postId);
          }
        }}
      />
  );
}
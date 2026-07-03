import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  School, ChevronDown, Search, Bell, HelpCircle, LayoutGrid, 
  X, Check, LogOut, ShieldCheck, User, Info, Sliders, LogIn, Sparkles
} from 'lucide-react';
import { Establishment, AppNotification, AppItem, HelpTopic } from '@/src/types';

interface TopBarProps {
  establishments: Establishment[];
  currentEstablishment: Establishment;
  onSelectEstablishment: (id: string) => void;
  notifications: AppNotification[];
  onMarkNotificationRead: (id: string) => void;
  onClearNotifications: () => void;
  apps: AppItem[];
  helpTopics: HelpTopic[];
  onLogoutContext: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  // Slots for dynamic central content injection
  demoSlotContent?: React.ReactNode;
  showSlotOutline?: boolean;
  onSelectApp?: (appId: string) => void;
}

export default function TopBar({
  establishments,
  currentEstablishment,
  onSelectEstablishment,
  notifications,
  onMarkNotificationRead,
  onClearNotifications,
  apps,
  helpTopics,
  onLogoutContext,
  searchQuery,
  setSearchQuery,
  demoSlotContent,
  showSlotOutline = false,
  onSelectApp
}: TopBarProps) {
  // Dropdown states
  const [isSchoolOpen, setIsSchoolOpen] = useState(false);
  const [isSearchHoveredOrFocused, setIsSearchHoveredOrFocused] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAppsOpen, setIsAppsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const schoolMenuRef = useRef<HTMLDivElement>(null);
  const notificationMenuRef = useRef<HTMLDivElement>(null);
  const appsMenuRef = useRef<HTMLDivElement>(null);
  const helpMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (schoolMenuRef.current && !schoolMenuRef.current.contains(event.target as Node)) {
        setIsSchoolOpen(false);
      }
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (appsMenuRef.current && !appsMenuRef.current.contains(event.target as Node)) {
        setIsAppsOpen(false);
      }
      if (helpMenuRef.current && !helpMenuRef.current.contains(event.target as Node)) {
        setIsHelpOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Determine color theme based on establishment color
  const getColorClasses = (color: string) => {
    switch(color) {
      case 'emerald': return { bg: 'bg-emerald-50 text-emerald-700', border: 'border-emerald-100', dot: 'bg-emerald-500', badge: 'bg-emerald-500/10 text-emerald-700 border-emerald-200' };
      case 'sky': return { bg: 'bg-sky-50 text-sky-700', border: 'border-sky-100', dot: 'bg-sky-500', badge: 'bg-sky-500/10 text-sky-700 border-sky-200' };
      case 'rose': return { bg: 'bg-rose-50 text-rose-700', border: 'border-rose-100', dot: 'bg-rose-500', badge: 'bg-rose-500/10 text-rose-700 border-rose-200' };
      default: return { bg: 'bg-indigo-50 text-indigo-700', border: 'border-indigo-100', dot: 'bg-indigo-500', badge: 'bg-indigo-500/10 text-indigo-700 border-indigo-200' };
    }
  };

  const currentTheme = getColorClasses(currentEstablishment.color);

  return (
    <div id="top-bar-container" className="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between relative z-50 select-none">
      
      {/* LEFT: Context Selector Dropdown */}
      <div className="flex items-center" ref={schoolMenuRef}>
        <div className="relative">
          <button 
            id="context-selector-btn"
            onClick={() => setIsSchoolOpen(!isSchoolOpen)}
            className="flex items-center gap-2.5 px-2.5 py-1 rounded-[6px] border border-slate-200 cursor-pointer bg-slate-50 hover:bg-slate-100/80 hover:border-blue-500 transition-all duration-200 active:scale-98 text-left"
          >
            {/* Color-coded circular logo placeholder */}
            <div className={`w-6 h-6 rounded-md flex items-center justify-center font-display font-bold text-[10px] uppercase tracking-wider shadow-sm ${currentTheme.bg}`}>
              {currentEstablishment.logoText}
            </div>

            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 font-bold leading-none tracking-wide uppercase">
                {currentEstablishment.id === 'general' ? 'Espace Central' : 'Contexte Établissement'}
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[11px] font-bold text-slate-800 max-w-[140px] truncate leading-none">
                  {currentEstablishment.name}
                </span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isSchoolOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </button>

          {/* Context indicator tag */}
          {currentEstablishment.id !== 'general' && (
            <span className="hidden lg:inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-100 animate-pulse">
              Context d'étude actif
            </span>
          )}

          {/* Dropdown Menu */}
          {isSchoolOpen && (
            <div className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
              <div className="px-3 py-2 border-b border-slate-50">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sélectionner l'établissement</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Le système adaptera vos accès et contextes d'étude automatiquement.</p>
              </div>

              <div className="max-h-72 overflow-y-auto py-1">
                {establishments.map((est) => {
                  const isSelected = est.id === currentEstablishment.id;
                  const estTheme = getColorClasses(est.color);
                  const isAuth = est.currentUser !== null;

                  return (
                    <button
                      key={est.id}
                      onClick={() => {
                        onSelectEstablishment(est.id);
                        setIsSchoolOpen(false);
                      }}
                      className={`w-full px-3 py-2.5 flex items-center justify-between text-left transition-colors duration-150 hover:bg-slate-50 ${
                        isSelected ? 'bg-slate-50/50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-md flex items-center justify-center font-display font-bold text-xs uppercase ${estTheme.bg}`}>
                          {est.logoText}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-slate-700">{est.name}</span>
                          <span className="text-[10px] text-slate-400 truncate max-w-[170px]">{est.domain}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Auth status indicator */}
                        {est.id !== 'general' && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                            isAuth ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-500 border border-rose-100'
                          }`}>
                            {isAuth ? 'Connecté' : 'Verrouillé'}
                          </span>
                        )}
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MIDDLE: Dynamic Container Slot */}
      {/* Reserved space for dynamic page context, invisible by default as requested unless active page injects it. */}
      <div 
        id="dynamic-center-slot"
        className={`flex-1 max-w-sm mx-auto flex items-center justify-center text-xs transition-all duration-300 ${
          showSlotOutline 
            ? 'border border-dashed border-indigo-200 bg-indigo-50/20 rounded-lg p-1.5 min-h-[32px]' 
            : 'invisible'
        }`}
      >
        {demoSlotContent ? (
          <div className="flex items-center gap-2 animate-in fade-in duration-300">
            {demoSlotContent}
          </div>
        ) : (
          <span className="text-[10px] text-slate-400 font-mono tracking-wider italic">
            [Extension Dynamique]
          </span>
        )}
      </div>

      {/* RIGHT: Active UI Items (Search, Notifications, Help, Apps, Profile) */}
      <div className="flex items-center gap-2.5">
        
        {/* 1. Animated Search Bar */}
        <div 
          className="relative flex items-center"
          onMouseEnter={() => setIsSearchHoveredOrFocused(true)}
          onMouseLeave={() => {
            if (document.activeElement !== searchInputRef.current && searchQuery === '') {
              setIsSearchHoveredOrFocused(false);
            }
          }}
        >
          <motion.div
            id="search-container"
            animate={{ width: isSearchHoveredOrFocused || searchQuery !== '' ? 210 : 30 }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            className="h-7.5 bg-slate-50 hover:bg-white rounded-[16px] border border-slate-200 hover:border-slate-300 flex items-center overflow-hidden transition-colors"
          >
            <div className="pl-2 pr-1.5 text-slate-400 flex items-center justify-center pointer-events-none">
              <Search className="w-3.5 h-3.5" />
            </div>
            
            <input
              id="main-search-input"
              ref={searchInputRef}
              type="text"
              placeholder="Rechercher cours, devoirs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchHoveredOrFocused(true)}
              onBlur={() => {
                if (searchQuery === '') {
                  setIsSearchHoveredOrFocused(false);
                }
              }}
              className="w-full bg-transparent border-none outline-none text-xs text-slate-700 placeholder-slate-400 pr-3 h-full"
            />

            {(isSearchHoveredOrFocused || searchQuery !== '') && (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchHoveredOrFocused(false);
                  searchInputRef.current?.blur();
                }}
                className="pr-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </motion.div>
        </div>

        {/* 2. Notifications Trigger */}
        <div className="relative" ref={notificationMenuRef}>
          <button
            id="notifications-trigger"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className={`w-8.5 h-8.5 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-150 relative ${isNotificationOpen ? 'bg-slate-50 border-slate-100' : ''}`}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
              <div className="px-3.5 py-2 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={onClearNotifications}
                    className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    Tout lire
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 px-4 text-center text-slate-400">
                    <Check className="w-6 h-6 mx-auto mb-1.5 text-slate-300 stroke-[1.5]" />
                    <p className="text-xs font-medium">Aucune nouvelle notification</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        onClick={() => onMarkNotificationRead(notif.id)}
                        className={`p-3 text-left transition-colors cursor-pointer hover:bg-slate-50/80 ${!notif.isRead ? 'bg-indigo-50/10' : ''}`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                            notif.type === 'warning' ? 'bg-amber-400' : notif.type === 'success' ? 'bg-emerald-400' : 'bg-blue-400'
                          }`} />
                          <div className="flex-1">
                            <h4 className="text-xs font-semibold text-slate-700 leading-tight">{notif.title}</h4>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{notif.content}</p>
                            <span className="text-[9px] text-slate-400 mt-1 block font-medium">{notif.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 3. Help Trigger */}
        <div className="relative" ref={helpMenuRef}>
          <button
            id="help-trigger"
            onClick={() => setIsHelpOpen(!isHelpOpen)}
            className={`w-8.5 h-8.5 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-150 ${isHelpOpen ? 'bg-slate-50 border-slate-100' : ''}`}
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {isHelpOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 py-2.5 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
              <div className="px-3.5 pb-2 border-b border-slate-50">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Aide & Raccourcis</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Comprendre le fonctionnement du portail tenant.</p>
              </div>

              <div className="p-3.5 space-y-3 max-h-72 overflow-y-auto">
                {helpTopics.map((topic) => (
                  <div key={topic.id} className="space-y-1">
                    <h4 className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-500 shrink-0" />
                      {topic.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed pl-4">{topic.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. Applications Launcher */}
        <div className="relative" ref={appsMenuRef}>
          <button
            id="apps-trigger"
            onClick={() => setIsAppsOpen(!isAppsOpen)}
            className={`w-8.5 h-8.5 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-150 ${isAppsOpen ? 'bg-slate-50 border-slate-100' : ''}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          {isAppsOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
              <div className="px-3.5 py-1.5 border-b border-slate-50">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Applications</h3>
              </div>

              <div className="grid grid-cols-3 gap-1 p-2">
                {apps.map((app) => (
                  <button
                    key={app.id}
                    title={app.description}
                    onClick={() => {
                      if (onSelectApp) {
                        onSelectApp(app.id);
                      }
                      setIsAppsOpen(false);
                    }}
                    className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-slate-50 transition-colors group text-center cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-50/50 group-hover:bg-indigo-100/50 text-indigo-600 flex items-center justify-center transition-colors mb-1.5">
                      <div className="w-4 h-4 flex items-center justify-center">
                        {/* Soft rendering of icons based on string name */}
                        <School className="w-4 h-4 stroke-[2]" />
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-slate-600 group-hover:text-slate-900 truncate w-full px-1">
                      {app.name}
                    </span>
                  </button>
                ))}
              </div>
              <div className="p-2 border-t border-slate-50 bg-slate-50/40 rounded-b-xl text-center">
                <span className="text-[9px] text-slate-400 font-medium">Portail Tenant v2.4.0 (A-Z services)</span>
              </div>
            </div>
          )}
        </div>

        {/* Vertical Separator */}
        <div className="h-5 w-px bg-slate-100" />

        {/* 5. User Connected Profile Menu */}
        <div className="relative" ref={profileMenuRef}>
          <button
            id="profile-trigger"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-50 transition-all duration-150"
          >
            {currentEstablishment.currentUser ? (
              <img
                src={currentEstablishment.currentUser.avatarUrl}
                alt={currentEstablishment.currentUser.name}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border border-dashed border-slate-200">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
              {currentEstablishment.currentUser ? (
                <>
                  <div className="px-3.5 py-2.5 border-b border-slate-50">
                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Compte Local Actif</p>
                    <p className="text-xs font-semibold text-slate-700 mt-1">{currentEstablishment.currentUser.name}</p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{currentEstablishment.currentUser.email}</p>
                    
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="inline-flex items-center text-[9px] font-medium bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
                        {currentEstablishment.currentUser.profile}
                      </span>
                      {currentEstablishment.currentUser.matricule && (
                        <span className="inline-flex items-center text-[9px] font-mono text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                          {currentEstablishment.currentUser.matricule}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="py-1">
                    <div className="px-3.5 py-1 text-[10px] text-slate-400 font-medium">
                      Département : {currentEstablishment.currentUser.department || 'Enseignement'}
                    </div>
                    {currentEstablishment.id !== 'general' && (
                      <button
                        onClick={() => {
                          onLogoutContext();
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Déconnexion locale
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-xs font-medium text-slate-500 mb-2">Non connecté à cet établissement</p>
                  <p className="text-[10px] text-slate-400 mb-3">Veuillez d'abord vous authentifier via le portail captif.</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md">
                    <LogIn className="w-3 h-3" />
                    En attente de connexion
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  GraduationCap, Calendar, Users, Award, BookOpen, Clock, 
  MapPin, ShieldAlert, Sparkles, Plus, AlertCircle, Search, 
  CheckCircle2, ArrowRight, BookOpenCheck, ChevronRight, Activity, ToggleLeft
} from 'lucide-react';
import { Establishment, Course, BreadcrumbItem } from '@/src/types';
import { MOCK_COURSES } from '@/src/data';

interface DashboardProps {
  establishment: Establishment;
  searchQuery: string;
  onNavigateDeep: (path: BreadcrumbItem[]) => void;
  // Controls to feed back into the App for slot demo injection
  setSlotContent: (content: React.ReactNode | null) => void;
  setSlotOutline: (show: boolean) => void;
  slotOutlineActive: boolean;
}

export default function Dashboard({
  establishment,
  searchQuery,
  onNavigateDeep,
  setSlotContent,
  setSlotOutline,
  slotOutlineActive
}: DashboardProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeSlotType, setActiveSlotType] = useState<'none' | 'exams' | 'status' | 'announcement'>('none');

  // Load courses for the selected establishment
  useEffect(() => {
    const list = MOCK_COURSES[establishment.id] || [];
    setCourses(list);
  }, [establishment]);

  // Handle dynamic slot contents to project to the parent app bar
  useEffect(() => {
    if (activeSlotType === 'none') {
      setSlotContent(null);
    } else if (activeSlotType === 'exams') {
      setSlotContent(
        <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-[10px] font-semibold border border-indigo-100 animate-in fade-in duration-300">
          <Calendar className="w-3 h-3 text-indigo-500 shrink-0" />
          <span>Examens Finaux : -12 jours</span>
        </div>
      );
    } else if (activeSlotType === 'status') {
      setSlotContent(
        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-semibold border border-emerald-100 animate-in fade-in duration-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <span>ENT Connecté • 0 ms</span>
        </div>
      );
    } else if (activeSlotType === 'announcement') {
      setSlotContent(
        <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-[10px] font-semibold border border-amber-100 max-w-[180px] truncate animate-in fade-in duration-300">
          <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
          <span className="truncate">Portes Ouvertes Samedi</span>
        </div>
      );
    }
  }, [activeSlotType, setSlotContent]);

  // Clean slot on unmount
  useEffect(() => {
    return () => {
      setSlotContent(null);
    };
  }, [setSlotContent]);

  // Filter courses by search query
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Deep navigation demo triggers (Math, Physics, Philo)
  const handleCourseClick = (course: Course) => {
    const newPath: BreadcrumbItem[] = [
      { id: establishment.id, label: establishment.name },
      { id: 'cours_root', label: 'Espace Pédagogique' },
      { id: `course_${course.id}`, label: course.title }
    ];
    onNavigateDeep(newPath);
  };

  // Quick statistics background mapping
  const getStatColors = (color: string) => {
    switch(color) {
      case 'emerald': return 'text-emerald-600 bg-emerald-50';
      case 'sky': return 'text-sky-600 bg-sky-50';
      case 'rose': return 'text-rose-600 bg-rose-50';
      default: return 'text-indigo-600 bg-indigo-50';
    }
  };

  const statColorClass = getStatColors(establishment.color);

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      
      {/* 1. Header Hero Panel with responsive background */}
      <div className={`p-4 md:p-5 rounded-[6px] border border-slate-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className={`text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-[4px] font-mono ${
              establishment.id === 'general' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-800'
            }`}>
              {establishment.id === 'general' ? 'Rôle Super-Administrateur' : 'Rôle Établissement Actif'}
            </span>
          </div>
          
          <h1 className="text-sm md:text-base font-bold text-slate-900 tracking-tight leading-none">
            Bienvenue dans le Portail {establishment.name}
          </h1>
          <p className="text-[11px] text-slate-500 leading-normal">
            {establishment.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 pt-0.5">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {establishment.address}
            </span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center gap-1 font-mono">
              <Activity className="w-3 h-3 text-emerald-500" />
              {establishment.domain}
            </span>
          </div>
        </div>

        {/* Status indicator card */}
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-[6px] shadow-xs min-w-[180px] shrink-0 self-stretch md:self-auto flex flex-col justify-between">
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Compte actif</p>
            <p className="text-[11px] font-bold text-slate-850 mt-0.5">{establishment.currentUser?.name}</p>
            <p className="text-[10px] text-slate-500">{establishment.currentUser?.profile}</p>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
            <span>Matricule :</span>
            <span className="font-mono font-bold text-slate-700">{establishment.currentUser?.matricule}</span>
          </div>
        </div>
      </div>

      {/* 2. Bento Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Stat 1: Students */}
        <div className="bg-white border border-slate-200 p-3.5 rounded-[6px] flex items-center gap-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className={`w-8.5 h-8.5 rounded-[4px] flex items-center justify-center text-sm font-bold shrink-0 ${statColorClass}`}>
            <Users className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block leading-none">Membres Actifs</span>
            <span className="text-base font-bold text-slate-800 leading-snug">{establishment.stats.students}</span>
            <span className="text-[10px] text-slate-500 block leading-none mt-0.5">Comptes d'étude vérifiés</span>
          </div>
        </div>

        {/* Stat 2: Teachers */}
        <div className="bg-white border border-slate-200 p-3.5 rounded-[6px] flex items-center gap-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className={`w-8.5 h-8.5 rounded-[4px] flex items-center justify-center text-sm font-bold shrink-0 ${statColorClass}`}>
            <GraduationCap className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block leading-none">Enseignants</span>
            <span className="text-base font-bold text-slate-800 leading-snug">{establishment.stats.teachers}</span>
            <span className="text-[10px] text-slate-500 block leading-none mt-0.5">Responsables de section</span>
          </div>
        </div>

        {/* Stat 3: Courses Count */}
        <div className="bg-white border border-slate-200 p-3.5 rounded-[6px] flex items-center gap-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className={`w-8.5 h-8.5 rounded-[4px] flex items-center justify-center text-sm font-bold shrink-0 ${statColorClass}`}>
            <BookOpenCheck className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block leading-none">Matières actives</span>
            <span className="text-base font-bold text-slate-800 leading-snug">{establishment.stats.coursesCount}</span>
            <span className="text-[10px] text-slate-500 block leading-none mt-0.5">Espaces de cours configurés</span>
          </div>
        </div>

      </div>

      {/* 3. Main Split View: Left list / Right Demo controller */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* LEFT 2 COLS: Adaptive Courses */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-800">Espaces Pédagogiques du Contexte</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Cliquez sur un cours pour approfondir le fil d'Ariane de navigation.</p>
            </div>
            
            {searchQuery && (
              <span className="text-[10px] text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-[4px]">
                Filtré : "{searchQuery}"
              </span>
            )}
          </div>

          {filteredCourses.length === 0 ? (
            <div className="bg-white border border-slate-200 p-10 text-center rounded-[6px] space-y-3">
              <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-700">Aucun cours trouvé</p>
                <p className="text-[10px] text-slate-400 max-w-sm mx-auto">
                  Aucun résultat ne correspond à "{searchQuery}" dans {establishment.name}. Essayez d'effacer votre recherche ou de modifier votre terme.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredCourses.map((course) => (
                <div 
                  key={course.id}
                  id={`course-card-${course.id}`}
                  onClick={() => handleCourseClick(course)}
                  className="bg-white border border-slate-200 p-3 rounded-[6px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-blue-400 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono bg-slate-100 text-slate-600 px-1 py-0.5 rounded-[3px] border border-slate-200 font-bold">
                        {course.code}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" />
                        {course.schedule.split(' ')[0]}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-snug">
                      {course.title}
                    </h4>

                    <p className="text-[10px] text-slate-400">
                      Enseignant : <span className="text-slate-500 font-medium">{course.teacherName}</span>
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-150 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">
                      Salle : <span className="font-bold text-slate-600">{course.room}</span>
                    </span>
                    <span className="text-blue-600 font-bold inline-flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                      Accéder
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT 1 COL: Demonstration Controller */}
        <div className="bg-white border border-slate-200 rounded-[6px] p-4 shadow-xs space-y-4 h-fit">
          <div className="border-b border-slate-200 pb-2.5">
            <h3 className="text-xs font-bold text-slate-800">Panneau de Démo Interactif</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Testez et validez le comportement du système de navigation principale.</p>
          </div>

          {/* Test 1: Empty middle bar simulation */}
          <div className="space-y-2">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
              1. Système d'extension dynamique (Top Bar Milieu)
            </span>
            <p className="text-[10px] text-slate-500 leading-normal">
              Le milieu de la Top Bar contient une zone vide destinée à accueillir du contenu selon la logique des pages. Injectez-y un module fictif pour voir le rendu :
            </p>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setActiveSlotType('none')}
                className={`py-1 px-1.5 rounded-[4px] text-[10px] font-semibold border transition-colors cursor-pointer ${
                  activeSlotType === 'none'
                    ? 'bg-slate-100 border-slate-300 text-slate-700'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                Laisser vide
              </button>

              <button
                onClick={() => setActiveSlotType('exams')}
                className={`py-1 px-1.5 rounded-[4px] text-[10px] font-semibold border transition-colors cursor-pointer ${
                  activeSlotType === 'exams'
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                Raccourci Examens
              </button>

              <button
                onClick={() => setActiveSlotType('status')}
                className={`py-1 px-1.5 rounded-[4px] text-[10px] font-semibold border transition-colors cursor-pointer ${
                  activeSlotType === 'status'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                Status Latence ENT
              </button>

              <button
                onClick={() => setActiveSlotType('announcement')}
                className={`py-1 px-1.5 rounded-[4px] text-[10px] font-semibold border transition-colors cursor-pointer ${
                  activeSlotType === 'announcement'
                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                Bannière Info
              </button>
            </div>

            {/* Toggle outline */}
            <button
              onClick={() => setSlotOutline(!slotOutlineActive)}
              className="w-full mt-2 py-1 px-2 rounded-[4px] text-[10px] font-bold flex items-center justify-between border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span className="text-slate-600">Mettre en valeur le milieu</span>
              <span className={`px-1 rounded text-[9px] ${
                slotOutlineActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {slotOutlineActive ? 'Visible' : 'Masqué'}
              </span>
            </button>
          </div>

          {/* Helper details */}
          <div className="bg-slate-50 p-2.5 rounded-[4px] space-y-1 border border-slate-200">
            <h4 className="text-[10px] font-bold text-slate-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              Validation des exigences
            </h4>
            <ul className="text-[10px] text-slate-500 space-y-1 pl-3.5 list-disc leading-relaxed font-medium">
              <li>Nav à deux niveaux disposés de haut en bas (superposés).</li>
              <li>Sélecteur d'établissement à gauche avec mise à jour globale.</li>
              <li>Recherche animée à droite se fermant au repos.</li>
              <li>Conteneur vide et invisible en position "space-between" au milieu.</li>
              <li>Redirection et portail captif si déconnecté de l'établissement.</li>
              <li>Chemin de navigation (breadcrumbs) géré en interne (sans URL).</li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, ChevronRight, ChevronDown, Check, ArrowLeft, GraduationCap } from 'lucide-react';
import { getAcademicContextTree, type AcademicContextNode } from '@/data/academic';

interface AcademicContextSelectorProps {
  /** Appelé avec le nœud final choisi (Parcours, ou tout niveau sans enfants) */
  onSelect?: (node: AcademicContextNode) => void;
  /** Sélection initiale (id du nœud), si déjà connue (ex: profil utilisateur) */
  defaultSelectedId?: string;
}

/** Retrouve le chemin de nœuds menant à un id donné dans l'arbre */
function findPath(tree: AcademicContextNode[], targetId: string, trail: AcademicContextNode[] = []): AcademicContextNode[] | null {
  for (const node of tree) {
    const nextTrail = [...trail, node];
    if (node.id === targetId) return nextTrail;
    if (node.children?.length) {
      const found = findPath(node.children, targetId, nextTrail);
      if (found) return found;
    }
  }
  return null;
}

export default function AcademicContextSelector({ onSelect, defaultSelectedId }: AcademicContextSelectorProps) {
  const [tree] = useState<AcademicContextNode[]>(() => getAcademicContextTree());
  const [isOpen, setIsOpen] = useState(false);
  const [activePath, setActivePath] = useState<AcademicContextNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<AcademicContextNode | null>(() => {
    if (!defaultSelectedId) return null;
    const path = findPath(tree, defaultSelectedId);
    return path ? path[path.length - 1] : null;
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const columnsScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Colonnes à afficher : la racine, puis les enfants de chaque nœud du chemin actif
  const columns: AcademicContextNode[][] = [
    tree,
    ...activePath.map(node => node.children ?? []),
  ].filter(col => col.length > 0);

  const handleOpen = () => {
    setIsOpen(true);
    // Reprend l'exploration là où l'utilisateur s'était arrêté
    if (selectedNode) {
      const path = findPath(tree, selectedNode.id);
      if (path) setActivePath(path.slice(0, -1).length > 0 ? path.slice(0, path.length) : path);
    }
    requestAnimationFrame(() => {
      columnsScrollRef.current?.scrollTo({ left: columnsScrollRef.current.scrollWidth, behavior: 'smooth' });
    });
  };

  const handleNodeClick = (node: AcademicContextNode, columnIndex: number) => {
    const nextPath = [...activePath.slice(0, columnIndex), node];
    setActivePath(nextPath);

    if (!node.hasChildren) {
      setSelectedNode(node);
      onSelect?.(node);
      setIsOpen(false);
      return;
    }

    requestAnimationFrame(() => {
      columnsScrollRef.current?.scrollTo({ left: columnsScrollRef.current.scrollWidth, behavior: 'smooth' });
    });
  };

  const handleGoBack = () => {
    setActivePath(prev => prev.slice(0, -1));
  };

  const typeLabel: Record<AcademicContextNode['type'], string> = {
    ESTABLISHMENT: 'Établissement',
    DEPARTMENT: 'Département',
    PROGRAM: 'Filière',
    TRACK: 'Parcours',
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        id="academic-context-selector-btn"
        onClick={() => (isOpen ? setIsOpen(false) : handleOpen())}
        className="flex items-center gap-2 px-2.5 py-1 rounded-[6px] border border-slate-200 cursor-pointer bg-slate-50 hover:bg-slate-100/80 hover:border-blue-500 transition-all duration-200 active:scale-98 text-left max-w-[260px]"
      >
        <div className="w-6 h-6 rounded-md flex items-center justify-center bg-blue-50 text-blue-600 shrink-0">
          <GraduationCap className="w-3.5 h-3.5" />
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-[9px] text-slate-400 font-bold leading-none tracking-wide uppercase">
            Parcours académique
          </span>
          {selectedNode ? (
            <span className="text-[11px] font-bold text-slate-800 truncate leading-none mt-0.5">
              {selectedNode.path.join(' › ')}
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-slate-500 truncate leading-none mt-0.5">
              Choisir mon contexte
            </span>
          )}
        </div>

        <ChevronDown className={`w-3 h-3 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden w-[min(92vw,760px)]">
          {/* Fil d'Ariane */}
          <div className="px-3.5 py-2.5 border-b border-slate-50 flex items-center justify-between gap-2 bg-slate-50/60">
            <div className="flex items-center gap-1.5 min-w-0 text-[11px] text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              {activePath.length === 0 ? (
                <span className="font-medium text-slate-400">Sélectionnez votre établissement</span>
              ) : (
                <span className="truncate font-medium">
                  {activePath.map((n, i) => (
                    <span key={n.id}>
                      {i > 0 && <span className="mx-1 text-slate-300">›</span>}
                      <span className={i === activePath.length - 1 ? 'text-slate-800 font-semibold' : ''}>{n.name}</span>
                    </span>
                  ))}
                </span>
              )}
            </div>

            {activePath.length > 0 && (
              <button
                onClick={handleGoBack}
                className="md:hidden inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 hover:text-blue-800 shrink-0 cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                Remonter
              </button>
            )}
          </div>

          {/* Colonnes en cascade */}
          <div
            ref={columnsScrollRef}
            className="flex divide-x divide-slate-100 max-w-full overflow-x-auto scroll-smooth"
          >
            {columns.map((column, columnIndex) => {
              const activeNodeId = activePath[columnIndex]?.id;
              // Sur mobile, on n'affiche que la colonne courante (la dernière avec du contenu)
              const isCurrentMobileColumn = columnIndex === columns.length - 1;

              return (
                <div
                  key={columnIndex}
                  className={`w-full sm:w-56 shrink-0 max-h-80 overflow-y-auto py-1 ${isCurrentMobileColumn ? '' : 'hidden md:block'}`}
                >
                  {columnIndex === 0 && (
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Établissements
                    </div>
                  )}
                  {column.map((node) => {
                    const isActive = node.id === activeNodeId;
                    const isSelected = node.id === selectedNode?.id;

                    return (
                      <button
                        key={node.id}
                        onClick={() => handleNodeClick(node, columnIndex)}
                        onMouseEnter={() => {
                          if (window.matchMedia('(hover: hover)').matches) {
                            setActivePath(prev => [...prev.slice(0, columnIndex), node]);
                          }
                        }}
                        className={`w-full px-3 py-2 flex items-center justify-between gap-2 text-left transition-colors duration-100 cursor-pointer ${
                          isActive || isSelected ? 'bg-blue-50/70 text-blue-700' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="flex flex-col min-w-0">
                          <span className="text-[11px] font-medium truncate">{node.name}</span>
                          {columnIndex === 0 && (
                            <span className="text-[9px] text-slate-400 font-mono uppercase">{node.code}</span>
                          )}
                        </span>
                        <span className="shrink-0 flex items-center">
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                          {node.hasChildren && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Pied : niveau du dernier élément survolé */}
          {activePath.length > 0 && (
            <div className="px-3.5 py-2 border-t border-slate-50 bg-slate-50/40 text-[9px] text-slate-400 font-medium">
              Niveau sélectionné : {typeLabel[activePath[activePath.length - 1].type]}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import { ChevronRight, Home, School, Compass, ShieldCheck } from 'lucide-react';
import { BreadcrumbItem, Establishment } from '@/src/types';

interface BreadcrumbBarProps {
  path: BreadcrumbItem[];
  onNavigate: (index: number) => void;
  currentEstablishment: Establishment;
}

export default function BreadcrumbBar({ path, onNavigate, currentEstablishment }: BreadcrumbBarProps) {
  return (
    <div 
      id="breadcrumb-bar" 
      className="h-8 bg-slate-50 border-b border-slate-200 px-4 flex items-center justify-between text-[11px] select-none"
    >
      {/* Breadcrumbs List */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
        {/* Core Tenant Node (Anchor) */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-slate-400">
            <Compass className="w-3.5 h-3.5" />
          </span>
          <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            Tenant Edu
          </span>
        </div>

        <ChevronRight className="w-2.5 h-2.5 text-slate-300 shrink-0" />

        {/* Dynamic State Path */}
        {path.map((item, index) => {
          const isLast = index === path.length - 1;
          const isClickable = item.clickable !== false && !isLast;

          return (
            <div key={item.id} className="flex items-center gap-1 shrink-0">
              {index > 0 && <ChevronRight className="w-2.5 h-2.5 text-slate-300 shrink-0" />}
              
              <button
                id={`breadcrumb-node-${item.id}`}
                onClick={() => isClickable && onNavigate(index)}
                disabled={!isClickable}
                className={`flex items-center gap-1 py-0.5 px-1 rounded-[4px] transition-all text-[11px] ${
                  isClickable 
                    ? 'text-slate-500 hover:text-slate-800 hover:bg-white border border-transparent hover:border-slate-200 cursor-pointer font-medium' 
                    : 'text-slate-800 font-bold'
                }`}
              >
                {/* Visual decorators for specific nodes */}
                {item.id === 'general' && <Home className="w-3 h-3 text-indigo-500" />}
                {item.id.startsWith('lycee_') && <School className="w-3 h-3 text-emerald-500" />}
                {item.id.startsWith('univ_') && <School className="w-3 h-3 text-sky-500" />}
                {item.id.startsWith('institut_') && <School className="w-3 h-3 text-rose-500" />}
                
                <span>{item.label}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Right Side: Virtual Navigation Status */}
      <div className="hidden sm:flex items-center gap-2">
        <span className="text-[9px] text-slate-400 font-mono flex items-center gap-1 bg-white border border-slate-200 py-0.5 px-1.5 rounded-full">
          <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
          Chemin Virtuel
        </span>
      </div>
    </div>
  );
}

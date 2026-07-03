import React from 'react';
import { 
  Type, AlignLeft, Mail, Phone, Hash, CheckSquare, 
  Calendar, Clock, List, Upload, Image, Link, Star, PenTool 
} from 'lucide-react';
import { FieldDataType } from '@/src/types/field';

interface FieldPaletteProps {
  className?: string;
  onPick: (type: FieldDataType) => void;
}

interface PaletteItem {
  type: FieldDataType;
  label: string;
  icon: React.ReactNode;
  bgClass: string;
}

const PALETTE_ITEMS: PaletteItem[] = [
  { type: 'short_text', label: 'Texte court', icon: <Type className="w-4 h-4 text-sky-600" />, bgClass: 'bg-sky-50' },
  { type: 'long_text', label: 'Texte long', icon: <AlignLeft className="w-4 h-4 text-blue-600" />, bgClass: 'bg-blue-50' },
  { type: 'email', label: 'Email', icon: <Mail className="w-4 h-4 text-purple-600" />, bgClass: 'bg-purple-50' },
  { type: 'phone', label: 'Téléphone', icon: <Phone className="w-4 h-4 text-emerald-600" />, bgClass: 'bg-emerald-50' },
  { type: 'number', label: 'Nombre entier', icon: <Hash className="w-4 h-4 text-amber-600" />, bgClass: 'bg-amber-50' },
  { type: 'decimal', label: 'Décimal', icon: <Hash className="w-4 h-4 text-orange-600" />, bgClass: 'bg-orange-50' },
  { type: 'boolean', label: 'Case à cocher', icon: <CheckSquare className="w-4 h-4 text-rose-600" />, bgClass: 'bg-rose-50' },
  { type: 'date', label: 'Date', icon: <Calendar className="w-4 h-4 text-teal-600" />, bgClass: 'bg-teal-50' },
  { type: 'datetime', label: 'Date & Heure', icon: <Clock className="w-4 h-4 text-violet-600" />, bgClass: 'bg-violet-50' },
  { type: 'single_select', label: 'Sélecteur simple', icon: <List className="w-4 h-4 text-indigo-600" />, bgClass: 'bg-indigo-50' },
  { type: 'multi_select', label: 'Choix multiples', icon: <List className="w-4 h-4 text-fuchsia-600" />, bgClass: 'bg-fuchsia-50' },
  { type: 'file', label: 'Fichier', icon: <Upload className="w-4 h-4 text-slate-600" />, bgClass: 'bg-slate-100' },
  { type: 'image', label: 'Image', icon: <Image className="w-4 h-4 text-cyan-600" />, bgClass: 'bg-cyan-50' },
  { type: 'url', label: 'Lien', icon: <Link className="w-4 h-4 text-lime-600" />, bgClass: 'bg-lime-50' },
  { type: 'rating', label: 'Note (étoiles)', icon: <Star className="w-4 h-4 text-yellow-600 fill-yellow-200" />, bgClass: 'bg-yellow-50' },
  { type: 'signature', label: 'Signature', icon: <PenTool className="w-4 h-4 text-emerald-700" />, bgClass: 'bg-emerald-100' },
];

export function FieldPalette({ className = '', onPick }: FieldPaletteProps) {
  return (
    <div className={`grid grid-cols-2 gap-1.5 ${className}`}>
      {PALETTE_ITEMS.map((item) => (
        <button
          key={item.type}
          type="button"
          onClick={() => onPick(item.type)}
          className={`flex items-center gap-2 p-2 rounded border border-slate-150 hover:border-indigo-300 hover:shadow-sm text-[10px] font-bold text-slate-700 transition-all text-left cursor-pointer ${item.bgClass}`}
        >
          {item.icon}
          <span className="truncate">{item.label}</span>
        </button>
      ))}
    </div>
  );
}

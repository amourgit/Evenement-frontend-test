import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EventNotFoundPageProps {
  onBack: () => void;
}

export function EventNotFoundPage({ onBack }: EventNotFoundPageProps) {
  return (
    <div className="max-w-md mx-auto text-center py-16 space-y-6">
      <div className="flex justify-center">
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-full">
          <ShieldAlert className="w-10 h-10" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Démarche introuvable</h3>
        <p className="text-xs text-slate-500 font-medium">
          La démarche administrative ou l'événement recherché n'existe pas ou a expiré.
        </p>
      </div>

      <Button onClick={onBack} variant="outline" className="text-xs cursor-pointer">
        <ArrowLeft className="w-3.5 h-3.5 mr-1" />
        Retourner au Portail Central
      </Button>
    </div>
  );
}
export default EventNotFoundPage;

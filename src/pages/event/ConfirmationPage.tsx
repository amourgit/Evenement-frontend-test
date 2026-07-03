import React from 'react';
import { CheckCircle2, ShieldCheck, Home, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConfirmationPageProps {
  receiptId: string;
  onReturnHome: () => void;
}

export function ConfirmationPage({ receiptId, onReturnHome }: ConfirmationPageProps) {
  return (
    <div className="max-w-md mx-auto text-center py-12 space-y-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl mt-6 font-sans">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-100 shadow-sm animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
          Inscription Transmise avec Succès !
        </h2>
        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
          Votre formulaire a été correctement réceptionné par le service administratif de la mairie. Un email de confirmation récapitulatif vous a été envoyé.
        </p>
      </div>

      {/* Receipt card */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-semibold space-y-2">
        <span className="block text-slate-400 text-[10px] uppercase tracking-wider font-black">Référence de Dossier</span>
        <span className="font-mono text-xs text-[#0078d4] font-bold block bg-white px-3 py-1 rounded border border-slate-150 shadow-xs uppercase select-all">
          {receiptId}
        </span>
        <p className="text-[10px] text-slate-400 italic mt-1">
          * Conservez cette référence précieusement pour le suivi de votre candidature.
        </p>
      </div>

      <div className="pt-4 flex flex-col gap-2">
        <Button onClick={onReturnHome} className="w-full text-xs cursor-pointer py-2.5">
          <Home className="w-4 h-4 mr-1.5" />
          Retourner à l'Accueil du Portail
        </Button>
      </div>
    </div>
  );
}
export default ConfirmationPage;

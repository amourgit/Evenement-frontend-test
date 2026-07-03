import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Lock, ArrowRight, ShieldAlert, GraduationCap, Briefcase, 
  Settings, Key, AlertCircle, Info, Landmark, HelpCircle, CheckCircle2, User
} from 'lucide-react';
import { Establishment, ProfileType, LocalUser } from '@/src/types';

interface CaptivePortalProps {
  establishment: Establishment;
  onLoginSuccess: (user: LocalUser) => void;
  onCancel: () => void;
}

const DEFAULT_CREDENTIALS: Record<ProfileType, { name: string; email: string; dept: string; matricule: string }> = {
  'Étudiant': {
    name: 'Thomas Morel',
    email: 'thomas.morel@student.tenant-edu.fr',
    dept: 'Sciences Informatiques / Terminale S',
    matricule: 'ETU-2026-9041'
  },
  'Enseignant': {
    name: 'Mme. Valérie Dubois',
    email: 'v.dubois@teacher.tenant-edu.fr',
    dept: 'Mathématiques & Informatique',
    matricule: 'ENS-55102'
  },
  'Administration': {
    name: 'M. Jean-Claude Martin',
    email: 'j.martin@admin.tenant-edu.fr',
    dept: 'Direction des Études',
    matricule: 'ADM-11209'
  },
  'Parent': {
    name: 'Marc Morel',
    email: 'm.morel@parent.tenant-edu.fr',
    dept: 'Parent d\'élève (Thomas)',
    matricule: 'PAR-8801'
  }
};

export default function CaptivePortal({ establishment, onLoginSuccess, onCancel }: CaptivePortalProps) {
  const [selectedProfile, setSelectedProfile] = useState<ProfileType>('Étudiant');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Auto-fill mock credentials on profile change
  useEffect(() => {
    const creds = DEFAULT_CREDENTIALS[selectedProfile];
    if (creds) {
      setUsername(creds.email);
    }
  }, [selectedProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate network authentication delay
    setTimeout(() => {
      const creds = DEFAULT_CREDENTIALS[selectedProfile];
      if (!username || username.trim() === '') {
        setError('L\'identifiant ou l\'adresse e-mail est requis.');
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setIsLoading(false);

      // Transition to actual success callback
      setTimeout(() => {
        onLoginSuccess({
          id: `usr_${selectedProfile.toLowerCase()}_${Date.now()}`,
          name: creds.name,
          email: username,
          avatarUrl: selectedProfile === 'Enseignant' 
            ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80' 
            : selectedProfile === 'Administration'
            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
            : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
          profile: selectedProfile,
          matricule: creds.matricule,
          department: creds.dept
        });
      }, 1000);

    }, 1500);
  };

  // Determine school theme colors
  const getThemeColors = (color: string) => {
    switch(color) {
      case 'emerald': return { primary: 'bg-emerald-600 hover:bg-emerald-700 text-white', text: 'text-emerald-700', border: 'border-emerald-200', bgLight: 'bg-emerald-50/50', accent: 'emerald' };
      case 'sky': return { primary: 'bg-sky-600 hover:bg-sky-700 text-white', text: 'text-sky-700', border: 'border-sky-200', bgLight: 'bg-sky-50/50', accent: 'sky' };
      case 'rose': return { primary: 'bg-rose-600 hover:bg-rose-700 text-white', text: 'text-rose-700', border: 'border-rose-200', bgLight: 'bg-rose-50/50', accent: 'rose' };
      default: return { primary: 'bg-indigo-600 hover:bg-indigo-700 text-white', text: 'text-indigo-700', border: 'border-indigo-200', bgLight: 'bg-indigo-50/50', accent: 'indigo' };
    }
  };

  const theme = getThemeColors(establishment.color);

  return (
    <div id="captive-portal-wrapper" className="max-w-3xl mx-auto py-6 px-4 flex flex-col md:flex-row items-stretch gap-5">
      
      {/* LEFT PANEL: Context / Information */}
      <div className="flex-1 bg-white border border-slate-200 rounded-[6px] p-5 md:p-6 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.05)] relative overflow-hidden">
        
        {/* Subtle decorative background blur */}
        <div className={`absolute -right-16 -top-16 w-36 h-36 rounded-full blur-3xl opacity-25 bg-${theme.accent}-500`} />

        <div className="space-y-4 z-10 relative">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-md flex items-center justify-center font-display font-bold text-xs tracking-wider uppercase ${establishment.id === 'lycee_descartes' ? 'bg-emerald-50 text-emerald-700' : establishment.id === 'univ_sciences' ? 'bg-sky-50 text-sky-700' : 'bg-rose-50 text-rose-700'}`}>
              {establishment.logoText}
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-800 leading-tight">{establishment.name}</h2>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">{establishment.domain}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-[6px]">
              <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                <Landmark className="w-3 h-3" />
                Portail captif sécurisé
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Vous tentez d'accéder aux ressources numériques privées de cet établissement. En tant que membre du Tenant Éducatif, vous devez vous authentifier localement à l'aide de votre compte dédié.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-slate-700">Règles d'accès :</h4>
              <ul className="space-y-1 text-[11px] text-slate-500">
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded bg-slate-100 text-slate-400 flex items-center justify-center text-[9px] shrink-0 mt-0.5">1</div>
                  <span>Les identifiants sont fournis par le secrétariat de l'école.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded bg-slate-100 text-slate-400 flex items-center justify-center text-[9px] shrink-0 mt-0.5">2</div>
                  <span>Chaque profil (Élève, Enseignant, Admin) ouvre un espace de travail personnalisé.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded bg-slate-100 text-slate-400 flex items-center justify-center text-[9px] shrink-0 mt-0.5">3</div>
                  <span>Vos sessions restent isolées pour préserver la confidentialité de chaque établissement.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <Key className="w-3.5 h-3.5" />
            Double authentification LDAP
          </span>
          <button 
            type="button" 
            onClick={onCancel}
            className="hover:text-blue-600 font-semibold cursor-pointer transition-colors"
          >
            Retourner à l'Espace Général
          </button>
        </div>
      </div>

      {/* RIGHT PANEL: Credentials & Login Form */}
      <div className="flex-[1.2] bg-white border border-slate-200 rounded-[6px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-5 md:p-6 flex flex-col justify-center">
        
        {success ? (
          <div key="success-state" className="text-center py-12 space-y-4">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Authentification réussie !</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Connexion sécurisée en cours avec le profil <span className="font-semibold text-slate-700">{selectedProfile}</span>...
            </p>
            <div className="w-24 h-1 bg-slate-100 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-emerald-500 animate-infinite-loading rounded-full" />
            </div>
          </div>
        ) : (
          <form key="login-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="text-center md:text-left">
              <h3 className="text-base font-bold text-slate-800">Accéder à mon espace</h3>
              <p className="text-xs text-slate-400 mt-0.5">Choisissez d'abord votre profil pour charger votre compte d'étude local.</p>
            </div>

            {/* Profile Selection Matrix */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">1. Choisir le contexte de compte</label>
              <div className="grid grid-cols-2 gap-2">
                
                {/* 1. Student */}
                <button
                  type="button"
                  onClick={() => setSelectedProfile('Étudiant')}
                  className={`p-2 rounded-[6px] border text-left flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                    selectedProfile === 'Étudiant'
                      ? `border-blue-500 bg-blue-50/50 text-blue-900 shadow-sm font-semibold`
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                    selectedProfile === 'Étudiant' ? 'bg-blue-100/60' : 'bg-slate-100'
                  }`}>
                    <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] leading-none font-medium">Étudiant / Élève</span>
                  </div>
                </button>

                {/* 2. Teacher */}
                <button
                  type="button"
                  onClick={() => setSelectedProfile('Enseignant')}
                  className={`p-2 rounded-[6px] border text-left flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                    selectedProfile === 'Enseignant'
                      ? `border-blue-500 bg-blue-50/50 text-blue-900 shadow-sm font-semibold`
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                    selectedProfile === 'Enseignant' ? 'bg-blue-100/60' : 'bg-slate-100'
                  }`}>
                    <Briefcase className="w-3.5 h-3.5 shrink-0" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] leading-none font-medium">Enseignant</span>
                  </div>
                </button>

                {/* 3. Administration */}
                <button
                  type="button"
                  onClick={() => setSelectedProfile('Administration')}
                  className={`p-2 rounded-[6px] border text-left flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                    selectedProfile === 'Administration'
                      ? `border-blue-500 bg-blue-50/50 text-blue-900 shadow-sm font-semibold`
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                    selectedProfile === 'Administration' ? 'bg-blue-100/60' : 'bg-slate-100'
                  }`}>
                    <Settings className="w-3.5 h-3.5 shrink-0" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] leading-none font-medium">Administration</span>
                  </div>
                </button>

                {/* 4. Parent */}
                <button
                  type="button"
                  onClick={() => setSelectedProfile('Parent')}
                  className={`p-2 rounded-[6px] border text-left flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                    selectedProfile === 'Parent'
                      ? `border-blue-500 bg-blue-50/50 text-blue-900 shadow-sm font-semibold`
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                    selectedProfile === 'Parent' ? 'bg-blue-100/60' : 'bg-slate-100'
                  }`}>
                    <User className="w-3.5 h-3.5 shrink-0" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] leading-none font-medium">Parent</span>
                  </div>
                </button>

              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">2. Renseigner les identifiants</label>
              
              <div className="space-y-2.5">
                <div>
                  <label className="text-[10px] font-medium text-slate-500 block mb-1">Identifiant d'établissement (E-mail)</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="nom.prenom@ecole.tenant-edu.fr"
                    className="w-full text-xs px-2.5 py-2 rounded-[4px] border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all duration-150 text-slate-700"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-medium text-slate-500">Mot de passe</label>
                    <a href="#" className="text-[9px] text-slate-400 hover:text-slate-600 font-medium">Oublié ?</a>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Votre mot de passe"
                    className="w-full text-xs px-2.5 py-2 rounded-[4px] border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all duration-150 text-slate-700"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-[4px] flex items-start gap-2 text-rose-700 text-[11px] animate-shake">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p className="font-semibold">{error}</p>
              </div>
            )}

            <div className="bg-slate-50 p-2.5 rounded-[4px] border border-slate-200 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-500 leading-relaxed">
                <span className="font-bold text-slate-600">Donnée de démonstration:</span> Le mot de passe n'est pas vérifié dans cette démo. Choisissez simplement un profil, l'identifiant est prérempli, puis cliquez sur connexion pour simuler le processus complet !
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-2 text-xs text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-[4px] font-bold transition-all duration-150 cursor-pointer"
              >
                Annuler
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className={`flex-[1.8] py-2 px-4 text-xs font-bold rounded-[4px] flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-98 cursor-pointer ${
                  isLoading ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                    Vérification LDAP...
                  </span>
                ) : (
                  <>
                    Se connecter à l'espace
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}
      </div>

      {/* Embedded extra styling for specific simulated animation */}
      <style>{`
        @keyframes infinite-loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-infinite-loading {
          animation: infinite-loading 1.2s infinite linear;
          width: 50%;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s 2 ease-in-out;
        }
      `}</style>

    </div>
  );
}

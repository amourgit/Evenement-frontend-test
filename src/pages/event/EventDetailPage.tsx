import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Building2, Bell, Share2, Sparkles, Flame, CloudSun, HelpCircle, FileText } from 'lucide-react';
import { fetchEventById } from '@/lib/api/events';
import { Event } from '@/src/types/event';
import { Button } from '@/components/ui/button';

interface EventDetailPageProps {
  eventId?: string; // fallback prop
  onBack: () => void;
  onGoToRegister: (id: string) => void;
}

export function EventDetailPage({ eventId: propEventId, onBack, onGoToRegister }: EventDetailPageProps) {
  // Read eventId from URL parameters
  const { id: urlEventId } = useParams<{ id: string }>();
  const eventId = urlEventId || propEventId;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      if (!eventId) {
        setLoading(false);
        return;
      }
      try {
        const data = await fetchEventById(eventId);
        setEvent(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-t-[#0078d4] border-slate-200" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="text-sm font-black text-rose-600 uppercase">Événement introuvable ou inexistant</h3>
        <p className="text-xs text-slate-500">L'identifiant de démarche fourni n'a pas pu être chargé depuis la base de données.</p>
        <button onClick={onBack} className="text-xs font-bold text-[#0078d4] hover:underline cursor-pointer">
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <div>
        <button 
          onClick={onBack}
          className="flex items-center gap-1.5 hover:bg-slate-200 hover:text-[#0078d4] px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 transition-all cursor-pointer border border-slate-200 bg-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Retour au Portail Public
        </button>
      </div>

      {/* Main Grid Layout: left detail column (8 cols), right sticky sidebar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: EVENT DETAILS */}
        <div className="lg:col-span-8 space-y-6">
          {/* Cover image or colored header */}
          {event.theme.bannerUrl ? (
            <div className="rounded-2xl overflow-hidden shadow-sm">
              <img src={event.theme.bannerUrl} className="w-full h-64 md:h-80 object-cover" alt={event.title} />
            </div>
          ) : (
            <div className="w-full h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl" />
          )}

          {/* Core metadata card */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-mono bg-[#0078d4]/10 text-[#0078d4] px-2.5 py-0.5 rounded-full font-bold uppercase">
                {event.category}
              </span>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold uppercase border border-emerald-100">
                Inscriptions Ouvertes
              </span>
            </div>

            <h1 className="text-sm md:text-xl font-black text-slate-900 uppercase tracking-tight leading-snug">
              {event.title}
            </h1>

            <p className="text-xs text-slate-600 leading-relaxed font-medium whitespace-pre-line">
              {event.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-[11px] text-slate-600 font-bold">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0078d4]" />
                <div>
                  <span className="block text-slate-400 font-bold uppercase text-[9px]">Date de rencontre</span>
                  <span>{event.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0078d4]" />
                <div>
                  <span className="block text-slate-400 font-bold uppercase text-[9px]">Adresse & Lieu</span>
                  <span>{event.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#0078d4]" />
                <div>
                  <span className="block text-slate-400 font-bold uppercase text-[9px]">Service Organisateur</span>
                  <span>{event.organizer}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-6 flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => onGoToRegister(event.id)}
                className="flex-1 bg-[#0078d4] hover:bg-[#005a9e] text-white py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-md"
              >
                Remplir le Formulaire d'Inscription
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Lien de la démarche copié dans votre presse-papiers !');
                }}
                className="sm:w-auto text-xs"
              >
                <Share2 className="w-4 h-4 mr-1 text-slate-600" />
                Partager
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STICKY SIDEBAR (SP like sidebar with news, weather, support widgets) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          
          {/* Weather Widget */}
          <div className="p-5 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl text-white shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider">Météo Locale</span>
              <CloudSun className="w-5 h-5 text-amber-200 fill-amber-200" />
            </div>
            <div>
              <p className="text-2xl font-black">24°C</p>
              <p className="text-[11px] font-semibold text-sky-100 mt-0.5">Ciel dégagé - Idéal pour les sorties municipales !</p>
            </div>
          </div>

          {/* Municipal announcements */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Bell className="w-4 h-4 text-indigo-600 animate-swing" />
              <h4 className="text-[10px] font-black uppercase text-slate-800 tracking-wider">Brèves Municipales</h4>
            </div>

            <div className="space-y-3.5 text-xs font-semibold text-slate-700">
              <div className="space-y-1">
                <span className="text-[9px] font-mono bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded font-bold uppercase">TRAVAUX</span>
                <p className="leading-snug">Fermeture de l'Avenue de la République les 14 et 15 septembre.</p>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-mono bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold uppercase">SOLIDARITÉ</span>
                <p className="leading-snug">Collecte de fournitures scolaires pour la rentrée 2026 à l'Hôtel de Ville.</p>
              </div>
            </div>
          </div>

          {/* Advertisement / Promo banner */}
          <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl space-y-3">
            <div className="flex items-center gap-1.5 text-amber-800 text-[10px] font-black uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-200 animate-pulse" />
              <span>Sponsorisé par Civitas</span>
            </div>
            <p className="text-xs font-bold text-slate-800 leading-snug">
              Découvrez la nouvelle navette électrique 100% autonome gratuite reliant la gare au centre-ville !
            </p>
          </div>

          {/* FAQ/Support helpful documents */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
            <div className="flex items-center gap-1.5 text-slate-800 text-[10px] font-black uppercase tracking-wider border-b pb-2">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Assistance administrative</span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
              Pour toute question sur la constitution de votre dossier ou en cas de dysfonctionnement technique lors du remplissage, notre cellule d'accueil est à votre disposition au numéro vert municipal.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
export default EventDetailPage;

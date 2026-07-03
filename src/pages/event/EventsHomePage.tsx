import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, ArrowRight, Compass, Search, Sparkles } from 'lucide-react';
import { fetchEvents } from '@/lib/api/events';
import { Event } from '@/src/types/event';
import { Card } from '@/components/ui/card';

interface EventsHomePageProps {
  onSelectEvent: (id: string) => void;
}

export function EventsHomePage({ onSelectEvent }: EventsHomePageProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('Tous');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchEvents();
        // Only show published events for citizens
        setEvents(data.filter(e => e.status === 'published'));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categories = ['Tous', 'Citoyenneté & Vie Locale', 'Culture & Événementiel', 'Sport & Loisirs'];

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Tous' || e.category === activeCategory || 
                            (activeCategory === 'Sport & Loisirs' && e.category.includes('Sport'));
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-t-[#0078d4] border-slate-200" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Header Section */}
      <div className="bg-[#0078d4] text-white p-8 md:p-12 rounded-3xl space-y-6 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-1/4 translate-x-1/6">
          <Compass className="w-96 h-96" />
        </div>

        <div className="max-w-2xl space-y-4">
          <span className="bg-white/10 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border border-white/20">
            Guichet Unique Communal
          </span>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight leading-none uppercase">
            Participez activement aux initiatives de votre commune
          </h2>
          <p className="text-xs md:text-sm text-sky-150 leading-relaxed font-semibold">
            Inscrivez-vous aux conseils municipaux, déposez des candidatures pour les événements associatifs locaux ou proposez vos représentations d'artistes en toute simplicité.
          </p>
        </div>
      </div>

      {/* Filter and search segment */}
      <div className="space-y-6" id="events">
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between border-b pb-4">
          <div>
            <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">
              Formulaires et Déclarations Actifs
            </h3>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
              Sélectionnez une thématique ou saisissez des mots-clés pour trouver la démarche correspondante.
            </p>
          </div>

          <div className="relative w-full md:max-w-xs text-xs">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une démarche..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-[4px] bg-white focus:outline-none focus:border-[#0078d4]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category triggers */}
        <div className="flex flex-wrap gap-2 text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#0078d4] text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Form list grid */}
        {filteredEvents.length === 0 ? (
          <p className="text-xs text-slate-400 py-12 text-center">Aucune démarche active ne correspond à vos critères.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <Card 
                key={event.id} 
                onClick={() => onSelectEvent(event.id)}
                className="flex flex-col justify-between"
              >
                {event.theme.bannerUrl && (
                  <img src={event.theme.bannerUrl} className="w-full h-40 object-cover" alt={event.title} />
                )}

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded uppercase">
                        {event.category}
                      </span>
                    </div>
                    <h4 className="text-xs font-black text-slate-900 tracking-tight leading-normal uppercase line-clamp-2">
                      {event.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-semibold line-clamp-3">
                      {event.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-50 space-y-2 text-[11px] text-slate-500 font-bold">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Date : {event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">Lieu : {event.location}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-[#0078d4] font-black uppercase tracking-wider">
                    <span>Accéder aux détails</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default EventsHomePage;

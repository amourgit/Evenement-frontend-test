import React, { useEffect, useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { eventsApi } from '@/lib/api/events';
import { EventRecord, EventTheme } from '@/src/types/event';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EventThemeEditor } from '@/components/admin/EventThemeEditor';

interface EventEditorPageProps {
  eventId: string;
  onBack: () => void;
}

export function EventEditorPage({ eventId, onBack }: EventEditorPageProps) {
  const [event, setEvent] = useState<EventRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'theme'>('info');
  const [loading, setLoading] = useState<boolean>(true);

  // Form states
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [shortDesc, setShortDesc] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [organizer, setOrganizer] = useState<string>('');

  const loadEvent = async () => {
    try {
      const data = await eventsApi.getById(eventId);
      setEvent(data);
      setTitle(data.title);
      setDescription(data.description);
      setShortDesc(data.short_description || '');
      setDate(data.date);
      setLocation(data.location);
      setCategory(data.category);
      setOrganizer(data.organizer);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    try {
      await eventsApi.update(eventId, {
        title,
        description,
        short_description: shortDesc,
        date,
        location,
        category,
        organizer
      });
      alert('Informations enregistrées avec succès !');
      await loadEvent();
    } catch (e) {
      console.error(e);
    }
  };

  const handleThemeChange = async (newTheme: EventTheme) => {
    if (!event) return;
    try {
      await eventsApi.update(eventId, { theme: newTheme });
      setEvent(prev => prev ? { ...prev, theme: newTheme } : null);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-t-[#0078d4] border-slate-200" />
      </div>
    );
  }

  if (!event) {
    return <p className="text-xs text-rose-600 font-bold">Événement introuvable.</p>;
  }

  return (
    <div className="space-y-6">
      {/* Return & Title bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
        <div className="space-y-1">
          <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-[#0078d4] font-bold hover:underline cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            Retour à la liste
          </button>
          <h2 className="text-sm font-black text-slate-950 uppercase mt-2 tracking-tight">
            Modification de : <span className="text-indigo-600">{event.title}</span>
          </h2>
        </div>
      </div>

      {/* Editor Tabs bar */}
      <div className="border-b border-slate-200 flex flex-wrap gap-1">
        {(['info', 'theme'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === tab
                ? 'border-[#0078d4] text-[#0078d4]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab === 'info' && '1. Général & Lieu'}
            {tab === 'theme' && '2. Personnalisation Visuelle'}
          </button>
        ))}
      </div>

      {/* Render Active Tab Panels */}
      {activeTab === 'info' && (
        <form onSubmit={handleSaveInfo} className="bg-white border border-slate-200 p-6 rounded-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
            <Input
              label="Titre Officiel de l'Événement"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Input
              label="Thématique / Catégorie"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <Input
              label="Organisateur"
              required
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
            />

            <Input
              label="Date de l'événement"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <Input
              label="Adresse / Lieu de rencontre"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <Input
              label="Description courte (Résumé)"
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
            />
          </div>

          <Textarea
            label="Description Longue / Consignes d'inscription"
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button type="submit" className="w-full sm:w-auto text-xs cursor-pointer">
            <Save className="w-3.5 h-3.5 mr-1.5" />
            Enregistrer les informations générales
          </Button>
        </form>
      )}


      {activeTab === 'theme' && (
        <EventThemeEditor
          theme={event.theme}
          onChange={handleThemeChange}
        />
      )}
    </div>
  );
}
export default EventEditorPage;

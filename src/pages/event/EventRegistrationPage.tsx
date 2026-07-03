import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, CheckCircle } from 'lucide-react';
import { fetchEventById } from '@/lib/api/events';
import { createSubmission } from '@/lib/api/submissions';
import { validateField } from '@/lib/validation/fieldValidator';
import { Event } from '@/src/types/event';
import { FormField } from '@/src/types/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface EventRegistrationPageProps {
  eventId?: string; // fallback prop
  onBack: () => void;
  onSubmitSuccess: (receiptId: string) => void;
}

export function EventRegistrationPage({ eventId: propEventId, onBack, onSubmitSuccess }: EventRegistrationPageProps) {
  const { id: urlEventId } = useParams<{ id: string }>();
  const eventId = urlEventId || propEventId;

  const [event, setEvent] = useState<Event | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      if (!eventId) {
        setLoading(false);
        return;
      }
      try {
        const data = await fetchEventById(eventId);
        setEvent(data);
        
        // Setup initial default values if any
        if (data && data.fields) {
          const initialAnswers: Record<string, any> = {};
          data.fields.forEach(field => {
            initialAnswers[field.id] = field.defaultValue || '';
            if (field.type === 'checkbox') {
              initialAnswers[field.id] = field.defaultValue === 'true' || false;
            }
          });
          setAnswers(initialAnswers);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [eventId]);

  const handleSetFieldValue = (fieldId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
    // Clear validation error when typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: null }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    // Validate fields
    const newErrors: Record<string, string | null> = {};
    let hasErrors = false;

    event.fields.forEach(field => {
      const err = validateField(field, answers[field.id]);
      if (err) {
        newErrors[field.id] = err;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      alert('Veuillez corriger les erreurs de saisie avant de soumettre.');
      return;
    }

    setSubmitting(true);
    try {
      const submission = await createSubmission(event.id, answers);
      onSubmitSuccess(submission.id);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const value = answers[field.id] || '';
    const error = errors[field.id];

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'date':
        return (
          <Input
            type={field.type}
            value={value}
            onChange={(e) => handleSetFieldValue(field.id, e.target.value)}
            placeholder={field.placeholder}
            error={error}
            required={field.validation.required}
          />
        );
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleSetFieldValue(field.id, e.target.value)}
            placeholder={field.placeholder}
            error={error}
            required={field.validation.required}
            rows={4}
          />
        );
      case 'select':
        return (
          <Select
            value={value}
            onChange={(e) => handleSetFieldValue(field.id, e.target.value)}
            error={error}
            required={field.validation.required}
          >
            <option value="">Sélectionner...</option>
            {field.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </Select>
        );
      case 'checkbox':
        return (
          <Checkbox
            label={field.label}
            checked={Boolean(value)}
            onChange={(e) => handleSetFieldValue(field.id, e.target.checked)}
          />
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map(opt => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={field.id}
                  value={opt}
                  checked={value === opt}
                  onChange={(e) => handleSetFieldValue(field.id, e.target.value)}
                  required={field.validation.required}
                />
                <span className="text-xs">{opt}</span>
              </label>
            ))}
          </div>
        );
      default:
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => handleSetFieldValue(field.id, e.target.value)}
            placeholder={field.placeholder}
            error={error}
            required={field.validation.required}
          />
        );
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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back trigger */}
      <div>
        <button 
          onClick={onBack}
          className="flex items-center gap-1.5 hover:bg-slate-200 hover:text-[#0078d4] px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 transition-all cursor-pointer border border-slate-200 bg-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Retour aux détails
        </button>
      </div>

      <div className="space-y-2">
        <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
          Dossier de candidature unifié
        </span>
        <h2 className="text-sm md:text-lg font-black text-slate-900 uppercase tracking-tight">
          Saisie en ligne : {event.title}
        </h2>
        <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
          Remplissez soigneusement chaque étape ci-dessous.
        </p>
      </div>

      {/* Actual Form wrapper */}
      <form onSubmit={handleFormSubmit} className="space-y-8">
        {event.sections && event.sections.length > 0 ? (
          event.sections.map(section => (
            <div key={section.id} className="space-y-4">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                {section.title}
              </h3>
              <div className="space-y-4">
                {event.fields
                  .filter(f => f.sectionId === section.id)
                  .map(field => (
                    <div key={field.id} className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        {field.label}
                        {field.validation.required && <span className="text-rose-500 ml-1">*</span>}
                      </label>
                      {renderField(field)}
                      {errors[field.id] && (
                        <p className="text-[10px] text-rose-600 font-semibold">{errors[field.id]}</p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))
        ) : (
          <div className="space-y-4">
            {event.fields.map(field => (
              <div key={field.id} className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  {field.label}
                  {field.validation.required && <span className="text-rose-500 ml-1">*</span>}
                </label>
                {renderField(field)}
                {errors[field.id] && (
                  <p className="text-[10px] text-rose-600 font-semibold">{errors[field.id]}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
          <p className="text-[10px] text-slate-400 font-semibold italic">
            * Les données transmises sont confidentielles, stockées de manière sécurisée et soumises au règlement général sur la protection des données (RGPD).
          </p>

          <Button 
            type="submit" 
            disabled={submitting}
            className="bg-[#0078d4] hover:bg-[#005a9e] text-white py-3 px-8 rounded-xl font-black text-xs uppercase tracking-wider shadow-md shrink-0 cursor-pointer"
          >
            {submitting ? 'Envoi...' : 'Transmettre l\'Inscription'}
          </Button>
        </div>
      </form>
    </div>
  );
}
export default EventRegistrationPage;

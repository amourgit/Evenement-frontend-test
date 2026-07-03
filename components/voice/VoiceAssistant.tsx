import { useEffect, useRef, useState } from "react";
import type { FieldDefinition } from "../../src/types/field";
import type { AIChatMessage } from "../../src/types/ai";
import { aiApi } from "@/lib/api/ai";
import { useVoiceAssistant } from "./useVoiceAssistant";
import { cn } from "@/lib/utils/cn";

interface VoiceAssistantProps {
  eventId: string;
  eventTitle: string;
  /** Champ actuellement mis en avant (ex: l'utilisateur a clique "aide ?") */
  focusField?: FieldDefinition | null;
}

/**
 * Assistant conversationnel flottant. Discute avec l'utilisateur des champs
 * demandes, de l'evenement et de sa structure, en s'appuyant sur le prompt
 * et les sources televersees par l'admin (voir aiApi.chat / AIPromptSource).
 * Fonctionne au clavier partout ; la voix est une amelioration progressive
 * disponible si le navigateur supporte Web Speech API.
 */
export function VoiceAssistant({ eventId, eventTitle, focusField }: VoiceAssistantProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    isSupported,
    isListening,
    isSpeaking,
    transcript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  } = useVoiceAssistant();

  useEffect(() => {
    if (transcript) setDraft(transcript);
  }, [transcript]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (!focusField) return;
    setOpen(true);
    void sendMessage(
      `Peux-tu m'expliquer ce que je dois renseigner pour le champ « ${focusField.label} » ?`,
      focusField.id
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusField]);

  async function sendMessage(text: string, focusFieldId?: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage: AIChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      created_at: new Date().toISOString(),
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setDraft("");
    setIsSending(true);

    try {
      const response = await aiApi.chat({
        event_id: eventId,
        messages: nextMessages,
        focus_field_id: focusFieldId,
      });
      setMessages((prev) => [...prev, response.message]);
      speak(response.message.content);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Je n'arrive pas a repondre pour le moment. Vous pouvez continuer a remplir le formulaire ; vos donnees sont conservees.",
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="focus-ring fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-base-border bg-base-raised px-4 py-3 text-sm shadow-lg transition-colors hover:border-signal"
        style={{ borderColor: "var(--color-accent, #6C7BFF)" }}
      >
        <span
          className="flex h-6 w-6 items-center justify-center rounded-full text-xs"
          style={{ backgroundColor: "var(--color-accent, #6C7BFF)", color: "#0B0D10" }}
        >
          ✦
        </span>
        Une question ?
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 flex h-[28rem] w-80 flex-col overflow-hidden rounded border border-base-border bg-base-raised shadow-2xl sm:w-96">
      <div className="flex items-center justify-between border-b border-base-border px-4 py-3">
        <div>
          <div className="font-display text-sm font-semibold text-ink">Assistant · {eventTitle}</div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
            {isSupported ? "voix + texte" : "texte"}
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="focus-ring text-ink-muted hover:text-ink">
          ✕
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {messages.length === 0 && (
          <p className="text-xs text-ink-muted">
            Posez une question sur un champ, le deroulement de l'evenement, ou la structure du
            formulaire. Je reponds uniquement a partir des informations fournies par les
            organisateurs.
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "max-w-[85%] rounded px-3 py-2 text-sm",
              m.role === "user"
                ? "ml-auto bg-signal/15 text-ink"
                : "bg-base-surface text-ink-muted"
            )}
          >
            {m.content}
          </div>
        ))}
        {isSending && <div className="text-xs text-ink-faint">L'assistant repond...</div>}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void sendMessage(draft);
        }}
        className="flex items-center gap-2 border-t border-base-border px-3 py-3"
      >
        {isSupported && (
          <button
            type="button"
            onClick={() => {
              if (isSpeaking) stopSpeaking();
              isListening ? stopListening() : startListening();
            }}
            aria-pressed={isListening}
            title={isListening ? "Arreter l'ecoute" : "Parler a l'assistant"}
            className={cn(
              "focus-ring flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs transition-colors",
              isListening
                ? "border-state-closed text-state-closed animate-pulse"
                : "border-base-border text-ink-muted hover:text-signal"
            )}
          >
            {isListening ? "●" : "🎙"}
          </button>
        )}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ecrivez votre question..."
          className="focus-ring flex-1 rounded border border-base-border bg-base-surface px-3 py-2 text-sm text-ink placeholder:text-ink-faint"
        />
        <button
          type="submit"
          disabled={isSending || !draft.trim()}
          className="focus-ring rounded px-3 py-2 text-sm font-medium text-white disabled:opacity-40"
          style={{ backgroundColor: "var(--color-accent, #6C7BFF)" }}
        >
          →
        </button>
      </form>
    </div>
  );
}

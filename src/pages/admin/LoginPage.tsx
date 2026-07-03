import { useState } from "react";
import { useAuth, isApiError } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { USE_MOCK_API } from "@/lib/api/config";

const DEMO_ACCOUNTS = [
  { email: "admin@civitas.test", password: "Admin!2026", role: "owner", note: "2 evenements" },
  { email: "editrice@civitas.test", password: "Editrice!2026", role: "editor", note: "1 evenement" },
  { email: "viewer@civitas.test", password: "Viewer!2026", role: "viewer", note: "aucun evenement" },
];

interface LoginPageProps {
  onBackToPublic: () => void;
  onLoginSuccess: () => void;
}

export function LoginPage({ onBackToPublic, onLoginSuccess }: LoginPageProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login({ email, password });
      onLoginSuccess();
    } catch (err) {
      setError(isApiError(err) ? err.message : "Identifiants invalides.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded bg-signal font-mono text-sm font-semibold text-white">
            C
          </span>
          <h1 className="font-display text-lg font-semibold">Backoffice CIVITAS Forms</h1>
          <p className="mt-1 text-xs text-ink-muted">Connexion administrateur</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded border border-base-border bg-base-raised p-6">
          <div>
            <label className="mb-1 block text-xs text-ink-muted">Email</label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-ink-muted">Mot de passe</label>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-xs text-state-closed">{error}</p>}
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Se connecter
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-ink-faint">
          <button
            type="button"
            onClick={onBackToPublic}
            className="text-ink-muted underline-offset-2 hover:text-ink hover:underline"
          >
            Retourner a l'espace public
          </button>
        </p>

        {USE_MOCK_API && (
          <div className="mt-6 rounded border border-signal/30 bg-signal/5 p-4">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-signal">
              Mode demo — comptes de test
            </p>
            <div className="space-y-1.5">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => {
                    setEmail(acc.email);
                    setPassword(acc.password);
                  }}
                  className="focus-ring flex w-full items-center justify-between rounded border border-base-border bg-base-surface px-3 py-2 text-left text-xs transition-colors hover:border-signal"
                >
                  <span>
                    <span className="text-ink">{acc.email}</span>
                    <span className="ml-2 text-ink-faint">({acc.role} · {acc.note})</span>
                  </span>
                  <span className="font-mono text-[10px] text-ink-faint">remplir →</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

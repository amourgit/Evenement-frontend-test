import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, isApiError } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await register({
        full_name: fullName,
        organization_name: organization || undefined,
        email,
        password,
      });
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(isApiError(err) ? err.message : "Impossible de creer le compte.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded bg-signal font-mono text-sm font-semibold text-white">
            C
          </span>
          <h1 className="font-display text-lg font-semibold">Creer un compte administrateur</h1>
          <p className="mt-1 text-xs text-ink-muted">Obligatoire pour acceder au backoffice</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded border border-base-border bg-base-raised p-6">
          <div>
            <label className="mb-1 block text-xs text-ink-muted">Nom complet</label>
            <Input required value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-ink-muted">Organisation (optionnel)</label>
            <Input value={organization} onChange={(e) => setOrganization(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-ink-muted">Email</label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-ink-muted">Mot de passe</label>
            <Input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-xs text-state-closed">{error}</p>}
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Creer mon compte
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-ink-faint">
          Deja un compte ?{" "}
          <Link to="/admin/login" className="text-ink-muted underline-offset-2 hover:text-ink hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

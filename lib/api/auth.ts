import { api, setAuthToken } from "./client";
import type { AuthSession, LoginInput, RegisterInput, AdminUser } from "@/types/user";
import { USE_MOCK_API } from "./config";
import { mockAuthApi } from "@/mock/mockAuthApi";

/**
 * Toutes les routes ci-dessous ciblent le backoffice. Cote public
 * (inscription aux evenements), aucun compte n'est necessaire.
 */
const realAuthApi = {
  async login(input: LoginInput): Promise<AuthSession> {
    const session = await api.post<AuthSession>("/auth/login", input);
    setAuthToken(session.token);
    return session;
  },

  async register(input: RegisterInput): Promise<AuthSession> {
    const session = await api.post<AuthSession>("/auth/register", input);
    setAuthToken(session.token);
    return session;
  },

  async me(): Promise<AdminUser> {
    return api.get<AdminUser>("/auth/me", { auth: true });
  },

  logout() {
    setAuthToken(null);
  },
};

/**
 * Tant que le mode mock est actif (par defaut en dev), aucun appel reseau
 * n'est fait : voir src/mock/mockAuthApi.ts et src/mock/db.seed.json pour
 * les comptes de test disponibles.
 */
export const authApi: typeof realAuthApi = USE_MOCK_API ? mockAuthApi : realAuthApi;

import { ApiError, setAuthToken } from "@/lib/api/client";
import type { AuthSession, LoginInput, RegisterInput, AdminUser } from "@/types/user";
import { getDb, saveDb, mockDelay, newId, type MockAdmin } from "./mockDb";

const TOKEN_PREFIX = "mock-session";

function toPublicUser(admin: MockAdmin): AdminUser {
  const { password: _password, ...publicUser } = admin;
  return publicUser;
}

function makeToken(adminId: string): string {
  return `${TOKEN_PREFIX}.${adminId}.${crypto.randomUUID()}`;
}

/** Retrouve l'admin courant a partir du token Bearer stocke en localStorage */
export function getCurrentMockAdmin(): MockAdmin {
  const token = localStorage.getItem("civitas_admin_token");
  if (!token || !token.startsWith(TOKEN_PREFIX)) {
    throw new ApiError("Non authentifie.", 401);
  }
  const adminId = token.split(".")[1];
  const admin = getDb().admins.find((a) => a.id === adminId);
  if (!admin) throw new ApiError("Session invalide, merci de vous reconnecter.", 401);
  return admin;
}

export const mockAuthApi = {
  async login(input: LoginInput): Promise<AuthSession> {
    await mockDelay();
    const admin = getDb().admins.find(
      (a) => a.email.toLowerCase() === input.email.trim().toLowerCase()
    );
    if (!admin || admin.password !== input.password) {
      throw new ApiError("Email ou mot de passe incorrect.", 401);
    }
    const session: AuthSession = {
      user: toPublicUser(admin),
      token: makeToken(admin.id),
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    };
    setAuthToken(session.token);
    return session;
  },

  async register(input: RegisterInput): Promise<AuthSession> {
    await mockDelay();
    const db = getDb();
    if (db.admins.some((a) => a.email.toLowerCase() === input.email.trim().toLowerCase())) {
      throw new ApiError("Un compte existe deja avec cet email.", 409);
    }
    const admin: MockAdmin = {
      id: newId("admin"),
      email: input.email.trim(),
      password: input.password,
      full_name: input.full_name,
      role: "owner",
      created_at: new Date().toISOString(),
    };
    db.admins.push(admin);
    saveDb(db);

    const session: AuthSession = {
      user: toPublicUser(admin),
      token: makeToken(admin.id),
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    };
    setAuthToken(session.token);
    return session;
  },

  async me(): Promise<AdminUser> {
    await mockDelay(150);
    return toPublicUser(getCurrentMockAdmin());
  },

  logout() {
    setAuthToken(null);
  },
};

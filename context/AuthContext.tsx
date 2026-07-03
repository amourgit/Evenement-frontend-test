// ============================================================
// context/AuthContext.tsx
// Contexte d'authentification du backoffice CIVITAS Forms.
// Branche les pages LoginPage / RegisterPage / AdminSidebar sur
// authApi (mock en dev, backend reel en prod — voir lib/api/config.ts).
// ============================================================

import React, { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import type { AdminUser, LoginInput, RegisterInput } from "@/src/types/user";

interface AuthContextValue {
  user: AdminUser | null;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const me = await authApi.me();
      setUser(me);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("civitas_admin_token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const login = useCallback(async (input: LoginInput) => {
    const session = await authApi.login(input);
    setUser(session.user);
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const session = await authApi.register(input);
    setUser(session.user);
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth doit etre utilise a l'interieur d'un <AuthContextProvider>.");
  }
  return ctx;
}

/** Permet de distinguer une erreur API (avec message utilisateur) d'une erreur generique. */
export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError;
}

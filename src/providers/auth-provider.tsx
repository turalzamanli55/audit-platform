"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthContextValue, AuthSession } from "@/types/auth";
import { UNAUTHENTICATED_SESSION, LOADING_SESSION } from "@/lib/auth/session";

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
  initialSession?: AuthSession;
};

/**
 * Authentication provider — architecture foundation.
 * Supabase Auth integration will hydrate session from server-validated tokens.
 */
export function AuthProvider({
  children,
  initialSession = UNAUTHENTICATED_SESSION,
}: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession>(initialSession);

  const signOut = useCallback(async () => {
    setSession(UNAUTHENTICATED_SESSION);
  }, []);

  const refreshSession = useCallback(async () => {
    setSession(LOADING_SESSION);
    setSession(UNAUTHENTICATED_SESSION);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ session, signOut, refreshSession }),
    [session, signOut, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

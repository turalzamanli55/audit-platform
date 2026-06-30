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
import { createBrowserClient } from "@/lib/supabase/browser";
import { UNAUTHENTICATED_SESSION, LOADING_SESSION } from "@/lib/auth/constants";
import { mapSupabaseUserToSessionUser } from "@/lib/auth/mapper";

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
  initialSession?: AuthSession;
};

export function AuthProvider({
  children,
  initialSession = UNAUTHENTICATED_SESSION,
}: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession>(initialSession);

  const signOut = useCallback(async () => {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    setSession(UNAUTHENTICATED_SESSION);
  }, []);

  const refreshSession = useCallback(async () => {
    setSession(LOADING_SESSION);
    const supabase = createBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSession(UNAUTHENTICATED_SESSION);
      return;
    }

    const {
      data: { session: supabaseSession },
    } = await supabase.auth.getSession();

    setSession({
      status: "authenticated",
      user: mapSupabaseUserToSessionUser(user),
      expiresAt: supabaseSession?.expires_at
        ? new Date(supabaseSession.expires_at * 1000).toISOString()
        : null,
    });
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

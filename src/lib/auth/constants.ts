import type { AuthSession } from "@/types/auth";

export const UNAUTHENTICATED_SESSION: AuthSession = {
  status: "unauthenticated",
  user: null,
  expiresAt: null,
};

export const LOADING_SESSION: AuthSession = {
  status: "loading",
  user: null,
  expiresAt: null,
};

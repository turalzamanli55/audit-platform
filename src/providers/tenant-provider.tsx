"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { TenantBootstrap } from "@/types/tenant";
import { switchOrganizationAction, switchWorkspaceAction } from "@/lib/actions/tenant/switch-tenant";

type TenantContextValue = TenantBootstrap & {
  switchOrganization: (organizationId: string) => Promise<void>;
  switchWorkspace: (workspaceId: string) => Promise<void>;
  isSwitching: boolean;
};

const TenantContext = createContext<TenantContextValue | null>(null);

type TenantProviderProps = {
  children: ReactNode;
  initial: TenantBootstrap;
};

export function TenantProvider({ children, initial }: TenantProviderProps) {
  const router = useRouter();
  const [tenant, setTenant] = useState(initial);
  const [isSwitching, startTransition] = useTransition();

  const switchOrganization = useCallback(
    async (organizationId: string) => {
      const result = await switchOrganizationAction({ organizationId });
      if (!result.success) return;

      startTransition(() => {
        setTenant((current) => ({
          ...current,
          currentOrganizationId: organizationId,
          currentWorkspaceId: null,
        }));
        router.refresh();
      });
    },
    [router],
  );

  const switchWorkspace = useCallback(
    async (workspaceId: string) => {
      const result = await switchWorkspaceAction({ workspaceId });
      if (!result.success) return;

      startTransition(() => {
        setTenant((current) => ({
          ...current,
          currentWorkspaceId: workspaceId,
        }));
        router.refresh();
      });
    },
    [router],
  );

  const value = useMemo(
    () => ({
      ...tenant,
      switchOrganization,
      switchWorkspace,
      isSwitching,
    }),
    [tenant, switchOrganization, switchWorkspace, isSwitching],
  );

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant(): TenantContextValue {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within TenantProvider");
  }
  return context;
}

export function useTenantOptional(): TenantContextValue | null {
  return useContext(TenantContext);
}

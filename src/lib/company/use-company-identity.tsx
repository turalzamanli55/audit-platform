"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { updateCompanyAction } from "@/lib/actions/company/update-company";
import { updateCompanySettingsAction } from "@/lib/actions/company/update-company-settings";
import { archiveCompanyAction } from "@/lib/actions/company/archive-company";
import { restoreCompanyAction } from "@/lib/actions/company/restore-company";
import {
  computeCompanyUpdateInput,
  computeIdentitySettingsPatch,
  isIdentityDraftDirty,
  mergeIdentityDraft,
  workspaceToIdentityDraft,
  type CompanyIdentityDraft,
} from "@/lib/company/company-identity-draft";
import type { CompanySettingsSaveState } from "@/lib/company/company-settings-sections";
import { validateCompanySettings } from "@/lib/company/validation";
import type { CompanyWorkspaceView } from "@/lib/company/company-workspace-view";
import { ValidationError } from "@/lib/errors";

export type CompanyIdentityParentOption = {
  id: string;
  name: string;
};

type CompanyIdentityContextValue = {
  company: CompanyWorkspaceView;
  draft: CompanyIdentityDraft;
  baselineDraft: CompanyIdentityDraft;
  canAdminister: boolean;
  canConfigure: boolean;
  canEditCompany: boolean;
  canEditClassification: boolean;
  hasUnsavedChanges: boolean;
  saveState: CompanySettingsSaveState;
  saveError: string | null;
  hasConflict: boolean;
  lifecycleState: "idle" | "archiving" | "restoring" | "error";
  lifecycleError: string | null;
  parentOptions: CompanyIdentityParentOption[];
  updateDraft: (patch: Partial<CompanyIdentityDraft>) => void;
  discardChanges: () => void;
  saveChanges: () => void;
  dismissConflict: () => void;
  archiveCompany: (reason: string) => void;
  restoreCompany: (reason: string) => void;
  refreshCompany: (company: CompanyWorkspaceView) => void;
};

const CompanyIdentityContext = createContext<CompanyIdentityContextValue | null>(null);

type CompanyIdentityProviderProps = {
  initialCompany: CompanyWorkspaceView;
  canAdminister: boolean;
  canConfigure: boolean;
  parentOptions: CompanyIdentityParentOption[];
  locale: string;
  children: ReactNode;
};

export function CompanyIdentityProvider({
  initialCompany,
  canAdminister,
  canConfigure,
  parentOptions,
  locale,
  children,
}: CompanyIdentityProviderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [company, setCompany] = useState(initialCompany);
  const baselineDraft = useMemo(() => workspaceToIdentityDraft(company), [company]);
  const [draft, setDraft] = useState(() => workspaceToIdentityDraft(initialCompany));
  const [saveState, setSaveState] = useState<CompanySettingsSaveState>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [hasConflict, setHasConflict] = useState(false);
  const [lifecycleState, setLifecycleState] = useState<CompanyIdentityContextValue["lifecycleState"]>("idle");
  const [lifecycleError, setLifecycleError] = useState<string | null>(null);

  const canEditCompany = canAdminister && !company.isArchived;
  const canEditClassification = canConfigure && !company.isArchived;
  const hasUnsavedChanges = isIdentityDraftDirty(draft, baselineDraft);

  const refreshCompany = useCallback((next: CompanyWorkspaceView) => {
    setCompany(next);
    setDraft(workspaceToIdentityDraft(next));
    setSaveState("idle");
    setSaveError(null);
    setHasConflict(false);
    setLifecycleState("idle");
    setLifecycleError(null);
  }, []);

  const serverSyncKey = `${initialCompany.id}:${initialCompany.version}:${initialCompany.settingsVersion}:${initialCompany.updatedAt}`;
  const syncedKeyRef = useRef(serverSyncKey);

  useEffect(() => {
    if (syncedKeyRef.current === serverSyncKey) {
      return;
    }
    syncedKeyRef.current = serverSyncKey;
    refreshCompany(initialCompany);
  }, [initialCompany, refreshCompany, serverSyncKey]);

  const updateDraft = useCallback(
    (patch: Partial<CompanyIdentityDraft>) => {
      if (!canEditCompany && !canEditClassification) {
        return;
      }
      setDraft((current) => mergeIdentityDraft(current, patch));
      setSaveState("idle");
      setSaveError(null);
      setHasConflict(false);
    },
    [canEditClassification, canEditCompany],
  );

  const discardChanges = useCallback(() => {
    setDraft(baselineDraft);
    setSaveState("idle");
    setSaveError(null);
    setHasConflict(false);
  }, [baselineDraft]);

  const dismissConflict = useCallback(() => {
    setHasConflict(false);
    router.refresh();
  }, [router]);

  const saveChanges = useCallback(() => {
    if (!hasUnsavedChanges) {
      return;
    }

    startTransition(async () => {
      setSaveState("saving");
      setSaveError(null);
      setHasConflict(false);

      const settingsPatch = computeIdentitySettingsPatch(draft, baselineDraft);
      if (Object.keys(settingsPatch).length > 0) {
        try {
          validateCompanySettings({ ...company.settings, ...settingsPatch });
        } catch (error) {
          setSaveState("error");
          setSaveError(error instanceof ValidationError ? error.message : "Validation failed");
          return;
        }
      }

      let nextCompany = company;
      let slugChanged = false;

      if (canEditCompany) {
        const companyInput = computeCompanyUpdateInput(
          draft,
          baselineDraft,
          company.id,
          company.version,
        );
        if (companyInput) {
          const result = await updateCompanyAction(companyInput);
          if (!result.success) {
            setSaveState("error");
            setSaveError(result.error.message);
            if (result.error.code === "CONFLICT") {
              setHasConflict(true);
            }
            return;
          }
          slugChanged = result.data.slug !== company.slug;
          nextCompany = {
            ...company,
            name: draft.name,
            legalName: draft.legalName,
            registrationNumber: draft.registrationNumber.trim() || null,
            description: draft.description.trim() || null,
            slug: result.data.slug,
            version: result.data.version,
            updatedAt: new Date().toISOString(),
          };
        }
      }

      if (canEditClassification) {
        const settingsPatch = computeIdentitySettingsPatch(draft, baselineDraft);
        if (Object.keys(settingsPatch).length > 0) {
          const result = await updateCompanySettingsAction({
            companyId: company.id,
            settingsVersion: nextCompany.settingsVersion,
            settings: settingsPatch,
          });
          if (!result.success) {
            setSaveState("error");
            setSaveError(result.error.message);
            if (result.error.code === "CONFLICT") {
              setHasConflict(true);
            }
            return;
          }
          nextCompany = {
            ...nextCompany,
            settings: result.data.settings,
            settingsVersion: result.data.settingsVersion,
          };
        }
      }

      refreshCompany(nextCompany);
      setSaveState("saved");
      router.refresh();

      if (slugChanged) {
        router.replace(`/${locale}/app/companies/${nextCompany.slug}/identity`);
      }

      window.setTimeout(() => {
        setSaveState((current) => (current === "saved" ? "idle" : current));
      }, 2000);
    });
  }, [
    baselineDraft,
    canEditClassification,
    canEditCompany,
    company,
    draft,
    hasUnsavedChanges,
    locale,
    refreshCompany,
    router,
  ]);

  const archiveCompany = useCallback(
    (reason: string) => {
      if (!canAdminister || company.isArchived) {
        return;
      }

      startTransition(async () => {
        setLifecycleState("archiving");
        setLifecycleError(null);

        const result = await archiveCompanyAction({
          companyId: company.id,
          version: company.version,
          archiveReason: reason.trim() || null,
        });

        if (!result.success) {
          setLifecycleState("error");
          setLifecycleError(result.error.message);
          if (result.error.code === "CONFLICT") {
            setHasConflict(true);
          }
          return;
        }

        const nextCompany: CompanyWorkspaceView = {
          ...company,
          status: "archived",
          isArchived: true,
          deletedAt: new Date().toISOString(),
          version: result.data.version,
        };
        refreshCompany(nextCompany);
        setLifecycleState("idle");
        router.refresh();
      });
    },
    [canAdminister, company, refreshCompany, router],
  );

  const restoreCompany = useCallback(
    (reason: string) => {
      if (!canAdminister || !company.isArchived) {
        return;
      }

      startTransition(async () => {
        setLifecycleState("restoring");
        setLifecycleError(null);

        const result = await restoreCompanyAction({
          companyId: company.id,
          version: company.version,
          restoreReason: reason.trim() || null,
        });

        if (!result.success) {
          setLifecycleState("error");
          setLifecycleError(result.error.message);
          if (result.error.code === "CONFLICT") {
            setHasConflict(true);
          }
          return;
        }

        const nextCompany: CompanyWorkspaceView = {
          ...company,
          status: "active",
          isArchived: false,
          deletedAt: null,
          version: result.data.version,
        };
        refreshCompany(nextCompany);
        setLifecycleState("idle");
        router.refresh();
      });
    },
    [canAdminister, company, refreshCompany, router],
  );

  const value = useMemo<CompanyIdentityContextValue>(
    () => ({
      company,
      draft,
      baselineDraft,
      canAdminister,
      canConfigure,
      canEditCompany,
      canEditClassification,
      hasUnsavedChanges,
      saveState: isPending ? "saving" : saveState,
      saveError,
      hasConflict,
      lifecycleState: isPending && lifecycleState !== "idle" ? lifecycleState : lifecycleState,
      lifecycleError,
      parentOptions,
      updateDraft,
      discardChanges,
      saveChanges,
      dismissConflict,
      archiveCompany,
      restoreCompany,
      refreshCompany,
    }),
    [
      baselineDraft,
      canAdminister,
      canConfigure,
      canEditClassification,
      canEditCompany,
      company,
      discardChanges,
      dismissConflict,
      draft,
      archiveCompany,
      restoreCompany,
      hasConflict,
      hasUnsavedChanges,
      isPending,
      lifecycleError,
      lifecycleState,
      parentOptions,
      refreshCompany,
      saveChanges,
      saveError,
      saveState,
      updateDraft,
    ],
  );

  return <CompanyIdentityContext.Provider value={value}>{children}</CompanyIdentityContext.Provider>;
}

export function useCompanyIdentity(): CompanyIdentityContextValue {
  const context = useContext(CompanyIdentityContext);
  if (!context) {
    throw new Error("useCompanyIdentity must be used within CompanyIdentityProvider");
  }
  return context;
}

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
import { updateCompanySettingsAction } from "@/lib/actions/company/update-company-settings";
import {
  computeSettingsPatch,
  isSettingsDraftDirty,
  mergeSettingsDraft,
  settingsToDraft,
  type CompanySettingsDraft,
} from "@/lib/company/company-settings-draft";
import type { CompanySettingsSaveState } from "@/lib/company/company-settings-sections";
import { validateSettingsDraft } from "@/lib/company/settings-save-validation";
import type { CompanySettings } from "@/types/company";
import { ValidationError } from "@/lib/errors";

export type CompanySettingsParentOption = {
  id: string;
  name: string;
};

type CompanySettingsContextValue = {
  companyId: string;
  settingsVersion: number;
  baselineSettings: CompanySettings;
  draft: CompanySettingsDraft;
  baselineDraft: CompanySettingsDraft;
  canEdit: boolean;
  hasUnsavedChanges: boolean;
  saveState: CompanySettingsSaveState;
  saveError: string | null;
  hasConflict: boolean;
  fieldErrors: Partial<Record<keyof CompanySettingsDraft, string>>;
  parentOptions: CompanySettingsParentOption[];
  updateDraft: (patch: Partial<CompanySettingsDraft>) => void;
  discardChanges: () => void;
  saveChanges: () => void;
  dismissConflict: () => void;
  refreshBaseline: (settings: CompanySettings, settingsVersion: number) => void;
};

const CompanySettingsContext = createContext<CompanySettingsContextValue | null>(null);

type CompanySettingsProviderProps = {
  companyId: string;
  settingsVersion: number;
  settings: CompanySettings;
  canEdit: boolean;
  parentOptions: CompanySettingsParentOption[];
  children: ReactNode;
};

export function CompanySettingsProvider({
  companyId,
  settingsVersion: initialVersion,
  settings: initialSettings,
  canEdit,
  parentOptions,
  children,
}: CompanySettingsProviderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [settingsVersion, setSettingsVersion] = useState(initialVersion);
  const [baselineSettings, setBaselineSettings] = useState(initialSettings);
  const baselineDraft = useMemo(() => settingsToDraft(baselineSettings), [baselineSettings]);
  const [draft, setDraft] = useState(() => settingsToDraft(initialSettings));
  const [saveState, setSaveState] = useState<CompanySettingsSaveState>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [hasConflict, setHasConflict] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CompanySettingsDraft, string>>>(
    {},
  );

  const hasUnsavedChanges = isSettingsDraftDirty(draft, baselineDraft);

  const refreshBaseline = useCallback((settings: CompanySettings, version: number) => {
    setBaselineSettings(settings);
    setSettingsVersion(version);
    setDraft(settingsToDraft(settings));
    setSaveState("idle");
    setSaveError(null);
    setHasConflict(false);
    setFieldErrors({});
  }, []);

  const serverSyncKey = `${companyId}:${initialVersion}`;
  const syncedKeyRef = useRef(serverSyncKey);

  useEffect(() => {
    if (syncedKeyRef.current === serverSyncKey) {
      return;
    }
    syncedKeyRef.current = serverSyncKey;
    refreshBaseline(initialSettings, initialVersion);
  }, [companyId, initialSettings, initialVersion, refreshBaseline, serverSyncKey]);

  const updateDraft = useCallback((patch: Partial<CompanySettingsDraft>) => {
    if (!canEdit) {
      return;
    }
    setDraft((current) => mergeSettingsDraft(current, patch));
    setSaveState("idle");
    setSaveError(null);
    setHasConflict(false);
    setFieldErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(patch) as (keyof CompanySettingsDraft)[]) {
        delete next[key];
      }
      return next;
    });
  }, [canEdit]);

  const discardChanges = useCallback(() => {
    setDraft(baselineDraft);
    setSaveState("idle");
    setSaveError(null);
    setHasConflict(false);
    setFieldErrors({});
  }, [baselineDraft]);

  const dismissConflict = useCallback(() => {
    setHasConflict(false);
    router.refresh();
  }, [router]);

  const saveChanges = useCallback(() => {
    if (!canEdit || !hasUnsavedChanges) {
      return;
    }

    startTransition(async () => {
      setSaveState("saving");
      setSaveError(null);
      setHasConflict(false);

      try {
        validateSettingsDraft(draft, baselineSettings.validation);
      } catch (error) {
        setSaveState("error");
        setSaveError(error instanceof ValidationError ? error.message : "Validation failed");
        return;
      }

      const patch = computeSettingsPatch(draft, baselineSettings);
      if (Object.keys(patch).length === 0) {
        setSaveState("idle");
        return;
      }

      const result = await updateCompanySettingsAction({
        companyId,
        settingsVersion,
        settings: patch,
      });

      if (!result.success) {
        setSaveState("error");
        setSaveError(result.error.message);
        if (result.error.code === "CONFLICT") {
          setHasConflict(true);
        }
        return;
      }

      refreshBaseline(result.data.settings, result.data.settingsVersion);
      setSaveState("saved");
      router.refresh();

      window.setTimeout(() => {
        setSaveState((current) => (current === "saved" ? "idle" : current));
      }, 2000);
    });
  }, [
    baselineSettings,
    canEdit,
    companyId,
    draft,
    hasUnsavedChanges,
    refreshBaseline,
    router,
    settingsVersion,
  ]);

  const value = useMemo<CompanySettingsContextValue>(
    () => ({
      companyId,
      settingsVersion,
      baselineSettings,
      draft,
      baselineDraft,
      canEdit,
      hasUnsavedChanges,
      saveState: isPending ? "saving" : saveState,
      saveError,
      hasConflict,
      fieldErrors,
      parentOptions,
      updateDraft,
      discardChanges,
      saveChanges,
      dismissConflict,
      refreshBaseline,
    }),
    [
      baselineDraft,
      baselineSettings,
      canEdit,
      companyId,
      discardChanges,
      dismissConflict,
      draft,
      fieldErrors,
      hasConflict,
      hasUnsavedChanges,
      isPending,
      parentOptions,
      refreshBaseline,
      saveChanges,
      saveError,
      saveState,
      settingsVersion,
      updateDraft,
    ],
  );

  return (
    <CompanySettingsContext.Provider value={value}>{children}</CompanySettingsContext.Provider>
  );
}

export function useCompanySettings(): CompanySettingsContextValue {
  const context = useContext(CompanySettingsContext);
  if (!context) {
    throw new Error("useCompanySettings must be used within CompanySettingsProvider");
  }
  return context;
}

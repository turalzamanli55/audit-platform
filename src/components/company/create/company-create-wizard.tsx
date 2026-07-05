"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition, type KeyboardEvent } from "react";
import {
  ENTITY_TYPES,
  INDUSTRY_CLASSIFICATIONS,
  REPORTING_FRAMEWORKS,
} from "@/constants/company";
import { createCompanyAction } from "@/lib/actions/company/create-company";
import {
  draftToCreateCompanyInput,
  type CompanyWizardDraft,
  type CompanyWizardStep,
} from "@/lib/company/company-wizard-draft";
import { useCompanyWizardDraft } from "@/lib/company/use-company-wizard-draft";
import {
  hasWizardFieldErrors,
  validateWizardStep,
  type WizardFieldErrors,
} from "@/lib/company/wizard-step-validation";
import {
  CompanyBreadcrumb,
  CompanyPageShell,
} from "@/components/company";
import { Input } from "@/components/ui";
import { WorkspaceNoticeBanner } from "@/components/workspace";
import {
  WizardField,
  WizardNavigation,
  WizardProgress,
  WizardShell,
  WizardStepPanel,
  type WizardStepDefinition,
} from "@/components/wizard";
import type { Dictionary } from "@/i18n/get-dictionary";

export type CompanyCreateLabels = Dictionary["companies"]["create"];

type ParentOption = {
  id: string;
  name: string;
};

type CompanyCreateWizardProps = {
  locale: string;
  labels: CompanyCreateLabels;
  parentOptions: ParentOption[];
};

const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);

export function CompanyCreateWizard({ locale, labels, parentOptions }: CompanyCreateWizardProps) {
  const router = useRouter();
  const { draft, updateDraft, clearDraft } = useCompanyWizardDraft();
  const [errors, setErrors] = useState<WizardFieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const steps: WizardStepDefinition[] = useMemo(
    () => [
      { id: "identity", label: labels.stepIdentity },
      { id: "jurisdiction", label: labels.stepJurisdiction },
      { id: "financial", label: labels.stepFinancial },
      { id: "contacts", label: labels.stepContacts },
      { id: "review", label: labels.stepReview },
    ],
    [labels],
  );

  const basePath = `/${locale}/app/companies`;

  const setField = <K extends keyof CompanyWizardDraft>(key: K, value: CompanyWizardDraft[K]) => {
    updateDraft({ [key]: value });
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      delete next.submit;
      return next;
    });
  };

  const goToStep = (step: CompanyWizardStep) => {
    updateDraft({ step });
    setErrors({});
    setSubmitError(null);
  };

  const validateCurrentStep = (step: CompanyWizardStep = draft.step) => {
    const nextErrors = validateWizardStep(step, draft);
    setErrors(nextErrors);
    return !hasWizardFieldErrors(nextErrors);
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (draft.step < 5) {
      goToStep((draft.step + 1) as CompanyWizardStep);
    }
  };

  const handleBack = () => {
    if (draft.step > 1) {
      goToStep((draft.step - 1) as CompanyWizardStep);
    }
  };

  const handleSubmit = () => {
    if (!validateCurrentStep(5)) {
      return;
    }

    startTransition(async () => {
      setSubmitError(null);
      const result = await createCompanyAction(draftToCreateCompanyInput(draft));

      if (!result.success) {
        setSubmitError(result.error.message);
        return;
      }

      clearDraft();
      router.push(`${basePath}/${result.data.slug}`);
      router.refresh();
    });
  };

  const handleWizardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && draft.step < 5) {
      event.preventDefault();
      handleNext();
    }
    if (event.key === "Escape" && draft.step > 1) {
      event.preventDefault();
      handleBack();
    }
  };

  return (
    <CompanyPageShell>
      <CompanyBreadcrumb
        items={[
          { label: labels.breadcrumbCompanies, href: basePath },
          { label: labels.breadcrumbCreate },
        ]}
        className="mb-4"
      />

      <WizardShell
        title={labels.title}
        description={labels.subtitle}
        footer={
          <WizardNavigation
            backLabel={labels.back}
            nextLabel={draft.step === 5 ? labels.createCompany : labels.continue}
            onBack={draft.step > 1 ? handleBack : undefined}
            onNext={draft.step === 5 ? handleSubmit : handleNext}
            loading={isPending}
            secondaryAction={
              <Link
                href={basePath}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {labels.cancel}
              </Link>
            }
          />
        }
      >
        <WizardProgress
          steps={steps}
          currentStep={draft.step}
          onStepSelect={(step) => {
            if (step < draft.step) {
              goToStep(step as CompanyWizardStep);
            }
          }}
        />

        {submitError ? <WorkspaceNoticeBanner variant="error" description={submitError} role="alert" /> : null}
        {errors.submit ? <WorkspaceNoticeBanner variant="error" description={errors.submit} role="alert" /> : null}

        <div className="relative" onKeyDown={handleWizardKeyDown}>
          <WizardStepPanel
            title={labels.stepIdentityTitle}
            description={labels.stepIdentityDescription}
            visible={draft.step === 1}
          >
            <WizardField label={labels.legalName} htmlFor="legalName" error={errors.legalName}>
              <Input
                id="legalName"
                name="legalName"
                value={draft.legalName}
                onChange={(event) => setField("legalName", event.target.value)}
                error={errors.legalName}
                autoFocus
              />
            </WizardField>
            <WizardField label={labels.displayName} htmlFor="name" error={errors.name} hint={labels.displayNameHint}>
              <Input
                id="name"
                name="name"
                value={draft.name}
                onChange={(event) => setField("name", event.target.value)}
                error={errors.name}
              />
            </WizardField>
            <WizardField label={labels.tradeName} htmlFor="tradeName" error={errors.tradeName}>
              <Input
                id="tradeName"
                name="tradeName"
                value={draft.tradeName}
                onChange={(event) => setField("tradeName", event.target.value)}
              />
            </WizardField>
            <WizardField
              label={labels.registrationNumber}
              htmlFor="registrationNumber"
              error={errors.registrationNumber}
            >
              <Input
                id="registrationNumber"
                name="registrationNumber"
                value={draft.registrationNumber}
                onChange={(event) => setField("registrationNumber", event.target.value)}
              />
            </WizardField>
            <WizardField label={labels.description} htmlFor="description" error={errors.description}>
              <Input
                id="description"
                name="description"
                value={draft.description}
                onChange={(event) => setField("description", event.target.value)}
              />
            </WizardField>
            <WizardField label={labels.entityType} htmlFor="entityType" error={errors.entityType}>
              <select
                id="entityType"
                value={draft.entityType}
                onChange={(event) => setField("entityType", event.target.value as CompanyWizardDraft["entityType"])}
                className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
              >
                {ENTITY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {labels.entityTypes[type]}
                  </option>
                ))}
              </select>
            </WizardField>
            {draft.entityType === "subsidiary" ? (
              <WizardField
                label={labels.parentCompany}
                htmlFor="parentCompanyId"
                error={errors.parentCompanyId}
              >
                <select
                  id="parentCompanyId"
                  value={draft.parentCompanyId}
                  onChange={(event) => setField("parentCompanyId", event.target.value)}
                  className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                >
                  <option value="">{labels.selectParent}</option>
                  {parentOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </WizardField>
            ) : null}
            <WizardField
              label={labels.industry}
              htmlFor="industryClassification"
              error={errors.industryClassification}
            >
              <select
                id="industryClassification"
                value={draft.industryClassification}
                onChange={(event) =>
                  setField(
                    "industryClassification",
                    event.target.value as CompanyWizardDraft["industryClassification"],
                  )
                }
                className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
              >
                {INDUSTRY_CLASSIFICATIONS.map((industry) => (
                  <option key={industry} value={industry}>
                    {labels.industries[industry]}
                  </option>
                ))}
              </select>
            </WizardField>
          </WizardStepPanel>

          <WizardStepPanel
            title={labels.stepJurisdictionTitle}
            description={labels.stepJurisdictionDescription}
            visible={draft.step === 2}
          >
            <WizardField
              label={labels.jurisdiction}
              htmlFor="jurisdiction"
              error={errors.jurisdiction}
            >
              <Input
                id="jurisdiction"
                value={draft.jurisdiction}
                onChange={(event) => setField("jurisdiction", event.target.value)}
                error={errors.jurisdiction}
              />
            </WizardField>
            <div className="grid gap-4 sm:grid-cols-2">
              <WizardField label={labels.addressLine1} htmlFor="addressLine1">
                <Input
                  id="addressLine1"
                  value={draft.addressLine1}
                  onChange={(event) => setField("addressLine1", event.target.value)}
                />
              </WizardField>
              <WizardField label={labels.addressLine2} htmlFor="addressLine2">
                <Input
                  id="addressLine2"
                  value={draft.addressLine2}
                  onChange={(event) => setField("addressLine2", event.target.value)}
                />
              </WizardField>
              <WizardField label={labels.addressCity} htmlFor="addressCity">
                <Input
                  id="addressCity"
                  value={draft.addressCity}
                  onChange={(event) => setField("addressCity", event.target.value)}
                />
              </WizardField>
              <WizardField label={labels.addressRegion} htmlFor="addressRegion">
                <Input
                  id="addressRegion"
                  value={draft.addressRegion}
                  onChange={(event) => setField("addressRegion", event.target.value)}
                />
              </WizardField>
              <WizardField label={labels.addressPostalCode} htmlFor="addressPostalCode">
                <Input
                  id="addressPostalCode"
                  value={draft.addressPostalCode}
                  onChange={(event) => setField("addressPostalCode", event.target.value)}
                />
              </WizardField>
              <WizardField label={labels.addressCountry} htmlFor="addressCountry">
                <Input
                  id="addressCountry"
                  value={draft.addressCountry}
                  onChange={(event) => setField("addressCountry", event.target.value)}
                />
              </WizardField>
            </div>
          </WizardStepPanel>

          <WizardStepPanel
            title={labels.stepFinancialTitle}
            description={labels.stepFinancialDescription}
            visible={draft.step === 3}
          >
            <WizardField
              label={labels.reportingFramework}
              htmlFor="reportingFramework"
              error={errors.reportingFramework}
            >
              <select
                id="reportingFramework"
                value={draft.reportingFramework}
                onChange={(event) =>
                  setField(
                    "reportingFramework",
                    event.target.value as CompanyWizardDraft["reportingFramework"],
                  )
                }
                className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
              >
                {REPORTING_FRAMEWORKS.map((framework) => (
                  <option key={framework} value={framework}>
                    {labels.frameworks[framework]}
                  </option>
                ))}
              </select>
            </WizardField>
            <div className="grid gap-4 sm:grid-cols-2">
              <WizardField
                label={labels.functionalCurrency}
                htmlFor="functionalCurrency"
                error={errors.functionalCurrency}
              >
                <Input
                  id="functionalCurrency"
                  value={draft.functionalCurrency}
                  onChange={(event) => setField("functionalCurrency", event.target.value.toUpperCase())}
                  error={errors.functionalCurrency}
                  maxLength={3}
                />
              </WizardField>
              <WizardField
                label={labels.presentationCurrency}
                htmlFor="presentationCurrency"
                error={errors.presentationCurrency}
                hint={labels.optional}
              >
                <Input
                  id="presentationCurrency"
                  value={draft.presentationCurrency}
                  onChange={(event) => setField("presentationCurrency", event.target.value.toUpperCase())}
                  error={errors.presentationCurrency}
                  maxLength={3}
                />
              </WizardField>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <WizardField
                label={labels.fiscalYearEndMonth}
                htmlFor="fiscalYearEndMonth"
                error={errors.fiscalYearEndMonth}
              >
                <select
                  id="fiscalYearEndMonth"
                  value={draft.fiscalYearEndMonth}
                  onChange={(event) => setField("fiscalYearEndMonth", Number(event.target.value))}
                  className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                >
                  {MONTHS.map((month) => (
                    <option key={month} value={month}>
                      {labels.months[month - 1]}
                    </option>
                  ))}
                </select>
              </WizardField>
              <WizardField
                label={labels.fiscalYearEndDay}
                htmlFor="fiscalYearEndDay"
                error={errors.fiscalYearEndDay}
              >
                <Input
                  id="fiscalYearEndDay"
                  type="number"
                  min={1}
                  max={31}
                  value={draft.fiscalYearEndDay}
                  onChange={(event) => setField("fiscalYearEndDay", Number(event.target.value))}
                  error={errors.fiscalYearEndDay}
                />
              </WizardField>
            </div>
          </WizardStepPanel>

          <WizardStepPanel
            title={labels.stepContactsTitle}
            description={labels.stepContactsDescription}
            visible={draft.step === 4}
          >
            <div className="space-y-4">
              <p className="text-sm font-medium text-foreground">{labels.financeContactSection}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <WizardField label={labels.contactName} htmlFor="financeContactName">
                  <Input
                    id="financeContactName"
                    value={draft.financeContactName}
                    onChange={(event) => setField("financeContactName", event.target.value)}
                  />
                </WizardField>
                <WizardField label={labels.contactTitle} htmlFor="financeContactTitle">
                  <Input
                    id="financeContactTitle"
                    value={draft.financeContactTitle}
                    onChange={(event) => setField("financeContactTitle", event.target.value)}
                  />
                </WizardField>
                <WizardField
                  label={labels.contactEmail}
                  htmlFor="financeContactEmail"
                  error={errors.financeContactEmail}
                >
                  <Input
                    id="financeContactEmail"
                    type="email"
                    value={draft.financeContactEmail}
                    onChange={(event) => setField("financeContactEmail", event.target.value)}
                    error={errors.financeContactEmail}
                  />
                </WizardField>
                <WizardField label={labels.contactPhone} htmlFor="financeContactPhone">
                  <Input
                    id="financeContactPhone"
                    value={draft.financeContactPhone}
                    onChange={(event) => setField("financeContactPhone", event.target.value)}
                  />
                </WizardField>
              </div>
            </div>
            <div className="space-y-4 border-t border-border/40 pt-5">
              <p className="text-sm font-medium text-foreground">{labels.auditorContactSection}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <WizardField label={labels.contactName} htmlFor="auditorContactName">
                  <Input
                    id="auditorContactName"
                    value={draft.auditorContactName}
                    onChange={(event) => setField("auditorContactName", event.target.value)}
                  />
                </WizardField>
                <WizardField label={labels.contactTitle} htmlFor="auditorContactTitle">
                  <Input
                    id="auditorContactTitle"
                    value={draft.auditorContactTitle}
                    onChange={(event) => setField("auditorContactTitle", event.target.value)}
                  />
                </WizardField>
                <WizardField
                  label={labels.contactEmail}
                  htmlFor="auditorContactEmail"
                  error={errors.auditorContactEmail}
                >
                  <Input
                    id="auditorContactEmail"
                    type="email"
                    value={draft.auditorContactEmail}
                    onChange={(event) => setField("auditorContactEmail", event.target.value)}
                    error={errors.auditorContactEmail}
                  />
                </WizardField>
                <WizardField label={labels.contactPhone} htmlFor="auditorContactPhone">
                  <Input
                    id="auditorContactPhone"
                    value={draft.auditorContactPhone}
                    onChange={(event) => setField("auditorContactPhone", event.target.value)}
                  />
                </WizardField>
              </div>
            </div>
          </WizardStepPanel>

          <WizardStepPanel
            title={labels.stepReviewTitle}
            description={labels.stepReviewDescription}
            visible={draft.step === 5}
          >
            <dl className="divide-y divide-border/40">
              <ReviewRow label={labels.legalName} value={draft.legalName} />
              <ReviewRow label={labels.displayName} value={draft.name || draft.legalName} />
              <ReviewRow label={labels.jurisdiction} value={draft.jurisdiction} />
              <ReviewRow
                label={labels.reportingFramework}
                value={labels.frameworks[draft.reportingFramework]}
              />
              <ReviewRow label={labels.functionalCurrency} value={draft.functionalCurrency} />
              <ReviewRow
                label={labels.fiscalYearEnd}
                value={`${labels.months[draft.fiscalYearEndMonth - 1]} ${draft.fiscalYearEndDay}`}
              />
              <ReviewRow label={labels.industry} value={labels.industries[draft.industryClassification]} />
              <ReviewRow label={labels.entityType} value={labels.entityTypes[draft.entityType]} />
            </dl>
            {isPending ? (
              <p className="text-sm text-muted-foreground" aria-live="polite">
                {labels.creating}
              </p>
            ) : null}
          </WizardStepPanel>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">{labels.autosaveHint}</p>
      </WizardShell>
    </CompanyPageShell>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between sm:gap-6">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground sm:text-right">{value || "—"}</dd>
    </div>
  );
}

import type {
  IfrsDisclosureRequirement,
  IfrsNoteStandard,
  IfrsNoteType,
} from "@/types/ifrs-notes";

type RequirementSeed = Omit<IfrsDisclosureRequirement, "standard">;

const BASE_REQUIREMENTS: RequirementSeed[] = [
  {
    noteType: "accounting_policies",
    noteCode: "N01",
    title: "Significant accounting policies",
    standardRef: "IAS 1 / IFRS",
    disclosureKind: "mandatory",
    isRequired: true,
    triggerClassifications: [],
  },
  {
    noteType: "judgements",
    noteCode: "N02",
    title: "Critical judgements",
    standardRef: "IAS 1",
    disclosureKind: "mandatory",
    isRequired: true,
    triggerClassifications: [],
  },
  {
    noteType: "estimates",
    noteCode: "N03",
    title: "Key sources of estimation uncertainty",
    standardRef: "IAS 1",
    disclosureKind: "mandatory",
    isRequired: true,
    triggerClassifications: [],
  },
  {
    noteType: "property_plant_equipment",
    noteCode: "N04",
    title: "Property, plant and equipment",
    standardRef: "IAS 16",
    disclosureKind: "conditional",
    isRequired: true,
    triggerClassifications: ["non_current_assets", "assets"],
  },
  {
    noteType: "intangible_assets",
    noteCode: "N05",
    title: "Intangible assets",
    standardRef: "IAS 38",
    disclosureKind: "conditional",
    isRequired: true,
    triggerClassifications: ["non_current_assets"],
  },
  {
    noteType: "inventories",
    noteCode: "N06",
    title: "Inventories",
    standardRef: "IAS 2",
    disclosureKind: "conditional",
    isRequired: true,
    triggerClassifications: ["current_assets"],
  },
  {
    noteType: "receivables",
    noteCode: "N07",
    title: "Trade and other receivables",
    standardRef: "IFRS 7 / IFRS 9",
    disclosureKind: "conditional",
    isRequired: true,
    triggerClassifications: ["current_assets"],
  },
  {
    noteType: "cash",
    noteCode: "N08",
    title: "Cash and cash equivalents",
    standardRef: "IAS 7",
    disclosureKind: "conditional",
    isRequired: true,
    triggerClassifications: ["current_assets", "cash_flow"],
  },
  {
    noteType: "borrowings",
    noteCode: "N09",
    title: "Borrowings",
    standardRef: "IFRS 7 / IFRS 9",
    disclosureKind: "conditional",
    isRequired: true,
    triggerClassifications: ["current_liabilities", "non_current_liabilities"],
  },
  {
    noteType: "leases",
    noteCode: "N10",
    title: "Leases",
    standardRef: "IFRS 16",
    disclosureKind: "conditional",
    isRequired: true,
    triggerClassifications: ["non_current_assets", "liabilities"],
  },
  {
    noteType: "revenue",
    noteCode: "N11",
    title: "Revenue",
    standardRef: "IFRS 15",
    disclosureKind: "conditional",
    isRequired: true,
    triggerClassifications: ["revenue"],
  },
  {
    noteType: "expenses",
    noteCode: "N12",
    title: "Expenses by nature",
    standardRef: "IAS 1",
    disclosureKind: "conditional",
    isRequired: true,
    triggerClassifications: ["operating_expenses", "cost_of_sales", "finance_costs"],
  },
  {
    noteType: "tax",
    noteCode: "N13",
    title: "Income tax expense",
    standardRef: "IAS 12",
    disclosureKind: "conditional",
    isRequired: true,
    triggerClassifications: ["tax"],
  },
  {
    noteType: "deferred_tax",
    noteCode: "N14",
    title: "Deferred tax",
    standardRef: "IAS 12",
    disclosureKind: "conditional",
    isRequired: true,
    triggerClassifications: ["tax", "non_current_assets", "non_current_liabilities"],
  },
  {
    noteType: "employee_benefits",
    noteCode: "N15",
    title: "Employee benefits",
    standardRef: "IAS 19",
    disclosureKind: "conditional",
    isRequired: true,
    triggerClassifications: ["operating_expenses", "liabilities"],
  },
  {
    noteType: "share_capital",
    noteCode: "N16",
    title: "Share capital",
    standardRef: "IAS 1 / IAS 32",
    disclosureKind: "conditional",
    isRequired: true,
    triggerClassifications: ["equity"],
  },
  {
    noteType: "financial_instruments",
    noteCode: "N17",
    title: "Financial instruments",
    standardRef: "IFRS 7 / IFRS 9",
    disclosureKind: "conditional",
    isRequired: true,
    triggerClassifications: ["current_assets", "current_liabilities", "non_current_liabilities"],
  },
  {
    noteType: "related_parties",
    noteCode: "N18",
    title: "Related party transactions",
    standardRef: "IAS 24",
    disclosureKind: "mandatory",
    isRequired: true,
    triggerClassifications: [],
  },
  {
    noteType: "events_after_reporting_period",
    noteCode: "N19",
    title: "Events after the reporting period",
    standardRef: "IAS 10",
    disclosureKind: "mandatory",
    isRequired: true,
    triggerClassifications: [],
  },
  {
    noteType: "going_concern",
    noteCode: "N20",
    title: "Going concern",
    standardRef: "IAS 1",
    disclosureKind: "mandatory",
    isRequired: true,
    triggerClassifications: [],
  },
  {
    noteType: "commitments",
    noteCode: "N21",
    title: "Commitments",
    standardRef: "IAS 16 / IFRS 16",
    disclosureKind: "optional",
    isRequired: false,
    triggerClassifications: ["non_current_assets"],
  },
  {
    noteType: "contingencies",
    noteCode: "N22",
    title: "Contingencies",
    standardRef: "IAS 37",
    disclosureKind: "optional",
    isRequired: false,
    triggerClassifications: ["liabilities"],
  },
  {
    noteType: "segment_reporting",
    noteCode: "N23",
    title: "Operating segments",
    standardRef: "IFRS 8",
    disclosureKind: "conditional",
    isRequired: false,
    triggerClassifications: ["revenue"],
  },
  {
    noteType: "other_notes",
    noteCode: "N99",
    title: "Other disclosures",
    standardRef: "IFRS",
    disclosureKind: "custom",
    isRequired: false,
    triggerClassifications: [],
  },
];

/**
 * IFRS Requirement Resolver — standard-scoped disclosure catalog.
 */
export function resolveRequirementsForStandard(
  standard: IfrsNoteStandard,
): IfrsDisclosureRequirement[] {
  return BASE_REQUIREMENTS.map((requirement) => ({
    ...requirement,
    standard,
    standardRef: adaptStandardRef(requirement.standardRef, standard),
  }));
}

export function noteTypeLabel(noteType: IfrsNoteType): string {
  return noteType.replaceAll("_", " ");
}

function adaptStandardRef(ref: string, standard: IfrsNoteStandard): string {
  if (standard === "sme_ifrs") return `SME IFRS · ${ref}`;
  if (standard === "ias" && ref.includes("IAS")) return ref;
  if (standard === "ifric") return ref.replace("IFRS", "IFRIC");
  if (standard === "sic") return ref.replace("IAS", "SIC");
  return ref;
}

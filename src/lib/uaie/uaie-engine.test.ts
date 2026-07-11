import { describe, expect, it } from "vitest";
import { latinizeAzerbaijani, normalizeAccountingHeader } from "@/lib/uaie/normalize";
import { matchSynonymExact } from "@/lib/uaie/synonyms";
import { fuzzyMatchCanonicalField } from "@/lib/uaie/fuzzy";
import { scoreSheet } from "@/lib/uaie/detectors";

describe("UAIE engine", () => {
  it("normalizes Azerbaijani diacritics", () => {
    expect(latinizeAzerbaijani("Qalıq")).toBe("Qaliq");
    expect(normalizeAccountingHeader("Qalıq")).toBe("qaliq");
    expect(normalizeAccountingHeader("Hesab_Kodu")).toBe("hesab kodu");
  });

  it("maps multilingual account code synonyms", () => {
    expect(matchSynonymExact("Account Code")).toBe("account_code");
    expect(matchSynonymExact("Hesab Kodu")).toBe("account_code");
    expect(matchSynonymExact("Код счета")).toBe("account_code");
    expect(matchSynonymExact("Debit")).toBe("debit");
  });

  it("fuzzy-matches typos to balance", () => {
    const match = fuzzyMatchCanonicalField("qaliq");
    expect(match?.field).toBe("balance");
    expect((match?.confidence ?? 0) >= 72).toBe(true);

    const typo = fuzzyMatchCanonicalField("balnce");
    expect(typo?.field).toBe("balance");
  });

  it("scores trial balance sheets higher", () => {
    const tb = scoreSheet({
      name: "Trial Balance",
      index: 0,
      rows: [
        ["Account Code", "Account Name", "Debit", "Credit"],
        ["1110", "Cash", 100, 0],
        ["2110", "Payables", 0, 100],
      ],
    });
    const junk = scoreSheet({
      name: "Sheet1",
      index: 1,
      rows: [["a", "b"], ["c", "d"]],
    });
    expect(tb).toBeGreaterThan(junk);
  });
});

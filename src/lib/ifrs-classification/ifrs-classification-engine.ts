import { classifyIfrsAccount, type IfrsClassificationInput } from "./ifrs-classification";

/** Workflow/engine surface for IFRS classification. */
export class IfrsClassificationEngine {
  classify(input: IfrsClassificationInput): string {
    return classifyIfrsAccount(input);
  }
}

export function runIfrsClassificationPipeline(
  accounts: IfrsClassificationInput[],
): Array<{ accountCode: string; ifrsClass: string }> {
  const engine = new IfrsClassificationEngine();
  return accounts.map((account) => ({
    accountCode: account.accountCode,
    ifrsClass: engine.classify(account),
  }));
}

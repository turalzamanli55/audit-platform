import { describe, expect, it } from "vitest";
import { getDictionary } from "./get-dictionary";

describe("getDictionary", () => {
  it("reuses the same dictionary instance for repeated locale loads", async () => {
    const first = await getDictionary("en");
    const start = performance.now();
    const second = await getDictionary("en");
    const elapsed = performance.now() - start;

    expect(second).toBe(first);
    expect(elapsed).toBeLessThan(10);
  });

  it("deduplicates concurrent loads for the same locale", async () => {
    const [first, second] = await Promise.all([getDictionary("tr"), getDictionary("tr")]);
    expect(second).toBe(first);
  });
});

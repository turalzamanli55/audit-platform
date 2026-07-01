import { describe, expect, it } from "vitest";
import {
  buildWelcomeGreeting,
  buildWelcomeSummary,
  resolveTimeOfDay,
} from "./workspace-greeting";

describe("workspace-greeting", () => {
  const labels = {
    timeMorning: "morning",
    timeAfternoon: "afternoon",
    timeEvening: "evening",
  };

  it("resolves morning before noon", () => {
    expect(resolveTimeOfDay(9, labels)).toBe("morning");
  });

  it("resolves afternoon before 6pm", () => {
    expect(resolveTimeOfDay(14, labels)).toBe("afternoon");
  });

  it("interpolates greeting tokens", () => {
    expect(
      buildWelcomeGreeting("Good {timeOfDay}, {name}", {
        timeOfDay: "morning",
        name: "Alex",
      }),
    ).toBe("Good morning, Alex");
  });

  it("interpolates workspace summary tokens", () => {
    expect(
      buildWelcomeSummary("You are in {workspace} · {organization}", {
        workspace: "Main",
        organization: "Acme",
      }),
    ).toBe("You are in Main · Acme");
  });
});

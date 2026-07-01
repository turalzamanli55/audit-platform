import { describe, expect, it } from "vitest";
import { computeFloatingPosition } from "./floating-position";

describe("computeFloatingPosition", () => {
  const viewport = { width: 390, height: 844 };

  it("places menu below trigger aligned to end", () => {
    const trigger = { top: 10, right: 300, bottom: 50, left: 250, width: 50, height: 40 };
    const menu = { width: 192, height: 200 };

    const position = computeFloatingPosition(trigger, menu, {
      align: "end",
      viewport,
    });

    expect(position.placement).toBe("bottom");
    expect(position.top).toBe(56);
    expect(position.left).toBe(108);
  });

  it("flips above trigger when there is not enough space below", () => {
    const trigger = { top: 700, right: 300, bottom: 740, left: 250, width: 50, height: 40 };
    const menu = { width: 192, height: 200 };

    const position = computeFloatingPosition(trigger, menu, {
      align: "end",
      viewport,
    });

    expect(position.placement).toBe("top");
    expect(position.top).toBe(494);
  });

  it("clamps menu inside viewport horizontally", () => {
    const trigger = { top: 10, right: 40, bottom: 50, left: 0, width: 40, height: 40 };
    const menu = { width: 192, height: 120 };

    const position = computeFloatingPosition(trigger, menu, {
      align: "start",
      viewport,
    });

    expect(position.left).toBe(8);
  });

  it("aligns to start edge of trigger", () => {
    const trigger = { top: 10, right: 200, bottom: 50, left: 120, width: 80, height: 40 };
    const menu = { width: 160, height: 120 };

    const position = computeFloatingPosition(trigger, menu, {
      align: "start",
      viewport,
    });

    expect(position.left).toBe(120);
  });
});

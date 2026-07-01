import { describe, expect, it, vi } from "vitest";
import { claimActiveDropdown, closeActiveDropdown } from "./dropdown-registry";

describe("dropdown-registry", () => {
  it("closes the previously active dropdown when a new one claims focus", () => {
    const first = vi.fn();
    const second = vi.fn();

    claimActiveDropdown(first);
    claimActiveDropdown(second);

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).not.toHaveBeenCalled();
  });

  it("closes the active dropdown globally", () => {
    const close = vi.fn();
    claimActiveDropdown(close);

    closeActiveDropdown();

    expect(close).toHaveBeenCalledTimes(1);
  });

  it("clears ownership when the active dropdown releases its claim", () => {
    const close = vi.fn();
    const release = claimActiveDropdown(close);

    release();
    closeActiveDropdown();

    expect(close).not.toHaveBeenCalled();
  });
});

import { describe, expect, it } from "vitest";
import { DEFAULT_DASHBOARD_PREFERENCES } from "@/types/dashboard-preferences";
import {
  moveWidget,
  toggleFavoriteCompany,
  trackRecentCompany,
} from "@/lib/dashboard/dashboard-preferences-storage";

describe("dashboard-preferences-storage", () => {
  it("tracks recent companies with newest first", () => {
    const first = trackRecentCompany(DEFAULT_DASHBOARD_PREFERENCES, "a");
    const second = trackRecentCompany(first, "b");
    const third = trackRecentCompany(second, "a");

    expect(third.recentCompanyIds).toEqual(["a", "b"]);
  });

  it("toggles favorite companies", () => {
    const added = toggleFavoriteCompany(DEFAULT_DASHBOARD_PREFERENCES, "company-1");
    const removed = toggleFavoriteCompany(added, "company-1");

    expect(added.favoriteCompanyIds).toEqual(["company-1"]);
    expect(removed.favoriteCompanyIds).toEqual([]);
  });

  it("moves widgets within the same column", () => {
    const moved = moveWidget(DEFAULT_DASHBOARD_PREFERENCES, "tasks", "up");
    const taskOrder = moved.widgets.tasks.order;
    const continueOrder = moved.widgets.continue.order;

    expect(taskOrder).toBeLessThan(continueOrder);
  });
});

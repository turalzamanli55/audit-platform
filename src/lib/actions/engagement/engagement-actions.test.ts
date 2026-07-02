import { describe, expect, it } from "vitest";
import { ENGAGEMENT_PERMISSIONS } from "@/constants/engagement";

describe("engagement permissions and audit", () => {
  it("uses permission codes instead of role names", () => {
    expect(ENGAGEMENT_PERMISSIONS.READ).toBe("engagement.read");
    expect(ENGAGEMENT_PERMISSIONS.CREATE).toBe("engagement.create");
    expect(ENGAGEMENT_PERMISSIONS.UPDATE).toBe("engagement.update");
    expect(ENGAGEMENT_PERMISSIONS.ARCHIVE).toBe("engagement.archive");
  });

  it("defines expected engagement audit event codes", () => {
    const events = [
      "engagement.created",
      "engagement.updated",
      "engagement.archived",
      "engagement.restored",
    ];

    expect(events).toHaveLength(4);
    expect(events.every((event) => event.startsWith("engagement."))).toBe(true);
  });
});

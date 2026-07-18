import { loadPlatformActivity } from "@/lib/platform-console/data";
import { PlatformPageHeader } from "@/components/platform-console/platform-primitives";
import { ActivityCenter } from "@/components/platform-console/activity-center";

export const dynamic = "force-dynamic";

export default async function PlatformActivityPage() {
  const events = await loadPlatformActivity();

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        title="Activity Center"
        description="Search, filter, and export every platform audit and security event. Actor and company are resolved for each mutation."
      />
      <ActivityCenter events={events} />
    </div>
  );
}

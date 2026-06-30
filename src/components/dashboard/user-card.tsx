"use client";

import { useAuth } from "@/providers";
import { useTenant } from "@/providers/tenant-provider";
import { signOutAction } from "@/lib/actions/auth/sign-out";
import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";

type UserCardProps = {
  labels: {
    title: string;
    roles: string;
    permissions: string;
    signOut: string;
  };
};

export function UserCard({ labels }: UserCardProps) {
  const { session } = useAuth();
  const tenant = useTenant();
  const router = useRouter();

  if (session.status !== "authenticated" || !session.user) {
    return null;
  }

  async function handleSignOut() {
    await signOutAction({});
    router.push("/");
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{labels.title}</p>
      <h3 className="mt-2 text-lg font-semibold">{session.user.displayName}</h3>
      <p className="text-sm text-muted-foreground">{session.user.email}</p>

      <div className="mt-4 space-y-2 text-sm">
        <p>
          <span className="text-muted-foreground">{labels.roles}: </span>
          {tenant.roleSlugs.length > 0 ? tenant.roleSlugs.join(", ") : "—"}
        </p>
        <p>
          <span className="text-muted-foreground">{labels.permissions}: </span>
          {tenant.permissionCodes.length}
        </p>
      </div>

      <Button variant="secondary" className="mt-5 w-full" onClick={handleSignOut}>
        {labels.signOut}
      </Button>
    </div>
  );
}

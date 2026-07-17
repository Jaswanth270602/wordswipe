"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated();
  const authenticated = useAppStore((s) => s.profile.authenticated);
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !authenticated) router.replace("/auth");
  }, [hydrated, authenticated, router]);

  if (!hydrated) {
    return (
      <div className="py-24 text-center text-sm text-slate-400">Loading…</div>
    );
  }
  if (!authenticated) return null;
  return <>{children}</>;
}

"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { StoreHydrator } from "@/components/StoreHydrator";
import { SectionSideNav } from "@/components/SectionSideNav";
import { ThemeProvider } from "@/lib/theme";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const marketing =
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/landing");

  return (
    <ThemeProvider>
      <div className="relative min-h-dvh overflow-x-hidden bg-[var(--bg)] text-[var(--ink)]">
        <StoreHydrator />
        <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-80" />
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[var(--blob-a)] blur-3xl" />
          <div className="absolute -right-16 top-40 h-64 w-64 rounded-full bg-[var(--blob-b)] blur-3xl" />
          <div className="absolute bottom-24 left-1/3 h-56 w-56 rounded-full bg-[var(--blob-c)] blur-3xl" />
        </div>

        {!marketing && <Navbar />}
        <main
          className={
            marketing
              ? "mx-auto w-full max-w-lg px-4 pb-10 pt-6"
              : "mx-auto w-full max-w-lg px-4 pb-28 pt-5"
          }
        >
          {children}
        </main>
        {!marketing && (
          <>
            <SectionSideNav />
            <BottomNav />
          </>
        )}
      </div>
    </ThemeProvider>
  );
}

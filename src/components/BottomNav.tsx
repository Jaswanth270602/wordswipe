"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SECTION_NAV } from "@/data/words";
import { sounds } from "@/lib/sounds";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--stroke)] bg-[var(--card)]/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
      aria-label="Sections"
    >
      <div className="mx-auto flex max-w-lg gap-0.5 overflow-x-auto px-1.5 py-1.5 scrollbar-none">
        {SECTION_NAV.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => sounds.tap()}
              className={cn(
                "flex min-w-[3.4rem] flex-1 flex-col items-center justify-center rounded-2xl px-1.5 py-2 transition active:scale-95",
                active
                  ? "bg-[var(--teal)] text-white shadow-lg shadow-teal-900/20"
                  : "text-[var(--muted)] hover:bg-[var(--surface)]"
              )}
            >
              <span className="text-[11px] font-bold tracking-tight">
                {item.short}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

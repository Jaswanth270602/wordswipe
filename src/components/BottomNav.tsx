"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/types";
import { unlockAudio } from "@/lib/sounds";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--stroke)] bg-[var(--nav-bg)] pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
      aria-label="Main"
    >
      <div className="mx-auto flex h-[var(--nav-h)] max-w-lg items-stretch justify-between px-2">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/home"
              ? pathname === "/home" || pathname === "/"
              : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => unlockAudio()}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 transition active:scale-95",
                active ? "text-[var(--teal)]" : "text-[var(--muted)]"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl transition",
                  active && "bg-[var(--teal-soft)] shadow-[0_0_18px_rgba(45,212,191,0.2)]"
                )}
              >
                <NavIcon name={item.icon} active={active} />
              </span>
              <span className="text-[10px] font-semibold tracking-wide">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function NavIcon({ name, active }: { name: string; active: boolean }) {
  const stroke = active ? "var(--teal)" : "currentColor";
  const props = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke,
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "home":
      return (
        <svg {...props}>
          <path d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z" />
        </svg>
      );
    case "study":
      return (
        <svg {...props}>
          <path d="M4 5.5C4 4.67 4.67 4 5.5 4H12v16H5.5A1.5 1.5 0 014 18.5v-13z" />
          <path d="M20 5.5c0-.83-.67-1.5-1.5-1.5H12v16h6.5a1.5 1.5 0 001.5-1.5v-13z" />
        </svg>
      );
    case "daily":
      return (
        <svg {...props}>
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M8 3v4M16 3v4M4 10h16" />
        </svg>
      );
    case "ranks":
      return (
        <svg {...props}>
          <path d="M8 20V11M12 20V5M16 20v-6" />
        </svg>
      );
    case "profile":
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 19c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
        </svg>
      );
    default:
      return null;
  }
}

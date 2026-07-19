"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { STUDY_SECTIONS } from "@/lib/sections";
import { unlockAudio } from "@/lib/sounds";
import { cn } from "@/lib/utils";

/** Floating button + slide-in side nav for all study sections */
export function SectionSideNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const live = STUDY_SECTIONS.filter((s) => s.live);
  const soon = STUDY_SECTIONS.filter((s) => !s.live);

  return (
    <>
      <button
        type="button"
        aria-label="Open sections"
        onClick={() => {
          unlockAudio();
          setOpen(true);
        }}
        className="fixed bottom-[calc(var(--nav-h)+18px+env(safe-area-inset-bottom))] right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--stroke)] bg-[var(--teal)] text-[var(--on-teal)] shadow-lg transition active:scale-95"
      >
        <GridIcon />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close overlay"
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 right-0 z-[70] flex w-[min(100%,320px)] flex-col border-l border-[var(--stroke)] bg-[var(--card)] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[var(--stroke)] px-5 py-4">
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-lg text-[var(--ink)]">
                    Sections
                  </h2>
                  <p className="text-xs text-[var(--muted)]">
                    Syn · Ant · PV · Idioms · Spellings
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--stroke)] text-[var(--ink)]"
                >
                  ✕
                </button>
              </div>

              <nav className="flex-1 space-y-4 overflow-y-auto p-3">
                <div>
                  <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--teal)]">
                    Live now
                  </p>
                  <div className="space-y-1">
                    {live.map((s) => (
                      <SectionLink
                        key={s.key}
                        s={s}
                        active={pathname === s.href}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                    Coming soon
                  </p>
                  <div className="space-y-1">
                    {soon.map((s) => (
                      <SectionLink
                        key={s.key}
                        s={s}
                        active={pathname === s.href}
                        dim
                      />
                    ))}
                  </div>
                </div>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function SectionLink({
  s,
  active,
  dim,
}: {
  s: (typeof STUDY_SECTIONS)[number];
  active: boolean;
  dim?: boolean;
}) {
  return (
    <Link
      href={s.href}
      onClick={() => unlockAudio()}
      className={cn(
        "flex items-center gap-3 rounded-2xl px-3 py-3 transition",
        active
          ? "bg-[var(--teal-soft)] text-[var(--teal)]"
          : "text-[var(--ink)] hover:bg-[var(--surface)]",
        dim && "opacity-70"
      )}
    >
      <span
        className="flex h-10 w-10 items-center justify-center rounded-xl text-[11px] font-black text-[#070b14]"
        style={{ background: s.live ? s.color : "#94a3b8" }}
      >
        {s.short}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 text-sm font-semibold">
          {s.label}
          {!s.live && (
            <span className="rounded-full bg-[var(--surface)] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[var(--muted)]">
              Soon
            </span>
          )}
        </span>
        <span className="block text-[11px] text-[var(--muted)]">{s.hint}</span>
      </span>
    </Link>
  );
}

function GridIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

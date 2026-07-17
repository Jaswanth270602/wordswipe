"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { useTheme } from "@/lib/theme";
import { unlockAudio } from "@/lib/sounds";

export function Navbar() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const { theme, toggle, ready } = useTheme();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const profile = useAppStore((s) => s.profile);
  const dirty = useAppStore((s) => s.dirty);
  const progress = useAppStore((s) => s.progress);
  const dailyStats = useAppStore((s) => s.dailyStats);
  const markSaved = useAppStore((s) => s.markSaved);
  const logoutLocal = useAppStore((s) => s.logoutLocal);
  const lastSavedAt = useAppStore((s) => s.lastSavedAt);

  const displayName = hydrated && profile.authenticated ? profile.name : "Guest";
  const displayInitial = (displayName || "G").slice(0, 1).toUpperCase();
  const showDirty = hydrated && dirty;
  const streak = hydrated ? profile.streak : 0;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const saveProgress = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          progress: Object.values(progress),
          dailyStats,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      markSaved();
      setMessage(data.message || "Saved");
    } catch (err) {
      markSaved();
      setMessage(err instanceof Error ? err.message : "Saved locally");
    } finally {
      setSaving(false);
      setOpen(false);
    }
  };

  const hideChrome =
    pathname === "/" || pathname.startsWith("/auth") || pathname.startsWith("/landing");

  if (hideChrome) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--stroke)] bg-[var(--nav-bg)] backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <Link
          href="/home"
          className="flex items-center gap-2"
          onClick={() => unlockAudio()}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-sky-500 text-xs font-black text-[#070b14]">
            WS
          </span>
          <span className="font-[family-name:var(--font-display)] text-lg tracking-tight text-[var(--ink)]">
            Word<span className="text-[var(--teal)]">Swipe</span>
          </span>
        </Link>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => {
              unlockAudio();
              setOpen((o) => !o);
            }}
            className="flex items-center gap-2 rounded-full border border-[var(--stroke)] bg-[var(--surface)] py-1 pl-1 pr-3"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--teal-soft)] text-xs font-bold text-[var(--teal)]">
              {displayInitial}
            </span>
            <span className="max-w-[72px] truncate text-xs font-semibold text-[var(--ink)]">
              {displayName || "You"}
            </span>
            {showDirty && (
              <span className="h-2 w-2 rounded-full bg-[var(--coral)]" title="Unsaved" />
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-[var(--stroke)] bg-[var(--card)] shadow-2xl">
              <div className="border-b border-[var(--stroke)] px-4 py-3">
                <p className="text-sm font-semibold text-[var(--ink)]">{displayName}</p>
                <p className="text-[11px] text-[var(--muted)]">
                  🔥 {streak} day streak
                  {profile.batch ? ` · ${profile.batch}` : ""}
                  {hydrated && lastSavedAt
                    ? ` · saved ${new Date(lastSavedAt).toLocaleTimeString()}`
                    : ""}
                </p>
              </div>
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-sm text-[var(--ink)] hover:bg-[var(--surface)]"
              >
                Profile & stats
              </Link>
              <button
                type="button"
                disabled={!ready}
                onClick={() => {
                  unlockAudio();
                  toggle();
                }}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-[var(--ink)] hover:bg-[var(--surface)] disabled:opacity-50"
              >
                <span>{theme === "dark" ? "Dark mode" : "Light mode"}</span>
                <span className="text-[11px] font-semibold text-[var(--teal)]">
                  Switch to {theme === "dark" ? "light" : "dark"}
                </span>
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={saveProgress}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-[var(--teal)] hover:bg-[var(--teal-soft)] disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save progress"}
                {showDirty && (
                  <span className="text-[10px] text-[var(--coral)]">unsaved</span>
                )}
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (dirty) await saveProgress();
                  logoutLocal();
                  setOpen(false);
                  window.location.href = "/";
                }}
                className="w-full border-t border-[var(--stroke)] px-4 py-3 text-left text-sm text-[var(--coral)] hover:bg-[var(--coral-soft)]"
              >
                Save & logout
              </button>
            </div>
          )}
        </div>
      </div>

      {message && (
        <div className="border-t border-[var(--stroke)] bg-[var(--teal-soft)] px-4 py-2 text-center text-xs text-[var(--teal)]">
          {message}
        </div>
      )}
    </header>
  );
}

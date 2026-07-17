"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { sounds } from "@/lib/sounds";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const hydrated = useHydrated();
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

  const displayName = hydrated ? profile.name : "Aspirant";
  const displayInitial = displayName.slice(0, 1).toUpperCase();
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
    sounds.tap();
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
      setMessage(data.message || "Saved to cloud");
    } catch (err) {
      // Offline / no DB — still clear dirty after local confirm
      markSaved();
      setMessage(
        err instanceof Error
          ? `Saved locally. Cloud: ${err.message}`
          : "Saved locally"
      );
    } finally {
      setSaving(false);
      setOpen(false);
    }
  };

  const handleLogout = async () => {
    sounds.tap();
    if (dirty) await saveProgress();
    logoutLocal();
    setOpen(false);
    setMessage("Logged out — local progress cleared");
  };

  const links = [
    { href: "/", label: "Home" },
    { href: "/play", label: "Play" },
    { href: "/daily", label: "Daily" },
    { href: "/leaderboard", label: "Ranks" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--stroke)] bg-[var(--bg)]/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-lg tracking-tight text-[var(--teal-deep)]"
          onClick={() => sounds.tap()}
        >
          Word<span className="text-[var(--coral)]">Swipe</span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => sounds.tap()}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                pathname === l.href
                  ? "bg-[var(--teal)] text-white"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => {
              sounds.tap();
              setOpen((o) => !o);
            }}
            className="flex items-center gap-2 rounded-full border border-[var(--stroke)] bg-[var(--card)] py-1 pl-1 pr-3"
            aria-haspopup="menu"
            aria-expanded={open}
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: hydrated ? profile.avatarColor : "#0F766E" }}
            >
              {displayInitial}
            </span>
            <span className="max-w-[72px] truncate text-xs font-semibold text-[var(--ink)]">
              {displayName}
            </span>
            {showDirty && (
              <span className="h-2 w-2 rounded-full bg-[var(--coral)]" title="Unsaved" />
            )}
          </button>

          {open && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-[var(--stroke)] bg-[var(--card)] shadow-xl"
            >
              <div className="border-b border-[var(--stroke)] px-4 py-3">
                <p className="text-sm font-semibold text-[var(--ink)]">
                  {displayName}
                </p>
                <p className="text-[11px] text-[var(--muted)]">
                  🔥 {streak} day streak
                  {hydrated && lastSavedAt
                    ? ` · saved ${new Date(lastSavedAt).toLocaleTimeString()}`
                    : " · not synced yet"}
                </p>
              </div>
              <Link
                href="/profile"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-sm text-[var(--ink)] hover:bg-[var(--surface)]"
              >
                Profile & stats
              </Link>
              <button
                type="button"
                role="menuitem"
                disabled={saving}
                onClick={saveProgress}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-[var(--teal-deep)] hover:bg-[var(--teal-soft)] disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save progress"}
                {showDirty && <span className="text-[10px] text-[var(--coral)]">unsaved</span>}
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="w-full border-t border-[var(--stroke)] px-4 py-3 text-left text-sm text-[var(--coral)] hover:bg-[var(--coral-soft)]"
              >
                Save & logout
              </button>
            </div>
          )}
        </div>
      </div>

      {message && (
        <div className="border-t border-[var(--stroke)] bg-[var(--teal-soft)] px-4 py-2 text-center text-xs text-[var(--teal-deep)]">
          {message}
        </div>
      )}
    </header>
  );
}

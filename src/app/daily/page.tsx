"use client";

import { useMemo } from "react";
import { CardDeck } from "@/components/CardDeck";
import { RequireAuth } from "@/components/RequireAuth";
import { ROUND_SIZE } from "@/lib/constants";
import { WORDS } from "@/data/words";
import { useAppStore } from "@/lib/store";

function daySeed(): number {
  const d = new Date().toISOString().slice(0, 10);
  let h = 0;
  for (let i = 0; i < d.length; i++) h = (h * 31 + d.charCodeAt(i)) >>> 0;
  return h;
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function DailyPage() {
  const streak = useAppStore((s) => s.profile.streak);
  const words = useMemo(
    () => seededShuffle(WORDS, daySeed()).slice(0, 100),
    []
  );

  return (
    <RequireAuth>
      <div className="space-y-4">
        <div className="rounded-[28px] border border-white/10 bg-[#111827] p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-teal-300">
            Daily Challenge
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-white">
            100 cards · rounds of {ROUND_SIZE}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Report after {ROUND_SIZE} · Bronze 80 · Silver 90 · Gold 100 · 🔥{" "}
            {streak}
          </p>
        </div>
        <CardDeck
          words={words}
          sessionSize={ROUND_SIZE}
          title="Daily challenge report"
        />
      </div>
    </RequireAuth>
  );
}

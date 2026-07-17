"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { LevelGrid } from "@/components/LevelGrid";
import { CircularSectionSpin } from "@/components/CircularSectionSpin";
import { useAppStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { getKnownWordCount, WORDS } from "@/data/words";
import { ROUND_SIZE } from "@/lib/constants";
import { unlockAudio } from "@/lib/sounds";
import { formatDateLabel } from "@/lib/utils";

export default function HomeDashboard() {
  const hydrated = useHydrated();
  const router = useRouter();
  const profile = useAppStore((s) => s.profile);
  const progress = useAppStore((s) => s.progress);
  const dailyStats = useAppStore((s) => s.dailyStats);

  useEffect(() => {
    if (hydrated && !profile.authenticated) router.replace("/");
  }, [hydrated, profile.authenticated, router]);

  const known = hydrated ? getKnownWordCount(progress) : 0;
  const reviewed = hydrated ? Object.keys(progress).length : 0;
  const streak = hydrated ? profile.streak : 0;
  const recent = useMemo(
    () => (hydrated ? [...dailyStats].slice(-7) : []),
    [dailyStats, hydrated]
  );
  const maxBar = Math.max(1, ...recent.map((d) => d.wordsLearned));

  if (!hydrated) {
    return (
      <div className="py-24 text-center text-sm text-[var(--muted)]">Loading…</div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[var(--stroke)] bg-[var(--card)] p-5 shadow-[var(--shadow-card)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--teal)]">
          {profile.batch || "Your arena"} · free practice
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-[1.75rem] leading-tight text-[var(--ink)]">
          Hey {profile.name.split(" ")[0] || "aspirant"}, ready to swipe?
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Round of {ROUND_SIZE} · scratch · swipe Got it / Learn
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Stat label="Known" value={String(known)} tone="teal" />
          <Stat label="Reviewed" value={String(reviewed)} tone="sky" />
          <Stat label="Streak" value={`🔥 ${streak}`} tone="amber" />
          <Stat label="Bank" value={String(WORDS.length)} tone="rose" />
        </div>
        <div className="mt-5 flex gap-2">
          <Link
            href="/play"
            onClick={() => unlockAudio()}
            className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-[var(--teal)] text-sm font-bold text-[var(--on-teal)] active:scale-[0.99]"
          >
            Start study
          </Link>
          <Link
            href="/daily"
            className="flex h-12 flex-1 items-center justify-center rounded-2xl border border-[var(--stroke)] text-sm font-semibold text-[var(--ink)] active:scale-[0.99]"
          >
            Daily
          </Link>
        </div>
      </section>

      <section className="rounded-[28px] border border-[var(--stroke)] bg-[var(--card)] px-3 py-5 shadow-[var(--shadow-card)]">
        <CircularSectionSpin />
      </section>

      <section className="rounded-[28px] border border-[var(--stroke)] bg-[var(--card)] p-5">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--teal)]">
              Weekly activity
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-lg text-[var(--ink)]">
              Cards practiced
            </h2>
          </div>
        </div>
        {recent.length === 0 ? (
          <p className="py-8 text-center text-sm text-[var(--muted)]">
            Play a round to unlock your chart
          </p>
        ) : (
          <div className="flex h-32 items-end gap-2">
            {recent.map((d, i) => (
              <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                <motion.div
                  className="w-full rounded-t-md bg-gradient-to-t from-[var(--teal-deep)] to-[var(--teal)]"
                  initial={{ height: 0 }}
                  animate={{
                    height: `${Math.max(8, (d.wordsLearned / maxBar) * 100)}%`,
                  }}
                  transition={{ delay: i * 0.05 }}
                />
                <span className="text-[9px] text-[var(--muted)]">
                  {formatDateLabel(d.date)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-[family-name:var(--font-display)] text-lg text-[var(--ink)]">
          Levels
        </h2>
        <LevelGrid />
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "teal" | "sky" | "amber" | "rose";
}) {
  const colors = {
    teal: "text-[var(--teal)]",
    sky: "text-sky-500",
    amber: "text-[var(--amber)]",
    rose: "text-[var(--coral)]",
  };
  return (
    <div className="rounded-2xl bg-[var(--surface)] px-3 py-3">
      <p className={`font-[family-name:var(--font-display)] text-xl ${colors[tone]}`}>
        {value}
      </p>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
        {label}
      </p>
    </div>
  );
}

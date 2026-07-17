"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LevelGrid } from "@/components/LevelGrid";
import { useAppStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { ROUND_SIZE } from "@/lib/constants";
import { getKnownWordCount, WORDS } from "@/data/words";
import { sounds } from "@/lib/sounds";

export default function HomePage() {
  const hydrated = useHydrated();
  const progress = useAppStore((s) => s.progress);
  const streak = useAppStore((s) => s.profile.streak);
  const known = hydrated ? getKnownWordCount(progress) : 0;
  const reviewed = hydrated ? Object.keys(progress).length : 0;
  const streakShow = hydrated ? streak : 0;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[32px] bg-[var(--teal-deep)] px-5 pb-7 pt-8 text-white">
        <motion.div
          className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-4 right-6 h-20 w-20 rounded-full bg-[var(--coral)]/30"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity }}
        />
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-100/80">
          SSC CGL English
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-[2.6rem] leading-[1.05] tracking-tight">
          Word<span className="text-rose-300">Swipe</span>
        </h1>
        <p className="mt-3 max-w-[18rem] text-sm leading-relaxed text-teal-50/90">
          One format every card — word, scratch, meaning, example. Swipe like a
          pro. Report every {ROUND_SIZE}.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/play"
            onClick={() => sounds.tap()}
            className="inline-flex h-12 items-center rounded-2xl bg-white px-5 text-sm font-bold text-[var(--teal-deep)] transition active:scale-95"
          >
            Start swiping
          </Link>
          <Link
            href="/category/IDIOMS"
            onClick={() => sounds.tap()}
            className="inline-flex h-12 items-center rounded-2xl border border-white/30 px-5 text-sm font-semibold text-white transition active:scale-95"
          >
            Idioms
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-2">
        {[
          { label: "Known", value: known },
          { label: "Reviewed", value: reviewed },
          { label: "Streak", value: `🔥 ${streakShow}` },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-[var(--stroke)] bg-[var(--card)] px-3 py-3 text-center"
          >
            <p className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
              {s.value}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
              {s.label}
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-[var(--stroke)] bg-[var(--card)] p-4">
        <p className="text-sm text-[var(--muted)]">
          <span className="font-semibold text-[var(--ink)]">{WORDS.length} words</span>{" "}
          modular bank · every entry has meaning + SSC example · switch
          Idioms / Syn / Ant / Phrasal from the bottom bar
        </p>
      </section>

      <section>
        <h2 className="mb-1 font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
          Levels
        </h2>
        <p className="mb-4 text-sm text-[var(--muted)]">
          Unlock as memory strength grows
        </p>
        <LevelGrid />
      </section>
    </div>
  );
}

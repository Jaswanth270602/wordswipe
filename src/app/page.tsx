"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { WORDS } from "@/data/words";
import { unlockAudio } from "@/lib/sounds";

export default function LandingPage() {
  const hydrated = useHydrated();
  const authenticated = useAppStore((s) => s.profile.authenticated);
  const router = useRouter();

  useEffect(() => {
    if (hydrated && authenticated) router.replace("/home");
  }, [hydrated, authenticated, router]);

  const chart = [28, 42, 35, 58, 64, 51, 72];

  return (
    <div className="space-y-8 pb-8">
      <header className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-sky-500 text-sm font-black text-[#070b14]">
            WS
          </span>
          <span className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
            WordSwipe
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/auth"
            onClick={() => unlockAudio()}
            className="rounded-full border border-[var(--stroke)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold text-[var(--ink)]"
          >
            Sign in
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#111827] p-6">
        <motion.div
          className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-teal-400/20 blur-2xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-300">
          SSC CGL · English mastery
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-[2.35rem] leading-[1.05] tracking-tight text-white">
          Scratch. Swipe.
          <br />
          <span className="text-teal-300">Remember forever.</span>
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
          Spaced repetition built for 5,000+ SSC words — idioms, synonyms,
          antonyms, one-word substitutions. Mobile-first. Elite feel.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/auth"
            onClick={() => unlockAudio()}
            className="inline-flex h-12 items-center rounded-2xl bg-teal-400 px-5 text-sm font-bold text-[#070b14] transition active:scale-95"
          >
            Get started free
          </Link>
          <Link
            href="/auth?mode=signin"
            className="inline-flex h-12 items-center rounded-2xl border border-white/15 px-5 text-sm font-semibold text-white transition active:scale-95"
          >
            I have an account
          </Link>
        </div>
      </section>

      <section className="rounded-[28px] border border-white/10 bg-[#111827] p-5">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-teal-300">
              Retention curve
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl text-white">
              Words stick after swipes
            </h2>
          </div>
          <span className="text-xs text-slate-500">{WORDS.length}+ in bank</span>
        </div>
        <div className="flex h-36 items-end gap-2">
          {chart.map((v, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-lg bg-gradient-to-t from-teal-600/40 to-teal-300"
              initial={{ height: 0 }}
              animate={{ height: `${v}%` }}
              transition={{ delay: i * 0.07, type: "spring", stiffness: 200 }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wide text-slate-500">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        {[
          { t: "Scratch cards", d: "Lottery-style reveal" },
          { t: "Swipe memory", d: "Got it · Learn again" },
          { t: "30-card rounds", d: "Report after deep sets" },
          { t: "Batch cohorts", d: "June & July 2026" },
        ].map((f) => (
          <div
            key={f.t}
            className="rounded-2xl border border-white/10 bg-[#111827] p-4"
          >
            <p className="font-semibold text-white">{f.t}</p>
            <p className="mt-1 text-xs text-slate-400">{f.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

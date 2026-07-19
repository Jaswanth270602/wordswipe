"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CardDeck } from "@/components/CardDeck";
import { RequireAuth } from "@/components/RequireAuth";
import { ROUND_SIZE } from "@/lib/constants";
import { getWordsByCategory } from "@/data/words";
import { CATEGORY_LABELS, type Category } from "@/lib/types";
import { isSectionLive, STUDY_SECTIONS } from "@/lib/sections";
import { unlockAudio } from "@/lib/sounds";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = use(params);
  const cat = category as Category;
  const label = CATEGORY_LABELS[cat];
  const live = label ? isSectionLive(cat) : false;
  const meta = STUDY_SECTIONS.find((s) => s.key === cat);
  const words = useMemo(
    () => (label && live ? getWordsByCategory(cat) : []),
    [cat, label, live]
  );

  if (!label) {
    return (
      <div className="text-center text-[var(--muted)]">
        <p>Category not found.</p>
        <Link href="/home" className="text-[var(--teal)]">
          Home
        </Link>
      </div>
    );
  }

  return (
    <RequireAuth>
      <div className="space-y-4">
        <div className="rounded-[24px] border border-[var(--stroke)] bg-[var(--card)] p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                Section
              </p>
              <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
                {label}
              </h1>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {live
                  ? meta?.hint || "Meaning + example · report at " + ROUND_SIZE
                  : "This module is locked for the next release"}
              </p>
            </div>
            <span
              className="shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide"
              style={{
                background: live ? `${meta?.color}22` : "var(--surface)",
                color: live ? meta?.color : "var(--muted)",
              }}
            >
              {live ? "Live" : "Soon"}
            </span>
          </div>
        </div>

        {live ? (
          <CardDeck
            words={words}
            sessionSize={Math.min(ROUND_SIZE, Math.max(words.length, 1))}
            title={`${label} report`}
          />
        ) : (
          <ComingSoonCard label={label} />
        )}
      </div>
    </RequireAuth>
  );
}

function ComingSoonCard({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[28px] border border-[var(--stroke)] bg-[var(--card)] p-8 text-center shadow-[var(--shadow-card)]"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[var(--teal-soft)] blur-2xl" />
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--stroke)] bg-[var(--surface)] text-2xl">
        ⏳
      </div>
      <h2 className="mt-5 font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
        {label} — Coming soon
      </h2>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[var(--muted)]">
        We&apos;re shipping Synonyms, Antonyms, Phrasal Verbs, Idioms & Spellings
        first. This section unlocks in the next drop.
      </p>
      <div className="mt-6 flex flex-col gap-2">
        <Link
          href="/category/SYNONYMS"
          onClick={() => unlockAudio()}
          className="flex h-12 items-center justify-center rounded-2xl bg-[var(--teal)] text-sm font-bold text-[var(--on-teal)] active:scale-[0.99]"
        >
          Practice Synonyms
        </Link>
        <Link
          href="/home"
          className="flex h-12 items-center justify-center rounded-2xl border border-[var(--stroke)] text-sm font-semibold text-[var(--ink)]"
        >
          Back to sections
        </Link>
      </div>
    </motion.div>
  );
}

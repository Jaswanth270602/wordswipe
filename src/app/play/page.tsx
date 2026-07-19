"use client";

import Link from "next/link";
import { useMemo } from "react";
import { LevelGrid } from "@/components/LevelGrid";
import { CardDeck } from "@/components/CardDeck";
import { RequireAuth } from "@/components/RequireAuth";
import { ROUND_SIZE } from "@/lib/constants";
import { WORDS } from "@/data/words";
import { LIVE_CATEGORY_KEYS } from "@/lib/sections";

export default function PlayIndexPage() {
  const liveWords = useMemo(
    () => WORDS.filter((w) => LIVE_CATEGORY_KEYS.has(w.category)),
    []
  );

  return (
    <RequireAuth>
      <div className="space-y-8">
        <div className="rounded-[24px] border border-[var(--stroke)] bg-[var(--card)] p-4 shadow-[var(--shadow-card)]">
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
            Study · swipe
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Live: Syn · Ant · PV · Idioms · Spellings · report every {ROUND_SIZE}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              ["Synonyms", "/category/SYNONYMS"],
              ["Antonyms", "/category/ANTONYMS"],
              ["Phrasal", "/category/PHRASAL_VERBS"],
              ["Idioms", "/category/IDIOMS"],
              ["Spellings", "/category/SPELLINGS"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-full border border-[var(--stroke)] bg-[var(--surface)] px-3 py-1.5 text-[11px] font-semibold text-[var(--ink)]"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <CardDeck
          words={liveWords}
          sessionSize={ROUND_SIZE}
          title="Mixed round report"
        />

        <div>
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-lg text-[var(--ink)]">
            Or pick a level
          </h2>
          <LevelGrid />
          <p className="mt-4 text-center text-sm text-[var(--muted)]">
            Prefer today&apos;s set?{" "}
            <Link href="/daily" className="font-semibold text-[var(--teal)]">
              Daily Challenge
            </Link>
          </p>
        </div>
      </div>
    </RequireAuth>
  );
}

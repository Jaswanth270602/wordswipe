"use client";

import { LevelGrid } from "@/components/LevelGrid";
import { CardDeck } from "@/components/CardDeck";
import { ROUND_SIZE } from "@/lib/constants";
import { WORDS } from "@/data/words";
import Link from "next/link";

export default function PlayIndexPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          Mixed swipe
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          All sections · same card format · report every {ROUND_SIZE} · or jump
          via the bottom bar
        </p>
      </div>

      <CardDeck
        words={WORDS}
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
  );
}

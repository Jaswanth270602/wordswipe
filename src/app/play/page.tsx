"use client";

import { LevelGrid } from "@/components/LevelGrid";
import { CardDeck } from "@/components/CardDeck";
import { RequireAuth } from "@/components/RequireAuth";
import { ROUND_SIZE } from "@/lib/constants";
import { WORDS } from "@/data/words";
import Link from "next/link";

export default function PlayIndexPage() {
  return (
    <RequireAuth>
      <div className="space-y-8">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-white">
            Study · swipe
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Scratch → swipe right Got it · left Learn · report every {ROUND_SIZE}
          </p>
        </div>

        <CardDeck
          words={WORDS}
          sessionSize={ROUND_SIZE}
          title="Mixed round report"
        />

        <div>
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-lg text-white">
            Or pick a level
          </h2>
          <LevelGrid />
          <p className="mt-4 text-center text-sm text-slate-500">
            Prefer today&apos;s set?{" "}
            <Link href="/daily" className="font-semibold text-teal-300">
              Daily Challenge
            </Link>
          </p>
        </div>
      </div>
    </RequireAuth>
  );
}

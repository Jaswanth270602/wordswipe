"use client";

import { use, useMemo } from "react";
import { CardDeck } from "@/components/CardDeck";
import { RequireAuth } from "@/components/RequireAuth";
import { ROUND_SIZE } from "@/lib/constants";
import { getWordsByLevel } from "@/data/words";
import { LEVELS } from "@/lib/types";
import Link from "next/link";

export default function PlayLevelPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level: levelStr } = use(params);
  const level = Number(levelStr);
  const meta = LEVELS.find((l) => l.id === level);
  const words = useMemo(
    () => (meta ? getWordsByLevel(level) : []),
    [level, meta]
  );

  if (!meta) {
    return (
      <div className="text-center text-slate-400">
        <p>Level not found.</p>
        <Link href="/play" className="text-teal-300">
          Back
        </Link>
      </div>
    );
  }

  return (
    <RequireAuth>
      <div className="space-y-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Level {meta.id}
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-white">
            {meta.title}
          </h1>
          <p className="text-sm text-slate-400">
            {meta.subtitle} · report after {ROUND_SIZE} · {words.length} cards
          </p>
        </div>
        <CardDeck
          words={words}
          sessionSize={Math.min(ROUND_SIZE, Math.max(words.length, 1))}
          title={`${meta.title} report`}
        />
      </div>
    </RequireAuth>
  );
}

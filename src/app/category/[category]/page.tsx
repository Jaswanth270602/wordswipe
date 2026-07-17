"use client";

import { use, useMemo } from "react";
import { CardDeck } from "@/components/CardDeck";
import { RequireAuth } from "@/components/RequireAuth";
import { ROUND_SIZE } from "@/lib/constants";
import { getWordsByCategory } from "@/data/words";
import { CATEGORY_LABELS, type Category } from "@/lib/types";
import Link from "next/link";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = use(params);
  const cat = category as Category;
  const label = CATEGORY_LABELS[cat];
  const words = useMemo(
    () => (label ? getWordsByCategory(cat) : []),
    [cat, label]
  );

  if (!label) {
    return (
      <div className="text-center text-slate-400">
        <p>Category not found.</p>
        <Link href="/home" className="text-teal-300">
          Home
        </Link>
      </div>
    );
  }

  return (
    <RequireAuth>
      <div className="space-y-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Section
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-white">
            {label}
          </h1>
          <p className="text-sm text-slate-400">
            Meaning + example · report at {ROUND_SIZE}
          </p>
        </div>
        <CardDeck
          words={words}
          sessionSize={Math.min(ROUND_SIZE, Math.max(words.length, 1))}
          title={`${label} report`}
        />
      </div>
    </RequireAuth>
  );
}

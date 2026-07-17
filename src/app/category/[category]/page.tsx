"use client";

import { use, useMemo } from "react";
import { CardDeck } from "@/components/CardDeck";
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
      <div className="text-center">
        <p>Category not found.</p>
        <Link href="/" className="text-[var(--teal)]">
          Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
          Section
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          {label}
        </h1>
        <p className="text-sm text-[var(--muted)]">
          Same format every card · meaning + example · report at {ROUND_SIZE}
        </p>
      </div>
      <CardDeck
        words={words}
        sessionSize={Math.min(ROUND_SIZE, Math.max(words.length, 1))}
        title={`${label} report`}
      />
    </div>
  );
}

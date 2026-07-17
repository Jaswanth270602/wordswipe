"use client";

import Link from "next/link";
import { CATEGORY_LABELS, type Category } from "@/lib/types";
import { sounds } from "@/lib/sounds";

const ORDER: Category[] = [
  "ONE_WORD_SUBSTITUTION",
  "IDIOMS",
  "PHRASAL_VERBS",
  "SYNONYMS",
  "ANTONYMS",
  "CLOZE_TEST",
  "ERROR_SPOTTING",
  "EDITORIAL",
  "PREVIOUS_YEAR",
  "HIGH_FREQUENCY",
];

export function CategoryStrip() {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none">
      {ORDER.map((c) => (
        <Link
          key={c}
          href={`/category/${c}`}
          onClick={() => sounds.tap()}
          className="shrink-0 rounded-full border border-[var(--stroke)] bg-[var(--card)] px-3.5 py-2 text-xs font-semibold text-[var(--ink)] transition active:scale-95"
        >
          {CATEGORY_LABELS[c]}
        </Link>
      ))}
    </div>
  );
}

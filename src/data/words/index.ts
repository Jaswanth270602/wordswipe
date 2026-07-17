import type { Category, WordCard } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { toWordCard } from "./types";
import { HIGH_FREQUENCY } from "./high-frequency";
import { SYNONYMS, ANTONYMS } from "./synonyms-antonyms";
import { IDIOMS, PHRASAL_VERBS } from "./idioms-phrasal";
import { ONE_WORD, CLOZE_EDITORIAL, PREVIOUS_YEAR } from "./one-word-editorial";

/**
 * Modular local word bank.
 * Later: swap `getAllWords()` / `getWordsByCategory()` to fetch from Neon/Postgres.
 */
const LOCAL_BANK: WordCard[] = [
  ...HIGH_FREQUENCY,
  ...SYNONYMS,
  ...ANTONYMS,
  ...IDIOMS,
  ...PHRASAL_VERBS,
  ...ONE_WORD,
  ...CLOZE_EDITORIAL,
  ...PREVIOUS_YEAR,
].map(toWordCard);

export const WORDS: WordCard[] = LOCAL_BANK;

export const SECTION_NAV: {
  key: Category | "HOME" | "DAILY" | "MIX";
  href: string;
  label: string;
  short: string;
}[] = [
  { key: "HOME", href: "/", label: "Home", short: "Home" },
  { key: "MIX", href: "/play", label: "Swipe", short: "Swipe" },
  { key: "IDIOMS", href: "/category/IDIOMS", label: "Idioms", short: "Idiom" },
  {
    key: "SYNONYMS",
    href: "/category/SYNONYMS",
    label: "Synonyms",
    short: "Syn",
  },
  {
    key: "ANTONYMS",
    href: "/category/ANTONYMS",
    label: "Antonyms",
    short: "Ant",
  },
  {
    key: "PHRASAL_VERBS",
    href: "/category/PHRASAL_VERBS",
    label: "Phrasal",
    short: "PV",
  },
  {
    key: "ONE_WORD_SUBSTITUTION",
    href: "/category/ONE_WORD_SUBSTITUTION",
    label: "One Word",
    short: "OWS",
  },
  { key: "DAILY", href: "/daily", label: "Daily", short: "Daily" },
];

export function getWordById(id: string): WordCard | undefined {
  return WORDS.find((w) => w.id === id);
}

export function getWordsByLevel(level: number): WordCard[] {
  return WORDS.filter((w) => w.level === level);
}

export function getWordsByCategory(category: Category): WordCard[] {
  return WORDS.filter((w) => w.category === category);
}

export function getKnownWordCount(
  progress: Record<string, { strength: number }>
): number {
  return Object.values(progress).filter((p) => p.strength >= 60).length;
}

export function getCategoryLabel(category: Category): string {
  return CATEGORY_LABELS[category];
}

/** Future DB hook — keep call sites stable */
export async function fetchWordsFromDb(_opts?: {
  category?: Category;
  level?: number;
  limit?: number;
}): Promise<WordCard[] | null> {
  // Wire to /api/words + Neon later; null means use local bank
  return null;
}

import type { Category, WordCard } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { toWordCard } from "./types";
import { HIGH_FREQUENCY } from "./high-frequency";
import { SYNONYMS, ANTONYMS } from "./synonyms-antonyms";
import { IDIOMS, PHRASAL_VERBS } from "./idioms-phrasal";
import { SPELLINGS } from "./spellings";
import { ONE_WORD, CLOZE_EDITORIAL, PREVIOUS_YEAR } from "./one-word-editorial";

/**
 * Modular local word bank.
 * Live focus: Synonyms, Antonyms, Phrasal Verbs, Idioms, Spellings.
 */
const LOCAL_BANK: WordCard[] = [
  ...SYNONYMS,
  ...ANTONYMS,
  ...PHRASAL_VERBS,
  ...IDIOMS,
  ...SPELLINGS,
  ...HIGH_FREQUENCY,
  ...ONE_WORD,
  ...CLOZE_EDITORIAL,
  ...PREVIOUS_YEAR,
].map(toWordCard);

export const WORDS: WordCard[] = LOCAL_BANK;

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

export async function fetchWordsFromDb(_opts?: {
  category?: Category;
  level?: number;
  limit?: number;
}): Promise<WordCard[] | null> {
  return null;
}

import type { Category, Difficulty, WordCard } from "@/lib/types";

/** Canonical entry — every item MUST include meaning + SSC-style example */
export type WordEntry = {
  id: string;
  word: string;
  meaning: string;
  example: string;
  synonyms?: string[];
  antonyms?: string[];
  /** Origin / etymology story — required for idioms & phrasal verbs */
  origin?: string;
  category: Category;
  level: number;
  difficulty?: Difficulty;
};

export function toWordCard(entry: WordEntry): WordCard {
  return {
    id: entry.id,
    word: entry.word,
    meaning: entry.meaning,
    example: entry.example,
    synonyms: entry.synonyms ?? [],
    antonyms: entry.antonyms ?? [],
    origin: entry.origin,
    category: entry.category,
    level: entry.level,
    difficulty: entry.difficulty ?? "EASY",
    cardTypes: ["MEANING"],
  };
}

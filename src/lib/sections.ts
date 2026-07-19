import type { Category } from "./types";

export type StudySection = {
  key: Category;
  label: string;
  short: string;
  href: string;
  hint: string;
  color: string;
  /** Live playable sections for v1 */
  live: boolean;
};

/** Active first — Syn, Ant, PV, Idioms, Spellings. Rest coming soon. */
export const STUDY_SECTIONS: StudySection[] = [
  {
    key: "SYNONYMS",
    label: "Synonyms",
    short: "Syn",
    href: "/category/SYNONYMS",
    hint: "Near meanings",
    color: "#38bdf8",
    live: true,
  },
  {
    key: "ANTONYMS",
    label: "Antonyms",
    short: "Ant",
    href: "/category/ANTONYMS",
    hint: "Opposites",
    color: "#fb7185",
    live: true,
  },
  {
    key: "PHRASAL_VERBS",
    label: "Phrasal Verbs",
    short: "PV",
    href: "/category/PHRASAL_VERBS",
    hint: "Verb + particle",
    color: "#a78bfa",
    live: true,
  },
  {
    key: "IDIOMS",
    label: "Idioms",
    short: "Idiom",
    href: "/category/IDIOMS",
    hint: "With origin story",
    color: "#2dd4bf",
    live: true,
  },
  {
    key: "SPELLINGS",
    label: "Spellings",
    short: "Spel",
    href: "/category/SPELLINGS",
    hint: "Confusable words",
    color: "#fbbf24",
    live: true,
  },
  {
    key: "ONE_WORD_SUBSTITUTION",
    label: "One Word",
    short: "OWS",
    href: "/category/ONE_WORD_SUBSTITUTION",
    hint: "Coming soon",
    color: "#94a3b8",
    live: false,
  },
  {
    key: "CLOZE_TEST",
    label: "Cloze",
    short: "Cloze",
    href: "/category/CLOZE_TEST",
    hint: "Coming soon",
    color: "#94a3b8",
    live: false,
  },
  {
    key: "EDITORIAL",
    label: "Editorial",
    short: "Edit",
    href: "/category/EDITORIAL",
    hint: "Coming soon",
    color: "#94a3b8",
    live: false,
  },
  {
    key: "PREVIOUS_YEAR",
    label: "Prev Year",
    short: "PYQ",
    href: "/category/PREVIOUS_YEAR",
    hint: "Coming soon",
    color: "#94a3b8",
    live: false,
  },
  {
    key: "HIGH_FREQUENCY",
    label: "High Freq",
    short: "HF",
    href: "/category/HIGH_FREQUENCY",
    hint: "Coming soon",
    color: "#94a3b8",
    live: false,
  },
  {
    key: "ERROR_SPOTTING",
    label: "Error Vocab",
    short: "Err",
    href: "/category/ERROR_SPOTTING",
    hint: "Coming soon",
    color: "#94a3b8",
    live: false,
  },
];

export const LIVE_SECTIONS = STUDY_SECTIONS.filter((s) => s.live);
export const LIVE_CATEGORY_KEYS = new Set(LIVE_SECTIONS.map((s) => s.key));

export function isSectionLive(key: Category): boolean {
  return LIVE_CATEGORY_KEYS.has(key);
}

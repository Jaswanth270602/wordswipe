import type { Category } from "./types";

export type StudySection = {
  key: Category;
  label: string;
  short: string;
  href: string;
  hint: string;
  color: string;
};

/** Radial / side-nav study sections */
export const STUDY_SECTIONS: StudySection[] = [
  {
    key: "IDIOMS",
    label: "Idioms",
    short: "Idiom",
    href: "/category/IDIOMS",
    hint: "Exam idioms",
    color: "#2dd4bf",
  },
  {
    key: "SYNONYMS",
    label: "Synonyms",
    short: "Syn",
    href: "/category/SYNONYMS",
    hint: "Near meanings",
    color: "#38bdf8",
  },
  {
    key: "ANTONYMS",
    label: "Antonyms",
    short: "Ant",
    href: "/category/ANTONYMS",
    hint: "Opposites",
    color: "#fb7185",
  },
  {
    key: "PHRASAL_VERBS",
    label: "Phrasal Verbs",
    short: "PV",
    href: "/category/PHRASAL_VERBS",
    hint: "Verb phrases",
    color: "#a78bfa",
  },
  {
    key: "ONE_WORD_SUBSTITUTION",
    label: "One Word",
    short: "OWS",
    href: "/category/ONE_WORD_SUBSTITUTION",
    hint: "Substitutions",
    color: "#fbbf24",
  },
  {
    key: "CLOZE_TEST",
    label: "Cloze",
    short: "Cloze",
    href: "/category/CLOZE_TEST",
    hint: "Fill sense",
    color: "#34d399",
  },
  {
    key: "EDITORIAL",
    label: "Editorial",
    short: "Edit",
    href: "/category/EDITORIAL",
    hint: "Hard words",
    color: "#f472b6",
  },
  {
    key: "PREVIOUS_YEAR",
    label: "Prev Year",
    short: "PYQ",
    href: "/category/PREVIOUS_YEAR",
    hint: "Exam proven",
    color: "#fb923c",
  },
  {
    key: "HIGH_FREQUENCY",
    label: "High Freq",
    short: "HF",
    href: "/category/HIGH_FREQUENCY",
    hint: "Must know",
    color: "#22d3ee",
  },
  {
    key: "ERROR_SPOTTING",
    label: "Error Vocab",
    short: "Err",
    href: "/category/ERROR_SPOTTING",
    hint: "Trap words",
    color: "#e879f9",
  },
];

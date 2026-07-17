export type Category =
  | "ONE_WORD_SUBSTITUTION"
  | "IDIOMS"
  | "PHRASAL_VERBS"
  | "SYNONYMS"
  | "ANTONYMS"
  | "CLOZE_TEST"
  | "ERROR_SPOTTING"
  | "EDITORIAL"
  | "PREVIOUS_YEAR"
  | "HIGH_FREQUENCY";

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export type CardType =
  | "MEANING"
  | "EXAMPLE"
  | "SYNONYM"
  | "ANTONYM"
  | "FILL_BLANK";

export type Rating = "EASY" | "SOMEWHAT" | "HARD" | "NEW";

export interface WordCard {
  id: string;
  word: string;
  meaning: string;
  example: string;
  synonyms: string[];
  antonyms: string[];
  blankSentence?: string;
  blankAnswer?: string;
  category: Category;
  level: number;
  difficulty: Difficulty;
  cardTypes: CardType[];
}

export interface WordProgressLocal {
  wordId: string;
  rating: Rating;
  strength: number;
  interval: number;
  repetitions: number;
  easeFactor: number;
  nextReviewAt: string;
  knownCount: number;
  unknownCount: number;
  lastRating: Rating | null;
}

export interface DailyStatLocal {
  date: string;
  wordsLearned: number;
  accuracy: number;
}

export interface SessionReport {
  known: number;
  unknown: number;
  accuracy: number;
  cardsPlayed: number;
  ratings: Record<Rating, number>;
}

export interface UserProfile {
  id: string;
  name: string;
  avatarColor: string;
  streak: number;
  lastPlayedAt: string | null;
  unlockedLevels: number[];
}

export interface AppState {
  profile: UserProfile;
  progress: Record<string, WordProgressLocal>;
  dailyStats: DailyStatLocal[];
  session: SessionReport | null;
  sessionQueue: string[];
  dirty: boolean;
  lastSavedAt: string | null;
}

export interface LevelConfig {
  id: number;
  title: string;
  subtitle: string;
  wordCount: number;
  unlockAt: number;
  color: string;
}

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    title: "Foundation",
    subtitle: "100 Easy Words",
    wordCount: 100,
    unlockAt: 0,
    color: "#0F766E",
  },
  {
    id: 2,
    title: "High Frequency",
    subtitle: "SSC favourites",
    wordCount: 120,
    unlockAt: 60,
    color: "#0369A1",
  },
  {
    id: 3,
    title: "Previous Year",
    subtitle: "Exam-proven vocabulary",
    wordCount: 100,
    unlockAt: 140,
    color: "#B45309",
  },
  {
    id: 4,
    title: "Editorial",
    subtitle: "Newspaper-grade words",
    wordCount: 80,
    unlockAt: 220,
    color: "#7C2D12",
  },
  {
    id: 5,
    title: "Difficult",
    subtitle: "Elite challenge set",
    wordCount: 80,
    unlockAt: 300,
    color: "#9F1239",
  },
];

export const CATEGORY_LABELS: Record<Category, string> = {
  ONE_WORD_SUBSTITUTION: "One Word Substitution",
  IDIOMS: "Idioms",
  PHRASAL_VERBS: "Phrasal Verbs",
  SYNONYMS: "Synonyms",
  ANTONYMS: "Antonyms",
  CLOZE_TEST: "Cloze Test",
  ERROR_SPOTTING: "Error Spotting Vocab",
  EDITORIAL: "Editorial Vocabulary",
  PREVIOUS_YEAR: "Previous Year",
  HIGH_FREQUENCY: "High Frequency",
};

export const RATING_META: Record<
  Rating,
  { label: string; hint: string; color: string; emoji: string }
> = {
  EASY: {
    label: "Easy",
    hint: "I know it well",
    color: "#16A34A",
    emoji: "🟢",
  },
  SOMEWHAT: {
    label: "Somewhat",
    hint: "Recognized, not confident",
    color: "#CA8A04",
    emoji: "🟡",
  },
  HARD: {
    label: "Hard",
    hint: "I struggled",
    color: "#EA580C",
    emoji: "🟠",
  },
  NEW: {
    label: "New",
    hint: "Never seen this",
    color: "#DC2626",
    emoji: "🔴",
  },
};

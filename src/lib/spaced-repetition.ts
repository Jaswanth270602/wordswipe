import type { Rating, WordProgressLocal } from "./types";

/** SM-2 inspired intervals tuned for swipe sessions (in minutes / days) */
const INTERVALS: Record<Rating, { cards?: number; days?: number }> = {
  NEW: { cards: 1 },
  HARD: { cards: 5 },
  SOMEWHAT: { cards: 20 },
  EASY: { days: 3 },
};

const STRENGTH_DELTA: Record<Rating, number> = {
  EASY: 18,
  SOMEWHAT: 8,
  HARD: -12,
  NEW: -20,
};

export function createDefaultProgress(wordId: string): WordProgressLocal {
  return {
    wordId,
    rating: "NEW",
    strength: 0,
    interval: 0,
    repetitions: 0,
    easeFactor: 2.5,
    nextReviewAt: new Date().toISOString(),
    knownCount: 0,
    unknownCount: 0,
    lastRating: null,
  };
}

export function applyRating(
  prev: WordProgressLocal | undefined,
  wordId: string,
  rating: Rating,
  queuePosition: number
): WordProgressLocal {
  const current = prev ?? createDefaultProgress(wordId);
  const strength = Math.max(
    0,
    Math.min(100, current.strength + STRENGTH_DELTA[rating])
  );

  let easeFactor = current.easeFactor;
  if (rating === "EASY") easeFactor = Math.min(3.0, easeFactor + 0.1);
  if (rating === "HARD") easeFactor = Math.max(1.3, easeFactor - 0.15);
  if (rating === "NEW") easeFactor = Math.max(1.3, easeFactor - 0.2);

  const repetitions =
    rating === "EASY" || rating === "SOMEWHAT"
      ? current.repetitions + 1
      : 0;

  const schedule = INTERVALS[rating];
  let nextReviewAt: Date;

  if (schedule.cards != null) {
    // Re-queue after N cards in the same session; also set a short clock fallback
    const minutes = schedule.cards * 2;
    nextReviewAt = new Date(Date.now() + minutes * 60_000);
    // Encode card offset for session scheduler via interval field (negative = cards)
    return {
      ...current,
      rating,
      strength,
      easeFactor,
      repetitions,
      interval: -schedule.cards,
      nextReviewAt: nextReviewAt.toISOString(),
      knownCount:
        rating === "EASY" || rating === "SOMEWHAT"
          ? current.knownCount + 1
          : current.knownCount,
      unknownCount:
        rating === "HARD" || rating === "NEW"
          ? current.unknownCount + 1
          : current.unknownCount,
      lastRating: rating,
      // stash reinsert offset for the session engine
      _reinsertAfter: schedule.cards + queuePosition,
    } as WordProgressLocal & { _reinsertAfter?: number };
  }

  const days =
    rating === "EASY"
      ? Math.max(3, Math.round(current.interval * easeFactor) || 3)
      : schedule.days ?? 1;

  nextReviewAt = new Date(Date.now() + days * 24 * 60 * 60_000);

  return {
    ...current,
    rating,
    strength,
    easeFactor,
    repetitions,
    interval: days,
    nextReviewAt: nextReviewAt.toISOString(),
    knownCount:
      rating === "EASY" || rating === "SOMEWHAT"
        ? current.knownCount + 1
        : current.knownCount,
    unknownCount:
      rating === "HARD" || rating === "NEW"
        ? current.unknownCount + 1
        : current.unknownCount,
    lastRating: rating,
  };
}

export function isDue(progress: WordProgressLocal | undefined): boolean {
  if (!progress) return true;
  return new Date(progress.nextReviewAt).getTime() <= Date.now();
}

export function isKnown(progress: WordProgressLocal | undefined): boolean {
  return (progress?.strength ?? 0) >= 60;
}

export function getReinsertOffset(
  progress: WordProgressLocal & { _reinsertAfter?: number }
): number | null {
  if (progress.interval < 0) return Math.abs(progress.interval);
  return null;
}

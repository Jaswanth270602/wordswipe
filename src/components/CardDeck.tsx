"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { Rating, WordCard } from "@/lib/types";
import { ROUND_SIZE } from "@/lib/constants";
import { WordSwipeCard } from "./WordSwipeCard";
import { SessionReportView } from "./SessionReport";
import { useAppStore, getProgressOrDefault } from "@/lib/store";
import { getReinsertOffset } from "@/lib/spaced-repetition";
import type { WordProgressLocal } from "@/lib/types";

export { ROUND_SIZE };

interface CardDeckProps {
  words: WordCard[];
  sessionSize?: number;
  title?: string;
}

function buildQueue(words: WordCard[], size: number, progressMap: Record<string, { nextReviewAt: string }>) {
  const shuffled = [...words].sort(() => Math.random() - 0.5);
  shuffled.sort((a, b) => {
    const pa = progressMap[a.id];
    const pb = progressMap[b.id];
    const da = pa ? new Date(pa.nextReviewAt).getTime() : 0;
    const db = pb ? new Date(pb.nextReviewAt).getTime() : 0;
    return da - db;
  });
  return shuffled.slice(0, Math.max(1, Math.min(size, shuffled.length || 1)));
}

export function CardDeck({
  words,
  sessionSize = ROUND_SIZE,
  title,
}: CardDeckProps) {
  const rateWord = useAppStore((s) => s.rateWord);
  const startSession = useAppStore((s) => s.startSession);
  const resetSession = useAppStore((s) => s.resetSession);
  const session = useAppStore((s) => s.session);
  const progressMap = useAppStore((s) => s.progress);

  const wordKey = useMemo(
    () => words.map((w) => w.id).join("|"),
    [words]
  );

  const [queue, setQueue] = useState<WordCard[]>([]);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [playedInRound, setPlayedInRound] = useState(0);
  const started = useRef(false);

  // Init / reset when word set or round size changes — once per key
  useEffect(() => {
    started.current = true;
    const next = buildQueue(words, sessionSize, progressMap);
    setQueue(next);
    setPlayedInRound(0);
    setDone(false);
    setReady(true);
    startSession();
    // intentionally omit progressMap — only reshuffle on section change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordKey, sessionSize]);

  const visible = useMemo(() => queue.slice(0, 2), [queue]);

  const finishRound = useCallback(() => {
    setQueue([]);
    setDone(true);
  }, []);

  const handleRate = useCallback(
    (word: WordCard, rating: Rating) => {
      const updated = rateWord(
        word.id,
        rating,
        queue.length
      ) as WordProgressLocal & { _reinsertAfter?: number };

      const nextPlayed = playedInRound + 1;
      setPlayedInRound(nextPlayed);

      // Hard stop after sessionSize ratings — show report (no mid-round popup)
      if (nextPlayed >= sessionSize) {
        finishRound();
        return;
      }

      const offset = getReinsertOffset(updated);
      const shouldReinsert =
        offset != null &&
        (rating === "NEW" || rating === "HARD" || rating === "SOMEWHAT");

      setQueue((prev) => {
        const rest = prev.slice(1);
        if (shouldReinsert && offset != null && rest.length > 0) {
          const insertAt = Math.min(offset, rest.length);
          const next = [...rest];
          next.splice(insertAt, 0, word);
          return next;
        }
        if (rest.length === 0) {
          // bank exhausted early — end round
          queueMicrotask(() => finishRound());
          return rest;
        }
        return rest;
      });
    },
    [
      finishRound,
      playedInRound,
      queue.length,
      rateWord,
      sessionSize,
    ]
  );

  if (!ready) {
    return (
      <div className="flex h-[420px] items-center justify-center text-sm text-[var(--muted)]">
        Loading cards…
      </div>
    );
  }

  if (done && session) {
    return (
      <SessionReportView
        report={session}
        title={title}
        onContinue={() => {
          resetSession();
          const reshuffled = buildQueue(words, sessionSize, progressMap);
          setQueue(reshuffled);
          setPlayedInRound(0);
          setDone(false);
          startSession();
        }}
      />
    );
  }

  if (!queue.length) {
    return (
      <div className="rounded-3xl border border-[var(--stroke)] bg-[var(--card)] p-8 text-center">
        <p className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
          No cards in this set yet
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Pick another section from the bottom bar.
        </p>
      </div>
    );
  }

  const progressPct = Math.min(
    100,
    Math.round((playedInRound / sessionSize) * 100)
  );

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-4 px-1">
        <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
          <span>
            Card {Math.min(playedInRound + 1, sessionSize)} of {sessionSize}
          </span>
          <span>{sessionSize - playedInRound} left</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-[var(--track)]">
          <div
            className="h-full rounded-full bg-[var(--teal)] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="relative h-[580px] w-full">
        <AnimatePresence initial={false}>
          {visible.map((word, i) => (
            <WordSwipeCard
              key={word.id}
              word={word}
              progress={getProgressOrDefault(progressMap, word.id)}
              index={i}
              onRate={(rating) => handleRate(word, rating)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

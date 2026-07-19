"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
} from "framer-motion";
import type { Rating, WordCard, WordProgressLocal } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { ScratchReveal } from "./ScratchReveal";
import { sounds, unlockAudio } from "@/lib/sounds";

interface WordSwipeCardProps {
  word: WordCard;
  progress: WordProgressLocal;
  onRate: (rating: Rating) => void;
  index: number;
}

const EXIT_X = 520;

export function WordSwipeCard({
  word,
  progress,
  onRate,
  index,
}: WordSwipeCardProps) {
  const [revealed, setRevealed] = useState(false);
  const exiting = useRef(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-240, 240], [-16, 16]);
  const knowOpacity = useTransform(x, [40, 140], [0, 1]);
  const learnOpacity = useTransform(x, [-140, -40], [1, 0]);
  const glowRight = useTransform(x, [20, 160], [0, 1]);
  const glowLeft = useTransform(x, [-160, -20], [1, 0]);

  const flyOut = (dir: 1 | -1, rating: Rating) => {
    if (exiting.current || index !== 0) return;
    exiting.current = true;
    animate(x, dir * EXIT_X, {
      type: "spring",
      stiffness: 340,
      damping: 28,
      velocity: dir * 900,
    }).then(() => onRate(rating));
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (!revealed || exiting.current) {
      animate(x, 0, { type: "spring", stiffness: 520, damping: 34 });
      return;
    }
    const dx = info.offset.x;
    const vx = info.velocity.x;
    if (dx > 90 || vx > 600) flyOut(1, "EASY");
    else if (dx < -90 || vx < -600) flyOut(-1, "HARD");
    else animate(x, 0, { type: "spring", stiffness: 520, damping: 34 });
  };

  const stackScale = 1 - index * 0.045;
  const showOrigin =
    !!word.origin &&
    (word.category === "IDIOMS" || word.category === "PHRASAL_VERBS");

  return (
    <motion.div
      className="absolute inset-0"
      style={{ x, rotate, zIndex: 20 - index }}
      drag={revealed && index === 0 ? "x" : false}
      dragElastic={0.14}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: stackScale * 0.96, opacity: 0, y: 24 + index * 14 }}
      animate={{ scale: stackScale, opacity: 1, y: index * 14 }}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
      transition={{ type: "spring", stiffness: 400, damping: 34 }}
    >
      <motion.div
        style={{ opacity: glowRight }}
        className="pointer-events-none absolute -inset-2 rounded-[32px] bg-gradient-to-r from-transparent via-[var(--teal)]/15 to-[var(--teal)]/35 blur-[2px]"
      />
      <motion.div
        style={{ opacity: glowLeft }}
        className="pointer-events-none absolute -inset-2 rounded-[32px] bg-gradient-to-l from-transparent via-[var(--coral)]/15 to-[var(--coral)]/35 blur-[2px]"
      />

      <article className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-[var(--stroke)] bg-[var(--card)] p-5 shadow-[var(--shadow-card)]">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[var(--teal)] via-sky-400 to-[var(--coral)]" />

        <motion.div
          style={{ opacity: knowOpacity }}
          className="pointer-events-none absolute left-5 top-16 z-30 -rotate-12 rounded-xl border-2 border-[var(--teal)] px-3 py-1.5 text-sm font-black tracking-widest text-[var(--teal)]"
        >
          GOT IT
        </motion.div>
        <motion.div
          style={{ opacity: learnOpacity }}
          className="pointer-events-none absolute right-5 top-16 z-30 rotate-12 rounded-xl border-2 border-[var(--coral)] px-3 py-1.5 text-sm font-black tracking-widest text-[var(--coral)]"
        >
          LEARN
        </motion.div>

        <div className="mb-3 flex items-start justify-between gap-3 pt-1">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              {CATEGORY_LABELS[word.category]} · L{word.level}
            </p>
            <h2 className="mt-1.5 font-[family-name:var(--font-display)] text-[1.75rem] leading-[1.1] tracking-tight text-[var(--ink)]">
              {word.word}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Pronounce word"
            onPointerDown={() => unlockAudio()}
            onClick={(e) => {
              e.stopPropagation();
              unlockAudio();
              sounds.speak(word.word);
            }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--stroke)] bg-[var(--teal-soft)] text-[var(--teal)] transition active:scale-95"
          >
            <SpeakerIcon />
          </button>
        </div>

        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
            <span>Memory</span>
            <span className="text-[var(--ink)]">{progress.strength}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--track)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--teal-deep)] to-[var(--teal)] transition-all duration-300"
              style={{ width: `${progress.strength}%` }}
            />
          </div>
        </div>

        <div className="relative mb-3 min-h-[210px] flex-1 overflow-hidden">
          <ScratchReveal
            label="Scratch to reveal"
            onReveal={() => setRevealed(true)}
            className="max-h-full min-h-[210px] overflow-y-auto border border-[var(--stroke)]"
          >
            <div className="space-y-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                  {word.category === "SPELLINGS" ? "Correct form" : "Meaning"}
                </p>
                <p className="mt-1 text-[15px] leading-relaxed text-[var(--ink)]">
                  {word.meaning}
                </p>
              </div>
              <div className="rounded-2xl bg-[var(--surface)] px-3 py-2.5">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                  Example
                </p>
                <p className="mt-1 text-[14px] leading-relaxed text-[var(--ink)]">
                  {word.example}
                </p>
              </div>
              {showOrigin && (
                <div className="rounded-2xl border border-[var(--amber)]/25 bg-[var(--amber-soft)] px-3 py-2.5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--amber-deep)]">
                    Origin · remember this
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-[var(--ink)]">
                    {word.origin}
                  </p>
                </div>
              )}
              {word.synonyms.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                    Synonyms
                  </p>
                  <p className="mt-1 text-sm capitalize text-[var(--teal)]">
                    {word.synonyms.join(" · ")}
                  </p>
                </div>
              )}
              {word.antonyms.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                    Antonyms
                  </p>
                  <p className="mt-1 text-sm capitalize text-[var(--coral)]">
                    {word.antonyms.join(" · ")}
                  </p>
                </div>
              )}
            </div>
          </ScratchReveal>
        </div>

        <div className="mt-auto flex items-center justify-center gap-6 pt-1">
          <div className="flex flex-col items-center gap-1 opacity-80">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--coral)]/40 text-[var(--coral)]">
              ←
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--coral)]">
              Learn
            </span>
          </div>
          <p className="max-w-[9rem] text-center text-[11px] text-[var(--muted)]">
            {revealed ? "Swipe the card" : "Scratch first"}
          </p>
          <div className="flex flex-col items-center gap-1 opacity-80">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--teal)]/40 text-[var(--teal)]">
              →
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--teal)]">
              Got it
            </span>
          </div>
        </div>
      </article>
    </motion.div>
  );
}

function SpeakerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M11 5L6 9H3v6h3l5 4V5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 8.5a5 5 0 010 7M18.5 6a9 9 0 010 12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

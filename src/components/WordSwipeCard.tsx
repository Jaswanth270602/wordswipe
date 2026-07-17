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
import { CATEGORY_LABELS, RATING_META } from "@/lib/types";
import { ScratchReveal } from "./ScratchReveal";
import { sounds } from "@/lib/sounds";
import { cn } from "@/lib/utils";

interface WordSwipeCardProps {
  word: WordCard;
  progress: WordProgressLocal;
  onRate: (rating: Rating) => void;
  index: number;
}

const EXIT_X = 480;

export function WordSwipeCard({
  word,
  progress,
  onRate,
  index,
}: WordSwipeCardProps) {
  const [revealed, setRevealed] = useState(false);
  const exiting = useRef(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-14, 14]);
  const glowRight = useTransform(x, [20, 140], [0, 1]);
  const glowLeft = useTransform(x, [-140, -20], [1, 0]);

  const flyOut = (dir: 1 | -1, rating: Rating) => {
    if (exiting.current || index !== 0) return;
    exiting.current = true;
    sounds.rate(rating);
    animate(x, dir * EXIT_X, {
      type: "spring",
      stiffness: 320,
      damping: 28,
      velocity: dir * 800,
    }).then(() => {
      onRate(rating);
    });
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (!revealed || exiting.current) {
      animate(x, 0, { type: "spring", stiffness: 500, damping: 32 });
      return;
    }
    const dx = info.offset.x;
    const vx = info.velocity.x;
    if (dx > 100 || vx > 650) flyOut(1, "EASY");
    else if (dx < -100 || vx < -650) flyOut(-1, "HARD");
    else animate(x, 0, { type: "spring", stiffness: 500, damping: 32 });
  };

  const stackScale = 1 - index * 0.04;

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        x,
        rotate,
        zIndex: 20 - index,
      }}
      drag={revealed && index === 0 ? "x" : false}
      dragListener={revealed && index === 0}
      dragElastic={0.16}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: stackScale * 0.96, opacity: 0, y: 20 + index * 12 }}
      animate={{ scale: stackScale, opacity: 1, y: index * 12 }}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
    >
      <motion.div
        style={{ opacity: glowRight }}
        className="pointer-events-none absolute -inset-1 rounded-[32px] bg-gradient-to-r from-transparent to-emerald-400/30"
      />
      <motion.div
        style={{ opacity: glowLeft }}
        className="pointer-events-none absolute -inset-1 rounded-[32px] bg-gradient-to-l from-transparent to-rose-400/30"
      />

      <article className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/70 bg-[var(--card)] p-5 shadow-[0_28px_60px_-28px_rgba(15,61,46,0.55)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--teal)] via-teal-300 to-[var(--coral)] opacity-80" />

        <div className="mb-4 flex items-start justify-between gap-3 pt-1">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              {CATEGORY_LABELS[word.category]} · L{word.level}
            </p>
            <h2 className="mt-1.5 font-[family-name:var(--font-display)] text-[1.9rem] leading-[1.1] tracking-tight text-[var(--ink)]">
              {word.word}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Pronounce"
            onClick={() => {
              sounds.tap();
              sounds.speak(word.word);
            }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--teal-soft)] text-lg text-[var(--teal)] transition active:scale-95"
          >
            🔊
          </button>
        </div>

        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
            <span>Memory</span>
            <span className="text-[var(--ink)]">{progress.strength}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--track)]">
            <div
              className="h-full rounded-full bg-[var(--teal)] transition-all duration-300"
              style={{ width: `${progress.strength}%` }}
            />
          </div>
        </div>

        <div className="relative mb-4 min-h-[200px] flex-1">
          <ScratchReveal
            label="Scratch to reveal"
            onReveal={() => setRevealed(true)}
            className="min-h-[200px]"
          >
            <div className="space-y-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                  Meaning
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
              {word.synonyms.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                    Synonyms
                  </p>
                  <p className="mt-1 text-sm capitalize text-[var(--teal-deep)]">
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

        <p className="mb-3 text-center text-[11px] text-[var(--muted)]">
          {revealed
            ? "Swipe or tap a rating"
            : "Scratch first — then swipe"}
        </p>

        <div className="grid grid-cols-4 gap-2">
          {(Object.keys(RATING_META) as Rating[]).map((r) => {
            const meta = RATING_META[r];
            return (
              <button
                key={r}
                type="button"
                disabled={!revealed}
                onClick={() => {
                  const dir = r === "EASY" || r === "SOMEWHAT" ? 1 : -1;
                  flyOut(dir as 1 | -1, r);
                }}
                className={cn(
                  "flex flex-col items-center rounded-2xl border border-[var(--stroke)] bg-[var(--surface)] px-1 py-2.5 transition active:scale-95 disabled:opacity-35"
                )}
                style={{
                  boxShadow: revealed
                    ? `inset 0 -2px 0 ${meta.color}`
                    : undefined,
                }}
              >
                <span className="text-sm">{meta.emoji}</span>
                <span
                  className="mt-0.5 text-[10px] font-bold uppercase tracking-wide"
                  style={{ color: meta.color }}
                >
                  {meta.label}
                </span>
              </button>
            );
          })}
        </div>
      </article>
    </motion.div>
  );
}

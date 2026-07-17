"use client";

import { motion } from "framer-motion";
import type { SessionReport } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { formatDateLabel } from "@/lib/utils";
import Link from "next/link";

interface SessionReportViewProps {
  report: SessionReport;
  title?: string;
  onContinue: () => void;
}

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="h-3 flex-1 overflow-hidden rounded-full bg-[var(--track)]">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <span className="w-6 text-right text-sm font-bold text-[var(--ink)]">
        {value}
      </span>
    </div>
  );
}

export function SessionReportView({
  report,
  title,
  onContinue,
}: SessionReportViewProps) {
  const streak = useAppStore((s) => s.profile.streak);
  const dailyStats = useAppStore((s) => s.dailyStats);
  const recent = [...dailyStats].slice(-7);

  let badge = "Keep going";
  if (report.accuracy >= 100) badge = "⭐⭐⭐ Gold";
  else if (report.accuracy >= 90) badge = "⭐⭐ Silver";
  else if (report.accuracy >= 80) badge = "⭐ Bronze";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-md rounded-[28px] border border-[var(--stroke)] bg-[var(--card)] p-6 shadow-[0_20px_50px_-24px_rgba(15,61,46,0.4)]"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
        After {report.cardsPlayed} cards
      </p>
      <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
        {title || "Session report"}
      </h2>
      <p className="mt-1 text-sm text-[var(--amber-deep)]">{badge}</p>

      <div className="mt-6 space-y-4">
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-[var(--muted)]">Known</span>
          </div>
          <Bar value={report.known} max={report.cardsPlayed} color="#0F766E" />
        </div>
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-[var(--muted)]">Unknown</span>
          </div>
          <Bar value={report.unknown} max={report.cardsPlayed} color="#EA580C" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-[var(--teal-soft)] p-4">
          <p className="text-xs text-[var(--muted)]">Accuracy</p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-3xl text-[var(--teal-deep)]">
            {report.accuracy}%
          </p>
        </div>
        <div className="rounded-2xl bg-[var(--amber-soft)] p-4">
          <p className="text-xs text-[var(--muted)]">Daily streak</p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-3xl text-[var(--amber-deep)]">
            🔥 {streak}
          </p>
        </div>
      </div>

      {recent.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-semibold text-[var(--ink)]">Words learned</p>
          <ul className="mt-3 space-y-2">
            {recent.map((d) => (
              <li
                key={d.date}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-[var(--muted)]">
                  {formatDateLabel(d.date)}
                </span>
                <span className="font-semibold text-[var(--ink)]">
                  {d.wordsLearned}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-2">
        <button
          type="button"
          onClick={onContinue}
          className="h-12 rounded-2xl bg-[var(--teal)] font-semibold text-white transition active:scale-[0.98]"
        >
          Play another round
        </button>
        <Link
          href="/"
          className="flex h-12 items-center justify-center rounded-2xl border border-[var(--stroke)] font-semibold text-[var(--ink)]"
        >
          Back home
        </Link>
      </div>
    </motion.div>
  );
}

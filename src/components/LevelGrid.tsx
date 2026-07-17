"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LEVELS } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { getKnownWordCount } from "@/data/words";
import { sounds } from "@/lib/sounds";

export function LevelGrid() {
  const hydrated = useHydrated();
  const progress = useAppStore((s) => s.progress);
  const known = hydrated ? getKnownWordCount(progress) : 0;

  return (
    <div className="grid gap-3">
      {LEVELS.map((level, i) => {
        const unlocked = known >= level.unlockAt || level.id === 1;
        return (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            {unlocked ? (
              <Link
                href={`/play/${level.id}`}
                onClick={() => sounds.tap()}
                className="block rounded-3xl border border-[var(--stroke)] bg-[var(--card)] p-4 transition active:scale-[0.99]"
                style={{
                  boxShadow: `inset 4px 0 0 ${level.color}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                      Level {level.id}
                    </p>
                    <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
                      {level.title}
                    </h3>
                    <p className="mt-0.5 text-sm text-[var(--muted)]">
                      {level.subtitle}
                    </p>
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-bold text-white"
                    style={{ background: level.color }}
                  >
                    Play
                  </span>
                </div>
              </Link>
            ) : (
              <div className="rounded-3xl border border-dashed border-[var(--stroke)] bg-[var(--surface)]/60 p-4 opacity-70">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                      Level {level.id} · Locked
                    </p>
                    <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
                      {level.title}
                    </h3>
                    <p className="mt-0.5 text-sm text-[var(--muted)]">
                      Know {level.unlockAt} words to unlock · you have {known}
                    </p>
                  </div>
                  <span className="text-lg">🔒</span>
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

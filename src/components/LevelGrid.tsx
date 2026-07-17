"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LEVELS } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { getKnownWordCount } from "@/data/words";
import { unlockAudio } from "@/lib/sounds";

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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            {unlocked ? (
              <Link
                href={`/play/${level.id}`}
                onClick={() => unlockAudio()}
                className="block rounded-3xl border border-white/10 bg-[#111827] p-4 transition active:scale-[0.99]"
                style={{ boxShadow: `inset 3px 0 0 ${level.color}` }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                      Level {level.id}
                    </p>
                    <h3 className="font-[family-name:var(--font-display)] text-lg text-white">
                      {level.title}
                    </h3>
                    <p className="mt-0.5 text-sm text-slate-400">
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
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-4 opacity-60">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  Level {level.id} · Locked
                </p>
                <h3 className="font-[family-name:var(--font-display)] text-lg text-slate-300">
                  {level.title}
                </h3>
                <p className="mt-0.5 text-sm text-slate-500">
                  Know {level.unlockAt} · you have {known}
                </p>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

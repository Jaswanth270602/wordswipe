"use client";

import { RequireAuth } from "@/components/RequireAuth";
import { useAppStore } from "@/lib/store";
import { getKnownWordCount } from "@/data/words";
import { motion } from "framer-motion";

const MOCK_FRIENDS = [
  { name: "Ananya", known: 142, college: "DU" },
  { name: "Rohit", known: 118, college: "JNU" },
  { name: "Sneha", known: 96, college: "BHU" },
  { name: "Vikram", known: 88, college: "AU" },
];

export default function LeaderboardPage() {
  const profile = useAppStore((s) => s.profile);
  const known = getKnownWordCount(useAppStore((s) => s.progress));

  const rows = [
    ...MOCK_FRIENDS,
    { name: (profile.name || "You") + " (you)", known, college: "You" },
  ].sort((a, b) => b.known - a.known);

  return (
    <RequireAuth>
      <div className="space-y-6">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-white">
            Leaderboard
          </h1>
          <p className="text-sm text-slate-400">
            Friends · College · India · Weekly
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {["Friends", "College", "India", "Weekly"].map((tab, i) => (
            <span
              key={tab}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${
                i === 0
                  ? "bg-teal-400 text-[#070b14]"
                  : "border border-white/10 bg-white/5 text-slate-400"
              }`}
            >
              {tab}
            </span>
          ))}
        </div>

        <ol className="space-y-2">
          {rows.map((row, i) => (
            <motion.li
              key={row.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-3 rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 ${
                row.college === "You" ? "ring-1 ring-teal-400/50" : ""
              }`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-sm font-bold text-slate-300">
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{row.name}</p>
                <p className="text-[11px] text-slate-500">{row.college}</p>
              </div>
              <span className="text-sm font-bold text-teal-300">
                {row.known} known
              </span>
            </motion.li>
          ))}
        </ol>
      </div>
    </RequireAuth>
  );
}

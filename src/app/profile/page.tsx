"use client";

import { useState } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { useAppStore } from "@/lib/store";
import { getWordById, getKnownWordCount, WORDS } from "@/data/words";
import { formatDateLabel, strengthBar } from "@/lib/utils";
import { unlockAudio } from "@/lib/sounds";

export default function ProfilePage() {
  const profile = useAppStore((s) => s.profile);
  const progress = useAppStore((s) => s.progress);
  const dailyStats = useAppStore((s) => s.dailyStats);
  const updateName = useAppStore((s) => s.updateName);
  const dirty = useAppStore((s) => s.dirty);
  const [name, setName] = useState(profile.name);

  const known = getKnownWordCount(progress);
  const weak = Object.values(progress)
    .filter((p) => p.strength < 40)
    .sort((a, b) => a.strength - b.strength)
    .slice(0, 8);

  return (
    <RequireAuth>
      <div className="space-y-6">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-white">
            Profile
          </h1>
          <p className="text-sm text-slate-400">
            {profile.phone ? `+91 ${profile.phone}` : "No phone"} ·{" "}
            {profile.batch || "No batch"}
            {dirty ? " · unsaved" : ""}
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[#111827] p-5">
          <label className="text-xs font-semibold text-slate-400">
            Display name
          </label>
          <div className="mt-2 flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none focus:border-teal-400/50"
            />
            <button
              type="button"
              onClick={() => {
                unlockAudio();
                updateName(name.trim() || "Aspirant");
              }}
              className="h-11 rounded-xl bg-teal-400 px-4 text-sm font-semibold text-[#070b14]"
            >
              Update
            </button>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="font-[family-name:var(--font-display)] text-2xl text-teal-300">
                {known}
              </p>
              <p className="text-[10px] uppercase text-slate-500">Known</p>
            </div>
            <div>
              <p className="font-[family-name:var(--font-display)] text-2xl text-sky-300">
                {Object.keys(progress).length}
              </p>
              <p className="text-[10px] uppercase text-slate-500">Touched</p>
            </div>
            <div>
              <p className="font-[family-name:var(--font-display)] text-2xl text-amber-300">
                🔥{profile.streak}
              </p>
              <p className="text-[10px] uppercase text-slate-500">Streak</p>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-slate-500">
            Bank {WORDS.length} · ID {profile.id}
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[#111827] p-5">
          <h2 className="font-[family-name:var(--font-display)] text-lg text-white">
            Weekly activity
          </h2>
          <ul className="mt-3 space-y-2">
            {dailyStats.length === 0 && (
              <li className="text-sm text-slate-500">Play cards to see stats.</li>
            )}
            {[...dailyStats].slice(-7).map((d) => (
              <li key={d.date} className="flex justify-between text-sm">
                <span className="text-slate-400">{formatDateLabel(d.date)}</span>
                <span className="font-semibold text-white">
                  {d.wordsLearned} · {d.accuracy}%
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[#111827] p-5">
          <h2 className="font-[family-name:var(--font-display)] text-lg text-white">
            Needs review
          </h2>
          <ul className="mt-3 space-y-3">
            {weak.length === 0 && (
              <li className="text-sm text-slate-500">No weak words yet.</li>
            )}
            {weak.map((p) => {
              const w = getWordById(p.wordId);
              if (!w) return null;
              return (
                <li key={p.wordId}>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-white">{w.word}</span>
                    <span className="text-slate-400">{p.strength}%</span>
                  </div>
                  <p className="font-mono text-xs text-rose-300">
                    {strengthBar(p.strength)}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </RequireAuth>
  );
}

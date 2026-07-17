"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { getWordById, getKnownWordCount, WORDS } from "@/data/words";
import { formatDateLabel, strengthBar } from "@/lib/utils";
import { sounds } from "@/lib/sounds";

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
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          Profile
        </h1>
        <p className="text-sm text-[var(--muted)]">
          Progress lives in localStorage until you hit Save
          {dirty ? " · unsaved changes" : ""}
        </p>
      </div>

      <div className="rounded-3xl border border-[var(--stroke)] bg-[var(--card)] p-5">
        <label className="text-xs font-semibold text-[var(--muted)]">
          Display name
        </label>
        <div className="mt-2 flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 flex-1 rounded-xl border border-[var(--stroke)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--teal)]"
          />
          <button
            type="button"
            onClick={() => {
              sounds.tap();
              updateName(name.trim() || "Aspirant");
            }}
            className="h-11 rounded-xl bg-[var(--teal)] px-4 text-sm font-semibold text-white"
          >
            Update
          </button>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="font-[family-name:var(--font-display)] text-2xl">
              {known}
            </p>
            <p className="text-[10px] uppercase text-[var(--muted)]">Known</p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-display)] text-2xl">
              {Object.keys(progress).length}
            </p>
            <p className="text-[10px] uppercase text-[var(--muted)]">Touched</p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-display)] text-2xl">
              🔥{profile.streak}
            </p>
            <p className="text-[10px] uppercase text-[var(--muted)]">Streak</p>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-[var(--muted)]">
          Bank size {WORDS.length} · ID {profile.id}
        </p>
      </div>

      <div className="rounded-3xl border border-[var(--stroke)] bg-[var(--card)] p-5">
        <h2 className="font-[family-name:var(--font-display)] text-lg">
          Weekly activity
        </h2>
        <ul className="mt-3 space-y-2">
          {dailyStats.length === 0 && (
            <li className="text-sm text-[var(--muted)]">
              Play a few cards to see your chart.
            </li>
          )}
          {[...dailyStats].slice(-7).map((d) => (
            <li key={d.date} className="flex justify-between text-sm">
              <span className="text-[var(--muted)]">
                {formatDateLabel(d.date)}
              </span>
              <span className="font-semibold">
                {d.wordsLearned} words · {d.accuracy}%
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl border border-[var(--stroke)] bg-[var(--card)] p-5">
        <h2 className="font-[family-name:var(--font-display)] text-lg">
          Needs review
        </h2>
        <ul className="mt-3 space-y-3">
          {weak.length === 0 && (
            <li className="text-sm text-[var(--muted)]">
              No weak words yet — keep swiping.
            </li>
          )}
          {weak.map((p) => {
            const w = getWordById(p.wordId);
            if (!w) return null;
            return (
              <li key={p.wordId}>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">{w.word}</span>
                  <span>{p.strength}%</span>
                </div>
                <p className="font-mono text-xs text-[var(--coral)]">
                  {strengthBar(p.strength)}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

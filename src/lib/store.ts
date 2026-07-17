"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AppState,
  Rating,
  SessionReport,
  UserProfile,
  WordProgressLocal,
} from "./types";
import { LEVELS } from "./types";
import { applyRating, createDefaultProgress } from "./spaced-repetition";
import { getKnownWordCount } from "@/data/words";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function defaultProfile(): UserProfile {
  return {
    id: "guest-local",
    name: "",
    phone: "",
    batch: "",
    authenticated: false,
    avatarColor: "#2dd4bf",
    streak: 0,
    lastPlayedAt: null,
    unlockedLevels: [1],
  };
}

function emptySession(): SessionReport {
  return {
    known: 0,
    unknown: 0,
    accuracy: 0,
    cardsPlayed: 0,
    ratings: { EASY: 0, SOMEWHAT: 0, HARD: 0, NEW: 0 },
  };
}

interface Store extends AppState {
  rateWord: (wordId: string, rating: Rating, queuePos: number) => WordProgressLocal;
  startSession: () => void;
  resetSession: () => void;
  updateName: (name: string) => void;
  signIn: (data: { name: string; phone: string; batch: string }) => void;
  markSaved: () => void;
  logoutLocal: () => void;
  getUnlockedLevels: () => number[];
  getStreak: () => number;
}

export const useAppStore = create<Store>()(
  persist(
    (set, get) => ({
      profile: defaultProfile(),
      progress: {},
      dailyStats: [],
      session: null,
      sessionQueue: [],
      dirty: false,
      lastSavedAt: null,

      startSession: () => set({ session: emptySession() }),

      resetSession: () => set({ session: null }),

      rateWord: (wordId, rating, queuePos) => {
        const state = get();
        const updated = applyRating(state.progress[wordId], wordId, rating, queuePos);
        const { _reinsertAfter, ...clean } = updated as WordProgressLocal & {
          _reinsertAfter?: number;
        };
        void _reinsertAfter;

        const session = state.session ?? emptySession();
        const isKnownRating = rating === "EASY" || rating === "SOMEWHAT";
        const known = session.known + (isKnownRating ? 1 : 0);
        const unknown = session.unknown + (isKnownRating ? 0 : 1);
        const cardsPlayed = session.cardsPlayed + 1;
        const ratings = {
          ...session.ratings,
          [rating]: session.ratings[rating] + 1,
        };

        const today = todayKey();
        const dailyStats = [...state.dailyStats];
        const idx = dailyStats.findIndex((d) => d.date === today);
        if (idx >= 0) {
          dailyStats[idx] = {
            ...dailyStats[idx],
            wordsLearned: dailyStats[idx].wordsLearned + 1,
            accuracy: Math.round((known / cardsPlayed) * 100),
          };
        } else {
          dailyStats.push({
            date: today,
            wordsLearned: 1,
            accuracy: isKnownRating ? 100 : 0,
          });
        }

        const knownTotal = getKnownWordCount({
          ...state.progress,
          [wordId]: clean,
        });
        const unlockedLevels = LEVELS.filter(
          (l) => knownTotal >= l.unlockAt || l.id === 1
        ).map((l) => l.id);

        const last = state.profile.lastPlayedAt
          ? state.profile.lastPlayedAt.slice(0, 10)
          : null;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yKey = yesterday.toISOString().slice(0, 10);
        let streak = state.profile.streak;
        if (last !== today) {
          streak = last === yKey ? streak + 1 : 1;
        }

        set({
          progress: { ...state.progress, [wordId]: clean },
          session: {
            known,
            unknown,
            cardsPlayed,
            accuracy: Math.round((known / cardsPlayed) * 100),
            ratings,
          },
          dailyStats,
          dirty: true,
          profile: {
            ...state.profile,
            streak,
            lastPlayedAt: new Date().toISOString(),
            unlockedLevels,
          },
        });

        return updated;
      },

      updateName: (name) =>
        set((s) => ({
          profile: { ...s.profile, name },
          dirty: true,
        })),

      signIn: ({ name, phone, batch }) =>
        set((s) => ({
          profile: {
            ...s.profile,
            id: `u_${phone.replace(/\D/g, "").slice(-10) || "guest"}`,
            name: name.trim(),
            phone: phone.trim(),
            batch,
            authenticated: true,
          },
          dirty: true,
        })),

      markSaved: () =>
        set({ dirty: false, lastSavedAt: new Date().toISOString() }),

      logoutLocal: () =>
        set({
          profile: defaultProfile(),
          progress: {},
          dailyStats: [],
          session: null,
          dirty: false,
          lastSavedAt: null,
        }),

      getUnlockedLevels: () => {
        const known = getKnownWordCount(get().progress);
        return LEVELS.filter((l) => known >= l.unlockAt || l.id === 1).map(
          (l) => l.id
        );
      },

      getStreak: () => get().profile.streak,
    }),
    {
      name: "wordswipe-v2",
      skipHydration: true,
      partialize: (s) => ({
        profile: s.profile,
        progress: s.progress,
        dailyStats: s.dailyStats,
        dirty: s.dirty,
        lastSavedAt: s.lastSavedAt,
      }),
    }
  )
);

export function getProgressOrDefault(
  progress: Record<string, WordProgressLocal>,
  wordId: string
): WordProgressLocal {
  return progress[wordId] ?? createDefaultProgress(wordId);
}

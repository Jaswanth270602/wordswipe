import { NextResponse } from "next/server";
import type { DailyStatLocal, UserProfile, WordProgressLocal } from "@/lib/types";

export const runtime = "nodejs";

interface SyncBody {
  profile: UserProfile;
  progress: WordProgressLocal[];
  dailyStats: DailyStatLocal[];
}

export async function POST(req: Request) {
  let body: SyncBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body?.profile?.id) {
    return NextResponse.json({ error: "Missing profile" }, { status: 400 });
  }

  // Try Postgres when available; otherwise acknowledge local-only save
  try {
    const { prisma } = await import("@/lib/db");

    await prisma.user.upsert({
      where: { id: body.profile.id },
      create: {
        id: body.profile.id,
        name: body.profile.name,
        avatarColor: body.profile.avatarColor,
        streak: body.profile.streak,
        lastPlayedAt: body.profile.lastPlayedAt
          ? new Date(body.profile.lastPlayedAt)
          : null,
      },
      update: {
        name: body.profile.name,
        avatarColor: body.profile.avatarColor,
        streak: body.profile.streak,
        lastPlayedAt: body.profile.lastPlayedAt
          ? new Date(body.profile.lastPlayedAt)
          : null,
      },
    });

    for (const p of body.progress || []) {
      // Skip if word not in DB yet — seed first
      const word = await prisma.word.findUnique({ where: { id: p.wordId } });
      if (!word) continue;

      await prisma.wordProgress.upsert({
        where: {
          userId_wordId: { userId: body.profile.id, wordId: p.wordId },
        },
        create: {
          userId: body.profile.id,
          wordId: p.wordId,
          rating: p.rating,
          strength: p.strength,
          interval: Math.max(0, p.interval),
          repetitions: p.repetitions,
          easeFactor: p.easeFactor,
          nextReviewAt: new Date(p.nextReviewAt),
          knownCount: p.knownCount,
          unknownCount: p.unknownCount,
          lastRating: p.lastRating,
        },
        update: {
          rating: p.rating,
          strength: p.strength,
          interval: Math.max(0, p.interval),
          repetitions: p.repetitions,
          easeFactor: p.easeFactor,
          nextReviewAt: new Date(p.nextReviewAt),
          knownCount: p.knownCount,
          unknownCount: p.unknownCount,
          lastRating: p.lastRating,
        },
      });
    }

    for (const d of body.dailyStats || []) {
      await prisma.dailyStat.upsert({
        where: {
          userId_date: {
            userId: body.profile.id,
            date: new Date(d.date),
          },
        },
        create: {
          userId: body.profile.id,
          date: new Date(d.date),
          wordsLearned: d.wordsLearned,
          accuracy: d.accuracy,
        },
        update: {
          wordsLearned: d.wordsLearned,
          accuracy: d.accuracy,
        },
      });
    }

    return NextResponse.json({
      ok: true,
      message: "Progress synced to PostgreSQL",
      savedAt: new Date().toISOString(),
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Database unavailable";
    // Soft success so UX still works offline / before DB setup
    return NextResponse.json({
      ok: true,
      offline: true,
      message: `Local save confirmed. DB sync pending: ${message}`,
      savedAt: new Date().toISOString(),
    });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "wordswipe-sync",
  });
}

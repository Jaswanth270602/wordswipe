# WordSwipe

Gamified SSC CGL English vocabulary trainer — scratch-to-reveal cards, Tinder-style ratings, and spaced repetition.

## Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** (mobile-first UI)
- **PostgreSQL** via **Prisma** (cloud sync)
- **localStorage** (Zustand persist) for day-to-day progress

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The game works fully offline with the built-in word bank.

### Optional: PostgreSQL sync

1. Create a database and set `DATABASE_URL` in `.env`
2. Run:

```bash
npm run db:setup
```

3. In the app: **Profile menu → Save progress** (or **Save & logout**) to push localStorage → Postgres.

## How progress works

1. Every swipe/rating updates **localStorage** immediately
2. Memory strength, streaks, and unlocks stay on-device
3. Clicking **Save** in the navbar profile dropdown syncs to Postgres
4. **Save & logout** syncs then clears the local guest profile

## Game loop

- Scratch the foil to reveal meaning / synonyms / antonyms / blanks
- Rate with **Easy · Somewhat · Hard · New** (or swipe Easy/Hard)
- Hard & New words reappear after a few cards (spaced repetition)
- After 10 cards → session report (accuracy, streak, daily counts)
- Levels unlock as your “known” word count grows

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run db:setup` | Push schema + seed words |
| `npm run db:seed` | Re-seed vocabulary |

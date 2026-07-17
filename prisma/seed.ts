import { PrismaClient } from "@prisma/client";
import { WORDS } from "../src/data/words/index";

const prisma = new PrismaClient();

async function main() {
  console.log(`Seeding ${WORDS.length} words…`);

  for (const w of WORDS) {
    await prisma.word.upsert({
      where: { id: w.id },
      create: {
        id: w.id,
        word: w.word,
        meaning: w.meaning,
        example: w.example,
        synonyms: w.synonyms,
        antonyms: w.antonyms,
        blankSentence: w.blankSentence,
        blankAnswer: w.blankAnswer,
        category: w.category,
        level: w.level,
        difficulty: w.difficulty,
        cardTypes: w.cardTypes,
      },
      update: {
        word: w.word,
        meaning: w.meaning,
        example: w.example,
        synonyms: w.synonyms,
        antonyms: w.antonyms,
        blankSentence: w.blankSentence,
        blankAnswer: w.blankAnswer,
        category: w.category,
        level: w.level,
        difficulty: w.difficulty,
        cardTypes: w.cardTypes,
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

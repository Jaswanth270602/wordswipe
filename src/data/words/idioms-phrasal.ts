import type { WordEntry } from "./types";

/** Idioms — same format as vocab: term + meaning + SSC example (+ optional syn/ant) */
export const IDIOMS: WordEntry[] = [
  {
    id: "idi-001",
    word: "Break the ice",
    meaning: "To start a conversation in a friendly way; ease tension.",
    example:
      "The mentor broke the ice by sharing his first failed attempt at SSC CGL.",
    synonyms: ["initiate talk", "ease tension"],
    antonyms: ["create tension"],
    category: "IDIOMS",
    level: 1,
  },
  {
    id: "idi-002",
    word: "Hit the nail on the head",
    meaning: "To describe exactly what is causing a situation.",
    example:
      "The teacher hit the nail on the head when she said weak reading speed was hurting scores.",
    synonyms: ["be exact", "be precise"],
    antonyms: ["miss the point"],
    category: "IDIOMS",
    level: 2,
    difficulty: "MEDIUM",
  },
  {
    id: "idi-003",
    word: "Burn the midnight oil",
    meaning: "To work late into the night.",
    example:
      "She burned the midnight oil to finish the editorial vocabulary list.",
    synonyms: ["work late", "study late"],
    antonyms: ["rest early"],
    category: "IDIOMS",
    level: 3,
    difficulty: "MEDIUM",
  },
  {
    id: "idi-004",
    word: "On the fence",
    meaning: "Undecided between two options.",
    example:
      "He was on the fence about choosing CGL or CHSL as his primary target.",
    synonyms: ["undecided", "neutral", "unsure"],
    antonyms: ["decisive", "committed"],
    category: "IDIOMS",
    level: 4,
    difficulty: "MEDIUM",
  },
  {
    id: "idi-005",
    word: "Axe to grind",
    meaning: "A private reason for doing something; a hidden motive.",
    example:
      "Ignore advice from anyone with an axe to grind about a particular coaching brand.",
    synonyms: ["ulterior motive", "hidden agenda"],
    antonyms: ["impartiality"],
    category: "IDIOMS",
    level: 5,
    difficulty: "HARD",
  },
  {
    id: "idi-006",
    word: "A blessing in disguise",
    meaning: "Something that seems bad at first but turns out well.",
    example:
      "Failing the first mock was a blessing in disguise because it fixed her weak grammar early.",
    synonyms: ["hidden benefit", "silver lining"],
    antonyms: ["curse", "setback"],
    category: "IDIOMS",
    level: 1,
  },
  {
    id: "idi-007",
    word: "Bite the bullet",
    meaning: "To face a difficult situation with courage.",
    example:
      "He decided to bite the bullet and attempt the toughest previous-year set first.",
    synonyms: ["face bravely", "endure"],
    antonyms: ["avoid", "flee"],
    category: "IDIOMS",
    level: 2,
    difficulty: "MEDIUM",
  },
  {
    id: "idi-008",
    word: "Call a spade a spade",
    meaning: "To speak plainly and honestly.",
    example:
      "The coach called a spade a spade and said his accuracy was too low for Tier-2.",
    synonyms: ["speak frankly", "be blunt"],
    antonyms: ["sugarcoat", "evade"],
    category: "IDIOMS",
    level: 2,
    difficulty: "MEDIUM",
  },
];

export const PHRASAL_VERBS: WordEntry[] = [
  {
    id: "pv-001",
    word: "Call off",
    meaning: "To cancel something.",
    example:
      "The coaching centre called off the mock test due to a power cut.",
    synonyms: ["cancel", "abort", "scrap"],
    antonyms: ["schedule", "arrange"],
    category: "PHRASAL_VERBS",
    level: 1,
  },
  {
    id: "pv-002",
    word: "Carry on",
    meaning: "To continue doing something.",
    example:
      "Despite low mock scores, she decided to carry on with her revision plan.",
    synonyms: ["continue", "persist", "proceed"],
    antonyms: ["stop", "quit"],
    category: "PHRASAL_VERBS",
    level: 1,
  },
  {
    id: "pv-003",
    word: "Look into",
    meaning: "To investigate or examine carefully.",
    example:
      "The board will look into complaints about incorrect answer keys.",
    synonyms: ["investigate", "examine", "probe"],
    antonyms: ["ignore", "overlook"],
    category: "PHRASAL_VERBS",
    level: 2,
    difficulty: "MEDIUM",
  },
  {
    id: "pv-004",
    word: "Put off",
    meaning: "To postpone; to discourage.",
    example:
      "Do not put off tough antonym practice until the week of the exam.",
    synonyms: ["postpone", "delay", "deter"],
    antonyms: ["advance", "encourage"],
    category: "PHRASAL_VERBS",
    level: 3,
    difficulty: "MEDIUM",
  },
  {
    id: "pv-005",
    word: "Brush up on",
    meaning: "To improve one's knowledge of something forgotten.",
    example:
      "Brush up on phrasal verbs before attempting the previous year set.",
    synonyms: ["revise", "refresh", "review"],
    antonyms: ["neglect", "forget"],
    category: "PHRASAL_VERBS",
    level: 4,
    difficulty: "MEDIUM",
  },
  {
    id: "pv-006",
    word: "Wear thin",
    meaning: "To become weaker or less convincing over time.",
    example:
      "Excuses for skipping revision start to wear thin before the prelims.",
    synonyms: ["weaken", "fade", "diminish"],
    antonyms: ["strengthen", "grow"],
    category: "PHRASAL_VERBS",
    level: 5,
    difficulty: "HARD",
  },
  {
    id: "pv-007",
    word: "Give up",
    meaning: "To stop trying; to surrender.",
    example:
      "She refused to give up even after three failed attempts at Tier-1.",
    synonyms: ["quit", "surrender", "abandon"],
    antonyms: ["persist", "continue"],
    category: "PHRASAL_VERBS",
    level: 1,
  },
  {
    id: "pv-008",
    word: "Turn down",
    meaning: "To reject or refuse.",
    example:
      "He turned down a private job offer to focus fully on SSC CGL.",
    synonyms: ["reject", "refuse", "decline"],
    antonyms: ["accept", "approve"],
    category: "PHRASAL_VERBS",
    level: 2,
    difficulty: "MEDIUM",
  },
];

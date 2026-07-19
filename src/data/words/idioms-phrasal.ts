import type { WordEntry } from "./types";

/** Idioms — meaning + SSC example + origin story for memory hooks */
export const IDIOMS: WordEntry[] = [
  {
    id: "idi-001",
    word: "Break the ice",
    meaning: "To start a conversation in a friendly way; ease tension.",
    example:
      "The mentor broke the ice by sharing his first failed attempt at SSC CGL.",
    origin:
      "From old sailing days: ships stuck in frozen seas had to literally break the ice to move. Later it meant removing the cold silence between people.",
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
    origin:
      "From carpentry: striking the nail's head dead-centre drives it in perfectly. So the phrase means being exactly right.",
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
    origin:
      "Before electricity, people studied or worked by oil lamps. Burning oil past midnight meant staying up late to finish work.",
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
    origin:
      "Picture sitting on a fence between two fields — you haven't jumped to either side yet. It means you haven't chosen.",
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
    origin:
      "From a story by Benjamin Franklin: a man flatters a boy into sharpening his axe, then walks away. So it means a selfish hidden agenda.",
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
    origin:
      "An 18th-century idea: a gift from God 'disguised' as misfortune. What looks like a setback hides a real benefit.",
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
    origin:
      "In battlefield surgery before anaesthesia, patients bit a bullet to endure pain. Now it means facing something hard bravely.",
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
    origin:
      "From ancient Greek via Latin: say the plain name of a tool (spade), not a fancy word. Means speak bluntly without sugarcoating.",
    synonyms: ["speak frankly", "be blunt"],
    antonyms: ["sugarcoat", "evade"],
    category: "IDIOMS",
    level: 2,
    difficulty: "MEDIUM",
  },
  {
    id: "idi-009",
    word: "Once in a blue moon",
    meaning: "Very rarely; almost never.",
    example:
      "He tops mocks once in a blue moon, so daily practice still matters more than luck.",
    origin:
      "A 'blue moon' is a rare second full moon in a calendar month. The rarity of that event gave the idiom its meaning.",
    synonyms: ["rarely", "seldom"],
    antonyms: ["often", "frequently"],
    category: "IDIOMS",
    level: 1,
  },
  {
    id: "idi-010",
    word: "Spill the beans",
    meaning: "To reveal a secret accidentally or deliberately.",
    example:
      "Don't spill the beans about the surprise mock before the batch is ready.",
    origin:
      "Linked to an old Greek voting method using beans in a jar — spilling them revealed the secret count too early.",
    synonyms: ["reveal", "disclose", "let slip"],
    antonyms: ["conceal", "keep secret"],
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
    origin:
      "From hunting/dogs: to 'call off' the hounds meant order them to stop. Later it meant cancelling any planned action.",
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
    origin:
      "Military and everyday English: 'carry on' = keep moving forward with the task. The particle 'on' adds the idea of continuation.",
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
    origin:
      "Literally 'look into' a box or matter — peer inside. Figuratively it became 'investigate' what is going on.",
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
    origin:
      "From 'put' (place) + 'off' (away in time). Moving something away from now = delaying it. Also used for making someone lose interest.",
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
    origin:
      "Like brushing dust off an old book — you clean up rusty knowledge. 'Brush up on' means refresh what you once knew.",
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
    origin:
      "Cloth that is used too much becomes thin and weak. Patience or excuses that are 'worn thin' lose strength the same way.",
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
    origin:
      "Old sense of 'give' = hand over. Giving up a fight means handing victory to the other side — quitting.",
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
    origin:
      "From turning a dial/volume 'down' (lowering), or turning someone away at a door. Both ideas became 'reject an offer'.",
    synonyms: ["reject", "refuse", "decline"],
    antonyms: ["accept", "approve"],
    category: "PHRASAL_VERBS",
    level: 2,
    difficulty: "MEDIUM",
  },
  {
    id: "pv-009",
    word: "Bring up",
    meaning: "To raise a topic; to rear a child.",
    example:
      "Please bring up your weak topics in the doubt session tonight.",
    origin:
      "To 'bring up' from below — lift something into view. In talk, you lift a subject into the conversation.",
    synonyms: ["mention", "raise", "introduce"],
    antonyms: ["drop", "ignore"],
    category: "PHRASAL_VERBS",
    level: 2,
    difficulty: "MEDIUM",
  },
  {
    id: "pv-010",
    word: "Run out of",
    meaning: "To have no more of something left.",
    example:
      "Don't run out of time on the last RC passage — watch the clock.",
    origin:
      "When a container 'runs out', its contents are gone. So 'run out of time/money' means nothing remains.",
    synonyms: ["exhaust", "deplete"],
    antonyms: ["have plenty", "stock up"],
    category: "PHRASAL_VERBS",
    level: 1,
  },
];

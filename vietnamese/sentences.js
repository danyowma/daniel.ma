/*
 * sentences.js — patterns for the "Build" game (sentence scramble).
 *
 * PATTERNS: each has
 *   level  number   1 = short/easy, higher = longer. The game ramps with your streak.
 *   parts  array    the sentence in order. A string is a literal word; an
 *                   object { slot: "name" } is filled from a slot.
 *   en     string   English prompt. "{name}" is replaced with the chosen word's
 *                   English meaning.
 *
 * Slots are built in app.js straight from the study cards (SLOT_CATS): every
 * card in the mapped categories can appear, so adding a card to Animals /
 * Colors / Food / Home / etc. automatically widens this game. Any literal word
 * in `parts` should also exist as a card so its tile shows an emoji.
 */

window.PATTERNS = [
  // ---- level 1: two tiles ----
  { level: 1, parts: ["đây là", { slot: "noun" }],                 en: "This is a {noun}." },
  { level: 1, parts: [{ slot: "animal" }, { slot: "color" }],      en: "The {animal} is {color}." },
  { level: 1, parts: [{ slot: "person" }, "khỏe"],                 en: "{person} is well." },

  // ---- level 2: three tiles ----
  { level: 2, parts: [{ slot: "person" }, "thích", { slot: "food" }],        en: "{person} likes {food}." },
  { level: 2, parts: [{ slot: "person" }, "không thích", { slot: "food" }],  en: "{person} doesn't like {food}." },
  { level: 2, parts: [{ slot: "person" }, "có", { slot: "animal" }],         en: "{person} has a {animal}." },
  { level: 2, parts: [{ slot: "person" }, "muốn", { slot: "food" }],         en: "{person} wants {food}." },
  { level: 2, parts: [{ slot: "animal" }, { slot: "position" }, { slot: "furniture" }], en: "The {animal} is {position} the {furniture}." },
  { level: 2, parts: ["đây là", { slot: "animal" }, "phải không"],           en: "This is a {animal}, right?" },

  // ---- level 3: four tiles ----
  { level: 3, parts: ["đây là", { slot: "animal" }, "của", { slot: "person" }],      en: "This is {person}'s {animal}." },
  { level: 3, parts: [{ slot: "person" }, "thích", { slot: "animal" }, { slot: "color" }], en: "{person} likes the {color} {animal}." },
  { level: 3, parts: [{ slot: "animal" }, "của", { slot: "person" }, { slot: "position" }, { slot: "furniture" }], en: "{person}'s {animal} is {position} the {furniture}." },
];

/*
 * QUESTIONS — for the "Q&A" game. Every answer is a full spoken reply, not a
 * single word, and the four choices are whole phrases.
 *
 *   type  string  which generator to use (logic lives in app.js):
 *           "identify" — emoji shown, reply "đây là <noun>."
 *           "color"    — noun + color swatch shown, reply "<noun> màu <color>."
 *           "confirm"  — "đây là <X> phải không?" → "phải" or
 *                        "không phải, đây là <what's really shown>."
 *           "count"    — N emojis shown, reply "<number> <noun>."
 *   pool  string  which QSLOTS list the nouns come from
 *   q,qEn strings (identify only) the fixed question + gloss
 *
 * Words in QSLOTS must be cards that HAVE an emoji (that's the on-screen clue).
 */
window.QUESTIONS = [
  { type: "identify", pool: "animal", q: "đây là con gì?", qEn: "What animal is this?" },
  { type: "identify", pool: "thing", q: "đây là cái gì?", qEn: "What is this?" },
  { type: "identify", pool: "job", q: "đây là ai?", qEn: "Who is this?" },
  { type: "color", pool: "animal" },
  { type: "confirm", pool: "animal" },
  { type: "count", pool: "animal" },
];

window.QSLOTS = {
  color: [
    "màu đỏ", "màu xanh dương", "màu xanh lá", "màu vàng", "màu cam",
    "màu hồng", "màu tím", "màu nâu", "màu đen",
  ],
  animal: [
    "con mèo", "con chó", "con cá", "con chim", "con gà", "con ngựa",
    "con vịt", "con heo", "con khỉ", "con bò", "con bướm", "con ếch", "con chuột",
  ],
  thing: [
    "cái ghế", "cái giường", "cái tivi", "cái cặp", "cuốn sách", "trái banh",
    "gấu bông", "búp bê", "con diều", "bông hoa", "cái cây", "cái hộp", "cái cửa",
  ],
  job: ["bác sĩ", "y tá", "giáo viên", "đầu bếp", "nông dân", "công an"],
};

// Vietnamese numbers 1–6, for the "how many?" question.
window.NUM_WORDS = ["một", "hai", "ba", "bốn", "năm", "sáu"];

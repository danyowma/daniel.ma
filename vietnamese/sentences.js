/*
 * sentences.js — patterns for the "Build" game (sentence scramble).
 *
 * PATTERNS: each has
 *   level  number   1 = short/easy, higher = longer. Informational only —
 *                   the game picks patterns at random across all levels.
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

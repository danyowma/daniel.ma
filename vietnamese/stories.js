/*
 * stories.js — data for the "Story" listening game.
 *
 * A round plays a short Vietnamese story (2–5 sentences, text-to-speech),
 * then asks 1–2 comprehension questions. Templates are filled with random
 * words from STORY_SLOTS, so each skeleton produces many concrete stories.
 *
 * STORIES[i]:
 *   level     number   1 short / 3 longer. Informational only — rounds are
 *                      picked at random across all levels.
 *   vars      object   var name -> STORY_SLOTS list it's drawn from. Vars that
 *                      share a list get distinct values.
 *   lines     [string] the story; "{var}" is replaced with the chosen word
 *   questions [ ... ]:
 *     ask   string  which var the answer is (also: which var the distractors vary)
 *     q     string  the question, with {var} placeholders
 *     a     string  the full answer phrase, with {var} placeholders
 *     qEn   string  English gloss of the question ({var} -> that word's English)
 *     aEn   string  English gloss of the answer
 *     line  number  OPTIONAL index of the story line that holds the answer
 *                   (highlighted when the transcript is revealed)
 *
 * TONE_SETS: minimal-pair sets for the "Which did you hear?" warm-up.
 */

window.STORY_SLOTS = {
  person: ["mẹ", "ba", "anh", "chị", "em", "bà", "ông"],
  animal: [
    "con chó", "con mèo", "con gà", "con cá", "con chim",
    "con vịt", "con heo", "con bò", "con ngựa",
  ],
  color: [
    "màu đỏ", "màu xanh dương", "màu xanh lá", "màu vàng", "màu đen",
    "màu trắng", "màu nâu", "màu cam", "màu hồng", "màu tím",
  ],
  food: ["kem", "phở", "mì", "bánh mì", "cà rốt", "chôm chôm"],
  furniture: ["cái bàn", "cái ghế", "cái giường", "cái kệ", "ghế sô pha"],
  thing: [
    "cái ghế", "cái bàn", "cái tivi", "cái cặp", "cuốn sách",
    "trái banh", "gấu bông", "con diều", "bông hoa", "cái hộp",
  ],
  toy: ["trái banh", "búp bê", "gấu bông", "xếp hình", "con diều"],
  position: ["ở trên", "ở dưới", "ở trong", "ở kế bên"],
  count: ["hai", "ba", "bốn", "năm"],
  name: ["Nam", "Mai", "Lan", "An", "Bảo", "Minh", "Linh", "Tú"],
  adult: ["chú", "cô", "ông", "bà"],
  job: ["bác sĩ", "y tá", "giáo viên", "đầu bếp", "nông dân", "công an", "tài xế"],
};

window.STORIES = [
  {
    level: 1,
    vars: { who: "person", pet: "animal", col: "color", place: "furniture" },
    lines: [
      "Đây là {who}.",
      "{who} có {pet}.",
      "{pet} {col}.",
      "{pet} ở trên {place}.",
    ],
    questions: [
      { ask: "col", q: "{pet} màu gì?", a: "{pet} {col}", qEn: "What color is the {pet}?", aEn: "The {pet} is {col}.", line: 2 },
      { ask: "place", q: "{pet} ở đâu?", a: "{pet} ở trên {place}", qEn: "Where is the {pet}?", aEn: "On the {place}.", line: 3 },
    ],
  },
  {
    level: 1,
    vars: { who: "person", f1: "food", f2: "food" },
    lines: [
      "{who} thích {f1}.",
      "{who} không thích {f2}.",
    ],
    questions: [
      { ask: "f1", q: "{who} thích gì?", a: "{who} thích {f1}", qEn: "What does {who} like?", aEn: "{who} likes {f1}.", line: 0 },
      { ask: "f2", q: "{who} không thích gì?", a: "{who} không thích {f2}", qEn: "What does {who} not like?", aEn: "{who} doesn't like {f2}.", line: 1 },
    ],
  },
  {
    level: 2,
    vars: { who: "person", who2: "person", pet: "animal", col: "color" },
    lines: [
      "Đây là {who} và {who2}.",
      "{who} có {pet}. {pet} {col}.",
      "{who2} thích {pet}.",
    ],
    questions: [
      { ask: "who2", q: "Ai thích {pet}?", a: "{who2} thích {pet}", qEn: "Who likes the {pet}?", aEn: "{who2} likes the {pet}.", line: 2 },
      { ask: "col", q: "{pet} màu gì?", a: "{pet} {col}", qEn: "What color is the {pet}?", aEn: "The {pet} is {col}.", line: 1 },
    ],
  },
  {
    level: 2,
    vars: { who: "person", toy: "toy", col: "color" },
    lines: [
      "Đây là {toy} của {who}.",
      "{toy} {col}.",
      "{who} thích {toy}.",
    ],
    questions: [
      { ask: "who", q: "{toy} của ai?", a: "{toy} của {who}", qEn: "Whose {toy} is it?", aEn: "It's {who}'s {toy}.", line: 0 },
      { ask: "col", q: "{toy} màu gì?", a: "{toy} {col}", qEn: "What color is the {toy}?", aEn: "The {toy} is {col}.", line: 1 },
    ],
  },
  {
    level: 2,
    vars: { who: "person", pet: "animal", n: "count", pet2: "animal", m: "count" },
    lines: [
      "{who} có {n} {pet}.",
      "{who} có {m} {pet2}.",
    ],
    questions: [
      { ask: "n", q: "{who} có mấy {pet}?", a: "{n} {pet}", qEn: "How many {pet} does {who} have?", aEn: "{n} {pet}.", line: 0 },
      { ask: "m", q: "{who} có mấy {pet2}?", a: "{m} {pet2}", qEn: "How many {pet2} does {who} have?", aEn: "{m} {pet2}.", line: 1 },
    ],
  },
  {
    level: 3,
    vars: { who: "person", pet: "animal", pos: "position", place: "furniture" },
    lines: [
      "{who} có {pet}.",
      "{pet} {pos} {place}.",
      "{who} không thấy {pet}.",
    ],
    questions: [
      { ask: "pos", q: "{pet} ở đâu?", a: "{pet} {pos} {place}", qEn: "Where is the {pet}?", aEn: "{pos} the {place}.", line: 1 },
    ],
  },
  {
    level: 1,
    vars: { who: "person", name: "name" },
    lines: [
      "Đây là {who}.",
      "Tên {who} là {name}.",
    ],
    questions: [
      { ask: "name", q: "Tên {who} là gì?", a: "Tên {who} là {name}", qEn: "What is {who}'s name?", aEn: "{who}'s name is {name}.", line: 1 },
    ],
  },
  {
    level: 2,
    vars: { who: "person", pet: "animal", name: "name", col: "color" },
    lines: [
      "{who} có {pet}.",
      "Tên {pet} là {name}.",
      "{pet} {col}.",
    ],
    questions: [
      { ask: "name", q: "Tên {pet} là gì?", a: "Tên {pet} là {name}", qEn: "What is the {pet}'s name?", aEn: "The {pet}'s name is {name}.", line: 1 },
      { ask: "col", q: "{pet} màu gì?", a: "{pet} {col}", qEn: "What color is the {pet}?", aEn: "The {pet} is {col}.", line: 2 },
    ],
  },
  {
    level: 2,
    vars: { n1: "name", n2: "name", pet: "animal", food: "food" },
    lines: [
      "Đây là {n1} và {n2}.",
      "{n1} có {pet}.",
      "{n2} thích {food}.",
    ],
    questions: [
      { ask: "n1", q: "Ai có {pet}?", a: "{n1} có {pet}", qEn: "Who has the {pet}?", aEn: "{n1} has the {pet}.", line: 1 },
      { ask: "n2", q: "Ai thích {food}?", a: "{n2} thích {food}", qEn: "Who likes {food}?", aEn: "{n2} likes {food}.", line: 2 },
    ],
  },
  {
    level: 3,
    vars: { a1: "animal", c1: "color", a2: "animal", c2: "color", place: "furniture" },
    lines: [
      "Đây là {a1} và {a2}.",
      "{a1} {c1}.",
      "{a2} {c2}.",
      "{a1} và {a2} ở trên {place}.",
    ],
    questions: [
      { ask: "c1", q: "{a1} màu gì?", a: "{a1} {c1}", qEn: "What color is the {a1}?", aEn: "The {a1} is {c1}.", line: 1 },
      { ask: "c2", q: "{a2} màu gì?", a: "{a2} {c2}", qEn: "What color is the {a2}?", aEn: "The {a2} is {c2}.", line: 2 },
    ],
  },

  // ---- jobs, using đó (there / that) ----
  {
    level: 1,
    vars: { adult: "adult", job: "job" },
    lines: [
      "Đó là {adult}.",
      "{adult} là {job}.",
    ],
    questions: [
      { ask: "job", q: "{adult} là nghề gì?", a: "{adult} là {job}", qEn: "What is the {adult}'s job?", aEn: "The {adult} is a {job}.", line: 1 },
    ],
  },
  {
    level: 2,
    vars: { adult: "adult", job: "job", adult2: "adult", job2: "job" },
    lines: [
      "{adult} đó là {job}.",
      "{adult2} đó là {job2}.",
    ],
    questions: [
      { ask: "job", q: "{adult} đó là nghề gì?", a: "{adult} đó là {job}", qEn: "What is that {adult}'s job?", aEn: "That {adult} is a {job}.", line: 0 },
      { ask: "job2", q: "{adult2} đó là nghề gì?", a: "{adult2} đó là {job2}", qEn: "What is that {adult2}'s job?", aEn: "That {adult2} is a {job2}.", line: 1 },
    ],
  },
  {
    level: 2,
    vars: { adult: "adult", job: "job", food: "food" },
    lines: [
      "{adult} đó là {job}.",
      "{adult} thích {food}.",
    ],
    questions: [
      { ask: "job", q: "{adult} đó là nghề gì?", a: "{adult} đó là {job}", qEn: "What is that {adult}'s job?", aEn: "That {adult} is a {job}.", line: 0 },
      { ask: "food", q: "{adult} thích gì?", a: "{adult} thích {food}", qEn: "What does the {adult} like?", aEn: "The {adult} likes {food}.", line: 1 },
    ],
  },

  // ---- đó pointing at a thing ----
  {
    level: 2,
    vars: { thing: "thing", col: "color", who: "person" },
    lines: [
      "Cái đó là {thing}.",
      "{thing} {col}.",
      "{thing} của {who}.",
    ],
    questions: [
      { ask: "thing", q: "Cái đó là gì?", a: "Cái đó là {thing}", qEn: "What is that?", aEn: "That is a {thing}.", line: 0 },
      { ask: "who", q: "{thing} của ai?", a: "{thing} của {who}", qEn: "Whose {thing} is it?", aEn: "It's {who}'s {thing}.", line: 2 },
    ],
  },
  {
    level: 2,
    vars: { pet: "animal", pos: "position", place: "furniture" },
    lines: [
      "{pet} {pos} {place}.",
      "{pet} ở đó.",
    ],
    questions: [
      { ask: "pos", q: "{pet} ở đâu?", a: "{pet} {pos} {place}", qEn: "Where is the {pet}?", aEn: "{pos} the {place}.", line: 0 },
    ],
  },

  // ---- filling gaps in Grammar-tab coverage: each of these exercises a
  // grammar.js pattern that no story above touches yet ----

  // grammar.js: "Between: A ở giữa B và C"
  {
    level: 2,
    vars: { thing: "thing", f1: "furniture", f2: "furniture" },
    lines: [
      "Đây là {thing}.",
      "{thing} ở giữa {f1} và {f2}.",
    ],
    questions: [
      { ask: "f2", q: "{thing} ở giữa {f1} và gì?", a: "{thing} ở giữa {f1} và {f2}", qEn: "What is the {thing} between the {f1} and?", aEn: "Between the {f1} and the {f2}.", line: 1 },
    ],
  },
  // grammar.js: "Confirming: … phải không?"
  {
    level: 1,
    vars: { pet: "animal", col: "color" },
    lines: [
      "{pet} {col} phải không?",
      "Phải, {pet} {col}.",
    ],
    questions: [
      { ask: "col", q: "{pet} màu gì?", a: "{pet} {col}", qEn: "What color is the {pet}?", aEn: "The {pet} is {col}.", line: 1 },
    ],
  },
  // grammar.js: "True or false: … đúng hay sai?"
  {
    level: 2,
    vars: { pet: "animal", pos: "position", pos2: "position", place: "furniture" },
    lines: [
      "{pet} {pos} {place}, đúng hay sai?",
      "Sai! {pet} {pos2} {place}.",
    ],
    questions: [
      { ask: "pos2", q: "{pet} ở đâu?", a: "{pet} {pos2} {place}", qEn: "Where is the {pet}?", aEn: "{pos2} the {place}.", line: 1 },
    ],
  },
  // grammar.js: "Asking preference: … thích … không?"
  {
    level: 1,
    vars: { who: "person", toy: "toy" },
    lines: [
      "{who} thích {toy} không?",
      "{who} thích {toy}.",
    ],
    questions: [
      { ask: "who", q: "Ai thích {toy}?", a: "{who} thích {toy}", qEn: "Who likes the {toy}?", aEn: "{who} likes the {toy}.", line: 1 },
    ],
  },
  // grammar.js: "Greetings: … khỏe không?"
  {
    level: 1,
    vars: { who: "person" },
    lines: [
      "{who} khỏe không?",
      "{who} khỏe.",
    ],
    questions: [
      { ask: "who", q: "Ai khỏe?", a: "{who} khỏe", qEn: "Who is doing well?", aEn: "{who} is doing well.", line: 1 },
    ],
  },
  // grammar.js: "Future job: muốn làm + job"
  {
    level: 2,
    vars: { who: "person", job: "job" },
    lines: [
      "{who} là học sinh.",
      "{who} muốn làm {job}.",
    ],
    questions: [
      { ask: "job", q: "{who} muốn làm nghề gì?", a: "{who} muốn làm {job}", qEn: "What does {who} want to be?", aEn: "{who} wants to be a {job}.", line: 1 },
    ],
  },

  // ---- richer multi-beat stories: a real beginning/middle/end instead of
  // a handful of juxtaposed facts, with questions spanning different beats
  // so listening has to track the whole story, not just the last line ----

  // Lost and found: two wrong guesses, then a resolution.
  {
    level: 3,
    vars: {
      who: "person", toy: "toy",
      pos1: "position", place1: "furniture",
      pos2: "position", place2: "furniture",
      pos3: "position", place3: "furniture",
    },
    lines: [
      "{who} có {toy}.",
      "{who} tìm {toy} {pos1} {place1}.",
      "{who} không thấy {toy}.",
      "{who} tìm {toy} {pos2} {place2}.",
      "{who} không thấy {toy}.",
      "Rồi {who} tìm {toy} {pos3} {place3}.",
      "À, có rồi!",
    ],
    questions: [
      { ask: "pos1", q: "{who} tìm {toy} ở đâu trước?", a: "{toy} {pos1} {place1}", qEn: "Where did {who} look for the {toy} first?", aEn: "{pos1} the {place1}.", line: 1 },
      { ask: "pos3", q: "Cuối cùng, {toy} ở đâu?", a: "{toy} {pos3} {place3}", qEn: "In the end, where was the {toy}?", aEn: "{pos3} the {place3}.", line: 5 },
    ],
  },
  // Meet someone new: name, job, likes, and a colored toy — four facts
  // about one character instead of one.
  {
    level: 3,
    vars: { adult: "adult", name: "name", job: "job", food: "food", toy: "toy", col: "color" },
    lines: [
      "Đây là {adult} {name}.",
      "{adult} {name} là {job}.",
      "{adult} {name} thích {food}.",
      "{adult} {name} có {toy}.",
      "{toy} {col}.",
    ],
    questions: [
      { ask: "job", q: "{adult} {name} là nghề gì?", a: "{adult} {name} là {job}", qEn: "What is {adult} {name}'s job?", aEn: "{adult} {name} is a {job}.", line: 1 },
      { ask: "food", q: "{adult} {name} thích gì?", a: "{adult} {name} thích {food}", qEn: "What does {adult} {name} like?", aEn: "{adult} {name} likes {food}.", line: 2 },
      { ask: "col", q: "{toy} màu gì?", a: "{toy} {col}", qEn: "What color is the {toy}?", aEn: "The {toy} is {col}.", line: 4 },
    ],
  },
  // Two friends, two pets: ends with the pets playing together instead of
  // just stopping after the facts.
  {
    level: 3,
    vars: { who: "person", who2: "person", pet1: "animal", col1: "color", pet2: "animal", col2: "color" },
    lines: [
      "Đây là {who} và {who2}.",
      "{who} có {pet1}. {pet1} {col1}.",
      "{who2} có {pet2}. {pet2} {col2}.",
      "{pet1} và {pet2} chơi với nhau.",
      "{who} và {who2} vui.",
    ],
    questions: [
      { ask: "col1", q: "{pet1} màu gì?", a: "{pet1} {col1}", qEn: "What color is the {pet1}?", aEn: "The {pet1} is {col1}.", line: 1 },
      { ask: "col2", q: "{pet2} màu gì?", a: "{pet2} {col2}", qEn: "What color is the {pet2}?", aEn: "The {pet2} is {col2}.", line: 2 },
    ],
  },
];

window.TONE_SETS = [
  { items: ["ba", "bà", "bá"], gloss: { "ba": "dad / three", "bà": "grandma", "bá": "aunt (father's older brother's wife)" } },
  { items: ["ma", "má", "mà", "mả"], gloss: { "ma": "ghost", "má": "mom (Southern) / cheek", "mà": "but / which", "mả": "grave" } },
  { items: ["co", "có", "cò", "cỏ"], gloss: { "co": "to contract", "có": "to have / yes", "cò": "stork", "cỏ": "grass" } },
  { items: ["la", "lá", "là", "lạ"], gloss: { "la": "to shout", "lá": "leaf", "là": "to be / is", "lạ": "strange" } },
  { items: ["nam", "năm", "nằm"], gloss: { "nam": "south / male", "năm": "five / year", "nằm": "to lie down" } },
  { items: ["tai", "tài", "tại"], gloss: { "tai": "ear", "tài": "talent", "tại": "at / because" } },
];

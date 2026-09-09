/*
 * stories.js — data for the "Story" listening game.
 *
 * A round plays a short Vietnamese story (4–7 sentences with a real
 * beginning/middle/end, text-to-speech), then asks 2–3 comprehension
 * questions spanning different beats of it. Templates are filled with
 * random words from STORY_SLOTS, so each skeleton produces many concrete
 * stories.
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

  // A pet's day: color, where it hangs out, and what it likes — three
  // facts about one pet instead of one.
  {
    level: 2,
    vars: { who: "person", pet: "animal", col: "color", pos: "position", place: "furniture", food: "food" },
    lines: [
      "{who} có {pet}.",
      "{pet} {col}.",
      "{pet} {pos} {place}.",
      "{pet} thích {food}.",
    ],
    questions: [
      { ask: "col", q: "{pet} màu gì?", a: "{pet} {col}", qEn: "What color is the {pet}?", aEn: "The {pet} is {col}.", line: 1 },
      { ask: "pos", q: "{pet} ở đâu?", a: "{pet} {pos} {place}", qEn: "Where is the {pet}?", aEn: "{pos} the {place}.", line: 2 },
      { ask: "food", q: "{pet} thích gì?", a: "{pet} thích {food}", qEn: "What does the {pet} like?", aEn: "The {pet} likes {food}.", line: 3 },
    ],
  },
  // Snack time: two friends with opposite tastes, then they share anyway.
  {
    level: 2,
    vars: { who: "person", who2: "person", f1: "food", f2: "food" },
    lines: [
      "{who} thích {f1}.",
      "{who} không thích {f2}.",
      "{who2} thích {f2}.",
      "{who2} không thích {f1}.",
      "{who} và {who2} ăn chung.",
    ],
    questions: [
      { ask: "f1", q: "{who} thích gì?", a: "{who} thích {f1}", qEn: "What does {who} like?", aEn: "{who} likes {f1}.", line: 0 },
      { ask: "f2", q: "{who2} thích gì?", a: "{who2} thích {f2}", qEn: "What does {who2} like?", aEn: "{who2} likes {f2}.", line: 2 },
    ],
  },
  // Box of toys: opening it up to find two different counts inside.
  {
    level: 2,
    vars: { who: "person", toy1: "toy", n: "count", toy2: "toy", m: "count" },
    lines: [
      "{who} có một cái hộp.",
      "Trong hộp có {n} {toy1}.",
      "Cũng có {m} {toy2}.",
      "{who} chơi với tất cả.",
    ],
    questions: [
      { ask: "n", q: "Trong hộp có mấy {toy1}?", a: "{n} {toy1}", qEn: "How many {toy1} are in the box?", aEn: "{n} {toy1}.", line: 1 },
      { ask: "m", q: "Trong hộp có mấy {toy2}?", a: "{m} {toy2}", qEn: "How many {toy2} are in the box?", aEn: "{m} {toy2}.", line: 2 },
    ],
  },
  // Two animals, one spot: same place, different colors.
  {
    level: 3,
    vars: { who: "person", a1: "animal", c1: "color", a2: "animal", c2: "color", pos: "position", place: "furniture" },
    lines: [
      "{who} có {a1} và {a2}.",
      "{a1} {c1}.",
      "{a2} {c2}.",
      "Cả hai {pos} {place}.",
    ],
    questions: [
      { ask: "c1", q: "{a1} màu gì?", a: "{a1} {c1}", qEn: "What color is the {a1}?", aEn: "The {a1} is {c1}.", line: 1 },
      { ask: "c2", q: "{a2} màu gì?", a: "{a2} {c2}", qEn: "What color is the {a2}?", aEn: "The {a2} is {c2}.", line: 2 },
      { ask: "pos", q: "{a1} và {a2} ở đâu?", a: "Cả hai {pos} {place}", qEn: "Where are the {a1} and the {a2}?", aEn: "Both {pos} the {place}.", line: 3 },
    ],
  },
  // Two workers, one friendship: each with a job, and one with a food they like.
  {
    level: 3,
    vars: { adult: "adult", job: "job", food: "food", adult2: "adult", job2: "job" },
    lines: [
      "Đó là {adult}.",
      "{adult} là {job}.",
      "{adult} thích {food}.",
      "{adult2} là {job2}.",
      "{adult} và {adult2} là bạn.",
    ],
    questions: [
      { ask: "job", q: "{adult} là nghề gì?", a: "{adult} là {job}", qEn: "What is the {adult}'s job?", aEn: "The {adult} is a {job}.", line: 1 },
      { ask: "job2", q: "{adult2} là nghề gì?", a: "{adult2} là {job2}", qEn: "What is the {adult2}'s job?", aEn: "The {adult2} is a {job2}.", line: 3 },
    ],
  },
  // What is that?: a thing, its color, and who it belongs to.
  {
    level: 2,
    vars: { thing: "thing", col: "color", who: "person" },
    lines: [
      "Cái đó là gì?",
      "Cái đó là {thing}.",
      "{thing} {col}.",
      "{thing} của {who}.",
      "{who} rất thích {thing}.",
    ],
    questions: [
      { ask: "thing", q: "Cái đó là gì?", a: "Cái đó là {thing}", qEn: "What is that?", aEn: "That is a {thing}.", line: 1 },
      { ask: "col", q: "{thing} màu gì?", a: "{thing} {col}", qEn: "What color is the {thing}?", aEn: "The {thing} is {col}.", line: 2 },
      { ask: "who", q: "{thing} của ai?", a: "{thing} của {who}", qEn: "Whose {thing} is it?", aEn: "It's {who}'s {thing}.", line: 3 },
    ],
  },
  // Between, and is it true?: locate it, then confirm its color.
  {
    level: 2,
    vars: { thing: "thing", f1: "furniture", f2: "furniture", col: "color" },
    lines: [
      "Đây là {thing}.",
      "{thing} ở giữa {f1} và {f2}.",
      "{thing} {col} phải không?",
      "Phải, {thing} {col}.",
    ],
    questions: [
      { ask: "f2", q: "{thing} ở giữa {f1} và gì?", a: "{thing} ở giữa {f1} và {f2}", qEn: "What is the {thing} between the {f1} and?", aEn: "Between the {f1} and the {f2}.", line: 1 },
      { ask: "col", q: "{thing} màu gì?", a: "{thing} {col}", qEn: "What color is the {thing}?", aEn: "The {thing} is {col}.", line: 3 },
    ],
  },
  // True or false, twice: a wrong guess and a correction, for both
  // position and color.
  {
    level: 3,
    vars: { pet: "animal", pos1: "position", pos2: "position", place: "furniture", col1: "color", col2: "color" },
    lines: [
      "{pet} {pos1} {place}, đúng hay sai?",
      "Sai! {pet} {pos2} {place}.",
      "{pet} {col1}, đúng hay sai?",
      "Sai! {pet} {col2}.",
      "Giỏi lắm!",
    ],
    questions: [
      { ask: "pos2", q: "{pet} ở đâu?", a: "{pet} {pos2} {place}", qEn: "Where is the {pet}?", aEn: "{pos2} the {place}.", line: 1 },
      { ask: "col2", q: "{pet} màu gì?", a: "{pet} {col2}", qEn: "What color is the {pet}?", aEn: "The {pet} is {col2}.", line: 3 },
    ],
  },
  // Do you like it?: two friends, two toys, two preferences.
  {
    level: 2,
    vars: { who: "person", toy1: "toy", who2: "person", toy2: "toy" },
    lines: [
      "{who} thích {toy1} không?",
      "{who} thích {toy1}.",
      "{who2} thích {toy2} không?",
      "{who2} thích {toy2}.",
      "Hai bạn chơi vui.",
    ],
    questions: [
      { ask: "who", q: "Ai thích {toy1}?", a: "{who} thích {toy1}", qEn: "Who likes the {toy1}?", aEn: "{who} likes the {toy1}.", line: 1 },
      { ask: "who2", q: "Ai thích {toy2}?", a: "{who2} thích {toy2}", qEn: "Who likes the {toy2}?", aEn: "{who2} likes the {toy2}.", line: 3 },
    ],
  },
  // Growing up: a greeting, then a dream job.
  {
    level: 2,
    vars: { who: "person", job: "job" },
    lines: [
      "{who} khỏe không?",
      "{who} khỏe.",
      "{who} là học sinh.",
      "{who} muốn làm {job}.",
      "{who} rất vui.",
    ],
    questions: [
      { ask: "who", q: "Ai khỏe?", a: "{who} khỏe", qEn: "Who is doing well?", aEn: "{who} is doing well.", line: 1 },
      { ask: "job", q: "{who} muốn làm nghề gì?", a: "{who} muốn làm {job}", qEn: "What does {who} want to be?", aEn: "{who} wants to be a {job}.", line: 3 },
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

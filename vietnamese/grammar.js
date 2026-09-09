/*
 * grammar.js — lessons for the "Grammar" tab (generated study sentences).
 *
 * Authored by hand from grammar.md (the human-readable reference). Each round
 * the tab shows a lesson's `title` + `point`, then builds one fresh Vietnamese
 * sentence by filling `parts` from the study cards — the same slot system the
 * "Build" game uses (SLOT_CATS / SLOTS in app.js). So every sentence only uses
 * vocabulary that already exists as a card.
 *
 * GRAMMAR[i]:
 *   title    string    short name of the structure
 *   point    string    the thing to learn (shown under the title)
 *   parts    array     sentence template: a string is a literal word/particle;
 *                      { slot: "name" } is filled from that slot's cards
 *   en       string    English gloss; "{slot}" -> the chosen card's English
 *   examples [string]  verbatim example sentences from grammar.md, for reference
 *
 * Slots used here: animal, color, food, person, position, furniture, noun,
 * number, job, toy. `position` cards already carry "ở" ("ở trên", "ở kế bên"…);
 * `color` cards already carry "màu" ("màu đỏ"…).
 */

window.GRAMMAR = [
  {
    title: "Prepositions of location",
    point:
      "Say where something is: Thing + ở trên / ở dưới / ở trong / ở kế bên / ở giữa + Thing.",
    parts: [{ slot: "animal" }, { slot: "position" }, { slot: "furniture" }],
    en: "The {animal} is {position} the {furniture}.",
    examples: [
      "Con chó ở trên cái bàn. (The dog is on the table.)",
      "Con mèo ở trong cái hộp. (The cat is in the box.)",
      "Con gà ở kế bên con bò. (The chicken is next to the cow.)",
    ],
  },
  {
    title: "Between: A ở giữa B và C",
    point: "Something between two things: 'A ở giữa B và C'.",
    parts: [
      { slot: "animal" },
      "ở giữa",
      { slot: "furniture" },
      "và",
      { slot: "noun" },
    ],
    en: "The {animal} is between the {furniture} and the {noun}.",
    examples: [
      "Cuốn sách ở giữa con mèo và con chó.",
      "Con ong ở giữa con bọ và bông hoa.",
      "Cái bàn ở giữa tivi và ghế sofa.",
    ],
  },
  {
    title: "Asking where: Noun + ở đâu?",
    point: "Ask where something is by putting 'ở đâu?' at the end of the sentence.",
    parts: [{ slot: "noun" }, "ở đâu?"],
    en: "Where is the {noun}?",
    examples: [
      "Cái cửa ở đâu?",
      "Con mèo ở đâu?",
      "Con chim ở đâu vậy?",
    ],
  },
  {
    title: "Colours: Noun + màu",
    point:
      "The colour comes after the noun. The colour words already include 'màu' (màu đỏ, màu vàng…).",
    parts: [{ slot: "noun" }, { slot: "color" }],
    en: "The {noun} is {color}.",
    examples: [
      "Bông hoa màu đỏ. (Red flower)",
      "Cái bàn màu nâu.",
      "Cầu tuột màu xanh dương.",
    ],
  },
  {
    title: "Asking colours: Noun + màu gì?",
    point: "Ask an object's colour with 'màu gì?' right after the noun.",
    parts: [{ slot: "noun" }, "màu gì?"],
    en: "What colour is the {noun}?",
    examples: [
      "Cái giường màu gì?",
      "Con mèo màu gì?",
      "Xe hơi màu gì?",
    ],
  },
  {
    title: "Confirming: … phải không?",
    point:
      "Turn a statement into a yes/no question with 'phải không?'. Answer 'phải' or 'không phải'.",
    parts: ["đây là", { slot: "noun" }, "phải không?"],
    en: "This is a {noun}, right?",
    examples: [
      "Đây là xe hơi phải không?",
      "Cái cặp màu đỏ phải không?",
      "Đây là gấu bông phải không?",
    ],
  },
  {
    title: "True or false: … đúng hay sai?",
    point:
      "Ask whether a statement is true with 'đúng hay sai?' at the end. Answer 'đúng' or 'sai'.",
    parts: [
      { slot: "animal" },
      { slot: "position" },
      { slot: "furniture" },
      "đúng hay sai?",
    ],
    en: "The {animal} is {position} the {furniture} — true or false?",
    examples: [
      "Con mèo ở trên ghế sofa đúng hay sai?",
      "Cái bàn ở kế bên cửa sổ đúng hay sai?",
      "Con chim ở dưới cái bàn, đúng hay sai?",
    ],
  },
  {
    title: "Counting: có + number + noun",
    point:
      "State a quantity with 'có' + number + noun. Southern Vietnamese often keeps a classifier (con, cái).",
    parts: ["có", { slot: "number" }, { slot: "animal" }],
    en: "There are {number} {animal}.",
    examples: [
      "Có hai xích đu.",
      "Có năm con heo.",
      "Có bốn con diều.",
    ],
  },
  {
    title: "How many: có mấy + noun?",
    point: "Ask 'how many' (for small numbers) with 'có mấy' + noun.",
    parts: ["có mấy", { slot: "noun" }, "?"],
    en: "How many {noun} are there?",
    examples: [
      "Có mấy xe hơi?",
      "Bạn này có mấy cái răng?",
      "Gia đình con có mấy người?",
    ],
  },
  {
    title: "Likes / dislikes: thích / không thích",
    point:
      "'thích' = like, 'không thích' = don't like. Use before a noun or a verb like 'chơi' (play) or 'ăn' (eat).",
    parts: [{ slot: "person" }, "thích", { slot: "food" }],
    en: "{person} likes {food}.",
    examples: [
      "Con thích chơi búp bê.",
      "Ba con thích ăn phở.",
      "Lisa không thích ăn kem.",
    ],
  },
  {
    title: "Asking preference: … thích … không?",
    point:
      "Ask if someone likes something: put 'thích' before the noun and 'không?' at the end.",
    parts: [{ slot: "person" }, "thích", { slot: "toy" }, "không?"],
    en: "Does {person} like the {toy}?",
    examples: [
      "Con thích chơi diều không?",
      "Ti thích bác sĩ không?",
      "Cô thích chơi xe hơi không?",
    ],
  },
  {
    title: "This is: đây là + noun",
    point: "Point something out with 'đây là' + noun. There is no 'a/an' in Vietnamese.",
    parts: ["đây là", { slot: "noun" }],
    en: "This is a {noun}.",
    examples: [
      "Đây là con ngựa.",
      "Đây là cái mũi.",
      "Đây là ba.",
    ],
  },
  {
    title: "Possession: … của …",
    point: "Show possession with 'của' (of / 's) between the thing and the owner.",
    parts: ["đây là", { slot: "animal" }, "của", { slot: "person" }],
    en: "This is {person}'s {animal}.",
    examples: [
      "Đây là gia đình của con.",
      "Ông nội là ba của ba.",
      "Bà ngoại là mẹ của mẹ.",
    ],
  },
  {
    title: "Greetings: … khỏe không?",
    point:
      "Ask 'How are you?' with '[pronoun] khỏe không?'. The pronoun changes with who you are talking to.",
    parts: [{ slot: "person" }, "khỏe không?"],
    en: "How are you, {person}?",
    examples: [
      "Cô khỏe không?",
      "Ba khỏe không?",
      "Con khỏe không?",
    ],
  },
  {
    title: "Roles: Subject + là + job",
    point:
      "State someone's role with 'là' (to be). Use 'làm' before real professions; a student takes 'là'.",
    parts: [{ slot: "person" }, "là", { slot: "job" }],
    en: "{person} is a {job}.",
    examples: [
      "Cô là giáo viên.",
      "Theo là học sinh.",
      "Ba con là bác sĩ.",
    ],
  },
  {
    title: "Future job: muốn làm + job",
    point:
      "Say a dream job with '[subject] muốn làm' + job. 'muốn' = want, 'làm' = work as.",
    parts: [{ slot: "person" }, "muốn làm", { slot: "job" }],
    en: "{person} wants to be a {job}.",
    examples: [
      "Con muốn làm công an.",
      "Tom muốn làm tài xế.",
      "Con muốn làm bác sĩ.",
    ],
  },
  {
    title: "Who …? — Ai + verb",
    point: "'Ai' (who) as the subject asks who does something.",
    parts: ["ai chơi", { slot: "toy" }, "?"],
    en: "Who plays with the {toy}?",
    examples: [
      "Ai chơi bập bênh?",
      "Con bò chơi bập bênh.",
    ],
  },
];

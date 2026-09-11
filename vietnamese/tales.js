/*
 * tales.js — data for the "Tales" tab.
 *
 * Unlike the Story tab (random templates + a comprehension quiz), these
 * are short, hand-written retellings of classic fables — picked from a
 * list and just read/listened to, line by line, with an English gloss
 * and a short glossary of the new words each one introduces (words not
 * yet in cards.js). No quiz; the point is simple guided reading.
 *
 * TALES[i]:
 *   id       string     stable key, used to remember the last-picked tale
 *   title    string     Vietnamese title
 *   titleEn  string     English title
 *   lines    [{vi,en}]  the story, one sentence per line
 *   newWords [{vi,en}]  words this tale uses that aren't in cards.js yet
 */

window.TALES = [
  {
    id: "tortoise-hare",
    title: "Rùa Và Thỏ",
    titleEn: "The Tortoise and the Hare",
    lines: [
      { vi: "Rùa và Thỏ là bạn.", en: "Turtle and Rabbit are friends." },
      { vi: "Thỏ chạy nhanh.", en: "Rabbit runs fast." },
      { vi: "Rùa chạy chậm.", en: "Turtle runs slowly." },
      { vi: "Rùa và Thỏ đua với nhau.", en: "Turtle and Rabbit race each other." },
      { vi: "Thỏ chạy, rồi Thỏ ngủ.", en: "Rabbit runs, then Rabbit falls asleep." },
      { vi: "Rùa chạy chậm, nhưng Rùa không ngủ.", en: "Turtle runs slowly, but Turtle doesn't stop." },
      { vi: "Rùa thắng!", en: "Turtle wins!" },
      { vi: "Chậm mà chắc.", en: "Slow and steady." },
    ],
    newWords: [
      { vi: "con rùa", en: "turtle" },
      { vi: "con thỏ", en: "rabbit" },
      { vi: "chạy", en: "to run" },
      { vi: "nhanh", en: "fast" },
      { vi: "chậm", en: "slow" },
      { vi: "đua", en: "to race" },
      { vi: "ngủ", en: "to sleep" },
      { vi: "thắng", en: "to win" },
    ],
  },
  {
    id: "thirsty-crow",
    title: "Con Quạ Khát Nước",
    titleEn: "The Thirsty Crow",
    lines: [
      { vi: "Có một con quạ.", en: "There is a crow." },
      { vi: "Con quạ khát nước.", en: "The crow is thirsty." },
      { vi: "Con quạ thấy một cái bình.", en: "The crow sees a jar." },
      { vi: "Trong bình có nước, nhưng rất ít.", en: "There's water in the jar, but very little." },
      { vi: "Con quạ tìm đá.", en: "The crow looks for stones." },
      { vi: "Con quạ thả đá vào bình.", en: "The crow drops stones into the jar." },
      { vi: "Nước lên cao.", en: "The water rises up." },
      { vi: "Con quạ uống nước.", en: "The crow drinks the water." },
      { vi: "Con quạ rất vui!", en: "The crow is very happy!" },
    ],
    newWords: [
      { vi: "con quạ", en: "crow" },
      { vi: "khát nước", en: "thirsty" },
      { vi: "cái bình", en: "jar / pitcher" },
      { vi: "nước", en: "water" },
      { vi: "ít", en: "little / few" },
      { vi: "đá", en: "stone" },
      { vi: "thả", en: "to drop" },
      { vi: "vào", en: "into" },
      { vi: "lên", en: "to rise / go up" },
      { vi: "cao", en: "high / tall" },
      { vi: "uống", en: "to drink" },
    ],
  },
];

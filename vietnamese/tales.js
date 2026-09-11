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
  {
    id: "boy-who-cried-wolf",
    title: "Cậu Bé Nói Dối",
    titleEn: "The Boy Who Cried Wolf",
    lines: [
      { vi: "Có một cậu bé.", en: "There is a boy." },
      { vi: "Cậu bé có cừu.", en: "The boy has sheep." },
      { vi: "Cậu bé nói dối có chó sói.", en: "The boy lies that there's a wolf." },
      { vi: "Mọi người chạy đến, nhưng không có chó sói.", en: "Everyone runs over, but there's no wolf." },
      { vi: "Cậu bé cười vui.", en: "The boy laughs happily." },
      { vi: "Cậu bé nói dối lần nữa.", en: "The boy lies again." },
      { vi: "Mọi người không tin cậu bé nữa.", en: "Everyone doesn't believe the boy anymore." },
      { vi: "Rồi chó sói đến thật.", en: "Then the wolf really comes." },
      { vi: "Không ai đến giúp cậu bé.", en: "No one comes to help the boy." },
    ],
    newWords: [
      { vi: "cậu bé", en: "boy" },
      { vi: "con cừu", en: "sheep" },
      { vi: "nói dối", en: "to lie" },
      { vi: "mọi người", en: "everyone" },
      { vi: "chó sói", en: "wolf" },
      { vi: "cười", en: "to laugh" },
      { vi: "lần nữa", en: "again" },
      { vi: "tin", en: "to believe" },
      { vi: "đến", en: "to arrive / come" },
      { vi: "thật", en: "really / true" },
      { vi: "giúp", en: "to help" },
    ],
  },
  {
    id: "ant-and-cricket",
    title: "Kiến Và Dế",
    titleEn: "The Ant and the Cricket",
    lines: [
      { vi: "Mùa hè, Kiến làm việc.", en: "In summer, Ant works." },
      { vi: "Mùa hè, Dế chơi.", en: "In summer, Cricket plays." },
      { vi: "Kiến tìm thức ăn.", en: "Ant looks for food." },
      { vi: "Dế không thích làm việc.", en: "Cricket doesn't like working." },
      { vi: "Rồi mùa đông đến.", en: "Then winter comes." },
      { vi: "Trời lạnh. Dế đói.", en: "It's cold. Cricket is hungry." },
      { vi: "Kiến có thức ăn.", en: "Ant has food." },
      { vi: "Kiến chia thức ăn cho Dế.", en: "Ant shares food with Cricket." },
      { vi: "Dế cảm ơn Kiến.", en: "Cricket thanks Ant." },
    ],
    newWords: [
      { vi: "mùa hè", en: "summer" },
      { vi: "làm việc", en: "to work" },
      { vi: "con dế", en: "cricket" },
      { vi: "thức ăn", en: "food" },
      { vi: "mùa đông", en: "winter" },
      { vi: "trời", en: "sky / weather" },
      { vi: "lạnh", en: "cold" },
      { vi: "đói", en: "hungry" },
      { vi: "chia", en: "to share" },
      { vi: "cho", en: "for / to" },
      { vi: "cảm ơn", en: "thank you" },
    ],
  },
];

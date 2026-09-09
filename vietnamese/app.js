(function () {
  "use strict";

  var ALL = (window.CARDS || []).slice();

  var els = {
    scene: document.getElementById("scene"),
    card: document.getElementById("card"),
    front: document.getElementById("front"),
    back: document.getElementById("back"),
    category: document.getElementById("category"),
    order: document.getElementById("order"),
    wordFirst: document.getElementById("wordFirst"),
    autoplay: document.getElementById("autoplay"),
    prev: document.getElementById("prev"),
    next: document.getElementById("next"),
    flip: document.getElementById("flip"),
    reshuffle: document.getElementById("reshuffle"),
    counter: document.getElementById("counter"),
    empty: document.getElementById("empty"),
    grid: document.getElementById("grid"),
    game: document.getElementById("game"),
    story: document.getElementById("story"),
    grammar: document.getElementById("grammar"),
    viewStudy: document.getElementById("viewStudy"),
    viewGame: document.getElementById("viewGame"),
    viewStory: document.getElementById("viewStory"),
    viewGrammar: document.getElementById("viewGrammar"),
    cardsSub: document.getElementById("cardsSub"),
    subStudy: document.getElementById("subStudy"),
    subAll: document.getElementById("subAll"),
    ttsRate: document.getElementById("ttsRate"),
    controls: document.querySelector(".controls"),
    stage: document.querySelector(".stage"),
    statusbar: document.querySelector(".statusbar"),
  };

  // vi word -> card (first occurrence wins, so "ba" = dad not "three").
  var byVi = {};
  ALL.forEach(function (c) {
    if (!byVi[c.vi]) byVi[c.vi] = c;
  });

  var STORE_KEY = "vnflash.settings.v1";

  var state = {
    deck: [],
    index: 0,
    flipped: false,
    category: "all",
    order: "shuffle",
    wordFirst: false,
    autoplay: false,
    view: "study", // "study" | "all" (both under Flashcards) | "game" | "story" | "grammar"
    grammarPick: "all", // "all" or a GRAMMAR index (string) — which lesson the Grammar tab draws from
    rate: 0.75, // TTS speed
  };

  function setRate(r) {
    if (!(r > 0)) return;
    state.rate = r;
    if (els.ttsRate) els.ttsRate.value = String(r);
    saveSettings();
  }

  /* ---------------- settings persistence ---------------- */
  function loadSettings() {
    try {
      var s = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
      ["category", "order", "view", "grammarPick"].forEach(function (k) {
        if (typeof s[k] === "string") state[k] = s[k];
      });
      ["wordFirst", "autoplay"].forEach(function (k) {
        if (typeof s[k] === "boolean") state[k] = s[k];
      });
      if (typeof s.rate === "number" && s.rate > 0) state.rate = s.rate;
    } catch (e) {
      /* ignore */
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(
        STORE_KEY,
        JSON.stringify({
          category: state.category,
          order: state.order,
          wordFirst: state.wordFirst,
          autoplay: state.autoplay,
          view: state.view,
          grammarPick: state.grammarPick,
          rate: state.rate,
        })
      );
    } catch (e) {
      /* ignore */
    }
  }

  /* ---------------- speech ---------------- */
  var voices = [];
  function refreshVoices() {
    if (!("speechSynthesis" in window)) return;
    voices = window.speechSynthesis.getVoices() || [];
  }
  if ("speechSynthesis" in window) {
    refreshVoices();
    window.speechSynthesis.onvoiceschanged = refreshVoices;
  }

  function viUtterance(text, rate) {
    var u = new SpeechSynthesisUtterance(text);
    u.lang = "vi-VN";
    var v =
      voices.find(function (x) {
        return /vi[-_]?vn/i.test(x.lang);
      }) ||
      voices.find(function (x) {
        return x.lang && x.lang.toLowerCase().indexOf("vi") === 0;
      });
    if (v) u.voice = v;
    u.rate = rate || state.rate || 0.75;
    return u;
  }

  function speak(text) {
    if (!("speechSynthesis" in window) || !text) return;
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(viUtterance(text));
    } catch (e) {
      /* ignore */
    }
  }

  // Speak several lines back-to-back (used by the Story game).
  function speakLines(arr) {
    if (!("speechSynthesis" in window) || !arr || !arr.length) return;
    try {
      window.speechSynthesis.cancel();
      arr.forEach(function (t) {
        if (t) window.speechSynthesis.speak(viUtterance(t));
      });
    } catch (e) {
      /* ignore */
    }
  }

  // Play a card's recorded clip if it has one, else fall back to speech synthesis.
  var clip = null;
  function pronounce(card) {
    if (!card) return;
    if (card.audio) {
      try {
        window.speechSynthesis && window.speechSynthesis.cancel();
        if (clip) clip.pause();
        clip = new Audio(card.audio);
        clip.addEventListener("error", function () {
          speak(card.vi);
        });
        var p = clip.play();
        if (p && p.catch) p.catch(function () { speak(card.vi); });
        return;
      } catch (e) {
        /* fall through to speech synthesis */
      }
    }
    speak(card.vi);
  }

  /* ---------------- filters ---------------- */
  function buildFilterOptions() {
    var seen = {};
    var cats = [];
    ALL.forEach(function (c) {
      if (c.category && !seen[c.category]) {
        seen[c.category] = 1;
        cats.push(c.category);
      }
    });
    cats.sort(function (a, b) {
      return a.localeCompare(b);
    });

    els.category.innerHTML = '<option value="all">All categories</option>';
    cats.forEach(function (c) {
      var o = document.createElement("option");
      o.value = c;
      o.textContent = c;
      els.category.appendChild(o);
    });
  }

  // Warm the browser cache so a card's picture is ready before it's shown.
  var imgCache = {};
  function preload(url) {
    if (!url || imgCache[url]) return;
    var im = new Image();
    im.decoding = "async";
    im.src = url;
    imgCache[url] = im;
  }

  function preloadDeck(deck) {
    var i = 0;
    (function chunk() {
      var end = Math.min(i + 8, deck.length);
      for (; i < end; i++) preload(deck[i].image);
      if (i < deck.length) setTimeout(chunk, 150);
    })();
  }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i];
      arr[i] = arr[j];
      arr[j] = t;
    }
    return arr;
  }

  function pickN(arr, n) {
    var copy = arr.slice();
    shuffle(copy);
    return copy.slice(0, n);
  }

  function buildDeck() {
    var deck = ALL.filter(function (c) {
      return state.category === "all" || c.category === state.category;
    });
    if (state.order === "shuffle" || state.order === "random") shuffle(deck);
    state.deck = deck;
    state.index = 0;
    state.flipped = false;
    preloadDeck(deck);
    renderInstant();
  }

  /* ---------------- rendering ---------------- */
  function imageFace(card) {
    var wrap = document.createElement("div");
    wrap.className = "card__face-inner";

    var img = document.createElement("img");
    img.className = "card__img";
    img.alt = "";
    img.src = card.image || "";
    img.addEventListener("error", function () {
      img.remove();
      var fb = document.createElement("div");
      fb.className = "card__img-fallback";
      fb.textContent = card.en;
      wrap.appendChild(fb);
    });

    wrap.appendChild(img);
    return wrap;
  }

  function wordFace(card) {
    var wrap = document.createElement("div");
    wrap.className = "card__face-inner";

    var vi = document.createElement("div");
    vi.className = "card__vi";
    vi.textContent = card.vi;

    var emoji = null;
    if (card.emoji) {
      emoji = document.createElement("div");
      emoji.className = "card__emoji";
      emoji.textContent = card.emoji;
    }

    var speakBtn = document.createElement("button");
    speakBtn.className = "speak";
    speakBtn.type = "button";
    speakBtn.setAttribute("aria-label", "Play pronunciation");
    speakBtn.textContent = "🔊";
    speakBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      pronounce(card);
    });

    if (emoji) wrap.appendChild(emoji);
    wrap.appendChild(vi);
    if (card.note) {
      var note = document.createElement("div");
      note.className = "card__note";
      note.textContent = card.note;
      wrap.appendChild(note);
    }
    wrap.appendChild(speakBtn);
    return wrap;
  }

  function wordIsVisible() {
    // XOR: word on front when wordFirst; visible when NOT flipped in that case.
    return state.flipped !== state.wordFirst;
  }

  function render() {
    var hasCards = state.deck.length > 0;
    els.scene.hidden = !hasCards;
    els.empty.hidden = hasCards;
    els.prev.disabled = !hasCards;
    els.next.disabled = !hasCards;
    els.flip.disabled = !hasCards;

    if (!hasCards) {
      els.counter.textContent = "0 / 0";
      return;
    }

    var card = state.deck[state.index];
    els.front.innerHTML = "";
    els.back.innerHTML = "";
    els.front.appendChild(state.wordFirst ? wordFace(card) : imageFace(card));
    els.back.appendChild(state.wordFirst ? imageFace(card) : wordFace(card));
    els.card.classList.toggle("is-flipped", state.flipped);
    els.counter.textContent = state.index + 1 + " / " + state.deck.length;
  }

  // Re-render and settle the flip state with no transition, so moving to a
  // new card never shows the previous card rotating (which would briefly
  // reveal the incoming card's back face).
  function renderInstant() {
    els.card.classList.add("no-anim");
    render();
    void els.card.offsetWidth; // force reflow
    els.card.classList.remove("no-anim");
  }

  /* ---------------- all-cards grid view ---------------- */
  function tile(card) {
    var t = document.createElement("div");
    t.className = "tile";

    if (card.emoji) {
      var e = document.createElement("div");
      e.className = "tile__emoji";
      e.textContent = card.emoji;
      t.appendChild(e);
    }

    var vi = document.createElement("div");
    vi.className = "tile__vi";
    vi.textContent = card.vi;
    t.appendChild(vi);

    var en = document.createElement("div");
    en.className = "tile__en";
    en.textContent = card.en;
    t.appendChild(en);

    if (card.note) {
      var note = document.createElement("div");
      note.className = "tile__note";
      note.textContent = card.note;
      t.appendChild(note);
    }

    var b = document.createElement("button");
    b.className = "speak";
    b.type = "button";
    b.textContent = "🔊";
    b.setAttribute("aria-label", "Play pronunciation of " + card.vi);
    b.addEventListener("click", function () {
      pronounce(card);
    });
    t.appendChild(b);

    return t;
  }

  function renderGrid() {
    // Always every card, regardless of the Study-view category filter.
    els.grid.innerHTML = "";

    if (!ALL.length) {
      var p = document.createElement("p");
      p.className = "grid__empty";
      p.textContent = "No cards.";
      els.grid.appendChild(p);
      return;
    }

    // Group by category, keeping first-seen order.
    var order = [];
    var groups = {};
    ALL.forEach(function (c) {
      if (!groups[c.category]) {
        groups[c.category] = [];
        order.push(c.category);
      }
      groups[c.category].push(c);
    });

    order.forEach(function (cat) {
      var group = document.createElement("section");
      group.className = "grid__group";

      var title = document.createElement("h2");
      title.className = "grid__group-title";
      title.textContent = cat + " · " + groups[cat].length;
      group.appendChild(title);

      var wrap = document.createElement("div");
      wrap.className = "grid__cards";
      groups[cat].forEach(function (c) {
        wrap.appendChild(tile(c));
      });
      group.appendChild(wrap);

      els.grid.appendChild(group);
    });
  }

  /* ---------------- "Build" game (sentence scramble) ---------------- */
  // Patterns carry a `level` (rough length/difficulty) but the game no longer
  // ramps — every round is a random pick across all levels.
  var PATTERNS = (window.PATTERNS || []).slice();

  // Slots are filled from the study cards, so every category feeds the game.
  // Each slot lists the card categories whose words fit it grammatically;
  // "noun" ("đây là ___") takes everything except the categories that don't
  // work after "this is".
  var SLOT_CATS = {
    animal: ["Animals"],
    color: ["Colors"],
    food: ["Food"],
    person: ["Family", "Jobs"],
    position: ["Position words"],
    furniture: ["Home", "Playground"],
    number: ["Numbers"],
    job: ["Jobs"],
    toy: ["Toys"],
  };
  var NOUN_SKIP = {
    "Actions & feelings": 1,
    "Colors": 1,
    "Position words": 1,
    "Numbers": 1,
    "Phrases": 1,
    "Descriptions": 1,
  };

  var SLOTS = (function () {
    var out = { noun: [] };
    Object.keys(SLOT_CATS).forEach(function (slot) {
      out[slot] = [];
    });
    var seen = {}; // slot -> {vi: 1}
    Object.keys(SLOT_CATS).forEach(function (slot) {
      seen[slot] = {};
    });
    var seenNoun = {};
    ALL.forEach(function (c) {
      Object.keys(SLOT_CATS).forEach(function (slot) {
        if (SLOT_CATS[slot].indexOf(c.category) >= 0 && !seen[slot][c.vi]) {
          seen[slot][c.vi] = 1;
          out[slot].push(c.vi);
        }
      });
      if (!NOUN_SKIP[c.category] && !seenNoun[c.vi]) {
        seenNoun[c.vi] = 1;
        out.noun.push(c.vi);
      }
    });
    // let sentences.js SLOTS fill any slot the cards didn't cover
    if (window.SLOTS) {
      Object.keys(window.SLOTS).forEach(function (k) {
        if (!out[k] || !out[k].length) out[k] = window.SLOTS[k].slice();
      });
    }
    return out;
  })();

  var game = {
    targetVi: [], // correct word order
    prompt: "", // English
    tiles: [], // {id, vi, card}
    bank: [], // tiles not yet placed
    answer: [], // tiles placed, in order
    solved: false,
  };

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Fill a template (parts + en) from the study-card slots. Shared by the
  // "Build" game and the "Grammar" tab.
  //   -> { vi: [words], prompt: "English gloss" }
  function fillPattern(pat) {
    var chosen = {};
    var vi = [];
    (pat.parts || []).forEach(function (part) {
      if (typeof part === "string") {
        vi.push(part);
        return;
      }
      var w = pick(SLOTS[part.slot] || []);
      if (w == null) return;
      chosen[part.slot] = byVi[w] || { vi: w, en: w };
      vi.push(w);
    });
    var prompt = String(pat.en || "").replace(/\{(\w+)\}/g, function (_, s) {
      return chosen[s] ? chosen[s].en : s;
    });
    prompt = prompt.charAt(0).toUpperCase() + prompt.slice(1);
    return { vi: vi, prompt: prompt };
  }

  function newRound() {
    if (!PATTERNS.length) {
      els.game.innerHTML =
        '<p class="game__empty">No sentence patterns found. Add some in sentences.js.</p>';
      return;
    }

    var filled = fillPattern(pick(PATTERNS));
    var vi = filled.vi;

    game.prompt = filled.prompt;
    game.targetVi = vi;
    game.tiles = vi.map(function (w, i) {
      return { id: i, vi: w, card: byVi[w] || null };
    });

    // Shuffle the bank; avoid handing back the already-correct order.
    do {
      game.bank = shuffle(game.tiles.slice());
    } while (
      vi.length > 1 &&
      game.bank.every(function (t, i) {
        return t.id === i;
      })
    );
    game.answer = [];
    game.solved = false;
    renderGame();
  }

  function gameTile(t, where) {
    var wrap = document.createElement("div");
    wrap.className = "gtile";
    wrap.setAttribute("role", "button");
    wrap.tabIndex = 0;

    var main = document.createElement("span");
    main.className = "gtile__main";
    if (t.card && t.card.emoji) {
      var e = document.createElement("span");
      e.className = "gtile__emoji";
      e.textContent = t.card.emoji;
      main.appendChild(e);
    }
    var w = document.createElement("span");
    w.className = "gtile__vi";
    w.textContent = t.vi;
    main.appendChild(w);
    wrap.appendChild(main);

    var spk = document.createElement("button");
    spk.type = "button";
    spk.className = "gtile__speak";
    spk.textContent = "🔊";
    spk.setAttribute("aria-label", "Hear " + t.vi);
    spk.addEventListener("click", function (ev) {
      ev.stopPropagation();
      pronounce(t.card || { vi: t.vi });
    });
    wrap.appendChild(spk);

    function move() {
      if (game.solved) return;
      if (where === "bank") {
        game.answer.push(t);
        game.bank = game.bank.filter(function (x) {
          return x !== t;
        });
      } else {
        game.bank.push(t);
        game.answer = game.answer.filter(function (x) {
          return x !== t;
        });
      }
      renderGame();
      if (where === "bank" && game.answer.length === game.tiles.length) {
        checkAnswer();
      }
    }

    wrap.addEventListener("click", move);
    wrap.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        move();
      }
    });
    return wrap;
  }

  function checkAnswer() {
    var right = game.answer.every(function (t, i) {
      return t.vi === game.targetVi[i];
    });
    if (right) {
      game.solved = true;
      renderGame(true);
      speak(game.targetVi.join(" "));
    } else {
      renderGame(false);
    }
  }

  function renderGame(result) {
    var wrap = document.createElement("div");
    wrap.className = "game__inner";

    var prompt = document.createElement("p");
    prompt.className = "game__prompt";
    prompt.textContent = game.prompt;
    wrap.appendChild(prompt);

    var answer = document.createElement("div");
    answer.className = "game__answer";
    if (result === true) answer.classList.add("is-right");
    if (result === false) answer.classList.add("is-wrong");
    if (!game.answer.length) {
      var ph = document.createElement("span");
      ph.className = "game__placeholder";
      ph.textContent = "Tap the words in order";
      answer.appendChild(ph);
    } else {
      game.answer.forEach(function (t) {
        answer.appendChild(gameTile(t, "answer"));
      });
    }
    wrap.appendChild(answer);

    var bank = document.createElement("div");
    bank.className = "game__bank";
    game.bank.forEach(function (t) {
      bank.appendChild(gameTile(t, "bank"));
    });
    wrap.appendChild(bank);

    var actions = document.createElement("div");
    actions.className = "game__actions";
    if (result === true) {
      var praise = document.createElement("span");
      praise.className = "game__praise";
      praise.textContent = "Giỏi! 🎉";
      actions.appendChild(praise);

      var replay = document.createElement("button");
      replay.type = "button";
      replay.className = "btn";
      replay.textContent = "🔊 Replay";
      replay.addEventListener("click", function () {
        speak(game.targetVi.join(" "));
      });
      actions.appendChild(replay);

      var next = document.createElement("button");
      next.type = "button";
      next.className = "btn btn--primary";
      next.textContent = "Next →";
      next.addEventListener("click", newRound);
      actions.appendChild(next);
    } else {
      if (result === false) {
        var hint = document.createElement("span");
        hint.className = "game__hint";
        hint.textContent = "Not quite — tap a word to send it back.";
        actions.appendChild(hint);
      }
      var skip = document.createElement("button");
      skip.type = "button";
      skip.className = "btn";
      skip.textContent = "Skip";
      skip.addEventListener("click", function () {
        newRound();
      });
      actions.appendChild(skip);
    }
    wrap.appendChild(actions);

    els.game.innerHTML = "";
    els.game.appendChild(wrap);
  }

  /* ---------------- "Story" game (listening comprehension) ---------------- */
  var STORIES = (window.STORIES || []).slice();
  var STORY_SLOTS = window.STORY_SLOTS || {};
  var TONE_SETS = (window.TONE_SETS || []).slice();
  // Stories carry a `level` but the mode no longer ramps — each round is a
  // random pick across all of them. `round` is still tracked so every 4th
  // round can be a tone-listening round instead.

  var story = {
    mode: "story", // "story" | "tone"
    round: 0,
    lines: [], // filled story sentences
    questions: [], // [{ q, en, aEn, options:[{vi}], answer, line }]
    qIndex: 0,
    tone: null, // { items, heard, gloss }
    showText: false,
    revealed: false, // transcript stays visible once first question is solved
    wrong: [],
    solved: false, // current question solved
  };

  var STORY_NUM_EN = {
    "một": "one", "hai": "two", "ba": "three", "bốn": "four",
    "năm": "five", "sáu": "six",
  };
  var STORY_ADULT_EN = {
    "chú": "man", "cô": "woman", "ông": "old man", "bà": "old woman",
  };

  function fillStr(str, map) {
    return String(str).replace(/\{(\w+)\}/g, function (_, name) {
      return map[name] != null ? map[name] : name;
    });
  }

  // Slot-aware English for a word: number slots use the count map (so "ba"
  // reads "three", not "dad"), the adult slot uses "man/woman" rather than the
  // card's fuller gloss; everything else uses the card's English.
  function enOf(v, slot) {
    if (slot === "count") return STORY_NUM_EN[v] || v;
    if (slot === "adult") return STORY_ADULT_EN[v] || v;
    var c = byVi[v];
    return c && c.en ? c.en : v;
  }

  function buildStory(tpl) {
    var vals = {};
    var enVals = {};
    var usedBySlot = {};
    Object.keys(tpl.vars).forEach(function (name) {
      var slot = tpl.vars[name];
      var poolAll = STORY_SLOTS[slot] || [];
      var used = usedBySlot[slot] || [];
      var fresh = poolAll.filter(function (x) {
        return used.indexOf(x) < 0;
      });
      var v = pick(fresh.length ? fresh : poolAll);
      vals[name] = v;
      enVals[name] = enOf(v, slot);
      usedBySlot[slot] = used.concat([v]);
    });

    story.lines = tpl.lines.map(function (l) {
      return fillStr(l, vals);
    });

    story.questions = tpl.questions.map(function (qt) {
      var slot = tpl.vars[qt.ask];
      var correctVal = vals[qt.ask];
      var correctPhrase = fillStr(qt.a, vals);

      var inStory = (usedBySlot[slot] || []).filter(function (v) {
        return v !== correctVal;
      });
      var global = (STORY_SLOTS[slot] || []).filter(function (v) {
        return v !== correctVal && inStory.indexOf(v) < 0;
      });
      var dvals = pickN(inStory, 3);
      if (dvals.length < 3) dvals = dvals.concat(pickN(global, 3 - dvals.length));

      var phrases = [correctPhrase].concat(
        dvals.map(function (dv) {
          var v2 = {};
          Object.keys(vals).forEach(function (k) {
            v2[k] = vals[k];
          });
          v2[qt.ask] = dv;
          return fillStr(qt.a, v2);
        })
      );

      var opts = shuffle(phrases).map(function (s) {
        return { vi: s };
      });
      var ans = null;
      opts.forEach(function (o) {
        if (o.vi === correctPhrase) ans = o;
      });

      return {
        q: fillStr(qt.q, vals),
        en: fillStr(qt.qEn, enVals),
        aEn: qt.aEn ? fillStr(qt.aEn, enVals) : "",
        options: opts,
        answer: ans,
        line: typeof qt.line === "number" ? qt.line : -1,
      };
    });
  }

  function newStoryRound() {
    if (!STORIES.length) {
      els.story.innerHTML =
        '<p class="game__empty">No stories found. Add some in stories.js.</p>';
      return;
    }

    story.round += 1;
    story.wrong = [];
    story.solved = false;
    story.qIndex = 0;
    story.showText = false;
    story.revealed = false;

    var doTone = TONE_SETS.length && story.round % 4 === 0;
    if (doTone) {
      story.mode = "tone";
      var set = pick(TONE_SETS);
      var heard = pick(set.items);
      story.tone = { items: set.items, heard: heard, gloss: set.gloss };
      renderStory();
      speak(heard);
    } else {
      story.mode = "story";
      buildStory(pick(STORIES));
      renderStory();
      speakLines(story.lines);
    }
  }

  function pickStoryOption(opt) {
    if (story.solved) return;
    var q = story.questions[story.qIndex];
    if (opt === q.answer) {
      story.solved = true;
      story.revealed = true;
      renderStory();
      speak(q.answer.vi);
    } else {
      if (story.wrong.indexOf(opt) < 0) story.wrong.push(opt);
      renderStory();
    }
  }

  function pickToneOption(word) {
    if (story.solved) return;
    if (word === story.tone.heard) {
      story.solved = true;
      renderStory();
    } else {
      if (story.wrong.indexOf(word) < 0) story.wrong.push(word);
      renderStory();
    }
  }

  function nextStoryQuestion() {
    if (story.qIndex < story.questions.length - 1) {
      story.qIndex += 1;
      story.solved = false;
      story.wrong = [];
      renderStory();
    } else {
      newStoryRound();
    }
  }

  function optionTile(label, onPick, marks) {
    var tile = document.createElement("div");
    tile.className = "gtile gtile--option";
    tile.setAttribute("role", "button");
    tile.tabIndex = 0;
    if (marks && marks.right) tile.classList.add("is-right");
    if (marks && marks.wrong) tile.classList.add("is-wrong");

    var main = document.createElement("span");
    main.className = "gtile__main";
    var vi = document.createElement("span");
    vi.className = "gtile__vi";
    vi.textContent = label;
    main.appendChild(vi);
    tile.appendChild(main);

    var spk = document.createElement("button");
    spk.type = "button";
    spk.className = "gtile__speak";
    spk.textContent = "🔊";
    spk.setAttribute("aria-label", "Hear " + label);
    spk.addEventListener("click", function (ev) {
      ev.stopPropagation();
      speak(label);
    });
    tile.appendChild(spk);

    tile.addEventListener("click", onPick);
    tile.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        onPick();
      }
    });
    return tile;
  }

  function renderStory() {
    var wrap = document.createElement("div");
    wrap.className = "game__inner";

    if (story.mode === "tone") {
      renderToneRound(wrap);
    } else {
      renderStoryRound(wrap);
    }

    els.story.innerHTML = "";
    els.story.appendChild(wrap);
  }

  function playButton(playLabel, onPlay) {
    var play = document.createElement("button");
    play.type = "button";
    play.className = "btn btn--primary story__play";
    play.textContent = playLabel;
    play.addEventListener("click", onPlay);
    return play;
  }

  function renderStoryRound(wrap) {
    wrap.appendChild(
      playButton("▶  Play story", function () {
        speakLines(story.lines);
      })
    );

    var revealAll = story.showText || story.revealed;

    if (!story.revealed) {
      var toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "btn story__toggle";
      toggle.textContent = story.showText ? "Hide text" : "Show text";
      toggle.addEventListener("click", function () {
        story.showText = !story.showText;
        renderStory();
      });
      wrap.appendChild(toggle);
    }

    if (revealAll) {
      var q = story.questions[story.qIndex];
      var tr = document.createElement("div");
      tr.className = "story__transcript";
      story.lines.forEach(function (ln, i) {
        var row = document.createElement("div");
        row.className = "story__line";
        if (story.solved && q && q.line === i) row.classList.add("is-key");
        var t = document.createElement("span");
        t.textContent = ln;
        row.appendChild(t);
        var s = document.createElement("button");
        s.type = "button";
        s.className = "gtile__speak";
        s.textContent = "🔊";
        s.setAttribute("aria-label", "Hear this line");
        s.addEventListener("click", function () {
          speak(ln);
        });
        row.appendChild(s);
        tr.appendChild(row);
      });
      wrap.appendChild(tr);
    }

    var q2 = story.questions[story.qIndex];

    var meta = document.createElement("div");
    meta.className = "story__qmeta";
    meta.textContent =
      "Question " + (story.qIndex + 1) + " of " + story.questions.length;
    wrap.appendChild(meta);

    var qrow = document.createElement("div");
    qrow.className = "qgame__q";
    var qt = document.createElement("span");
    qt.textContent = q2.q;
    qrow.appendChild(qt);
    var qspk = document.createElement("button");
    qspk.type = "button";
    qspk.className = "gtile__speak";
    qspk.textContent = "🔊";
    qspk.setAttribute("aria-label", "Hear the question");
    qspk.addEventListener("click", function () {
      speak(q2.q);
    });
    qrow.appendChild(qspk);
    wrap.appendChild(qrow);

    var qen = document.createElement("p");
    qen.className = "qgame__en";
    qen.textContent = q2.en;
    wrap.appendChild(qen);

    var opts = document.createElement("div");
    opts.className = "qgame__options";
    q2.options.forEach(function (opt) {
      opts.appendChild(
        optionTile(
          opt.vi,
          function () {
            pickStoryOption(opt);
          },
          {
            right: story.solved && opt === q2.answer,
            wrong: story.wrong.indexOf(opt) >= 0,
          }
        )
      );
    });
    wrap.appendChild(opts);

    if (story.solved && q2.aEn) {
      var gloss = document.createElement("p");
      gloss.className = "qgame__gloss";
      gloss.textContent = q2.answer.vi + " — " + q2.aEn;
      wrap.appendChild(gloss);
    }

    var actions = document.createElement("div");
    actions.className = "game__actions";
    if (story.solved) {
      var last = story.qIndex === story.questions.length - 1;
      var praise = document.createElement("span");
      praise.className = "game__praise";
      praise.textContent = last ? "Giỏi! 🎉" : "✓";
      actions.appendChild(praise);

      var nx = document.createElement("button");
      nx.type = "button";
      nx.className = "btn btn--primary";
      nx.textContent = last ? "Next story →" : "Next question →";
      nx.addEventListener("click", nextStoryQuestion);
      actions.appendChild(nx);
    } else {
      if (story.wrong.length) {
        var hint = document.createElement("span");
        hint.className = "game__hint";
        hint.textContent = "Listen again and try another.";
        actions.appendChild(hint);
      }
      var skip = document.createElement("button");
      skip.type = "button";
      skip.className = "btn";
      skip.textContent = "Skip story";
      skip.addEventListener("click", function () {
        newStoryRound();
      });
      actions.appendChild(skip);
    }
    wrap.appendChild(actions);
  }

  function renderToneRound(wrap) {
    wrap.appendChild(
      playButton("▶  Play", function () {
        speak(story.tone.heard);
      })
    );

    var qrow = document.createElement("div");
    qrow.className = "qgame__q";
    qrow.textContent = "Which did you hear?";
    wrap.appendChild(qrow);

    var opts = document.createElement("div");
    opts.className = "qgame__options";
    story.tone.items.forEach(function (word) {
      opts.appendChild(
        optionTile(
          word,
          function () {
            pickToneOption(word);
          },
          {
            right: story.solved && word === story.tone.heard,
            wrong: story.wrong.indexOf(word) >= 0,
          }
        )
      );
    });
    wrap.appendChild(opts);

    if (story.solved) {
      var gl = document.createElement("div");
      gl.className = "story__transcript";
      story.tone.items.forEach(function (word) {
        var row = document.createElement("div");
        row.className = "story__line";
        if (word === story.tone.heard) row.classList.add("is-key");
        row.textContent = word + " — " + (story.tone.gloss[word] || "");
        gl.appendChild(row);
      });
      wrap.appendChild(gl);
    }

    var actions = document.createElement("div");
    actions.className = "game__actions";
    if (story.solved) {
      var praise = document.createElement("span");
      praise.className = "game__praise";
      praise.textContent = "Giỏi! 🎉";
      actions.appendChild(praise);
      var nx = document.createElement("button");
      nx.type = "button";
      nx.className = "btn btn--primary";
      nx.textContent = "Next →";
      nx.addEventListener("click", newStoryRound);
      actions.appendChild(nx);
    } else {
      if (story.wrong.length) {
        var hint = document.createElement("span");
        hint.className = "game__hint";
        hint.textContent = "Play it again and try another.";
        actions.appendChild(hint);
      }
      var skip = document.createElement("button");
      skip.type = "button";
      skip.className = "btn";
      skip.textContent = "Skip";
      skip.addEventListener("click", function () {
        newStoryRound();
      });
      actions.appendChild(skip);
    }
    wrap.appendChild(actions);
  }

  /* ---------------- "Grammar" tab (generated study sentences) ---------------- */
  var GRAMMAR = (window.GRAMMAR || []).slice();
  var lesson = { g: null, vi: "", en: "" };

  // Join filled parts into a sentence: tighten spaces before punctuation and
  // capitalise the first letter.
  function joinVi(parts) {
    var s = parts
      .join(" ")
      .replace(/\s+([?.,!:;])/g, "$1")
      .trim();
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function newGrammarRound() {
    if (!GRAMMAR.length) {
      els.grammar.innerHTML =
        '<p class="game__empty">No grammar lessons found. Add some in grammar.js.</p>';
      return;
    }
    // "all" -> a fresh random lesson each round; otherwise the picked one.
    lesson.g =
      state.grammarPick === "all"
        ? pick(GRAMMAR)
        : GRAMMAR[+state.grammarPick] || pick(GRAMMAR);
    var filled = fillPattern(lesson.g);
    lesson.vi = joinVi(filled.vi);
    lesson.en = filled.prompt;
    renderGrammar();
  }

  function renderGrammar() {
    var g = lesson.g;
    var wrap = document.createElement("div");
    wrap.className = "game__inner";

    var pickRow = document.createElement("label");
    pickRow.className = "grammar__pick";
    var pickLabel = document.createElement("span");
    pickLabel.textContent = "Lesson";
    pickRow.appendChild(pickLabel);
    var sel = document.createElement("select");
    var optAll = document.createElement("option");
    optAll.value = "all";
    optAll.textContent = "All lessons";
    sel.appendChild(optAll);
    GRAMMAR.forEach(function (les, i) {
      var o = document.createElement("option");
      o.value = String(i);
      o.textContent = les.title;
      sel.appendChild(o);
    });
    sel.value = state.grammarPick;
    sel.addEventListener("change", function () {
      state.grammarPick = sel.value;
      saveSettings();
      newGrammarRound();
    });
    pickRow.appendChild(sel);
    wrap.appendChild(pickRow);

    var h = document.createElement("h2");
    h.className = "grammar__title";
    h.textContent = g.title;
    wrap.appendChild(h);

    var point = document.createElement("p");
    point.className = "grammar__point";
    point.textContent = g.point;
    wrap.appendChild(point);

    var sentence = document.createElement("div");
    sentence.className = "grammar__sentence";
    var stext = document.createElement("span");
    stext.className = "grammar__vi";
    stext.textContent = lesson.vi;
    sentence.appendChild(stext);
    var spk = document.createElement("button");
    spk.type = "button";
    spk.className = "gtile__speak";
    spk.textContent = "🔊";
    spk.setAttribute("aria-label", "Hear the sentence");
    spk.addEventListener("click", function () {
      speak(lesson.vi);
    });
    sentence.appendChild(spk);
    wrap.appendChild(sentence);

    var en = document.createElement("p");
    en.className = "grammar__en";
    en.textContent = lesson.en;
    wrap.appendChild(en);

    var actions = document.createElement("div");
    actions.className = "game__actions";
    var again = document.createElement("button");
    again.type = "button";
    again.className = "btn btn--primary";
    again.textContent = "New sentence";
    again.addEventListener("click", newGrammarRound);
    actions.appendChild(again);
    wrap.appendChild(actions);

    if (g.examples && g.examples.length) {
      var reftitle = document.createElement("p");
      reftitle.className = "grammar__reftitle";
      reftitle.textContent = "From the lesson";
      wrap.appendChild(reftitle);

      var ref = document.createElement("div");
      ref.className = "story__transcript";
      g.examples.forEach(function (ex) {
        var row = document.createElement("div");
        row.className = "story__line";
        var t = document.createElement("span");
        t.textContent = ex;
        row.appendChild(t);
        var b = document.createElement("button");
        b.type = "button";
        b.className = "gtile__speak";
        b.textContent = "🔊";
        b.setAttribute("aria-label", "Hear this example");
        b.addEventListener("click", function () {
          speak(ex.replace(/\s*\([^)]*\)\s*$/, ""));
        });
        row.appendChild(b);
        ref.appendChild(row);
      });
      wrap.appendChild(ref);
    }

    els.grammar.innerHTML = "";
    els.grammar.appendChild(wrap);
  }

  function setTab(btn, active) {
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-selected", String(active));
  }

  function setView(v) {
    var known = { study: 1, all: 1, game: 1, story: 1, grammar: 1 };
    state.view = known[v] ? v : "study";

    if ("speechSynthesis" in window) window.speechSynthesis.cancel();

    // Toggle visibility in place — these sections stay attached to the DOM
    // in their static index.html order. Detaching/reattaching them (as this
    // used to do) trips a WebKit bug where the flip card's 3D-transformed
    // faces and the category <select>'s dynamic options fail to repaint on
    // reinsertion, leaving the card and filters blank on mobile Safari.
    els.controls.hidden = state.view !== "study";
    els.stage.hidden = state.view !== "study";
    els.statusbar.hidden = state.view !== "study";
    els.grid.hidden = state.view !== "all";
    els.game.hidden = state.view !== "game";
    els.story.hidden = state.view !== "story";
    els.grammar.hidden = state.view !== "grammar";

    var inCards = state.view === "study" || state.view === "all";
    setTab(els.viewStudy, inCards);
    setTab(els.viewGame, state.view === "game");
    setTab(els.viewStory, state.view === "story");
    setTab(els.viewGrammar, state.view === "grammar");

    els.cardsSub.hidden = !inCards;
    setTab(els.subStudy, state.view === "study");
    setTab(els.subAll, state.view === "all");

    saveSettings();

    if (state.view === "study") renderInstant();
    else if (state.view === "all") renderGrid();
    else if (state.view === "game") newRound();
    else if (state.view === "story") newStoryRound();
    else newGrammarRound();
  }

  /* ---------------- actions ---------------- */
  function flip() {
    if (!state.deck.length) return;
    state.flipped = !state.flipped;
    els.card.classList.toggle("is-flipped", state.flipped);
    if (state.autoplay && wordIsVisible()) {
      pronounce(state.deck[state.index]);
    }
  }

  function go(delta) {
    if (!state.deck.length) return;
    var n = state.deck.length;
    var atEnd = delta > 0 && state.index === n - 1;
    state.index = (state.index + delta + n) % n;
    if (atEnd && state.order === "random") shuffle(state.deck);
    state.flipped = false;
    preload(state.deck[(state.index + 1) % n].image);
    preload(state.deck[(state.index - 1 + n) % n].image);
    renderInstant();
    if (state.autoplay && wordIsVisible()) {
      pronounce(state.deck[state.index]);
    }
  }

  /* ---------------- wiring ---------------- */
  function syncControls() {
    els.category.value = state.category;
    els.order.value = state.order;
    els.wordFirst.checked = state.wordFirst;
    els.autoplay.checked = state.autoplay;
    if (els.ttsRate) els.ttsRate.value = String(state.rate);
  }

  els.category.addEventListener("change", function () {
    state.category = els.category.value;
    saveSettings();
    buildDeck();
  });
  if (els.ttsRate) {
    els.ttsRate.addEventListener("change", function () {
      setRate(parseFloat(els.ttsRate.value));
    });
  }
  els.viewStudy.addEventListener("click", function () {
    // Land on whichever Flashcards sub-mode was last open.
    setView(state.view === "all" ? "all" : "study");
  });
  els.subStudy.addEventListener("click", function () {
    setView("study");
  });
  els.subAll.addEventListener("click", function () {
    setView("all");
  });
  els.viewGame.addEventListener("click", function () {
    setView("game");
  });
  els.viewStory.addEventListener("click", function () {
    setView("story");
  });
  els.viewGrammar.addEventListener("click", function () {
    setView("grammar");
  });
  els.order.addEventListener("change", function () {
    state.order = els.order.value;
    saveSettings();
    buildDeck();
  });
  els.wordFirst.addEventListener("change", function () {
    state.wordFirst = els.wordFirst.checked;
    state.flipped = false;
    saveSettings();
    renderInstant();
  });
  els.autoplay.addEventListener("change", function () {
    state.autoplay = els.autoplay.checked;
    saveSettings();
  });

  els.prev.addEventListener("click", function () {
    go(-1);
  });
  els.next.addEventListener("click", function () {
    go(1);
  });
  els.flip.addEventListener("click", flip);
  els.reshuffle.addEventListener("click", buildDeck);
  els.card.addEventListener("click", function () {
    if (suppressClick) {
      suppressClick = false;
      return;
    }
    flip();
  });

  document.addEventListener("keydown", function (e) {
    if (state.view !== "study") return;
    if (e.target && /^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(e.target.tagName)) return;
    switch (e.key) {
      case " ":
      case "Enter":
        e.preventDefault();
        flip();
        break;
      case "ArrowRight":
        go(1);
        break;
      case "ArrowLeft":
        go(-1);
        break;
      case "s":
      case "S":
        if (state.deck.length) pronounce(state.deck[state.index]);
        break;
      case "r":
      case "R":
        buildDeck();
        break;
    }
  });

  // Swipe / tap on the card scene.
  var sx = 0,
    sy = 0,
    tracking = false,
    suppressClick = false;
  els.scene.addEventListener("pointerdown", function (e) {
    // A new gesture starting means any previous swipe's suppressClick is
    // stale — mobile browsers don't always fire a click after a touch that
    // moved past the drag threshold, so it could still be sitting at true
    // and would otherwise eat this tap.
    suppressClick = false;
    sx = e.clientX;
    sy = e.clientY;
    tracking = true;
  });
  els.scene.addEventListener("pointerup", function (e) {
    if (!tracking) return;
    tracking = false;
    var dx = e.clientX - sx;
    var dy = e.clientY - sy;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      suppressClick = true;
      go(dx < 0 ? 1 : -1);
    }
  });

  /* ---------------- init ---------------- */
  if (!ALL.length) {
    els.empty.textContent = "No cards found. Add some in cards.js.";
    els.empty.hidden = false;
    els.scene.hidden = true;
    return;
  }

  loadSettings();
  buildFilterOptions();
  // Guard against a saved filter that no longer exists.
  if (
    state.category !== "all" &&
    !Array.prototype.some.call(els.category.options, function (o) {
      return o.value === state.category;
    })
  ) {
    state.category = "all";
  }
  syncControls();
  buildDeck();
  setView(state.view);
})();

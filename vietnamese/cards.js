/*
 * cards.js — your Vietnamese vocabulary. Edit this file to add words.
 *
 * Each entry is one card:
 *   category string   topic, e.g. "Animals" (used by the Category filter)
 *   vi       string   the Vietnamese word or phrase — keep the tone marks!
 *   en       string   the English meaning
 *   emoji    string   OPTIONAL emoji shown on the word side
 *   audio    string   OPTIONAL path to a pronunciation clip, e.g. "audio/con-cho.m4a".
 *                     When absent, the 🔊 button uses the browser's speech synthesis.
 *   image    string   URL to a picture, "https://..."
 *   note     string   OPTIONAL small hint shown under the English
 *
 * The images below are colored placeholders showing the English word.
 * Replace each `image:` URL with a real picture URL when you have one.
 * If an image fails to load, the card falls back to showing the English word.
 *
 * To add words:
 *   1. Add new { ... } lines below.
 *   2. git add cards.js && git commit -m "New vocab" && git push
 *   3. Cloudflare Pages redeploys automatically.
 *
 * Spellings are Southern Vietnamese (miền Nam).
 */

window.CARDS = [
  // -------------------- Actions & feelings --------------------
  { category: "Actions & feelings", vi: "ăn",          en: "to eat",   emoji: "🍽️", audio: "audio/an.wav", image: "https://placehold.co/600x800/0ea5e9/ffffff?text=to+eat" },
  { category: "Actions & feelings", vi: "chơi",        en: "to play",  audio: "audio/choi.m4a", image: "https://placehold.co/600x800/0ea5e9/ffffff?text=to+play" },
  { category: "Actions & feelings", vi: "thích",       en: "like",     emoji: "👍", audio: "audio/thich.m4a", image: "https://placehold.co/600x800/0ea5e9/ffffff?text=like" },
  { category: "Actions & feelings", vi: "không thích", en: "dislike",  emoji: "👎", audio: "audio/khong-thich.m4a", image: "https://placehold.co/600x800/0ea5e9/ffffff?text=dislike" },
  { category: "Actions & feelings", vi: "đếm",         en: "to count", emoji: "🧮", audio: "audio/dem.m4a", image: "https://placehold.co/600x800/0ea5e9/ffffff?text=to+count" },
  { category: "Actions & feelings", vi: "muốn",        en: "to want",  audio: "audio/muon.m4a", image: "https://placehold.co/600x800/0ea5e9/ffffff?text=to+want" },
  { category: "Actions & feelings", vi: "làm",         en: "to do / make", audio: "audio/lam.m4a", image: "https://placehold.co/600x800/0ea5e9/ffffff?text=to+do" },
  { category: "Actions & feelings", vi: "học",         en: "to study", emoji: "📚", audio: "audio/hoc.m4a", image: "https://placehold.co/600x800/0ea5e9/ffffff?text=to+study" },

  // -------------------- Animals --------------------
  { category: "Animals", vi: "con mèo",    en: "cat",       emoji: "🐱", audio: "audio/con-meo.m4a", image: "https://placehold.co/600x800/d97706/ffffff?text=cat" },
  { category: "Animals", vi: "con chó",    en: "dog",       emoji: "🐶", audio: "audio/con-cho.m4a", image: "https://placehold.co/600x800/d97706/ffffff?text=dog" },
  { category: "Animals", vi: "con cá",     en: "fish",      emoji: "🐟", image: "https://placehold.co/600x800/d97706/ffffff?text=fish" },
  { category: "Animals", vi: "con chim",   en: "bird",      emoji: "🐦", image: "https://placehold.co/600x800/d97706/ffffff?text=bird" },
  { category: "Animals", vi: "con ong",    en: "bee",       emoji: "🐝", image: "https://placehold.co/600x800/d97706/ffffff?text=bee" },
  { category: "Animals", vi: "con bọ",     en: "bug",       emoji: "🐛", image: "https://placehold.co/600x800/d97706/ffffff?text=bug" },
  { category: "Animals", vi: "sao biển",   en: "starfish",  image: "https://placehold.co/600x800/d97706/ffffff?text=starfish" },
  { category: "Animals", vi: "con gà",     en: "chicken",   emoji: "🐔", audio: "audio/con-ga.m4a", image: "https://placehold.co/600x800/d97706/ffffff?text=chicken" },
  { category: "Animals", vi: "con ngựa",   en: "horse",     emoji: "🐴", audio: "audio/con-ngua.m4a", image: "https://placehold.co/600x800/d97706/ffffff?text=horse" },
  { category: "Animals", vi: "con vịt",    en: "duck",      emoji: "🦆", image: "https://placehold.co/600x800/d97706/ffffff?text=duck" },
  { category: "Animals", vi: "con heo",    en: "pig",       emoji: "🐷", image: "https://placehold.co/600x800/d97706/ffffff?text=pig" },
  { category: "Animals", vi: "con khỉ",    en: "monkey",    emoji: "🐵", audio: "audio/con-khi.m4a", image: "https://placehold.co/600x800/d97706/ffffff?text=monkey" },
  { category: "Animals", vi: "con bò",     en: "cow",       emoji: "🐮", audio: "audio/con-bo.m4a", image: "https://placehold.co/600x800/d97706/ffffff?text=cow" },
  { category: "Animals", vi: "con bò sữa", en: "dairy cow", emoji: "🐄", image: "https://placehold.co/600x800/d97706/ffffff?text=dairy+cow" },
  { category: "Animals", vi: "con bướm",   en: "butterfly", emoji: "🦋", image: "https://placehold.co/600x800/d97706/ffffff?text=butterfly" },
  { category: "Animals", vi: "con ếch",    en: "frog",      emoji: "🐸", image: "https://placehold.co/600x800/d97706/ffffff?text=frog" },
  { category: "Animals", vi: "con dê",     en: "goat",      emoji: "🐐", image: "https://placehold.co/600x800/d97706/ffffff?text=goat" },
  { category: "Animals", vi: "con chuột",  en: "mouse",     emoji: "🐭", image: "https://placehold.co/600x800/d97706/ffffff?text=mouse" },

  // -------------------- Home --------------------
  { category: "Home", vi: "cái cửa",     en: "door",   emoji: "🚪", audio: "audio/cai-cua.m4a", image: "https://placehold.co/600x800/7c3aed/ffffff?text=door" },
  { category: "Home", vi: "cái cửa sổ",  en: "window", emoji: "🪟", audio: "audio/cai-cua-so.m4a", image: "https://placehold.co/600x800/7c3aed/ffffff?text=window" },
  { category: "Home", vi: "cái giường",  en: "bed",    emoji: "🛏️", audio: "audio/cai-giuong.m4a", image: "https://placehold.co/600x800/7c3aed/ffffff?text=bed" },
  { category: "Home", vi: "cái kệ",      en: "shelf",  audio: "audio/cai-ke.m4a", image: "https://placehold.co/600x800/7c3aed/ffffff?text=shelf" },
  { category: "Home", vi: "cái tivi", en: "TV",    emoji: "📺", audio: "audio/cai-tivi.m4a", image: "https://placehold.co/600x800/7c3aed/ffffff?text=TV" },
  { category: "Home", vi: "cái bàn",  en: "table",  audio: "audio/cai-ban.m4a", image: "https://placehold.co/600x800/7c3aed/ffffff?text=table" },
  { category: "Home", vi: "cái hộp",  en: "box",    emoji: "📦", audio: "audio/cai-hop.m4a", image: "https://placehold.co/600x800/7c3aed/ffffff?text=box" },
  { category: "Home", vi: "ghế sô pha", en: "sofa", emoji: "🛋️", audio: "audio/ghe-so-pha.m4a", image: "https://placehold.co/600x800/7c3aed/ffffff?text=sofa" },
  { category: "Home", vi: "cái tường",  en: "wall", emoji: "🧱", audio: "audio/cai-tuong.m4a", image: "https://placehold.co/600x800/7c3aed/ffffff?text=wall" },

  // -------------------- Toys --------------------
  { category: "Toys", vi: "búp bê",     en: "doll",       emoji: "🪆", audio: "audio/bup-be.m4a", image: "https://placehold.co/600x800/db2777/ffffff?text=doll" },
  { category: "Toys", vi: "trái banh",  en: "ball",       emoji: "⚽", audio: "audio/trai-banh.m4a", image: "https://placehold.co/600x800/db2777/ffffff?text=ball" },
  { category: "Toys", vi: "xếp hình",   en: "puzzle",     emoji: "🧩", audio: "audio/xep-hinh.m4a", image: "https://placehold.co/600x800/db2777/ffffff?text=puzzle" },
  { category: "Toys", vi: "gấu bông",   en: "teddy bear", emoji: "🧸", audio: "audio/gau-bong.m4a", image: "https://placehold.co/600x800/db2777/ffffff?text=teddy+bear" },
  { category: "Toys", vi: "con diều",   en: "kite",       emoji: "🪁", audio: "audio/con-dieu.m4a", image: "https://placehold.co/600x800/db2777/ffffff?text=kite" },
  { category: "Toys", vi: "đồ chơi",    en: "toy",        audio: "audio/do-choi.m4a", image: "https://placehold.co/600x800/db2777/ffffff?text=toy" },

  // -------------------- Transportation --------------------
  { category: "Transportation", vi: "xe hơi",  en: "car",     emoji: "🚗", audio: "audio/xe-hoi.m4a", image: "https://placehold.co/600x800/0369a1/ffffff?text=car" },
  { category: "Transportation", vi: "xe đạp",  en: "bicycle", emoji: "🚲", audio: "audio/xe-dap.m4a", image: "https://placehold.co/600x800/0369a1/ffffff?text=bicycle" },
  { category: "Transportation", vi: "xe lửa",  en: "train",   emoji: "🚂", audio: "audio/xe-lua.m4a", image: "https://placehold.co/600x800/0369a1/ffffff?text=train" },

  // -------------------- Playground --------------------
  { category: "Playground", vi: "bập bênh",   en: "seesaw", audio: "audio/bap-benh.m4a", image: "https://placehold.co/600x800/059669/ffffff?text=seesaw" },
  { category: "Playground", vi: "xích đu",    en: "swing",  audio: "audio/xich-du.m4a", image: "https://placehold.co/600x800/059669/ffffff?text=swing" },
  { category: "Playground", vi: "cầu tuột",   en: "slide",  emoji: "🛝", audio: "audio/cau-tuot.m4a", image: "https://placehold.co/600x800/059669/ffffff?text=slide" },
  { category: "Playground", vi: "cái ghế",    en: "bench",  emoji: "🪑", audio: "audio/cai-ghe.m4a", image: "https://placehold.co/600x800/059669/ffffff?text=bench" },

  // -------------------- Nature --------------------
  { category: "Nature", vi: "cái cây",  en: "tree",   emoji: "🌳", audio: "audio/cai-cay.m4a", image: "https://placehold.co/600x800/16a34a/ffffff?text=tree" },
  { category: "Nature", vi: "bông hoa", en: "flower", emoji: "🌸", audio: "audio/bong-hoa.m4a", image: "https://placehold.co/600x800/16a34a/ffffff?text=flower" },

  // -------------------- Body --------------------
  { category: "Body", vi: "đầu",      en: "head",     audio: "audio/dau.m4a", image: "https://placehold.co/600x800/e11d48/ffffff?text=head" },
  { category: "Body", vi: "tóc",      en: "hair",     emoji: "🦱", image: "https://placehold.co/600x800/e11d48/ffffff?text=hair" },
  { category: "Body", vi: "mắt",      en: "eyes",     emoji: "👀", audio: "audio/mat.m4a", image: "https://placehold.co/600x800/e11d48/ffffff?text=eyes" },
  { category: "Body", vi: "mũi",      en: "nose",     emoji: "👃", image: "https://placehold.co/600x800/e11d48/ffffff?text=nose" },
  { category: "Body", vi: "miệng",    en: "mouth",    emoji: "👄", audio: "audio/mieng.m4a", image: "https://placehold.co/600x800/e11d48/ffffff?text=mouth" },
  { category: "Body", vi: "răng",     en: "teeth",    emoji: "🦷", audio: "audio/rang.m4a", image: "https://placehold.co/600x800/e11d48/ffffff?text=teeth" },
  { category: "Body", vi: "lỗ tai",   en: "ears",     emoji: "👂", audio: "audio/lo-tai.m4a", image: "https://placehold.co/600x800/e11d48/ffffff?text=ears" },
  { category: "Body", vi: "tay",      en: "arm",      emoji: "💪", image: "https://placehold.co/600x800/e11d48/ffffff?text=arm" },
  { category: "Body", vi: "bàn tay",  en: "hand",     emoji: "✋", image: "https://placehold.co/600x800/e11d48/ffffff?text=hand" },
  { category: "Body", vi: "ngón tay", en: "finger",   emoji: "👆", image: "https://placehold.co/600x800/e11d48/ffffff?text=finger" },
  { category: "Body", vi: "chân",     en: "leg",      emoji: "🦵", image: "https://placehold.co/600x800/e11d48/ffffff?text=leg" },
  { category: "Body", vi: "bàn chân", en: "foot",     emoji: "🦶", image: "https://placehold.co/600x800/e11d48/ffffff?text=foot" },
  { category: "Body", vi: "ngón chân",en: "toe",      image: "https://placehold.co/600x800/e11d48/ffffff?text=toe" },
  { category: "Body", vi: "vai",      en: "shoulder", image: "https://placehold.co/600x800/e11d48/ffffff?text=shoulder" },
  { category: "Body", vi: "bụng",     en: "belly",    image: "https://placehold.co/600x800/e11d48/ffffff?text=belly" },

  // -------------------- Position words --------------------
  { category: "Position words", vi: "ở trên",       en: "on",       audio: "audio/o-tren.m4a", image: "https://placehold.co/600x800/4b5563/ffffff?text=on" },
  { category: "Position words", vi: "ở dưới",       en: "under",    audio: "audio/o-duoi.m4a", image: "https://placehold.co/600x800/4b5563/ffffff?text=under" },
  { category: "Position words", vi: "ở trong",      en: "in",       audio: "audio/o-trong.m4a", image: "https://placehold.co/600x800/4b5563/ffffff?text=in" },
  { category: "Position words", vi: "ở kế bên",     en: "next to",  audio: "audio/o-ke-ben.m4a", image: "https://placehold.co/600x800/4b5563/ffffff?text=next+to" },
  { category: "Position words", vi: "ở giữa",       en: "between",  audio: "audio/o-giua.m4a", image: "https://placehold.co/600x800/4b5563/ffffff?text=between" },
  { category: "Position words", vi: "phía trước",   en: "in front", audio: "audio/front.m4a", image: "https://placehold.co/600x800/4b5563/ffffff?text=in+front" },
  { category: "Position words", vi: "phía sau",     en: "in back",  audio: "audio/back.m4a", image: "https://placehold.co/600x800/4b5563/ffffff?text=in+back" },

  // -------------------- School --------------------
  { category: "School", vi: "viết chì",   en: "pencil",   emoji: "✏️", image: "https://placehold.co/600x800/2563eb/ffffff?text=pencil" },
  { category: "School", vi: "viết mực",   en: "pen",      emoji: "🖊️", image: "https://placehold.co/600x800/2563eb/ffffff?text=pen" },
  { category: "School", vi: "cái cặp",    en: "backpack", emoji: "🎒", audio: "audio/cai-cap.m4a", image: "https://placehold.co/600x800/2563eb/ffffff?text=backpack" },
  { category: "School", vi: "cuốn sách",  en: "book",     emoji: "📖", audio: "audio/cuon-sach.m4a", image: "https://placehold.co/600x800/2563eb/ffffff?text=book" },
  { category: "School", vi: "cục gôm",    en: "eraser",   image: "https://placehold.co/600x800/2563eb/ffffff?text=eraser" },
  { category: "School", vi: "cây thước",  en: "ruler",    emoji: "📏", image: "https://placehold.co/600x800/2563eb/ffffff?text=ruler" },

  // -------------------- Colors (placeholder shows the actual color) --------------------
  { category: "Colors", vi: "màu xanh lá",    en: "green",  emoji: "🟢", audio: "audio/mau-xanh-la.m4a", image: "https://placehold.co/600x800/16a34a/ffffff?text=green" },
  { category: "Colors", vi: "màu xanh dương", en: "blue",   emoji: "🔵", audio: "audio/mau-xanh-duong.m4a", image: "https://placehold.co/600x800/2563eb/ffffff?text=blue" },
  { category: "Colors", vi: "màu vàng",       en: "yellow", emoji: "🟡", audio: "audio/mau-vang.m4a", image: "https://placehold.co/600x800/eab308/111111?text=yellow" },
  { category: "Colors", vi: "màu cam",        en: "orange", emoji: "🟠", audio: "audio/mau-cam.m4a", image: "https://placehold.co/600x800/f97316/ffffff?text=orange" },
  { category: "Colors", vi: "màu đỏ",         en: "red",    emoji: "🔴", image: "https://placehold.co/600x800/dc2626/ffffff?text=red" },
  { category: "Colors", vi: "màu hồng",       en: "pink",   emoji: "🩷", audio: "audio/mau-hong.m4a", image: "https://placehold.co/600x800/ec4899/ffffff?text=pink" },
  { category: "Colors", vi: "màu đen",        en: "black",  emoji: "⚫", audio: "audio/mau-den.m4a", image: "https://placehold.co/600x800/000000/ffffff?text=black" },
  { category: "Colors", vi: "màu trắng",      en: "white",  emoji: "⚪", image: "https://placehold.co/600x800/ffffff/111111?text=white" },
  { category: "Colors", vi: "màu xám",        en: "gray",   emoji: "🩶", image: "https://placehold.co/600x800/6b7280/ffffff?text=gray" },
  { category: "Colors", vi: "màu nâu",        en: "brown",  emoji: "🟤", audio: "audio/mau-nau.m4a", image: "https://placehold.co/600x800/92400e/ffffff?text=brown" },
  { category: "Colors", vi: "màu tím",        en: "purple", emoji: "🟣", image: "https://placehold.co/600x800/9333ea/ffffff?text=purple" },

  // -------------------- Food --------------------
  { category: "Food", vi: "cà rốt", en: "carrot",    emoji: "🥕", image: "https://placehold.co/600x800/ea580c/ffffff?text=carrot" },
  { category: "Food", vi: "kem",    en: "ice cream", emoji: "🍦", image: "https://placehold.co/600x800/ea580c/ffffff?text=ice+cream" },
  { category: "Food", vi: "phở",    en: "pho",       emoji: "🍜", image: "https://placehold.co/600x800/ea580c/ffffff?text=pho" },
  { category: "Food", vi: "mì",     en: "noodles",   emoji: "🍝", audio: "audio/mi.m4a", image: "https://placehold.co/600x800/ea580c/ffffff?text=noodles" },
  { category: "Food", vi: "bánh mì", en: "bread / sandwich", emoji: "🥖", audio: "audio/banh-mi.m4a", image: "https://placehold.co/600x800/ea580c/ffffff?text=banh+mi" },
  { category: "Food", vi: "chôm chôm", en: "rambutan", audio: "audio/chom-chom.m4a", image: "https://placehold.co/600x800/ea580c/ffffff?text=rambutan" },

  // -------------------- Jobs --------------------
  { category: "Jobs", vi: "nghề",     en: "job / occupation", emoji: "💼", audio: "audio/nghe.m4a", image: "https://placehold.co/600x800/0d9488/ffffff?text=job" },
  { category: "Jobs", vi: "bác sĩ",   en: "doctor",         emoji: "🧑‍⚕️", audio: "audio/bac-si.m4a", image: "https://placehold.co/600x800/0d9488/ffffff?text=doctor" },
  { category: "Jobs", vi: "y tá",     en: "nurse",          emoji: "💉", audio: "audio/y-ta.m4a", image: "https://placehold.co/600x800/0d9488/ffffff?text=nurse" },
  { category: "Jobs", vi: "tài xế",   en: "driver",         audio: "audio/tai-xe.m4a", image: "https://placehold.co/600x800/0d9488/ffffff?text=driver" },
  { category: "Jobs", vi: "nông dân", en: "farmer",         emoji: "🧑‍🌾", audio: "audio/nong-dan.m4a", image: "https://placehold.co/600x800/0d9488/ffffff?text=farmer" },
  { category: "Jobs", vi: "đầu bếp",  en: "chef",           emoji: "🧑‍🍳", audio: "audio/dau-bep.m4a", image: "https://placehold.co/600x800/0d9488/ffffff?text=chef" },
  { category: "Jobs", vi: "giáo viên", en: "teacher",       emoji: "🧑‍🏫", audio: "audio/giao-vien.m4a", image: "https://placehold.co/600x800/0d9488/ffffff?text=teacher" },
  { category: "Jobs", vi: "công an",  en: "police",         emoji: "👮", audio: "audio/cong-an.m4a", image: "https://placehold.co/600x800/0d9488/ffffff?text=police" },
  { category: "Jobs", vi: "học sinh", en: "student",        emoji: "🎓", audio: "audio/hoc-sinh.m4a", image: "https://placehold.co/600x800/0d9488/ffffff?text=student" },
  { category: "Jobs", vi: "anh hùng", en: "hero",           emoji: "🦸", audio: "audio/anh-hung.m4a", image: "https://placehold.co/600x800/0d9488/ffffff?text=hero" },
  { category: "Jobs", vi: "người",    en: "person",         emoji: "🧑", audio: "audio/nguoi.m4a", image: "https://placehold.co/600x800/0d9488/ffffff?text=person" },

  // -------------------- Phrases --------------------
  { category: "Phrases", vi: "phải không", en: "is that right?", audio: "audio/phai-khong.m4a", image: "https://placehold.co/600x800/0891b2/ffffff?text=is+that+right" },
  { category: "Phrases", vi: "không phải", en: "not correct",   audio: "audio/khong-phai.m4a", image: "https://placehold.co/600x800/0891b2/ffffff?text=not+correct" },
  { category: "Phrases", vi: "ở đâu",      en: "where?",       audio: "audio/o-dau.m4a", image: "https://placehold.co/600x800/0891b2/ffffff?text=where" },
  { category: "Phrases", vi: "khoẻ không", en: "how are you?", audio: "audio/khoe-khong.m4a", image: "https://placehold.co/600x800/0891b2/ffffff?text=how+are+you" },
  { category: "Phrases", vi: "mấy",        en: "how many?",         emoji: "🔢", audio: "audio/may.m4a", image: "https://placehold.co/600x800/0891b2/ffffff?text=how+many" },
  { category: "Phrases", vi: "đây là",     en: "this is",           emoji: "👉", audio: "audio/day-la.m4a", image: "https://placehold.co/600x800/0891b2/ffffff?text=this+is" },
  { category: "Phrases", vi: "đó",         en: "there / that",      emoji: "📍", audio: "audio/do.m4a", image: "https://placehold.co/600x800/0891b2/ffffff?text=there" },
  { category: "Phrases", vi: "màu gì",     en: "what color?",       emoji: "🎨", audio: "audio/mau-gi.m4a", image: "https://placehold.co/600x800/0891b2/ffffff?text=what+color" },
  { category: "Phrases", vi: "có",         en: "have",              emoji: "✅", audio: "audio/co-yes.m4a", image: "https://placehold.co/600x800/0891b2/ffffff?text=have" },
  { category: "Phrases", vi: "chào",       en: "hello",             emoji: "👋", audio: "audio/chao.m4a", image: "https://placehold.co/600x800/0891b2/ffffff?text=hello" },
  { category: "Phrases", vi: "ơi",         en: "hey (calling someone)", audio: "audio/oi.m4a", image: "https://placehold.co/600x800/0891b2/ffffff?text=hey" },
  { category: "Phrases", vi: "không",      en: "no / not",          audio: "audio/khong.m4a", image: "https://placehold.co/600x800/0891b2/ffffff?text=no" },
  { category: "Phrases", vi: "của",        en: "of / belonging to", audio: "audio/cua.m4a", image: "https://placehold.co/600x800/0891b2/ffffff?text=of" },
  { category: "Phrases", vi: "là",         en: "to be / is",        audio: "audio/la.m4a", image: "https://placehold.co/600x800/0891b2/ffffff?text=is" },
  { category: "Phrases", vi: "ai",         en: "who?",              image: "https://placehold.co/600x800/0891b2/ffffff?text=who" },
  { category: "Phrases", vi: "tên",        en: "name",              emoji: "🏷️", image: "https://placehold.co/600x800/0891b2/ffffff?text=name" },

  // -------------------- Descriptions --------------------
  { category: "Descriptions", vi: "bự", en: "big", audio: "audio/bu.m4a", image: "https://placehold.co/600x800/ca8a04/ffffff?text=big" },
  { category: "Descriptions", vi: "khỏe", en: "healthy / well", audio: "audio/khoe.m4a", image: "https://placehold.co/600x800/ca8a04/ffffff?text=healthy" },
  { category: "Descriptions", vi: "đúng", en: "correct",        emoji: "✔️", audio: "audio/dung.m4a", image: "https://placehold.co/600x800/ca8a04/ffffff?text=correct" },
  { category: "Descriptions", vi: "giỏi", en: "good job",       emoji: "🌟", audio: "audio/gioi.m4a", image: "https://placehold.co/600x800/ca8a04/ffffff?text=good+job" },
  { category: "Descriptions", vi: "sai",  en: "wrong",          image: "https://placehold.co/600x800/ca8a04/ffffff?text=wrong" },

  // -------------------- Places --------------------
  { category: "Places", vi: "công viên", en: "park",           emoji: "🏞️", audio: "audio/cong-vien.m4a", image: "https://placehold.co/600x800/0e7490/ffffff?text=park" },
  { category: "Places", vi: "hồ bơi",    en: "swimming pool",  emoji: "🏊", audio: "audio/ho-boi.m4a", image: "https://placehold.co/600x800/0e7490/ffffff?text=pool" },

  // -------------------- Family --------------------
  { category: "Family", vi: "gia đình",   en: "family",              emoji: "👪", audio: "audio/gia-dinh.m4a", image: "https://placehold.co/600x800/be123c/ffffff?text=family" },
  { category: "Family", vi: "mẹ",         en: "mom",                 audio: "audio/me.m4a", image: "https://placehold.co/600x800/be123c/ffffff?text=mom" },
  { category: "Family", vi: "chị",        en: "older sister",        audio: "audio/chi.m4a", image: "https://placehold.co/600x800/be123c/ffffff?text=older+sister" },
  { category: "Family", vi: "cô",         en: "aunt / older woman",  audio: "audio/co-aunt.m4a", image: "https://placehold.co/600x800/be123c/ffffff?text=aunt" },
  { category: "Family", vi: "chú",        en: "uncle / older man",   audio: "audio/chu.m4a", image: "https://placehold.co/600x800/be123c/ffffff?text=uncle" },
  { category: "Family", vi: "em gái",     en: "younger sister",      audio: "audio/em-gai.m4a", image: "https://placehold.co/600x800/be123c/ffffff?text=younger+sister" },
  { category: "Family", vi: "ông",        en: "grandfather / old man",   audio: "audio/ong.m4a", image: "https://placehold.co/600x800/be123c/ffffff?text=grandfather" },
  { category: "Family", vi: "bà",         en: "grandmother / old woman", audio: "audio/ba2.m4a", image: "https://placehold.co/600x800/be123c/ffffff?text=grandmother" },
  { category: "Family", vi: "ông nội",    en: "grandpa (dad's dad)", audio: "audio/ong-noi.m4a", image: "https://placehold.co/600x800/be123c/ffffff?text=grandpa+dad" },
  { category: "Family", vi: "bà nội",     en: "grandma (dad's mom)", audio: "audio/ba-noi.m4a", image: "https://placehold.co/600x800/be123c/ffffff?text=grandma+dad" },
  { category: "Family", vi: "ông ngoại",  en: "grandpa (mom's dad)", audio: "audio/ong-ngoai.m4a", image: "https://placehold.co/600x800/be123c/ffffff?text=grandpa+mom" },
  { category: "Family", vi: "bà ngoại",   en: "grandma (mom's mom)", audio: "audio/ba-ngoai.m4a", image: "https://placehold.co/600x800/be123c/ffffff?text=grandma+mom" },
  { category: "Family", vi: "ông cố nội",   en: "great-grandpa (dad's grandpa)", image: "https://placehold.co/600x800/be123c/ffffff?text=great-grandpa+dad" },
  { category: "Family", vi: "bà cố nội",    en: "great-grandma (dad's grandma)", image: "https://placehold.co/600x800/be123c/ffffff?text=great-grandma+dad" },
  { category: "Family", vi: "ông cố ngoại", en: "great-grandpa (mom's grandpa)", image: "https://placehold.co/600x800/be123c/ffffff?text=great-grandpa+mom" },
  { category: "Family", vi: "bà cố ngoại",  en: "great-grandma (mom's grandma)", image: "https://placehold.co/600x800/be123c/ffffff?text=great-grandma+mom" },
  { category: "Family", vi: "ba",         en: "dad",             image: "https://placehold.co/600x800/be123c/ffffff?text=dad" },
  { category: "Family", vi: "anh",        en: "older brother",   image: "https://placehold.co/600x800/be123c/ffffff?text=older+brother" },
  { category: "Family", vi: "em",         en: "younger sibling", image: "https://placehold.co/600x800/be123c/ffffff?text=younger+sibling" },
  { category: "Family", vi: "em trai",    en: "younger brother", image: "https://placehold.co/600x800/be123c/ffffff?text=younger+brother" },
  { category: "Family", vi: "con",        en: "child",           image: "https://placehold.co/600x800/be123c/ffffff?text=child" },

  // -------------------- Numbers --------------------
  { category: "Numbers", vi: "một", en: "one",   emoji: "1️⃣", image: "https://placehold.co/600x800/4d7c0f/ffffff?text=one" },
  { category: "Numbers", vi: "hai", en: "two",   emoji: "2️⃣", image: "https://placehold.co/600x800/4d7c0f/ffffff?text=two" },
  { category: "Numbers", vi: "ba",  en: "three", emoji: "3️⃣", image: "https://placehold.co/600x800/4d7c0f/ffffff?text=three" },
  { category: "Numbers", vi: "bốn", en: "four",  emoji: "4️⃣", audio: "audio/bon.m4a", image: "https://placehold.co/600x800/4d7c0f/ffffff?text=four" },
  { category: "Numbers", vi: "năm", en: "five",  emoji: "5️⃣", audio: "audio/nam.m4a", image: "https://placehold.co/600x800/4d7c0f/ffffff?text=five" },
  { category: "Numbers", vi: "sáu",  en: "six",   emoji: "6️⃣", audio: "audio/sau-num.m4a", image: "https://placehold.co/600x800/4d7c0f/ffffff?text=six" },
  { category: "Numbers", vi: "bảy",  en: "seven", emoji: "7️⃣", image: "https://placehold.co/600x800/4d7c0f/ffffff?text=seven" },
  { category: "Numbers", vi: "tám",  en: "eight", emoji: "8️⃣", image: "https://placehold.co/600x800/4d7c0f/ffffff?text=eight" },
  { category: "Numbers", vi: "chín", en: "nine",  emoji: "9️⃣", image: "https://placehold.co/600x800/4d7c0f/ffffff?text=nine" },
  { category: "Numbers", vi: "mười", en: "ten",   emoji: "🔟", image: "https://placehold.co/600x800/4d7c0f/ffffff?text=ten" },
];

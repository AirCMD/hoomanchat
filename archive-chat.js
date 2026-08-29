(function () {
  "use strict";

  var currentUser = { name: "copy_pasta" };

  var placeholderAvatar =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">' +
      '<rect width="100" height="100" fill="#dddddd"/>' +
      '<circle cx="50" cy="37" r="18" fill="#999999"/>' +
      '<rect x="22" y="60" width="56" height="28" fill="#999999"/>' +
      "</svg>"
    );

  var MAX_IMAGE_SIZE = 10 * 1024 * 1024;
  var MAX_FILE_SIZE = 20 * 1024 * 1024;

  var allowedImageTypes = {
    "image/jpeg": true, "image/png": true, "image/gif": true,
    "image/webp": true, "image/heic": true, "image/heif": true
  };

  var blockedExtensions = {
    ".exe": true, ".com": true, ".scr": true, ".msi": true, ".bat": true,
    ".cmd": true, ".ps1": true, ".vbs": true, ".js": true, ".jar": true,
    ".apk": true, ".html": true, ".htm": true, ".php": true, ".sh": true, ".py": true
  };

  /*
    status — запасний рядок, якщо немає schedule
    schedule — як на профілях:
      { time: "09:00", status: "online" | "away" | "offline" }
    gender — "male" | "female" для «був/була»
  */
  var users = {
    sakurai_agatsuma: {
      name: "sakurai_agatsuma",
      avatar: "https://blogger.googleusercontent.com/img/a/AVvXsEg6F3ycnXu5A2gS5zM4p0-qELjeNz4oXvfJAwkLxSJnL4kELcGviUtPwYe-Oa8lV_ThO7h6iq0dwSnx2FeaHbkzG6HEC8S0HILQKiHh49eWl65LSGoj7RgeAYb7V5MV7b7Mu7Sxexq9LYM_7XPF6SkSjStcQO32x02IKUWdFlUck9z30GmMEJgH2OLM3YA",
      profile: "profiles/sakurai-agatsuma.html",
      gender: "female",
      status: "online",
      schedule: [
        { time: "08:00", status: "online" },
        { time: "13:00", status: "away" },
        { time: "15:00", status: "online" },
        { time: "22:00", status: "offline" }
      ],
      autoReply: ["Ок :)", "Я зрозуміла.", "Цікава думка.", "Добре, розповідай."]
    },
    alter_core: {
      name: "alter_core",
      avatar: "https://blogger.googleusercontent.com/img/a/AVvXsEiZ7hOITEG-aCscLuMNEBml1v2zidsEixQymUsU5UukZN4Jb-AAbqwdGj3CJ8gSTbOvXMgyPp3T4xAQzq3TRYhFjOYbF0TkE6lWGESsA-K31pEcpcOV2Cr061lkzABNZRKN5CPAr9WmD38DWNYbebjw8CuqHGWvgBCumZebUra3Kjf6sjUDTZDpVZQehD0",
      profile: "profiles/alter-core.html",
      gender: "female",
      status: "online",
  schedule: [
    { time: "17:00", status: "online" },
    { time: "17:25", status: "away" },
    { time: "18:00", status: "online" },
    { time: "20:03", status: "away" },
    { time: "20:29", status: "online" },
    { time: "23:03", status: "away" },
    { time: "23:31", status: "online" },
    { time: "01:23", status: "away" },
    { time: "02:00", status: "online" },
    { time: "05:00", status: "offline" }
  ],
      autoReply: ["Це автоматичне повідомлення. Ви заблокували alter_core, вона не зможе прочитати чат."]
    },
    another_hoomen: {
      name: "another_hoomen",
      avatar: "https://blogger.googleusercontent.com/img/a/AVvXsEhGJcedC21GOJf9E7-pAiRFqRkZkhWOsgZEmPho3dZtnirOPtoUonHL_MdwDkt-LvPpt_azt8iqxuPs6DPv8rP29QKHxw2k4jB6O1Wc7KZO8zgKHr_nNaeuI5fActfzQoxMiJc46N3oennG9eU664xDo5Cl6MXbWKDw-bjMiQ2UW1kcpCUmphIv9X1pkhE",
      profile: "profiles/another-hoomen.html",
      gender: "male",
      status: "online",
      autoReply: ["Давно тебе не бачив.", "Привіт.", "Можемо поговорити.", "Зараз трохи зайнятий."],
  schedule: [
    { time: "07:45", status: "online" },
    { time: "08:02", status: "away" },
    { time: "12:03", status: "online" },
    { time: "14:01", status: "away" },
    { time: "14:32", status: "online" },
    { time: "17:12", status: "away" },
    { time: "18:09", status: "online" },
    { time: "19:14", status: "away" },
    { time: "20:00", status: "online" },
    { time: "21:55", status: "offline" }
  ],
    },
    velvet_moon: {
      name: "velvet_moon",
      avatar: "https://blogger.googleusercontent.com/img/a/AVvXsEjvCZvQq7YfiAW2jyK5-_QrfSWCXfr1U1is8CoNCEVrSi8r66EOrusjYVkhcSXuLIE_RoLqNXflCSV37rByzCXUnMSmAyeV7J8OQvwcKw51nqzdepT_WG8p4EUDlGQgOdw0bjiEG3Enkud1f3CmpEcpE5Cg7LTxetdvKXZw_X9xoR69inJXkv_HlnuQJsw",
      profile: "profiles/velvet-moon.html",
      gender: "female",
      status: "long-ago",
      autoReply: ["Привіт :)", "Я зараз тут.", "Цікаво.", "Розкажи детальніше."]
    },
    pixel_heart: {
      name: "pixel_heart",
      avatar: "https://blogger.googleusercontent.com/img/a/AVvXsEj-JwvE44KmWRAxQsTyKdRmlsdBRpJ8WvOwLpAvvzA-tMTjKE2fq0CEWp-16Rk-z2vC0IXDlnA1X2OGtgGZdvl592QFkFc_GmfVfyOn_jYaxpKaIU8GR4RKkKQvyx5wYdE6BaRhXtKjQ8nXg8yvZS0dNyStBNg0uJILRffVdvV_2pZUCae84AMDojxshiI",
      profile: "profiles/pixel-heart.html",
      gender: "female",
      status: "5min",
      autoReply: ["О, привіт.", "Мм, можливо.", "Я подумаю над цим.", "Хех :)"]
    },
    night_fox: {
      name: "night_fox",
      avatar: "https://blogger.googleusercontent.com/img/a/AVvXsEj47FGZQVZBpkxQBYQVVcANFRW4_ROFwYhkBiqqCUFbbQtDk9Nqm0OngJgQOlTWNh-K08KO-CKHy6rimZeZtt_jyPlntD35r-YBcNtLEjBkvqs-iL8sXLFEitu-rgnzmJMcyP1RzjG0eb2nurjONGAqFUi41djo5xmB91hTHfclMBote_EQNB5CXbG6ZYg",
      profile: "profiles/night-fox.html",
      gender: "male",
      status: "online",
      autoReply: ["Привіт.", "Я слухаю.", "Цікаво звучить.", "А що далі?"]
    },
    cherry_byte: {
      name: "cherry_byte",
      avatar: "https://blogger.googleusercontent.com/img/a/AVvXsEi_V3-i5gqAEgl0UEqmujNCZgYVFD0iZ1-4pEQZls0WpjMDTkeOMRhk_wzB3_jQZSylary26k6cH7mqk7edNro_gxIDMN1vnwKwqeGZ-zwRnObVwL79CzOydbmlivp0DSZy6mJGyiJ5KgoxYNr4GmuxxrLibqLgyE0IPzfmQ92xNe8LP6GEt8b35K8PJQA",
      profile: "profiles/cherry-byte.html",
      gender: "female",
      status: "25min",
      autoReply: ["Няя :)", "Ого.", "Неочікувано.", "Ясно."]
    },
    water_blue: {
      name: "water_blue",
      avatar: "https://blogger.googleusercontent.com/img/a/AVvXsEi-IVzTEq2IynM_TIFrvaScqnwEXbfXXKJyw6mDm1JXy1YBqBB3g-garhk0xNCgObaBw-W2473PSKJoMZPIuegdmiviufrD7jCSY02X2NLH6_waaxjQJ3IE5V-n_Ynv9Qo9VLluhy35n70BcPGUvp2EOvJofrpAVNBmAU784U4-iO0GRTziDFWR7Wtgl2Q",
      profile: "profiles/water-blue.html",
      gender: "female",
      status: "online",
      schedule: [
        { time: "10:00", status: "online" },
        { time: "13:00", status: "away" },
        { time: "18:00", status: "online" },
        { time: "23:00", status: "offline" }
      ],
      autoReply: ["Привіт, я дуже зайнята. Пиши мені сюди ХХХ-ХХХ-ХХ-ХХ.", "Нажаль, у мене немає просто часу на це.", "Вибач, не до спілкування.", "Зайнята."]
    },
    pasta_friend: {
      name: "pasta_friend",
      avatar: "https://blogger.googleusercontent.com/img/a/AVvXsEjeItFC3-52Hqh5Zt8oMPFYSbPgc5sqbb2ZOg-e62c0Bzd6gdv3lmxx8Fx-vr9A2Hh0Go1GmzvIbXzG7mjUdwA_53Vou7h0_GERc2zRV5IuJhf0MGbkdvU15QSqYO3bOppNMgMaKJ1X-Y-_iqsSf73zIvdeqlXP3wu9rsu9avdub1faI1rmCd-PL7tBqPw",
      profile: "profiles/pasta-friend.html",
      gender: "female",
      status: "online",
  schedule: [
    { time: "09:00", status: "online" },
    { time: "09:30", status: "away" },
    { time: "10:25", status: "online" },
    { time: "12:30", status: "away" },
    { time: "14:35", status: "online" },
    { time: "15:00", status: "away" },
    { time: "17:01", status: "online" },
    { time: "18:14", status: "away" },
    { time: "20:00", status: "online" },
    { time: "22:00", status: "offline" }
  ],
      autoReply: ["Нда.", "Чого ти пишеш мені?", "Шляк би тебе трафив!", "Відчепись!"]
    },
    rusty_robot: {
      name: "rusty_robot",
      avatar: "https://blogger.googleusercontent.com/img/a/AVvXsEj0p973limLEfJtZBHR1CdP2waLt6VGEJJ9u013brvFnzMn1DD1rwthHcUQEBUzv2LvNhyanexQak7w8U5zsYJ5FCItvw5aAnxoRuG4AHD9jV2yhECUEtI4We-Gvp3RKqIG1vwx5YqwFEtuO5mgQp9XjIleeKXMRN0maO5ZFo5qexFW4U94mJj20pQa208",
      profile: "profiles/rusty-robot.html",
      gender: "male",
      status: "50min",
  schedule: [
    { time: "10:08", status: "online" },
    { time: "12:05", status: "away" },
    { time: "12:34", status: "online" },
    { time: "15:06", status: "away" },
    { time: "15:38", status: "online" },
    { time: "16:05", status: "away" },
    { time: "16:18", status: "online" },
    { time: "17:04", status: "away" },
    { time: "17:19", status: "online" },
    { time: "00:00", status: "offline" }
  ],
      autoReply: ["Отримано.", "Обробляю інформацію.", "Звучить цікаво.", "Повернуся до цього."]
    },
    soft_static: {
      name: "soft_static",
      avatar: "https://blogger.googleusercontent.com/img/a/AVvXsEi0-IQ6-y_L-kVYfUNnPzMXCO39DUxNV17N6cCoYPBfkwL08hMaGfNvtzmJnDdKjC08FH_jIcq00ddIhr5z0vI5JhnQY7RuqAeyUvDOpge242fUwO5Wx0lZR18YxbOStWLTMlj6nRSfmA074mfgW2oLCxZxVNerdKr-7l8desFoDExHYFwJiXxn603G53o",
      profile: "profiles/soft-static.html",
      gender: "female",
      status: "online",
  schedule: [
    { time: "09:18", status: "online" },
    { time: "12:05", status: "away" },
    { time: "12:34", status: "online" },
    { time: "15:06", status: "away" },
    { time: "15:38", status: "online" },
    { time: "16:05", status: "away" },
    { time: "16:18", status: "online" },
    { time: "17:04", status: "away" },
    { time: "17:19", status: "online" },
    { time: "23:00", status: "offline" }
  ],
      autoReply: ["Привіт.", "Можливо.", "Я не знаю.", "Це хороше питання."]
    },
    blue_comet: {
      name: "blue_comet",
      avatar: "https://blogger.googleusercontent.com/img/a/AVvXsEgHmdvoLrtjAgSiUFcb0hGp9F5p18XgzcuEaU3rGzBeO4InsMLxZF8YYIAUBZ99JGl1T0FQHMyU5-HMEFWNJsR_ydzpFwAvomjS42BttjdCB2ysf6Gk_rVpidSXv8KbWj-xA60S8oQ09UVD7lrVtS54ijkZ40T471i_m69ecU0BsCbyF_blx640ZYGsjeo",
      profile: "profiles/blue-comet.html",
      gender: "female",
      status: "online",
  schedule: [
    { time: "13:05", status: "online" },
    { time: "13:32", status: "away" },
    { time: "14:15", status: "online" },
    { time: "16:21", status: "away" },
    { time: "18:32", status: "online" },
    { time: "00:12", status: "away" },
    { time: "01:09", status: "online" },
    { time: "04:14", status: "away" },
    { time: "06:00", status: "online" },
    { time: "7:00", status: "offline" }
  ],
      autoReply: ["О, ти тут.", "Добре.", "Можемо поговорити.", "Я слухаю."]
    },
    coffee_signal: {
      name: "coffee_signal",
      avatar: "https://blogger.googleusercontent.com/img/a/AVvXsEhzk94r86FgzVUKV3vexrNMu1qNtg4p4TmKESMylkPtOoGL6KI0fDw0743JR2KaYsKSMT1FQC81AptsedII-X6O06QTejI2h2L6F95NioihwLF9RdiK-CBRxsIwNFZMTJenUoXFC_tR98O4FbGaKO30PoHL7JlRZPyVb9rYdwf3djhTsyFMvB--c0FdiRY",
      profile: "profiles/coffee-signal.html",
      gender: "female",
      status: "5min",
      autoReply: ["Привіт ☕", "Саме п'ю каву.", "Оце так.", "Можна."],
  schedule: [
    { time: "10:00", status: "online" },
    { time: "12:02", status: "away" },
    { time: "12:34", status: "online" },
    { time: "15:01", status: "away" },
    { time: "15:32", status: "online" },
    { time: "16:02", status: "away" },
    { time: "16:13", status: "online" },
    { time: "17:01", status: "away" },
    { time: "17:12", status: "online" },
    { time: "18:00", status: "offline" }
  ],
    },
    paper_storm: {
      name: "paper_storm",
      avatar: "https://blogger.googleusercontent.com/img/a/AVvXsEjqrONG3WN749rf0VM4X87BNKhBrhokWahtrEN24gjmmrqE0QMAolsrXFTfZTJ55OxsJfzNAuFDxyoGm3rDMAV0voBpUeWXTDIOCFdDjRzu16bcQUT8xh6H2CdoPgUBGLfZOkaLwqfdHcOFLLqY5zuANw-DF_zpQT-cre6khltso6JV4Ih3wDqL3kPIJys",
      profile: "profiles/paper-storm.html",
      gender: "male",
      status: "online",
  schedule: [
    { time: "07:08", status: "online" },
    { time: "12:05", status: "away" },
    { time: "12:34", status: "online" },
    { time: "15:06", status: "away" },
    { time: "15:38", status: "online" },
    { time: "16:05", status: "away" },
    { time: "16:18", status: "online" },
    { time: "17:04", status: "away" },
    { time: "17:19", status: "online" },
    { time: "00:00", status: "offline" }
  ],
      autoReply: ["Привіт.", "Розкажи.", "Несподівано.", "Я ще думаю."]
    },
    dreaming_romance: {
      name: "dreaming_romance",
      avatar: "https://blogger.googleusercontent.com/img/a/AVvXsEiwgFN7p9c9WH9CraPn7ugEzY-xBBTLiqJDwF7Ky1uXupxbTsG8gG9zGOCcniw56afn5TGoSC3nL8SIsPxfIuPiIInXj9GHTwrJhCahp7vpW1mc2m6vS9vp-FQ-wumommCYwiiL-872HrCARoujqE89l7W7LUuz1vNlms03_PWg26Is4H_E81MZShMIjUA",
      profile: "profiles/dreaming-romance.html",
      gender: "male",
      status: "online",
      schedule: [
       { time: "09:00", status: "online" },
       { time: "09:25", status: "away" },
       { time: "10:50", status: "online" },
       { time: "12:01", status: "away" },
       { time: "12:45", status: "online" },
       { time: "14:02", status: "away" },
       { time: "15:21", status: "online" },
       { time: "18:31", status: "away" },
       { time: "20:00", status: "online" },
       { time: "23:00", status: "offline" }
  ],
      autoReply: ["Це автоматичне повідомлення. Ви заблокували dreaming_romance, вона не зможе прочитати чат."]
    }
  };

  var chats = {
    dreaming_romance: { user: "dreaming_romance", messages: [], loaded: false },
    sakurai_agatsuma: { user: "sakurai_agatsuma", messages: [], loaded: false },
    alter_core: { user: "alter_core", messages: [], loaded: false },
    another_hoomen: { user: "another_hoomen", messages: [], loaded: false },
    velvet_moon: { user: "velvet_moon", messages: [], loaded: false },
    pixel_heart: { user: "pixel_heart", messages: [], loaded: false },
    night_fox: { user: "night_fox", messages: [], loaded: false },
    cherry_byte: { user: "cherry_byte", messages: [], loaded: false },
    water_blue: { user: "water_blue", messages: [], loaded: false },
    pasta_friend: { user: "pasta_friend", messages: [], loaded: false },
    rusty_robot: { user: "rusty_robot", messages: [], loaded: false },
    soft_static: { user: "soft_static", messages: [], loaded: false },
    blue_comet: { user: "blue_comet", messages: [], loaded: false },
    coffee_signal: { user: "coffee_signal", messages: [], loaded: false },
    paper_storm: { user: "paper_storm", messages: [], loaded: false }
  };

  /* null = жоден чат не відкритий */
  var currentChat = null;
  var pendingAttachments = [];

  var emojis = [
    "😀","😃","😄","😁","😆","😅","😂","🤣","😊","🙂","😉","😌","😍","🥰","😘",
    "😭","😢","😮","😲","😴","🤔","😏","🥺","😱","😤","😠","❤️","💕","✨","🔥",
    "🌸","🌙","☕","🎮","🐱","🐶","👍","👎","👏","🙏","💪","🎉"
  ];

  function get(id) { return document.getElementById(id); }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ========== СТАТУС ЗА РОЗКЛАДОМ (як на профілях) ========== */

  function parseHHMM(str) {
    if (!str || typeof str !== "string") return null;
    var parts = str.trim().split(":");
    if (parts.length < 2) return null;
    var h = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10);
    if (isNaN(h) || isNaN(m)) return null;
    return h * 60 + m;
  }

  function resolveScheduleSlot(schedule) {
    if (!schedule || !schedule.length) return null;
    var slots = [];
    for (var i = 0; i < schedule.length; i++) {
      var item = schedule[i];
      if (!item || !item.time) continue;
      var mins = parseHHMM(item.time);
      if (mins === null) continue;
      slots.push({ minutes: mins, status: item.status || "offline" });
    }
    if (!slots.length) return null;
    slots.sort(function (a, b) { return a.minutes - b.minutes; });

    var now = new Date();
    var nowMins = now.getHours() * 60 + now.getMinutes();
    var active = slots[slots.length - 1];
    for (var j = 0; j < slots.length; j++) {
      if (slots[j].minutes <= nowMins) active = slots[j];
    }

    var elapsed = nowMins >= active.minutes
      ? nowMins - active.minutes
      : nowMins + (24 * 60 - active.minutes);

    return { status: active.status, elapsedMinutes: elapsed };
  }

  function formatAwayText(gender, elapsedMinutes) {
    var was = gender !== "male" ? "була" : "був";
    var m = Math.max(0, Math.floor(elapsedMinutes));
    if (m < 1) return { text: was + " щойно", className: "recent" };
    if (m < 60) {
      return {
        text: was + " " + m + " хв назад",
        className: m < 15 ? "recent" : "away"
      };
    }
    var hours = Math.floor(m / 60);
    if (hours < 24) {
      var hWord = hours === 1 ? "годину" : (hours >= 2 && hours <= 4 ? "години" : "годин");
      return { text: was + " " + hours + " " + hWord + " назад", className: "away" };
    }
    return { text: was + " давно", className: "long-ago" };
  }

  function resolveUserStatus(user) {
    if (!user) return { text: "офлайн", className: "offline" };

    if (user.schedule && user.schedule.length) {
      var slot = resolveScheduleSlot(user.schedule);
      if (slot) {
        var st = String(slot.status || "").toLowerCase();
        if (st === "online" || st === "on") {
          return { text: "● онлайн", className: "online" };
        }
        if (st === "offline" || st === "off" || st === "sleep") {
          return { text: "офлайн", className: "offline" };
        }
        if (st === "away" || st === "afk") {
          return formatAwayText(user.gender, slot.elapsedMinutes);
        }
      }
    }

    var key = user.status || "offline";
    var was = user.gender !== "male" ? "була" : "був";
    var map = {
      online: { text: "● онлайн", className: "online" },
      "5min": { text: was + " 5 хв назад", className: "recent" },
      "25min": { text: was + " 25 хв назад", className: "away" },
      "50min": { text: was + " 50 хв назад", className: "away" },
      offline: { text: "офлайн", className: "offline" },
      "long-ago": { text: was + " давно", className: "long-ago" }
    };
    if (map[key]) return map[key];
    return { text: String(key), className: "offline" };
  }

  function refreshAllStatuses() {
    renderChatList();
    if (currentChat) renderConversationHeader();
  }

  /* ========== UI ========== */

  function getExtension(fileName) {
    var clean = String(fileName || "").toLowerCase().split("?")[0];
    var dot = clean.lastIndexOf(".");
    return dot === -1 ? "" : clean.substring(dot);
  }

  function isAllowedImage(file) {
    if (!file) return { allowed: false, reason: "Файл не визначено." };
    if (!allowedImageTypes[file.type]) {
      return { allowed: false, reason: "Дозволені лише JPG, PNG, GIF, WebP, HEIC." };
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return { allowed: false, reason: "Зображення завелике. Максимум 10 MB." };
    }
    return { allowed: true };
  }

  function isAllowedFile(file) {
    if (!file) return { allowed: false, reason: "Файл не визначено." };
    if (file.size > MAX_FILE_SIZE) {
      return { allowed: false, reason: "Файл завеликий. Максимум 20 MB." };
    }
    if (blockedExtensions[getExtension(file.name)]) {
      return { allowed: false, reason: "Цей тип файлу заборонений." };
    }
    return { allowed: true };
  }

  function renderEmojiPanel() {
    var container = get("emoji-grid");
    if (!container) return;
    container.innerHTML = "";
    emojis.forEach(function (emoji) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "emoji-button";
      button.textContent = emoji;
      button.addEventListener("click", function () { insertEmoji(emoji); });
      container.appendChild(button);
    });
  }

  function insertEmoji(emoji) {
    var input = get("message-input");
    if (!input) return;
    var start = input.selectionStart;
    var end = input.selectionEnd;
    input.value = input.value.substring(0, start) + emoji + input.value.substring(end);
    input.focus();
    input.setSelectionRange(start + emoji.length, start + emoji.length);
  }

  function updateListTitle() {
    var el = get("list-title");
    if (el) el.textContent = "Мої чати — " + Object.keys(chats).length;
  }

  function renderChatList() {
    var container = get("chat-list");
    if (!container) return;
    container.innerHTML = "";

    Object.keys(chats).forEach(function (chatId) {
      var chat = chats[chatId];
      var user = users[chat.user];
      if (!user) return;

      var item = document.createElement("div");
      item.className = "chat-list-item" + (chatId === currentChat ? " active" : "");

      var avatar = document.createElement("img");
      avatar.className = "chat-list-avatar";
      avatar.src = user.avatar;
      avatar.alt = user.name;

      var info = document.createElement("div");
      info.className = "chat-list-info";

      var name = document.createElement("div");
      name.className = "chat-list-name";
      var profileLink = document.createElement("a");
      profileLink.href = user.profile;
      profileLink.textContent = user.name;
      profileLink.addEventListener("click", function (e) { e.stopPropagation(); });
      name.appendChild(profileLink);

      var st = resolveUserStatus(user);
      var statusEl = document.createElement("div");
      statusEl.className = "chat-list-status " + st.className;
      statusEl.textContent = st.text;

      var preview = document.createElement("div");
      preview.className = "chat-list-preview";
      if (chat.messages.length > 0) {
        var last = chat.messages[chat.messages.length - 1];
        if (last.type === "image") preview.textContent = "🖼 Зображення";
        else if (last.type === "file") preview.textContent = "📎 " + last.fileName;
        else preview.textContent = last.text || "";
      } else {
        preview.textContent = chat.loaded ? "Немає повідомлень" : "—";
      }

      info.appendChild(name);
      info.appendChild(statusEl);
      info.appendChild(preview);
      item.appendChild(avatar);
      item.appendChild(info);

      item.addEventListener("click", function () { openChat(chatId); });
      container.appendChild(item);
    });
  }

  function setMobileChatOpen(open) {
    var page = get("hoomenchat-messages-page");
    if (!page) return;
    if (open) page.classList.add("mobile-chat-open");
    else page.classList.remove("mobile-chat-open");
  }

  function showEmptyState() {
    var empty = get("conversation-empty");
    var active = get("conversation-active");
    if (empty) empty.style.display = "block";
    if (active) active.style.display = "none";
    setMobileChatOpen(false);
  }

  function showActiveConversation() {
    var empty = get("conversation-empty");
    var active = get("conversation-active");
    if (empty) empty.style.display = "none";
    if (active) active.style.display = "block";
    setMobileChatOpen(true);
  }

  /* Підтягнути відповіді з bots/*.js (window.HoomenBotReplies) */
  function applyBotReplies() {
    var pack = window.HoomenBotReplies || {};
    Object.keys(pack).forEach(function (id) {
      if (!users[id] || !pack[id]) return;
      var conf = pack[id];
      if (conf.autoReply) users[id].autoReply = conf.autoReply;
      if (conf.keywordReplies) users[id].keywordReplies = conf.keywordReplies;
      if (conf.singleWordReplies) users[id].singleWordReplies = conf.singleWordReplies;
    });
  }
  applyBotReplies();

  /* Боти, які пишуть першими — текст з bots/*.js або запасний */
  var botsWhoWriteFirst = {};
  (function buildFirstMessages() {
    var pack = window.HoomenBotReplies || {};
    var fallback = "Привіт! Тут є одне питання, треба твоя порада.";
    ["blue_comet", "night_fox", "rusty_robot"].forEach(function (id) {
      botsWhoWriteFirst[id] =
        (pack[id] && pack[id].firstMessage) ? pack[id].firstMessage : fallback;
    });
  })();

  function showTypingIndicator() {
    var windowElement = get("messages-window");
    if (!windowElement) return null;
    var existing = windowElement.querySelector(".typing-row");
    if (existing) return existing;

    var row = document.createElement("div");
    row.className = "typing-row";
    row.id = "typing-indicator";
    row.innerHTML =
      '<div class="typing-bubble">Пише' +
      '<span class="typing-dots">' +
      '<span>.</span><span>.</span><span>.</span>' +
      "</span></div>";
    windowElement.appendChild(row);
    windowElement.scrollTop = windowElement.scrollHeight;
    return row;
  }

  function hideTypingIndicator() {
    var el = document.getElementById("typing-indicator");
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function ensureBotFirstMessage(chatId) {
    var chat = chats[chatId];
    if (!chat || !botsWhoWriteFirst[chatId]) return;
    if (chat._botStarted) return;
    chat._botStarted = true;

    /* Прибираємо попередньо завантажені повідомлення від бота —
       покажемо їх із затримкою та індикатором «Пише...» */
    var kept = [];
    for (var i = 0; i < chat.messages.length; i++) {
      if (chat.messages[i] && chat.messages[i].from === "me") {
        kept.push(chat.messages[i]);
      }
    }
    chat.messages = kept;

    if (currentChat === chatId) {
      renderMessages();
      showTypingIndicator();
    }

    var delay = 1800 + Math.floor(Math.random() * 1200);
    setTimeout(function () {
      hideTypingIndicator();
      chat.messages.push({
        from: "them",
        type: "text",
        text: botsWhoWriteFirst[chatId],
        time: getCurrentTime()
      });
      renderChatList();
      if (currentChat === chatId) renderMessages();
    }, delay);
  }

  function openChat(chatId) {
    if (!chats[chatId]) return;
    currentChat = chatId;
    pendingAttachments = [];
    renderSelectedFiles();
    renderChatList();
    showActiveConversation();

    if (!chats[chatId].loaded) loadChat(chatId);
    else {
      renderConversation();
      ensureBotFirstMessage(chatId);
    }
  }

  function closeChatToList() {
    currentChat = null;
    renderChatList();
    showEmptyState();
  }

  function loadChat(chatId) {
    var status = get("compose-status");
    if (status) status.textContent = "Завантаження...";

    fetch("chats/" + chatId + ".json")
      .then(function (response) {
        if (!response.ok) throw new Error("Файл не знайдено");
        return response.json();
      })
      .then(function (data) {
        var msgs = data.messages || [];
        var now = getCurrentTime();
        for (var i = 0; i < msgs.length; i++) {
          if (msgs[i] && msgs[i].from === "them" && !msgs[i]._timeFixed) {
            msgs[i].time = now;
            msgs[i]._timeFixed = true;
          }
        }
        chats[chatId].messages = msgs;
        chats[chatId].loaded = true;
        if (currentChat === chatId) renderConversation();
        ensureBotFirstMessage(chatId);
        renderChatList();
        if (status) status.textContent = "";
      })
      .catch(function () {
        chats[chatId].messages = [];
        chats[chatId].loaded = true;
        if (currentChat === chatId) renderConversation();
        ensureBotFirstMessage(chatId);
        renderChatList();
        if (status) {
          if (!botsWhoWriteFirst[chatId]) {
            status.textContent = "Чат порожній або файл відсутній";
            setTimeout(function () {
              if (status.textContent.indexOf("порожній") !== -1) status.textContent = "";
            }, 3000);
          } else {
            status.textContent = "";
          }
        }
      });
  }

  function renderConversationHeader() {
    var header = get("conversation-header");
    if (!header || !currentChat) return;
    var chat = chats[currentChat];
    var user = users[chat.user];
    if (!user) return;

    header.innerHTML = "";

    var avatar = document.createElement("img");
    avatar.className = "conversation-avatar";
    avatar.src = user.avatar;
    avatar.alt = user.name;

    var userBlock = document.createElement("div");
    userBlock.className = "conversation-user";

    var name = document.createElement("div");
    name.className = "conversation-name";
    var profileLink = document.createElement("a");
    profileLink.href = user.profile;
    profileLink.textContent = user.name;
    name.appendChild(profileLink);

    var st = resolveUserStatus(user);
    var status = document.createElement("div");
    status.className = "conversation-status " + st.className;
    status.textContent = st.text;

    userBlock.appendChild(name);
    userBlock.appendChild(status);
    header.appendChild(avatar);
    header.appendChild(userBlock);
  }

  function createImageMessage(message) {
    var container = document.createElement("div");
    var image = document.createElement("img");
    image.className = "chat-image";
    image.src = message.url;
    image.alt = message.fileName || "Зображення";
    image.addEventListener("click", function () {
      openImageViewer(message.url, message.fileName);
    });
    container.appendChild(image);
    if (message.fileName) {
      var caption = document.createElement("div");
      caption.className = "chat-image-caption";
      caption.textContent = message.fileName;
      container.appendChild(caption);
    }
    return container;
  }

  function createFileMessage(message) {
    var link = document.createElement("a");
    link.className = "chat-file";
    link.href = message.url;
    link.download = message.fileName || "file";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.innerHTML = '<span class="chat-file-icon">📎</span>' + escapeHtml(message.fileName || "Файл");
    return link;
  }

  function renderMessages() {
    var windowElement = get("messages-window");
    if (!windowElement || !currentChat) return;
    var chat = chats[currentChat];
    windowElement.innerHTML = "";

    chat.messages.forEach(function (message) {
      var row = document.createElement("div");
      row.className = "message-row " + (message.from === "me" ? "mine" : "theirs");
      var bubble = document.createElement("div");
      bubble.className = "message-bubble";

      if (message.type === "image") bubble.appendChild(createImageMessage(message));
      else if (message.type === "file") bubble.appendChild(createFileMessage(message));
      else bubble.textContent = message.text || "";

      var time = document.createElement("div");
      time.className = "message-time";
      time.textContent = message.time || "";

      row.appendChild(bubble);
      row.appendChild(time);
      windowElement.appendChild(row);
    });
    windowElement.scrollTop = windowElement.scrollHeight;
  }

  function renderConversation() {
    renderConversationHeader();
    renderMessages();
  }

  function getCurrentTime() {
    var date = new Date();
    return String(date.getHours()).padStart(2, "0") + ":" + String(date.getMinutes()).padStart(2, "0");
  }

  function renderSelectedFiles() {
    var container = get("selected-files");
    if (!container) return;
    container.innerHTML = "";
    pendingAttachments.forEach(function (file, index) {
      var item = document.createElement("span");
      item.className = "selected-file";
      item.appendChild(document.createTextNode((file.kind === "image" ? "🖼 " : "📎 ") + file.name));
      var remove = document.createElement("span");
      remove.className = "selected-file-remove";
      remove.textContent = "✕";
      remove.addEventListener("click", function () { removePendingFile(index); });
      item.appendChild(remove);
      container.appendChild(item);
    });
  }

  function removePendingFile(index) {
    if (!pendingAttachments[index]) return;
    var attachment = pendingAttachments[index];
    if (attachment.url && attachment.url.indexOf("blob:") === 0) {
      try { URL.revokeObjectURL(attachment.url); } catch (e) {}
    }
    pendingAttachments.splice(index, 1);
    renderSelectedFiles();
  }

  function handleFiles(fileList, kind) {
    if (!fileList) return;
    Array.prototype.forEach.call(fileList, function (file) {
      if (!file) return;
      if (kind === "image") {
        var imageCheck = isAllowedImage(file);
        if (!imageCheck.allowed) { showStatus(imageCheck.reason); return; }
        var reader = new FileReader();
        reader.onload = function (event) {
          pendingAttachments.push({
            kind: "image", name: file.name, url: event.target.result,
            size: file.size, type: file.type || "image/jpeg"
          });
          renderSelectedFiles();
        };
        reader.onerror = function () { showStatus("Не вдалося прочитати зображення."); };
        reader.readAsDataURL(file);
        return;
      }
      var fileCheck = isAllowedFile(file);
      if (!fileCheck.allowed) { showStatus(fileCheck.reason); return; }
      pendingAttachments.push({
        kind: "file", name: file.name, url: URL.createObjectURL(file),
        size: file.size, type: file.type
      });
    });
    renderSelectedFiles();
  }

  function showStatus(text) {
    var status = get("compose-status");
    if (!status) return;
    status.textContent = text;
    setTimeout(function () {
      if (status.textContent === text) status.textContent = "";
    }, 3500);
  }

  function sendMessage() {
    if (!currentChat) return;
    var input = get("message-input");
    if (!input) return;
    var text = input.value.trim();
    if (!text && !pendingAttachments.length) {
      showStatus("Введіть повідомлення або прикріпіть файл.");
      return;
    }

    var now = getCurrentTime();
    if (text) {
      chats[currentChat].messages.push({ from: "me", type: "text", text: text, time: now });
    }
    pendingAttachments.forEach(function (attachment) {
      chats[currentChat].messages.push({
        from: "me", type: attachment.kind, text: "",
        url: attachment.url, fileName: attachment.name, mime: attachment.type, time: now
      });
    });

    input.value = "";
    pendingAttachments = [];
    renderSelectedFiles();
    renderMessages();
    renderChatList();
    showStatus("Надіслано.");
    triggerAutoReply(currentChat);
  }

  function pickFromList(arr) {
    if (!arr || !arr.length) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function pickBotReply(user, lastText) {
    if (!user) return null;

    /* На випадок, якщо bots/*.js підвантажились із запізненням */
    if (!user.keywordReplies && window.HoomenBotReplies && window.HoomenBotReplies[user.name]) {
      applyBotReplies();
    }

    var text = String(lastText || "").trim().toLowerCase();
    if (!text) {
      return pickFromList(user.autoReply);
    }

    var words = text.split(/\s+/).filter(Boolean);
    var isSingleWord = words.length === 1;
    var word = isSingleWord ? words[0].replace(/[.,!?;:«»"'()]+$/g, "").replace(/^[.,!?;:«»"'()]+/g, "") : "";

    /* 1) Точне одне слово → singleWordReplies */
    if (isSingleWord && user.singleWordReplies && user.singleWordReplies[word]) {
      return user.singleWordReplies[word];
    }

    /* 2) Точний ключ у keywordReplies (і для одного слова «питання») */
    if (user.keywordReplies) {
      if (isSingleWord && user.keywordReplies[word] && user.keywordReplies[word].length) {
        return pickFromList(user.keywordReplies[word]);
      }
      if (user.keywordReplies[text] && user.keywordReplies[text].length) {
        return pickFromList(user.keywordReplies[text]);
      }

      /* 3) Підрядок: довші ключі першими (щоб «питання» било раніше за «як») */
      var keys = Object.keys(user.keywordReplies).sort(function (a, b) {
        return b.length - a.length;
      });
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key && text.indexOf(key) !== -1) {
          var hit = pickFromList(user.keywordReplies[key]);
          if (hit) return hit;
        }
      }
    }

    /* 4) Запасний autoReply */
    return pickFromList(user.autoReply);
  }

  function triggerAutoReply(chatId) {
    var chat = chats[chatId];
    if (!chat) return;
    var user = users[chat.user];
    if (!user) return;

    var lastText = "";
    for (var i = chat.messages.length - 1; i >= 0; i--) {
      if (chat.messages[i].from === "me" && chat.messages[i].type === "text") {
        lastText = chat.messages[i].text || "";
        break;
      }
    }

    var reply = pickBotReply(user, lastText);
    if (!reply) return;

    if (currentChat === chatId) {
      showTypingIndicator();
    }

    var delay = 1200 + Math.floor(Math.random() * 1600);
    setTimeout(function () {
      hideTypingIndicator();
      chats[chatId].messages.push({
        from: "them", type: "text", text: reply, time: getCurrentTime()
      });
      renderChatList();
      if (currentChat === chatId) renderMessages();
    }, delay);
  }

  function setupInput() {
    var input = get("message-input");
    var button = get("send-button");
    var emojiButton = get("emoji-button");
    var emojiPanel = get("emoji-panel");
    var imageButton = get("image-button");
    var fileButton = get("file-button");
    var imageInput = get("image-input");
    var fileInput = get("file-input");
    var backBtn = get("conversation-back");

    if (button) button.addEventListener("click", sendMessage);
    if (backBtn) backBtn.addEventListener("click", closeChatToList);

    if (input) {
      input.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          sendMessage();
        }
      });
    }

    if (emojiButton && emojiPanel) {
      emojiButton.addEventListener("click", function () {
        emojiPanel.classList.toggle("open");
      });
    }

    if (imageButton && imageInput) {
      imageButton.addEventListener("click", function () { imageInput.click(); });
      imageInput.addEventListener("change", function () {
        handleFiles(imageInput.files, "image");
        imageInput.value = "";
      });
    }

    if (fileButton && fileInput) {
      fileButton.addEventListener("click", function () { fileInput.click(); });
      fileInput.addEventListener("change", function () {
        handleFiles(fileInput.files, "file");
        fileInput.value = "";
      });
    }
  }

  function openImageViewer(url, alt) {
    var viewer = get("image-viewer");
    var image = get("image-viewer-image");
    if (!viewer || !image || !url) return;
    if (viewer.parentNode !== document.body) document.body.appendChild(viewer);
    image.src = url;
    image.alt = alt || "";
    viewer.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeImageViewer() {
    var viewer = get("image-viewer");
    var image = get("image-viewer-image");
    if (!viewer) return;
    viewer.classList.remove("open");
    if (image) { image.src = ""; image.alt = ""; }
    document.body.style.overflow = "";
  }

  function setupImageViewer() {
    var viewer = get("image-viewer");
    var close = get("image-viewer-close");
    if (!viewer) return;
    if (viewer.parentNode !== document.body) document.body.appendChild(viewer);
    if (close) {
      close.addEventListener("click", function (e) {
        e.stopPropagation();
        closeImageViewer();
      });
    }
    viewer.addEventListener("click", function (e) {
      if (e.target === viewer) closeImageViewer();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeImageViewer();
    });
  }

  /* Запуск — БЕЗ авто-відкриття чату */
  updateListTitle();
  renderEmojiPanel();
  renderChatList();
  showEmptyState();
  renderSelectedFiles();
  setupInput();
  setupImageViewer();
  setInterval(refreshAllStatuses, 60000);
})();

  setupImageViewer();
  setInterval(refreshAllStatuses, 60000);
})();

/**
 * Гуменчат — движок авто-статусів і сімейки
 *
 * Підключення на сторінці персонажа (ДО hoomenchat-profile.js):
 *   <script src="../js/status-data.js"></script>
 *   <script src="../js/status-engine.js"></script>
 *   <script>
 *     window.HOOMEN_PROFILE = { nickname: "alina_may", ... };
 *   </script>
 *   <script src="../hoomenchat-profile.js"></script>
 *
 * Або якщо HOOMEN_PROFILE вже заданий раніше — движок підхопить nickname з нього.
 */
(function () {
  "use strict";

  var DATA = window.HoomenStatusData;
  if (!DATA) {
    console.warn("[status-engine] HoomenStatusData не знайдено. Підключи status-data.js першим.");
    return;
  }

  /* ---------- утиліти ---------- */

  function hashStr(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function seededRandom(seed) {
    var x = seed >>> 0;
    return function () {
      x = (Math.imul(x, 1664525) + 1013904223) >>> 0;
      return x / 4294967296;
    };
  }

  function pad2(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  function getDateParts(d) {
    d = d || new Date();
    var y = d.getFullYear();
    var m = d.getMonth() + 1;
    var day = d.getDate();
    var hour = d.getHours();
    // ISO week
    var tmp = new Date(Date.UTC(y, m - 1, day));
    var dayNum = tmp.getUTCDay() || 7;
    tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
    var week = Math.ceil((((tmp - yearStart) / 86400000) + 1) / 7);
    return {
      y: y, m: m, day: day, hour: hour,
      dateKey: y + "-" + pad2(m) + "-" + pad2(day),
      weekKey: y + "-W" + pad2(week),
      monthKey: y + "-" + pad2(m)
    };
  }

  function periodKey(period, parts) {
    if (period === "day") return parts.dateKey;
    if (period === "week") return parts.weekKey;
    if (period === "month") return parts.monthKey;
    return parts.dateKey;
  }

  function pickFromPool(pool, seedStr) {
    if (!pool || !pool.length) return "";
    var idx = hashStr(seedStr) % pool.length;
    return pool[idx];
  }

  function profileUrl(nick) {
    var entry = DATA[nick];
    var file = (entry && entry.file) ? entry.file : (nick.replace(/_/g, "-") + ".html");
    return (DATA.profileBaseUrl || "") + file;
  }

  /* ---------- статус ---------- */

  function resolveStatusText(nick, entry, parts) {
    var pool = entry.statusPool || [];
    if (!pool.length) return "";

    var times = entry.statusTimesPerDay || 1;
    var slot = 0;
    if (times >= 2) {
      // день 0–13, вечір 14–23
      slot = parts.hour < 14 ? 0 : 1;
    }
    var seed = parts.dateKey + "|status|" + nick + "|" + slot;
    return pickFromPool(pool, seed);
  }

  /* ---------- сімейка: Група 1 (vira ↔ oleg) ---------- */

  function resolvePairViraOleg(parts) {
    var key = periodKey("day", parts);
    var rnd = seededRandom(hashStr(key + "|pair_vira_oleg"));
    var roll = rnd();

    // ~50% у стосунках одне з одним, інакше seeking / single
    if (roll < 0.50) {
      return {
        vira_yang: {
          type: "relationship",
          partnerName: "oleg_chub",
          partnerUrl: profileUrl("oleg_chub")
        },
        oleg_chub: {
          type: "relationship",
          partnerName: "vira_yang",
          partnerUrl: profileUrl("vira_yang")
        }
      };
    }

    function solo(nick) {
      var r = seededRandom(hashStr(key + "|solo|" + nick))();
      if (r < 0.50) return { type: "seeking" };
      return { type: "single" };
    }

    return {
      vira_yang: solo("vira_yang"),
      oleg_chub: solo("oleg_chub")
    };
  }

  /* ---------- сімейка: Група 2 (пул 4×4) ---------- */

  function resolvePool4x4(parts) {
    // період беремо з першого учасника (усі week)
    var key = periodKey("week", parts);
    var rnd = seededRandom(hashStr(key + "|pool_4x4"));

    var women = DATA.poolWomen.slice();
    var men = DATA.poolMen.slice();

    // перемішуємо
    function shuffle(arr) {
      for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(rnd() * (i + 1));
        var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
      }
      return arr;
    }
    shuffle(women);
    shuffle(men);

    // скільки пар цього тижня (0–3), частіше 1–2
    var pairCountRoll = rnd();
    var pairCount = 0;
    if (pairCountRoll < 0.10) pairCount = 0;
    else if (pairCountRoll < 0.40) pairCount = 1;
    else if (pairCountRoll < 0.75) pairCount = 2;
    else pairCount = 3;

    pairCount = Math.min(pairCount, women.length, men.length);

    var result = {};
    var usedW = {}, usedM = {};

    for (var p = 0; p < pairCount; p++) {
      var w = women[p];
      var m = men[p];
      usedW[w] = true;
      usedM[m] = true;
      result[w] = {
        type: "relationship",
        partnerName: m,
        partnerUrl: profileUrl(m)
      };
      result[m] = {
        type: "relationship",
        partnerName: w,
        partnerUrl: profileUrl(w)
      };
    }

    // решта — seeking / single / none
    function leftover(nick) {
      var r = seededRandom(hashStr(key + "|left|" + nick))();
      if (r < 0.40) return { type: "seeking" };
      if (r < 0.75) return { type: "single" };
      return { type: "none" };
    }

    women.concat(men).forEach(function (nick) {
      if (!result[nick]) result[nick] = leftover(nick);
    });

    return result;
  }

  /* ---------- сімейка: jane_dust ---------- */

  function resolveJane(parts) {
    var key = periodKey("day", parts);
    var r = seededRandom(hashStr(key + "|jane_solo"))();
    // relationship без партнера / seeking / single / none
    if (r < 0.25) return { type: "relationship", partnerName: "", partnerUrl: "" };
    if (r < 0.50) return { type: "seeking" };
    if (r < 0.80) return { type: "single" };
    return { type: "none" };
  }

  /* ---------- головний resolve ---------- */

  var _cache = {};

  function getFamilyMap(parts) {
    var dayKey = parts.dateKey;
    if (_cache[dayKey]) return _cache[dayKey];

    var map = {};
    // група 1
    var pair = resolvePairViraOleg(parts);
    Object.keys(pair).forEach(function (k) { map[k] = pair[k]; });

    // група 2
    var pool = resolvePool4x4(parts);
    Object.keys(pool).forEach(function (k) { map[k] = pool[k]; });

    // jane
    map.jane_dust = resolveJane(parts);

    _cache[dayKey] = map;
    return map;
  }

  function resolveForNick(nick) {
    var entry = DATA[nick];
    if (!entry) return null;

    var parts = getDateParts(new Date());
    var statusText = resolveStatusText(nick, entry, parts);
    var familyMap = getFamilyMap(parts);
    var family = familyMap[nick] || { type: "single" };

    return {
      statusText: statusText,
      family: family,
      schedule: entry.schedule || null,
      gender: entry.gender || null
    };
  }

  /* ---------- застосування до HOOMEN_PROFILE ---------- */

  function applyToProfile() {
    var cfg = window.HOOMEN_PROFILE;
    if (!cfg || !cfg.nickname) return;

    var nick = cfg.nickname;
    var resolved = resolveForNick(nick);
    if (!resolved) return;

    // статус і сімейка — завжди з движка для цих 11
    if (resolved.statusText) {
      cfg.statusText = resolved.statusText;
    }
    if (resolved.family) {
      cfg.family = resolved.family;
    }
    // розклад з даних (щоб збігався з тим, що задано)
    if (resolved.schedule) {
      cfg.schedule = resolved.schedule;
    }
    if (resolved.gender) {
      cfg.gender = resolved.gender;
    }
  }

  // Якщо HOOMEN_PROFILE вже є — застосовуємо одразу.
  // Якщо його зададуть пізніше (перед hoomenchat-profile.js) —
  // викликай window.HoomenStatusEngine.apply() після присвоєння.
  if (window.HOOMEN_PROFILE && window.HOOMEN_PROFILE.nickname) {
    applyToProfile();
  }

  window.HoomenStatusEngine = {
    resolve: resolveForNick,
    apply: applyToProfile,
    getFamilyMap: function () {
      return getFamilyMap(getDateParts(new Date()));
    }
  };

})();

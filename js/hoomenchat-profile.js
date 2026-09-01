/**
 * Гуменчат — скрипт профілю персонажа
 * Підключення: <script src="hoomenchat-profile.js"></script> перед </body>
 *
 * Для КОЖНОЇ сторінки персонажа змінюй лише PROFILE_CONFIG нижче.
 */
(function () {

  /* =====================================================
     КОНФІГ СТОРІНКИ ПЕРСОНАЖА
     Змінюй цей об'єкт для кожного профілю окремо.
     ===================================================== */

  /* Базовий конфіг. На сторінці персонажа можна перевизначити:
     <script>window.HOOMEN_PROFILE = { nickname: "...", ... };</script>
     перед підключенням цього файлу. */
  var PROFILE_CONFIG = {


    /* Нікнейм (відображається скрізь на сторінці) */
    nickname: "copy_pasta",

    /* Повне посилання на аватарку */
    avatar: "https://blogger.googleusercontent.com/img/a/AVvXsEiNU5aLNwKBZvNgLsvxfKYA0hduyABhvfQrHryVIrw1Q2WVFne8Aop849IRmthJlGuRphRDtjX_d-pvH8gcUtCoAL-zkhXAP0utpiVidiXL57SIMaMBjeaXnGhTZ_j2wQj1RZxI-V5TsjxtARZSpoxZ8UGuDX_9t9hmiL6k1OyP6ilE8WmYwfKmHTQFvFg",

    /**
     * true  = основний персонаж
     *         → є кнопка «＋ Новий допис»
     *         → у меню пункт «Головна»
     *
     * false = сторонній персонаж
     *         → кнопки «Новий допис» немає
     *         → замість «Головна» пункт «Мій гумгайл»
     */
    isMainCharacter: true,

    /* Куди веде «Мій гумгайл» (сторінка основного персонажа) */
    mainCharacterUrl: "https://aircmd.github.io/hoomanchat/profiles/copy-pasta.html",

    /* Довільний текст статусу (рядок «Статус: ...») */
    statusText: "ліньки розписувати",

    /**
     * Онлайн-статус (якщо немає schedule).
     *   "online" | "5min" | "25min" | "50min" | "offline" | "long-ago" | свій текст
     *
     * АБО розклад дня (пріоритетніший за onlineStatus):
     * schedule: [
     *   { time: "09:00", status: "online" },
     *   { time: "12:00", status: "away" },
     *   { time: "14:00", status: "online" },
     *   { time: "17:00", status: "away" },
     *   { time: "21:00", status: "offline" }
     * ]
     * status: "online" | "away" | "offline"
     * Для "away" час «був X хв/год назад» рахується сам від початку слоту.
     */
    onlineStatus: "online",
    schedule: null,

    /**
     * Стать — впливає лише на форму «була / був»:
     *   "female" | "male"
     */
    gender: "female",

    /**
     * Сімейка.
     * type:
     *   "seeking"      → Сімейка: шукайголова
     *   "single"       → Сімейка: не шлюбна / не шлюбний
     *   "relationship" → Сімейка: у стуснах з [partner]
     *   "married"      → Сімейка: шлюбна / шлюбний з [partner]
     *   "none"         → рядок сімейки не показується
     */
    family: {
      type: "relationship",
      partnerName: "dreaming_romance",
      partnerUrl: "https://aircmd.github.io/hoomanchat/profiles/dreaming-romance.html"
    },

    /* Посилання лівого меню */
    navLinks: {
      home: "https://aircmd.github.io/hoomanchat/index.html",
      profiles: "https://aircmd.github.io/hoomanchat/profiles.html",
      droomens: "https://aircmd.github.io/hoomanchat/droomens.html",
      activity: "https://aircmd.github.io/hoomanchat/activity.html",
      islands: "https://aircmd.github.io/hoomanchat/islands.html",
      rules: "https://aircmd.github.io/hoomanchat/rules.html"
    },

    /**
     * Живий допис (лише в памʼяті сесії, без localStorage).
     * Увімкни на сторінці персонажа через window.HOOMEN_PROFILE.liveFeed = { ... }
     * Для сторонніх персонажів: 1 випадковий допис з пулу, коли вони «онлайн».
     * Перезавантаження сторінки = інший допис / зникнення.
     *
     * liveFeed: {
     *   enabled: true,
     *   onlyWhenOnline: true,   // за schedule / onlineStatus
     *   posts: [
     *     { title: "Тема", body: "Текст" },
     *     { title: "…", body: "…" }
     *   ],
     *   comments: [             // авто-коментарі з часом
     *     { name: "terry_rex", text: "лол" },
     *     { name: "jamie_duke", text: "…" }
     *   ],
     *   reactions: [            // відповідь, якщо відвідувач залишив коментар
     *     { name: "nasty_emogirl", text: "привіт" },
     *     { name: "terry_rex", text: "йо" }
     *   ],
     *   // опційно:
     *   startLikes: 0,
     *   maxExtraLikes: 12,
     *   maxAutoComments: 4,
     *   likeIntervalMs: [10000, 28000],
     *   commentIntervalMs: [14000, 40000],
     *   reactionDelayMs: [2500, 7000]
     * }
     */
    /* liveFeed: null */
  };

  /* Перевизначення з сторінки персонажа */
  if (window.HOOMEN_PROFILE && typeof window.HOOMEN_PROFILE === "object") {
    var _over = window.HOOMEN_PROFILE;
    for (var _k in _over) {
      if (Object.prototype.hasOwnProperty.call(_over, _k)) {
        if (_k === "family" && _over.family && typeof _over.family === "object") {
          PROFILE_CONFIG.family = Object.assign({}, PROFILE_CONFIG.family || {}, _over.family);
        } else if (_k === "navLinks" && _over.navLinks && typeof _over.navLinks === "object") {
          PROFILE_CONFIG.navLinks = Object.assign({}, PROFILE_CONFIG.navLinks || {}, _over.navLinks);
        } else {
          PROFILE_CONFIG[_k] = _over[_k];
        }
      }
    }
  }


  /* =====================================================
     ЗАСТОСУВАННЯ КОНФІГУ
     ===================================================== */

  function applyProfileConfig() {
    var cfg = PROFILE_CONFIG;
    var nick = cfg.nickname || "гумен";

    document.title = "Гуменчат — " + nick;

    var elNick = document.getElementById("profile-nickname");
    if (elNick) elNick.textContent = nick;

    var elAvatar = document.getElementById("profile-avatar");
    if (elAvatar) {
      elAvatar.src = cfg.avatar || "";
      elAvatar.alt = nick;
    }

    var elHeader = document.getElementById("profile-header-title");
    if (elHeader) {
      elHeader.textContent = cfg.isMainCharacter
        ? ("Мій гумгайл: " + nick)
        : ("Профіль гумена: " + nick);
    }

    var elInfoName = document.getElementById("profile-info-name");
    if (elInfoName) elInfoName.textContent = nick;

    var elStatusText = document.getElementById("profile-status-text");
    if (elStatusText) {
      elStatusText.textContent = cfg.statusText ? ("Статус: " + cfg.statusText) : "";
    }

    updateOnlineStatusDisplay();

    var elFamily = document.getElementById("profile-family");
    if (elFamily) {
      elFamily.innerHTML = buildFamilyHtml(cfg.family, cfg.gender);
    }

    buildNavMenu(cfg);

    var launcher = document.getElementById("new-post-launcher");
    if (launcher) {
      launcher.style.display = cfg.isMainCharacter ? "block" : "none";
    }

    updatePostsCount();
  }

  function buildOnlineStatusMap(gender) {
    var isFemale = gender !== "male";
    var was = isFemale ? "була" : "був";

    return {
      "online":   { text: "● онлайн",          className: "online" },
      "5min":     { text: was + " 5 хв назад",  className: "recent" },
      "25min":    { text: was + " 25 хв назад", className: "away" },
      "50min":    { text: was + " 50 хв назад", className: "away" },
      "offline":  { text: "офлайн",            className: "offline" },
      "long-ago": { text: was + " давно",      className: "long-ago" }
    };
  }

  function parseHHMM(str) {
    if (!str || typeof str !== "string") return null;
    var parts = str.trim().split(":");
    if (parts.length < 2) return null;
    var h = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10);
    if (isNaN(h) || isNaN(m)) return null;
    return h * 60 + m;
  }

  function getNowMinutes() {
    var now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  }

  /**
   * Повертає активний слот розкладу та хвилини від його початку.
   * Слоти йдуть по колу через добу (після 21:00 діє до 09:00 наступного дня).
   */
  function resolveScheduleSlot(schedule) {
    if (!schedule || !schedule.length) return null;

    var slots = [];
    for (var i = 0; i < schedule.length; i++) {
      var item = schedule[i];
      if (!item || !item.time) continue;
      var mins = parseHHMM(item.time);
      if (mins === null) continue;
      slots.push({
        minutes: mins,
        status: item.status || "offline",
        time: item.time
      });
    }
    if (!slots.length) return null;

    slots.sort(function (a, b) { return a.minutes - b.minutes; });

    var nowMins = getNowMinutes();
    var active = slots[slots.length - 1];
    var activeIndex = slots.length - 1;

    for (var j = 0; j < slots.length; j++) {
      if (slots[j].minutes <= nowMins) {
        active = slots[j];
        activeIndex = j;
      }
    }

    var elapsed;
    if (nowMins >= active.minutes) {
      elapsed = nowMins - active.minutes;
    } else {
      /* після опівночі, слот з учора */
      elapsed = nowMins + (24 * 60 - active.minutes);
    }

    return {
      status: active.status,
      elapsedMinutes: elapsed,
      slotTime: active.time
    };
  }

  function formatAwayText(gender, elapsedMinutes) {
    var isFemale = gender !== "male";
    var was = isFemale ? "була" : "був";
    var m = Math.max(0, Math.floor(elapsedMinutes));

    if (m < 1) {
      return { text: was + " щойно", className: "recent" };
    }
    if (m < 60) {
      var cls = m < 15 ? "recent" : "away";
      return { text: was + " " + m + " хв назад", className: cls };
    }

    var hours = Math.floor(m / 60);
    if (hours < 24) {
      var hWord;
      if (hours === 1) hWord = "годину";
      else if (hours >= 2 && hours <= 4) hWord = "години";
      else hWord = "годин";
      return { text: was + " " + hours + " " + hWord + " назад", className: "away" };
    }

    return { text: was + " давно", className: "long-ago" };
  }

  function resolveOnlineInfo(cfg) {
    var gender = cfg.gender;
    var schedule = cfg.schedule;

    if (schedule && schedule.length) {
      var slot = resolveScheduleSlot(schedule);
      if (slot) {
        var st = String(slot.status || "offline").toLowerCase();
        if (st === "online" || st === "on") {
          return { text: "● онлайн", className: "online" };
        }
        if (st === "offline" || st === "off" || st === "sleep") {
          return { text: "офлайн", className: "offline" };
        }
        if (st === "away" || st === "afk") {
          return formatAwayText(gender, slot.elapsedMinutes);
        }
        /* невідомий status у слоті — як offline */
        return { text: "офлайн", className: "offline" };
      }
    }

    var statusMap = buildOnlineStatusMap(gender);
    var key = cfg.onlineStatus || "offline";
    if (statusMap[key]) return statusMap[key];
    return { text: key, className: "offline" };
  }

  function updateOnlineStatusDisplay() {
    var elOnline = document.getElementById("profile-online-status");
    if (!elOnline) return;

    var info = resolveOnlineInfo(PROFILE_CONFIG);
    elOnline.textContent = info.text;
    elOnline.className = "profile-status " + info.className;
  }

  function buildFamilyHtml(family, gender) {
    if (!family || family.type === "none") return "";

    var isFemale = gender !== "male";
    var html = "";

    switch (family.type) {
      case "seeking":
        html = "Сімейка: шукайголова";
        break;
      case "single":
        html = "Сімейка: " + (isFemale ? "не шлюбна" : "не шлюбний");
        break;
      case "relationship":
        if (family.partnerName && String(family.partnerName).trim()) {
          html = "Сімейка: у стуснах з ";
          if (family.partnerUrl) {
            html +=
              '<a href="' +
              escapeAttr(family.partnerUrl) +
              '">' +
              escapeHtml(family.partnerName) +
              "</a>";
          } else {
            html += escapeHtml(family.partnerName);
          }
        } else {
          html = "Сімейка: у стуснах";
        }
        break;
      case "married":
        if (family.partnerName && String(family.partnerName).trim()) {
          html =
            "Сімейка: " +
            (isFemale ? "шлюбна" : "шлюбний") +
            " з ";
          if (family.partnerUrl) {
            html +=
              '<a href="' +
              escapeAttr(family.partnerUrl) +
              '">' +
              escapeHtml(family.partnerName) +
              "</a>";
          } else {
            html += escapeHtml(family.partnerName);
          }
        } else {
          html =
            "Сімейка: " + (isFemale ? "шлюбна" : "шлюбний");
        }
        break;
      default:
        html = "";
    }

    return html ? ("<div>" + html + "</div>") : "";
  }

  function buildNavMenu(cfg) {
    var menu = document.getElementById("nav-menu");
    if (!menu) return;

    var links = cfg.navLinks || {};
    var items = [];

    if (cfg.isMainCharacter) {
      items.push({ label: "Головна", href: links.home || "#" });
    } else {
      items.push({
        label: "Мій гумгайл",
        href: cfg.mainCharacterUrl || links.home || "#"
      });
    }

    items.push(
      { label: "Гумени",     href: links.profiles || "#" },
      { label: "Друмени",    href: links.droomens || "#" },
      { label: "Стрічерчат", href: links.activity || "#" },
      { label: "Острови",    href: links.islands || "#" },
      { label: "Правила",    href: links.rules || "#" }
    );

    menu.innerHTML = "";
    items.forEach(function (item) {
      var a = document.createElement("a");
      a.className = "nav-item";
      a.href = item.href;
      a.textContent = item.label;
      menu.appendChild(a);
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(str) {
    return String(str).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }


  /* =====================================================
     ПІДРАХУНОК ДОПИСІВ
     ===================================================== */

  function updatePostsCount() {
    var postList = document.querySelectorAll("#profile-posts .profile-post, #copy-posts .profile-post");
    var countEl = document.getElementById("posts-count");
    var header = document.getElementById("posts-header");
    var nick = (PROFILE_CONFIG && PROFILE_CONFIG.nickname) || "гумен";

    if (countEl) countEl.textContent = postList.length;
    if (header) {
      header.innerHTML =
        "Дописи " + escapeHtml(nick) +
        " — <span id=\"posts-count\">" + postList.length + "</span>";
    }
  }


  /* =====================================================
     ПОКАЗ ДОПИСІВ: більше / менше
     ===================================================== */

  var posts = document.querySelectorAll("#profile-posts .profile-post, #copy-posts .profile-post");
  var showMore = document.getElementById("show-more-posts");
  var showLess = document.getElementById("show-less-posts");
  var initialVisiblePosts = 3;
  var visiblePosts = initialVisiblePosts;
  var postsPerClick = 5;

  function updatePostVisibility() {
    posts = document.querySelectorAll("#profile-posts .profile-post, #copy-posts .profile-post");

    for (var i = 0; i < posts.length; i++) {
      posts[i].style.display = i < visiblePosts ? "block" : "none";
    }

    if (showMore) {
      showMore.className =
        visiblePosts >= posts.length ? "show-more hidden" : "show-more";
    }

    if (showLess) {
      showLess.className =
        visiblePosts > initialVisiblePosts ? "show-more" : "show-more hidden";
    }

    updatePostsCount();
  }

  if (showMore) {
    showMore.addEventListener("click", function () {
      visiblePosts += postsPerClick;
      if (visiblePosts > posts.length) visiblePosts = posts.length;
      updatePostVisibility();
    });
  }

  if (showLess) {
    showLess.addEventListener("click", function () {
      visiblePosts -= postsPerClick;
      if (visiblePosts < initialVisiblePosts) visiblePosts = initialVisiblePosts;
      updatePostVisibility();
    });
  }


  /* =====================================================
     ЛАЙКИ
     data-base-likes="29" — стартова (фейкова) кількість
     ===================================================== */

  function bindLikeButton(button) {
    if (button.getAttribute("data-like-bound") === "1") return;
    button.setAttribute("data-like-bound", "1");

    button.addEventListener("click", function () {
      var count = button.querySelector(".like-count");
      var base = parseInt(button.getAttribute("data-base-likes") || "0", 10);
      if (isNaN(base)) base = 0;

      var current = parseInt((count.textContent || "0").replace(/\s/g, ""), 10);
      if (isNaN(current)) current = base;

      if (button.classList.contains("liked")) {
        current = Math.max(0, current - 1);
        button.classList.remove("liked");
        button.innerHTML =
          "♡ Подобається " +
          '<span class="like-count">' +
          current.toLocaleString("uk-UA") +
          "</span>";
      } else {
        current = current + 1;
        button.classList.add("liked");
        button.innerHTML =
          "♥ Подобається " +
          '<span class="like-count">' +
          current.toLocaleString("uk-UA") +
          "</span>";
      }
    });
  }

  function bindAllLikeButtons() {
    document
      .querySelectorAll("#hoomenchat-site .like-button")
      .forEach(bindLikeButton);
  }


  /* =====================================================
     КОМЕНТАРІ
     ===================================================== */

  function bindCommentButton(button) {
    if (button.getAttribute("data-comment-bound") === "1") return;
    button.setAttribute("data-comment-bound", "1");

    button.addEventListener("click", function () {
      var post = button.closest(".profile-post");
      if (!post) return;
      var comments = post.querySelector(".comments-area");
      if (comments) comments.classList.toggle("open");
    });
  }

  /* Ім'я, від якого коментує відвідувач (основний персонаж сайту) */
  function getCommentAuthor() {
    if (window.HOOMEN_CURRENT_USER && window.HOOMEN_CURRENT_USER.name) {
      return {
        name: window.HOOMEN_CURRENT_USER.name,
        url: window.HOOMEN_CURRENT_USER.profileUrl || null
      };
    }
    return {
      name: "copy_pasta",
      url: "copy-pasta.html"
    };
  }

  function createAuthorCommentElement(text) {
    var author = getCommentAuthor();

    var comment = document.createElement("div");
    comment.className = "fake-comment";

    var nameRow = document.createElement("div");
    nameRow.className = "fake-comment-name";

    if (author.url) {
      var link = document.createElement("a");
      link.href = author.url;
      link.textContent = author.name;
      nameRow.appendChild(link);
    } else {
      nameRow.textContent = author.name;
    }

    comment.appendChild(nameRow);
    comment.appendChild(document.createTextNode(text));
    return comment;
  }

  function bindSendButton(button) {
    if (button.getAttribute("data-send-bound") === "1") return;
    button.setAttribute("data-send-bound", "1");

    button.addEventListener("click", function () {
      var form = button.closest(".comment-form");
      if (!form) return;

      var input = form.querySelector(".comment-input");
      var text = input && input.value ? input.value.trim() : "";
      if (!text) return;

      var comment = createAuthorCommentElement(text);
      form.parentNode.insertBefore(comment, form);
      if (input) input.value = "";

      var post = form.closest(".profile-post");
      if (post) {
        var count = post.querySelector(".comment-count");
        if (count) {
          var number = parseInt(count.textContent, 10) || 0;
          count.textContent = number + 1;
        }
        /* Реакція на коментар відвідувача (живий допис) */
        if (typeof window.__hoomenLiveFeedOnVisitorComment === "function") {
          window.__hoomenLiveFeedOnVisitorComment(post, text);
        }
      }
    });
  }

  function bindAllCommentButtons() {
    document
      .querySelectorAll("#hoomenchat-site .comment-button")
      .forEach(bindCommentButton);
    document
      .querySelectorAll("#hoomenchat-site .comment-send")
      .forEach(bindSendButton);
  }


  /* =====================================================
     СТВОРЕННЯ ТИМЧАСОВОГО ДОПИСУ
     ===================================================== */

  var newPostLauncher = document.getElementById("new-post-launcher");
  var createPostBox = document.getElementById("create-post-box");
  var newPostTitle = document.getElementById("new-post-title");
  var newPostText = document.getElementById("new-post-text");
  var newPostImages = document.getElementById("new-post-images");
  var newPostPreviews = document.getElementById("new-post-previews");
  var publishPost = document.getElementById("publish-post");
  var cancelNewPost = document.getElementById("cancel-new-post");
  var createPostError = document.getElementById("create-post-error");
  var copyPosts = document.getElementById("profile-posts") || document.getElementById("copy-posts");

  var selectedPostImages = [];
  var MAX_POST_IMAGE_SIZE = 10 * 1024 * 1024;
  var ALLOWED_POST_IMAGE_TYPES = {
    "image/jpeg": true,
    "image/png": true,
    "image/gif": true,
    "image/webp": true
  };

  function showCreatePostError(text) {
    if (!createPostError) return;
    createPostError.textContent = text || "";
    createPostError.className = text
      ? "create-post-error open"
      : "create-post-error";
  }

  function resetCreatePostForm(revokeImages) {
    if (revokeImages) {
      selectedPostImages.forEach(function (item) {
        if (item.url && item.url.indexOf("blob:") === 0) {
          try {
            URL.revokeObjectURL(item.url);
          } catch (e) {}
        }
      });
    }
    selectedPostImages = [];
    if (newPostTitle) newPostTitle.value = "";
    if (newPostText) newPostText.value = "";
    if (newPostImages) newPostImages.value = "";
    if (newPostPreviews) newPostPreviews.innerHTML = "";
    showCreatePostError("");
  }

  function renderCreatePostPreviews() {
    if (!newPostPreviews) return;
    newPostPreviews.innerHTML = "";

    selectedPostImages.forEach(function (item, index) {
      var frame = document.createElement("div");
      frame.className = "create-post-preview-frame";

      var image = document.createElement("img");
      image.className = "create-post-preview-image";
      image.src = item.url;
      image.alt = item.name;
      image.title = "Натисни, щоб переглянути";

      image.addEventListener("click", function () {
        openPostImageViewer(
          selectedPostImages.map(function (x) {
            return x.url;
          }),
          index
        );
      });

      var remove = document.createElement("button");
      remove.type = "button";
      remove.className = "create-post-preview-remove";
      remove.textContent = "✕";
      remove.title = "Прибрати зображення";

      remove.addEventListener("click", function () {
        var removed = selectedPostImages[index];
        if (removed && removed.url.indexOf("blob:") === 0) {
          try {
            URL.revokeObjectURL(removed.url);
          } catch (e) {}
        }
        selectedPostImages.splice(index, 1);
        renderCreatePostPreviews();
      });

      var name = document.createElement("div");
      name.className = "create-post-preview-name";
      name.textContent = item.name;

      frame.appendChild(image);
      frame.appendChild(remove);
      frame.appendChild(name);
      newPostPreviews.appendChild(frame);
    });
  }

  function addPostImages(fileList) {
    showCreatePostError("");
    if (!fileList) return;

    Array.prototype.forEach.call(fileList, function (file) {
      if (!file) return;

      if (!ALLOWED_POST_IMAGE_TYPES[file.type]) {
        showCreatePostError("Дозволені лише JPG, PNG, GIF та WebP.");
        return;
      }

      if (file.size > MAX_POST_IMAGE_SIZE) {
        showCreatePostError(
          "Зображення «" +
            file.name +
            "» завелике. Максимальний розмір одного зображення — 10 МБ."
        );
        return;
      }

      var url = URL.createObjectURL(file);
      selectedPostImages.push({
        name: file.name,
        url: url,
        type: file.type,
        size: file.size
      });
    });

    renderCreatePostPreviews();
  }

  if (newPostLauncher) {
    newPostLauncher.addEventListener("click", function () {
      if (!createPostBox) return;
      createPostBox.classList.toggle("collapsed");
      if (!createPostBox.classList.contains("collapsed") && newPostTitle) {
        newPostTitle.focus();
      }
    });
  }

  if (cancelNewPost) {
    cancelNewPost.addEventListener("click", function () {
      resetCreatePostForm(true);
      if (createPostBox) createPostBox.classList.add("collapsed");
    });
  }

  if (newPostImages) {
    newPostImages.addEventListener("change", function () {
      addPostImages(newPostImages.files);
      newPostImages.value = "";
    });
  }

  if (publishPost) {
    publishPost.addEventListener("click", function () {
      var title = newPostTitle ? newPostTitle.value.trim() : "";
      var text = newPostText ? newPostText.value.trim() : "";

      showCreatePostError("");

      if (!title || !text) {
        showCreatePostError("Заповни заголовок та текст допису.");
        return;
      }

      var post = document.createElement("div");
      post.className = "profile-post";
      post.style.display = "block";

      var titleDiv = document.createElement("div");
      titleDiv.className = "profile-post-title";
      titleDiv.textContent = title;

      var bodyDiv = document.createElement("div");
      bodyDiv.className = "profile-post-body";
      bodyDiv.textContent = text;

      if (selectedPostImages.length) {
        var gallery = document.createElement("div");
        gallery.className = "post-images-grid";

        selectedPostImages.forEach(function (item, imageIndex) {
          var frame = document.createElement("div");
          frame.className = "post-image-frame";

          var image = document.createElement("img");
          image.className = "profile-post-image";
          image.src = item.url;
          image.alt = item.name;
          image.title = "Натисни, щоб переглянути";

          image.addEventListener("click", function () {
            var urls = Array.prototype.map.call(
              gallery.querySelectorAll(".profile-post-image"),
              function (img) {
                return img.src;
              }
            );
            openPostImageViewer(urls, imageIndex);
          });

          frame.appendChild(image);
          gallery.appendChild(frame);
        });

        bodyDiv.appendChild(gallery);
      }

      var actionsDiv = document.createElement("div");
      actionsDiv.className = "post-actions";
      actionsDiv.innerHTML =
        '<button class="like-button" type="button" data-base-likes="0">' +
        '♡ Подобається <span class="like-count">0</span></button>' +
        '<button class="comment-button" type="button">' +
        '💬 Коментарі <span class="comment-count">0</span></button>';

      var commentsArea = document.createElement("div");
      commentsArea.className = "comments-area";
      commentsArea.innerHTML =
        '<div class="comment-form">' +
        '<textarea class="comment-input" placeholder="Написати коментар..."></textarea>' +
        '<button class="comment-send" type="button">Відправити</button>' +
        "</div>";

      var dateDiv = document.createElement("div");
      dateDiv.className = "profile-post-date";
      dateDiv.textContent = "щойно";

      post.appendChild(titleDiv);
      post.appendChild(bodyDiv);
      post.appendChild(actionsDiv);
      post.appendChild(commentsArea);
      post.appendChild(dateDiv);

      if (copyPosts) copyPosts.insertBefore(post, copyPosts.firstChild);

      bindTemporaryPostEvents(post);
      bindExistingPostImageViewers();

      resetCreatePostForm(false);
      if (createPostBox) createPostBox.classList.add("collapsed");

      visiblePosts = Math.max(visiblePosts, 1);
      updatePostVisibility();
    });
  }

  function bindTemporaryPostEvents(post) {
    var likeButton = post.querySelector(".like-button");
    var commentButton = post.querySelector(".comment-button");
    var sendButton = post.querySelector(".comment-send");

    if (likeButton) bindLikeButton(likeButton);
    if (commentButton) bindCommentButton(commentButton);
    if (sendButton) bindSendButton(sendButton);
  }


  /* =====================================================
     ПЕРЕГЛЯД ЗОБРАЖЕНЬ
     ===================================================== */

  var postImageViewer = document.getElementById("post-image-viewer");
  var postImageViewerImage = document.getElementById("post-image-viewer-image");
  var postImageViewerClose = document.getElementById("post-image-viewer-close");
  var postImageViewerPrev = document.getElementById("post-image-viewer-prev");
  var postImageViewerNext = document.getElementById("post-image-viewer-next");

  var viewerImages = [];
  var viewerIndex = 0;

  function openPostImageViewer(images, index) {
    if (!postImageViewer || !postImageViewerImage || !images || !images.length) {
      return;
    }

    viewerImages = images.slice();
    viewerIndex = Math.max(0, Math.min(index || 0, viewerImages.length - 1));

    renderPostImageViewer();
    postImageViewer.className = "image-viewer open";
  }

  function renderPostImageViewer() {
    if (!viewerImages.length) return;
    postImageViewerImage.src = viewerImages[viewerIndex];
    postImageViewerImage.alt = "Зображення допису";

    if (postImageViewerPrev) {
      postImageViewerPrev.style.display =
        viewerImages.length > 1 ? "block" : "none";
    }
    if (postImageViewerNext) {
      postImageViewerNext.style.display =
        viewerImages.length > 1 ? "block" : "none";
    }
  }

  function closePostImageViewer() {
    if (!postImageViewer) return;
    postImageViewer.className = "image-viewer";
    if (postImageViewerImage) postImageViewerImage.removeAttribute("src");
    viewerImages = [];
    viewerIndex = 0;
  }

  function showPreviousPostImage() {
    if (viewerImages.length < 2) return;
    viewerIndex =
      (viewerIndex - 1 + viewerImages.length) % viewerImages.length;
    renderPostImageViewer();
  }

  function showNextPostImage() {
    if (viewerImages.length < 2) return;
    viewerIndex = (viewerIndex + 1) % viewerImages.length;
    renderPostImageViewer();
  }

  if (postImageViewerClose) {
    postImageViewerClose.addEventListener("click", closePostImageViewer);
  }
  if (postImageViewerPrev) {
    postImageViewerPrev.addEventListener("click", showPreviousPostImage);
  }
  if (postImageViewerNext) {
    postImageViewerNext.addEventListener("click", showNextPostImage);
  }
  if (postImageViewer) {
    postImageViewer.addEventListener("click", function (event) {
      if (event.target === postImageViewer) closePostImageViewer();
    });
  }

  document.addEventListener("keydown", function (event) {
    if (
      !postImageViewer ||
      postImageViewer.className.indexOf("open") === -1
    ) {
      return;
    }
    if (event.key === "Escape") closePostImageViewer();
    else if (event.key === "ArrowLeft") showPreviousPostImage();
    else if (event.key === "ArrowRight") showNextPostImage();
  });


  /* =====================================================
     КЛІКИ ПО ЗОБРАЖЕННЯХ (універсально, у т.ч. blob)
     ===================================================== */

  function bindExistingPostImageViewers() {
    var images = document.querySelectorAll(
      "#profile-posts .profile-post-image, #copy-posts .profile-post-image"
    );

    images.forEach(function (image) {
      if (image.getAttribute("data-viewer-bound") === "1") return;
      image.setAttribute("data-viewer-bound", "1");

      image.addEventListener("click", function () {
        var gallery = image.closest(".post-images-grid");
        var urls;

        if (gallery) {
          urls = Array.prototype.map.call(
            gallery.querySelectorAll(".profile-post-image"),
            function (img) {
              return img.src;
            }
          );
        } else {
          urls = [image.src];
        }

        openPostImageViewer(
          urls,
          Math.max(0, urls.indexOf(image.src))
        );
      });
    });
  }


  /* =====================================================
     СТАТИСТИКА (динамічна, з анімацією)
     ===================================================== */

  function forbiddenStat(n) {
    var t = String(n);
    return (
      t.indexOf("63") !== -1 ||
      t.indexOf("68") !== -1 ||
      t.indexOf("13") !== -1 ||
      t.indexOf("666") !== -1
    );
  }

  function safeNumber(base, range) {
    var value;
    do {
      value = base + Math.floor(Math.random() * range);
    } while (forbiddenStat(value));
    return value;
  }

  var stats = {
    registered: 8012457,  /* фіксовано — не змінюється */
    online: safeNumber(1000000, 76001),
    today: safeNumber(2400000, 180001)
  };

  var statsAnimating = {
    registered: false,
    online: false,
    today: false
  };

  function formatStat(n) {
    return Math.round(n).toLocaleString("uk-UA");
  }

  function animateStat(key, el, from, to, duration) {
    if (!el) return;
    if (statsAnimating[key]) return;
    statsAnimating[key] = true;

    var start = performance.now();
    duration = duration || 900;

    function frame(now) {
      var t = Math.min(1, (now - start) / duration);
      var ease = 1 - Math.pow(1 - t, 3);
      var value = from + (to - from) * ease;
      el.textContent = formatStat(value);

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = formatStat(to);
        stats[key] = to;
        statsAnimating[key] = false;
      }
    }

    requestAnimationFrame(frame);
  }

  function pickNearby(current, minDelta, maxDelta, floorMin) {
    var delta = minDelta + Math.floor(Math.random() * (maxDelta - minDelta + 1));
    if (Math.random() < 0.5) delta = -delta;
    var next = current + delta;
    if (floorMin && next < floorMin) next = floorMin + Math.abs(delta);
    while (forbiddenStat(next)) {
      next += delta >= 0 ? 1 : -1;
    }
    return next;
  }

  function tickStatistics() {
    var elOnline = document.getElementById("online-hoomen");
    var elToday = document.getElementById("today-hoomen");

    animateStat(
      "online",
      elOnline,
      stats.online,
      pickNearby(stats.online, 80, 1200, 100000),
      1100
    );

    if (Math.random() < 0.7) {
      animateStat(
        "today",
        elToday,
        stats.today,
        pickNearby(stats.today, 20, 400, 500000),
        900
      );
    }
  }

  function jumpStatistics() {
    var elOnline = document.getElementById("online-hoomen");
    var elToday = document.getElementById("today-hoomen");

    animateStat("online", elOnline, stats.online, safeNumber(1000000, 76001), 1600);
    animateStat("today", elToday, stats.today, safeNumber(2400000, 180001), 1500);
  }

  function initStatistics() {
    var elReg = document.getElementById("registered-hoomen");
    var elOnline = document.getElementById("online-hoomen");
    var elToday = document.getElementById("today-hoomen");

    if (elReg) elReg.textContent = formatStat(stats.registered);
    if (elOnline) elOnline.textContent = formatStat(stats.online);
    if (elToday) elToday.textContent = formatStat(stats.today);

    setTimeout(function loopTick() {
      tickStatistics();
      setTimeout(loopTick, 4000 + Math.floor(Math.random() * 3000));
    }, 3000);

    setInterval(jumpStatistics, 35000);
  }


  /* =====================================================
     ЖИВИЙ ДОПИС (ефемерний, без кешу)
     ===================================================== */

  function liveRand(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  function livePick(arr) {
    if (!arr || !arr.length) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function liveShuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function nickToProfileHref(name) {
    var slug = String(name || "")
      .trim()
      .replace(/^@/, "")
      .replace(/_/g, "-")
      .replace(/\s+/g, "-");
    if (!slug) return "#";
    return slug + ".html";
  }

  function isProfileCurrentlyOnline() {
    var info = resolveOnlineInfo(PROFILE_CONFIG);
    return info && info.className === "online";
  }

  function formatJustNowDate() {
    var d = new Date();
    var hh = d.getHours();
    var mm = d.getMinutes();
    var h = hh < 10 ? "0" + hh : String(hh);
    var m = mm < 10 ? "0" + mm : String(mm);
    return "Опубліковано щойно · " + h + ":" + m;
  }

  function createLiveCommentEl(name, text) {
    var el = document.createElement("div");
    el.className = "fake-comment";
    el.setAttribute("data-live-comment", "1");
    var nameRow = document.createElement("div");
    nameRow.className = "fake-comment-name";
    var a = document.createElement("a");
    a.href = nickToProfileHref(name);
    a.textContent = name;
    nameRow.appendChild(a);
    el.appendChild(nameRow);
    el.appendChild(document.createTextNode(text));
    return el;
  }

  function appendLiveComment(post, name, text) {
    if (!post) return;
    var area = post.querySelector(".comments-area");
    if (!area) return;
    var form = area.querySelector(".comment-form");
    var node = createLiveCommentEl(name, text);
    if (form) form.parentNode.insertBefore(node, form);
    else area.appendChild(node);

    var count = post.querySelector(".comment-count");
    if (count) {
      var n = parseInt(count.textContent, 10) || 0;
      count.textContent = n + 1;
    }
    /* трохи «життя» — відкрити коментарі, якщо вже були */
    if (area.classList.contains("open") === false && (parseInt(count && count.textContent, 10) || 0) <= 2) {
      /* не форсуємо open завжди — лише якщо користувач уже дивився */
    }
  }

  function bumpLiveLikes(post) {
    var btn = post.querySelector(".like-button");
    if (!btn) return;
    var span = btn.querySelector(".like-count");
    if (!span) return;
    var n = parseInt(String(span.textContent).replace(/\s/g, ""), 10) || 0;
    n += 1;
    span.textContent = n.toLocaleString("uk-UA");
    var base = parseInt(btn.getAttribute("data-base-likes"), 10);
    if (!isNaN(base)) btn.setAttribute("data-base-likes", String(n));
  }

  function createLivePostElement(title, body, startLikes) {
    var post = document.createElement("div");
    post.className = "profile-post";
    post.setAttribute("data-live-post", "1");

    var likes = typeof startLikes === "number" ? startLikes : 0;

    post.innerHTML =
      '<div class="profile-post-title"></div>' +
      '<div class="profile-post-body"></div>' +
      '<div class="post-actions">' +
      '<button class="like-button" type="button" data-base-likes="' +
      likes +
      '">♡ Подобається <span class="like-count">' +
      likes +
      "</span></button>" +
      '<button class="comment-button" type="button">💬 Коментарі <span class="comment-count">0</span></button>' +
      "</div>" +
      '<div class="comments-area">' +
      '<div class="comment-form">' +
      '<textarea class="comment-input" placeholder="Написати коментар..."></textarea>' +
      '<button class="comment-send" type="button">Відправити</button>' +
      "</div>" +
      "</div>" +
      '<div class="profile-post-date"></div>';

    post.querySelector(".profile-post-title").textContent = title || "";
    post.querySelector(".profile-post-body").textContent = body || "";
    post.querySelector(".profile-post-date").textContent = formatJustNowDate();

    return post;
  }

  function initLiveFeed() {
    var feed = PROFILE_CONFIG.liveFeed;
    if (!feed || !feed.enabled) return;
    if (!feed.posts || !feed.posts.length) return;

    var onlyOnline = feed.onlyWhenOnline !== false;
    if (onlyOnline && !isProfileCurrentlyOnline()) return;

    var container =
      document.getElementById("profile-posts") ||
      document.getElementById("copy-posts");
    if (!container) return;

    var picked = livePick(feed.posts);
    if (!picked) return;

    var startLikes =
      typeof feed.startLikes === "number" ? Math.max(0, feed.startLikes) : liveRand(0, 3);
    var post = createLivePostElement(picked.title || "", picked.body || "", startLikes);

    /* на початок стрічки */
    if (container.firstChild) container.insertBefore(post, container.firstChild);
    else container.appendChild(post);

    bindAllLikeButtons();
    bindAllCommentButtons();
    updatePostVisibility();

    var likeRange = feed.likeIntervalMs || [10000, 28000];
    var commentRange = feed.commentIntervalMs || [14000, 40000];
    var reactionRange = feed.reactionDelayMs || [2500, 7000];
    var maxExtraLikes =
      typeof feed.maxExtraLikes === "number" ? feed.maxExtraLikes : 12;
    var maxAutoComments =
      typeof feed.maxAutoComments === "number" ? feed.maxAutoComments : 4;

    var likesLeft = maxExtraLikes;
    var commentPool = liveShuffle(feed.comments || []);
    var commentsLeft = Math.min(maxAutoComments, commentPool.length);
    var commentIndex = 0;
    var reactionUsed = false;
    var timers = [];

    function scheduleLike() {
      if (likesLeft <= 0) return;
      var delay = liveRand(likeRange[0], likeRange[1]);
      var t = setTimeout(function () {
        if (!post.parentNode) return;
        bumpLiveLikes(post);
        likesLeft -= 1;
        scheduleLike();
      }, delay);
      timers.push(t);
    }

    function scheduleComment() {
      if (commentsLeft <= 0 || commentIndex >= commentPool.length) return;
      var delay = liveRand(commentRange[0], commentRange[1]);
      var t = setTimeout(function () {
        if (!post.parentNode) return;
        var c = commentPool[commentIndex++];
        if (c && (c.name || c.text)) {
          appendLiveComment(post, c.name || "гумен", c.text || "");
          commentsLeft -= 1;
        }
        scheduleComment();
      }, delay);
      timers.push(t);
    }

    scheduleLike();
    scheduleComment();

    /* реакція на коментар відвідувача — один раз на цей живий допис */
    window.__hoomenLiveFeedOnVisitorComment = function (targetPost, visitorText) {
      if (reactionUsed) return;
      if (!targetPost || targetPost.getAttribute("data-live-post") !== "1") return;
      if (targetPost !== post) return;

      var reactions = feed.reactions && feed.reactions.length
        ? feed.reactions
        : null;
      if (!reactions || !reactions.length) {
        /* fallback: сам власник профілю коротко відповідає */
        reactions = [
          { name: PROFILE_CONFIG.nickname || "гумен", text: "…" },
          { name: PROFILE_CONFIG.nickname || "гумен", text: "ок" },
          { name: PROFILE_CONFIG.nickname || "гумен", text: "привіт" }
        ];
      }

      reactionUsed = true;
      var delay = liveRand(reactionRange[0], reactionRange[1]);
      var t = setTimeout(function () {
        if (!post.parentNode) return;
        var r = livePick(reactions);
        if (r) appendLiveComment(post, r.name || PROFILE_CONFIG.nickname || "гумен", r.text || "…");
      }, delay);
      timers.push(t);
    };

    /* якщо сторінка вивантажується — таймери не критичні (і так зникнуть) */
  }

  /* =====================================================
     ЗАПУСК
     ===================================================== */

  applyProfileConfig();
  bindAllLikeButtons();
  bindAllCommentButtons();
  bindExistingPostImageViewers();
  updatePostVisibility();
  initStatistics();
  initLiveFeed();

  /* Оновлення статусу за розкладом раз на хвилину */
  setInterval(updateOnlineStatusDisplay, 60000);

})();

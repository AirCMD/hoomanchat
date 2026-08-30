/**
 * Гуменчат — попап особистих повідомлень на профілі
 *
 * Підключення (на сторінці профілю, після hoomenchat-profile.js):
 *   <link rel="stylesheet" href="../css/pm-popup.css">
 *   <script src="../bots/night_fox.js"></script>  <!-- за потреби -->
 *   <script src="../pm-popup.js"></script>
 *
 * Кнопка .archat-button відкриває ПМ з персонажем цієї сторінки.
 */
(function () {
  "use strict";

  var MAX_IMAGE_SIZE = 10 * 1024 * 1024;
  var MAX_FILE_SIZE = 20 * 1024 * 1024;
  /* false = не зберігати історію після перезавантаження */
  var SAVE_HISTORY = false;
  var STORAGE_PREFIX = "hoomen_pm_";

  var allowedImageTypes = {
    "image/jpeg": true, "image/png": true, "image/gif": true,
    "image/webp": true, "image/heic": true, "image/heif": true
  };
  var blockedExtensions = {
    ".exe": true, ".com": true, ".scr": true, ".msi": true, ".bat": true,
    ".cmd": true, ".ps1": true, ".vbs": true, ".js": true, ".jar": true,
    ".apk": true, ".html": true, ".htm": true, ".php": true, ".sh": true, ".py": true
  };

  var emojis = [
    "😀","😃","😄","😁","😆","😅","😂","😊","🙂","😉","😍","🥰","😘",
    "😭","😢","😮","😴","🤔","😏","🥺","😱","😤","❤️","💕","✨","🔥",
    "🌸","🌙","☕","🎮","🐱","🐶","👍","👎","👏","🙏","💪","🎉","🦊","⭐"
  ];

  var defaultAutoReply = ["Привіт.", "Цікаво.", "Розкажи детальніше.", "Ок.", "Я тут."];

  var state = {
    open: false,
    nick: "",
    avatar: "",
    messages: [],
    pending: []
  };

  function $(id) { return document.getElementById(id); }

  function getCurrentTime() {
    var d = new Date();
    return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getExtension(name) {
    var clean = String(name || "").toLowerCase().split("?")[0];
    var dot = clean.lastIndexOf(".");
    return dot === -1 ? "" : clean.substring(dot);
  }

  function nickToId(nick) {
    return String(nick || "").trim().toLowerCase().replace(/\s+/g, "_");
  }

  function detectProfile() {
    var nick = "";
    var avatar = "";

    if (window.HOOMEN_PROFILE && window.HOOMEN_PROFILE.nickname) {
      nick = window.HOOMEN_PROFILE.nickname;
      avatar = window.HOOMEN_PROFILE.avatar || "";
    }

    var elNick = $("profile-nickname");
    if (!nick && elNick) nick = (elNick.textContent || "").trim();

    var elAv = $("profile-avatar");
    if (!avatar && elAv) avatar = elAv.getAttribute("src") || "";

    if (!nick) {
      var siteName = document.querySelector("#hoomenchat-site .site-name");
      if (siteName) nick = (siteName.textContent || "").trim();
    }
    if (!avatar) {
      var mainAv = document.querySelector("#hoomenchat-site .main-avatar");
      if (mainAv) avatar = mainAv.getAttribute("src") || "";
    }

    return { nick: nick || "гумен", avatar: avatar };
  }

  function getBotConfig(nick) {
    var id = nickToId(nick);
    var pack = window.HoomenBotReplies || {};
    if (pack[id]) return pack[id];
    return null;
  }

  function storageKey(nick) {
    return STORAGE_PREFIX + nickToId(nick);
  }

  function loadMessages(nick) {
    if (!SAVE_HISTORY) return [];
    try {
      var raw = localStorage.getItem(storageKey(nick));
      if (!raw) return [];
      var data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  function saveMessages(nick, messages) {
    if (!SAVE_HISTORY) return;
    try {
      var slim = messages.map(function (m) {
        var copy = {
          from: m.from,
          type: m.type || "text",
          text: m.text || "",
          time: m.time || ""
        };
        if (m.type === "image" || m.type === "file") {
          if (m.url && String(m.url).indexOf("data:") === 0) {
            copy.text = m.type === "image" ? "[зображення]" : "[файл: " + (m.fileName || "") + "]";
            copy.type = "text";
          } else {
            copy.url = m.url;
            copy.fileName = m.fileName;
          }
        }
        return copy;
      });
      localStorage.setItem(storageKey(nick), JSON.stringify(slim));
    } catch (e) {}
  }

  function ensureDom() {
    if ($("hoomen-pm-overlay")) return;

    var overlay = document.createElement("div");
    overlay.id = "hoomen-pm-overlay";
    overlay.innerHTML =
      '<div id="hoomen-pm-window" role="dialog" aria-modal="true">' +
        '<div class="pm-header">' +
          '<img class="pm-header-avatar" id="pm-avatar" alt="">' +
          '<div class="pm-header-info">' +
            '<div class="pm-header-name" id="pm-name"></div>' +
            '<div class="pm-header-sub">особисте повідомлення</div>' +
          '</div>' +
          '<button type="button" class="pm-close" id="pm-close" aria-label="Закрити">✕</button>' +
        '</div>' +
        '<div class="pm-messages" id="pm-messages"></div>' +
        '<div class="pm-typing" id="pm-typing">' +
          '<div class="pm-typing-bubble">Пише<span class="pm-typing-dots">' +
          '<span>.</span><span>.</span><span>.</span></span></div>' +
        '</div>' +
        '<div class="pm-compose">' +
          '<div class="pm-tools">' +
            '<button type="button" class="pm-tool" id="pm-emoji-btn">😊</button>' +
            '<button type="button" class="pm-tool" id="pm-sticker-btn">⭐</button>' +
            '<button type="button" class="pm-tool" id="pm-image-btn">🖼</button>' +
            '<button type="button" class="pm-tool" id="pm-file-btn">📎</button>' +
            '<input class="pm-hidden-input" id="pm-image-input" type="file" accept="image/*" multiple>' +
            '<input class="pm-hidden-input" id="pm-file-input" type="file" multiple>' +
          '</div>' +
          '<div class="pm-emoji-panel" id="pm-emoji-panel"><div class="pm-emoji-grid" id="pm-emoji-grid"></div></div>' +
          '<div class="pm-selected" id="pm-selected"></div>' +
          '<textarea class="pm-input" id="pm-input" placeholder="Написати повідомлення..."></textarea>' +
          '<div class="pm-send-row">' +
            '<button type="button" class="pm-send" id="pm-send">НАДІСЛАТИ</button>' +
            '<span class="pm-status" id="pm-status"></span>' +
          '</div>' +
          '<div class="pm-footer-link"><a href="../archive.html" id="pm-archat-link">Відкрити повний Арчат →</a></div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    var grid = $("pm-emoji-grid");
    emojis.forEach(function (em) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "pm-emoji-btn";
      b.textContent = em;
      b.addEventListener("click", function () {
        insertEmoji(em);
      });
      grid.appendChild(b);
    });

    $("pm-close").addEventListener("click", closePm);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closePm();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && state.open) closePm();
    });
    $("pm-send").addEventListener("click", sendPm);
    $("pm-input").addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendPm();
      }
    });
    $("pm-emoji-btn").addEventListener("click", function () {
      $("pm-emoji-panel").classList.toggle("open");
    });
    $("pm-sticker-btn").addEventListener("click", function () {
      $("pm-emoji-panel").classList.add("open");
      showStatus("Обери стікер / емодзі нижче");
    });
    $("pm-image-btn").addEventListener("click", function () {
      $("pm-image-input").click();
    });
    $("pm-file-btn").addEventListener("click", function () {
      $("pm-file-input").click();
    });
    $("pm-image-input").addEventListener("change", function () {
      handleFiles($("pm-image-input").files, "image");
      $("pm-image-input").value = "";
    });
    $("pm-file-input").addEventListener("change", function () {
      handleFiles($("pm-file-input").files, "file");
      $("pm-file-input").value = "";
    });
  }

  function insertEmoji(em) {
    var input = $("pm-input");
    if (!input) return;
    var start = input.selectionStart || input.value.length;
    var end = input.selectionEnd || input.value.length;
    input.value = input.value.substring(0, start) + em + input.value.substring(end);
    input.focus();
    try {
      input.setSelectionRange(start + em.length, start + em.length);
    } catch (e) {}
  }

  function showStatus(text) {
    var el = $("pm-status");
    if (!el) return;
    el.textContent = text || "";
    if (text) {
      setTimeout(function () {
        if (el.textContent === text) el.textContent = "";
      }, 3200);
    }
  }

  function showTyping(on) {
    var el = $("pm-typing");
    if (!el) return;
    if (on) el.classList.add("show");
    else el.classList.remove("show");
    var box = $("pm-messages");
    if (box) box.scrollTop = box.scrollHeight;
  }

  function renderMessages() {
    var box = $("pm-messages");
    if (!box) return;
    box.innerHTML = "";
    state.messages.forEach(function (m) {
      var row = document.createElement("div");
      row.className = "pm-row " + (m.from === "me" ? "mine" : "theirs");
      var bubble = document.createElement("div");
      bubble.className = "pm-bubble";

      if (m.type === "image" && m.url) {
        var img = document.createElement("img");
        img.className = "pm-image";
        img.src = m.url;
        img.alt = m.fileName || "Зображення";
        bubble.appendChild(img);
      } else if (m.type === "file" && m.url) {
        var a = document.createElement("a");
        a.className = "pm-file";
        a.href = m.url;
        a.download = m.fileName || "file";
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = "📎 " + (m.fileName || "Файл");
        bubble.appendChild(a);
      } else {
        bubble.textContent = m.text || "";
      }

      var time = document.createElement("div");
      time.className = "pm-time";
      time.textContent = m.time || "";

      row.appendChild(bubble);
      row.appendChild(time);
      box.appendChild(row);
    });
    box.scrollTop = box.scrollHeight;
  }

  function renderSelected() {
    var box = $("pm-selected");
    if (!box) return;
    box.innerHTML = "";
    state.pending.forEach(function (f, index) {
      var span = document.createElement("span");
      span.className = "pm-selected-item";
      span.appendChild(document.createTextNode((f.kind === "image" ? "🖼 " : "📎 ") + f.name));
      var x = document.createElement("span");
      x.className = "pm-selected-remove";
      x.textContent = "✕";
      x.addEventListener("click", function () {
        state.pending.splice(index, 1);
        renderSelected();
      });
      span.appendChild(x);
      box.appendChild(span);
    });
  }

  function handleFiles(fileList, kind) {
    if (!fileList) return;
    Array.prototype.forEach.call(fileList, function (file) {
      if (!file) return;
      if (kind === "image") {
        if (!allowedImageTypes[file.type]) {
          showStatus("Лише JPG, PNG, GIF, WebP, HEIC.");
          return;
        }
        if (file.size > MAX_IMAGE_SIZE) {
          showStatus("Зображення завелике (макс. 10 MB).");
          return;
        }
        var reader = new FileReader();
        reader.onload = function (ev) {
          state.pending.push({
            kind: "image", name: file.name, url: ev.target.result
          });
          renderSelected();
        };
        reader.readAsDataURL(file);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        showStatus("Файл завеликий (макс. 20 MB).");
        return;
      }
      if (blockedExtensions[getExtension(file.name)]) {
        showStatus("Цей тип файлу заборонений.");
        return;
      }
      state.pending.push({
        kind: "file",
        name: file.name,
        url: URL.createObjectURL(file)
      });
      renderSelected();
    });
  }

  function pickReply(nick, lastText) {
    var conf = getBotConfig(nick);
    var text = String(lastText || "").trim().toLowerCase();

    if (conf) {
      var words = text.split(/\s+/).filter(Boolean);
      var isSingle = words.length === 1;
      var word = isSingle
        ? words[0].replace(/[.,!?;:«»"'()]+$/g, "").replace(/^[.,!?;:«»"'()]+/g, "")
        : "";

      if (isSingle && conf.singleWordReplies && conf.singleWordReplies[word]) {
        return conf.singleWordReplies[word];
      }
      if (conf.keywordReplies) {
        if (isSingle && conf.keywordReplies[word] && conf.keywordReplies[word].length) {
          var arr0 = conf.keywordReplies[word];
          return arr0[Math.floor(Math.random() * arr0.length)];
        }
        var keys = Object.keys(conf.keywordReplies).sort(function (a, b) {
          return b.length - a.length;
        });
        for (var i = 0; i < keys.length; i++) {
          if (keys[i] && text.indexOf(keys[i]) !== -1) {
            var arr = conf.keywordReplies[keys[i]];
            if (arr && arr.length) {
              return arr[Math.floor(Math.random() * arr.length)];
            }
          }
        }
      }
      if (conf.autoReply && conf.autoReply.length) {
        return conf.autoReply[Math.floor(Math.random() * conf.autoReply.length)];
      }
    }

    return defaultAutoReply[Math.floor(Math.random() * defaultAutoReply.length)];
  }

  function triggerReply(lastText) {
    showTyping(true);
    var delay = 1000 + Math.floor(Math.random() * 1600);
    setTimeout(function () {
      showTyping(false);
      var reply = pickReply(state.nick, lastText);
      state.messages.push({
        from: "them",
        type: "text",
        text: reply,
        time: getCurrentTime()
      });
      saveMessages(state.nick, state.messages);
      renderMessages();
    }, delay);
  }

  function sendPm() {
    if (!state.open) return;
    var input = $("pm-input");
    var text = input ? String(input.value || "").trim() : "";
    if (!text && !state.pending.length) {
      showStatus("Введіть повідомлення або прикріпіть файл.");
      return;
    }

    var now = getCurrentTime();
    if (text) {
      state.messages.push({ from: "me", type: "text", text: text, time: now });
    }
    state.pending.forEach(function (f) {
      state.messages.push({
        from: "me",
        type: f.kind,
        text: "",
        url: f.url,
        fileName: f.name,
        time: now
      });
    });

    if (input) input.value = "";
    state.pending = [];
    renderSelected();
    saveMessages(state.nick, state.messages);
    renderMessages();
    showStatus("Надіслано.");
    triggerReply(text);
  }

  function openPm(nick, avatar) {
    ensureDom();
    state.open = true;
    state.nick = nick;
    state.avatar = avatar || "";
    state.pending = [];
    state.messages = loadMessages(nick);

    $("pm-name").textContent = nick;
    $("pm-avatar").src = avatar || "";
    $("pm-avatar").alt = nick;
    $("pm-emoji-panel").classList.remove("open");
    renderSelected();
    renderMessages();
    showTyping(false);

    var overlay = $("hoomen-pm-overlay");
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";

    var conf = getBotConfig(nick);
    if (!state.messages.length && conf && conf.firstMessage) {
      showTyping(true);
      setTimeout(function () {
        showTyping(false);
        state.messages.push({
          from: "them",
          type: "text",
          text: conf.firstMessage,
          time: getCurrentTime()
        });
        saveMessages(nick, state.messages);
        renderMessages();
      }, 1200 + Math.floor(Math.random() * 800));
    }

    setTimeout(function () {
      var input = $("pm-input");
      if (input) input.focus();
    }, 100);
  }

  function closePm() {
    state.open = false;
    var overlay = $("hoomen-pm-overlay");
    if (overlay) overlay.classList.remove("open");
    document.body.style.overflow = "";
    showTyping(false);
  }

  function onArchatClick(e) {
    var profile = detectProfile();
    e.preventDefault();
    e.stopPropagation();
    openPm(profile.nick, profile.avatar);
  }

  function bindButtons() {
    var buttons = document.querySelectorAll("a.archat-button, button.archat-button");
    buttons.forEach(function (btn) {
      if (btn.getAttribute("data-pm-bound") === "1") return;
      btn.setAttribute("data-pm-bound", "1");
      btn.addEventListener("click", onArchatClick);
    });
  }

  function init() {
    bindButtons();
    setTimeout(bindButtons, 500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

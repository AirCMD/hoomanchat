(function () {
  // Список нікнеймів, для яких активний чат (збігаються з назвами файлів у chats/)
  var BOT_ENABLED_PERSONAGES = ["copy_pasta", "dreaming_romance", "sakurai_agatsuma", "alter_core"];

  // Додаємо стилі модального вікна динамічно
  var style = document.createElement("style");
  style.innerHTML = `
    .chat-modal-overlay {
      display: none;
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9999;
      justify-content: center;
      align-items: center;
      padding: 10px;
    }
    .chat-modal-overlay.active {
      display: flex;
    }
    .chat-window {
      width: 100%;
      max-width: 420px;
      background: #fff;
      border: 1px solid #777;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    .chat-header {
      background: linear-gradient(to bottom, #626262, #3b3b3b);
      border-bottom: 1px solid #222;
      color: #fff;
      padding: 6px 10px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-transform: uppercase;
      font-size: 11px;
    }
    .chat-close {
      background: none;
      border: none;
      color: #fff;
      font-weight: bold;
      cursor: pointer;
      font-size: 14px;
    }
    .chat-messages {
      padding: 10px;
      height: 260px;
      overflow-y: auto;
      background: #f9f9f9;
      border-bottom: 1px solid #ccc;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .chat-msg {
      padding: 6px 8px;
      border: 1px solid #aaa;
      max-width: 85%;
      word-break: break-word;
      line-height: 14px;
    }
    .chat-msg.bot {
      background: #f0f0f0;
      align-self: flex-start;
      color: #222;
    }
    .chat-msg.user {
      background: #fff9c4;
      align-self: flex-end;
      color: #111;
      border-color: #d4b106;
    }
    .chat-input-area {
      padding: 8px;
      background: #fff;
      display: flex;
      gap: 6px;
    }
    .chat-input {
      flex: 1;
      padding: 5px;
      border: 1px solid #999;
      font-size: 12px;
      resize: none;
      height: 32px;
      outline: none;
    }
    .chat-send-btn {
      padding: 0 12px;
      background: linear-gradient(to bottom, #fff176, #fbc02d);
      border: 1px solid #a78119;
      color: #000;
      font-weight: bold;
      cursor: pointer;
      text-transform: uppercase;
      font-size: 10px;
    }
    .chat-send-btn:hover {
      background: linear-gradient(to bottom, #fff59d, #fdd835);
    }
  `;
  document.head.appendChild(style);

  // Створюємо HTML-розкладку модального вікна
  var modalOverlay = document.createElement("div");
  modalOverlay.className = "chat-modal-overlay";
  modalOverlay.innerHTML = `
    <div class="chat-window">
      <div class="chat-header">
        <span id="chat-title">Чат</span>
        <button class="chat-close" id="chat-close-btn">✕</button>
      </div>
      <div class="chat-messages" id="chat-messages-container"></div>
      <div class="chat-input-area">
        <input type="text" class="chat-input" id="chat-input-field" placeholder="Напиши повідомлення...">
        <button class="chat-send-btn" id="chat-send-btn">Відправити</button>
      </div>
    </div>
  `;
  document.body.appendChild(modalOverlay);

  var currentBotName = "";
  var botPhrases = [];

  // Функція відкриття чату
  window.openHoomenChat = function(botName) {
    currentBotName = botName;
    document.getElementById("chat-title").textContent = "Чат з " + botName;
    modalOverlay.classList.add("active");
    
    var container = document.getElementById("chat-messages-container");
    container.innerHTML = '<div class="chat-msg bot">Привіт! Раді бачити тебе в Гуменчаті.</div>';

    // Завантажуємо файл реплік із папки chats/
    var scriptPath = `chats/${botName}.js`;
    
    // Перевірка чи завантажені репліки, або підтягуємо динамічно
    if (window["bot_phrases_" + botName]) {
      botPhrases = window["bot_phrases_" + botName];
    } else {
      var s = document.createElement("script");
      s.src = scriptPath;
      s.onload = function() {
        if (window["bot_phrases_" + botName]) {
          botPhrases = window["bot_phrases_" + botName];
        }
      };
      s.onerror = function() {
        botPhrases = ["Цікаво...", "Розкажи більше про це.", "Зрозумів тебе!"];
      };
      document.head.appendChild(s);
    }
  };

  // Закриття чату
  document.getElementById("chat-close-btn").addEventListener("click", function() {
    modalOverlay.classList.remove("active");
  });
  modalOverlay.addEventListener("click", function(e) {
    if (e.target === modalOverlay) modalOverlay.classList.remove("active");
  });

  // Надсилання повідомлення
  function handleSendMessage() {
    var input = document.getElementById("chat-input-field");
    var text = input.value.trim();
    if (!text) return;

    var container = document.getElementById("chat-messages-container");

    // Повідомлення користувача
    var userMsg = document.createElement("div");
    userMsg.className = "chat-msg user";
    userMsg.textContent = text;
    container.appendChild(userMsg);
    input.value = "";
    container.scrollTop = container.scrollHeight;

    // Відповідь бота з невеликою затримкою
    setTimeout(function() {
      var replyText = "Ясно!";
      if (botPhrases && botPhrases.length > 0) {
        replyText = botPhrases[Math.floor(Math.random() * botPhrases.length)];
      }

      var botMsg = document.createElement("div");
      botMsg.className = "chat-msg bot";
      botMsg.textContent = replyText;
      container.appendChild(botMsg);
      container.scrollTop = container.scrollHeight;
    }, 600);
  }

  document.getElementById("chat-send-btn").addEventListener("click", handleSendMessage);
  document.getElementById("chat-input-field").addEventListener("keypress", function(e) {
    if (e.key === "Enter") handleSendMessage();
  });

  // Перехоплюємо кліки на кнопках/посиланнях чату на сторінці (якщо вони ведуть на профіль або мають спеціальний клас)
  document.addEventListener("click", function(e) {
    var target = e.target.closest("a");
    if (!target) return;
    
    // Перевіряємо, чи це посилання на профіль з дозволених ботів
    for (var i = 0; i < BOT_ENABLED_PERSONAGES.length; i++) {
      var b = BOT_ENABLED_PERSONAGES[i];
      if (target.getAttribute("href") && target.getAttribute("href").indexOf(b) !== -1) {
        // Можна додати умову: якщо клік по кнопці чату всередині профілю
        // За потреби тут можна зв'язати виклик window.openHoomenChat(b);
      }
    }
  });

})();

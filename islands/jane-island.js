// jane-island.js
(function () {
  "use strict";

  // Функція перемикання лайка
  window.toggleLike = function (postIndex) {
    const post = initialPostsData[postIndex];
    if (!post) return;

    if (post.userLiked) {
      post.userLiked = false;
      post.likes--;
    } else {
      post.userLiked = true;
      post.likes++;
    }

    renderPosts(); // Перемальовуємо дописи після зміни
  };

  // Перегляд зображення у попапі
  window.openImageModal = function (src, desc) {
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-image");
    const modalDesc = document.getElementById("modal-description");

    if (modal && modalImg) {
      modalImg.src = src;
      if (modalDesc) modalDesc.textContent = desc || "";
      modal.classList.add("active");
    }
  };

  // Основна функція рендеру постів на сторінці
  window.renderPosts = function () {
    const container = document.getElementById("posts-container");
    if (!container) return;

    container.innerHTML = "";

    initialPostsData.forEach((post, index) => {
      const postEl = document.createElement("article");
      postEl.className = "post";

      // Рендер галереї зображень
      let imagesHtml = "";
      if (post.images && post.images.length > 0) {
        imagesHtml = '<div class="post-images">';
        post.images.forEach(img => {
          imagesHtml += `
            <img src="${img.data}" alt="${img.desc || ''}" 
                 onclick="openImageModal('${img.data}', '${img.desc || ''}')" 
                 style="cursor:pointer; max-width: 100px; margin-right: 5px;" />
          `;
        });
        imagesHtml += '</div>';
      }

      // Рендер коментарів (з автопосиланням на профіль автора)
      let commentsHtml = "";
      if (post.comments && post.comments.length > 0) {
        commentsHtml = '<div class="post-comments">';
        post.comments.forEach(c => {
          const profileSlug = c.name.toLowerCase().replace(/_/g, '-');
          commentsHtml += `
            <div class="comment">
              <a href="../profiles/${profileSlug}.html"><b>${c.name}</b></a>: ${c.text}
            </div>
          `;
        });
        commentsHtml += '</div>';
      }

      // Збирання HTML допису
      postEl.innerHTML = `
        <h2>${post.title}</h2>
        <div class="post-date"><small>${post.date}</small></div>
        <p>${post.body}</p>
        ${imagesHtml}
        <div class="post-actions" style="margin: 10px 0;">
          <button onclick="toggleLike(${index})" class="like-btn ${post.userLiked ? 'active' : ''}">
            ${post.userLiked ? '❤️' : '🤍'} ${post.likes}
          </button>
        </div>
        ${commentsHtml}
      `;

      container.appendChild(postEl);
    });
  };

  // Автоматичний старт при завантаженні сторінки
  document.addEventListener("DOMContentLoaded", function () {
    renderPosts();
  });
})();
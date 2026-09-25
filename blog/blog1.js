'use strict';

// 제목·날짜·링크는 blog1.posts.js에서 수정하세요.
renderPosts();
setupMinimizeButtons();
enableMenuDrag();

// 1. 포스트 목록: YYYY-MM-DD 문자열로 정렬해 시간대에 따른 날짜 변경을 피합니다.
function renderPosts() {
  const list = document.getElementById('post-list');
  const template = document.getElementById('post-template');
  const sortedPosts = [...BLOG_POSTS].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  list.replaceChildren();

  if (sortedPosts.length === 0) {
    const message = document.createElement('p');
    message.className = 'post-empty';
    message.textContent = '아직 등록된 포스트가 없습니다.';
    list.appendChild(message);
    return;
  }

  sortedPosts.forEach((post) => {
    const article = template.content.firstElementChild.cloneNode(true);
    const dateRow = article.querySelector('.post-date');
    const title = article.querySelector('.post-title');
    const link = article.querySelector('[data-post-link]');

    title.textContent = post.title;
    link.setAttribute('href', post.href);
    link.setAttribute('aria-label', `${post.title} — ${link.textContent.trim()}`);

    if (post.date) {
      const time = dateRow.querySelector('time');
      time.dateTime = post.date;
      time.textContent = formatPostDate(post.date);
    } else {
      dateRow.remove();
    }

    list.appendChild(article);
  });
}

function formatPostDate(date) {
  const [year, month, day] = date.split('-');
  return `${day}.${month}.${year}`;
}

// 2. 창 최소화와 메뉴 드래그
// aria-controls에 적힌 ID의 본문을 접거나 펼칩니다.
function setupMinimizeButtons() {
  document.querySelectorAll('[data-minimize]').forEach((button) => {
    const content = document.getElementById(button.getAttribute('aria-controls'));

    button.addEventListener('click', () => {
      content.hidden = !content.hidden;
      button.setAttribute('aria-expanded', String(!content.hidden));
    });
  });
}

// 메뉴 링크와 버튼은 그대로 클릭할 수 있도록 타이틀바에서만 드래그합니다.
function enableMenuDrag() {
  const menu = document.getElementById('draggable-menu');
  const handle = document.getElementById('retroBar');

  handle.addEventListener('mousedown', (event) => {
    if (event.button !== 0 || event.target.closest('button')) return;

    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = menu.offsetLeft;
    const startTop = menu.offsetTop;
    document.body.classList.add('is-dragging');
    event.preventDefault();

    function moveMenu(moveEvent) {
      menu.style.left = `${startLeft + moveEvent.clientX - startX}px`;
      menu.style.top = `${startTop + moveEvent.clientY - startY}px`;
    }

    function stopDragging() {
      document.body.classList.remove('is-dragging');
      document.removeEventListener('mousemove', moveMenu);
      document.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('blur', stopDragging);
    }

    document.addEventListener('mousemove', moveMenu);
    document.addEventListener('mouseup', stopDragging);
    window.addEventListener('blur', stopDragging);
  });
}

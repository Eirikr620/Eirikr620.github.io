'use strict';

// 소개 문구와 메뉴 링크는 profile.html에서 수정하세요.
// 이 파일은 최소화 버튼과 메뉴 드래그 동작만 담당합니다.
setupMinimizeButtons();
enableMenuDrag();

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

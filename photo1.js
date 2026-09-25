'use strict';

// 사진 추가·삭제는 photo1.photos.js의 PHOTO_LIST에서만 하세요.
const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImg');
const closeButton = document.getElementById('lightboxClose');
let lastFocusedPhoto = null;
let renderedColumns = 0;

initializeGallery();
setupLightbox();
setupMinimizeButtons();
enableMenuDrag();

// 1. CSS의 실제 열 수에 맞춰 배치합니다. 모바일 전환 시에도 다시 계산합니다.
function initializeGallery() {
  renderGallery();
  const observer = new ResizeObserver(() => {
    if (getColumnCount() !== renderedColumns) renderGallery();
  });
  observer.observe(gallery);
}

function getColumnCount() {
  return Math.max(1, parseInt(getComputedStyle(gallery).getPropertyValue('--cols'), 10) || 3);
}

// 최신 사진부터 표시하고, 첫 줄의 부족한 칸은 왼쪽에 비워 둡니다.
function renderGallery() {
  renderedColumns = getColumnCount();
  gallery.replaceChildren();

  if (PHOTO_LIST.length === 0) {
    const message = document.createElement('p');
    message.className = 'gallery-empty';
    message.textContent = '아직 등록된 사진이 없습니다.';
    gallery.appendChild(message);
    return;
  }

  const emptyCells = (renderedColumns - PHOTO_LIST.length % renderedColumns) % renderedColumns;
  for (let index = 0; index < emptyCells; index++) {
    const spacer = document.createElement('div');
    spacer.className = 'cell spacer';
    spacer.setAttribute('aria-hidden', 'true');
    gallery.appendChild(spacer);
  }

  [...PHOTO_LIST].reverse().forEach((photo) => {
    const link = document.createElement('a');
    link.className = 'cell item';
    link.href = photo.src;
    link.setAttribute('aria-label', photo.alt ? `${photo.alt} — 원본 보기` : '원본 보기');

    const image = document.createElement('img');
    image.src = photo.src;
    image.alt = photo.alt || '';
    link.appendChild(image);
    link.addEventListener('click', (event) => {
      event.preventDefault();
      openLightbox(photo, link);
    });
    gallery.appendChild(link);
  });
}

// 2. 사진 확대 보기: 닫기 버튼, 바깥 배경 클릭 또는 Escape로 닫습니다.
function openLightbox(photo, trigger) {
  lastFocusedPhoto = trigger;
  lightboxImage.src = photo.src;
  lightboxImage.alt = photo.alt || '';
  lightbox.classList.add('open');
  closeButton.focus();
}

function closeLightbox() {
  if (!lightbox.classList.contains('open')) return;
  lightbox.classList.remove('open');
  if (lastFocusedPhoto?.isConnected) lastFocusedPhoto.focus();
}

function setupLightbox() {
  closeButton.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  window.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('open')) return;
    if (event.key === 'Escape') closeLightbox();
    // 확대 보기에서 유일한 조작 요소인 닫기 버튼에 키보드 포커스를 유지합니다.
    if (event.key === 'Tab') {
      event.preventDefault();
      closeButton.focus();
    }
  });
}

// 3. 창 최소화와 메뉴 드래그
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

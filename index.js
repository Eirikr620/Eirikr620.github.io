'use strict';

// 1. 창 설정 (크기·위치: px, 등장 지연: ms)
// 창 추가: index.html에 콘텐츠 template을 만들고 아래 목록에 설정을 추가하세요.
const WINDOW_CONFIGS = [
  {
    id: 'retroWin',
    title: 'PHOTO_002.JPG',
    contentId: 'photo-secondary-content',
    width: 360,
    top: 140,
    right: 30,
    delayMs: 300,
  },
  {
    id: 'win-note',
    title: 'WELCOME.txt',
    contentId: 'welcome-content',
    width: 320,
    top: 90,
    right: 350,
    delayMs: 600,
  },
  {
    id: 'win-photo',
    title: 'PHOTO_001.JPG',
    contentId: 'photo-primary-content',
    width: 460,
    top: 220,
    right: 450,
    delayMs: 900,
  },
  {
    id: 'win-links',
    title: 'LINKS',
    contentId: 'links-content',
    width: 280,
    top: 550,
    right: 250,
    delayMs: 1200,
  },
];

let topZIndex = 2000;

// 2. 초기화: defer 스크립트이므로 HTML을 읽은 뒤 실행됩니다.
initializePage();

function initializePage() {
  const menuItems = document.querySelectorAll('.main-menu .menu-item');
  menuItems.forEach((item, index) => {
    item.style.setProperty('--menu-order', index);
  });

  WINDOW_CONFIGS.forEach(createWindow);
  populateMenuLinks(menuItems);
}

// 메인 메뉴를 기준으로 LINKS 창을 채워 링크를 두 번 수정하지 않게 합니다.
function populateMenuLinks(menuItems) {
  document.querySelectorAll('[data-menu-links]').forEach((list) => {
    menuItems.forEach((menuItem) => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = menuItem.getAttribute('href');
      link.textContent = menuItem.textContent;
      item.appendChild(link);
      list.appendChild(item);
    });
  });
}

// 3. 공통 창 생성
function createWindow({ id, title, contentId, width, top, right, delayMs }) {
  const template = document.getElementById('window-template');
  const windowElement = template.content.firstElementChild.cloneNode(true);
  const titleElement = windowElement.querySelector('[data-title]');
  const contentElement = windowElement.querySelector('[data-content]');

  windowElement.id = id;
  windowElement.style.setProperty('--w', `${width}px`);
  windowElement.style.setProperty('--top', `${top}px`);
  windowElement.style.setProperty('--right', `${right}px`);
  windowElement.style.setProperty('--delay', `${delayMs}ms`);

  titleElement.id = `${id}-title`;
  titleElement.textContent = title;
  windowElement.setAttribute('aria-labelledby', titleElement.id);
  contentElement.appendChild(document.getElementById(contentId).content.cloneNode(true));

  setupWindowControls(windowElement);
  enableDrag(windowElement, windowElement.querySelector('[data-handle]'));
  windowElement.addEventListener('mousedown', () => bringToFront(windowElement));
  windowElement.addEventListener('focusin', () => bringToFront(windowElement));

  document.body.appendChild(windowElement);
  windowElement.classList.add('show');
  return windowElement;
}

// 4. 창 버튼 및 겹침 순서
function bringToFront(windowElement) {
  windowElement.style.zIndex = ++topZIndex;
}

function setupWindowControls(windowElement) {
  const content = windowElement.querySelector('[data-content]');
  const minimizeButton = windowElement.querySelector('[data-minimize]');
  const maximizeButton = windowElement.querySelector('[data-maximize]');
  let previousPosition = null;

  minimizeButton.setAttribute('aria-expanded', 'true');
  minimizeButton.addEventListener('click', () => {
    content.hidden = !content.hidden;
    minimizeButton.setAttribute('aria-expanded', String(!content.hidden));
  });

  maximizeButton.setAttribute('aria-pressed', 'false');
  maximizeButton.addEventListener('click', () => {
    const maximized = windowElement.classList.toggle('is-maximized');

    // 드래그로 설정한 인라인 위치를 잠시 비우고 복원 시 그대로 돌려놓습니다.
    if (maximized) {
      previousPosition = {
        left: windowElement.style.left,
        top: windowElement.style.top,
        right: windowElement.style.right,
      };
      ['left', 'top', 'right'].forEach((property) => {
        windowElement.style[property] = '';
      });
    } else {
      Object.assign(windowElement.style, previousPosition);
    }

    maximizeButton.setAttribute('aria-pressed', String(maximized));
    maximizeButton.title = maximized ? 'Restore' : 'Maximize';
    maximizeButton.setAttribute('aria-label', maximizeButton.title);
  });

  windowElement.querySelector('[data-close]').addEventListener('click', () => {
    windowElement.remove();
  });
}

// 5. 타이틀바 드래그: 드래그 중에만 전역 이벤트를 등록합니다.
function enableDrag(windowElement, handleElement) {
  handleElement.addEventListener('mousedown', (event) => {
    if (event.button !== 0 || event.target.closest('button')) return;
    if (windowElement.classList.contains('is-maximized')) return;

    const startX = event.clientX;
    const startY = event.clientY;
    const startPosition = windowElement.getBoundingClientRect();
    document.body.classList.add('is-dragging');
    event.preventDefault();

    function moveWindow(moveEvent) {
      windowElement.style.left = `${startPosition.left + moveEvent.clientX - startX}px`;
      windowElement.style.top = `${startPosition.top + moveEvent.clientY - startY}px`;
      windowElement.style.right = 'auto';
    }

    function stopDragging() {
      document.body.classList.remove('is-dragging');
      window.removeEventListener('mousemove', moveWindow);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('blur', stopDragging);
    }

    window.addEventListener('mousemove', moveWindow);
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('blur', stopDragging);
  });
}

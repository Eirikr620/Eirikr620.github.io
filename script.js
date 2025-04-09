// script.js

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  const links = document.querySelectorAll(".nav-menu a");

  // 햄버거 메뉴 토글
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });

  // 메뉴 클릭 시 닫기
  links.forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
    });
  });

  // GSAP 애니메이션: 섹션 등장 효과
  const sections = document.querySelectorAll(".screen .content");

  sections.forEach((section, index) => {
    gsap.fromTo(
      section,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );
  });
});

(() => {
  "use strict";

  const root = document.documentElement;
  const header = document.querySelector(".site-header");
  const themeToggle = document.querySelector(".theme-toggle");
  const themeIcon = document.querySelector(".theme-icon");
  const themeLabel = document.querySelector(".theme-label");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const toast = document.querySelector(".toast");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function applyTheme(theme) {
    const light = theme === "light";
    root.dataset.theme = theme;
    themeToggle.setAttribute("aria-pressed", String(light));
    themeIcon.textContent = light ? "☾" : "☼";
    themeLabel.textContent = light ? "Tema escuro" : "Tema claro";
    document.querySelector('meta[name="theme-color"]').setAttribute("content", light ? "#f8f6f1" : "#070707");
  }

  const storedTheme = localStorage.getItem("visus-landing-theme");
  const preferredTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  applyTheme(storedTheme || preferredTheme);

  themeToggle.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("visus-landing-theme", next);
  });

  menuToggle.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.textContent = open ? "×" : "☰";
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    });
  });

  document.addEventListener("click", (event) => {
    if (!mobileNav.classList.contains("open")) return;
    if (mobileNav.contains(event.target) || menuToggle.contains(event.target)) return;
    mobileNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth <= 1120) return;
    mobileNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  }, { passive: true });

  function updateHeader() {
    header.classList.toggle("scrolled", window.scrollY > 20);
  }
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  let toastTimer;
  document.querySelectorAll("[data-coming-soon]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      toast.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
    });
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  function initMotion() {
    if (reducedMotion || typeof window.gsap === "undefined") return;

    gsap.from(".site-header .brand, .desktop-nav a, .header-actions > *", {
      opacity: 0,
      y: -14,
      duration: .7,
      stagger: .06,
      ease: "power2.out"
    });

    gsap.from(".hero-copy > *", {
      opacity: 0,
      y: 28,
      duration: .85,
      stagger: .1,
      delay: .15,
      ease: "power3.out"
    });

    gsap.from(".hero-visual", {
      opacity: 0,
      x: 55,
      duration: 1,
      delay: .35,
      ease: "power3.out"
    });

    if (typeof window.ScrollMagic === "undefined") {
      gsap.set(".reveal", { opacity: 1, y: 0 });
      return;
    }

    const controller = new ScrollMagic.Controller();
    document.querySelectorAll(".reveal:not(.hero-copy):not(.hero-visual)").forEach((element) => {
      gsap.set(element, { opacity: 0, y: 34 });
      new ScrollMagic.Scene({
        triggerElement: element,
        triggerHook: .88,
        reverse: false
      })
        .setTween(gsap.to(element, { opacity: 1, y: 0, duration: .75, ease: "power2.out" }))
        .addTo(controller);
    });
  }

  window.addEventListener("load", initMotion, { once: true });
})();

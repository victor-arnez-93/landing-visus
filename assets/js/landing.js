(() => {
  "use strict";
  const root = document.documentElement;
  const header = document.querySelector(".site-header");
  const themeToggle = document.querySelector(".theme-toggle");
  const themeLabel = document.querySelector(".theme-label");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const year = document.getElementById("year");
  const backToTop = document.querySelector(".back-to-top");
  const reduceQuery = matchMedia("(prefers-reduced-motion: reduce)");
  const lowMotion = () => reduceQuery.matches;
  const t = (text) => window.VISUS_I18N?.t(text) || text;

  function themeSet(theme) {
    const light = theme === "light";
    root.dataset.theme = light ? "light" : "dark";
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(light));
      themeToggle.setAttribute("aria-label", t(light ? "Ativar tema escuro" : "Ativar tema claro"));
      themeToggle.title = t(light ? "Ativar tema escuro" : "Ativar tema claro");
    }
    if (themeLabel) themeLabel.textContent = t(light ? "Tema escuro" : "Tema claro");
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = light ? "#f8f6f1" : "#070707";
  }

  let stored = null;
  try { stored = localStorage.getItem("visus-landing-theme"); } catch (_) {}
  themeSet(stored === "light" || stored === "dark" ? stored : (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"));
  document.addEventListener("visus:language-changed", () => { themeSet(root.dataset.theme); });
  themeToggle?.addEventListener("click", () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    themeSet(next);
    try { localStorage.setItem("visus-landing-theme", next); } catch (_) {}
  });

  const menuOpen = (open) => {
    if (!menuToggle || !mobileNav) return;
    mobileNav.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", t(open ? "Fechar menu" : "Abrir menu"));
    // Do not replace SVG children here: the same click event bubbles to document.
    menuToggle.querySelector("svg path")?.setAttribute("d", open ? "M5 5 19 19M19 5 5 19" : "M4 7h16M4 12h16M4 17h16");
  };
  menuToggle?.addEventListener("click", () => menuOpen(!mobileNav.classList.contains("open")));
  mobileNav?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => menuOpen(false)));
  document.addEventListener("click", e => {
    if (mobileNav?.classList.contains("open") && !mobileNav.contains(e.target) && !menuToggle.contains(e.target)) menuOpen(false);
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && mobileNav?.classList.contains("open")) { menuOpen(false); menuToggle.focus(); }
  });
  window.addEventListener("resize", () => { if (innerWidth > 900) menuOpen(false); }, { passive: true });

  const handleScroll = () => {
    const down = scrollY > 28;
    header?.classList.toggle("scrolled", down);
    backToTop?.classList.toggle("visible", scrollY > 540);
  };
  handleScroll();
  addEventListener("scroll", handleScroll, { passive: true });
  if (year) year.textContent = new Date().getFullYear();

  // Three native screenshot slides, automatic and manual navigation.
  const carousel = document.querySelector(".player-carousel");
  if (carousel) {
    const track = carousel.querySelector(".carousel-track");
    const slides = [...carousel.querySelectorAll(".player-slide")];
    const dots = [...carousel.querySelectorAll("[data-carousel-to]")];
    const current = document.getElementById("player-current");
    const length = slides.length;
    let index = 0, timer = null, pointerStart = null;
    let userPaused = false;
    const setIndex = (next) => {
      index = (next + length) % length;
      track.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
      if (current) current.textContent = String(index + 1).padStart(2, "0");
      slides.forEach((slide, n) => {
        slide.setAttribute("aria-hidden", String(n !== index));
        slide.inert = n !== index;
      });
      dots.forEach((dot, n) => {
        dot.classList.toggle("active", index === n);
        if (index === n) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    };
    const stop = () => { if (timer) clearInterval(timer); timer = null; };
    const start = () => {
      stop();
      if (lowMotion() || userPaused || document.hidden) return;
      timer = setInterval(() => setIndex(index + 1), 5800);
    };
    const manual = (next) => { setIndex(next); start(); };
    carousel.querySelector("[data-carousel-prev]")?.addEventListener("click", () => manual(index - 1));
    carousel.querySelector("[data-carousel-next]")?.addEventListener("click", () => manual(index + 1));
    dots.forEach(dot => dot.addEventListener("click", () => manual(Number(dot.dataset.carouselTo))));
    carousel.addEventListener("mouseenter", () => { userPaused = true; stop(); });
    carousel.addEventListener("mouseleave", () => { userPaused = false; start(); });
    carousel.addEventListener("focusin", () => { userPaused = true; stop(); });
    carousel.addEventListener("focusout", e => { if (!carousel.contains(e.relatedTarget)) { userPaused = false; start(); } });
    carousel.addEventListener("keydown", e => {
      if (e.key === "ArrowRight") { e.preventDefault(); manual(index + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); manual(index - 1); }
    });
    carousel.querySelector(".carousel-viewport")?.addEventListener("pointerdown", e => { if (e.pointerType === "touch") pointerStart = e.clientX; });
    carousel.querySelector(".carousel-viewport")?.addEventListener("pointerup", e => {
      if (pointerStart === null || e.pointerType !== "touch") return;
      const distance = e.clientX - pointerStart;
      pointerStart = null;
      if (Math.abs(distance) > 50) manual(index + (distance < 0 ? 1 : -1));
    });
    document.addEventListener("visibilitychange", start);
    reduceQuery.addEventListener?.("change", start);
    setIndex(0);
    start();
  }

  // Resilient scroll reveals, with GSAP ScrollTrigger when available.
  function initMotion() {
    if (lowMotion()) return;
    const gsap = window.gsap;
    if (!gsap) return;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);
    gsap.from(".site-header .header-inner", { y: -12, opacity: 0, duration: .65, ease: "power2.out", clearProps: "all" });
    if (document.querySelector(".hero-copy")) {
      gsap.from(".hero-copy > *", { y: 20, opacity: 0, duration: .8, stagger: .09, delay: .13, ease: "power2.out", clearProps: "all" });
      gsap.from(".hero-visual", { x: 24, opacity: 0, duration: .9, delay: .25, ease: "power2.out", clearProps: "all" });
    }
    if (!window.ScrollTrigger) return;
    document.querySelectorAll(".reveal:not(.hero-copy):not(.hero-visual)").forEach((el) => {
      gsap.from(el, { y: 24, opacity: 0, duration: .68, ease: "power2.out", clearProps: "all", scrollTrigger: { trigger: el, start: "top 94%", once: true } });
    });
  }
  // Wait for defer scripts in document order, but never hide content if a CDN fails.
  if (document.readyState === "complete") initMotion();
  else addEventListener("load", initMotion, { once: true });
})();

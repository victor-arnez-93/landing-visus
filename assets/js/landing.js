(() => {
  "use strict";

  /* =========================================================
     REFERÊNCIAS PRINCIPAIS
     ========================================================= */

  const root = document.documentElement;
  const header = document.querySelector(".site-header");
  const themeToggle = document.querySelector(".theme-toggle");
  const themeIcon = document.querySelector(".theme-icon");
  const themeLabel = document.querySelector(".theme-label");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const toast = document.querySelector(".toast");
  const year = document.getElementById("year");

  const reducedMotion = window
    .matchMedia("(prefers-reduced-motion: reduce)")
    .matches;

  /*
   * Deve ser igual ao breakpoint usado no CSS.
   */
  const MOBILE_BREAKPOINT = 900;

  /* =========================================================
     TEMA
     ========================================================= */

  function applyTheme(theme) {
    const light = theme === "light";

    root.dataset.theme = theme;

    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(light));
    }

    if (themeIcon) {
      themeIcon.textContent = light ? "☾" : "☼";
    }

    if (themeLabel) {
      themeLabel.textContent = light
        ? "Tema escuro"
        : "Tema claro";
    }

    const themeColor = document.querySelector(
      'meta[name="theme-color"]'
    );

    if (themeColor) {
      themeColor.setAttribute(
        "content",
        light ? "#f8f6f1" : "#070707"
      );
    }
  }

  const storedTheme = localStorage.getItem(
    "visus-landing-theme"
  );

  const preferredTheme = window
    .matchMedia("(prefers-color-scheme: light)")
    .matches
      ? "light"
      : "dark";

  applyTheme(storedTheme || preferredTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme =
        root.dataset.theme === "dark"
          ? "light"
          : "dark";

      applyTheme(nextTheme);

      localStorage.setItem(
        "visus-landing-theme",
        nextTheme
      );
    });
  }

  /* =========================================================
     MENU RESPONSIVO
     ========================================================= */

  function setMenuState(open) {
    if (!menuToggle || !mobileNav) {
      return;
    }

    mobileNav.classList.toggle("open", open);

    menuToggle.setAttribute(
      "aria-expanded",
      String(open)
    );

    menuToggle.setAttribute(
      "aria-label",
      open ? "Fechar menu" : "Abrir menu"
    );

    menuToggle.textContent = open ? "×" : "☰";
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      const open = !mobileNav.classList.contains("open");
      setMenuState(open);
    });

    mobileNav
      .querySelectorAll("a")
      .forEach((link) => {
        link.addEventListener("click", () => {
          setMenuState(false);
        });
      });

    document.addEventListener("click", (event) => {
      if (!mobileNav.classList.contains("open")) {
        return;
      }

      if (
        mobileNav.contains(event.target)
        || menuToggle.contains(event.target)
      ) {
        return;
      }

      setMenuState(false);
    });

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape"
        && mobileNav.classList.contains("open")
      ) {
        setMenuState(false);
        menuToggle.focus();
      }
    });

    window.addEventListener(
      "resize",
      () => {
        if (window.innerWidth > MOBILE_BREAKPOINT) {
          setMenuState(false);
        }
      },
      { passive: true }
    );
  }

  /* =========================================================
     CABEÇALHO AO ROLAR
     ========================================================= */

  function updateHeader() {
    if (!header) {
      return;
    }

    header.classList.toggle(
      "scrolled",
      window.scrollY > 20
    );
  }

  updateHeader();

  window.addEventListener(
    "scroll",
    updateHeader,
    { passive: true }
  );

  /* =========================================================
     AVISO DE DOWNLOAD
     ========================================================= */

  let toastTimer;

  document
    .querySelectorAll("[data-coming-soon]")
    .forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();

        if (!toast) {
          return;
        }

        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
          toast.classList.remove("show");
        }, 2800);
      });
    });

  /* =========================================================
     ANO DO RODAPÉ
     ========================================================= */

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* =========================================================
     ANIMAÇÕES
     ========================================================= */

  function initMotion() {
    /*
     * Sem animação, todos os elementos permanecem visíveis.
     */
    if (
      reducedMotion
      || typeof window.gsap === "undefined"
    ) {
      return;
    }

    /*
     * Correção importante:
     *
     * O cabeçalho inteiro é animado como um único bloco.
     * Os links do menu não recebem mais opacity individual,
     * evitando que somente parte deles fique invisível.
     */
    gsap.fromTo(
      ".site-header .header-inner",
      {
        opacity: 0,
        y: -14
      },
      {
        opacity: 1,
        y: 0,
        duration: .7,
        ease: "power2.out",
        clearProps: "opacity,transform"
      }
    );

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

    if (
      typeof window.ScrollMagic === "undefined"
    ) {
      gsap.set(".reveal", {
        opacity: 1,
        y: 0
      });

      return;
    }

    const controller =
      new ScrollMagic.Controller();

    document
      .querySelectorAll(
        ".reveal:not(.hero-copy):not(.hero-visual)"
      )
      .forEach((element) => {
        gsap.set(element, {
          opacity: 0,
          y: 34
        });

        new ScrollMagic.Scene({
          triggerElement: element,
          triggerHook: .88,
          reverse: false
        })
          .setTween(
            gsap.to(element, {
              opacity: 1,
              y: 0,
              duration: .75,
              ease: "power2.out"
            })
          )
          .addTo(controller);
      });
  }

  /*
   * Funciona tanto no carregamento normal quanto quando o
   * arquivo é executado depois de a página já ter carregado.
   */
  if (document.readyState === "complete") {
    initMotion();
  } else {
    window.addEventListener(
      "load",
      initMotion,
      { once: true }
    );
  }
})();

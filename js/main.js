/* =========================================================
   IL MELO ROSSO — interactions & scroll animations
   GSAP + ScrollTrigger + Lenis
   ========================================================= */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const yearEl = $(".js-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- graceful fallback if libs fail to load ---------- */
  if (!window.gsap || !window.ScrollTrigger) {
    document.body.classList.remove("is-loading");
    const l = $(".loader"); if (l) l.remove();
    $$(".manifesto .w, .pill, .zoom__caption").forEach(e => { e.style.opacity = 1; e.style.transform = "none"; });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power3.out" });

  /* =========================================================
     SMOOTH SCROLL (Lenis)
     ========================================================= */
  let lenis = null;
  if (!reduceMotion && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  const scrollToTarget = (target) => {
    const el = typeof target === "string" ? $(target) : target;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.6 });
    else el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  };

  $$('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const el = $(id);
      if (!el) return;
      e.preventDefault();
      closeMenu();
      scrollToTarget(el);
    });
  });

  /* =========================================================
     TEXT SPLITTING
     ========================================================= */
  // wrap every word (text nodes only — keeps <em>, .pill etc.)
  function splitWords(root, masked = false) {
    const out = [];
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            const w = document.createElement("span");
            if (masked) {
              w.className = "wm";
              const i = document.createElement("span");
              i.className = "wi";
              i.textContent = part;
              w.appendChild(i);
              out.push(i);
            } else {
              w.className = "w";
              w.textContent = part;
              out.push(w);
            }
            frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.classList.contains("pill") && n.tagName !== "BR") {
          walk(n);
        }
      });
    };
    walk(root);
    return out;
  }

  function splitChars(el) {
    const text = el.textContent;
    el.textContent = "";
    el.setAttribute("aria-label", text);
    return [...text].map(c => {
      const s = document.createElement("span");
      s.className = "ch";
      s.setAttribute("aria-hidden", "true");
      s.innerHTML = c === " " ? "&nbsp;" : c;
      el.appendChild(s);
      return s;
    });
  }

  const heroChars = $$(".js-chars").map(splitChars);
  const manifestoWords = $$(".js-words").flatMap(el => splitWords(el));
  const revealGroups = $$(".js-reveal").map(el => ({ el, words: splitWords(el, true) }));

  /* =========================================================
     NAV — hide on scroll down, solid after hero
     ========================================================= */
  const nav = $(".nav");
  let lastY = 0;
  ScrollTrigger.create({
    start: 0, end: "max",
    onUpdate: self => {
      const y = self.scroll();
      const heroH = $(".hero").offsetHeight;
      nav.classList.toggle("is-solid", y > heroH - 80);
      if (!document.body.classList.contains("menu-open")) {
        nav.classList.toggle("is-hidden", y > 300 && y > lastY);
      }
      lastY = y;
    }
  });

  /* =========================================================
     MENU OVERLAY
     ========================================================= */
  const menu = $(".menu");
  const burger = $(".burger");
  let menuTl = null;

  function buildMenuTl() {
    menuTl = gsap.timeline({ paused: true })
      .set(menu, { visibility: "visible" })
      .to(menu, { "--mclip": "0%", duration: .9, ease: "expo.inOut" })
      .from(".menu__list a", { yPercent: 110, duration: .9, stagger: .06, ease: "expo.out" }, "-=.35")
      .fromTo(".menu__preview", { "--pclip": "100%" }, { "--pclip": "0%", duration: 1, ease: "expo.out" }, "<")
      .from(".menu__foot", { opacity: 0, y: 20, duration: .6 }, "-=.6");
  }
  buildMenuTl();

  function openMenu() {
    document.body.classList.add("menu-open");
    burger.setAttribute("aria-expanded", "true");
    menu.setAttribute("aria-hidden", "false");
    nav.classList.remove("is-hidden");
    if (lenis) lenis.stop();
    menuTl.timeScale(1).play();
  }
  function closeMenu() {
    if (!document.body.classList.contains("menu-open")) return;
    document.body.classList.remove("menu-open");
    burger.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden", "true");
    if (lenis) lenis.start();
    menuTl.timeScale(1.6).reverse();
  }
  burger.addEventListener("click", () => document.body.classList.contains("menu-open") ? closeMenu() : openMenu());
  document.addEventListener("keydown", e => { if (e.key === "Escape") { closeMenu(); closeLightbox(); } });

  $$(".menu__list a").forEach(a => {
    a.addEventListener("mouseenter", () => {
      $$(".menu__preview img").forEach(img => img.classList.toggle("is-active", img.dataset.key === a.dataset.key));
    });
  });

  /* =========================================================
     CURSOR + MAGNETIC
     ========================================================= */
  if (finePointer && !reduceMotion) {
    const cursor = $(".cursor");
    const label = $(".cursor__label");
    const xTo = gsap.quickTo(cursor, "x", { duration: .45, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: .45, ease: "power3" });
    window.addEventListener("mousemove", e => { xTo(e.clientX); yTo(e.clientY); });

    document.addEventListener("mouseover", e => {
      const lab = e.target.closest("[data-cursor]");
      const link = e.target.closest("a, button, .gitem");
      cursor.classList.toggle("is-label", !!lab);
      cursor.classList.toggle("is-link", !lab && !!link);
      label.textContent = lab ? lab.dataset.cursor : "";
    });

    $$(".magnetic").forEach(el => {
      const xT = gsap.quickTo(el, "x", { duration: .6, ease: "elastic.out(1, .4)" });
      const yT = gsap.quickTo(el, "y", { duration: .6, ease: "elastic.out(1, .4)" });
      el.addEventListener("mousemove", e => {
        const r = el.getBoundingClientRect();
        xT((e.clientX - (r.left + r.width / 2)) * .35);
        yT((e.clientY - (r.top + r.height / 2)) * .35);
      });
      el.addEventListener("mouseleave", () => { xT(0); yT(0); });
    });
  }

  /* =========================================================
     LIGHTBOX
     ========================================================= */
  const lb = $(".lightbox");
  const lbImg = $("img", lb);
  function openLightbox(src, alt) {
    lbImg.src = src; lbImg.alt = alt || "";
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    if (lenis) lenis.stop();
  }
  function closeLightbox() {
    if (!lb.classList.contains("is-open")) return;
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    if (lenis) lenis.start();
  }
  lb.addEventListener("click", closeLightbox);
  $$(".gitem, .wcard").forEach(f => {
    f.addEventListener("click", () => {
      const img = $("img", f);
      openLightbox(img.currentSrc || img.src, img.alt);
    });
  });

  /* =========================================================
     REVIEWS SLIDER
     ========================================================= */
  (function reviews() {
    const items = $$(".review");
    const bar = $(".reviews__bar span");
    if (!items.length) return;
    let i = 0, timer;
    const show = (n) => {
      const prev = items[i];
      i = (n + items.length) % items.length;
      const next = items[i];
      if (prev !== next) {
        gsap.to(prev, { opacity: 0, y: -20, duration: .5, onComplete: () => prev.classList.remove("is-active") });
        next.classList.add("is-active");
        gsap.fromTo(next, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .9, delay: .2 });
      }
      gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 7, ease: "none" });
      clearTimeout(timer);
      timer = setTimeout(() => show(i + 1), 7000);
    };
    $$(".rbtn").forEach(b => b.addEventListener("click", () => show(i + +b.dataset.dir)));
    ScrollTrigger.create({ trigger: ".reviews", start: "top 70%", once: true, onEnter: () => show(0) });
  })();

  /* =========================================================
     REDUCED MOTION: stop here, everything already visible
     ========================================================= */
  if (reduceMotion) {
    document.body.classList.remove("is-loading");
    $$(".js-reveal .wi, .ch").forEach(e => (e.style.transform = "none"));
    $$(".stat__n").forEach(el => {
      const end = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0;
      el.textContent = end.toFixed(dec).replace(".", ",") + (el.dataset.suffix || "");
    });
    return;
  }

  /* =========================================================
     LOADER → HERO INTRO
     ========================================================= */
  const heroImg = $(".hero__media img");
  const imgReady = (img) => new Promise(res => {
    if (!img) return res();
    if (img.complete && img.naturalWidth) return res();
    img.addEventListener("load", res, { once: true });
    img.addEventListener("error", res, { once: true });
    setTimeout(res, 4000);
  });

  gsap.set(heroChars.flat(), { yPercent: 115 });
  gsap.set([".hero__kicker span"], { yPercent: 110 });
  gsap.set([".hero__bottom", nav], { autoAlpha: 0 });

  const counter = { v: 0 };
  const countEl = $(".js-count");
  const loaderTl = gsap.timeline({ paused: true });
  loaderTl
    .to(".loader__stack figure", {
      "--clip": "0%", duration: .7, stagger: .38, ease: "expo.out"
    }, 0)
    .to(".loader__stack img", { scale: 1, duration: 1.2, stagger: .38, ease: "expo.out" }, 0)
    .to(counter, {
      v: 100, duration: 2.3, ease: "power2.inOut",
      onUpdate: () => (countEl.textContent = Math.round(counter.v))
    }, 0)
    .to(".loader__curtain", { y: 0, duration: .9, ease: "expo.inOut" }, "+=.15")
    .to(".loader", { "--lb": "100%", duration: 1.1, ease: "expo.inOut" }, "+=.05")
    .add("hero", "-=.75")
    .fromTo(heroImg, { scale: 1.35 }, { scale: 1, duration: 2.2, ease: "expo.out" }, "hero")
    .to(heroChars.flat(), { yPercent: 0, duration: 1.4, stagger: .045, ease: "expo.out" }, "hero+=.1")
    .to(".hero__kicker span", { yPercent: 0, duration: 1, ease: "expo.out" }, "hero+=.4")
    .to([".hero__bottom", nav], { autoAlpha: 1, duration: 1 }, "hero+=.6")
    .add(() => {
      document.body.classList.remove("is-loading");
      $(".loader").style.display = "none";
      if (lenis) lenis.start();
      ScrollTrigger.refresh();
    }, "hero+=.3");

  Promise.all([
    imgReady(heroImg),
    document.fonts ? document.fonts.ready.catch(() => {}) : Promise.resolve(),
    ...$$(".loader__stack img").map(imgReady)
  ]).then(() => loaderTl.play());

  // make sure we start at the top (hero intro)
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  /* =========================================================
     SCROLL ANIMATIONS
     ========================================================= */
  // ---- HERO parallax out
  gsap.timeline({
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
  })
    .to(".hero__media", { yPercent: 22, ease: "none" }, 0)
    .to(".hero__title", { yPercent: -35, ease: "none" }, 0);

  // ---- generic masked word reveals for titles
  revealGroups.forEach(({ el, words }) => {
    gsap.from(words, {
      yPercent: 115, rotate: 4, duration: 1.2, stagger: .05, ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 85%" }
    });
  });

  // ---- MANIFESTO: words light up while scrolling
  if (manifestoWords.length) {
    gsap.to(manifestoWords, {
      opacity: 1, stagger: .1, ease: "none",
      scrollTrigger: { trigger: ".manifesto", start: "top 78%", end: "bottom 45%", scrub: 1 }
    });
    $$(".manifesto .pill").forEach(p => {
      gsap.to(p, {
        scale: 1, ease: "back.out(1.8)", duration: 1,
        scrollTrigger: { trigger: p, start: "top 82%", toggleActions: "play none none reverse" }
      });
    });
    gsap.from(".intro__foot", {
      opacity: 0, y: 40, duration: 1.2,
      scrollTrigger: { trigger: ".intro__foot", start: "top 90%" }
    });
  }

  // ---- ZOOM: centre image expands to full screen, tiles fly away
  (function zoom() {
    const pin = $(".zoom__pin");
    if (!pin) return;
    const tiles = $$(".zoom__tile", pin);
    const tl = gsap.timeline({
      scrollTrigger: { trigger: pin, start: "top top", end: "+=200%", pin: true, scrub: 1, anticipatePin: 1 }
    });
    tl.to(".zoom__center", { "--cy": "0%", "--cx": "0%", "--cr": "0px", ease: "power2.inOut", duration: 1 }, 0)
      .to(".zoom__center > img", { scale: 1, ease: "power2.inOut", duration: 1 }, 0);
    tiles.forEach((t, i) => {
      tl.to(t, {
        x: () => {
          const r = t.getBoundingClientRect();
          return (r.left + r.width / 2 - innerWidth / 2) * 1.4;
        },
        y: () => {
          const r = t.getBoundingClientRect();
          return (r.top + r.height / 2 - innerHeight / 2) * 1.4;
        },
        scale: 1.5, ease: "power2.in", duration: .85
      }, 0.02 * i);
    });
    tl.to(".zoom__center", { "--shade": 1, duration: .3 }, .75)
      .to(".zoom__caption", { opacity: 1, y: 0, duration: .3 }, .8)
      .from(".zoom__caption h2", { yPercent: 40, duration: .3 }, .8)
      .to({}, { duration: .25 }); // small hold at the end

    // tiles gently float in on entry
    gsap.from(tiles, {
      yPercent: 40, opacity: 0, duration: 1.4, stagger: .08, ease: "expo.out",
      scrollTrigger: { trigger: ".zoom", start: "top 75%" }
    });
  })();

  // ---- CUCINA: clip reveal + inner parallax
  $$(".cimg").forEach((f, i) => {
    gsap.fromTo(f, { "--clip": "100%" }, {
      "--clip": "0%", duration: 1.5, ease: "expo.out",
      scrollTrigger: { trigger: f, start: "top 88%" }
    });
    gsap.fromTo($("img", f), { yPercent: -14 }, {
      yPercent: 0, ease: "none",
      scrollTrigger: { trigger: f, start: "top bottom", end: "bottom top", scrub: true }
    });
    gsap.to(f, {
      y: [0, -60, 30, -90][i % 4], ease: "none",
      scrollTrigger: { trigger: ".cucina__grid", start: "top bottom", end: "bottom top", scrub: true }
    });
  });
  gsap.from(".courses li", {
    xPercent: -8, opacity: 0, duration: 1.2, stagger: .1, ease: "expo.out",
    scrollTrigger: { trigger: ".courses", start: "top 80%" }
  });
  gsap.from(".cucina__info > *", {
    y: 30, opacity: 0, duration: 1, stagger: .08,
    scrollTrigger: { trigger: ".cucina__info", start: "top 90%" }
  });

  // ---- GENUINO: words slide apart around the photo
  if ($(".genuino")) {
    gsap.timeline({
      scrollTrigger: { trigger: ".genuino__pin", start: "top top", end: "+=150%", pin: true, scrub: 1 }
    })
      .fromTo(".genuino__word--l", { xPercent: 40 }, { xPercent: -55, ease: "none" }, 0)
      .fromTo(".genuino__word--r", { xPercent: -40 }, { xPercent: 55, ease: "none" }, 0)
      .fromTo(".genuino__video", { scale: .55, rotate: -6 }, { scale: 1.12, rotate: 0, ease: "power1.inOut" }, 0)
      .fromTo(".genuino__video img", { scale: 1.3 }, { scale: 1, ease: "none" }, 0);
  }

  // ---- MARQUEE: endless + reacts to scroll velocity/direction
  (function marquee() {
    const track = $(".marquee__track");
    if (!track) return;
    const loop = gsap.to(track, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
    let dir = 1;
    ScrollTrigger.create({
      trigger: ".marquee", start: "top bottom", end: "bottom top",
      onUpdate: self => {
        const v = self.getVelocity();
        if (self.direction !== dir) dir = self.direction;
        gsap.to(loop, { timeScale: dir * (1 + Math.min(Math.abs(v) / 250, 6)), duration: .25, overwrite: true });
        gsap.to(loop, { timeScale: dir, duration: 1.2, delay: .25, overwrite: false });
        gsap.to(track, { skewX: gsap.utils.clamp(-8, 8, v / -300), duration: .3, overwrite: "auto" });
        gsap.to(track, { skewX: 0, duration: .8, delay: .3 });
      }
    });
  })();

  // ---- ROOMS: stacked cards shrink as the next arrives
  (function rooms() {
    const cards = $$(".room");
    cards.forEach((card, i) => {
      gsap.fromTo($(".room__media img", card), { scale: 1.25 }, {
        scale: 1.05, ease: "none",
        scrollTrigger: { trigger: card, start: "top bottom", end: "top 12%", scrub: true }
      });
      const next = cards[i + 1];
      if (!next) return;
      gsap.to(card, {
        scale: .9, "--dim": .45, ease: "none",
        scrollTrigger: { trigger: next, start: "top bottom", end: "top 12%", scrub: true }
      });
    });
    gsap.from(".rooms__foot > *", {
      y: 40, opacity: 0, duration: 1, stagger: .1,
      scrollTrigger: { trigger: ".rooms__foot", start: "top 92%" }
    });
  })();

  // ---- WEDDINGS: horizontal scroll
  (function weddings() {
    const pin = $(".wed__pin");
    const track = $(".wed__track");
    if (!pin || !track) return;
    const dist = () => track.scrollWidth - innerWidth;
    const hTween = gsap.to(track, {
      x: () => -dist(), ease: "none",
      scrollTrigger: {
        trigger: pin, start: "top top", end: () => "+=" + dist(),
        pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1
      }
    });
    gsap.to(".wed__progress span", {
      scaleX: 1, ease: "none",
      scrollTrigger: { trigger: pin, start: "top top", end: () => "+=" + dist(), scrub: true }
    });
    $$(".wcard").forEach(card => {
      gsap.fromTo($("img", card), { xPercent: -20 }, {
        xPercent: 0, ease: "none",
        scrollTrigger: { trigger: card, containerAnimation: hTween, start: "left right", end: "right left", scrub: true }
      });
    });
    gsap.from(".wed__intro > *", {
      y: 60, opacity: 0, duration: 1.2, stagger: .1, ease: "expo.out",
      scrollTrigger: { trigger: ".wed", start: "top 65%" }
    });

    // stats counters
    $$(".stat__n").forEach(el => {
      const end = parseFloat(el.dataset.count);
      const dec = +el.dataset.dec || 0;
      const suf = el.dataset.suffix || "";
      const o = { v: 0 };
      gsap.to(o, {
        v: end, duration: 2, ease: "power2.out",
        onUpdate: () => (el.textContent = o.v.toFixed(dec).replace(".", ",") + suf),
        scrollTrigger: { trigger: el, start: "top 88%" }
      });
    });
  })();

  // ---- LAND: giant word filled with landscape
  (function land() {
    gsap.fromTo(".land__word", { scale: 1.5, backgroundPosition: "50% 0%" }, {
      scale: 1, backgroundPosition: "50% 100%", ease: "none",
      scrollTrigger: { trigger: ".land", start: "top bottom", end: "top 15%", scrub: true }
    });
    $$(".lcard").forEach((c, i) => {
      gsap.fromTo($("img", c), { scale: 1.3 }, {
        scale: 1, ease: "none",
        scrollTrigger: { trigger: c, start: "top bottom", end: "bottom 40%", scrub: true }
      });
      gsap.from(c, {
        y: 120, opacity: 0, duration: 1.4, delay: i * .08, ease: "expo.out",
        scrollTrigger: { trigger: c, start: "top 95%" }
      });
    });
  })();

  // ---- GALLERY: columns at different speeds
  $$(".gcol").forEach(col => {
    gsap.to(col, {
      yPercent: +col.dataset.speed || 0, ease: "none",
      scrollTrigger: { trigger: ".gallery__cols", start: "top bottom", end: "bottom top", scrub: true }
    });
  });
  $$(".gitem").forEach(g => {
    gsap.from(g, {
      scale: .86, opacity: 0, duration: 1.4, ease: "expo.out",
      scrollTrigger: { trigger: g, start: "top 95%" }
    });
  });

  // ---- REVIEWS title area
  gsap.from(".reviews__top > *", {
    y: 30, opacity: 0, duration: 1, stagger: .1,
    scrollTrigger: { trigger: ".reviews", start: "top 80%" }
  });

  // ---- FOOTER: reveal from below with parallax
  gsap.from(".footer__inner", {
    yPercent: -18, ease: "none",
    scrollTrigger: { trigger: ".footer", start: "top bottom", end: "top 20%", scrub: true }
  });
  gsap.from(".footer__title", {
    y: 80, opacity: 0, duration: 1.4, ease: "expo.out",
    scrollTrigger: { trigger: ".footer", start: "top 70%" }
  });
  gsap.fromTo(".footer__giant", { xPercent: 12 }, {
    xPercent: -4, ease: "none",
    scrollTrigger: { trigger: ".footer__giant", start: "top bottom", end: "bottom bottom", scrub: true }
  });

  // ---- recalc after everything is loaded
  window.addEventListener("load", () => ScrollTrigger.refresh());
  let rT;
  window.addEventListener("resize", () => { clearTimeout(rT); rT = setTimeout(() => ScrollTrigger.refresh(), 250); });
})();

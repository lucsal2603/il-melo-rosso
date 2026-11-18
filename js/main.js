/* =========================================================
   IL MELO ROSSO — v2 · interactions & motion
   GSAP + ScrollTrigger + Lenis + WebGL hero (MeloGL)
   ========================================================= */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const isMobile = () => innerWidth < 860;

  $$(".js-year").forEach(e => (e.textContent = new Date().getFullYear()));

  if (!window.gsap || !window.ScrollTrigger) {
    document.body.classList.remove("is-loading");
    const l = $(".loader"); if (l) l.remove();
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power3.out" });
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  scrollTo(0, 0);

  /* =========================================================
     SMOOTH SCROLL
     ========================================================= */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  const goTo = target => {
    const el = typeof target === "string" ? $(target) : target;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { duration: 1.8 });
    else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    if (id.length < 2 || !$(id)) return;
    e.preventDefault();
    closeMenu();
    goTo(id);
  });

  /* =========================================================
     TEXT SPLITTING
     ========================================================= */
  function splitChars(el) {
    const text = el.textContent;
    el.setAttribute("aria-label", text.trim());
    el.textContent = "";
    const mask = document.createElement("span");
    mask.className = "chm";
    mask.setAttribute("aria-hidden", "true");
    const chars = [...text].map(c => {
      const s = document.createElement("span");
      s.className = "ch";
      s.innerHTML = c === " " ? "&nbsp;" : c;
      mask.appendChild(s);
      return s;
    });
    el.appendChild(mask);
    return chars;
  }

  // lines: split on <br>, then by measured wrap
  function splitLines(el) {
    const html = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = "";
    const inners = [];
    html.forEach(chunk => {
      const tmp = document.createElement("span");
      tmp.innerHTML = chunk.trim();
      const words = tmp.innerHTML.split(/\s+/).filter(Boolean);
      const holder = document.createElement("span");
      holder.style.display = "block";
      holder.innerHTML = words.map(w => `<span class="wtmp" style="display:inline-block">${w}</span>`).join(" ");
      el.appendChild(holder);
      const groups = [];
      let lastTop = null;
      $$(".wtmp", holder).forEach(w => {
        const t = w.offsetTop;
        if (lastTop === null || Math.abs(t - lastTop) > 4) { groups.push([]); lastTop = t; }
        groups[groups.length - 1].push(w.innerHTML);
      });
      holder.remove();
      groups.forEach(g => {
        const ln = document.createElement("span");
        ln.className = "ln";
        const inner = document.createElement("span");
        inner.innerHTML = g.join(" ");
        ln.appendChild(inner);
        el.appendChild(ln);
        inners.push(inner);
      });
    });
    return inners;
  }

  const style = document.createElement("style");
  style.textContent = ".chm{display:inline-block;overflow:hidden;vertical-align:top;padding:0 .04em .1em;margin:0 -.04em -.1em}";
  document.head.appendChild(style);

  const charGroups = $$(".js-chars").map(el => ({ el, chars: splitChars(el) }));
  let lineGroups = [];

  /* =========================================================
     HEADER / HUD
     ========================================================= */
  const hdr = $(".hdr");
  const hud = $(".hud");
  let lastY = 0;
  ScrollTrigger.create({
    start: 0, end: "max",
    onUpdate(self) {
      const y = self.scroll();
      if (!document.body.classList.contains("menu-open")) {
        hdr.classList.toggle("is-hidden", y > innerHeight * 4.6 && y > lastY + 2);
      }
      lastY = y;
    }
  });
  $$(".chef, .wed, .foot").forEach(sec => {
    ScrollTrigger.create({
      trigger: sec, start: "top 60px", end: "bottom 60px",
      onToggle: s => hdr.classList.toggle("on-dark", s.isActive)
    });
  });

  /* =========================================================
     MENU
     ========================================================= */
  const menu = $(".menu");
  const menuBtn = $(".hdr__menu");
  const menuTl = gsap.timeline({ paused: true })
    .set(menu, { visibility: "visible" })
    .to(menu, { "--m": "0%", duration: 1, ease: "expo.inOut" })
    .from(".menu__list a", { yPercent: 110, duration: 1, stagger: .06, ease: "expo.out" }, "-=.45")
    .from(".mshape", { scale: 0, rotate: -90, duration: 1, stagger: .08, ease: "back.out(1.6)" }, "<")
    .from(".menu__foot", { opacity: 0, y: 20, duration: .6 }, "-=.6");

  function openMenu() {
    document.body.classList.add("menu-open");
    menuBtn.setAttribute("aria-expanded", "true");
    menu.setAttribute("aria-hidden", "false");
    hdr.classList.remove("is-hidden");
    lenis && lenis.stop();
    menuTl.timeScale(1).play();
  }
  function closeMenu() {
    if (!document.body.classList.contains("menu-open")) return;
    document.body.classList.remove("menu-open");
    menuBtn.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden", "true");
    lenis && lenis.start();
    menuTl.timeScale(1.7).reverse();
  }
  menuBtn.addEventListener("click", () => document.body.classList.contains("menu-open") ? closeMenu() : openMenu());
  addEventListener("keydown", e => { if (e.key === "Escape") { closeMenu(); closeLb(); } });

  /* =========================================================
     CURSOR PILL
     ========================================================= */
  const follower = $(".follower");
  const followerTxt = $(".follower__t");
  let followerOn = false;
  const fx = gsap.quickTo(follower, "x", { duration: .5, ease: "power3" });
  const fy = gsap.quickTo(follower, "y", { duration: .5, ease: "power3" });
  function showFollower(txt) {
    if (!fine) return;
    if (txt) followerTxt.textContent = txt;
    if (followerOn) return;
    followerOn = true;
    gsap.to(follower, { scale: 1, duration: .5, ease: "back.out(2)", overwrite: "auto" });
  }
  function hideFollower() {
    if (!followerOn) return;
    followerOn = false;
    gsap.to(follower, { scale: 0, duration: .35, ease: "power3.in", overwrite: "auto" });
  }
  if (fine) {
    addEventListener("pointermove", e => { fx(e.clientX); fy(e.clientY + 34); }, { passive: true });
    $$("[data-cursor], .mrow figure").forEach(el => {
      el.addEventListener("pointerenter", () => showFollower(el.dataset.cursor || "Guarda"));
      el.addEventListener("pointerleave", hideFollower);
    });
  }

  /* =========================================================
     LIGHTBOX
     ========================================================= */
  const lb = $(".lightbox"), lbImg = $("img", lb);
  function openLb(img) {
    lbImg.src = img.currentSrc || img.src; lbImg.alt = img.alt;
    lb.classList.add("is-open"); lb.setAttribute("aria-hidden", "false");
    lenis && lenis.stop();
  }
  function closeLb() {
    if (!lb.classList.contains("is-open")) return;
    lb.classList.remove("is-open"); lb.setAttribute("aria-hidden", "true");
    lenis && lenis.start();
  }
  lb.addEventListener("click", closeLb);

  /* =========================================================
     HERO — WebGL wheel
     ========================================================= */
  const heroItems = [
    { src: "assets/img/gl/img-7611.jpg", label: "La Cascina", target: "#cascina" },
    { src: "assets/img/gl/13175261.jpg", label: "La Cucina", target: "#cucina" },
    { src: "assets/img/gl/casetta-1.jpg", label: "Le Camere", target: "#camere" },
    { src: "assets/img/gl/13660935-2.jpg", label: "Matrimoni", target: "#matrimoni" },
    { src: "assets/img/gl/img-7606.jpg", label: "La Piscina", target: "#territorio" },
    { src: "assets/img/gl/img-7842.jpg", label: "Colazione", target: "#cucina" },
    { src: "assets/img/gl/img-7608.jpg", label: "Il Giardino", target: "#cascina" },
    { src: "assets/img/gl/img-7607-1.jpg", label: "Fortunago", target: "#territorio" },
    { src: "assets/img/gl/0da5b5f9.jpg", label: "Ospite d'onore", target: "#galleria" },
    { src: "assets/img/gl/img-7609-1.jpg", label: "Dolci di casa", target: "#cucina" }
  ];
  const tag = $(".hero__tag");
  const tagTxt = $(".hero__tagtxt");
  const idxEl = $(".js-idx");
  let gl = null;
  let heroOn = true;
  let tagTl = null;

  function setActive(i) {
    const it = heroItems[i];
    tag.setAttribute("href", it.target);
    idxEl.textContent = String(i + 1).padStart(2, "0");
    if (tagTl) tagTl.kill();
    tagTl = gsap.timeline()
      .to(tagTxt, { yPercent: -120, opacity: 0, duration: .18, ease: "power2.in" })
      .add(() => (tagTxt.textContent = it.label))
      .fromTo(tagTxt, { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .45, ease: "expo.out", immediateRender: false });
    gsap.fromTo(tag, { scale: .9 }, { scale: 1, duration: .6, ease: "back.out(2.5)" });
  }

  const canvas = $(".hero__gl");
  try {
    if (window.MeloGL && canvas) {
      gl = MeloGL.create({
        canvas,
        items: heroItems,
        onActive: setActive,
        onHover: i => (i >= 0 && heroOn ? showFollower("Scopri") : hideFollower()),
        onClick: i => goTo(heroItems[i].target)
      });
    }
  } catch (e) { gl = null; }
  if (!gl) document.documentElement.classList.add("no-gl");

  /* ring + table */
  const ring = $(".hero__ring");
  const ringState = { idle: 0, scroll: 0 };
  gsap.ticker.add((t, dt) => {
    ringState.idle -= dt * 0.004;
    gsap.set(ring, { rotation: ringState.idle + ringState.scroll });
  });

  /* =========================================================
     LOADER → INTRO
     ========================================================= */
  const counter = { v: 0 };
  const countEl = $(".js-count");
  gsap.set(".hdr, .hud", { autoAlpha: 0 });
  gsap.set(".hero__table", { scaleY: 0, transformOrigin: "50% 100%" });
  gsap.set(ring, { autoAlpha: 0 });
  gsap.set(tag, { autoAlpha: 0, scale: .6 });

  const glIntro = { v: 0 };
  const loaderTl = gsap.timeline({ paused: true });
  loaderTl
    .to(".lshape", {
      scale: 1, duration: .9, ease: "back.out(2.2)",
      stagger: { each: .14, from: "random" }
    }, 0)
    .to(".lshape", { y: "random(-20, 20)", rotation: "+=random(-20, 20)", duration: 2, ease: "sine.inOut" }, .4)
    .to(counter, { v: 100, duration: 2.2, ease: "power2.inOut", onUpdate: () => (countEl.textContent = Math.round(counter.v)) }, 0)
    .to(".lshape", { scale: 0, rotation: "+=90", duration: .5, ease: "back.in(2)", stagger: { each: .04, from: "random" } }, "+=.1")
    .to(".loader__count", { yPercent: -60, opacity: 0, duration: .5, ease: "power3.in" }, "<")
    .to(".loader__wipe--a", { yPercent: -101, duration: .8, ease: "expo.inOut" }, "-=.2")
    .to(".loader__wipe--b", { yPercent: -101, duration: .8, ease: "expo.inOut" }, "-=.62")
    .set(".loader", { backgroundColor: "transparent" })
    .add(() => $(".loader__shapes").remove())
    .to(".loader__wipe--a", { yPercent: -202, duration: 1, ease: "expo.inOut" }, "+=.05")
    .to(".loader__wipe--b", { yPercent: -202, duration: 1, ease: "expo.inOut" }, "-=.92")
    .add("intro", "-=.6")
    .to(".hero__table", { scaleY: 1, duration: 1.4, ease: "expo.out" }, "intro")
    .fromTo(ring, { autoAlpha: 0, scale: .7 }, { autoAlpha: 1, scale: 1, duration: 1.8, ease: "expo.out" }, "intro")
    .to(glIntro, { v: 1, duration: 2.4, ease: "expo.out", onUpdate: () => gl && gl.setIntro(glIntro.v) }, "intro")
    .to(".hdr", { autoAlpha: 1, duration: .8 }, "intro+=.5")
    .from(".hdr > *", { y: -30, duration: 1, stagger: .08, ease: "expo.out" }, "intro+=.5")
    .to(".hud", { autoAlpha: 1, duration: .8 }, "intro+=.9")
    .to(tag, { autoAlpha: 1, scale: 1, duration: .8, ease: "back.out(2)" }, "intro+=1.1")
    .add(() => {
      $(".loader").remove();
      document.body.classList.remove("is-loading");
      lenis && lenis.start();
      ScrollTrigger.refresh();
    }, "intro+=.4");

  const imgReady = img => new Promise(r => {
    if (!img || (img.complete && img.naturalWidth)) return r();
    img.addEventListener("load", r, { once: true });
    img.addEventListener("error", r, { once: true });
    setTimeout(r, 3500);
  });
  const fontsReady = document.fonts ? document.fonts.ready.catch(() => {}) : Promise.resolve();

  if (reduce) {
    $(".loader").remove();
    document.body.classList.remove("is-loading");
    gsap.set(".hdr, .hud, .hero__table, .hero__ring, .hero__tag", { clearProps: "all" });
    gl && gl.setIntro(1);
  } else {
    fontsReady.then(() => loaderTl.play());
  }

  /* =========================================================
     SCROLL SCENES (built after fonts → correct line splits)
     ========================================================= */
  fontsReady.then(buildScenes);

  function buildScenes() {
    lineGroups = $$(".js-lines").map(el => ({ el, lines: splitLines(el) }));
    if (reduce) { ScrollTrigger.refresh(); return; }

    /* ---- HERO pin: wheel turns with scroll ---- */
    ScrollTrigger.create({
      trigger: ".hero", start: "top top", end: () => "+=" + innerHeight * 3.6,
      pin: true, scrub: true, anticipatePin: 1,
      onUpdate(self) {
        gl && gl.setProgress(self.progress);
        ringState.scroll = -self.progress * 160;
      }
    });
    ScrollTrigger.create({
      trigger: ".hero", start: "top top", end: () => "+=" + innerHeight * 4.6,
      onToggle(self) {
        heroOn = self.isActive;
        if (!heroOn) hideFollower();
        if (gl) heroOn ? gl.play() : gl.pause();
      }
    });
    gsap.to(".hud", {
      autoAlpha: 0, ease: "none",
      scrollTrigger: { trigger: ".intro", start: "top 95%", end: "top 70%", scrub: true }
    });

    /* ---- generic: chars rise ---- */
    charGroups.forEach(({ el, chars }) => {
      if (el.closest(".foot")) return; // footer has its own
      gsap.from(chars, {
        yPercent: 110, rotate: 6, duration: 1.3, ease: "expo.out", stagger: .035,
        scrollTrigger: { trigger: el, start: "top 88%" }
      });
    });
    /* ---- generic: lines rise ---- */
    lineGroups.forEach(({ el, lines }) => {
      if (el.classList.contains("expand__title")) return;
      gsap.from(lines, {
        yPercent: 110, duration: 1.2, ease: "expo.out", stagger: .09,
        scrollTrigger: { trigger: el, start: "top 88%" }
      });
    });
    /* ---- diamonds spin ---- */
    $$(".diamond").forEach(d => {
      gsap.fromTo(d, { rotation: 45, scale: 0 }, {
        rotation: 405, scale: 1, ease: "none",
        scrollTrigger: { trigger: d, start: "top 95%", end: "top 40%", scrub: 1 }
      });
    });

    /* ---- EXPAND image ---- */
    const exp = gsap.timeline({
      scrollTrigger: { trigger: ".expand", start: "top top", end: "+=130%", pin: true, scrub: 1, anticipatePin: 1 }
    });
    exp.to(".expand__frame", { "--t": "0%", "--s": "0vw", "--rr": "0px", ease: "power2.inOut", duration: 1 }, 0)
      .to(".expand__frame img", { scale: 1, ease: "power2.inOut", duration: 1 }, 0)
      .to(".expand__frame", { "--shade": .42, duration: .4 }, .55);
    const expLines = lineGroups.find(g => g.el.classList.contains("expand__title"));
    if (expLines) exp.from(expLines.lines, { yPercent: 110, stagger: .08, duration: .35, ease: "power3.out" }, .62);
    exp.to({}, { duration: .2 });

    /* ---- PROMISE: shapes fall in, text, fall out ---- */
    const shapes = $$(".pshape");
    const prom = gsap.timeline({
      scrollTrigger: { trigger: ".promise__stage", start: "top top", end: "+=170%", pin: true, scrub: 1, anticipatePin: 1 }
    });
    shapes.forEach((s, i) => {
      prom.fromTo(s,
        { y: () => -(s.offsetTop + s.offsetHeight + innerHeight * .2), rotation: gsap.utils.random(-160, 160) },
        { y: 0, rotation: 0, ease: "power2.out", duration: .5 }, i * .045);
    });
    prom.from(".promise__text", { scale: .6, autoAlpha: 0, duration: .25, ease: "back.out(2)" }, .35);
    shapes.forEach((s, i) => {
      prom.to(s, {
        y: () => innerHeight - s.offsetTop + 60, rotation: gsap.utils.random(-120, 120),
        ease: "power2.in", duration: .4
      }, .78 + i * .03);
    });
    prom.to(".promise__text", { autoAlpha: 0, scale: 1.2, duration: .2 }, 1.05);

    /* ---- CUCINA trio ---- */
    gsap.fromTo(".trio__item--c", { scale: .82 }, {
      scale: 1, ease: "none",
      scrollTrigger: { trigger: ".trio", start: "top bottom", end: "center center", scrub: true }
    });
    gsap.fromTo(".trio__item--l", { xPercent: -40, rotation: -6 }, {
      xPercent: 0, rotation: 0, ease: "none",
      scrollTrigger: { trigger: ".trio", start: "top bottom", end: "center center", scrub: true }
    });
    gsap.fromTo(".trio__item--r", { xPercent: 40, rotation: 6 }, {
      xPercent: 0, rotation: 0, ease: "none",
      scrollTrigger: { trigger: ".trio", start: "top bottom", end: "center center", scrub: true }
    });
    gsap.from(".tabs", { y: 40, autoAlpha: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".tabs", start: "top 95%" } });

    /* table rows draw */
    const rows = $$(".table__row");
    gsap.set(rows, { "--line": 0 });
    gsap.to(rows, { "--line": 1, duration: 1.2, stagger: .1, ease: "expo.inOut", scrollTrigger: { trigger: ".table", start: "top 85%" } });
    gsap.from($$(".table__row > span"), { y: 30, autoAlpha: 0, duration: 1, stagger: .05, ease: "expo.out", scrollTrigger: { trigger: ".table", start: "top 85%" } });

    /* ---- CHEF ---- */
    gsap.fromTo(".chef__word", { xPercent: 0 }, {
      xPercent: -45, ease: "none",
      scrollTrigger: { trigger: ".chef", start: "top bottom", end: "bottom top", scrub: true }
    });
    gsap.fromTo(".chef__photo", { rotation: -9, y: 80 }, {
      rotation: 5, y: -40, ease: "none",
      scrollTrigger: { trigger: ".chef", start: "top bottom", end: "bottom top", scrub: true }
    });
    gsap.fromTo(".chef__photo img", { yPercent: -10 }, {
      yPercent: 0, ease: "none",
      scrollTrigger: { trigger: ".chef", start: "top bottom", end: "bottom top", scrub: true }
    });
    $$(".chef__shape").forEach((s, i) => {
      gsap.fromTo(s, { y: 160 * (i + 1), rotation: -60 * (i % 2 ? -1 : 1), scale: .4 }, {
        y: -120 * (i + 1), rotation: 60 * (i % 2 ? -1 : 1), scale: 1, ease: "none",
        scrollTrigger: { trigger: ".chef", start: "top bottom", end: "bottom top", scrub: 1.2 }
      });
    });

    /* ---- ROOMS stacking ---- */
    const cards = $$(".rcard");
    cards.forEach((c, i) => {
      gsap.fromTo($(".rcard__img img", c), { scale: 1.3 }, {
        scale: 1, ease: "none",
        scrollTrigger: { trigger: c, start: "top bottom", end: "top 14%", scrub: true }
      });
      gsap.from($$(".rcard__n, h3, .rcard__cols", c), {
        y: 50, autoAlpha: 0, duration: 1, stagger: .08, ease: "expo.out",
        scrollTrigger: { trigger: c, start: "top 70%" }
      });
      const next = cards[i + 1];
      if (!next) return;
      gsap.to(c, {
        scale: .9, rotation: i % 2 ? 3 : -3, yPercent: -4, ease: "none",
        scrollTrigger: { trigger: next, start: "top bottom", end: "top 14%", scrub: true }
      });
    });
    gsap.from(".rooms__side", { y: 30, autoAlpha: 0, duration: 1, stagger: .15, scrollTrigger: { trigger: ".rooms__head", start: "top 80%" } });
    gsap.from(".rooms__price", { scale: .8, autoAlpha: 0, duration: 1.2, ease: "back.out(1.7)", scrollTrigger: { trigger: ".rooms__price", start: "top 92%" } });

    /* ---- WEDDINGS drag slider ---- */
    dragSlider();

    /* stats */
    $$(".stat b").forEach(b => {
      const end = parseFloat(b.dataset.count), dec = +b.dataset.dec || 0;
      const pre = b.dataset.prefix || "", suf = b.dataset.suffix || "";
      const o = { v: 0 };
      gsap.to(o, {
        v: end, duration: 2.2, ease: "power2.out",
        onUpdate: () => (b.textContent = pre + o.v.toFixed(dec).replace(".", ",") + suf),
        scrollTrigger: { trigger: b, start: "top 90%" }
      });
    });
    gsap.from(".stat", { y: 60, autoAlpha: 0, duration: 1.2, stagger: .1, ease: "expo.out", scrollTrigger: { trigger: ".stats", start: "top 88%" } });

    /* ---- LAND row ---- */
    const landTl = gsap.timeline({ scrollTrigger: { trigger: ".land__row", start: "top bottom", end: "center 45%", scrub: true } });
    landTl.fromTo(".land__img--c", { scale: .7 }, { scale: 1, ease: "none" }, 0)
      .fromTo(".land__img--c img", { scale: 1.4 }, { scale: 1, ease: "none" }, 0)
      .fromTo(".land__img--l", { xPercent: -80, yPercent: 30, rotation: -10 }, { xPercent: 0, yPercent: 0, rotation: 0, ease: "none" }, 0)
      .fromTo(".land__img--r", { xPercent: 80, yPercent: -30, rotation: 10 }, { xPercent: 0, yPercent: 0, rotation: 0, ease: "none" }, 0);
    gsap.from(".chips li", { y: 30, autoAlpha: 0, scale: .8, duration: .9, stagger: .06, ease: "back.out(2)", scrollTrigger: { trigger: ".chips", start: "top 92%" } });

    /* ---- GALLERY marquees ---- */
    $$(".mrow").forEach(row => {
      const track = $(".mrow__track", row);
      track.innerHTML += track.innerHTML; // duplicate for seamless loop
      const dir = +row.dataset.dir || 1;
      const loop = gsap.fromTo(track, { xPercent: dir > 0 ? -50 : 0 }, { xPercent: dir > 0 ? 0 : -50, duration: 40, ease: "none", repeat: -1 });
      ScrollTrigger.create({
        trigger: row, start: "top bottom", end: "bottom top",
        onUpdate(self) {
          const v = self.getVelocity();
          gsap.to(loop, { timeScale: (self.direction) * (1 + Math.min(Math.abs(v) / 180, 8)), duration: .2, overwrite: true });
          gsap.to(loop, { timeScale: self.direction, duration: 1.4, delay: .2 });
        }
      });
      $$("figure", row).forEach(f => {
        f.addEventListener("click", () => openLb($("img", f)));
        if (fine) {
          f.addEventListener("pointerenter", () => showFollower("Guarda"));
          f.addEventListener("pointerleave", hideFollower);
        }
      });
    });
    gsap.fromTo(".mrow:nth-of-type(1)", { rotation: -2 }, { rotation: 1, ease: "none", scrollTrigger: { trigger: ".gallery", start: "top bottom", end: "bottom top", scrub: true } });
    gsap.fromTo(".mrow:nth-of-type(2)", { rotation: 2 }, { rotation: -1, ease: "none", scrollTrigger: { trigger: ".gallery", start: "top bottom", end: "bottom top", scrub: true } });

    /* ---- REVIEWS ---- */
    reviews();

    /* ---- FOOTER ---- */
    gsap.from(".foot__inner", {
      yPercent: -35, ease: "none",
      scrollTrigger: { trigger: ".foot", start: "top bottom", end: "top top", scrub: true }
    });
    const footChars = charGroups.filter(g => g.el.closest(".foot")).flatMap(g => g.chars);
    gsap.from(footChars, {
      yPercent: 110, rotate: 8, duration: 1.4, stagger: .05, ease: "expo.out",
      scrollTrigger: { trigger: ".foot__brand", start: "top 85%" }
    });
    gsap.from(".foot__cols > *", { y: 40, autoAlpha: 0, duration: 1, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: ".foot__cols", start: "top 95%" } });

    ScrollTrigger.refresh();
  }

  /* =========================================================
     CUCINA TABS
     ========================================================= */
  const sets = [
    ["assets/img/nuove/img-7616.jpg", "assets/img/site/b5302.jpg", "assets/img/nuove/t30-1946176-2.jpg"],
    ["assets/img/nuove/img-7609-1.jpg", "assets/img/nuove/13175261.jpg", "assets/img/site/508g.jpg"],
    ["assets/img/nuove/img-7843.jpg", "assets/img/nuove/img-7842.jpg", "assets/img/nuove/t30-1946176-1.jpg"]
  ];
  sets.flat().forEach(src => { const i = new Image(); i.src = src; });
  const trioItems = [$(".trio__item--l"), $(".trio__item--c"), $(".trio__item--r")];
  let curSet = 0, busy = false;
  $$(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      const n = +tab.dataset.set;
      if (n === curSet || busy) return;
      busy = true;
      $$(".tab").forEach(t => t.classList.toggle("is-active", t === tab));
      const dir = n > curSet ? 1 : -1;
      curSet = n;
      trioItems.forEach((fig, k) => {
        const old = $("img", fig);
        const nu = new Image();
        nu.src = sets[n][k]; nu.alt = old.alt;
        Object.assign(nu.style, { position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover" });
        fig.style.position = "relative";
        fig.appendChild(nu);
        gsap.timeline({ delay: k * .08, onComplete: () => { old.remove(); nu.style.position = ""; if (k === 2) busy = false; } })
          .fromTo(nu, { xPercent: 100 * dir, scale: 1.3 }, { xPercent: 0, scale: 1, duration: 1.1, ease: "expo.inOut" }, 0)
          .to(old, { xPercent: -40 * dir, scale: .9, duration: 1.1, ease: "expo.inOut" }, 0);
      });
    });
  });

  /* =========================================================
     DRAG SLIDER (weddings)
     ========================================================= */
  function dragSlider() {
    const wrap = $(".drag"), track = $(".drag__track");
    if (!wrap || !track) return;
    const imgs = $$("img", track);
    let target = 0, current = 0, base = 0, down = false, startX = 0, startT = 0, moved = 0;
    const max = () => Math.max(0, track.scrollWidth - innerWidth);
    const clamp = v => Math.min(0, Math.max(-max(), v));

    wrap.addEventListener("pointerdown", e => {
      down = true; moved = 0; startX = e.clientX; startT = target;
      wrap.setPointerCapture(e.pointerId);
      gsap.to(imgs, { scale: .94, duration: .5, ease: "expo.out" });
    });
    wrap.addEventListener("pointermove", e => {
      if (!down) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      target = clamp(startT + dx * 1.6);
    });
    const up = e => {
      if (!down) return;
      down = false;
      gsap.to(imgs, { scale: 1, duration: .8, ease: "expo.out" });
      if (moved < 6) {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const fig = el && el.closest(".dcard");
        if (fig) openLb($("img", fig));
      }
    };
    wrap.addEventListener("pointerup", up);
    wrap.addEventListener("pointercancel", up);

    // the page scroll also pushes the slider
    ScrollTrigger.create({
      trigger: wrap, start: "top bottom", end: "bottom top",
      onUpdate(self) {
        const nb = -self.progress * max() * .45;
        target = clamp(target + (nb - base));
        base = nb;
      }
    });

    gsap.ticker.add(() => {
      const prev = current;
      current += (target - current) * .09;
      const v = current - prev;
      gsap.set(track, { x: current, skewX: gsap.utils.clamp(-8, 8, -v * .25) });
    });
  }

  /* =========================================================
     REVIEWS
     ========================================================= */
  function reviews() {
    const items = $$(".review"), dots = $$(".reviews__dots button");
    let i = 0, timer;
    const show = n => {
      const prev = items[i];
      i = (n + items.length) % items.length;
      const next = items[i];
      dots.forEach((d, k) => d.classList.toggle("is-on", k === i));
      if (prev !== next) {
        gsap.to(prev, { autoAlpha: 0, y: -30, duration: .5, ease: "power3.in", onComplete: () => prev.classList.remove("is-on") });
        next.classList.add("is-on");
        gsap.fromTo(next, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 1, delay: .35, ease: "expo.out" });
      }
      clearTimeout(timer);
      timer = setTimeout(() => show(i + 1), 6000);
    };
    dots.forEach((d, k) => d.addEventListener("click", () => show(k)));
    ScrollTrigger.create({ trigger: ".reviews", start: "top 75%", once: true, onEnter: () => show(0) });
  }

  /* =========================================================
     RESIZE
     ========================================================= */
  let rT;
  addEventListener("resize", () => { clearTimeout(rT); rT = setTimeout(() => ScrollTrigger.refresh(), 250); });
  addEventListener("load", () => ScrollTrigger.refresh());
})();

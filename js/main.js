/* =========================================================
   IL MELO ROSSO — v3 · "Scegli il tuo momento"
   GSAP + ScrollTrigger + Lenis + Matter.js
   ========================================================= */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const mobile = () => innerWidth < 860;
  $$(".js-year").forEach(e => (e.textContent = new Date().getFullYear()));

  if (!window.gsap) { document.body.classList.remove("is-loading"); $(".loader")?.remove(); return; }
  gsap.registerPlugin(ScrollTrigger);
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  scrollTo(0, 0);

  /* =========================================================
     DATA
     ========================================================= */
  const DEFAULT = { bg: "#E5372B", ink: "#3A0A0C", hill: "#C4261C", title: "#3A0A0C" };
  const P = {
    cucina:    { label: "La|cucina",  img: "assets/img/stk/13175261.jpg",   bg: "#F58A1F", ink: "#5A2400", hill: "#D9700D", title: "#FFD23F", ring: "cucina di casa ✦ dall'orto alla tavola ✦ " },
    camere:    { label: "Le|camere",  img: "assets/img/stk/casetta-1.jpg",  bg: "#8E80F0", ink: "#1E1660", hill: "#7262DD", title: "#D7D1FF", ring: "sei camere ✦ casa di famiglia ✦ b&b ✦ " },
    matrimoni: { label: "Matrimoni",  img: "assets/img/stk/13660935-2.jpg", bg: "#F59DB0", ink: "#6E1330", hill: "#E3829A", title: "#FFE3EA", ring: "un solo matrimonio al giorno ✦ il vostro ✦ " },
    piscina:   { label: "Piscina",    img: "assets/img/stk/img-7606.jpg",   bg: "#5BC6EE", ink: "#073C55", hill: "#3AAEDB", title: "#DDF5FF", ring: "piscina panoramica ✦ tra i boschi ✦ " },
    colazione: { label: "Colazione",  img: "assets/img/stk/img-7842.jpg",   bg: "#F5CF33", ink: "#5A3D00", hill: "#DDB41A", title: "#FFF5C2", ring: "colazione in giardino ✦ fatta in casa ✦ " },
    fortunago: { label: "Fortunago",  img: "assets/img/stk/img-7607-1.jpg", bg: "#8CCB3A", ink: "#173D08", hill: "#6FB021", title: "#E8FFC2", ring: "uno dei borghi più belli d'italia ✦ " }
  };
  const ROOMS = [
    { pre: "La", big: "Casetta", img: "assets/img/stk/casetta-1.jpg", cards: ["assets/img/camere/casetta-2.jpg", "assets/img/nuove/img-7608.jpg"], bg: "#F58A1F", ink: "#5A2400", soft: "#FFD23F",
      tags: ["Fino a 4 ospiti", "Indipendente", "Vista colline"], desc: "Depandance superior con ingresso sul giardino, soggiorno e divano letto. Per famiglie o due coppie." },
    { pre: "Camera della", big: "Luna", img: "assets/img/stk/luna-1.jpg", cards: ["assets/img/camere/luna-2.jpg", "assets/img/nuove/img-7843.jpg"], bg: "#8E80F0", ink: "#1E1660", soft: "#C9C2FF",
      tags: ["Fino a 5 ospiti", "Soppalco", "Bagno privato"], desc: "Antico letto alla francese, soppalco e un cielo stellato mozzafiato nelle notti di luna piena." },
    { pre: "Camera del", big: "Nonno", img: "assets/img/stk/nonno-1.jpg", cards: ["assets/img/camere/nonno-2.jpg", "assets/img/nuove/img-7838.jpg"], bg: "#F5CF33", ink: "#5A3D00", soft: "#FFF1A6",
      tags: ["2 ospiti", "Matrimoniale", "Vista giardino"], desc: "Luminosa e spaziosa, al primo piano, con vista sul giardino interno e sulle colline." },
    { pre: "Camera dello", big: "Zio", img: "assets/img/stk/zio-2.jpg", cards: ["assets/img/camere/zio-1.jpg", "assets/img/nuove/t30-2973555-1.jpg"], bg: "#5BC6EE", ink: "#073C55", soft: "#C8EEFF",
      tags: ["2 ospiti", "Matrimoniale", "Vista bosco"], desc: "Accogliente e tranquilla, con le finestre affacciate sul bosco adiacente." },
    { pre: "Depandance", big: "Viola", img: "assets/img/stk/viola-1.jpg", cards: ["assets/img/camere/viola-2.jpg", "assets/img/nuove/img-7608.jpg"], bg: "#B07BE0", ink: "#3A1060", soft: "#E7CCFF",
      tags: ["2 – 3 ospiti", "Indipendente", "Vista bosco"], desc: "Accesso diretto e indipendente, affacciata sul bosco confinante. Per una coppia, più un letto aggiunto." },
    { pre: "Paolo & Veronica", big: "Famiglia", img: "assets/img/stk/pv-1.jpg", cards: ["assets/img/camere/pv-2.jpg", "assets/img/nuove/img-7843.jpg"], bg: "#F59DB0", ink: "#6E1330", soft: "#FFE0E8",
      tags: ["Fino a 4 ospiti", "2 camere", "Bagno esclusivo"], desc: "Due matrimoniali attigue con bagno ad uso esclusivo: per una famiglia o due coppie di amici." }
  ];
  const SOCIAL = [
    { href: "https://www.instagram.com/ilmelorosso", label: "Instagram", icon: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6"/>' },
    { href: "https://www.facebook.com/ilmelorosso", label: "Facebook", icon: '<path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H6.5v3.5H9V21h3.5v-7.5h2.7l.5-3.5h-3.2V7.2c0-.7.4-1 1-1H15z"/>' },
    { href: "https://wa.me/393351762614", label: "WhatsApp", icon: '<path d="M4 20l1.2-4A8 8 0 1 1 8 18.8z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.4-1.8-1-1 .8c-1-.5-1.8-1.3-2.3-2.3l.8-1-1-1.8z"/>' },
    { href: "tel:+393351762614", label: "Telefono", icon: '<path d="M5 3h3.5l1.5 4.5-2.2 1.4a11 11 0 0 0 5.3 5.3l1.4-2.2L19 13.5V17a2 2 0 0 1-2 2A15 15 0 0 1 3 5a2 2 0 0 1 2-2z"/>' }
  ];

  /* =========================================================
     STICKER BUILDER
     ========================================================= */
  let uid = 0;
  const shade = (hex, amt) => {
    const n = parseInt(hex.slice(1), 16);
    const f = c => Math.max(0, Math.min(255, Math.round(c * (1 + amt))));
    return "#" + [n >> 16, (n >> 8) & 255, n & 255].map(f).map(v => v.toString(16).padStart(2, "0")).join("");
  };
  function sticker({ img, bg, ink, label, ring }) {
    const id = "s" + (++uid);
    const lines = label.split("|");
    const longest = Math.max(...lines.map(l => l.length));
    const fs = Math.min(17, 52 / (0.46 * longest));
    const txt = (ring || "il melo rosso ✦ fortunago ✦ oltrepò pavese ✦ ").toUpperCase();
    const el = document.createElement("div");
    el.className = "stk";
    el.innerHTML = `
      <svg viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <path id="${id}p" d="M100,100 m-81,0 a81,81 0 1,1 162,0 a81,81 0 1,1 -162,0"/>
          <clipPath id="${id}c"><circle cx="100" cy="100" r="64"/></clipPath>
        </defs>
        <circle cx="100" cy="100" r="99" fill="${shade(bg, -0.28)}"/>
        <circle cx="100" cy="100" r="94" fill="${bg}"/>
        <text class="stk__arc" fill="${ink}"><textPath href="#${id}p" textLength="505" lengthAdjust="spacing">${txt}${txt.length < 40 ? txt : ""}</textPath></text>
        <circle cx="100" cy="100" r="67" fill="#FFF4E2"/>
        <image href="${img}" x="36" y="36" width="128" height="128" clip-path="url(#${id}c)" preserveAspectRatio="xMidYMid slice"/>
        <circle cx="100" cy="100" r="64" fill="none" stroke="rgba(0,0,0,.12)" stroke-width="2"/>
      </svg>
      <span class="stk__label" style="font-size:${fs}cqw;color:${ink}">${lines.join("<br>")}</span>`;
    return el;
  }
  $$("[data-player]").forEach(host => {
    const p = P[host.dataset.player];
    if (!p) return;
    host.appendChild(sticker(p));
    if (host.classList.contains("pick__item")) host.setAttribute("aria-label", p.label.replace("|", " "));
  });

  /* =========================================================
     THEME (whole page colour)
     ========================================================= */
  function theme(t, dur = .6) {
    gsap.to(root, { "--bg": t.bg, "--ink": t.ink, "--hill": t.hill, "--title": t.title, duration: dur, ease: "power2.out", overwrite: "auto" });
    const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = t.bg;
  }

  /* =========================================================
     SMOOTH SCROLL
     ========================================================= */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  const jump = y => { lenis ? lenis.scrollTo(y, { immediate: true, force: true }) : scrollTo(0, y); ScrollTrigger.update(); };

  /* =========================================================
     ARCS (loader + page transition)
     ========================================================= */
  const arcs = $$(".arcs span");
  function arcsSweep(onCovered) {
    const H = innerHeight;
    gsap.set(arcs, { y: 0 });
    const tl = gsap.timeline();
    tl.to(arcs, { y: -H * 2.95, duration: 1.7, ease: "power2.inOut", stagger: .09 });
    tl.call(() => onCovered && onCovered(), null, (arcs.length - 1) * .09 + 1.7 * .5);
    tl.set(arcs, { y: 0 });
    return tl;
  }

  function targetY(sel, panel) {
    const el = $(sel);
    if (!el) return 0;
    if (sel === "#momenti" && panel != null && hScroll) {
      const st = hScroll.scrollTrigger;
      const p = $$(".mpanel")[+panel];
      const max = $(".moments__track").scrollWidth - innerWidth;
      return st.start + Math.min(1, p.offsetLeft / max) * (st.end - st.start);
    }
    return el.getBoundingClientRect().top + scrollY;
  }
  function navigate(sel, panel) {
    closeMenu(true);
    if (reduce) { scrollTo(0, targetY(sel, panel)); return; }
    arcsSweep(() => jump(targetY(sel, panel)));
  }
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    if (id.length < 2 || !$(id)) return;
    e.preventDefault();
    navigate(id);
  });

  /* =========================================================
     TEXT: hop (hover) + hop-in (enter)
     ========================================================= */
  function splitChars(el) {
    const out = [];
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(w => {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(" ")); return; }
            const word = document.createElement("span");
            word.className = "hop-word";
            [...w].forEach(c => { const s = document.createElement("span"); s.className = "hc"; s.textContent = c; word.appendChild(s); out.push(s); });
            frag.appendChild(word);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== "IMG" && n.tagName !== "FIGURE" && n.tagName !== "BR") walk(n);
      });
    };
    walk(el);
    return out;
  }
  $$("[data-hop]").forEach(el => {
    const target = el.querySelector(":scope > span") || el;
    const chars = splitChars(target);
    if (!fine) return;
    el.addEventListener("mouseenter", () => {
      gsap.fromTo(chars, { yPercent: 0 }, { yPercent: -28, duration: .18, ease: "power2.out", stagger: .025, yoyo: true, repeat: 1, overwrite: true });
    });
  });
  const hopIns = $$(".js-hop-in").map(el => ({ el, chars: splitChars(el) }));

  /* =========================================================
     PULL-TAG MENU
     ========================================================= */
  const menu = $(".menu"), tag = $(".tag"), tagTxt = $(".tag__txt");
  let menuOpen = false;
  gsap.set(menu, { yPercent: -104, visibility: "visible" });
  const TAG_DROP = () => innerHeight - 118;
  function openMenu() {
    if (menuOpen) return;
    menuOpen = true;
    menu.setAttribute("aria-hidden", "false"); tag.setAttribute("aria-expanded", "true");
    lenis && lenis.stop();
    tagTxt.textContent = "Chiudi";
    gsap.to(menu, { yPercent: 0, duration: 1.3, ease: "elastic.out(1, .62)", overwrite: true });
    gsap.to(tag, { y: TAG_DROP(), duration: 1.3, ease: "elastic.out(1, .62)", overwrite: true });
    gsap.fromTo(".menu__list li", { y: -60, rotation: () => gsap.utils.random(-8, 8) }, { y: 0, rotation: 0, duration: 1.1, ease: "elastic.out(1, .5)", stagger: .05, delay: .15 });
  }
  function closeMenu(fast) {
    if (!menuOpen) return;
    menuOpen = false;
    menu.setAttribute("aria-hidden", "true"); tag.setAttribute("aria-expanded", "false");
    lenis && lenis.start();
    tagTxt.textContent = "Tirami";
    gsap.to(menu, { yPercent: -104, duration: fast ? .5 : .8, ease: "power3.inOut", overwrite: true });
    gsap.to(tag, { y: 0, duration: fast ? .5 : 1, ease: fast ? "power3.inOut" : "elastic.out(1, .5)", overwrite: true });
  }
  (function pullTag() {
    let down = false, sy = 0, dy = 0, base = 0;
    const H = TAG_DROP;
    tag.addEventListener("pointerdown", e => {
      down = true; sy = e.clientY; dy = 0; base = menuOpen ? H() : 0;
      tag.setPointerCapture(e.pointerId);
      gsap.killTweensOf([menu, tag]);
    });
    tag.addEventListener("pointermove", e => {
      if (!down) return;
      dy = e.clientY - sy;
      const y = Math.max(0, Math.min(H(), base + dy));
      gsap.set(tag, { y });
      gsap.set(menu, { yPercent: -104 + (y / H()) * 104 });
    });
    const up = () => {
      if (!down) return;
      down = false;
      if (Math.abs(dy) < 6) { menuOpen ? closeMenu() : openMenu(); return; }
      const wantOpen = menuOpen ? dy > -90 : dy > 90;
      if (wantOpen) { menuOpen = false; openMenu(); } else { menuOpen = true; closeMenu(); }
    };
    tag.addEventListener("pointerup", up);
    tag.addEventListener("pointercancel", up);
    if (fine) tag.addEventListener("mouseenter", () => { if (!menuOpen) gsap.fromTo(tag, { rotation: 0 }, { rotation: 0, keyframes: [{ rotation: 9 }, { rotation: -7 }, { rotation: 4 }, { rotation: 0 }], duration: 1, ease: "power1.inOut" }); });
    // idle swing hint
    gsap.to(tag, { rotation: 3, duration: 1.6, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 4 });
  })();
  addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });

  /* =========================================================
     HERO · PICK YOUR MOMENT
     ========================================================= */
  const items = $$(".pick__item");
  const note = $(".pick__note");
  let current = null;
  function activate(it) {
    if (current === it) return;
    items.forEach(i => i.classList.toggle("is-on", i === it));
    current = it;
    if (!it) { theme(DEFAULT); gsap.to(note, { opacity: 0, duration: .25 }); return; }
    theme(P[it.dataset.player]);
    const r = it.getBoundingClientRect(), h = $(".pick").getBoundingClientRect();
    gsap.to(note, { x: r.left - h.left + r.width * .62, y: r.top - h.top - r.width * .12, opacity: 1, rotation: -6, duration: .45, ease: "back.out(2)" });
  }
  items.forEach(it => {
    it.addEventListener("mouseenter", () => activate(it));
    it.addEventListener("focus", () => activate(it));
    it.addEventListener("click", () => navigate(it.dataset.go, it.dataset.panel));
  });
  $(".pick__row").addEventListener("mouseleave", () => activate(null));

  /* =========================================================
     LOADER
     ========================================================= */
  const heroChars = hopIns.filter(h => h.el.closest(".pick")).flatMap(h => h.chars);
  gsap.set(heroChars, { yPercent: -160, rotation: () => gsap.utils.random(-40, 40), opacity: 0 });
  gsap.set(".pick__item", { yPercent: 160, rotation: -300 });
  gsap.set(".pick__hill", { yPercent: 40 });
  gsap.set(".hdr__claim, .hdr__logo, .tag", { opacity: 0 });

  function intro() {
    const tl = gsap.timeline();
    tl.to(".pick__hill", { yPercent: 0, duration: 1.2, ease: "expo.out" }, 0)
      .to(heroChars, { yPercent: 0, rotation: 0, opacity: 1, duration: 1, ease: "back.out(2.2)", stagger: { each: .035, from: "random" } }, .05)
      .to(".pick__item", { yPercent: 0, rotation: 0, duration: 1.3, ease: "back.out(1.4)", stagger: .08 }, .25)
      .to(".hdr__claim, .hdr__logo", { opacity: 1, duration: .6 }, .6)
      .fromTo(".tag", { y: -110, opacity: 1 }, { y: 0, duration: 1.4, ease: "elastic.out(1, .45)" }, .8);
    return tl;
  }
  function start() {
    if (reduce) {
      $(".loader").remove(); gsap.set([heroChars, ".pick__item", ".pick__hill", ".hdr__claim, .hdr__logo, .tag"], { clearProps: "all" });
      document.body.classList.remove("is-loading"); return;
    }
    gsap.timeline()
      .to(".loader__logo", { scale: 1, duration: .9, ease: "elastic.out(1, .45)" })
      .to(".loader__logo", { rotation: 360, duration: .9, ease: "back.inOut(1.6)" }, "+=.15")
      .to(".loader__logo", { scale: 0, duration: .35, ease: "back.in(2)" })
      .add(() => {
        arcsSweep(() => {
          $(".loader").remove();
          document.body.classList.remove("is-loading");
          lenis && lenis.start();
          ScrollTrigger.refresh();
          intro();
        });
      }, "-=.1");
  }
  const fontsReady = document.fonts ? document.fonts.ready.catch(() => {}) : Promise.resolve();
  Promise.race([fontsReady, new Promise(r => setTimeout(r, 2500))]).then(() => { buildScenes(); start(); });

  /* =========================================================
     ROOMS SLIDER
     ========================================================= */
  const rStage = $(".rooms__stage");
  const rPre = $(".rooms__pre"), rBig = $(".rooms__big");
  const rStk = $(".rooms__stk");
  const rCardA = $(".rooms__card--a img"), rCardB = $(".rooms__card--b img");
  const rTags = $(".rooms__tags"), rDesc = $(".rooms__desc"), rIdx = $(".rooms__idx b");
  let rI = 0, rBusy = false;
  const letters = (el, text) => {
    el.innerHTML = `<span class="rooms__mask">${[...text].map(c => `<span class="wl">${c === " " ? "&nbsp;" : c}</span>`).join("")}</span>`;
    return $$(".wl", el);
  };
  function roomSticker(r) {
    return sticker({ img: r.img, bg: r.bg, ink: r.ink, label: r.big, ring: "le camere del melo rosso ✦ b&b ✦ " });
  }
  letters(rPre, ROOMS[0].pre); letters(rBig, ROOMS[0].big);
  rStk.appendChild(roomSticker(ROOMS[0]));

  function goRoom(n, dir) {
    if (rBusy) return;
    rBusy = true;
    const r = ROOMS[(n + ROOMS.length) % ROOMS.length];
    rI = (n + ROOMS.length) % ROOMS.length;
    const old = $(".stk", rStk);
    const tl = gsap.timeline({ onComplete: () => (rBusy = false) });
    tl.to(root, { "--room": r.bg, "--room-ink": r.ink, "--room-soft": r.soft, duration: .8, ease: "power2.inOut" }, 0)
      .to($$(".wl", rStage), { yPercent: -110 * dir, duration: .4, ease: "power3.in", stagger: .02 }, 0)
      .add(() => {
        const a = letters(rPre, r.pre), b = letters(rBig, r.big);
        gsap.fromTo([...a, ...b], { yPercent: 110 * dir }, { yPercent: 0, duration: .7, ease: "back.out(1.6)", stagger: .03 });
      }, .45)
      .to(old, { x: -260 * dir, rotation: -200 * dir, scale: .6, opacity: 0, duration: .55, ease: "power3.in", onComplete: () => old.remove() }, 0)
      .add(() => {
        const s = roomSticker(r);
        rStk.appendChild(s);
        gsap.fromTo(s, { x: 300 * dir, rotation: 260 * dir, scale: .6, opacity: 0 }, { x: 0, rotation: 0, scale: 1, opacity: 1, duration: 1, ease: "back.out(1.3)" });
      }, .35)
      .to([".rooms__card--a", ".rooms__card--b"], { y: -40, scale: .7, opacity: 0, duration: .35, ease: "power2.in", stagger: .05 }, 0)
      .add(() => { rCardA.src = r.cards[0]; rCardB.src = r.cards[1]; }, .4)
      .to(".rooms__card--a", { y: 0, scale: 1, opacity: 1, rotation: gsap.utils.random(-12, -5), duration: .8, ease: "back.out(2)" }, .55)
      .to(".rooms__card--b", { y: 0, scale: 1, opacity: 1, rotation: gsap.utils.random(5, 12), duration: .8, ease: "back.out(2)" }, .62)
      .to(".rooms__info", { opacity: 0, x: -20, duration: .25 }, 0)
      .add(() => {
        rTags.innerHTML = r.tags.map(t => `<li>${t}</li>`).join("");
        rDesc.textContent = r.desc;
        rIdx.textContent = String(rI + 1).padStart(2, "0");
      }, .3)
      .to(".rooms__info", { opacity: 1, x: 0, duration: .5 }, .5)
      .fromTo(".roundbtn", { scale: 1 }, { scale: 1.15, duration: .2, yoyo: true, repeat: 1 }, .4);
  }
  $$(".rooms .arrow").forEach(b => b.addEventListener("click", () => goRoom(rI + +b.dataset.dir, +b.dataset.dir)));
  (function swipe() {
    let sx = null;
    rStage.addEventListener("pointerdown", e => { if (!e.target.closest("a,button")) sx = e.clientX; });
    rStage.addEventListener("pointerup", e => {
      if (sx == null) return;
      const d = e.clientX - sx; sx = null;
      if (Math.abs(d) > 50) goRoom(rI + (d < 0 ? 1 : -1), d < 0 ? 1 : -1);
    });
  })();

  /* =========================================================
     FOOTER PHYSICS
     ========================================================= */
  function footerPhysics() {
    if (!window.Matter) return;
    const { Engine, Bodies, Body, Composite } = Matter;
    const world = $(".foot__world"), wrap = $(".foot__bodies");
    const engine = Engine.create({ gravity: { y: 1.1 } });
    let walls = [], bodies = [], running = false, built = false;

    const defs = [
      ...Object.values(P).map(p => ({ type: "stk", p })),
      ...SOCIAL.map(s => ({ type: "soc", s }))
    ];
    function sizeFor(d) {
      const base = Math.min(Math.max(innerWidth * .13, 104), 210);
      return d.type === "stk" ? base : base * .78;
    }
    function buildWalls() {
      Composite.remove(engine.world, walls);
      const w = world.clientWidth, h = world.clientHeight, t = 200;
      const floor = h - (mobile() ? 64 : 44);
      walls = [
        Bodies.rectangle(w / 2, floor + t / 2, w * 3, t, { isStatic: true }),
        Bodies.rectangle(-t / 2, h / 2, t, h * 4, { isStatic: true }),
        Bodies.rectangle(w + t / 2, h / 2, t, h * 4, { isStatic: true })
      ];
      Composite.add(engine.world, walls);
    }
    function build() {
      if (built) return; built = true;
      buildWalls();
      const w = world.clientWidth;
      defs.forEach((d, i) => {
        const size = sizeFor(d);
        const el = document.createElement(d.type === "soc" ? "a" : "div");
        el.className = "fbody";
        el.style.width = el.style.height = size + "px";
        if (d.type === "stk") el.appendChild(sticker(d.p));
        else {
          el.href = d.s.href; el.target = d.s.href.startsWith("http") ? "_blank" : ""; el.rel = "noopener";
          el.setAttribute("aria-label", d.s.label);
          el.innerHTML = `<span class="soc"><svg viewBox="0 0 24 24">${d.s.icon}</svg></span>`;
        }
        wrap.appendChild(el);
        const b = Bodies.circle(gsap.utils.random(size, w - size), -gsap.utils.random(100, 900) - i * 90, size / 2, { restitution: .45, friction: .08, frictionAir: .012, density: .002 });
        Body.setAngularVelocity(b, gsap.utils.random(-.15, .15));
        b.el = el; b.size = size;
        bodies.push(b);
        Composite.add(engine.world, b);
        drag(el, b, d.type === "soc");
      });
    }
    function drag(el, b, isLink) {
      let down = false, lx = 0, ly = 0, vx = 0, vy = 0, moved = 0;
      const rect = () => world.getBoundingClientRect();
      el.addEventListener("pointerdown", e => {
        down = true; moved = 0; lx = e.clientX; ly = e.clientY;
        el.setPointerCapture(e.pointerId);
        Body.setStatic(b, false);
        e.preventDefault();
      });
      el.addEventListener("pointermove", e => {
        if (!down) return;
        const r = rect();
        vx = e.clientX - lx; vy = e.clientY - ly; lx = e.clientX; ly = e.clientY;
        moved += Math.abs(vx) + Math.abs(vy);
        Body.setPosition(b, { x: e.clientX - r.left, y: e.clientY - r.top });
        Body.setVelocity(b, { x: vx, y: vy });
      });
      const up = () => {
        if (!down) return; down = false;
        Body.setVelocity(b, { x: vx * .9, y: vy * .9 });
        if (moved < 6) {
          if (isLink) { window.open(el.href, el.target || "_self"); }
          else Body.setVelocity(b, { x: gsap.utils.random(-6, 6), y: -16 });
        }
      };
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
      if (isLink) el.addEventListener("click", e => e.preventDefault());
    }
    let last = 0, acc = 0;
    const FIXED = 1000 / 60;
    function step(time) {
      if (!running) return;
      acc += Math.min(64, time - (last || time)); last = time;
      while (acc >= FIXED) { Engine.update(engine, FIXED); acc -= FIXED; }
      bodies.forEach(b => {
        b.el.style.transform = `translate(${b.position.x - b.size / 2}px, ${b.position.y - b.size / 2}px) rotate(${b.angle}rad)`;
      });
      requestAnimationFrame(step);
    }
    ScrollTrigger.create({
      trigger: ".foot", start: "top 55%", end: "bottom top",
      onToggle(self) {
        if (self.isActive) { build(); if (!running) { running = true; last = 0; requestAnimationFrame(step); } }
        else running = false;
      }
    });
    addEventListener("resize", () => { if (built) buildWalls(); });
  }

  /* =========================================================
     SCROLL SCENES
     ========================================================= */
  let hScroll = null;
  function buildScenes() {
    // header shrink
    ScrollTrigger.create({ start: 0, end: "max", onUpdate: s => document.body.classList.toggle("scrolled", s.scroll() > 80) });

    if (reduce) { footerPhysics(); return; }

    /* hero parallax out */
    gsap.timeline({ scrollTrigger: { trigger: ".pick", start: "top top", end: "bottom top", scrub: true } })
      .to(".pick__title", { yPercent: -60, ease: "none" }, 0)
      .to(".pick__row", { yPercent: -35, ease: "none" }, 0)
      .to(".pick__item", { rotation: (i) => (i % 2 ? 25 : -25), ease: "none" }, 0);
    // reset colour when leaving hero
    ScrollTrigger.create({ trigger: ".pick", start: "bottom 70%", onEnter: () => activate(null) });

    /* generic hop-in titles */
    hopIns.filter(h => !h.el.closest(".pick")).forEach(({ el, chars }) => {
      gsap.from(chars, {
        yPercent: -120, rotation: () => gsap.utils.random(-30, 30), opacity: 0,
        duration: .9, ease: "back.out(2)", stagger: { each: .02, from: "random" },
        scrollTrigger: { trigger: el, start: "top 85%" }
      });
    });

    /* STORY */
    gsap.from(".story__big span", { yPercent: 40, scale: .7, ease: "none", stagger: .1, scrollTrigger: { trigger: ".story", start: "top bottom", end: "top 30%", scrub: true } });
    gsap.fromTo(".story__drop", { y: 0, rotation: -20 }, {
      y: () => innerHeight * 1.1, rotation: 340, ease: "none",
      scrollTrigger: { trigger: ".story", start: "top 70%", end: "top -60%", scrub: 1 }
    });
    $$(".story__board [data-speed]").forEach(el => {
      const sp = parseFloat(el.dataset.speed);
      gsap.fromTo(el, { y: 220 * sp }, {
        y: -220 * sp, rotation: `+=${(sp - 1) * 14}`, ease: "none",
        scrollTrigger: { trigger: ".story__board", start: "top bottom", end: "bottom top", scrub: true }
      });
    });
    const inkChars = splitChars($(".js-ink"));
    inkChars.forEach(c => c.classList.add("ic"));
    gsap.to(inkChars, { opacity: 1, stagger: .02, ease: "none", scrollTrigger: { trigger: ".kraft", start: "top 75%", end: "bottom 35%", scrub: true } });
    const todo = $$(".note li");
    ScrollTrigger.create({
      trigger: ".note", start: "top 60%", end: "+=600",
      onUpdate: s => todo.forEach((li, i) => li.classList.toggle("done", s.progress > (i + .5) / todo.length))
    });
    $$(".polaroid, .gift, .note").forEach(el => {
      if (!fine) return;
      el.addEventListener("mouseenter", () => gsap.to(el, { scale: 1.06, rotation: `+=${gsap.utils.random(-6, 6)}`, duration: .5, ease: "back.out(3)" }));
      el.addEventListener("mouseleave", () => gsap.to(el, { scale: 1, duration: .6, ease: "elastic.out(1, .5)" }));
    });

    /* WAVE: text rides the curve, direction follows scroll */
    (function wave() {
      const tp = $(".wave textPath");
      const txt = $(".wave__txt");
      const unit = txt.getComputedTextLength() / 4;
      let off = 0, dir = -1, boost = 0;
      ScrollTrigger.create({
        trigger: ".wave", start: "top bottom", end: "bottom top",
        onUpdate(self) { dir = self.direction > 0 ? -1 : 1; boost = Math.min(Math.abs(self.getVelocity()) / 90, 14); }
      });
      gsap.ticker.add(() => {
        off += dir * (1.2 + boost);
        boost *= .92;
        if (off < -unit) off += unit;
        if (off > 0) off -= unit;
        tp.setAttribute("startOffset", off);
      });
      gsap.fromTo(".wave__stk", { rotation: -90, scale: .5 }, { rotation: 200, scale: 1, ease: "none", scrollTrigger: { trigger: ".wave", start: "top bottom", end: "bottom top", scrub: true } });
    })();

    /* ROOMS enter */
    gsap.from(".rooms__stk", { scale: .3, rotation: -240, duration: 1.4, ease: "back.out(1.4)", scrollTrigger: { trigger: ".rooms__stage", start: "top 70%" } });
    gsap.from(".rooms__card", { scale: 0, duration: 1, ease: "back.out(2)", stagger: .1, scrollTrigger: { trigger: ".rooms__stage", start: "top 60%" } });
    gsap.from(".rooms__word .wl", { yPercent: 110, duration: .9, ease: "back.out(1.6)", stagger: .04, scrollTrigger: { trigger: ".rooms__stage", start: "top 70%" } });
    gsap.from(".roundbtn, .rooms__info, .rooms__nav", { y: 50, opacity: 0, duration: .9, ease: "back.out(2)", stagger: .1, scrollTrigger: { trigger: ".rooms__stage", start: "top 55%" } });

    /* MOMENTS horizontal */
    const track = $(".moments__track");
    const dist = () => track.scrollWidth - innerWidth;
    hScroll = gsap.to(track, {
      x: () => -dist(), ease: "none",
      scrollTrigger: { trigger: ".moments__pin", start: "top top", end: () => "+=" + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 }
    });
    $$(".mpanel").forEach(p => {
      $$(".mpanel__stk", p).forEach((s, i) => {
        gsap.fromTo(s, { rotation: -180, scale: .4 }, { rotation: 120 * (i ? -1 : 1), scale: 1, ease: "none", scrollTrigger: { trigger: p, containerAnimation: hScroll, start: "left right", end: "right left", scrub: true } });
        gsap.fromTo(s, { y: 120 }, { y: -60, ease: "none", scrollTrigger: { trigger: p, containerAnimation: hScroll, start: "left right", end: "right left", scrub: true } });
      });
      const img = $(".mpanel__img", p);
      gsap.fromTo(img, { rotation: -22, scale: .6 }, { rotation: 6, scale: 1.05, ease: "none", scrollTrigger: { trigger: p, containerAnimation: hScroll, start: "left right", end: "center center", scrub: true } });
      const sc = $(".scribble", p);
      if (sc) $$("path", sc).forEach(path => {
        const L = path.getTotalLength();
        gsap.fromTo(path, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: p, containerAnimation: hScroll, start: "left 70%", end: "center 40%", scrub: true } });
      });
      gsap.from($$(".mpanel__chips li", p), { scale: 0, rotation: -20, duration: .6, ease: "back.out(2.5)", stagger: .08, scrollTrigger: { trigger: p, containerAnimation: hScroll, start: "left 55%" } });
      gsap.from([$(".mpanel__n", p), $(".mpanel__hand", p)], { y: 40, opacity: 0, duration: .8, ease: "back.out(2)", stagger: .1, scrollTrigger: { trigger: p, containerAnimation: hScroll, start: "left 60%" } });
    });

    /* WEDDING */
    gsap.fromTo(".wedding__photo img", { yPercent: -15 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".wedding__photo", start: "top bottom", end: "bottom top", scrub: true } });
    gsap.fromTo(".wedding__photo", { scale: .86, borderRadius: "120px" }, { scale: 1, borderRadius: "40px", ease: "none", scrollTrigger: { trigger: ".wedding__photo", start: "top bottom", end: "top 25%", scrub: true } });
    gsap.from(".wedding__stk", { scale: 0, rotation: -360, duration: 1.4, ease: "back.out(1.5)", scrollTrigger: { trigger: ".wedding", start: "top 60%" } });
    gsap.fromTo(".wedding__stk", { y: 0 }, { y: -120, rotation: "+=90", ease: "none", scrollTrigger: { trigger: ".wedding", start: "top bottom", end: "bottom top", scrub: true } });
    gsap.from(".wedding__hand", { opacity: 0, y: 30, rotation: -12, duration: 1, ease: "back.out(2)", scrollTrigger: { trigger: ".wedding__hand", start: "top 90%" } });
    gsap.fromTo(".wedding__strip", { x: () => innerWidth * .2 }, { x: () => -($(".wedding__strip").scrollWidth - innerWidth * .8), ease: "none", scrollTrigger: { trigger: ".wedding__strip", start: "top bottom", end: "bottom top", scrub: true } });

    /* CTA */
    gsap.from(".cta__blob", { scale: .4, rotation: -30, duration: 1.4, ease: "elastic.out(1, .6)", scrollTrigger: { trigger: ".cta", start: "top 70%" } });
    gsap.from(".cta__card", { scale: .4, rotation: 20, duration: 1.4, ease: "elastic.out(1, .6)", delay: .1, scrollTrigger: { trigger: ".cta", start: "top 70%" } });
    gsap.to(".cta__blob", { borderRadius: "56% 44% 38% 62% / 42% 58% 42% 58%", duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.from(".cta__btns .pill", { scale: 0, duration: .7, ease: "back.out(3)", stagger: .08, scrollTrigger: { trigger: ".cta__btns", start: "top 92%" } });

    /* FOOTER */
    gsap.from(".foot__big span", { yPercent: -80, rotation: (i) => (i ? 8 : -8), opacity: 0, duration: 1.2, ease: "back.out(1.8)", stagger: .12, scrollTrigger: { trigger: ".foot", start: "top 55%" } });
    gsap.from(".foot__nav a", { y: -40, opacity: 0, duration: .8, ease: "back.out(2)", stagger: .06, scrollTrigger: { trigger: ".foot", start: "top 60%" } });
    // the page colour returns to red at the end
    ScrollTrigger.create({ trigger: ".foot", start: "top 80%", onEnter: () => activate(null) });

    footerPhysics();
    ScrollTrigger.refresh();
  }

  let rT;
  addEventListener("resize", () => { clearTimeout(rT); rT = setTimeout(() => ScrollTrigger.refresh(), 250); });
  addEventListener("load", () => ScrollTrigger.refresh());
})();

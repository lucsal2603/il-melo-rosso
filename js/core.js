/* IL MELO ROSSO · comune a tutte le pagine */
window.Melo = (() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const mobile = () => innerWidth < 860;
  $$(".js-year").forEach(e => (e.textContent = new Date().getFullYear()));

  if (!window.gsap) { document.body.classList.remove("is-loading"); $(".loader")?.remove(); return null; }
  gsap.registerPlugin(ScrollTrigger);
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  scrollTo(0, 0);

  /* ---------------- DATA ---------------- */
  const DEFAULT = { bg: "#E5372B", ink: "#3A0A0C", hill: "#C4261C", title: "#3A0A0C" };
  const P = {
    cucina:    { url: "cucina.html",    label: "La|cucina",  img: "assets/img/stk/13175261.jpg",   bg: "#F58A1F", ink: "#5A2400", hill: "#D9700D", title: "#FFD23F", ring: "cucina di casa   dall'orto alla tavola   " },
    camere:    { url: "camere.html",    label: "Le|camere",  img: "assets/img/stk/casetta-1.jpg",  bg: "#8E80F0", ink: "#1E1660", hill: "#7262DD", title: "#D7D1FF", ring: "sei camere   casa di famiglia   b&b   " },
    matrimoni: { url: "matrimoni.html", label: "Matrimoni",  img: "assets/img/stk/13660935-2.jpg", bg: "#F59DB0", ink: "#6E1330", hill: "#E3829A", title: "#FFE3EA", ring: "un solo matrimonio al giorno   il vostro   " },
    piscina:   { url: "piscina.html",   label: "Piscina",    img: "assets/img/stk/img-7606.jpg",   bg: "#5BC6EE", ink: "#073C55", hill: "#3AAEDB", title: "#DDF5FF", ring: "piscina panoramica   tra i boschi   " },
    colazione: { url: "colazione.html", label: "Colazione",  img: "assets/img/stk/img-7842.jpg",   bg: "#F5CF33", ink: "#5A3D00", hill: "#DDB41A", title: "#FFF5C2", ring: "colazione in giardino   fatta in casa   " },
    fortunago: { url: "fortunago.html", label: "Fortunago",  img: "assets/img/stk/img-7607-1.jpg", bg: "#8CCB3A", ink: "#173D08", hill: "#6FB021", title: "#E8FFC2", ring: "uno dei borghi più belli d'italia   " }
  };
  const SOCIAL = [
    { href: "https://www.instagram.com/ilmelorosso", label: "Instagram", icon: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6"/>' },
    { href: "https://www.facebook.com/ilmelorosso", label: "Facebook", icon: '<path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H6.5v3.5H9V21h3.5v-7.5h2.7l.5-3.5h-3.2V7.2c0-.7.4-1 1-1H15z"/>' },
    { href: "https://wa.me/393351762614", label: "WhatsApp", icon: '<path d="M4 20l1.2-4A8 8 0 1 1 8 18.8z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.4-1.8-1-1 .8c-1-.5-1.8-1.3-2.3-2.3l.8-1-1-1.8z"/>' },
    { href: "tel:+393351762614", label: "Telefono", icon: '<path d="M5 3h3.5l1.5 4.5-2.2 1.4a11 11 0 0 0 5.3 5.3l1.4-2.2L19 13.5V17a2 2 0 0 1-2 2A15 15 0 0 1 3 5a2 2 0 0 1 2-2z"/>' }
  ];

  /* ---------------- STICKER ---------------- */
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
    const txt = (ring || "il melo rosso   fortunago   oltrepò pavese   ").toUpperCase();

    const ringTxt = t => t.replace(/ {2,}/g, m => "\u00A0".repeat(m.length));
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
        <text class="stk__arc" fill="${ink}"><textPath href="#${id}p" textLength="505" lengthAdjust="spacing">${ringTxt(txt + (txt.length < 40 ? txt : ""))}</textPath></text>
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
    if (host.matches("button, a")) host.setAttribute("aria-label", p.label.replace("|", " "));
  });

  /* ---------------- THEME ---------------- */
  function theme(t, dur = .6) {
    gsap.to(root, { "--bg": t.bg, "--ink": t.ink, "--hill": t.hill, "--title": t.title, duration: dur, ease: "power2.out", overwrite: "auto" });
    const m = $('meta[name="theme-color"]'); if (m) m.content = t.bg;
  }

  /* ---------------- SMOOTH SCROLL ---------------- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  const jump = y => { lenis ? lenis.scrollTo(y, { immediate: true, force: true }) : scrollTo(0, y); ScrollTrigger.update(); };

  /* ---------------- ARCS ---------------- */
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
  function arcsCover(onCovered) {
    const H = innerHeight;
    gsap.set(arcs, { y: 0 });
    gsap.to(arcs, { y: -H * 1.45, duration: .95, ease: "power2.in", stagger: .07, onComplete: undefined });
    gsap.delayedCall((arcs.length - 1) * .07 + .95, () => onCovered && onCovered());
  }

  function arcsArrive(onReveal) {
    const H = innerHeight;
    gsap.set(arcs, { y: -H * 1.45 });
    root.classList.remove("is-arriving");
    const tl = gsap.timeline();
    tl.to(arcs, { y: -H * 3.05, duration: 1.25, ease: "power2.inOut", stagger: { each: .1, from: "end" } });
    tl.call(() => onReveal && onReveal(), null, .45);
    tl.set(arcs, { y: 0 });
    return tl;
  }
  addEventListener("pageshow", e => { if (e.persisted) { gsap.set(arcs, { y: 0 }); lenis && lenis.start(); } });

  /* ---------------- NAVIGATION ---------------- */
  const here = location.pathname.split("/").pop() || "index.html";
  const api = { targetY: sel => { const el = $(sel); return el ? el.getBoundingClientRect().top + scrollY : 0; } };
  function scrollToId(sel) {
    closeMenu(true);
    if (reduce) { scrollTo(0, api.targetY(sel)); return; }
    arcsSweep(() => jump(api.targetY(sel)));
  }
  function go(url) {
    closeMenu(true);
    if (reduce) { location.href = url; return; }
    lenis && lenis.stop();
    arcsCover(() => {
      try { sessionStorage.setItem("meloArc", "1"); } catch (e) {}
      location.href = url;
    });
  }
  document.addEventListener("click", e => {
    const a = e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
    const href = a.getAttribute("href");
    if (/^(tel:|mailto:|https?:)/.test(href)) return;
    const [file, hash] = href.split("#");
    if (!file || file === here) {
      if (hash && $("#" + hash)) { e.preventDefault(); scrollToId("#" + hash); }
      return;
    }
    e.preventDefault();
    go(href);
  });
  function jumpToHash() {
    const h = location.hash;
    if (h && h.length > 1 && $(h)) jump(api.targetY(h));
  }

  /* ---------------- TEXT ---------------- */
  function splitChars(el) {
    const out = [];
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          if (!/\S/.test(n.textContent)) return;

          const frag = document.createElement("span");
          frag.className = "hop-text";
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
  $$("[data-hop]").forEach(el => splitChars(el.querySelector(":scope > span") || el));

  /* ---------------- CURSORE ---------------- */
  if (fine && !reduce) {
    const ARROW = "M9 7 L9 41 L18 32.5 L24.5 46.5 L31 43.5 L24.8 30 L37 30 Z";

    const HAND = '<rect x="18" y="3" width="7.6" height="27" rx="3.8"/><rect x="25" y="17" width="7" height="14" rx="3.5"/><rect x="31.4" y="19" width="6.6" height="13" rx="3.3"/><rect x="37.4" y="22" width="5.6" height="11" rx="2.8"/><rect x="9.5" y="24" width="7" height="14" rx="3.5" transform="rotate(-35 13 31)"/><path d="M16.5 27 H43 V36 C43 44 37 49.5 30 49.5 H27.5 C20.5 49.5 15.5 44 15.5 37 Z"/>';
    const layer = (cls, inner) => `<g class="${cls}"><g class="cursor__depth" transform="translate(2.2 2.6)">${inner}</g><g class="cursor__face">${inner}</g></g>`;
    const cur = document.createElement("div");
    cur.className = "cursor"; cur.setAttribute("aria-hidden", "true");
    cur.innerHTML = `<svg viewBox="0 0 48 52">${layer("cursor__arrow", `<path d="${ARROW}"/>`)}${layer("cursor__hand", HAND)}</svg>`;
    document.body.appendChild(cur);
    root.classList.add("has-cursor");

    const HOT_ARROW = [9, 7], HOT_HAND = [21.8, 4];
    let hot = HOT_ARROW, mode = "arrow", pressed = false, isLink = false;
    const mx = gsap.quickTo(cur, "x", { duration: .18, ease: "power3.out" });
    const my = gsap.quickTo(cur, "y", { duration: .18, ease: "power3.out" });
    const rot = gsap.quickTo(cur, "rotation", { duration: .5, ease: "power3.out" });
    let lastX = null, px = -100, py = -100, shown = false;
    gsap.set(cur, { x: -100, y: -100, transformOrigin: `${hot[0]}px ${hot[1]}px` });
    const scaleFor = () => pressed ? (mode === "arrow" ? .82 : .92) : (isLink && mode === "arrow" ? 1.22 : 1);
    function setMode(m) {
      if (m === mode) return;
      mode = m;
      cur.classList.toggle("cursor--hand", m !== "arrow");
            hot = m === "arrow" ? HOT_ARROW : HOT_HAND;
      gsap.set(cur, { transformOrigin: `${hot[0]}px ${hot[1]}px`, x: px - hot[0], y: py - hot[1] });
      gsap.fromTo(cur, { scale: scaleFor() * .8 }, { scale: scaleFor(), duration: .35, ease: "back.out(3)" });
    }
    addEventListener("mousemove", e => {
      px = e.clientX; py = e.clientY;
      const x = px - hot[0], y = py - hot[1];
      if (!shown) { gsap.set(cur, { x, y }); gsap.to(cur, { opacity: 1, duration: .2 }); shown = true; }
      mx(x); my(y);
      if (lastX !== null) rot(gsap.utils.clamp(-24, 24, (px - lastX) * 1.6));
      lastX = px;
      clearTimeout(cur._t); cur._t = setTimeout(() => rot(0), 120);
    }, { passive: true });
    document.addEventListener("mouseleave", () => { gsap.to(cur, { opacity: 0, duration: .2 }); shown = false; });
    const LINKS = "a, button, [role=button], .pick__item, label, .pw__card";
    const GRAB = ".rooms__stage, .tag, .fbody";
    document.addEventListener("mouseover", e => {
      const t = e.target;
      const g = t.closest(GRAB);

      const grab = g && (g.matches(".tag, .fbody") || !t.closest("a, button"));
      if (!pressed) setMode(grab ? "hand" : "arrow");
      const link = !grab && !!t.closest(LINKS);
      if (link !== isLink) { isLink = link; gsap.to(cur, { scale: scaleFor(), duration: .4, ease: "back.out(3)" }); }
    }, { passive: true });
    addEventListener("mousedown", () => { pressed = true; gsap.to(cur, { scale: scaleFor(), duration: .12 }); });
    addEventListener("mouseup", e => {
      pressed = false;
      const t = document.elementFromPoint(e.clientX, e.clientY); setMode(t && t.closest(GRAB) && (t.closest(".tag, .fbody") || !t.closest("a, button")) ? "hand" : "arrow");
      gsap.to(cur, { scale: scaleFor(), duration: .45, ease: "elastic.out(1.1, .4)" });
    });
  }

  /* ---------------- LETTERE CHE SALTANO ---------------- */
  const LETTER_CLS = ["hl", "hc", "wl", "gch"];
  const isLetter = el => el && el.nodeType === 1 && LETTER_CLS.some(c => el.classList.contains(c));

  const SKIP = "svg, script, style, noscript, textarea, select, option, title, iframe, [data-nohop], .sr-only, .stk, .roundbtn, .wd__explore, .menu, .foot__nav, .tag";
  const okText = n => {
    const p = n.parentElement;
    return !!p && /\S/.test(n.nodeValue) && !isLetter(p) && !p.closest(SKIP);
  };
  function splitText(n) {
    const wrap = document.createElement("span");
    wrap.className = "ht";
    n.nodeValue.split(/(\s+)/).forEach(w => {
      if (!w) return;
      if (/^\s+$/.test(w)) { wrap.appendChild(document.createTextNode(w)); return; }
      const word = document.createElement("span");
      word.className = "hw";
      for (const c of w) { const l = document.createElement("span"); l.className = "hl"; l.textContent = c; word.appendChild(l); }
      wrap.appendChild(word);
    });
    n.replaceWith(wrap);
  }
  function letters(root = document.body) {
    if (!fine || !root) return;
    if (root.nodeType === 3) { if (okText(root)) splitText(root); return; }
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => (okText(n) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT) });
    const list = [];
    while (w.nextNode()) list.push(w.currentNode);
    list.forEach(splitText);
  }
  if (fine) {
    document.addEventListener("mouseover", e => {
      const t = e.target;
      if (!isLetter(t) || t._hop) return;
      t._hop = true;
      const h = t.offsetHeight || 20;
      const up = t.classList.contains("gch") ? .2 : .34;
      gsap.timeline({ onComplete: () => { t._hop = false; } })
        .to(t, { y: -h * up, rotation: gsap.utils.random(-12, 12), duration: .16, ease: "power2.out", overwrite: "auto" })
        .to(t, { y: 0, rotation: 0, duration: .55, ease: "bounce.out" });
    }, { passive: true });
    document.addEventListener("DOMContentLoaded", () => {
      letters();
      new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => {
        if (n.nodeType === 1 && (n.classList.contains("ht") || isLetter(n))) return;
        if (n.nodeType === 1 || n.nodeType === 3) letters(n);
      }))).observe(document.body, { childList: true, subtree: true });
    });
  }
  const hopIns = $$(".js-hop-in").map(el => ({ el, chars: splitChars(el) }));
  function hopInOnScroll(list) {
    list.forEach(({ el, chars }) => {
      gsap.from(chars, {
        yPercent: -120, rotation: () => gsap.utils.random(-30, 30), opacity: 0,
        duration: .9, ease: "back.out(2)", stagger: { each: .02, from: "random" },
        scrollTrigger: { trigger: el, start: "top 85%" }
      });
    });
  }

  /* ---------------- MENU "TIRAMI" ---------------- */
  const menu = $(".menu"), tag = $(".tag"), tagTxt = $(".tag__txt");
  let menuOpen = false, dragging = false, hovering = false;
  gsap.set(menu, { yPercent: -104, visibility: "visible" });
  gsap.set(tag, { transformOrigin: "50% 0%" });
  const TAG_DROP = () => menu.offsetHeight - 16;
  const stretch = (amt = 1.32) => gsap.timeline()
    .to(tag, { scaleY: amt, scaleX: 2 - amt * .9 > .8 ? 2 - amt * .9 : .8, duration: .22, ease: "power2.out", overwrite: "auto" })
    .to(tag, { scaleY: 1, scaleX: 1, duration: 1.3, ease: "elastic.out(1.1, .28)" });

  function openMenu() {
    if (menuOpen) return;
    menuOpen = true;
    menu.setAttribute("aria-hidden", "false"); tag.setAttribute("aria-expanded", "true");
    lenis && lenis.stop();
    tagTxt.textContent = "Chiudi";
    gsap.to(menu, { yPercent: 0, duration: 1.6, ease: "elastic.out(1, .55)", overwrite: true });
    gsap.to(tag, { y: TAG_DROP(), duration: 1.6, ease: "elastic.out(1, .55)", overwrite: "auto" });
    stretch(1.38);
    gsap.fromTo(".menu__list li", { y: -80, rotation: () => gsap.utils.random(-10, 10) }, { y: 0, rotation: 0, duration: 1.4, ease: "elastic.out(1, .45)", stagger: .045, delay: .12 });
    gsap.fromTo(".menu__hand", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .8, delay: .9, ease: "back.out(2)" });
  }
  function closeMenu(fast) {
    if (!menuOpen) return;
    menuOpen = false;
    menu.setAttribute("aria-hidden", "true"); tag.setAttribute("aria-expanded", "false");
    lenis && lenis.start();
    tagTxt.textContent = "Tirami";
    const d = fast ? .55 : .9;
    gsap.to(menu, { yPercent: -104, duration: d, ease: "power3.inOut", overwrite: true });
    gsap.to(tag, { y: 0, duration: d, ease: "power3.inOut", overwrite: "auto", onComplete: () => stretch(1.22) });
  }

  (function pullTag() {
    let sy = 0, dy = 0, base = 0, lastY = 0, lastT = 0;
    tag.addEventListener("pointerdown", e => {
      if (dragging) up();
      dragging = true; sy = lastY = e.clientY; lastT = performance.now(); dy = 0; base = menuOpen ? TAG_DROP() : 0;
      try { tag.setPointerCapture(e.pointerId); } catch (err) {}
      gsap.killTweensOf([menu, tag]);
      gsap.to(tag, { scaleY: 1.12, scaleX: .94, duration: .3, ease: "power2.out" });
    });
    tag.addEventListener("pointermove", e => {
      if (!dragging) return;
      dy = e.clientY - sy;
      const now = performance.now();
      const v = (e.clientY - lastY) / Math.max(1, now - lastT) * 1000; lastY = e.clientY; lastT = now;

      let y = base + dy;
      const max = TAG_DROP();
      if (y < 0) y = y * .25;
      if (y > max) y = max + (y - max) * .25;
      const s = 1.12 + Math.min(Math.abs(v) / 2600, .3);
      gsap.to(tag, { y, scaleY: s, scaleX: 2.06 - s, duration: .25, ease: "power3.out", overwrite: "auto" });
      gsap.to(menu, { yPercent: -104 + Math.max(0, Math.min(1.08, y / max)) * 104, duration: .45, ease: "power3.out", overwrite: true });
    });
    function up() {
      if (!dragging) return;
      dragging = false;
      gsap.to(tag, { scaleY: 1, scaleX: 1, duration: 1.1, ease: "elastic.out(1.1, .3)" });
      if (Math.abs(dy) < 6) { menuOpen ? closeMenu() : openMenu(); return; }
      const wantOpen = menuOpen ? dy > -80 : dy > 80;
      if (wantOpen) { menuOpen = false; openMenu(); } else { menuOpen = true; closeMenu(); }
    }

    tag.addEventListener("pointerup", up);
    tag.addEventListener("pointercancel", up);
    tag.addEventListener("lostpointercapture", up);
    addEventListener("pointerup", up);
    addEventListener("pointercancel", up);
    addEventListener("blur", up);
    document.addEventListener("visibilitychange", up);

    if (fine) {
      tag.addEventListener("mouseenter", () => {
        hovering = true;
        if (!dragging) gsap.to(tag, { scaleY: 1.16, scaleX: .93, duration: .9, ease: "elastic.out(1.1, .32)", overwrite: "auto" });
      });
      tag.addEventListener("mouseleave", () => {
        hovering = false;
        if (!dragging) gsap.to(tag, { scaleY: 1, scaleX: 1, duration: 1.1, ease: "elastic.out(1.1, .3)", overwrite: "auto" });
      });
    }

    gsap.delayedCall(4, function tug() {
      if (!menuOpen && !dragging && !hovering && !document.body.classList.contains("is-loading")) stretch(1.12);
      gsap.delayedCall(5.5, tug);
    });
  })();
  addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
  addEventListener("resize", () => { if (menuOpen) gsap.set(tag, { y: TAG_DROP() }); });

  $$(".menu__list a").forEach(a => { if (a.getAttribute("href") === here) a.classList.add("is-here"); });

  /* ---------------- HEADER ---------------- */
  function headerScroll() {
    ScrollTrigger.create({ start: 0, end: "max", onUpdate: s => document.body.classList.toggle("scrolled", s.scroll() > 80) });
  }

  /* ---------------- FOOTER PHYSICS ---------------- */
  function footerPhysics() {
    if (!window.Matter || !$(".foot__world")) return;
    const { Engine, Bodies, Body, Composite } = Matter;
    const world = $(".foot__world"), wrap = $(".foot__bodies");
    const engine = Engine.create({ gravity: { y: 2 } });
    let walls = [], bodies = [], running = false, built = false;
    const defs = [
      ...Object.values(P).map(p => ({ type: "stk", p })),
      ...SOCIAL.map(s => ({ type: "soc", s }))
    ];
    const sizeFor = d => { const base = Math.min(Math.max(innerWidth * .13, mobile() ? 84 : 104), 210); return d.type === "stk" ? base : base * .78; };
    function buildWalls() {
      Composite.remove(engine.world, walls);
      const w = world.clientWidth, h = world.clientHeight, t = 200;
      const floor = h - (mobile() ? 96 : 44);
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
        const el = document.createElement("a");
        el.className = "fbody";
        el.style.width = el.style.height = size + "px";
        if (d.type === "stk") {
          el.href = d.p.url;
          el.setAttribute("aria-label", d.p.label.replace("|", " "));
          el.appendChild(sticker(d.p));
        } else {
          el.href = d.s.href; if (d.s.href.startsWith("http")) { el.target = "_blank"; el.rel = "noopener"; }
          el.setAttribute("aria-label", d.s.label);
          el.innerHTML = `<span class="soc"><svg viewBox="0 0 24 24">${d.s.icon}</svg></span>`;
        }
        wrap.appendChild(el);
        const b = Bodies.circle(gsap.utils.random(size, w - size), -gsap.utils.random(100, 900) - i * 90, size / 2, { restitution: .12, friction: .15, frictionAir: .035, density: .01 });
        Body.setAngularVelocity(b, gsap.utils.random(-.15, .15));
        b.el = el; b.size = size;
        bodies.push(b);
        Composite.add(engine.world, b);
        drag(el, b, d);
      });
    }
    function drag(el, b, d) {
      let down = false, lx = 0, ly = 0, vx = 0, vy = 0, moved = 0;
      el.addEventListener("pointerdown", e => {
        down = true; moved = 0; lx = e.clientX; ly = e.clientY;
        el.setPointerCapture(e.pointerId);
        e.preventDefault();
      });
      el.addEventListener("pointermove", e => {
        if (!down) return;
        const r = world.getBoundingClientRect();
        vx = e.clientX - lx; vy = e.clientY - ly; lx = e.clientX; ly = e.clientY;
        moved += Math.abs(vx) + Math.abs(vy);
        const rad = b.size / 2;
        Body.setPosition(b, { x: Math.max(rad, Math.min(r.width - rad, e.clientX - r.left)), y: Math.max(rad, Math.min(r.height - rad, e.clientY - r.top)) });
        Body.setVelocity(b, { x: gsap.utils.clamp(-8, 8, vx * .5), y: gsap.utils.clamp(-8, 8, vy * .5) });
      });
      const up = () => {
        if (!down) return; down = false;

        Body.setVelocity(b, { x: gsap.utils.clamp(-11, 11, vx * .45), y: gsap.utils.clamp(-11, 11, vy * .45) });
        if (moved < 6) {
          if (d.type === "stk") go(d.p.url);
          else window.open(el.href, el.target || "_self");
        }
      };
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
      el.addEventListener("click", e => e.preventDefault());
    }
    let last = 0, acc = 0;
    const FIXED = 1000 / 60;
    function step(time) {
      if (!running) return;
      acc += Math.min(64, time - (last || time)); last = time;
      while (acc >= FIXED) { Engine.update(engine, FIXED); acc -= FIXED; }

      bodies.forEach(b => {
        if (b.speed < .35 && Math.abs(b.angularVelocity) < .03) {
          const up = Math.round(b.angle / (Math.PI * 2)) * Math.PI * 2;
          Body.setAngle(b, b.angle + (up - b.angle) * .06); Body.setAngularVelocity(b, 0);
        }
      });

      bodies.forEach(b => { const v = b.speed; if (v > 16) Body.setVelocity(b, { x: b.velocity.x * 16 / v, y: b.velocity.y * 16 / v }); });

      bodies.forEach(b => {
        const rad = b.size / 2;
        if (!b.inside) { if (b.position.y - rad >= 0) b.inside = true; return; }
        if (b.position.y - rad < 0) {
          Body.setPosition(b, { x: b.position.x, y: rad });
          Body.setVelocity(b, { x: b.velocity.x * .8, y: Math.abs(b.velocity.y) * .3 });
        }
      });
      bodies.forEach(b => { b.el.style.transform = `translate(${b.position.x - b.size / 2}px, ${b.position.y - b.size / 2}px) rotate(${b.angle}rad)`; });
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

    if (!reduce) {
      gsap.from(".foot__big > span", { yPercent: -80, rotation: i => (i ? 8 : -8), opacity: 0, duration: 1.2, ease: "back.out(1.8)", stagger: .12, scrollTrigger: { trigger: ".foot", start: "top 55%" } });
      gsap.from(".foot__nav a", { y: -40, opacity: 0, duration: .8, ease: "back.out(2)", stagger: .06, scrollTrigger: { trigger: ".foot", start: "top 60%" } });
    }
  }

  /* ---------------- BOOT ---------------- */
  const fontsReady = Promise.race([document.fonts ? document.fonts.ready.catch(() => {}) : Promise.resolve(), new Promise(r => setTimeout(r, 2500))]);
  function reveal(after) {

    const done = () => {
      $(".loader")?.remove();
      document.body.classList.remove("is-loading");
      lenis && lenis.start();
      ScrollTrigger.refresh();
      after && after();
    };
    if (reduce) { done(); return; }
    if (root.classList.contains("is-arriving")) { arcsArrive(done); return; }
    arcsSweep(done);
  }

  ScrollTrigger.config({ ignoreMobileResize: true });
  let rT, lastW = innerWidth, lastH = innerHeight;
  addEventListener("resize", () => {
    const touch = matchMedia("(pointer: coarse)").matches;
    if (innerWidth === lastW && (touch || Math.abs(innerHeight - lastH) < 120)) return;
    lastW = innerWidth; lastH = innerHeight;
    clearTimeout(rT); rT = setTimeout(() => ScrollTrigger.refresh(), 250);
  });
  addEventListener("load", () => ScrollTrigger.refresh());

  return Object.assign(api, {
    $, $$, root, reduce, fine, mobile, DEFAULT, P, SOCIAL, sticker, shade, theme,
    get lenis() { return lenis; }, jump, arcsSweep, go, scrollToId, jumpToHash,
    splitChars, letters, hopIns, hopInOnScroll, openMenu, closeMenu, headerScroll, footerPhysics, fontsReady, reveal
  });
})();

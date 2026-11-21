/* =========================================================
   IL MELO ROSSO — HOME · "Il Melo Rosso"
   (usa js/core.js)
   ========================================================= */
(() => {
  "use strict";
  const M = window.Melo;
  if (!M) return;
  const { $, $$, root, reduce, fine, P, sticker, theme } = M;

  /* ---------------- ROOMS DATA ---------------- */
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

  /* ---------------- HERO · PICK ---------------- */
  const items = $$(".pick__item");
  const note = $(".pick__note");
  let current = null;
  function activate(it) {
    if (current === it) return;
    items.forEach(i => i.classList.toggle("is-on", i === it));
    current = it;
    if (!it) { theme(M.DEFAULT); gsap.to(note, { opacity: 0, duration: .25 }); return; }
    theme(P[it.dataset.player]);
    // la punta della freccia (angolo in basso a destra della nota) cade sul centro-alto dell'adesivo puntato
    const r = it.getBoundingClientRect(), h = $(".pick").getBoundingClientRect();
    const arrow = $("svg", note).getBoundingClientRect(), box = note.getBoundingClientRect();
    const tipX = (arrow.right - box.left) - arrow.width * .12;   // punta della freccia dentro la nota
    const tipY = (arrow.bottom - box.top) - arrow.height * .2;
    const targetX = r.left - h.left + r.width * .5;               // centro dell'adesivo
    const targetY = r.top - h.top - r.height * .12;               // bordo alto (l'adesivo si ingrandisce)
    gsap.to(note, { x: targetX - tipX, y: targetY - tipY, opacity: 1, rotation: 0, duration: .45, ease: "back.out(2)" });
  }
  items.forEach(it => {
    it.addEventListener("mouseenter", () => activate(it));
    it.addEventListener("focus", () => { if (it.matches(":focus-visible")) activate(it); });   // solo da tastiera: un tocco sul telefono non cambia colore
    it.addEventListener("click", () => M.go(P[it.dataset.player].url));
  });
  $(".pick__row").addEventListener("mouseleave", () => activate(null));

  /* ---------------- HORIZONTAL TARGETS ---------------- */
  let hScroll = null;

  /* ---------------- LOADER / INTRO ---------------- */
  const heroChars = M.hopIns.filter(h => h.el.closest(".pick")).flatMap(h => h.chars);
  if (!reduce) {
    gsap.set(heroChars, { yPercent: -160, rotation: () => gsap.utils.random(-40, 40), opacity: 0 });
    gsap.set(".pick__item", { yPercent: 160, rotation: -360 });
    gsap.set(".pick__hill", { yPercent: 40 });
    gsap.set(".hdr__claim, .hdr__logo, .tag", { opacity: 0 });
  }
  function intro() {
    gsap.timeline()
      .to(".pick__hill", { yPercent: 0, duration: 1.2, ease: "expo.out" }, 0)
      .to(heroChars, { yPercent: 0, rotation: 0, opacity: 1, duration: 1, ease: "back.out(2.2)", stagger: { each: .035, from: "random" } }, .05)
      .to(".pick__item", { yPercent: 0, rotation: 0, duration: 1.3, ease: "back.out(1.4)", stagger: .08 }, .25)
      .to(".hdr__claim, .hdr__logo", { opacity: 1, duration: .6 }, .6)
      .fromTo(".tag", { y: -110, opacity: 1 }, { y: 0, duration: 1.4, ease: "elastic.out(1, .45)" }, .8);
  }
  function start() {
    // coming from an inner page (or with #hash): short loader
    const fromInside = document.referrer && new URL(document.referrer, location.href).origin === location.origin;
    if (reduce) { M.reveal(); M.jumpToHash(); return; }
    const after = () => { M.jumpToHash(); intro(); };
    if (fromInside || location.hash) { gsap.set(".loader__logo", { display: "none" }); M.reveal(after); return; }
    // animazione del logo durante il caricamento: una piccola storia
    // cerchio → anello che si disegna → disco → l'albero cresce dalle radici →
    // spunta la mela che dondola → arriva il gatto e prova a prenderla
    const L = $(".loader__logo");
    const q = s => $(s, L);
    const base = q(".lg-base"), ring = q(".lg-ring"), disc = q(".lg-disc"), grow = q(".lg-grow");
    const tree = q(".lg-tree"), apple = q(".lg-apple"), cat = q(".lg-cat");
    const C = 2 * Math.PI * +ring.getAttribute("r");
    gsap.set(ring, { strokeDasharray: C, strokeDashoffset: C, rotation: -90, svgOrigin: "150 150" });
    gsap.set([base, disc], { scale: 0, svgOrigin: "150 150" });
    gsap.set(tree, { svgOrigin: "222 252" });
    gsap.set(apple, { scale: 0, svgOrigin: "136 85" });
    gsap.set(cat, { y: 95, rotation: -12, svgOrigin: "175 248" });   // spunta dal prato, dentro il disco
    gsap.set(L, { visibility: "visible" });
    gsap.timeline()
      .to(base, { scale: 1, duration: .7, ease: "back.out(1.8)" }, 0)
      .to(ring, { strokeDashoffset: 0, duration: 1, ease: "power2.inOut" }, .1)
      .to(disc, { scale: 1, duration: .8, ease: "power3.out" }, .35)
      // l'albero cresce dalla base del tronco e la chioma si scuote
      .to(grow, { attr: { r: 250 }, duration: 1.1, ease: "power2.out" }, .75)
      .fromTo(tree, { skewX: -9 }, { skewX: 0, duration: 1.4, ease: "elastic.out(1, .35)" }, 1.2)
      // la mela spunta e dondola sul picciolo
      .to(apple, { scale: 1, duration: .55, ease: "back.out(3)" }, 1.35)
      .fromTo(apple, { rotation: 30 }, { rotation: 0, duration: 1.6, ease: "elastic.out(1.2, .22)" }, 1.4)
      // arriva il gatto con un salto
      .to(cat, { y: 0, rotation: 0, duration: .75, ease: "back.out(1.8)" }, 1.65)
      // ...e dà due zampate verso la mela, che torna a dondolare
      .to(cat, { rotation: 7, duration: .16, ease: "sine.inOut", yoyo: true, repeat: 3 }, 2.35)
      .to(apple, { rotation: -22, duration: .2, ease: "power2.out" }, 2.45)
      .to(apple, { rotation: 0, duration: 1.2, ease: "elastic.out(1.2, .22)" }, 2.65)
      // il logo gira, si chiude e partono gli archi
      .to(L, { scale: 0, rotation: 200, duration: .5, ease: "back.in(2)" }, 3.05)
      .add(() => M.reveal(after), 3.2);
  }
  M.fontsReady.then(() => { buildScenes(); start(); });

  /* ---------------- ROOMS SLIDER ---------------- */
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
  const roomSticker = r => sticker({ img: r.img, bg: r.bg, ink: r.ink, label: r.big, ring: "le camere del melo rosso   b&b   " });
  letters(rPre, ROOMS[0].pre); letters(rBig, ROOMS[0].big);
  rStk.appendChild(roomSticker(ROOMS[0]));

  // dir = 1 → avanti: la camera attuale esce a sinistra, la nuova entra da destra (e viceversa)
  function goRoom(n, dir) {
    if (rBusy) return;
    rBusy = true;
    rI = (n + ROOMS.length) % ROOMS.length;
    const r = ROOMS[rI];
    const W = innerWidth;
    const old = $(".stk", rStk);
    const d = rStk.offsetWidth || 300;
    const D = W / 2 + d / 2 + 60;                 // fino a fuori schermo
    const roll = D / (Math.PI * d) * 360;          // rotola come una ruota (e si ferma sempre dritto)
    const word = $(".rooms__word");
    const cards = [$(".rooms__card--a"), $(".rooms__card--b")];
    const OUT = .65, IN = .95, SWAP = .5;

    const tl = gsap.timeline({ onComplete: () => (rBusy = false) });
    tl.to(root, { "--room": r.bg, "--room-ink": r.ink, "--room-soft": r.soft, duration: .9, ease: "power2.inOut" }, 0)

      // sticker: esce rotolando oltre il bordo
      .to(old, { x: -D * dir, rotation: -roll * dir, duration: OUT, ease: "power2.in", onComplete: () => old.remove() }, 0)
      // nuovo sticker: entra dall'altro lato, da fuori schermo
      .add(() => {
        const s = roomSticker(r);
        rStk.appendChild(s);
        gsap.fromTo(s, { x: D * dir, rotation: roll * dir }, { x: 0, rotation: 0, duration: IN, ease: "power3.out" });
      }, SWAP)

      // parola gigante: stesso percorso
      .to(word, { x: -W * 1.2 * dir, duration: OUT, ease: "power2.in" }, 0)
      .add(() => { letters(rPre, r.pre); letters(rBig, r.big); }, OUT)
      .fromTo(word, { x: W * 1.2 * dir }, { x: 0, duration: IN, ease: "power3.out", immediateRender: false }, OUT)

      // foto laterali: escono e rientrano anche loro
      .to(cards, { x: -W * dir, duration: OUT, ease: "power2.in", stagger: .05 }, 0)
      .add(() => { rCardA.src = r.cards[0]; rCardB.src = r.cards[1]; }, OUT + .05)
      .fromTo(cards, { x: W * dir }, { x: 0, duration: IN, ease: "power3.out", stagger: .06, immediateRender: false }, SWAP + .1)

      // testi informativi
      .to(".rooms__info", { opacity: 0, x: -30 * dir, duration: .3 }, 0)
      .add(() => {
        rTags.innerHTML = r.tags.map(t => `<li>${t}</li>`).join("");
        rDesc.textContent = r.desc;
        rIdx.textContent = String(rI + 1).padStart(2, "0");
      }, .32)
      .fromTo(".rooms__info", { x: 30 * dir }, { opacity: 1, x: 0, duration: .6, immediateRender: false }, .6)
      .fromTo(".roundbtn", { scale: 1 }, { scale: 1.15, duration: .2, yoyo: true, repeat: 1 }, .6);
  }
  $$(".rooms .arrow").forEach(b => b.addEventListener("click", () => goRoom(rI + +b.dataset.dir, +b.dataset.dir)));
  // trascinamento con il mouse o con il dito: l'adesivo rotola sotto il dito,
  // parola e foto lo seguono; lasciando oltre una certa distanza cambia camera
  (function drag() {
    let on = false, moved = false, sx = 0, sy = 0, dx = 0, lastX = 0, lastT = 0, v = 0, id = null;
    const parts = () => ({ stk: $(".stk", rStk), word: $(".rooms__word"), cards: [$(".rooms__card--a"), $(".rooms__card--b")], d: rStk.offsetWidth || 300 });
    rStage.addEventListener("dragstart", e => e.preventDefault());
    rStage.addEventListener("pointerdown", e => {
      if (rBusy || e.button > 0 || e.target.closest("a, button")) return;
      on = true; moved = false; id = e.pointerId;
      sx = lastX = e.clientX; sy = e.clientY; lastT = performance.now(); dx = 0; v = 0;
    });
    rStage.addEventListener("pointermove", e => {
      if (!on || e.pointerId !== id) return;
      const ddx = e.clientX - sx, ddy = e.clientY - sy;
      if (!moved) {
        if (Math.abs(ddx) < 6) return;
        if (Math.abs(ddy) > Math.abs(ddx)) { on = false; return; }   // gesto verticale: è uno scroll della pagina
        moved = true;
        rStage.setPointerCapture(id);
        rStage.classList.add("is-dragging");
      }
      const now = performance.now();
      v = (e.clientX - lastX) / Math.max(1, now - lastT); lastX = e.clientX; lastT = now;
      dx = ddx;
      const { stk, word, cards, d } = parts();
      gsap.to(stk, { x: dx, rotation: dx / (Math.PI * d) * 360, duration: .35, ease: "power3.out", overwrite: true });   // rotola sotto il dito
      gsap.to(word, { x: dx * 1.15, duration: .45, ease: "power3.out", overwrite: true });
      gsap.to(cards, { x: dx * .85, duration: .5, ease: "power3.out", overwrite: true, stagger: .03 });
      gsap.to(".rooms__info", { opacity: 1 - Math.min(.7, Math.abs(dx) / innerWidth), duration: .3, overwrite: true });
    });
    const end = e => {
      if (!on || (e && e.pointerId !== id)) return;
      on = false;
      rStage.classList.remove("is-dragging");
      if (!moved) return;
      const far = Math.abs(dx) > Math.min(160, innerWidth * .18) || Math.abs(v) > .6;
      if (far && e && e.type === "pointerup") {
        const dir = (Math.abs(v) > .6 ? -Math.sign(v) : -Math.sign(dx)) || 1;
        goRoom(rI + dir, dir);
      } else {
        const { stk, word, cards } = parts();
        gsap.to(stk, { x: 0, rotation: 0, duration: 1.1, ease: "elastic.out(1, .55)", overwrite: true });
        gsap.to([word, ...cards], { x: 0, duration: 1, ease: "elastic.out(1, .6)", overwrite: true });
        gsap.to(".rooms__info", { opacity: 1, duration: .4, overwrite: true });
      }
    };
    rStage.addEventListener("pointerup", end);
    rStage.addEventListener("pointercancel", end);
    // dopo un trascinamento non deve partire il click su link e pulsanti
    rStage.addEventListener("click", e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  })();

  /* ---------------- MATRIMONI · LA GIORNATA ----------------
     Come "The Creative" di Sweet Tape. La sezione resta ferma e, scorrendo,
     passa la giornata del matrimonio: ogni momento cambia colore, titolo,
     adesivo (che si gira come una moneta) e foto (che si staccano e
     ne arrivano altre col nastro). Il sole attraversa il cielo e diventa luna. */
  const DAY = [
    { top: "La", big: "Cerimonia", when: "la mattina", label: "Il Sì", stk: "assets/img/site/485.jpg",
      cards: ["assets/img/nuove/t30-1946176-3.jpg", "assets/img/nuove/img-7615.jpg"], alts: ["Sedie per la cerimonia nel prato", "Arco fiorito"],
      chips: ["nel prato fiorito", "tra le colline", "un matrimonio al giorno"],
      txt: "Il prato davanti alla cascina, le colline tutt'intorno: il posto giusto per dirsi sì.",
      bg: "#F59DB0", ink: "#6E1330", title: "#FFE3EA", chip: "#6E1330", sun: "#FFD23F" },
    { top: "L'", big: "Aperitivo", when: "a mezzogiorno", label: "Aperitivo", stk: "assets/img/site/b5302.jpg",
      cards: ["assets/img/site/b3601.jpg", "assets/img/nuove/img-7616.jpg"], alts: ["Aperitivo in giardino sotto gli ombrelloni", "Salumi del territorio"],
      chips: ["in giardino", "sotto gli ombrelloni", "salumi e vini dell'Oltrepò"],
      txt: "Il brindisi in giardino, all'ombra degli ombrelloni, con i sapori del territorio.",
      bg: "#F7A35C", ink: "#5A2400", title: "#FFF0D6", chip: "#5A2400", sun: "#FFD23F" },
    { top: "La", big: "Cena", when: "la sera", label: "La Cena", stk: "assets/img/site/paolo.jpg",
      cards: ["assets/img/site/b4154.jpg", "assets/img/nuove/t30-1946176-1.jpg"], alts: ["Tavoli sotto la tensostruttura", "Tavola apparecchiata con fiori"],
      chips: ["sotto la tensostruttura", "60 – 150 ospiti", "la cucina di Paolo"],
      txt: "Le tavole apparecchiate sotto la tensostruttura e la cucina di casa, dall'orto alla tavola.",
      bg: "#B98BEA", ink: "#2E0B52", title: "#F3E8FF", chip: "#2E0B52", sun: "#FF9F5A" },
    { top: "La", big: "Festa", when: "la notte", label: "La Festa", stk: "assets/img/site/514.jpg",
      cards: ["assets/img/site/508g.jpg", "assets/img/nuove/9642710.jpg"], alts: ["Buffet dei dolci", "Il bacio degli sposi"],
      chips: ["il taglio della torta", "il buffet dei dolci", "balli sotto le stelle"],
      txt: "La torta, la musica, i balli sotto le stelle. E domattina, la colazione in giardino.",
      bg: "#26306E", ink: "#FFE3EA", title: "#FFD23F", chip: "#26306E", sun: "#F4F0DC" }
  ];
  const wSec = $(".wedding");
  const wedding = (() => {
    if (!wSec) return null;
    DAY.forEach(d => [d.stk, ...d.cards].forEach(src => { const i = new Image(); i.src = src; }));
    const pin = $(".wd__pin", wSec), topEl = $(".wd__top", wSec), bigEl = $(".wd__big", wSec);
    const stkBox = $(".wd__stk", wSec), flip = $(".wd__flip", wSec), spin = $(".wd__spin", wSec);
    const cards = $$(".wd__card", wSec), chipsEl = $(".wd__chips", wSec), txtEl = $(".wd__txt", wSec);
    const whenEl = $(".wd__when", wSec), wheel = $(".wd__wheel", wSec);
    const sun = $(".wd__sun", wSec), arc = $(".wd__arc", wSec), stars = $(".wd__stars", wSec);
    const ring = "matrimoni al melo rosso   un solo matrimonio al giorno   ";
    const mkSticker = d => sticker({ img: d.stk, bg: d.title, ink: d.chip, label: d.label, ring });
    let cur = 0, st = null;

    // titolo: ogni lettera in un "ventaglio" (le lettere esterne si aprono e sono più grandi)
    function title(el, text, fan) {
      el.textContent = "";
      const chars = [...text];
      const mid = (chars.length - 1) / 2;
      return chars.map((c, i) => {
        const f = document.createElement("span"); f.className = "wd__fan";
        const ch = document.createElement("span"); ch.className = "hc"; ch.textContent = c === " " ? " " : c;
        f.appendChild(ch); el.appendChild(f);
        const k = chars.length > 1 ? (i - mid) / mid : 0;
        gsap.set(f, { rotation: k * fan, scale: 1 + Math.abs(k) * .16, y: -Math.abs(k) * 6 });
        return ch;
      });
    }
    function fitBig() {
      const W = innerWidth, H = pin.clientHeight || innerHeight, mob = W < 744;
      bigEl.style.setProperty("--fs", "100px");
      const w = bigEl.scrollWidth || 1;
      // come "CREATIVE" di Sweet Tape: la parola sporge bene ai lati e sotto l'adesivo
      const target = W * (mob ? .96 : .8);
      const fs = Math.min(H * (mob ? .24 : .36), target / w * 100);
      bigEl.style.setProperty("--fs", fs + "px");
    }
    function fill(d, i) {
      const tc = title(topEl, d.top, 6), bc = title(bigEl, d.big, d.big.length > 5 ? 12 : 8);
      fitBig();
      chipsEl.innerHTML = d.chips.map(c => `<li>${c}</li>`).join("");
      txtEl.textContent = d.txt;
      whenEl.textContent = d.when;
      cards.forEach((c, k) => { const img = $("img", c); img.src = d.cards[k]; img.alt = d.alts[k]; });
      $$("button", wheel).forEach((b, k) => b.setAttribute("aria-current", k === i ? "true" : "false"));
      return [...tc, ...bc];
    }

    // ruota di adesivi a destra ("roll it!")
    const R = () => Math.min(innerHeight * .3, 260);
    const wheelBtns = DAY.map((d, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.setAttribute("aria-label", d.label);
      b.appendChild(mkSticker(d));
      b.addEventListener("click", () => goTo(i));
      wheel.appendChild(b); return b;
    });
    const wheelRot = { a: 0 };
    function placeWheel() {
      const r = R();
      wheelBtns.forEach((b, i) => {
        const ang = Math.PI + (i - wheelRot.a) * .62;
        const on = Math.max(0, 1 - Math.abs(i - wheelRot.a));
        gsap.set(b, { x: Math.cos(ang) * r + r * .62, y: Math.sin(ang) * r, scale: .72 + on * .45, rotation: (i - wheelRot.a) * 360, opacity: .55 + on * .45, zIndex: Math.round(on * 10) });
      });
    }

    function colors(d, dur) {
      gsap.to(wSec, { "--wbg": d.bg, "--wink": d.ink, "--wtitle": d.title, "--wchip": d.chip, "--wsun": d.sun, duration: dur, ease: "power2.inOut", overwrite: "auto" });
    }

    function show(i, dir = 1) {
      if (i === cur) return;
      const d = DAY[i];
      cur = i;
      const H = innerHeight;
      colors(d, .9);
      gsap.to(wheelRot, { a: i, duration: 1, ease: "back.out(1.4)", onUpdate: placeWheel, overwrite: true });

      // titolo: le lettere vecchie cadono, le nuove saltano su
      const oldChars = $$(".wd__title .hc", wSec);
      const tl = gsap.timeline();
      tl.to(oldChars, { yPercent: 110 * dir, rotation: () => gsap.utils.random(-30, 30), opacity: 0, duration: .32, ease: "power2.in", stagger: .015 }, 0)
        .to([chipsEl, txtEl, whenEl], { opacity: 0, y: 14, duration: .25 }, 0)
        // adesivo: si gira come una moneta e cambia faccia
        .to(flip, { rotationY: 90 * dir, scale: .85, duration: .3, ease: "power2.in" }, 0)
        .add(() => { spin.innerHTML = ""; spin.appendChild(mkSticker(d)); }, .3)
        .fromTo(flip, { rotationY: -90 * dir }, { rotationY: 0, scale: 1, duration: 1.1, ease: "elastic.out(1, .5)", immediateRender: false }, .3)
        .fromTo(spin, { rotation: -360 * dir }, { rotation: 0, duration: 1.3, ease: "back.out(1.2)", immediateRender: false }, 0)   // gira e si ferma dritto
        // foto: si staccano e volano via, ne arrivano altre che si attaccano col nastro
        .to(cards, { y: -H * .9 * dir, rotation: (k) => (k ? 40 : -40) * dir, duration: .42, ease: "power2.in", stagger: .05 }, 0)
        .add(() => {
          const chars = fill(d, i);
          gsap.fromTo(chars, { yPercent: -110 * dir, rotation: () => gsap.utils.random(-25, 25), opacity: 0 },
            { yPercent: 0, rotation: 0, opacity: 1, duration: .9, ease: "back.out(2.2)", stagger: .035 });
          gsap.fromTo(cards, { y: H * .5 * dir, rotation: () => gsap.utils.random(-30, 30), scale: 1.35 },
            { y: 0, rotation: 0, scale: 1, duration: .9, ease: "back.out(1.5)", stagger: .08 });
          gsap.fromTo($$(".wd__card .tape", wSec), { scaleX: 0 }, { scaleX: 1, duration: .35, ease: "power2.out", delay: .55, stagger: .08 });
          gsap.fromTo([whenEl, txtEl], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .5, delay: .15 });
          gsap.set(chipsEl, { opacity: 1, y: 0 });
          gsap.from($$("li", chipsEl), { scale: 0, rotation: -20, duration: .6, ease: "back.out(2.5)", stagger: .07, delay: .2 });
        }, .45);
    }

    function goTo(i) {
      if (!st) { show(i, i > cur ? 1 : -1); return; }
      const y = st.start + (st.end - st.start) * i / (DAY.length - 1);
      M.lenis ? M.lenis.scrollTo(y, { duration: 1.2 }) : scrollTo({ top: y, behavior: "smooth" });
    }

    // stato iniziale
    fill(DAY[0], 0);
    spin.appendChild(mkSticker(DAY[0]));
    colors(DAY[0], 0);
    placeWheel();
    addEventListener("resize", () => { fitBig(); placeWheel(); });
    M.fontsReady.then(fitBig);

    return {
      scenes() {
        const L = arc.getTotalLength();
        const setSun = p => {
          const pt = arc.getPointAtLength(L * p);
          gsap.set(sun, { attr: { cx: pt.x, cy: pt.y } });
          gsap.set(stars, { opacity: gsap.utils.clamp(0, 1, (p - .62) / .3) });
        };
        setSun(0);
        st = ScrollTrigger.create({
          trigger: pin, start: "top top", end: () => "+=" + innerHeight * (DAY.length - 1) * 1.1,
          pin: true, anticipatePin: 1, onToggle: self => self.pin.classList.toggle("is-pinned", self.isActive), 
          onUpdate(self) {
            setSun(self.progress);
            const i = Math.round(self.progress * (DAY.length - 1));
            if (i !== cur) show(i, i > cur ? 1 : -1);
          }
        });
        // entrata: l'adesivo arriva rotolando, le foto si attaccano
        gsap.from(stkBox, { scale: .3, rotation: -360, duration: 1.4, ease: "back.out(1.4)", scrollTrigger: { trigger: wSec, start: "top 60%" } });
        gsap.from(cards, { scale: 1.5, opacity: 0, rotation: () => gsap.utils.random(-25, 25), duration: 1, ease: "back.out(1.6)", stagger: .12, scrollTrigger: { trigger: wSec, start: "top 45%" } });
        gsap.from(".wd__explore", { scale: 0, rotation: -360, duration: 1.1, ease: "back.out(2)", scrollTrigger: { trigger: wSec, start: "top 40%" } });
        gsap.from($$(".wd__title .hc", wSec), { yPercent: 110, opacity: 0, duration: .9, ease: "back.out(2)", stagger: .04, scrollTrigger: { trigger: wSec, start: "top 55%" } });
        // vita continua: l'adesivo gira piano, il bordo del pulsante ruota, le foto ondeggiano
                gsap.to(".wd__explore svg", { rotation: -360, duration: 18, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
        cards.forEach((c, k) => gsap.to($("img", c), { y: k ? 10 : -10, rotation: k ? -2 : 2, duration: 2.6 + k * .4, ease: "sine.inOut", yoyo: true, repeat: -1 }));
        // il mouse sposta leggermente foto e adesivo (profondità)
        if (fine) {
          const qt = (el, prop) => gsap.quickTo(el, prop, { duration: .9, ease: "power3.out" });
          // le foto si spostano solo in orizzontale (in verticale le muovono i cambi di momento)
          const mv = [[stkBox, 14, true], [cards[0], 34], [cards[1], 28], [$(".wd__explore", wSec), 22, true]].map(([el, k, both]) => ({ k, x: qt(el, "x"), y: both ? qt(el, "y") : null }));
          pin.addEventListener("mousemove", e => {
            const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
            mv.forEach(m => { m.x(nx * m.k); m.y && m.y(ny * m.k); });
          });
        }
      }
    };
  })();

  /* ---------------- SCROLL SCENES ---------------- */
  function buildScenes() {
    M.headerScroll();
    if (reduce) { M.footerPhysics(); return; }

    gsap.timeline({ scrollTrigger: { trigger: ".pick", start: "top top", end: "bottom top", scrub: true } })
      .to(".pick__title", { yPercent: -60, ease: "none" }, 0)
      .to(".pick__row", { yPercent: -35, ease: "none" }, 0)
      .to(".pick__item", { rotation: i => (i % 2 ? 25 : -25), ease: "none" }, 0);
    ScrollTrigger.create({ trigger: ".pick", start: "bottom 70%", onEnter: () => activate(null) });

    M.hopInOnScroll(M.hopIns.filter(h => !h.el.closest(".pick")));

    /* STORY */
    gsap.from(".story__big > span", { yPercent: 40, scale: .7, ease: "none", stagger: .1, scrollTrigger: { trigger: ".story", start: "top bottom", end: "top 30%", scrub: true } });
    // cade girando per tutta la discesa (due giri) e atterra dritto alla fine
    gsap.fromTo(".story__drop", { y: 0, rotation: -720 }, { y: () => innerHeight * (M.mobile() ? .55 : 1.1), rotation: 0, ease: "none", scrollTrigger: { trigger: ".story", start: "top 70%", end: "top -60%", scrub: 1 } });
    $$(".story__board [data-speed]").forEach(el => {
      const sp = parseFloat(el.dataset.speed);
      gsap.fromTo(el, { y: 220 * sp }, { y: -220 * sp, rotation: `+=${(sp - 1) * 14}`, ease: "none", scrollTrigger: { trigger: ".story__board", start: "top bottom", end: "bottom top", scrub: true } });
    });
    const inkChars = M.splitChars($(".js-ink"));
    inkChars.forEach(c => c.classList.add("ic"));
    gsap.to(inkChars, { opacity: 1, stagger: .02, ease: "none", scrollTrigger: { trigger: ".kraft", start: "top 75%", end: "bottom 35%", scrub: true } });
    const todo = $$(".note li");
    ScrollTrigger.create({ trigger: ".note", start: "top 60%", end: "+=600", onUpdate: s => todo.forEach((li, i) => li.classList.toggle("done", s.progress > (i + .5) / todo.length)) });
    if (fine) $$(".polaroid, .gift, .note").forEach(el => {
      el.addEventListener("mouseenter", () => gsap.to(el, { scale: 1.06, rotation: `+=${gsap.utils.random(-6, 6)}`, duration: .5, ease: "back.out(3)" }));
      el.addEventListener("mouseleave", () => gsap.to(el, { scale: 1, duration: .6, ease: "elastic.out(1, .5)" }));
    });

    /* WAVE */
    (function wave() {
      const tp = $(".wave textPath"), txt = $(".wave__txt"), svg = $(".wave__svg");
      const below = $(".wave__below"), band = $(".wave__band"), line = $("#wavePath");
      const DESK = { vb: "0 0 1600 420", below: below.getAttribute("d"), band: band.getAttribute("d"), line: line.getAttribute("d") };
      /* Telefono: la fascia è calcolata qui. Linea centrale a onda (sinusoide) e fascia con lo
         STESSO spessore in ogni punto (bordi paralleli presi perpendicolari alla curva), così il
         testo resta sempre esattamente al centro e non esce mai. Le curve sono abbastanza
         morbide rispetto all'altezza delle lettere, così non si accavallano nelle pieghe. */
      function mobileShape() {
        const w = svg.clientWidth || innerWidth, h = svg.clientHeight || innerWidth;
        const VW = 400, VH = Math.round(VW * h / w);          // stesse proporzioni dello schermo: niente lettere deformate
        const fs = parseFloat(getComputedStyle(txt).fontSize) || 56;
        const half = fs * .8;                                   // mezza fascia: testo (circa .36em) + margine
        const A = 52, L = 470, cy = VH * .5, x0 = -90, x1 = VW + 90;
        const f = x => cy + A * Math.sin((x + 60) / L * Math.PI * 2);
        const P = [], T = [], B = [];
        for (let x = x0; x <= x1; x += 2) {
          const y = f(x), d = f(x + .5) - f(x - .5);
          const len = Math.hypot(1, d), nx = d / len, ny = -1 / len;   // normale verso l'alto
          P.push([x, y]); T.push([x + nx * half, y + ny * half]); B.push([x - nx * half, y - ny * half]);
        }
        const pts = a => a.map(([x, y]) => x.toFixed(1) + "," + y.toFixed(1)).join(" L");
        return {
          vb: `0 0 ${VW} ${VH}`,
          line: "M" + pts(P),
          band: "M" + pts(T) + " L" + pts(B.slice().reverse()) + " Z",
          below: "M" + pts(B.map(([x, y]) => [x, y - 2])) + ` L${x1},${VH + 30} L${x0},${VH + 30} Z`,
        };
      }
      let unit = 0, mob = null;
      const fit = () => {
        const m = M.mobile();
        if (m === mob && !m) return;
        mob = m; const S = m ? mobileShape() : DESK;
        svg.setAttribute("viewBox", S.vb);
        below.setAttribute("d", S.below); band.setAttribute("d", S.band); line.setAttribute("d", S.line);
        unit = txt.getComputedTextLength() / 4;
      };
      fit();
      let rw = innerWidth; addEventListener("resize", () => { if (innerWidth !== rw) { rw = innerWidth; fit(); } });
      let off = 0, dir = -1, boost = 0;
      ScrollTrigger.create({ trigger: ".wave", start: "top bottom", end: "bottom top", onUpdate(self) { dir = self.direction > 0 ? -1 : 1; boost = Math.min(Math.abs(self.getVelocity()) / 90, 14); } });
      gsap.ticker.add(() => {
        off += dir * ((mob ? .6 : 1.2) + boost); boost *= .92;
        if (off < -unit) off += unit;
        if (off > 0) off -= unit;
        tp.setAttribute("startOffset", off);
      });
    })();

    /* ROOMS */
    gsap.from(".rooms__stk", { scale: .3, rotation: -360, duration: 1.4, ease: "back.out(1.4)", scrollTrigger: { trigger: ".rooms__stage", start: "top 70%" } });
    gsap.from(".rooms__card", { scale: 0, duration: 1, ease: "back.out(2)", stagger: .1, scrollTrigger: { trigger: ".rooms__stage", start: "top 60%" } });
    gsap.from(".rooms__word .wl", { yPercent: 110, duration: .9, ease: "back.out(1.6)", stagger: .04, scrollTrigger: { trigger: ".rooms__stage", start: "top 70%" } });
    gsap.from(".roundbtn, .rooms__info, .rooms__nav, .rooms__more", { y: 50, opacity: 0, duration: .9, ease: "back.out(2)", stagger: .1, scrollTrigger: { trigger: ".rooms__stage", start: "top 55%" } });

    /* MOMENTS · tela gigante (come Sweet Tape)
       Le parole stanno su altezze diverse (alta, bassa, alta, bassa) e la
       "telecamera" va verso di loro: scende dal titolo alla prima parola,
       corre a destra lungo la parola, poi va in diagonale verso la successiva. */
    (() => {
      const pin = $(".moments__pin"), cv = $(".gcanvas"), title = $(".gtitle");
      const rows = $$(".grow"), arrows = $$(".garrow");
      if (!pin || !rows.length) return;
      // lettere singole dentro una "finestra": salgono dal basso quando arriva la telecamera
      const rowChars = rows.map(r => $$(".gw", r).flatMap(w => {
        const txt = w.textContent; w.textContent = "";
        return [...txt].map(ch => {
          const clip = document.createElement("span"); clip.className = "gclip";
          const c = document.createElement("span"); c.className = "gch"; c.textContent = ch;
          clip.appendChild(c); w.appendChild(clip); return c;
        });
      }));
      const props = rows.map(r => $$(".gprop", r).map(el => ({ el, pp: parseFloat(el.dataset.pp) || 0, stk: el.classList.contains("gprop--stk"), cx: 0 })));
      const arrowPaths = arrows.map(a => $$("path", a).map(path => { const L = path.getTotalLength(); gsap.set(path, { strokeDasharray: L, strokeDashoffset: L }); return { path, L }; }));
      gsap.set(rowChars.flat(), { yPercent: 135 });
      rows.forEach(r => {
        gsap.set($$(".gprop", r), { scale: 0 });
        gsap.set($(".gslot", r), { scale: 0, rotation: -24 });
        gsap.set([$(".gnote", r), $(".giant__n", r)], { opacity: 0, y: 30 });
        gsap.set($$(".gchips li", r), { scale: 0 });
      });

      let W = 0, H = 0, rowH = 0, R = [], A = [], K = [];
      function layout() {
        W = pin.clientWidth; H = pin.clientHeight;
        const fs = parseFloat(getComputedStyle($(".giant", rows[0])).fontSize);
        const mob = W < 744;
        rowH = rows[0].offsetHeight;
        const drop = fs * 1.23;                 // dislivello tra parola alta e bassa
        const gap = fs * (mob ? 1.05 : .9);     // spazio tra una parola e la successiva
        const y0 = H * (mob ? .74 : .8);        // la prima parola spunta in basso all'inizio
        gsap.set(title, { x: 0, y: H * .42 - title.offsetHeight / 2 });
        let x = W * (mob ? .03 : .045);
        /* telefono: foto, adesivi e nota scritta a mano non vanno MAI sopra le lettere.
           Si spargono lungo la parola, alternati sopra e sotto, con un po' di aria. */
        rows.forEach(r => {
          const items = [$(".gnote", r), ...$$(".gprop", r)].filter(Boolean);   // la nota (larga) per prima, sopra all'inizio
          if (!mob) { items.forEach(el => { el.style.left = el.style.top = ""; }); return; }
          const w = r.offsetWidth, n = items.length;
          items.forEach((el, k) => {
            const ew = el.offsetWidth, eh = el.offsetHeight;
            const cx = gsap.utils.clamp(w * .06, Math.max(w * .06, w * .9 - ew), (k + .5) / n * w - ew / 2);   // lontano dalle estremità: lì passano le frecce
            const up = k % 2 === 0;
            el.style.left = cx + "px";
            el.style.top = (up ? -eh - rowH * .14 : rowH * 1.14) + "px";
          });
        });
        props.flat().forEach(p => { p.cx = p.el.offsetLeft + p.el.offsetWidth / 2; });   // centro dell'adesivo nella sua riga
        R = rows.map((r, i) => {
          const y = y0 + (i % 2 ? drop : 0), w = r.offsetWidth;
          gsap.set(r, { x, y });
          const o = { x, y, w }; x += w + gap; return o;
        });
        A = arrows.map((ar, i) => {
          const a = R[i], b = R[i + 1], aw = ar.getBoundingClientRect().width;
          const ax = a.x + a.w + (gap - aw) / 2, ay = (a.y + b.y) / 2 + rowH * .5 - aw * .33;
          gsap.set(ar, { x: ax, y: ay });
          return { x: ax, w: aw };
        });
        const lead = W * (mob ? .03 : .045), tail = W * (mob ? .92 : .72);
        K = [{ x: 0, y: 0 }];
        R.forEach(r => {
          const cy = r.y + rowH / 2 - H / 2, sx = r.x - lead;
          K.push({ x: sx, y: cy }, { x: Math.max(sx, r.x + r.w - tail), y: cy });
        });
        render();
      }
      const cam = { x: 0, y: 0 };
      const done = rows.map(() => false);
      function reveal(i) {
        done[i] = true;
        const r = rows[i];
        gsap.to(rowChars[i], { yPercent: 0, duration: 1, ease: "power4.out", stagger: .05 });
        gsap.to($(".gslot", r), { scale: 1, rotation: 0, duration: 1.3, ease: "elastic.out(1, .6)", delay: .15 });
        gsap.to($$(".gprop", r), { scale: 1, duration: 1, ease: "back.out(1.7)", stagger: .09, delay: .25 });
        gsap.to([$(".giant__n", r), $(".gnote", r)], { opacity: 1, y: 0, duration: .8, ease: "back.out(2)", stagger: .1, delay: .35 });
        gsap.to($$(".gchips li", r), { scale: 1, duration: .6, ease: "back.out(2.5)", stagger: .07, delay: .5 });
      }
      function render() {
        gsap.set(cv, { x: -cam.x, y: -cam.y });
        R.forEach((r, i) => {
          const rel = cam.x - r.x;
          // gli adesivi girano mentre passano e sono dritti quando arrivano al centro dello schermo
          props[i].forEach(p => gsap.set(p.el, p.stk ? { x: rel * p.pp, rotation: (cam.x + W / 2 - (r.x + p.cx)) / W * 200 } : { x: rel * p.pp }));
          if (!done[i] && cam.x + W > r.x + W * .12 && cam.y + H > r.y + rowH * .35) reveal(i);
        });
        A.forEach((a, i) => {
          const pr = gsap.utils.clamp(0, 1, (cam.x + W * .85 - a.x) / (a.w * 1.4));
          arrowPaths[i].forEach(({ path, L }, k) => gsap.set(path, { strokeDashoffset: L * (1 - gsap.utils.clamp(0, 1, k ? pr * 3 - 2 : pr * 1.4)) }));
        });
      }
      layout();
      M.fontsReady.then(() => { layout(); ScrollTrigger.refresh(); });
      ScrollTrigger.addEventListener("refreshInit", layout);
      const segLen = i => Math.hypot(K[i + 1].x - K[i].x, K[i + 1].y - K[i].y);
      const total = () => K.slice(1).reduce((s, k, i) => s + segLen(i), 0) * .85;
      const tl = gsap.timeline({
        defaults: { ease: "none" }, onUpdate: render,
        scrollTrigger: { trigger: pin, start: "top top", end: () => "+=" + total(), pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1, onToggle: self => self.pin.classList.toggle("is-pinned", self.isActive) }
      });
      for (let i = 0; i < K.length - 1; i++) {
        tl.fromTo(cam, { x: () => K[i].x, y: () => K[i].y }, { x: () => K[i + 1].x, y: () => K[i + 1].y, duration: Math.max(1, segLen(i)), immediateRender: false });
      }
      hScroll = tl;
    })();

    /* WEDDING · la giornata */
    wedding && wedding.scenes();

    /* CTA */
    gsap.from(".cta__blob", { scale: .4, rotation: -30, duration: 1.4, ease: "elastic.out(1, .6)", scrollTrigger: { trigger: ".cta", start: "top 70%" } });
    gsap.from(".cta__card", { scale: .4, rotation: 20, duration: 1.4, ease: "elastic.out(1, .6)", delay: .1, scrollTrigger: { trigger: ".cta", start: "top 70%" } });
    gsap.to(".cta__blob", { borderRadius: "56% 44% 38% 62% / 42% 58% 42% 58%", duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.from(".cta__btns .pill", { scale: 0, duration: .7, ease: "back.out(3)", stagger: .08, scrollTrigger: { trigger: ".cta__btns", start: "top 92%" } });

    ScrollTrigger.create({ trigger: ".foot", start: "top 80%", onEnter: () => activate(null) });
    M.footerPhysics();
    ScrollTrigger.refresh();
  }
})();

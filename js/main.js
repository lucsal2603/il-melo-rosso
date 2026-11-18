/* =========================================================
   IL MELO ROSSO — HOME · "Scegli il tuo momento"
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
    it.addEventListener("focus", () => activate(it));
    it.addEventListener("click", () => M.go(P[it.dataset.player].url));
  });
  $(".pick__row").addEventListener("mouseleave", () => activate(null));

  /* ---------------- HORIZONTAL TARGETS ---------------- */
  let hScroll = null;

  /* ---------------- LOADER / INTRO ---------------- */
  const heroChars = M.hopIns.filter(h => h.el.closest(".pick")).flatMap(h => h.chars);
  if (!reduce) {
    gsap.set(heroChars, { yPercent: -160, rotation: () => gsap.utils.random(-40, 40), opacity: 0 });
    gsap.set(".pick__item", { yPercent: 160, rotation: -300 });
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
    gsap.timeline()
      .to(".loader__logo", { scale: 1, duration: .9, ease: "elastic.out(1, .45)" })
      .to(".loader__logo", { rotation: 360, duration: .9, ease: "back.inOut(1.6)" }, "+=.15")
      .to(".loader__logo", { scale: 0, duration: .35, ease: "back.in(2)" })
      .add(() => M.reveal(after), "-=.1");
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
    const roll = D / (Math.PI * d) * 360;          // rotola come una ruota
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
  (function swipe() {
    let sx = null;
    rStage.addEventListener("pointerdown", e => { if (!e.target.closest("a,button")) sx = e.clientX; });
    rStage.addEventListener("pointerup", e => {
      if (sx == null) return;
      const d = e.clientX - sx; sx = null;
      if (Math.abs(d) > 50) goRoom(rI + (d < 0 ? 1 : -1), d < 0 ? 1 : -1);
    });
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
    gsap.from(".story__big span", { yPercent: 40, scale: .7, ease: "none", stagger: .1, scrollTrigger: { trigger: ".story", start: "top bottom", end: "top 30%", scrub: true } });
    gsap.fromTo(".story__drop", { y: 0, rotation: -20 }, { y: () => innerHeight * 1.1, rotation: 340, ease: "none", scrollTrigger: { trigger: ".story", start: "top 70%", end: "top -60%", scrub: 1 } });
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
      const tp = $(".wave textPath"), txt = $(".wave__txt");
      const unit = txt.getComputedTextLength() / 4;
      let off = 0, dir = -1, boost = 0;
      ScrollTrigger.create({ trigger: ".wave", start: "top bottom", end: "bottom top", onUpdate(self) { dir = self.direction > 0 ? -1 : 1; boost = Math.min(Math.abs(self.getVelocity()) / 90, 14); } });
      gsap.ticker.add(() => {
        off += dir * (1.2 + boost); boost *= .92;
        if (off < -unit) off += unit;
        if (off > 0) off -= unit;
        tp.setAttribute("startOffset", off);
      });
      gsap.fromTo(".wave__stk", { rotation: -90, scale: .5 }, { rotation: 200, scale: 1, ease: "none", scrollTrigger: { trigger: ".wave", start: "top bottom", end: "bottom top", scrub: true } });
    })();

    /* ROOMS */
    gsap.from(".rooms__stk", { scale: .3, rotation: -240, duration: 1.4, ease: "back.out(1.4)", scrollTrigger: { trigger: ".rooms__stage", start: "top 70%" } });
    gsap.from(".rooms__card", { scale: 0, duration: 1, ease: "back.out(2)", stagger: .1, scrollTrigger: { trigger: ".rooms__stage", start: "top 60%" } });
    gsap.from(".rooms__word .wl", { yPercent: 110, duration: .9, ease: "back.out(1.6)", stagger: .04, scrollTrigger: { trigger: ".rooms__stage", start: "top 70%" } });
    gsap.from(".roundbtn, .rooms__info, .rooms__nav, .rooms__more", { y: 50, opacity: 0, duration: .9, ease: "back.out(2)", stagger: .1, scrollTrigger: { trigger: ".rooms__stage", start: "top 55%" } });

    /* MOMENTS horizontal */
    const track = $(".moments__track");
    const dist = () => track.scrollWidth - innerWidth;
    // le parole seguono un'onda: salgono leggermente e poi riscendono andando a destra
    const panels = $$(".mpanel");
    const wordsEls = panels.map(p => $(".mpanel__words", p));
    const waveY = () => innerHeight * .09;
    hScroll = gsap.to(track, {
      x: () => -dist(), ease: "none",
      onUpdate() {
        const x = -gsap.getProperty(track, "x");
        panels.forEach((p, i) => {
          // fase 0..1 del pannello rispetto al centro dello schermo
          const ph = (x + innerWidth / 2 - p.offsetLeft) / p.offsetWidth;
          const k = Math.max(-.6, Math.min(1.6, ph));
          gsap.set(wordsEls[i], { y: -Math.sin(k * Math.PI) * waveY(), rotation: -Math.cos(k * Math.PI) * 2.4 });
        });
      },
      scrollTrigger: { trigger: ".moments__pin", start: "top top", end: () => "+=" + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 }
    });
    $$(".mpanel").forEach(p => {
      const ca = { containerAnimation: hScroll };
      $$(".mpanel__stk", p).forEach((s, i) => {
        gsap.fromTo(s, { rotation: -180, scale: .4 }, { rotation: 120 * (i ? -1 : 1), scale: 1, ease: "none", scrollTrigger: { trigger: p, ...ca, start: "left right", end: "right left", scrub: true } });
        gsap.fromTo(s, { y: 120 }, { y: -60, ease: "none", scrollTrigger: { trigger: p, ...ca, start: "left right", end: "right left", scrub: true } });
      });
      // foto grandi che coprono in parte il testo, a velocità diverse
      $$(".mpanel__pic", p).forEach((pic, k) => {
        const sp = [1, -.7, 1.3][k];
        gsap.fromTo(pic, { x: innerWidth * .18 * sp, y: 60 * sp, rotation: -14 * sp, scale: .7 },
          { x: -innerWidth * .12 * sp, y: -50 * sp, rotation: 8 * sp, scale: 1, ease: "none", scrollTrigger: { trigger: p, ...ca, start: "left right", end: "right left", scrub: true } });
      });
      gsap.fromTo($(".mpanel__img", p), { rotation: -22, scale: .6 }, { rotation: 6, scale: 1.05, ease: "none", scrollTrigger: { trigger: p, ...ca, start: "left right", end: "center center", scrub: true } });
      const sc = $(".scribble", p);
      if (sc) $$("path", sc).forEach(path => {
        const L = path.getTotalLength();
        gsap.fromTo(path, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: p, ...ca, start: "left 70%", end: "center 40%", scrub: true } });
      });
      gsap.from($$(".mpanel__chips li", p), { scale: 0, rotation: -20, duration: .6, ease: "back.out(2.5)", stagger: .08, scrollTrigger: { trigger: p, ...ca, start: "left 55%" } });
      gsap.from([$(".mpanel__n", p), $(".mpanel__hand", p)], { y: 40, opacity: 0, duration: .8, ease: "back.out(2)", stagger: .1, scrollTrigger: { trigger: p, ...ca, start: "left 60%" } });
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

    ScrollTrigger.create({ trigger: ".foot", start: "top 80%", onEnter: () => activate(null) });
    M.footerPhysics();
    ScrollTrigger.refresh();
  }
})();

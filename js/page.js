/* =========================================================
   IL MELO ROSSO — pagine interne (cucina, camere, ...)
   stile scheda prodotto Sweet Tape · usa js/core.js
   ========================================================= */
(() => {
  "use strict";
  const M = window.Melo;
  if (!M) return;
  const { $, $$, reduce, fine, sticker, P } = M;
  const me = P[document.body.dataset.page];

  /* ---------- sticker delle varianti ---------- */
  $$(".ps__stk").forEach(h => {
    const d = JSON.parse(h.dataset.sib);
    h.appendChild(sticker({ img: d.img, bg: me.bg, ink: me.ink, label: d.label, ring: me.ring }));
  });

  /* ---------- lightbox galleria ---------- */
  const lb = $(".lightbox"), lbImg = lb && $("img", lb);
  function openLb(img) {
    lbImg.src = img.currentSrc || img.src; lbImg.alt = img.alt;
    lb.classList.add("is-open"); lb.setAttribute("aria-hidden", "false");
    M.lenis && M.lenis.stop();
  }
  function closeLb() {
    if (!lb.classList.contains("is-open")) return;
    lb.classList.remove("is-open"); lb.setAttribute("aria-hidden", "true");
    M.lenis && M.lenis.start();
  }
  if (lb) {
    lb.addEventListener("click", closeLb);
    addEventListener("keydown", e => { if (e.key === "Escape") closeLb(); });
    $$(".pq__strip figure, .pq__img, .pd__card").forEach(f => f.addEventListener("click", () => openLb($("img", f))));
  }

  /* ---------- scramble testo ---------- */
  const GLYPHS = "ABCDEFGHILMNOPRSTUVZ!?*";
  function scramble(el) {
    const final = el.dataset.text;
    const o = { p: 0 };
    el.dataset.nohop = "1";       // mentre si mescola non dividiamo le lettere
    gsap.to(o, {
      p: 1, duration: .7, ease: "none", overwrite: true,
      onUpdate() {
        el.textContent = [...final].map((c, i) => (c === " " || i / final.length < o.p) ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]).join("");
      },
      onComplete() { el.textContent = final; delete el.dataset.nohop; M.letters(el); }
    });
  }

  /* ---------- intro ---------- */
  const heroChars = M.hopIns.filter(h => h.el.closest(".ph")).flatMap(h => h.chars);
  if (!reduce) {
    gsap.set(heroChars, { yPercent: -160, rotation: () => gsap.utils.random(-40, 40), opacity: 0 });
    gsap.set(".ph__stk", { scale: 0, rotation: -22 });
    gsap.set(".ph__pill, .ph__hand", { opacity: 0, y: 20 });
    gsap.set(".ph__hill", { yPercent: 40 });
    gsap.set(".hdr__claim, .hdr__logo, .tag", { opacity: 0 });
  }
  function intro() {
    gsap.timeline()
      .to(".ph__hill", { yPercent: 0, duration: 1.2, ease: "expo.out" }, 0)
      .to(heroChars, { yPercent: 0, rotation: 0, opacity: 1, duration: 1, ease: "back.out(2.2)", stagger: { each: .04, from: "random" } }, .05)
      .to(".ph__stk", { scale: 1, rotation: 0, duration: 1.4, ease: "back.out(1.5)" }, .25)
      .to(".ph__pill", { opacity: 1, y: 0, duration: .7, ease: "back.out(3)" }, .4)
      .to(".ph__hand", { opacity: 1, y: 0, duration: .8, ease: "back.out(2)" }, .9)
      .to(".hdr__claim, .hdr__logo", { opacity: 1, duration: .6 }, .5)
      .fromTo(".tag", { y: -110, opacity: 1 }, { y: 0, duration: 1.4, ease: "elastic.out(1, .45)" }, .7);
  }
  M.fontsReady.then(() => { build(); M.reveal(() => { M.jumpToHash(); intro(); }); });

  /* ---------- scene ---------- */
  function build() {
    M.headerScroll();
    if (reduce) { M.footerPhysics(); return; }

    M.hopInOnScroll(M.hopIns.filter(h => !h.el.closest(".ph")));

    /* HERO → lo sticker rotola fino alla descrizione */
    const stk = $(".ph__stk"), land = $(".pd__land");
    const docBox = el => { const r = el.getBoundingClientRect(); return { x: r.left + scrollX + r.width / 2, y: r.top + scrollY + r.height / 2, w: r.width }; };
    let from = null, to = null;
    const measure = () => {
      gsap.set(stk, { x: 0, y: 0, scale: 1, rotation: 0 });
      from = docBox(stk); to = docBox(land);
    };
    measure();
    ScrollTrigger.addEventListener("refreshInit", measure);
    gsap.timeline({ scrollTrigger: { trigger: ".ph", start: "top top", endTrigger: ".pd", end: "center 55%", scrub: 1, invalidateOnRefresh: true } })
      .to(stk, { x: () => to.x - from.x, y: () => to.y - from.y, scale: () => to.w / from.w, rotation: 0, ease: "power1.inOut" }, 0)
      .to(".ph__title", { yPercent: -55, ease: "none", duration: .45 }, 0)
      .to(".ph__hand, .ph__pill", { opacity: 0, y: -40, ease: "none", duration: .25 }, 0);

    /* DESCRIZIONE */
    gsap.fromTo(".pd__card", { rotation: -24, scale: .5, y: 120 }, { rotation: -7, scale: 1, y: 0, ease: "back.out(1.6)", duration: 1.2, scrollTrigger: { trigger: ".pd", start: "top 75%" } });
    const ink = M.splitChars($(".js-ink"));
    ink.forEach(c => c.classList.add("ic"));
    gsap.to(ink, { opacity: 1, stagger: .02, ease: "none", scrollTrigger: { trigger: ".pd__txt", start: "top 80%", end: "bottom 45%", scrub: true } });
    gsap.from(".pd__chips li", { scale: 0, rotation: -20, duration: .6, ease: "back.out(2.5)", stagger: .07, scrollTrigger: { trigger: ".pd__chips", start: "top 90%" } });
    gsap.from(".pd__right .pill", { scale: 0, duration: .7, ease: "back.out(3)", scrollTrigger: { trigger: ".pd__chips", start: "top 88%" } });
    $$(".pd__scribble path").forEach(path => {
      const L = path.getTotalLength();
      gsap.fromTo(path, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: ".pd__right", start: "top 60%", end: "bottom 50%", scrub: true } });
    });

    /* VARIANTI */
    gsap.from(".ps__card", {
      y: 220, rotation: () => gsap.utils.random(-30, 30), scale: .5, opacity: 0,
      duration: 1.2, ease: "back.out(1.5)", stagger: .1,
      scrollTrigger: { trigger: ".ps__row", start: "top 85%" }
    });
    $$(".ps__card").forEach(card => {
      const s = $(".stk", card);
      gsap.fromTo(s, { rotation: -20 }, { rotation: 0, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "center 55%", scrub: true } });
      if (!fine) return;
      card.addEventListener("mouseenter", () => { gsap.to(card, { scale: 1.06, rotation: `+=${gsap.utils.random(-5, 5)}`, duration: .5, ease: "back.out(3)" }); gsap.fromTo(s, { rotation: -16 }, { rotation: 0, duration: 1, ease: "elastic.out(1.2, .35)" }); });
      card.addEventListener("mouseleave", () => gsap.to(card, { scale: 1, duration: .7, ease: "elastic.out(1, .5)" }));
    });

    /* SUPERPOTERI (pin + card che scorrono) */
    (function powers() {
      const cards = $$(".pw__card"), track = $(".pw__track");
      if (!cards.length) return;
      // prisma 3D: le schede + facce decorative fino a chiudere il solido (6 facce = 60° l'una)
      const FACES = Math.max(6, cards.length + 2), STEP = 360 / FACES;
      for (let k = cards.length; k < FACES; k++) {
        const g = document.createElement("div");
        g.className = "pw__card pw__card--ghost"; g.setAttribute("aria-hidden", "true");
        track.appendChild(g);
      }
      const faces = $$(".pw__card", track);
      let RAD = 0;
      const build = () => {
        RAD = track.offsetHeight / 2 / Math.tan(Math.PI / FACES);     // distanza delle facce dall'asse
        faces.forEach((f, i) => { f.style.transform = `rotateX(${-i * STEP}deg) translateZ(${RAD}px)`; });
      };
      // ombreggiatura: le facce che si girano verso l'alto o il basso diventano più scure
      const shade = () => {
        const rot = gsap.getProperty(track, "rotationX");
        faces.forEach((f, i) => {
          const a = (-i * STEP + rot) * Math.PI / 180;
          f.style.filter = `brightness(${(.62 + .38 * Math.max(0, Math.cos(a))).toFixed(3)})`;
        });
      };
      build();
      gsap.set(track, { yPercent: -50, z: -RAD, rotationX: 0 });
      shade();
      ScrollTrigger.addEventListener("refreshInit", () => { build(); gsap.set(track, { z: -RAD }); });
      let active = -1;
      const setActive = i => {
        if (i === active) return;
        active = i;
        cards.forEach((c, k) => c.classList.toggle("is-on", k === i));
        scramble($(".pw__h", cards[i]));
        gsap.fromTo($(".pw__icon", cards[i]), { scale: .4, rotation: -40 }, { scale: 1, rotation: 0, duration: .8, ease: "back.out(3)" });
      };
      setActive(0);
      gsap.to(track, {
        rotationX: STEP * (cards.length - 1), z: () => -RAD, ease: "none", onUpdate: shade,
        scrollTrigger: {
          trigger: ".pw__pin", start: "top top", end: () => "+=" + innerHeight * .8 * cards.length,
          pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
          snap: { snapTo: 1 / (cards.length - 1), duration: { min: .2, max: .6 }, ease: "power2.inOut" },
          onUpdate: self => setActive(Math.round(self.progress * (cards.length - 1)))
        }
      });
      gsap.from(".pw__side--l", { xPercent: -120, rotation: -12, ease: "none", scrollTrigger: { trigger: ".pw", start: "top bottom", end: "top top", scrub: true } });
      gsap.from(".pw__side--r", { xPercent: 120, rotation: 12, ease: "none", scrollTrigger: { trigger: ".pw", start: "top bottom", end: "top top", scrub: true } });
    })();

    /* FRASE + GALLERIA */
    gsap.fromTo(".pq__img", { scale: .7, rotation: 8, borderRadius: "200px" }, { scale: 1, rotation: -2, borderRadius: "44px", ease: "none", scrollTrigger: { trigger: ".pq__row", start: "top bottom", end: "center center", scrub: true } });
    gsap.from(".pq__tape", { scale: 2.2, opacity: 0, rotation: "+=40", duration: .7, ease: "back.out(2)", stagger: .2, scrollTrigger: { trigger: ".pq__row", start: "top 45%" } });
    gsap.fromTo(".pq__stk", { rotation: -20, scale: .3 }, { rotation: 0, scale: 1, ease: "none", scrollTrigger: { trigger: ".pq__row", start: "top bottom", end: "bottom 40%", scrub: true } });
    gsap.fromTo(".pq__strip", { x: () => innerWidth * .25 }, { x: () => -($(".pq__strip").scrollWidth - innerWidth * .75), ease: "none", scrollTrigger: { trigger: ".pq__strip", start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true } });

    /* PROSSIMA TAPPA */
    gsap.fromTo(".pn__stk", { rotation: -12, scale: .4 }, { rotation: 0, scale: 1, ease: "none", scrollTrigger: { trigger: ".pn", start: "top bottom", end: "center 60%", scrub: true } });
    gsap.from(".pn__title", { yPercent: 60, scale: .8, ease: "none", scrollTrigger: { trigger: ".pn", start: "top bottom", end: "top 30%", scrub: true } });
    if (fine) {
      const link = $(".pn__link");
      link.addEventListener("mouseenter", () => gsap.to(".pn__stk", { scale: 1.15, rotation: "+=25", duration: .6, ease: "back.out(3)" }));
      link.addEventListener("mouseleave", () => gsap.to(".pn__stk", { scale: 1, rotation: "-=25", duration: .7, ease: "elastic.out(1, .5)" }));
    }

    M.footerPhysics();
    ScrollTrigger.refresh();
  }
})();

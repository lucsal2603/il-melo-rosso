/* IL MELO ROSSO · pagine interne */
(() => {
  "use strict";
  const M = window.Melo;
  if (!M) return;
  const { $, $$, reduce, fine, sticker, P } = M;
  const me = P[document.body.dataset.page];

  /* ---------------- sticker delle varianti ---------------- */
  $$(".ps__stk").forEach(h => {
    const d = JSON.parse(h.dataset.sib);
    h.appendChild(sticker({ img: d.img, bg: me.bg, ink: me.ink, label: d.label, ring: me.ring }));
  });

  /* ---------------- lightbox galleria ---------------- */
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
    $$(".pq__img, .pd__card").forEach(f => f.addEventListener("click", () => openLb($("img", f))));

    $(".pq__strip")?.addEventListener("click", e => { const f = e.target.closest("figure"); if (f) openLb($("img", f)); });
  }

  /* ---------------- scramble testo ---------------- */
  const GLYPHS = "ABCDEFGHILMNOPRSTUVZ!?*";
  function scramble(el) {
    const final = el.dataset.text;
    const o = { p: 0 };
    el.dataset.nohop = "1";
    gsap.to(o, {
      p: 1, duration: .7, ease: "none", overwrite: true,
      onUpdate() {
        el.textContent = [...final].map((c, i) => (c === " " || i / final.length < o.p) ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]).join("");
      },
      onComplete() { el.textContent = final; delete el.dataset.nohop; M.letters(el); }
    });
  }

  /* ---------------- intro ---------------- */
  const heroChars = M.hopIns.filter(h => h.el.closest(".ph")).flatMap(h => h.chars);
  if (!reduce) {
    gsap.set(heroChars, { yPercent: -160, rotation: () => gsap.utils.random(-40, 40), opacity: 0 });
    gsap.set(".ph__stk", { scale: 0, rotation: -360 });
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

  /* ---------------- scene ---------------- */
  function build() {
    M.headerScroll();
    if (reduce) { M.footerPhysics(); return; }

    M.hopInOnScroll(M.hopIns.filter(h => !h.el.closest(".ph")));

    /* HERO */
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
      .to(stk, { x: () => to.x - from.x, y: () => to.y - from.y, scale: () => to.w / from.w, rotation: 720, ease: "power1.inOut" }, 0)
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

      gsap.fromTo(s, { rotation: -360 }, { rotation: 0, duration: 1.4, ease: "back.out(1.3)", scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none reverse" } });
      if (!fine) return;
      card.addEventListener("mouseenter", () => { gsap.to(card, { scale: 1.06, rotation: `+=${gsap.utils.random(-5, 5)}`, duration: .5, ease: "back.out(3)" }); gsap.fromTo(s, { rotation: -360 }, { rotation: 0, duration: 1, ease: "back.out(1.4)" }); });
      card.addEventListener("mouseleave", () => gsap.to(card, { scale: 1, duration: .7, ease: "elastic.out(1, .5)" }));
    });

    /* SUPERPOTERI */
    (function powers() {
      const cards = $$(".pw__card"), track = $(".pw__track");
      if (!cards.length) return;

      const FACES = Math.max(6, cards.length + 2), STEP = 360 / FACES;

      const n = cards.length;
      for (let k = n; k < FACES; k++) {
        const idx = (k - n < (FACES - n) / 2) ? (k - n) % n : (n - (FACES - k) % n) % n;
        const g = cards[idx].cloneNode(true);
        g.classList.remove("is-on"); g.classList.add("pw__card--copy"); g.setAttribute("aria-hidden", "true");
        track.appendChild(g);
      }
      const faces = $$(".pw__card", track);
      let RAD = 0;
      const build = () => {
        RAD = track.offsetHeight / 2 / Math.tan(Math.PI / FACES);
        faces.forEach((f, i) => { f.style.transform = `rotateX(${-i * STEP}deg) translateZ(${RAD}px)`; });
      };

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
          pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1, onToggle: self => self.pin.classList.toggle("is-pinned", self.isActive),
          onUpdate: self => setActive(Math.round(self.progress * (cards.length - 1)))
        }
      });
      gsap.from(".pw__side--l", { xPercent: -120, rotation: -12, ease: "none", scrollTrigger: { trigger: ".pw", start: "top bottom", end: "top top", scrub: true } });
      gsap.from(".pw__side--r", { xPercent: 120, rotation: 12, ease: "none", scrollTrigger: { trigger: ".pw", start: "top bottom", end: "top top", scrub: true } });
    })();

    /* FRASE + GALLERIA */
    gsap.fromTo(".pq__img", { scale: .7, rotation: 8, borderRadius: "200px" }, { scale: 1, rotation: -2, borderRadius: "44px", ease: "none", scrollTrigger: { trigger: ".pq__row", start: "top bottom", end: "center center", scrub: true } });
    gsap.from(".pq__tape", { scale: 2.2, opacity: 0, rotation: "+=40", duration: .7, ease: "back.out(2)", stagger: .2, scrollTrigger: { trigger: ".pq__row", start: "top 45%" } });
    gsap.fromTo(".pq__stk", { rotation: -360, scale: .3 }, { rotation: 0, scale: 1, duration: 1.4, ease: "back.out(1.3)", scrollTrigger: { trigger: ".pq__stk", start: "top 85%", toggleActions: "play none none reverse" } });

    (function strip() {
      const el = $(".pq__strip");
      if (!el || !el.children.length) return;
      const orig = [...el.children];
      const clone = f => { const c = f.cloneNode(true); c.setAttribute("aria-hidden", "true"); $("img", c).alt = ""; return c; };

      if (orig.length % 2) orig.forEach(f => el.appendChild(clone(f)));
      const unit = [...el.children];
      unit.forEach(f => el.appendChild(clone(f)));
      let set = 0;
      const fill = () => {
        set = el.children[unit.length].offsetLeft - el.children[0].offsetLeft;
        while (el.scrollWidth < innerWidth * 2 + set * 2) unit.forEach(f => el.appendChild(clone(f)));
      };
      fill();
      let off = 0, boost = 0, dir = 1, on = false;
      ScrollTrigger.create({
        trigger: el, start: "top bottom", end: "bottom top",
        onToggle: s => { on = s.isActive; },
        onUpdate: s => { boost = Math.min(16, Math.abs(s.getVelocity()) / 140); dir = s.direction || dir; },
        onRefresh: fill
      });
      gsap.ticker.add(() => {
        if (!on || !set) return;
        off += (.7 + boost) * dir; boost *= .93;
        off = ((off % set) + set) % set;
        gsap.set(el, { x: -off - set });
      });
      gsap.set(el, { x: -set });
    })();

    /* PROSSIMA TAPPA */
    gsap.fromTo(".pn__stk", { rotation: -360, scale: .4 }, { rotation: 0, scale: 1, duration: 1.4, ease: "back.out(1.3)", scrollTrigger: { trigger: ".pn__stk", start: "top 85%", toggleActions: "play none none reverse" } });
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

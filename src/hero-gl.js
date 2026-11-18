/* =========================================================
   IL MELO ROSSO — WebGL photo wheel (hero)
   Photos sit on a 3D ring that turns with scroll.
   Scroll velocity bends the cards and splits RGB.
   Build:  npx esbuild src/hero-gl.js --bundle --minify --format=iife --global-name=MeloGL --outfile=js/hero-gl.min.js
   ========================================================= */
import {
  WebGLRenderer, Scene, PerspectiveCamera, PlaneGeometry, ShaderMaterial,
  Mesh, TextureLoader, LinearFilter, Raycaster, Vector2, Group
} from "three";

const vert = /* glsl */`
  uniform float uVel;
  uniform float uHover;
  uniform float uTime;
  uniform float uSeed;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    float wave = sin(uv.x * 3.14159);
    p.z += wave * uVel * 0.85;                         // bend with speed
    p.y += sin(uv.x * 3.14159 + uTime * 2.0 + uSeed) * uVel * 0.2;
    p.z += sin(uv.y * 3.14159) * uHover * 0.12;       // puff on hover
    p.z += sin(uv.x * 6.0 + uTime * 1.3 + uSeed) * 0.012; // idle breathing
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const frag = /* glsl */`
  uniform sampler2D uTex;
  uniform float uImgAspect;
  uniform float uPlaneAspect;
  uniform float uAlpha;
  uniform float uVel;
  uniform float uHover;
  uniform float uShade;
  uniform float uReveal;
  varying vec2 vUv;

  float sdRound(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    // object-fit: cover
    vec2 s = uPlaneAspect > uImgAspect
      ? vec2(1.0, uImgAspect / uPlaneAspect)
      : vec2(uPlaneAspect / uImgAspect, 1.0);
    vec2 uv = (vUv - 0.5) * s + 0.5;
    uv = (uv - 0.5) * (1.0 - uHover * 0.08) + 0.5;

    float shift = clamp(uVel, -0.5, 0.5) * 0.022;
    vec3 col;
    col.r = texture2D(uTex, uv + vec2(shift, 0.0)).r;
    col.g = texture2D(uTex, uv).g;
    col.b = texture2D(uTex, uv - vec2(shift, 0.0)).b;
    col *= mix(1.0, 0.45, uShade);

    // rounded corners in plane space
    vec2 p = (vUv - 0.5) * vec2(uPlaneAspect, 1.0);
    float d = sdRound(p, vec2(uPlaneAspect, 1.0) * 0.5, 0.045);
    float a = 1.0 - smoothstep(-0.003, 0.003, d);

    // reveal from bottom (intro)
    a *= 1.0 - smoothstep(uReveal - 0.08, uReveal, vUv.y);
    gl_FragColor = vec4(col, a * uAlpha);
  }
`;

export function create({ canvas, items, onActive, onHover, onClick }) {
  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch (e) {
    return null;
  }
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.1, 100);
  const ring = new Group();
  scene.add(ring);

  const N = items.length;
  const step = (Math.PI * 2) / N;
  const PLANE_ASPECT = 0.8;
  const geo = new PlaneGeometry(PLANE_ASPECT, 1, 40, 40);
  const loader = new TextureLoader();
  const meshes = [];

  items.forEach((it, i) => {
    const mat = new ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTex: { value: null },
        uImgAspect: { value: 0.8 },
        uPlaneAspect: { value: PLANE_ASPECT },
        uAlpha: { value: 1 },
        uVel: { value: 0 },
        uHover: { value: 0 },
        uShade: { value: 0 },
        uTime: { value: 0 },
        uSeed: { value: i * 1.7 },
        uReveal: { value: 0 }
      }
    });
    loader.load(it.src, tex => {
      tex.minFilter = LinearFilter;
      tex.generateMipmaps = false;
      mat.uniforms.uTex.value = tex;
      mat.uniforms.uImgAspect.value = tex.image.width / tex.image.height;
    });
    const m = new Mesh(geo, mat);
    m.userData = { index: i, hover: 0 };
    ring.add(m);
    meshes.push(m);
  });

  // ---------- state ----------
  const st = {
    target: 0, current: 0, vel: 0,
    intro: 0,            // 0 → 1 (cards spin in)
    radius: 3.1, scale: 2.15,
    active: -1, hovered: null,
    w: 1, h: 1, time: 0, running: true
  };

  function resize() {
    const r = canvas.getBoundingClientRect();
    st.w = Math.max(1, r.width); st.h = Math.max(1, r.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(st.w, st.h, false);
    camera.aspect = st.w / st.h;
    const portrait = camera.aspect < 0.9;
    st.radius = portrait ? 2.4 : 3.1;
    st.scale = portrait ? 1.75 : 2.15;
    camera.position.set(0, 0.25, portrait ? 8.6 : 7.4);
    camera.lookAt(0, 0.1, 0);
    camera.updateProjectionMatrix();
  }

  // ---------- pointer ----------
  const ray = new Raycaster();
  const ndc = new Vector2(-10, -10);
  function onMove(e) {
    const r = canvas.getBoundingClientRect();
    ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  }
  function onLeave() { ndc.set(-10, -10); }
  function onDown() {
    if (st.hovered && onClick) onClick(st.hovered.userData.index);
  }
  window.addEventListener("pointermove", onMove, { passive: true });
  canvas.addEventListener("pointerleave", onLeave);
  canvas.addEventListener("click", onDown);

  // ---------- loop ----------
  function layout() {
    const R = st.radius;
    const spin = (1 - st.intro) * Math.PI * 1.6;
    const introScale = 0.3 + 0.7 * st.intro;
    meshes.forEach((m, i) => {
      let a = i * step - st.current + spin;
      a = Math.atan2(Math.sin(a), Math.cos(a)); // wrap −π..π
      const c = Math.cos(a), s = Math.sin(a);
      m.position.set(s * R * 1.12, (1 - c) * 0.38 + s * 0.14, (c - 1) * R * 1.35);
      m.rotation.set(0, a * 0.5, -s * 0.3);
      const hov = m.userData.hover;
      const sc = st.scale * introScale * (1 + hov * 0.05) * (0.72 + 0.28 * Math.max(0, c));
      m.scale.set(sc, sc, 1);
      const u = m.material.uniforms;
      u.uAlpha.value = Math.min(1, Math.max(0, (c + 0.35) / 0.55)) * Math.min(1, st.intro * 1.4);
      u.uShade.value = Math.min(1, Math.max(0, (1 - c) * 0.55));
      u.uVel.value = st.vel;
      u.uHover.value = hov;
      u.uTime.value = st.time;
      u.uReveal.value = Math.min(1.1, st.intro * 1.3 + 0.05);
      m.renderOrder = Math.round(c * 100);
    });
  }

  function pickActive() {
    let best = 0, bestC = -2;
    meshes.forEach((m, i) => {
      let a = i * step - st.current;
      const c = Math.cos(a);
      if (c > bestC) { bestC = c; best = i; }
    });
    if (best !== st.active) {
      st.active = best;
      onActive && onActive(best);
    }
  }

  function hoverTest() {
    ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObjects(meshes, false).filter(h => h.object.material.uniforms.uAlpha.value > 0.6);
    const top = hits.sort((a, b) => b.object.renderOrder - a.object.renderOrder)[0];
    const h = top ? top.object : null;
    if (h !== st.hovered) {
      st.hovered = h;
      canvas.style.cursor = h ? "pointer" : "";
      onHover && onHover(h ? h.userData.index : -1);
    }
    meshes.forEach(m => {
      const t = m === h ? 1 : 0;
      m.userData.hover += (t - m.userData.hover) * 0.1;
    });
  }

  let last = performance.now();
  function tick(now) {
    if (!st.running) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    st.time += dt;
    const prev = st.current;
    st.current += (st.target - st.current) * Math.min(1, dt * 5.5);
    const v = (st.current - prev) / Math.max(dt, 0.001);
    st.vel += (Math.max(-0.5, Math.min(0.5, v * 0.12)) - st.vel) * 0.12;
    layout();
    hoverTest();
    pickActive();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  resize();
  window.addEventListener("resize", resize);
  requestAnimationFrame(tick);

  return {
    /** progress 0..1 → turns through every card */
    setProgress(p) { st.target = p * (N - 1) * step; },
    nudge(d) { st.target += d; },
    setIntro(v) { st.intro = v; },
    get state() { return st; },
    pause() { st.running = false; },
    play() { if (!st.running) { st.running = true; st.current = st.target - Math.sign(st.target - st.current) * Math.min(Math.abs(st.target - st.current), step); last = performance.now(); requestAnimationFrame(tick); } },
    resize
  };
}

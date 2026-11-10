/* One frame that becomes everything. It starts as Hamza's portrait, turns into each app's phone,
 * then a browser for the websites. Inside an app chapter: the text reads first while three screens
 * dissolve in the phone, then the phone moves to the centre and fans out four more screens like a
 * hand of cards, folds them back, and morphs into the next project. Scroll drives one progress
 * value per chapter; only transforms, opacity, filter and the frame's size change. */
(() => {
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const chapters = [...document.querySelectorAll(".ch")];

  if (reduce) {
    // a calm, complete page: every chapter shows its screens under the text
    root.classList.add("static");
    chapters.forEach((ch) => {
      if (ch.dataset.w === "0") return;
      const strip = document.createElement("div");
      strip.className = "ch__shots";
      document.querySelectorAll(`.stage [data-w="${ch.dataset.w}"]`).forEach((el) => {
        if (el.tagName !== "IMG" || el.classList.contains("prop")) return;
        const img = new Image();
        img.src = el.getAttribute("src");
        img.alt = "";
        img.loading = "lazy";
        strip.append(img);
      });
      ch.querySelector(".ch__text").append(strip);
    });
    return;
  }

  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const smooth = (t) => t * t * (3 - 2 * t);
  const lerp = (a, b, t) => a + (b - a) * t;
  const ramp = (v, a, b) => smooth(clamp01((v - a) / (b - a)));
  const device = document.querySelector(".device");
  const url = document.querySelector(".device__url");
  const tint = document.querySelector(".tint");
  const counter = document.querySelector(".counter");
  const texts = chapters.map((ch) => ch.querySelector(".ch__text"));
  const screens = [...document.querySelectorAll(".scr")].map((el) => ({ el, w: +el.dataset.w, s: +el.dataset.s }));
  const cards = [...document.querySelectorAll(".card")].map((el) => ({ el, w: +el.dataset.w, c: +el.dataset.c }));
  const counts = {};
  screens.forEach((s) => { counts[s.w] = Math.max(counts[s.w] || 0, s.s + 1); });
  const props = [...document.querySelectorAll(".prop")].map((el) => {
    const cs = el.style;
    return { el, w: +el.dataset.w, x: +cs.getPropertyValue("--x"), y: +cs.getPropertyValue("--y"), r: parseFloat(cs.getPropertyValue("--r")), d: +cs.getPropertyValue("--d") };
  });
  const hex = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const info = chapters.map((ch) => ({
    kind: ch.dataset.kind,
    tint: hex(ch.dataset.tint || "#f5f3ee"),
    url: ch.dataset.url || "",
    label: (ch.querySelector(".scene")?.textContent || "").split("—")[0].trim(),
    name: ch.querySelector("h2")?.childNodes[0]?.textContent.trim() || "",
  }));
  const total = String(chapters.length - 1).padStart(2, "0");
  chapters.forEach((ch) => { if (ch.dataset.accent) ch.style.setProperty("--accent", ch.dataset.accent); });

  // frame geometry per kind, beside the text
  let vw = innerWidth, vh = innerHeight, small = vw < 768;
  function dims(kind) {
    if (small) {
      if (kind === "portrait") { const h = vh * .26; return { w: h * .4615, h, r: h * .07, x: vw * .8, y: vh * .74, bezel: 1, bar: 0 }; }
      if (kind === "phone") { const h = vh * .47; return { w: h * .4615, h, r: h * .07, x: vw / 2, y: vh * .3, bezel: 1, bar: 0 }; }
      const w = vw * .9; return { w, h: w * .625 + 34, r: 12, x: vw / 2, y: vh * .27, bezel: 0, bar: 1 };
    }
    if (kind === "portrait") { const h = Math.min(520, vh * .6); return { w: h * .4615, h, r: h * .07, x: vw * .86, y: vh * .56, bezel: 1, bar: 0 }; }
    if (kind === "phone") { const h = Math.min(660, vh * .78); return { w: h * .4615, h, r: h * .07, x: vw * .72, y: vh * .52, bezel: 1, bar: 0 }; }
    let w = Math.min(vw * .5, 940), h = w * .625 + 34;
    if (h > vh * .72) { h = vh * .72; w = (h - 34) / .625; }
    return { w, h, r: 14, x: vw - w / 2 - Math.max(24, vw * .045), y: vh * .52, bezel: 0, bar: 1 };
  }
  let D = [];
  let tops = [], heights = [];
  function measure() {
    vw = innerWidth; vh = innerHeight; small = vw < 768;
    D = info.map((c) => dims(c.kind));
    tops = chapters.map((c) => c.getBoundingClientRect().top + scrollY);
    heights = chapters.map((c) => c.offsetHeight);
  }

  // per-chapter timeline (fractions of the chapter's own scroll)
  const PH = {
    portrait: { textOut: [.52, .66], fan: null, cycleEnd: 1, morph: .8 },
    phone: { textOut: [.36, .44], fan: [.4, .52, .66, .76], cycleEnd: .38, morph: .8 },
    browser: { textOut: [.7, .78], fan: null, cycleEnd: .78, morph: .8 },
  };
  const fanOf = (kind, p) => {
    const f = PH[kind].fan;
    if (!f) return 0;
    return Math.min(ramp(p, f[0], f[1]), 1 - ramp(p, f[2], f[3]));
  };

  // the hero's own progress: 0 at the top of the page (the chapter already starts half a screen in)
  const heroQ = (p) => { const p0 = (vh * .5) / heights[0]; return clamp01((p - p0) / (1 - p0)); };

  let lastY = -1;
  function frame() {
    const y = scrollY;
    if (y === lastY) return;
    lastY = y;
    const mid = y + vh * .5;
    let i = 0;
    for (let k = 0; k < chapters.length; k++) if (mid >= tops[k]) i = k;
    const p = clamp01((mid - tops[i]) / heights[i]);
    const j = Math.min(i + 1, chapters.length - 1);
    const ph = PH[info[i].kind];
    const t = j === i ? 0 : ramp(p, ph.morph, 1);
    const f = fanOf(info[i].kind, p);

    // the frame: beside the text, to the centre for the fan, then into the next chapter's shape
    const a = D[i], b = D[j];
    const cx0 = small ? a.x : lerp(a.x, vw / 2, f);
    const cy0 = small ? lerp(a.y, vh * .42, f) : a.y;
    const g = {
      w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t), r: lerp(a.r, b.r, t),
      x: lerp(cx0, b.x, t), y: lerp(cy0, b.y, t), bezel: lerp(a.bezel, b.bezel, t), bar: lerp(a.bar, b.bar, t),
    };
    const st = device.style;
    st.setProperty("--dw", g.w.toFixed(1) + "px");
    st.setProperty("--dh", g.h.toFixed(1) + "px");
    st.setProperty("--dr", g.r.toFixed(1) + "px");
    st.setProperty("--dx", g.x.toFixed(1) + "px");
    st.setProperty("--dy", g.y.toFixed(1) + "px");
    st.setProperty("--bezel", g.bezel.toFixed(3));
    st.setProperty("--bar", g.bar.toFixed(3));
    // the hero: the character plays frame by frame with the scroll, then hands over to the phone
    if (actor) {
      const q = i === 0 ? heroQ(p) : 1;
      const fp = clamp01(q / .6);
      const idx = Math.round(fp * (ACTOR_N - 1));
      if (idx !== drawn) drawActor(idx);
      const out = ramp(q, .62, .74);
      actor.style.opacity = (1 - out).toFixed(3);
      actor.style.translate = `${(-out * 60).toFixed(1)}px 0`;
      actor.style.visibility = out >= 1 ? "hidden" : "visible";
      device.style.opacity = i === 0 ? ramp(fp, .5, .68).toFixed(3) : "1";
    }
    const shown = t > .5 ? j : i;
    if (url.textContent !== info[shown].url) url.textContent = info[shown].url;

    // the light tint of the current world
    const c = info[i].tint.map((v, k) => Math.round(lerp(v, info[j].tint[k], t)));
    tint.style.backgroundColor = `rgb(${c})`;

    // screens in the frame: a rack-focus dissolve, then a cross-fade into the next chapter
    const weight = (w) => (w === i ? 1 - t : w === j && j !== i ? t : 0);
    const n = counts[i] || 1;
    const x = Math.min(n - 1, Math.max(0, (p / ph.cycleEnd) * n - .5));
    for (const s of screens) {
      const wg = weight(s.w);
      let op = 0;
      if (wg > 0) op = wg * (s.w === i ? clamp01(2 - Math.abs(x - s.s) * 3) : s.s === 0 ? 1 : 0);
      if (op < .002) { if (s.el.style.opacity !== "0") { s.el.style.opacity = "0"; s.el.style.filter = ""; } continue; }
      s.el.style.opacity = op.toFixed(3);
      const blur = (1 - Math.min(1, op)) * 10;
      s.el.style.filter = blur > .3 ? `blur(${blur.toFixed(1)}px)` : "";
      s.el.style.transform = `scale(${(1.06 - .06 * op).toFixed(4)})`;
    }

    // the fan: four more screens open around the phone like a hand of cards
    const step = small ? 11 : 13;
    for (const cd of cards) {
      const on = cd.w === i ? f : 0;
      if (on < .002) { if (cd.el.style.opacity !== "0") cd.el.style.opacity = "0"; continue; }
      const k = cd.c < 2 ? cd.c - 2 : cd.c - 1; // -2, -1, +1, +2
      const ang = k * step * on;
      const lift = Math.abs(k) * 10 * on;
      cd.el.style.width = g.w.toFixed(1) + "px";
      cd.el.style.height = g.h.toFixed(1) + "px";
      cd.el.style.borderRadius = g.r.toFixed(1) + "px";
      cd.el.style.opacity = Math.min(1, on * 1.6).toFixed(3);
      cd.el.style.transform = `translate(${(g.x - g.w / 2).toFixed(1)}px, ${(g.y - g.h / 2 + lift).toFixed(1)}px) rotate(${ang.toFixed(2)}deg) scale(${(.9 + .05 * on).toFixed(3)})`;
    }

    // each app's own art floats around the frame; it steps back while the fan is open
    for (const pr of props) {
      const wg = weight(pr.w) * (pr.w === i ? 1 - f : 1);
      if (wg < .002) { if (pr.el.style.opacity !== "0") pr.el.style.opacity = "0"; continue; }
      const local = pr.w === i ? p : 0;
      const size = pr.el.offsetWidth || 120;
      let px = g.x + pr.x * (g.w / 2 + size * .62) - size / 2;
      const py = g.y + pr.y * g.h * .55 - size / 2 + (local - .3) * -200 * pr.d;
      if (small) px = Math.min(vw - size * .7, Math.max(-size * .3, px));
      const rot = pr.r + (local - .3) * 12 * pr.d;
      pr.el.style.opacity = wg.toFixed(3);
      pr.el.style.transform = `translate(${px.toFixed(1)}px, ${(py + (1 - wg) * 40).toFixed(1)}px) rotate(${rot.toFixed(2)}deg) scale(${(.86 + .14 * wg).toFixed(3)})`;
    }

    // chapter text: in at the start, out before the fan (or the morph)
    chapters.forEach((ch, k) => {
      const q = clamp01((mid - tops[k]) / heights[k]);
      const out = PH[info[k].kind].textOut;
      const fadeOut = k === 0 ? ramp(heroQ(q), .55, .68) : ramp(q, out[0], out[1]);
      const fadeIn = k === 0 ? 1 : ramp(q, 0, .06);
      const op = q <= 0 && k !== 0 ? 0 : Math.min(fadeIn, 1 - fadeOut);
      const el = texts[k];
      el.style.opacity = op.toFixed(3);
      el.style.translate = `0 ${((1 - op) * (fadeOut > 0 ? -28 : 28)).toFixed(1)}px`;
      el.style.visibility = op < .01 ? "hidden" : "visible";
    });

    if (counter) counter.textContent = shown === 0 ? "" : `${info[shown].label} / ${total} — ${info[shown].name}`;
  }

  // the character: 80 cut-out frames from a short animation, drawn on one canvas
  const actor = document.querySelector(".actor");
  const ACTOR_N = 80;
  const actorImgs = [];
  let drawn = -1;
  function drawActor(idx) {
    let k = idx;
    while (k > 0 && !(actorImgs[k] && actorImgs[k].complete && actorImgs[k].naturalWidth)) k--;
    const im = actorImgs[k];
    if (!im || !im.complete || !im.naturalWidth) return;
    const g = actor.getContext("2d");
    g.clearRect(0, 0, actor.width, actor.height);
    g.drawImage(im, 0, 0, actor.width, actor.height);
    drawn = k === idx ? idx : -1;
  }
  if (actor) {
    for (let k = 0; k < ACTOR_N; k++) {
      const im = new Image();
      im.decoding = "async";
      im.src = `assets/actor/a${String(k).padStart(3, "0")}.webp`;
      if (k === 0) im.onload = () => drawActor(0);
      actorImgs.push(im);
    }
  }

  measure();
  frame();
  addEventListener("resize", () => { measure(); lastY = -1; frame(); });
  document.fonts?.ready.then(() => { measure(); lastY = -1; frame(); });
  addEventListener("load", () => { measure(); lastY = -1; frame(); });

  let lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({ lerp: .085 });
    lenis.on("scroll", frame);
    (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })(performance.now());
  } else {
    addEventListener("scroll", () => requestAnimationFrame(frame), { passive: true });
  }
  document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target || !lenis) return;
    e.preventDefault();
    const el = target.closest(".ch") || target;
    lenis.scrollTo(el, { duration: 1.6, offset: el.classList.contains("ch") ? -innerHeight * .4 : 0 });
  }));
})();

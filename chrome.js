// Screen dressing: pixel frames for the menus, the title screen, and the card that
// reveals each new region. Everything here is drawn in code too.

// ---------- pixel frames ----------
// A 12x12 nine-slice frame: black edge with notched corners, a bevel lit from the top left,
// and optional rivets. CSS stretches it around any box (see .framed in shell.html).
function pixelFrame(fill, light, dark, rivet) {
  const c = document.createElement("canvas"); c.width = c.height = 12;
  const x = c.getContext("2d");
  const px = (col, a, b, w = 1, h = 1) => { x.fillStyle = col; x.fillRect(a, b, w, h); };
  px(fill, 1, 1, 10, 10);
  px("#000", 1, 0, 10, 1); px("#000", 1, 11, 10, 1); px("#000", 0, 1, 1, 10); px("#000", 11, 1, 1, 10);
  for (const [a, b] of [[1, 1], [10, 1], [1, 10], [10, 10]]) px("#000", a, b);
  px(light, 2, 1, 8, 1); px(light, 1, 2, 1, 8);
  px(dark, 2, 10, 8, 1); px(dark, 10, 2, 1, 8);
  if (rivet) for (const [a, b] of [[2, 2], [9, 2], [2, 9], [9, 9]]) px(rivet, a, b);
  return c.toDataURL();
}
// The wooden field-station frame around the scene: planks with grain, nails in the corners.
function woodFrame() {
  const c = document.createElement("canvas"); c.width = c.height = 18;
  const x = c.getContext("2d");
  const px = (col, a, b, w = 1, h = 1) => { x.fillStyle = col; x.fillRect(a, b, w, h); };
  px("#000", 0, 0, 18, 18);
  px("#8a5a3b", 1, 1, 16, 16);
  px("#d9a066", 1, 1, 16, 1); px("#d9a066", 1, 1, 1, 16);
  px("#5c3a24", 1, 16, 16, 1); px("#5c3a24", 16, 1, 1, 16);
  for (const y of [3, 13]) px("#6e472d", 3, y, 12, 1);                 // grain along the planks
  for (const xx of [3, 13]) px("#6e472d", xx, 4, 1, 10);
  px("#000", 5, 5, 8, 8);                                              // inner lip around the picture
  for (const [a, b] of [[2, 2], [14, 2], [2, 14], [14, 14]]) { px("#c6ccd6", a, b); px("#566c86", a + 1, b + 1); }
  return c.toDataURL();
}
(function installFrames() {
  const root = document.documentElement.style;
  root.setProperty("--frame-panel", "url(" + pixelFrame("#1f2238", "#4a5280", "#0d0f1c") + ")");
  root.setProperty("--frame-card", "url(" + pixelFrame("#2a2f4a", "#525b8a", "#161929") + ")");
  root.setProperty("--frame-dialog", "url(" + pixelFrame("#1f2238", "#4a5280", "#0d0f1c", "#ffcd75") + ")");
  root.setProperty("--frame-wood", "url(" + woodFrame() + ")");
})();

// ---------- the title screen ----------
// The backyard at golden hour, AJ front and center, and a parade of everyone he'll recruit.
function titleScreen(done) {
  const wrap = document.getElementById("title");
  const cv = document.getElementById("titleCv"), g = cv.getContext("2d");
  const W = 320, H = 180;
  cv.width = W; cv.height = H; g.imageSmoothingEnabled = false;
  const scenery = Scenery(g, W, H);
  const walkers = ["chicken", "dog", "shadow", "wednesday", "bonnie", "graysilkie", "squirrel", "raccoon", "opossum", "bear", "pronghorn", "axolotl", "elephant", "platypus", "wombat", "tardigrade"];
  const flyers = ["crow", "monarch", "falcon", "honeybee"];
  let on = true;
  function frame(t) {
    if (!on) return;
    scenery.draw("yard", t, { liberated: 0 });
    g.fillStyle = "rgba(239, 125, 87, 0.18)"; g.fillRect(0, 0, W, H);           // golden hour wash
    // AJ, a little larger than life
    const bob = Math.floor(t / 500) % 2;
    g.drawImage(spriteCanvas("aj"), 128, 52 + bob, 64, 64);
    g.fillStyle = "#2f9c55"; for (let x = 120; x < 200; x += 3) g.fillRect(x, 113 + (x % 2), 2, 4);
    // the parade
    const span = walkers.length * 38;
    walkers.forEach((id, i) => {
      const x = ((t / 28 + i * 38) % span) - 40, step = Math.floor(t / 160 + i) % 2 ? 1 : -1;
      const y = 136 + (i % 2) * 10, img = spriteCanvas(id);
      g.drawImage(img, 0, 0, 32, 26, Math.round(x), y, 32, 26);
      g.drawImage(img, 0, 26, 32, 6, Math.round(x) + step, y + 26, 32, 6);
    });
    flyers.forEach((id, i) => {
      const x = W - ((t / 18 + i * 90) % (W + 60)) + 10, y = 14 + i * 9 + Math.sin(t / 300 + i) * 4;
      g.save(); g.translate(Math.round(x) + 32, Math.round(y)); g.scale(-1, 1); g.drawImage(spriteCanvas(id), 0, 0); g.restore();
    });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  if (matchMedia("(pointer: coarse)").matches) wrap.querySelector(".tstart").textContent = "TAP TO START";
  wrap.hidden = false;
  const go = () => {
    if (!on) return;
    on = false;
    wrap.classList.add("leaving");
    document.removeEventListener("keydown", key);
    setTimeout(() => { wrap.hidden = true; done(); }, 450);
  };
  const key = (ev) => { if (ev.key !== "Tab") { ev.preventDefault(); go(); } };
  wrap.addEventListener("pointerdown", go);
  document.addEventListener("keydown", key);
}

// ---------- new region reveal ----------
// The new region opens up behind an iris wipe, with its name stamped across the middle.
function revealRegion(region, done) {
  const wrap = document.getElementById("reveal");
  const cv = document.getElementById("revealCv"), g = cv.getContext("2d");
  const W = 320, H = 180;
  cv.width = W; cv.height = H; g.imageSmoothingEnabled = false;
  const scenery = Scenery(g, W, H);
  document.getElementById("revealName").textContent = region.name;
  document.getElementById("revealSub").textContent = region.sub;
  wrap.hidden = false; wrap.classList.remove("show"); void wrap.offsetWidth; wrap.classList.add("show");
  const start = performance.now();
  let on = true;
  function frame(t) {
    if (!on) return;
    g.fillStyle = "#000"; g.fillRect(0, 0, W, H);
    const r = Math.min(1, (t - start) / 900) * 200;
    g.save(); g.beginPath();
    for (let dy = -Math.floor(r); dy <= r; dy += 1) {                         // a stepped pixel circle, not a smooth one
      const w = Math.round(Math.sqrt(r * r - dy * dy) / 4) * 4;
      g.rect(160 - w, 90 + dy, w * 2, 1);
    }
    g.clip();
    scenery.draw(region.id, t, { liberated: 0 });
    g.restore();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  const go = () => {
    if (!on) return;
    on = false; wrap.hidden = true; wrap.removeEventListener("pointerdown", go); clearTimeout(timer); done();
  };
  const timer = setTimeout(go, 3200);
  wrap.addEventListener("pointerdown", go);
}

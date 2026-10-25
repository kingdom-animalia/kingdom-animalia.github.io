// Kingdom: Animalia. Game engine: state, scene, panels, raids, story, sound, saving.
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const SAVE_KEY = "kingdom-animalia-v1";
  const ANIMAL_INDEX = Object.fromEntries(ANIMALS.map((a, i) => [a.id, i]));
  const POWER_INFO = {
    fries: { animal: "dog", who: "Angel", name: "French Fry Frenzy", desc: "Angel smells fries (or AJ's shoes). Two free hits on the slop." },
    thump: { animal: "wednesday", who: "Wednesday", name: "Thump", desc: "The slop panics. Skip this one safely." },
    pack: { animal: "bonnie", who: "Bonnie", name: "Rat Pack", desc: "Your next wrong answer costs no heart." },
    hiss: { animal: "shadow", who: "Shadow", name: "Hiss", desc: "Knocks out one slop hit, free." },
    waggle: { animal: "honeybee", who: "Honeybee", name: "Waggle Dance", desc: "Removes one wrong card (creature rounds)." },
    electro: { animal: "platypus", who: "Platypus", name: "Electroreception", desc: "Senses the slop. Answers for you." },
    regen: { animal: "axolotl", who: "Axolotl", name: "Regenerate", desc: "Restores one heart." },
    punch: { animal: "bombardier", who: "Beetle", name: "Boiling Blast", desc: "Next right answer hits double." },
    cavitation: { animal: "mantis", who: "Mantis Shrimp", name: "Cavitation Punch", desc: "Next right answer hits triple." },
    ink: { animal: "octopus", who: "Octopus", name: "Ink Cloud", desc: "Skip this one safely." },
    shield: { animal: "tardigrade", who: "Tardigrade", name: "Cryptobiosis", desc: "Your next wrong answer costs no heart." }
  };

  // ---------- state ----------
  const fresh = () => ({
    notes: 0, total: 0, owned: {}, upgrades: {}, liberated: 0, raids: 0,
    seen: {}, stats: { taps: 0, raidsWon: 0, raidsLost: 0, correct: 0, wrong: 0, start: Date.now() },
    sfx: true, music: false, buyMode: 1, introDone: false, ended: false, last: Date.now()
  });
  let S = fresh();
  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) S = Object.assign(fresh(), JSON.parse(raw));
    } catch (e) {}
  }
  function save() {
    S.last = Date.now();
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) {}
  }

  let R = { nps: 0, tap: 1, per: {} };
  const recalc = () => { R = computeRates(S, ANIMALS, UPGRADES); };
  const discount = () => (S.owned.raccoon > 0 ? 0.95 : 1);
  const offlineRate = () => (S.owned.squirrel > 0 ? 0.75 : 0.5);
  const raidMul = () => (S.owned.monarch > 0 ? 1.25 : 1) * (S.owned.hagfish > 0 ? 1.5 : 1);

  function fmt(n) {
    if (n < 1000) return n < 10 && n % 1 ? n.toFixed(1) : Math.floor(n).toLocaleString("en-US");
    const units = ["K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc"];
    let u = -1;
    while (n >= 1000 && u < units.length - 1) { n /= 1000; u++; }
    return (n >= 100 ? n.toFixed(0) : n >= 10 ? n.toFixed(1) : n.toFixed(2)) + units[u];
  }
  const currentRegion = () => Math.min(S.liberated, REGIONS.length - 1);

  // ---------- sound ----------
  let AC = null, master = null, musicTimer = null;
  function audio() {
    if (!AC) {
      try {
        AC = new (window.AudioContext || window.webkitAudioContext)();
        master = AC.createGain(); master.gain.value = 0.18; master.connect(AC.destination);
      } catch (e) { AC = null; }
    }
    if (AC && AC.state === "suspended") AC.resume();
    return AC;
  }
  function tone(freq, dur, type = "square", vol = 0.5, slide = 0, when = 0) {
    if (!S.sfx || !audio()) return;
    const t = AC.currentTime + when;
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.02);
  }
  function noise(dur, vol = 0.4) {
    if (!S.sfx || !audio()) return;
    const len = Math.floor(AC.sampleRate * dur), buf = AC.createBuffer(1, len, AC.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = AC.createBufferSource(), g = AC.createGain(); g.gain.value = vol;
    src.buffer = buf; src.connect(g); g.connect(master); src.start();
  }
  const sfx = {
    tap: () => tone(520 + Math.random() * 180, 0.06, "square", 0.25),
    buy: () => { tone(523, 0.08); tone(659, 0.08, "square", 0.5, 0, 0.07); tone(784, 0.12, "square", 0.5, 0, 0.14); },
    right: () => { tone(660, 0.1, "triangle", 0.7); tone(990, 0.16, "triangle", 0.7, 0, 0.09); },
    wrong: () => tone(220, 0.3, "sawtooth", 0.5, -120),
    power: () => { tone(300, 0.35, "square", 0.5, 900); noise(0.2, 0.2); },
    hit: () => { noise(0.12, 0.5); tone(140, 0.12, "square", 0.6, -60); },
    win: () => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, 0.14, "square", 0.5, 0, i * 0.11)),
    shiny: () => [988, 1319, 1568].forEach((f, i) => tone(f, 0.08, "triangle", 0.5, 0, i * 0.05))
  };
  // A small looping chiptune: pentatonic lead over a walking bass.
  const LEAD = [0, 2, 4, 7, 9, 7, 4, 2, 0, 4, 7, 12, 9, 7, 4, 2];
  const BASS = [0, 0, 7, 7, 5, 5, 7, 7];
  function startMusic() {
    stopMusic();
    if (!S.music || !audio()) return;
    let step = 0;
    const base = 261.63, beat = 60 / 112 / 2;
    musicTimer = setInterval(() => {
      if (!S.music || !AC) return;
      const t = AC.currentTime;
      const n = LEAD[step % 16];
      const play = (f, dur, type, vol) => {
        const o = AC.createOscillator(), g = AC.createGain();
        o.type = type; o.frequency.value = f; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
        o.connect(g); g.connect(master); o.start(t); o.stop(t + dur);
      };
      if (step % 4 !== 3) play(base * Math.pow(2, n / 12), beat * 0.9, "square", 0.12);
      if (step % 2 === 0) play(base / 2 * Math.pow(2, BASS[(step / 2) % 8] / 12), beat * 1.8, "triangle", 0.22);
      step++;
    }, beat * 1000);
  }
  function stopMusic() { if (musicTimer) clearInterval(musicTimer); musicTimer = null; }

  // ---------- scene ----------
  const W = 320, H = 180;
  const cv = $("#scene"), g = cv.getContext("2d");
  cv.width = W; cv.height = H; g.imageSmoothingEnabled = false;
  const FLYERS = new Set(["crow", "honeybee", "monarch", "falcon", "bat", "lyrebird"]);
  const SWIMMERS = new Set(["octopus", "mantis", "pistol", "hagfish", "jellyfish", "whale", "otter"]);
  let actors = [], floaters = [], shiny = null, shake = 0;

  function rebuildActors() {
    const reg = currentRegion();
    let owned = ANIMALS.filter(a => S.owned[a.id] > 0);
    // Underwater, only animals that belong in water show up; in orbit, only the tardigrade floats out there.
    if (reg === 4) owned = owned.filter(a => SWIMMERS.has(a.id));
    if (reg === 5) owned = owned.filter(a => a.id === "tardigrade");
    owned.sort((a, b) => (b.region === reg) - (a.region === reg) || b.region - a.region);
    actors = owned.slice(0, 14).map((a, i) => makeActor(a.id, false, i));
    if (reg < 4) {
      const cat = makeActor("shadow", false, 99); cat.cat = true; actors.push(cat);
      const bon = makeActor("bonnie", false, 98); bon.rat = true; actors.push(bon);
      const wed = makeActor("wednesday", false, 96); wed.bun = true; actors.push(wed);
      ["evil", "gidget", "gordito", "eyebrows"].forEach((id, i) => { const r = makeActor(id, false, 90 + i); r.rat = true; r.vx *= 2.2; actors.push(r); });
      if (S.owned.chicken > 0) actors.push(makeActor("graysilkie", false, 97));
    }
    const slopCount = S.liberated >= REGIONS.length ? 0 : Math.max(1, 3 - S.raids);
    for (let i = 0; i < slopCount; i++) {
      const pool = ANIMALS.filter(a => a.region <= reg + 1);
      const A = pool[(i * 7 + reg * 3) % pool.length], B = pool[(i * 11 + reg * 5 + 3) % pool.length];
      actors.push(makeActor("slop" + i, { rows: chimeraRows(A.id, B.id), tint: slopTint }, 20 + i));
    }
  }
  function makeActor(id, slop, i) {
    const deep = currentRegion() === 4, orbit = currentRegion() === 5;
    const air = !slop && (FLYERS.has(id) || orbit);
    const swim = deep;
    const y = swim ? 30 + Math.random() * 120 : air ? 28 + Math.random() * 50 : 118 + Math.random() * 40;
    return { id, slop, x: Math.random() * (W - 40) + 4, y, vx: (Math.random() < 0.5 ? -1 : 1) * (0.15 + Math.random() * 0.3), air: air || swim, phase: Math.random() * 6, scale: 2, rest: 0, blinkOff: Math.random() * 4200 };
  }

  // Backdrops live in scenery.js; circle() is shared with the night sky below.
  const scenery = Scenery(g, W, H), circle = scenery.circle;
  function drawBackground(t) { scenery.draw(REGIONS[currentRegion()].id, t, S); }

  // Extra frames live in sprites_hd.js as "name~idle" (peck, wag, tail flick, ear twitch) and "name~flap".
  const hasPose = (id, pose) => typeof SPRH !== "undefined" && !!SPRH[id + "~" + pose];
  const SQUASH_FLAP = new Set(["bat", "monarch"]);   // these flap by folding their wings in
  function drawActors(t) {
    const sorted = actors.slice().sort((a, b) => a.y - b.y);
    for (const a of sorted) {
      if (a.rest > 0) a.rest--;
      else {
        a.x += a.vx;
        // Now and then a ground animal stops for a moment to peck, wag, flick or twitch.
        if (!a.air && !a.slop && Math.random() < 0.003) a.rest = 70 + Math.floor(Math.random() * 110);
      }
      a.phase += a.rest > 0 ? 0.02 : 0.08;
      if (a.x < 2 || a.x > W - 34) { a.vx *= -1; a.x = Math.max(2, Math.min(W - 34, a.x)); }
      const hop = a.bun && !a.rest;      // Wednesday hops instead of walking
      const bob = a.air ? Math.sin(a.phase) * 3 : hop ? -Math.abs(Math.sin(a.phase * 1.2)) * 6 : a.rest ? 0 : Math.abs(Math.sin(a.phase * 1.4)) * -2;
      let name = a.id;
      if (a.rest > 0 && hasPose(a.id, "idle") && Math.floor(a.rest / 14) % 2) name += "~idle";
      if (a.air && hasPose(a.id, "flap") && Math.floor(t / 140 + a.phase) % 2) name += "~flap";
      const blink = !a.slop && (t + a.blinkOff) % 4200 < 130;
      const img = a.slop ? spriteCanvas("slop-" + a.id, a.slop) : spriteCanvas(name, blink ? { blink: true } : null);
      const px = Math.round(a.x + (a.slop ? (Math.random() < 0.05 ? (Math.random() * 4 - 2) : 0) : 0)), py = Math.round(a.y + bob);
      g.save();
      if (a.vx < 0) { g.translate(px + 32, py); g.scale(-1, 1); } else g.translate(px, py);
      if (a.air) {
        const fold = SQUASH_FLAP.has(a.id) && Math.floor(t / 120 + a.phase) % 2 ? 12 : 0;
        g.drawImage(img, fold / 2, 0, 32 - fold, 32);
      } else if (hop || a.rest) g.drawImage(img, 0, 0, 32, 32);
      else {
        // two-frame walk: the bottom rows (legs/feet) shuffle a pixel each step
        const step = Math.floor(a.phase * 2) % 2 ? 1 : -1;
        g.drawImage(img, 0, 0, 32, 26, 0, 0, 32, 26);
        g.drawImage(img, 0, 26, 32, 6, step, 26, 32, 6);
      }
      g.restore();
      if (!a.air) { const sw = 20 + Math.round(bob); g.fillStyle = "rgba(0,0,0,0.18)"; g.fillRect(px + 16 - sw / 2, Math.round(a.y) + 31, sw, 2); }
    }
  }
  function drawFloaters() {
    g.textAlign = "center";
    floaters = floaters.filter(f => f.life > 0);
    for (const f of floaters) {
      f.life--; f.y -= 0.6;
      g.globalAlpha = Math.min(1, f.life / 25);
      g.font = "8px 'Press Start 2P', monospace";
      g.fillStyle = "#1a1c2c"; g.fillText(f.text, f.x + 1, f.y + 1);
      g.fillStyle = f.color || "#ffcd75"; g.fillText(f.text, f.x, f.y);
    }
    g.globalAlpha = 1;
  }
  function drawShiny(t) {
    if (!shiny) return;
    shiny.life--; shiny.x += shiny.vx; shiny.y += Math.sin(t / 200) * 0.4;
    if (shiny.life <= 0 || shiny.x < -10 || shiny.x > W + 10) { shiny = null; return; }
    const s = 4 + Math.sin(t / 90) * 1.5;
    g.fillStyle = "#ffcd75"; g.fillRect(shiny.x - s / 2, shiny.y - 1, s, 2); g.fillRect(shiny.x - 1, shiny.y - s / 2, 2, s);
    g.fillStyle = "#f4f4f4"; g.fillRect(shiny.x - 1, shiny.y - 1, 2, 2);
  }


  // ---------- atmosphere + effects ----------
  let parts = [];
  const LAND = ["yard", "town", "amer", "wild"];
  const regionId = () => REGIONS[currentRegion()].id;
  // A slow day-night cycle on land: four minutes per day.
  const nightLevel = (t) => LAND.includes(regionId()) ? Math.max(0, -Math.cos((t / 1000 % 240) / 240 * Math.PI * 2)) : 0;
  function burst(x, y, n, cols, speed) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = (0.4 + Math.random()) * speed;
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 0.5, g: 0.05, life: 30 + Math.random() * 20, col: cols[i % cols.length], size: 2 });
    }
  }
  function ambient(dt) {
    const id = regionId(), night = nightLevel(performance.now());
    const spawn = (rate, make) => { if (Math.random() < rate * dt) parts.push(make()); };
    if (id === "yard") spawn(1.2, () => ({ x: Math.random() * W, y: 120 + Math.random() * 40, vx: 0.15 + Math.random() * 0.2, vy: -0.12, g: 0, life: 260, col: "#f4f4f4", size: 1, drift: true }));
    if (id === "amer" || id === "town") spawn(1.0, () => ({ x: Math.random() * W, y: -4, vx: 0.2 + Math.random() * 0.3, vy: 0.35, g: 0, life: 520, col: ["#ef7d57", "#ffcd75", "#b13e53"][Math.floor(Math.random() * 3)], size: 2, drift: true }));
    if (id === "wild") spawn(1.5, () => ({ x: Math.random() * W, y: 100 + Math.random() * 70, vx: 0.3, vy: -0.05, g: 0, life: 300, col: "#fff1b8", size: 1, drift: true }));
    if (id === "deep") spawn(3, () => ({ x: Math.random() * W, y: H + 2, vx: 0, vy: -0.4 - Math.random() * 0.4, g: 0, life: 500, col: "#73eff7", size: Math.random() < 0.3 ? 2 : 1, drift: true }));
    if (id === "orbit") spawn(0.25, () => ({ x: Math.random() * W, y: Math.random() * 60, vx: -3, vy: 1.2, g: 0, life: 40, col: "#f4f4f4", size: 1, trail: true }));
    if (night > 0.35 && (id === "yard" || id === "town" || id === "amer")) spawn(2.5 * night, () => ({ x: Math.random() * W, y: 100 + Math.random() * 70, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, g: 0, life: 240, col: "#ffcd75", size: 1, firefly: true }));
    if (parts.length > 260) parts.splice(0, parts.length - 260);
  }
  function drawParticles() {
    const now = performance.now();
    parts = parts.filter(p => p.life > 0);
    for (const p of parts) {
      p.life--; p.vy += p.g; p.x += p.vx + (p.drift ? Math.sin((now / 700) + p.y / 20) * 0.15 : 0); p.y += p.vy;
      let alpha = Math.min(1, p.life / 30);
      if (p.firefly) alpha *= 0.5 + 0.5 * Math.sin(now / 160 + p.x);
      g.globalAlpha = Math.max(0, alpha);
      g.fillStyle = p.col;
      if (p.trail) g.fillRect(Math.round(p.x), Math.round(p.y), 6, 1);
      g.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
      if (p.firefly) { g.globalAlpha *= 0.3; g.fillRect(Math.round(p.x) - 1, Math.round(p.y) - 1, 3, 3); }
    }
    g.globalAlpha = 1;
  }
  function drawGrass(t) {
    const id = regionId();
    const cols = { yard: ["#2f9c55", "#a7f070"], town: ["#1f5f66", "#38b764"], amer: ["#c28e5c", "#ffcd75"], wild: ["#8a5a3b", "#d9a066"] }[id];
    if (!cols) return;
    const top = id === "town" ? 122 : id === "wild" ? 114 : id === "amer" ? 120 : 112;
    for (let i = 0; i < 70; i++) {
      const x = (i * 47) % W, y = top + ((i * 29) % (H - top - 4));
      const sway = Math.round(Math.sin(t / 650 + x / 25) * 1.5);
      g.fillStyle = cols[i % 2];
      g.fillRect(x, y, 1, 3); g.fillRect(x + sway, y - 2, 1, 2); g.fillRect(x + 2, y + 1, 1, 2); g.fillRect(x + 2 + sway, y - 1, 1, 2);
    }
  }
  function drawNight(t) {
    const n = nightLevel(t);
    if (n <= 0.02) return;
    g.fillStyle = "rgba(18, 20, 52, " + (n * 0.5).toFixed(3) + ")";
    g.fillRect(0, 0, W, H);
    g.globalAlpha = n;
    for (let i = 0; i < 40; i++) { const x = (i * 71) % W, y = (i * 37) % 70; g.fillStyle = Math.sin(t / 500 + i) > 0.5 ? "#ffcd75" : "#f4f4f4"; g.fillRect(x, y, 1, 1); }
    g.fillStyle = "#f4f4f4"; circle(56, 26, 7); g.fillStyle = "rgba(18,20,52,0.9)"; circle(59, 24, 6);
    g.globalAlpha = 1;
  }
  // Full-page confetti for raid wins; a white flash for boss kills.
  const fx = document.getElementById("fx"), fg = fx.getContext("2d");
  let confettiBits = [], confettiOn = false;
  function confetti(n) {
    fx.width = innerWidth; fx.height = innerHeight;
    const cols = ["#a7f070", "#ffcd75", "#73eff7", "#c33cd1", "#ef5d6c", "#f4f4f4"];
    for (let i = 0; i < n; i++) confettiBits.push({ x: innerWidth / 2 + (Math.random() - 0.5) * 200, y: innerHeight * 0.35, vx: (Math.random() - 0.5) * 14, vy: -6 - Math.random() * 9, s: 4 + Math.random() * 5, c: cols[i % cols.length], r: Math.random() * 6, life: 140 });
    if (!confettiOn) { confettiOn = true; requestAnimationFrame(confettiStep); }
  }
  function confettiStep() {
    fg.clearRect(0, 0, fx.width, fx.height);
    confettiBits = confettiBits.filter(b => b.life > 0 && b.y < fx.height + 20);
    for (const b of confettiBits) {
      b.life--; b.vy += 0.32; b.vx *= 0.985; b.x += b.vx; b.y += b.vy; b.r += 0.2;
      fg.fillStyle = b.c; fg.fillRect(b.x, b.y, b.s, b.s * Math.abs(Math.cos(b.r)) + 1);
    }
    if (confettiBits.length) requestAnimationFrame(confettiStep); else { confettiOn = false; fg.clearRect(0, 0, fx.width, fx.height); }
  }
  function flash() {
    const f = document.getElementById("flash"); f.hidden = false;
    f.classList.remove("go"); void f.offsetWidth; f.classList.add("go");
    setTimeout(() => { f.hidden = true; }, 700);
  }

  let lastFrame = performance.now(), acc = 0;
  function frame(now) {
    const dt = Math.min(1, (now - lastFrame) / 1000); lastFrame = now;
    tick(dt);
    g.save();
    if (shake > 0) { g.translate(Math.random() * 4 - 2, Math.random() * 4 - 2); shake--; }
    drawBackground(now); drawGrass(now); drawActors(now); drawParticles(); drawNight(now); drawShiny(now); drawFloaters();
    g.restore();
    acc += dt; if (acc > 0.25) { acc = 0; renderHud(); refreshAffordability(); }
    requestAnimationFrame(frame);
  }

  function tick(dt) {
    const gain = R.nps * dt;
    S.notes += gain; S.total += gain;
    ambient(dt);
    if (S.owned.crow > 0 && !shiny && Math.random() < dt / 55) {
      const left = Math.random() < 0.5;
      shiny = { x: left ? -6 : W + 6, y: 30 + Math.random() * 60, vx: left ? 0.7 : -0.7, life: 900 };
    }
  }

  function canvasPoint(ev) {
    const r = cv.getBoundingClientRect();
    return { x: (ev.clientX - r.left) / r.width * W, y: (ev.clientY - r.top) / r.height * H };
  }
  function doTap(px, py) {
    const amount = R.tap;
    S.notes += amount; S.total += amount; S.stats.taps++;
    floaters.push({ x: px, y: py, text: "+" + fmt(amount), life: 50 });
    burst(px, py, 5, ["#ffcd75", "#f4f4f4"], 1.2);
    sfx.tap();
  }
  cv.addEventListener("pointerdown", (ev) => {
    audio();
    const p = canvasPoint(ev);
    if (shiny && Math.abs(p.x - shiny.x) < 12 && Math.abs(p.y - shiny.y) < 12) {
      const bonus = Math.max(50, R.nps * 30);
      S.notes += bonus; S.total += bonus;
      floaters.push({ x: shiny.x, y: shiny.y, text: "SHINY! +" + fmt(bonus), life: 70, color: "#73eff7" });
      sfx.shiny(); shiny = null; return;
    }
    const cat = actors.find(a => a.cat && p.x > a.x && p.x < a.x + 32 && p.y > a.y && p.y < a.y + 32);
    const rat = actors.find(a => a.rat && p.x > a.x && p.x < a.x + 32 && p.y > a.y && p.y < a.y + 32);
    if (rat) { floaters.push({ x: rat.x + 16, y: rat.y, text: rat.id.charAt(0).toUpperCase() + rat.id.slice(1) + "!", life: 45, color: "#f4a6b8" }); tone(1800, 0.06, "square", 0.2); tone(2200, 0.05, "square", 0.2, 0, 0.06); }
    const angel = actors.find(a => a.id === "dog" && p.x > a.x && p.x < a.x + 32 && p.y > a.y && p.y < a.y + 32);
    if (angel) { floaters.push({ x: angel.x + 16, y: angel.y, text: "fries?", life: 50, color: "#ffcd75" }); tone(330, 0.08, "square", 0.3); tone(440, 0.1, "square", 0.3, 0, 0.09); }
    const bun = actors.find(a => a.bun && p.x > a.x && p.x < a.x + 32 && p.y > a.y && p.y < a.y + 32);
    if (bun) { floaters.push({ x: bun.x + 16, y: bun.y, text: "binky!", life: 45, color: "#c4f7ff" }); bun.phase = 0; tone(600, 0.12, "triangle", 0.3, 400); }
    if (cat) { floaters.push({ x: cat.x + 16, y: cat.y, text: "purr", life: 45, color: "#f4a6b8" }); tone(90, 0.35, "sawtooth", 0.25, 10); }
    doTap(p.x, p.y);
  });

  // ---------- HUD + panels ----------
  function renderHud() {
    $("#notes").textContent = fmt(S.notes);
    $("#nps").textContent = fmt(R.nps) + " / sec";
    const reg = currentRegion();
    $("#regionName").textContent = S.liberated >= REGIONS.length ? "Kingdom: Animalia" : REGIONS[reg].name;
    const slop = S.liberated >= REGIONS.length ? 0 : Math.max(0, 100 - S.raids * 30);
    $("#slopFill").style.width = slop + "%";
    $("#slopPct").textContent = slop ? slop + "% slop" : "Slop free";
  }

  let tab = "animals";
  function setTab(t) {
    tab = t;
    for (const b of document.querySelectorAll(".tab")) b.setAttribute("aria-selected", b.dataset.tab === t ? "true" : "false");
    renderPanel();
  }
  function spriteImg(name, opts, size = 40) {
    const c = document.createElement("canvas"); c.width = 32; c.height = 32; c.className = "spr";
    c.style.width = c.style.height = size + "px";
    c.getContext("2d").drawImage(spriteCanvas(name, opts), 0, 0);
    return c;
  }

  function buyCount(i) {
    const a = ANIMALS[i]; let n = S.owned[a.id] || 0;
    if (S.buyMode === 1 || S.buyMode === 10) {
      let cost = 0;
      for (let k = 0; k < S.buyMode; k++) cost += animalCost(i, n + k, discount());
      return { count: S.buyMode, cost };
    }
    let cost = 0, count = 0;
    while (true) { const c = animalCost(i, n + count, discount()); if (cost + c > S.notes) break; cost += c; count++; if (count > 500) break; }
    if (!count) return { count: 1, cost: animalCost(i, n, discount()) };
    return { count, cost };
  }

  function renderPanel() {
    const box = $("#panelBody");
    const keep = box.scrollTop;
    const frag = document.createDocumentFragment();
    if (tab === "animals") renderAnimals(frag);
    else if (tab === "workshop") renderWorkshop(frag);
    else if (tab === "raids") renderRaids(frag);
    else if (tab === "guide") renderGuide(frag);
    else renderMore(frag);
    box.replaceChildren(frag);
    box.scrollTop = keep;
  }

  function renderAnimals(box) {
    const modes = el("div", "modes");
    for (const m of [1, 10, "max"]) {
      const b = el("button", "chip", m === "max" ? "Max" : "x" + m); b.type = "button";
      b.setAttribute("aria-pressed", S.buyMode === m ? "true" : "false");
      b.onclick = () => { S.buyMode = m; renderPanel(); };
      modes.append(b);
    }
    box.append(modes);
    let lockedShown = false;
    ANIMALS.forEach((a, i) => {
      if (a.region > S.liberated) {
        if (lockedShown) return;
        lockedShown = true;
        const row = el("div", "row locked");
        row.append(spriteImg(a.id, { tint: () => "#333c57" }), el("div", "rinfo"));
        row.lastChild.append(el("b", null, "???"), el("small", null, "Liberate " + REGIONS[a.region - 1].name + " to find more animals."));
        box.append(row); return;
      }
      const n = S.owned[a.id] || 0;
      const row = el("div", "row");
      const info = el("div", "rinfo");
      const name = el("b", null, a.name + (n ? " ×" + n : ""));
      const each = animalBaseProd(i);
      info.append(name, el("small", null, n ? fmt(R.per[a.id] || 0) + " notes/sec total" : "+" + fmt(each) + " notes/sec base"));
      if (a.perk) info.append(el("small", "perk", a.perk));
      const { count, cost } = buyCount(i);
      const btn = el("button", "buy", (n ? "Recruit" : "Recruit") + (count > 1 ? " ×" + count : "") + "\n" + fmt(cost));
      btn.type = "button"; btn.dataset.cost = cost; btn.dataset.kind = "animal";
      btn.onclick = () => buyAnimal(i);
      row.append(spriteImg(a.id), info, btn);
      box.append(row);
    });
  }
  function buyAnimal(i) {
    const a = ANIMALS[i];
    const { count, cost } = buyCount(i);
    if (S.notes < cost) { toast("Not enough field notes yet."); return; }
    S.notes -= cost; const first = !S.owned[a.id];
    S.owned[a.id] = (S.owned[a.id] || 0) + count;
    sfx.buy(); recalc(); rebuildActors(); renderPanel(); save();
    const act = actors.find(x => x.id === a.id);
    if (act) burst(act.x + 16, act.y + 16, 18, ["#a7f070", "#ffcd75", "#73eff7", "#f4f4f4"], 2);
    if (first) showCard(a, true);
  }

  function renderWorkshop(box) {
    const head = el("div", "jessiHead");
    head.append(spriteImg("jessi", null, 48));
    const t = el("div"); t.append(el("b", null, "Jessi's Workshop"), el("small", null, "She prints the gear. You do the science."));
    head.append(t); box.append(head);
    for (const u of UPGRADES) {
      if (u.region > S.liberated) continue;
      if (u.req && !S.upgrades[u.req]) continue;
      const row = el("div", "row" + (S.upgrades[u.id] ? " done" : ""));
      const info = el("div", "rinfo");
      info.append(el("b", null, u.name), el("small", null, u.desc));
      if (S.upgrades[u.id]) info.append(el("small", "quote", "“" + u.jessi + "”"));
      row.append(info);
      if (S.upgrades[u.id]) row.append(el("span", "printed", "Printed"));
      else {
        const cost = Math.ceil(u.cost * discount());
        const b = el("button", "buy", "Print\n" + fmt(cost)); b.type = "button"; b.dataset.cost = cost; b.dataset.kind = "upgrade";
        b.onclick = () => {
          if (S.notes < cost) { toast("Not enough field notes yet."); return; }
          S.notes -= cost; S.upgrades[u.id] = true; sfx.buy(); recalc(); renderPanel(); save();
          dialog([["jessi", u.jessi]]);
        };
        row.append(b);
      }
      box.append(row);
    }
  }

  function renderRaids(box) {
    box.append(el("p", "hint", "Raids test what you know. Spot the fake animals and the false facts. Three raids clear a region's slop; then its boss shows up."));
    REGIONS.forEach((r, i) => {
      const card = el("div", "rcard");
      const libd = i < S.liberated, cur = i === S.liberated, locked = i > S.liberated;
      card.classList.add(libd ? "freed" : cur ? "current" : "lockedR");
      const top = el("div", "rtop");
      top.append(el("b", null, r.name), el("span", "status", libd ? "Liberated" : cur ? (S.raids < 3 ? "Raid " + (S.raids + 1) + " of 3" : "Boss") : "Locked"));
      card.append(top, el("small", null, r.sub));
      const meter = el("div", "meter"); const fill = el("div", "fill");
      fill.style.width = (libd ? 0 : cur ? Math.max(0, 100 - S.raids * 30) : 100) + "%";
      meter.append(fill); card.append(meter);
      if (cur) {
        const boss = S.raids >= 3;
        const cost = boss ? bossCost(i) : raidCost(i, S.raids);
        const needRocket = i === 5 && !S.upgrades.rocket;
        const b = el("button", "buy wide", needRocket ? "Needs the Rocket (Workshop)" : (boss ? "Face " + BOSSES[r.boss].name : "Launch raid") + " · " + fmt(cost));
        b.type = "button"; b.dataset.cost = needRocket ? Infinity : cost; b.dataset.kind = "raid";
        b.disabled = needRocket;
        b.onclick = () => {
          if (S.notes < cost) { toast("Raids cost field notes. Keep observing."); return; }
          S.notes -= cost; startRaid(i, boss, cost);
        };
        card.append(b);
      }
      box.append(card);
    });
  }

  function renderGuide(box) {
    const got = ANIMALS.filter(a => S.owned[a.id] > 0).length;
    box.append(el("p", "hint", got + " of " + ANIMALS.length + " animals in your field guide. Tap a card to read it."));
    const grid = el("div", "guide");
    const sc = el("button", "gcard"); sc.type = "button";
    sc.append(spriteImg("shadow", null, 44), el("span", null, "Shadow")); sc.onclick = () => showCard(SHADOW, false); grid.append(sc);
    const bc = el("button", "gcard"); bc.type = "button";
    bc.append(spriteImg("bonnie", null, 44), el("span", null, "Bonnie & the rats")); bc.onclick = () => showCard(BONNIE, false); grid.append(bc);
    const wc = el("button", "gcard"); wc.type = "button";
    wc.append(spriteImg("wednesday", null, 44), el("span", null, "Wednesday")); wc.onclick = () => showCard(WEDNESDAY, false); grid.append(wc);
    for (const a of ANIMALS) {
      const has = S.owned[a.id] > 0;
      const c = el("button", "gcard" + (has ? "" : " missing")); c.type = "button";
      c.append(spriteImg(a.id, has ? null : { tint: () => "#333c57" }, 44), el("span", null, has ? a.name : "???"));
      if (has) c.onclick = () => showCard(a, false); else c.disabled = true;
      grid.append(c);
    }
    box.append(grid);
  }

  function renderMore(box) {
    const opts = el("div", "opts");
    const toggle = (label, key, after) => {
      const b = el("button", "chip", label + ": " + (S[key] ? "On" : "Off")); b.type = "button";
      b.setAttribute("aria-pressed", S[key] ? "true" : "false");
      b.onclick = () => { S[key] = !S[key]; after && after(); save(); renderPanel(); };
      return b;
    };
    opts.append(toggle("Sound", "sfx"), toggle("Music", "music", () => S.music ? startMusic() : stopMusic()));
    box.append(opts);
    const st = S.stats, mins = Math.round((Date.now() - st.start) / 60000);
    const stats = el("div", "stats");
    for (const [k, v] of [["Field notes earned", fmt(S.total)], ["Taps", fmt(st.taps)], ["Raids won", st.raidsWon], ["Slop spotted", st.correct], ["Times fooled", st.wrong], ["Minutes played", mins]]) {
      const r = el("div"); r.append(el("span", null, k), el("b", null, String(v))); stats.append(r);
    }
    box.append(stats);
    const help = el("button", "buy wide", "How to play"); help.type = "button"; help.onclick = () => howToPlay(); box.append(help);
    const how = el("button", "buy wide", "How this was made"); how.type = "button"; how.onclick = credits; box.append(how);
    const sv = el("details", "savebox");
    sv.append(el("summary", null, "Move your save to another device"));
    const ta = el("textarea"); ta.id = "saveText"; ta.rows = 3; ta.setAttribute("aria-label", "Save code");
    const ex = el("button", "chip", "Show my save code"); ex.type = "button";
    ex.onclick = () => { save(); ta.value = btoa(unescape(encodeURIComponent(JSON.stringify(S)))); ta.select(); };
    const im = el("button", "chip", "Load this code"); im.type = "button";
    im.onclick = () => {
      try { S = Object.assign(fresh(), JSON.parse(decodeURIComponent(escape(atob(ta.value.trim()))))); recalc(); rebuildActors(); save(); renderPanel(); toast("Save loaded."); }
      catch (e) { toast("That code didn't work. Copy the whole thing and try again."); }
    };
    sv.append(ta, el("div", "opts")); sv.lastChild.append(ex, im);
    box.append(sv);
    let armed = false;
    const reset = el("button", "chip danger", "Start over"); reset.type = "button";
    reset.onclick = () => {
      if (!armed) { armed = true; reset.textContent = "Tap again to erase everything"; setTimeout(() => { armed = false; reset.textContent = "Start over"; }, 4000); return; }
      S = fresh(); save(); recalc(); rebuildActors(); renderPanel(); story("intro");
    };
    box.append(reset);
  }

  function refreshAffordability() {
    for (const b of document.querySelectorAll("#panelBody button.buy[data-cost]")) {
      const c = +b.dataset.cost;
      b.classList.toggle("cant", !(S.notes >= c));
    }
    if (tab === "animals" && S.buyMode === "max") {
      // max counts change as notes grow; refresh cheaply every few ticks
      if (!refreshAffordability.n || ++refreshAffordability.n % 8 === 0) { refreshAffordability.n = 1; renderPanel(); }
    }
  }

  // ---------- modal: dialog, cards, raids ----------
  const modal = $("#modal"), mbox = $("#modalBox");
  function openModal(cls) { mbox.className = "mbox " + (cls || ""); mbox.innerHTML = ""; modal.hidden = false; return mbox; }
  function closeModal() { modal.hidden = true; mbox.innerHTML = ""; }

  function portrait(who, bossId) {
    if (who === "boss") {
      const B = BOSSES[bossId];
      return spriteImg(B.sprite || "boss-" + bossId, B.rows ? { rows: B.rows(), tint: slopTint } : (B.halo ? { tint: slopTint } : null), 64);
    }
    return spriteImg(who, null, 64);
  }
  function dialog(lines, bossId, done) {
    let i = 0;
    const box = openModal("talk");
    const show = () => {
      box.innerHTML = "";
      const [who, text] = lines[i];
      const wrap = el("div", "talkrow" + (who === "aj" ? " right" : ""));
      const p = el("div", "por"); p.append(portrait(who, bossId));
      const nm = who === "boss" ? BOSSES[bossId].name : who === "aj" ? "AJ" : who === "shadow" ? "Shadow" : who === "bonnie" ? "Bonnie" : "Jessi";
      p.append(el("small", null, nm));
      const bubble = el("div", "bubble" + (who === "boss" ? " evil" : ""));
      const txt = el("p"); bubble.append(txt);
      wrap.append(p, bubble); box.append(wrap);
      let k = 0;
      const typer = setInterval(() => { k += 2; txt.textContent = text.slice(0, k); if (k >= text.length) clearInterval(typer); }, 18);
      const next = el("button", "buy wide", i < lines.length - 1 ? "Next" : "Let's go"); next.type = "button";
      next.onclick = () => {
        if (txt.textContent.length < text.length) { clearInterval(typer); txt.textContent = text; return; }
        i++; if (i < lines.length) show(); else { closeModal(); done && done(); }
      };
      box.append(next); next.focus();
      if (who === "boss") sfx.hit(); else tone(who === "aj" ? 392 : 523, 0.05, "square", 0.25);
    };
    show();
  }
  function story(key, done) { dialog(STORY[key], null, done); }

  function showCard(a, isNew) {
    const box = openModal("card");
    if (isNew) box.append(el("div", "newtag", "New recruit!"));
    const head = el("div", "chead");
    head.append(spriteImg(a.id, null, 96));
    const t = el("div"); t.append(el("h3", null, a.name), el("i", null, a.sci));
    head.append(t); box.append(head);
    box.append(el("p", "fact", a.fact));
    if (a.perk) box.append(el("p", "perkline", a.perk));
    box.append(el("p", "src", "Source: " + a.source));
    const ok = el("button", "buy wide", "Back to the field"); ok.type = "button"; ok.onclick = closeModal;
    box.append(ok); ok.focus();
  }

  // ---------- raids ----------
  function blendName(a, b) {
    const A = a.name.split(" ").pop(), B = b.name.split(" ").pop();
    return (A.slice(0, Math.ceil(A.length / 2)) + B.slice(Math.floor(B.length / 2))).replace(/^./, c => c.toUpperCase());
  }
  function shuffle(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function makeQuestion(regionIdx, used) {
    const pool = ANIMALS.filter(a => a.region <= regionIdx + 1);
    if (Math.random() < 0.4) {
      // Creature round: spot the slop (or, sometimes, spot the real one).
      const findReal = Math.random() < 0.35;
      const reals = shuffle(ANIMALS.slice()).slice(0, findReal ? 1 : 2);
      const fakes = [];
      while (fakes.length < (findReal ? 2 : 1)) {
        const A = pick(pool), B = pick(ANIMALS);
        if (A.id === B.id) continue;
        fakes.push({ name: blendName(A, B), rows: chimeraRows(A.id, B.id), fake: true });
      }
      const cards = shuffle(reals.map(a => ({ name: a.name, id: a.id, fake: false, sci: a.sci })).concat(fakes));
      return { kind: "spot", findReal, cards };
    }
    // Statement round.
    const opts = [];
    for (const a of pool) { opts.push({ text: a.real, truth: true, after: a.fact, src: a.source }); opts.push({ text: a.slop, truth: false, after: a.fix, src: a.source }); }
    for (const [m, fix] of MYTHS) opts.push({ text: m, truth: false, after: fix });
    for (const t of TRUE_EXTRAS) opts.push({ text: t, truth: true, after: "Real. Weird, but real." });
    let q, tries = 0;
    do { q = pick(opts); tries++; } while (used.has(q.text) && tries < 50);
    used.add(q.text);
    return Object.assign({ kind: "fact" }, q);
  }

  function startRaid(regionIdx, isBoss, cost) {
    const reg = REGIONS[regionIdx];
    const begin = () => runRaid(regionIdx, isBoss, cost);
    if (isBoss) dialog(STORY.bossIntro[reg.boss], reg.boss, begin); else begin();
  }

  function runRaid(regionIdx, isBoss, cost) {
    const reg = REGIONS[regionIdx];
    const maxHearts = 3 + (isBoss && S.owned.lyrebird > 0 ? 1 : 0);
    const st = { hearts: maxHearts, hp: isBoss ? 8 : 5, maxHp: isBoss ? 8 : 5, mult: 1, shield: false, used: new Set(), powersUsed: {}, q: null, answered: false };
    const powers = Object.entries(POWER_INFO).filter(([, p]) => p.animal === "shadow" || p.animal === "bonnie" || p.animal === "wednesday" || S.owned[p.animal] > 0);

    const draw = () => {
      const box = openModal("raid");
      const top = el("div", "raidtop");
      top.append(el("b", null, isBoss ? BOSSES[reg.boss].name : "Slop Raid · " + reg.name));
      const hearts = el("span", "hearts");
      for (let i = 0; i < maxHearts; i++) hearts.append(el("span", i < st.hearts ? "h full" : "h", "♥"));
      if (st.shield) hearts.append(el("span", "shield", "◆"));
      top.append(hearts); box.append(top);
      const foe = el("div", "foe");
      if (isBoss) {
        const B = BOSSES[reg.boss];
        const pic = portrait("boss", reg.boss); pic.classList.add("bossPic"); if (B.halo) foe.classList.add("halo");
        foe.append(pic);
      }
      const hp = el("div", "hp"); const hf = el("div", "fill"); hf.style.width = (st.hp / st.maxHp * 100) + "%"; hp.append(hf);
      foe.append(el("small", null, isBoss ? "Boss slop" : "Slop wave"), hp);
      box.append(foe);
      if (!st.q) st.q = makeQuestion(regionIdx, st.used);
      const q = st.q;
      const area = el("div", "qarea");
      if (q.kind === "spot") {
        area.append(el("p", "prompt", q.findReal ? "Two of these are slop. Which one is REAL?" : "One of these is slop. Which one is FAKE?"));
        const cards = el("div", "spot");
        q.cards.forEach((c, idx) => {
          if (c.removed) return;
          const b = el("button", "scard"); b.type = "button";
          b.append(c.fake ? spriteImg("fake-" + c.name, { rows: c.rows, tint: subtleTint }, 72) : spriteImg(c.id, null, 72), el("span", null, c.name));
          b.dataset.key = String(idx + 1);
          b.onclick = () => answer(c.fake !== q.findReal, c);
          if (st.answered) { b.disabled = true; if (c.fake) b.classList.add("wasfake"); else b.classList.add("wasreal"); }
          cards.append(b);
        });
        area.append(cards);
      } else {
        area.append(el("p", "prompt", "Real, or slop?"), el("p", "statement", "“" + q.text + "”"));
        const row = el("div", "tf");
        const real = el("button", "buy tfb real", "REAL"); real.type = "button"; real.dataset.key = "r"; real.onclick = () => answer(q.truth === true);
        const slop = el("button", "buy tfb slop", "SLOP"); slop.type = "button"; slop.dataset.key = "s"; slop.onclick = () => answer(q.truth === false);
        if (st.answered) { real.disabled = slop.disabled = true; }
        row.append(real, slop); area.append(row);
      }
      box.append(area);
      if (st.feedback) box.append(st.feedback);
      if (!st.answered && powers.length) {
        const pr = el("div", "powers");
        for (const [key, p] of powers) {
          const b = el("button", "pw"); b.type = "button";
          b.append(spriteImg(p.animal, null, 28), el("span", null, p.name));
          b.title = p.desc;
          const unusable = st.powersUsed[key] || (key === "waggle" && q.kind !== "spot");
          b.disabled = !!unusable;
          b.onclick = () => usePower(key, p);
          pr.append(b);
        }
        box.append(pr);
      }
      if (st.answered) {
        const next = el("button", "buy wide", st.hp <= 0 ? "Finish them" : st.hearts <= 0 ? "Retreat" : "Next"); next.type = "button";
        next.onclick = () => {
          if (st.hp <= 0) return win();
          if (st.hearts <= 0) return lose();
          st.q = null; st.answered = false; st.feedback = null; draw();
        };
        box.append(next); next.focus();
      }
    };

    const answer = (correct, card) => {
      if (st.answered) return;
      st.answered = true;
      const q = st.q;
      const fb = el("div", "feedback " + (correct ? "good" : "bad"));
      if (correct) {
        const dmg = st.mult; st.hp = Math.max(0, st.hp - dmg); st.mult = 1;
        S.stats.correct++;
        fb.append(el("b", null, dmg > 1 ? "CRITICAL! " + dmg + "x damage" : "Got it."));
        sfx.right(); setTimeout(sfx.hit, 120); shake = 8;
      } else {
        S.stats.wrong++;
        if (st.shield) { st.shield = false; fb.append(el("b", null, "Fooled, but the tardigrade shrugged it off.")); }
        else { st.hearts--; fb.append(el("b", null, "The slop got you.")); }
        sfx.wrong();
      }
      if (q.kind === "fact") {
        fb.append(el("p", null, (q.truth ? "Real. " : "Slop. ") + q.after));
        if (q.src) fb.append(el("small", null, "Source: " + q.src));
      } else {
        const realOnes = q.cards.filter(c => !c.fake).map(c => c.name).join(" and ");
        fb.append(el("p", null, realOnes + (q.cards.filter(c => !c.fake).length > 1 ? " are" : " is") + " real. The rest were stitched together by the Slop Machine."));
      }
      st.feedback = fb;
      draw();
    };

    const usePower = (key, p) => {
      st.powersUsed[key] = true;
      banner(p.who.toUpperCase() + ": " + p.name.toUpperCase() + "!");
      sfx.power();
      const q = st.q;
      if (key === "electro") { return setTimeout(() => answer(true), 500); }
      if (key === "fries") { st.hp = Math.max(0, st.hp - 2); shake = 14; sfx.hit(); setTimeout(sfx.hit, 140); if (st.hp <= 0) { st.answered = true; st.feedback = el("div", "feedback good"); st.feedback.append(el("b", null, "Angel ate the slop. AJ, check your shoes.")); } }
      if (key === "hiss") { st.hp = Math.max(0, st.hp - 1); shake = 10; sfx.hit(); if (st.hp <= 0) { st.answered = true; st.feedback = el("div", "feedback good"); st.feedback.append(el("b", null, "Shadow hissed the last of it away.")); } }
      if (key === "regen") st.hearts = Math.min(maxHearts, st.hearts + 1);
      if (key === "punch") st.mult = Math.max(st.mult, 2);
      if (key === "cavitation") st.mult = Math.max(st.mult, 3);
      if (key === "shield" || key === "pack") st.shield = true;
      if (key === "ink" || key === "thump") { st.q = null; }
      if (key === "waggle" && q.kind === "spot") {
        const wrong = q.cards.filter(c => !c.removed && (c.fake === q.findReal));
        if (wrong.length) wrong[0].removed = true;
      }
      draw();
    };

    const win = () => {
      const reward = Math.ceil(cost * 1.5 * raidMul());
      S.notes += reward; S.total += reward; S.stats.raidsWon++;
      sfx.win(); confetti(isBoss ? 160 : 70);
      if (isBoss) {
        flash();
        S.liberated++; S.raids = 0; recalc(); rebuildActors(); save();
        closeModal();
        const lines = STORY.bossWin[reg.boss];
        dialog(lines, reg.boss, () => {
          renderPanel();
          if (S.liberated >= REGIONS.length) ending();
          else revealRegion(REGIONS[S.liberated], () => toast(REGIONS[S.liberated].name + " unlocked. New animals to recruit!"));
        });
      } else {
        S.raids++; recalc(); rebuildActors(); save();
        const box = openModal("raid result");
        box.append(el("h3", null, "Raid cleared!"), el("p", null, reg.name + " slop down to " + Math.max(0, 100 - S.raids * 30) + "%. You recovered " + fmt(reward) + " field notes."));
        if (S.raids >= 3) box.append(el("p", "warn", "Something big is coming. The boss is ready in the Raids tab."));
        const ok = el("button", "buy wide", "Back to the field"); ok.type = "button"; ok.onclick = () => { closeModal(); renderPanel(); }; box.append(ok); ok.focus();
      }
    };
    const lose = () => {
      S.stats.raidsLost++; save();
      const box = openModal("raid result");
      box.append(el("h3", null, "The slop held its ground."), el("p", null, "No shame in it. Every wrong answer told you something true. Recruit more animals for powers and try again."));
      const ok = el("button", "buy wide", "Back to the field"); ok.type = "button"; ok.onclick = () => { closeModal(); renderPanel(); }; box.append(ok); ok.focus();
    };
    draw();
  }
  // Fake cards in raids get only a faint shimmer, so they're actually hard to spot.
  function subtleTint(hex, x, y) { return ((x * 7 + y * 3) % 23 === 0) ? "#c33cd1" : hex; }

  function banner(text) {
    const b = $("#banner"); b.textContent = text; b.hidden = false;
    b.classList.remove("go"); void b.offsetWidth; b.classList.add("go");
    clearTimeout(banner.t); banner.t = setTimeout(() => { b.hidden = true; }, 1400);
  }
  function toast(text) {
    const t = $("#toast"); t.textContent = text; t.hidden = false;
    clearTimeout(toast.t); toast.t = setTimeout(() => { t.hidden = true; }, 2600);
  }

  function ending() {
    S.ended = true; save();
    const box = openModal("ending");
    box.append(el("div", "crown", "♛"), el("h2", null, "KINGDOM: ANIMALIA"), el("p", "big", "AJ, Ruler of All Living Things"), el("p", null, "Every animal on Earth is real again. One tardigrade is still in orbit, vibing."));
    const st = el("p", "small", "Slop spotted: " + S.stats.correct + " · Times fooled: " + S.stats.wrong + " · Raids won: " + S.stats.raidsWon);
    box.append(st);
    const b = el("button", "buy wide", "How this was made"); b.type = "button"; b.onclick = credits; box.append(b);
    const k = el("button", "chip", "Keep playing"); k.type = "button"; k.onclick = closeModal; box.append(k);
  }
  function credits() {
    const box = openModal("credits");
    box.append(el("h3", null, "How this was made"));
    const p = (t) => box.append(el("p", null, t));
    p("Kingdom: Animalia was made for AJ by his sister Jessi, with cameos from Shadow, Angel, Wednesday, Jessi's silkies, and Lex's rats (led by Bonnie). The idea, the hero, and the whole \"take over the world with animals\" plan were hers.");
    p("She built it with Claude, an AI from Anthropic, over a couple of sessions. Here's what that means, and what it doesn't:");
    const ul = el("ul");
    for (const t of [
      "No AI image generators and no traced art. Claude wrote the drawing code while Jessi directed: every sprite is simple shapes plus pixels placed one at a time, saved as text in the code, one character per pixel. AJ's own sprite was drawn by eye from a photo Jessi chose.",
      "The scenery is drawn the same way, by code, a few colored rectangles at a time.",
      "Every animal fact was checked against the source printed on its card, and the tricky ones are worded carefully. Lyrebirds mostly copy other birds; the chainsaw ones live near people.",
      "The villain is AI slop on purpose. Fake animals and confident wrong facts are the enemy, and knowing real animals is how you win.",
      "The music and sound effects are generated live in your browser by code."
    ]) ul.append(el("li", null, t));
    box.append(ul);
    box.append(el("p", "challenge", "The challenge: you know more about animals than both of us. Find a fact in here that's wrong, tell Jessi, and you win. It gets fixed and you get bragging rights."));
    const ok = el("button", "buy wide", "Back"); ok.type = "button"; ok.onclick = closeModal; box.append(ok); ok.focus();
  }

  function howToPlay(done) {
    const box = openModal("howto");
    box.append(el("h3", null, "How to play"));
    const list = el("ol", "steps");
    for (const [icon, title, text] of [
      ["chicken", "Take field notes", "Tap the scene (or press Space). Every tap earns notes."],
      ["dog", "Recruit animals", "Spend notes on animals. They earn notes on their own, and each one comes with a real fact card."],
      ["jessi", "Visit the Workshop", "Jessi prints gear that boosts everything. Some of it is useless. On purpose."],
      ["machine", "Raid the slop", "Real or slop? Spot the fake animals and the false facts. Your animals give you powers to use."],
      ["hand", "Beat the boss", "Three raids clear a region's slop, then its boss shows up. Win to free the region and find new animals."],
      ["shadow", "Fill your guide", "The Guide tab keeps every fact card. Find one that's wrong and you win the challenge."]
    ]) {
      const li = el("li");
      const t = el("div"); t.append(el("b", null, title), el("span", null, text));
      li.append(spriteImg(icon, null, 44), t);
      list.append(li);
    }
    box.append(list);
    box.append(el("p", "src", "Keys: Space taps. In raids, R = real, S = slop, 1 to 3 pick a card. Progress saves by itself in this browser; More → \"Move your save\" carries it to another device."));
    const ok = el("button", "buy wide", "Got it"); ok.type = "button"; ok.onclick = () => { closeModal(); done && done(); }; box.append(ok); ok.focus();
  }

  // ---------- keyboard ----------
  document.addEventListener("keydown", (ev) => {
    if (ev.target.closest && ev.target.closest("textarea, input")) return;
    if (!$("#title").hidden || !$("#reveal").hidden) return;
    if (!modal.hidden) {
      const k = ev.key.toLowerCase();
      const b = mbox.querySelector(`button[data-key="${k}"]:not(:disabled)`);
      if (b) { ev.preventDefault(); b.click(); }
      return;
    }
    if (ev.code === "Space") { ev.preventDefault(); audio(); doTap(W / 2 + (Math.random() * 60 - 30), H / 2 + (Math.random() * 30 - 15)); }
  });

  // Test hook, only with ?debug in the address.
  if (/[?&]debug\b/.test(location.search)) window.__ka = { get S() { return S; }, set S(v) { S = v; }, recalc, rebuildActors, renderPanel, ending, credits, startRaid };

  // ---------- boot ----------
  for (const b of document.querySelectorAll(".tab")) b.onclick = () => setTab(b.dataset.tab);
  load(); recalc();
  const away = Math.min(8 * 3600, (Date.now() - (S.last || Date.now())) / 1000);
  rebuildActors(); renderPanel(); renderHud();
  requestAnimationFrame(frame);
  setInterval(save, 10000);
  window.addEventListener("pagehide", save);
  document.addEventListener("visibilitychange", () => { if (document.hidden) save(); });
  titleScreen(() => {
    if (!S.introDone) {
      story("intro", () => { S.introDone = true; save(); howToPlay(() => toast("Tap the yard to take field notes. Space bar works too.")); });
    } else if (away > 60 && R.nps > 0) {
      const earned = R.nps * away * offlineRate();
      S.notes += earned; S.total += earned;
      dialog([["jessi", "While you were gone, your animals kept working. You picked up " + fmt(earned) + " field notes."]]);
    }
  });
  document.addEventListener("pointerdown", () => { audio(); if (S.music && !musicTimer) startMusic(); }, { once: true });
})();

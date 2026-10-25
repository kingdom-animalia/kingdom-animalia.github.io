// Region backdrops, all drawn in code. Each region is painted in layers, back to front.
// Anything that never moves is painted once into an offscreen canvas; only clouds, water,
// smoke and drifting silhouettes are redrawn every frame.
function Scenery(g, W, H) {
  let pg = g;                                   // the canvas the helpers below paint on
  const cache = {};
  function painted(key, paint) {
    if (!cache[key]) {
      const c = document.createElement("canvas"); c.width = W; c.height = H;
      pg = c.getContext("2d"); paint(); pg = g;
      cache[key] = c;
    }
    g.drawImage(cache[key], 0, 0);
  }

  // ---------- helpers ----------
  // Fixed pseudo-random numbers, so the scenery is the same every time the game loads.
  const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  // 2x2 ordered dither: d = 1, 2 or 3 pixels out of every 4.
  const bayer = (x, y, d) => d === 1 ? !(x & 1) && !(y & 1) : d === 2 ? !((x + y) & 1) : !((x & 1) && (y & 1));
  function rect(x, y, w, h, col) { if (col) pg.fillStyle = col; pg.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function band(y0, y1, col) { rect(0, y0, W, y1 - y0, col); }
  function dither(x0, y0, x1, y1, col, d) {
    pg.fillStyle = col;
    for (let y = Math.max(0, Math.round(y0)); y < Math.min(H, y1); y++)
      for (let x = Math.max(0, Math.round(x0)); x < Math.min(W, x1); x++) if (bayer(x, y, d)) pg.fillRect(x, y, 1, 1);
  }
  // Crisp pixel circles; canvas arcs would blur the edges.
  function circle(cx, cy, r) {
    for (let dy = -Math.floor(r); dy <= r; dy++) { const w = Math.sqrt(r * r - dy * dy); pg.fillRect(Math.round(cx - w), Math.round(cy + dy), Math.round(2 * w), 1); }
  }
  function dcircle(cx, cy, r, col, d) {
    pg.fillStyle = col;
    for (let dy = -Math.floor(r); dy <= r; dy++) {
      const y = Math.round(cy + dy), w = Math.sqrt(r * r - dy * dy);
      if (y < 0 || y >= H) continue;
      for (let x = Math.max(0, Math.round(cx - w)); x < Math.min(W, Math.round(cx + w)); x++) if (bayer(x, y, d)) pg.fillRect(x, y, 1, 1);
    }
  }
  // Sky bands that dither into each other instead of hard stripes. The last stop only marks the end.
  function sky(stops) {
    for (let i = 0; i < stops.length - 1; i++) band(stops[i][0], stops[i + 1][0], stops[i][1]);
    for (let i = 1; i < stops.length - 1; i++) { const [y, c] = stops[i]; dither(0, y - 4, W, y - 2, c, 1); dither(0, y - 2, W, y, c, 2); }
  }
  // A skyline painted column by column from a height function.
  function skyline(base, bottom, col, height) {
    pg.fillStyle = col;
    for (let x = 0; x < W; x++) { const top = Math.round(base - height(x)); pg.fillRect(x, top, 1, bottom - top); }
  }
  const rolling = (amp, wave, seed) => (x) => amp * (0.6 + 0.28 * Math.sin(x / wave + seed) + 0.12 * Math.sin(x / (wave * 0.37) + seed * 3));
  const peaks = (pts) => (x) => {
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0, h0] = pts[i], [x1, h1] = pts[i + 1];
      if (x >= x0 && x <= x1) return h0 + (h1 - h0) * (x - x0) / (x1 - x0);
    }
    return 0;
  };
  // Scatter little patches of a darker or lighter tone so ground isn't one flat color.
  function mottle(y0, y1, col, n, seed, d) {
    for (let i = 0; i < n; i++) {
      const x = hash(i + seed) * W, y = y0 + hash(i + seed + 50) * (y1 - y0 - 3), w = 6 + hash(i + seed + 90) * 16;
      dither(x, y, x + w, y + 2 + (i % 2), col, d);
    }
  }
  // A round leafy tree lit from the top left; cols = [shadow, body, light].
  function leafy(x, y, s, cols) {
    rect(x - 1, y - s * 0.9, 3, s * 0.9, "#5c3a24");
    pg.fillStyle = cols[0]; circle(x, y - s * 1.25, s * 0.8); circle(x - s * 0.55, y - s, s * 0.5); circle(x + s * 0.55, y - s * 0.95, s * 0.55);
    pg.fillStyle = cols[1]; circle(x - s * 0.12, y - s * 1.38, s * 0.62); circle(x - s * 0.55, y - s * 1.08, s * 0.38);
    pg.fillStyle = cols[2]; circle(x - s * 0.35, y - s * 1.62, s * 0.24);
  }
  // The savanna umbrella tree: a leaning trunk that forks, under a wide, flat, layered crown.
  function acacia(x, y, s, col) {
    pg.fillStyle = col;
    const tw = Math.max(1, Math.round(s / 7));
    for (let i = 0; i < s; i++) pg.fillRect(Math.round(x + i * 0.15), y - i, tw + (i < 3 ? 1 : 0), 1);
    const fork = y - s;
    for (let i = 0; i < s * 0.55; i++) {
      pg.fillRect(Math.round(x + s * 0.15 - i * 0.9), fork - i, tw, 1);
      pg.fillRect(Math.round(x + s * 0.15 + i * 1.1), fork - i, tw, 1);
      if (i < s * 0.3) pg.fillRect(Math.round(x + s * 0.15 + i * 0.2), fork - i, 1, 1);
    }
    const top = Math.round(fork - s * 0.55);
    const rows = Math.max(3, Math.round(s * 0.32));
    for (let dy = 0; dy < rows; dy++) {                                       // crown: widest just above its flat underside
      const w = s * (1.15 + 0.25 * Math.sin(dy / rows * Math.PI)) * (dy === 0 ? 0.8 : 1);
      const off = Math.round(Math.sin(dy * 2.3 + x) * s * 0.06);
      pg.fillRect(Math.round(x + s * 0.15 - w + off), top - rows + dy + 1, Math.round(w * 2), 1);
    }
    for (let i = 0; i < 9; i++) {                                             // clumps poking out of the top
      const cx = x + s * 0.15 + (hash(i + x) - 0.5) * s * 2.1;
      pg.fillRect(Math.round(cx), top - rows - 1, 2 + Math.round(hash(i + 3 + x) * s * 0.2), 2);
    }
  }
  function saguaro(x, y, h) {
    rect(x, y - h, 4, h, "#257179"); rect(x + 1, y - h, 1, h, "#38b764");
    rect(x - 4, y - h * 0.55, 4, 3, "#257179"); rect(x - 4, y - h * 0.55 - 7, 3, 7);
    rect(x + 4, y - h * 0.4, 4, 3); rect(x + 5, y - h * 0.4 - 9, 3, 9);
    rect(x - 3, y - h * 0.55 - 7, 1, 7, "#38b764"); rect(x + 6, y - h * 0.4 - 9, 1, 9);
  }
  function puff(x, y, s, col, under) {           // a pixel cloud with a shaded belly
    pg.fillStyle = col; circle(x, y, s); circle(x + s * 1.1, y + s * 0.3, s * 0.75); circle(x - s * 1.1, y + s * 0.35, s * 0.65);
    rect(x - s * 1.7, y + s * 0.4, s * 3.6, s * 0.55);
    rect(x - s * 1.6, y + s * 0.95, s * 3.3, 1, under);
  }
  const drift = (t, base, speed, span) => ((base + t / speed) % (W + span)) - span / 2;

  // ---------- the backyard ----------
  function coop() {
    for (let i = 0; i <= 16; i++) { const half = 36 * i / 16; rect(48 - half, 62 + i, half * 2, 1, i % 4 === 3 ? "#45204a" : "#5d275d"); }
    rect(20, 78, 56, 36, "#b13e53");
    for (let x = 23; x < 76; x += 5) rect(x, 80, 1, 34, "#8e2f45");          // boards
    rect(18, 78, 60, 2, "#f4f4f4");                                           // trim
    rect(25, 85, 14, 11, "#f4f4f4"); rect(26, 86, 12, 9, "#73eff7"); rect(31, 86, 1, 9, "#f4f4f4"); rect(26, 90, 12, 1, "#f4f4f4");
    rect(27, 87, 3, 2, "#d4fbff");                                            // glint on the glass
    rect(52, 96, 12, 18, "#f4f4f4"); rect(53, 97, 10, 17, "#1a1c2c");        // chicken door
    for (let i = 0; i < 14; i++) rect(52 - i, 113 + Math.floor(i / 3), 1, 2, i % 3 ? "#d9a066" : "#8a5a3b");   // ramp
    rect(76, 92, 9, 12, "#8a5a3b"); rect(75, 90, 11, 3, "#5d275d"); rect(77, 95, 7, 1, "#5c3a24");            // nest box
    rect(46, 68, 4, 4, "#ffcd75");                                            // vent
  }
  const yard = () => {
    sky([[0, "#41a6f6"], [30, "#73eff7"], [66, "#a8f4ff"], [96, "#d4fbff"], [110]]);
    dcircle(206, 28, 20, "#fff1b8", 1); dcircle(206, 28, 15, "#fff1b8", 2);
    pg.fillStyle = "#ffcd75"; circle(206, 28, 11); pg.fillStyle = "#fff1b8"; circle(206, 28, 8);
    skyline(104, 110, "#9ed9c0", rolling(10, 46, 1.3));
    for (let i = 0; i < 16; i++) leafy(i * 21 + hash(i) * 10 - 6, 109, 6 + hash(i + 7) * 4, ["#1f6b45", "#2f9c55", "#38b764"]);
    // the big oak on the right
    rect(288, 58, 9, 56, "#5c3a24"); rect(290, 60, 2, 50, "#8a5a3b"); rect(268, 60, 22, 3, "#5c3a24");
    pg.fillStyle = "#1f6b45"; circle(294, 42, 26); circle(268, 52, 15); circle(318, 52, 16);
    pg.fillStyle = "#2f9c55"; circle(288, 36, 20); circle(266, 48, 10);
    pg.fillStyle = "#38b764"; circle(280, 28, 9); circle(262, 44, 4);
    band(110, 180, "#38b764"); band(110, 112, "#a7f070");
    mottle(114, 180, "#2f9c55", 46, 1, 2); mottle(114, 180, "#a7f070", 16, 7, 1);
    for (let x = 0; x < W; x += 14) { rect(x, 92, 4, 22, "#8a5a3b"); rect(x, 92, 1, 22, "#5c3a24"); rect(x, 91, 4, 1, "#d9a066"); }
    for (const y of [98, 106]) { rect(0, y, W, 3, "#8a5a3b"); rect(0, y, W, 1, "#d9a066"); }
    coop();
    for (let i = 0; i < 34; i++) {                                            // dandelions and clover
      const x = hash(i + 200) * W, y = 118 + hash(i + 300) * 58;
      rect(x, y + 1, 1, 2, "#2f9c55"); rect(x, y, 1, 1, i % 3 ? "#ffcd75" : "#f4f4f4");
    }
  };
  const yardMoving = (t) => {
    puff(drift(t, 30, 260, 80), 46, 3, "#e3f8ff", "#c4e4ef"); puff(drift(t, 200, 260, 80), 52, 3, "#e3f8ff", "#c4e4ef");
    puff(drift(t, 120, 140, 90), 32, 5, "#f4f4f4", "#cfe3ee");
    puff(drift(t, 10, 80, 110), 16, 7, "#f4f4f4", "#cfe3ee"); puff(drift(t, 190, 80, 110), 22, 6, "#f4f4f4", "#cfe3ee");
  };

  // ---------- hometown at dusk ----------
  const HOUSES = [[6, 40, 38, "#333c57", 1], [52, 34, 30, "#3b2a52", 0], [94, 44, 44, "#333c57", 1], [196, 42, 40, "#3b2a52", 1], [250, 36, 32, "#333c57", 0], [290, 28, 36, "#3b2a52", 1]];
  function house(x, w, h, wall, lit) {
    const base = 120, y = base - h, rh = Math.round(w * 0.32);
    rect(x, y, w, h, wall);
    if (lit) { dcircle(x + 8, y + 9, 8, "#ef7d57", 1); dcircle(x + w - 8, y + 9, 8, "#ef7d57", 1); }
    pg.fillStyle = "#1a1c2c";
    for (let i = 0; i <= rh; i++) { const half = (w / 2 + 2) * i / rh; pg.fillRect(Math.round(x + w / 2 - half), y - rh + i, Math.round(half * 2), 1); }
    rect(x + w * 0.72, y - rh - 2, 4, rh);                                   // chimney
    const win = (wx, wy) => { rect(wx, wy, 6, 6, lit ? "#ffcd75" : "#29366f"); rect(wx + 2, wy, 1, 6, "#1a1c2c"); rect(wx, wy + 2, 6, 1); };
    win(x + 5, y + 6); win(x + w - 11, y + 6);
    rect(x - 2, base - 13, w + 4, 2, "#1a1c2c");                              // porch roof
    rect(x - 1, base - 11, 1, 11); rect(x + w, base - 11, 1, 11);             // porch posts
    rect(x + w / 2 - 3, base - 10, 6, 10, "#2b2421");                         // front door
    if (lit) rect(x + w / 2 - 1, base - 6, 1, 1, "#ffcd75");                  // doorknob catching the light
  }
  function lamp(x) { dcircle(x + 1, 98, 7, "#ffcd75", 1); rect(x, 96, 2, 24, "#1a1c2c"); rect(x - 2, 94, 6, 3); rect(x - 1, 97, 4, 2, "#ffcd75"); }
  const town = () => {
    sky([[0, "#29366f"], [40, "#5d275d"], [72, "#b13e53"], [96, "#ef7d57"], [110, "#ffcd75"], [120]]);
    for (let i = 0; i < 40; i++) rect(hash(i) * W, hash(i + 5) * 44, 1, 1, i % 5 ? "#c6ccd6" : "#f4f4f4");
    dcircle(250, 110, 19, "#ffcd75", 1); pg.fillStyle = "#fff1b8"; circle(250, 110, 13);
    skyline(106, 120, "#7a3a6a", rolling(14, 60, 2.1));                      // far ridges
    skyline(114, 120, "#4a2a5a", rolling(9, 32, 0.4));
    for (const x of [184, 240]) leafy(x, 120, 7, ["#16303a", "#1f3b44", "#2a4a50"]);
    for (const [x, w, h, wall, lit] of HOUSES) house(x, w, h, wall, lit);
    // the church
    rect(146, 82, 22, 38, "#2b2438");
    for (let i = 0; i <= 8; i++) { const half = 13 * i / 8; rect(157 - half, 74 + i, half * 2, 1, "#1a1c2c"); }
    rect(153, 58, 8, 18, "#2b2438");
    for (let i = 0; i < 14; i++) { const half = 5 * i / 14; rect(157 - half, 44 + i, half * 2 + 1, 1, "#1a1c2c"); }
    rect(156, 38, 1, 6, "#1a1c2c"); rect(154, 40, 5, 1);
    pg.fillStyle = "#ffcd75"; circle(157, 66, 2.5); rect(152, 98, 10, 22, "#2b2421"); rect(154, 88, 6, 6, "#ffcd75");
    lamp(88); lamp(180); lamp(244);
    band(120, 180, "#257179"); band(120, 123, "#566c86"); rect(0, 123, W, 1, "#333c57");   // sidewalk
    mottle(126, 180, "#1f5f66", 40, 3, 2); mottle(126, 180, "#38b764", 10, 11, 1);
    band(139, 151, "#5c3a24"); band(140, 150, "#3b5dc9");                     // the creek
    dither(0, 141, W, 143, "#ef7d57", 1); dither(0, 148, W, 150, "#29366f", 2);
    for (let i = 0; i < 30; i++) rect(hash(i + 70) * W, i % 2 ? 139 : 150, 2, 1, "#94b0c2");   // creek stones
  };
  const townMoving = (t) => {
    for (let x = (t / 30) % 16 - 16; x < W; x += 16) { rect(x, 144, 6, 1, "#73eff7"); rect(x + 9, 147, 3, 1, "#73eff7"); }
    // chimney smoke from the lit houses
    for (const [x, w, h, , lit] of HOUSES) {
      if (!lit) continue;
      const cx = x + w * 0.72 + 1, top = 120 - h - Math.round(w * 0.32) - 2;
      for (let k = 0; k < 4; k++) {
        const ph = (t / 2400 + k / 4 + x / 97) % 1;
        pg.globalAlpha = 0.55 * (1 - ph);
        rect(cx + Math.sin(ph * 5 + x) * 2 + ph * 6, top - 2 - ph * 22, 2 + Math.round(ph * 2), 2, "#94b0c2");
      }
    }
    pg.globalAlpha = 1;
  };

  // ---------- the Americas ----------
  const rockies = peaks([[0, 30], [30, 52], [55, 38], [85, 66], [110, 44], [140, 58], [170, 40], [205, 70], [235, 46], [262, 55], [290, 38], [320, 50]]);
  // A mesa: flat cap, sheer cliff, then a sloping skirt of fallen rock. Lit from the left.
  function mesa(x0, x1, top, base, col, side) {
    const c0 = x0 + 12, c1 = x1 - 12, cliff = top + 12;
    for (let x = x0; x <= x1; x++) {
      const out = x < c0 ? c0 - x : x > c1 ? x - c1 : 0;
      const y = out ? cliff + Math.round(out * 0.9 + Math.sin(x * 1.7) * 0.8) : top + (x % 7 === 0 ? 1 : 0);
      rect(x, y, 1, base - y, x > c1 - 6 ? side : col);
      if (!out && x % 11 === 3) rect(x, top + 3, 1, 8, side);               // cracks down the cliff
    }
    dither(c0, cliff, c1, cliff + 2, side, 2);                              // where cliff meets skirt
    dither(c0, top + 5, c1 - 6, top + 6, side, 1);                          // a band of rock strata
  }
  const amer = () => {
    sky([[0, "#b13e53"], [28, "#ef7d57"], [62, "#ffcd75"], [94, "#fff1b8"], [118]]);
    dcircle(70, 82, 15, "#fff1b8", 2); pg.fillStyle = "#fff1b8"; circle(70, 82, 10);
    for (let x = 0; x < W; x++) {                                             // the Rockies, lit from the left
      const h = rockies(x), top = Math.round(110 - h);
      rect(x, top, 1, 118 - top, rockies(x + 1) < h ? "#6a4a7a" : "#8a6a9c");
      if (h > 46) rect(x, top, 1, 2 + (h - 46) / 4 + (x * 7) % 3, rockies(x + 1) < h ? "#c6ccd6" : "#f4f4f4");
    }
    mesa(146, 192, 70, 118, "#c4562f", "#8e2f45");                          // a lone butte
    skyline(117, 119, "#e0a03c", rolling(9, 34, 1.1));                       // prairie hills in front
    skyline(117, 119, "#c28e5c", rolling(5, 22, 2.6));
    // the edge of the Amazon, far right
    for (let i = 0; i < 9; i++) { pg.fillStyle = "#1f6b45"; circle(248 + i * 9 + hash(i) * 6, 98 + hash(i + 3) * 8, 9 + hash(i + 5) * 5); }
    for (let i = 0; i < 9; i++) { pg.fillStyle = "#38b764"; circle(246 + i * 9 + hash(i) * 6, 94 + hash(i + 3) * 8, 4 + hash(i + 5) * 3); }
    skyline(118, 124, "#c28e5c", rolling(4, 20, 0.7));
    band(120, 180, "#d9a066"); mottle(124, 180, "#c28e5c", 44, 5, 2); mottle(124, 180, "#ffcd75", 14, 9, 1);
    saguaro(30, 130, 24); saguaro(212, 124, 15);
  };
  const amerMoving = (t) => {
    const ph = (t / 22000) % 1, tx = -20 + ph * (W + 40), ty = 150 - Math.abs(Math.sin(t / 180)) * 7;
    dcircle(tx, ty, 5, "#8a5a3b", 2); dcircle(tx, ty, 3, "#5c3a24", 1);       // tumbleweed
    const a = t / 3000, hx = 160 + Math.cos(a) * 70, hy = 32 + Math.sin(a) * 12, flap = Math.sin(t / 150) > 0 ? 0 : 1;
    rect(hx - 4, hy + flap, 3, 1, "#5d275d"); rect(hx - 1, hy + 1, 2, 1); rect(hx + 1, hy + flap, 3, 1);   // circling hawk
  };

  // ---------- the wild world ----------
  const wild = () => {
    sky([[0, "#5d275d"], [30, "#b13e53"], [62, "#ef7d57"], [92, "#ffcd75"], [112]]);
    dcircle(240, 92, 34, "#fff1b8", 1); dcircle(240, 92, 30, "#fff1b8", 2); pg.fillStyle = "#fff1b8"; circle(240, 92, 26);
    rect(196, 80, 90, 2, "#ef7d57"); rect(214, 87, 60, 1); rect(180, 70, 54, 1, "#ffcd75");
    for (let x = 4; x <= 96; x++) {                                           // big red rock, far off
      const h = 18 * Math.sqrt(Math.max(0, 1 - ((x - 50) / 46) ** 2)) ** 0.6;
      rect(x, 112 - h, 1, h, x > 72 ? "#8e2f45" : "#b13e53");
      if (x % 9 === 0) rect(x, 112 - h + 3, 1, h - 3, "#8e2f45");
    }
    acacia(132, 111, 6, "#7a3346"); acacia(168, 111, 5, "#7a3346"); acacia(304, 112, 7, "#6a2a3e");
    band(112, 180, "#c28e5c"); mottle(116, 180, "#8a5a3b", 40, 13, 2); mottle(116, 180, "#d9a066", 18, 17, 1);
    for (let i = 0; i < 31; i++) {                                           // termite mound
      const w = 2 + i * 0.28 + Math.sin(i) * 0.6;
      rect(282 - w, 98 + i, w, 1, "#b47b47"); rect(282, 98 + i, w, 1, "#8a5a3b");
    }
    acacia(72, 114, 22, "#1a1c2c");
  };
  const wildMoving = (t) => {
    for (let k = 0; k < 3; k++) {                                             // elephants crossing the horizon
      const x = W + 30 - ((t / 90 + k * 26) % (W + 80)), small = k === 2, step = Math.floor(t / 300 + k) % 2;
      pg.fillStyle = "#4a1e36";
      if (small) { rect(x, 105, 7, 4); rect(x - 2, 104, 3, 3); rect(x - 3, 106, 1, 3); rect(x + 1, 109, 1, 2 - step); rect(x + 5, 109, 1, 1 + step); }
      else { rect(x, 102, 11, 6); rect(x - 3, 101, 4, 5); rect(x - 4, 104, 1, 5); rect(x + 1, 108, 2, 3 - step); rect(x + 8, 108, 2, 2 + step); rect(x + 11, 103, 1, 3); }
    }
    for (let k = 0; k < 5; k++) {                                             // a flock of birds
      const x = drift(t, k * 9, 60, 60), y = 40 + k * 3 + Math.sin(t / 400 + k) * 2, f = Math.sin(t / 120 + k) > 0;
      rect(x, y + (f ? 0 : 1), 2, 1, "#5d275d"); rect(x + 2, y + 1, 1, 1); rect(x + 3, y + (f ? 0 : 1), 2, 1);
    }
  };

  // ---------- the deep ----------
  function fan(x, y, h, col) {                                                // branching fan coral
    pg.fillStyle = col;
    for (let i = 0; i < h; i++) pg.fillRect(x, y - i, 1, 1);
    for (let b = -2; b <= 2; b++) for (let i = 0; i < h * 0.7; i++) pg.fillRect(Math.round(x + b * i * 0.35), Math.round(y - h * 0.3 - i), 1, 1);
  }
  const deep = () => {
    sky([[0, "#3b5dc9"], [34, "#29366f"], [86, "#1d2558"], [134, "#141838"], [180]]);
    skyline(150, 180, "#1a2150", rolling(16, 40, 0.8)); skyline(162, 180, "#202a62", rolling(10, 24, 2.2));
    band(168, 180, "#333c57"); dither(0, 168, W, 180, "#566c86", 1); rect(0, 168, W, 1, "#566c86");
    const corals = [[30, "#b13e53"], [70, "#ef7d57"], [118, "#8f4fb0"], [166, "#f4a6b8"], [214, "#ffcd75"], [262, "#b13e53"], [300, "#8f4fb0"]];
    corals.forEach(([x, col], i) => {
      if (i % 2) fan(x, 170, 14 + (i % 3) * 3, col);
      else { pg.fillStyle = col; circle(x, 170, 6); dither(x - 6, 165, x + 6, 172, "#1a1c2c", 1); }     // brain coral
    });
    for (let i = 0; i < 8; i++) { rect(90 + i * 3, 172 - (i % 3) * 3, 2, 8 + (i % 3) * 3, "#c6ccd6"); rect(90 + i * 3, 172 - (i % 3) * 3, 2, 1, "#f4f4f4"); }   // tube coral
    for (const [x, r] of [[150, 5], [236, 7], [12, 4]]) { pg.fillStyle = "#29366f"; circle(x, 173, r); }
  };
  const deepMoving = (t) => {
    pg.globalAlpha = 0.12; pg.fillStyle = "#73eff7";
    for (let i = 0; i < 5; i++) { const x = (i * 70 + t / 40) % 360 - 20; pg.beginPath(); pg.moveTo(x, 0); pg.lineTo(x + 20, 0); pg.lineTo(x + 60, 180); pg.lineTo(x + 30, 180); pg.fill(); }
    pg.globalAlpha = 1;
    for (let x = 12; x < W; x += 46) {                                        // kelp
      for (let y = 168; y > 90; y -= 6) { const sx = x + Math.round(Math.sin(y / 14 + t / 700) * 3); rect(sx, y, 3, 6, "#257179"); if (y % 12 === 0) rect(sx + 3, y + 1, 3, 2, "#38b764"); }
    }
    for (let k = 0; k < 10; k++) {                                            // a school of fish
      const x = W + 20 - ((t / 50 + (k % 5) * 7) % (W + 60)), y = 70 + (k > 4 ? 6 : 0) + Math.sin(t / 500 + k) * 3;
      rect(x, y, 3, 2, "#41a6f6"); rect(x + 3, y - (k % 2 ? 0 : 1) + 0, 1, 2 + (k % 2 ? 0 : 1), "#41a6f6");
    }
    for (const ax of [48, 190, 286]) for (let k = 0; k < 5; k++) rect(ax + k * 2 + Math.round(Math.sin(t / 400 + k) * 1.5), 162 + (k % 2), 1, 6, "#f4a6b8");   // anemones
    for (let i = 0; i < 14; i++) { const bx = (i * 53) % W, by = H - ((t / 20 + i * 37) % H); rect(bx, by, 2, 2, "#73eff7"); }
  };

  // ---------- orbit ----------
  const orbit = () => {
    band(0, 180, "#0b0d1a");
    for (let i = 0; i < 14; i++) dcircle(30 + i * 22, 30 + i * 5 + Math.sin(i) * 12, 16 + hash(i) * 10, i % 2 ? "#251c44" : "#18284a", 1);   // nebula
    for (let i = 0; i < 6; i++) dcircle(120 + i * 22, 52 + i * 4, 9, "#3a2a5e", 1);
    for (let i = 0; i < 140; i++) rect(hash(i) * W, hash(i + 1000) * 150, 1, 1, i % 3 ? "#566c86" : "#c6ccd6");
    for (let i = 0; i < 7; i++) {
      const x = hash(i + 33) * W, y = hash(i + 77) * 110;
      rect(x - 1, y, 3, 1, "#94b0c2"); rect(x, y - 1, 1, 3); rect(x, y, 1, 1, "#f4f4f4");
    }
    pg.fillStyle = "#94b0c2"; circle(45, 40, 10); pg.fillStyle = "#c6ccd6"; circle(43, 38, 9);   // the moon
    pg.fillStyle = "#94b0c2"; circle(39, 41, 2); circle(46, 34, 1.5); circle(44, 44, 1.2);
    dcircle(160, 330, 207, "#73eff7", 1); dcircle(160, 330, 204, "#73eff7", 2);   // atmosphere glow
  };
  // Earth turns slowly underneath: land and clouds from wobbly sine noise, redrawn a few times a second.
  const earthCv = document.createElement("canvas"); earthCv.width = W; earthCv.height = H;
  let earthStep = -1;
  function drawEarth(t) {
    const step = Math.floor(t / 150);
    if (step !== earthStep) {
      earthStep = step;
      const e = earthCv.getContext("2d"); e.clearRect(0, 0, W, H);
      for (let y = 128; y < H; y++) {
        const half = Math.sqrt(200 * 200 - (y - 330) ** 2);
        for (let x = Math.max(0, Math.round(160 - half)); x < Math.min(W, Math.round(160 + half)); x++) {
          const u = x + step * 0.5, v = y * 2.2;
          const land = Math.sin(u / 23) + Math.sin(u / 9.7 + v / 31) + Math.sin(v / 13 - u / 41);
          const cloud = Math.sin((x + step) / 11 + y / 5) + Math.sin((x + step) / 29 - y / 7);
          let col = land > 1.1 ? (land > 1.9 ? "#a7f070" : "#38b764") : "#3b5dc9";
          if (cloud > 1.45 || (cloud > 1.25 && bayer(x, y, 2))) col = "#f4f4f4";
          const rim = y - (330 - Math.sqrt(200 * 200 - (x - 160) ** 2));
          if (rim < 2) col = "#73eff7";
          else if (x > 160 + half - 26) col = shade(col, -0.4);                 // night side
          e.fillStyle = col; e.fillRect(x, y, 1, 1);
        }
      }
    }
    g.drawImage(earthCv, 0, 0);
  }
  const orbitMoving = (t, S) => {
    drawEarth(t);
    const sx = ((t / 40) % (W + 40)) - 20, sy = 70 - sx * 0.12;               // a satellite going over
    rect(sx, sy, 3, 2, "#c6ccd6"); rect(sx - 4, sy, 3, 1, "#3b5dc9"); rect(sx + 4, sy, 3, 1);
    if (Math.floor(t / 600) % 2) rect(sx + 1, sy - 1, 1, 1, "#e04a3f");
    if (S.liberated < 6) g.drawImage(spriteCanvas("machine"), 268, 20, 32, 32);
  };

  const STATIC = { yard, town, amer, wild, deep, orbit };
  const MOVING = { yard: yardMoving, town: townMoving, amer: amerMoving, wild: wildMoving, deep: deepMoving, orbit: orbitMoving };
  return {
    draw(region, t, S) { painted(region, STATIC[region]); MOVING[region](t, S); },
    circle
  };
}

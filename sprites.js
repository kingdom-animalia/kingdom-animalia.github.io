// Every sprite is hand-placed pixels: one character per pixel, 16x16.
// Palette is Sweetie 16 plus a few earth tones. "." is transparent.
const PAL = {
  k: "#1a1c2c", w: "#f4f4f4", r: "#b13e53", o: "#ef7d57", y: "#ffcd75",
  g: "#a7f070", G: "#38b764", t: "#257179", b: "#29366f", B: "#3b5dc9",
  c: "#41a6f6", C: "#73eff7", s: "#94b0c2", S: "#566c86", d: "#333c57",
  P: "#5d275d", n: "#8a5a3b", N: "#5c3a24", m: "#d9a066", x: "#f4a6b8",
  D: "#2b2421", e: "#e04a3f"
};

// m: true means the rows are the left half; the right half is mirrored.
const SPRITE_ROWS = {
  chicken: [   // Jessi's silkies: black, pom-pom crest, turquoise earlobe, feathered feet
    "......kkkk......",
    ".....kDDDDk.....",
    "....kDSDDDDk....",
    "...kDDDDDDDDk...",
    "...kDDDDDDwkDok.",
    "...kDDDDDDDook..",
    "..kDDDDDDDCDk...",
    ".kDDDDDDDDDDk...",
    "kDDDSDDDDDDDDk..",
    "kDDDDSDDDDSDDk..",
    "kDDDDDSDDSDDDk..",
    ".kDDDDDDDDDDk...",
    "..kkDDDDDDkk....",
    "...kDDkkDDk.....",
    "..kSDDk.kSDDk...",
    "..kkkkk.kkkkk..."
  ],
  graysilkie: [   // the one gray silkie in Jessi's flock
    "......kkkk......",
    ".....kssssk.....",
    "....ksSssssk....",
    "...kssssssssk...",
    "...ksssssswksok.",
    "...ksssssssook..",
    "..ksssssssCsk...",
    ".kssssssssssk...",
    "ksssSssssssssk..",
    "kssssSssssSssk..",
    "ksssssSssSsssk..",
    ".kssssssssssk...",
    "..kksssssskk....",
    "...ksskkssk.....",
    "..kSssk.kSssk...",
    "..kkkkk.kkkkk..."
  ],
  rat: [   // one of Lex's many rats
    "..........kk....",
    ".........kxxk...",
    "......kkkknnkk..",
    "....kknnnnnnknk.",
    "...knwwwwwwnnnxk",
    "x.knwwwwwwwwwkk.",
    ".xkwwwwwwwwwk...",
    "..xkkwkkkwkk....",
    "....kxk.kxk....."
  ],
  bonnie: [   // Bonnie: pink, hairless, in charge
    "..........kk....",
    ".........kxrk...",
    "......kkkkxxkk..",
    "....kkxxxxxxkxk.",
    "...kxxxxxxxxxxrk",
    "x.kxxxxxxxxxxkk.",
    ".xkxxrxxxxrxk...",
    "..xkkxkkkxkk....",
    "....kxk.kxk....."
  ],
  wednesday: [   // Wednesday: Jessi's rabbit, all black
    "..........kk....",
    ".........kDk....",
    ".........kDk.kk.",
    ".........kDkkDk.",
    "........kDDkDk..",
    ".......kDDDDDk..",
    ".......kDwDDDDk.",
    "..kk..kDDDDDxk..",
    ".kDDkkDDDDDDk...",
    ".kDDDDDDDDDDk...",
    "kDDDDDDDDDDDk...",
    "kDDDDDDDDDDk....",
    ".kDDDDDDDDDk....",
    "..kkDkkkkDDk....",
    "...kk....kk....."
  ],
  shadow: [    // AJ's cat. Black, yellow eyes, judging you.
    "..........k...k.",
    ".........kDk.kDk",
    ".........kDDDDDk",
    ".........kDyDyDk",
    ".........kDDDDDk",
    "..k.......kDxDk.",
    ".kDk.....kDDDDk.",
    "..kDk...kDDDDDDk",
    "...kDk.kDDDDDDDk",
    "...kDDkDDDDDDDDk",
    "....kDDDDDDDDDk.",
    "....kDDDDDDDDDk.",
    "....kDDkDDDkDDk.",
    "....kkk.kkk.kkk."
  ],
  dog: [   // Angel, from Jessi's photo: tan, black saddle, dark muzzle, floppy ears, teal collar
    "........kkkkk...",
    ".......knmmmmk..",
    "......knnmmmmmk.",
    "......knnmkmmmDk",
    "...k..knnmmmmDDk",
    "..kDk..kntttmk..",
    "..kDkkkkDDDDmk..",
    "...kDDDDDDDmmk..",
    "...kmDDDDDmmmk..",
    "...kmmmmmmmmk...",
    "...kmk.kk.kmk...",
    "...kmk....kmk...",
    "...kkk....kkk..."
  ],
  crow: [
    ".........kkk....",
    "........kdddk...",
    ".......kddwdkk..",
    ".......kdddddSS.",
    "......kddddddkk.",
    "..kk.kdddddddk..",
    ".kddkddddddddk..",
    "..kdddddddddk...",
    "...kddddddddk...",
    "....kdddddkk....",
    ".....kkkkk......",
    "......S..S......",
    ".....SS.SS......"
  ],
  honeybee: [
    ".....C.C........",
    "....CwCwC.......",
    "....CCwCC.......",
    ".....CCC........",
    "....kkkkkkkk....",
    "...kykykykyyk...",
    "..kkykykykyykk..",
    "..kkykykykyykwk.",
    "..kkykykykyykkk.",
    "...kykykykyyk...",
    "....kkkkkkkk....",
    ".......k........"
  ],
  squirrel: [
    ".kkk............",
    "kSSSk...........",
    "kSsSSk......kk..",
    "kSssSSk....kSSk.",
    ".kSssSSk..kSSSkk",
    "..kSssSk.kSSkSSk",
    "..kSsSSkkSSSSSSk",
    "...kSSSkSSSSSkk.",
    "....kSSSSSSwSk..",
    "....kSSSSSSwwk..",
    ".....kSSSSSwk...",
    ".....kSSSSSSk...",
    "......kSSkSSk...",
    "......kkk.kkk..."
  ],
  opossum: [
    "..........kk.k..",
    ".........kwwkwk.",
    "......kkkwwwwwk.",
    "....kkSSSswkwwwk",
    "...kSSSSSSswwwxk",
    "..kSSSSSSSSswwk.",
    "..kSSSSSSSSSSk..",
    ".xkSSSSSSSSSSk..",
    "x..kSSkkkkSSk...",
    "x..kxk....kxk...",
    ".x..k......k...."
  ],
  raccoon: [
    "..........k...k.",
    ".........kSk.kSk",
    ".........kSSkSSk",
    "........kSkkkkSk",
    "........kkwkwkkk",
    ".kk.....kSSSSSSk",
    "kSdk....kSSSkkk.",
    "kddSk..kSSSSk...",
    ".kSdkkkSSSSSSk..",
    "..kdSSSSSSSSSk..",
    "...kSSSSSSSSSk..",
    "....kSSkkkSSk...",
    "....kkk...kkk..."
  ],
  bat: { m: true, rows: [
    ".....k..",
    ".....kk.",
    ".....knk",
    "k....knn",
    "kk..knwn",
    "kNk.knnn",
    "kNNkknnx",
    "kNNNknnn",
    "kNNNNknn",
    ".kNNNknn",
    "..kNk.kn",
    "...k..k."
  ]},
  bear: [
    "...........kk.k.",
    "..........kDDkDk",
    "..kkkkkkkkDDDDDk",
    ".kDDDDDDDDDDDwDk",
    "kDDDDDDDDDDDDDmk",
    "kDDDDDDDDDDDDmmk",
    "kDDDDDDDDDDDDkk.",
    "kDDDDDDDDDDDk...",
    ".kDDkkDDkkDDk...",
    ".kDDk.kDk.kDk...",
    ".kkkk.kkk.kkk..."
  ],
  hellbender: [
    "..........kkkk..",
    "...kkkkkkknnnnk.",
    ".kknnnnnnnnnnwnk",
    "knnmnnmnnmnnnnnk",
    "kNnnnnnnnnnnnkk.",
    ".kkNNkkNNkkNkk..",
    "..kNk..kNk.kNk..",
    "..kk...kk..kk..."
  ],
  starmole: [
    "............x.x.",
    ".....kkkkkk.xxxx",
    "...kkDDDDDDkxxxx",
    "..kDDDDDDDDDkxx.",
    ".kDDDDDDDDDDDk.x",
    "kDDDDDDDDDDDDk..",
    ".kDDDDDDDDDDk...",
    "..kxxkkkkxxk....",
    "..kxk....kxk...."
  ],
  monarch: { m: true, rows: [
    "......k.",
    ".......k",
    ".kkkk..k",
    "koooook.",
    "kowoook.",
    "koookkk.",
    ".kkkooko",
    "..koowkk",
    "..kooookk".slice(0, 8),
    "...kkkk.",
    "........"
  ]},
  pronghorn: [
    "...........k.k..",
    "...........kkk..",
    "..........kmmk..",
    "..........kmwmk.",
    ".kk.......kmmmkk",
    "kmmkkkkkkkmmmk..",
    "kwmmmmmmmmmmk...",
    "kwwmmmmmmwwk....",
    ".kwwwwwwwwwk....",
    "..kmk.kmk.kmk...",
    "..kmk.kmk.kmk...",
    "..kk..kk..kk...."
  ],
  falcon: [
    ".........kkk....",
    "........kSSSk...",
    ".......kSkwSSk..",
    ".......kSkSSyy..",
    "......kSSSSSkk..",
    "....kkSSssssk...",
    "..kkSSSsssssk...",
    ".kSSSSSsksksk...",
    "..kkSSSssssk....",
    "....kkSSSSk.....",
    "......kkkk......",
    ".......y.y......",
    "......yy.yy....."
  ],
  axolotl: [
    "..x.x...........",
    ".xkxk..kkkkk....",
    "..xkxkkxxxxxk...",
    "...kxxxkxxkxk.x.",
    "..xkxxxxxxxxxkx.",
    ".xkxxxxxxxxxxk..",
    "...kxxxxxxxxxxk.",
    "....kxxxxxxxxxxk",
    ".....kxkkkxk.kxk",
    ".....kk...kk..kk"
  ],
  eel: [
    "...........y....",
    "..........yy....",
    ".........yyy....",
    ".....kkkkkkkkkk.",
    "...kkSSSSSSSSwSk",
    ".kkSSSSSSSSSSSSk",
    "kSSSyyyyyyyyyyk.",
    ".kkkkkkkkkkkkk.."
  ],
  leafcutter: [
    ".......GG.......",
    "......GGGG......",
    ".....GGgGGG.....",
    "......GGGG......",
    ".......kk.......",
    "....kk.kk.......",
    "...knnkkk.kkk...",
    "..knnnnkknnnnk..",
    "..knnnnkknnnnwk.",
    "...kknkk.kknkk..",
    "..k..k..k..k....",
    ".k..k....k..k..."
  ],
  elephant: [
    ".....kkkkkkk....",
    "...kkSSSSSSSkk..",
    "..kSSSSSSSssSSk.",
    ".kSSSSSSSsSwsSk.",
    ".kSSSSSSSsSSSSSk",
    ".kSSSSSSSSSSSkSk",
    ".kSSSSSSSSSSSkSk",
    "..kSSSSSSSSSSkSk",
    "..kSSkkSSkkSSkSk",
    "..kSSk.kSk.kSkSk",
    "..kkkk.kkk.kkkkk"
  ],
  platypus: [
    "....kkkkkkk.....",
    ".kkknnnnnnnk....",
    "kNNknnnnnnwnkkk.",
    "kNNknnnnnnnnkSSk",
    "kNNknnnnnnnnkSSk",
    ".kkknnnnnnnnkkk.",
    "....kNkkkkNk....",
    "....kk....kk...."
  ],
  wombat: [
    "....kkkkkkkk....",
    "..kknnnnnnnnkk..",
    ".knnnnnnnnnnwnk.",
    "knnnnnnnnnnnnnmk",
    "knnnnnnnnnnnnnmk",
    "knnnnnnnnnnnnkk.",
    ".knnkknnkknnk...",
    ".kNk.kNk.kNk.kkk",
    ".kk..kk..kk..kNk",
    ".............kkk"
  ],
  lyrebird: [
    ".k.....k........",
    "k.k...k.k.......",
    "k..k.k..k.......",
    "k..kwk..k.......",
    ".k.kwk.k........",
    "..kkwkk.........",
    "...kwk.....kk...",
    "...kkkk...knnk..",
    "....knnkkknnwk..",
    "....knnnnnnnnyy.",
    ".....knnnnnnk...",
    "......knnnnk....",
    ".......kkkk.....",
    "........n.n.....",
    ".......nn.nn...."
  ],
  bombardier: [
    "...........k.k..",
    "...........kk...",
    ".....kkkkk.kok..",
    "...kkbBbBbkkook.",
    "..kbBbBbBbBkoowk",
    ".kbBbBbBbBbBkok.",
    ".kbbbbbbbbbbkk..",
    "y.kkkkkkkkkkk...",
    "yy.k.k..k.k.....",
    "y..k.k..k.k....."
  ],
  molerat: [
    ".......kkkkkkk..",
    "....kkkxxxxxxxk.",
    "..kkxxxxxxxxkxxk",
    ".kxxxxxxxxxxxxxk",
    "kxxxxxxxxxxxxxwk",
    "kxxxxxxxxxxxxkwk",
    ".kxkkkxkkkxkk.k.",
    ".kxk..kxk.kxk..."
  ],
  octopus: { m: true, rows: [
    ".....kkk",
    "....krrr",
    "...krrrr",
    "...krwkr",
    "...krrrr",
    "...krrrr",
    "....krrr",
    "..kkrkrr",
    ".krrkrkr",
    ".krk.krk",
    "krk.krk.",
    "kk..kk.."
  ]},
  mantis: [
    "..........kk.kk.",
    "..........kCkkCk",
    "...........kkkk.",
    "........kkkGGGk.",
    ".....kkkGGgGGek.",
    "...kkGGgGGgGGkek",
    ".kkBBGGGGGGGGkke",
    "kBBkkkGGGGGkk.kk",
    ".kk..kokkokk....",
    ".....k.k.k.k...."
  ],
  pistol: [
    "......k.........",
    ".......k...kkkk.",
    "........k.kooook",
    "....kkkkkkoooook",
    "..kkoooooookkkk.",
    ".kooooooowokkook",
    "kooooooooookoook",
    ".kkokokokokk.kk.",
    "...k.k.k.k......"
  ],
  otter: [
    "....kkk.........",
    "...kmmmk...kkk..",
    "..kmwmwmkkksssk.",
    "..kmmkmmknnksssk",
    "...kmmmknnnnkkk.",
    "..kknnnnnnnnnnkk",
    ".knnnnnnnnnnnnnk",
    "..kkkkkkkkkkkkk.",
    ".cccccccccccccc.",
    "cCcccCcccCcccCcc"
  ],
  hagfish: [
    ".......C.C..C...",
    ".....kkkkkkkkkk.",
    "...kkxxxxxxxxxxk",
    ".kkxxxxxxxxxxxwk",
    "kxxxxxxxxxxxxxxk",
    ".kkkkkkkkkkkkkk.",
    "...C....C...C...",
    "..CCC..CCC.CCC.."
  ],
  jellyfish: { m: true, rows: [
    ".....kkk",
    "....kCCC",
    "...kCCCC",
    "...kCCrr",
    "...kCrrr",
    "...kkkkk",
    "....c.c.",
    "....c.c.",
    ".....c.c",
    "....c..c",
    "....c..."
  ]},
  whale: [
    "k...............",
    "kk.....kkkkkkk..",
    "kBk..kkBBBBBBBkk",
    "kBBkkBBBBBBBBBBk",
    ".kBBBBBBBBBBBwBk",
    "kBBkkccccccccccBk".slice(0, 16),
    "kBk..kkcccccccck",
    "kk.....kkkkkkkk."
  ],
  tardigrade: [
    "......kkkkkk....",
    "....kkmmmmmmkk..",
    "...kmmmmmmmmmmk.",
    "..kmmmmmmmmmkmmk",
    "..kmmmmmmmmmmmmk",
    "..kmmmmmmmmmmmk.",
    "...kmkmkmkmkkk..",
    "...kmkmkmkmk....",
    "...kk.kk.kk....."
  ],
  aj: [
    ".....kkkkkk.....",
    "....kNNNNNNk....",
    "...kNNNNNNNNk...",
    "..kSkNNNNNNkSk..",
    "..kSkmmmmmmkSk..",
    "..kSkmkmmkmkSk..",
    "...kkmmmmmmkk...",
    "....kmmxxmmk....",
    ".....kmmmmk.....",
    "...kkGGkkGGkk...",
    "..kGGGGGGGGGGk..",
    ".kGGGGGgGGGGGGk.",
    ".kGGGGGgGGGGGGk.",
    ".kGGGGGGGGGGGGk.",
    ".kkkkkkkkkkkkkk."
  ],
  jessi: [
    ".....kkkkkk.....",
    "....knnnnnnk....",
    "...knnnnnnnnk...",
    "..knnmmmmmmnnk..",
    "..knmkmmmmkmnk..",
    "..knmmmmmmmmnk..",
    "..knnmmxxmmnnk..",
    "..knnkmmmmknnk..",
    "..knk.kmmk.knk..",
    "...kkkPPPPkkk...",
    "..kPPPPPPPPPPk..",
    ".kPPPPPPPPPPPPk.",
    ".kPPPPwPPPPPPPk.",
    ".kPPPPPPPPPPPPk.",
    ".kkkkkkkkkkkkkk."
  ],
  hand: [
    ".k.k.k.k.k.k.k..",
    "kmkmkmkmkmkmkmk.",
    "kmkmkmkmkmkmkmk.",
    "kmkmkmkmkmkmkmk.",
    "kmkmkmkmkmkmkmk.",
    "kmmmmmmmmmmmmmk.",
    "kmmmmmmmmmmmmmkk",
    "kmmmmmmmmmmmmmmk",
    "kmmmmmmmmmmmmmk.",
    ".kmmmmmmmmmmmk..",
    "..kmmmmmmmmmk...",
    "...kmmmmmmmk....",
    "....kmmmmmk.....",
    "....kmmmmmk.....",
    "....kkkkkkk....."
  ],
  machine: { m: true, rows: [
    "..kkkkkk",
    "..kSSSSS",
    "..kSkkkk",
    "..kSkCCe",
    "..kSkCeC",
    "..kSkCCC",
    "..kSkkkk",
    "..kSSSSS",
    "..kSeSyS",
    "..kSSSSS",
    "..kSkkkk",
    "..kSkPPP",
    "..kSSSSS",
    "..kkkkkk",
    "...kk..."
  ]}
};

// Lex's named rats: recolors of the rat sprite (n = hood/patches, w = body).
const RAT_COLORS = { evil: { n: "s" }, gidget: { n: "S", w: "s" }, gordito: { n: "m", w: "m" }, eyebrows: { n: "N", w: "n" } };
for (const [k, map] of Object.entries(RAT_COLORS)) SPRITE_ROWS[k] = SPRITE_ROWS.rat.map(r => r.replace(/[nw]/g, c => map[c] || c));

// Normalize every sprite to exactly 16x16, bottom-aligned so animals stand on the ground.
const SPR = {};
for (const [name, def] of Object.entries(SPRITE_ROWS)) {
  let rows = Array.isArray(def) ? def : def.rows;
  if (!Array.isArray(def) && def.m) {
    rows = rows.map(r => {
      const half = (r + "........").slice(0, 8);
      return half + half.split("").reverse().join("");
    });
  }
  rows = rows.map(r => (r + "................").slice(0, 16));
  while (rows.length < 16) rows.unshift("................");
  SPR[name] = rows.slice(-16);
}

// The 32x32 set (sprites_hd.js) wins when it has the animal; otherwise the 16x16 one is doubled.
const hdRows = (name) => (typeof SPRH !== "undefined" && SPRH[name]) || double(SPR[name]);
function double(rows) { return rows.flatMap(r => { const d = r.replace(/./g, "$&$&"); return [d, d]; }); }
const NO_SHADE = new Set(["k", "K", "w"]);

// Paint a sprite onto a 32x32 offscreen canvas once; reuse it everywhere.
const SPRITE_CACHE = {};
function spriteCanvas(name, opts) {
  opts = opts || {};
  const key = name + "|" + (opts.tint ? (opts.tint.name || "t") : "") + "|" + (opts.rows ? opts.rows.join("") : "") + (opts.blink ? "|blink" : "");
  if (SPRITE_CACHE[key]) return SPRITE_CACHE[key];
  let rows = opts.rows || hdRows(name);
  if (rows.length === 16) rows = double(rows);
  if (opts.blink && typeof EYES !== "undefined" && EYES[name]) rows = blinkRows(rows, EYES[name]);
  const cv = document.createElement("canvas");
  cv.width = 32; cv.height = 32;
  const g = cv.getContext("2d");
  const at = (x, y) => (y >= 0 && y < 32 && x >= 0 && x < 32) ? rows[y][x] : ".";
  const edge = (x, y) => { const c = at(x, y); return c === "." || c === "k"; };
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
      const ch = rows[y][x];
      if (ch === "." || !PAL[ch]) continue;
      let col = PAL[ch];
      if (opts.tint && ch !== "k") col = opts.tint(col, x, y);
      if (ch === "k") {
        // Outer outline on top edges picks up the color it wraps, so shapes look lit instead of stamped.
        const below = at(x, y + 1);
        if (at(x, y - 1) === "." && below !== "." && below !== "k" && PAL[below]) col = shade(opts.tint ? opts.tint(PAL[below], x, y) : PAL[below], -0.6);
      } else if (!NO_SHADE.has(ch) && !opts.flat) {
        // Soft dome shading: light from the top left, two pixels deep.
        let amt = 0;
        if (edge(x, y - 1)) amt += 0.24; else if (edge(x, y - 2)) amt += 0.1;
        if (edge(x - 1, y)) amt += 0.08;
        if (edge(x, y + 1)) amt -= 0.22; else if (edge(x, y + 2)) amt -= 0.08;
        if (edge(x + 1, y)) amt -= 0.08;
        if (amt) col = shade(col, Math.max(-0.3, Math.min(0.3, amt)));
      }
      g.fillStyle = col;
      g.fillRect(x, y, 1, 1);
    }
  }
  SPRITE_CACHE[key] = cv;
  return cv;
}

// A blink: each eye pixel takes the color of the fur above it, and the bottom row becomes the closed lid line.
function blinkRows(rows, eyes) {
  const isEye = new Set(eyes.map(([x, y]) => x + "," + y));
  const out = rows.map(r => r.split(""));
  for (const [x, y] of eyes) {
    let yy = y - 1;
    while (yy > 0 && (isEye.has(x + "," + yy) || rows[yy][x] === "k" || rows[yy][x] === ".")) yy--;
    out[y][x] = isEye.has(x + "," + (y + 1)) ? rows[yy][x] : "k";
  }
  return out.map(r => r.join(""));
}

// Lighten (amt > 0) or darken (amt < 0) a hex color.
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  return "#" + [16, 8, 0].map(sh => {
    const c = (n >> sh) & 255;
    const v = amt > 0 ? c + (255 - c) * amt : c * (1 + amt);
    return Math.round(v).toString(16).padStart(2, "0");
  }).join("");
}

// Slop chimeras: the top half of one real animal stitched to the bottom half of another,
// with an off color shimmer. The joke is that they look almost plausible.
function chimeraRows(a, b) {
  return hdRows(a).slice(0, 16).concat(hdRows(b).slice(16));
}
function slopTint(hex, x, y) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, bl = n & 255;
  const shift = ((x + y) % 3) * 18;
  r = Math.min(255, r * 0.7 + 90 + shift); g = g * 0.55; bl = Math.min(255, bl * 0.8 + 110);
  return "#" + [r, g, bl].map(v => Math.round(v).toString(16).padStart(2, "0")).join("");
}

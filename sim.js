// Balance simulator: a reasonable (not perfect) player, 1-second steps.
const fs = require("fs");
const vm = require("vm");
const ctx = { console, Math, module: undefined, SPR: { dog: Array(16).fill("................") }, chimeraRows: () => [] };
vm.createContext(ctx);
for (const f of ["data.js", "econ.js"]) vm.runInContext(fs.readFileSync(__dirname + "/" + f, "utf8").replace(/^const /gm, "var ").replace(/^function /gm, "function "), ctx);
const { REGIONS, ANIMALS, UPGRADES, computeRates, animalCost, raidCost, bossCost } = ctx;

const TAPS_PER_SEC = +process.argv[2] || 3;
const RAID_SECONDS = 50;
const s = { notes: 0, owned: {}, upgrades: {}, liberated: 0, raids: 0 };
let t = 0, busy = 0;
const log = [];
while (t < 6 * 3600 && s.liberated < 6) {
  const r = computeRates(s, ANIMALS, UPGRADES);
  s.notes += r.nps + (busy > 0 ? 0 : r.tap * TAPS_PER_SEC);
  if (busy > 0) { busy--; t++; continue; }
  const cur = s.liberated;
  // raid if affordable
  const needRocket = cur === 5 && !s.upgrades.rocket;
  const rc = s.raids < 3 ? raidCost(cur, s.raids) : bossCost(cur);
  if (!needRocket && s.notes >= rc && s.notes - rc >= 0) {
    // only raid when it's at most ~45s of income, so the player isn't starving the economy
    if (rc <= Math.max(r.nps, r.tap * TAPS_PER_SEC) * 45 || s.notes > rc * 3) {
      s.notes -= rc; busy = RAID_SECONDS;
      if (s.raids < 3) s.raids++; else { s.liberated++; s.raids = 0; log.push(`${(t/60).toFixed(1)} min: liberated ${REGIONS[cur].name}`); }
      t++; continue;
    }
  }
  // buy best payback
  let best = null;
  ANIMALS.forEach((a, i) => {
    if (a.region > s.liberated) return;
    const c = animalCost(i, s.owned[a.id] || 0);
    const s2 = { ...s, owned: { ...s.owned, [a.id]: (s.owned[a.id] || 0) + 1 } };
    const gain = computeRates(s2, ANIMALS, UPGRADES).nps - r.nps + 0.0001;
    const score = c / gain;
    if (!best || score < best.score) best = { score, c, kind: "a", id: a.id };
  });
  for (const u of UPGRADES) {
    if (s.upgrades[u.id] || u.region > s.liberated || (u.req && !s.upgrades[u.req])) continue;
    const s2 = { ...s, upgrades: { ...s.upgrades, [u.id]: true } };
    const r2 = computeRates(s2, ANIMALS, UPGRADES);
    const gain = (r2.nps - r.nps) + (r2.tap - r.tap) * TAPS_PER_SEC + 0.0001;
    let score = u.cost / gain;
    if (u.id === "vase1") score = 0; // everyone buys the joke
    if (u.id === "rocket" && s.liberated === 5) score = 0;
    if (!best || score < best.score) best = { score, c: u.cost, kind: "u", id: u.id };
  }
  if (best && s.notes >= best.c) {
    s.notes -= best.c;
    if (best.kind === "a") s.owned[best.id] = (s.owned[best.id] || 0) + 1; else { s.upgrades[best.id] = true; log.push(`${(t/60).toFixed(1)} min: bought ${best.id}`); }
  }
  t++;
}
console.log(log.join("\n"));
console.log(`finished: ${s.liberated === 6} at ${(t/60).toFixed(1)} min, taps/s=${TAPS_PER_SEC}`);
console.log("owned:", JSON.stringify(s.owned));

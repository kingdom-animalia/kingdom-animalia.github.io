// Economy shared by the game and the balance simulator.
const ECON = {
  costBase: 15, costGrowth: 2.7,   // animal i's first recruit costs costBase * costGrowth^i
  payBase: 8, payGrowth: 1.28,     // seconds of payback at base: payBase * payGrowth^i
  levelGrowth: 1.15,               // each extra of the same animal costs 15% more
  libBonus: 1.6,                   // each liberated region multiplies all notes
  raidsPerRegion: 3
};

const PERK_PCT = { opossum: 5, bat: 10, bear: 10, pronghorn: 10, leafcutter: 20, elephant: 10, wombat: 25,
  molerat: 15, otter: 25, jellyfish: 30, whale: 50 };
const REGION_PERK = { hellbender: [1, 10], eel: [2, 15], pistol: [4, 20] };

function animalBaseCost(i) { return ECON.costBase * Math.pow(ECON.costGrowth, i); }
function animalBaseProd(i) { return animalBaseCost(i) / (ECON.payBase * Math.pow(ECON.payGrowth, i)); }
function animalCost(i, owned, discount = 1) { return Math.ceil(animalBaseCost(i) * Math.pow(ECON.levelGrowth, owned) * discount); }

// state: { owned: {id: n}, upgrades: {id: true}, liberated: n }
function computeRates(state, animals, upgrades) {
  let allMul = 1, tapMul = 1, regionMul = {};
  for (const u of upgrades) {
    if (!state.upgrades[u.id]) continue;
    if (u.eff.allMul) allMul *= u.eff.allMul;
    if (u.eff.tapMul) tapMul *= u.eff.tapMul;
    if (u.eff.regionMul) regionMul[u.eff.regionMul[0]] = (regionMul[u.eff.regionMul[0]] || 1) * u.eff.regionMul[1];
  }
  let pct = 0;
  const regionPct = {};
  for (const a of animals) {
    if (!(state.owned[a.id] > 0)) continue;
    if (PERK_PCT[a.id]) pct += PERK_PCT[a.id];
    if (REGION_PERK[a.id]) { const [r, p] = REGION_PERK[a.id]; regionPct[r] = (regionPct[r] || 0) + p; }
  }
  const lib = Math.pow(ECON.libBonus, state.liberated);
  let nps = 0;
  const per = {};
  animals.forEach((a, i) => {
    const n = state.owned[a.id] || 0;
    if (!n) return;
    const v = animalBaseProd(i) * n * allMul * (1 + pct / 100) * (1 + (regionPct[a.region] || 0) / 100) * (regionMul[a.region] || 1) * lib;
    per[a.id] = v; nps += v;
  });
  let tapBase = 1 + (state.owned.chicken > 0 ? 1 : 0) + (state.owned.starmole > 0 ? 2 : 0);
  let tapPct = (state.owned.dog > 0 ? 0.01 : 0) + (state.owned.falcon > 0 ? 0.02 : 0);
  const tap = tapBase * tapMul + nps * tapPct;
  return { nps, tap, per };
}

function raidCost(regionIdx, raidsDone) {
  return Math.ceil(REGIONS[regionIdx].raidCost * Math.pow(1.6, raidsDone));
}
function bossCost(regionIdx) { return Math.ceil(REGIONS[regionIdx].raidCost * 5); }

if (typeof module !== "undefined") module.exports = { ECON, animalBaseCost, animalBaseProd, animalCost, computeRates, raidCost, bossCost };

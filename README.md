# Kingdom: Animalia

**Play it here: https://kingdom-animalia.github.io**

An idle game about taking the world back from AI slop, one real animal at a time. You're AJ, the animal expert. The Slop Machine is flooding the world with six-legged dogs and confidently wrong facts. You recruit real animals, raid the slop, and prove what's real.

Made for AJ by Jessi. Works in any browser, on PC or phone. No account, no install, no ads. Progress saves in your browser.

## How to play

1. **Take field notes.** Tap the scene (or press Space).
2. **Recruit animals.** They earn notes on their own, and each one comes with a fact card and a source.
3. **Workshop.** Jessi prints gear. Some of it helps.
4. **Raid the slop.** Real or slop? Spot the fake animals and the false facts. Your animals give you powers.
5. **Beat the boss.** Three raids clear a region, then its boss shows up. Free all six regions, from the backyard to orbit.
6. **The challenge.** Find a fact in the game that's wrong, tell Jessi, and you win. It gets fixed and you get bragging rights.

Raid keys: `R` real, `S` slop, `1`–`3` pick a card.

## How it was made

Jessi directed it and built it with Claude (an AI from Anthropic). Since the whole game is about not trusting slop, here's exactly what that means:

- **No AI image generators, no traced art.** Every picture is drawn by code. The animals are simple shapes plus pixels placed one at a time, saved as plain text, one character per pixel. Open `sprites_hd.js` and you can read a silkie chicken row by row.
- **Every animal fact has a source**, printed on its card. Tricky ones are worded carefully.
- **Sound and music** are generated live in the browser with the Web Audio API. There are no audio files.
- **No libraries, no frameworks, no build step beyond gluing files together.** Just HTML, CSS and plain JavaScript.

## Code tour

| File | What's in it |
|---|---|
| `art/paint.py` | A tiny pixel painter: ellipses, polygons, lines, auto-outline. |
| `art/pets.py`, `art/wild.py`, `art/people.py` | Every character, drawn as code. The family's pets are in `pets.py`. |
| `art/build_hd.py` | Turns those drawings into `sprites_hd.js` (32×32 sprites as text). |
| `sprites.js` | Turns text rows into pictures, with shading, blinking and the slop "chimera" stitching. |
| `scenery.js` | The six region backdrops, painted in layers with pixel dithering. |
| `chrome.js` | The pixel window frames, title screen and region reveal. |
| `data.js` | Every animal, fact, source, myth, story line and boss. |
| `econ.js`, `sim.js` | The economy, plus a simulator used to balance it (about 35–60 minutes to beat). |
| `game.js` | The engine: scene, panels, raids, sound, saving. |
| `shell.html` + `build.py` | The page layout; `build.py` inlines everything into `index.html`. |

To change something, edit the files, then run `python build.py` (and `python art/build_hd.py` first if you changed the art). Open `index.html` to play. Add `?debug` to the address for a test hook.

Found a bug or a wrong fact? That's the challenge. Tell Jessi.

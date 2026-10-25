"""Write ../sprites_hd.js from the drawing modules. Run: python build_hd.py"""
import json
from pathlib import Path

import pets
import wild
import people

# Extra colors for the 32x32 set (the base palette lives in sprites.js).
EXTRA_PAL = {
    "a": "#4b4350", "A": "#3a4566", "i": "#8b93a1", "j": "#c6ccd6", "p": "#d77a95",
    "l": "#ffd3dd", "h": "#f2cb94", "M": "#b47b47", "u": "#3d2817", "z": "#fff1b8",
    "q": "#c4562f", "f": "#1f6b45", "E": "#7a2238", "T": "#6bc9c0", "Y": "#e0a03c",
    "L": "#a99cc2", "v": "#8f4fb0", "K": "#120f14", "F": "#f3c6a5", "R": "#d99c7e",
}

sprites = {}
for mod in (pets, wild, people):
    sprites.update(mod.draw())

lines = [
    "// 32x32 sprites. Written by art/build_hd.py from hand-placed shapes and pixels;",
    "// one character per pixel, \".\" is transparent. Anything missing here falls back to sprites.js.",
    "Object.assign(PAL, " + json.dumps(EXTRA_PAL) + ");",
    "const SPRH = {",
]
for name, spr in sprites.items():
    lines.append("  " + json.dumps(name) + ": [")
    lines += ["    \"" + r + "\"," for r in spr.rows()]
    lines.append("  ],")
lines.append("};")
lines.append("// Eye pixels per sprite, closed for a blink. A \"name~pose\" key is an extra frame of that animal.")
lines.append("const EYES = " + json.dumps({n: s.eyes for n, s in sprites.items() if s.eyes}, separators=(",", ":")) + ";")
out = Path(__file__).parent.parent / "sprites_hd.js"
out.write_text("\n".join(lines) + "\n", encoding="utf-8")
print("wrote", len(sprites), "sprites to", out.name)

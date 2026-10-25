"""Inline the game scripts into two outputs:
- kingdom-animalia.html: the artifact page (claude.ai adds the doctype/head skeleton).
- Kingdom Animalia.html: a standalone file AJ can open in any browser, no account needed."""
from pathlib import Path

here = Path(__file__).parent
shell = (here / "shell.html").read_text(encoding="utf-8")
scripts = "\n".join(
    "<script>\n" + (here / f).read_text(encoding="utf-8") + "\n</script>"
    for f in ["sprites.js", "sprites_hd.js", "scenery.js", "data.js", "chrome.js", "econ.js", "game.js"]
)
page = shell.replace("<!--SCRIPTS-->", scripts)
(here / "kingdom-animalia.html").write_text(page, encoding="utf-8")

head, _, body = page.partition("<style>")
standalone = (
    "<!doctype html>\n<html lang=\"en\"><head><meta charset=\"utf-8\">\n"
    "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1,viewport-fit=cover\">\n"
    + head + "<style>" + body.replace("</style>", "</style>\n</head><body>", 1)
    + "\n</body></html>\n"
)
(here / "Kingdom Animalia.html").write_text(standalone, encoding="utf-8")
(here / "index.html").write_text(standalone, encoding="utf-8")   # what GitHub Pages serves
print("built", len(page), "bytes")

"""A tiny pixel painter for the 32x32 sprites.

Each animal is sketched from simple shapes (ellipses, polygons, lines), then hand
details are placed pixel by pixel. outline() wraps everything in a dark border.
The result is written out as plain text rows in sprites_hd.js, so every pixel can
still be edited by hand afterwards. No images are generated or traced."""

N = 32


class Spr:
    def __init__(self, w=N, h=N):
        self.w, self.h = w, h
        self.g = [["." for _ in range(w)] for _ in range(h)]
        self.eyes = []          # pixels that close when the animal blinks

    def eye_at(self, *xy):
        self.eyes += [list(p) for p in xy]
        return self

    def px(self, x, y, c):
        if 0 <= x < self.w and 0 <= y < self.h:
            self.g[y][x] = c
        return self

    def pts(self, c, *xy):
        for x, y in xy:
            self.px(x, y, c)
        return self

    def get(self, x, y):
        return self.g[y][x] if 0 <= x < self.w and 0 <= y < self.h else "."

    def ell(self, cx, cy, rx, ry, c, only=None):
        """Filled ellipse; `only` limits painting to pixels already holding one of those chars."""
        for y in range(self.h):
            for x in range(self.w):
                if ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1.0:
                    if only is None or self.g[y][x] in only:
                        self.g[y][x] = c
        return self

    def rect(self, x0, y0, x1, y1, c, only=None):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                if only is None or self.get(x, y) in only:
                    self.px(x, y, c)
        return self

    def poly(self, c, pts, only=None):
        """Filled polygon by scanline (pixel centers)."""
        n = len(pts)
        for y in range(self.h):
            yc = y + 0.5
            xs = []
            for i in range(n):
                (x0, y0), (x1, y1) = pts[i], pts[(i + 1) % n]
                if (y0 <= yc < y1) or (y1 <= yc < y0):
                    xs.append(x0 + (yc - y0) * (x1 - x0) / (y1 - y0))
            xs.sort()
            for a, b in zip(xs[::2], xs[1::2]):
                for x in range(self.w):
                    if a <= x + 0.5 <= b and (only is None or self.g[y][x] in only):
                        self.g[y][x] = c
        return self

    def line(self, x0, y0, x1, y1, c, w=1):
        steps = max(abs(x1 - x0), abs(y1 - y0), 1)
        for i in range(steps + 1):
            x = round(x0 + (x1 - x0) * i / steps)
            y = round(y0 + (y1 - y0) * i / steps)
            for dx in range(w):
                for dy in range(w):
                    self.px(x + dx, y + dy, c)
        return self

    def path(self, c, pts, w=1):
        for a, b in zip(pts, pts[1:]):
            self.line(*a, *b, c, w)
        return self

    def outline(self, c="k"):
        """Dark border on every empty pixel touching the shape (4-neighbour)."""
        add = []
        for y in range(self.h):
            for x in range(self.w):
                if self.g[y][x] != ".":
                    continue
                if any(self.get(x + dx, y + dy) not in (".", c) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                    add.append((x, y))
        for x, y in add:
            self.g[y][x] = c
        return self

    def mirror(self):
        """Copy the left half onto the right, for symmetric front-on sprites."""
        for row in self.g:
            for x in range(self.w // 2):
                row[self.w - 1 - x] = row[x]
        return self

    def recolor(self, mapping):
        out = Spr(self.w, self.h)
        out.g = [[mapping.get(ch, ch) for ch in row] for row in self.g]
        out.eyes = list(self.eyes)
        return out

    def rows(self):
        return ["".join(r) for r in self.g]

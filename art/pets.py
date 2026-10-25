"""The family's own animals. Details come from Jessi's descriptions and photos."""
from paint import Spr


def silkie(base="D", fluff="a", peck=False):
    """Jessi's silkies: pom-pom crest, turquoise earlobe, mulberry comb, feathered feet.
    peck=True drops the head toward the ground."""
    s = Spr()
    hx, hy = (2, 6) if peck else (0, 0)
    s.ell(13, 20, 11, 7.5, base)          # fluffy body
    s.ell(5, 14, 4.5, 5, base)            # tail fluff
    s.ell(20 + hx, 13 + hy * 0.6, 6, 6, base)       # neck ruff
    s.ell(20 + hx, 7 + hy, 6.5, 5.5, base)          # crest pom-pom
    s.rect(10, 27, 11, 28, "S").rect(16, 27, 17, 28, "S")       # legs
    s.ell(10, 29, 3, 1.2, base).ell(17, 29, 3, 1.2, base)       # feathered feet
    s.pts("S", (13, 30), (20, 30))                               # toes peeking out
    sh = lambda *xy: [(x + hx, y + hy) for x, y in xy]
    s.pts("S", *sh((27, 11), (28, 11), (27, 12)))                # beak
    s.pts("P", *sh((26, 8), (26, 9), (25, 8)))                   # walnut comb
    s.pts("K", *sh((24, 10))).pts("w", *sh((25, 10))).eye_at(*sh((24, 10), (25, 10)))   # eye + glint
    s.pts("C", *sh((23, 12), (24, 12), (23, 13), (24, 13)))      # turquoise earlobe
    # fluff strokes so it reads as feathers, not a blob
    for x, y in sh((17, 4), (21, 4), (16, 8), (20, 7)):          # crest wisps
        s.pts(fluff, (x, y), (x + 1, y - 1))
    s.pts(fluff, (3, 11), (4, 10), (6, 13), (7, 12))                # tail wisps
    s.path(fluff, [(9, 16), (13, 15), (18, 16), (21, 19)])          # wing edge
    for x, y in ((10, 22), (14, 23), (18, 22), (6, 21)):            # feather tips: little "v"s
        s.pts(fluff, (x, y), (x + 1, y + 1), (x + 2, y))
    s.pts(fluff, (9, 29), (16, 29))
    return s.outline()


def rat(hood="n", body="w", stripe=True, shoulders=True):
    """One of Lex's rats: long low body, round ears, pink feet and tail."""
    s = Spr()
    s.ell(15, 24, 10, 5.5, body)
    s.ell(24, 22, 5.5, 4.2, hood)
    s.poly(hood, [(26, 19), (30.5, 22), (30.5, 23.5), (26, 25.5)])   # snout
    if shoulders:
        s.ell(19, 22, 5.5, 4, hood, only={body})
    if stripe:
        s.ell(13, 19.6, 8, 1.4, hood, only={body})
    s.ell(22, 17, 2.4, 2.4, "x").px(22, 17, "p")          # ear
    s.pts("K", (25, 21), (26, 21), (25, 20)).px(26, 20, "w").eye_at((25, 21), (26, 21), (25, 20), (26, 20))
    s.px(30, 22, "x")                                      # nose
    s.rect(9, 29, 11, 30, "x").rect(19, 29, 21, 30, "x")  # feet
    s.path("x", [(5, 26), (3, 27), (1, 26), (1, 24), (2, 23)])   # tail with a little curl
    return s.outline()


def bonnie():
    """Bonnie: pink, hairless, wrinkly, in charge."""
    s = rat(hood="x", body="x", stripe=False, shoulders=False)
    s.ell(22, 16.5, 3, 3, "x").ell(22, 16.5, 1.5, 1.5, "p")   # bigger bare ears
    s.path("p", [(19, 19), (18, 22), (19, 25)])                # neck folds
    s.path("p", [(17, 20), (16, 23)])
    s.path("p", [(9, 22), (13, 21)]).path("p", [(10, 25), (14, 25)])
    s.pts("p", (28, 21), (29, 23))                             # muzzle creases
    s.rect(9, 30, 11, 30, "p").rect(19, 30, 21, 30, "p")
    return s.outline()


def wednesday(twitch=False):
    """Wednesday: Jessi's rabbit, all black. twitch=True swivels her front ear forward."""
    s = Spr()
    s.ell(12, 23, 9.5, 7, "D")                    # body
    s.ell(22, 17, 5.5, 5, "D")                    # head
    s.ell(26, 19, 3, 3, "D")                      # muzzle
    s.poly("D", [(17, 13), (16, 3), (18, 1), (20.5, 4), (20.5, 13)])   # back ear
    if twitch:
        s.poly("D", [(20, 13), (23, 4), (26, 2), (27.5, 4.5), (23.5, 13)])
        s.line(24, 5, 22, 11, "a").line(25, 5, 24, 8, "a")
    else:
        s.poly("D", [(20, 13), (21, 3), (23, 1), (25.5, 4), (23.5, 13)])   # front ear
        s.line(22, 4, 22, 11, "a").line(23, 5, 23, 9, "a")                 # inner ear
    s.ell(12, 29.5, 6, 1.3, "D")                  # hind foot
    s.ell(23, 29, 3, 1.5, "D")                    # front paw
    s.ell(3, 21, 2, 2, "a")                       # cotton tail, a shade lighter
    s.pts("N", (24, 16), (25, 16), (24, 15)).px(25, 15, "w").eye_at((24, 16), (25, 16), (24, 15), (25, 15))
    s.pts("x", (29, 19), (29, 18))                # nose
    s.pts("a", (28, 21), (27, 22))                # mouth
    s.path("a", [(6, 19), (9, 18), (13, 18)]).path("a", [(15, 22), (17, 25), (17, 28)])
    s.pts("a", (8, 26), (11, 27), (20, 24))
    return s.outline()


def shadow(flick=False):
    """AJ's cat Shadow. Black, gold eyes, half-lidded, judging you. flick=True swings her tail."""
    s = Spr()
    s.ell(13, 23, 7, 7, "D")
    s.ell(17, 22, 5, 7, "D")
    s.ell(19, 12, 6, 5, "D")
    s.poly("D", [(13, 10), (14, 2), (18.5, 7)])
    s.poly("D", [(19.5, 7), (24, 2), (25, 10)])
    s.pts("P", (15, 6), (15, 7), (16, 7), (23, 6), (23, 7), (22, 7))   # inner ears
    tail = [(8, 29), (4, 29), (1, 27), (1, 23), (2, 20), (1, 17)] if flick else [(8, 29), (4, 28), (2, 24), (3, 19), (5, 16), (7, 15)]
    s.path("D", tail, w=2)                                             # tail curling up
    s.rect(14, 30, 16, 30, "D").rect(19, 30, 21, 30, "D")              # paws
    for x0 in (15, 20):                                                # eyes: lid shadow over gold
        s.rect(x0, 11, x0 + 2, 11, "Y").rect(x0, 12, x0 + 2, 12, "y").px(x0 + 1, 12, "K").px(x0 + 1, 11, "K")
        s.eye_at(*[(x0 + i, y) for i in range(3) for y in (11, 12)])
    s.px(19, 14, "p")                                                  # nose
    s.pts("a", (18, 15), (20, 15))                                     # mouth
    s.line(17, 25, 17, 30, "k")                                        # gap between front legs
    s.pts("a", (14, 30), (20, 30), (10, 19), (9, 22), (12, 18), (21, 19), (22, 22))
    return s.outline()


def angel(wag=False):
    """Angel, from Jessi's photo: German shepherd mix, tan with a black saddle, dark muzzle,
    floppy ears, teal collar. wag=True lifts the tail."""
    s = Spr()
    s.ell(14, 19.5, 9.5, 5.5, "m")                             # body: deep and solid
    s.ell(21, 19.5, 5, 5.5, "m")                               # chest
    s.ell(8, 20, 4.5, 5, "m")                                  # haunch
    s.ell(23, 12, 5, 5, "m")                                   # round dog skull
    s.poly("m", [(26, 12), (30.5, 12.5), (30.5, 16), (26, 17)])   # short muzzle below the brow
    s.poly("D", [(27.5, 12), (30.5, 12.5), (30.5, 16), (27.5, 16.5)], only={"m"})   # dark muzzle
    s.ell(12, 15, 9, 3.2, "D", only={"m"}).ell(17, 14.8, 3, 1.8, "D", only={"m"})   # saddle
    s.ell(21.5, 12.5, 2.2, 3.6, "N")                           # floppy ear hanging beside the face
    s.pts("N", (22, 8), (23, 8))                               # where the ear folds over
    s.pts("K", (30, 12), (30, 13))                             # nose
    s.pts("x", (28, 17), (29, 17), (28, 18))                   # tongue out, happy
    s.px(25, 11, "K").px(25, 10, "w").eye_at((25, 11), (25, 10))   # eye
    s.poly("t", [(18, 16), (21.5, 17), (21, 19), (17.5, 18)])  # teal collar
    s.px(20, 20, "y")                                          # tag
    s.rect(6, 24, 7, 27, "m").rect(7, 27, 8, 30, "m")          # back legs (hock bend)
    s.rect(11, 24, 12, 30, "m")
    s.rect(19, 24, 20, 30, "m").rect(22, 24, 23, 30, "m")      # front legs
    s.pts("m", (9, 30), (13, 30), (21, 30), (24, 30))          # paws
    if wag:
        s.poly("D", [(5, 15), (2, 12), (1, 7), (3, 6), (4, 11), (6.5, 14)])           # tail up, wagging
        s.path("M", [(2, 9), (3, 12)])
    else:
        s.poly("D", [(5, 15), (2.5, 18), (1.5, 25), (3.5, 27), (4, 21), (6.5, 18)])   # bushy tail, hanging
        s.path("M", [(3, 20), (2, 24)])
    s.ell(15, 24, 7, 1.2, "M", only={"m"})                     # belly shade
    return s.outline()


def draw():
    out = {
        "chicken": silkie(),
        "graysilkie": silkie("i", "j"),
        "rat": rat(),
        "evil": rat(hood="j", body="w", stripe=False, shoulders=False),
        "gidget": rat(hood="i", body="w"),
        "gordito": rat(hood="m", body="h"),
        "eyebrows": rat(hood="N", body="n"),
        "bonnie": bonnie(),
        "wednesday": wednesday(),
        "shadow": shadow(),
        "dog": angel(),
        # idle poses, swapped in now and then while an animal stands still
        "chicken~idle": silkie(peck=True),
        "graysilkie~idle": silkie("i", "j", peck=True),
        "wednesday~idle": wednesday(twitch=True),
        "shadow~idle": shadow(flick=True),
        "dog~idle": angel(wag=True),
    }
    return out

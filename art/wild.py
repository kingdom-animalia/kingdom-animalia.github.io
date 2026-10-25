"""Every recruitable wild animal, backyard to orbit. All face right; ground animals stand on row 30."""
from paint import Spr


def eye(s, x, y, iris="K"):
    s.px(x, y, iris).px(x + 1, y, iris).px(x + 1, y - 1, "w").px(x, y - 1, iris)
    s.eye_at((x, y), (x + 1, y), (x, y - 1), (x + 1, y - 1))


# ---------- backyard + hometown ----------
def crow(flap=False):
    s = Spr()
    s.ell(15, 17, 8, 5, "D")
    s.ell(23, 12, 4, 4, "D")
    s.poly("d", [(26, 10.5), (31, 12.5), (26, 14)])                    # heavy beak
    s.poly("D", [(8, 15), (1, 13), (1, 20), (8, 19.5)])                 # tail
    if flap:                                                            # downstroke
        s.poly("D", [(10, 17), (11, 27), (14, 29), (21, 20), (19, 16)])
        for x, y in ((11, 21), (13, 22), (15, 21)):
            s.line(x, y, x + 1, y + 5, "A")
    else:
        s.poly("D", [(10, 15), (13, 3), (16, 4), (21, 11), (19, 16)])   # raised wing
        for x, y in ((12, 5), (14, 7), (16, 9)):                        # wing feathers
            s.line(x, y, x + 3, y + 5, "A")
    s.pts("A", (21, 10), (23, 9), (13, 17), (16, 18), (4, 16))          # blue-black sheen
    eye(s, 24, 12)
    s.line(13, 22, 12, 25, "d").line(17, 22, 18, 25, "d")               # tucked feet
    return s.outline()


def honeybee(flap=False):
    s = Spr()
    if flap:
        s.ell(17, 11, 4.5, 2.5, "j").ell(12, 12, 3.5, 2, "j")           # wings mid-beat
        s.path("w", [(14, 10), (20, 10)])
    else:
        s.ell(17, 9, 5, 4, "j").ell(12, 10, 4, 3.5, "j")               # wings
        s.path("w", [(14, 7), (19, 6), (21, 9)]).path("w", [(10, 9), (14, 9)])
    s.ell(12, 19, 6.5, 5, "y")                                         # abdomen
    for x in (9, 13):
        s.rect(x, 13, x + 1, 25, "u", only={"y"})                      # stripes
    s.ell(20, 17, 3.2, 3.5, "M")                                       # fuzzy thorax
    s.pts("Y", (19, 15), (21, 16), (20, 19))
    s.ell(25, 17, 3.2, 3.2, "D")                                       # head
    s.pts("u", (25, 15), (26, 15), (25, 16), (26, 16)).px(26, 15, "w")   # big compound eye
    s.path("D", [(26, 14), (28, 10), (29, 9)])                         # antenna
    s.pts("K", (5, 19), (4, 19))                                       # stinger
    for x in (18, 20, 22):
        s.line(x, 21, x - 1, 24, "D")                                  # legs
    s.pts("y", (16, 24), (17, 24))                                     # pollen basket
    return s.outline()


def squirrel():
    s = Spr()
    s.ell(7, 13, 5.5, 9, "i")                                          # big bushy tail
    s.ell(9, 6, 4, 3.5, "i")
    s.ell(17, 22, 7, 5.5, "i")
    s.ell(24, 17, 4.5, 4, "i")
    s.poly("i", [(26, 16), (30, 18), (27, 20)])                        # snout
    s.poly("i", [(21, 14), (22, 10), (24, 13)])                        # ear
    s.ell(19, 24, 4, 3, "w", only={"i"})                               # pale belly
    s.path("j", [(3, 8), (2, 14), (3, 19)]).path("j", [(7, 3), (11, 4)])   # silver tail fringe
    s.path("S", [(10, 21), (8, 16), (7, 11), (8, 7), (10, 6)])         # tail curls up from the rump
    for x, y in ((5, 9), (4, 13), (5, 17), (8, 4)):
        s.pts("S", (x, y), (x + 1, y + 1))                             # fur tufts
    eye(s, 24, 16)
    s.px(30, 18, "D")
    s.ell(28, 22, 2, 2.2, "n").pts("N", (27, 20), (28, 20), (29, 20))   # acorn in its paws
    s.rect(14, 27, 16, 30, "i").rect(21, 27, 22, 30, "i")
    s.pts("i", (17, 30), (23, 30))
    return s.outline()


def opossum():
    s = Spr()
    s.ell(14, 22, 9, 6, "j")
    s.ell(23, 19, 4.5, 4, "w")
    s.poly("w", [(25, 17), (30.5, 20), (30.5, 21), (25, 22.5)])        # long pointy face
    s.ell(22, 15.5, 1.6, 1.8, "K").px(22, 14, "j")                     # small black ear, pale tip
    s.pts("i", (8, 18), (11, 17), (14, 18), (7, 22), (10, 21), (17, 19))   # grizzled fur
    s.ell(14, 26, 7, 2, "i", only={"j"})
    eye(s, 24, 19)
    s.px(30, 20, "x").px(30, 21, "x")                                  # pink nose
    s.rect(9, 27, 11, 29, "D").rect(18, 27, 20, 29, "D")               # dark legs
    s.rect(8, 30, 11, 30, "x").rect(18, 30, 21, 30, "x")               # pink toes
    s.path("x", [(5, 24), (2, 25), (1, 28), (2, 30), (4, 29)])         # bare tail
    return s.outline()


def raccoon():
    s = Spr()
    s.ell(14, 21, 8.5, 6, "i")
    s.ell(23, 17, 5, 4.5, "i")
    s.poly("i", [(25, 17), (30.5, 19.5), (30.5, 20.5), (25, 21)])
    s.poly("i", [(19, 14), (20, 10), (22.5, 13)]).poly("i", [(23, 13), (25, 10), (26.5, 14)])   # ears
    s.pts("w", (20, 11), (25, 11))
    s.ell(25, 18.5, 4, 2.6, "w", only={"i"})                           # white face
    s.rect(21, 16, 28, 17, "D", only={"w", "i"})                       # bandit mask
    s.pts("D", (22, 18), (27, 18))
    s.px(25, 16, "w").px(24, 16, "K")
    s.px(30, 19, "K").px(30, 20, "K")
    s.poly("i", [(7, 18), (1, 19), (1, 25), (6, 24)])                  # ringed tail
    for x in (2, 5):
        s.rect(x, 18, x + 1, 25, "D", only={"i"})
    s.rect(9, 26, 11, 30, "D").rect(18, 26, 20, 30, "D")
    s.pts("S", (10, 17), (14, 16), (12, 20), (16, 22))
    return s.outline()


def bat():
    s = Spr()
    s.poly("N", [(14, 13), (2, 9), (4, 12), (2, 16), (6, 15), (6, 19), (9, 17), (11, 21), (14, 19)])
    s.path("u", [(14, 13), (4, 10)]).path("u", [(10, 12), (3, 16)]).path("u", [(10, 13), (7, 18)])
    s.ell(16, 16, 3, 5, "n")
    s.ell(16, 10, 3, 3, "n")
    s.poly("N", [(13.5, 9), (12.5, 4), (15, 7.5)])                    # ear
    s.mirror()
    s.pts("K", (15, 10), (17, 10)).pts("x", (16, 12))
    s.pts("w", (15, 13), (17, 13))                                    # tiny fangs
    s.pts("m", (15, 17), (16, 18), (17, 16))
    return s.outline()


def bear():
    s = Spr()
    s.ell(15, 19, 11, 7, "D")
    s.ell(12, 14, 6, 3, "D")                                           # shoulder hump
    s.ell(25, 16, 4.8, 4.5, "D")
    s.poly("M", [(27, 15), (31, 17), (30.5, 20), (26, 20)])            # tan muzzle
    s.ell(23, 11.5, 1.8, 1.8, "D")                                     # round ear
    s.pts("K", (30, 16), (30, 17))
    eye(s, 25, 15)
    s.rect(6, 24, 9, 30, "D").rect(13, 25, 15, 30, "D").rect(19, 24, 22, 30, "D")
    s.pts("a", (8, 14), (12, 13), (16, 14), (6, 18), (10, 19), (20, 16), (17, 20), (11, 23))
    s.path("k", [(16, 25), (16, 30)])
    return s.outline()


def hellbender():
    s = Spr()
    s.ell(16, 26, 11, 3.5, "n")
    s.poly("n", [(6, 24), (1, 25.5), (1, 27), (6, 28.5)])              # paddle tail
    s.ell(27, 25.5, 3.5, 2.6, "n")                                     # flat head
    s.path("M", [(6, 28), (10, 27), (14, 28), (18, 27), (22, 28)])     # wrinkly skin folds
    s.pts("N", (9, 24), (14, 24), (19, 25), (23, 24), (12, 26), (4, 26))   # blotches
    s.rect(9, 29, 10, 30, "n").rect(20, 29, 21, 30, "n")              # stubby legs
    s.pts("n", (11, 30), (22, 30))
    s.px(28, 24, "K")                                                  # tiny eye
    s.path("N", [(26, 27), (30, 27)])                                  # wide mouth
    return s.outline()


def starmole():
    s = Spr()
    s.ell(15, 24, 10, 6, "D")
    s.ell(24, 23, 4, 3.5, "D")
    for dx, dy in ((0, -2), (1, -2), (2, -1), (2, 0), (2, 1), (1, 2), (0, 2), (-1, 1), (-1, -1), (1, 0)):
        s.px(28 + dx, 23 + dy, "x")                                    # the star: 22 pink feelers
    s.px(28, 23, "p")
    s.ell(22, 28.5, 2.8, 1.8, "x")                                     # huge digging hand
    s.ell(9, 29, 2, 1.3, "x")
    s.path("x", [(5, 26), (2, 27)])
    s.pts("a", (9, 20), (13, 19), (17, 20), (11, 23), (7, 24))         # velvet sheen
    s.px(25, 21, "K")
    return s.outline()


# ---------- across America ----------
def monarch():
    s = Spr()
    s.poly("o", [(15, 14), (5, 4), (1, 6), (2, 13), (8, 16)])          # forewing
    s.poly("o", [(15, 16), (6, 17), (4, 23), (9, 27), (14, 22)])       # hindwing
    s.path("k", [(15, 14), (5, 5)]).path("k", [(14, 15), (3, 10)]).path("k", [(14, 17), (6, 21)]).path("k", [(14, 18), (10, 25)])
    s.path("D", [(1, 6), (5, 4)]).path("D", [(1, 7), (2, 13)]).path("D", [(4, 22), (8, 26)])   # black borders
    s.pts("w", (2, 8), (2, 11), (5, 25), (4, 6))                       # white spots
    s.mirror()
    s.rect(15, 10, 16, 24, "D")                                        # body
    s.path("D", [(15, 9), (13, 4)]).path("D", [(16, 9), (18, 4)])
    s.pts("w", (15, 11), (16, 13))
    return s.outline()


def pronghorn():
    s = Spr()
    s.ell(14, 16, 9, 4.5, "M")
    s.ell(14, 19, 8, 2, "w", only={"M"})                               # white belly
    s.ell(6, 16, 2.5, 3, "w", only={"M"})                              # white rump flash
    s.poly("M", [(19, 14), (23, 6), (26, 7), (24, 15)])                # neck
    s.ell(25, 7.5, 3.5, 2.8, "M")
    s.poly("M", [(26, 6), (30.5, 8), (30.5, 9.5), (26, 10)])
    s.pts("w", (21, 11), (22, 12), (21, 13), (22, 10))                 # throat bands
    s.path("K", [(24, 5), (24, 2), (23, 1), (22, 1)])                  # horn hooking back...
    s.px(25, 3, "K")                                                   # ...with the forward prong
    s.pts("K", (29, 7), (30, 8), (30, 9))                              # dark face patch
    eye(s, 26, 7)
    for x in (7, 11, 18, 21):
        s.rect(x, 20, x + 1, 29, "M").px(x, 30, "K").px(x + 1, 30, "K")   # long legs, black hooves
        s.rect(x, 21, x + 1, 26, "w", only={"M"}) if x in (7, 18) else None
    return s.outline()


def falcon(flap=False):
    s = Spr()
    s.ell(15, 17, 7, 4.5, "S")
    s.ell(23, 13, 3.5, 3.5, "S")
    if flap:
        s.poly("S", [(10, 18), (14, 29), (17, 29), (19, 18)])          # downstroke
        s.poly("d", [(14, 29), (17, 29), (17, 25), (13.5, 26)])
    else:
        s.poly("S", [(10, 15), (16, 2), (19, 3), (19, 15)])            # pointed wing
        s.poly("d", [(16, 2), (19, 3), (18, 7), (15, 5)])              # dark wingtip
    s.poly("S", [(9, 16), (1, 17), (1, 20), (9, 19)])                  # tail
    s.ell(18, 19, 4, 2.5, "w", only={"S"})                             # barred chest
    s.pts("i", (16, 19), (18, 20), (20, 19), (17, 21))
    s.ell(23, 11.5, 3.5, 2, "D", only={"S"}).pts("D", (22, 14), (22, 15))   # helmet + mustache
    s.pts("w", (24, 14), (25, 14), (23, 16))
    s.poly("j", [(26, 12), (29, 13), (28.5, 15), (26, 14.5)]).px(28, 15, "K")   # hooked beak
    s.px(25, 12, "y").px(24, 12, "K")
    s.pts("y", (16, 22), (17, 23), (19, 22), (20, 23))                 # yellow feet
    if not flap:
        s.path("i", [(12, 9), (15, 13)]).path("i", [(14, 7), (17, 12)])
    return s.outline()


def axolotl():
    s = Spr()
    s.ell(14, 25, 10, 3.8, "x")
    s.poly("l", [(3, 22), (14, 21), (14, 23), (2, 25)])               # tail fin
    s.ell(25, 23, 5, 4.5, "x")
    for (x0, y0), (x1, y1) in (((22, 20), (19, 15)), ((21, 22), (17, 19)), ((23, 19), (23, 14))):
        s.line(x0, y0, x1, y1, "p", w=2)                               # three gill stalks
        for k in range(1, 4):                                          # feathery fringe along each
            fx = round(x0 + (x1 - x0) * k / 4); fy = round(y0 + (y1 - y0) * k / 4)
            s.px(fx - 1, fy, "r").px(fx + 2, fy - 1, "r")
        s.px(x1, y1 - 1, "r")
    s.px(26, 22, "K").px(28, 22, "K")
    s.path("p", [(26, 25), (27, 26), (29, 25)])                        # the famous smile
    s.rect(9, 29, 10, 30, "x").rect(19, 28, 20, 30, "x")
    s.pts("l", (11, 24), (16, 23), (7, 25))
    return s.outline()


def eel():
    s = Spr()
    s.path("d", [(2, 26), (6, 27), (11, 25), (16, 24), (21, 25), (26, 24)], w=4)
    s.ell(27.5, 25.5, 3, 2.3, "d")
    s.path("o", [(4, 29), (8, 29), (12, 28), (17, 27), (22, 28), (27, 27)])    # orange belly
    s.pts("i", (9, 26), (14, 25), (19, 25), (23, 25))
    s.px(28, 24, "K")
    s.path("y", [(13, 20), (15, 17), (13, 16), (16, 12)], w=1).path("y", [(20, 20), (22, 17), (20, 16), (23, 12)])   # zap
    s.pts("z", (16, 12), (23, 12))
    return s.outline()


def leafcutter():
    s = Spr()
    s.poly("G", [(15, 5), (27, 7), (28, 18), (17, 16)])               # leaf, bigger than the ant
    s.path("f", [(16, 6), (27, 17)]).path("f", [(21, 11), (24, 7)]).path("f", [(22, 12), (19, 15)])
    s.ell(12, 25, 4.5, 3, "q")                                         # abdomen
    s.ell(18.5, 24, 2.5, 2, "q")                                       # thorax
    s.ell(24, 23.5, 3, 2.6, "q")                                       # head
    s.path("q", [(25, 21), (24, 18)])                                  # jaws holding the leaf
    s.path("u", [(26, 22), (29, 19)])                                  # antenna
    for x in (16, 19, 21):
        s.path("u", [(x, 25), (x - 2, 28), (x - 3, 30)])
    s.pts("E", (10, 24), (13, 23), (23, 22))
    s.px(25, 23, "K")
    return s.outline()


# ---------- the wild world ----------
def elephant():
    s = Spr()
    s.ell(13, 17, 10, 7.5, "S")
    s.ell(22, 12, 5.5, 5.5, "S")
    s.poly("i", [(17, 6), (22, 5), (22, 18), (17, 20), (15, 13)])     # big flapping ear
    s.path("s", [(18, 8), (17, 14)]).path("s", [(20, 9), (20, 16)])
    s.path("S", [(26, 14), (28, 18), (28, 23), (27, 26), (29, 27)], w=2)   # trunk
    s.path("w", [(25, 17), (27, 19)])                                  # tusk
    s.px(24, 11, "K").px(24, 10, "w")
    s.rect(5, 23, 8, 30, "S").rect(11, 24, 14, 30, "S").rect(18, 23, 21, 30, "S")
    s.pts("d", (6, 14), (9, 17), (12, 21), (6, 20), (10, 12))          # wrinkles
    s.pts("j", (5, 30), (8, 30), (11, 30), (18, 30), (21, 30))         # toenails
    s.path("S", [(3, 15), (1, 20)])
    return s.outline()


def platypus():
    s = Spr()
    s.ell(15, 24, 9, 4.5, "n")
    s.ell(24, 23, 4, 3.5, "n")
    s.poly("d", [(26, 21), (30.5, 21.5), (30.5, 25), (26, 25.5)])     # duck bill
    s.pts("S", (28, 22), (29, 22))
    s.ell(4, 25, 4, 2.4, "N")                                          # beaver tail
    s.pts("u", (2, 24), (4, 25), (6, 24), (3, 26), (5, 26))
    s.rect(10, 28, 12, 30, "d").rect(19, 28, 21, 30, "d")              # webbed feet
    s.pts("d", (13, 30), (22, 30))
    s.px(24, 21, "K").px(25, 21, "w")
    s.pts("M", (11, 21), (15, 20), (19, 21))
    s.px(9, 29, "y")                                                   # the venom spur
    return s.outline()


def wombat():
    s = Spr()
    s.ell(14, 22, 10, 7, "n")
    s.ell(24, 20, 5.5, 5, "n")
    s.ell(28.5, 21.5, 2.2, 2, "D")                                     # big bare nose
    s.poly("n", [(20, 16), (21, 12), (23, 15)]).poly("n", [(23.5, 15), (25, 12), (26, 16)])
    eye(s, 25, 19)
    s.rect(8, 28, 10, 30, "N").rect(19, 28, 21, 30, "N")
    s.pts("N", (7, 18), (11, 17), (15, 18), (9, 22), (13, 22), (17, 21), (6, 25))
    s.rect(1, 27, 3, 29, "N")                                          # yes, the poop is a cube
    s.px(1, 27, "M")
    return s.outline()


def lyrebird():
    s = Spr()
    s.path("M", [(15, 20), (9, 14), (6, 6), (8, 2)], w=2)              # the two lyre feathers
    s.path("M", [(15, 21), (5, 16), (2, 9), (3, 4)], w=2)
    for x0, y0 in ((8, 6), (7, 9), (6, 12), (8, 15), (10, 17)):
        s.line(x0, y0, x0 - 3, y0 + 1, "z")                            # lacy filaments
    s.ell(20, 20, 5, 4.5, "n")
    s.ell(25, 15, 2.8, 2.8, "n")
    s.poly("n", [(22, 18), (24, 14), (26, 16), (24, 20)])
    s.pts("D", (28, 15), (29, 15))
    s.px(26, 14, "K")
    s.path("N", [(17, 19), (22, 22)])
    s.line(19, 24, 19, 29, "D").line(22, 24, 22, 29, "D")
    s.pts("D", (20, 30), (23, 30), (18, 30))
    return s.outline()


def bombardier():
    s = Spr()
    s.ell(16, 24, 7, 4.5, "b")                                         # wing cases
    s.path("B", [(11, 21), (19, 20)]).px(14, 23, "B")
    s.line(16, 20, 16, 28, "K")
    s.ell(23.5, 23.5, 2.5, 2.8, "o")
    s.ell(27, 23.5, 2, 2, "o")
    s.px(28, 23, "K")
    s.path("o", [(28, 21), (30, 18)])
    for x in (13, 17, 22):
        s.path("K", [(x, 27), (x - 1, 29), (x - 2, 30)])
    s.ell(5, 22, 3, 2.5, "z").ell(3, 18, 2, 1.8, "w")                 # boiling spray out the back
    s.pts("y", (2, 23), (6, 19), (1, 20), (4, 25))
    return s.outline()


def molerat():
    s = Spr()
    s.ell(14, 25, 11, 4, "x")
    s.ell(24, 24, 4, 3.5, "x")
    s.poly("x", [(26, 22), (29.5, 23.5), (29.5, 25.5), (26, 26)])     # snout
    s.rect(28, 26, 29, 29, "z").rect(28, 26, 28, 29, "w")              # those buck teeth
    for x in (7, 11, 15, 19):
        s.path("p", [(x, 22), (x - 1, 25), (x, 28)])                   # wrinkles
    s.px(26, 22, "K")
    s.rect(9, 29, 10, 30, "x").rect(20, 29, 21, 30, "x")
    s.path("x", [(3, 25), (1, 26)])
    s.pts("l", (27, 26), (28, 21))
    return s.outline()


# ---------- the deep ----------
def octopus():
    s = Spr()
    s.ell(16, 9, 6.5, 7, "r")
    for (x0, y0), pts in (((11, 14), [(8, 19), (4, 22), (3, 26), (5, 27)]),
                          ((14, 15), [(12, 21), (10, 26), (12, 29)]),
                          ((18, 15), [(20, 21), (22, 26), (20, 29)]),
                          ((21, 14), [(24, 19), (28, 22), (29, 26), (27, 27)])):
        s.path("r", [(x0, y0)] + pts, w=2)
    s.pts("l", (6, 21), (11, 24), (21, 24), (26, 21))                  # suckers
    s.ell(12.5, 11, 2, 1.8, "y").ell(19.5, 11, 2, 1.8, "y")
    s.rect(11, 11, 14, 11, "K").rect(18, 11, 21, 11, "K")              # bar-shaped pupils
    s.pts("e", (14, 4), (18, 5), (16, 7), (13, 7))
    return s.outline()


def mantis():
    s = Spr()
    s.ell(15, 20, 10, 4.5, "G")
    for x in (9, 12, 15, 18):
        s.line(x, 16, x, 24, "f")                                      # body segments
    s.poly("B", [(6, 18), (1, 15), (1, 25), (6, 22)])                  # tail fan
    s.pts("e", (1, 16), (1, 24), (2, 20))
    s.ell(25, 18, 3.5, 3.5, "G")
    s.path("T", [(26, 15), (27, 11)]).path("T", [(28, 15), (30, 11)])  # eye stalks
    for x, y in ((27, 10), (30, 10)):
        s.pts("C", (x - 1, y), (x, y), (x - 1, y - 1), (x, y - 1)).px(x, y, "k")   # trinocular eyes
    s.path("e", [(26, 22), (28, 25), (26, 27)], w=2)                   # the club
    s.pts("o", (29, 16), (30, 17), (29, 18))
    for x in (11, 15, 19):
        s.path("o", [(x, 24), (x, 27)])
    s.pts("g", (11, 18), (17, 18), (22, 17))
    return s.outline()


def pistol():
    s = Spr()
    s.ell(12, 19, 8, 4, "o")
    s.poly("o", [(5, 17), (1, 15), (1, 23), (5, 21)])
    s.ell(24, 16, 5, 3.5, "e")                                         # the one giant claw
    s.poly("e", [(27, 13), (31, 14), (28, 15)])
    s.path("q", [(20, 16), (28, 18)])
    s.ell(18, 19, 2.5, 2.2, "o")
    s.px(19, 17, "K")
    s.path("y", [(19, 16), (24, 11), (27, 10)])                        # antenna
    for x in (9, 12, 15):
        s.path("q", [(x, 22), (x - 1, 25)])
    s.pts("z", (8, 18), (12, 17), (14, 20))
    s.ell(29, 21, 1.6, 1.6, "C").px(29, 21, "w")                       # the snap bubble
    s.pts("C", (30, 18), (27, 23))
    return s.outline()


def otter():
    s = Spr()
    s.rect(0, 23, 31, 28, "c")                                         # floating on its back
    s.pts("C", (2, 23), (3, 23), (10, 23), (11, 23), (19, 23), (26, 23), (27, 23), (6, 25), (15, 26), (23, 25))
    s.ell(15, 20, 11, 4, "n")
    s.ell(26, 17, 4.5, 4, "h")                                         # pale face
    s.pts("K", (25, 16), (27, 16)).pts("D", (29, 17), (28, 18))
    s.pts("w", (29, 19), (30, 18))                                     # whiskers
    s.ell(4, 18, 2.5, 1.6, "N").ell(7, 16.5, 2, 1.5, "N")              # feet up
    s.ell(17, 17, 2.4, 1.6, "j").px(17, 17, "s")                       # rock on its belly
    s.pts("N", (15, 16), (19, 16))                                     # paws on the rock
    s.pts("N", (10, 20), (13, 21), (21, 20))
    return s.outline()


def hagfish():
    s = Spr()
    s.path("L", [(2, 20), (7, 18), (13, 17), (19, 18), (25, 17)], w=4)
    s.ell(27, 18.5, 3, 2.2, "L")
    s.path("p", [(4, 22), (10, 20), (16, 20), (22, 20)])
    s.pts("l", (29, 20), (30, 19), (30, 21))                           # barbels
    s.px(26, 17, "K")
    for cx, cy, r in ((8, 25, 3), (17, 26, 3.5), (25, 25, 2.5), (12, 12, 2.5), (22, 12, 2)):
        s.ell(cx, cy, r, r * 0.8, "T")                                 # slime clouds
        s.px(int(cx) - 1, int(cy) - 1, "C")
    return s.outline()


def jellyfish():
    s = Spr()
    s.ell(16, 12, 8, 7, "C")
    s.rect(0, 13, 31, 31, ".")                                         # just the bell
    s.ell(16, 10, 4, 3, "r")                                           # the red gut you can see through it
    s.pts("T", (10, 8), (11, 7), (13, 6))
    s.pts("w", (12, 7), (11, 9))
    s.outline()
    # Tentacles go on after the outline so they stay thin and see-through.
    for x, col in ((9, "c"), (12, "T"), (15, "c")):
        s.path(col, [(x, 14), (x - 1, 18), (x, 22), (x - 1, 26), (x, 29)])
    s.path("l", [(14, 14), (13, 19), (14, 23)])                        # frilly mouth arm
    return s.mirror()


def whale():
    s = Spr()
    s.ell(18, 17, 12.5, 6, "B")
    s.poly("B", [(8, 14), (2, 16), (2, 18), (8, 20)])                  # tail stock
    s.poly("B", [(3, 16.5), (0.5, 12.5), (2, 12.5), (4.5, 16)])        # flukes, side-on
    s.poly("B", [(3, 17.5), (0.5, 21.5), (2, 21.5), (4.5, 18)])
    s.ell(20, 21, 9, 3, "c", only={"B"})                               # pale throat
    for x in (14, 17, 20, 23, 26):
        s.rect(x, 20, x, 23, "B", only={"c"})                          # throat grooves
    s.poly("b", [(15, 11.5), (17, 9), (18, 11.5)])                     # tiny dorsal fin
    s.pts("s", (9, 14), (12, 13), (16, 12), (11, 17), (20, 13))        # mottling
    s.poly("b", [(17, 21), (14, 25), (19, 22.5)])                      # flipper
    s.px(25, 17, "K").px(26, 17, "w")
    s.outline()
    s.pts("C", (27, 9), (26, 7), (28, 7), (25, 5), (29, 5), (27, 6))   # spout, no outline
    return s


def tardigrade():
    s = Spr()
    s.ell(16, 17, 12, 7, "h")
    for x in (10, 15, 20):
        s.path("M", [(x, 11), (x - 1, 17), (x, 22)])                   # body segments
    s.ell(27, 16, 2.4, 2.4, "h").ell(28, 16, 1.2, 1.2, "p")            # round mouth tube
    s.pts("K", (25, 14))
    for x in (7, 12, 18, 23):
        s.rect(x, 22, x + 2, 25, "h")
        s.pts("K", (x, 26), (x + 2, 26))                               # tiny claws
    s.pts("z", (9, 12), (14, 11), (20, 12))
    return s.outline()


def draw():
    out = {f.__name__: f() for f in (
        crow, honeybee, squirrel, opossum, raccoon, bat, bear, hellbender, starmole,
        monarch, pronghorn, falcon, axolotl, eel, leafcutter,
        elephant, platypus, wombat, lyrebird, bombardier, molerat,
        octopus, mantis, pistol, otter, hagfish, jellyfish, whale, tardigrade)}
    # wingbeat frames for the flyers
    out.update({"crow~flap": crow(flap=True), "falcon~flap": falcon(flap=True), "honeybee~flap": honeybee(flap=True)})
    return out

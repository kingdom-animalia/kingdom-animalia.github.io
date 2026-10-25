"""Portraits (head and shoulders) and the two non-animal bosses."""
from paint import Spr


def aj():
    """AJ, from Jessi's photo: wavy brown hair swept up, dark rectangular glasses,
    full brown beard, broad shoulders. Green field shirt, headphones round his neck."""
    s = Spr()
    s.ell(16, 31, 15, 8, "G")                                  # broad shoulders
    s.rect(13, 20, 19, 24, "F")                                # neck
    s.ell(16, 13, 7, 7.5, "F")                                 # head
    s.pts("F", (8, 13), (8, 14), (24, 13), (24, 14))           # ears
    s.ell(16, 5.5, 7.8, 4, "n").ell(14, 3, 6, 2.4, "n").ell(19, 2.5, 4, 2, "n")   # wavy hair, swept up
    s.rect(9, 7, 10, 12, "n").rect(22, 7, 23, 12, "n")         # sides
    s.ell(16, 10, 5.5, 2.6, "F", only={"n"})                   # forehead under the hair
    s.path("M", [(10, 5), (13, 2), (17, 2)]).path("M", [(15, 4), (18, 2), (21, 3)])   # swept-up waves
    s.path("N", [(11, 7), (13, 5), (16, 5)]).path("N", [(18, 6), (21, 7)])
    s.ell(16, 20, 7.5, 4.2, "n", only={"F"})                   # full beard along the jaw
    s.rect(9, 14, 10, 18, "n", only={"F", "n"}).rect(22, 14, 23, 18, "n", only={"F", "n"})
    s.path("M", [(12, 20), (14, 22)]).path("M", [(20, 20), (18, 22)])
    s.rect(13, 17, 19, 17, "N")                                # moustache
    s.rect(15, 19, 17, 19, "p")                                # lip showing through
    s.pts("R", (16, 14), (16, 15), (15, 15))                   # nose
    for x0 in (10, 17):                                        # dark rectangular frames
        s.rect(x0, 11, x0 + 4, 11, "K").rect(x0, 14, x0 + 4, 14, "K")
        s.rect(x0, 12, x0, 13, "K").rect(x0 + 4, 12, x0 + 4, 13, "K")
        s.px(x0 + 3, 12, "j")                                  # lens glare
    s.pts("K", (15, 12), (16, 12), (9, 12), (23, 12))         # bridge + arms
    s.pts("u", (12, 13), (19, 13))                             # eyes
    s.rect(11, 10, 13, 10, "N").rect(18, 10, 20, 10, "N")     # brows
    s.path("g", [(12, 24), (16, 28), (20, 24)])                # collar
    s.path("d", [(11, 22), (12, 25), (16, 26), (20, 25), (21, 22)])   # headphone band round his neck
    s.ell(10.5, 22.5, 1.5, 2, "d").ell(21.5, 22.5, 1.5, 2, "d")
    s.pts("C", (10, 22), (21, 22))                             # little RGB light, naturally
    s.pts("y", (24, 28), (24, 29))                             # pen in the pocket
    s.rect(22, 29, 26, 29, "f")
    return s.outline()


def jessi():
    """Jessi, quartermaster: long brown hair, purple top, filament on her shoulder."""
    s = Spr()
    s.ell(16, 31, 13, 7, "P")
    s.ell(16, 12, 9, 10, "n")                                  # hair behind
    s.rect(7, 12, 25, 25, "n", only={"."})
    s.ell(16, 7, 8, 5, "n")
    s.rect(14, 19, 18, 24, "F")
    s.ell(16, 13, 6, 7, "F")
    s.ell(16, 7, 7, 3.5, "n", only={"F"})                      # fringe
    s.path("N", [(10, 8), (14, 5)]).path("N", [(18, 5), (22, 9)]).path("M", [(12, 4), (17, 3)])
    s.path("N", [(8, 14), (8, 24)]).path("N", [(24, 14), (24, 24)])
    s.pts("K", (13, 13), (19, 13)).pts("w", (13, 12), (19, 12))
    s.rect(12, 11, 14, 11, "N").rect(18, 11, 20, 11, "N")
    s.pts("R", (16, 15)).rect(15, 17, 17, 17, "p")
    s.pts("x", (12, 15), (20, 15))                             # cheeks
    s.path("v", [(13, 24), (16, 27), (19, 24)])
    s.ell(23, 26, 3, 2.2, "T").ell(23, 26, 1.2, 0.9, "d")      # spool of filament on her shoulder
    return s.outline()


def hand():
    """The Seven-Fingered Hand. Count them."""
    s = Spr()
    s.ell(15, 23, 8, 7, "h")
    s.rect(11, 27, 19, 30, "h")                                # wrist
    tops = (9, 6, 4, 3, 4, 6, 10)
    for i, top in enumerate(tops):
        x = 6 + i * 3
        s.rect(x, top, x + 1, 20, "h")
        s.pts("l", (x, top), (x + 1, top))                     # nails
        s.px(x, top + 5, "M").px(x + 1, top + 9, "M")          # knuckles in the wrong places
    s.poly("h", [(22, 22), (29, 16), (30, 18), (24, 26)])      # thumb
    s.pts("l", (29, 16), (30, 17))
    s.path("M", [(9, 24), (14, 26), (19, 23)]).path("M", [(11, 21), (17, 20)])   # palm lines
    s.outline()
    return s


def machine():
    """The Slop Machine."""
    s = Spr()
    s.rect(6, 5, 15, 26, "S")
    s.rect(8, 7, 15, 15, "b")                                  # screen
    s.ell(15.5, 11, 4, 3, "e", only={"b"}).ell(15.5, 11, 1.6, 1.4, "r")   # the big red eye
    s.rect(9, 18, 15, 21, "K")
    for x in (10, 12, 14):
        s.rect(x, 18, x, 21, "y")                              # grille
    s.pts("i", (7, 6), (7, 24), (7, 17))                       # rivets
    s.line(15, 4, 15, 1, "d").px(15, 0, "y")                   # antenna
    s.rect(7, 27, 12, 29, "d")                                 # treads
    s.pts("i", (8, 28), (10, 28))
    s.mirror()
    s.rect(12, 23, 19, 25, "K")                                # chute...
    s.ell(22, 28, 4, 2, "v").pts("v", (19, 25), (20, 26))     # ...spilling slop
    s.pts("L", (21, 27), (24, 28))
    return s.outline()


def draw():
    return {"aj": aj(), "jessi": jessi(), "hand": hand(), "machine": machine()}

from manim import *
from vector_scene_utils import *


class BaseComposantes(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        t = title("Base et composantes")
        ax = axes(x_range=(-1, 6, 1), y_range=(-1, 5, 1))
        i = vec(ax, (0, 0), (1, 0), BLUE_TERM)
        j = vec(ax, (0, 0), (0, 1), ORANGE_TERM)
        a = vec(ax, (0, 0), (4, 3), GREEN_TERM, 6)
        h = DashedLine(ax.c2p(0, 3), ax.c2p(4, 3), color=GREEN_TERM)
        v = DashedLine(ax.c2p(4, 0), ax.c2p(4, 3), color=GREEN_TERM)
        labels = VGroup(
            caption("i", 22, BLUE_TERM).next_to(i, DOWN),
            caption("j", 22, ORANGE_TERM).next_to(j, LEFT),
            caption("a = 4i + 3j = (4 ; 3)", 26, GREEN_TERM).to_edge(DOWN),
        )
        self.play(Write(t), Create(ax))
        self.play(Create(i), Create(j))
        self.play(Create(a), Create(h), Create(v), Write(labels))
        self.wait(1)

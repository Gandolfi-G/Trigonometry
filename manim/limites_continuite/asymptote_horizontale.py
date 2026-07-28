from manim import *
from limits_scene_utils import *


class AsymptoteHorizontale(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        t = title("Limite à l'infini")
        ax = axes(x_range=(-8, 8, 2), y_range=(-4, 6, 1))
        left = ax.plot(lambda x: (2 * x - 5) / (x - 1), x_range=[-8, 0.7], color=BLUE_TERM, stroke_width=5)
        right = ax.plot(lambda x: (2 * x - 5) / (x - 1), x_range=[1.3, 8], color=BLUE_TERM, stroke_width=5)
        horizontal = DashedLine(ax.c2p(-8, 2), ax.c2p(8, 2), color=GREEN_TERM, stroke_width=4)
        vertical = DashedLine(ax.c2p(1, -4), ax.c2p(1, 6), color=RED_TERM, stroke_width=3)
        formula = caption("lim f(x) = 2 quand x -> +/- infini", 26, GREEN_TERM).to_edge(DOWN)
        label = small_caption("A.H. : y = 2", GREEN_TERM).next_to(ax.c2p(5, 2), UP)

        self.play(Write(t), Create(ax))
        self.play(Create(left), Create(right))
        self.play(Create(horizontal), Write(label), Create(vertical))
        self.play(Write(formula))
        self.wait(1)

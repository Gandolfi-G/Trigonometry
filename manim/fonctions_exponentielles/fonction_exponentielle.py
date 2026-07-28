from manim import *
from exponential_scene_utils import *


class FonctionExponentielle(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        t = title("Fonction exponentielle")
        ax = axes(x_range=(-4, 4, 1), y_range=(-1, 7, 1))
        grow = ax.plot(lambda x: 2 ** x, x_range=[-3, 2.65], color=BLUE_TERM, stroke_width=5)
        decay = ax.plot(lambda x: 0.5 ** x, x_range=[-2.65, 3], color=ORANGE_TERM, stroke_width=5)
        asymptote = DashedLine(ax.c2p(-4, 0), ax.c2p(4, 0), color=GREEN_TERM, stroke_width=3)
        points = VGroup(dot(ax, 0, 1, GREEN_TERM), dot(ax, 1, 2, BLUE_TERM), dot(ax, 1, 0.5, ORANGE_TERM))
        note = caption("a^x > 0, f(0)=1, et y=0 est une asymptote horizontale.", 24).to_edge(DOWN)
        self.play(Write(t), Create(ax))
        self.play(Create(grow), Create(decay), Create(asymptote), FadeIn(points))
        self.play(Write(note))
        self.wait(1)

from manim import *
from vector_scene_utils import *


class CerclesTangente(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        t = title("Cercle et tangente")
        ax = axes(x_range=(-4, 5, 1), y_range=(-4, 4, 1))
        c = (1, -1)
        r = 2.4
        p = (c[0] + 1.7, c[1] + 1.7)
        circle = Circle(radius=r * ax.x_axis.unit_size, color=BLUE_TERM, stroke_width=5).move_to(ax.c2p(*c))
        radius = vec(ax, c, p, ORANGE_TERM)
        tangent = Line(ax.c2p(p[0] - 1.6, p[1] + 1.6), ax.c2p(p[0] + 1.6, p[1] - 1.6), color=GREEN_TERM, stroke_width=5)
        formula = VGroup(
            caption("(x-c1)² + (y-c2)² = r²", 25, BLUE_TERM),
            caption("tangente perpendiculaire au rayon CT", 24, GREEN_TERM),
        ).arrange(DOWN, buff=0.3).to_edge(DOWN)
        self.play(Write(t), Create(ax))
        self.play(Create(circle), Create(radius), Create(tangent))
        self.play(Write(formula))
        self.wait(1)

from manim import *
from derivative_scene_utils import *


class ContinuiteDerivabilite(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        t = title("Continuité et dérivabilité")
        ax = axes(x_range=(-4, 4, 1), y_range=(-1, 5, 1))
        left = ax.plot(lambda x: -x, x_range=[-3.5, 0], color=BLUE_TERM, stroke_width=5)
        right = ax.plot(lambda x: x, x_range=[0, 3.5], color=BLUE_TERM, stroke_width=5)
        p = dot(ax.c2p(0, 0), GREEN_TERM)
        tg_left = line_for_slope(ax, -1, 0, 0, ORANGE_TERM, span=1.4)
        tg_right = line_for_slope(ax, 1, 0, 0, GREEN_TERM, span=1.4)
        note1 = caption("f(x)=|x| est continue en 0", 25, GREEN_TERM).to_edge(DOWN).shift(UP * 0.35)
        note2 = caption("mais les pentes gauche et droite sont différentes.", 24, ORANGE_TERM).next_to(note1, DOWN)

        self.play(Write(t), Create(ax))
        self.play(Create(left), Create(right), FadeIn(p))
        self.play(Create(tg_left), Create(tg_right))
        self.play(Write(note1), Write(note2))
        self.wait(1)

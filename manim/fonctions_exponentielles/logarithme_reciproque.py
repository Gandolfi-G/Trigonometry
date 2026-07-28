from manim import *
from exponential_scene_utils import *


class LogarithmeReciproque(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        t = title("Logarithme : fonction réciproque")
        ax = axes(x_range=(-1, 6, 1), y_range=(-1, 6, 1))
        exp_graph = ax.plot(lambda x: 2 ** x, x_range=[-1, 2.55], color=BLUE_TERM, stroke_width=5)
        log_graph = ax.plot(lambda x: np.log2(x), x_range=[0.15, 6], color=ORANGE_TERM, stroke_width=5)
        mirror = DashedLine(ax.c2p(-1, -1), ax.c2p(6, 6), color=GREEN_TERM, stroke_width=3)
        p1 = dot(ax, 3, 8 if False else 0, BLUE_TERM)
        point_exp = dot(ax, 2, 4, BLUE_TERM)
        point_log = dot(ax, 4, 2, ORANGE_TERM)
        note = caption("2^x = y  <=>  log₂(y) = x", 28, GREEN_TERM).to_edge(DOWN)
        self.play(Write(t), Create(ax))
        self.play(Create(exp_graph), Create(log_graph), Create(mirror))
        self.play(FadeIn(point_exp), FadeIn(point_log), Write(note))
        self.wait(1)

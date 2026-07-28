from manim import *
from limits_scene_utils import *


class LimiteTrou(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        t = title("Limite en un point")
        ax = axes(x_range=(-1, 5, 1), y_range=(-1, 7, 1))
        graph = ax.plot(lambda x: x + 3, x_range=[-1, 5], color=BLUE_TERM, stroke_width=5)
        hole = open_dot(ax.c2p(2, 5), ORANGE_TERM)
        label_a = small_caption("x = a", ORANGE_TERM).next_to(ax.c2p(2, 0), DOWN)
        label_l = small_caption("L = 5", GREEN_TERM).next_to(ax.c2p(0, 5), LEFT)
        dashed_x = DashedLine(ax.c2p(2, 0), ax.c2p(2, 5), color=ORANGE_TERM)
        dashed_y = DashedLine(ax.c2p(0, 5), ax.c2p(2, 5), color=GREEN_TERM)
        left_dot = filled_dot(ax.c2p(0.2, 3.2), GREEN_TERM)
        right_dot = filled_dot(ax.c2p(4.2, 7.2), GREEN_TERM)
        text = caption("f(a) peut ne pas exister, mais f(x) approche L.", 25).to_edge(DOWN)

        self.play(Write(t), Create(ax))
        self.play(Create(graph), FadeIn(hole))
        self.play(Create(dashed_x), Create(dashed_y), Write(label_a), Write(label_l))
        self.play(FadeIn(left_dot), FadeIn(right_dot))
        self.play(left_dot.animate.move_to(ax.c2p(1.8, 4.8)), right_dot.animate.move_to(ax.c2p(2.2, 5.2)), run_time=2)
        self.play(Write(text))
        self.wait(1)

from manim import *
from limits_scene_utils import *


class ContinuitePoint(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        t = title("Continuité en un point")
        ax = axes(x_range=(-3, 4, 1), y_range=(-2, 5, 1))
        graph = ax.plot(lambda x: x + 1, x_range=[-3, 4], color=BLUE_TERM, stroke_width=5)
        point_good = filled_dot(ax.c2p(1, 2), GREEN_TERM)
        condition1 = small_caption("1. la limite existe", GREEN_TERM).to_corner(UL).shift(DOWN * 0.8)
        condition2 = small_caption("2. f(a) existe", GREEN_TERM).next_to(condition1, DOWN, aligned_edge=LEFT)
        condition3 = small_caption("3. lim f(x) = f(a)", GREEN_TERM).next_to(condition2, DOWN, aligned_edge=LEFT)
        formula = caption("lim f(x) = f(1) = 2", 30, GREEN_TERM).to_edge(DOWN)

        self.play(Write(t), Create(ax))
        self.play(Create(graph), FadeIn(point_good))
        self.play(Write(condition1), Write(condition2), Write(condition3))
        self.play(Write(formula))
        self.wait(1)

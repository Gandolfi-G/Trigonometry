from manim import *

from equations_scene_utils import BACKGROUND_COLOR, BLUE_TERM, GREEN_TERM, ORANGE_TERM, expression, simple_axis, title


class Intervalles(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        heading = title("Intervalles")
        axis = simple_axis(y=-0.4, x_min=3, x_max=9, length=7.2)
        i_segment = Line(LEFT * 2.4, ORIGIN, color=BLUE_TERM, stroke_width=10).shift(DOWN * 0.1)
        j_segment = Line(LEFT * 1.2, RIGHT * 2.4, color=ORANGE_TERM, stroke_width=10).shift(DOWN * 0.55)
        result = Line(LEFT * 1.2, ORIGIN, color=GREEN_TERM, stroke_width=12).shift(DOWN * 1.0)
        labels = VGroup(
            expression("I = [4 ; 6]", 28, BLUE_TERM).to_edge(LEFT, buff=0.6).shift(UP * 0.6),
            expression("J = ]5 ; 8[", 28, ORANGE_TERM).to_edge(LEFT, buff=0.6).shift(UP * 0.15),
            expression("I ∩ J = ]5 ; 6]", 30, GREEN_TERM).to_edge(LEFT, buff=0.6).shift(DOWN * 0.35),
        )

        self.play(Write(heading), Create(axis))
        self.play(Create(i_segment), Write(labels[0]), run_time=0.9)
        self.play(Create(j_segment), Write(labels[1]), run_time=0.9)
        self.play(Create(result), Write(labels[2]), run_time=1.0)
        self.wait(1.5)

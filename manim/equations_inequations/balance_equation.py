from manim import *

from equations_scene_utils import BACKGROUND_COLOR, BLUE_TERM, GREEN_TERM, ORANGE_TERM, expression, title


class BalanceEquation(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        heading = title("Principes d'équivalence")
        left_pan = RoundedRectangle(width=3.2, height=1.2, color=BLUE_TERM, fill_color=BLUE_TERM, fill_opacity=0.25)
        right_pan = RoundedRectangle(width=3.2, height=1.2, color=ORANGE_TERM, fill_color=ORANGE_TERM, fill_opacity=0.25)
        left_pan.shift(LEFT * 2.2 + DOWN * 0.3)
        right_pan.shift(RIGHT * 2.2 + DOWN * 0.3)
        pivot = VGroup(Line(DOWN * 1.4, UP * 0.1, color=GREY_A, stroke_width=6), Line(LEFT * 4, RIGHT * 4, color=GREY_A, stroke_width=6).shift(UP * 0.1))
        left_text = expression("6x - 7", 30).move_to(left_pan)
        right_text = expression("2x + 5", 30).move_to(right_pan)
        op = expression("+7 des deux côtés", 30, GREEN_TERM).to_edge(DOWN, buff=0.75)
        result = expression("6x = 2x + 12", 34, GREEN_TERM).to_edge(DOWN, buff=0.25)

        self.play(Write(heading), Create(pivot), FadeIn(left_pan), FadeIn(right_pan), Write(left_text), Write(right_text))
        self.play(Write(op), run_time=0.9)
        self.play(Transform(left_text, expression("6x", 30).move_to(left_pan)), Transform(right_text, expression("2x + 12", 30).move_to(right_pan)), run_time=1.2)
        self.play(Write(result), run_time=1.0)
        self.wait(1.5)

from manim import *

from equations_scene_utils import BACKGROUND_COLOR, BLUE_TERM, GREEN_TERM, ORANGE_TERM, expression, title


class SystemesLineaires(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        heading = title("Systèmes linéaires")
        system = expression("{ 2x + y = 4     3x + 2y = 7", 31).next_to(heading, DOWN, buff=0.45)
        methods = VGroup(
            expression("substitution", 26, BLUE_TERM),
            expression("addition", 26, ORANGE_TERM),
            expression("intersection graphique", 26, GREEN_TERM),
        ).arrange(RIGHT, buff=0.55).next_to(system, DOWN, buff=0.35)

        axes = VGroup(Line(LEFT * 3.2, RIGHT * 3.2, color=GREY_A), Line(DOWN * 1.8, UP * 1.8, color=GREY_A)).shift(DOWN * 1.4)
        line1 = Line(LEFT * 2.6 + UP * 1.35, RIGHT * 2.6 + DOWN * 1.15, color=BLUE_TERM, stroke_width=5).shift(DOWN * 1.4)
        line2 = Line(LEFT * 2.6 + UP * 1.0, RIGHT * 2.6 + DOWN * 0.72, color=ORANGE_TERM, stroke_width=5).shift(DOWN * 1.4)
        solution = Dot(RIGHT * 0.6 + DOWN * 1.14, color=GREEN_TERM, radius=0.08)
        label = expression("S = {(1 ; 2)}", 30, GREEN_TERM).next_to(solution, UP + RIGHT, buff=0.12)

        self.play(Write(heading), Write(system))
        self.play(Write(methods), run_time=1.1)
        self.play(Create(axes), Create(line1), Create(line2), run_time=1.2)
        self.play(FadeIn(solution), Write(label), run_time=0.9)
        self.wait(1.5)

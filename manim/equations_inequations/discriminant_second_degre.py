from manim import *

from equations_scene_utils import BACKGROUND_COLOR, BLUE_TERM, GREEN_TERM, ORANGE_TERM, RED_TERM, expression, title


class DiscriminantSecondDegre(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        heading = title("Discriminant du second degré")
        formula = expression("ax² + bx + c = 0    Δ = b² - 4ac", 32).next_to(heading, DOWN, buff=0.45)
        cases = VGroup(
            expression("Δ > 0  →  deux solutions", 30, GREEN_TERM),
            expression("Δ = 0  →  une solution double", 30, ORANGE_TERM),
            expression("Δ < 0  →  aucune solution réelle", 30, RED_TERM),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.3).next_to(formula, DOWN, buff=0.45)

        axes = VGroup(Line(LEFT * 2.2, RIGHT * 2.2, color=GREY_A), Line(DOWN * 1.2, UP * 1.5, color=GREY_A)).shift(DOWN * 1.4)
        parabola = VMobject(color=BLUE_TERM, stroke_width=5)
        points = [[x, 0.35 * (x ** 2) - 0.55, 0] for x in [i / 10 for i in range(-22, 23)]]
        parabola.set_points_smoothly(points)
        parabola.shift(DOWN * 1.4)
        roots = VGroup(Dot([-1.25, -1.4, 0], color=GREEN_TERM), Dot([1.25, -1.4, 0], color=GREEN_TERM))

        self.play(Write(heading), Write(formula))
        self.play(Write(cases), run_time=1.5)
        self.play(Create(axes), Create(parabola), FadeIn(roots), run_time=1.4)
        self.wait(1.5)

from manim import *

from algebra_scene_utils import BACKGROUND_COLOR, BLUE_TERM, GREEN_TERM, ORANGE_TERM, expression, title


class DivisionPolynomialeEquations(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        heading = title("Factoriser pour résoudre")

        poly = expression("x² + 5x + 6 = 0", font_size=36).next_to(heading, DOWN, buff=0.55)
        factors = expression("(x + 2)(x + 3) = 0", color=ORANGE_TERM, font_size=38).next_to(poly, DOWN, buff=0.55)
        rule = Text("Un produit est nul si l'un des facteurs est nul", color=WHITE, font_size=28, weight=BOLD).next_to(factors, DOWN, buff=0.45)
        roots = VGroup(
            expression("x + 2 = 0  →  x = -2", color=BLUE_TERM, font_size=31),
            expression("x + 3 = 0  →  x = -3", color=GREEN_TERM, font_size=31),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.22).next_to(rule, DOWN, buff=0.42)

        axis = NumberLine(x_range=[-4, 1, 1], length=6, color=GREY_A, include_numbers=False).to_edge(DOWN, buff=0.55)
        axis_numbers = VGroup()
        for value in [-4, -3, -2, -1, 0, 1]:
            axis_numbers.add(
                Text(str(value), color=GREY_B, font_size=22).next_to(axis.n2p(value), DOWN, buff=0.12)
            )
        root_marks = VGroup(
            Dot(axis.n2p(-2), color=BLUE_TERM, radius=0.08),
            Dot(axis.n2p(-3), color=GREEN_TERM, radius=0.08),
        )
        root_labels = VGroup(
            Text("-2", color=BLUE_TERM, font_size=26, weight=BOLD).next_to(root_marks[0], UP),
            Text("-3", color=GREEN_TERM, font_size=26, weight=BOLD).next_to(root_marks[1], UP),
        )

        self.play(Write(heading), Write(poly))
        self.play(TransformMatchingShapes(poly.copy(), factors), run_time=1.1)
        self.play(Write(rule), run_time=1.0)
        self.play(Write(roots), run_time=1.4)
        self.play(Create(axis), Write(axis_numbers), FadeIn(root_marks), Write(root_labels), run_time=1.1)
        self.wait(1.5)

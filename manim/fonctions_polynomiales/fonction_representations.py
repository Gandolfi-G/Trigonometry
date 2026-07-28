from manim import *

from functions_scene_utils import BACKGROUND_COLOR, BLUE_TERM, GREEN_TERM, ORANGE_TERM, axes, expression, title


class FonctionRepresentations(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        heading = title("Représenter une fonction")
        formula = expression("g(x) = (2x - 3)²", 34, ORANGE_TERM).next_to(heading, DOWN, buff=0.35)
        table = VGroup(
            expression("x :  -1   0   1   2   3", 28),
            expression("g(x): 25   9   1   1   9", 28, GREEN_TERM),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.2).next_to(formula, DOWN, buff=0.35)
        ax = axes(x_range=(-2, 4, 1), y_range=(0, 10, 2), x_length=5.8, y_length=3.2).to_edge(DOWN, buff=0.35)
        curve = ax.plot(lambda x: (2 * x - 3) ** 2, x_range=[-0.2, 3.2], color=BLUE_TERM, stroke_width=5)
        dots = VGroup(*[Dot(ax.c2p(x, (2 * x - 3) ** 2), color=GREEN_TERM, radius=0.055) for x in [0, 1, 2, 3]])

        self.play(Write(heading), Write(formula))
        self.play(Write(table), run_time=1.2)
        self.play(Create(ax), FadeIn(dots), Create(curve), run_time=1.5)
        self.wait(1.5)

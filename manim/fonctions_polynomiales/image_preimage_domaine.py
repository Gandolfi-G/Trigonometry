from manim import *

from functions_scene_utils import BACKGROUND_COLOR, BLUE_TERM, GREEN_TERM, ORANGE_TERM, axes, expression, title


class ImagePreimageDomaine(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        heading = title("Image, préimage, domaine")
        formula = expression("f(x) = x² - 4", 34, ORANGE_TERM).next_to(heading, DOWN, buff=0.35)
        ax = axes(x_range=(-4, 4, 1), y_range=(-5, 6, 1), x_length=6.8, y_length=4.2).shift(DOWN * 0.4)
        curve = ax.plot(lambda x: x * x - 4, x_range=[-3.2, 3.2], color=BLUE_TERM, stroke_width=5)
        image_dot = Dot(ax.c2p(2, 0), color=GREEN_TERM, radius=0.07)
        image_label = expression("f(2)=0", 28, GREEN_TERM).next_to(image_dot, UP + RIGHT, buff=0.12)
        preimage_line = ax.get_horizontal_line(ax.c2p(0, 0), color=GREEN_TERM, stroke_width=3)
        preimages = VGroup(Dot(ax.c2p(-2, 0), color=GREEN_TERM, radius=0.07), Dot(ax.c2p(2, 0), color=GREEN_TERM, radius=0.07))
        domain = expression("Domaine d’un polynôme : ℝ", 32, GREEN_TERM).to_edge(DOWN, buff=0.25)

        self.play(Write(heading), Write(formula), Create(ax), Create(curve))
        self.play(FadeIn(image_dot), Write(image_label), run_time=1.0)
        self.play(Create(preimage_line), FadeIn(preimages), Write(expression("préimages de 0 : {-2 ; 2}", 28, GREEN_TERM).next_to(formula, DOWN, buff=0.25)), run_time=1.2)
        self.play(Write(domain), run_time=1.0)
        self.wait(1.5)

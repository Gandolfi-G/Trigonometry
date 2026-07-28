from manim import *

from functions_scene_utils import BACKGROUND_COLOR, BLUE_TERM, GREEN_TERM, ORANGE_TERM, axes, expression, title


class DegreZeroUn(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        heading = title("Degré 0 et degré 1")
        ax = axes(x_range=(-4, 4, 1), y_range=(-4, 5, 1), x_length=6.8, y_length=4.4).shift(DOWN * 0.35)
        constant = ax.plot(lambda x: 2, x_range=[-4, 4], color=BLUE_TERM, stroke_width=5)
        line = ax.plot(lambda x: 2 * x + 1, x_range=[-2.3, 1.8], color=ORANGE_TERM, stroke_width=5)
        labels = VGroup(
            expression("f(x)=2 : droite horizontale", 27, BLUE_TERM),
            expression("g(x)=2x+1 : pente 2, ordonnée 1", 27, ORANGE_TERM),
            expression("zéro : x = -1/2", 27, GREEN_TERM),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.2).next_to(heading, DOWN, buff=0.35)
        zero_dot = Dot(ax.c2p(-0.5, 0), color=GREEN_TERM, radius=0.07)

        self.play(Write(heading), Write(labels[0]), Create(ax), Create(constant))
        self.play(Write(labels[1]), Create(line), run_time=1.1)
        self.play(FadeIn(zero_dot), Write(labels[2]), run_time=0.9)
        self.wait(1.5)

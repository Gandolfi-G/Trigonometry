from manim import *

from functions_scene_utils import BACKGROUND_COLOR, BLUE_TERM, GREEN_TERM, ORANGE_TERM, YELLOW_TERM, axes, expression, title


class ParaboleSecondDegre(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        heading = title("Fonction quadratique")
        formula = expression("f(x) = -x² + 2x + 3", 34, ORANGE_TERM).next_to(heading, DOWN, buff=0.3)
        ax = axes(x_range=(-3, 5, 1), y_range=(-3, 6, 1), x_length=6.8, y_length=4.4).shift(DOWN * 0.45)
        curve = ax.plot(lambda x: -x * x + 2 * x + 3, x_range=[-1.8, 3.8], color=BLUE_TERM, stroke_width=5)
        zeros = VGroup(Dot(ax.c2p(-1, 0), color=GREEN_TERM, radius=0.07), Dot(ax.c2p(3, 0), color=GREEN_TERM, radius=0.07))
        y_intercept = Dot(ax.c2p(0, 3), color=ORANGE_TERM, radius=0.07)
        vertex = Dot(ax.c2p(1, 4), color=YELLOW_TERM, radius=0.08)
        symmetry = DashedLine(ax.c2p(1, -3), ax.c2p(1, 6), color=YELLOW_TERM, stroke_width=4)
        notes = VGroup(
            expression("zéros : -1 et 3", 25, GREEN_TERM),
            expression("ordonnée à l’origine : 3", 25, ORANGE_TERM),
            expression("sommet S(1 ; 4), maximum", 25, YELLOW_TERM),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.16).to_edge(RIGHT, buff=0.35).shift(UP * 0.1)

        self.play(Write(heading), Write(formula), Create(ax), Create(curve))
        self.play(FadeIn(zeros), Write(notes[0]), run_time=0.8)
        self.play(FadeIn(y_intercept), Write(notes[1]), run_time=0.8)
        self.play(Create(symmetry), FadeIn(vertex), Write(notes[2]), run_time=1.0)
        self.wait(1.5)

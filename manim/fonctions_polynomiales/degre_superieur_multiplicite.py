from manim import *

from functions_scene_utils import BACKGROUND_COLOR, BLUE_TERM, GREEN_TERM, ORANGE_TERM, YELLOW_TERM, axes, expression, title


class DegreSuperieurMultiplicite(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        heading = title("Degré supérieur et multiplicités")
        formula = expression("f(x) = (x + 2)(x - 1)²(x - 3)", 31, ORANGE_TERM).next_to(heading, DOWN, buff=0.3)
        ax = axes(x_range=(-4, 4, 1), y_range=(-5, 5, 1), x_length=6.8, y_length=4.2).shift(DOWN * 0.45)
        curve = ax.plot(lambda x: 0.12 * (x + 2) * ((x - 1) ** 2) * (x - 3), x_range=[-3.5, 3.7], color=BLUE_TERM, stroke_width=5)
        roots = VGroup(
            Dot(ax.c2p(-2, 0), color=GREEN_TERM, radius=0.07),
            Dot(ax.c2p(1, 0), color=YELLOW_TERM, radius=0.07),
            Dot(ax.c2p(3, 0), color=GREEN_TERM, radius=0.07),
        )
        notes = VGroup(
            expression("-2 et 3 : multiplicité impaire, le graphe traverse", 24, GREEN_TERM),
            expression("1 : multiplicité paire, le graphe touche", 24, YELLOW_TERM),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.2).to_edge(DOWN, buff=0.25)

        self.play(Write(heading), Write(formula))
        self.play(Create(ax), Create(curve), run_time=1.4)
        self.play(FadeIn(roots), Write(notes), run_time=1.2)
        self.wait(1.5)

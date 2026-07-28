from manim import *
from derivative_scene_utils import *


class FonctionDerivee(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        t = title("Fonction dérivée")
        ax = axes(x_range=(-4, 4, 1), y_range=(-5, 8, 1))
        graph = ax.plot(lambda x: x * x, x_range=[-2.7, 2.7], color=BLUE_TERM, stroke_width=5)
        derived = ax.plot(lambda x: 2 * x, x_range=[-3, 3], color=ORANGE_TERM, stroke_width=5)
        label_f = small("f(x)=x²", BLUE_TERM).next_to(ax.c2p(-2.5, 6.25), LEFT)
        label_df = small("f’(x)=2x", ORANGE_TERM).next_to(ax.c2p(2, 4), RIGHT)
        points = VGroup(*[dot(ax.c2p(x, 2 * x), ORANGE_TERM) for x in [-2, -1, 0, 1, 2]])
        text = caption("La dérivée associe à x la pente de la tangente.", 25).to_edge(DOWN)

        self.play(Write(t), Create(ax))
        self.play(Create(graph), Write(label_f))
        self.play(FadeIn(points), Create(derived), Write(label_df))
        self.play(Write(text))
        self.wait(1)

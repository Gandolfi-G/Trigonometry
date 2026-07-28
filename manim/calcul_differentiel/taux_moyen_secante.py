from manim import *
from derivative_scene_utils import *


class TauxMoyenSecante(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        t = title("Taux de variation moyen")
        ax = axes()
        graph = ax.plot(lambda x: 0.5 * x * x + 1, x_range=[-4, 4], color=BLUE_TERM, stroke_width=5)
        a, b = -1, 3
        fa, fb = 1.5, 5.5
        secant = Line(ax.c2p(a, fa), ax.c2p(b, fb), color=ORANGE_TERM, stroke_width=5)
        p1 = dot(ax.c2p(a, fa), GREEN_TERM)
        p2 = dot(ax.c2p(b, fb), GREEN_TERM)
        formula = caption("pente = Δy / Δx = (f(b)-f(a))/(b-a)", 27, ORANGE_TERM).to_edge(DOWN)

        self.play(Write(t), Create(ax))
        self.play(Create(graph))
        self.play(FadeIn(p1), FadeIn(p2), Create(secant))
        self.play(Write(formula))
        self.wait(1)

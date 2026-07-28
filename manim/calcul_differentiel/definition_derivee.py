from manim import *
from derivative_scene_utils import *


class DefinitionDerivee(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        t = title("Définition de la dérivée")
        q = caption("taux moyen", 27, ORANGE_TERM).shift(UP * 1.6)
        frac = caption("(f(x) - f(x0)) / (x - x0)", 34, ORANGE_TERM).next_to(q, DOWN)
        arrow = Arrow(LEFT, RIGHT, color=GREEN_TERM).next_to(frac, DOWN, buff=0.55)
        lim = caption("f'(x0) = limite du quotient quand x tend vers x0", 28, GREEN_TERM).next_to(arrow, DOWN)
        meaning = caption("f’(x0) est la pente de la tangente.", 26).to_edge(DOWN)

        self.play(Write(t))
        self.play(Write(q), Write(frac))
        self.play(Create(arrow))
        self.play(Write(lim))
        self.play(Write(meaning))
        self.wait(1)

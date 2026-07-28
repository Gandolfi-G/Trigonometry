from manim import *
from integral_scene_utils import *


class ReglesPrimitives(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        t = title("Règles de calcul des primitives")
        rules = VGroup(
            formula_line("∫ x^n dx = x^(n+1)/(n+1) + C   avec n ≠ -1", BLUE_TERM, 25),
            formula_line("∫ (f + g) dx = F + G + C", GREEN_TERM, 27),
            formula_line("∫ k f(x) dx = k F(x) + C", ORANGE_TERM, 27),
            formula_line("∫ g(f(x)) f'(x) dx = G(f(x)) + C", YELLOW_TERM, 25),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.34).shift(UP * 0.1)
        examples = VGroup(
            caption("Exemple : ∫ 3x² dx = x³ + C", 25, TEXT_COLOR),
            caption("Exemple : ∫ 2x(x²+1)³ dx = (x²+1)^4 / 4 + C", 23, TEXT_COLOR),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.25).to_edge(DOWN)
        box = SurroundingRectangle(rules, color=GREY_A, buff=0.35)
        self.play(Write(t))
        self.play(Create(box), LaggedStart(*[Write(r) for r in rules], lag_ratio=0.18))
        self.play(Write(examples))
        self.wait(1)

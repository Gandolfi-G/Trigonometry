from manim import *
from exponential_scene_utils import *


class ProprietesLogarithmes(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        t = title("Propriétés des logarithmes")
        rules = VGroup(
            caption("log_a(xy) = log_a(x) + log_a(y)", 26, GREEN_TERM),
            caption("log_a(x/y) = log_a(x) - log_a(y)", 26, ORANGE_TERM),
            caption("log_a(x^n) = n log_a(x)", 26, BLUE_TERM),
            caption("log_a(x) = log_b(x) / log_b(a)", 26, YELLOW_TERM),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.42)
        note = caption("Un produit dans l’exponentielle devient une somme dans le logarithme.", 23).to_edge(DOWN)
        self.play(Write(t))
        self.play(LaggedStart(*[Write(rule) for rule in rules], lag_ratio=0.2))
        self.play(Write(note))
        self.wait(1)

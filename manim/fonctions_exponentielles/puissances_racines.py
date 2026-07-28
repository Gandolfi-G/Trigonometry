from manim import *
from exponential_scene_utils import *


class PuissancesRacines(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        t = title("Puissances et racines")
        rules = VGroup(
            caption("a^n : produit de n facteurs égaux à a", 27, BLUE_TERM),
            caption("a^n * a^m = a^(n+m)", 27, GREEN_TERM),
            caption("(a^n)^m = a^(n*m)", 27, ORANGE_TERM),
            caption("racine n-ième :  n√a = b  <=>  b^n = a", 26, YELLOW_TERM),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.42)
        note = caption("Ces règles pilotent les exponentielles et les logarithmes.", 24).to_edge(DOWN)
        self.play(Write(t))
        self.play(LaggedStart(*[Write(rule) for rule in rules], lag_ratio=0.2))
        self.play(Write(note))
        self.wait(1)

from manim import *
from derivative_scene_utils import *


class ReglesDerivation(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        t = title("Règles de dérivation")
        rules = VGroup(
            caption("(f + g)' = f' + g'", 28, GREEN_TERM),
            caption("(f * g)' = f'g + fg'", 28, ORANGE_TERM),
            caption("(f / g)' = (f'g - fg') / g²", 28, YELLOW_TERM),
            caption("(g o f)' = g'(f) * f'", 28, BLUE_TERM),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.5).shift(LEFT * 1.6)
        example = VGroup(
            caption("Exemple", 26, TEXT_COLOR),
            caption("(3x² - 5x + 7)' = 6x - 5", 26, TEXT_COLOR),
        ).arrange(DOWN, buff=0.4).to_edge(RIGHT).shift(LEFT * 0.5)
        note = caption("On garde le sens géométrique, puis on calcule efficacement.", 24).to_edge(DOWN)

        self.play(Write(t))
        self.play(LaggedStart(*[Write(rule) for rule in rules], lag_ratio=0.25))
        self.play(Write(example), Write(note))
        self.wait(1)

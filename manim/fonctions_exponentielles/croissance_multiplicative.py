from manim import *
from exponential_scene_utils import *


class CroissanceMultiplicative(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        t = title("Croissance multiplicative")
        bars = VGroup()
        labels = VGroup()
        values = [1, 2, 4, 8, 16, 32]
        for i, value in enumerate(values):
            bar = Rectangle(width=0.55, height=0.22 * value, fill_color=BLUE_TERM, fill_opacity=0.9, stroke_width=0)
            bar.move_to(LEFT * 3 + RIGHT * i * 1.1 + DOWN * (2.2 - bar.height / 2))
            bars.add(bar)
            labels.add(caption(str(value), 18, TEXT_COLOR).next_to(bar, DOWN, buff=0.12))
        formula = caption("1, 2, 4, 8... chaque étape multiplie par 2", 27, ORANGE_TERM).to_edge(DOWN)
        interest = caption("Capital : Cn = C0(1+i)^n", 28, GREEN_TERM).next_to(formula, UP)
        self.play(Write(t))
        self.play(LaggedStart(*[GrowFromEdge(bar, DOWN) for bar in bars], lag_ratio=0.16), Write(labels))
        self.play(Write(interest), Write(formula))
        self.wait(1)

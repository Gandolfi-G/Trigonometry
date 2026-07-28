from manim import *
from exponential_scene_utils import *


class NombreE(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        t = title("Le nombre e")
        steps = VGroup(
            caption("(1 + 1/1)^1 = 2", 27, BLUE_TERM),
            caption("(1 + 1/12)^12 ≈ 2.61", 27, ORANGE_TERM),
            caption("(1 + 1/365)^365 ≈ 2.71", 27, GREEN_TERM),
            caption("lim (1 + 1/n)^n = e ≈ 2.71828", 28, YELLOW_TERM),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.45)
        note = caption("e apparaît naturellement avec la capitalisation continue.", 24).to_edge(DOWN)
        self.play(Write(t))
        self.play(LaggedStart(*[Write(step) for step in steps], lag_ratio=0.25))
        self.play(Write(note))
        self.wait(1)

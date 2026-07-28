from manim import *
from limits_scene_utils import *


class AsymptoteVerticale(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        t = title("Limite infinie")
        ax = axes(x_range=(-4, 5, 1), y_range=(-5, 5, 1))
        left = ax.plot(lambda x: 1 / (x - 1), x_range=[-4, 0.8], color=BLUE_TERM, stroke_width=5)
        right = ax.plot(lambda x: 1 / (x - 1), x_range=[1.2, 5], color=BLUE_TERM, stroke_width=5)
        asymptote = DashedLine(ax.c2p(1, -5), ax.c2p(1, 5), color=RED_TERM, stroke_width=4)
        label = small_caption("asymptote verticale : x = 1", RED_TERM).next_to(asymptote, RIGHT)
        left_text = small_caption("x -> 1- : f(x) -> -infini", ORANGE_TERM).to_corner(DL)
        right_text = small_caption("x -> 1+ : f(x) -> +infini", GREEN_TERM).to_corner(DR)

        self.play(Write(t), Create(ax))
        self.play(Create(left), Create(right))
        self.play(Create(asymptote), Write(label))
        self.play(Write(left_text), Write(right_text))
        self.wait(1.2)

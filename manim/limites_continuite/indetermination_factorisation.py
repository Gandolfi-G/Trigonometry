from manim import *
from limits_scene_utils import *


class IndeterminationFactorisation(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        t = title("Indétermination 0 / 0")
        step1 = caption("(x² + 4x - 21) / (x - 3)", 32, ORANGE_TERM).shift(UP * 1.5)
        step2 = caption("((x - 3)(x + 7)) / (x - 3)", 32, YELLOW_TERM).next_to(step1, DOWN, buff=0.55)
        step3 = caption("= x + 7, pour x différent de 3", 30, GREEN_TERM).next_to(step2, DOWN, buff=0.55)
        limit = caption("Donc lim f(x) = 10 quand x -> 3", 30, BLUE_TERM).to_edge(DOWN)
        ax = axes(x_range=(-1, 6, 1), y_range=(4, 12, 1), x_length=4.9, y_length=3.2).to_edge(RIGHT).shift(DOWN * 0.25)
        graph = ax.plot(lambda x: x + 7, x_range=[-1, 6], color=BLUE_TERM, stroke_width=5)
        hole = open_dot(ax.c2p(3, 10), ORANGE_TERM)

        self.play(Write(t))
        self.play(Write(step1))
        self.play(TransformFromCopy(step1, step2))
        self.play(TransformFromCopy(step2, step3))
        self.play(Create(ax), Create(graph), FadeIn(hole))
        self.play(Write(limit))
        self.wait(1)

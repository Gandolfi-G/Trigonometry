from manim import *

from functions_scene_utils import BACKGROUND_COLOR, GREEN_TERM, ORANGE_TERM, YELLOW_TERM, axes, expression, title


class OptimisationParabole(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        heading = title("Optimisation")
        model = expression("R(x) = (450 - 15x)(1000 + 100x)", 31, ORANGE_TERM).next_to(heading, DOWN, buff=0.3)
        ax = axes(x_range=(0, 30, 5), y_range=(0, 7, 1), x_length=6.8, y_length=4.2).shift(DOWN * 0.45)
        curve = ax.plot(lambda x: ((450 - 15 * x) * (1000 + 100 * x)) / 100000, x_range=[0, 30], color=ORANGE_TERM, stroke_width=5)
        vertex = Dot(ax.c2p(10, 6), color=YELLOW_TERM, radius=0.08)
        label = expression("maximum : x = 10 rabais", 29, YELLOW_TERM).next_to(vertex, UP + RIGHT, buff=0.15)
        conclusion = expression("recette maximale : 600’000", 31, GREEN_TERM).to_edge(DOWN, buff=0.25)

        self.play(Write(heading), Write(model))
        self.play(Create(ax), Create(curve), run_time=1.4)
        self.play(FadeIn(vertex), Write(label), run_time=1.0)
        self.play(Write(conclusion), run_time=1.0)
        self.wait(1.5)

from manim import *
from limits_scene_utils import *


class LimitesLaterales(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        t = title("Limites à gauche et à droite")
        ax = axes(x_range=(-4, 4, 1), y_range=(-3, 3, 1))
        left = ax.plot(lambda x: -1, x_range=[-4, 0], color=ORANGE_TERM, stroke_width=5)
        right = ax.plot(lambda x: 1, x_range=[0, 4], color=BLUE_TERM, stroke_width=5)
        left_open = open_dot(ax.c2p(0, -1), ORANGE_TERM)
        right_open = open_dot(ax.c2p(0, 1), BLUE_TERM)
        left_label = small_caption("limite gauche = -1", ORANGE_TERM).next_to(ax.c2p(-2.5, -1), DOWN)
        right_label = small_caption("limite droite = 1", BLUE_TERM).next_to(ax.c2p(2.5, 1), UP)
        conclusion = caption("Les deux valeurs diffèrent : la limite en 0 n'existe pas.", 24).to_edge(DOWN)
        moving = filled_dot(ax.c2p(-3, -1), GREEN_TERM)

        self.play(Write(t), Create(ax))
        self.play(Create(left), Create(right), FadeIn(left_open), FadeIn(right_open))
        self.play(FadeIn(moving), moving.animate.move_to(ax.c2p(-0.2, -1)), Write(left_label), run_time=1.8)
        self.play(moving.animate.move_to(ax.c2p(3, 1)), run_time=0.5)
        self.play(moving.animate.move_to(ax.c2p(0.2, 1)), Write(right_label), run_time=1.8)
        self.play(Write(conclusion))
        self.wait(1)

from manim import *
from vector_scene_utils import *


class OperationsVecteurs(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        t = title("Opérations sur les vecteurs")
        ax = axes()
        u = (3, 1)
        v = (1, 2)
        arrow_u = vec(ax, (0, 0), u, BLUE_TERM)
        arrow_v = vec(ax, u, (u[0] + v[0], u[1] + v[1]), ORANGE_TERM)
        result = vec(ax, (0, 0), (u[0] + v[0], u[1] + v[1]), GREEN_TERM, 6)
        scaled = vec(ax, (-4, -2), (-4 + 1.8 * u[0], -2 + 1.8 * u[1]), YELLOW_TERM)
        text1 = caption("u + v : on place l'origine de v à l'extrémité de u", 23).to_edge(DOWN).shift(UP * 0.35)
        text2 = caption("k u change la longueur, et parfois le sens", 23, YELLOW_TERM).next_to(text1, DOWN)
        self.play(Write(t), Create(ax))
        self.play(Create(arrow_u), Create(arrow_v))
        self.play(Create(result), Write(text1))
        self.play(Create(scaled), Write(text2))
        self.wait(1)

from manim import *
from vector_scene_utils import *


class VecteurDefinition(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        t = title("Un vecteur")
        ax = axes()
        v1 = vec(ax, (0, 0), (3, 2), BLUE_TERM)
        v2 = vec(ax, (-4, -1), (-1, 1), ORANGE_TERM)
        v3 = vec(ax, (1, -2), (4, 0), GREEN_TERM)
        labels = VGroup(
            caption("direction", 22, BLUE_TERM).next_to(v1, UP),
            caption("sens", 22, ORANGE_TERM).next_to(v2, DOWN),
            caption("norme", 22, GREEN_TERM).next_to(v3, DOWN),
        )
        note = caption("Même direction, même sens, même longueur : vecteurs équivalents.", 24).to_edge(DOWN)
        self.play(Write(t), Create(ax))
        self.play(Create(v1), Create(v2), Create(v3))
        self.play(Write(labels), Write(note))
        self.wait(1)

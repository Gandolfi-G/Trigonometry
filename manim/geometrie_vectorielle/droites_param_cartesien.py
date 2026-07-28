from manim import *
from vector_scene_utils import *


class DroitesParamCartesien(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        t = title("Droites du plan")
        ax = axes()
        line = ax.plot(lambda x: 0.5 * x, x_range=[-5, 5], color=BLUE_TERM, stroke_width=5)
        a = dot(ax, (-2, -1), ORANGE_TERM)
        direction = vec(ax, (-2, -1), (0, 0), GREEN_TERM)
        text = VGroup(
            caption("Paramétrique : P = A + lambda d", 25, GREEN_TERM),
            caption("Cartésienne : ax + by + c = 0", 25, ORANGE_TERM),
        ).arrange(DOWN, buff=0.35).to_edge(DOWN)
        self.play(Write(t), Create(ax))
        self.play(Create(line), FadeIn(a), Create(direction))
        self.play(Write(text))
        self.wait(1)

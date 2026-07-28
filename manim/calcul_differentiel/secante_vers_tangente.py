from manim import *
from derivative_scene_utils import *


class SecanteVersTangente(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        t = title("De la sécante à la tangente")
        ax = axes()
        graph = ax.plot(lambda x: x * x, x_range=[-3, 3], color=BLUE_TERM, stroke_width=5)
        x0 = 1
        p0 = dot(ax.c2p(x0, 1), GREEN_TERM)
        tangent = line_for_slope(ax, 2, x0, 1, GREEN_TERM)
        h_values = [2.5, 1.4, 0.7, 0.25]
        secant = line_for_slope(ax, 2 + h_values[0], x0, 1, ORANGE_TERM)
        moving = dot(ax.c2p(x0 + h_values[0], (x0 + h_values[0]) ** 2), ORANGE_TERM)
        text = caption("Quand h tend vers 0, la sécante devient tangente.", 25).to_edge(DOWN)

        self.play(Write(t), Create(ax), Create(graph), FadeIn(p0))
        self.play(Create(secant), FadeIn(moving))
        for h in h_values[1:]:
            new_secant = line_for_slope(ax, 2 + h, x0, 1, ORANGE_TERM)
            self.play(
                Transform(secant, new_secant),
                moving.animate.move_to(ax.c2p(x0 + h, (x0 + h) ** 2)),
                run_time=0.8,
            )
        self.play(Create(tangent), Write(text))
        self.wait(1)

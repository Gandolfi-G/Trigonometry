from manim import *
from integral_scene_utils import *


class PrimitivesIndefinie(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        t = title("Primitive et constante C")
        ax = make_axes(x_range=(-3, 3, 1), y_range=(-2, 6, 1))
        curves = VGroup()
        for shift, color in [(-1, GREY_B), (0, BLUE_TERM), (1, GREY_B), (2, GREY_B)]:
            curves.add(ax.plot(lambda x, s=shift: x * x + s, x_range=[-2.2, 2.2], color=color, stroke_width=5 if shift == 0 else 3))
        derivative = ax.plot(lambda x: 2 * x, x_range=[-2.2, 2.2], color=GREEN_TERM, stroke_width=4)
        labels = VGroup(
            formula_line("F(x) = x² + C", ORANGE_TERM, 32),
            formula_line("F'(x) = 2x", GREEN_TERM, 30),
        ).arrange(DOWN, aligned_edge=LEFT).to_corner(DR)
        note = caption("Toutes ces primitives sont décalées verticalement, mais leur dérivée est la même.", 23).to_edge(DOWN)
        self.play(Write(t), Create(ax))
        self.play(Create(curves))
        self.play(Create(derivative), Write(labels))
        self.play(Write(note))
        self.wait(1)

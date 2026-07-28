from manim import *
from integral_scene_utils import *


class AireSousCourbe(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        t = title("Aire sous une courbe")
        ax = make_axes(x_range=(-0.5, 2.5, 0.5), y_range=(-0.5, 4.5, 1))
        curve = ax.plot(lambda x: x * x, x_range=[0, 2], color=BLUE_TERM, stroke_width=5)
        area = ax.get_area(curve, x_range=[0, 1.6], color=GREEN_TERM, opacity=0.45)
        b_line = DashedLine(ax.c2p(1.6, 0), ax.c2p(1.6, 2.56), color=ORANGE_TERM)
        formula = formula_line("A(b) = ∫ de 0 à b x² dx = b³/3", GREEN_TERM, 29).to_edge(DOWN)
        self.play(Write(t), Create(ax))
        self.play(Create(curve))
        self.play(FadeIn(area), Create(b_line))
        self.play(Write(formula))
        self.wait(1)

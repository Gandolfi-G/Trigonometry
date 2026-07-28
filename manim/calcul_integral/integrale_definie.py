from manim import *
from integral_scene_utils import *


class IntegraleDefinie(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        t = title("Intégrale définie")
        ax = make_axes(x_range=(-0.5, 2.5, 0.5), y_range=(-0.5, 6, 1))
        fn = lambda x: x * x + 1
        curve = ax.plot(fn, x_range=[0, 2], color=BLUE_TERM, stroke_width=5)
        area = ax.get_area(curve, x_range=[0, 2], color=GREEN_TERM, opacity=0.42)
        left = DashedLine(ax.c2p(0, 0), ax.c2p(0, 1), color=ORANGE_TERM)
        right = DashedLine(ax.c2p(2, 0), ax.c2p(2, 5), color=ORANGE_TERM)
        notation = formula_line("∫ de a à b f(x) dx", ORANGE_TERM, 34).to_corner(DR)
        meaning = VGroup(
            caption("a et b : bornes", 24),
            caption("f(x) : hauteur", 24),
            caption("dx : largeur infinitésimale", 24),
        ).arrange(DOWN, aligned_edge=LEFT).to_corner(DL)
        exact = formula_line("∫ de 0 à 2 (x² + 1) dx = 14/3 ≈ 4,67", GREEN_TERM, 27).to_edge(DOWN)
        self.play(Write(t), Create(ax), Create(curve))
        self.play(FadeIn(area), Create(left), Create(right))
        self.play(Write(notation), Write(meaning))
        self.play(Write(exact))
        self.wait(1)

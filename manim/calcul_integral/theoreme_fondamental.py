from manim import *
from integral_scene_utils import *


class TheoremeFondamental(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        t = title("Théorème fondamental")
        ax = make_axes(x_range=(-0.5, 2.5, 0.5), y_range=(-0.5, 6, 1))
        f = lambda x: x * x + 1
        curve = ax.plot(f, x_range=[0, 2], color=BLUE_TERM, stroke_width=5)
        area = ax.get_area(curve, x_range=[0.4, 1.8], color=GREEN_TERM, opacity=0.42)
        a_line = DashedLine(ax.c2p(0.4, 0), ax.c2p(0.4, f(0.4)), color=ORANGE_TERM)
        b_line = DashedLine(ax.c2p(1.8, 0), ax.c2p(1.8, f(1.8)), color=ORANGE_TERM)
        labels = VGroup(
            formula_line("A(x) = ∫ de a à x f(t) dt", GREEN_TERM, 28),
            formula_line("A'(x) = f(x)", BLUE_TERM, 30),
            formula_line("∫ de a à b f(t) dt = F(b) - F(a)", ORANGE_TERM, 30),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.28).to_corner(DR)
        example = caption("Pour f(x)=x²+1, une primitive est F(x)=x³/3+x.", 24).to_edge(DOWN)
        self.play(Write(t), Create(ax), Create(curve))
        self.play(FadeIn(area), Create(a_line), Create(b_line))
        self.play(LaggedStart(*[Write(item) for item in labels], lag_ratio=0.2))
        self.play(Write(example))
        self.wait(1)

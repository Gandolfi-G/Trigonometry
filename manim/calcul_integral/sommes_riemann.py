from manim import *
from integral_scene_utils import *


class SommesRiemann(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        t = title("Sommes de Riemann")
        ax = make_axes(x_range=(-0.5, 2.5, 0.5), y_range=(-0.5, 6, 1))
        fn = lambda x: x * x + 1
        curve = ax.plot(fn, x_range=[0, 2], color=GREEN_TERM, stroke_width=5)
        lower = riemann_rectangles(ax, fn, 0, 2, 4, "left", BLUE_TERM, 0.35)
        upper = riemann_rectangles(ax, fn, 0, 2, 4, "right", ORANGE_TERM, 0.28)
        fine = riemann_rectangles(ax, fn, 0, 2, 16, "middle", YELLOW_TERM, 0.30)
        text_lower = caption("4 rectangles : encadrement grossier", 25).to_edge(DOWN)
        text_fine = caption("En affinant le découpage, la somme se rapproche de l’aire.", 25).to_edge(DOWN)
        self.play(Write(t), Create(ax), Create(curve))
        self.play(FadeIn(lower), Write(text_lower))
        self.play(Transform(lower, upper))
        self.play(Transform(lower, fine), Transform(text_lower, text_fine))
        self.wait(1)

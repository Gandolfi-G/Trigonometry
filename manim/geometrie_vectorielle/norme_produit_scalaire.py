from manim import *
from vector_scene_utils import *


class NormeProduitScalaire(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        t = title("Norme et produit scalaire")
        ax = axes()
        u = vec(ax, (0, 0), (3, 0), BLUE_TERM)
        v = vec(ax, (0, 0), (2, 2.4), ORANGE_TERM)
        arc = Arc(radius=0.7, start_angle=0, angle=0.88, color=GREEN_TERM).move_arc_center_to(ax.c2p(0, 0))
        formulas = VGroup(
            caption("||a|| = sqrt(a1² + a2²)", 25, GREEN_TERM),
            caption("u · v = ||u|| ||v|| cos(theta)", 25, ORANGE_TERM),
            caption("u · v = 0  <=>  u perpendiculaire à v", 24, BLUE_TERM),
        ).arrange(DOWN, buff=0.28).to_edge(DOWN)
        self.play(Write(t), Create(ax))
        self.play(Create(u), Create(v), Create(arc))
        self.play(Write(formulas))
        self.wait(1)

from manim import *
from vector_scene_utils import *


class PlansProduitVectoriel(ThreeDScene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        self.set_camera_orientation(phi=62 * DEGREES, theta=-45 * DEGREES)
        t = title("Plan et produit vectoriel")
        axes3 = ThreeDAxes(x_range=(-1, 4, 1), y_range=(-1, 4, 1), z_range=(-1, 4, 1), x_length=5, y_length=5, z_length=3.5)
        plane = Surface(lambda u, v: axes3.c2p(u, v, 0), u_range=[0, 3], v_range=[0, 3], resolution=(2, 2), fill_opacity=0.25, fill_color=BLUE_TERM)
        u = Arrow3D(axes3.c2p(0, 0, 0), axes3.c2p(3, 0, 0), color=ORANGE_TERM)
        v = Arrow3D(axes3.c2p(0, 0, 0), axes3.c2p(0, 3, 0), color=GREEN_TERM)
        n = Arrow3D(axes3.c2p(0, 0, 0), axes3.c2p(0, 0, 2.5), color=YELLOW_TERM)
        note = caption("u x v donne un vecteur normal au plan", 24, YELLOW_TERM).to_edge(DOWN)
        self.add_fixed_in_frame_mobjects(t, note)
        self.play(Write(t), Create(axes3))
        self.play(Create(plane), Create(u), Create(v))
        self.play(Create(n), Write(note))
        self.wait(1)

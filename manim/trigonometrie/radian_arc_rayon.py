from manim import *


class RadianArcRayon(Scene):
    def construct(self):
        title = Text("Le radian").to_edge(UP)
        circle = Circle(radius=2, color=BLUE)
        radius_a = Line(ORIGIN, RIGHT * 2, color=ORANGE)
        radius_b = Line(ORIGIN, 2 * np.array([np.cos(1), np.sin(1), 0]), color=ORANGE)
        arc = Arc(radius=2, start_angle=0, angle=1, color=GREEN)
        formula = MathTex("1\\ \\text{rad} \\Longleftrightarrow \\ell = R").to_edge(DOWN)

        self.play(Write(title))
        self.play(Create(circle), Create(radius_a))
        self.play(Create(radius_b), Create(arc))
        self.play(Write(formula))
        self.wait()

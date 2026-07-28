from manim import *

from equations_scene_utils import BACKGROUND_COLOR, GREEN_TERM, ORANGE_TERM, expression, title


class InequationsTableauSignes(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        heading = title("Inéquations et tableau de signes")
        start = expression("x³ > x", 36).next_to(heading, DOWN, buff=0.45)
        factor = expression("x(x - 1)(x + 1) > 0", 34, ORANGE_TERM).next_to(start, DOWN, buff=0.35)
        table_text = VGroup(
            expression("zéros :  -1, 0, 1", 29),
            expression("signe positif sur ]-1 ; 0[ et ]1 ; +∞[", 29, GREEN_TERM),
            expression("S = ]-1 ; 0[ ∪ ]1 ; +∞[", 34, GREEN_TERM),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.28).next_to(factor, DOWN, buff=0.45)

        line = Line(LEFT * 3.6, RIGHT * 3.6, color=GREY_A, stroke_width=4).to_edge(DOWN, buff=0.9)
        marks = VGroup()
        for x, label in [(-1.2, "-1"), (0, "0"), (1.2, "1")]:
            tick = Line([x, line.get_y() - 0.12, 0], [x, line.get_y() + 0.12, 0], color=GREY_A, stroke_width=3)
            marks.add(tick, Text(label, color=WHITE, font_size=24).next_to(tick, DOWN, buff=0.1))
        positive = VGroup(
            Line([-1.2, line.get_y() + 0.2, 0], [0, line.get_y() + 0.2, 0], color=GREEN_TERM, stroke_width=10),
            Line([1.2, line.get_y() + 0.2, 0], [3.6, line.get_y() + 0.2, 0], color=GREEN_TERM, stroke_width=10),
        )

        self.play(Write(heading), Write(start))
        self.play(TransformMatchingShapes(start.copy(), factor), run_time=1.0)
        self.play(Write(table_text), run_time=1.5)
        self.play(Create(line), Write(marks), Create(positive), run_time=1.2)
        self.wait(1.5)

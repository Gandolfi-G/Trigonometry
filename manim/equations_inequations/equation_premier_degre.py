from manim import *

from equations_scene_utils import BACKGROUND_COLOR, BLUE_TERM, GREEN_TERM, ORANGE_TERM, expression, title


class EquationPremierDegre(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        heading = title("Équation du premier degré")
        steps = VGroup(
            expression("6x - 7 = 2x + 5", 32),
            expression("6x = 2x + 12", 32, ORANGE_TERM),
            expression("4x = 12", 32, BLUE_TERM),
            expression("x = 3", 38, GREEN_TERM),
            expression("S = {3}", 36, GREEN_TERM),
        ).arrange(DOWN, buff=0.38).next_to(heading, DOWN, buff=0.6)
        labels = VGroup(
            Text("donnée", color=GREY_B, font_size=22),
            Text("+7", color=ORANGE_TERM, font_size=22),
            Text("-2x", color=BLUE_TERM, font_size=22),
            Text("÷4", color=GREEN_TERM, font_size=22),
            Text("solution", color=GREEN_TERM, font_size=22),
        )
        for label, step in zip(labels, steps):
            label.next_to(step, LEFT, buff=0.55)

        self.play(Write(heading))
        for i, step in enumerate(steps):
            self.play(Write(labels[i]), Write(step), run_time=0.7)
        self.wait(1.5)

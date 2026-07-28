from manim import *

from equations_scene_utils import BACKGROUND_COLOR, BLUE_TERM, GREEN_TERM, ORANGE_TERM, expression, title


class DegreNDivision(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        heading = title("Degré n : factoriser pour résoudre")
        steps = VGroup(
            expression("P(x) = x³ - 5x² + 2x + 8", 31),
            expression("P(2) = 0  donc  x - 2 est un facteur", 30, ORANGE_TERM),
            expression("P(x) = (x - 2)(x² - 3x - 4)", 30, BLUE_TERM),
            expression("P(x) = (x - 2)(x - 4)(x + 1)", 30, GREEN_TERM),
            expression("S = {-1 ; 2 ; 4}", 36, GREEN_TERM),
        ).arrange(DOWN, buff=0.34).next_to(heading, DOWN, buff=0.55)

        self.play(Write(heading))
        for step in steps:
            self.play(Write(step), run_time=0.75)
        self.wait(1.5)

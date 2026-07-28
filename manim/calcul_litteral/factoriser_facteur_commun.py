from manim import *

from algebra_scene_utils import BACKGROUND_COLOR, BLUE_TERM, GREEN_TERM, ORANGE_TERM, expression, title


class FactoriserFacteurCommun(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        heading = title("Factoriser")

        start = expression("6x + 9")
        split = expression("3 · 2x + 3 · 3", color=ORANGE_TERM)
        common = expression("3(2x + 3)", color=GREEN_TERM)
        note = Text("Le facteur commun est 3", color=BLUE_TERM, font_size=32, weight=BOLD)

        group = VGroup(start, split, common).arrange(DOWN, buff=0.55).next_to(heading, DOWN, buff=0.65)
        note.next_to(group, DOWN, buff=0.45)

        arrows = VGroup(
            Arrow(start.get_bottom(), split.get_top(), color=ORANGE_TERM, buff=0.1),
            Arrow(split.get_bottom(), common.get_top(), color=GREEN_TERM, buff=0.1),
        )

        self.play(Write(heading), Write(start))
        self.play(GrowArrow(arrows[0]), TransformMatchingShapes(start.copy(), split), run_time=1.1)
        self.play(Write(note), run_time=0.8)
        self.play(GrowArrow(arrows[1]), TransformMatchingShapes(split.copy(), common), run_time=1.1)
        self.wait(1.5)

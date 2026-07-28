from manim import *

from algebra_scene_utils import BACKGROUND_COLOR, BLUE_TERM, ORANGE_TERM, TEXT_COLOR, title


MIXED_TERM = "#6f5cc2"


def txt(content, size=28, color=TEXT_COLOR):
    return Text(content, color=color, font_size=size, weight=BOLD)


def h_dim(start, end, label, color):
    line = Line(start, end, color=color, stroke_width=4)
    tick_a = Line(start + DOWN * 0.08, start + UP * 0.08, color=color, stroke_width=4)
    tick_b = Line(end + DOWN * 0.08, end + UP * 0.08, color=color, stroke_width=4)
    label_mob = txt(label, 20).next_to(line, UP, buff=0.08)
    return VGroup(line, tick_a, tick_b, label_mob)


def v_dim(start, end, label, color):
    line = Line(start, end, color=color, stroke_width=4)
    tick_a = Line(start + LEFT * 0.08, start + RIGHT * 0.08, color=color, stroke_width=4)
    tick_b = Line(end + LEFT * 0.08, end + RIGHT * 0.08, color=color, stroke_width=4)
    label_mob = txt(label, 20).rotate(PI / 2).next_to(line, LEFT, buff=0.08)
    return VGroup(line, tick_a, tick_b, label_mob)


def area_rect(width, height, color, center, label):
    rect = Rectangle(
        width=width,
        height=height,
        fill_color=color,
        fill_opacity=0.9,
        stroke_color=WHITE,
        stroke_width=2,
    ).move_to(center)
    label_mob = txt(label, 30).move_to(rect.get_center())
    return VGroup(rect, label_mob)


class IdentiteRemarquableCarre(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        heading = title("Première identité remarquable")

        a = 2.75
        b = 1.25
        side = a + b
        left = -side / 2
        top = 1.75
        bottom = top - side
        split_x = left + a
        split_y = top - a

        intro = txt("L'aire du grand carré vaut (a + b)².", 27, ORANGE_TERM).to_edge(DOWN, buff=0.45)
        outer = Square(side_length=side, color=WHITE, stroke_width=4).move_to([0, top - side / 2, 0])
        dims = VGroup(
            h_dim(np.array([left, top + 0.45, 0]), np.array([split_x, top + 0.45, 0]), "a", BLUE_TERM),
            h_dim(np.array([split_x, top + 0.45, 0]), np.array([left + side, top + 0.45, 0]), "b", ORANGE_TERM),
            v_dim(np.array([left - 0.42, split_y, 0]), np.array([left - 0.42, top, 0]), "a", BLUE_TERM),
            v_dim(np.array([left - 0.42, bottom, 0]), np.array([left - 0.42, split_y, 0]), "b", ORANGE_TERM),
        )

        a2 = area_rect(a, a, BLUE_TERM, [left + a / 2, top - a / 2, 0], "a²")
        ab = area_rect(b, a, MIXED_TERM, [split_x + b / 2, top - a / 2, 0], "ab")
        ba = area_rect(a, b, MIXED_TERM, [left + a / 2, split_y - b / 2, 0], "ba")
        b2 = area_rect(b, b, ORANGE_TERM, [split_x + b / 2, split_y - b / 2, 0], "b²")
        pieces = VGroup(a2, ab, ba, b2)

        self.play(Write(heading))
        self.play(Create(outer), Create(dims), Write(intro))
        self.play(FadeIn(a2))
        self.play(FadeIn(ab), FadeIn(ba))
        self.play(FadeIn(b2))

        split_note = txt("On sépare les 4 aires qui composent le carré.", 25).to_edge(DOWN, buff=0.45)
        self.play(Transform(intro, split_note), FadeOut(dims), FadeOut(outer))
        self.play(
            a2.animate.shift(LEFT * 0.45 + UP * 0.18),
            ab.animate.shift(RIGHT * 0.45 + UP * 0.18),
            ba.animate.shift(LEFT * 0.45 + DOWN * 0.18),
            b2.animate.shift(RIGHT * 0.45 + DOWN * 0.18),
            run_time=1.1,
        )

        add = txt("(a + b)² = a² + ab + ba + b²", 29, TEXT_COLOR).move_to(DOWN * 2.95)
        group = txt("(a + b)² = a² + 2ab + b²", 33, GREEN_C).move_to(DOWN * 2.95)
        self.play(FadeOut(intro))
        self.play(Write(add))
        self.play(ReplacementTransform(add, group))
        self.wait(1.5)

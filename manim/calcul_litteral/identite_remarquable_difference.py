from manim import *

from algebra_scene_utils import BACKGROUND_COLOR, BLUE_TERM, ORANGE_TERM, TEXT_COLOR, title


MIXED_TERM = "#6f5cc2"
RED_TERM = RED_C
GREEN_TERM = GREEN_C


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


def piece(width, height, color, center, label):
    rect = Rectangle(
        width=width,
        height=height,
        fill_color=color,
        fill_opacity=0.9,
        stroke_color=WHITE,
        stroke_width=2,
    ).move_to(center)
    label_mob = txt(label, 28).move_to(rect)
    return VGroup(rect, label_mob)


def base_square(side, center):
    square = Square(
        side_length=side,
        fill_color=BLUE_TERM,
        fill_opacity=0.12,
        stroke_color=BLUE_TERM,
        stroke_width=3,
    ).move_to(center)
    hatch = VGroup()
    for offset in [-1.5, -0.75, 0, 0.75, 1.5]:
        hatch.add(
            Line(
                square.get_left() + UP * offset,
                square.get_right() + UP * offset,
                color=BLUE_TERM,
                stroke_width=1.4,
                stroke_opacity=0.25,
            )
        )
    label = txt("a²", 34).move_to(square.get_center())
    return VGroup(square, hatch, label)


class IdentiteRemarquableDifference(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        heading = title("Deuxième identité remarquable")

        a = 4.0
        b = 1.05
        rest = a - b
        left = -a / 2
        top = 1.75
        bottom = top - a
        right = left + a
        split_x = right - b
        split_y = bottom + b

        base = base_square(a, [left + a / 2, top - a / 2, 0])
        strip_right = piece(b, a, MIXED_TERM, [split_x + b / 2, top - a / 2, 0], "ab")
        strip_bottom = piece(a, b, MIXED_TERM, [left + a / 2, bottom + b / 2, 0], "ab")
        corner = piece(b, b, ORANGE_TERM, [split_x + b / 2, bottom + b / 2, 0], "b²")
        full_outline = Square(side_length=a, color=WHITE, stroke_width=4).move_to([0, top - a / 2, 0])
        guide_lines = VGroup(
            Line([split_x, top, 0], [split_x, bottom, 0], color=GREY_B, stroke_width=2),
            Line([left, split_y, 0], [right, split_y, 0], color=GREY_B, stroke_width=2),
        )
        dims = VGroup(
            h_dim([left, top + 0.42, 0], [right, top + 0.42, 0], "a", BLUE_TERM),
            h_dim([split_x, top + 0.05, 0], [right, top + 0.05, 0], "b", ORANGE_TERM),
            v_dim([left - 0.42, bottom, 0], [left - 0.42, top, 0], "a", BLUE_TERM),
            v_dim([right + 0.35, bottom, 0], [right + 0.35, split_y, 0], "b", ORANGE_TERM),
        )
        target_outline = Square(
            side_length=rest,
            fill_color=GREEN_TERM,
            fill_opacity=0.08,
            stroke_color=GREEN_TERM,
            stroke_width=5,
        ).move_to([left + rest / 2, top - rest / 2, 0])
        target_label = txt("(a - b)²", 28, GREEN_TERM).move_to(target_outline)
        target_dims = VGroup(
            h_dim([left, top - 0.18, 0], [split_x, top - 0.18, 0], "a - b", GREEN_TERM),
            v_dim([left + 0.18, split_y, 0], [left + 0.18, top, 0], "a - b", GREEN_TERM),
        )

        intro = txt("On part de a² et on veut garder le carré de côté a - b.", 25, TEXT_COLOR).move_to(DOWN * 2.85)
        self.play(Write(heading))
        self.play(Create(full_outline), Create(guide_lines), Create(dims), FadeIn(base), Write(intro))

        find_target = txt("Le carré cherché, (a - b)², est cette zone conservée.", 25, GREEN_TERM).move_to(DOWN * 2.85)
        self.play(
            Transform(intro, find_target),
            Create(target_outline),
            FadeIn(target_label),
            Create(target_dims),
            base[2].animate.set_opacity(0.35),
        )
        self.wait(0.6)
        self.play(
            FadeOut(target_label),
            FadeOut(target_dims),
            target_outline.animate.set_stroke(width=3).set_fill(opacity=0.02),
            base[2].animate.set_opacity(1),
        )

        remove_right = txt("On enlève une bande : ab", 25, RED_TERM).move_to(DOWN * 2.85)
        self.play(Transform(intro, remove_right), FadeIn(strip_right))
        self.play(strip_right.animate.shift(RIGHT * 0.55), run_time=0.8)

        remove_bottom = txt("On enlève une deuxième bande : ab", 25, RED_TERM).move_to(DOWN * 2.85)
        self.play(Transform(intro, remove_bottom), FadeIn(strip_bottom))
        self.play(strip_bottom.animate.shift(DOWN * 0.42), run_time=0.8)

        double_removed = txt("Le coin b² appartient aux deux bandes : il a été retiré deux fois.", 23, ORANGE_TERM).move_to(DOWN * 2.85)
        self.play(Transform(intro, double_removed), Indicate(corner[0], color=ORANGE_TERM), FadeIn(corner))
        self.play(corner.animate.shift(RIGHT * 0.55 + DOWN * 0.42), run_time=0.8)

        restore = txt("On le rajoute une fois pour corriger.", 25, GREEN_TERM).move_to(DOWN * 2.85)
        plus_corner = txt("+ b²", 30, ORANGE_TERM).next_to(corner, RIGHT, buff=0.25)
        self.play(Transform(intro, restore), Write(plus_corner))

        visible_diagram = VGroup(base, strip_right, strip_bottom, corner, full_outline, guide_lines, dims, target_outline)
        formula1 = txt("(a - b)² = a² - ab - ab + b²", 29, TEXT_COLOR).move_to(DOWN * 2.68)
        formula2 = txt("(a - b)² = a² - 2ab + b²", 34, GREEN_TERM).move_to(DOWN * 2.68)
        self.play(FadeOut(intro), FadeOut(plus_corner))
        self.play(visible_diagram.animate.shift(UP * 0.55), run_time=0.7)
        self.play(Write(formula1))
        self.play(ReplacementTransform(formula1, formula2))
        self.wait(1.5)

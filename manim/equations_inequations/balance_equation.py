from math import cos, sin

import numpy as np
from manim import *

from equations_scene_utils import (
    BACKGROUND_COLOR,
    BLUE_TERM,
    GREEN_TERM,
    ORANGE_TERM,
    RED_TERM,
    TEXT_COLOR,
    expression,
    title,
)


PURPLE_TERM = "#6f5cc2"
PIVOT = np.array([0, 0.55, 0])
ARM_LENGTH = 3.55
PAN_DROP = 1.08
LEFT_TILT = 10 * DEGREES


def txt(content, size=28, color=TEXT_COLOR):
    return Text(content, color=color, font_size=size, weight=BOLD)


def rotated(vector, angle):
    x, y, z = vector
    return np.array([x * cos(angle) - y * sin(angle), x * sin(angle) + y * cos(angle), z])


def hook_point(side, angle):
    return PIVOT + rotated(np.array([side * ARM_LENGTH, 0, 0]), angle)


def pan_center(side, angle):
    return hook_point(side, angle) + DOWN * PAN_DROP


def plus_position(side, angle):
    return pan_center(side, angle) + RIGHT * 0.86


def plus_block(label="+7", color=GREEN_TERM):
    box = RoundedRectangle(
        corner_radius=0.12,
        width=0.88,
        height=0.5,
        color=color,
        fill_color=color,
        fill_opacity=0.95,
        stroke_color=WHITE,
        stroke_width=2,
    )
    text = txt(label, 22, WHITE).move_to(box)
    return VGroup(box, text)


def pan(center, color, main_label, extra_label=None):
    tray = RoundedRectangle(
        corner_radius=0.16,
        width=2.75,
        height=0.86,
        color=color,
        fill_color=color,
        fill_opacity=0.22,
        stroke_width=3,
    ).move_to(center)
    content = VGroup()
    if extra_label:
        main = expression(main_label, 25).move_to(center + LEFT * 0.42)
        extra = plus_block(extra_label).move_to(center + RIGHT * 0.86)
        content.add(main, extra)
    else:
        content.add(expression(main_label, 28).move_to(center))
    return VGroup(tray, content)


def scale_drawing(angle=0, left_label="6x - 7", right_label="2x + 5", left_extra=None, right_extra=None):
    left_hook = hook_point(-1, angle)
    right_hook = hook_point(1, angle)
    left_center = pan_center(-1, angle)
    right_center = pan_center(1, angle)

    stand = VGroup(
        Line(PIVOT + DOWN * 2.35, PIVOT + DOWN * 0.08, color=GREY_B, stroke_width=7),
        Polygon(
            PIVOT + UP * 0.16,
            PIVOT + DOWN * 0.22 + LEFT * 0.34,
            PIVOT + DOWN * 0.22 + RIGHT * 0.34,
            color=GREY_B,
            fill_color=GREY_B,
            fill_opacity=1,
        ),
        Line(PIVOT + DOWN * 2.35 + LEFT * 0.85, PIVOT + DOWN * 2.35 + RIGHT * 0.85, color=GREY_B, stroke_width=7),
    )
    beam = Line(left_hook, right_hook, color=GREY_A, stroke_width=8)

    left_tray = pan(left_center, BLUE_TERM, left_label, left_extra)
    right_tray = pan(right_center, ORANGE_TERM, right_label, right_extra)
    ropes = VGroup(
        Line(left_hook, left_tray[0].get_corner(UL), color=GREY_B, stroke_width=3),
        Line(left_hook, left_tray[0].get_corner(UR), color=GREY_B, stroke_width=3),
        Line(right_hook, right_tray[0].get_corner(UL), color=GREY_B, stroke_width=3),
        Line(right_hook, right_tray[0].get_corner(UR), color=GREY_B, stroke_width=3),
    )
    labels = VGroup(
        txt("membre gauche", 20, BLUE_TERM).next_to(left_tray, DOWN, buff=0.14),
        txt("membre droit", 20, ORANGE_TERM).next_to(right_tray, DOWN, buff=0.14),
    )
    return VGroup(stand, beam, ropes, left_tray, right_tray, labels)


class BalanceEquation(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        heading = title("Principe d'équivalence")

        tilt = ValueTracker(0)
        balanced = always_redraw(lambda: scale_drawing(tilt.get_value()))
        equation = expression("6x - 7 = 2x + 5", 32, TEXT_COLOR).to_edge(DOWN, buff=0.52)
        note = txt("Une équation se lit comme une balance équilibrée.", 24, GREEN_TERM).next_to(heading, DOWN, buff=0.28)

        self.play(Write(heading))
        self.play(Create(balanced), Write(equation), Write(note), run_time=1.2)
        self.wait(0.6)

        left_floating_plus = plus_block("+7").move_to(LEFT * 3.25 + UP * 2.25)
        left_arrow = Arrow(
            left_floating_plus.get_bottom(),
            LEFT * 2.7 + DOWN * 0.52,
            buff=0.1,
            color=GREEN_TERM,
            stroke_width=4,
            max_tip_length_to_length_ratio=0.15,
        )
        self.play(FadeIn(left_floating_plus, shift=DOWN * 0.25), GrowArrow(left_arrow), run_time=0.7)
        self.play(left_floating_plus.animate.move_to(plus_position(-1, 0)), FadeOut(left_arrow), run_time=0.85)

        left_heavy = always_redraw(
            lambda: scale_drawing(
                angle=tilt.get_value(),
                left_label="6x - 7",
                right_label="2x + 5",
                left_extra="+7",
            )
        )
        wrong_equation = expression("6x - 7 + 7  ≠  2x + 5", 31, RED_TERM).to_edge(DOWN, buff=0.52)
        wrong_note = txt("Si on ajoute +7 d'un seul côté, on change l'équilibre.", 24, RED_TERM).next_to(heading, DOWN, buff=0.28)

        self.remove(balanced, left_floating_plus)
        self.add(left_heavy)
        self.play(
            tilt.animate.set_value(LEFT_TILT),
            Transform(equation, wrong_equation),
            Transform(note, wrong_note),
            run_time=1.75,
            rate_func=smooth,
        )
        self.wait(0.8)

        right_floating_plus = plus_block("+7").move_to(RIGHT * 3.25 + UP * 2.25)
        right_arrow = Arrow(
            right_floating_plus.get_bottom(),
            plus_position(1, LEFT_TILT),
            buff=0.1,
            color=GREEN_TERM,
            stroke_width=4,
            max_tip_length_to_length_ratio=0.15,
        )
        self.play(FadeIn(right_floating_plus, shift=DOWN * 0.25), GrowArrow(right_arrow), run_time=0.7)
        self.play(right_floating_plus.animate.move_to(plus_position(1, LEFT_TILT)), FadeOut(right_arrow), run_time=0.85)

        both_sides = always_redraw(
            lambda: scale_drawing(
                angle=tilt.get_value(),
                left_label="6x - 7",
                right_label="2x + 5",
                left_extra="+7",
                right_extra="+7",
            )
        )
        equivalent_equation = expression("6x - 7 + 7  =  2x + 5 + 7", 31, GREEN_TERM).to_edge(DOWN, buff=0.52)
        equivalent_note = txt("Pour garder une équation équivalente, on fait la même chose des deux côtés.", 23, GREEN_TERM).next_to(
            heading, DOWN, buff=0.28
        )

        self.remove(left_heavy, right_floating_plus)
        self.add(both_sides)
        self.play(
            tilt.animate.set_value(0),
            Transform(equation, equivalent_equation),
            Transform(note, equivalent_note),
            run_time=1.75,
            rate_func=smooth,
        )
        self.wait(0.8)

        simplified = scale_drawing(angle=0, left_label="6x", right_label="2x + 12")
        simplified_equation = expression("6x = 2x + 12", 36, GREEN_TERM).to_edge(DOWN, buff=0.52)
        rule = txt("Même opération à gauche et à droite : même équilibre.", 25, PURPLE_TERM).next_to(heading, DOWN, buff=0.28)

        self.play(
            ReplacementTransform(both_sides, simplified),
            Transform(equation, simplified_equation),
            Transform(note, rule),
            run_time=1.35,
        )
        self.wait(1.6)

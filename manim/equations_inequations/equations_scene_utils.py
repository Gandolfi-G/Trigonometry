from manim import *


BACKGROUND_COLOR = "#111827"
TEXT_COLOR = WHITE
BLUE_TERM = BLUE_C
GREEN_TERM = GREEN_C
ORANGE_TERM = ORANGE
YELLOW_TERM = YELLOW
RED_TERM = RED_C


def title(text):
    return Text(text, color=TEXT_COLOR, font_size=40, weight=BOLD).to_edge(UP)


def expression(text, font_size=34, color=TEXT_COLOR):
    return Text(text, color=color, font_size=font_size, weight=BOLD)


def boxed(text, color=YELLOW_TERM, font_size=30):
    label = expression(text, font_size=font_size, color=color)
    box = RoundedRectangle(
        corner_radius=0.12,
        width=label.width + 0.5,
        height=label.height + 0.3,
        color=color,
        fill_color=BACKGROUND_COLOR,
        fill_opacity=0.92,
        stroke_width=2,
    )
    label.move_to(box.get_center())
    return VGroup(box, label)


def simple_axis(y=0, x_min=-5, x_max=5, length=8):
    axis = Line(LEFT * length / 2, RIGHT * length / 2, color=GREY_A, stroke_width=4).shift(UP * y)
    ticks = VGroup()
    for value in range(x_min, x_max + 1):
        x = (value - x_min) / (x_max - x_min) * length - length / 2
        tick = Line([x, y - 0.09, 0], [x, y + 0.09, 0], color=GREY_A, stroke_width=2)
        label = Text(str(value), color=GREY_B, font_size=20).next_to(tick, DOWN, buff=0.08)
        ticks.add(tick, label)
    return VGroup(axis, ticks)

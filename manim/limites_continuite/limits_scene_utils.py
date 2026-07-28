from manim import *


BACKGROUND_COLOR = "#111827"
TEXT_COLOR = WHITE
BLUE_TERM = BLUE_C
GREEN_TERM = GREEN_C
ORANGE_TERM = ORANGE
YELLOW_TERM = YELLOW
RED_TERM = RED_C


def title(text):
    return Text(text, color=TEXT_COLOR, font_size=38, weight=BOLD).to_edge(UP)


def caption(text, font_size=27, color=TEXT_COLOR):
    return Text(text, color=color, font_size=font_size)


def small_caption(text, color=TEXT_COLOR):
    return Text(text, color=color, font_size=22)


def axes(x_range=(-5, 5, 1), y_range=(-4, 4, 1), x_length=7.2, y_length=4.6):
    return Axes(
        x_range=list(x_range),
        y_range=list(y_range),
        x_length=x_length,
        y_length=y_length,
        tips=False,
        axis_config={"color": GREY_A, "stroke_width": 4},
    )


def open_dot(point, color=ORANGE_TERM, radius=0.08):
    return Circle(radius=radius, color=color, stroke_width=4).move_to(point).set_fill(BACKGROUND_COLOR, opacity=1)


def filled_dot(point, color=GREEN_TERM, radius=0.08):
    return Dot(point=point, color=color, radius=radius)

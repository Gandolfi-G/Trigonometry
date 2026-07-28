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


def caption(text, font_size=26, color=TEXT_COLOR):
    return Text(text, color=color, font_size=font_size)


def small(text, color=TEXT_COLOR):
    return Text(text, color=color, font_size=22)


def axes(x_range=(-5, 5, 1), y_range=(-2, 8, 1), x_length=7.2, y_length=4.8):
    return Axes(
        x_range=list(x_range),
        y_range=list(y_range),
        x_length=x_length,
        y_length=y_length,
        tips=False,
        axis_config={"color": GREY_A, "stroke_width": 4},
    )


def dot(point, color=GREEN_TERM):
    return Dot(point=point, color=color, radius=0.08)


def line_for_slope(ax, slope, point_x, point_y, color=ORANGE_TERM, span=2.2):
    x1 = point_x - span
    x2 = point_x + span
    y1 = point_y + slope * (x1 - point_x)
    y2 = point_y + slope * (x2 - point_x)
    return Line(ax.c2p(x1, y1), ax.c2p(x2, y2), color=color, stroke_width=5)

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


def axes(x_range=(-5, 5, 1), y_range=(-3, 4, 1), x_length=7.2, y_length=4.8):
    return Axes(
        x_range=list(x_range),
        y_range=list(y_range),
        x_length=x_length,
        y_length=y_length,
        tips=False,
        axis_config={"color": GREY_A, "stroke_width": 4},
    )


def vec(ax, start, end, color=BLUE_TERM, stroke_width=5):
    return Arrow(ax.c2p(*start), ax.c2p(*end), buff=0, color=color, stroke_width=stroke_width, max_tip_length_to_length_ratio=0.18)


def dot(ax, point, color=GREEN_TERM):
    return Dot(ax.c2p(*point), color=color, radius=0.08)

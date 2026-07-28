from manim import *


BACKGROUND_COLOR = "#111827"
TEXT_COLOR = WHITE
BLUE_TERM = BLUE_C
GREEN_TERM = GREEN_C
ORANGE_TERM = ORANGE
YELLOW_TERM = YELLOW
RED_TERM = RED_C
GRID_COLOR = GREY_BROWN


def title(text):
    return Text(text, color=TEXT_COLOR, font_size=38, weight=BOLD).to_edge(UP)


def caption(text, font_size=25, color=TEXT_COLOR):
    return Text(text, color=color, font_size=font_size)


def make_axes(x_range=(-1, 3, 1), y_range=(-1, 6, 1), x_length=7.4, y_length=4.6):
    return Axes(
        x_range=list(x_range),
        y_range=list(y_range),
        x_length=x_length,
        y_length=y_length,
        tips=False,
        axis_config={"color": GREY_A, "stroke_width": 4},
    )


def formula_line(text, color=TEXT_COLOR, font_size=28):
    return Text(text, color=color, font_size=font_size)


def dot(ax, x, y, color=ORANGE_TERM):
    return Dot(ax.c2p(x, y), color=color, radius=0.08)


def riemann_rectangles(ax, fn, a, b, n, sample="left", color=BLUE_TERM, opacity=0.35):
    rects = VGroup()
    dx = (b - a) / n
    for i in range(n):
        left = a + i * dx
        right = left + dx
        if sample == "right":
            sample_x = right
        elif sample == "middle":
            sample_x = (left + right) / 2
        else:
            sample_x = left
        height = fn(sample_x)
        rect = Rectangle(
            width=ax.x_axis.unit_size * dx,
            height=ax.y_axis.unit_size * height,
            stroke_color=color,
            stroke_width=2,
            fill_color=color,
            fill_opacity=opacity,
        )
        rect.move_to(ax.c2p(left + dx / 2, height / 2))
        rects.add(rect)
    return rects

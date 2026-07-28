from manim import *


BACKGROUND_COLOR = "#111827"
TEXT_COLOR = WHITE
BLUE_TERM = BLUE_C
GREEN_TERM = GREEN_C
ORANGE_TERM = ORANGE
YELLOW_TERM = YELLOW


def title(text):
    return Text(text, color=TEXT_COLOR, font_size=42, weight=BOLD).to_edge(UP)


def label_box(text, color=YELLOW_TERM, font_size=32):
    label = Text(text, color=color, font_size=font_size, weight=BOLD)
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


def expression(text, font_size=36, color=TEXT_COLOR):
    return Text(text, color=color, font_size=font_size, weight=BOLD)

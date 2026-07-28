from manim import *


BACKGROUND_COLOR = "#111827"
AXIS_COLOR = GREY_A
CIRCLE_COLOR = BLUE_C
HIGHLIGHT_COLOR = YELLOW


def build_trigo_plane():
    plane = NumberPlane(
        x_range=[-1.5, 1.5, 0.5],
        y_range=[-1.2, 1.2, 0.5],
        x_length=7.2,
        y_length=5.76,
        background_line_style={
            "stroke_color": GREY_D,
            "stroke_width": 1,
            "stroke_opacity": 0.42,
        },
        axis_config={
            "stroke_color": AXIS_COLOR,
            "stroke_width": 7,
            "include_ticks": True,
            "include_tip": True,
        },
    )
    plane.shift(DOWN * 0.2)
    return plane


def build_grid(plane):
    fine_grid = VGroup()
    for x in [-1.5, -1, -0.5, 0.5, 1, 1.5]:
        fine_grid.add(
            Line(
                plane.c2p(x, -1.2),
                plane.c2p(x, 1.2),
                color=GREY_D,
                stroke_width=1,
                stroke_opacity=0.42,
            )
        )
    for y in [-1, -0.5, 0.5, 1]:
        fine_grid.add(
            Line(
                plane.c2p(-1.5, y),
                plane.c2p(1.5, y),
                color=GREY_D,
                stroke_width=1,
                stroke_opacity=0.42,
            )
        )

    major_grid = VGroup()
    for x in [-1, 1]:
        major_grid.add(
            Line(
                plane.c2p(x, -1.2),
                plane.c2p(x, 1.2),
                color=GREY_C,
                stroke_width=1.5,
                stroke_opacity=0.55,
            )
        )
    for y in [-1, 1]:
        major_grid.add(
            Line(
                plane.c2p(-1.5, y),
                plane.c2p(1.5, y),
                color=GREY_C,
                stroke_width=1.5,
                stroke_opacity=0.55,
            )
        )

    return VGroup(fine_grid, major_grid)


def build_axis_labels(plane):
    return VGroup(
        Text("x", color=AXIS_COLOR, font_size=28).next_to(plane.x_axis.get_end(), DOWN),
        Text("y", color=AXIS_COLOR, font_size=28).next_to(plane.y_axis.get_end(), LEFT),
        Text("0,5", color=GREY_B, font_size=20).next_to(plane.c2p(0.5, 0), DOWN, buff=0.14),
        Text("1", color=AXIS_COLOR, font_size=26).next_to(plane.c2p(1, 0), DOWN, buff=0.18),
    )


def build_unit_circle(plane, color=CIRCLE_COLOR):
    unit_circle = Circle(
        radius=plane.x_axis.unit_size,
        color=color,
        stroke_width=7,
    )
    unit_circle.move_to(plane.c2p(0, 0))
    return unit_circle


def build_origin_marker(plane):
    origin_dot = Dot(plane.c2p(0, 0), radius=0.045, color=WHITE)
    origin_label = Text("O", color=WHITE, font_size=28).next_to(origin_dot, DOWN + LEFT, buff=0.12)
    return VGroup(origin_dot, origin_label)


def build_radius_annotation(plane):
    radius = Line(
        plane.c2p(0, 0),
        plane.c2p(1, 0),
        color=HIGHLIGHT_COLOR,
        stroke_width=6,
    )
    label_group = build_label_box("rayon = 1", font_size=28)
    label_group.next_to(plane.c2p(1, 0.35), RIGHT, buff=0.22)
    pointer = Line(
        label_group.get_left(),
        plane.c2p(0.72, 0),
        color=HIGHLIGHT_COLOR,
        stroke_width=3,
    )
    return VGroup(radius, pointer, label_group)


def build_label_box(text, font_size=30):
    label = Text(text, color=HIGHLIGHT_COLOR, font_size=font_size, weight=BOLD)
    box = RoundedRectangle(
        corner_radius=0.12,
        width=label.width + 0.42,
        height=label.height + 0.26,
        color=HIGHLIGHT_COLOR,
        fill_color=BACKGROUND_COLOR,
        fill_opacity=0.92,
        stroke_width=2,
    )
    label.move_to(box.get_center())
    return VGroup(box, label)

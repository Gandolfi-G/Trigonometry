from manim import *

from trigo_scene_utils import (
    BACKGROUND_COLOR,
    CIRCLE_COLOR,
    HIGHLIGHT_COLOR,
    build_axis_labels,
    build_grid,
    build_origin_marker,
    build_trigo_plane,
    build_unit_circle,
)


class CosinusSinusCercleTrigo(Scene):
    def construct(self):
        # Voix off:
        # "On peut également dire que les valeurs que prennent x et y sont
        # directement dépendantes de l'angle θ. On crée une fonction qui lie
        # l'angle à la valeur x, et une autre à la valeur y. Nous venons ici de
        # créer les fonctions cosinus et sinus."

        self.camera.background_color = BACKGROUND_COLOR

        title = Text("Cosinus et sinus", font_size=44, weight=BOLD).to_edge(UP)
        plane = build_trigo_plane()
        grid = build_grid(plane)
        axis_labels = build_axis_labels(plane)
        origin_marker = build_origin_marker(plane)
        unit_circle = build_unit_circle(plane, color=CIRCLE_COLOR)

        theta = PI / 3
        point_coords = plane.c2p(np.cos(theta), np.sin(theta))
        point = Dot(point_coords, radius=0.08, color=HIGHLIGHT_COLOR)
        radius = Line(plane.c2p(0, 0), point_coords, color=HIGHLIGHT_COLOR, stroke_width=5)
        angle_arc = Arc(
            radius=0.45 * plane.x_axis.unit_size,
            start_angle=0,
            angle=theta,
            color=HIGHLIGHT_COLOR,
            stroke_width=5,
        ).move_arc_center_to(plane.c2p(0, 0))
        theta_label = Text("θ", color=HIGHLIGHT_COLOR, font_size=34, weight=BOLD).next_to(plane.c2p(0.35, 0.22), RIGHT, buff=0.1)

        cos_segment = Line(plane.c2p(0, -0.08), plane.c2p(np.cos(theta), -0.08), color=BLUE_B, stroke_width=8)
        sin_segment = Line(plane.c2p(np.cos(theta) + 0.08, 0), plane.c2p(np.cos(theta) + 0.08, np.sin(theta)), color=GREEN_B, stroke_width=8)
        cos_label = Text("cos(θ)", color=BLUE_B, font_size=30, weight=BOLD).next_to(cos_segment, DOWN, buff=0.16)
        sin_label = Text("sin(θ)", color=GREEN_B, font_size=30, weight=BOLD).next_to(sin_segment, RIGHT, buff=0.16)
        coordinate = Text("P = (cos(θ), sin(θ))", color=WHITE, font_size=36, weight=BOLD).next_to(plane, DOWN, buff=0.32)

        table = VGroup(
            Text("θ", color=WHITE, font_size=26, weight=BOLD),
            Text("0", color=WHITE, font_size=26),
            Text("π/3", color=WHITE, font_size=26),
            Text("π/2", color=WHITE, font_size=26),
            Text("cos(θ)", color=BLUE_B, font_size=26, weight=BOLD),
            Text("1", color=BLUE_B, font_size=26),
            Text("0,5", color=BLUE_B, font_size=26),
            Text("0", color=BLUE_B, font_size=26),
            Text("sin(θ)", color=GREEN_B, font_size=26, weight=BOLD),
            Text("0", color=GREEN_B, font_size=26),
            Text("√3/2", color=GREEN_B, font_size=26),
            Text("1", color=GREEN_B, font_size=26),
        )
        table.arrange_in_grid(rows=3, cols=4, buff=(0.45, 0.24))
        table.to_edge(RIGHT, buff=0.35).shift(DOWN * 0.6)
        table_box = SurroundingRectangle(table, color=GREY_C, buff=0.18)

        self.add(title, plane.x_axis, plane.y_axis, grid, axis_labels, origin_marker, unit_circle)
        self.play(Create(radius), FadeIn(point), Create(angle_arc), Write(theta_label), run_time=1.1)
        self.play(Create(cos_segment), Write(cos_label), run_time=1.0)
        self.play(Create(sin_segment), Write(sin_label), run_time=1.0)
        self.play(Write(coordinate), run_time=1.0)
        self.play(FadeIn(table_box), Write(table), run_time=1.6)
        self.wait(1.5)

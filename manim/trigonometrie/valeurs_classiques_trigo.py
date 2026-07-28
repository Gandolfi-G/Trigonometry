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


class ValeursClassiquesTrigo(Scene):
    def construct(self):
        # Voix off:
        # "Pour tout angle nous avons une valeur de cosinus, de sinus et de
        # tangente associée. Quelques valeurs sont tout de même à remarquer."

        self.camera.background_color = BACKGROUND_COLOR

        title = Text("Valeurs classiques", font_size=44, weight=BOLD).to_edge(UP)
        plane = build_trigo_plane()
        grid = build_grid(plane)
        axis_labels = build_axis_labels(plane)
        origin_marker = build_origin_marker(plane)
        unit_circle = build_unit_circle(plane, color=CIRCLE_COLOR)

        rows = [
            ("θ", "cos(θ)", "sin(θ)", "tan(θ)"),
            ("0", "1", "0", "0"),
            ("π/6", "√3/2", "1/2", "√3/3"),
            ("π/4", "√2/2", "√2/2", "1"),
            ("π/3", "1/2", "√3/2", "√3"),
        ]
        table_items = VGroup()
        for row in rows:
            for value in row:
                color = WHITE
                if value == "cos(θ)":
                    color = BLUE_B
                if value == "sin(θ)":
                    color = GREEN_B
                if value == "tan(θ)":
                    color = ORANGE
                table_items.add(Text(value, color=color, font_size=25, weight=BOLD if row == rows[0] else NORMAL))
        table_items.arrange_in_grid(rows=len(rows), cols=4, buff=(0.5, 0.22))
        table_items.to_edge(RIGHT, buff=0.35).shift(DOWN * 0.25)
        table_box = SurroundingRectangle(table_items, color=GREY_C, buff=0.18)

        angle_values = [0, PI / 6, PI / 4, PI / 3]
        angle_labels = ["0", "π/6", "π/4", "π/3"]
        rays = VGroup()
        dots = VGroup()
        labels = VGroup()
        for angle, label in zip(angle_values, angle_labels):
            end = plane.c2p(np.cos(angle), np.sin(angle))
            ray = Line(plane.c2p(0, 0), end, color=HIGHLIGHT_COLOR, stroke_width=4)
            dot = Dot(end, radius=0.055, color=HIGHLIGHT_COLOR)
            text = Text(label, color=HIGHLIGHT_COLOR, font_size=24, weight=BOLD).next_to(dot, UP + RIGHT, buff=0.08)
            rays.add(ray)
            dots.add(dot)
            labels.add(text)

        relation = Text("cos²(θ) + sin²(θ) = 1", color=WHITE, font_size=34, weight=BOLD)
        relation.next_to(plane, DOWN, buff=0.32)

        self.add(title, plane.x_axis, plane.y_axis, grid, axis_labels, origin_marker, unit_circle)
        for ray, dot, label in zip(rays, dots, labels):
            self.play(Create(ray), FadeIn(dot), Write(label), run_time=0.55)
        self.play(Write(relation), run_time=1.0)
        self.play(FadeIn(table_box), Write(table_items), run_time=2.0)
        self.wait(1.8)

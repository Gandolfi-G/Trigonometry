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


class RelationFondamentaleTrigo(Scene):
    def construct(self):
        # Voix off:
        # "Lorsque l'on affiche le triangle formé par les longueurs du cosinus
        # et du sinus, nous obtenons un triangle rectangle. Le théorème de
        # Pythagore donne alors cos²(θ) + sin²(θ) = 1."

        self.camera.background_color = BACKGROUND_COLOR

        title = Text("Relation fondamentale", font_size=42, weight=BOLD).to_edge(UP)
        plane = build_trigo_plane()
        grid = build_grid(plane)
        axis_labels = build_axis_labels(plane)
        origin_marker = build_origin_marker(plane)
        unit_circle = build_unit_circle(plane, color=CIRCLE_COLOR)

        theta = 0.92
        point = plane.c2p(np.cos(theta), np.sin(theta))
        foot = plane.c2p(np.cos(theta), 0)

        hypotenuse = Line(plane.c2p(0, 0), point, color=HIGHLIGHT_COLOR, stroke_width=7)
        cos_side = Line(plane.c2p(0, 0), foot, color=BLUE_B, stroke_width=7)
        sin_side = Line(foot, point, color=GREEN_B, stroke_width=7)
        dot = Dot(point, radius=0.08, color=HIGHLIGHT_COLOR)
        right_angle = RightAngle(cos_side, sin_side, length=0.18, color=WHITE, stroke_width=3)

        cos_label = Text("cos(θ)", color=BLUE_B, font_size=28, weight=BOLD).next_to(cos_side, DOWN, buff=0.16)
        sin_label = Text("sin(θ)", color=GREEN_B, font_size=28, weight=BOLD).next_to(sin_side, RIGHT, buff=0.16)
        radius_label = Text("1", color=HIGHLIGHT_COLOR, font_size=30, weight=BOLD).next_to(hypotenuse, UP + LEFT, buff=0.14)
        formula = Text("cos²(θ) + sin²(θ) = 1", color=WHITE, font_size=42, weight=BOLD).next_to(plane, DOWN, buff=0.3)
        use_pythagore = Text("Théorème de Pythagore", color=HIGHLIGHT_COLOR, font_size=32, weight=BOLD).next_to(formula, UP, buff=0.22)

        self.add(title, plane.x_axis, plane.y_axis, grid, axis_labels, origin_marker, unit_circle)
        self.play(Create(hypotenuse), FadeIn(dot), Write(radius_label), run_time=1.0)
        self.play(Create(cos_side), Write(cos_label), run_time=0.9)
        self.play(Create(sin_side), Write(sin_label), Create(right_angle), run_time=0.9)
        self.play(Write(use_pythagore), run_time=0.9)
        self.play(Write(formula), run_time=1.2)
        self.wait(1.5)

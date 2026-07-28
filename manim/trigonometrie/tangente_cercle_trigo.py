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


class TangenteCercleTrigo(Scene):
    def construct(self):
        # Voix off:
        # "La tangente est le rapport entre le sinus et le cosinus :
        # tan(θ) = sin(θ) / cos(θ). On peut la visualiser sur la tangente au
        # cercle en x = 1. Lorsque θ tend vers π/2, cos(θ) tend vers 0 : la
        # tangente n'est alors pas définie."

        self.camera.background_color = BACKGROUND_COLOR

        title = Text("La tangente", font_size=44, weight=BOLD).to_edge(UP)
        plane = build_trigo_plane()
        grid = build_grid(plane)
        axis_labels = build_axis_labels(plane)
        origin_marker = build_origin_marker(plane)
        unit_circle = build_unit_circle(plane, color=CIRCLE_COLOR)

        theta = ValueTracker(0.25)
        tangent_x = 1

        tangent_line = Line(
            plane.c2p(tangent_x, -1.2),
            plane.c2p(tangent_x, 1.2),
            color=GREY_A,
            stroke_width=5,
        )
        tangent_line_label = Text("droite x = 1", color=GREY_A, font_size=24).next_to(tangent_line, RIGHT, buff=0.12)

        radius = always_redraw(
            lambda: Line(
                plane.c2p(0, 0),
                plane.c2p(np.cos(theta.get_value()), np.sin(theta.get_value())),
                color=HIGHLIGHT_COLOR,
                stroke_width=5,
            )
        )
        point = always_redraw(
            lambda: Dot(
                plane.c2p(np.cos(theta.get_value()), np.sin(theta.get_value())),
                radius=0.07,
                color=HIGHLIGHT_COLOR,
            )
        )
        tangent_segment = always_redraw(
            lambda: Line(
                plane.c2p(1, 0),
                plane.c2p(1, min(np.tan(theta.get_value()), 1.2)),
                color=GREEN_B,
                stroke_width=8,
            )
        )
        tangent_value = always_redraw(
            lambda: Text(
                f"tan(θ) ≈ {np.tan(theta.get_value()):.2f}",
                color=GREEN_B,
                font_size=28,
                weight=BOLD,
            ).next_to(plane, DOWN, buff=0.32)
        )
        formula = Text("tan(θ) = sin(θ) / cos(θ)", color=WHITE, font_size=34, weight=BOLD)
        formula.to_edge(RIGHT, buff=0.38).shift(UP * 0.95)

        forbidden = VGroup(
            Text("θ = π/2", color=HIGHLIGHT_COLOR, font_size=34, weight=BOLD),
            Text("cos(θ) = 0", color=WHITE, font_size=30),
            Text("tan(θ) interdite", color=GREEN_B, font_size=32, weight=BOLD),
        )
        forbidden.arrange(DOWN, aligned_edge=LEFT, buff=0.18)
        forbidden.next_to(plane, DOWN, buff=0.18)

        self.add(title, plane.x_axis, plane.y_axis, grid, axis_labels, origin_marker, unit_circle)
        self.play(FadeIn(tangent_line), Write(tangent_line_label), Write(formula), run_time=1.1)
        self.play(Create(radius), FadeIn(point), Create(tangent_segment), FadeIn(tangent_value), run_time=0.9)
        self.play(theta.animate.set_value(0.95), run_time=2.0)
        self.play(theta.animate.set_value(1.36), run_time=2.0)
        self.play(FadeOut(tangent_value), Write(forbidden), run_time=1.1)
        self.wait(1.5)

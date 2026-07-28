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


class CoordonneesPointCercleTrigo(Scene):
    def construct(self):
        # Voix off:
        # "Chaque point du cercle peut être repéré par ses coordonnées x et y,
        # mais également par l'angle qu'il fait avec l'axe des x.
        # Affichons la valeur x et y du point P. On constate que les valeurs
        # sont comprises entre -1 et 1. De plus lorsque x a une certaine valeur,
        # par exemple 0,5, la valeur de y ne peut prendre que deux valeurs
        # possibles. On comprend donc que les valeurs en x et y ne sont pas
        # indépendantes."

        self.camera.background_color = BACKGROUND_COLOR

        title = Text("Coordonnées d'un point", font_size=42, weight=BOLD).to_edge(UP)
        plane = build_trigo_plane()
        grid = build_grid(plane)
        axis_labels = build_axis_labels(plane)
        origin_marker = build_origin_marker(plane)
        unit_circle = build_unit_circle(plane, color=CIRCLE_COLOR)

        theta = ValueTracker(0.35)

        point = always_redraw(
            lambda: Dot(
                plane.c2p(np.cos(theta.get_value()), np.sin(theta.get_value())),
                radius=0.07,
                color=HIGHLIGHT_COLOR,
            )
        )
        radius = always_redraw(
            lambda: Line(
                plane.c2p(0, 0),
                plane.c2p(np.cos(theta.get_value()), np.sin(theta.get_value())),
                color=HIGHLIGHT_COLOR,
                stroke_width=5,
            )
        )
        vertical_projection = always_redraw(
            lambda: DashedLine(
                plane.c2p(np.cos(theta.get_value()), 0),
                plane.c2p(np.cos(theta.get_value()), np.sin(theta.get_value())),
                color=BLUE_B,
                stroke_width=4,
            )
        )
        horizontal_projection = always_redraw(
            lambda: DashedLine(
                plane.c2p(0, np.sin(theta.get_value())),
                plane.c2p(np.cos(theta.get_value()), np.sin(theta.get_value())),
                color=GREEN_B,
                stroke_width=4,
            )
        )
        angle_label = always_redraw(
            lambda: Text(
                f"θ ≈ {theta.get_value():.2f} rad",
                color=HIGHLIGHT_COLOR,
                font_size=28,
                weight=BOLD,
            ).next_to(plane.c2p(0.15, 0.18), RIGHT, buff=0.15)
        )
        coord_label = always_redraw(
            lambda: Text(
                f"P({np.cos(theta.get_value()):.2f}, {np.sin(theta.get_value()):.2f})",
                color=WHITE,
                font_size=32,
                weight=BOLD,
            ).next_to(plane, DOWN, buff=0.32)
        )

        self.add(title, plane.x_axis, plane.y_axis, grid, axis_labels, origin_marker, unit_circle)
        self.play(FadeIn(point), Create(radius), Create(vertical_projection), Create(horizontal_projection), FadeIn(angle_label), Write(coord_label), run_time=1.2)
        self.play(theta.animate.set_value(2.25), run_time=3.0)
        self.play(theta.animate.set_value(5.35), run_time=3.0)
        self.wait(0.5)

        x_value = 0.5
        y_value = np.sqrt(1 - x_value**2)
        vertical_line = DashedLine(
            plane.c2p(x_value, -y_value),
            plane.c2p(x_value, y_value),
            color=HIGHLIGHT_COLOR,
            stroke_width=5,
        )
        x_label = Text("x = 0,5", color=HIGHLIGHT_COLOR, font_size=30, weight=BOLD)
        x_label.next_to(plane.c2p(x_value, 0), DOWN, buff=0.25)
        top_point = Dot(plane.c2p(x_value, y_value), radius=0.08, color=HIGHLIGHT_COLOR)
        bottom_point = Dot(plane.c2p(x_value, -y_value), radius=0.08, color=HIGHLIGHT_COLOR)
        two_values = Text("Deux valeurs possibles pour y", color=WHITE, font_size=32, weight=BOLD)
        two_values.next_to(plane, DOWN, buff=0.32)

        self.play(
            FadeOut(point),
            FadeOut(radius),
            FadeOut(vertical_projection),
            FadeOut(horizontal_projection),
            FadeOut(angle_label),
            FadeOut(coord_label),
            run_time=0.7,
        )
        self.play(Create(vertical_line), FadeIn(x_label), FadeIn(top_point), FadeIn(bottom_point), run_time=1.4)
        self.play(Write(two_values), run_time=1.0)
        self.wait(1.5)

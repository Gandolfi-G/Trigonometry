from manim import *

from trigo_scene_utils import (
    BACKGROUND_COLOR,
    CIRCLE_COLOR,
    HIGHLIGHT_COLOR,
    build_axis_labels,
    build_grid,
    build_origin_marker,
    build_radius_annotation,
    build_trigo_plane,
    build_unit_circle,
)


class IntroCercleTrigo(Scene):
    def construct(self):
        # Voix off:
        # "Nous allons découvrir ensemble le cercle trigonométrique.
        # Le cercle trigonométrique est un cercle dont le rayon est égal à 1
        # et qui est centré sur l'origine du repère, dans le plan usuel muni
        # d'un repère orthonormé."

        self.camera.background_color = BACKGROUND_COLOR

        title = Text("Le cercle trigonométrique", font_size=44, weight=BOLD)
        title.to_edge(UP)

        plane = build_trigo_plane()
        grid = build_grid(plane)
        axis_labels = build_axis_labels(plane)
        origin_marker = build_origin_marker(plane)
        unit_circle = build_unit_circle(plane)
        radius_group = build_radius_annotation(plane)

        definition = Text(
            "Rayon = 1    Centre : origine du repère",
            font_size=32,
            color=WHITE,
        )
        definition.next_to(plane, DOWN, buff=0.35)

        self.play(Write(title))
        self.play(Create(plane.x_axis), Create(plane.y_axis), run_time=1.6)
        self.play(
            FadeIn(grid, shift=DOWN * 0.1),
            FadeIn(axis_labels),
            FadeIn(origin_marker[0]),
            Write(origin_marker[1]),
            run_time=1.4,
        )
        self.play(Create(unit_circle), run_time=1.8)
        self.play(unit_circle.animate.set_color(HIGHLIGHT_COLOR), run_time=0.6)
        self.play(unit_circle.animate.set_color(CIRCLE_COLOR), Create(radius_group), run_time=1.2)
        self.play(Write(definition), run_time=1.2)
        self.wait(1.5)

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


class PerimetreDemiCercleTrigo(Scene):
    def construct(self):
        # Voix off:
        # "Nous pouvons commencer par étudier son périmètre. Pour cela nous
        # allons mesurer la moitié du périmètre. Il suffira de prendre le double
        # de notre mesure pour avoir le périmètre total.
        #
        # En mesurant le demi-périmètre, on trouve une valeur d'à peu près 3.14.
        # Pour être plus précis, on trouve que la longueur vaut π. π peut donc
        # être décrit comme la longueur d'arc d'un demi-cercle. Le périmètre du
        # cercle trigonométrique est donc égal à 2π."

        self.camera.background_color = BACKGROUND_COLOR

        title = Text("Le demi-périmètre", font_size=44, weight=BOLD)
        title.to_edge(UP)

        plane = build_trigo_plane()
        grid = build_grid(plane)
        axis_labels = build_axis_labels(plane)
        origin_marker = build_origin_marker(plane)
        unit_circle = build_unit_circle(plane)

        upper_arc = Arc(
            radius=plane.x_axis.unit_size,
            start_angle=0,
            angle=PI,
            color=HIGHLIGHT_COLOR,
            stroke_width=11,
        )
        upper_arc.move_arc_center_to(plane.c2p(0, 0))

        lower_arc = Arc(
            radius=plane.x_axis.unit_size,
            start_angle=PI,
            angle=PI,
            color=CIRCLE_COLOR,
            stroke_width=7,
            stroke_opacity=0.35,
        )
        lower_arc.move_arc_center_to(plane.c2p(0, 0))

        intro_label = Text("On mesure la moitié du périmètre", color=WHITE, font_size=30)
        intro_label.next_to(plane, DOWN, buff=0.34)

        self.add(title, plane.x_axis, plane.y_axis, grid, axis_labels, origin_marker, unit_circle)
        self.wait(0.5)
        self.play(unit_circle.animate.set_opacity(0.22), Create(upper_arc), Write(intro_label), run_time=1.4)
        self.play(FadeOut(unit_circle), FadeIn(lower_arc), run_time=0.7)
        self.play(FadeOut(lower_arc), intro_label.animate.set_opacity(0.0), run_time=0.8)

        ruler_origin = LEFT * 3.7 + DOWN * 1.55
        ruler_length = PI * plane.x_axis.unit_size
        ruler = Line(ruler_origin, ruler_origin + RIGHT * ruler_length, color=GREY_A, stroke_width=5)

        ticks = VGroup()
        labels = VGroup()
        for value in [0, 1, 2, 3]:
            x = ruler_origin + RIGHT * value * plane.x_axis.unit_size
            tick = Line(x + DOWN * 0.12, x + UP * 0.12, color=GREY_A, stroke_width=3)
            label = Text(str(value), color=GREY_B, font_size=24).next_to(tick, DOWN, buff=0.12)
            ticks.add(tick)
            labels.add(label)

        pi_position = ruler_origin + RIGHT * ruler_length
        pi_tick = Line(pi_position + DOWN * 0.18, pi_position + UP * 0.18, color=HIGHLIGHT_COLOR, stroke_width=5)
        pi_label = Text("π", color=HIGHLIGHT_COLOR, font_size=44, weight=BOLD).next_to(pi_tick, UP, buff=0.16)
        approx_label = Text("π ≈ 3,14", color=HIGHLIGHT_COLOR, font_size=30, weight=BOLD)
        approx_label.next_to(ruler, DOWN, buff=0.46)

        unfolded_line = Line(
            ruler_origin,
            pi_position,
            color=HIGHLIGHT_COLOR,
            stroke_width=11,
        )

        self.play(
            upper_arc.animate.shift(DOWN * 0.55),
            FadeIn(ruler),
            FadeIn(ticks),
            FadeIn(labels),
            run_time=1.2,
        )
        self.play(Transform(upper_arc, unfolded_line), run_time=2.0)
        self.play(FadeIn(pi_tick), Write(pi_label), Write(approx_label), run_time=1.2)
        self.wait(1.0)

        perimeter_formula = Text("Périmètre du cercle trigonométrique = 2π", color=WHITE, font_size=34)
        perimeter_formula.next_to(plane, DOWN, buff=0.34)

        self.play(
            FadeOut(ruler),
            FadeOut(ticks),
            FadeOut(labels),
            FadeOut(pi_tick),
            FadeOut(pi_label),
            FadeOut(approx_label),
            FadeOut(upper_arc),
            run_time=0.9,
        )
        self.play(FadeIn(unit_circle.set_opacity(1)), run_time=0.9)
        self.play(Write(perimeter_formula), run_time=1.2)
        self.wait(1.5)

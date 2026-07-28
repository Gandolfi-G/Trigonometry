from manim import *

from trigo_scene_utils import (
    BACKGROUND_COLOR,
    CIRCLE_COLOR,
    HIGHLIGHT_COLOR,
    build_axis_labels,
    build_grid,
    build_label_box,
    build_origin_marker,
    build_trigo_plane,
    build_unit_circle,
)


class ArcRadianCercleTrigo(Scene):
    def construct(self):
        # Voix off:
        # "À présent concentrons-nous sur les angles. De manière habituelle,
        # nous utilisons les degrés pour décrire l'angle fait entre l'axe des x
        # et la droite passant par un point P sur le cercle.
        #
        # Nous allons définir une nouvelle unité d'angle. Pour cela, nous allons
        # utiliser le radian, construit comme ceci.
        #
        # On peut donc faire un lien entre l'angle en degré et l'angle en radian.
        # On voit que 180 degrés est égal à π radians. Par proportionnalité,
        # nous avons donc les formules suivantes pour passer de degrés à radians
        # et inversement."

        self.camera.background_color = BACKGROUND_COLOR

        title = Text("Angles et radians", font_size=44, weight=BOLD)
        title.to_edge(UP)

        plane = build_trigo_plane()
        grid = build_grid(plane)
        axis_labels = build_axis_labels(plane)
        origin_marker = build_origin_marker(plane)
        unit_circle = build_unit_circle(plane, color=CIRCLE_COLOR)

        theta = ValueTracker(0)

        moving_point = always_redraw(
            lambda: Dot(
                plane.c2p(np.cos(theta.get_value()), np.sin(theta.get_value())),
                radius=0.07,
                color=HIGHLIGHT_COLOR,
            )
        )
        radius_line = always_redraw(
            lambda: Line(
                plane.c2p(0, 0),
                plane.c2p(np.cos(theta.get_value()), np.sin(theta.get_value())),
                color=HIGHLIGHT_COLOR,
                stroke_width=5,
            )
        )
        angle_arc = always_redraw(
            lambda: Arc(
                radius=0.38 * plane.x_axis.unit_size,
                start_angle=0,
                angle=theta.get_value(),
                color=HIGHLIGHT_COLOR,
                stroke_width=5,
            ).move_arc_center_to(plane.c2p(0, 0))
        )
        degree_label = always_redraw(
            lambda: Text(
                f"{round(theta.get_value() * 180 / PI):d}°",
                color=HIGHLIGHT_COLOR,
                font_size=32,
                weight=BOLD,
            ).next_to(plane.c2p(0.4, 0.18), RIGHT, buff=0.14)
        )
        point_label = always_redraw(
            lambda: Text("P", color=WHITE, font_size=28).next_to(moving_point, UP + RIGHT, buff=0.1)
        )

        self.add(title, plane.x_axis, plane.y_axis, grid, axis_labels, origin_marker, unit_circle)
        self.play(FadeIn(moving_point), Write(point_label), Create(radius_line), Create(angle_arc), run_time=0.8)
        self.add(degree_label)
        self.play(theta.animate.set_value(PI / 3), run_time=2.0)
        self.wait(0.3)
        self.play(theta.animate.set_value(2 * PI / 3), run_time=2.0)
        self.wait(0.4)

        radian_title = Text("Construire 1 radian", color=WHITE, font_size=34, weight=BOLD)
        radian_title.next_to(plane, DOWN, buff=0.34)

        one_radian_arc = Arc(
            radius=plane.x_axis.unit_size,
            start_angle=0,
            angle=1,
            color=GREEN_C,
            stroke_width=11,
        )
        one_radian_arc.move_arc_center_to(plane.c2p(0, 0))
        one_radian_radius = Line(
            plane.c2p(0, 0),
            plane.c2p(np.cos(1), np.sin(1)),
            color=GREEN_C,
            stroke_width=5,
        )
        arc_label = build_label_box("arc = rayon = 1", font_size=26)
        arc_label.next_to(plane.c2p(0.78, 0.56), RIGHT, buff=0.18)
        one_rad_label = build_label_box("angle = 1 rad", font_size=30)
        one_rad_label.next_to(plane.c2p(0.42, 0.2), UP, buff=0.18)

        self.play(
            theta.animate.set_value(1),
            FadeOut(degree_label),
            FadeOut(point_label),
            FadeOut(moving_point),
            FadeOut(radian_title, shift=DOWN * 0.1),
            run_time=0.8,
        )
        self.play(Write(radian_title), run_time=0.8)
        self.play(Create(one_radian_arc), Create(one_radian_radius), FadeIn(arc_label), run_time=1.4)
        self.play(FadeIn(one_rad_label), run_time=0.8)
        self.wait(0.8)

        conversion_panel = VGroup(
            Text("180° = π radians", color=HIGHLIGHT_COLOR, font_size=36, weight=BOLD),
            Text("radians = degrés · π / 180", color=WHITE, font_size=30),
            Text("degrés = radians · 180 / π", color=WHITE, font_size=30),
        )
        conversion_panel.arrange(DOWN, aligned_edge=LEFT, buff=0.24)
        conversion_panel.to_edge(DOWN, buff=0.35)

        half_arc = Arc(
            radius=plane.x_axis.unit_size,
            start_angle=0,
            angle=PI,
            color=HIGHLIGHT_COLOR,
            stroke_width=11,
        )
        half_arc.move_arc_center_to(plane.c2p(0, 0))

        self.play(
            FadeOut(radian_title),
            FadeOut(one_radian_arc),
            FadeOut(one_radian_radius),
            FadeOut(arc_label),
            FadeOut(one_rad_label),
            FadeOut(radius_line),
            FadeOut(angle_arc),
            run_time=0.8,
        )
        self.play(Create(half_arc), run_time=1.5)
        self.play(Write(conversion_panel), run_time=1.7)
        self.wait(1.5)

from manim import *

from trigo_scene_utils import (
    BACKGROUND_COLOR,
    CIRCLE_COLOR,
    HIGHLIGHT_COLOR,
    build_axis_labels,
    build_grid,
    build_label_box,
    build_origin_marker,
    build_radius_annotation,
    build_trigo_plane,
    build_unit_circle,
)


class CentreRayonCercleTrigo(MovingCameraScene):
    def construct(self):
        # Voix off:
        # "Regardons de plus près ce cercle. Notons O son centre,
        # qui est également l'origine du repère."

        self.camera.background_color = BACKGROUND_COLOR

        title = Text("Le cercle trigonométrique", font_size=44, weight=BOLD)
        title.to_edge(UP)

        plane = build_trigo_plane()
        grid = build_grid(plane)
        axis_labels = build_axis_labels(plane)
        origin_marker = build_origin_marker(plane)
        unit_circle = build_unit_circle(plane, color=CIRCLE_COLOR)
        radius_group = build_radius_annotation(plane)

        scene_start = VGroup(
            title,
            plane.x_axis,
            plane.y_axis,
            grid,
            axis_labels,
            origin_marker,
            unit_circle,
            radius_group,
        )
        self.add(scene_start)
        self.wait(0.4)

        zoom_target = VGroup(unit_circle, origin_marker, radius_group)
        self.play(
            self.camera.frame.animate.set(width=6.2).move_to(zoom_target),
            run_time=1.8,
        )

        center_label = build_label_box("Centre = O", font_size=30)
        center_label.next_to(plane.c2p(-0.35, 0.5), LEFT, buff=0.28)
        center_pointer = Arrow(
            center_label.get_right(),
            plane.c2p(0, 0),
            buff=0.08,
            color=HIGHLIGHT_COLOR,
            stroke_width=4,
            max_tip_length_to_length_ratio=0.18,
        )

        radius_label = build_label_box("Rayon = 1", font_size=30)
        radius_label.next_to(plane.c2p(0.55, 0.5), UP + RIGHT, buff=0.24)
        radius_pointer = Arrow(
            radius_label.get_bottom(),
            plane.c2p(0.55, 0),
            buff=0.08,
            color=HIGHLIGHT_COLOR,
            stroke_width=4,
            max_tip_length_to_length_ratio=0.18,
        )

        center_pulse = Circle(radius=0.18, color=HIGHLIGHT_COLOR, stroke_width=4)
        center_pulse.move_to(plane.c2p(0, 0))

        self.play(
            GrowArrow(center_pointer),
            FadeIn(center_label, shift=RIGHT * 0.1),
            Create(center_pulse),
            run_time=1.2,
        )
        self.play(FadeOut(center_pulse), run_time=0.35)
        self.play(
            GrowArrow(radius_pointer),
            FadeIn(radius_label, shift=DOWN * 0.1),
            run_time=1.1,
        )
        self.wait(1.5)

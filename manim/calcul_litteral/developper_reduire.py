from manim import *

from algebra_scene_utils import BACKGROUND_COLOR, BLUE_TERM, GREEN_TERM, ORANGE_TERM, TEXT_COLOR, title


RED_TERM = RED_C


def txt(content, size=28, color=TEXT_COLOR):
    return Text(content, color=color, font_size=size, weight=BOLD)


def dim_line(start, end, label, color=GREY_A, label_shift=UP * 0.18):
    line = Line(start, end, color=color, stroke_width=4)
    tick_a = Line(start + DOWN * 0.08, start + UP * 0.08, color=color, stroke_width=4)
    tick_b = Line(end + DOWN * 0.08, end + UP * 0.08, color=color, stroke_width=4)
    label_mob = txt(label, 20, TEXT_COLOR).next_to(line, UP, buff=0.08).shift(label_shift)
    return VGroup(line, tick_a, tick_b, label_mob)


def v_dim_line(start, end, label, color=GREEN_TERM):
    line = Line(start, end, color=color, stroke_width=4)
    tick_a = Line(start + LEFT * 0.08, start + RIGHT * 0.08, color=color, stroke_width=4)
    tick_b = Line(end + LEFT * 0.08, end + RIGHT * 0.08, color=color, stroke_width=4)
    label_mob = txt(label, 20, TEXT_COLOR).rotate(PI / 2).next_to(line, LEFT, buff=0.08)
    return VGroup(line, tick_a, tick_b, label_mob)


class DevelopperReduire(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        heading = title("Développer : d'où vient la distributivité ?")

        x_part = ValueTracker(3)
        unit = 0.58
        b_width = 1.45
        height = 1.85
        y0 = 0.15

        def left_width():
            return x_part.get_value() * unit

        def total_width():
            return left_width() + b_width

        def left_center():
            return np.array([-total_width() / 2 + left_width() / 2, y0, 0])

        def right_center():
            return np.array([-total_width() / 2 + left_width() + b_width / 2, y0, 0])

        left_rect = always_redraw(
            lambda: Rectangle(
                width=left_width(),
                height=height,
                fill_color=BLUE_TERM,
                fill_opacity=0.92,
                stroke_color=WHITE,
                stroke_width=2,
            ).move_to(left_center())
        )
        right_rect = always_redraw(
            lambda: Rectangle(
                width=b_width,
                height=height,
                fill_color=RED_TERM,
                fill_opacity=0.9,
                stroke_color=WHITE,
                stroke_width=2,
            ).move_to(right_center())
        )
        left_label = always_redraw(lambda: txt(f"{int(round(x_part.get_value()))}x", 28).move_to(left_center()))
        right_label = always_redraw(lambda: txt("4", 30).move_to(right_center()))
        top_total = always_redraw(
            lambda: dim_line(
                np.array([-total_width() / 2, y0 + height / 2 + 0.65, 0]),
                np.array([total_width() / 2, y0 + height / 2 + 0.65, 0]),
                f"{int(round(x_part.get_value()))}x + 4",
                GREY_A,
            )
        )
        top_left = always_redraw(
            lambda: dim_line(
                np.array([-total_width() / 2, y0 + height / 2 + 0.2, 0]),
                np.array([-total_width() / 2 + left_width(), y0 + height / 2 + 0.2, 0]),
                f"{int(round(x_part.get_value()))}x",
                BLUE_TERM,
                DOWN * 0.05,
            )
        )
        top_right = always_redraw(
            lambda: dim_line(
                np.array([-total_width() / 2 + left_width(), y0 + height / 2 + 0.2, 0]),
                np.array([total_width() / 2, y0 + height / 2 + 0.2, 0]),
                "4",
                RED_TERM,
                DOWN * 0.05,
            )
        )
        side = always_redraw(
            lambda: v_dim_line(
                np.array([-total_width() / 2 - 0.42, y0 - height / 2, 0]),
                np.array([-total_width() / 2 - 0.42, y0 + height / 2, 0]),
                "3",
                GREEN_TERM,
            )
        )

        question = txt("On cherche l'aire : 3(3x + 4)", 28, ORANGE_TERM).to_edge(DOWN)
        variable_note = txt("La séparation bouge quand la partie ax change.", 24).next_to(question, UP, buff=0.25)

        self.play(Write(heading))
        self.play(Create(left_rect), Create(right_rect), Write(left_label), Write(right_label))
        self.play(Create(top_total), Create(top_left), Create(top_right), Create(side), Write(question))
        self.play(Write(variable_note))
        self.play(x_part.animate.set_value(4), run_time=0.7)
        self.play(x_part.animate.set_value(5), run_time=0.7)
        self.play(x_part.animate.set_value(6), run_time=0.7)
        self.play(x_part.animate.set_value(3), run_time=0.8)
        self.play(FadeOut(variable_note))

        static_left = Rectangle(width=3 * unit, height=height, fill_color=BLUE_TERM, fill_opacity=0.92, stroke_color=WHITE, stroke_width=2).move_to(left_center())
        static_right = Rectangle(width=b_width, height=height, fill_color=RED_TERM, fill_opacity=0.9, stroke_color=WHITE, stroke_width=2).move_to(right_center())
        static_left_label = txt("3 · 3x", 26).move_to(static_left.get_center() + UP * 0.25)
        static_left_result = txt("9x", 38).move_to(static_left.get_center() + DOWN * 0.28)
        static_right_label = txt("3 · 4", 26).move_to(static_right.get_center() + UP * 0.25)
        static_right_result = txt("12", 38).move_to(static_right.get_center() + DOWN * 0.28)
        static_dims = VGroup(
            dim_line(static_left.get_corner(UL) + UP * 0.22, static_left.get_corner(UR) + UP * 0.22, "3x", BLUE_TERM, DOWN * 0.04),
            dim_line(static_right.get_corner(UL) + UP * 0.22, static_right.get_corner(UR) + UP * 0.22, "4", RED_TERM, DOWN * 0.04),
            v_dim_line(static_left.get_corner(DL) + LEFT * 0.35, static_left.get_corner(UL) + LEFT * 0.35, "3", GREEN_TERM),
        )
        pieces = VGroup(static_left, static_right, static_left_label, static_left_result, static_right_label, static_right_result, static_dims)

        self.play(
            FadeOut(VGroup(left_rect, right_rect, left_label, right_label, top_total, top_left, top_right, side)),
            FadeIn(pieces),
        )
        self.play(
            static_left.animate.shift(LEFT * 0.45),
            static_left_label.animate.shift(LEFT * 0.45),
            static_left_result.animate.shift(LEFT * 0.45),
            static_right.animate.shift(RIGHT * 0.45),
            static_right_label.animate.shift(RIGHT * 0.45),
            static_right_result.animate.shift(RIGHT * 0.45),
            FadeOut(static_dims),
        )

        calc_left = txt("Aire bleue = 3 · 3x = 9x", 24, BLUE_TERM)
        calc_right = txt("Aire rouge = 3 · 4 = 12", 24, RED_TERM)
        final = txt("Donc 3(3x + 4) = 9x + 12", 30, GREEN_TERM)
        final_block = VGroup(calc_left, calc_right, final).arrange(DOWN, buff=0.16).move_to(DOWN * 2.05)
        self.play(Transform(question, calc_left))
        self.play(Write(calc_right))
        self.play(Write(final))
        self.wait(1.5)

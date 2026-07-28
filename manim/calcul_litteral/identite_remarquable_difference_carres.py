from manim import *

from algebra_scene_utils import BACKGROUND_COLOR, BLUE_TERM, GREEN_TERM, ORANGE_TERM, TEXT_COLOR, title


CUT_TERM = "#6f5cc2"
RESULT_TERM = GREEN_C


def txt(content, size=28, color=TEXT_COLOR):
    return Text(content, color=color, font_size=size, weight=BOLD)


def h_dim(start, end, label, color, above=True):
    line = Line(start, end, color=color, stroke_width=4)
    tick_a = Line(start + DOWN * 0.08, start + UP * 0.08, color=color, stroke_width=4)
    tick_b = Line(end + DOWN * 0.08, end + UP * 0.08, color=color, stroke_width=4)
    label_mob = txt(label, 20, color).next_to(line, UP if above else DOWN, buff=0.08)
    return VGroup(line, tick_a, tick_b, label_mob)


def v_dim(start, end, label, color, left_side=True):
    line = Line(start, end, color=color, stroke_width=4)
    tick_a = Line(start + LEFT * 0.08, start + RIGHT * 0.08, color=color, stroke_width=4)
    tick_b = Line(end + LEFT * 0.08, end + RIGHT * 0.08, color=color, stroke_width=4)
    label_mob = txt(label, 20, color).rotate(PI / 2).next_to(line, LEFT if left_side else RIGHT, buff=0.08)
    return VGroup(line, tick_a, tick_b, label_mob)


def area_rect(width, height, color, center, label, opacity=0.86, label_size=27):
    rect = Rectangle(
        width=width,
        height=height,
        fill_color=color,
        fill_opacity=opacity,
        stroke_color=WHITE,
        stroke_width=2.5,
    ).move_to(center)
    label_mob = txt(label, label_size).move_to(rect)
    return VGroup(rect, label_mob)


class IdentiteRemarquableDifferenceCarres(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        heading = title("Différence de deux carrés")

        a = 3.75
        b = 1.15
        c = a - b
        left = -a / 2 - 0.75
        top = 1.7
        right = left + a
        bottom = top - a
        split_x = left + c
        split_y = bottom + b

        outer = Square(side_length=a, color=WHITE, stroke_width=4).move_to([left + a / 2, top - a / 2, 0])
        full_a = Square(side_length=a, stroke_color=BLUE_TERM, fill_color=BLUE_TERM, fill_opacity=0.12, stroke_width=3).move_to(outer)
        full_label = txt("a²", 36).move_to(outer)
        removed = area_rect(b, b, ORANGE_TERM, [split_x + b / 2, bottom + b / 2, 0], "b²", 0.92)
        top_piece = area_rect(a, c, RESULT_TERM, [left + a / 2, top - c / 2, 0], "a · (a - b)", 0.78, 28)
        bottom_piece = area_rect(c, b, CUT_TERM, [left + c / 2, bottom + b / 2, 0], "b · (a - b)", 0.82, 23)
        cut_lines = VGroup(
            Line([left, split_y, 0], [right, split_y, 0], color=GREY_B, stroke_width=2),
            Line([split_x, split_y, 0], [split_x, bottom, 0], color=GREY_B, stroke_width=2),
        )
        initial_dims = VGroup(
            h_dim([left, top + 0.42, 0], [right, top + 0.42, 0], "a", BLUE_TERM),
            v_dim([left - 0.42, bottom, 0], [left - 0.42, top, 0], "a", BLUE_TERM),
            h_dim([split_x, bottom - 0.28, 0], [right, bottom - 0.28, 0], "b", ORANGE_TERM, above=False),
            v_dim([right + 0.34, bottom, 0], [right + 0.34, split_y, 0], "b", ORANGE_TERM, left_side=False),
            h_dim([left, bottom - 0.65, 0], [split_x, bottom - 0.65, 0], "a - b", RESULT_TERM, above=False),
            v_dim([right + 0.68, split_y, 0], [right + 0.68, top, 0], "a - b", RESULT_TERM, left_side=False),
        )

        intro = txt("On cherche l'aire a² - b².", 27).to_edge(DOWN, buff=0.45)
        remove_note = txt("On enlève le carré b² du carré a².", 26, ORANGE_TERM).to_edge(DOWN, buff=0.45)
        pieces_note = txt("Il reste deux morceaux, tous les deux avec une longueur a - b.", 24, RESULT_TERM).to_edge(DOWN, buff=0.45)

        self.play(Write(heading))
        self.play(Create(outer), FadeIn(full_a), Write(full_label), Create(initial_dims[:2]), Write(intro))
        self.play(Transform(intro, remove_note), Create(cut_lines), Create(initial_dims[2:]), FadeIn(removed))
        self.play(FadeOut(full_a), FadeOut(full_label), FadeIn(top_piece), FadeIn(bottom_piece))
        self.play(Transform(intro, pieces_note), Indicate(initial_dims[4], color=RESULT_TERM), Indicate(initial_dims[5], color=RESULT_TERM))

        final_left = -2.75
        final_bottom = -1.0
        final_top = final_bottom + c
        top_target = area_rect(a, c, RESULT_TERM, [final_left + a / 2, final_bottom + c / 2, 0], "a · (a - b)", 0.78, 28)
        rotated_target = area_rect(b, c, CUT_TERM, [final_left + a + b / 2, final_bottom + c / 2, 0], "b · (a - b)", 0.82, 25)
        final_outline = Rectangle(width=a + b, height=c, color=WHITE, stroke_width=4).move_to([final_left + (a + b) / 2, final_bottom + c / 2, 0])
        final_dims = VGroup(
            h_dim([final_left, final_top + 0.38, 0], [final_left + a, final_top + 0.38, 0], "a", BLUE_TERM),
            h_dim([final_left + a, final_top + 0.38, 0], [final_left + a + b, final_top + 0.38, 0], "b", ORANGE_TERM),
            h_dim([final_left, final_top + 0.78, 0], [final_left + a + b, final_top + 0.78, 0], "a + b", GREEN_TERM),
            v_dim([final_left - 0.42, final_bottom, 0], [final_left - 0.42, final_top, 0], "a - b", GREEN_TERM),
        )

        move_note = txt("On tourne le morceau violet : sa forme et son aire ne changent pas.", 24, CUT_TERM).to_edge(DOWN, buff=0.45)
        slide_note = txt("Puis on le déplace pour compléter le rectangle.", 25, CUT_TERM).to_edge(DOWN, buff=0.45)
        rectangle_note = txt("Les deux morceaux forment un rectangle de côtés a - b et a + b.", 24, RESULT_TERM).to_edge(DOWN, buff=0.45)

        self.play(
            FadeOut(outer),
            FadeOut(removed),
            FadeOut(cut_lines),
            FadeOut(initial_dims),
            Transform(intro, move_note),
        )
        self.play(Transform(top_piece, top_target), run_time=0.9)
        self.play(FadeOut(bottom_piece[1]), run_time=0.25)
        self.play(bottom_piece[0].animate.rotate(PI / 2), run_time=0.95)
        self.play(FadeOut(intro), run_time=0.2)
        self.play(FadeIn(slide_note), bottom_piece[0].animate.move_to(rotated_target[0].get_center()), run_time=0.95)
        intro = slide_note
        self.play(FadeIn(rotated_target[1]), run_time=0.35)
        self.play(Create(final_outline), Create(final_dims), Transform(intro, rectangle_note))

        formula1 = txt("a² - b² = a · (a - b) + b · (a - b)", 27).move_to(DOWN * 2.8)
        formula2 = txt("a² - b² = (a - b)(a + b)", 34, GREEN_TERM).move_to(DOWN * 2.8)
        self.play(FadeOut(intro))
        self.play(Write(formula1))
        self.play(ReplacementTransform(formula1, formula2))
        self.wait(1.5)

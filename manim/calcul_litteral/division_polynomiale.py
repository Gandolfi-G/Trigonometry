from manim import *

from algebra_scene_utils import BACKGROUND_COLOR, BLUE_TERM, GREEN_TERM, ORANGE_TERM, TEXT_COLOR, title


RED_TERM = RED_C
PURPLE_TERM = "#6f5cc2"


def txt(content, size=30, color=TEXT_COLOR):
    return Text(content, color=color, font_size=size, weight=BOLD)


def term_group(parts, size=30):
    group = VGroup()
    for content, color in parts:
        group.add(txt(content, size, color))
    group.arrange(RIGHT, buff=0.08)
    return group


def underline(mob, y_shift=-0.18):
    return Line(
        mob.get_left() + DOWN * y_shift,
        mob.get_right() + DOWN * y_shift,
        color=TEXT_COLOR,
        stroke_width=3,
    )


class DivisionPolynomiale(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        heading = title("Division polynomiale")

        bar_x = 1.08
        top_y = 1.35
        dividend_y = 0.85

        vertical_bar = Line([bar_x, top_y + 0.25, 0], [bar_x, -1.65, 0], color=TEXT_COLOR, stroke_width=4)
        horizontal_bar = Line([bar_x, top_y - 0.25, 0], [3.35, top_y - 0.25, 0], color=TEXT_COLOR, stroke_width=4)

        dividend = term_group([("x²", BLUE_TERM), ("+", TEXT_COLOR), ("5x", ORANGE_TERM), ("+", TEXT_COLOR), ("6", TEXT_COLOR)], 31)
        dividend.next_to(vertical_bar, LEFT, buff=0.22).shift(UP * (dividend_y - dividend.get_y()))
        divisor = term_group([("x", BLUE_TERM), ("+", TEXT_COLOR), ("2", TEXT_COLOR)], 31)
        divisor.move_to([2.0, top_y, 0])
        quotient_x = txt("x", 31, BLUE_TERM).move_to([1.55, 0.72, 0])
        quotient_full = term_group([("x", BLUE_TERM), ("+", TEXT_COLOR), ("3", ORANGE_TERM)], 31).move_to([1.83, 0.72, 0])

        note = txt("On pose x² + 5x + 6 divisé par x + 2.", 25).to_edge(DOWN, buff=0.42)

        self.play(Write(heading))
        self.play(Create(vertical_bar), Create(horizontal_bar), Write(dividend), Write(divisor), Write(note))

        first_focus = VGroup(
            SurroundingRectangle(dividend[0], color=BLUE_TERM, buff=0.08),
            SurroundingRectangle(divisor[0], color=BLUE_TERM, buff=0.08),
        )
        choose_x = txt("Pour obtenir x² avec x, on prend x car x · x = x².", 24, BLUE_TERM).to_edge(DOWN, buff=0.42)
        self.play(FadeOut(note), FadeIn(choose_x), Create(first_focus))
        note = choose_x
        self.play(Write(quotient_x))
        self.wait(0.25)

        product1 = term_group([("- (", RED_TERM), ("x²", RED_TERM), ("+", RED_TERM), ("2x", RED_TERM), (")", RED_TERM)], 29)
        product1.next_to(vertical_bar, LEFT, buff=0.25).shift(DOWN * 0.18)
        line1_y = product1.get_bottom()[1] - 0.16
        line1 = Line(
            [product1.get_left()[0], line1_y, 0],
            [dividend.get_right()[0] + 0.04, line1_y, 0],
            color=TEXT_COLOR,
            stroke_width=3,
        )
        product_note = txt("On calcule x · (x + 2) = x² + 2x, puis on soustrait.", 24, PURPLE_TERM).to_edge(DOWN, buff=0.42)
        self.play(FadeOut(first_focus), FadeOut(note), FadeIn(product_note))
        note = product_note
        self.play(Write(product1), Create(line1))

        remainder1 = term_group([("3x", ORANGE_TERM), ("+", TEXT_COLOR), ("6", TEXT_COLOR)], 31)
        remainder1.next_to(vertical_bar, LEFT, buff=0.25).shift(DOWN * 0.78)
        rem_note = txt("Il reste 3x + 6.", 25, ORANGE_TERM).to_edge(DOWN, buff=0.42)
        self.play(FadeOut(note), FadeIn(rem_note), Write(remainder1))
        note = rem_note

        second_focus = VGroup(
            SurroundingRectangle(remainder1[0], color=ORANGE_TERM, buff=0.08),
            SurroundingRectangle(divisor[0], color=BLUE_TERM, buff=0.08),
        )
        choose_3 = txt("Pour obtenir 3x avec x, on prend 3 car 3 · x = 3x.", 24, ORANGE_TERM).to_edge(DOWN, buff=0.42)
        self.play(FadeOut(note), FadeIn(choose_3), Create(second_focus))
        note = choose_3
        self.play(FadeOut(quotient_x), FadeIn(quotient_full))
        self.wait(0.25)

        product2 = term_group([("- (", RED_TERM), ("3x", RED_TERM), ("+", RED_TERM), ("6", RED_TERM), (")", RED_TERM)], 29)
        product2.next_to(vertical_bar, LEFT, buff=0.25).shift(DOWN * 1.33)
        line2_y = product2.get_bottom()[1] - 0.16
        line2 = Line(
            [product2.get_left()[0], line2_y, 0],
            [remainder1.get_right()[0] + 0.04, line2_y, 0],
            color=TEXT_COLOR,
            stroke_width=3,
        )
        product2_note = txt("On calcule 3 · (x + 2) = 3x + 6, puis on soustrait.", 24, PURPLE_TERM).to_edge(DOWN, buff=0.42)
        self.play(FadeOut(second_focus), FadeOut(note), FadeIn(product2_note))
        note = product2_note
        self.play(Write(product2), Create(line2))

        remainder0 = txt("0", 34, GREEN_TERM)
        remainder0.next_to(vertical_bar, LEFT, buff=0.82).shift(DOWN * 1.9)
        done_note = txt("Le reste vaut 0.", 26, GREEN_TERM).to_edge(DOWN, buff=0.42)
        self.play(FadeOut(note), FadeIn(done_note), Write(remainder0))
        note = done_note

        conclusion = txt("x² + 5x + 6 = (x + 2) · (x + 3)", 31, GREEN_TERM).to_edge(DOWN, buff=0.42)
        self.play(FadeOut(note), FadeIn(conclusion))
        self.wait(1.5)

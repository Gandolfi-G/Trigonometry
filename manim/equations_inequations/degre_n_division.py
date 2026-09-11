from manim import *

from equations_scene_utils import (
    BACKGROUND_COLOR,
    BLUE_TERM,
    GREEN_TERM,
    ORANGE_TERM,
    RED_TERM,
    TEXT_COLOR,
    YELLOW_TERM,
    expression,
    title,
)


PURPLE_TERM = "#6f5cc2"
SOFT_PANEL = "#17212f"
WAIT = 0.56


def small_text(content, size=23, color=TEXT_COLOR):
    return Text(content, color=color, font_size=size, weight=BOLD)


def pill(content, color, width=None):
    label = small_text(content, 22, WHITE)
    box = RoundedRectangle(
        corner_radius=0.16,
        width=width or label.width + 0.54,
        height=0.52,
        color=color,
        fill_color=color,
        fill_opacity=0.92,
        stroke_color=WHITE,
        stroke_width=1.5,
    )
    label.move_to(box)
    return VGroup(box, label)


def chain_piece(content, color, width=None):
    return pill(content, color, width=width)


def method_card(number, heading, detail, color):
    badge = Circle(radius=0.23, color=color, fill_color=color, fill_opacity=1)
    badge_text = small_text(str(number), 18, WHITE).move_to(badge)
    top = small_text(heading, 20, color)
    bottom = Text(detail, color=GREY_A, font_size=16, weight=BOLD)
    copy = VGroup(top, bottom).arrange(DOWN, aligned_edge=LEFT, buff=0.07)
    card = RoundedRectangle(
        corner_radius=0.14,
        width=3.78,
        height=1.08,
        color=color,
        fill_color=SOFT_PANEL,
        fill_opacity=0.86,
        stroke_width=2,
    )
    content = VGroup(VGroup(badge, badge_text), copy).arrange(RIGHT, buff=0.18).move_to(card)
    return VGroup(card, content)


class DegreNDivision(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        heading = title("Degré n : racines et division")

        self.play(Write(heading), run_time=0.9)
        self.wait(WAIT)
        self.show_recipe(heading)
        self.show_example(heading)
        self.wait(1.4)

    def show_recipe(self, heading):
        recipe_title = expression("La recette", 34, YELLOW_TERM).next_to(heading, DOWN, buff=0.34)
        note = Text(
            "Une racine fait descendre le degré.",
            color=GREY_A,
            font_size=20,
            weight=BOLD,
        ).next_to(recipe_title, DOWN, buff=0.18)

        layers = self.nested_layers().to_edge(LEFT, buff=0.7).shift(DOWN * 0.38)
        cards = VGroup(
            method_card(1, "Trouver c", "P(c) = 0", GREEN_TERM),
            method_card(2, "Sortir x - c", "P = (x - c)Q", ORANGE_TERM),
            method_card(3, "Diviser P", "par x - c", BLUE_TERM),
            method_card(4, "Recommencer", "avec Q", PURPLE_TERM),
        ).arrange(DOWN, buff=0.18).to_edge(RIGHT, buff=0.35).shift(DOWN * 0.46)

        arrow = Arrow(layers.get_right() + RIGHT * 0.18, cards.get_left() + LEFT * 0.15, buff=0.1, color=GREY_B, stroke_width=4)
        p_term = chain_piece("P(x)", BLUE_TERM)
        equal = small_text("=", 26)
        first_factor = chain_piece("x - c₁", GREEN_TERM)
        q1 = chain_piece("Q₁(x)", ORANGE_TERM)
        factor_chain = VGroup(p_term, equal, first_factor, q1).arrange(RIGHT, buff=0.13).to_edge(DOWN, buff=0.55)

        second_factor = chain_piece("x - c₂", PURPLE_TERM)
        q2 = chain_piece("Q₂(x)", ORANGE_TERM)
        expanded_q1 = VGroup(second_factor, q2).arrange(RIGHT, buff=0.13).next_to(first_factor, RIGHT, buff=0.13)

        dots = small_text("⋯", 28, GREY_A)
        final_quotient = chain_piece("quotient final", ORANGE_TERM, width=2.65)
        expanded_q2 = VGroup(dots, final_quotient).arrange(RIGHT, buff=0.13).next_to(second_factor, RIGHT, buff=0.13)
        q1_hint = small_text("On factorise Q₁(x).", 19, GREY_A).next_to(factor_chain, UP, buff=0.2)
        q2_hint = small_text("Puis on continue avec Q₂.", 19, GREY_A).move_to(q1_hint)

        self.play(Write(recipe_title), FadeIn(note, shift=UP * 0.12), run_time=1.0)
        self.wait(WAIT)
        self.play(FadeIn(layers, scale=0.96), GrowArrow(arrow), run_time=1.0)
        self.wait(WAIT)
        for card in cards:
            self.play(FadeIn(card, shift=LEFT * 0.18), run_time=0.68)
            self.wait(WAIT)
        self.play(FadeIn(factor_chain, shift=UP * 0.12), run_time=0.8)
        self.wait(WAIT)
        self.play(FadeIn(q1_hint, shift=UP * 0.08), run_time=0.45)
        self.play(ReplacementTransform(q1, expanded_q1), run_time=1.05)
        factor_chain = VGroup(p_term, equal, first_factor, expanded_q1)
        self.wait(WAIT)
        self.play(ReplacementTransform(q1_hint, q2_hint), run_time=0.45)
        self.play(ReplacementTransform(q2, expanded_q2), run_time=1.05)
        factor_chain = VGroup(p_term, equal, first_factor, second_factor, expanded_q2)
        self.wait(WAIT * 1.3)
        self.play(
            FadeOut(VGroup(recipe_title, note, layers, cards, arrow, factor_chain, q2_hint), shift=DOWN * 0.2),
            run_time=0.85,
        )

    def nested_layers(self):
        outer = RoundedRectangle(
            corner_radius=0.22,
            width=3.7,
            height=3.05,
            color=BLUE_TERM,
            fill_color="#173446",
            fill_opacity=0.72,
            stroke_width=4,
        )
        middle = RoundedRectangle(
            corner_radius=0.18,
            width=2.85,
            height=2.25,
            color=ORANGE_TERM,
            fill_color="#3f2a1c",
            fill_opacity=0.72,
            stroke_width=4,
        )
        inner = RoundedRectangle(
            corner_radius=0.15,
            width=2.0,
            height=1.45,
            color=GREEN_TERM,
            fill_color="#173424",
            fill_opacity=0.78,
            stroke_width=4,
        )
        core = RoundedRectangle(
            corner_radius=0.12,
            width=1.12,
            height=0.72,
            color=YELLOW_TERM,
            fill_color="#463f1a",
            fill_opacity=0.88,
            stroke_width=3,
        )
        labels = VGroup(
            small_text("P degré n", 22, BLUE_TERM).move_to(outer.get_top() + DOWN * 0.18),
            small_text("Q₁ degré n-1", 20, ORANGE_TERM).move_to(middle.get_top() + DOWN * 0.18),
            small_text("Q₂", 20, GREEN_TERM).move_to(inner.get_top() + DOWN * 0.16),
            small_text("fin", 18, YELLOW_TERM).move_to(core),
        )
        return VGroup(outer, middle, inner, core, labels)

    def show_example(self, heading):
        example_title = expression("Exemple", 34, YELLOW_TERM).next_to(heading, DOWN, buff=0.34)
        polynomial = expression("P(x) = x³ - 5x² + 2x + 8", 31, TEXT_COLOR).next_to(example_title, DOWN, buff=0.24)
        test = expression("P(2) = 0", 32, GREEN_TERM).next_to(polynomial, DOWN, buff=0.28)
        factor = VGroup(
            small_text("donc", 25, GREY_A),
            pill("x - 2", GREEN_TERM),
            small_text("est un facteur", 25, GREY_A),
        ).arrange(RIGHT, buff=0.16).next_to(test, DOWN, buff=0.24)

        division = self.division_visual()
        division["group"].scale(0.92).next_to(factor, DOWN, buff=0.18)

        self.play(Write(example_title), Write(polynomial), run_time=1.05)
        self.wait(WAIT)
        self.play(Write(test), run_time=0.8)
        self.wait(WAIT)
        self.play(FadeIn(factor, shift=UP * 0.12), run_time=0.8)
        self.wait(WAIT)

        self.play(FadeIn(division["base"], shift=UP * 0.12), run_time=0.9)
        self.wait(WAIT)

        active_hint = None
        for step in division["steps"]:
            if active_hint is not None:
                self.play(FadeOut(active_hint, shift=DOWN * 0.08), run_time=0.35)
            active_hint = step["hint"]
            self.play(FadeIn(active_hint, shift=UP * 0.08), run_time=0.5)
            self.wait(WAIT)
            self.play(FadeIn(step["quotient"], shift=DOWN * 0.08), run_time=0.6)
            self.wait(WAIT)
            self.play(FadeIn(step["product"], shift=UP * 0.08), run_time=0.6)
            self.wait(WAIT)
            self.play(Create(step["line"]), run_time=0.35)
            self.play(FadeIn(step["remainder"], shift=UP * 0.08), run_time=0.6)
            self.wait(WAIT)

        if active_hint is not None:
            self.play(FadeOut(active_hint, shift=DOWN * 0.08), run_time=0.35)

        equation = expression("P(x) = (x - 2)(x² - 3x - 4)", 30, BLUE_TERM).next_to(example_title, DOWN, buff=0.5)
        self.play(
            FadeOut(VGroup(polynomial, test, factor, division["group"]), shift=DOWN * 0.16),
            FadeIn(equation, shift=UP * 0.12),
            run_time=0.9,
        )
        self.wait(WAIT)

        quotient_focus = self.quotient_focus().next_to(equation, DOWN, buff=0.34)
        self.play(FadeIn(quotient_focus, shift=UP * 0.15), run_time=0.95)
        self.wait(WAIT)

        final_factorization = expression("P(x) = (x - 2)(x - 4)(x + 1)", 29, GREEN_TERM).move_to(quotient_focus)
        solutions = expression("S = {-1 ; 2 ; 4}", 36, GREEN_TERM).next_to(final_factorization, DOWN, buff=0.24)
        self.play(Transform(quotient_focus, final_factorization), run_time=0.9)
        self.wait(WAIT)
        self.play(Write(solutions), run_time=0.85)

    def division_visual(self):
        panel = RoundedRectangle(
            corner_radius=0.14,
            width=10.8,
            height=3.08,
            color=GREY_B,
            fill_color=SOFT_PANEL,
            fill_opacity=0.42,
            stroke_width=1.5,
        )

        y0 = 0.92
        left_x = -3.3
        bar_x = 1.45
        top_y = 1.1
        bottom_y = -1.74
        dividend = expression("x³  -  5x²  +  2x  +  8", 24, BLUE_TERM).move_to([left_x, y0, 0])
        divisor = expression("x - 2", 24, GREEN_TERM).move_to([bar_x + 1.55, y0, 0])
        vertical = Line([bar_x, top_y, 0], [bar_x, bottom_y, 0], color=GREY_A, stroke_width=4)
        horizontal = Line([bar_x, y0 - 0.32, 0], [bar_x + 3.9, y0 - 0.32, 0], color=GREY_A, stroke_width=4)

        q1 = expression("x²", 23, ORANGE_TERM).move_to([bar_x + 0.72, y0 - 0.74, 0])
        q2 = expression("- 3x", 23, ORANGE_TERM).next_to(q1, RIGHT, buff=0.22)
        q3 = expression("- 4", 23, ORANGE_TERM).next_to(q2, RIGHT, buff=0.22)

        product1 = expression("-(x³  -  2x²)", 22, RED_TERM).move_to([left_x - 0.34, 0.34, 0])
        line1 = Line([left_x - 1.25, 0.12, 0], [left_x + 1.75, 0.12, 0], color=GREY_B, stroke_width=2.2)
        remainder1 = expression("-3x²  +  2x", 22, YELLOW_TERM).move_to([left_x - 0.08, -0.12, 0])

        product2 = expression("-(-3x²  +  6x)", 22, RED_TERM).move_to([left_x + 0.18, -0.54, 0])
        line2 = Line([left_x - 0.75, -0.75, 0], [left_x + 2.0, -0.75, 0], color=GREY_B, stroke_width=2.2)
        remainder2 = expression("-4x  +  8", 22, YELLOW_TERM).move_to([left_x + 0.55, -1.0, 0])

        product3 = expression("-(-4x  +  8)", 22, RED_TERM).move_to([left_x + 0.54, -1.32, 0])
        line3 = Line([left_x - 0.3, -1.5, 0], [left_x + 1.6, -1.5, 0], color=GREY_B, stroke_width=2.2)
        remainder3 = expression("0", 25, GREEN_TERM).move_to([left_x + 0.98, -1.72, 0])

        hints = [
            Text("Pour obtenir x³, on prend x² : x² · x = x³.", color=GREY_A, font_size=19, weight=BOLD),
            Text("Pour obtenir -3x², on prend -3x : -3x · x = -3x².", color=GREY_A, font_size=19, weight=BOLD),
            Text("Pour obtenir -4x, on prend -4 : -4 · x = -4x.", color=GREY_A, font_size=19, weight=BOLD),
        ]
        for hint in hints:
            hint.next_to(panel, UP, buff=0.1)

        base = VGroup(panel, dividend, divisor, vertical, horizontal)
        all_group = VGroup(
            base,
            q1,
            q2,
            q3,
            product1,
            line1,
            remainder1,
            product2,
            line2,
            remainder2,
            product3,
            line3,
            remainder3,
            *hints,
        )
        all_group.steps = [
            {"hint": hints[0], "quotient": q1, "product": product1, "line": line1, "remainder": remainder1},
            {"hint": hints[1], "quotient": q2, "product": product2, "line": line2, "remainder": remainder2},
            {"hint": hints[2], "quotient": q3, "product": product3, "line": line3, "remainder": remainder3},
        ]
        all_group.base = base
        return {"base": base, "steps": all_group.steps, "group": all_group}

    def quotient_focus(self):
        text = expression("On recommence avec Q(x) = x² - 3x - 4", 21, ORANGE_TERM)
        frame = RoundedRectangle(
            corner_radius=0.15,
            width=text.width + 0.55,
            height=0.72,
            color=ORANGE_TERM,
            fill_color="#3f2a1c",
            fill_opacity=0.48,
            stroke_width=2.5,
        )
        text.move_to(frame)
        roots = VGroup(
            pill("Q(4) = 0", GREEN_TERM, width=1.3),
            pill("Q(-1) = 0", GREEN_TERM, width=1.42),
        ).arrange(RIGHT, buff=0.18).next_to(frame, DOWN, buff=0.18)
        factors = expression("Q(x) = (x - 4)(x + 1)", 24, GREEN_TERM).next_to(roots, DOWN, buff=0.14)
        return VGroup(frame, text, roots, factors)

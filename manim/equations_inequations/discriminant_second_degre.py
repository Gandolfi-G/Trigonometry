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


CASE_BLUE = "#176b87"
SOFT_BLUE = "#233949"
SOFT_ORANGE = "#4b3527"


class DiscriminantSecondDegre(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        heading = title("Discriminant du second degré")
        formula = expression("ax² + bx + c = 0     Δ = b² - 4ac", 30, TEXT_COLOR).next_to(heading, DOWN, buff=0.26)

        ax = Axes(
            x_range=(-3, 3, 1),
            y_range=(-2.2, 2.2, 1),
            x_length=6.45,
            y_length=4.25,
            axis_config={"color": GREY_B, "stroke_width": 3, "include_tip": True},
            tips=True,
        ).to_edge(LEFT, buff=0.55).shift(DOWN * 0.18)
        x_label = Text("x", color=GREY_B, font_size=22, weight=BOLD).next_to(ax.x_axis.get_end(), DOWN, buff=0.08)
        y_label = Text("y", color=GREY_B, font_size=22, weight=BOLD).next_to(ax.y_axis.get_end(), RIGHT, buff=0.08)
        axis_labels = VGroup(x_label, y_label)

        cases = [
            {
                "family": "a > 0",
                "delta": "Δ > 0",
                "name": "2 solutions réelles",
                "short": "2 intersections",
                "color": GREEN_TERM,
                "function": lambda x: 0.52 * (x * x - 2.25),
                "roots": [-1.5, 1.5],
                "side": "convexe",
            },
            {
                "family": "a > 0",
                "delta": "Δ = 0",
                "name": "1 solution double",
                "short": "tangence",
                "color": ORANGE_TERM,
                "function": lambda x: 0.52 * x * x,
                "roots": [0],
                "side": "convexe",
            },
            {
                "family": "a > 0",
                "delta": "Δ < 0",
                "name": "aucune solution réelle",
                "short": "aucune intersection",
                "color": RED_TERM,
                "function": lambda x: 0.52 * x * x + 0.72,
                "roots": [],
                "side": "convexe",
            },
            {
                "family": "a < 0",
                "delta": "Δ > 0",
                "name": "2 solutions réelles",
                "short": "2 intersections",
                "color": GREEN_TERM,
                "function": lambda x: -0.52 * (x * x - 2.25),
                "roots": [-1.5, 1.5],
                "side": "concave",
            },
            {
                "family": "a < 0",
                "delta": "Δ = 0",
                "name": "1 solution double",
                "short": "tangence",
                "color": ORANGE_TERM,
                "function": lambda x: -0.52 * x * x,
                "roots": [0],
                "side": "concave",
            },
            {
                "family": "a < 0",
                "delta": "Δ < 0",
                "name": "aucune solution réelle",
                "short": "aucune intersection",
                "color": RED_TERM,
                "function": lambda x: -0.52 * x * x - 0.72,
                "roots": [],
                "side": "concave",
            },
        ]

        case_cards = self.case_list(cases).to_edge(RIGHT, buff=0.55).shift(DOWN * 0.1)
        highlight = self.card_highlight(case_cards[0], cases[0]["color"])
        current_label = self.case_label(cases[0]).next_to(formula, DOWN, buff=0.22).align_to(ax, LEFT)
        x_axis_glow = ax.x_axis.copy().set_color(GREY_A).set_stroke(width=5, opacity=0.34)

        curve = self.curve_for(ax, cases[0])
        roots = self.roots_for(ax, cases[0])

        self.play(Write(heading), Write(formula), run_time=1.0)
        self.play(Create(ax), FadeIn(axis_labels), FadeIn(x_axis_glow), run_time=1.2)
        self.play(FadeIn(case_cards, shift=LEFT * 0.2), FadeIn(highlight), run_time=1.0)
        self.play(Write(current_label), Create(curve), FadeIn(roots), run_time=1.25)
        self.wait(0.55)

        for index, case in enumerate(cases[1:], start=1):
            next_curve = self.curve_for(ax, case)
            next_roots = self.roots_for(ax, case)
            next_label = self.case_label(case).move_to(current_label)
            next_highlight = self.card_highlight(case_cards[index], case["color"])

            self.play(
                Transform(curve, next_curve),
                Transform(current_label, next_label),
                Transform(highlight, next_highlight),
                FadeOut(roots, shift=DOWN * 0.08),
                FadeIn(next_roots, shift=DOWN * 0.08),
                run_time=1.25,
                rate_func=smooth,
            )
            roots = next_roots
            self.wait(0.32)

        recap = self.recap_grid(cases)
        self.play(
            FadeOut(VGroup(heading, formula, ax, axis_labels, x_axis_glow, curve, roots, current_label, case_cards, highlight), shift=DOWN * 0.2),
            run_time=0.75,
        )
        self.play(FadeIn(recap, shift=UP * 0.18), run_time=1.15)
        self.wait(2.0)

    def curve_for(self, ax, case):
        color = CASE_BLUE if case["family"] == "a > 0" else ORANGE_TERM
        return ax.plot(case["function"], x_range=[-2.55, 2.55], color=color, stroke_width=6)

    def roots_for(self, ax, case):
        if not case["roots"]:
            return VGroup()
        dots = VGroup(*[
            Dot(ax.c2p(root, 0), radius=0.075, color=case["color"])
            for root in case["roots"]
        ])
        rings = VGroup(*[
            Circle(radius=0.14, color=case["color"], stroke_width=3).move_to(ax.c2p(root, 0))
            for root in case["roots"]
        ])
        return VGroup(dots, rings)

    def case_label(self, case):
        family = Text(case["family"], color=TEXT_COLOR, font_size=28, weight=BOLD)
        delta = Text(case["delta"], color=case["color"], font_size=28, weight=BOLD)
        line_one = VGroup(family, delta).arrange(RIGHT, buff=0.32)
        line_two = Text(case["name"], color=case["color"], font_size=24, weight=BOLD)
        line_three = Text(case["short"], color=GREY_A, font_size=21, weight=BOLD)
        return VGroup(line_one, line_two, line_three).arrange(DOWN, aligned_edge=LEFT, buff=0.12)

    def case_list(self, cases):
        cards = VGroup()
        for case in cases:
            bg_color = SOFT_BLUE if case["family"] == "a > 0" else SOFT_ORANGE
            box = RoundedRectangle(
                corner_radius=0.12,
                width=3.45,
                height=0.72,
                color=GREY_E,
                fill_color=bg_color,
                fill_opacity=0.56,
                stroke_opacity=0.28,
                stroke_width=1.5,
            )
            top = Text(f"{case['family']} et {case['delta']}", color=TEXT_COLOR, font_size=16, weight=BOLD)
            bottom = Text(case["short"], color=case["color"], font_size=15, weight=BOLD)
            text = VGroup(top, bottom).arrange(DOWN, buff=0.04).move_to(box)
            cards.add(VGroup(box, text))
        return cards.arrange(DOWN, aligned_edge=LEFT, buff=0.13)

    def card_highlight(self, card, color):
        return RoundedRectangle(
            corner_radius=0.14,
            width=card.width + 0.12,
            height=card.height + 0.12,
            color=color,
            fill_color=color,
            fill_opacity=0.12,
            stroke_width=3,
        ).move_to(card)

    def mini_case(self, case):
        card = RoundedRectangle(
            corner_radius=0.12,
            width=3.05,
            height=1.95,
            color=case["color"],
            fill_color=SOFT_BLUE if case["family"] == "a > 0" else SOFT_ORANGE,
            fill_opacity=0.42,
            stroke_width=2,
        )
        sketch_center = card.get_center() + UP * 0.36
        axis = Line(LEFT * 1.0, RIGHT * 1.0, color=GREY_B, stroke_width=3).shift(sketch_center)
        curve = VMobject(color=CASE_BLUE if case["family"] == "a > 0" else ORANGE_TERM, stroke_width=4)
        points = []
        for index in range(33):
            x = -1.1 + index * (2.2 / 32)
            y = case["function"](x * 1.7) * 0.34
            points.append(sketch_center + RIGHT * x + UP * y)
        curve.set_points_smoothly(points)
        sketch = VGroup(axis, curve)
        roots = VGroup(*[
            Dot(sketch_center + RIGHT * (root / 1.7), radius=0.045, color=case["color"])
            for root in case["roots"]
        ])
        solution_text = "2 solutions" if len(case["roots"]) == 2 else "1 solution double" if case["roots"] else "0 solution réelle"
        label = Text(f"{case['family']} et {case['delta']}", color=TEXT_COLOR, font_size=15, weight=BOLD)
        solution = Text(solution_text, color=case["color"], font_size=14, weight=BOLD)
        copy = VGroup(label, solution).arrange(DOWN, buff=0.05).move_to(card.get_center() + DOWN * 0.58)
        return VGroup(card, sketch, roots, copy)

    def recap_grid(self, cases):
        headline = expression("Les 6 possibilités", 34, TEXT_COLOR)
        top = VGroup(*[self.mini_case(case) for case in cases[:3]]).arrange(RIGHT, buff=0.22)
        bottom = VGroup(*[self.mini_case(case) for case in cases[3:]]).arrange(RIGHT, buff=0.22)
        grid = VGroup(top, bottom).arrange(DOWN, buff=0.24)
        return VGroup(headline, grid).arrange(DOWN, buff=0.32).shift(DOWN * 0.15)

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


SOFT_PANEL = "#17212f"
WAIT = 0.8


CASES = [
    {
        "label": "Cas 1 : une solution",
        "equations": ["y = -x + 3", "y = x + 1"],
        "lines": [(-1, 3), (1, 1)],
        "result": "Les droites se coupent en un point.",
        "solution": "S = {(1 ; 2)}",
        "point": (1, 2),
        "color": GREEN_TERM,
    },
    {
        "label": "Cas 2 : aucune solution",
        "equations": ["y = x + 2", "y = x - 1"],
        "lines": [(1, 2), (1, -1)],
        "result": "Les droites sont parallèles.",
        "solution": "S = ∅",
        "point": None,
        "color": RED_TERM,
    },
    {
        "label": "Cas 3 : une droite solution",
        "equations": ["y = x + 1", "2y = 2x + 2"],
        "lines": [(1, 1), (1, 1)],
        "result": "Les droites sont confondues.",
        "solution": "S = la droite entière",
        "point": None,
        "coincident": True,
        "color": YELLOW_TERM,
    },
]


def small_text(content, size=22, color=TEXT_COLOR):
    return Text(content, color=color, font_size=size, weight=BOLD)


def equation_system(equations):
    brace = Text("{", color=TEXT_COLOR, font_size=112, weight=BOLD)
    first = small_text(equations[0], 27, BLUE_TERM)
    second = small_text(equations[1], 27, ORANGE_TERM)
    stack = VGroup(first, second).arrange(DOWN, aligned_edge=LEFT, buff=0.28)
    brace.stretch_to_fit_height(stack.height + 0.42)
    brace.next_to(stack, LEFT, buff=0.12)
    return VGroup(brace, stack)


class SystemesLineaires(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        heading = title("Systèmes linéaires")
        intro = small_text(
            "Deux équations à deux inconnues peuvent se lire comme deux droites.",
            25,
            TEXT_COLOR,
        ).next_to(heading, DOWN, buff=0.38)
        rule = small_text(
            "Résoudre le système, c'est chercher leurs points communs.",
            25,
            GREEN_TERM,
        ).next_to(intro, DOWN, buff=0.18)

        self.play(Write(heading), run_time=0.8)
        self.play(FadeIn(intro, shift=UP * 0.12), FadeIn(rule, shift=UP * 0.12), run_time=0.9)
        self.wait(WAIT)

        current = self.case_scene(CASES[0])
        self.play(FadeOut(VGroup(intro, rule), shift=UP * 0.1), FadeIn(current, shift=UP * 0.12), run_time=1.0)
        self.wait(WAIT * 2.7)

        for case in CASES[1:]:
            next_case = self.case_scene(case)
            self.play(FadeOut(current, shift=LEFT * 0.25), run_time=0.45)
            self.play(FadeIn(next_case, shift=RIGHT * 0.25), run_time=0.75)
            current = next_case
            self.wait(WAIT * 2.7)

        recap = self.recap().next_to(heading, DOWN, buff=0.75)
        self.play(FadeOut(current, shift=DOWN * 0.15), run_time=0.45)
        self.play(FadeIn(recap, shift=UP * 0.18), run_time=0.75)
        self.wait(1.4)

    def case_scene(self, case):
        system = self.system_panel(case)
        graph = self.graph_panel(case)
        return VGroup(system, graph).arrange(RIGHT, buff=0.46).shift(DOWN * 0.28)

    def system_panel(self, case):
        panel = RoundedRectangle(
            corner_radius=0.16,
            width=5.35,
            height=4.25,
            color=GREY_B,
            fill_color=SOFT_PANEL,
            fill_opacity=0.48,
            stroke_width=1.5,
        )
        case_label = small_text(case["label"], 24, case["color"]).move_to(panel.get_top() + DOWN * 0.42)
        system = equation_system(case["equations"]).next_to(case_label, DOWN, buff=0.35)
        note = small_text(case["result"], 19, GREY_A).next_to(system, DOWN, buff=0.42)
        solution = small_text(case["solution"], 23, case["color"]).next_to(note, DOWN, buff=0.18)
        content = VGroup(case_label, system, note, solution)
        content.move_to(panel)
        return VGroup(panel, content)

    def graph_panel(self, case):
        panel = RoundedRectangle(
            corner_radius=0.16,
            width=6.1,
            height=4.25,
            color=GREY_B,
            fill_color=SOFT_PANEL,
            fill_opacity=0.33,
            stroke_width=1.5,
        )
        plane = NumberPlane(
            x_range=[-3, 4, 1],
            y_range=[-2, 5, 1],
            x_length=5.45,
            y_length=3.55,
            background_line_style={"stroke_color": GREY_E, "stroke_width": 1, "stroke_opacity": 0.35},
            axis_config={"color": GREY_A, "stroke_width": 2.2, "include_tip": True},
        )
        plane.move_to(panel.get_center() + DOWN * 0.05)

        axes_labels = VGroup(
            small_text("x", 16, GREY_A).next_to(plane.x_axis.get_end(), RIGHT, buff=0.04),
            small_text("y", 16, GREY_A).next_to(plane.y_axis.get_end(), UP, buff=0.04),
        )

        line_a = self.plot_line(plane, case["lines"][0], BLUE_TERM)
        if case.get("coincident"):
            line_b = self.plot_line(plane, case["lines"][1], ORANGE_TERM, width=9, opacity=0.54)
            line_a = DashedVMobject(line_a, num_dashes=42)
            line_a.set_stroke(BLUE_TERM, width=4.2, opacity=0.95)
        else:
            line_b = self.plot_line(plane, case["lines"][1], ORANGE_TERM)

        label_a = small_text("d₁", 19, BLUE_TERM).move_to(plane.c2p(-2.35, self.y_value(case["lines"][0], -2.35)) + UP * 0.2)
        label_b = small_text("d₂", 19, ORANGE_TERM).move_to(plane.c2p(2.55, self.y_value(case["lines"][1], 2.55)) + DOWN * 0.2)
        labels = VGroup(label_a, label_b)

        extras = VGroup()
        if case["point"]:
            x, y = case["point"]
            dot = Dot(plane.c2p(x, y), color=GREEN_TERM, radius=0.075)
            point_label = small_text("(1 ; 2)", 18, GREEN_TERM).next_to(dot, UP + RIGHT, buff=0.1)
            extras.add(dot, point_label)
        elif case.get("coincident"):
            badge = small_text("même droite", 20, YELLOW_TERM).move_to(panel.get_bottom() + UP * 0.35)
            extras.add(badge)
        else:
            badge = small_text("aucun point commun", 20, RED_TERM).move_to(panel.get_bottom() + UP * 0.35)
            extras.add(badge)

        return VGroup(panel, plane, axes_labels, line_b, line_a, labels, extras)

    def plot_line(self, plane, line, color, width=4.2, opacity=0.95):
        slope, intercept = line
        graph = plane.plot(
            lambda x: slope * x + intercept,
            x_range=[-3.0, 4.0],
            use_smoothing=False,
            color=color,
        )
        graph.set_stroke(width=width, opacity=opacity)
        return graph

    def y_value(self, line, x):
        slope, intercept = line
        return slope * x + intercept

    def recap(self):
        cards = VGroup(
            self.recap_card("1 point", "une solution", GREEN_TERM),
            self.recap_card("0 point", "aucune solution", RED_TERM),
            self.recap_card("une droite", "infinité de solutions", YELLOW_TERM),
        ).arrange(RIGHT, buff=0.28)
        title_line = expression("Tout dépend des points communs entre les deux droites.", 28, TEXT_COLOR).next_to(cards, UP, buff=0.42)
        return VGroup(title_line, cards)

    def recap_card(self, top, bottom, color):
        box = RoundedRectangle(
            corner_radius=0.14,
            width=3.45,
            height=1.25,
            color=color,
            fill_color=SOFT_PANEL,
            fill_opacity=0.76,
            stroke_width=2,
        )
        label = VGroup(
            small_text(top, 27, color),
            small_text(bottom, 18, GREY_A),
        ).arrange(DOWN, buff=0.12).move_to(box)
        return VGroup(box, label)

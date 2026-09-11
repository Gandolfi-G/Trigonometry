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
AXIS_COLOR = GREY_A
X_MIN = 0
X_MAX = 9
AXIS_LENGTH = 9.6
LABEL_X = -5.75
WAIT = 0.85


OPERATIONS = [
    {
        "name": "Intersection",
        "symbol": "I ∩ J",
        "description": "On garde ce qui est dans I et dans J.",
        "result": "]3 ; 6]",
        "intervals": [(3, 6, False, True)],
        "color": GREEN_TERM,
    },
    {
        "name": "Réunion",
        "symbol": "I ∪ J",
        "description": "On garde ce qui est dans I ou dans J.",
        "result": "[1 ; 8[",
        "intervals": [(1, 8, True, False)],
        "color": YELLOW_TERM,
    },
    {
        "name": "Différence",
        "symbol": "I \\ J",
        "description": "On garde I, puis on retire J.",
        "result": "[1 ; 3]",
        "intervals": [(1, 3, True, True)],
        "color": RED_TERM,
    },
]


def small_text(content, size=22, color=TEXT_COLOR):
    return Text(content, color=color, font_size=size, weight=BOLD)


class Intervalles(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        heading = title("Intervalles : trois opérations")

        axis = self.axis_group().shift(DOWN * 0.58)
        inputs = self.input_group()

        self.play(Write(heading), run_time=0.75)
        self.play(Create(axis), run_time=1.0)
        self.play(FadeIn(inputs, shift=UP * 0.12), run_time=0.95)
        self.wait(WAIT)

        current = self.operation_group(OPERATIONS[0])
        self.play(FadeIn(current, shift=UP * 0.15), run_time=1.0)
        self.wait(WAIT * 1.8)

        for operation in OPERATIONS[1:]:
            next_group = self.operation_group(operation)
            self.play(
                ReplacementTransform(current[0], next_group[0]),
                ReplacementTransform(current[1], next_group[1]),
                ReplacementTransform(current[2], next_group[2]),
                run_time=1.25,
            )
            current = next_group
            self.wait(WAIT * 1.8)

        recap = self.recap_group().next_to(heading, DOWN, buff=0.82)
        self.play(FadeOut(VGroup(axis, inputs, current), shift=DOWN * 0.15), run_time=0.65)
        self.play(FadeIn(recap, shift=UP * 0.16), run_time=0.85)
        self.wait(1.4)

    def x_pos(self, value):
        return (value - X_MIN) / (X_MAX - X_MIN) * AXIS_LENGTH - AXIS_LENGTH / 2

    def axis_group(self):
        axis = Arrow(
            start=[-AXIS_LENGTH / 2 - 0.18, 0, 0],
            end=[AXIS_LENGTH / 2 + 0.18, 0, 0],
            buff=0,
            color=AXIS_COLOR,
            stroke_width=3.5,
            max_tip_length_to_length_ratio=0.035,
        )
        ticks = VGroup()
        for value in range(X_MIN, X_MAX + 1):
            x = self.x_pos(value)
            tick = Line([x, -0.08, 0], [x, 0.08, 0], color=AXIS_COLOR, stroke_width=2)
            label_color = TEXT_COLOR if value in {1, 3, 6, 8} else GREY_B
            label_size = 20 if value in {1, 3, 6, 8} else 15
            label = small_text(str(value), label_size, label_color).next_to(tick, DOWN, buff=0.12)
            ticks.add(tick, label)
        guide_lines = VGroup(
            *[
                DashedLine(
                    [self.x_pos(value), -0.02, 0],
                    [self.x_pos(value), 2.25, 0],
                    color=GREY_B,
                    stroke_width=1.3,
                    dash_length=0.08,
                    dashed_ratio=0.52,
                )
                for value in (1, 3, 6, 8)
            ]
        )
        return VGroup(guide_lines, axis, ticks)

    def input_group(self):
        i_row = self.interval_row("I = [1 ; 6]", [(1, 6, True, True)], BLUE_TERM, 1.5)
        j_row = self.interval_row("J = ]3 ; 8[", [(3, 8, False, False)], ORANGE_TERM, 0.82)
        return VGroup(i_row, j_row)

    def operation_group(self, operation):
        card = self.operation_card(operation)
        row = self.interval_row(
            None,
            operation["intervals"],
            operation["color"],
            0.12,
            label_color=operation["color"],
            stroke_width=14,
        )
        result = expression(f"{operation['symbol']} = {operation['result']}", 25, operation["color"])
        result.move_to([LABEL_X + 0.2, 0.12, 0])
        return VGroup(card, row, result)

    def operation_card(self, operation):
        box = RoundedRectangle(
            corner_radius=0.16,
            width=5.3,
            height=1.2,
            color=operation["color"],
            fill_color=SOFT_PANEL,
            fill_opacity=0.82,
            stroke_width=2.2,
        )
        name = small_text(operation["name"], 26, operation["color"])
        desc = small_text(operation["description"], 17, GREY_A)
        content = VGroup(name, desc).arrange(DOWN, buff=0.12).move_to(box)
        return VGroup(box, content).move_to([1.65, -2.35, 0])

    def interval_row(self, label, intervals, color, y, label_color=TEXT_COLOR, stroke_width=11):
        row = VGroup()
        if label is not None:
            label_mob = small_text(label, 24, label_color).move_to([LABEL_X, y, 0])
            row.add(label_mob)
        pieces = VGroup()
        for start, end, include_start, include_end in intervals:
            pieces.add(self.interval_piece(start, end, include_start, include_end, y, color, stroke_width))
        row.add(pieces)
        return row

    def interval_piece(self, start, end, include_start, include_end, y, color, stroke_width):
        left = [self.x_pos(start), y, 0]
        right = [self.x_pos(end), y, 0]
        segment = Line(left, right, color=color, stroke_width=stroke_width)
        start_dot = self.endpoint(left, include_start, color, stroke_width)
        end_dot = self.endpoint(right, include_end, color, stroke_width)
        return VGroup(segment, start_dot, end_dot)

    def endpoint(self, point, included, color, stroke_width):
        if included:
            return Dot(point, color=color, radius=0.085)
        return Circle(
            radius=0.095,
            color=color,
            fill_color=BACKGROUND_COLOR,
            fill_opacity=1,
            stroke_width=max(2.4, stroke_width * 0.25),
        ).move_to(point)

    def recap_group(self):
        cards = VGroup(
            self.recap_card("I ∩ J", "commun aux deux", GREEN_TERM),
            self.recap_card("I ∪ J", "dans au moins un", YELLOW_TERM),
            self.recap_card("I \\ J", "dans I, pas dans J", RED_TERM),
        ).arrange(RIGHT, buff=0.28)
        title_line = expression("Intersection, réunion, différence : trois règles de sélection.", 27, TEXT_COLOR)
        title_line.next_to(cards, UP, buff=0.45)
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
            small_text(top, 28, color),
            small_text(bottom, 18, GREY_A),
        ).arrange(DOWN, buff=0.12).move_to(box)
        return VGroup(box, label)

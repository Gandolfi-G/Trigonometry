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
GRID_COLOR = "#d7dde8"
FACTOR_COLORS = {
    "x + 1": GREEN_TERM,
    "x": BLUE_TERM,
    "x - 1": ORANGE_TERM,
    "produit": YELLOW_TERM,
}
WAIT = 0.7


def small_text(content, size=20, color=TEXT_COLOR):
    return Text(content, color=color, font_size=size, weight=BOLD)


class InequationsTableauSignes(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND_COLOR
        heading = title("Inéquations et tableau de signes")

        start = expression("x³ > x", 34).next_to(heading, DOWN, buff=0.38)
        moved = expression("x³ - x > 0", 32, BLUE_TERM).move_to(start)
        factor = expression("x(x - 1)(x + 1) > 0", 32, ORANGE_TERM).next_to(start, DOWN, buff=0.32)
        zeros = self.zeros_group().next_to(factor, DOWN, buff=0.22)

        table = self.sign_table().next_to(zeros, DOWN, buff=0.62)
        solution = small_text("Solution : -1 < x < 0  ou  x > 1", 25, GREEN_TERM).next_to(table, DOWN, buff=0.18)

        self.play(Write(heading), run_time=0.75)
        self.play(Write(start), run_time=0.75)
        self.wait(WAIT)
        self.play(TransformMatchingShapes(start, moved), run_time=0.8)
        self.wait(WAIT)
        self.play(FadeIn(factor, shift=UP * 0.12), run_time=0.8)
        self.wait(WAIT)
        self.play(FadeIn(zeros, shift=UP * 0.12), run_time=0.85)
        self.wait(WAIT)

        self.play(Create(table.grid), FadeIn(table.headers, shift=UP * 0.08), run_time=0.9)
        for row in table.factor_rows:
            self.play(FadeIn(row, shift=RIGHT * 0.08), run_time=0.58)
            self.wait(WAIT * 0.55)
        self.play(FadeIn(table.product_row, shift=UP * 0.08), run_time=0.7)
        self.wait(WAIT)
        self.play(FadeIn(table.positive_highlights), run_time=0.65)
        self.play(Write(solution), run_time=0.85)
        self.wait(1.4)

    def zeros_group(self):
        intro = small_text("Les zéros découpent la droite :", 18, TEXT_COLOR)
        roots = VGroup(
            self.pill("-1", GREEN_TERM),
            self.pill("0", BLUE_TERM),
            self.pill("1", ORANGE_TERM),
        ).arrange(RIGHT, buff=0.16)
        return VGroup(intro, roots).arrange(RIGHT, buff=0.22)

    def pill(self, content, color):
        label = small_text(content, 21, WHITE)
        box = RoundedRectangle(
            corner_radius=0.13,
            width=max(0.56, label.width + 0.32),
            height=0.44,
            color=color,
            fill_color=color,
            fill_opacity=0.92,
            stroke_color=WHITE,
            stroke_width=1.2,
        )
        label.move_to(box)
        return VGroup(box, label)

    def sign_table(self):
        interval_signs = {
            "x + 1": ["-", "+", "+", "+"],
            "x": ["-", "-", "+", "+"],
            "x - 1": ["-", "-", "-", "+"],
            "produit": ["-", "+", "-", "+"],
        }
        zero_roots = {
            "x + 1": [-1],
            "x": [0],
            "x - 1": [1],
            "produit": [-1, 0, 1],
        }
        rows = [
            "x + 1",
            "x",
            "x - 1",
            "produit",
        ]

        label_width = 1.28
        interval_width = 1.55
        col_widths = [label_width, interval_width, interval_width, interval_width, interval_width]
        row_heights = [0.44, 0.46, 0.46, 0.46, 0.5]
        width = sum(col_widths)
        height = sum(row_heights)
        left = -width / 2
        top = height / 2
        data_left = left + label_width
        data_right = left + width
        root_x = {
            -1: data_left + interval_width,
            0: data_left + interval_width * 2,
            1: data_left + interval_width * 3,
        }
        interval_centers = [
            data_left + interval_width * 0.5,
            data_left + interval_width * 1.5,
            data_left + interval_width * 2.5,
            data_left + interval_width * 3.5,
        ]

        grid = VGroup()
        background = RoundedRectangle(
            corner_radius=0.1,
            width=width,
            height=height,
            color=GRID_COLOR,
            fill_color=SOFT_PANEL,
            fill_opacity=0.68,
            stroke_width=1.8,
        )
        grid.add(background)

        label_separator = Line([data_left, top, 0], [data_left, -top, 0], color=GRID_COLOR, stroke_width=1.55)
        grid.add(label_separator)
        for x in root_x.values():
            grid.add(Line([x, top, 0], [x, -top, 0], color=GRID_COLOR, stroke_width=1.9))

        y = top
        for row_height in row_heights[:-1]:
            y -= row_height
            grid.add(Line([left, y, 0], [-left, y, 0], color=GRID_COLOR, stroke_width=1.25))

        header_labels = VGroup()
        header_y = self.row_center(0, row_heights)
        header_labels.add(small_text("x", 17, TEXT_COLOR).move_to([left + label_width / 2, header_y, 0]))
        header_labels.add(small_text("-∞", 16, TEXT_COLOR).move_to([data_left + 0.23, header_y, 0]))
        header_labels.add(small_text("-1", 17, TEXT_COLOR).move_to([root_x[-1], header_y, 0]))
        header_labels.add(small_text("0", 17, TEXT_COLOR).move_to([root_x[0], header_y, 0]))
        header_labels.add(small_text("1", 17, TEXT_COLOR).move_to([root_x[1], header_y, 0]))
        header_labels.add(small_text("+∞", 16, TEXT_COLOR).move_to([data_right - 0.25, header_y, 0]))

        factor_rows = VGroup()
        for row_index, label in enumerate(rows, start=1):
            row_items = VGroup()
            label_color = FACTOR_COLORS[label]
            label_size = 16 if label != "produit" else 17
            row_y = self.row_center(row_index, row_heights)
            row_items.add(small_text(label, label_size, label_color).move_to([left + label_width / 2, row_y, 0]))
            for col_index, sign in enumerate(interval_signs[label]):
                color = self.sign_color(sign, is_product=label == "produit")
                row_items.add(small_text(sign, 19, color).move_to([interval_centers[col_index], row_y, 0]))
            for root in zero_roots[label]:
                row_items.add(self.zero_marker([root_x[root], row_y, 0], FACTOR_COLORS[label] if label != "produit" else YELLOW_TERM))
            if label == "produit":
                product_row = row_items
            else:
                factor_rows.add(row_items)

        positive_highlights = VGroup()
        product_y = self.row_center(4, row_heights)
        for col_index, sign in enumerate(interval_signs["produit"]):
            if sign == "+":
                center = [interval_centers[col_index], product_y, 0]
                positive_highlights.add(
                    RoundedRectangle(
                        corner_radius=0.06,
                        width=interval_width - 0.3,
                        height=row_heights[4] - 0.08,
                        color=GREEN_TERM,
                        fill_color=GREEN_TERM,
                        fill_opacity=0.18,
                        stroke_width=2.0,
                    ).move_to(center)
                )

        table = VGroup(grid, positive_highlights, header_labels, factor_rows, product_row)
        table.grid = grid
        table.headers = header_labels
        table.factor_rows = factor_rows
        table.product_row = product_row
        table.positive_highlights = positive_highlights
        return table

    def row_center(self, row, row_heights):
        y = sum(row_heights) / 2 - sum(row_heights[:row]) - row_heights[row] / 2
        return y

    def zero_marker(self, point, color):
        circle = Circle(
            radius=0.15,
            color=color,
            fill_color=BACKGROUND_COLOR,
            fill_opacity=1,
            stroke_width=2.1,
        ).move_to(point)
        label = small_text("0", 14, TEXT_COLOR).move_to(point)
        return VGroup(circle, label)

    def sign_color(self, sign, is_product=False):
        if sign == "0":
            return GREY_A
        if sign == "+":
            return GREEN_TERM if is_product else TEXT_COLOR
        if sign == "-":
            return RED_TERM if is_product else TEXT_COLOR
        return TEXT_COLOR

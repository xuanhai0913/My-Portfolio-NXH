#!/usr/bin/env python3
"""Generate a polished two-page visual CV with clean spacing and accurate text."""

from __future__ import annotations

from pathlib import Path
from typing import Sequence

from pypdf import PdfReader, PdfWriter
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

from generate_cv_pdf import PROJECT_ENTRIES, WORK_ENTRIES


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "CV_NguyenXuanHai_visual.pdf"
PROFILE_IMAGE_CIRCLE = ROOT / "scripts" / "assets" / "nguyen_xuan_hai_profile_circle.png"
STACK_ICON_DIR = ROOT / "scripts" / "assets" / "stack-icons" / "png"

FONT_DIR = Path("/System/Library/Fonts/Supplemental")
PAGE_W, PAGE_H = A4

INK = HexColor("#10213A")
MUTED = HexColor("#5B6675")
PAPER = HexColor("#FFFDF8")
TEAL = HexColor("#0C7A7A")
TEAL_DARK = HexColor("#075C5C")
AMBER = HexColor("#D99A22")
LINE = HexColor("#D8E3E6")
PALE = HexColor("#F4F8F8")
WHITE = HexColor("#FFFFFF")

MARGIN = 42
CONTENT_W = PAGE_W - MARGIN * 2
TOP = 40
BOTTOM = 38


class VisualCv:
    def __init__(self, output: Path) -> None:
        self.output = output
        self.c = canvas.Canvas(str(output), pagesize=A4, pageCompression=1)
        self.page = 1
        self._register_fonts()
        self.c.setTitle("Nguyen Xuan Hai - Visual CV")
        self.c.setAuthor("Nguyen Xuan Hai")
        self.c.setSubject("Two-page visual CV - company experience, skills and projects")
        self.c.setCreator("Codex visual CV generator")

    def _register_fonts(self) -> None:
        pdfmetrics.registerFont(TTFont("Arial", str(FONT_DIR / "Arial.ttf")))
        pdfmetrics.registerFont(TTFont("Arial-Bold", str(FONT_DIR / "Arial Bold.ttf")))
        pdfmetrics.registerFont(TTFont("Arial-Italic", str(FONT_DIR / "Arial Italic.ttf")))

    def width(self, text: str, font: str, size: float) -> float:
        return pdfmetrics.stringWidth(text, font, size)

    def wrap(self, text: str, width: float, font: str, size: float) -> list[str]:
        words = text.split()
        lines: list[str] = []
        current = ""
        for word in words:
            candidate = word if not current else f"{current} {word}"
            if self.width(candidate, font, size) <= width:
                current = candidate
                continue
            if current:
                lines.append(current)
            current = word
        if current:
            lines.append(current)
        return lines

    def text(
        self,
        text: str,
        x: float,
        y: float,
        width: float,
        font: str = "Arial",
        size: float = 7.6,
        color=INK,
        leading: float = 9.4,
    ) -> float:
        self.c.setFont(font, size)
        self.c.setFillColor(color)
        for line in self.wrap(text, width, font, size):
            self.c.drawString(x, y, line)
            y -= leading
        return y

    def link(self, x: float, y: float, text: str, url: str, font: str = "Arial", size: float = 7.2) -> None:
        self.c.linkURL(url, (x, y - 2, x + self.width(text, font, size), y + size + 1), relative=0, thickness=0)

    def shell(self) -> None:
        self.c.setFillColor(PAPER)
        self.c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
        self.c.setStrokeColor(HexColor("#D7EAF0"))
        self.c.setLineWidth(0.45)
        for i in range(6):
            x = 16 + i * 24
            self.c.line(x, PAGE_H - 22, x + 44, PAGE_H - 48)
            self.c.line(x + 44, PAGE_H - 48, x + 44, PAGE_H - 82)
            self.c.line(x, PAGE_H - 22, x, PAGE_H - 56)
        self.footer()

    def footer(self) -> None:
        self.c.setStrokeColor(LINE)
        self.c.line(MARGIN, BOTTOM - 8, PAGE_W - MARGIN, BOTTOM - 8)
        self.c.setFillColor(MUTED)
        self.c.setFont("Arial", 7)
        self.c.drawString(MARGIN, BOTTOM - 22, "Nguyen Xuan Hai | Full-Stack Developer")
        self.c.drawRightString(PAGE_W - MARGIN, BOTTOM - 22, f"Page {self.page}")

    def section(self, title: str, x: float, y: float, icon_text: str | None = None, width: float | None = None) -> float:
        if icon_text:
            self.c.setFillColor(INK)
            self.c.circle(x + 12, y + 3, 12, fill=1, stroke=0)
            self.c.setFillColor(WHITE)
            self.c.setFont("Arial-Bold", 6.8)
            self.c.drawCentredString(x + 12, y, icon_text)
            label_x = x + 34
        else:
            label_x = x
        self.c.setFillColor(INK)
        self.c.setFont("Arial-Bold", 11.4)
        self.c.drawString(label_x, y, title.upper())
        self.c.setFillColor(TEAL)
        self.c.rect(label_x, y - 8, 34, 2, fill=1, stroke=0)
        if width:
            self.c.setStrokeColor(LINE)
            self.c.line(label_x + 44, y - 7, x + width, y - 7)
        return y - 24

    def header(self) -> None:
        x = MARGIN
        y = PAGE_H - 76
        self.c.setFillColor(INK)
        self.c.setFont("Arial-Bold", 29)
        self.c.drawString(x, y, "Nguyễn Xuân Hải")
        y -= 23
        self.c.setFillColor(AMBER)
        self.c.setFont("Arial-Bold", 14)
        self.c.drawString(x, y, "Full-Stack Developer")
        y -= 18
        self.c.setFillColor(INK)
        self.c.setFont("Arial", 9.2)
        self.c.drawString(x, y, "React | ASP.NET Core | Odoo 18 | AI Integration")
        y -= 19
        self.c.setFillColor(TEAL)
        self.c.rect(x, y + 6, 34, 2, fill=1, stroke=0)
        summary = (
            "Full-stack developer focused on production web apps, ERP workflows, reporting/PDF generation "
            "and AI-assisted developer tools."
        )
        self.text(summary, x, y - 9, 360, "Arial", 7.7, MUTED, 9.2)

        image_size = 86
        image_x = PAGE_W - MARGIN - image_size - 8
        image_y = PAGE_H - 145
        self.c.setFillColor(PALE)
        self.c.circle(image_x + image_size / 2, image_y + image_size / 2, image_size / 2 + 10, fill=1, stroke=0)
        self.c.drawImage(ImageReader(str(PROFILE_IMAGE_CIRCLE)), image_x, image_y, image_size, image_size, mask="auto")
        self.c.setStrokeColor(AMBER)
        self.c.setLineWidth(1.2)
        self.c.circle(image_x + image_size / 2, image_y + image_size / 2, image_size / 2 + 10, fill=0, stroke=1)

        self.c.setStrokeColor(HexColor("#AEBCC5"))
        self.c.line(MARGIN, PAGE_H - 184, PAGE_W - MARGIN, PAGE_H - 184)

        contacts = [
            ("0929501116", None),
            ("xuanhai0913750452@gmail.com", "mailto:xuanhai0913750452@gmail.com"),
            ("my-portfolio-nxh.vercel.app", "https://my-portfolio-nxh.vercel.app"),
            ("github.com/xuanhai0913", "https://github.com/xuanhai0913"),
            ("linkedin.com/in/xuanhai0913", "https://www.linkedin.com/in/xuanhai0913/"),
        ]
        cx = MARGIN
        cy = PAGE_H - 205
        for value, url in contacts:
            item_w = self.width(value, "Arial", 7.2) + 30
            if cx + item_w > PAGE_W - MARGIN:
                cx = MARGIN
                cy -= 14
            self.c.setFillColor(TEAL)
            self.c.circle(cx + 3, cy, 2.5, fill=1, stroke=0)
            self.c.setFillColor(INK)
            self.c.setFont("Arial", 7.2)
            self.c.drawString(cx + 11, cy - 3, value)
            if url:
                self.link(cx + 11, cy - 3, value, url, "Arial", 7.2)
            cx += item_w

    def bullet(self, text: str, x: float, y: float, width: float, size: float = 7.2) -> float:
        self.c.setFillColor(TEAL)
        self.c.circle(x + 2, y + 3, 1.15, fill=1, stroke=0)
        return self.text(text, x + 9, y, width - 9, "Arial", size, INK, size + 1.8) - 1

    def experience_timeline(self) -> None:
        y = PAGE_H - 244
        y = self.section("Company Experience", MARGIN, y, "JOB", CONTENT_W)
        axis_x = MARGIN + 70
        content_x = MARGIN + 95
        self.c.setStrokeColor(HexColor("#8BA3AE"))
        self.c.setLineWidth(0.9)
        self.c.line(axis_x, y + 8, axis_x, BOTTOM + 54)

        summaries = {
            "Betodemy": [
                "Built student portals, admin workflows, learning modules and realtime classroom features.",
                "Worked across React, NestJS, PostgreSQL, Redis/BullMQ and Nx monorepo delivery.",
            ],
            "AI Power": [
                "Supported Odoo 18 ERP for dealership sales, after-sales, spare parts and warranty.",
                "Customized business logic, QWeb reports and i18n across 18 modules and 99+ Python files.",
            ],
            "Great Link": [
                "Built publishing/B2B features with ASP.NET Core, React, SignalR and SQL Server.",
                "Integrated auth, media handling and third-party services for production workflows.",
            ],
            "VN Media": [
                "Developed CMS/media workflows for content, moderation, SEO publishing and reports.",
                "Implemented auth, caching, structured logging and PDF export features.",
            ],
        }

        for item in WORK_ENTRIES:
            key = "Betodemy"
            if item.name.startswith("AI Power"):
                key = "AI Power"
            elif item.name.startswith("Great Link"):
                key = "Great Link"
            elif item.name.startswith("VN Media"):
                key = "VN Media"

            period_lines = item.period.replace("Start: ", "").replace(" | End: ", "\n-\n").splitlines()
            self.c.setFillColor(TEAL)
            self.c.setFont("Arial-Bold", 7.4)
            py = y - 1
            for line in period_lines:
                self.c.drawRightString(axis_x - 18, py, line)
                py -= 8.5

            self.c.setFillColor(PAPER)
            self.c.setStrokeColor(TEAL)
            self.c.setLineWidth(1.5)
            self.c.circle(axis_x, y - 2, 5.4, fill=1, stroke=1)
            title = item.name.replace(" - Digital Publishing Platform", "").replace(" - CMS & Media Platform", "")
            self.c.setFillColor(INK)
            self.c.setFont("Arial-Bold", 10)
            self.c.drawString(content_x, y, title)
            self.c.setStrokeColor(LINE)
            self.c.line(content_x, y - 8, PAGE_W - MARGIN, y - 8)
            y -= 20
            for bullet in summaries[key]:
                y = self.bullet(bullet, content_x, y, PAGE_W - MARGIN - content_x, 7.35)
            y -= 22

    def skill_grid(self, x: float, y: float, w: float) -> float:
        y = self.section("Skills", x, y, "</>", w)
        skills = [
            ("React", "Frontend", "react.png"),
            ("ASP.NET Core", "Backend", "dotnet.png"),
            ("NestJS", "Backend", "nestjs.png"),
            ("Python 3.12", "Backend", "python.png"),
            ("Odoo 18", "ERP", "odoo.png"),
            ("PostgreSQL", "Database", "postgresql.png"),
            ("Docker", "Infra", "docker.png"),
            ("GitLab CI", "CI/CD", "gitlab.png"),
        ]
        col_gap = 12
        row_h = 34
        col_w = (w - col_gap) / 2
        for i, (label, category, icon_name) in enumerate(skills):
            col = i % 2
            row = i // 2
            cx = x + col * (col_w + col_gap)
            cy = y - row * row_h
            self.c.setFillColor(WHITE)
            self.c.roundRect(cx, cy - 24, col_w, 26, 7, fill=1, stroke=0)
            self.c.setStrokeColor(LINE)
            self.c.roundRect(cx, cy - 24, col_w, 26, 7, fill=0, stroke=1)
            icon_path = STACK_ICON_DIR / icon_name
            self.c.setFillColor(PALE)
            self.c.circle(cx + 14, cy - 11, 8.5, fill=1, stroke=0)
            if icon_path.exists():
                self.c.drawImage(ImageReader(str(icon_path)), cx + 7, cy - 18, 14, 14, mask="auto")
            self.c.setFillColor(INK)
            self.c.setFont("Arial-Bold", 7.4)
            self.c.drawString(cx + 28, cy - 8, label)
            self.c.setFillColor(MUTED)
            self.c.setFont("Arial", 5.8)
            self.c.drawString(cx + 28, cy - 17, category.upper())
        return y - row_h * 4 - 4

    def project_cards(self, x: float, y: float, w: float) -> float:
        y = self.section("Selected Projects", x, y, "PRJ", w)
        for item in PROJECT_ENTRIES:
            title = item.name.replace("English Community House - ", "").replace(" & LLM Unit Test Generator", "")
            card_h = 66
            self.c.setFillColor(WHITE)
            self.c.roundRect(x, y - card_h + 6, w, card_h, 8, fill=1, stroke=0)
            self.c.setStrokeColor(LINE)
            self.c.roundRect(x, y - card_h + 6, w, card_h, 8, fill=0, stroke=1)
            self.c.setFillColor(TEAL)
            self.c.circle(x + 18, y - 16, 13, fill=1, stroke=0)
            self.c.setFillColor(WHITE)
            self.c.setFont("Arial-Bold", 7.6)
            self.c.drawCentredString(x + 18, y - 19, title[:2].upper())
            self.c.setFillColor(INK)
            self.c.setFont("Arial-Bold", 8.6)
            self.c.drawString(x + 40, y - 8, title)
            self.c.setFillColor(TEAL_DARK)
            self.c.setFont("Arial-Bold", 6.7)
            self.c.drawRightString(x + w - 10, y - 8, item.period.replace("Project: ", ""))
            self.text(item.bullets[0], x + 40, y - 21, w - 52, "Arial", 7.0, MUTED, 8.3)
            y -= card_h + 7
        return y

    def education_and_certs(self, x: float, y: float, w: float) -> float:
        y = self.section("Education & Certifications", x, y, "EDU", w)
        rows = [
            ("Education", "UTH - Information Technology, 2022 - 2026"),
            ("Certifications", "Gemini Certified Student/Faculty; Google AI for K12; Basic Office IT; Accounting & Auditing"),
            ("Working Style", "Owns UI-to-API delivery, writes practical docs, and communicates progress clearly."),
        ]
        for label, body in rows:
            self.c.setFillColor(INK)
            self.c.setFont("Arial-Bold", 7.5)
            self.c.drawString(x, y, label)
            self.text(body, x + 82, y, w - 82, "Arial", 7.2, MUTED, 8.6)
            y -= 19
        return y

    def page_one(self) -> None:
        self.shell()
        self.header()
        self.experience_timeline()

    def page_two(self) -> None:
        self.c.showPage()
        self.page = 2
        self.shell()
        y = PAGE_H - TOP - 20
        self.c.setFillColor(INK)
        self.c.setFont("Arial-Bold", 13)
        self.c.drawString(MARGIN, y, "Nguyễn Xuân Hải")
        self.c.setFillColor(MUTED)
        self.c.setFont("Arial", 8)
        self.c.drawRightString(PAGE_W - MARGIN, y, "Project Evidence | Skills | Education")
        y -= 34
        y = self.skill_grid(MARGIN, y, CONTENT_W)
        y -= 18
        y = self.project_cards(MARGIN, y, CONTENT_W)
        y -= 10
        self.education_and_certs(MARGIN, y, CONTENT_W)

    def save(self) -> None:
        self.c.save()
        normalize_pdf(self.output)


def normalize_pdf(path: Path) -> None:
    temp_path = path.with_suffix(".tmp.pdf")
    reader = PdfReader(str(path))
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)
    writer.add_metadata(
        {
            "/Title": "Nguyen Xuan Hai - Visual CV",
            "/Author": "Nguyen Xuan Hai",
            "/Subject": "Two-page visual CV - company experience, skills and projects",
            "/Creator": "Codex visual CV generator",
        }
    )
    with temp_path.open("wb") as f:
        writer.write(f)
    temp_path.replace(path)


def build() -> None:
    if not PROFILE_IMAGE_CIRCLE.exists():
        raise FileNotFoundError(f"Missing profile image: {PROFILE_IMAGE_CIRCLE}")

    pdf = VisualCv(OUTPUT)
    pdf.page_one()
    pdf.page_two()
    pdf.save()


if __name__ == "__main__":
    build()

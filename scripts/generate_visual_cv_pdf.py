#!/usr/bin/env python3
"""Generate a one-page visual CV inspired by the GPT Image concept."""

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

from generate_cv_pdf import WORK_ENTRIES


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "CV_NguyenXuanHai_visual.pdf"
PROFILE_IMAGE = ROOT / "scripts" / "assets" / "nguyen_xuan_hai_profile.png"
PROFILE_IMAGE_CIRCLE = ROOT / "scripts" / "assets" / "nguyen_xuan_hai_profile_circle.png"
STACK_ICON_DIR = ROOT / "scripts" / "assets" / "stack-icons" / "png"

FONT_DIR = Path("/System/Library/Fonts/Supplemental")
PAGE_W, PAGE_H = A4

INK = HexColor("#0F1F3A")
MUTED = HexColor("#536072")
PAPER = HexColor("#FFFDF8")
TEAL = HexColor("#0C7A7A")
TEAL_SOFT = HexColor("#DCEDED")
AMBER = HexColor("#D99A22")
LINE = HexColor("#D7E0E3")
PALE = HexColor("#F4F8F8")
WHITE = HexColor("#FFFFFF")

MARGIN = 38
LEFT_X = MARGIN
LEFT_W = 296
RIGHT_X = 368
RIGHT_W = PAGE_W - RIGHT_X - MARGIN
TOP = 38
BOTTOM = 34


class VisualCv:
    def __init__(self, output: Path) -> None:
        self.output = output
        self.c = canvas.Canvas(str(output), pagesize=A4, pageCompression=1)
        self.y = PAGE_H - TOP
        self._register_fonts()
        self.c.setTitle("Nguyen Xuan Hai - Visual CV")
        self.c.setAuthor("Nguyen Xuan Hai")
        self.c.setSubject("One-page visual CV - company experience, skills and projects")
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
        size: float = 7.5,
        color=INK,
        leading: float = 9.1,
    ) -> float:
        self.c.setFont(font, size)
        self.c.setFillColor(color)
        for line in self.wrap(text, width, font, size):
            self.c.drawString(x, y, line)
            y -= leading
        return y

    def link(self, x: float, y: float, text: str, url: str, font: str = "Arial", size: float = 7) -> None:
        self.c.linkURL(url, (x, y - 2, x + self.width(text, font, size), y + size + 1), relative=0, thickness=0)

    def background(self) -> None:
        self.c.setFillColor(PAPER)
        self.c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
        self.c.setStrokeColor(HexColor("#D7EAF0"))
        self.c.setLineWidth(0.45)
        for i in range(6):
            x = 14 + i * 23
            self.c.line(x, PAGE_H - 22, x + 44, PAGE_H - 48)
            self.c.line(x + 44, PAGE_H - 48, x + 44, PAGE_H - 82)
            self.c.line(x, PAGE_H - 22, x, PAGE_H - 56)
        for i in range(5):
            x = PAGE_W - 84 + i * 14
            y = PAGE_H - 34
            self.c.setFillColor(HexColor("#86C5D1"))
            self.c.circle(x, y - (i % 2) * 10, 1.25, fill=1, stroke=0)
            self.c.circle(x, y - 23 - (i % 2) * 8, 1.25, fill=1, stroke=0)

    def header(self) -> None:
        x = LEFT_X + 10
        y = PAGE_H - 76
        self.c.setFillColor(INK)
        self.c.setFont("Arial-Bold", 30)
        self.c.drawString(x, y, "Nguyễn Xuân Hải")
        y -= 24
        self.c.setFillColor(AMBER)
        self.c.setFont("Arial-Bold", 14)
        self.c.drawString(x, y, "Full-Stack Developer")
        y -= 18
        self.c.setFillColor(INK)
        self.c.setFont("Arial", 9.2)
        self.c.drawString(x, y, "React  |  ASP.NET Core  |  Odoo 18  |  AI Integration")
        y -= 21
        self.c.setFillColor(TEAL)
        self.c.rect(x, y + 7, 32, 2, fill=1, stroke=0)

        contact = [
            ("0929501116", None),
            ("xuanhai0913750452@gmail.com", "mailto:xuanhai0913750452@gmail.com"),
            ("my-portfolio-nxh.vercel.app", "https://my-portfolio-nxh.vercel.app"),
        ]
        cx = x
        for value, url in contact:
            self.c.setFillColor(TEAL)
            self.c.circle(cx + 3, y - 7, 3, fill=1, stroke=0)
            self.c.setFillColor(INK)
            self.c.setFont("Arial", 7.6)
            self.c.drawString(cx + 12, y - 10, value)
            if url:
                self.link(cx + 12, y - 10, value, url, "Arial", 7.6)
            cx += self.width(value, "Arial", 7.6) + 31

        image_size = 84
        image_x = PAGE_W - MARGIN - image_size - 18
        image_y = PAGE_H - 144
        self.c.setFillColor(PALE)
        self.c.circle(image_x + image_size / 2, image_y + image_size / 2, image_size / 2 + 10, fill=1, stroke=0)
        self.c.drawImage(ImageReader(str(PROFILE_IMAGE_CIRCLE)), image_x, image_y, image_size, image_size, mask="auto")
        self.c.setStrokeColor(AMBER)
        self.c.setLineWidth(1.2)
        self.c.circle(image_x + image_size / 2, image_y + image_size / 2, image_size / 2 + 10, fill=0, stroke=1)

        self.c.setStrokeColor(HexColor("#AEBCC5"))
        self.c.line(MARGIN, PAGE_H - 178, PAGE_W - MARGIN, PAGE_H - 178)

    def section_title(self, x: float, y: float, title: str, icon_text: str = "") -> float:
        if icon_text:
            self.c.setFillColor(INK)
            self.c.circle(x + 12, y + 3, 12, fill=1, stroke=0)
            self.c.setFillColor(WHITE)
            self.c.setFont("Arial-Bold", 7)
            self.c.drawCentredString(x + 12, y, icon_text)
            label_x = x + 34
        else:
            label_x = x
        self.c.setFillColor(INK)
        self.c.setFont("Arial-Bold", 11.2)
        self.c.drawString(label_x, y, title.upper())
        self.c.setFillColor(TEAL)
        self.c.rect(label_x, y - 8, 28, 2, fill=1, stroke=0)
        return y - 23

    def bullet(self, text: str, x: float, y: float, width: float, size: float = 7.0) -> float:
        self.c.setFillColor(INK)
        self.c.circle(x + 2, y + 3, 1.1, fill=1, stroke=0)
        return self.text(text, x + 8, y, width - 8, "Arial", size, INK, size + 1.6) - 1

    def experience_timeline(self) -> None:
        y = PAGE_H - 205
        y = self.section_title(LEFT_X, y, "Company Experience", "JOB")
        axis_x = LEFT_X + 62
        content_x = LEFT_X + 84
        self.c.setStrokeColor(HexColor("#8BA3AE"))
        self.c.setLineWidth(0.8)
        self.c.line(axis_x, y + 6, axis_x, BOTTOM + 62)

        summaries = {
            "Betodemy": [
                "Built learning modules, admin workflows and realtime classroom features.",
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
            self.c.setFont("Arial-Bold", 7.2)
            period_y = y - 2
            for line in period_lines:
                self.c.drawRightString(axis_x - 18, period_y, line)
                period_y -= 8

            self.c.setFillColor(PAPER)
            self.c.setStrokeColor(TEAL)
            self.c.setLineWidth(1.4)
            self.c.circle(axis_x, y - 2, 5, fill=1, stroke=1)
            self.c.setFillColor(INK)
            self.c.setFont("Arial-Bold", 9.2)
            title = item.name.replace(" - Digital Publishing Platform", "").replace(" - CMS & Media Platform", "")
            self.c.drawString(content_x, y, title)
            self.c.setFillColor(TEAL)
            self.c.circle(content_x + min(self.width(title, "Arial-Bold", 9.2) + 8, 206), y + 3, 1.6, fill=1, stroke=0)
            self.c.setStrokeColor(LINE)
            self.c.line(content_x, y - 7, LEFT_X + LEFT_W, y - 7)
            y -= 18
            for bullet in summaries[key]:
                y = self.bullet(bullet, content_x, y, LEFT_X + LEFT_W - content_x, 6.9)
            y -= 19

    def skills(self) -> float:
        y = PAGE_H - 205
        y = self.section_title(RIGHT_X, y, "Skills", "</>")
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
        for label, category, icon_name in skills:
            icon_path = STACK_ICON_DIR / icon_name
            self.c.setFillColor(PALE)
            self.c.circle(RIGHT_X + 10, y - 2, 8.5, fill=1, stroke=0)
            if icon_path.exists():
                self.c.drawImage(ImageReader(str(icon_path)), RIGHT_X + 3, y - 9, 14, 14, mask="auto")
            else:
                self.c.setFillColor(TEAL)
                self.c.circle(RIGHT_X + 10, y - 2, 2.2, fill=1, stroke=0)
            self.c.setFillColor(INK)
            self.c.setFont("Arial-Bold", 8.2)
            self.c.drawString(RIGHT_X + 26, y - 2, label)
            self.c.setFillColor(MUTED)
            self.c.setFont("Arial", 6.4)
            self.c.drawRightString(PAGE_W - MARGIN, y - 1.5, category.upper())
            self.c.setStrokeColor(LINE)
            self.c.line(RIGHT_X, y - 10, PAGE_W - MARGIN, y - 10)
            y -= 22
        return y - 8

    def projects(self, y: float) -> float:
        y = self.section_title(RIGHT_X, y, "Selected Projects", "PRJ")
        project_summaries = [
            ("ECH LMS", "Community LMS volunteer project for accessible English learning.", "Oct 2024 - Jan 2026"),
            ("Vision Key AI", "AI screen assistant and landing page for productivity workflows.", "Dec 2025"),
            ("Portfolio AI Assistant", "Portfolio chatbot plus LLM unit test generator project.", "Mar 2025 - May 2026"),
        ]
        for title, body, period in project_summaries:
            self.c.setFillColor(PALE)
            self.c.circle(RIGHT_X + 18, y - 3, 15, fill=1, stroke=0)
            self.c.setFillColor(TEAL)
            self.c.setFont("Arial-Bold", 9)
            self.c.drawCentredString(RIGHT_X + 18, y - 7, title[:2].upper())
            self.c.setFillColor(INK)
            self.c.setFont("Arial-Bold", 8.8)
            self.c.drawString(RIGHT_X + 42, y + 3, title)
            y = self.text(body, RIGHT_X + 42, y - 8, RIGHT_W - 42, "Arial", 7.0, INK, 8.4)
            self.c.setFillColor(TEAL)
            self.c.setFont("Arial-Bold", 6.9)
            self.c.drawString(RIGHT_X + 42, y - 1, period)
            y -= 24
            self.c.setStrokeColor(LINE)
            self.c.line(RIGHT_X, y + 12, PAGE_W - MARGIN, y + 12)
        return y

    def footer(self) -> None:
        self.c.setStrokeColor(HexColor("#AEBCC5"))
        self.c.line(MARGIN, BOTTOM + 30, PAGE_W - MARGIN, BOTTOM + 30)
        self.c.setFillColor(TEAL)
        self.c.setFont("Arial-Bold", 24)
        self.c.drawString(MARGIN + 4, BOTTOM + 3, "\"")
        self.c.setFillColor(INK)
        self.c.setFont("Arial", 7.4)
        self.c.drawString(MARGIN + 32, BOTTOM + 18, "I build reliable software with clean architecture")
        self.c.drawString(MARGIN + 32, BOTTOM + 8, "and a focus on real user value.")
        self.c.setFillColor(MUTED)
        self.c.setFont("Arial", 7.2)
        self.c.drawRightString(PAGE_W - MARGIN, BOTTOM + 13, "Ho Chi Minh City, Vietnam | UTH - Information Technology")

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
            "/Subject": "One-page visual CV - company experience, skills and projects",
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
    pdf.background()
    pdf.header()
    pdf.experience_timeline()
    y = pdf.skills()
    pdf.projects(y)
    pdf.footer()
    pdf.save()


if __name__ == "__main__":
    build()

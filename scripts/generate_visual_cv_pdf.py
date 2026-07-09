#!/usr/bin/env python3
"""Generate Nguyen Xuan Hai's reusable one-page visual CV as vector PDF."""

from __future__ import annotations

from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.graphics import renderPDF
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from svglib.svglib import svg2rlg


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "CV_NguyenXuanHai_visual.pdf"
PROFILE_IMAGE_CIRCLE = ROOT / "scripts" / "assets" / "nguyen_xuan_hai_profile_circle.png"
STACK_ICON_DIR = ROOT / "scripts" / "assets" / "stack-icons" / "png"
CONTACT_ICON_DIR = ROOT / "public" / "icon" / "contact" / "png"
AGENT_ICON_DIR = ROOT / "public" / "icon" / "ai" / "png"
SECTION_ICON_DIR = ROOT / "public" / "icon" / "section"
WORKFLOW_ICON_DIR = ROOT / "public" / "icon" / "workflow"

FONT_DIR = Path("/System/Library/Fonts/Supplemental")
PAGE_W, PAGE_H = A4

INK = HexColor("#0F1F3A")
MUTED = HexColor("#536072")
PAPER = HexColor("#FFFDF8")
TEAL = HexColor("#0C7A7A")
TEAL_DARK = HexColor("#075C5C")
TEAL_SOFT = HexColor("#E7F5F4")
AMBER = HexColor("#D99A22")
LINE = HexColor("#D7E0E3")
PALE = HexColor("#F5FAFA")
WHITE = HexColor("#FFFFFF")
CLAUDE = HexColor("#E56A2C")
DARK_CHIP = HexColor("#102341")

MARGIN = 34
LEFT_X = MARGIN
RIGHT_X = 354
LEFT_W = RIGHT_X - LEFT_X - 24
RIGHT_W = PAGE_W - RIGHT_X - MARGIN
BOTTOM = 34


class VisualCv:
    def __init__(self, output: Path) -> None:
        self.output = output
        self.c = canvas.Canvas(str(output), pagesize=A4, pageCompression=1)
        self._register_fonts()
        self.c.setTitle("Nguyen Xuan Hai - Visual CV")
        self.c.setAuthor("Nguyen Xuan Hai")
        self.c.setSubject("One-page visual CV - AI workflow, company experience, skills and projects")
        self.c.setCreator("Codex vector visual CV generator")

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
        size: float = 7.4,
        color=INK,
        leading: float = 9.0,
    ) -> float:
        self.c.setFont(font, size)
        self.c.setFillColor(color)
        for line in self.wrap(text, width, font, size):
            self.c.drawString(x, y, line)
            y -= leading
        return y

    def link_box(self, x: float, y: float, w: float, h: float, url: str) -> None:
        self.c.linkURL(url, (x, y, x + w, y + h), relative=0, thickness=0)

    def background(self) -> None:
        self.c.setFillColor(PAPER)
        self.c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
        self.c.setStrokeColor(HexColor("#D7EAF0"))
        self.c.setLineWidth(0.45)
        for i in range(7):
            x = 16 + i * 22
            self.c.line(x, PAGE_H - 22, x + 42, PAGE_H - 47)
            self.c.line(x + 42, PAGE_H - 47, x + 42, PAGE_H - 78)
            self.c.line(x, PAGE_H - 22, x, PAGE_H - 54)
        self.c.setFillColor(HexColor("#86C5D1"))
        for i in range(16):
            x = PAGE_W - 82 + (i % 4) * 14
            y = PAGE_H - 34 - (i // 4) * 12
            self.c.circle(x, y, 1.15, fill=1, stroke=0)

    def section_title(self, x: float, y: float, title: str, icon_name: str) -> float:
        self.c.setFillColor(DARK_CHIP)
        self.c.circle(x + 12, y + 3, 12.6, fill=1, stroke=0)
        self.svg_icon(SECTION_ICON_DIR / icon_name, x + 12, y + 3, 11.2)
        self.c.setFillColor(INK)
        self.c.setFont("Arial-Bold", 12.6)
        self.c.drawString(x + 34, y, title.upper())
        self.c.setFillColor(TEAL)
        self.c.rect(x + 34, y - 8, 28, 2, fill=1, stroke=0)
        return y - 24

    def icon_circle(self, x: float, y: float, text: str, fill=TEAL, color=WHITE, r: float = 10, size: float = 6.4) -> None:
        self.c.setFillColor(fill)
        self.c.circle(x, y, r, fill=1, stroke=0)
        self.c.setFillColor(color)
        self.c.setFont("Arial-Bold", size)
        self.c.drawCentredString(x, y - size * 0.34, text)

    def image_icon(self, path: Path, x: float, y: float, size: float, bg=TEAL, bg_r: float | None = None) -> None:
        if bg_r:
            self.c.setFillColor(bg)
            self.c.circle(x, y, bg_r, fill=1, stroke=0)
        if path.exists():
            self.c.drawImage(ImageReader(str(path)), x - size / 2, y - size / 2, size, size, mask="auto")

    def svg_icon(self, path: Path, x: float, y: float, size: float) -> None:
        if not path.exists():
            return
        drawing = svg2rlg(str(path))
        if not drawing or not drawing.width or not drawing.height:
            return
        scale = size / max(float(drawing.width), float(drawing.height))
        self.c.saveState()
        self.c.translate(x - drawing.width * scale / 2, y - drawing.height * scale / 2)
        self.c.scale(scale, scale)
        renderPDF.draw(drawing, self.c, 0, 0)
        self.c.restoreState()

    def header(self) -> None:
        x = LEFT_X + 14
        y = PAGE_H - 72

        self.c.setFillColor(INK)
        self.c.setFont("Arial-Bold", 30)
        self.c.drawString(x, y, "Nguyen Xuan Hai")
        y -= 24
        self.c.setFillColor(AMBER)
        self.c.setFont("Arial-Bold", 14.6)
        self.c.drawString(x, y, "Full-Stack Developer")
        y -= 18
        self.c.setFillColor(INK)
        self.c.setFont("Arial", 9.5)
        self.c.drawString(x, y, "React  |  ASP.NET Core  |  Odoo 18  |  AI Agent Workflow")
        y -= 15
        self.c.setFillColor(TEAL)
        self.c.rect(x, y + 6, 34, 2, fill=1, stroke=0)
        y -= 10
        self.text(
            "Full-stack developer who ships web/ERP features and uses AI agents to speed up delivery, review and operations.",
            x,
            y,
            360,
            "Arial",
            7.7,
            MUTED,
            9.3,
        )

        image_size = 88
        image_x = PAGE_W - MARGIN - image_size - 20
        image_y = PAGE_H - 148
        self.c.setFillColor(PALE)
        self.c.circle(image_x + image_size / 2, image_y + image_size / 2, image_size / 2 + 11, fill=1, stroke=0)
        self.c.drawImage(ImageReader(str(PROFILE_IMAGE_CIRCLE)), image_x, image_y, image_size, image_size, mask="auto")
        self.c.setStrokeColor(AMBER)
        self.c.setLineWidth(1.2)
        self.c.circle(image_x + image_size / 2, image_y + image_size / 2, image_size / 2 + 11, fill=0, stroke=1)

    def contact_row(self) -> None:
        rows = [
            [
                (LEFT_X + 10, 148, "phone.png", "0929501116", None),
                (LEFT_X + 190, 148, "calendar.png", "29/11/2004", None),
                (LEFT_X + 370, 148, "email.png", "xuanhai0913750452@gmail.com", "mailto:xuanhai0913750452@gmail.com"),
            ],
            [
                (LEFT_X + 10, 148, "website.png", "my-portfolio-nxh.vercel.app", "https://my-portfolio-nxh.vercel.app"),
                (LEFT_X + 190, 148, "github.png", "github.com/xuanhai0913", "https://github.com/xuanhai0913"),
                (LEFT_X + 370, 148, "linkedin.png", "linkedin.com/in/xuanhai0913", "https://www.linkedin.com/in/xuanhai0913/"),
            ],
        ]
        for row_index, row in enumerate(rows):
            y = PAGE_H - 183 - row_index * 19
            for idx, (x, w, icon_name, text, url) in enumerate(row):
                self.c.setFillColor(WHITE)
                self.c.setStrokeColor(HexColor("#E1EAEC"))
                self.c.roundRect(x, y - 9, w, 17, 6, fill=1, stroke=1)
                self.image_icon(CONTACT_ICON_DIR / icon_name, x + 11, y - 0.5, 7.6, TEAL, 7)
                self.c.setFillColor(INK)
                size = 5.45 if len(text) > 25 else 6.35
                self.c.setFont("Arial", size)
                ty = y - 2.0 if len(text) <= 26 else y - 1.4
                lines = self.wrap(text, w - 26, "Arial", size)
                for line in lines[:2]:
                    self.c.drawString(x + 24, ty, line)
                    ty -= 6.4
                if url:
                    self.link_box(x, y - 9, w, 17, url)

    def ai_workflow_card(self) -> None:
        x = LEFT_X + 2
        y = PAGE_H - 228
        w = PAGE_W - (LEFT_X * 2) - 4
        h = 94
        self.c.setFillColor(TEAL_SOFT)
        self.c.setStrokeColor(HexColor("#BBD9D8"))
        self.c.roundRect(x, y - h, w, h, 10, fill=1, stroke=1)
        left = x + 20
        top = y - 22

        self.icon_circle(left, top + 2, "AI", TEAL, WHITE, 13, 8.5)
        self.c.setFillColor(TEAL_DARK)
        self.c.setFont("Arial-Bold", 12.8)
        self.c.drawString(left + 25, top + 4, "AI Workflow")
        self.text(
            "I set up project-aware AI workflows to turn messy context into plans, review notes, automation, and smoother release handoff.",
            left,
            top - 17,
            170,
            "Arial",
            6.9,
            INK,
            9.8,
        )

        columns = [
            ("file-earmark-text.svg", "Project Context", "Structure requirements, codebase and docs into clear, actionable context."),
            ("robot.svg", "Agent Skills", "Use agents for coding, review, tests, automation and docs."),
            ("git.svg", "Review & CI/CD", "AI-assisted review, quality gates and smoother release handoff."),
        ]
        start_x = x + 218
        col_w = 108
        for i, (icon_name, title, body) in enumerate(columns):
            cx = start_x + i * col_w
            if i:
                self.c.setStrokeColor(HexColor("#BED8D8"))
                self.c.line(cx - 11, y - 18, cx - 11, y - h + 18)
            self.c.setFillColor(WHITE)
            self.c.circle(cx, top + 3, 9.5, fill=1, stroke=0)
            self.svg_icon(WORKFLOW_ICON_DIR / icon_name, cx, top + 3, 8.2)
            self.c.setFillColor(INK)
            self.c.setFont("Arial-Bold", 7.45)
            self.c.drawString(cx + 14, top + 1, title)
            self.text(body, cx, top - 16, col_w - 18, "Arial", 6.25, INK, 8.7)
            if title == "Agent Skills":
                tool_y = top - 51
                for offset, label in ((9, "Claude"), (43, "Codex"), (77, "Antigravity")):
                    self.c.setFillColor(WHITE)
                    self.c.circle(cx + offset, tool_y - 1.5, 7.2, fill=1, stroke=0)
                    self.agent_icon(cx + offset, tool_y - 1.5, label, 4.9)
                    self.c.setFillColor(INK)
                    self.c.setFont("Arial-Bold", 4.8)
                    self.c.drawCentredString(cx + offset, tool_y - 12.5, label)

    def agent_icon(self, x: float, y: float, label: str, r: float = 6.0) -> None:
        icon_path = AGENT_ICON_DIR / f"{label.lower()}.png"
        if icon_path.exists():
            self.image_icon(icon_path, x, y, r * 2, WHITE, None)
        else:
            self.icon_circle(x, y, label[:1], DARK_CHIP, WHITE, r, 7.0)

    def agent_chip(self, x: float, y: float, label: str, w: float = 78, h: float = 15) -> None:
        self.c.setFillColor(WHITE)
        self.c.setStrokeColor(LINE)
        self.c.roundRect(x, y - h + 4, w, h, 4, fill=1, stroke=1)
        self.agent_icon(x + 10, y - 3.5, label, 5.4)
        self.c.setFillColor(INK)
        self.c.setFont("Arial-Bold", 6.7)
        self.c.drawString(x + 21, y - 6, label)

    def bullet(self, text: str, x: float, y: float, width: float, size: float = 6.75) -> float:
        self.c.setFillColor(INK)
        self.c.circle(x + 2, y + 3, 1.0, fill=1, stroke=0)
        return self.text(text, x + 9, y, width - 9, "Arial", size, INK, size + 1.6) - 1

    def company_experience(self) -> None:
        y = PAGE_H - 344
        y = self.section_title(LEFT_X, y, "Company Experience", "briefcase.svg")
        axis_x = LEFT_X + 70
        content_x = LEFT_X + 94
        self.c.setStrokeColor(HexColor("#8BA3AE"))
        self.c.setLineWidth(0.8)
        self.c.line(axis_x, y + 7, axis_x, BOTTOM + 116)

        entries = [
            (
                "Feb 2026\n-\nPresent",
                "Betodemy - Japanese Learning Platform",
                "Role: Core Full-Stack Developer in 5-person product team",
                [
                    "Built features and fixed bugs across learning modules.",
                    "Joined weekly product meetings, created issues after release, supported operations.",
                ],
            ),
            (
                "May 2026\n-\nJul 2026",
                "AI Power - Automotive Dealership ERP",
                "Role: Odoo ERP Support Developer Intern",
                [
                    "Supported Odoo 18 dealership ERP modules after BA/customer requirement updates.",
                    "Fixed business logic, QWeb reports and i18n across 18 modules and 99+ Python files.",
                ],
            ),
            (
                "Jul 2025\n-\nMay 2026",
                "Great Link Mai House",
                "Role: Main Full-Stack Developer / BA-facing Owner",
                [
                    "Led WordPress-to-React/ASP.NET Core conversion.",
                    "Built auth, realtime, media and integration workflows.",
                ],
            ),
            (
                "Oct 2024\n-\nJan 2026",
                "VN Media Hub",
                "Role: Main Full-Stack Developer / BA-facing Owner",
                [
                    "Led CMS/media platform from requirements to release.",
                    "Built content, auth, moderation, SEO, caching, logging and PDF/report workflows.",
                ],
            ),
        ]

        for dates, title, role, bullets in entries:
            self.c.setFillColor(TEAL)
            self.c.setFont("Arial-Bold", 7.6)
            dy = y - 2
            for line in dates.splitlines():
                self.c.drawRightString(axis_x - 18, dy, line)
                dy -= 8.5
            self.c.setFillColor(PAPER)
            self.c.setStrokeColor(TEAL)
            self.c.setLineWidth(1.35)
            self.c.circle(axis_x, y - 3, 5.3, fill=1, stroke=1)
            self.c.setFillColor(INK)
            self.c.setFont("Arial-Bold", 9.1)
            self.c.drawString(content_x, y, title)
            self.c.setStrokeColor(LINE)
            self.c.line(content_x, y - 8, LEFT_X + LEFT_W, y - 8)
            y -= 18
            self.c.setFillColor(TEAL_DARK)
            self.c.setFont("Arial-Bold", 7.1)
            self.c.drawString(content_x, y, role)
            y -= 12
            for item in bullets:
                y = self.bullet(item, content_x, y, LEFT_X + LEFT_W - content_x, 6.85)
            y -= 18

    def skill_row(self, x: float, y: float, label: str, category: str, icon_name: str | None = None) -> float:
        row_h = 13.8
        self.c.setFillColor(WHITE)
        self.c.setStrokeColor(LINE)
        self.c.roundRect(x, y - row_h + 4, RIGHT_W, row_h, 5, fill=1, stroke=1)
        self.c.setFillColor(PALE)
        self.c.circle(x + 12, y - 3.2, 6.6, fill=1, stroke=0)
        icon_path = STACK_ICON_DIR / icon_name if icon_name else None
        if icon_path and icon_path.exists():
            self.c.drawImage(ImageReader(str(icon_path)), x + 7, y - 8.6, 10.5, 10.5, mask="auto")
        elif label in ("Claude", "Codex", "Antigravity"):
            self.agent_icon(x + 12, y - 3.2, label, 4.8)
        else:
            self.c.setFillColor(TEAL)
            self.c.setFont("Arial-Bold", 5.8)
            self.c.drawCentredString(x + 12, y - 5.3, "AI")
        self.c.setFillColor(INK)
        self.c.setFont("Arial-Bold", 7.1)
        self.c.drawString(x + 27, y - 5.3, label)
        self.c.setFillColor(MUTED)
        self.c.setFont("Arial", 5.2)
        self.c.drawRightString(x + RIGHT_W - 8, y - 5.2, category.upper())
        return y - row_h - 1.4

    def skills_and_projects(self) -> None:
        x = RIGHT_X
        y = PAGE_H - 344
        y = self.section_title(x, y, "Skills", "code-slash.svg")
        skills = [
            ("React", "Frontend", "react.png"),
            ("ASP.NET Core", "Backend", "dotnet.png"),
            ("NestJS", "Backend", "nestjs.png"),
            ("Python 3.12", "Backend", "python.png"),
            ("Odoo 18", "ERP", "odoo.png"),
            ("PostgreSQL", "Database", "postgresql.png"),
            ("Docker", "Infra", "docker.png"),
            ("GitLab CI", "CI/CD", "gitlab.png"),
            ("Claude", "AI Agents", None),
            ("Codex", "AI Agents", None),
            ("Antigravity", "AI Agents", None),
        ]
        for label, category, icon_name in skills:
            y = self.skill_row(x, y, label, category, icon_name)

        y -= 16
        y = self.section_title(x, y, "Selected Projects", "folder2-open.svg")
        projects = [
            ("EC", "ECH LMS", "LMS workflows for accessible English learning.", "Oct 2024 - Jan 2026"),
            ("VI", "Vision Key AI", "AI screen-assistant workflows and landing page.", "Dec 2025 - Dec 2025"),
            ("AI", "AI Agent Workflow", "Codex/Claude/Antigravity context, skills and review automation.", "Mar 2025 - May 2026"),
        ]
        for mark, title, body, period in projects:
            card_h = 27
            self.c.setFillColor(WHITE)
            self.c.setStrokeColor(LINE)
            self.c.roundRect(x, y - card_h + 7, RIGHT_W, card_h, 6, fill=1, stroke=1)
            self.icon_circle(x + 12, y - 7, mark, PALE, TEAL_DARK, 8.5, 6)
            self.c.setFillColor(INK)
            self.c.setFont("Arial-Bold", 7.0)
            self.c.drawString(x + 27, y, title)
            self.c.setFillColor(INK)
            self.c.setFont("Arial", 5.4)
            self.c.drawString(x + 27, y - 8.4, body[:76])
            self.c.setFillColor(TEAL)
            self.c.setFont("Arial-Bold", 5.5)
            self.c.drawString(x + 27, y - 16.3, period)
            y -= card_h + 4

    def footer(self) -> None:
        y = 78
        self.c.setStrokeColor(HexColor("#AEBCC5"))
        self.c.line(MARGIN, y + 18, PAGE_W - MARGIN, y + 18)
        mid = PAGE_W / 2 - 8
        self.c.setStrokeColor(LINE)
        self.c.line(mid, y - 36, mid, y + 10)

        self.c.setFillColor(TEAL)
        self.c.circle(MARGIN + 12, y - 2, 10, fill=1, stroke=0)
        self.svg_icon(SECTION_ICON_DIR / "mortarboard.svg", MARGIN + 12, y - 2, 9.0)
        self.c.setFillColor(INK)
        self.c.setFont("Arial-Bold", 8.4)
        self.c.drawString(MARGIN + 32, y + 1, "EDUCATION")
        self.c.setFillColor(TEAL)
        self.c.rect(MARGIN + 32, y - 7, 28, 2, fill=1, stroke=0)
        self.c.setFillColor(INK)
        self.c.setFont("Arial", 6.7)
        self.c.drawString(MARGIN + 2, y - 30, "UTH - Information Technology, 2022 - 2026")

        cert_x = mid + 28
        self.c.setFillColor(TEAL)
        self.c.circle(cert_x - 16, y - 2, 10, fill=1, stroke=0)
        self.svg_icon(SECTION_ICON_DIR / "award.svg", cert_x - 16, y - 2, 8.6)
        self.c.setFillColor(INK)
        self.c.setFont("Arial-Bold", 8.4)
        self.c.drawString(cert_x, y + 1, "CERTIFICATIONS")
        self.c.setFillColor(TEAL)
        self.c.rect(cert_x, y - 7, 28, 2, fill=1, stroke=0)
        certs = [
            "Gemini Certified Student/Faculty",
            "Google AI for K12 Educators",
            "Basic Office Information Technology",
            "Volunteer Participation Certificate",
        ]
        cy = y - 16
        self.c.setFont("Arial", 5.9)
        for cert in certs:
            self.c.setFillColor(TEAL)
            self.c.circle(cert_x + 2, cy + 2, 1.5, fill=1, stroke=0)
            self.c.setFillColor(MUTED)
            self.c.drawString(cert_x + 8, cy, cert)
            cy -= 8
        self.c.setFillColor(MUTED)
        self.c.setFont("Arial", 6.4)
        self.c.drawRightString(PAGE_W - MARGIN, y - 34, "Ho Chi Minh City, Vietnam")

    def save(self) -> None:
        self.c.save()


def build() -> None:
    if not PROFILE_IMAGE_CIRCLE.exists():
        raise FileNotFoundError(f"Missing profile image: {PROFILE_IMAGE_CIRCLE}")
    pdf = VisualCv(OUTPUT)
    pdf.background()
    pdf.header()
    pdf.contact_row()
    pdf.ai_workflow_card()
    pdf.company_experience()
    pdf.skills_and_projects()
    pdf.footer()
    pdf.save()


if __name__ == "__main__":
    build()

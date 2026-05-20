#!/usr/bin/env python3
"""Generate Nguyen Xuan Hai's ATS-friendly portfolio CV as a PDF."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List, Optional, Sequence, Tuple

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from pypdf import PdfReader, PdfWriter


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "CV_NguyenXuanHai.pdf"

FONT_DIR = Path("/System/Library/Fonts/Supplemental")
FONT_REGULAR = FONT_DIR / "Arial.ttf"
FONT_BOLD = FONT_DIR / "Arial Bold.ttf"
FONT_ITALIC = FONT_DIR / "Arial Italic.ttf"

PAGE_W, PAGE_H = A4
MARGIN_X = 42
TOP = 40
BOTTOM = 38
CONTENT_W = PAGE_W - (MARGIN_X * 2)

INK = HexColor("#122033")
MUTED = HexColor("#4B5A6A")
LIGHT = HexColor("#EEF5F4")
ACCENT = HexColor("#0F766E")
ACCENT_DARK = HexColor("#0B4F4A")
RULE = HexColor("#CDD8DC")
SOFT_RULE = HexColor("#E8EEF0")


@dataclass(frozen=True)
class Entry:
    role: str
    name: str
    period: str
    link: Optional[str]
    stack: str
    bullets: Sequence[str]


class CvPdf:
    def __init__(self, output: Path) -> None:
        self.output = output
        self.c = canvas.Canvas(str(output), pagesize=A4, pageCompression=1)
        self.page = 1
        self.y = PAGE_H - TOP
        self._register_fonts()
        self.c.setTitle("Nguyen Xuan Hai - Full-Stack Developer CV")
        self.c.setAuthor("Nguyen Xuan Hai")
        self.c.setSubject("Full-Stack Developer CV - React, ASP.NET Core, NestJS, AI Integration")
        self.c.setCreator("Codex CV generator")

    def _register_fonts(self) -> None:
        pdfmetrics.registerFont(TTFont("Arial", str(FONT_REGULAR)))
        pdfmetrics.registerFont(TTFont("Arial-Bold", str(FONT_BOLD)))
        pdfmetrics.registerFont(TTFont("Arial-Italic", str(FONT_ITALIC)))

    def save(self) -> None:
        self._footer()
        self.c.save()

    def _footer(self) -> None:
        self.c.saveState()
        self.c.setStrokeColor(SOFT_RULE)
        self.c.line(MARGIN_X, BOTTOM - 8, PAGE_W - MARGIN_X, BOTTOM - 8)
        self.c.setFillColor(MUTED)
        self.c.setFont("Arial", 7.2)
        self.c.drawString(MARGIN_X, BOTTOM - 22, "Nguyen Xuan Hai | Full-Stack Developer")
        self.c.drawRightString(PAGE_W - MARGIN_X, BOTTOM - 22, f"Page {self.page}")
        self.c.restoreState()

    def new_page(self) -> None:
        self._footer()
        self.c.showPage()
        self.page += 1
        self.y = PAGE_H - TOP
        self.c.setFillColor(INK)
        self.c.setFont("Arial-Bold", 9)
        self.c.drawString(MARGIN_X, self.y, "Nguyen Xuan Hai")
        self.c.setFont("Arial", 8)
        self.c.setFillColor(MUTED)
        self.c.drawRightString(PAGE_W - MARGIN_X, self.y, "Full-Stack Developer | React | .NET | NestJS | AI")
        self.y -= 18
        self.c.setStrokeColor(SOFT_RULE)
        self.c.line(MARGIN_X, self.y, PAGE_W - MARGIN_X, self.y)
        self.y -= 20

    def ensure(self, needed: float) -> None:
        if self.y - needed < BOTTOM + 16:
            self.new_page()

    def text_width(self, text: str, font: str, size: float) -> float:
        return pdfmetrics.stringWidth(text, font, size)

    def wrap(self, text: str, width: float, font: str, size: float) -> List[str]:
        words = text.split()
        lines: List[str] = []
        current = ""
        for word in words:
            candidate = word if not current else f"{current} {word}"
            if self.text_width(candidate, font, size) <= width:
                current = candidate
                continue
            if current:
                lines.append(current)
            current = word
            while self.text_width(current, font, size) > width and len(current) > 8:
                split_at = max(8, int(len(current) * width / max(self.text_width(current, font, size), 1)))
                split_at = min(split_at, len(current) - 1)
                lines.append(current[:split_at])
                current = current[split_at:]
        if current:
            lines.append(current)
        return lines

    def draw_wrapped(
        self,
        text: str,
        x: float,
        y: float,
        width: float,
        font: str = "Arial",
        size: float = 8.7,
        color=INK,
        leading: float = 11.2,
    ) -> float:
        lines = self.wrap(text, width, font, size)
        self.c.setFont(font, size)
        self.c.setFillColor(color)
        for line in lines:
            self.c.drawString(x, y, line)
            y -= leading
        return y

    def header(self) -> None:
        self.c.saveState()
        self.c.setFillColor(LIGHT)
        self.c.roundRect(MARGIN_X, PAGE_H - 119, CONTENT_W, 80, 7, fill=1, stroke=0)
        self.c.setFillColor(ACCENT)
        self.c.rect(MARGIN_X, PAGE_H - 119, 6, 80, fill=1, stroke=0)

        x = MARGIN_X + 20
        y = PAGE_H - 61
        self.c.setFillColor(INK)
        self.c.setFont("Arial-Bold", 20)
        self.c.drawString(x, y, "Nguyễn Xuân Hải")
        self.c.setFont("Arial-Bold", 9.6)
        self.c.setFillColor(ACCENT_DARK)
        self.c.drawString(x, y - 16, "Full-Stack Developer | React | ASP.NET Core | NestJS | AI Integration")

        self.c.setFont("Arial", 8.15)
        self.c.setFillColor(MUTED)
        contact_1 = "Ho Chi Minh City, Vietnam | +84 929 501 116 | xuanhai0913750452@gmail.com"
        contact_2 = "Portfolio: https://www.hailamdev.space | GitHub: https://github.com/xuanhai0913 | LinkedIn: https://www.linkedin.com/in/xuanhai0913/"
        self.c.drawString(x, y - 32, contact_1)
        self.c.drawString(x, y - 45, contact_2)
        self._link_text(x + 37, y - 45, "https://www.hailamdev.space", 8.15, "https://www.hailamdev.space")
        self._link_text(x + 230, y - 45, "https://github.com/xuanhai0913", 8.15, "https://github.com/xuanhai0913")
        self._link_text(x + 410, y - 45, "https://www.linkedin.com/in/xuanhai0913/", 8.15, "https://www.linkedin.com/in/xuanhai0913/")
        self.c.restoreState()
        self.y = PAGE_H - 140

    def _link_text(self, x: float, y: float, text: str, size: float, url: str) -> None:
        width = self.text_width(text, "Arial", size)
        self.c.linkURL(url, (x, y - 2, x + width, y + size + 1), relative=0, thickness=0)

    def section(self, title: str, needed: float = 42) -> None:
        self.ensure(needed)
        self.y -= 2
        self.c.setFillColor(ACCENT)
        self.c.setFont("Arial-Bold", 9.4)
        self.c.drawString(MARGIN_X, self.y, title.upper())
        title_w = self.text_width(title.upper(), "Arial-Bold", 9.4)
        self.c.setStrokeColor(RULE)
        self.c.setLineWidth(0.6)
        self.c.line(MARGIN_X + title_w + 10, self.y + 3, PAGE_W - MARGIN_X, self.y + 3)
        self.y -= 14

    def key_value(self, label: str, value: str, leading: float = 10.5) -> None:
        label_font = "Arial-Bold"
        value_font = "Arial"
        size = 8.15
        label_w = self.text_width(label, label_font, size)
        x = MARGIN_X
        value_x = x + label_w + 4
        width = CONTENT_W - label_w - 4
        self.ensure(24)
        self.c.setFont(label_font, size)
        self.c.setFillColor(INK)
        self.c.drawString(x, self.y, label)
        self.y = self.draw_wrapped(value, value_x, self.y, width, value_font, size, MUTED, leading)
        self.y -= 1.5

    def summary(self) -> None:
        self.section("Professional Summary", 55)
        text = (
            "Full-stack developer building production web apps and AI-enabled tools across React/Vite, "
            "ASP.NET Core, NestJS, PostgreSQL/SQL Server, Redis and cloud deployment workflows. Experienced "
            "with LMS, CMS, B2B platforms, realtime features, authentication, content workflows, reporting/PDF "
            "generation, and recruiter-facing portfolio automation. Comfortable owning features from UI and API "
            "design through database modeling, deployment and troubleshooting."
        )
        self.y = self.draw_wrapped(text, MARGIN_X, self.y, CONTENT_W, "Arial", 8.75, INK, 11.4)
        self.y -= 4

    def skills(self) -> None:
        self.section("Technical Skills", 86)
        rows = [
            ("Frontend:", "React 18/19, Vite, JavaScript ES6+, TypeScript, React Router, Tailwind CSS, Bootstrap, HeroUI, Framer Motion, GSAP, SlateJS, PlateJS, responsive UI."),
            ("Backend:", "ASP.NET Core 8, NestJS, Node.js/Express, RESTful APIs, Entity Framework Core, TypeORM, JWT, OAuth2, ASP.NET Identity, validation, Swagger/OpenAPI."),
            ("Data & Infra:", "PostgreSQL, SQL Server, MySQL, Redis, BullMQ, Socket.IO, SignalR, Docker, IIS, Vercel, GitLab CI/CD, GitHub, pnpm, Nx monorepo."),
            ("AI & Quality:", "Google Gemini API, DeepSeek API, OpenAI API, AI assistant workflows, prompt integration, pytest, pytest-cov, linting, Serilog, QuestPDF, Cloudinary, MailKit."),
            ("Professional:", "Problem solving, communication, teamwork, time management, documentation, ownership across frontend/backend tasks."),
        ]
        for label, value in rows:
            self.key_value(label, value)
        self.y -= 2

    def entry(self, item: Entry) -> None:
        estimated = (
            78
            + max(1, len(self.wrap(f"Stack: {item.stack}", CONTENT_W, "Arial-Italic", 7.8))) * 10
            + (10 if item.link else 0)
            + sum(max(1, len(self.wrap(b, CONTENT_W - 16, "Arial", 8.35))) * 11.4 for b in item.bullets)
        )
        self.ensure(estimated)
        self.c.setFillColor(INK)
        self.c.setFont("Arial-Bold", 9)
        header = f"{item.role} - {item.name}"
        self.c.drawString(MARGIN_X, self.y, header)
        self.c.setFillColor(MUTED)
        self.c.setFont("Arial-Bold", 8)
        self.c.drawRightString(PAGE_W - MARGIN_X, self.y, item.period)
        self.y -= 11

        self.c.setFont("Arial-Italic", 7.8)
        self.c.setFillColor(ACCENT_DARK)
        self.y = self.draw_wrapped(f"Stack: {item.stack}", MARGIN_X, self.y, CONTENT_W, "Arial-Italic", 7.8, ACCENT_DARK, 10)

        if item.link:
            self.c.setFont("Arial", 7.8)
            self.c.setFillColor(MUTED)
            self.c.drawString(MARGIN_X, self.y, f"Link: {item.link}")
            self.c.linkURL(item.link, (MARGIN_X + 22, self.y - 2, MARGIN_X + 22 + self.text_width(item.link, "Arial", 7.8), self.y + 8), relative=0, thickness=0)
            self.y -= 10

        for bullet in item.bullets:
            self.bullet(bullet)
        self.y -= 5

    def bullet(self, text: str) -> None:
        self.ensure(24)
        bullet_x = MARGIN_X + 4
        text_x = MARGIN_X + 16
        self.c.setFont("Arial", 8.35)
        self.c.setFillColor(ACCENT)
        self.c.drawString(bullet_x, self.y, "-")
        self.y = self.draw_wrapped(text, text_x, self.y, CONTENT_W - 16, "Arial", 8.35, INK, 10.4)
        self.y -= 1

    def compact_section(self, title: str, rows: Iterable[Tuple[str, str]]) -> None:
        self.section(title, 58)
        for label, value in rows:
            self.key_value(label, value, 10.4)


ENTRIES: Sequence[Entry] = [
    Entry(
        role="Full-Stack Developer",
        name="Betodemy - Japanese Learning Platform",
        period="Feb 2026 - Present",
        link="https://betodemy.com",
        stack="React 19, Vite, Tailwind CSS 4, HeroUI, NestJS 11, TypeORM, PostgreSQL, Redis, BullMQ, Socket.IO, Nx, pnpm, GitLab CI/CD",
        bullets=[
            "Build and maintain modules for student portals, teacher-led online classes, admin workflows, gamified practice, and multilingual learning content.",
            "Develop interactive exercise blocks and rich editor workflows with SlateJS/PlateJS, plus realtime classroom and background job features with Socket.IO, Redis and BullMQ.",
            "Work across frontend, backend, database and CI/CD boundaries in an Nx monorepo, keeping features consistent with existing architecture and coding standards.",
        ],
    ),
    Entry(
        role="Full-Stack Developer / Volunteer",
        name="ECH English Community House - LMS",
        period="Oct 2024 - Present",
        link="https://ech.edu.vn",
        stack="ASP.NET Core 8 MVC/API, Entity Framework Core, SQL Server, Bootstrap 5, JavaScript, ASP.NET Identity, JWT, Cloudinary, MailKit, QuestPDF, ClosedXML, IIS",
        bullets=[
            "Developed a learning management system for a community English program serving disabled learners and people in difficult circumstances.",
            "Implemented course/content management, role-based access, secure authentication, media storage, email notifications, certificate generation and Excel/PDF reporting.",
            "Supported deployment and operations on Windows IIS with Swagger/OpenAPI documentation and maintainable service integrations.",
        ],
    ),
    Entry(
        role="Full-Stack Developer",
        name="VN Media Hub - CMS & Media Platform",
        period="Oct 2024 - Jan 2026",
        link="https://vnmediahub.com",
        stack="React 18, Vite, ASP.NET Core 8 Web API, Entity Framework Core, SQL Server, JWT, Google OAuth2, reCAPTCHA v3, Redis/Memory Cache, Serilog, Docker, QuestPDF",
        bullets=[
            "Built a CMS/media platform covering content management, authentication, moderation, SEO-friendly publishing and automated PDF/report exports.",
            "Improved reliability and performance with structured logging, cache layers, Brotli/Gzip compression, image optimization and API documentation.",
        ],
    ),
    Entry(
        role="Full-Stack Developer",
        name="Great Link Mai House - Digital Publishing Platform",
        period="Jul 2025 - Present",
        link="https://greatlinkmaihouse.com",
        stack="ASP.NET Core 8, React 18, SignalR, SQL Server, JWT, Google OAuth, Cloudinary, SendGrid, OpenAI API",
        bullets=[
            "Rebuilt a business publishing platform with a modern API/frontend architecture, secure authentication, realtime features and third-party service integrations.",
            "Delivered production-facing features for a media and B2B environment with attention to scalability, maintainability and operational handoff.",
        ],
    ),
    Entry(
        role="macOS / AI Developer",
        name="Vision Key - AI Screen Assistant",
        period="Dec 2025",
        link="https://visionpremium.hailamdev.space",
        stack="Swift 5.9+, SwiftUI, AppKit, Google Gemini 2.5 Pro API, Carbon global hotkey, macOS Keychain, Chrome extensions",
        bullets=[
            "Built a macOS AI screen assistant with secure API key storage, global hotkeys and Gemini-powered workflows for on-screen productivity.",
            "Published supporting landing page and browser extension repositories for standard and premium usage flows.",
        ],
    ),
    Entry(
        role="Frontend / Python Developer",
        name="Portfolio AI Assistant & LLM Unit Test Generator",
        period="Mar 2025 - Present",
        link="https://www.hailamdev.space",
        stack="React, JavaScript, Three.js, GSAP, Gemini/DeepSeek APIs, Python 3.8+, pytest, pytest-cov, Black, Flake8, Pylint, Mypy, Vercel",
        bullets=[
            "Enhanced personal portfolio with an AI assistant that answers recruiter questions about CV, projects, contact details and job-fit context.",
            "Built an LLM-powered unit test generation project using DeepSeek API, Python tooling, coverage reporting and code-quality checks.",
        ],
    ),
]


def build() -> None:
    pdf = CvPdf(OUTPUT)
    pdf.header()
    pdf.summary()
    pdf.skills()
    pdf.section("Selected Experience & Projects", 130)
    for item in ENTRIES:
        pdf.entry(item)

    pdf.compact_section(
        "Education",
        [
            (
                "Ho Chi Minh City University of Transport:",
                "Information Technology major, 2022 - 2026. Coursework and projects focused on practical software development, web systems and applied programming.",
            )
        ],
    )
    pdf.compact_section(
        "Certifications & Activities",
        [
            (
                "Google / AI:",
                "Gemini Certified University Student; Gemini Certified Faculty; Google AI for K12 Educators; Code a Joke-Telling Talkbot.",
            ),
            (
                "Additional:",
                "Basic Office Information Technology; Certificate in Accounting and Auditing; Volunteer Participation Certificate; English Community House volunteer.",
            ),
        ],
    )
    pdf.save()
    normalize_pdf(OUTPUT)


def normalize_pdf(path: Path) -> None:
    """Rewrite the PDF cross-reference table so PDF renderers do not warn."""
    temp_path = path.with_suffix(".tmp.pdf")
    reader = PdfReader(str(path))
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)
    writer.add_metadata(
        {
            "/Title": "Nguyen Xuan Hai - Full-Stack Developer CV",
            "/Author": "Nguyen Xuan Hai",
            "/Subject": "Full-Stack Developer CV - React, ASP.NET Core, NestJS, AI Integration",
            "/Creator": "Codex CV generator",
        }
    )
    with temp_path.open("wb") as f:
        writer.write(f)
    temp_path.replace(path)


if __name__ == "__main__":
    build()

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
        self.c.drawRightString(PAGE_W - MARGIN_X, self.y, "Full-Stack Developer | React | .NET | Odoo | AI")
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
        self.c.drawString(x, y - 16, "Full-Stack Developer | React | ASP.NET Core | Odoo 18 | AI Integration")

        self.c.setFont("Arial", 8.15)
        self.c.setFillColor(MUTED)
        contact_1 = "Ho Chi Minh City, Vietnam | Date of Birth: 29/11/2004 | 0929501116 | xuanhai0913750452@gmail.com"
        portfolio_text = "my-portfolio-nxh.vercel.app"
        github_text = "github.com/xuanhai0913"
        linkedin_text = "linkedin.com/in/xuanhai0913"
        contact_2 = f"Portfolio: {portfolio_text} | GitHub: {github_text} | LinkedIn: {linkedin_text}"
        self.c.drawString(x, y - 32, contact_1)
        self.c.drawString(x, y - 45, contact_2)
        portfolio_x = x + self.text_width("Portfolio: ", "Arial", 8.15)
        github_x = portfolio_x + self.text_width(f"{portfolio_text} | GitHub: ", "Arial", 8.15)
        linkedin_x = github_x + self.text_width(f"{github_text} | LinkedIn: ", "Arial", 8.15)
        self._link_text(portfolio_x, y - 45, portfolio_text, 8.15, "https://my-portfolio-nxh.vercel.app")
        self._link_text(github_x, y - 45, github_text, 8.15, "https://github.com/xuanhai0913")
        self._link_text(linkedin_x, y - 45, linkedin_text, 8.15, "https://www.linkedin.com/in/xuanhai0913/")
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
            "Full-stack developer building production web apps, ERP workflows and AI-enabled tools across React/Vite, "
            "ASP.NET Core, Python/Odoo 18, NestJS, PostgreSQL/SQL Server and cloud deployment workflows. Experienced "
            "with automotive dealership ERP, CMS, B2B platforms, LMS/community projects, realtime features, authentication, reporting/PDF "
            "generation and localization. Comfortable owning features from UI and API design through database modeling, "
            "deployment and troubleshooting."
        )
        self.y = self.draw_wrapped(text, MARGIN_X, self.y, CONTENT_W, "Arial", 8.75, INK, 11.4)
        self.y -= 4

    def skills(self) -> None:
        self.section("Skills", 86)
        rows = [
            ("Frontend:", "React 18/19, Vite, JavaScript ES6+, TypeScript, React Router, Tailwind CSS, Bootstrap, HeroUI, Framer Motion, GSAP, SlateJS, PlateJS, responsive UI."),
            ("Backend:", "Python 3.12, Odoo 18, ASP.NET Core 8, NestJS, Node.js/Express, RESTful APIs, Entity Framework Core, TypeORM, JWT, OAuth2, ASP.NET Identity, Swagger/OpenAPI."),
            ("ERP & Reporting:", "Odoo ORM, QWeb/XML, wkhtmltopdf, gettext i18n, TT200 accounting workflows, PostgreSQL, SQL Server, MySQL, QuestPDF, ClosedXML."),
            ("Data & Infra:", "PostgreSQL, SQL Server, Redis, BullMQ, Socket.IO, SignalR, Docker, IIS, Vercel, GitLab CI/CD, GitHub, pnpm, Nx monorepo."),
            ("AI & Quality:", "Google Gemini API, DeepSeek API, OpenAI API, AI assistant workflows, pytest, pytest-cov, linting, Serilog, Cloudinary, MailKit."),
            ("Professional:", "Problem solving, communication, teamwork, time management, documentation, ownership across frontend/backend tasks."),
        ]
        for label, value in rows:
            self.key_value(label, value)
        self.y -= 2

    def entry(self, item: Entry) -> None:
        estimated = (
            88
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

        self.c.setFont("Arial", 7.9)
        self.c.setFillColor(MUTED)
        self.c.drawString(MARGIN_X, self.y, f"My position: {item.role}")
        self.y -= 10

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


WORK_ENTRIES: Sequence[Entry] = [
    Entry(
        role="Full-Stack Developer",
        name="Betodemy - Japanese Learning Platform",
        period="Start: Feb 2026 | End: Present",
        link="https://betodemy.com",
        stack="React 19, Vite, Tailwind CSS 4, HeroUI, NestJS 11, TypeORM, PostgreSQL, Redis, BullMQ, Socket.IO, Nx, pnpm, GitLab CI/CD",
        bullets=[
            "Assigned to build and maintain product modules for student portals, teacher-led online classes, admin workflows, gamified practice and multilingual learning content.",
            "Develop interactive exercise blocks, rich editor workflows with SlateJS/PlateJS, realtime classroom features and background jobs using Socket.IO, Redis and BullMQ.",
            "Coordinate frontend, backend, database and CI/CD changes inside an Nx monorepo, keeping new work aligned with existing architecture and code standards.",
        ],
    ),
    Entry(
        role="Full-Stack Developer Intern",
        name="AI Power - Automotive Dealership ERP",
        period="Start: May 2026 | End: Jul 2026",
        link="https://aipower.vn/vi",
        stack="Python 3.12, Odoo 18, PostgreSQL, QWeb/XML, wkhtmltopdf, Docker, GitLab CI/CD, gettext i18n",
        bullets=[
            "Assigned to support an Odoo 18 ERP for automotive dealerships in Vietnam, covering sales, an 18-state after-sales service workflow, spare parts, warranty and TT200 accounting.",
            "Implemented and adjusted business logic, data models, QWeb/XML views, localized PDF reports and gettext translations across 18 custom modules and 99+ Python files.",
            "Used Dockerized development and GitLab CI workflows to deliver changes consistently within an established ERP codebase and reduce handoff friction with the team.",
        ],
    ),
    Entry(
        role="Full-Stack Developer",
        name="Great Link Mai House - Digital Publishing Platform",
        period="Start: Jul 2025 | End: May 2026",
        link="https://greatlinkmaihouse.com",
        stack="ASP.NET Core 8, React 18, SignalR, SQL Server, JWT, Google OAuth, Cloudinary, SendGrid, OpenAI API",
        bullets=[
            "Worked on a business publishing platform with a modern API/frontend architecture for media and B2B use cases.",
            "Built production-facing features around secure authentication, realtime updates, media handling and third-party service integrations.",
            "Supported maintainable delivery by keeping API, frontend and integration work aligned with deployment and handoff needs.",
        ],
    ),
    Entry(
        role="Full-Stack Developer",
        name="VN Media Hub - CMS & Media Platform",
        period="Start: Oct 2024 | End: Jan 2026",
        link="https://vnmediahub.com",
        stack="React 18, Vite, ASP.NET Core 8 Web API, Entity Framework Core, SQL Server, JWT, Google OAuth2, reCAPTCHA v3, Redis/Memory Cache, Serilog, Docker, QuestPDF",
        bullets=[
            "Assigned to build a CMS/media platform covering content management, authentication, moderation, SEO-friendly publishing and automated PDF/report exports.",
            "Implemented frontend and backend features with React and ASP.NET Core, including auth flows, content workflows, cache layers, structured logging and report generation.",
            "Improved operational readiness with API documentation, compression, image optimization and maintainable production-facing delivery practices.",
        ],
    ),
]

PROJECT_ENTRIES: Sequence[Entry] = [
    Entry(
        role="Full-Stack Developer / Volunteer",
        name="ECH English Community House - LMS",
        period="Start: Oct 2024 | End: Jan 2026",
        link="https://ech.edu.vn",
        stack="ASP.NET Core 8 MVC/API, Entity Framework Core, SQL Server, Bootstrap 5, JavaScript, ASP.NET Identity, JWT, Cloudinary, MailKit, QuestPDF, ClosedXML, IIS",
        bullets=[
            "Task: support an LMS for a community English program serving disabled learners and people in difficult circumstances.",
            "Action: built course/content management, secure authentication, certificate generation, media storage, email notifications and Excel/PDF reporting.",
            "Result: helped create a more maintainable learning platform for volunteer teaching and community operations.",
        ],
    ),
    Entry(
        role="macOS / AI Developer",
        name="Vision Key - AI Screen Assistant",
        period="Start: Dec 2025 | End: Dec 2025",
        link="https://landing-vision-premium.vercel.app",
        stack="Swift 5.9+, SwiftUI, AppKit, Google Gemini 2.5 Pro API, Carbon global hotkey, macOS Keychain, Chrome extensions",
        bullets=[
            "Task: prototype an AI screen assistant for on-screen productivity and quick contextual assistance.",
            "Action: built secure API key storage, global hotkeys and Gemini-powered workflows with SwiftUI/AppKit.",
            "Result: published the supporting landing page and browser extension repositories for product presentation.",
        ],
    ),
    Entry(
        role="Frontend / Python Developer",
        name="Portfolio AI Assistant & LLM Unit Test Generator",
        period="Start: Mar 2025 | End: May 2026",
        link="https://my-portfolio-nxh.vercel.app",
        stack="React, JavaScript, Three.js, GSAP, Gemini/DeepSeek APIs, Python 3.8+, pytest, pytest-cov, Black, Flake8, Pylint, Mypy, Vercel",
        bullets=[
            "Task: make portfolio information easier for recruiters to explore and automate unit-test drafting for Python code.",
            "Action: built a Gemini-powered portfolio assistant and an LLM unit-test generator using DeepSeek API, pytest and coverage tooling.",
            "Result: improved recruiter-facing project discovery and created reusable AI-assisted testing workflows.",
        ],
    ),
]

ENTRIES: Sequence[Entry] = [*WORK_ENTRIES, *PROJECT_ENTRIES]


def build() -> None:
    pdf = CvPdf(OUTPUT)
    pdf.header()
    pdf.summary()
    pdf.compact_section(
        "Education",
        [
            (
                "UTH - University of Transport Ho Chi Minh City:",
                "Information Technology major, 2022 - 2026. Higher education: University level. Coursework and projects focused on practical software development, web systems and applied programming.",
            )
        ],
    )
    pdf.skills()
    pdf.section("Work Experience", 130)
    for item in WORK_ENTRIES:
        pdf.entry(item)

    pdf.section("Selected Projects", 190)
    for item in PROJECT_ENTRIES:
        pdf.entry(item)

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

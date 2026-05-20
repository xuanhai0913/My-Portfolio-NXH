#!/usr/bin/env python3
"""Generate a visual, HR-friendly CV variant with a profile photo."""

from __future__ import annotations

from pathlib import Path
from typing import Iterable, List, Optional, Sequence, Tuple

from pypdf import PdfReader, PdfWriter
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

from generate_cv_pdf import ENTRIES


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "CV_NguyenXuanHai_visual.pdf"
PROFILE_IMAGE = ROOT / "scripts" / "assets" / "nguyen_xuan_hai_profile.png"

FONT_DIR = Path("/System/Library/Fonts/Supplemental")
PAGE_W, PAGE_H = A4

NAVY = HexColor("#132238")
NAVY_2 = HexColor("#1D3557")
INK = HexColor("#142033")
MUTED = HexColor("#516173")
SUBTLE = HexColor("#EFF5F5")
PAPER = HexColor("#FBFCFD")
TEAL = HexColor("#0F766E")
TEAL_DARK = HexColor("#0B4F4A")
TEAL_SOFT = HexColor("#DDEDEA")
GOLD = HexColor("#C47F2F")
LINE = HexColor("#D5DEE3")
WHITE = HexColor("#FFFFFF")

LEFT_X = 34
SIDEBAR_W = 156
MAIN_X = 214
MAIN_W = PAGE_W - MAIN_X - 36
TOP = 38
BOTTOM = 36


class VisualCv:
    def __init__(self, output: Path) -> None:
        self.output = output
        self.c = canvas.Canvas(str(output), pagesize=A4, pageCompression=1)
        self.page = 1
        self.y = PAGE_H - TOP
        self._register_fonts()
        self.c.setTitle("Nguyen Xuan Hai - Visual CV")
        self.c.setAuthor("Nguyen Xuan Hai")
        self.c.setSubject("Visual Full-Stack Developer CV with profile photo")
        self.c.setCreator("Codex visual CV generator")

    def _register_fonts(self) -> None:
        pdfmetrics.registerFont(TTFont("Arial", str(FONT_DIR / "Arial.ttf")))
        pdfmetrics.registerFont(TTFont("Arial-Bold", str(FONT_DIR / "Arial Bold.ttf")))
        pdfmetrics.registerFont(TTFont("Arial-Italic", str(FONT_DIR / "Arial Italic.ttf")))

    def save(self) -> None:
        self.c.save()
        normalize_pdf(self.output)

    def width(self, text: str, font: str, size: float) -> float:
        return pdfmetrics.stringWidth(text, font, size)

    def wrap(self, text: str, width: float, font: str, size: float) -> List[str]:
        words = text.split()
        lines: List[str] = []
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
        size: float = 8.4,
        color=INK,
        leading: float = 10.8,
    ) -> float:
        self.c.setFont(font, size)
        self.c.setFillColor(color)
        for line in self.wrap(text, width, font, size):
            self.c.drawString(x, y, line)
            y -= leading
        return y

    def link(self, x: float, y: float, text: str, url: str, font: str = "Arial", size: float = 7.2) -> None:
        self.c.linkURL(url, (x, y - 2, x + self.width(text, font, size), y + size + 1), relative=0, thickness=0)

    def draw_shell(self, page_label: str) -> None:
        self.c.setFillColor(PAPER)
        self.c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
        self.c.setFillColor(NAVY)
        self.c.roundRect(LEFT_X, BOTTOM, SIDEBAR_W, PAGE_H - BOTTOM - TOP, 12, fill=1, stroke=0)
        self.c.setFillColor(TEAL)
        self.c.roundRect(LEFT_X, PAGE_H - TOP - 34, SIDEBAR_W, 34, 12, fill=1, stroke=0)
        self.c.rect(LEFT_X, PAGE_H - TOP - 34, SIDEBAR_W, 17, fill=1, stroke=0)

        self.c.setStrokeColor(LINE)
        self.c.setLineWidth(0.6)
        self.c.line(MAIN_X, BOTTOM + 4, PAGE_W - 36, BOTTOM + 4)
        self.c.setFillColor(MUTED)
        self.c.setFont("Arial", 7.5)
        self.c.drawRightString(PAGE_W - 36, BOTTOM - 10, page_label)

    def sidebar_title(self, title: str, x: float, y: float) -> float:
        self.c.setFillColor(WHITE)
        self.c.setFont("Arial-Bold", 8.8)
        self.c.drawString(x, y, title.upper())
        self.c.setStrokeColor(HexColor("#36516D"))
        self.c.line(x, y - 5, x + SIDEBAR_W - 32, y - 5)
        return y - 18

    def sidebar_line(self, label: str, value: str, x: float, y: float, url: Optional[str] = None) -> float:
        self.c.setFillColor(HexColor("#A8B7C7"))
        self.c.setFont("Arial-Bold", 6.9)
        self.c.drawString(x, y, label.upper())
        y -= 9
        self.c.setFillColor(WHITE)
        self.c.setFont("Arial", 7.35)
        for line in self.wrap(value, SIDEBAR_W - 30, "Arial", 7.35):
            self.c.drawString(x, y, line)
            if url:
                self.link(x, y, line, url, "Arial", 7.35)
            y -= 9
        return y - 4

    def sidebar_bullets(self, rows: Sequence[str], x: float, y: float) -> float:
        self.c.setFont("Arial", 7.25)
        for row in rows:
            self.c.setFillColor(TEAL_SOFT)
            self.c.circle(x + 2, y + 2, 1.5, fill=1, stroke=0)
            self.c.setFillColor(WHITE)
            self.c.drawString(x + 9, y, row)
            y -= 10
        return y - 4

    def draw_page1_sidebar(self) -> None:
        x = LEFT_X + 16
        y = PAGE_H - TOP - 58
        image_x = LEFT_X + SIDEBAR_W / 2 - 44
        image_y = y - 80
        self.c.drawImage(ImageReader(str(PROFILE_IMAGE)), image_x, image_y, 88, 88)
        self.c.setStrokeColor(TEAL_SOFT)
        self.c.setLineWidth(2)
        self.c.circle(LEFT_X + SIDEBAR_W / 2, y - 36, 48, fill=0, stroke=1)
        y -= 108
        self.c.setFillColor(WHITE)
        self.c.setFont("Arial-Bold", 12.2)
        self.c.drawCentredString(LEFT_X + SIDEBAR_W / 2, y, "Nguyễn Xuân Hải")
        y -= 13
        self.c.setFillColor(TEAL_SOFT)
        self.c.setFont("Arial-Bold", 7.4)
        self.c.drawCentredString(LEFT_X + SIDEBAR_W / 2, y, "FULL-STACK DEVELOPER")
        y -= 24

        y = self.sidebar_title("Contact", x, y)
        y = self.sidebar_line("Phone", "+84 929 501 116", x, y)
        y = self.sidebar_line("Email", "xuanhai0913750452@gmail.com", x, y)
        y = self.sidebar_line("Location", "Ho Chi Minh City, Vietnam", x, y)
        y = self.sidebar_line("Portfolio", "hailamdev.space", x, y, "https://www.hailamdev.space")
        y = self.sidebar_line("GitHub", "github.com/xuanhai0913", x, y, "https://github.com/xuanhai0913")
        y = self.sidebar_line("LinkedIn", "linkedin.com/in/xuanhai0913", x, y, "https://www.linkedin.com/in/xuanhai0913/")

        y -= 4
        y = self.sidebar_title("Best Match Roles", x, y)
        y = self.sidebar_bullets(
            [
                "Full-Stack Developer",
                "React Developer",
                ".NET / NestJS Developer",
                "AI Integration Engineer",
            ],
            x,
            y,
        )

        y = self.sidebar_title("Core Stack", x, y)
        y = self.sidebar_bullets(
            [
                "React 18/19, Vite",
                "ASP.NET Core 8",
                "NestJS, Node.js",
                "PostgreSQL, SQL Server",
                "Redis, BullMQ, Socket.IO",
                "Gemini, DeepSeek, OpenAI",
                "Docker, Vercel, CI/CD",
            ],
            x,
            y,
        )

    def draw_page2_sidebar(self) -> None:
        x = LEFT_X + 16
        y = PAGE_H - TOP - 58
        self.c.setFillColor(WHITE)
        self.c.setFont("Arial-Bold", 13)
        self.c.drawString(x, y, "Nguyễn Xuân Hải")
        y -= 14
        self.c.setFillColor(TEAL_SOFT)
        self.c.setFont("Arial-Bold", 7.3)
        self.c.drawString(x, y, "PROJECT EVIDENCE")
        y -= 24

        y = self.sidebar_title("Links", x, y)
        links = [
            ("Portfolio", "hailamdev.space", "https://www.hailamdev.space"),
            ("Betodemy", "betodemy.com", "https://betodemy.com"),
            ("ECH", "ech.edu.vn", "https://ech.edu.vn"),
            ("VN Media Hub", "vnmediahub.com", "https://vnmediahub.com"),
            ("Vision Key", "visionpremium.hailamdev.space", "https://visionpremium.hailamdev.space"),
        ]
        for label, value, url in links:
            y = self.sidebar_line(label, value, x, y, url)

        y -= 2
        y = self.sidebar_title("Certifications", x, y)
        y = self.sidebar_bullets(
            [
                "Gemini Certified Student",
                "Gemini Certified Faculty",
                "Google AI for K12",
                "Code a Joke-Telling Talkbot",
                "Basic Office IT",
            ],
            x,
            y,
        )

        y = self.sidebar_title("Working Style", x, y)
        y = self.sidebar_bullets(
            [
                "Owns UI to API delivery",
                "Writes practical docs",
                "Comfortable with CI/CD",
                "Community volunteer work",
            ],
            x,
            y,
        )

    def header(self) -> None:
        y = PAGE_H - 56
        self.c.setFillColor(INK)
        self.c.setFont("Arial-Bold", 24)
        self.c.drawString(MAIN_X, y, "Nguyễn Xuân Hải")
        y -= 17
        self.c.setFillColor(TEAL_DARK)
        self.c.setFont("Arial-Bold", 9.5)
        self.c.drawString(MAIN_X, y, "Full-Stack Developer | React | ASP.NET Core | NestJS | AI Integration")
        y -= 17
        self.c.setFillColor(MUTED)
        self.c.setFont("Arial", 8)
        self.c.drawString(MAIN_X, y, "Building production LMS, CMS, B2B platforms and AI-powered developer tools.")
        y -= 22
        self.c.setFillColor(TEAL_DARK)
        self.c.roundRect(MAIN_X, y - 41, MAIN_W, 52, 8, fill=1, stroke=0)
        self.c.setFillColor(WHITE)
        self.c.setFont("Arial-Bold", 8.4)
        self.c.drawString(MAIN_X + 12, y - 4, "Recruiter Snapshot")
        snapshot = (
            "2+ years shipping real products across frontend, backend, databases, auth, realtime features, reporting, "
            "deployment and AI integration. Strong fit for junior/mid full-stack roles needing React + .NET/NestJS execution."
        )
        self.text(snapshot, MAIN_X + 12, y - 17, MAIN_W - 24, "Arial", 7.75, WHITE, 9.4)
        self.y = y - 60

    def metric_cards(self) -> None:
        cards = [
            ("2+ yrs", "hands-on product work"),
            ("9+ projects", "portfolio & production apps"),
            ("Full stack", "UI, API, data, deploy"),
        ]
        card_w = (MAIN_W - 14) / 3
        y = self.y
        for i, (big, small) in enumerate(cards):
            x = MAIN_X + i * (card_w + 7)
            self.c.setFillColor(WHITE)
            self.c.roundRect(x, y - 43, card_w, 40, 7, fill=1, stroke=0)
            self.c.setStrokeColor(LINE)
            self.c.roundRect(x, y - 43, card_w, 40, 7, fill=0, stroke=1)
            self.c.setFillColor(GOLD if i == 1 else TEAL)
            self.c.setFont("Arial-Bold", 13)
            self.c.drawString(x + 9, y - 18, big)
            self.c.setFillColor(MUTED)
            self.c.setFont("Arial", 6.9)
            self.c.drawString(x + 9, y - 31, small)
        self.y -= 56

    def section(self, title: str) -> None:
        self.c.setFillColor(INK)
        self.c.setFont("Arial-Bold", 11)
        self.c.drawString(MAIN_X, self.y, title.upper())
        self.c.setFillColor(TEAL)
        self.c.rect(MAIN_X, self.y - 6, 28, 2, fill=1, stroke=0)
        self.c.setStrokeColor(LINE)
        self.c.line(MAIN_X + 36, self.y - 5, PAGE_W - 36, self.y - 5)
        self.y -= 18

    def bullet(self, text: str, x: float, y: float, width: float) -> float:
        self.c.setFillColor(TEAL)
        self.c.circle(x + 3, y + 3, 1.5, fill=1, stroke=0)
        return self.text(text, x + 11, y, width - 11, "Arial", 7.65, INK, 9.6) - 1

    def entry_card(self, role: str, name: str, period: str, stack: str, bullets: Sequence[str], link: Optional[str] = None) -> None:
        title = f"{role} - {name}"
        title_w = MAIN_W - 26
        title_lines = self.wrap(title, title_w, "Arial-Bold", 8.35)
        stack_lines = self.wrap(f"Stack: {stack}", MAIN_W - 26, "Arial-Italic", 6.95)
        bullet_lines = [self.wrap(bullet, MAIN_W - 37, "Arial", 7.55) for bullet in bullets]
        card_h = (
            18
            + len(title_lines) * 9.4
            + 9
            + len(stack_lines) * 8.2
            + (9 if link else 0)
            + sum(max(1, len(lines)) * 9.2 + 2 for lines in bullet_lines)
            + 10
        )
        self.c.setFillColor(WHITE)
        self.c.roundRect(MAIN_X, self.y - card_h, MAIN_W, card_h, 8, fill=1, stroke=0)
        self.c.setStrokeColor(HexColor("#DFE7EA"))
        self.c.roundRect(MAIN_X, self.y - card_h, MAIN_W, card_h, 8, fill=0, stroke=1)
        self.c.setFillColor(TEAL)
        self.c.roundRect(MAIN_X, self.y - card_h, 5, card_h, 8, fill=1, stroke=0)
        self.c.rect(MAIN_X, self.y - card_h + 8, 5, card_h - 16, fill=1, stroke=0)

        x = MAIN_X + 13
        y = self.y - 14
        self.c.setFillColor(INK)
        self.c.setFont("Arial-Bold", 8.35)
        for line in title_lines:
            self.c.drawString(x, y, line)
            y -= 9.4
        self.c.setFillColor(TEAL_DARK)
        self.c.setFont("Arial-Bold", 7.25)
        self.c.drawString(x, y, period)
        y -= 9
        self.text(f"Stack: {stack}", x, y, MAIN_W - 26, "Arial-Italic", 6.95, TEAL_DARK, 8.2)
        y -= max(8.2, len(stack_lines) * 8.2)
        if link:
            self.c.setFillColor(MUTED)
            self.c.setFont("Arial", 6.9)
            self.c.drawString(x, y, f"Link: {link}")
            self.link(x + 20, y, link, link, "Arial", 6.9)
            y -= 9
        for bullet in bullets:
            y = self.bullet(bullet, x, y, MAIN_W - 26)
        self.y -= card_h + 10

    def two_column_skills(self) -> None:
        rows = [
            ("Frontend", "React 18/19, Vite, JavaScript, TypeScript, Tailwind CSS, Bootstrap, HeroUI, GSAP, Framer Motion, Three.js, SlateJS."),
            ("Backend", "ASP.NET Core 8, NestJS, Node.js/Express, REST APIs, EF Core, TypeORM, JWT, OAuth2, ASP.NET Identity."),
            ("Data & Infra", "PostgreSQL, SQL Server, MySQL, Redis, BullMQ, Socket.IO, SignalR, Docker, IIS, Vercel, GitLab CI/CD, Nx."),
            ("AI & Quality", "Gemini API, DeepSeek API, OpenAI API, AI assistant workflows, pytest, coverage, linting, Serilog, QuestPDF."),
        ]
        x1 = MAIN_X
        x2 = MAIN_X + MAIN_W / 2 + 8
        w = MAIN_W / 2 - 8
        y_start = self.y
        heights = []
        for _, body in rows:
            heights.append(31 + len(self.wrap(body, w - 18, "Arial", 7.15)) * 8.4)
        for i, (title, body) in enumerate(rows):
            x = x1 if i % 2 == 0 else x2
            y = y_start if i < 2 else y_start - max(heights[:2]) - 8
            h = heights[i]
            self.c.setFillColor(WHITE)
            self.c.roundRect(x, y - h, w, h, 7, fill=1, stroke=0)
            self.c.setStrokeColor(LINE)
            self.c.roundRect(x, y - h, w, h, 7, fill=0, stroke=1)
            self.c.setFillColor(TEAL_DARK)
            self.c.setFont("Arial-Bold", 8)
            self.c.drawString(x + 9, y - 13, title)
            self.text(body, x + 9, y - 25, w - 18, "Arial", 7.15, MUTED, 8.4)
        self.y = y_start - max(heights[:2]) - max(heights[2:]) - 22

    def education_and_certs(self) -> None:
        self.c.setFillColor(WHITE)
        h = 92
        self.c.roundRect(MAIN_X, self.y - h, MAIN_W, h, 8, fill=1, stroke=0)
        self.c.setStrokeColor(LINE)
        self.c.roundRect(MAIN_X, self.y - h, MAIN_W, h, 8, fill=0, stroke=1)
        x = MAIN_X + 12
        y = self.y - 15
        self.c.setFillColor(INK)
        self.c.setFont("Arial-Bold", 8.6)
        self.c.drawString(x, y, "Education")
        y = self.text(
            "Ho Chi Minh City University of Transport - Information Technology major, 2022 - 2026.",
            x,
            y - 11,
            MAIN_W - 24,
            "Arial",
            7.4,
            MUTED,
            9,
        )
        y -= 3
        self.c.setFillColor(INK)
        self.c.setFont("Arial-Bold", 8.6)
        self.c.drawString(x, y, "Certifications & Activities")
        self.text(
            "Gemini Certified University Student; Gemini Certified Faculty; Google AI for K12 Educators; Code a Joke-Telling Talkbot; Basic Office IT; Accounting and Auditing; English Community House volunteer.",
            x,
            y - 11,
            MAIN_W - 24,
            "Arial",
            7.4,
            MUTED,
            9,
        )
        self.y -= h + 8


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
            "/Subject": "Visual Full-Stack Developer CV with profile photo",
            "/Creator": "Codex visual CV generator",
        }
    )
    with temp_path.open("wb") as f:
        writer.write(f)
    temp_path.replace(path)


def build() -> None:
    if not PROFILE_IMAGE.exists():
        raise FileNotFoundError(f"Missing profile image: {PROFILE_IMAGE}")

    pdf = VisualCv(OUTPUT)
    pdf.draw_shell("Visual CV | Page 1")
    pdf.draw_page1_sidebar()
    pdf.header()
    pdf.metric_cards()
    pdf.section("Selected Experience")

    for item in ENTRIES[:3]:
        pdf.entry_card(
            item.role,
            item.name,
            item.period,
            item.stack,
            item.bullets[:2],
            item.link,
        )

    pdf.c.showPage()
    pdf.page = 2
    pdf.draw_shell("Visual CV | Page 2")
    pdf.draw_page2_sidebar()
    pdf.y = PAGE_H - TOP - 48
    pdf.section("More Experience & AI Projects")
    for item in ENTRIES[3:]:
        pdf.entry_card(
            item.role,
            item.name,
            item.period,
            item.stack,
            item.bullets,
            item.link,
        )

    pdf.section("Technical Matrix")
    pdf.two_column_skills()
    pdf.section("Education, Certifications & Community")
    pdf.education_and_certs()
    pdf.save()


if __name__ == "__main__":
    build()

#!/usr/bin/env python3
"""Generate Nguyen Xuan Hai's ATS-friendly portfolio CV as a PDF."""

from __future__ import annotations

import argparse
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
OUTPUT_EN = ROOT / "public" / "CV_NguyenXuanHai.pdf"
OUTPUT_VI = ROOT / "public" / "CV_NguyenXuanHai_vi.pdf"
# Keep the English file name as the backward-compatible default for existing links.
OUTPUT = OUTPUT_EN

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


CV_COPY = {
    "en": {
        "document_title": "Nguyen Xuan Hai - Full-Stack Developer CV",
        "document_subject": "Full-Stack Developer CV - React, ASP.NET Core, NestJS, PostgreSQL",
        "name": "Nguyen Xuan Hai",
        "role": "Full-Stack Developer | React | ASP.NET Core | NestJS | PostgreSQL",
        "location": "Ho Chi Minh City, Vietnam",
        "date_of_birth": "Date of Birth",
        "portfolio": "Portfolio",
        "github": "GitHub",
        "linkedin": "LinkedIn",
        "summary_section": "Professional Summary",
        "skills_section": "Core Skills",
        "education_section": "Education",
        "experience_section": "Work Experience",
        "projects_section": "Independent Projects",
        "certifications_section": "Certifications & Language",
        "position": "My position",
        "stack": "Stack",
        "link": "Link",
        "footer_role": "Full-Stack Developer",
        "page": "Page",
        "summary": (
            "Full-stack developer with commercial software delivery experience since October 2024 through commercial product work and an ERP internship. "
            "Builds production React, ASP.NET Core, NestJS and Odoo workflows from requirement clarification through release and support. "
            "Hands-on with authentication, CMS, realtime features, ERP business logic, PostgreSQL and SQL Server; uses AI coding tools "
            "selectively for review, test drafting and delivery support."
        ),
        "skill_rows": [
            ("Frontend:", "React 18/19, TypeScript, JavaScript ES6+, Vite, React Router, Tailwind CSS, responsive component UI."),
            ("Backend:", "C#, ASP.NET Core 8 Web API/MVC, Entity Framework Core, NestJS 11, Node.js/Express, RESTful APIs, JWT, OAuth2, Swagger/OpenAPI."),
            ("ERP & Data:", "Python 3.12, Odoo 18 ORM, QWeb/XML, PostgreSQL, SQL Server, Redis, TT200 accounting workflows."),
            ("Architecture & Quality:", "Dependency injection, service/repository separation, DTO validation, RBAC, CSRF, rate limiting, Jest, structured logging."),
            ("Delivery:", "Docker, GitLab CI/CD, GitHub Actions, IIS, Vercel, Git, Nx monorepo, issue/MR and release handoff workflows."),
            ("Developer Tools:", "Claude Code and Codex for codebase context, review, test drafting and documentation; engineering decisions verified in code and tests."),
        ],
        "education": (
            "Ho Chi Minh City University of Transport (UTH):",
            "Information Technology, 2022 - Expected 2026 | GPA: 3.24/4.00. Coursework and projects focused on software development, OOP, databases and web systems.",
        ),
        "certifications": [
            ("AWS Training:", "AWS Cloud Practitioner Essentials; Getting into the Serverless Mindset - Completion Certificates (Jul 2026)."),
            ("AWS Training Badge:", "AWS Educate Introduction to Generative AI - Training Badge (Jul 2026; verifiable via Credly)."),
            ("Professional:", "Information Security Awareness (AIAcademy by AIPOWER, Jul 2026)."),
            ("English:", "B1.4 - Intermediate; technical reading and written communication."),
        ],
    },
    "vi": {
        "document_title": "Nguyễn Xuân Hải - CV Lập trình viên Full-stack",
        "document_subject": "CV Lập trình viên Full-stack - React, ASP.NET Core, NestJS, PostgreSQL",
        "name": "Nguyễn Xuân Hải",
        "role": "Lập trình viên Full-stack | React | ASP.NET Core | NestJS | PostgreSQL",
        "location": "TP. Hồ Chí Minh, Việt Nam",
        "date_of_birth": "Ngày sinh",
        "portfolio": "Portfolio",
        "github": "GitHub",
        "linkedin": "LinkedIn",
        "summary_section": "Tóm tắt năng lực",
        "skills_section": "Kỹ năng chuyên môn",
        "education_section": "Học vấn",
        "experience_section": "Kinh nghiệm làm việc",
        "projects_section": "Dự án cá nhân",
        "certifications_section": "Chứng chỉ & Ngoại ngữ",
        "position": "Vị trí",
        "stack": "Công nghệ",
        "link": "Liên kết",
        "footer_role": "Lập trình viên Full-stack",
        "page": "Trang",
        "summary": (
            "Lập trình viên Full-stack có kinh nghiệm triển khai sản phẩm phần mềm thực tế từ tháng 10/2024, bao gồm sản phẩm web thương mại và thực tập ERP. "
            "Phát triển các luồng React, ASP.NET Core, NestJS và Odoo từ làm rõ yêu cầu đến phát hành, hỗ trợ vận hành. "
            "Có kinh nghiệm về xác thực, CMS, realtime, nghiệp vụ ERP, PostgreSQL và SQL Server; sử dụng công cụ AI có chọn lọc để review, phác thảo kiểm thử và hỗ trợ bàn giao."
        ),
        "skill_rows": [
            ("Frontend:", "React 18/19, TypeScript, JavaScript ES6+, Vite, React Router, Tailwind CSS, giao diện component responsive."),
            ("Backend:", "C#, ASP.NET Core 8 Web API/MVC, Entity Framework Core, NestJS 11, Node.js/Express, RESTful API, JWT, OAuth2, Swagger/OpenAPI."),
            ("ERP & dữ liệu:", "Python 3.12, Odoo 18 ORM, QWeb/XML, PostgreSQL, SQL Server, Redis, nghiệp vụ kế toán TT200."),
            ("Kiến trúc & chất lượng:", "Dependency injection, tách service/repository, DTO validation, RBAC, CSRF, rate limiting, Jest, structured logging."),
            ("Triển khai:", "Docker, GitLab CI/CD, GitHub Actions, IIS, Vercel, Git, Nx monorepo, issue/MR và quy trình bàn giao phát hành."),
            ("Công cụ phát triển:", "Claude Code và Codex để đọc ngữ cảnh codebase, review, phác thảo test và tài liệu; quyết định kỹ thuật luôn được kiểm chứng bằng code và test."),
        ],
        "education": (
            "Đại học Giao thông Vận tải TP.HCM (UTH):",
            "Công nghệ Thông tin, 2022 - Dự kiến 2026 | GPA: 3.24/4.00. Học phần và dự án tập trung vào phát triển phần mềm, OOP, cơ sở dữ liệu và hệ thống web.",
        ),
        "certifications": [
            ("Đào tạo AWS:", "AWS Cloud Practitioner Essentials; Getting into the Serverless Mindset - chứng chỉ hoàn thành (07/2026)."),
            ("Huy hiệu đào tạo AWS:", "AWS Educate Introduction to Generative AI - Training Badge (07/2026; xác thực qua Credly)."),
            ("Chuyên môn:", "Information Security Awareness (AIAcademy by AIPOWER, 07/2026)."),
            ("Tiếng Anh:", "B1.4 - đọc hiểu tài liệu kỹ thuật và giao tiếp bằng văn bản cơ bản."),
        ],
    },
}


@dataclass(frozen=True)
class Entry:
    role: str
    name: str
    period: str
    link: Optional[str]
    stack: str
    bullets: Sequence[str]


class CvPdf:
    def __init__(self, output: Path, language: str = "en") -> None:
        if language not in CV_COPY:
            raise ValueError(f"Unsupported language: {language}")
        self.output = output
        self.language = language
        self.copy = CV_COPY[language]
        self.c = canvas.Canvas(str(output), pagesize=A4, pageCompression=1)
        self.page = 1
        self.y = PAGE_H - TOP
        self._register_fonts()
        self.c.setTitle(self.copy["document_title"])
        self.c.setAuthor(self.copy["name"])
        self.c.setSubject(self.copy["document_subject"])
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
        self.c.drawString(MARGIN_X, BOTTOM - 22, f"{self.copy['name']} | {self.copy['footer_role']}")
        self.c.drawRightString(PAGE_W - MARGIN_X, BOTTOM - 22, f"{self.copy['page']} {self.page}")
        self.c.restoreState()

    def new_page(self) -> None:
        self._footer()
        self.c.showPage()
        self.page += 1
        self.y = PAGE_H - TOP
        self.c.setFillColor(INK)
        self.c.setFont("Arial-Bold", 9)
        self.c.drawString(MARGIN_X, self.y, self.copy["name"])
        self.c.setFont("Arial", 8)
        self.c.setFillColor(MUTED)
        self.c.drawRightString(PAGE_W - MARGIN_X, self.y, self.copy["role"])
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
        self.c.drawString(x, y, self.copy["name"])
        self.c.setFont("Arial-Bold", 9.6)
        self.c.setFillColor(ACCENT_DARK)
        self.c.drawString(x, y - 16, self.copy["role"])

        self.c.setFont("Arial", 8.15)
        self.c.setFillColor(MUTED)
        contact_1 = f"{self.copy['location']} | {self.copy['date_of_birth']}: 29/11/2004 | +84 929 501 116 | xuanhai0913750452@gmail.com"
        portfolio_text = "my-portfolio-nxh.vercel.app"
        github_text = "github.com/xuanhai0913"
        linkedin_text = "linkedin.com/in/xuanhai0913"
        contact_2 = f"{self.copy['portfolio']}: {portfolio_text} | {self.copy['github']}: {github_text} | {self.copy['linkedin']}: {linkedin_text}"
        self.c.drawString(x, y - 32, contact_1)
        self.c.drawString(x, y - 45, contact_2)
        portfolio_x = x + self.text_width(f"{self.copy['portfolio']}: ", "Arial", 8.15)
        github_x = portfolio_x + self.text_width(f"{portfolio_text} | {self.copy['github']}: ", "Arial", 8.15)
        linkedin_x = github_x + self.text_width(f"{github_text} | {self.copy['linkedin']}: ", "Arial", 8.15)
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
        self.section(self.copy["summary_section"], 55)
        self.y = self.draw_wrapped(self.copy["summary"], MARGIN_X, self.y, CONTENT_W, "Arial", 8.75, INK, 11.4)
        self.y -= 4

    def skills(self) -> None:
        self.section(self.copy["skills_section"], 86)
        for label, value in self.copy["skill_rows"]:
            self.key_value(label, value)
        self.y -= 2

    def entry(self, item: Entry) -> None:
        header = f"{item.role} - {item.name}"
        period_width = self.text_width(item.period, "Arial-Bold", 8)
        header_width = CONTENT_W - period_width - 12
        header_lines = self.wrap(header, header_width, "Arial-Bold", 9)
        estimated = (
            44
            + max(0, len(header_lines) - 1) * 10
            + max(1, len(self.wrap(f"{self.copy['stack']}: {item.stack}", CONTENT_W, "Arial-Italic", 7.8))) * 10
            + (10 if item.link else 0)
            + sum(max(1, len(self.wrap(b, CONTENT_W - 16, "Arial", 8.35))) * 11.4 for b in item.bullets)
        )
        self.ensure(estimated)
        self.c.setFillColor(INK)
        self.c.setFont("Arial-Bold", 9)
        header_y = self.y
        for line in header_lines:
            self.c.drawString(MARGIN_X, header_y, line)
            header_y -= 10
        self.c.setFillColor(MUTED)
        self.c.setFont("Arial-Bold", 8)
        self.c.drawRightString(PAGE_W - MARGIN_X, self.y, item.period)
        self.y = header_y - 1

        self.c.setFont("Arial", 7.9)
        self.c.setFillColor(MUTED)
        self.c.drawString(MARGIN_X, self.y, f"{self.copy['position']}: {item.role}")
        self.y -= 10

        self.c.setFont("Arial-Italic", 7.8)
        self.c.setFillColor(ACCENT_DARK)
        self.y = self.draw_wrapped(f"{self.copy['stack']}: {item.stack}", MARGIN_X, self.y, CONTENT_W, "Arial-Italic", 7.8, ACCENT_DARK, 10)

        if item.link:
            self.c.setFont("Arial", 7.8)
            self.c.setFillColor(MUTED)
            link_prefix = f"{self.copy['link']}: "
            self.c.drawString(MARGIN_X, self.y, f"{link_prefix}{item.link}")
            link_x = MARGIN_X + self.text_width(link_prefix, "Arial", 7.8)
            self.c.linkURL(item.link, (link_x, self.y - 2, link_x + self.text_width(item.link, "Arial", 7.8), self.y + 8), relative=0, thickness=0)
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
        role="Core Full-Stack Developer",
        name="Betodemy - Japanese Learning Platform",
        period="Start: Feb 2026 | End: Present",
        link="https://betodemy.com",
        stack="React 19, Vite, Tailwind CSS 4, HeroUI, NestJS 11, TypeORM, PostgreSQL, Redis, BullMQ, Socket.IO, Nx, pnpm, GitLab CI/CD",
        bullets=[
            "Worked as a core developer in a 5-person engineering team with Betodemy's Japan-side leadership, joining weekly meetings to discuss bugs, feature scope and release priorities.",
            "Built document-editor, challenge-player, online-class and student/admin features across the React/NestJS Nx monorepo.",
            "Achievement: delivered 70+ merged MRs and closed 70+ authored issues across production learning workflows.",
        ],
    ),
    Entry(
        role="Odoo ERP Support Developer Intern",
        name="AI Power - Automotive Dealership ERP",
        period="Start: May 2026 | End: Jul 2026",
        link="https://aipower.vn/vi",
        stack="Python 3.12, Odoo 18, PostgreSQL, QWeb/XML, wkhtmltopdf, Docker, GitLab CI/CD, gettext i18n",
        bullets=[
            "Supported an Odoo 18 ERP for automotive dealerships in Vietnam, covering sales, an 18-state after-sales service workflow, spare parts, warranty and TT200 accounting.",
            "Debugged BA/customer-reported defects across business logic, data models, QWeb/XML views, localized PDF reports and translations.",
            "Achievement: supported fixes across all 18 custom modules and 99+ Python files without breaking the 18-state service workflow.",
        ],
    ),
    Entry(
        role="Full-Stack Developer / Business Analysis & Delivery",
        name="OakMind Group - Three Production Web Products",
        period="Start: Oct 2024 | End: Jan 2026",
        link="https://oakmindgroup.com/",
        stack="C#, ASP.NET Core 8 Web API/MVC, Entity Framework Core, React 18/19, SQL Server, Redis, Serilog, JWT, SignalR, Cloudflare R2",
        bullets=[
            "VN Media Hub: built production CMS workflows for authentication, content, moderation, caching, structured logging, SEO publishing and reporting.",
            "Great Link Mai House: converted legacy WordPress/ASP.NET MVC workflows into React screens and ASP.NET Core APIs with auth, media and realtime updates.",
            "OakMind Group website: shipped a live React 19 and ASP.NET Core corporate CMS with admin/editor workflows, bilingual content, SEO/analytics, video library and Cloudflare R2 media in 28 authored commits.",
            "Achievement: owned BA clarification through production release across three company products.",
        ],
    ),
]

PROJECT_ENTRIES: Sequence[Entry] = [
    Entry(
        role="Full-Stack Developer",
        name="ChongScam - Trust & Anti-Scam Platform",
        period="Start: Apr 2026 | End: Jul 2026",
        link="https://chongscam.vn/",
        stack="React 19, TypeScript, NestJS 11, PostgreSQL, Redis, session authentication, RBAC, CSRF, rate limiting, Jest",
        bullets=[
            "Task: build a production trust platform for checking transaction risk, verified traders and community scam reports.",
            "Action: implemented session/RBAC flows, search, moderation, audit controls, admin operations and security middleware across React and NestJS.",
            "Result: shipped the client-operated platform at chongscam.vn spanning 22 NestJS controllers, 20 SQL migrations and 12 Jest/e2e test suites.",
        ],
    ),
    Entry(
        role="Full-Stack / Algorithm Developer",
        name="RouteLab - Shortest Path Laboratory",
        period="Start: May 2026 | End: Jul 2026",
        link="https://tsp-delivery-route-optimizer.vercel.app/",
        stack="React, TypeScript, Express, PostgreSQL, Dijkstra, A*, Floyd-Warshall, Bellman-Ford, Vitest, GitHub Actions",
        bullets=[
            "Task: make shortest-path algorithms observable and comparable on weighted map and graph datasets.",
            "Action: implemented solver, API and PostgreSQL paths plus step-by-step replay visualization for four algorithms.",
            "Result: published a working demo with automated frontend/backend tests and a dedicated backend algorithm CI pipeline.",
        ],
    ),
    Entry(
        role="Full-Stack / Blockchain Developer",
        name="AgriTrace - Agricultural Traceability System",
        period="Start: Apr 2026 | End: Jun 2026",
        link="https://github.com/xuanhai0913/agri-traceability-system",
        stack="React, Express, PostgreSQL, Solidity, Hardhat, IPFS, Polygon Amoy, JWT, RBAC, QR verification",
        bullets=[
            "Task: model agricultural supply-chain traceability across producer, inspection, warehouse and distributor roles.",
            "Action: built React/Express/PostgreSQL operations, Solidity lifecycle contracts, IPFS evidence and QR verification.",
            "Result: delivered a public hybrid on-chain/off-chain architecture with deployed Polygon Amoy contracts and reproducible source code.",
        ],
    ),
]

WORK_ENTRIES_VI: Sequence[Entry] = [
    Entry(
        role="Lập trình viên Full-stack | Nhóm phát triển 5 người",
        name="Betodemy - Nền tảng học tiếng Nhật",
        period="Bắt đầu: 02/2026 | Kết thúc: Hiện tại",
        link="https://betodemy.com",
        stack="React 19, Vite, Tailwind CSS 4, HeroUI, NestJS 11, TypeORM, PostgreSQL, Redis, BullMQ, Socket.IO, Nx, pnpm, GitLab CI/CD",
        bullets=[
            "Phát triển document editor, challenge player, lớp học trực tuyến và luồng dành cho học viên/quản trị trong monorepo React/NestJS.",
            "Tham gia họp sản phẩm hằng tuần với đầu mối phía Nhật để làm rõ lỗi, phạm vi tính năng và ưu tiên phát hành.",
            "Thành tựu: hoàn thành hơn 70 merge request và đóng hơn 70 issue do bản thân tạo trong các luồng học tập đang vận hành.",
        ],
    ),
    Entry(
        role="Thực tập sinh hỗ trợ phát triển Odoo ERP",
        name="AI Power - ERP đại lý ô tô",
        period="Bắt đầu: 05/2026 | Kết thúc: 07/2026",
        link="https://aipower.vn/vi",
        stack="Python 3.12, Odoo 18, PostgreSQL, QWeb/XML, wkhtmltopdf, Docker, GitLab CI/CD, gettext i18n",
        bullets=[
            "Hỗ trợ ERP Odoo 18 cho hệ thống đại lý ô tô tại Việt Nam: bán hàng, dịch vụ sau bán 18 trạng thái, phụ tùng, bảo hành và kế toán TT200.",
            "Phân tích và sửa lỗi từ BA/khách hàng trong business logic, data model, QWeb/XML, báo cáo PDF bản địa hóa và i18n.",
            "Thành tựu: hỗ trợ fix trên 18 module custom và hơn 99 file Python, vẫn đảm bảo luồng dịch vụ 18 trạng thái.",
        ],
    ),
    Entry(
        role="Lập trình viên Full-stack | Phân tích nghiệp vụ & triển khai",
        name="OakMind Group - Ba sản phẩm web đang vận hành",
        period="Bắt đầu: 10/2024 | Kết thúc: 01/2026",
        link="https://oakmindgroup.com/",
        stack="C#, ASP.NET Core 8 Web API/MVC, Entity Framework Core, React 18/19, SQL Server, Redis, Serilog, JWT, SignalR, Cloudflare R2",
        bullets=[
            "VN Media Hub: xây dựng luồng CMS cho xác thực, nội dung, kiểm duyệt, cache, logging, SEO và báo cáo.",
            "Great Link Mai House: chuyển đổi luồng WordPress/ASP.NET MVC sang React và ASP.NET Core, gồm xác thực, media và realtime.",
            "OakMind Group Website: triển khai CMS React 19/.NET cho nội dung song ngữ, SEO/analytics, thư viện video và Cloudflare R2 trong 28 commit trực tiếp.",
            "Thành tựu: theo sát từ làm rõ yêu cầu nghiệp vụ đến phát hành production cho cả ba sản phẩm của công ty.",
        ],
    ),
]

PROJECT_ENTRIES_VI: Sequence[Entry] = [
    Entry(
        role="Lập trình viên Full-stack",
        name="ChongScam - Nền tảng chống lừa đảo",
        period="Bắt đầu: 04/2026 | Kết thúc: 07/2026",
        link="https://chongscam.vn/",
        stack="React 19, TypeScript, NestJS 11, PostgreSQL, Redis, session authentication, RBAC, CSRF, rate limiting, Jest",
        bullets=[
            "Nhiệm vụ: xây dựng nền tảng kiểm tra rủi ro giao dịch, người bán đã xác minh và báo cáo lừa đảo từ cộng đồng.",
            "Thực hiện: phát triển session/RBAC, tìm kiếm, kiểm duyệt, audit, admin operation và middleware bảo mật trên React/NestJS.",
            "Kết quả: bàn giao hệ thống đang vận hành tại chongscam.vn với 22 controller NestJS, 20 SQL migration và 12 bộ test Jest/e2e.",
        ],
    ),
    Entry(
        role="Lập trình viên Full-stack / Thuật toán",
        name="RouteLab - Phòng thí nghiệm đường đi ngắn nhất",
        period="Bắt đầu: 05/2026 | Kết thúc: 07/2026",
        link="https://tsp-delivery-route-optimizer.vercel.app/",
        stack="React, TypeScript, Express, PostgreSQL, Dijkstra, A*, Floyd-Warshall, Bellman-Ford, Vitest, GitHub Actions",
        bullets=[
            "Nhiệm vụ: trực quan hóa và so sánh các thuật toán đường đi ngắn nhất trên dữ liệu bản đồ và đồ thị có trọng số.",
            "Thực hiện: xây dựng solver, API, luồng PostgreSQL và giao diện replay từng bước cho bốn thuật toán.",
            "Kết quả: phát hành demo có test frontend/backend tự động và CI riêng cho thuật toán backend.",
        ],
    ),
    Entry(
        role="Lập trình viên Full-stack / Blockchain",
        name="AgriTrace - Hệ thống truy xuất nông sản",
        period="Bắt đầu: 04/2026 | Kết thúc: 06/2026",
        link="https://github.com/xuanhai0913/agri-traceability-system",
        stack="React, Express, PostgreSQL, Solidity, Hardhat, IPFS, Polygon Amoy, JWT, RBAC, QR verification",
        bullets=[
            "Nhiệm vụ: mô hình hóa truy xuất chuỗi cung ứng nông sản giữa nhà sản xuất, kiểm định, kho và nhà phân phối.",
            "Thực hiện: phát triển luồng React/Express/PostgreSQL, smart contract vòng đời, bằng chứng IPFS và xác minh QR.",
            "Kết quả: công bố kiến trúc hybrid on-chain/off-chain cùng mã nguồn tái lập và contract Polygon Amoy đã triển khai.",
        ],
    ),
]

ENTRIES: Sequence[Entry] = [*WORK_ENTRIES, *PROJECT_ENTRIES]


def build(language: str = "en", output: Optional[Path] = None) -> Path:
    if language not in CV_COPY:
        raise ValueError(f"Unsupported language: {language}")
    selected_output = output or (OUTPUT_VI if language == "vi" else OUTPUT_EN)
    work_entries = WORK_ENTRIES_VI if language == "vi" else WORK_ENTRIES
    project_entries = PROJECT_ENTRIES_VI if language == "vi" else PROJECT_ENTRIES
    copy = CV_COPY[language]
    selected_output.parent.mkdir(parents=True, exist_ok=True)

    pdf = CvPdf(selected_output, language=language)
    pdf.header()
    pdf.summary()
    pdf.compact_section(
        copy["education_section"],
        [copy["education"]],
    )
    pdf.skills()
    pdf.section(copy["experience_section"], 130)
    for item in work_entries:
        pdf.entry(item)

    pdf.section(copy["projects_section"], 190)
    for item in project_entries:
        pdf.entry(item)

    pdf.compact_section(copy["certifications_section"], copy["certifications"])
    pdf.save()
    normalize_pdf(selected_output, title=copy["document_title"], subject=copy["document_subject"])
    return selected_output


def normalize_pdf(path: Path, title: str | None = None, subject: str | None = None) -> None:
    """Rewrite the PDF cross-reference table so PDF renderers do not warn."""
    temp_path = path.with_suffix(".tmp.pdf")
    reader = PdfReader(str(path))
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)
    writer.add_metadata(
        {
            "/Title": title or "Nguyen Xuan Hai - Full-Stack Developer CV",
            "/Author": "Nguyen Xuan Hai",
            "/Subject": subject or "Full-Stack Developer CV - React, ASP.NET Core, NestJS, PostgreSQL",
            "/Creator": "Codex CV generator",
        }
    )
    with temp_path.open("wb") as f:
        writer.write(f)
    temp_path.replace(path)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate Nguyen Xuan Hai's ATS-friendly CV.")
    parser.add_argument("--lang", choices=sorted(CV_COPY), default="en")
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    print(build(args.lang, args.output))

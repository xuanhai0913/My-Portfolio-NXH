#!/usr/bin/env python3
"""Generate role-specific ATS CV PDFs without changing the public master CV."""

from __future__ import annotations

import argparse
import importlib.util
import sys
from pathlib import Path
from types import MethodType


ROOT = Path(__file__).resolve().parents[1]
BASE_SCRIPT = ROOT / "scripts" / "generate_cv_pdf.py"


def load_base():
    spec = importlib.util.spec_from_file_location("base_cv", BASE_SCRIPT)
    if not spec or not spec.loader:
        raise RuntimeError(f"Cannot import {BASE_SCRIPT}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


VARIANTS = {
    "zalo-software-fresher": {
        "output": ROOT / "cv" / "zalo-software-fresher" / "CV_NguyenXuanHai_Zalo_Software_Fresher.pdf",
        "title": "Nguyen Xuan Hai - Software Development Fresher CV",
        "subtitle": "Software Development Fresher | OOP | API | SQL | React | .NET",
        "summary": (
            "Software development fresher/junior with practical full-stack experience building production web systems, "
            "CMS workflows and ERP modules. Strong foundation in OOP, MVC-style separation, REST API integration, "
            "database-backed business logic, debugging and release support across React, ASP.NET Core/C#, NestJS, "
            "Python/Odoo, SQL Server and PostgreSQL. Comfortable learning new stacks quickly and using AI tools "
            "such as Codex, Claude and Copilot to read codebases, plan changes, review code and document handoff."
        ),
        "skills": [
            ("Programming:", "OOP, MVC-style architecture, RESTful API design/integration, debugging, Git workflow, issue tracking, documentation."),
            ("Backend:", "ASP.NET Core/C#, NestJS/NodeJS, Python 3.12, Odoo 18, Entity Framework Core, TypeORM, JWT, Swagger/OpenAPI."),
            ("Frontend:", "React 18/19, Vite, JavaScript ES6+, TypeScript basics, React Router, Tailwind CSS, Bootstrap, responsive UI."),
            ("Database:", "SQL Server, PostgreSQL, MySQL basics, relational modelling, query/debug support, cache-aware workflows."),
            ("Quality & Delivery:", "Unit-test awareness, release support, CI/CD handoff, GitLab CI/GitHub, Docker, logging and troubleshooting."),
            ("AI Productivity:", "Codex, Claude, Copilot/Cursor-style agents for codebase understanding, implementation plans, review notes and automation docs."),
        ],
        "work_entries": ["Betodemy", "AI Power", "OakMind"],
        "project_entries": ["ECH", "Portfolio"],
        "overrides": {
            "Betodemy": [
                "Worked as a core developer in a 5-person product team, joining weekly meetings to clarify bugs, feature scope and release priorities.",
                "Built and fixed web features across student portals, admin workflows and learning modules using modular frontend/backend patterns.",
                "Created issues after release, supported operations and used AI-assisted review/CI handoff to speed up debugging and delivery.",
            ],
            "OakMind": [
                "VN Media Hub: built CMS/media workflows for authentication, moderation, SEO, caching, structured logging and reporting.",
                "Great Link Mai House: converted WordPress/ASP.NET MVC workflows into React screens and ASP.NET Core APIs with auth, realtime, media and integration flows.",
                "OakMind Group Website: shipped a live React 19/ASP.NET Core 8 bilingual CMS with SEO/analytics, video and Cloudflare R2 media.",
                "Achievement: owned BA clarification through production release across all three OakMind Group products.",
            ],
        },
    },
    "vina-aspire-dotnet": {
        "output": ROOT / "cv" / "vina-aspire-dotnet" / "CV_NguyenXuanHai_VinaAspire_DotNet.pdf",
        "title": "Nguyen Xuan Hai - .NET Developer CV",
        "subtitle": ".NET Developer | C# | ASP.NET Core API | OOP | SQL",
        "summary": (
            ".NET-oriented full-stack developer with hands-on experience building React + ASP.NET Core systems, "
            "CMS/API modules, authentication, reporting and SQL-backed business workflows. Experienced with OOP, "
            "MVC-style separation, REST APIs, JWT/auth flows, PostgreSQL/SQL Server, Git and Docker. Also familiar "
            "with Python/Odoo ERP and AI-assisted workflows for code review, debugging, documentation and CI/CD handoff."
        ),
        "skills": [
            ("Core .NET:", "C#, ASP.NET Core 8, Web API, MVC-style separation, OOP, service/business logic layers, Swagger/OpenAPI."),
            ("API & Auth:", "RESTful APIs, JWT, OAuth2/Google OAuth, ASP.NET Identity, validation, integration workflows, logging."),
            ("Database:", "SQL Server, PostgreSQL, MySQL basics, Entity Framework Core, relational data flows, reporting/query support."),
            ("Frontend:", "React 18/19, Vite, JavaScript ES6+, TypeScript basics, Bootstrap, Tailwind CSS, responsive admin/CMS UI."),
            ("Tools:", "Git, Docker, IIS/Vercel deployment exposure, GitLab CI/GitHub, Serilog, QuestPDF, ClosedXML, Cloudinary, MailKit."),
            ("AI Productivity:", "Codex, Claude, Copilot/Cursor-style agents for reading codebases, planning changes, review notes and handoff docs."),
        ],
        "work_entries": ["Betodemy", "AI Power", "OakMind"],
        "project_entries": ["ECH", "Portfolio"],
        "overrides": {
            "OakMind": [
                "VN Media Hub: built React and ASP.NET Core Web API CMS modules with EF Core, SQL Server, auth, caching, structured logging and reports.",
                "Great Link Mai House: converted WordPress/ASP.NET MVC workflows into React and ASP.NET Core APIs with JWT, SignalR, media and integrations.",
                "OakMind Group Website: shipped a live React 19/ASP.NET Core 8 bilingual CMS with admin/editor workflows, SEO/analytics and Cloudflare R2 media.",
                "Achievement: owned BA clarification through production release across all three OakMind Group products.",
            ],
            "ECH": [
                "Built LMS workflows using ASP.NET Core MVC/API, Entity Framework Core, SQL Server, ASP.NET Identity and Bootstrap.",
                "Implemented course/content management, secure authentication, certificate generation, media storage, email notifications and Excel/PDF reporting.",
                "Supported a maintainable community learning platform for volunteer teaching and operations.",
            ],
        },
    },
}


def select_entries(entries, keys: list[str], overrides: dict[str, list[str]], base):
    selected = []
    for key in keys:
        for entry in entries:
            if key in entry.name or key in entry.role:
                bullets = overrides.get(key, list(entry.bullets))
                selected.append(
                    base.Entry(
                        role=entry.role,
                        name=entry.name,
                        period=entry.period,
                        link=entry.link,
                        stack=entry.stack,
                        bullets=bullets,
                    )
                )
                break
    return selected


def build_variant(name: str) -> Path:
    if name not in VARIANTS:
        raise SystemExit(f"Unknown variant: {name}. Available: {', '.join(VARIANTS)}")

    base = load_base()
    config = VARIANTS[name]
    output = config["output"]
    output.parent.mkdir(parents=True, exist_ok=True)

    pdf = base.CvPdf(output)
    pdf.c.setTitle(config["title"])

    def header(self):
        self.c.saveState()
        self.c.setFillColor(base.LIGHT)
        self.c.roundRect(base.MARGIN_X, base.PAGE_H - 119, base.CONTENT_W, 80, 7, fill=1, stroke=0)
        self.c.setFillColor(base.ACCENT)
        self.c.rect(base.MARGIN_X, base.PAGE_H - 119, 6, 80, fill=1, stroke=0)
        x = base.MARGIN_X + 20
        y = base.PAGE_H - 61
        self.c.setFillColor(base.INK)
        self.c.setFont("Arial-Bold", 20)
        self.c.drawString(x, y, "Nguyen Xuan Hai")
        self.c.setFont("Arial-Bold", 9.6)
        self.c.setFillColor(base.ACCENT_DARK)
        self.c.drawString(x, y - 16, config["subtitle"])
        self.c.setFont("Arial", 8.15)
        self.c.setFillColor(base.MUTED)
        self.c.drawString(x, y - 32, "Ho Chi Minh City, Vietnam | Date of Birth: 29/11/2004 | +84 929 501 116 | xuanhai0913750452@gmail.com")
        self.c.drawString(x, y - 45, "Portfolio: my-portfolio-nxh.vercel.app | GitHub: github.com/xuanhai0913 | LinkedIn: linkedin.com/in/xuanhai0913")
        self.c.restoreState()
        self.y = base.PAGE_H - 140

    def summary(self):
        self.section("Professional Summary", 55)
        self.y = self.draw_wrapped(config["summary"], base.MARGIN_X, self.y, base.CONTENT_W, "Arial", 8.75, base.INK, 11.4)
        self.y -= 4

    def skills(self):
        self.section("Target Skills", 80)
        for label, value in config["skills"]:
            self.key_value(label, value)
        self.y -= 2

    pdf.header = MethodType(header, pdf)
    pdf.summary = MethodType(summary, pdf)
    pdf.skills = MethodType(skills, pdf)

    work_entries = select_entries(base.WORK_ENTRIES, config["work_entries"], config["overrides"], base)
    project_entries = select_entries(base.PROJECT_ENTRIES, config["project_entries"], config["overrides"], base)

    pdf.header()
    pdf.summary()
    pdf.compact_section(
        "Education",
        [("Ho Chi Minh City University of Transport (UTH):", "Information Technology, 2022 - Expected 2026 | GPA: 3.24/4.00. Practical coursework and projects focused on software development, web systems, OOP and databases.")],
    )
    pdf.skills()
    pdf.section("Work Experience", 130)
    for item in work_entries:
        pdf.entry(item)
    pdf.section("Independent Projects", 140)
    for item in project_entries:
        pdf.entry(item)
    pdf.compact_section(
        "Certifications & Activities",
        [
            ("Google / AI:", "Gemini Certified University Student; Gemini Certified Faculty; Google AI for K12 Educators; Code a Joke-Telling Talkbot."),
            ("Additional:", "Basic Office Information Technology; Volunteer Participation Certificate; English Community House volunteer."),
        ],
    )
    pdf.save()
    base.normalize_pdf(output)
    return output


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("variant", choices=sorted(VARIANTS))
    args = parser.parse_args()
    print(build_variant(args.variant))


if __name__ == "__main__":
    main()

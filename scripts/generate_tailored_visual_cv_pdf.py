#!/usr/bin/env python3
"""Generate role-specific one-page Visual CV PDFs without changing the master CV."""

from __future__ import annotations

import argparse
import importlib.util
import sys
from pathlib import Path
from types import MethodType


ROOT = Path(__file__).resolve().parents[1]
BASE_SCRIPT = ROOT / "scripts" / "generate_visual_cv_pdf.py"


def load_base():
    spec = importlib.util.spec_from_file_location("base_visual_cv", BASE_SCRIPT)
    if not spec or not spec.loader:
        raise RuntimeError(f"Cannot import {BASE_SCRIPT}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


VARIANTS = {
    "zalo-software-fresher": {
        "output": ROOT / "cv" / "zalo-software-fresher" / "CV_NguyenXuanHai_Zalo_Software_Fresher_visual.pdf",
        "role": "Software Development Fresher",
        "stack_line": "OOP  |  MVC/API  |  React  |  ASP.NET Core  |  SQL",
        "headline": "Fresher/junior developer with production web experience, OOP/API/database foundation and AI-assisted delivery workflow.",
        "workflow": "I use AI agents to read codebases, plan changes, review code, document handoff and speed up debugging.",
        "skills": [
            ("OOP / MVC", "FOUNDATION", "dotnet.png"),
            ("REST APIs", "BACKEND", "nestjs.png"),
            ("React", "FRONTEND", "react.png"),
            ("ASP.NET Core", "BACKEND", "dotnet.png"),
            ("NestJS", "BACKEND", "nestjs.png"),
            ("SQL / PostgreSQL", "DATABASE", "postgresql.png"),
            ("Docker", "INFRA", "docker.png"),
            ("GitLab CI", "CI/CD", "gitlab.png"),
            ("Claude", "AI AGENTS", None),
            ("Codex", "AI AGENTS", None),
            ("Antigravity", "AI AGENTS", None),
        ],
        "experiences": [
            (
                "Feb 2026\n-\nPresent",
                "Betodemy - Product Platform",
                "Role: Core Full-Stack Developer in 5-person team",
                [
                    "Built and fixed web features across student/admin workflows.",
                    "Created issues after release; supported debugging, review and CI handoff.",
                ],
            ),
            (
                "Jul 2025\n-\nJan 2026",
                "Great Link Mai House",
                "Role: Main Full-Stack Developer / BA-facing Owner",
                [
                    "Converted WordPress flows to React + ASP.NET Core using MVC-style separation.",
                    "Built auth, realtime, media, API integration and SQL-backed workflows.",
                ],
            ),
            (
                "Oct 2024\n-\nJan 2026",
                "VN Media Hub",
                "Role: Main Full-Stack Developer / BA-facing Owner",
                [
                    "Built CMS/media workflows: auth, moderation, SEO, caching and reports.",
                    "Translated business requirements into frontend, API and database tasks.",
                ],
            ),
            (
                "May 2026\n-\nJul 2026",
                "AI Power - Odoo ERP",
                "Role: Odoo ERP Support Developer Intern",
                [
                    "Fixed Python/Odoo business logic, QWeb/XML reports and i18n.",
                    "Worked across 18 modules and 99+ Python files after BA/customer updates.",
                ],
            ),
        ],
        "projects": [
            ("EC", "ECH LMS", "ASP.NET Core MVC/API, Identity, SQL Server, PDF/Excel reports.", "Oct 2024 - Jan 2026"),
            ("AI", "AI Workflow", "Codex/Claude context, review notes, CI handoff and docs.", "Mar 2025 - May 2026"),
        ],
    },
    "vina-aspire-dotnet": {
        "output": ROOT / "cv" / "vina-aspire-dotnet" / "CV_NguyenXuanHai_VinaAspire_DotNet_visual.pdf",
        "role": ".NET Developer",
        "stack_line": "C#  |  ASP.NET Core API  |  OOP/MVC  |  SQL  |  JWT",
        "headline": ".NET-oriented full-stack developer building API/CMS modules, auth flows, reports and SQL-backed business workflows.",
        "workflow": "I apply AI agents for codebase reading, implementation plans, review checklists, debug notes and release handoff.",
        "skills": [
            ("ASP.NET Core", "BACKEND", "dotnet.png"),
            ("C# / OOP", "FOUNDATION", "dotnet.png"),
            ("REST APIs", "BACKEND", "nestjs.png"),
            ("JWT / Auth", "SECURITY", "dotnet.png"),
            ("React", "FRONTEND", "react.png"),
            ("PostgreSQL", "DATABASE", "postgresql.png"),
            ("Docker", "INFRA", "docker.png"),
            ("GitLab CI", "CI/CD", "gitlab.png"),
            ("Claude", "AI AGENTS", None),
            ("Codex", "AI AGENTS", None),
            ("Antigravity", "AI AGENTS", None),
        ],
        "experiences": [
            (
                "Jul 2025\n-\nJan 2026",
                "Great Link Mai House",
                "Role: Main Full-Stack Developer / BA-facing Owner",
                [
                    "Built React + ASP.NET Core API/CMS modules with MVC-style separation.",
                    "Implemented auth, realtime updates, media handling, SQL Server and integrations.",
                ],
            ),
            (
                "Oct 2024\n-\nJan 2026",
                "VN Media Hub",
                "Role: Main Full-Stack Developer / BA-facing Owner",
                [
                    "Built ASP.NET Core Web API workflows with EF Core, SQL Server and JWT.",
                    "Implemented logging, caching, moderation, SEO and PDF/report generation.",
                ],
            ),
            (
                "Feb 2026\n-\nPresent",
                "Betodemy - Product Platform",
                "Role: Core Full-Stack Developer in 5-person team",
                [
                    "Built and fixed product modules in a weekly issue/release workflow.",
                    "Supported production operations with AI-assisted review and CI handoff.",
                ],
            ),
            (
                "May 2026\n-\nJul 2026",
                "AI Power - Odoo ERP",
                "Role: Odoo ERP Support Developer Intern",
                [
                    "Supported ERP modules, reports and PostgreSQL-backed workflows.",
                    "Fixed business logic after BA/customer requirement updates.",
                ],
            ),
        ],
        "projects": [
            ("EC", "ECH LMS", "ASP.NET Core MVC/API, Identity, JWT, SQL Server and reports.", "Oct 2024 - Jan 2026"),
            ("AI", "AI Workflow", "Codex/Claude review, debug, docs and release handoff.", "Mar 2025 - May 2026"),
        ],
    },
    "junior-dotnet-developer": {
        "output": ROOT / "cv" / "junior-dotnet-developer" / "CV_NguyenXuanHai_Junior_DotNet_Developer_visual.pdf",
        "role": "Junior .NET Developer",
        "stack_line": "C#  |  ASP.NET Core/Web API  |  OOP/MVC  |  SQL Server  |  React",
        "headline": "Junior .NET-oriented developer with practical API/CMS modules, SQL-backed workflows, debugging and release support.",
        "workflow": "I use AI agents to understand existing codebases, prepare implementation plans, review bugs, document handoff and learn new frameworks faster.",
        "skills": [
            ("C# / OOP", "FOUNDATION", "dotnet.png"),
            ("ASP.NET Core", "BACKEND", "dotnet.png"),
            ("ASP.NET Web API", "BACKEND", "dotnet.png"),
            ("MVC-style Modules", "ARCHITECTURE", "dotnet.png"),
            ("SQL Server", "DATABASE", "postgresql.png"),
            ("Entity Framework", "ORM", "dotnet.png"),
            ("HTML/CSS/JS", "FRONTEND", "react.png"),
            ("React / Bootstrap", "FRONTEND", "react.png"),
            ("Git Workflow", "TOOLS", "gitlab.png"),
            ("Debugging & Testing", "QUALITY", "code-slash.svg"),
        ],
        "experiences": [
            (
                "Jul 2025\n-\nJan 2026",
                "Great Link Mai House",
                "Role: Main Full-Stack Developer / BA-facing Owner",
                "Tech: ReactJS, ASP.NET Core REST API, SQL Server, JWT, MVC-style separation",
                [
                    "Converted WordPress workflows into maintainable React + ASP.NET Core screens and APIs.",
                    "Implemented auth, media/integration flows and SQL-backed business screens from requirements to release.",
                ],
            ),
            (
                "Oct 2024\n-\nJan 2026",
                "VN Media Hub",
                "Role: Main Full-Stack Developer / BA-facing Owner",
                "Tech: ASP.NET Core Web API, SQL Server, auth, caching, logging, reports",
                [
                    "Built CMS/admin modules for content, moderation, SEO, authentication and reporting workflows.",
                    "Applied API contracts, database workflows, logging/caching and bug fixing for production tasks.",
                ],
            ),
            (
                "Feb 2026\n-\nPresent",
                "Betodemy - Product Platform",
                "Role: Core Full-Stack Developer in 5-person team",
                "Tech: ReactJS, NestJS, PostgreSQL, Redis, BullMQ, GitLab CI, issue tracking",
                [
                    "Built and fixed product features in a weekly issue/release workflow with review handoff.",
                    "Worked with existing modules, debugging notes and CI checks to keep delivery stable.",
                ],
            ),
            (
                "May 2026\n-\nJul 2026",
                "AI Power - Odoo ERP",
                "Role: Odoo ERP Support Developer Intern",
                "Tech: Python/Odoo, PostgreSQL, XML/QWeb reports, Docker, GitLab CI",
                [
                    "Fixed ERP business logic and reports after BA/customer requirement updates.",
                    "Practiced careful change handling across existing modules, reports and i18n flows.",
                ],
            ),
        ],
        "projects": [
            {
                "mark": "EC",
                "title": "ECH LMS",
                "tech": "ASP.NET Core MVC/API, Identity/JWT, SQL Server, Reports",
                "body": "Built LMS workflows with API-backed course/content screens, authentication and PDF/Excel reports.",
                "period": "Oct 2024 - Jan 2026",
            },
            {
                "mark": "VM",
                "title": "VN Media Hub CMS",
                "tech": "ASP.NET Core Web API, SQL Server, Auth, Logging, Caching",
                "body": "Built CMS/admin workflows for content operations, moderation, SEO and report generation.",
                "period": "Oct 2024 - Jan 2026",
            },
        ],
    },
    "softdreams-dotnet-fresher-junior": {
        "output": ROOT / "cv" / "softdreams-dotnet-fresher-junior" / "CV_NguyenXuanHai_Softdreams_DotNet_Fresher_Junior_visual.pdf",
        "role": ".NET/C# Developer (Fresher - Junior)",
        "stack_line": "C#  |  ASP.NET Web API  |  Entity Framework  |  SQL Server  |  Redis",
        "headline": "Junior .NET developer with production API/CMS, SQL-backed business workflows, caching, debugging and release support experience.",
        "workflow": "",
        "skills": [
            ("C# / OOP", "FOUNDATION", "dotnet.png"),
            ("ASP.NET Core / Web API", "BACKEND", "dotnet.png"),
            ("MVC-style Modules", "ARCHITECTURE", "dotnet.png"),
            ("Entity Framework Core", "ORM", "dotnet.png"),
            ("SQL Server", "DATABASE", "postgresql.png"),
            ("Redis Caching", "DATABASE", "redis.png"),
            ("JavaScript / HTML / CSS", "FRONTEND", "react.png"),
            ("RESTful API / JSON", "BACKEND", "dotnet.png"),
            ("Git / GitLab CI", "DELIVERY", "gitlab.png"),
            ("Agile / Debugging", "QUALITY", "code-slash.svg"),
        ],
        "experiences": [
            (
                "Jul 2025\n-\nJan 2026",
                "Great Link Mai House",
                "Role: Main Full-Stack Developer / BA-facing Owner",
                "Tech: C#, ASP.NET Core REST API, SQL Server, JWT, MVC-style separation",
                [
                    "Converted WordPress workflows into maintainable ASP.NET Core API modules and React business screens.",
                    "Implemented SQL-backed auth, media and integration flows from requirement analysis through release.",
                ],
            ),
            (
                "Oct 2024\n-\nJan 2026",
                "VN Media Hub",
                "Role: Main Full-Stack Developer / BA-facing Owner",
                "Tech: ASP.NET Core Web API, Entity Framework Core, SQL Server, Redis, Serilog",
                [
                    "Built CMS modules for content, moderation, authentication, SEO and automated reporting workflows.",
                    "Applied API/service separation, Redis caching and structured logging to support reliable operations.",
                ],
            ),
            (
                "Feb 2026\n-\nPresent",
                "Betodemy - Product Platform",
                "Role: Core Full-Stack Developer in 5-person team",
                "Tech: REST APIs, PostgreSQL, Redis, BullMQ, GitLab CI, Agile issue workflow",
                [
                    "Delivered and debugged product features through weekly issue, review and release cycles.",
                    "Worked with Redis-backed jobs and existing service modules while documenting stable handoff.",
                ],
            ),
            (
                "May 2026\n-\nJul 2026",
                "AI Power - Automotive ERP",
                "Role: Odoo ERP Support Developer Intern",
                "Tech: ERP business flows, PostgreSQL, QWeb reports, Docker, GitLab CI",
                [
                    "Resolved BA/customer defects across 18 ERP modules and 99+ Python files.",
                    "Maintained business logic and report flows after customer requirement updates.",
                ],
            ),
        ],
        "projects": [
            {
                "mark": "EC",
                "title": "ECH LMS",
                "tech": "ASP.NET Core MVC/API, EF Core, SQL Server, Identity/JWT, Reports",
                "body": "Built API-backed education workflows and automated PDF/Excel certificates and operational reports.",
                "period": "Oct 2024 - Jan 2026",
            },
            {
                "mark": "VM",
                "title": "VN Media Hub CMS",
                "tech": "ASP.NET Core Web API, EF Core, SQL Server, Redis, Serilog",
                "body": "Delivered SQL-backed CMS modules with caching, logging, authentication and report generation.",
                "period": "Oct 2024 - Jan 2026",
            },
        ],
    },
    "shinhan-frontend-web": {
        "output": ROOT / "cv" / "shinhan-frontend-web" / "CV_NguyenXuanHai_Shinhan_Frontend_Web_visual.pdf",
        "role": "Frontend Web Developer",
        "stack_line": "ReactJS  |  JavaScript  |  HTML/CSS  |  REST APIs  |  Responsive UI",
        "headline": "Frontend-focused developer building React screens, API-connected CMS/product workflows, responsive UI and release-ready handoff.",
        "workflow": "I use AI agents to read UI/API flows, plan frontend tasks, review code, write handoff notes and speed up debugging.",
        "skills": [
            ("ReactJS", "FRONTEND", "react.png"),
            ("JavaScript ES6+", "FRONTEND", "react.png"),
            ("HTML5 / CSS3", "FRONTEND", "react.png"),
            ("React Router", "ROUTING", "react.png"),
            ("REST API", "INTEGRATION", "nestjs.png"),
            ("API Contracts", "INTEGRATION", "nestjs.png"),
            ("Responsive UI", "UI", "react.png"),
            ("SlateJS", "EDITOR UI", "react.png"),
            ("Vite", "BUILD TOOL", "react.png"),
            ("GitLab CI", "CI/CD", "gitlab.png"),
        ],
        "experiences": [
            (
                "Jul 2025\n-\nJan 2026",
                "Great Link Mai House",
                "Role: Main Frontend/Full-Stack Developer / BA-facing Owner",
                "Tech: ReactJS, REST API, ASP.NET Core API, responsive UI, auth/media flows",
                [
                    "Converted WordPress business flows into reusable React screens and API-backed product UI.",
                    "Owned FE implementation for auth, media and realtime screens; aligned states with backend REST contracts.",
                ],
            ),
            (
                "Oct 2024\n-\nJan 2026",
                "VN Media Hub",
                "Role: Main Frontend/Full-Stack Developer / BA-facing Owner",
                "Tech: ReactJS, CMS UI, REST API contracts, SEO/admin screens, reporting flows",
                [
                    "Built CMS/admin UI for content, moderation, SEO and report workflows used in media operations.",
                    "Mapped BA requirements into React state flows, API contracts and release-ready frontend tasks.",
                ],
            ),
            (
                "Feb 2026\n-\nPresent",
                "Betodemy - Product Platform",
                "Role: Core Full-Stack Developer in 5-person team",
                "Tech: ReactJS, Vite, Tailwind, issue workflow, review/CI handoff",
                [
                    "Built and fixed learning-product UI/features in a weekly issue and release workflow.",
                    "Used debugging notes, review handoff and CI checks to ship safer frontend/API changes.",
                ],
            ),
            (
                "May 2026\n-\nJul 2026",
                "AI Power - Odoo ERP",
                "Role: Odoo ERP Support Developer Intern",
                "Tech: XML/QWeb UI reports, i18n, Python/Odoo workflows",
                [
                    "Supported ERP UI/report fixes after BA/customer requirement updates.",
                    "Adjusted QWeb/XML reports, i18n and business flows across Odoo modules.",
                ],
            ),
        ],
        "projects": [
            {
                "mark": "PF",
                "title": "React Portfolio UI",
                "tech": "React, Vite, SlateJS, CSS motion, responsive layout",
                "body": "Applied component architecture and Slate editor UX for a recruiter-facing portfolio/contact flow.",
                "period": "Mar 2025 - May 2026",
            },
            {
                "mark": "EC",
                "title": "ECH LMS",
                "tech": "Bootstrap UI, REST API, Auth, PDF/Excel reports",
                "body": "Built LMS screens connected to ASP.NET Core APIs, authentication and reporting workflows.",
                "period": "Oct 2024 - Jan 2026",
            },
        ],
    },
    "renda-frontend-react-erp": {
        "output": ROOT / "cv" / "renda-frontend-react-erp" / "CV_NguyenXuanHai_RENDA_Frontend_React_ERP_visual.pdf",
        "role": "Frontend ReactJS Developer",
        "stack_line": "ReactJS  |  TypeScript  |  JavaScript  |  ERP/Admin UI  |  API Integration",
        "headline": "React-focused developer building API-connected admin/product screens, ERP-style workflows, reusable UI states and release-ready handoff.",
        "workflow": "I use AI agents to read UI/API flows, map business states, review edge cases, debug faster and document release handoff.",
        "skills": [
            ("ReactJS", "FRONTEND", "react.png"),
            ("TypeScript", "FRONTEND", "react.png"),
            ("JavaScript ES6+", "FRONTEND", "react.png"),
            ("Admin UI", "PRODUCT UI", "file-earmark-text.svg"),
            ("ERP Workflows", "BUSINESS", "odoo.png"),
            ("REST API", "INTEGRATION", "nestjs.png"),
            ("Responsive UI", "UI", "react.png"),
            ("Forms / Filters", "UI STATE", "react.png"),
            ("Git Workflow", "TOOLS", "gitlab.png"),
            ("Debugging", "QUALITY", "code-slash.svg"),
        ],
        "experiences": [
            (
                "Jul 2025\n-\nJan 2026",
                "Great Link Mai House",
                "Role: Main Frontend/Full-Stack Developer / BA-facing Owner",
                "Tech: ReactJS, TypeScript-style components, REST API, admin/product screens",
                [
                    "Converted WordPress workflows into reusable React screens connected to ASP.NET Core REST APIs.",
                    "Owned UI states for auth, media and product flows; aligned BA requirements with API-backed screens.",
                ],
            ),
            (
                "Oct 2024\n-\nJan 2026",
                "VN Media Hub",
                "Role: Main Frontend/Full-Stack Developer / BA-facing Owner",
                "Tech: React/admin UI, REST API contracts, forms, filters, reporting screens",
                [
                    "Built CMS/admin UI for content, moderation, SEO, authentication and reporting workflows.",
                    "Structured forms, filters and data states around API contracts before release handoff.",
                ],
            ),
            (
                "Feb 2026\n-\nPresent",
                "Betodemy - Product Platform",
                "Role: Core Full-Stack Developer in 5-person team",
                "Tech: ReactJS, Vite, product UI, issue tracking, GitLab CI",
                [
                    "Built and fixed product UI/features in weekly issue and release cycles with review handoff.",
                    "Created clear bug notes after release and supported frontend/API debugging with CI checks.",
                ],
            ),
            (
                "May 2026\n-\nJul 2026",
                "AI Power - Odoo ERP",
                "Role: ERP Support Developer Intern",
                "Tech: Odoo ERP workflows, XML/QWeb UI reports, PostgreSQL, Docker/GitLab CI",
                [
                    "Supported ERP UI/report fixes after BA/customer requirement updates in a real business system.",
                    "Read existing modules carefully before adjusting reports, i18n and workflow-related screens.",
                ],
            ),
        ],
        "projects": [
            {
                "mark": "PF",
                "title": "React Portfolio UI",
                "tech": "React, Vite, SlateJS, responsive CSS, form states",
                "body": "Built recruiter-facing component UI with editor/contact workflow, animation and responsive presentation.",
                "period": "Mar 2025 - May 2026",
            },
            {
                "mark": "VM",
                "title": "VN Media Hub Admin",
                "tech": "React UI, REST API, auth, forms/filters, reports",
                "body": "Implemented CMS/admin workflows with authenticated API data, moderation states and reporting screens.",
                "period": "Oct 2024 - Jan 2026",
            },
        ],
    },
    "voyager-reactjs-developer": {
        "output": ROOT / "cv" / "voyager-reactjs-developer" / "CV_NguyenXuanHai_Voyager_ReactJS_Developer_visual.pdf",
        "role": "ReactJS Developer",
        "stack_line": "ReactJS  |  NextJS  |  JavaScript  |  CI/CD  |  Unit Test Mindset",
        "headline": "React-focused developer with production web workflows, API-connected UI, Figma-to-frontend delivery and review-ready handoff.",
        "workflow": "I use AI agents to clarify requirements, compare UI states, review code, create test/checklist notes and speed up debugging without skipping quality control.",
        "skills": [
            ("ReactJS", "FRONTEND", "react.png"),
            ("NextJS Basics", "FRONTEND", "react.png"),
            ("JavaScript ES6+", "FRONTEND", "react.png"),
            ("HTML5 / CSS3", "FRONTEND", "react.png"),
            ("REST API", "INTEGRATION", "nestjs.png"),
            ("Figma to UI", "UI", "react.png"),
            ("GitLab CI", "CI/CD", "gitlab.png"),
            ("Unit Test Mindset", "QUALITY", "code-slash.svg"),
            ("Agile / Scrum", "PROCESS", "gitlab.png"),
            ("Code Review", "QUALITY", "gitlab.png"),
        ],
        "experiences": [
            (
                "Jul 2025\n-\nJan 2026",
                "Great Link Mai House",
                "Role: Main Frontend/Full-Stack Developer / BA-facing Owner",
                "Tech: ReactJS, REST API, ASP.NET Core, responsive UI, auth/media flows",
                [
                    "Converted WordPress flows into React screens with reusable states, responsive layout and API-backed data.",
                    "Worked from requirement clarification to release handoff; aligned UI states with backend REST contracts.",
                ],
            ),
            (
                "Oct 2024\n-\nJan 2026",
                "VN Media Hub",
                "Role: Main Frontend/Full-Stack Developer / BA-facing Owner",
                "Tech: ReactJS, CMS UI, REST API contracts, SEO/admin screens, reporting flows",
                [
                    "Built CMS/admin UI for content, moderation, SEO and reporting workflows used in media operations.",
                    "Mapped BA requirements into frontend tasks, edge cases, API contracts and QA-ready handoff notes.",
                ],
            ),
            (
                "Feb 2026\n-\nPresent",
                "Betodemy - Product Platform",
                "Role: Core Full-Stack Developer in 5-person team",
                "Tech: ReactJS, Vite, Tailwind, issue workflow, code review, CI handoff",
                [
                    "Built and fixed product UI/features through weekly issues, review notes and release checks.",
                    "Created bug issues after release and supported frontend/API debugging with CI handoff.",
                ],
            ),
            (
                "May 2026\n-\nJul 2026",
                "AI Power - Odoo ERP",
                "Role: Odoo ERP Support Developer Intern",
                "Tech: XML/QWeb UI reports, Python/Odoo business workflows, PostgreSQL",
                [
                    "Supported ERP UI/report fixes after BA/customer requirement updates in an existing business system.",
                    "Practiced careful change handling and validation before adjusting reports, i18n and module flows.",
                ],
            ),
        ],
        "projects": [
            {
                "mark": "PF",
                "title": "React Portfolio UI",
                "tech": "React, Vite, SlateJS, component UI, responsive CSS",
                "body": "Built recruiter-facing UI with component structure, editor/contact flow and responsive presentation.",
                "period": "Mar 2025 - May 2026",
            },
            {
                "mark": "VM",
                "title": "VN Media Hub CMS",
                "tech": "React UI, REST API, auth, admin workflows, reports",
                "body": "Implemented admin/CMS screens with authenticated API data, moderation and reporting workflows.",
                "period": "Oct 2024 - Jan 2026",
            },
        ],
    },
    "lima-frontend-react-nextjs": {
        "output": ROOT / "cv" / "lima-frontend-react-nextjs" / "CV_NguyenXuanHai_Lima_Frontend_React_NextJS_visual.pdf",
        "role": "Frontend Developer",
        "stack_line": "ReactJS  |  NextJS  |  TypeScript/ES6+  |  REST/GraphQL-ready  |  CI/CD",
        "headline": "Frontend-focused developer building React screens, API-connected product workflows, responsive UI and review-ready handoff.",
        "workflow": "I use AI agents to map UI/API states, clarify requirements, review code, create checklist notes and speed up debugging while keeping quality gates visible.",
        "skills": [
            ("ReactJS", "FRONTEND", "react.png"),
            ("NextJS Basics", "FRONTEND", "react.png"),
            ("TypeScript / ES6+", "FRONTEND", "react.png"),
            ("HTML5 / CSS3", "FRONTEND", "react.png"),
            ("Tailwind / SCSS", "STYLING", "react.png"),
            ("REST API", "INTEGRATION", "nestjs.png"),
            ("GraphQL-ready", "INTEGRATION", "nestjs.png"),
            ("Responsive UI", "UI/UX", "react.png"),
            ("Git Workflow", "TOOLS", "gitlab.png"),
            ("CI/CD Handoff", "DELIVERY", "gitlab.png"),
        ],
        "experiences": [
            (
                "Jul 2025\n-\nJan 2026",
                "Great Link Mai House",
                "Role: Main Frontend/Full-Stack Developer / BA-facing Owner",
                "Tech: ReactJS, REST API, ASP.NET Core, responsive UI, auth/media flows",
                [
                    "Converted WordPress flows into reusable React screens with API-backed data states and responsive layout.",
                    "Owned FE implementation from requirement clarification to release handoff; aligned UI states with backend REST contracts.",
                ],
            ),
            (
                "Oct 2024\n-\nJan 2026",
                "VN Media Hub",
                "Role: Main Frontend/Full-Stack Developer / BA-facing Owner",
                "Tech: ReactJS, CMS/admin UI, API contracts, SEO, reports, caching/logging workflows",
                [
                    "Built CMS/admin interfaces for content, moderation, SEO and reporting workflows used in media operations.",
                    "Mapped BA requirements into frontend tasks, edge cases, API contracts and QA-ready handoff notes.",
                ],
            ),
            (
                "Feb 2026\n-\nPresent",
                "Betodemy - Product Platform",
                "Role: Core Full-Stack Developer in 5-person team",
                "Tech: ReactJS, Vite, Tailwind, issue workflow, code review, CI handoff",
                [
                    "Built and fixed product UI/features through weekly issues, review notes and release checks.",
                    "Created bug issues after release and supported frontend/API debugging with CI handoff.",
                ],
            ),
            (
                "May 2026\n-\nJul 2026",
                "AI Power - Odoo ERP",
                "Role: Odoo ERP Support Developer Intern",
                "Tech: XML/QWeb UI reports, Python/Odoo business workflows, PostgreSQL",
                [
                    "Supported ERP UI/report fixes after BA/customer requirement updates in an existing business system.",
                    "Practiced careful change handling and validation before adjusting reports, i18n and module flows.",
                ],
            ),
        ],
        "projects": [
            {
                "mark": "PF",
                "title": "React Portfolio UI",
                "tech": "React, Vite, SlateJS, component UI, responsive CSS, form flow",
                "body": "Built recruiter-facing UI with reusable components, editor/contact flow and responsive presentation.",
                "period": "Mar 2025 - May 2026",
            },
            {
                "mark": "VM",
                "title": "VN Media Hub CMS",
                "tech": "React UI, REST API, auth, admin workflows, reports",
                "body": "Implemented admin/CMS screens with authenticated API data, moderation and reporting workflows.",
                "period": "Oct 2024 - Jan 2026",
            },
        ],
    },
    "hds-frontend-website": {
        "output": ROOT / "cv" / "hds-frontend-website" / "CV_NguyenXuanHai_HDS_Frontend_Website_visual.pdf",
        "role": "Frontend Developer - Website",
        "stack_line": "ReactJS  |  TypeScript/JavaScript  |  REST API  |  Async Data  |  Secure Web UI",
        "headline": "Frontend developer building API-connected React web interfaces, admin/product workflows, responsive UI and maintainable handoff for business systems.",
        "workflow": "I use AI agents to map UI/API flows, clarify requirements, create review notes, debug faster and prepare cleaner release handoff.",
        "skills": [
            ("ReactJS", "FRONTEND", "react.png"),
            ("TypeScript / JS", "FRONTEND", "react.png"),
            ("HTML5 / CSS3", "FRONTEND", "react.png"),
            ("REST API", "INTEGRATION", "nestjs.png"),
            ("Async Data Flow", "FRONTEND", "react.png"),
            ("Responsive UI", "UI/UX", "react.png"),
            ("WebSocket-ready", "REALTIME", "nestjs.png"),
            ("Git / Agile", "TEAM", "gitlab.png"),
            ("Code Review", "QUALITY", "gitlab.png"),
            ("Web Security Basics", "FINTECH", "nestjs.png"),
        ],
        "experiences": [
            (
                "Jul 2025\n-\nJan 2026",
                "Great Link Mai House",
                "Role: Main Frontend/Full-Stack Developer / BA-facing Owner",
                "Tech: ReactJS, TypeScript-style components, REST API, ASP.NET Core, responsive UI",
                [
                    "Converted WordPress workflows into reusable React screens integrated with ASP.NET Core REST APIs.",
                    "Handled auth, media and business UI states with clear API contracts, responsive layout and release handoff.",
                ],
            ),
            (
                "Oct 2024\n-\nJan 2026",
                "VN Media Hub",
                "Role: Main Frontend/Full-Stack Developer / BA-facing Owner",
                "Tech: ReactJS, CMS/admin UI, async API data, SEO, logging, reporting flows",
                [
                    "Built CMS/admin interfaces for content, moderation, SEO and report workflows with API-backed data states.",
                    "Translated BA requirements into frontend tasks, edge cases, API contracts and QA-ready handoff notes.",
                ],
            ),
            (
                "Feb 2026\n-\nPresent",
                "Betodemy - Product Platform",
                "Role: Core Full-Stack Developer in 5-person team",
                "Tech: ReactJS, Vite, Tailwind, issue workflow, code review, CI handoff",
                [
                    "Built and fixed product UI/features through weekly issues, review notes and release checks.",
                    "Coordinated frontend/API debugging with the team to keep learning workflows stable after release.",
                ],
            ),
            (
                "May 2026\n-\nJul 2026",
                "AI Power - Odoo ERP",
                "Role: Odoo ERP Support Developer Intern",
                "Tech: XML/QWeb UI reports, Python/Odoo business workflows, PostgreSQL",
                [
                    "Supported ERP UI/report fixes after BA/customer requirement updates in a production business system.",
                    "Practiced careful change handling, validation and i18n/report adjustments across existing modules.",
                ],
            ),
        ],
        "projects": [
            {
                "mark": "PF",
                "title": "React Portfolio UI",
                "tech": "React, Vite, SlateJS, component UI, responsive CSS",
                "body": "Built recruiter-facing UI with component structure, editor/contact flow and responsive presentation.",
                "period": "Mar 2025 - May 2026",
            },
            {
                "mark": "VM",
                "title": "VN Media Hub CMS",
                "tech": "React UI, REST API, auth, admin workflows, reports",
                "body": "Implemented admin/CMS screens with authenticated API data, moderation and reporting workflows.",
                "period": "Oct 2024 - Jan 2026",
            },
        ],
    },
    "one-tech-stop-fullstack": {
        "output": ROOT / "cv" / "one-tech-stop-fullstack" / "CV_NguyenXuanHai_ONE_Tech_Stop_Fullstack_visual.pdf",
        "role": "Full-Stack Developer",
        "stack_line": "ReactJS  |  NodeJS/NestJS  |  TypeScript  |  SQL  |  CI/CD",
        "headline": "Full-stack developer building product features, REST API workflows, SQL-backed screens and release-ready handoff.",
        "workflow": "I use AI agents to read product requirements, plan backlog tasks, review code, document handoff and support CI checks.",
        "skills": [
            ("ReactJS", "FRONTEND", "react.png"),
            ("TypeScript", "FRONTEND", "react.png"),
            ("NodeJS / NestJS", "BACKEND", "nestjs.png"),
            ("RESTful API", "API", "nestjs.png"),
            ("SQL / PostgreSQL", "DATABASE", "postgresql.png"),
            ("API Contracts", "INTEGRATION", "nestjs.png"),
            ("CI/CD Handoff", "DELIVERY", "gitlab.png"),
            ("Agile Backlog", "PROCESS", "gitlab.png"),
            ("Testing Mindset", "QUALITY", "react.png"),
            ("Docker", "INFRA", "docker.png"),
        ],
        "experiences": [
            (
                "Feb 2026\n-\nPresent",
                "Betodemy - Product Platform",
                "Role: Core Full-Stack Developer in 5-person team",
                "Tech: ReactJS, NestJS, TypeORM, PostgreSQL, Redis, BullMQ, Nx, GitLab CI",
                [
                    "Built and fixed backlog features across learning modules in a weekly product/release workflow.",
                    "Worked with issue tracking, review notes and CI handoff to improve delivery quality.",
                ],
            ),
            (
                "Jul 2025\n-\nJan 2026",
                "Great Link Mai House",
                "Role: Main Full-Stack Developer / BA-facing Owner",
                "Tech: ReactJS, ASP.NET Core REST API, SQL Server, JWT, SignalR, media integrations",
                [
                    "Converted WordPress flows into React screens and API-backed business workflows.",
                    "Owned auth, realtime, media and integration screens from requirement clarification to release.",
                ],
            ),
            (
                "Oct 2024\n-\nJan 2026",
                "VN Media Hub",
                "Role: Main Full-Stack Developer / BA-facing Owner",
                "Tech: ReactJS, ASP.NET Core Web API, SQL Server, caching, logging, reports",
                [
                    "Built CMS/admin UI and API workflows for content, moderation, SEO and reporting.",
                    "Mapped BA requirements into frontend states, API contracts and database-backed release tasks.",
                ],
            ),
            (
                "May 2026\n-\nJul 2026",
                "AI Power - Odoo ERP",
                "Role: Odoo ERP Support Developer Intern",
                "Tech: Python/Odoo, PostgreSQL, XML/QWeb reports, Docker, GitLab CI",
                [
                    "Fixed ERP business logic and reports after BA/customer requirement updates.",
                    "Worked across 18 modules and 99+ Python files with Dockerized development workflow.",
                ],
            ),
        ],
        "projects": [
            {
                "mark": "PF",
                "title": "Portfolio AI Assistant",
                "tech": "React, Vite, Gemini API, SlateJS, responsive UI",
                "body": "Built recruiter-facing assistant/contact flow with component UI, API integration and editor UX.",
                "period": "Mar 2025 - May 2026",
            },
            {
                "mark": "EC",
                "title": "ECH LMS",
                "tech": "REST API, Auth, SQL Server, Bootstrap UI, PDF/Excel reports",
                "body": "Built LMS workflows around API-backed course/content, authentication and reporting tasks.",
                "period": "Oct 2024 - Jan 2026",
            },
        ],
    },
    "secom-fullstack-react-node": {
        "output": ROOT / "cv" / "secom-fullstack-react-node" / "CV_NguyenXuanHai_SECOM_Fullstack_React_Node_visual.pdf",
        "role": "Fullstack Developer",
        "stack_line": "React + TypeScript  |  NodeJS/NestJS  |  SQL  |  Auth  |  API Integration",
        "headline": "Full-stack developer focused on React/TypeScript screens, API-backed workflows, SQL data flow and safe release handoff.",
        "workflow": "I use AI agents to understand requirements/codebases, plan tasks, review edge cases, support tests and document deployment handoff.",
        "skills": [
            ("React + TypeScript", "FRONTEND", "react.png"),
            ("NodeJS / NestJS", "BACKEND", "nestjs.png"),
            ("RESTful API", "API", "nestjs.png"),
            ("SQL / Database Design", "DATABASE", "postgresql.png"),
            ("Auth / Authorization", "SECURITY", "dotnet.png"),
            ("Caching / Logging", "QUALITY", "code-slash.svg"),
            ("Unit Test Mindset", "TESTING", "file-earmark-text.svg"),
            ("API Integration", "INTEGRATION", "nestjs.png"),
            ("Git / CI Handoff", "DELIVERY", "gitlab.png"),
            ("Agile / Code Review", "TEAM", "gitlab.png"),
        ],
        "experiences": [
            (
                "Feb 2026\n-\nPresent",
                "Betodemy - Product Platform",
                "Role: Core Full-Stack Developer in 5-person team",
                "Tech: ReactJS, NestJS, TypeORM, PostgreSQL, Redis, BullMQ, Nx, GitLab CI",
                [
                    "Built and fixed React/API features in weekly issue cycles with review notes and release handoff.",
                    "Worked with modular backend services, PostgreSQL data flows, Redis/BullMQ jobs and CI checks.",
                ],
            ),
            (
                "Jul 2025\n-\nJan 2026",
                "Great Link Mai House",
                "Role: Main Full-Stack Developer / BA-facing Owner",
                "Tech: ReactJS, ASP.NET Core REST API, SQL Server, JWT, SignalR, media integrations",
                [
                    "Converted WordPress workflows into reusable React screens connected to REST APIs and SQL-backed data.",
                    "Owned auth, media and realtime flows from requirement clarification to production-ready handoff.",
                ],
            ),
            (
                "Oct 2024\n-\nJan 2026",
                "VN Media Hub",
                "Role: Main Full-Stack Developer / BA-facing Owner",
                "Tech: ReactJS, ASP.NET Core Web API, SQL Server, caching, logging, report workflows",
                [
                    "Built CMS/admin workflows for content, moderation, SEO and reports with clear API contracts.",
                    "Applied logging/caching checks and bug fixing to stabilize data-heavy business screens.",
                ],
            ),
            (
                "May 2026\n-\nJul 2026",
                "AI Power - Odoo ERP",
                "Role: ERP Support Developer Intern",
                "Tech: Python/Odoo, PostgreSQL, XML/QWeb reports, Docker, GitLab CI",
                [
                    "Supported ERP fixes in existing modules after BA/customer requirement updates.",
                    "Practiced careful change handling across business logic, reports and PostgreSQL-backed workflows.",
                ],
            ),
        ],
        "projects": [
            {
                "mark": "BT",
                "title": "Betodemy Product Modules",
                "tech": "ReactJS, NestJS, PostgreSQL, Redis/BullMQ, GitLab CI",
                "body": "Delivered issue-based product features, bug fixes and release handoff across frontend/API workflows.",
                "period": "Feb 2026 - Present",
            },
            {
                "mark": "PF",
                "title": "Portfolio AI Assistant",
                "tech": "React, Vite, Gemini API, SlateJS, responsive UI",
                "body": "Built recruiter-facing assistant/contact flow with component UI, API integration and editor UX.",
                "period": "Mar 2025 - May 2026",
            },
        ],
    },
    "vincent-software-engineer-ii": {
        "output": ROOT / "cv" / "vincent-software-engineer-ii" / "CV_NguyenXuanHai_Vincent_Software_Engineer_II_visual.pdf",
        "role": "Software Engineer",
        "stack_line": "C#/.NET  |  Vue/React  |  SQL  |  CI/CD  |  AI-assisted review",
        "headline": "Full-stack developer with practical production exposure, safe change handling, API/database workflows and AI-assisted review discipline.",
        "workflow": "I use AI tools for codebase context, implementation plans and review notes, then manually verify output before shipping.",
        "skills": [
            ("C# / .NET", "BACKEND", "dotnet.png"),
            ("ASP.NET Core API", "BACKEND", "dotnet.png"),
            ("Vue / React UI", "FRONTEND", "react.png"),
            ("SQL / PostgreSQL", "DATABASE", "postgresql.png"),
            ("OOP / SOLID", "FOUNDATION", "dotnet.png"),
            ("REST API", "INTEGRATION", "nestjs.png"),
            ("Git / CI/CD", "DELIVERY", "gitlab.png"),
            ("Debugging", "QUALITY", "code-slash.svg"),
            ("Legacy-safe Change", "MAINTAIN", "file-earmark-text.svg"),
            ("AI Critical Review", "AI TOOLS", "robot.svg"),
        ],
        "experiences": [
            (
                "Jul 2025\n-\nJan 2026",
                "Great Link Mai House",
                "Role: Main Full-Stack Developer / BA-facing Owner",
                "Tech: ASP.NET Core REST API, C#, React/Vue-style components, SQL Server, JWT, SignalR",
                [
                    "Converted legacy WordPress flows into API-backed web modules with MVC-style separation and reusable UI states.",
                    "Owned auth, media and realtime workflows from requirement clarification to release, debugging edge cases before handoff.",
                ],
            ),
            (
                "Oct 2024\n-\nJan 2026",
                "VN Media Hub",
                "Role: Main Full-Stack Developer / BA-facing Owner",
                "Tech: ASP.NET Core Web API, SQL Server, CMS/admin UI, logging, caching, reports",
                [
                    "Built CMS/admin features for content, moderation, SEO and reporting with API contracts and SQL-backed data flows.",
                    "Stabilized existing business flows through systematic debugging, logging checks and small safe changes.",
                ],
            ),
            (
                "Feb 2026\n-\nPresent",
                "Betodemy - Product Platform",
                "Role: Core Full-Stack Developer in 5-person team",
                "Tech: ReactJS, NestJS, PostgreSQL, Redis, BullMQ, GitLab CI, issue/release workflow",
                [
                    "Delivered backlog features and bug fixes in a team workflow with issue tracking, review notes and CI handoff.",
                    "Used AI-assisted context/review to speed up debugging while still checking code behavior before release.",
                ],
            ),
            (
                "May 2026\n-\nJul 2026",
                "AI Power - Odoo ERP",
                "Role: Odoo ERP Support Developer Intern",
                "Tech: Python/Odoo, PostgreSQL, XML/QWeb reports, Docker, GitLab CI",
                [
                    "Supported ERP fixes on existing modules after BA/customer updates, including reports, i18n and business logic.",
                    "Practiced careful change handling across a larger codebase: 18 custom modules and 99+ Python files.",
                ],
            ),
        ],
        "projects": [
            {
                "mark": "VM",
                "title": "VN Media Hub CMS",
                "tech": "ASP.NET Core API, SQL Server, admin UI, caching, logging, reports",
                "body": "Built and stabilized CMS workflows with API contracts, SQL-backed modules and reporting/debugging handoff.",
                "period": "Oct 2024 - Jan 2026",
            },
            {
                "mark": "AI",
                "title": "AI Review Workflow",
                "tech": "Codex, Claude, review checklists, CI handoff, codebase context",
                "body": "Created project-aware prompts and review notes to catch risky AI output, clarify changes and support release checks.",
                "period": "Mar 2025 - May 2026",
            },
        ],
    },
    "dai-duong-dotnet-angular-erp": {
        "output": ROOT / "cv" / "dai-duong-dotnet-angular-erp" / "CV_NguyenXuanHai_DaiDuong_DotNet_Angular_ERP_visual.pdf",
        "role": "Fullstack .NET Developer",
        "stack_line": ".NET Core Web API  |  Angular/TypeScript  |  SQL  |  ERP  |  AI-assisted refactor",
        "headline": "Full-stack developer building ERP/CMS-style web modules, REST APIs, SQL-backed workflows and AI-assisted quality handoff.",
        "workflow": "I use AI agents to analyze requirements, refactor safely, catch logic risks, prepare review notes and document release handoff.",
        "skills": [
            (".NET Core Web API", "BACKEND", "dotnet.png"),
            ("C# / OOP / SOLID", "FOUNDATION", "dotnet.png"),
            ("Angular / TypeScript", "FRONTEND", "react.png"),
            ("Component UI", "FRONTEND", "react.png"),
            ("SQL Server / PostgreSQL", "DATABASE", "postgresql.png"),
            ("RESTful Services", "API", "nestjs.png"),
            ("ERP Workflows", "BUSINESS", "file-earmark-text.svg"),
            ("Validation / Forms", "UI LOGIC", "code-slash.svg"),
            ("Troubleshooting", "QUALITY", "robot.svg"),
            ("AI Refactor Review", "AI TOOLS", "robot.svg"),
        ],
        "experiences": [
            (
                "May 2026\n-\nJul 2026",
                "AI Power - Odoo ERP",
                "Role: Odoo ERP Support Developer Intern",
                "Tech: ERP workflows, Python/Odoo, PostgreSQL, XML/QWeb reports, Docker, GitLab CI",
                [
                    "Supported ERP module fixes after BA/customer updates, including business flows, reports, i18n and validation cases.",
                    "Worked in a larger existing codebase and practiced safe changes across 18 custom modules and 99+ Python files.",
                ],
            ),
            (
                "Jul 2025\n-\nJan 2026",
                "Great Link Mai House",
                "Role: Main Full-Stack Developer / BA-facing Owner",
                "Tech: ASP.NET Core Web API, C#, React/Angular-style components, SQL Server, JWT, media workflows",
                [
                    "Converted business requirements into API-backed management screens with MVC-style separation and reusable UI states.",
                    "Built auth, media and integration workflows while clarifying edge cases with BA-facing ownership before release.",
                ],
            ),
            (
                "Oct 2024\n-\nJan 2026",
                "VN Media Hub",
                "Role: Main Full-Stack Developer / BA-facing Owner",
                "Tech: ASP.NET Core API, SQL Server, CMS/admin UI, caching, logging, PDF/report flows",
                [
                    "Built admin/CMS workflows for content, moderation, SEO and reports using API contracts and SQL-backed data flows.",
                    "Handled debugging, logging/caching checks and report handoff to stabilize data-heavy business screens.",
                ],
            ),
            (
                "Feb 2026\n-\nPresent",
                "Betodemy - Product Platform",
                "Role: Core Full-Stack Developer in 5-person team",
                "Tech: ReactJS, NestJS, PostgreSQL, Redis, BullMQ, GitLab CI, issue workflow",
                [
                    "Delivered product features and bug fixes through weekly issues, review notes and CI/release handoff.",
                    "Used AI-assisted context and review to speed up refactor/debug work while manually checking behavior.",
                ],
            ),
        ],
        "projects": [
            {
                "mark": "ER",
                "title": "ERP Module Support",
                "tech": "ERP workflow, PostgreSQL, reports, validation, Docker, GitLab CI",
                "body": "Supported existing ERP modules with safe requirement changes, report fixes and business-flow debugging.",
                "period": "May 2026 - Jul 2026",
            },
            {
                "mark": "EC",
                "title": "ECH LMS",
                "tech": "ASP.NET Core MVC/API, SQL Server, validation, reports, Bootstrap UI",
                "body": "Built education workflows with course/content screens, authentication and PDF/Excel report generation.",
                "period": "Oct 2024 - Jan 2026",
            },
        ],
    },
    "sacombank-frontend-application": {
        "output": ROOT / "cv" / "sacombank-frontend-application" / "CV_NguyenXuanHai_Sacombank_Frontend_Application_visual.pdf",
        "role": "Frontend Application Developer",
        "stack_line": "JavaScript/TypeScript  |  React/NextJS  |  Redux-style state  |  REST API  |  Tailwind",
        "headline": "Frontend-focused developer building API-connected web applications, reusable UI states, auth flows and release-ready frontend handoff.",
        "workflow": "I use AI agents to read requirements, compare UI/API behavior, prepare review notes and document release handoff without skipping manual checks.",
        "skills": [
            ("JavaScript / TypeScript", "FRONTEND", "react.png"),
            ("React / NextJS", "FRONTEND", "react.png"),
            ("Redux-style State", "STATE", "react.png"),
            ("REST API Integration", "API", "nestjs.png"),
            ("Tailwind / Responsive UI", "UI", "react.png"),
            ("Auth / Permission UI", "SECURITY", "dotnet.png"),
            ("Coding Convention", "QUALITY", "code-slash.svg"),
            ("Git Workflow", "TOOLS", "gitlab.png"),
            ("Bug Fixing", "QUALITY", "robot.svg"),
            ("AI Review Notes", "DELIVERY", "file-earmark-text.svg"),
        ],
        "experiences": [
            (
                "Jul 2025\n-\nJan 2026",
                "Great Link Mai House",
                "Role: Main Frontend/Full-Stack Developer / BA-facing Owner",
                "Tech: ReactJS, ASP.NET Core REST API, SQL Server, JWT/auth, responsive UI",
                [
                    "Converted WordPress workflows into React screens connected to REST APIs and auth/media flows.",
                    "Built reusable UI states, handled responsive behavior and coordinated requirement-to-release handoff.",
                ],
            ),
            (
                "Oct 2024\n-\nJan 2026",
                "VN Media Hub",
                "Role: Main Frontend/Full-Stack Developer / BA-facing Owner",
                "Tech: ReactJS, API contracts, CMS/admin UI, auth, SEO/report screens",
                [
                    "Implemented CMS/admin screens for content, moderation, authentication, SEO and reporting workflows.",
                    "Mapped BA requirements into UI states, API contracts and stable frontend tasks for release.",
                ],
            ),
            (
                "Feb 2026\n-\nPresent",
                "Betodemy - Product Platform",
                "Role: Core Full-Stack Developer in 5-person team",
                "Tech: ReactJS, NestJS, PostgreSQL, issue tracking, GitLab CI, review handoff",
                [
                    "Built and fixed product UI/features in a weekly issue/release workflow with team review.",
                    "Supported debugging, code review notes and CI handoff across frontend/API tasks.",
                ],
            ),
            (
                "May 2026\n-\nJul 2026",
                "AI Power - Odoo ERP",
                "Role: ERP Support Developer Intern",
                "Tech: Python/Odoo, QWeb/XML reports, PostgreSQL, Docker, GitLab CI",
                [
                    "Supported ERP UI/report fixes after BA/customer requirement updates.",
                    "Practiced careful debugging, coding convention and handoff in existing business modules.",
                ],
            ),
        ],
        "projects": [
            {
                "mark": "PF",
                "title": "React Portfolio UI",
                "tech": "React, Vite, SlateJS, responsive UI, form states",
                "body": "Built recruiter-facing UI with editor/contact workflow, reusable components and deployment-ready presentation.",
                "period": "Mar 2025 - May 2026",
            },
            {
                "mark": "VM",
                "title": "VN Media Hub CMS",
                "tech": "React UI, REST API, auth, admin workflows, reports",
                "body": "Implemented CMS/admin flows with authenticated API data, moderation states and reporting screens.",
                "period": "Oct 2024 - Jan 2026",
            },
        ],
    },
    "eazylab-frontend-react-typescript": {
        "output": ROOT / "cv" / "eazylab-frontend-react-typescript" / "CV_NguyenXuanHai_Eazylab_Frontend_React_TypeScript_visual.pdf",
        "role": "Frontend Developer",
        "stack_line": "ReactJS  |  TypeScript  |  Admin Dashboard  |  API Data Flow  |  Tailwind",
        "headline": "React-focused frontend developer building admin/CMS UI, API-connected data flows, reusable components and maintainable handoff.",
        "workflow": "I use AI agents to inspect codebases, plan UI/data-flow changes, review edge cases, document handoff and speed up debugging.",
        "skills": [
            ("ReactJS", "FRONTEND", "react.png"),
            ("TypeScript", "FRONTEND", "react.png"),
            ("Admin Dashboard", "PRODUCT UI", "react.png"),
            ("API Data Flow", "API", "nestjs.png"),
            ("State Patterns", "STATE", "react.png"),
            ("Tailwind CSS", "UI", "react.png"),
            ("Component Design", "ARCHITECTURE", "code-slash.svg"),
            ("Figma Handoff", "UI/UX", "file-earmark-text.svg"),
            ("Git Workflow", "TOOLS", "gitlab.png"),
            ("Refactor Mindset", "QUALITY", "robot.svg"),
        ],
        "experiences": [
            (
                "Oct 2024\n-\nJan 2026",
                "VN Media Hub",
                "Role: Main Frontend/Full-Stack Developer / BA-facing Owner",
                "Tech: ReactJS, admin/CMS UI, REST API contracts, auth, reports, caching/logging context",
                [
                    "Built admin/CMS screens for content, moderation, authentication, SEO and reporting workflows.",
                    "Structured UI states around API contracts, filters, forms and release-ready frontend tasks.",
                ],
            ),
            (
                "Jul 2025\n-\nJan 2026",
                "Great Link Mai House",
                "Role: Main Frontend/Full-Stack Developer / BA-facing Owner",
                "Tech: ReactJS, responsive UI, ASP.NET Core REST API, auth/media integrations",
                [
                    "Converted WordPress flows into React screens with reusable UI states and API-backed behavior.",
                    "Handled responsive screens, auth/media workflows and requirement clarification with BA-facing ownership.",
                ],
            ),
            (
                "Feb 2026\n-\nPresent",
                "Betodemy - Product Platform",
                "Role: Core Full-Stack Developer in 5-person team",
                "Tech: ReactJS, NestJS, PostgreSQL, issue tracking, GitLab CI, release workflow",
                [
                    "Built and fixed product UI/features in weekly issue/release cycles with code review handoff.",
                    "Used debugging notes and CI checks to reduce rework across frontend/API tasks.",
                ],
            ),
            (
                "May 2026\n-\nJul 2026",
                "AI Power - Odoo ERP",
                "Role: ERP Support Developer Intern",
                "Tech: Python/Odoo, PostgreSQL, XML/QWeb reports, Docker, GitLab CI",
                [
                    "Supported business UI/report fixes after BA/customer requirement updates.",
                    "Read existing modules carefully before making stable changes and handoff notes.",
                ],
            ),
        ],
        "projects": [
            {
                "mark": "PF",
                "title": "React Portfolio UI",
                "tech": "React, Vite, SlateJS, component UI, responsive CSS",
                "body": "Built component-based portfolio/contact flow with editor UX, form states and responsive presentation.",
                "period": "Mar 2025 - May 2026",
            },
            {
                "mark": "VM",
                "title": "VN Media Hub Admin",
                "tech": "React UI, REST API, auth, filters/forms, reports",
                "body": "Built CMS/admin workflows with API-backed content, moderation, authenticated states and reporting screens.",
                "period": "Oct 2024 - Jan 2026",
            },
        ],
    },
    "tmt-frontend-angular-typescript": {
        "output": ROOT / "cv" / "tmt-frontend-angular-typescript" / "CV_NguyenXuanHai_TMT_Frontend_Angular_TypeScript_visual.pdf",
        "role": "Frontend Developer",
        "stack_line": "TypeScript  |  HTML5/CSS3  |  REST API  |  Responsive UI  |  Component Refactor",
        "headline": "Frontend developer with practical TypeScript/React UI experience, API-connected workflows, responsive screens and a fast-learning mindset for Angular product teams.",
        "workflow": "I use AI agents to read UI/API flows, clarify requirements, compare component states, review edge cases and document frontend handoff.",
        "skills": [
            ("TypeScript / JavaScript", "FRONTEND", "react.png"),
            ("HTML5 / CSS3", "FRONTEND", "react.png"),
            ("Angular-ready", "LEARNING", "code-slash.svg"),
            ("REST / GraphQL API", "INTEGRATION", "nestjs.png"),
            ("Responsive UI", "UI", "react.png"),
            ("Component Refactor", "QUALITY", "code-slash.svg"),
            ("Figma to UI", "UI/UX", "file-earmark-text.svg"),
            ("Git Workflow", "TOOLS", "gitlab.png"),
            ("Agile / Scrum", "PROCESS", "gitlab.png"),
            ("Backend Context", "PLUS", "dotnet.png"),
        ],
        "experiences": [
            (
                "Jul 2025\n-\nJan 2026",
                "Great Link Mai House",
                "Role: Main Frontend/Full-Stack Developer / BA-facing Owner",
                "Tech: TypeScript-style React components, REST API, responsive UI, auth/media flows",
                [
                    "Converted WordPress workflows into reusable frontend screens connected to ASP.NET Core REST APIs.",
                    "Handled responsive behavior, auth/media states and requirement clarification from BA to release.",
                ],
            ),
            (
                "Oct 2024\n-\nJan 2026",
                "VN Media Hub",
                "Role: Main Frontend/Full-Stack Developer / BA-facing Owner",
                "Tech: CMS/admin UI, REST API contracts, filters/forms, SEO/report screens",
                [
                    "Built CMS/admin screens for content, moderation, authentication, SEO and reporting workflows.",
                    "Structured UI states around API contracts, forms, filters and release-ready frontend tasks.",
                ],
            ),
            (
                "Feb 2026\n-\nPresent",
                "Betodemy - Product Platform",
                "Role: Core Full-Stack Developer in 5-person team",
                "Tech: ReactJS, Vite, Tailwind, issue tracking, review/CI handoff",
                [
                    "Built and fixed product UI/features in weekly issue/release cycles with code review handoff.",
                    "Created bug issues after release and supported frontend/API debugging with CI notes.",
                ],
            ),
            (
                "May 2026\n-\nJul 2026",
                "AI Power - Odoo ERP",
                "Role: ERP Support Developer Intern",
                "Tech: XML/QWeb UI reports, Python/Odoo business workflows, PostgreSQL",
                [
                    "Supported UI/report fixes after BA/customer requirement updates in a business system.",
                    "Practiced careful change handling in existing modules before preparing handoff notes.",
                ],
            ),
        ],
        "projects": [
            {
                "mark": "PF",
                "title": "React Portfolio UI",
                "tech": "TypeScript-ready React, Vite, SlateJS, responsive CSS, form states",
                "body": "Built recruiter-facing component UI with editor/contact workflow, responsive layout and deployment-ready presentation.",
                "period": "Mar 2025 - May 2026",
            },
            {
                "mark": "VM",
                "title": "VN Media Hub Admin",
                "tech": "Frontend UI, REST API, auth, filters/forms, reports",
                "body": "Implemented CMS/admin workflows with authenticated API data, moderation states and reporting screens.",
                "period": "Oct 2024 - Jan 2026",
            },
        ],
    },
    "tinovation-fresher-nodejs": {
        "output": ROOT / "cv" / "tinovation-fresher-nodejs" / "CV_NguyenXuanHai_Tinovation_Fresher_NodeJS_visual.pdf",
        "role": "Fresher NodeJS Developer",
        "stack_line": "NodeJS/NestJS  |  ReactJS  |  JavaScript  |  REST API  |  Database",
        "headline": "Fresher/junior full-stack developer with product workflow exposure, React UI, REST API tasks and debugging mindset.",
        "workflow": "I use AI agents to read codebases, plan tasks, review bugs, write handoff notes and learn new MERN-style workflows faster.",
        "skills": [
            ("JavaScript", "FOUNDATION", "react.png"),
            ("NodeJS / NestJS", "BACKEND", "nestjs.png"),
            ("RESTful API", "API", "nestjs.png"),
            ("ReactJS", "FRONTEND", "react.png"),
            ("Database Design", "DATABASE", "postgresql.png"),
            ("PostgreSQL/SQL", "DATABASE", "postgresql.png"),
            ("Git Workflow", "TOOLS", "gitlab.png"),
            ("Debugging", "QUALITY", "code-slash.svg"),
            ("HTML/CSS", "FRONTEND", "react.png"),
            ("Docker Basics", "INFRA", "docker.png"),
        ],
        "experiences": [
            (
                "Feb 2026\n-\nPresent",
                "Betodemy - Product Platform",
                "Role: Core Full-Stack Developer in 5-person team",
                "Tech: ReactJS, NestJS, PostgreSQL, Redis, BullMQ, Nx, GitLab CI",
                [
                    "Built and fixed product features in a weekly issue/release workflow.",
                    "Worked with frontend/API tasks, debugging notes and CI handoff across existing modules.",
                ],
            ),
            (
                "Jul 2025\n-\nJan 2026",
                "Great Link Mai House",
                "Role: Main Full-Stack Developer / BA-facing Owner",
                "Tech: ReactJS, REST APIs, ASP.NET Core backend, SQL Server, JWT, realtime/media flows",
                [
                    "Built React screens connected to REST APIs for auth, media and business workflows.",
                    "Clarified requirements, implemented UI/API changes and prepared release handoff.",
                ],
            ),
            (
                "Oct 2024\n-\nJan 2026",
                "VN Media Hub",
                "Role: Main Full-Stack Developer / BA-facing Owner",
                "Tech: ReactJS, REST API, SQL Server, caching, logging, reports",
                [
                    "Built CMS/admin UI flows for content, moderation, SEO and reporting screens.",
                    "Mapped BA requirements into API contracts, frontend states and database-backed tasks.",
                ],
            ),
            (
                "May 2026\n-\nJul 2026",
                "AI Power - Odoo ERP",
                "Role: Odoo ERP Support Developer Intern",
                "Tech: Python/Odoo, PostgreSQL, XML/QWeb reports, Docker, GitLab CI",
                [
                    "Supported bug fixing in an existing ERP codebase after BA/customer updates.",
                    "Practiced careful debugging, documentation and release-safe change handling.",
                ],
            ),
        ],
        "projects": [
            {
                "mark": "PF",
                "title": "Portfolio AI Assistant",
                "tech": "React, Vite, Gemini API, SlateJS, responsive UI",
                "body": "Built recruiter-facing assistant/contact flow with component UI, API integration and editor UX.",
                "period": "Mar 2025 - May 2026",
            },
            {
                "mark": "BE",
                "title": "Betodemy Product Tasks",
                "tech": "ReactJS, NestJS, PostgreSQL, Redis, GitLab CI",
                "body": "Handled feature/bug tasks in a product workflow with issue tracking, review notes and release handoff.",
                "period": "Feb 2026 - Present",
            },
        ],
    },
    "systemexe-fresher-developer": {
        "output": ROOT / "cv" / "systemexe-fresher-developer" / "CV_NguyenXuanHai_SystemEXE_Fresher_Developer_visual.pdf",
        "role": "Fresher Developer",
        "stack_line": "OOP  |  .NET/C#  |  JavaScript  |  SQL  |  Software Testing",
        "headline": "Fresher/Junior developer with production exposure in web systems, API workflows, debugging and release support.",
        "workflow": "I use AI agents to study codebases, prepare implementation plans, review bugs, document handoff and learn new stacks faster.",
        "skills": [
            ("OOP Fundamentals", "CORE", "code-slash.svg"),
            ("ASP.NET Core / C#", "BACKEND", "dotnet.png"),
            ("JavaScript", "FRONTEND", "react.png"),
            ("SQL / Database", "DATABASE", "postgresql.png"),
            ("REST API", "API", "nestjs.png"),
            ("HTML/CSS", "FRONTEND", "react.png"),
            ("Git Workflow", "TOOLS", "gitlab.png"),
            ("Debugging", "QUALITY", "code-slash.svg"),
            ("Testing Mindset", "QUALITY", "react.png"),
            ("Documentation", "PROCESS", "file-earmark-text.svg"),
        ],
        "experiences": [
            (
                "Jul 2025\n-\nJan 2026",
                "Great Link Mai House",
                "Role: Main Full-Stack Developer / BA-facing Owner",
                "Tech: ReactJS, ASP.NET Core REST API, SQL Server, JWT, OOP service layers",
                [
                    "Converted WordPress workflows into maintainable React + ASP.NET Core screens and APIs.",
                    "Clarified requirements, debugged API/UI issues and prepared release-ready handoff notes.",
                ],
            ),
            (
                "Oct 2024\n-\nJan 2026",
                "VN Media Hub",
                "Role: Main Full-Stack Developer / BA-facing Owner",
                "Tech: ASP.NET Core Web API, SQL Server, auth, caching, logging, reports",
                [
                    "Built CMS/admin modules for content, auth, moderation, SEO and reporting workflows.",
                    "Applied API contracts, SQL-backed data flows and bug-fixing discipline for production tasks.",
                ],
            ),
            (
                "Feb 2026\n-\nPresent",
                "Betodemy - Product Platform",
                "Role: Core Full-Stack Developer in 5-person team",
                "Tech: ReactJS, NestJS, PostgreSQL, Redis, BullMQ, GitLab CI, issue tracking",
                [
                    "Joined weekly product workflow to build features, fix bugs and follow release checklists.",
                    "Created issues after release and supported operations with review/debug handoff.",
                ],
            ),
            (
                "May 2026\n-\nJul 2026",
                "AI Power - Odoo ERP",
                "Role: Odoo ERP Support Developer Intern",
                "Tech: Python/Odoo, PostgreSQL, XML/QWeb reports, Docker, GitLab CI",
                [
                    "Supported ERP bug fixes after BA/customer requirement updates across business modules.",
                    "Worked carefully with existing code, reports and i18n to keep changes stable.",
                ],
            ),
        ],
        "projects": [
            {
                "mark": "EC",
                "title": "ECH LMS",
                "tech": "ASP.NET Core API, SQL Server, Auth, Bootstrap UI, Reports",
                "body": "Built LMS workflows with API-backed course/content screens, login flow and PDF/Excel reports.",
                "period": "Oct 2024 - Jan 2026",
            },
            {
                "mark": "PF",
                "title": "React Portfolio UI",
                "tech": "React, Vite, JavaScript, SlateJS, responsive UI",
                "body": "Built personal portfolio/contact workflow with component UI, form states and deployment-ready frontend.",
                "period": "Mar 2025 - May 2026",
            },
        ],
    },
    "blh-software-developer-csharp-tsql": {
        "output": ROOT / "cv" / "blh-software-developer-csharp-tsql" / "CV_NguyenXuanHai_BLH_Software_Developer_CSharp_TSQL_visual.pdf",
        "role": "Software Developer",
        "stack_line": "C#  |  ASP.NET Core  |  SQL Server/T-SQL  |  JavaScript/TypeScript  |  HTML/CSS",
        "headline": "Software developer with web/API experience, SQL-backed business workflows, frontend implementation and practical debugging/release support.",
        "workflow": "I use AI agents to read requirements, inspect existing code, prepare implementation notes, review bugs and document release handoff.",
        "skills": [
            ("C# / ASP.NET Core", "BACKEND", "dotnet.png"),
            ("SQL Server / T-SQL", "DATABASE", "postgresql.png"),
            ("REST API", "BACKEND", "nestjs.png"),
            ("JavaScript / TypeScript", "FRONTEND", "react.png"),
            ("HTML5 / CSS3", "FRONTEND", "react.png"),
            ("OOP / MVC", "ARCHITECTURE", "dotnet.png"),
            ("Auth / JWT", "SECURITY", "dotnet.png"),
            ("Code Review", "QUALITY", "gitlab.png"),
            ("Testing / Debugging", "QUALITY", "code-slash.svg"),
            ("Git Workflow", "TOOLS", "gitlab.png"),
        ],
        "experiences": [
            (
                "Jul 2025\n-\nJan 2026",
                "Great Link Mai House",
                "Role: Main Full-Stack Developer / BA-facing Owner",
                "Tech: ASP.NET Core REST API, ReactJS, SQL Server, JWT/auth, MVC-style modules",
                [
                    "Converted WordPress workflows into web screens and ASP.NET Core API-backed business modules.",
                    "Implemented auth, media and integration flows; debugged API/UI issues and prepared release handoff.",
                ],
            ),
            (
                "Oct 2024\n-\nJan 2026",
                "VN Media Hub",
                "Role: Main Full-Stack Developer / BA-facing Owner",
                "Tech: ASP.NET Core Web API, SQL Server, JavaScript UI, caching, logging, reports",
                [
                    "Built CMS/admin modules for content, moderation, SEO, authentication and reporting workflows.",
                    "Applied API contracts, SQL-backed data flows, logging/caching and bug-fix discipline for production tasks.",
                ],
            ),
            (
                "Feb 2026\n-\nPresent",
                "Betodemy - Product Platform",
                "Role: Core Full-Stack Developer in 5-person team",
                "Tech: ReactJS, NestJS, PostgreSQL, Redis, issue tracking, GitLab CI",
                [
                    "Built and fixed product features in weekly issue/release cycles with code review handoff.",
                    "Created bug issues after release and supported debugging across frontend/API tasks.",
                ],
            ),
            (
                "May 2026\n-\nJul 2026",
                "AI Power - Odoo ERP",
                "Role: ERP Support Developer Intern",
                "Tech: Python/Odoo, PostgreSQL, XML/QWeb reports, Docker, GitLab CI",
                [
                    "Supported fixes in an existing business system after BA/customer requirement updates.",
                    "Worked carefully with module logic, report output and i18n to keep changes stable.",
                ],
            ),
        ],
        "projects": [
            {
                "mark": "EC",
                "title": "ECH LMS",
                "tech": "ASP.NET Core MVC/API, SQL Server, Auth, Bootstrap UI, Reports",
                "body": "Built LMS workflows with API-backed course/content screens, login flow and PDF/Excel reports.",
                "period": "Oct 2024 - Jan 2026",
            },
            {
                "mark": "VM",
                "title": "VN Media Hub CMS",
                "tech": "ASP.NET Core API, SQL Server, JavaScript UI, Auth, Logging",
                "body": "Implemented CMS/admin workflows with API contracts, SQL-backed operations and production handoff.",
                "period": "Oct 2024 - Jan 2026",
            },
        ],
    },
    "dami-dotnet-vbnet-sql": {
        "output": ROOT / "cv" / "dami-dotnet-vbnet-sql" / "CV_NguyenXuanHai_DaMi_DotNet_VBNet_SQL_visual.pdf",
        "role": ".NET Developer",
        "stack_line": ".NET / .NET Core  |  MSSQL Server  |  OOP  |  Business Software  |  Code Convention",
        "headline": ".NET-oriented developer with business web/API experience, SQL-backed workflows, careful debugging and maintainable handoff.",
        "workflow": "I use AI agents to inspect existing modules, clarify requirements, prepare implementation notes, review bugs and document stable handoff.",
        "skills": [
            (".NET / .NET Core", "BACKEND", "dotnet.png"),
            ("C# / OOP", "FOUNDATION", "dotnet.png"),
            ("MSSQL Server", "DATABASE", "postgresql.png"),
            ("REST API", "BACKEND", "nestjs.png"),
            ("Business Logic", "DOMAIN", "file-earmark-text.svg"),
            ("Code Convention", "QUALITY", "code-slash.svg"),
            ("Debugging", "QUALITY", "code-slash.svg"),
            ("Reporting", "BUSINESS", "file-earmark-text.svg"),
            ("Git Workflow", "TOOLS", "gitlab.png"),
            ("Fast Learning", "MINDSET", "robot.svg"),
        ],
        "experiences": [
            (
                "Jul 2025\n-\nJan 2026",
                "Great Link Mai House",
                "Role: Main Full-Stack Developer / BA-facing Owner",
                "Tech: ASP.NET Core REST API, SQL Server, OOP service layers, auth/media workflows",
                [
                    "Converted business workflows into ASP.NET Core API-backed modules with SQL Server data flows.",
                    "Followed maintainable structure for auth, media and integration features; debugged UI/API issues before release.",
                ],
            ),
            (
                "Oct 2024\n-\nJan 2026",
                "VN Media Hub",
                "Role: Main Full-Stack Developer / BA-facing Owner",
                "Tech: ASP.NET Core Web API, SQL Server, CMS/admin business workflows, caching, logging, reports",
                [
                    "Built business/admin modules for content, moderation, authentication, reporting and operations.",
                    "Applied API contracts, SQL-backed logic, logging/caching and careful handoff for production maintenance.",
                ],
            ),
            (
                "May 2026\n-\nJul 2026",
                "AI Power - Odoo ERP",
                "Role: ERP Support Developer Intern",
                "Tech: Python/Odoo, PostgreSQL, XML/QWeb reports, business modules, GitLab CI",
                [
                    "Supported fixes in an ERP business system after BA/customer requirement updates.",
                    "Worked carefully with existing modules, report output and i18n to keep changes stable.",
                ],
            ),
            (
                "Feb 2026\n-\nPresent",
                "Betodemy - Product Platform",
                "Role: Core Full-Stack Developer in 5-person team",
                "Tech: ReactJS, NestJS, PostgreSQL, issue tracking, debugging, review handoff",
                [
                    "Built and fixed product features in weekly issue/release cycles with review notes.",
                    "Created bug issues after release and supported debugging across existing frontend/API modules.",
                ],
            ),
        ],
        "projects": [
            {
                "mark": "EC",
                "title": "ECH LMS",
                "tech": "ASP.NET Core MVC/API, SQL Server, Auth, Reports",
                "body": "Built LMS business workflows with course/content screens, login flow and PDF/Excel reports.",
                "period": "Oct 2024 - Jan 2026",
            },
            {
                "mark": "ERP",
                "title": "Odoo ERP Support",
                "tech": "Business Modules, PostgreSQL, XML/QWeb Reports, GitLab CI",
                "body": "Supported report/business-flow fixes in ERP modules after BA/customer feedback.",
                "period": "May 2026 - Jul 2026",
            },
        ],
    },
    "bravo-erp-sql": {
        "output": ROOT / "cv" / "bravo-erp-sql" / "CV_NguyenXuanHai_Bravo_ERP_SQL_visual.pdf",
        "role": "ERP / SQL Implementation Developer",
        "stack_line": "ERP  |  SQL Database  |  Business Workflow  |  Reporting  |  Customer Requirement Support",
        "headline": "ERP-oriented developer with hands-on business workflow fixes, SQL-backed systems, report customization and BA/customer requirement support.",
        "workflow": "I use AI agents to summarize requirements, inspect existing modules, prepare fix plans, review edge cases and document customer handoff.",
        "skills": [
            ("ERP Business Flow", "DOMAIN", "file-earmark-text.svg"),
            ("SQL Database", "DATABASE", "postgresql.png"),
            ("Odoo / Python", "ERP", "odoo.png"),
            ("QWeb / XML Reports", "REPORTING", "file-earmark-text.svg"),
            ("Requirement Analysis", "BA SUPPORT", "file-earmark-text.svg"),
            ("Customer Support", "IMPLEMENTATION", "robot.svg"),
            ("ASP.NET Core API", "BACKEND", "dotnet.png"),
            ("Data Import/Export", "OPERATIONS", "postgresql.png"),
            ("Debugging", "QUALITY", "code-slash.svg"),
            ("Git Workflow", "TOOLS", "gitlab.png"),
        ],
        "experiences": [
            (
                "May 2026\n-\nJul 2026",
                "AI Power - Automotive Dealership ERP",
                "Role: ERP Support Developer Intern",
                "Tech: Odoo 18, Python 3.12, PostgreSQL, XML/QWeb reports, i18n, Docker, GitLab CI",
                [
                    "Supported ERP fixes after BA/customer requirement updates across sales, service, parts and warranty workflows.",
                    "Adjusted business logic, QWeb/XML report output and translations across 18 modules and 99+ Python files.",
                ],
            ),
            (
                "Jul 2025\n-\nJan 2026",
                "Great Link Mai House",
                "Role: Main Full-Stack Developer / BA-facing Owner",
                "Tech: ASP.NET Core REST API, SQL-backed workflows, ReactJS, auth/media/integration flows",
                [
                    "Converted business requirements into API-connected web modules and operational screens.",
                    "Handled requirement clarification, debugging and release handoff for auth, media and integration workflows.",
                ],
            ),
            (
                "Oct 2024\n-\nJan 2026",
                "VN Media Hub",
                "Role: Main Full-Stack Developer / BA-facing Owner",
                "Tech: CMS/admin workflows, SQL-backed data flows, reports, logging, caching, API contracts",
                [
                    "Built admin workflows for content, moderation, reporting and day-to-day business operations.",
                    "Mapped BA requirements into frontend/API/database tasks and supported production bug fixes.",
                ],
            ),
            (
                "Feb 2026\n-\nPresent",
                "Betodemy - Product Platform",
                "Role: Core Full-Stack Developer in 5-person team",
                "Tech: Issue tracking, release workflow, PostgreSQL, API/UI debugging, GitLab CI",
                [
                    "Built and fixed product features in weekly issue/release cycles with review notes.",
                    "Created issues after release and supported operations through debugging and handoff documentation.",
                ],
            ),
        ],
        "projects": [
            {
                "mark": "ERP",
                "title": "Odoo ERP Support",
                "tech": "Odoo 18, Python ORM, PostgreSQL, XML/QWeb Reports, i18n",
                "body": "Supported business-flow and report fixes after customer/BA updates in an automotive dealership ERP.",
                "period": "May 2026 - Jul 2026",
            },
            {
                "mark": "CMS",
                "title": "VN Media Hub Admin",
                "tech": "SQL-backed workflows, API contracts, auth, logging, reports",
                "body": "Built admin workflows for content operations, moderation, reporting and production support.",
                "period": "Oct 2024 - Jan 2026",
            },
        ],
    },
    "hqsoft-ai-augmented-dotnet": {
        "output": ROOT / "cv" / "hqsoft-ai-augmented-dotnet" / "CV_NguyenXuanHai_HQSOFT_AI_Augmented_DotNet_visual.pdf",
        "role": "AI-Augmented Software Engineer",
        "stack_line": ".NET/C#  |  SQL  |  AI Agents  |  Prompt/Context Engineering  |  CI/CD",
        "headline": "Developer applying AI agents to speed up codebase understanding, bug review, implementation planning and release handoff for web/ERP systems.",
        "workflow": "I build project-aware AI workflows: context packs, task specs, review prompts, debug notes, CI handoff and guardrails before shipping code.",
        "skills": [
            ("AI Agent Workflow", "AI", "robot.svg"),
            ("Claude / Codex", "AI TOOLS", None),
            ("Prompt Engineering", "AI", "file-earmark-text.svg"),
            ("Context Engineering", "AI", "file-earmark-text.svg"),
            (".NET / C#", "BACKEND", "dotnet.png"),
            ("SQL / PostgreSQL", "DATABASE", "postgresql.png"),
            ("REST API", "BACKEND", "nestjs.png"),
            ("GitLab CI", "CI/CD", "gitlab.png"),
            ("Debugging / RCA", "QUALITY", "code-slash.svg"),
            ("Docker Basics", "INFRA", "docker.png"),
        ],
        "experiences": [
            (
                "Feb 2026\n-\nPresent",
                "Betodemy - Product Platform",
                "Role: Core Full-Stack Developer in 5-person team",
                "Tech: ReactJS, NestJS, PostgreSQL, Redis, GitLab CI, AI review/debug handoff",
                [
                    "Used AI-assisted review notes, issue context and CI checks to support weekly feature/bug delivery.",
                    "Created bug issues after release and prepared reproducible handoff notes for frontend/API fixes.",
                ],
            ),
            (
                "May 2026\n-\nJul 2026",
                "AI Power - Odoo ERP",
                "Role: ERP Support Developer Intern",
                "Tech: Python/Odoo ERP, PostgreSQL, XML/QWeb, Docker, GitLab CI, BA/customer changes",
                [
                    "Supported ERP bug fixes after BA/customer requirement updates in an automotive dealership system.",
                    "Read existing modules carefully, adjusted reports/business logic and documented stable handoff for review.",
                ],
            ),
            (
                "Jul 2025\n-\nJan 2026",
                "Great Link Mai House",
                "Role: Main Full-Stack Developer / BA-facing Owner",
                "Tech: ASP.NET Core REST API, ReactJS, SQL Server, JWT/auth, integration workflows",
                [
                    "Converted WordPress workflows into React screens and ASP.NET Core API-backed business modules.",
                    "Applied requirement-to-release ownership for auth, media and integration flows with debug notes.",
                ],
            ),
            (
                "Oct 2024\n-\nJan 2026",
                "VN Media Hub",
                "Role: Main Full-Stack Developer / BA-facing Owner",
                "Tech: ASP.NET Core Web API, SQL Server, CMS/admin workflows, caching, logging, reports",
                [
                    "Built CMS/admin workflows for content, moderation, auth, SEO, reporting and operational support.",
                    "Mapped BA requirements into API contracts, SQL-backed tasks, logging/caching and release handoff.",
                ],
            ),
        ],
        "projects": [
            {
                "mark": "AI",
                "title": "AI Agent Workflow",
                "tech": "Claude, Codex, Antigravity-style skills, review prompts, CI handoff",
                "body": "Built project context/skill workflows to turn requirements, codebase notes and bugs into actionable plans.",
                "period": "Mar 2025 - May 2026",
            },
            {
                "mark": "ERP",
                "title": "Odoo ERP Support",
                "tech": "Python/Odoo, PostgreSQL, XML/QWeb, Docker, GitLab CI",
                "body": "Supported bug fixes and report/business-flow updates across ERP modules after customer feedback.",
                "period": "May 2026 - Jul 2026",
            },
        ],
    },
    "allexceed-software-engineer": {
        "output": ROOT / "cv" / "allexceed-software-engineer" / "CV_NguyenXuanHai_Allexceed_Software_Engineer_visual.pdf",
        "role": "Software Engineer (Fresher/Junior)",
        "stack_line": "OOP  |  C#/.NET  |  Web Application  |  SQL  |  JavaScript",
        "headline": "Fresher/Junior software engineer with production web exposure, API/database workflows, debugging and release support.",
        "workflow": "I use AI agents to study existing codebases, summarize requirements, prepare implementation plans, review bugs and document handoff.",
        "skills": [
            ("OOP Fundamentals", "CORE", "code-slash.svg"),
            ("C# / .NET", "BACKEND", "dotnet.png"),
            ("Web Application", "WEB", "react.png"),
            ("REST API", "API", "nestjs.png"),
            ("SQL / Database", "DATABASE", "postgresql.png"),
            ("HTML/CSS/JS", "FRONTEND", "react.png"),
            ("Git Workflow", "TOOLS", "gitlab.png"),
            ("Debugging", "QUALITY", "code-slash.svg"),
            ("Documentation", "PROCESS", "file-earmark-text.svg"),
            ("Fast Learning", "MINDSET", "robot.svg"),
        ],
        "experiences": [
            (
                "Jul 2025\n-\nJan 2026",
                "Great Link Mai House",
                "Role: Main Full-Stack Developer / BA-facing Owner",
                "Tech: ReactJS, ASP.NET Core REST API, SQL Server, JWT, OOP service layers",
                [
                    "Converted WordPress workflows into maintainable React + ASP.NET Core web application modules.",
                    "Clarified requirements, debugged API/UI issues and prepared handoff notes for release.",
                ],
            ),
            (
                "Oct 2024\n-\nJan 2026",
                "VN Media Hub",
                "Role: Main Full-Stack Developer / BA-facing Owner",
                "Tech: ASP.NET Core Web API, SQL Server, auth, caching, logging, reports",
                [
                    "Built CMS/admin web workflows for content, authentication, moderation, SEO and reporting.",
                    "Applied API contracts, database-backed flows and careful bug fixing for production tasks.",
                ],
            ),
            (
                "Feb 2026\n-\nPresent",
                "Betodemy - Product Platform",
                "Role: Core Full-Stack Developer in 5-person team",
                "Tech: ReactJS, NestJS, PostgreSQL, Redis, BullMQ, GitLab CI, issue tracking",
                [
                    "Worked in a 5-person team to build features, fix bugs and follow weekly release workflow.",
                    "Created issues after release and supported operations with review/debug handoff.",
                ],
            ),
            (
                "May 2026\n-\nJul 2026",
                "AI Power - Odoo ERP",
                "Role: Odoo ERP Support Developer Intern",
                "Tech: Python/Odoo, PostgreSQL, XML/QWeb reports, Docker, GitLab CI",
                [
                    "Supported ERP module fixes after BA/customer requirement updates.",
                    "Practiced reading existing code, reports and workflows before making stable changes.",
                ],
            ),
        ],
        "projects": [
            {
                "mark": "EC",
                "title": "ECH LMS",
                "tech": "ASP.NET Core API, SQL Server, Auth, Reports",
                "body": "Built LMS workflows with API-backed course/content screens, login flow and PDF/Excel reports.",
                "period": "Oct 2024 - Jan 2026",
            },
            {
                "mark": "PF",
                "title": "React Portfolio UI",
                "tech": "React, Vite, JavaScript, SlateJS, responsive UI",
                "body": "Built portfolio/contact workflow with component UI, form states and deployment-ready frontend.",
                "period": "Mar 2025 - May 2026",
            },
        ],
    },
    "ila-odoo-developer": {
        "output": ROOT / "cv" / "ila-odoo-developer" / "CV_NguyenXuanHai_ILA_Odoo_Developer_visual.pdf",
        "role": "Odoo Developer",
        "stack_line": "Python 3.12  |  Odoo 18  |  PostgreSQL  |  QWeb/XML  |  ERP",
        "headline": "Odoo/Python developer with hands-on automotive ERP support, business-workflow debugging, reports and BA-driven production changes.",
        "workflow": "",
        "ai_mode": "off",
        "skills": [
            ("Python 3.12", "BACKEND", "python.png"),
            ("Odoo 18 / ORM", "ERP", "odoo.png"),
            ("QWeb / XML", "ERP", "odoo.png"),
            ("PostgreSQL / SQL", "DATABASE", "postgresql.png"),
            ("HTML / CSS / JavaScript", "FRONTEND", "react.png"),
            ("ERP Business Workflows", "BUSINESS", "odoo.png"),
            ("Requirement Clarification", "DELIVERY", "file-earmark-text.svg"),
            ("Debugging / Release Support", "QUALITY", "code-slash.svg"),
            ("Docker", "INFRA", "docker.png"),
            ("GitLab CI/CD", "CI/CD", "gitlab.png"),
        ],
        "experiences": [
            (
                "May 2026\n-\nJul 2026",
                "AI Power",
                "Odoo ERP Support Developer Intern",
                "Python 3.12, Odoo 18 ORM, PostgreSQL, QWeb/XML, i18n, Docker, GitLab CI",
                [
                    "Debugged BA/customer defects across models, business logic, QWeb/XML views and localized reports.",
                    "Supported sales, service, parts, warranty and TT200 accounting changes after requirement updates.",
                ],
                "Delivered stable fixes across 18 custom modules and 99+ Python files while preserving an 18-state service workflow.",
            ),
            (
                "Feb 2026\n-\nPresent",
                "Betodemy",
                "Full-Stack Developer | Part-time | 5-person team",
                "React 19, NestJS, PostgreSQL, Redis, BullMQ, GitLab CI/CD",
                [
                    "Built and debugged production features through weekly issue, review, test and release cycles.",
                    "Created traceable issues after release and supported operational handoff with the product team.",
                ],
                "Delivered 70+ merged MRs and closed 70+ authored issues across production workflows.",
            ),
            (
                "Oct 2024\n-\nJan 2026",
                "OakMind Group",
                "Part-time Full-Stack Developer | BA-facing delivery",
                "React 18/19, ASP.NET Core 8, EF Core, SQL Server, JWT, Redis",
                [
                    "VN Media Hub: built CMS workflows for authentication, content, moderation, reports and operations.",
                    "Great Link Mai House: converted legacy workflows into React screens and maintainable REST APIs.",
                    "OakMind Group Website: shipped bilingual CMS, media, SEO/analytics and lead workflows.",
                ],
                "Owned requirement clarification through production release across three company products.",
            ),
        ],
        "projects": [
            {
                "title": "ECH LMS",
                "role": "Full-Stack Developer / Volunteer",
                "tech": "ASP.NET Core | SQL Server | Auth | PDF/Excel Reports",
                "body": "Digitized education operations with role-based workflows, data-backed screens and automated reports.",
                "period": "Oct 2024 - Jan 2026",
            },
            {
                "title": "ChongScam",
                "role": "Full-Stack Developer",
                "url": "https://chongscam.vn/",
                "tech": "NestJS | PostgreSQL | RBAC | Moderation | Jest",
                "body": "Shipped a production workflow system with role controls, audit operations and tested backend modules.",
                "period": "Apr 2026 - Jul 2026",
            },
        ],
    },
    "endava-junior-web-developer": {
        "output": ROOT / "cv" / "endava-junior-web-developer" / "CV_NguyenXuanHai_Endava_Junior_Web_Developer_visual.pdf",
        "role": "Junior Web Developer",
        "stack_line": "ReactJS  |  Python  |  RESTful API  |  PostgreSQL  |  Docker",
        "headline": "Junior web developer with production ReactJS, REST API, Python, SQL and Docker experience, ready to apply this foundation to FastAPI-based services.",
        "workflow": "",
        "ai_mode": "off",
        "skills": [
            ("ReactJS", "FRONTEND", "react.png"),
            ("JavaScript / TypeScript", "FRONTEND", "react.png"),
            ("RESTful API", "BACKEND", "nestjs.png"),
            ("Python 3.12", "BACKEND", "python.png"),
            ("PostgreSQL / SQL", "DATABASE", "postgresql.png"),
            ("JWT / RBAC / Auth", "SECURITY", "code-slash.svg"),
            ("Docker", "INFRA", "docker.png"),
            ("GitLab CI", "CI/CD", "gitlab.png"),
            ("Jest / E2E Testing", "QUALITY", "code-slash.svg"),
            ("Issue / Release Workflow", "DELIVERY", "gitlab.png"),
        ],
        "experiences": [
            (
                "Feb 2026\n-\nPresent",
                "Betodemy",
                "Full-Stack Developer | Part-time | 5-person team",
                "React 19, NestJS REST APIs, PostgreSQL, Redis, BullMQ, GitLab CI",
                [
                    "Built and debugged student/admin features across document, challenge and online-class workflows.",
                    "Worked with Japan-side leadership in weekly issue, review, test and production release cycles.",
                ],
                "Delivered 70+ merged MRs and closed 70+ authored issues across production workflows.",
            ),
            (
                "May 2026\n-\nJul 2026",
                "AI Power",
                "Odoo ERP Support Developer Intern",
                "Python 3.12, Odoo 18, PostgreSQL, QWeb/XML, Docker, GitLab CI",
                [
                    "Debugged Python business logic and BA/customer defects across sales, service, parts and warranty modules.",
                    "Updated QWeb/XML reports, localized content and PostgreSQL-backed ERP workflows.",
                ],
                "Supported stable fixes across 18 custom modules and 99+ Python files.",
            ),
            (
                "Oct 2024\n-\nJan 2026",
                "OakMind Group",
                "Part-time Full-Stack Developer | BA-facing delivery",
                "React 18/19, ASP.NET Core REST APIs, SQL Server, JWT, Redis, Cloudflare R2",
                [
                    "VN Media Hub: built React CMS/admin screens and authenticated APIs for content, moderation and reports.",
                    "Great Link Mai House: converted WordPress/MVC flows into reusable React components and REST APIs.",
                    "OakMind Group Website: shipped a bilingual React 19 CMS with media, SEO and lead workflows.",
                ],
                "Owned requirement clarification through production release across three company products.",
            ),
        ],
        "projects": [
            {
                "title": "ChongScam",
                "role": "Full-Stack Developer",
                "url": "https://chongscam.vn/",
                "tech": "React 19 | NestJS 11 | PostgreSQL | Redis | Jest",
                "body": "Shipped a production trust platform with session auth, RBAC, moderation, audit and rate-limited APIs.",
                "period": "Apr 2026 - Jul 2026",
            },
            {
                "title": "RouteLab",
                "role": "Full-Stack Developer",
                "url": "https://tsp-delivery-route-optimizer.vercel.app/",
                "tech": "React | TypeScript | Express | PostgreSQL | Vitest | CI",
                "body": "Built and tested route algorithms with an interactive UI, REST API and GitHub Actions pipeline.",
                "period": "2025 - 2026",
            },
        ],
    },
}


def build_variant(name: str, ai_mode: str | None = None) -> Path:
    if name not in VARIANTS:
        raise SystemExit(f"Unknown variant: {name}. Available: {', '.join(VARIANTS)}")
    base = load_base()
    config = VARIANTS[name]
    default_ai_mode = "featured" if name == "hqsoft-ai-augmented-dotnet" else "off"
    selected_ai_mode = ai_mode or config.get("ai_mode", default_ai_mode)
    output = config["output"]
    output.parent.mkdir(parents=True, exist_ok=True)

    pdf = base.VisualCv(output, ai_mode=selected_ai_mode)
    pdf.c.setTitle(f"Nguyen Xuan Hai - {config['role']} Visual CV")

    default_company_tech = {
        "betodemy": "React 19 | NestJS | PostgreSQL | Redis | Nx",
        "ai power": "Python 3.12 | Odoo 18 | PostgreSQL | QWeb/XML | GitLab CI",
        "odoo": "Python 3.12 | Odoo 18 | PostgreSQL | QWeb/XML | GitLab CI",
        "great link": "React 18 | ASP.NET Core 8 | SQL Server | SignalR | JWT",
        "vn media": "React 18 | ASP.NET Core 8 | SQL Server | Redis | Serilog",
    }

    def company_tech(title: str, explicit: str) -> str:
        if explicit:
            return explicit
        lowered = title.lower()
        for company, tech in default_company_tech.items():
            if company in lowered:
                return tech
        return config["stack_line"].replace("  |  ", " | ")

    def clean_role(role: str) -> str:
        value = role.removeprefix("Role:").strip()
        replacements = {
            "Main Full-Stack Developer / BA-facing Owner": "Full-Stack Developer | BA-facing delivery",
            "Main Frontend/Full-Stack Developer / BA-facing Owner": "Full-Stack Developer | BA-facing delivery",
            "Core Full-Stack Developer in 5-person team": "Full-Stack Developer | 5-person product team",
        }
        return replacements.get(value, value)

    def parse_experience(entry) -> dict[str, object]:
        achievement = ""
        if len(entry) == 6:
            dates, title, role, tech, bullets, achievement = entry
        elif len(entry) == 5:
            dates, title, role, tech, bullets = entry
        else:
            dates, title, role, bullets = entry
            tech = ""
        return {
            "dates": dates,
            "title": title,
            "role": role,
            "tech": tech,
            "bullets": list(bullets),
            "achievement": achievement,
        }

    def product_bullet(product: str, bullets: list[str], fallback: str) -> str:
        detail = bullets[0].strip() if bullets else fallback
        lowered = detail.lower()
        if lowered.startswith(product.lower()):
            return detail
        return f"{product}: {detail[0].lower() + detail[1:] if detail else fallback}"

    def normalized_experiences() -> list[dict[str, object]]:
        parsed = [parse_experience(entry) for entry in config["experiences"]]
        great_link = next(
            (entry for entry in parsed if "great link" in str(entry["title"]).lower()),
            None,
        )
        vn_media = next(
            (entry for entry in parsed if "vn media" in str(entry["title"]).lower()),
            None,
        )
        oakmind = next(
            (entry for entry in parsed if "oakmind" in str(entry["title"]).lower()),
            None,
        )

        if oakmind is None and (great_link or vn_media):
            great_link_bullets = great_link["bullets"] if great_link else []
            vn_media_bullets = vn_media["bullets"] if vn_media else []
            oakmind = {
                "dates": "Oct 2024\n-\nJan 2026",
                "title": "OakMind Group",
                "role": "Part-time Full-Stack Developer | BA-facing owner",
                "tech": "React 18/19 | ASP.NET Core 8 | EF Core | SQL Server | Redis | R2",
                "bullets": [
                    product_bullet(
                        "VN Media Hub",
                        vn_media_bullets,
                        "built CMS authentication, moderation, SEO, caching, logging and reporting workflows.",
                    ),
                    product_bullet(
                        "Great Link Mai House",
                        great_link_bullets,
                        "converted WordPress/MVC workflows into React screens and ASP.NET Core APIs.",
                    ),
                    "OakMind Group Website: shipped a live bilingual CMS with admin/editor, SEO/analytics and Cloudflare R2 media.",
                ],
                "achievement": "Owned BA clarification through production release across three company products.",
            }

        remaining = [
            entry
            for entry in parsed
            if not any(
                name in str(entry["title"]).lower()
                for name in ("great link", "vn media", "oakmind")
            )
        ]
        order = {"betodemy": 0, "ai power": 1, "odoo": 1}
        remaining.sort(
            key=lambda entry: next(
                (priority for name, priority in order.items() if name in str(entry["title"]).lower()),
                2,
            )
        )
        if oakmind:
            remaining.append(oakmind)
        return remaining

    def project_defaults(title: str) -> tuple[str, str]:
        lowered = title.lower()
        if "ech" in lowered:
            return "Full-Stack Developer / Volunteer", "ASP.NET Core | EF Core | SQL Server | QuestPDF"
        if "portfolio" in lowered:
            return "Frontend Developer", "React | Vite | SlateJS | GSAP | Vercel"
        if "vision" in lowered:
            return "macOS / AI Developer", "SwiftUI | AppKit | Gemini API"
        if "betodemy" in lowered:
            return "Full-Stack Developer", default_company_tech["betodemy"]
        if "odoo" in lowered or "erp" in lowered:
            return "ERP Support Developer", default_company_tech["ai power"]
        if "vn media" in lowered:
            return "Full-Stack Developer", default_company_tech["vn media"]
        if "ai" in lowered:
            return "Frontend / Python Developer", "React | LLM APIs | Python | pytest"
        return "Full-Stack Developer", config["stack_line"].replace("  |  ", " | ")

    def skill_bucket(label: str, category: str) -> str | None:
        lowered = f"{label} {category}".lower()
        if any(word in lowered for word in ("claude", "codex", "antigravity", "ai agent", "prompt", "context engineering")):
            return None
        frontend_terms = ("react", "angular", "vue", "javascript", "typescript", "html", "css", "frontend", "state", "tailwind", "bootstrap", "slate")
        if any(word in lowered for word in frontend_terms) or " ui " in f" {lowered} ":
            return "Frontend"
        if any(word in lowered for word in ("asp.net", ".net", "c#", "node", "nestjs", "backend", "rest", "api", "jwt", "auth", "orm")):
            return "Backend & API"
        if any(word in lowered for word in ("sql", "postgres", "database", "redis", "data")):
            return "Data"
        if any(word in lowered for word in ("odoo", "erp", "qweb", "business", "report", "requirement", "customer", "domain")):
            return "ERP / Business"
        if any(word in lowered for word in ("oop", "mvc", "solid", "architecture", "foundation", "core")):
            return "Architecture"
        return "Delivery"

    def normalized_projects() -> list[dict[str, str]]:
        projects: list[dict[str, str]] = []
        excluded_ai_titles = {"ai workflow", "ai review workflow", "ai agent workflow"}
        for raw in config["projects"]:
            if isinstance(raw, dict):
                title = raw["title"]
                tech = raw.get("tech", "")
                impact = raw["body"]
                period = raw["period"]
                explicit_role = raw.get("role", "")
                url = raw.get("url", "")
            else:
                _, title, body, period = raw
                tech = body
                impact = ""
                explicit_role = ""
                url = ""
            lowered = title.lower()
            if selected_ai_mode != "featured" and lowered in excluded_ai_titles:
                continue
            if selected_ai_mode != "featured" and title == "Portfolio AI Assistant":
                title = "Portfolio Website"
                tech = "React | Vite | SlateJS | GSAP | Vercel"
                impact = "Built recruiter-facing project discovery, a rich-text contact flow and analytics tracking."
            default_role, default_tech = project_defaults(title)
            role = explicit_role or default_role
            if not impact:
                impact = (
                    "Digitized volunteer teaching operations with automated certificates and Excel/PDF reports."
                    if "ech" in lowered
                    else "Built project-aware implementation, review and release-support workflows."
                )
            projects.append(
                {
                    "title": title,
                    "role": role,
                    "period": period,
                    "tech": tech or default_tech,
                    "impact": impact,
                    "url": url,
                }
            )

        fallback = [
            {
                "title": "ECH LMS",
                "role": "Full-Stack Developer / Volunteer",
                "period": "Oct 2024 - Jan 2026",
                "tech": "ASP.NET Core | EF Core | SQL Server | QuestPDF",
                "impact": "Digitized volunteer teaching operations with automated certificates and Excel/PDF reports.",
            },
            {
                "title": "Portfolio Website",
                "role": "Frontend Developer",
                "period": "Mar 2025 - May 2026",
                "tech": "React | Vite | SlateJS | GSAP | Vercel",
                "impact": "Built recruiter-facing project discovery, a rich-text contact flow and analytics tracking.",
            },
        ]
        existing = {project["title"] for project in projects}
        for project in fallback:
            if len(projects) >= 2:
                break
            if project["title"] not in existing:
                projects.append(project)
        if selected_ai_mode == "featured" and not any("ai" in project["title"].lower() for project in projects):
            projects[-1] = {
                "title": "AI Development Tools",
                "role": "Frontend / Python Developer",
                "period": "Mar 2025 - May 2026",
                "tech": "React | Gemini/DeepSeek APIs | Python | pytest",
                "impact": "Built a portfolio assistant and reusable LLM-assisted unit-test drafting workflow.",
            }
        return projects[:2]

    def header(self):
        x = base.LEFT_X + 14
        y = base.PAGE_H - 72
        self.c.setFillColor(base.INK)
        self.c.setFont("Arial-Bold", 28)
        self.c.drawString(x, y, "Nguyen Xuan Hai")
        y -= 23
        self.c.setFillColor(base.AMBER)
        self.c.setFont("Arial-Bold", 14.2)
        self.c.drawString(x, y, config["role"])
        y -= 17
        self.c.setFillColor(base.INK)
        self.c.setFont("Arial", 9.2)
        self.c.drawString(x, y, config["stack_line"])
        y -= 14
        self.c.setFillColor(base.TEAL)
        self.c.rect(x, y + 6, 34, 2, fill=1, stroke=0)
        y -= 10
        headline = config["headline"]
        ai_terms = ("ai-", "ai ", "agent", "claude", "codex", "prompt engineering")
        if selected_ai_mode == "off" and any(term in headline.lower() for term in ai_terms):
            headline = (
                f"{config['role']} with hands-on production delivery, "
                "debugging, release and support experience."
            )
        y = self.text(headline, x, y, 360, "Arial", 8.25, base.MUTED, 9.8)
        y -= 2
        self.c.setFillColor(base.TEAL_DARK)
        self.c.setFont("Arial-Bold", 7.4)
        self.c.drawString(x, y, "EDUCATION")
        self.c.setFillColor(base.INK)
        self.c.setFont("Arial", 7.4)
        self.c.drawString(
            x + 49,
            y,
            "UTH - Information Technology | GPA 3.24/4.00 | Expected 2026",
        )

        image_size = 76
        image_x = base.PAGE_W - base.MARGIN - image_size - 20
        image_y = base.PAGE_H - 136
        self.c.setFillColor(base.PALE)
        self.c.circle(image_x + image_size / 2, image_y + image_size / 2, image_size / 2 + 9, fill=1, stroke=0)
        self.c.drawImage(base.ImageReader(str(base.PROFILE_IMAGE_CIRCLE)), image_x, image_y, image_size, image_size, mask="auto")
        self.c.setStrokeColor(base.AMBER)
        self.c.setLineWidth(1.2)
        self.c.circle(image_x + image_size / 2, image_y + image_size / 2, image_size / 2 + 9, fill=0, stroke=1)

    def company_experience(self):
        y = base.PAGE_H - 252
        y = self.section_title(base.LEFT_X, y, "Work Experience", "briefcase.svg")
        axis_x = base.LEFT_X + 70
        content_x = base.LEFT_X + 94
        self.c.setStrokeColor(base.HexColor("#8BA3AE"))
        self.c.setLineWidth(0.8)
        self.c.line(axis_x, y + 7, axis_x, base.BOTTOM + 100)
        for entry in normalized_experiences():
            dates = str(entry["dates"])
            title = str(entry["title"])
            role = str(entry["role"])
            tech = str(entry["tech"])
            bullets = entry["bullets"]
            achievement = str(entry["achievement"])
            tech = company_tech(title, tech)
            role = clean_role(role)
            self.c.setFillColor(base.TEAL)
            self.c.setFont("Arial-Bold", 7.8)
            dy = y - 2
            for line in dates.splitlines():
                self.c.drawRightString(axis_x - 18, dy, line)
                dy -= 8.5
            self.c.setFillColor(base.PAPER)
            self.c.setStrokeColor(base.TEAL)
            self.c.setLineWidth(1.35)
            self.c.circle(axis_x, y - 3, 5.3, fill=1, stroke=1)
            self.c.setFillColor(base.INK)
            self.c.setFont("Arial-Bold", 9.8)
            self.c.drawString(content_x, y, title)
            self.c.setStrokeColor(base.LINE)
            self.c.line(content_x, y - 8, base.LEFT_X + base.LEFT_W, y - 8)
            y -= 18
            self.c.setFillColor(base.TEAL_DARK)
            self.c.setFont("Arial-Bold", 7.75)
            self.c.drawString(content_x, y, role)
            y -= 11.5
            y = self.text(
                tech,
                content_x,
                y,
                base.LEFT_X + base.LEFT_W - content_x,
                "Arial-Italic",
                6.85,
                base.MUTED,
                8.2,
            )
            y -= 2
            for item in bullets:
                y = self.bullet(item, content_x, y, base.LEFT_X + base.LEFT_W - content_x, 7.85)
            if achievement:
                y -= 1
                y = self.achievement(achievement, content_x, y, base.LEFT_X + base.LEFT_W - content_x)
            y -= 20

    def skills_and_projects(self):
        x = base.RIGHT_X
        y = base.PAGE_H - 252
        y = self.section_title(x, y, "Core Skills", "code-slash.svg")
        groups: dict[str, list[str]] = {}
        for label, category, _ in config["skills"]:
            bucket = skill_bucket(label, category)
            if bucket is None:
                continue
            values = groups.setdefault(bucket, [])
            if label not in values and len(values) < 4:
                values.append(label)
        preferred_order = ["Frontend", "Backend & API", "Data", "ERP / Business", "Architecture", "Delivery"]
        for label in preferred_order:
            values = groups.get(label)
            if values:
                y = self.skill_group(x, y, label, ", ".join(values))
        y = self.developer_tools(x, y)

        y -= 10
        y = self.section_title(x, y, "Independent Projects", "folder2-open.svg")
        for project in normalized_projects():
            y = self.project_entry(x, y, project)

    def skill_group(self, x: float, y: float, label: str, value: str) -> float:
        label_text = label.upper()
        label_width = self.width(label_text, "Arial-Bold", 6.5)
        value_x = x + max(65, label_width + 12)
        self.c.setFillColor(base.TEAL_DARK)
        self.c.setFont("Arial-Bold", 6.5)
        self.c.drawString(x + 2, y, label_text)
        next_y = self.text(value, value_x, y, base.RIGHT_W - (value_x - x) - 2, "Arial", 7.65, base.INK, 9.1)
        self.c.setStrokeColor(base.LINE)
        self.c.setLineWidth(0.45)
        self.c.line(x + 2, next_y + 2.7, x + base.RIGHT_W - 2, next_y + 2.7)
        return next_y - 7

    pdf.header = MethodType(header, pdf)
    pdf.company_experience = MethodType(company_experience, pdf)
    pdf.skill_group = MethodType(skill_group, pdf)
    pdf.skills_and_projects = MethodType(skills_and_projects, pdf)

    pdf.background()
    pdf.header()
    pdf.contact_row()
    pdf.company_experience()
    pdf.skills_and_projects()
    pdf.footer()
    pdf.save()
    return output


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate a role-specific one-page visual CV.")
    parser.add_argument("variant", choices=sorted(VARIANTS))
    parser.add_argument("--ai-mode", choices=["off", "tools", "featured"])
    args = parser.parse_args()
    print(build_variant(args.variant, args.ai_mode))


if __name__ == "__main__":
    main()

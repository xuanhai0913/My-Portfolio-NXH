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
    "rma-dotnet-core-backend-junior": {
        "output": ROOT / "cv" / "rma-dotnet-core-backend-junior" / "CV_NguyenXuanHai_RMA_DotNet_Core_Backend_Junior_ATS.pdf",
        "title": "Nguyen Xuan Hai - .NET Core Backend Developer CV",
        "subtitle": ".NET Core Backend Developer | C# | ASP.NET Core | RESTful API | SQL",
        "summary": (
            "Junior backend-oriented developer with commercial delivery experience since October 2024 through commercial product work and an ERP internship. "
            "Built and supported production web systems using C#, ASP.NET Core, RESTful APIs, SQL Server and PostgreSQL. "
            "Experienced with Object-Oriented Programming, Entity Framework Core, relational data workflows, debugging, "
            "automated testing, Docker, Git and CI/CD; available to start immediately."
        ),
        "skills": [
            (".NET Backend:", "C#, .NET Core, ASP.NET Core Web API/MVC, Object-Oriented Programming (OOP), modular service and business layers."),
            ("API & Integration:", "RESTful API development/integration, DTO validation, authentication, authorization and asynchronous workflows."),
            ("Database:", "SQL Server, PostgreSQL, Entity Framework Core, relational modelling, migrations, SQL queries and data debugging."),
            ("Quality & Support:", "Unit/integration/e2e testing, validation, logging, code review, root-cause analysis and production troubleshooting."),
            ("Delivery:", "Git, GitLab CI/CD, GitHub Actions, Docker, issue tracking, release handoff and Agile team collaboration."),
        ],
        "work_entries": ["Betodemy", "AI Power", "OakMind"],
        "project_entries": ["ChongScam"],
        "certification_rows": [
            ("AWS Training Badge:", "AWS Educate Getting Started with Databases (Jul 2026)."),
            ("English:", "B1.4 - Intermediate; technical reading and written communication."),
        ],
        "overrides": {
            "Betodemy": [
                "Build and troubleshoot production REST API and PostgreSQL workflows in a modular product within a 5-person engineering team.",
                "Trace defects across service, data and UI layers through weekly issue, review, test, CI and release cycles.",
                "Achievement: delivered 70+ merged MRs and closed 70+ authored issues with traceable post-release support.",
            ],
            "AI Power": [
                "Converted BA/customer change lists into business-logic, relational-data and reporting fixes in a modular ERP codebase.",
                "Investigated cross-module defects with Python/PostgreSQL and verified release changes through Docker and GitLab CI.",
                "Achievement: supported fixes across 18 custom modules and 99+ Python files while preserving an 18-state service workflow.",
            ],
            "OakMind": [
                "VN Media Hub: built ASP.NET Core CMS/API workflows with authentication, caching, logging and SQL Server-backed reporting.",
                "Great Link Mai House: converted legacy MVC/WordPress flows into React screens, C# services, Entity Framework data paths and integrations.",
                "OakMind Group Website: shipped React 19/.NET 8 APIs for bilingual content, roles, contact leads, analytics and media.",
                "Achievement: owned BA requirement clarification through production release across all three OakMind Group products.",
            ],
            "ChongScam": [
                "Built production REST API workflows for authentication, RBAC, moderation, audit controls and secure admin operations.",
                "Achievement: shipped the client-operated platform with 22 controllers, 20 SQL migrations and 12 Jest/e2e test suites.",
            ],
        },
    },
    "motorist-junior-web-developer": {
        "output": ROOT / "cv" / "motorist-junior-web-developer" / "CV_NguyenXuanHai_Motorist_Junior_Web_Developer_ATS.pdf",
        "title": "Nguyen Xuan Hai - Junior Web Developer CV",
        "subtitle": "Junior Web Developer | React | JavaScript/TypeScript | RESTful API | SQL",
        "summary": (
            "Production-oriented junior web developer with commercial delivery experience since October 2024 across React, "
            "modular backend services, RESTful APIs and relational databases. Built and supported web features using React, "
            "JavaScript/TypeScript, NestJS, ASP.NET Core MVC/Web API, PostgreSQL and SQL Server. "
            "Experienced with responsive UI, MVC-style separation, Git, testing, Docker, CI/CD and production debugging; "
            "ready to transfer this foundation to Ruby on Rails."
        ),
        "skills": [
            ("Frontend Web:", "React 18/19, JavaScript ES6+, TypeScript, responsive UI, component-based architecture and Bootstrap."),
            ("Backend Foundation:", "NestJS/Node.js, ASP.NET Core MVC/Web API, RESTful API/JSON integration, MVC-style separation, OOP, authentication and validation."),
            ("Data & Background Workflows:", "PostgreSQL, SQL Server, relational modelling, migrations, SQL debugging, Redis and BullMQ background-job exposure."),
            ("Quality:", "Jest/Vitest/e2e testing, code review, refactoring, debugging, security-aware validation and production support."),
            ("Delivery:", "Git, GitLab CI/CD, GitHub Actions, Docker, issue tracking, release handoff and Agile-style team collaboration."),
            ("Rails Transition:", "Transferable MVC, SQL, REST API and Redis foundations; ready to ramp on Ruby on Rails conventions, RSpec and Sidekiq."),
        ],
        "work_entries": ["Betodemy", "OakMind", "AI Power"],
        "project_entries": ["ChongScam", "RouteLab"],
        "certification_rows": [
            ("English:", "B1.4 - Intermediate; technical reading and written communication, actively improving spoken collaboration."),
        ],
        "overrides": {
            "Betodemy": [
                "Build React user/admin features and modular NestJS REST API workflows in a production monorepo within a 5-person team.",
                "Trace defects across UI, API, PostgreSQL and Redis/BullMQ paths through weekly review, tests, CI and release cycles.",
                "Achievement: delivered 70+ merged MRs and closed 70+ authored issues across production workflows.",
            ],
            "OakMind": [
                "VN Media Hub: built CMS/admin UI and API workflows for authentication, content, moderation and SQL-backed reporting.",
                "Great Link Mai House: converted legacy WordPress/MVC processes into React components, ASP.NET Core APIs and media/realtime integrations.",
                "OakMind Group Website: shipped a bilingual React/.NET content platform with media, SEO/analytics and lead workflows.",
                "Achievement: owned requirement clarification through production release across all three OakMind Group products.",
            ],
            "AI Power": [
                "Debugged Python business logic, PostgreSQL-backed workflows and QWeb/XML reports after BA/customer requirement updates.",
                "Worked in an existing modular MVC-style ERP framework and CI flow to prepare release-safe fixes.",
                "Achievement: supported fixes across 18 custom modules and 99+ Python files.",
            ],
            "ChongScam": [
                "Built production responsive client flows and REST APIs for session authentication, RBAC, validation, moderation and audited administration.",
                "Achievement: shipped the client-operated platform with 22 controllers, 20 SQL migrations and 12 Jest/e2e test suites.",
            ],
            "RouteLab": [
                "Built an interactive React interface, REST API and PostgreSQL data paths for four route-planning algorithms.",
                "Achievement: published a working demo with automated tests and a GitHub Actions CI pipeline.",
            ],
        },
    },
    "amaris-junior-fullstack-dotnet": {
        "output": ROOT / "cv" / "amaris-junior-fullstack-dotnet" / "CV_NguyenXuanHai_Amaris_Junior_FullStack_DotNet_ATS.pdf",
        "title": "Nguyen Xuan Hai - Junior Full Stack Engineer (.NET) CV",
        "subtitle": "Junior Full Stack Engineer | C# / ASP.NET Core | React | SQL Server | MVC",
        "summary": (
            "Production-oriented junior full-stack engineer with commercial delivery experience since October 2024 across "
            "C#, ASP.NET Core MVC/Web API, React, RESTful APIs and relational data. Built and supported web features from "
            "requirements through implementation, testing, Git-based delivery and production debugging. "
            "Comfortable with OOP, MVC-style separation, SQL Server/PostgreSQL, authentication, responsive UI and Agile-style issue workflows."
        ),
        "skills": [
            ("Full-Stack Web:", "C#, ASP.NET Core 8 MVC/Web API, React 18/19, JavaScript ES6+, TypeScript, HTML5, CSS3 and responsive UI."),
            ("Architecture:", "Object-oriented programming, MVC-style separation, modular services, design-pattern awareness, RESTful API contracts and validation."),
            ("Data:", "SQL Server, PostgreSQL, Entity Framework Core, TypeORM, relational modelling, migrations, SQL debugging and query support."),
            ("Security & Integration:", "JWT/session authentication, role-based access control, authorization, API integration and production troubleshooting."),
            ("Quality:", "Test-case design, Jest/Vitest/e2e checks, integration validation, code review, debugging and release verification; ready to extend this foundation with xUnit/NUnit."),
            ("Delivery:", "Git, GitLab CI/CD, GitHub Actions, Docker, Agile-style issue tracking, release handoff and cross-functional BA collaboration."),
        ],
        "work_entries": ["Betodemy", "OakMind", "AI Power"],
        "project_entries": ["ChongScam", "RouteLab"],
        "certification_rows": [
            ("English:", "B1.4 - Intermediate; technical reading and written communication, actively improving spoken technical collaboration."),
        ],
        "overrides": {
            "Betodemy": [
                "Build and troubleshoot production React/NestJS features across UI, REST API, PostgreSQL and Redis/BullMQ workflows in a 5-person team.",
                "Handle weekly issues through implementation, review, test checks, CI, release handoff and post-release support.",
                "Achievement: delivered 70+ merged MRs and closed 70+ authored issues across production workflows.",
            ],
            "OakMind": [
                "VN Media Hub: built CMS/admin UI and ASP.NET Core API workflows for authentication, moderation, logging and SQL-backed reporting.",
                "Great Link Mai House: converted legacy WordPress/MVC processes into React components, C# services, Entity Framework data paths and integrations.",
                "OakMind Group Website: shipped a bilingual React 19/ASP.NET Core 8 platform with Identity/JWT, media, SEO/analytics and lead workflows.",
                "Achievement: owned requirement clarification through production release across all three OakMind Group products.",
            ],
            "AI Power": [
                "Debugged Python business logic, PostgreSQL-backed workflows and QWeb/XML reports after BA/customer requirement updates.",
                "Worked in an existing modular MVC-style ERP framework and CI flow to prepare release-safe fixes.",
                "Achievement: supported fixes across 18 custom modules and 99+ Python files.",
            ],
            "ChongScam": [
                "Built production responsive client flows and REST APIs for session authentication, RBAC, validation, moderation and audited administration.",
                "Achievement: shipped the client-operated platform with 22 controllers, 20 SQL migrations and 12 Jest/e2e test suites.",
            ],
            "RouteLab": [
                "Built an interactive React interface, REST API and PostgreSQL data paths for four route-planning algorithms.",
                "Achievement: published a working demo with automated tests and a GitHub Actions CI pipeline.",
            ],
        },
    },
    "nanoco-it-tester": {
        "output": ROOT / "cv" / "nanoco-it-tester" / "CV_NguyenXuanHai_NANOCO_IT_Tester_ATS.pdf",
        "title": "Nguyen Xuan Hai - IT Tester CV",
        "subtitle": "IT Tester | Manual Testing | API & SQL Validation | Bug Tracking | Test Automation",
        "summary": (
            "Junior technical tester candidate with commercial software delivery experience since October 2024. "
            "Hands-on in reproducing production defects, validating web and ERP business workflows, documenting issues, "
            "checking REST APIs and relational data, and supporting regression and release quality. "
            "Developer background in JavaScript/TypeScript, Python, SQL and automated tests enables efficient root-cause investigation."
        ),
        "skills": [
            ("Software Testing:", "Functional, system and regression testing; test scenarios, acceptance checks and release validation."),
            ("Defect Management:", "Defect reproduction, expected-vs-actual analysis, traceable issue reporting and post-release verification."),
            ("API & Data:", "RESTful API validation, PostgreSQL, SQL Server, relational-data checks and debugging tools."),
            ("Test Automation:", "Jest, Vitest and end-to-end test suites; JavaScript/TypeScript and Python foundations for automation."),
            ("Tools & Delivery:", "Git, GitLab CI/CD, GitHub Actions, Docker, Agile issue workflows and cross-functional BA/Developer collaboration."),
        ],
        "work_entries": ["Betodemy", "AI Power", "OakMind"],
        "project_entries": ["RouteLab"],
        "certification_rows": [
            ("Training:", "Software Development Lifecycle - AIAcademy by AIPOWER (Jul 2026)."),
            ("English:", "B1.4 - Intermediate; technical reading and written communication."),
        ],
        "overrides": {
            "Betodemy": [
                "Reproduce production defects, clarify expected behavior and track fixes through weekly issues, review and regression checks.",
                "Validate UI, REST API and PostgreSQL-backed learning workflows before release and support post-release verification.",
                "Achievement: delivered 70+ merged MRs and closed 70+ authored issues with traceable review and release handoff.",
            ],
            "AI Power": [
                "Reproduced BA/customer-reported defects and validated fixes across ERP business logic, reports, localization and linked modules.",
                "Checked sales, service, parts, warranty and accounting workflows against requirement updates and existing process states.",
                "Achievement: supported release-safe fixes across 18 modules and 99+ Python files while preserving an 18-state workflow.",
            ],
            "OakMind": [
                "VN Media Hub: validated CMS, authentication, moderation, reporting and production content workflows.",
                "Great Link Mai House: verified converted React/API flows against legacy behavior, including auth, media and integrations.",
                "OakMind Group Website: checked bilingual CMS, media, SEO/analytics and lead workflows before production handoff.",
                "Achievement: owned requirement clarification, acceptance checks and production handoff across all three OakMind Group products.",
            ],
            "ChongScam": [
                "Validated authentication, RBAC, moderation, audit and secure admin workflows across REST APIs and PostgreSQL data paths.",
                "Achievement: shipped the client-operated platform with 12 Jest/e2e test files covering critical trust and moderation flows.",
            ],
            "RouteLab": [
                "Designed automated checks for routing algorithms, API behavior and deterministic path outputs.",
                "Achievement: published a working demo backed by 95 automated tests and a dedicated GitHub Actions CI pipeline.",
            ],
        },
    },
    "phuc-sinh-developer": {
        "output": ROOT / "cv" / "phuc-sinh-developer" / "CV_NguyenXuanHai_PhucSinh_Developer_ATS.pdf",
        "title": "Nguyen Xuan Hai - Developer CV",
        "subtitle": "Developer | C# / ASP.NET Core | React | SQL | ERP",
        "summary": (
            "Full-stack developer with commercial delivery experience since October 2024 through commercial product work and an ERP internship. "
            "Built and supported production web products and internal business workflows using C#, ASP.NET Core, React, TypeScript, "
            "RESTful APIs, SQL Server and PostgreSQL. Experienced with ERP requirements, code review, debugging, testing and CI/CD; "
            "uses AI-assisted development tools while validating generated outputs through code, tests and manual verification."
        ),
        "skills": [
            ("Full-Stack Development:", "C#, ASP.NET Core Web API/MVC, React, TypeScript, RESTful API integration and modular service design."),
            ("ERP & Business Systems:", "Odoo 18 workflows, requirements clarification, business logic, internal CMS/admin systems and production support."),
            ("Data:", "SQL Server, PostgreSQL, Entity Framework Core, TypeORM, relational modelling and query/debug support."),
            ("Quality:", "Object-Oriented Programming, clean modular code, code review, Jest/Vitest, end-to-end testing, logging and systematic debugging."),
            ("Delivery:", "Git, GitLab CI/CD, GitHub Actions, Docker, Agile-style issue tracking, release handoff and cross-functional BA collaboration."),
            ("Developer Tools:", "Claude Code and Codex for codebase context, implementation planning and review notes; outputs verified through tests and CI."),
        ],
        "work_entries": ["Betodemy", "AI Power", "OakMind"],
        "project_entries": ["ChongScam"],
        "certification_rows": [
            ("English:", "B1.4 - Intermediate; technical reading and written communication."),
        ],
        "overrides": {
            "Betodemy": [
                "Build and troubleshoot production features in a modular React/NestJS product within a 5-person engineering team.",
                "Work through weekly requirements, code review, tests, CI checks, release handoff and post-release operations.",
                "Achievement: delivered 70+ merged MRs and closed 70+ authored issues across production workflows.",
            ],
            "AI Power": [
                "Converted BA/customer change lists into traceable fixes for ERP business logic, relational data models and reports.",
                "Supported sales, service, parts, warranty and TT200 accounting workflows in a modular Odoo 18 codebase.",
                "Achievement: supported fixes across 18 custom modules and 99+ Python files while preserving an 18-state service flow.",
            ],
            "OakMind": [
                "VN Media Hub: built production CMS, authentication, moderation, logging and reporting workflows with React and ASP.NET Core.",
                "Great Link Mai House: converted legacy MVC/WordPress flows into maintainable React screens, C# APIs and integrations.",
                "OakMind Group Website: shipped a bilingual React 19/ASP.NET Core 8 CMS with media, SEO/analytics and lead workflows.",
                "Achievement: owned BA requirement clarification through production release across all three OakMind Group products.",
            ],
            "ChongScam": [
                "Built production React/NestJS workflows for authentication, RBAC, moderation, audit controls and secure admin operations.",
                "Achievement: shipped the client-operated platform with 22 controllers, 20 SQL migrations and 12 Jest/e2e test suites.",
            ],
        },
    },
    "texpo-software-developer": {
        "output": ROOT / "cv" / "texpo-software-developer" / "CV_NguyenXuanHai_TEXPO_Software_Developer_ATS.pdf",
        "title": "Nguyen Xuan Hai - Software Developer CV",
        "subtitle": "Software Developer | C# | Python | JavaScript | SQL | Business Systems",
        "summary": (
            "Junior software developer with commercial delivery experience since October 2024 through commercial product work and an ERP internship. "
            "Built and supported production web products and ERP workflows using C#, ASP.NET Core, Python, JavaScript/TypeScript, "
            "RESTful APIs, SQL Server and PostgreSQL. Experienced with OOP, modular services, systematic debugging, teamwork, "
            "requirements clarification, Git, Docker and CI/CD."
        ),
        "skills": [
            ("Programming:", "C#, Python 3.12, JavaScript, TypeScript, Object-Oriented Programming (OOP) and asynchronous workflows."),
            ("Application Development:", "ASP.NET Core Web API/MVC, NestJS, Odoo 18, React, RESTful API integration and modular service/business layers."),
            ("Data:", "SQL Server, PostgreSQL, Entity Framework Core, TypeORM, relational modelling, migrations and query/debug support."),
            ("Quality:", "Systematic debugging, validation, logging, code review, Jest/Vitest, end-to-end testing and issue tracking."),
            ("Delivery & Cloud:", "Git, GitLab CI/CD, GitHub Actions, Docker, AWS Cloud fundamentals, release handoff and production support."),
        ],
        "work_entries": ["Betodemy", "AI Power", "OakMind"],
        "project_entries": ["RouteLab"],
        "certification_rows": [
            ("AWS Training:", "AWS Cloud Practitioner Essentials - Completion Certificate (Jul 2026)."),
            ("English:", "B1.4 - Intermediate; technical reading and written communication."),
        ],
        "overrides": {
            "Betodemy": [
                "Build and debug production features across UI, API and PostgreSQL workflows in a modular product within a 5-person team.",
                "Analyze defects, create traceable issues and support code review, CI, release and post-release operations.",
                "Achievement: delivered 70+ merged MRs and closed 70+ authored issues across production workflows.",
            ],
            "AI Power": [
                "Translated BA/customer requirements into Python business-logic, relational-data and report fixes in an Odoo ERP.",
                "Debugged linked sales, service, parts, warranty and accounting workflows; verified changes through Docker and GitLab CI.",
                "Achievement: supported fixes across 18 modules and 99+ Python files while preserving an 18-state service flow.",
            ],
            "OakMind": [
                "VN Media Hub: built ASP.NET Core CMS workflows with authentication, logging and SQL Server-backed reporting.",
                "Great Link Mai House: converted legacy workflows into React screens, C# services and external integrations.",
                "OakMind Group Website: shipped a React/.NET CMS for roles, bilingual content, leads, analytics and media.",
                "Achievement: owned requirement clarification through production release across all three OakMind Group products.",
            ],
            "RouteLab": [
                "Implemented Dijkstra, A*, Floyd-Warshall and Bellman-Ford with REST API and PostgreSQL-backed paths.",
                "Achievement: published a working demo with 95 automated tests and a dedicated GitHub Actions CI pipeline.",
            ],
        },
    },
    "lacviet-dotnet-developer": {
        "output": ROOT / "cv" / "lacviet-dotnet-developer" / "CV_NguyenXuanHai_LacViet_DotNet_Developer_ATS.pdf",
        "title": "Nguyen Xuan Hai - .NET Developer CV",
        "subtitle": ".NET Developer | C# | ASP.NET Core | React | RESTful API | SQL",
        "summary": (
            "Junior .NET-oriented full-stack developer with commercial delivery experience since October 2024 through commercial product work and an ERP internship. "
            "Built and supported production web products using C#, ASP.NET Core, React, TypeScript, RESTful APIs, WebSocket/SignalR, "
            "SQL Server and PostgreSQL. Experienced with OOP, modular service design, code review, debugging, testing, Docker and CI/CD."
        ),
        "skills": [
            (".NET Backend:", "C#, ASP.NET Core Web API/MVC, Object-Oriented Programming (OOP), modular service/business layers and asynchronous workflows."),
            ("Frontend & Integration:", "React, TypeScript, RESTful API integration, WebSocket/SignalR, authentication and reusable UI workflows."),
            ("Data:", "SQL Server, PostgreSQL, Entity Framework Core, relational modelling, migrations and query/debug support."),
            ("Quality:", "Clean modular code, code review, validation, caching, Serilog, Jest/Vitest, end-to-end testing and systematic debugging."),
            ("Delivery:", "Git, GitLab CI/CD, GitHub Actions, Docker, issue tracking, release handoff and production support."),
            ("Developer Tools:", "Claude Code and Codex for codebase context and review notes; outputs verified through code, tests and CI."),
        ],
        "work_entries": ["Betodemy", "AI Power", "OakMind"],
        "project_entries": ["ChongScam"],
        "certification_rows": [
            ("English:", "B1.4 - Intermediate; technical reading and written communication."),
        ],
        "overrides": {
            "Betodemy": [
                "Build and debug production UI/API features in a modular React/NestJS product within a 5-person team.",
                "Trace defects across frontend, REST API and relational-data paths through weekly review, tests, CI and release handoff.",
                "Achievement: delivered 70+ merged MRs and closed 70+ authored issues across production workflows.",
            ],
            "AI Power": [
                "Converted BA/customer change lists into traceable business-logic, relational-data and report fixes in a modular ERP codebase.",
                "Debugged cross-module workflow defects and verified changes through Docker and GitLab CI handoff.",
                "Achievement: supported fixes across 18 custom modules and 99+ Python files while preserving an 18-state service flow.",
            ],
            "OakMind": [
                "VN Media Hub: built ASP.NET Core CMS/API workflows with authentication, caching, Serilog and SQL Server-backed reporting.",
                "Great Link Mai House: converted legacy workflows into React screens, C# services, SignalR and external integrations.",
                "OakMind Group Website: shipped React 19/.NET 8 CMS APIs for roles, content, analytics, contact leads and media.",
                "Achievement: owned BA requirement clarification through production release across all three OakMind Group products.",
            ],
            "ChongScam": [
                "Built production REST API workflows for authentication, RBAC, moderation, audit controls and secure admin operations.",
                "Achievement: shipped the client-operated platform with 22 controllers, 20 SQL migrations and 12 Jest/e2e test suites.",
            ],
            "RouteLab": [
                "Implemented four routing algorithms with REST/database paths and replay visualization.",
                "Achievement: published a working demo backed by 95 automated tests and a dedicated GitHub Actions CI pipeline.",
            ],
        },
    },
    "vnvc-senior-software-developer": {
        "output": ROOT / "cv" / "vnvc-senior-software-developer" / "CV_NguyenXuanHai_VNVC_Software_Developer_ATS.pdf",
        "title": "Nguyen Xuan Hai - Software Developer CV",
        "subtitle": "Software Developer | C# | ASP.NET Core | React / TypeScript | RESTful API | SQL Server",
        "summary": (
            "Full-stack developer with commercial delivery experience since October 2024 through commercial product work and an ERP internship. "
            "Built and supported production web products using C#, ASP.NET Core, React, TypeScript, RESTful APIs, "
            "SQL Server and PostgreSQL. Experienced with OOP, modular service design, authentication, logging, systematic debugging, "
            "testing, Docker, CI/CD and post-release support."
        ),
        "skills": [
            (".NET Backend:", "C#, ASP.NET Core Web API/MVC, Object-Oriented Programming (OOP), modular service/business layers and asynchronous workflows."),
            ("Frontend & Integration:", "React, TypeScript, JavaScript, RESTful API integration, authentication and reusable UI workflows."),
            ("Data:", "SQL Server, PostgreSQL, Entity Framework Core, relational modelling, migrations and query/debug support."),
            ("Quality & Operations:", "Validation, RBAC, caching, Serilog, automated testing, systematic debugging, root-cause notes and production support."),
            ("Delivery:", "Git, GitLab CI/CD, GitHub Actions, Docker, issue tracking, code review, release handoff and BA/QA collaboration."),
        ],
        "work_entries": ["Betodemy", "AI Power", "OakMind"],
        "project_entries": ["ChongScam"],
        "certification_rows": [
            ("AWS Training:", "AWS Cloud Practitioner Essentials - Completion Certificate (Jul 2026)."),
            ("English:", "B1.4 - Intermediate; technical reading and written communication."),
        ],
        "overrides": {
            "Betodemy": [
                "Build and troubleshoot production UI/API features in a modular React/Vite and NestJS product within a 5-person team.",
                "Trace defects across frontend, REST API and PostgreSQL paths through weekly review, tests, CI, release and post-release support.",
                "Achievement: delivered 70+ merged MRs and closed 70+ authored issues across production workflows.",
            ],
            "AI Power": [
                "Converted BA/customer changes into traceable business-logic, relational-data and report fixes in a modular ERP.",
                "Debugged linked sales, service, parts, warranty and accounting workflows; verified changes through Docker and GitLab CI.",
                "Achievement: supported fixes across 18 modules and 99+ Python files while preserving an 18-state service flow.",
            ],
            "OakMind": [
                "VN Media Hub: built ASP.NET Core CMS APIs with authentication, caching, Serilog and SQL Server-backed reporting workflows.",
                "Great Link Mai House: converted legacy workflows into React screens, C# services, Entity Framework data paths and integrations.",
                "OakMind Group Website: shipped React 19/.NET 8 APIs for bilingual content, roles, contact leads, analytics and media.",
                "Achievement: owned BA requirement clarification through production release across all three OakMind Group products.",
            ],
            "ChongScam": [
                "Built production REST API workflows for session authentication, RBAC, moderation, audit controls and secure admin operations.",
                "Achievement: shipped the client-operated platform with 22 controllers, 20 SQL migrations and 12 Jest/e2e test suites.",
            ],
        },
    },
    "phong-kham-315-middle-backend": {
        "output": ROOT / "cv" / "phong-kham-315-middle-backend" / "CV_NguyenXuanHai_PhongKham315_Middle_Backend_ATS.pdf",
        "title": "Nguyen Xuan Hai - Backend Developer CV",
        "subtitle": "Backend Developer | C# | .NET Core | RESTful API | Entity Framework Core | SQL",
        "summary": (
            "Backend-oriented developer with commercial delivery experience since October 2024 through commercial product work and an ERP internship. "
            "Built and supported production business systems using C#, ASP.NET Core, RESTful APIs, Entity Framework Core, SQL Server and PostgreSQL. "
            "Experienced with authentication, relational data workflows, integration testing, logging, systematic debugging, Docker and CI/CD."
        ),
        "skills": [
            (".NET Backend:", "C#, .NET Core, ASP.NET Core Web API/MVC, Object-Oriented Programming (OOP), modular service and business layers."),
            ("API & Integration:", "RESTful API design/integration, DTO validation, authentication, RBAC, asynchronous workflows and WebSocket/SignalR exposure."),
            ("Data:", "SQL Server, PostgreSQL, Entity Framework Core, relational modelling, migrations, data mapping and query/debug support."),
            ("Quality & Security:", "Integration/e2e testing, validation, authorization, audit logging, Serilog, caching and systematic debugging."),
            ("Delivery:", "Git, code review, GitLab CI/CD, GitHub Actions, Docker, issue tracking, release handoff and production support."),
        ],
        "work_entries": ["Betodemy", "AI Power", "OakMind"],
        "project_entries": ["ChongScam"],
        "certification_rows": [
            ("English:", "B1.4 - Intermediate; good technical reading and written communication."),
        ],
        "overrides": {
            "Betodemy": [
                "Build and debug production API/data workflows in a modular NestJS/PostgreSQL product within a 5-person team.",
                "Trace cross-layer defects through weekly issue, review, test, CI and release cycles; support post-release operations.",
                "Achievement: delivered 70+ merged MRs and closed 70+ authored issues across production workflows.",
            ],
            "AI Power": [
                "Translated BA/customer changes into traceable business-logic, relational-data and reporting fixes in a modular ERP.",
                "Debugged linked sales, service, parts, warranty and accounting workflows; verified changes through Docker and GitLab CI.",
                "Achievement: supported fixes across 18 modules and 99+ Python files while preserving an 18-state service flow.",
            ],
            "OakMind": [
                "VN Media Hub: built ASP.NET Core REST APIs with authentication, caching, Serilog and SQL Server-backed CMS/reporting workflows.",
                "Great Link Mai House: converted legacy workflows into C# services, Entity Framework Core data paths, SignalR and integrations.",
                "OakMind Group Website: shipped .NET 8 APIs for roles, bilingual content review, contact leads, analytics and media.",
                "Achievement: owned BA requirement clarification through production release across all three OakMind Group products.",
            ],
            "ChongScam": [
                "Built production REST API workflows for session authentication, RBAC, moderation, audit controls and secure admin operations.",
                "Achievement: shipped the client-operated platform with 22 controllers, 20 SQL migrations and 12 Jest/e2e test suites.",
            ],
        },
    },
    "ecomdent-fullstack-dotnet-erp": {
        "output": ROOT / "cv" / "ecomdent-fullstack-dotnet-erp" / "CV_NguyenXuanHai_Ecomdent_FullStack_DotNet_ERP_ATS.pdf",
        "title": "Nguyen Xuan Hai - Full-Stack Developer CV",
        "subtitle": "Full-Stack Developer | C# | .NET Core | Web API | PostgreSQL | ERP",
        "summary": (
            "Full-stack developer with commercial delivery experience since October 2024 through commercial product work and an ERP internship. "
            "Built and supported production business systems using C#, ASP.NET Core Web API, Entity Framework Core, SQL Server, "
            "PostgreSQL, React and Bootstrap. Experienced with OOP, layered services, DTO/validation workflows, authentication, "
            "systematic debugging, ERP requirements and BA/QA-facing release delivery."
        ),
        "skills": [
            (".NET Backend:", "C#, .NET Core, ASP.NET Core Web API/MVC, Object-Oriented Programming (OOP), asynchronous workflows and modular service/business layers."),
            ("API & Data:", "RESTful API, DTO mapping, input validation, exception handling, Entity Framework Core, PostgreSQL, SQL Server and relational modelling."),
            ("Frontend:", "React, TypeScript, Bootstrap, reusable form/table/modal workflows, responsive UI and API integration; transferable component-based foundation for Vue.js."),
            ("ERP & Quality:", "Business workflow analysis, authentication, logging, query/debug support, refactoring, code review and production troubleshooting."),
            ("Delivery:", "Git, GitLab CI/CD, GitHub Actions, Docker, issue tracking, BA/QA collaboration, release handoff and post-release support."),
        ],
        "work_entries": ["Betodemy", "AI Power", "OakMind"],
        "project_entries": ["ChongScam"],
        "certification_rows": [],
        "overrides": {
            "Betodemy": [
                "Build and debug production form, API and PostgreSQL workflows in a modular product within a 5-person team.",
                "Trace defects across UI, DTO/validation, service and data layers through weekly issue, review, CI and release cycles.",
                "Achievement: delivered 70+ merged MRs and closed 70+ authored issues across production workflows.",
            ],
            "AI Power": [
                "Translated BA/customer changes into business-logic, relational-data, report and input-validation fixes in an Odoo ERP.",
                "Debugged linked sales, service, parts, warranty and accounting workflows; verified changes through Docker and GitLab CI.",
                "Achievement: supported fixes across 18 modules and 99+ Python files while preserving an 18-state service flow.",
            ],
            "OakMind": [
                "VN Media Hub: built ASP.NET Core CMS APIs with authentication, caching, logging and SQL Server-backed reporting workflows.",
                "Great Link Mai House: converted legacy workflows into React screens, C# services, DTO contracts and integrations.",
                "OakMind Group Website: shipped .NET 8/EF Core APIs for roles, bilingual content review, leads, analytics and media.",
                "Achievement: owned BA requirement clarification through production release across all three OakMind Group products.",
            ],
            "ChongScam": [
                "Built production REST API workflows for session authentication, RBAC, moderation, audit controls and secure admin operations.",
                "Applied DTO validation, relational migrations, rate limiting and automated API/e2e verification across a modular backend.",
                "Achievement: shipped the client-operated platform with 22 controllers, 20 SQL migrations and 12 Jest/e2e test suites.",
            ],
        },
    },
    "axon-software-engineer-i": {
        "output": ROOT / "cv" / "axon-software-engineer-i" / "CV_NguyenXuanHai_Axon_Software_Engineer_I_ATS.pdf",
        "title": "Nguyen Xuan Hai - Software Engineer I CV",
        "subtitle": "Software Engineer I | C#/.NET | React | OOP | Testing & CI/CD",
        "summary": (
            "Junior software engineer with commercial delivery experience since October 2024 through commercial product work and an ERP internship. "
            "Built and supported production web features using C#, ASP.NET Core, React, TypeScript, RESTful APIs and relational databases. "
            "Experienced with code review, debugging, automated testing, CI/CD and end-to-end delivery; uses AI-assisted development tools "
            "for codebase context and review while validating behavior through code, tests and manual checks."
        ),
        "skills": [
            ("Programming Foundations:", "C#, Object-Oriented Programming (OOP), data structures, algorithms, asynchronous workflows and systematic debugging."),
            ("Application Development:", "ASP.NET Core Web API/MVC, React, TypeScript, NestJS, RESTful API integration and modular service design."),
            ("Data:", "SQL Server, PostgreSQL, Entity Framework Core, TypeORM, relational modelling and query/debug support."),
            ("Quality:", "Code review, Jest/Vitest, end-to-end testing, validation, authentication, RBAC, logging and regression-aware changes."),
            ("Delivery:", "Git, GitLab CI/CD, GitHub Actions, Docker, issue tracking, release handoff and production support."),
            ("Developer Tools:", "Claude Code and Codex for codebase context, implementation planning and review notes; outputs verified through tests and CI."),
        ],
        "work_entries": ["Betodemy", "AI Power", "OakMind"],
        "project_entries": ["RouteLab"],
        "certification_rows": [
            ("English:", "B1.4 - Intermediate; technical reading and written communication."),
        ],
        "overrides": {
            "Betodemy": [
                "Build and debug end-to-end product features in a modular React/NestJS monorepo within a 5-person engineering team.",
                "Work through weekly issues, code review, tests, CI checks, release handoff and production troubleshooting.",
                "Achievement: delivered 70+ merged MRs and closed 70+ authored issues across production workflows.",
            ],
            "AI Power": [
                "Completed a professional software development internship supporting business logic, data models and reports in an existing modular ERP codebase.",
                "Prepared small, traceable fixes from BA/customer requirements and checked GitLab CI handoff for shared production workflows.",
                "Achievement: supported fixes across 18 custom modules and 99+ Python files without breaking an 18-state service flow.",
            ],
            "OakMind": [
                "VN Media Hub: built production CMS, authentication, moderation, logging and reporting features with React and ASP.NET Core APIs.",
                "Great Link Mai House: converted legacy workflows into maintainable React screens, C# services and realtime integrations.",
                "OakMind Group Website: shipped a bilingual React 19/ASP.NET Core 8 CMS with media, SEO/analytics and lead workflows.",
                "Achievement: owned requirement clarification through production release across all three OakMind Group products.",
            ],
            "RouteLab": [
                "Implemented Dijkstra, A*, Floyd-Warshall and Bellman-Ford with REST/database paths and replay visualization.",
                "Achievement: published a working demo with automated frontend/backend tests and a dedicated backend algorithm CI pipeline.",
            ],
            "ChongScam": [
                "Built production React/NestJS workflows for session authentication, RBAC, moderation, audit controls and secure admin operations.",
                "Achievement: shipped the client-operated platform with 22 controllers, 20 SQL migrations and 12 Jest/e2e test suites.",
            ],
        },
    },
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

    def footer(self):
        self.c.saveState()
        self.c.setStrokeColor(base.SOFT_RULE)
        self.c.line(base.MARGIN_X, base.BOTTOM - 8, base.PAGE_W - base.MARGIN_X, base.BOTTOM - 8)
        self.c.setFillColor(base.MUTED)
        self.c.setFont("Arial", 7.2)
        target_role = config["subtitle"].split("|")[0].strip()
        self.c.drawString(base.MARGIN_X, base.BOTTOM - 22, f"Nguyen Xuan Hai | {target_role}")
        self.c.drawRightString(base.PAGE_W - base.MARGIN_X, base.BOTTOM - 22, f"Page {self.page}")
        self.c.restoreState()

    pdf.header = MethodType(header, pdf)
    pdf.summary = MethodType(summary, pdf)
    pdf.skills = MethodType(skills, pdf)
    pdf._footer = MethodType(footer, pdf)

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
    certification_rows = config.get(
        "certification_rows",
        [
            ("AWS Training:", "AWS Cloud Practitioner Essentials - Completion Certificate (Jul 2026)."),
            ("Professional:", "Software Development Lifecycle (AIAcademy by AIPOWER, Jul 2026); Information Security Awareness (AIAcademy by AIPOWER, Jul 2026)."),
            ("English:", "B1.4 - Intermediate; technical reading and written communication."),
        ],
    )
    if certification_rows:
        pdf.compact_section("Certifications & Language", certification_rows)
    pdf.save()
    base.normalize_pdf(output, title=config["title"], subject=config["subtitle"])
    return output


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("variant", choices=sorted(VARIANTS))
    args = parser.parse_args()
    print(build_variant(args.variant))


if __name__ == "__main__":
    main()

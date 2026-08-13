#!/usr/bin/env python3
"""Migrate education facts inside previously generated vector CV PDFs.

The migration edits PDF text-showing operands directly, preserving the existing
layout, fonts and vector content. It is intended for archived tailored CVs that
cannot all be regenerated from one shared preset.
"""

from __future__ import annotations

import argparse
import re
from pathlib import Path

from pypdf import PdfWriter
from pypdf.generic import ByteStringObject, ContentStream, TextStringObject


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_ROOTS = (ROOT / "public", ROOT / "cv")


def migrate_bytes(value: bytes) -> bytes:
    updated = value.replace(b"3.24", b"3.26")
    updated = updated.replace(b"Expected 2026", b"2026")
    # ReportLab subset fonts encode Vietnamese diacritics as single-byte glyph IDs.
    updated = re.sub(rb"D[^\x20-\x7e] ki[^\x20-\x7e]n 2026", b"2026", updated)
    updated = re.sub(rb"d[^\x20-\x7e] ki[^\x20-\x7e]n ", b"", updated)
    return updated


def migrate_operand(value: object) -> tuple[object, bool]:
    if isinstance(value, TextStringObject):
        raw = value.original_bytes
        updated = migrate_bytes(raw)
        return (ByteStringObject(updated), True) if updated != raw else (value, False)
    if isinstance(value, ByteStringObject):
        raw = bytes(value)
        updated = migrate_bytes(raw)
        return (ByteStringObject(updated), True) if updated != raw else (value, False)
    return value, False


def migrate_pdf(path: Path, write: bool) -> int:
    writer = PdfWriter(clone_from=str(path))
    changed_operands = 0

    for page in writer.pages:
        if page.get_contents() is None:
            continue
        content = ContentStream(page.get_contents(), writer)
        page_changed = False
        for operands, operator in content.operations:
            if operator == b"Tj" and operands:
                operands[0], changed = migrate_operand(operands[0])
                changed_operands += int(changed)
                page_changed |= changed
            elif operator == b"TJ" and operands and isinstance(operands[0], list):
                for index, value in enumerate(operands[0]):
                    operands[0][index], changed = migrate_operand(value)
                    changed_operands += int(changed)
                    page_changed |= changed
        if page_changed:
            page.replace_contents(content)

    if changed_operands and write:
        temporary = path.with_suffix(".pdf.tmp")
        with temporary.open("wb") as stream:
            writer.write(stream)
        temporary.replace(path)

    return changed_operands


def pdf_paths(roots: list[Path]) -> list[Path]:
    return sorted({path.resolve() for root in roots for path in root.rglob("*.pdf")})


def main() -> None:
    parser = argparse.ArgumentParser(description="Update GPA and graduation-year wording in generated CV PDFs.")
    parser.add_argument("paths", nargs="*", type=Path, help="PDF files or directories; defaults to public/ and cv/.")
    parser.add_argument("--write", action="store_true", help="Apply changes; otherwise perform a dry run.")
    args = parser.parse_args()

    requested = [path.resolve() for path in args.paths]
    roots = requested or list(DEFAULT_ROOTS)
    paths: list[Path] = []
    for root in roots:
        if root.is_file() and root.suffix.lower() == ".pdf":
            paths.append(root)
        elif root.is_dir():
            paths.extend(root.rglob("*.pdf"))

    changed_files = 0
    changed_operands = 0
    for path in sorted(set(paths)):
        count = migrate_pdf(path, args.write)
        if count:
            changed_files += 1
            changed_operands += count
            print(f"{'UPDATED' if args.write else 'WOULD UPDATE'} {path}: {count} text operand(s)")

    mode = "updated" if args.write else "would update"
    print(f"{changed_files} PDF(s) {mode}; {changed_operands} text operand(s).")


if __name__ == "__main__":
    main()

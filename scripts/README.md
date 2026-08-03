# CV generator scripts

This public repository keeps only the reusable master CV generators:

- `generate_cv_pdf.py` creates the English and Vietnamese ATS PDFs.
- `generate_visual_cv_pdf.py` creates the English and Vietnamese visual PDFs.

Install the dependencies with `python3 -m pip install -r requirements-cv.txt`, then run either script from the repository root. The scripts currently use the font paths declared in their source, so non-macOS environments may need equivalent fonts or a font fallback.

Company- and role-specific CV tailoring data is deliberately kept in a local, Git-ignored `private/` workspace. It is not included in this public repository or its future commits.

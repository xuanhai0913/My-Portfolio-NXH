# Design System Rules (Phase 2)

## Purpose
Keep UI consistency high while preserving the existing brutalist visual direction.

## Token Usage
- Always use global tokens from `src/index.css` for spacing, typography, radius, motion, and touch targets.
- Avoid raw pixel values for section paddings and heading sizes unless there is a strong visual reason.
- Prefer `--section-padding-x` and `--section-padding-y` for section wrappers.
- Use `--touch-target-min` for all interactive controls.

## Typography Rhythm
- Display headings should use `--type-display-lg` or `--type-display-md`.
- Section-level headings should use `--type-heading-md`.
- Body copy should use `--type-body-lg` or `--type-body-md`.

## Motion and Accessibility
- Use `--motion-fast`, `--motion-base`, or `--motion-slow` with `--ease-standard`.
- Every animation or transition must respect reduced-motion media queries.
- Focus-visible state must remain visible and consistent with the accent color.

## Component Surface Rules
- Use `--radius-sm`, `--radius-md`, and `--radius-lg` for rounded surfaces.
- Use `--shadow-soft` for floating badges or elevated cards.
- Reuse shared button spacing tokens (`--button-padding-y`, `--button-padding-x`) before introducing one-off button styles.

## Contributor Checklist
- Section spacing aligned with token scale.
- Heading and body sizes mapped to type tokens.
- Interactive controls meet minimum target size.
- No new hard-coded motion easing for common interactions.

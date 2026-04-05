# UI Upgrade Plan (2026)

## Objective
Build a stable, high-quality UI that keeps the brutalist identity, improves smoothness, and reintroduces 3D only where it is measurable and safe.

## Current Baseline (from project scan)
- Stack: React 18 + react-scripts + GSAP + Lenis + Framer Motion + R3F/Drei/Three.
- Architecture: single-page section flow with global smooth-scroll and section-level ErrorBoundary wrappers.
- Known risk area: multiple heavy visual systems running at once (scroll + animation + 3D + postprocessing).

## Skills Already Installed In This Repo
- threejs
- threejs-animation
- vercel-react-best-practices
- frontend-design
- web-design-guidelines
- animate
- polish

These are enough to execute most of the UI roadmap without adding new skills immediately.

## Recommended Additional Skills (high confidence first)
1. vercel-labs/agent-skills@vercel-react-best-practices
- Why: top-tier React performance rules (very high install count, strong source).
- Install: npx skills add vercel-labs/agent-skills@vercel-react-best-practices -g -y
- Link: https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices

2. anthropics/skills@frontend-design
- Why: high quality UI composition and design direction workflow.
- Install: npx skills add anthropics/skills@frontend-design -g -y
- Link: https://skills.sh/anthropics/skills/frontend-design

3. cloudai-x/threejs-skills@threejs-animation
- Why: focused Three.js animation patterns and implementation details.
- Install: npx skills add cloudai-x/threejs-skills@threejs-animation -g -y
- Link: https://skills.sh/cloudai-x/threejs-skills/threejs-animation

4. addyosmani/web-quality-skills@accessibility
- Why: practical accessibility checks for production UI quality.
- Install: npx skills add addyosmani/web-quality-skills@accessibility -g -y
- Link: https://skills.sh/addyosmani/web-quality-skills/accessibility

## Installation Status (Updated)
- Installed globally:
	- vercel-labs/agent-skills@vercel-react-best-practices
	- anthropics/skills@frontend-design
	- cloudai-x/threejs-skills@threejs-animation
	- addyosmani/web-quality-skills@accessibility
- Notes:
	- Security scan from skills CLI reported Safe/Low Risk for first three skills.
	- accessibility skill reported Medium Risk in CLI metadata; keep usage scoped to review/audit tasks.

## Immediate Next Step
- Execute: PHASE1_UI_STABILITY_CHECKLIST.md
- Priority: finish Phase 1 before reintroducing any real-time 3D effects in critical sections.

## Use With Caution (high installs but not first choice)
- nextlevelbuilder/ui-ux-pro-max-skill@ui-ux-pro-max
- wshobson/agents@tailwind-design-system

Reason: useful, but broad and opinionated. Use after core plan is stable.

## 5-Phase Upgrade Roadmap

### Phase 1: Stability First (1-2 weeks)
Goal: no section crash, no severe scroll stutter.

Actions:
- Keep 3D disabled in critical sections until metrics pass threshold.
- Isolate each high-risk visual block with local fallback (not section-wide failure).
- Add guard rails for NaN/invalid scroll math and observer cleanup.
- Reduce concurrent animation surfaces above the fold.

Success metrics:
- 0 ErrorBoundary fallbacks in normal scroll flow.
- No major FPS drops during Profile -> Projects -> Contact loop.

### Phase 2: Design System Foundation (1-2 weeks)
Goal: consistent visual quality and easier maintenance.

Actions:
- Create shared tokens for spacing, type scale, border, shadow, motion timing.
- Standardize heading rhythm and section paddings.
- Normalize button, link, card, and focus styles.
- Document component usage rules for future contributors.

Success metrics:
- Consistent spacing and type rhythm across all sections.
- Reduced CSS drift and one-off style overrides.

### Phase 3: UX and Accessibility Hardening (1 week)
Goal: keyboard-friendly, readable, and robust interactions.

Actions:
- Ensure visible focus states across interactive elements.
- Improve reduced-motion behavior for all animation systems.
- Verify color contrast and text legibility in neon-on-dark areas.
- Tighten empty, loading, and error states for each section.

Success metrics:
- Clean keyboard navigation through full page flow.
- No critical accessibility regressions in audit.

### Phase 4: Controlled 3D Reintroduction (1-2 weeks)
Goal: bring back premium 3D without harming UX.

Actions:
- Re-enable 3D only for one section at a time.
- Use adaptive quality tiers by viewport and device capability.
- Gate postprocessing and high-poly meshes behind visibility and performance checks.
- Prefer frameloop demand/conditional rendering for offscreen scenes.

Success metrics:
- Stable FPS while scrolling.
- No visual artifacts (flicker, blown highlights, context loss).

### Phase 5: Continuous Quality Loop (ongoing)
Goal: prevent regressions as content/features grow.

Actions:
- Add periodic UI review using web-design-guidelines + polish.
- Add pre-release checklist for motion, responsiveness, and accessibility.
- Track key interactions and performance events in analytics.
- Keep skills updated monthly.

Commands:
- npx skills check
- npx skills update

## Suggested Operating Workflow Per Feature
1. Use vercel-react-best-practices for performance-safe implementation.
2. Use frontend-design for visual direction and layout decisions.
3. Use animate for intentional motion.
4. Use web-design-guidelines for audit.
5. Use polish as final pre-release pass.

## Decision Rule For 3D Features
Only ship a 3D effect when all are true:
- It has clear UX value, not only decoration.
- It degrades gracefully to static or low-cost mode.
- It does not block scroll/input responsiveness.
- It passes reduced-motion and accessibility checks.

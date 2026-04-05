# UIUX Transformation Execution Board (2026)

Updated: 2026-04-05
Primary reference: MASTER_UIUX_REDESIGN_PLAN_2026.md

## 1. Program Cadence
- Cadence: 1-week sprints
- Release rhythm: milestone PRs (M1 to M4)
- Branch policy: feature/ui-upgrade-2026 only until release gate turns green

## 2. Epic Board

## Epic A — Experience Architecture Lock (M1)
Goal: freeze the content and interaction topology of the new homepage.

### Stories
- A1: As a visitor, I can understand page intent in one scroll pass.
- A2: As a keyboard user, I can navigate every primary action.

### Tasks
- [x] A1-T1 Define final section sequence and role per section.
- [x] A1-T2 Define transition contract for each section boundary.
- [x] A1-T3 Define navigation state model (active section, anchor behavior).
- [x] A2-T1 Validate heading hierarchy and landmark structure.
- [x] A2-T2 Validate skip-link and focus return behavior.

### Acceptance
- [x] No ambiguous section purpose in architecture map.
- [x] No dead transition state between neighboring sections.

## Epic B — Layout and Theme System Lock (M2)
Goal: remove visual inconsistency and ad-hoc styling from core surfaces.

### Stories
- B1: As a designer/developer, I can style new sections through tokens without one-off hacks.
- B2: As a user, layout rhythm remains coherent across breakpoints.

### Tasks
- [ ] B1-T1 Finalize token taxonomy: global, semantic, component.
- [ ] B1-T2 Map each component to token usage table.
- [ ] B1-T3 Remove legacy style collisions from global imports.
- [ ] B2-T1 Audit spacing rhythm desktop/tablet/mobile.
- [ ] B2-T2 Verify typography consistency and optical balance.

### Acceptance
- [ ] No hard-coded ad-hoc style values in core immersive sections.
- [ ] Responsive layout matrix passes at required breakpoints.

## Epic C — Scroll and Motion Orchestration (M3)
Goal: make motion expressive but predictable and testable.

### Stories
- C1: As a user, section transitions feel intentional and smooth.
- C2: As a reduced-motion user, I can consume all content without disorientation.

### Tasks
- [x] C1-T1 Implement scroll reveal contract per section.
- [x] C1-T2 Implement progress HUD and section state transitions.
- [ ] C1-T3 Define animation durations/easing by motion class.
- [x] C2-T1 Implement reduced-motion alternatives for hero and section reveals.
- [x] C2-T2 Validate no information loss when animations are disabled.

### Acceptance
- [ ] Motion taxonomy table and mapping completed.
- [ ] Reduced-motion walkthrough passes.

## Epic D — 3D Runtime Governance (M3)
Goal: keep 3D premium while preserving stability budgets.

### Stories
- D1: As a user on capable devices, I get high-fidelity 3D.
- D2: As a user on constrained devices, I get graceful fallback without breakage.

### Tasks
- [x] D1-T1 Apply quality tiers (high/medium/low) across all heavy 3D surfaces.
- [x] D1-T2 Gate effects by visibility and document focus state.
- [x] D2-T1 Ensure fallback parity for low tier and reduced-motion mode.
- [ ] D2-T2 Validate artifact-free behavior during rapid scroll loops.

### Acceptance
- [ ] Quality policy matrix complete with section-level settings.
- [ ] No severe frame stutter in required scenario matrix.

## Epic E — Accessibility and UX Hardening (M4)
Goal: achieve AA-level practical usability for the full immersive experience.

### Stories
- E1: As a keyboard user, I can complete all primary interactions.
- E2: As a low-vision user, text and controls remain legible and discoverable.

### Tasks
- [ ] E1-T1 Keyboard-only walkthrough: header -> projects -> lab -> contact actions.
- [x] E1-T2 Verify focus style consistency and visibility on all interactive elements.
- [ ] E2-T1 Contrast audit for neon-on-dark pairings.
- [x] E2-T2 Touch target audit for mobile controls.
- [x] E2-T3 Alt text and semantic role audit.

### Acceptance
- [ ] Critical WCAG AA blockers resolved.
- [ ] Accessibility report attached to milestone PR.

## Epic F — Release Operations and Stabilization (M4)
Goal: ship safely with rollback readiness and monitoring protocol.

### Stories
- F1: As a maintainer, I can release with confidence and rollback quickly.
- F2: As a maintainer, I can identify regressions quickly post-release.

### Tasks
- [ ] F1-T1 Complete release gate checklist with evidence.
- [ ] F1-T2 Validate rollback tag and rollback rehearsal notes.
- [ ] F2-T1 Define post-release monitoring window and thresholds.
- [ ] F2-T2 Remove temporary diagnostics after stable window.

### Acceptance
- [ ] Release gate all green.
- [ ] Monitoring + cleanup notes committed.

## 3. Weekly Operating Focus
- Week N: choose one milestone focus only.
- Start: baseline metrics + target checklist.
- Midweek: regression checkpoint build.
- End: acceptance evidence bundle (screenshots, logs, checklist).

## 4. Blocker Policy
If any blocker is red, milestone cannot merge:
- runtime exceptions in homepage flow
- severe interaction stutter in mandatory scenarios
- keyboard/focus critical failure
- reduced-motion flow missing critical content

## 5. Evidence Bundle Requirement
Each milestone PR must include:
- scope summary
- before/after screenshots or clips
- build output
- checklist pass table
- known risks and follow-up actions

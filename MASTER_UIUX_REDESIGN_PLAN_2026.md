# Master UIUX Redesign Plan (2026)

Updated: 2026-04-05
Branch: feature/ui-upgrade-2026
Program type: full frontend transformation

## 1. Program Goal
Build a flagship portfolio experience with a complete reset of layout, visual language, interaction model, and scroll storytelling.

Design direction:
- immersive digital-exhibition feel
- cinematic motion with strict performance guardrails
- 3D as narrative infrastructure, not decoration
- accessibility and reduced-motion parity from day one

This plan supersedes phase-by-phase stabilization as the primary execution document for the redesign program.

## 2. What Changes at Program Level
This is not a polishing pass. It is a full product-surface rewrite of:
- information architecture and section choreography
- navigation behavior and state model
- design token hierarchy and visual grammar
- animation system and scroll scene orchestration
- 3D runtime policy, quality tiers, and fallback paths

## 3. Operating Principles (from skills + best practices)
### Frontend-design principles
- one strong creative direction per release, no mixed aesthetics
- typography must carry identity, not default system feel
- atmosphere first: depth, gradients, texture, contrast rhythm

### Animate principles
- define one hero motion signature and support layers
- animate transform and opacity first, avoid layout-jank properties
- motion must explain hierarchy, not distract from content

### Vercel React best-practices principles
- split heavy modules with lazy loading and suspense boundaries
- avoid unnecessary rerenders and expensive effect churn
- keep bundle growth under control with measurable budgets

### Accessibility and web-guideline principles
- keyboard and focus behavior are required, not optional
- reduced-motion mode must preserve meaning and usability
- contrast and target-size checks are release blockers

### Threejs and threejs-animation principles
- quality tiers by capability and viewport class
- scene complexity scales by budget, not by preference
- 3D render loops pause offscreen and when tab is hidden

## 4. Program Scope
### In scope
- root homepage architecture replacement
- redesigned section sequence and transitions
- new visual token system for immersive theme
- integrated 3D hero scene and media storytelling panels
- scroll-behavior orchestration for narrative pacing
- release-gate QA framework

### Out of scope for this wave
- backend feature expansion
- content management tooling changes
- non-frontend API schema changes

## 5. Current Status Snapshot
Completed in branch:
- full homepage replacement with immersive layout system
- new 3D hero scene split into lazy chunk
- route-level integration for new homepage
- production build validation after redesign

Still required before merge to main:
- manual QA matrix execution on target devices
- phase milestone PR notes and acceptance evidence
- post-release monitoring and temporary log cleanup window

## 6. Deep Execution Plan
## Track A — Experience Architecture
Goal: finalize section-level narrative flow and content hierarchy.

Actions:
- lock final section order and intent map
- define transition contracts between sections
- enforce consistent section entry and exit behavior

Deliverables:
- architecture map with section intent
- section contracts document (entry state, active state, exit state)

Acceptance:
- no ambiguous transitions or dead scroll zones

## Track B — Layout and Theme System
Goal: stabilize the new visual language into reusable primitives.

Actions:
- normalize token layers:
  - global tokens (color, typography, spacing, elevation, easing)
  - semantic tokens (surface, border, accent states)
  - component tokens (cards, buttons, nav chips, section frames)
- enforce responsive layout rules for desktop/tablet/mobile
- remove style conflicts from legacy themes

Deliverables:
- token map and usage table
- component style matrix

Acceptance:
- no ad-hoc style values in core sections
- visual rhythm remains consistent across breakpoints

## Track C — Scroll and Motion Orchestration
Goal: convert animation into a predictable, testable system.

Actions:
- define motion taxonomy:
  - hero entry choreography
  - section reveal choreography
  - interaction micro-motion
  - background ambient motion
- map timings and easing families to motion classes
- add reduced-motion alternate choreography

Deliverables:
- motion spec table (duration, easing, trigger, fallback)
- reduced-motion behavior map

Acceptance:
- no abrupt transitions in standard mode
- no blocked flows in reduced-motion mode

## Track D — 3D Runtime and Performance Governance
Goal: keep 3D premium while protecting smoothness.

Actions:
- extend quality tier policy across all heavy visual blocks
- cap geometry/material complexity by tier
- enforce render pause rules:
  - offscreen pause
  - hidden-tab pause
  - low-capability simplified mode
- keep 3D fallback visual parity for low-end devices

Deliverables:
- 3D quality policy matrix (high/medium/low)
- fallback parity checklist

Acceptance:
- no severe stutter under normal flow on baseline devices
- no visual break when 3D is disabled

## Track E — Accessibility and UX Hardening
Goal: keep flagship visuals with AA-level usability.

Actions:
- keyboard walkthrough for all primary interactions
- focus indicator consistency checks
- touch target and contrast audit
- alt text and semantic structure verification

Deliverables:
- accessibility audit report with pass/fail items
- remediations list and evidence

Acceptance:
- all critical AA blockers resolved

## Track F — Release Operations and Quality Loop
Goal: ship safely and avoid regression drift.

Actions:
- run release matrix before each merge candidate
- keep rollback tag strategy and branch safety
- define post-release monitoring window and thresholds
- remove temporary diagnostics after stable window

Deliverables:
- release gate checklist with evidence links
- post-release monitoring log

Acceptance:
- merge only after all release blockers are green

## 7. Performance Budget (Release Blockers)
### Runtime budgets
- no severe frame stutter in core scroll narrative flow
- no interaction lock on nav, CTA, and section anchors
- no unhandled runtime errors in homepage flow

### Bundle budgets
- heavy 3D logic isolated into lazy-loaded chunks
- avoid accidental regressions from global imports
- new visual assets must be optimized and justified

### UX budgets
- all core actions accessible via keyboard
- reduced-motion keeps complete content access
- mobile touch interaction remains reliable

## 8. QA Matrix (Mandatory)
### Device and viewport coverage
- desktop: 1440x900 and 1920x1080
- mobile: 390x844 and one mid-range Android viewport
- reduced-motion mode on both desktop and mobile

### Scenario coverage
- top-to-bottom slow scroll narrative pass
- rapid scroll up/down loop stress pass
- anchor jump navigation pass
- keyboard-only pass
- hidden-tab recovery pass (return from background)

### Evidence required
- recorded checklist output
- issue list with severity labels
- final pass/fail summary

## 9. Risk Register
### Risk 1: visual ambition outruns performance budget
Mitigation:
- enforce tiered rendering and scene complexity caps
- benchmark before introducing new heavy effects

### Risk 2: mixed legacy styles leak into new system
Mitigation:
- isolate immersive styles and remove conflicting global overrides
- reject PRs with token bypass in core layout

### Risk 3: motion overload hurts usability
Mitigation:
- cap concurrent motion surfaces per viewport
- maintain reduced-motion choreography parity

### Risk 4: merge drift from long-running branch
Mitigation:
- milestone PRs with focused scope
- frequent build + QA checkpoints

## 10. Milestones and Sequencing
### Milestone M1: architecture lock
Output:
- section flow finalized
- transition contracts approved

### Milestone M2: design-system lock
Output:
- token and component style matrix finalized
- responsive consistency pass complete

### Milestone M3: motion and 3D lock
Output:
- motion taxonomy applied
- 3D tier governance validated

### Milestone M4: accessibility and release lock
Output:
- QA matrix complete
- release gate green
- rollback path confirmed

## 11. Definition of Done for Program Merge
Program is done only when all are true:
- immersive homepage is the canonical root experience
- performance budgets pass across required matrix
- accessibility blockers are resolved
- release checklist is complete with evidence
- rollback and monitoring procedures are prepared

## 12. Immediate Next Actions (Execution order)
1. Execute mandatory manual QA matrix for redesigned homepage.
2. Produce milestone acceptance notes for M1 to M3 from implemented branch state.
3. Fix all blockers discovered during manual QA.
4. Run final release gate and publish M4 evidence.
5. Remove temporary diagnostics after stable post-release window.

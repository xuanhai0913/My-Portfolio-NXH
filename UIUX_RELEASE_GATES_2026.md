# UIUX Release Gates (2026)

Updated: 2026-04-05
Applies to: immersive homepage redesign on feature/ui-upgrade-2026

## 1. Gate Types
- Gate A: Functional Integrity
- Gate B: Motion and Scroll Quality
- Gate C: 3D Runtime Stability
- Gate D: Accessibility Compliance
- Gate E: Release Operations

## 2. Gate A — Functional Integrity
All required checks must pass:
- [x] Production build succeeds with no blocking errors.
- [ ] No unhandled runtime exception during primary flow.
- [x] Navigation links and section anchors resolve correctly.
- [x] Contact entry actions (email/assistant/linkedin) are reachable.

## 3. Gate B — Motion and Scroll Quality
All required checks must pass:
- [ ] No abrupt section jump under normal scroll pace.
- [ ] No visual tearing during fast up/down loops.
- [x] Progress indicator and section state remain synchronized.
- [x] Reduced-motion mode disables non-essential choreography.

Recommended measurement notes:
- baseline subjective smoothness per device class
- observed stutter points and reproduction steps

## 4. Gate C — 3D Runtime Stability
All required checks must pass:
- [ ] 3D hero and scene surfaces render without artifact spikes.
- [x] Quality tiers degrade correctly on constrained environments.
- [x] Offscreen and hidden-tab pause rules are effective.
- [x] Low-tier fallback keeps narrative continuity.

Recommended measurement notes:
- observed quality tier per device
- any frame-drop windows by section

## 5. Gate D — Accessibility Compliance
All required checks must pass:
- [ ] Keyboard-only traversal reaches all primary actions.
- [x] Focus-visible styles are present and legible.
- [x] Touch targets satisfy minimum size requirement.
- [ ] Contrast for key text and controls is acceptable.
- [x] Reduced-motion path preserves equivalent content access.

## 6. Gate E — Release Operations
All required checks must pass:
- [ ] Milestone PR includes evidence bundle.
- [ ] Rollback tag and rollback notes are confirmed.
- [ ] Post-release monitoring checklist is prepared.
- [ ] Temporary stability logs have a removal schedule.

## 7. Go/No-Go Rule
Release is allowed only when all gates are green.
Any red item results in no-go and requires remediation commit.

## 8. Sign-off Table
| Gate | Owner | Status | Evidence Link |
|------|-------|--------|---------------|
| A | Frontend | In Progress | Build: npm run build (pass), Anchors + focus contract implemented |
| B | Frontend | In Progress | Scroll HUD sync + reduced-motion choreography controls implemented |
| C | Frontend + 3D | In Progress | Hero quality tiers + hidden-tab/offscreen gating + lab video visibility gating |
| D | Frontend + QA | In Progress | Focus-visible, touch-target sizing, and reduced-motion path hardened |
| E | Frontend Lead | Pending | - |

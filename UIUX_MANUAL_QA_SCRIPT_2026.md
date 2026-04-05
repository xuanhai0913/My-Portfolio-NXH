# UIUX Manual QA Script (2026)

Updated: 2026-04-05
Scope: immersive homepage redesign

## 1. Test Matrix
### Desktop
- 1440x900
- 1920x1080

### Mobile
- 390x844
- one mid-range Android viewport equivalent

### Motion Modes
- standard motion
- prefers-reduced-motion enabled

## 2. Scenario S1 — Full Narrative Pass
Steps:
1. Load homepage from top.
2. Scroll slowly from hero to contact section.
3. Observe section transitions and active nav state.

Pass Criteria:
- no layout collapse
- no broken media frame
- transitions feel continuous

## 3. Scenario S2 — Stress Scroll Loop
Steps:
1. Start at hero.
2. Rapidly scroll to bottom and back to top 3 times.
3. Repeat with momentum/trackpad style input.

Pass Criteria:
- no severe stutter plateau
- no persistent visual artifact
- no runtime error fallback

## 4. Scenario S3 — Anchor Navigation Consistency
Steps:
1. Use top nav links to jump across sections.
2. Verify active section indicator and content alignment.

Pass Criteria:
- anchor lands correctly
- nav state updates accurately
- no hidden/overlapped content

## 5. Scenario S4 — Keyboard-only Walkthrough
Steps:
1. Use Tab/Shift+Tab only from top of page.
2. Reach all primary actions and links.
3. Activate key CTAs via Enter/Space where applicable.

Pass Criteria:
- visible focus ring on all actionable elements
- logical tab order
- no keyboard trap

## 6. Scenario S5 — Reduced Motion Validation
Steps:
1. Enable prefers-reduced-motion in system settings.
2. Reload page and repeat S1 + S4.

Pass Criteria:
- non-essential motion is reduced/disabled
- content remains fully accessible
- no missing information due to removed animation

## 7. Scenario S6 — Hidden-tab Recovery
Steps:
1. Load homepage and scroll to mid-page.
2. Switch to another tab for 20 to 30 seconds.
3. Return and continue interaction.

Pass Criteria:
- no frozen/intermittent canvas behavior
- no section state desync
- interactions remain responsive

## 8. Reporting Template
For each failed step, capture:
- scenario id
- device + viewport
- reproduction steps
- expected vs actual result
- severity (critical/high/medium/low)

## 9. Exit Rule
Manual QA passes only when:
- all critical and high issues are resolved
- no red blocker remains in release gates
- evidence log is attached to milestone PR

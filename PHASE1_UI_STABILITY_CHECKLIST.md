# Phase 1 UI Stability Checklist

## Scope
Stabilize the production page flow: Profile -> About -> Experience -> Projects -> Certifications -> Contact.

## Primary Goals
- No section-level crash fallback during normal scroll.
- No severe input/scroll stutter on desktop and mobile.
- Keep visual identity while prioritizing reliability.

## Execution Order
1. App-level cleanup and guard rails.
2. Scroll and animation stability.
3. Section-level hardening (Profile, Projects, Contact).
4. Release checks and rollback safety.

## Task List

### A. App-level Guard Rails
- [ ] Replace section-wide ErrorBoundary usage with narrower local boundaries for risky sub-blocks only.
  - File: src/App.jsx
  - Target: avoid whole section collapse when a visual widget fails.
- [ ] Remove unused heavy imports and stale code paths.
  - File: src/App.jsx
  - Current note: BackgroundWaves import is unused.

### B. Scroll + Animation Stability
- [ ] Verify Lenis and GSAP ticker cleanup executes exactly once per mount/unmount.
  - File: src/components/SmoothScroll/index.jsx
- [ ] Clamp and sanitize scroll math in all scroll-reactive sections.
  - Files: src/components/Portfolio/index.jsx, src/components/SectionTransition/*
- [ ] Ensure every global event listener has deterministic cleanup.
  - Areas: mousemove, scroll, resize, media query listeners.

### C. Profile Section Hardening
- [x] Disable unstable bright background effect for now (done).
  - File: src/components/Profile/index.jsx
- [x] Reduce visual pressure from glitch layers on low-end devices.
  - File: src/components/Profile/styles/Profile.css
  - Option: disable glitch animation under reduced-motion and small viewports.
- [x] Normalize image and overlay contrast to prevent highlight blooming.
  - File: src/components/Profile/styles/Profile.css

### D. Projects Section Hardening
- [x] Replace 3D project card with static image fallback by default (done).
  - File: src/components/Portfolio/index.jsx
- [x] Add card-level fallback block for image load failure.
  - File: src/components/Portfolio/index.jsx
  - Requirement: if image fails, render placeholder panel, not empty frame.
- [ ] Keep active index always bounded and finite.
  - File: src/components/Portfolio/index.jsx
  - Validate with rapid scroll and anchor jump.

### E. Contact Section Hardening
- [x] Keep 3D model optional behind capability gate.
  - File: src/components/Contact/index.jsx
  - Rule: on low capability or reduced-motion, use static visual.
- [x] Add lightweight fallback UI if model load fails.
  - File: src/components/Contact/index.jsx

### F. Accessibility + UX Baseline
- [ ] Confirm keyboard focus visibility on all interactive elements.
  - Files: Header, Profile, Portfolio, Contact CSS
- [ ] Verify touch targets >= 44px for mobile controls.
  - Files: src/components/Portfolio/styles/Portfolio.css
- [ ] Confirm reduced-motion behavior disables non-essential animations.
  - Files: Profile, Portfolio, Contact, SectionTransition

### G. Verification and Release Safety
- [ ] Build must pass.
  - Command: npm run build
- [ ] Manual scenario test:
  - Profile -> Contact -> Projects -> Profile
  - Fast scroll and repeated up/down loops
  - Mobile viewport 390x844 and desktop 1440x900
- [ ] Add temporary runtime logging around risky sections for one release cycle.
  - Remove logs after stability confirmed.
- [ ] Keep rollback branch/tag before reintroducing any 3D effect.

## Success Criteria (Exit Phase 1)
- 0 visible "Something went wrong" fallback in normal browsing.
- No hard stutter that blocks user input while scrolling.
- Stable interaction quality on desktop and mobile baseline devices.

## Skills To Apply During Phase 1
- vercel-react-best-practices: for React performance and rerender rules.
- accessibility: for minimum UX/a11y quality gate.
- frontend-design: for visual consistency after stability fixes.
- threejs-animation: only for controlled reintroduction after Phase 1 passes.

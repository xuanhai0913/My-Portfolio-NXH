# Phase 3 UX + Accessibility Checklist

Goal: keep interactions readable, keyboard-friendly, and resilient under reduced-motion preferences.

## A. Keyboard and Focus
- [x] Visible focus states for global interactive controls.
- [x] Focus states for Header, Portfolio, and Contact controls.
- [x] Touch target minimum sizing applied to key controls.

## B. Motion Preferences
- [x] Reduced-motion handling added for Profile, Portfolio, Contact, and SectionTransition.
- [x] Reduced-motion bypass added for heavy scroll/video transition path.

## C. Interaction and Error States
- [x] Contact model has non-3D fallback state.
- [x] Projects card image fallback avoids empty frame.
- [x] Build-time lint warnings related to hook dependencies and redundant alt text resolved.

## D. Pending Manual QA
- [ ] Keyboard-only walkthrough from Header to Contact submit on desktop.
- [ ] Mobile interaction pass at 390x844 (touch + reduced-motion enabled).
- [ ] Contrast sweep for neon-on-dark text blocks in all sections.

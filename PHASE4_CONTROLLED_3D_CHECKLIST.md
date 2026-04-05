# Phase 4 Controlled 3D Pilot Checklist

Goal: reintroduce one 3D surface with adaptive quality and graceful degradation.

## Pilot Target
- [x] Contact section IceCream model selected as pilot surface.

## Quality Gating
- [x] Add adaptive quality tiers (low, medium, high) by viewport/capability.
- [x] Lower lighting and disable costly effects on low tier.
- [x] Tune dpr and antialias by quality tier.
- [x] Keep fallback static illustration path in Contact when capability gate disables interactive model.

## Runtime Safety
- [x] Pause rendering when model is offscreen.
- [x] Pause rendering when document tab is hidden.
- [x] Respect reduced-motion by forcing low quality tier.

## Validation
- [x] Production build passes after pilot changes.
- [ ] Manual performance pass on desktop + mobile confirms no severe stutter.
- [ ] Manual visual artifact pass confirms no flicker/blown highlights.

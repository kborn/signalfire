# Phase 11.7 Public UI Identity Revamp

## Purpose

Finalize the public-facing identity system for repository-public readiness
without changing Release 1 backend scope, moderation behavior, or route
architecture.

## Final Selected Direction (2026-05-30)

### Brand System

- Header home affordance uses a compact `FYF` mark (`aria-label` remains
  `Find Your Fight home`) with balanced supporting markers.
- Homepage remains the single primary large-format brand image surface.
- About page does not reuse the large hero image; About stays content-first.
- Global supporting motif remains subtle and non-primary.

### Image Usage Rules

- One primary image moment per page maximum.
- Homepage: large hero image allowed.
- About, collection, and detail routes: no large repeated hero image.
- Supporting motif must remain low-contrast and cannot compete with body copy.
- No floating particle overlay in the public shell.

### Navigation and Messaging

- Public navigation remains: `Issues`, `Articles`, `Actions`, `Events`,
  `About`, `Submit Content`.
- Homepage purpose-link messaging explicitly clarifies intent:
  - `Why This Site Exists`
  - `Who This Is For`
- About intro explicitly states audience and purpose for first-time visitors.

### Visual Readability and Interaction

- Public text contrast uses the adjusted muted-text scale for readability on the
  dark shell.
- Card hierarchy is reinforced via surface contrast and restrained elevation.
- Keyboard focus states are explicit on primary navigation and list-card
  surfaces.
- Interaction motion remains subtle and consistent with reduced-motion support.

## In-Scope for 11.7 Completion

- Public identity decisions and usage rules are codified.
- Homepage, About, and navigation presentation are aligned to those decisions.
- Public-route visual system is consistently applied in implementation.
- Responsive/readability checks are treated as completion criteria for this
  phase.

## Out of Scope

- Backend/domain model changes
- Moderation workflow changes
- Authentication/deployment hardening
- Admin feature expansion

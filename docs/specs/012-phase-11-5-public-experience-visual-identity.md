# Phase 11.5 - Public Experience And Visual Identity Spec

## Goal

Define the public identity and experience requirements for Phase 11.5 so the
existing public discovery application can be refreshed into a coherent,
portfolio-ready product without introducing new backend or community scope.

This document is the canonical product and UI contract for Phase 11.5.

It expands:

- `docs/agent-governance/progress.md`
- `docs/specs/information-architecture.md`
- `docs/specs/discovery-model.md`
- `docs/agent-governance/decisions.md`

It does not replace completed Phase 9 or Phase 10 specifications, which record
the requirements in force when those phases were implemented.

---

## 1. Identity Decision

### Public product name

Use:

> Find Your Fight

`SignalFire` remains the repository and internal project identity.
`CivicSignal` is superseded as the public-facing product name for newly
refreshed public surfaces.

### Domain posture

`findmyfight.com` is a candidate public domain because it reads naturally from
the visitor's perspective while the product speaks to them as `Find Your
Fight`.

Domain acquisition, hosting, and launch readiness are not Phase 11.5
implementation dependencies.

### Name presentation

- Render the product name as `Find Your Fight`.
- Treat it as the brand name, not merely as a campaign tagline.
- Do not pair it with an additional slogan in a way that competes with the
  product name.
- Supporting copy may explain the product promise in one concise sentence.

---

## 2. Product Philosophy

### Core premise

Public life can create a constant stream of urgent issues and calls to action.
When everything demands attention, visitors may become exhausted, overwhelmed,
or unable to participate at all.

`Find Your Fight` helps a visitor focus on an issue that matters to them, learn
what is at stake, and find a concrete way to act.

### Required framing

The public experience must communicate:

- a person does not need to respond to every issue in order to participate
  meaningfully
- choosing focus is a practical path to action, not indifference
- an individual action can contribute to broader civic effort through existing
  opportunities and events
- the platform helps visitors discover participation paths; it does not host
  social networking or platform-run organizing

### Editorial guardrail

The product may be motivated by political attention overload and rapid cycles
of crisis, but public evergreen copy should not depend on one administration,
election cycle, or partisan reference. Specific political content belongs in
Articles, Actions, and Events when appropriate.

---

## 3. Public Journey

Phase 11.5 should strengthen the existing public journey:

1. Find an issue through Topics.
2. Understand the issue through Articles.
3. Act through Actions or Events.

Visitors may still enter through any public content route. The homepage should
make Topic exploration the clearest starting point because it best expresses
the identity premise: choose where to focus.

### Required primary calls to action

Use the following public CTA concepts:

- `Explore Issues` -> `/topics`
- `Take Action` -> `/actions`
- `Find Events` -> `/events`
- `Why This Exists` -> `/about`

Exact component arrangement is an implementation/design decision, provided
these paths are clear and accessible.

---

## 4. Public Route Scope

### Existing routes to refresh

- `/`
- `/topics`
- `/topics/[slug]`
- `/articles`
- `/articles/[slug]`
- `/actions`
- `/actions/[slug]`
- `/events`
- `/events/[id]`
- current public submission routes
- public error and unavailable states for API/database-backed public content

### New route

- `/about`

The About page is an identity and explanatory content page. It does not
require new API endpoints, persistence, authentication, or administration.

### Navigation

The public navigation must expose the existing discovery and submission
routes, plus a clear path to About. The final ordering may be determined in
implementation once space and responsive behavior are evaluated.

---

## 5. Homepage Content Requirements

### Purpose

The homepage should immediately explain what the product helps a visitor do
and route them into the existing discovery model.

### Hero content

Required brand heading:

> Find Your Fight

Approved positioning direction:

> The world demands your attention from every direction. Focus on the issue
> that matters most to you, and find a way to act.

Minor editorial refinements are allowed during implementation if they preserve
the same meaning and tone.

### Homepage hierarchy

The homepage must:

1. present the brand and core promise
2. emphasize issue exploration as the first discovery step
3. provide direct pathways to Actions and Events
4. link to About for visitors who want the philosophy behind the product

The homepage may surface representative content only if it uses existing API
contracts and credible demo content. Do not introduce personalization, feeds,
recommendation logic, or new discovery APIs in this phase.

---

## 6. About Page Content Requirements

### Route

`/about`

### Purpose

Explain why the product exists and make the identity feel intentional rather
than promotional.

### Required page heading

> You cannot fight everything.

### Required ideas

The About page must express these ideas in clear public copy:

- constant headlines, crises, and calls to action can leave people overwhelmed
  or unable to act
- `Find Your Fight` exists to help people focus on an issue, understand it, and
  discover a practical way to participate
- choosing one fight is not looking away; it is choosing where effort can
  become real
- people may protect their ability to act by setting other issues down for now
- meaningful participation may begin with learning, taking an action, or
  showing up at an event

### Approved foundational copy direction

The final page may refine wording, but should be based on this message:

> Every day brings another headline, another crisis, another urgent demand for
> attention. Trying to carry all of it can leave us exhausted and unable to
> act.
>
> Find Your Fight exists to help you focus on the issue that matters most to
> you, understand what is happening, and find a concrete way to participate.
>
> Choosing one fight is not looking away. It is choosing where your effort can
> become real.

### Page actions

The page should conclude with clear links into:

- Topics
- Actions
- Events

---

## 7. Visual Direction Requirements

### Chosen direction: Field Guide

The public product should feel like a civic field guide: an inviting, focused
place to orient attention and choose meaningful participation. The design
should combine editorial confidence with practical action cues.

### Intended feel

The refreshed public product should feel:

- purposeful
- human
- grounded
- urgent without being frantic
- credible enough for civic information
- expressive enough for a portfolio-facing product identity

### Avoid

Do not make the product feel:

- like a social network
- like an outrage feed
- militaristic or violent
- like an institutional government portal
- dependent on decorative treatment that obscures readable content

### Typography

Use a two-family public typography direction:

- display and editorial headings: `Instrument Serif`
- navigation, body, metadata, buttons, labels, and forms: `Inter`

Implementation may load these as locally optimized web fonts through the
existing Next.js application font mechanism. If a technical constraint blocks
one of these fonts, replace it only with a close serif/sans pairing that
preserves the hierarchy and document the adjustment.

Required usage:

- product wordmark, hero heading, page H1, and major section H2 use the display
  face
- body copy, navigation, UI controls, event metadata, and form content use the
  sans face
- the admin surface remains operational and may continue using its existing
  restrained sans-first treatment; do not extend decorative public typography
  into admin unless required by shared-shell behavior

### Color palette

Use semantic public color tokens as the implementation baseline. Token names
should describe the role the color plays, not the current palette name, so the
visual direction can be revised later by changing values in one place.

| Token                   | Initial value | Use                                                     |
| ----------------------- | ------------- | ------------------------------------------------------- |
| `--color-page-bg`       | `#F6F1E8`     | Public page background                                  |
| `--color-text-primary`  | `#181713`     | Primary text and high-emphasis controls                 |
| `--color-brand-primary` | `#233A32`     | Primary brand surface and primary CTA                   |
| `--color-brand-accent`  | `#C45132`     | Small emphasis, selected/active accent, and action cues |
| `--color-surface-soft`  | `#E9DFD0`     | Supporting panels and quiet highlighted content         |
| `--color-border-subtle` | `#CFC1AF`     | Dividers and default borders                            |
| `--color-text-muted`    | `#5D584F`     | Secondary text and metadata                             |
| `--color-status-error`  | `#A8382B`     | Validation/error text and borders                       |

Color rules:

- default public pages use `--color-page-bg` and `--color-text-primary`
- use `--color-brand-primary` for high-confidence primary actions and
  header/brand accents
- reserve `--color-brand-accent` for purposeful emphasis; do not flood pages
  with accent blocks
- keep body copy high contrast and do not place muted text on soft surfaces
  unless it remains accessible
- forms, focus states, and error states must remain legible and not depend on
  color alone

### Surface and imagery direction

The visual identity should be achieved primarily with typography, color,
spacing, borders, and content hierarchy. Imagery is optional in the initial
implementation.

If imagery is included:

- use documentary-style civic participation imagery tied to credible demo
  content
- prefer a single purposeful image or tightly scoped editorial image treatment
  over a collage
- do not use stock imagery of generic crowds or confrontation as the homepage
  identity
- all images require meaningful alt text unless decorative

Do not block the initial Phase 11.5 public refresh on obtaining imagery.

---

## 8. Content And Launch Boundary

Phase 11.5 should prepare credible seed or demo content for portfolio
presentation, but it does not establish a production content-acquisition or
editorial-maintenance program.

Before public deployment, later work must determine:

- how trustworthy Articles, Actions, and Events are sourced
- how time-sensitive content remains current
- what moderation/editorial operations are sustainable
- whether deployment of any admin route has required authentication and
  authorization protection

The public visual refresh may proceed before those launch decisions are
resolved.

---

## 9. Out Of Scope

Phase 11.5 does not include:

- production deployment
- domain configuration or email setup
- content ingestion systems
- personalization or recommendation engines
- social features or user coordination tools
- new filtering, search, or map behavior
- backend contract expansion solely to support presentation
- backend database retry, caching, queueing, or observability infrastructure
- authentication implementation for admin routes

---

## 10. Shared Public Shell

### Application metadata

Update browser-visible public metadata to use:

- default title: `Find Your Fight`
- default description: `Focus on the issue that matters most to you, and find a way to act.`

Public route-specific titles may add route context, such as `Topics | Find
Your Fight`, if route metadata is implemented during this phase.

### Header composition

Replace the plain link-only public header with:

1. product wordmark linking to `/`
2. public discovery navigation
3. visually distinct submission CTA

Wordmark:

- label: `Find Your Fight`
- use display typography
- keep it text-based in Phase 11.5; no logo illustration is required

Primary public nav items:

- `Issues` -> `/topics`
- `Articles` -> `/articles`
- `Actions` -> `/actions`
- `Events` -> `/events`
- `About` -> `/about`

Use `Issues` as the visible nav label for `/topics` because it describes the
visitor's first task under the new identity. Page routes and data model remain
`Topics`.

Submission action:

- label: `Submit a Resource`
- destination: `/submit`
- treat as a restrained outlined or soft-surface action, not the primary hero
  CTA

### Header behavior

- Desktop: wordmark sits left; navigation and submission action sit right.
- Small screens: allow the wordmark and nav/action row to wrap cleanly without
  introducing a menu interaction in this phase.
- Active navigation state should use typography plus the brand accent, such as
  an underline or bottom border.
- All navigation and CTA focus styles must be clearly visible.

### Public container and rhythm

The public shell may widen slightly from the Phase 9 baseline to allow a more
intentional hero composition while keeping prose readable:

- outer public container: `max-width: 1120px`
- standard inline padding: `24px` desktop/tablet, `20px` small mobile
- long-form reading column: maximum `68ch`
- section spacing: `72px` desktop and `48px` small mobile

Admin page layout is not required to adopt the expanded public container.

---

## 11. Public Component System

### Buttons and links

Primary CTA:

- brand-primary background with page-background text
- rounded but not oversized
- used for the most important next step on a page

Secondary CTA:

- transparent or page-background surface
- brand-primary border and primary/brand-primary text
- used for adjacent discovery pathways

Text action link:

- primary or brand-primary text
- visible underline behavior on hover/focus
- optional brand-accent arrow/accent only if it remains subtle

Required states:

- default
- hover
- focus-visible
- disabled where buttons already support it

### Section labels

Use short uppercase sans-serif eyebrow labels sparingly to establish journey
orientation. They may use muted or brand-accent text, but should not overpower
headings.

Approved examples:

- `Choose An Issue`
- `Understand It`
- `Take Action`
- `Show Up`
- `Why This Exists`

### Preview surfaces

Replace the current visually undifferentiated list treatment with restrained
editorial preview surfaces:

- Topic previews may carry slightly stronger visual presence because issue
  selection is the primary journey entry.
- Article, Action, and Event collections should remain scannable lists or
  simple panels rather than image-heavy cards.
- Use soft surfaces or subtle borders selectively to separate content.
- Keep titles, summaries, and critical metadata visible without hover.

Preview content requirements:

| Content type | Visible content                                                        |
| ------------ | ---------------------------------------------------------------------- |
| Topic        | name, short description, invitation to explore                         |
| Article      | title, summary, published/author metadata when currently available     |
| Action       | title, summary, type and publication metadata when currently available |
| Event        | title, event type, summary, date/time, location                        |

Do not require API additions solely to fill a desired preview field.

### Detail pages

All public detail pages should share:

1. eyebrow or type context where useful
2. prominent display heading
3. readable summary/metadata area
4. primary content or participation information
5. related discovery/action section

Topic details should emphasize paths into related learning and action, with the
existing Events passthrough CTA elevated as a visible participation option.

Article details should remain optimized for reading and conclude with clear
related-topic and action paths.

Action details should make the participation instruction or destination the
strongest element after the heading.

Event details should foreground time and place in a clearly separated
information block before related content.

### Submission pages

Public submission pages belong to the refreshed public identity, but should
feel calm and trustworthy rather than promotional:

- use the new wordmark, typography, palette, and shared public shell
- retain existing validation and form behavior
- use soft-surface or page-background panels to organize long forms where useful
- keep controls high contrast and easy to scan
- do not change submission contracts or moderation meaning in this visual phase

---

## 12. Homepage Layout Contract

### Purpose

Make the name legible as a product promise and direct visitors from attention
overload into one clear first step.

### Required section order

1. header
2. hero
3. issue-first journey section
4. participation pathways section
5. philosophy/About prompt

### Hero

The hero should contain:

- wordmark context is supplied by the header; do not repeat a small logo lockup
- H1: `Find Your Fight`
- supporting paragraph based on the approved positioning direction
- primary CTA: `Explore Issues`
- secondary CTA: `Why This Exists`

Use a strong text-led composition. A quiet brand-primary or soft-surface
graphic panel may balance the hero, but hero imagery is not required.

### Issue-first journey section

Required purpose: make choosing a Topic feel like the starting act, not merely
a browse category.

Suggested locked heading:

> Start with what matters to you.

Supporting direction:

> Explore an issue, understand what is at stake, and choose how to participate.

This section may display a short selection of existing Topic summaries only if
the existing public Topic contract supports the implementation cleanly. A
direct `Explore Issues` path is sufficient if data integration would introduce
unnecessary work.

### Participation pathways section

Show two clear destinations:

- `Take Action` -> `/actions`
- `Find Events` -> `/events`

The section should reinforce that learning leads to concrete participation; it
must not imply that the platform measures aggregate impact.

### Philosophy prompt

Use a compact highlighted section that links to About.

Approved heading:

> You cannot fight everything.

Approved support direction:

> Choosing one fight is not looking away. It is choosing where your effort can
> become real.

CTA:

- `Why This Exists` -> `/about`

---

## 13. About Page Layout Contract

### Required section order

1. page introduction
2. overwhelm-to-focus explanation
3. product journey explanation
4. closing action panel

### Introduction

- eyebrow: `Why This Exists`
- H1: `You cannot fight everything.`
- opening copy should use the approved foundational direction in Section 6

### Explanation content

Use a readable prose column, with enough visual hierarchy to distinguish these
points:

1. attention overload can create paralysis
2. focus makes meaningful action possible
3. the platform supports learning and participation, not endless consumption

The copy may be candid about exhaustion and the need to set some issues down
for now. It should not instruct visitors which issue to choose or make claims
about outcomes the product cannot demonstrate.

### Product journey block

Explain the product in three concise steps:

1. `Find an issue.` Browse topics that matter to you.
2. `Understand it.` Read context and reporting that clarify what is at stake.
3. `Act on it.` Find an action or event where you can participate.

### Closing actions

End the page with:

- primary CTA: `Explore Issues` -> `/topics`
- secondary links: `Take Action` -> `/actions`, `Find Events` -> `/events`

---

## 14. Collection And Detail Route Copy Direction

### Page-label update

Preserve the route/model name `Topics` where required technically, but visible
public page copy may call them `Issues` when referring to the visitor's
discovery experience.

Recommended index page headings:

| Route       | Heading                        | Intro direction                                                      |
| ----------- | ------------------------------ | -------------------------------------------------------------------- |
| `/topics`   | `Find an issue.`               | Explore the issues that matter to you and find ways to learn or act. |
| `/articles` | `Understand what is at stake.` | Read context and reporting that can help you choose where to focus.  |
| `/actions`  | `Take action.`                 | Find practical ways to contribute your time, voice, or support.      |
| `/events`   | `Show up.`                     | Find upcoming opportunities to participate in person.                |
| `/submit`   | `Share a resource.`            | Submit an article or event for review.                               |

These headings may replace Phase 9 copy when Phase 11.5 public surfaces are
implemented.

### Empty states

Empty states should stay direct and useful:

- avoid marketing copy where content is unavailable
- preserve the visitor's next available route when appropriate
- do not promise future content publication timing

### Related section labels

Continue the existing approved relationship labels where they remain accurate:

- `Related Topics` may become `Related Issues` in refreshed public presentation
- `Learn More`
- `Take Action`
- `Find Events` where a Topic routes into Events discovery

Use one consistent choice across all refreshed public pages.

---

## 15. Responsive And Accessibility Requirements

### Responsive validation viewports

Validate the refreshed public surfaces at representative widths:

- mobile: `375px`
- tablet: `768px`
- desktop: `1280px`

At minimum verify:

- homepage
- About page
- one Topic detail
- one Article detail
- one Action detail
- Events collection and one Event detail
- public submission landing page and one form path

### Responsive behavior

- no clipped display headings or wordmark wrapping that obscures meaning
- CTA groups stack cleanly on narrow screens
- public navigation may wrap but must remain readable and keyboard reachable
- content previews remain readable without dense multi-column layout on mobile
- long-form content preserves comfortable line length at desktop sizes

### Accessibility requirements

- maintain semantic heading order
- meet WCAG AA contrast for public text, interactive controls, focus rings, and
  validation states
- keep visible focus treatment on every link, button, and form control
- do not communicate active navigation, errors, or status through color alone
- honor reduced-motion preferences if any new transitions are introduced
- test key routes with keyboard navigation after implementation

---

## 16. Public Error And Unavailable States

### Purpose

The public web app should handle API/database-backed content failures with a
clear user-facing message instead of exposing implementation details or leaving
visitors with a raw framework error.

This requirement covers presentation and recovery behavior in the web app. It
does not add backend infrastructure work.

### Failure cases to cover

At minimum, public routes should handle:

- API server unavailable
- API request failure caused by the API's database being unavailable
- unexpected non-404 API errors while loading public collections or detail
  pages
- missing public API base URL in local development

The exact technical cause does not need to be diagnosed for visitors. The UI
should communicate that the content cannot be loaded right now.

### Public error copy

Use a stable, non-technical message:

- heading: `We could not load this page.`
- body: `The content for this page is temporarily unavailable. Try again in a moment.`
- primary action: `Try again`
- secondary action when useful: `Go home`

Do not render raw exception messages, API endpoint names, stack traces, Prisma
errors, or database terminology in public error UI.

### Route behavior

- 404/not-found behavior remains distinct from unavailable-state behavior.
- Detail routes should continue using not-found pages for unpublished or
  missing records.
- Non-404 API errors should be surfaced through public error handling.
- The public error state should use the `Find Your Fight` visual system and
  remain readable on mobile.

### Admin boundary

Admin routes may keep more operational error language where useful for local
development, but they should not receive the public marketing treatment unless
shared route layout changes require it.

### Testing

Add focused frontend coverage proving:

- public error UI does not expose raw error messages
- the retry action is present where the route error boundary supports reset
- non-404 API failures on at least one representative public route reach the
  public unavailable-state path
- 404 behavior remains separate from unavailable-state behavior

---

## 17. Implementation Boundary And Validation

### Likely frontend touchpoints

Implementation should remain primarily within the existing public web surface,
including:

- shared public layout and metadata
- public navigation
- global/shared public styling
- homepage
- new About route
- existing summary components
- public collection and detail routes
- public submission presentation
- public error boundary or route-group error UI

Do not change admin experience except where shared application-shell decisions
otherwise produce an unintended regression.

### Required validation after implementation

- frontend lint and typecheck
- existing relevant frontend tests updated for changed public copy/navigation
- focused new tests for the About route and refreshed navigation/brand behavior
- responsive manual review at the representative viewports in Section 15
- keyboard/focus review for header, hero CTAs, About-page links, and submission
  form controls

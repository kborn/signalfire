# Phase 13 Milestone 1 Polish Review

## Purpose

Record the external Milestone 1 polish review as canonical Phase 13 input so
remaining public-quality, admin-quality, and source-quality gaps can be tracked
inside the active release-prep phase.

This document is canonical review input for Phase 13 follow-up work.

`docs/milestone-1-polish.md` is the working liaison artifact for external-review
input. Keep this canonical document aligned with it, except where later
project discussions explicitly override or narrow a finding.

## Source And Scope

This review was produced after the current Milestone 1 implementation was
already substantially complete. Its value is not in reshaping scope, but in
identifying the highest-signal gaps that still separate the project from a
portfolio-ready release-quality finish.

The findings cluster into five buckets:

1. public copy and intent gaps that break the fiction of the site
2. admin/public bugs that read as unfinished work
3. public/admin visual polish and UX completeness gaps
4. demo-seed quality issues that make the product read as generated rather than
   editorially intentional
5. code-quality issues that a technical reviewer would notice in source review

## Findings

### P0 Copy And Intent

1. Homepage contribute section still reads like product-meta language instead of
   real public-site copy.
2. Public nav label `Actions` is less immediately legible to first-time
   visitors than a clearer action-oriented label.
3. About page repeats the phrase `useful, practical, and clear` in the same
   section.
4. About page Step 3 does not follow the same link behavior as Steps 1 and 2.
5. The strongest statement of site purpose currently lives on `/about` rather
   than helping carry the homepage.
6. Topic detail pages lose the guided-journey framing after the homepage.

### P0 Bugs

7. Admin submission review exposes raw ISO datetime strings for event start/end
   values.
8. `shouldUseSecureCookie()` is hardcoded to `false`, so admin cookies never
   receive the `Secure` flag.

### P1 Public/Admin UI And UX

9. Article detail reading experience still needs stronger body typography and
   better article-body hierarchy.
10. Events filter date inputs need explicit visual treatment so native browser
    styling does not break the public UI system.
11. Topic detail article lists need enough weight and metadata to avoid reading
    as inert directory rows.
12. Admin shell/background treatment still needs to feel intentional rather than
    like white cards dropped onto the public dark shell.
13. Submit entry page leaves too much dead space below the entry cards.
14. Background motif treatment is inconsistent between pages.

### P2 UX Completeness

15. Filtered list empty states need to stay explicit and intentional across
    public discovery surfaces.
16. Public mobile responsiveness needs an explicit audit pass across homepage,
    events filters, cards, and submission forms.
17. Submission success states need a clear next action.
18. The background motif needs a firmer rule, with the current preferred
    direction being scoped use on homepage, submit entry, and About rather than
    a site-wide treatment.
19. Homepage motif placement still needs refinement so it does not compete with
    the hero art block.
20. Public list pages could use a little more warmth and definition, including
    eyebrow color and subtle card-accent treatment.
21. Sticky-header scroll bleed still needs a final pass where hover and card
    transitions are visibly leaking through pinned layers.
22. Homepage hero CTA row alignment and above-the-fold civic framing still need
    refinement.

### P1 Demo Seed Quality

23. Generated demo content still exposes numbered filler patterns such as
    `Climate Briefing 17` and summaries ending in appended index values, which
    makes list/detail surfaces read as seeded scaffolding rather than finished
    editorial content.
24. The current demo pagination targets are larger than necessary for
    portfolio/demo purposes and force too much generated filler to exist.

### P3 Code Quality And Source Review

25. `getTopicIds` is duplicated across multiple API services.
26. `titleToSlug` is duplicated across multiple API services.
27. `buildTopicCreates` is duplicated across multiple repositories.
28. `reviewSubmission` uses a runtime fallback instead of a compile-time
    exhaustive discriminated-union check.
29. `sendJsonRequest` bypasses `buildUrl`.
30. Loose equality remains in public submission form logic.
31. `key={topic.name}` should use the stable topic identifier.
32. `mapCommonSubmissionParts` should be private.
33. Resource links need real URL validation on both client and server.
34. `parseJsonResponse` needs to tolerate empty response bodies.

## Phase 13 Task Mapping

### Reopened 13.3 Public Polish

These findings belong in 13.3 because they are directly visible in the public
or admin demo experience:

- homepage/public copy and public navigation clarity
- about-page and topic-detail journey consistency
- article reading experience and topic-detail summary/list polish
- event filter input presentation
- admin datetime presentation bug
- admin shell/background polish
- submit-entry spacing and motif consistency
- filtered empty-state completeness
- public mobile responsiveness audit
- submission success-state next action
- list-page warmth and final hover/sticky interaction polish
- homepage hero copy/layout refinement
- final motif placement/scoping choices
- demo-seed content quality where generated filler is visibly weakening public
  pages

### 13.4 Repo And Launch Readiness Follow-Up

These findings belong in 13.4 because they are primarily security, code-health,
or source-review quality tasks:

- secure admin cookie behavior
- shared utility extraction for repeated topic/slug helpers
- exhaustive discriminated-union handling
- request URL construction consistency
- strict equality cleanup
- stable key usage cleanup
- access-modifier cleanup
- URL validation for resource links
- empty-body API response parsing hardening

## Current Interpretation

As of the latest internal Phase 13 pass:

- the original copy/IA/admin-datetime/submission-success findings are resolved
- motif treatment was intentionally narrowed away from a site-wide background,
  but the external review still wants a more explicit final rule and placement
  pass
- the biggest newly material gap is demo-seed quality, where numbered generated
  content is still visible and undercuts the product fiction
- remaining open public work is now mostly a final visual/mobile pass rather
  than broad structural redesign

## Implementation Guidance

- Use this review as a prioritization aid, not as authority to expand scope
  beyond Milestone 1.
- When a finding has already been addressed elsewhere, close the corresponding
  Phase 13 task rather than carrying duplicate work.
- Keep `docs/agent-governance/progress.md` as the canonical owner of current
  task status.

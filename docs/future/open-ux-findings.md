# Open UX Findings — Post Phase 14

## Purpose

Distillation of unresolved product and UX findings that survived the full Phase 14
agent-review cycle. These are the items worth handing to a professional UX reviewer
or acting on in a future polish pass. They are not implementation specs — they are
honest observations about what is still weak.

---

## What was improved in Phase 14

For context, these were the meaningful moves:

- **Demo banner** relocated from top of page to floating pill at bottom — hero now
  lands clean
- **Homepage issue roll** replaced with compact card grid — matches `/issues` visual
  language
- **Journey strip** added to all six journey pages — "Choose → Read → Act" framing
  is now navigable on interior pages, not just a homepage ornament
- **Root 404 page** given the full public shell — unstyled error page is gone
- **Action detail CTA** promoted above metadata — "Take Action on [domain]" is the
  first thing you see after the headline
- Visual identity, typography, copy, admin theme, and motif placement were all
  stabilized across Phase 13–14

---

## What is still genuinely weak

### Events surface

This is the one surface that did not meaningfully improve across the entire review
cycle. Specific problems:

- **Cards are visually identical.** RALLY and WORKSHOP events look the same. No
  type-color treatment, no visual anchor beyond text chips.
- **Filter is collapsed by default.** The most useful control for a civic events
  platform requires a click to reveal. A location-unaware default in a real app
  would show geographically irrelevant results. The Milestone 1 compromise
  (show everything, demo note in header) is honest but not good.
- **No location awareness.** A user in Seattle sees the same events as a user in
  Philadelphia. This is documented as a Milestone 1 intentional deferral — but it
  is the kind of thing a real user notices immediately.

Events is the one section that reads as visually and functionally unfinished. It is
not the right first target for agent-driven fixes. It needs a design decision about
what a good civic events browsing experience looks like before implementation.

### Article and action cards at the collection level

Article list and action list cards are visually identical. The only signal is the
action type label ("Volunteer", "Guide") vs. the publication date on articles. In
the context of a single list page this is not a real problem — the page title and
journey strip establish what you're looking at. It matters more in the `/search`
results where both types appear together.

### Journey strip copy inconsistency

The strip says "Choose an issue / Read what matters / Take action." The homepage
journey cards say "Choose one issue / Read what matters / Do one concrete thing."
Minor, accepted, not worth fixing before professional review.

---

## On the agent-review cycle

The Phase 14 review cycle ran across 8+ sessions with multiple fresh agent reviews.
Scores ranged from 7/10 (fresh session, cold) to 8/10 (session with context,
after improvements). The honest assessment is that the spread reflects the
inconsistency of the method as much as actual product quality changes.

What agent reviews are good for: identifying structural problems, dead code,
missing navigational elements, copy that reads as boilerplate. What they are
not good for: design judgment, visual weight, whether something "feels right,"
or assessing a product holistically from screenshots.

The right next step before launch is a review by a human who works in UI/UX
professionally. That review will surface different things than the agent cycle
did, and the findings will be more reliable. Until that happens, further
agent-driven visual review passes are not a productive use of time.

---

## Recommended pre-launch review surface

If handing this to a professional reviewer, the key questions to ask:

1. Does the homepage make the product's purpose and the three-step journey clear
   on first scroll?
2. Does the issue → article → action path feel guided or does it require the user
   to discover it?
3. Does the events surface feel like a first-class feature or an afterthought?
4. Is the visual identity (dark navy, amber, Playfair Display, fist motif)
   coherent and appropriate for a civic action product?
5. Are there any surfaces that would cause a first-time user to bounce before
   taking action?

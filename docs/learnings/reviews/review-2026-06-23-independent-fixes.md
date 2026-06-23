# Fix Plan — 2026-06-23 Independent Review

---

## FIX-01 — Demo banner: move to fixed footer strip

**Problem:** Full-width amber banner sits above the hero heading. Every page opens with "this is a test site" before the product has said anything.

**Change:** Replace the top-of-page banner with a fixed-bottom strip. Same content (demo note + Admin link + Dismiss). ~36px tall. Sits at the bottom of the viewport and stays there as you scroll. Never in the reading path.

---

## FIX-02 — Event cards: add a prominent date chip

**Problem:** Event cards are visually identical — title, summary, location in the same text hierarchy. No visual anchor makes the list scannable.

**Change:** Add a date chip to each event card (e.g., "JUN 28" or "SAT · JUL 13") styled in amber or white, positioned prominently (upper-left or inline before the title). No new color system — just makes the time-sensitive nature of events immediately visible.

---

## FIX-03 — Issue detail: give Act section more visual weight than Read

**Problem:** Articles and Actions sections are equal weight on the issue detail page. A user skimming doesn't know which one is the destination.

**Change:** Promote the Act section visually — either move it above the Read section, or give it a distinguishing container (amber left border, subtle background, stronger section heading). Read is how you get there; Act is why you came. The page should reflect that.

---

## FIX-04 — Article detail "Now act": make the CTA topic-specific

**Problem:** The "Now act" forward signal exists but links generically. A generic "browse actions" link is easy to skip.

**Change:** When an article has a topic, the CTA link should read "Take action on [Topic] →" and link to `/actions?topicSlug=[slug]`. Falls back to `/actions` if no topic. Small copy change, meaningful specificity.

---

## FIX-05 — Issues list: add a directive line

**Problem:** `/issues` as a direct-arrival page gives no framing. It's just a grid of colored cards.

**Change:** Add a single directive line to the page intro: _"Pick the one that already has your attention."_ No explanation of the journey, no step framing — just tells you how to use the page.

---

## Not fixing

- **Event type colors** — correctly removed; issue color system already owns the color vocabulary.
- **Issue roll on homepage** — locked treatment, user preference.
- **Step numbers on interior pages** — correctly removed; step framing only makes sense as a homepage orientation device.
- **`/topics/[slug]`** — already doesn't exist. Review false alarm.

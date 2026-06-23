# Site Review — Find Your Fight

**Review date:** 2026-06-19
**Reviewed by:** Claude (autonomous, no mercy)
**Prior review:** REVIEW_TEMPLATE.md

---

## Score Tracker

| Dimension     | This Review | Prior Review | Target  |
| ------------- | ----------- | ------------ | ------- |
| Visual Design | 5.5         | —            | 8.0     |
| UX / Product  | 5.0         | —            | 8.5     |
| Engineering   | 7.5         | —            | 9.0     |
| **Overall**   | **5.5**     | —            | **8.5** |

---

## Visual Design — 5.5/10

The bones are there — dark navy, Playfair Display, amber accents — but the execution is
undernourished. It looks like a theme was chosen and then built exactly once, with no second
pass. Nothing is wrong enough to scrap, but nothing earns the confidence this brand voice
requires.

### Issues

**The hero is typographically naked.**
"Find Your Fight" in giant Playfair Display with nothing behind it is not bold — it's bare. No
image, no texture, no visual weight that matches the rhetorical weight of the phrase. The
bg-motif at 0.20 opacity is not doing the work an activist-facing hero needs. A first-time
visitor has no idea what they're looking at for the first 3 seconds. Typography without image
is a landing page sin for an emotional product.

**The issue list on the homepage is lazy.**
A plain left-aligned stack of topic names with a left border is the CSS equivalent of giving up.
This is the core navigation for the entire product — the choice that determines whether a user
engages or bounces — and it looks like an unstyled `<ul>` with a mild makeover. Screenshot 01
shows Democracy, Consumer Activism, Climate, Civil Rights in plain text. These aren't list
items. They're invitations. They don't feel like invitations.

**The Issues index (screenshot 02) is muddy and inconsistent.**
The card grid uses tiny icon thumbnails with no visual weight. The icon/color assignments are
barely distinguishable at a glance. The cards have visible borders but the text density makes
them feel like data tables, not entry points. The copy inside each card ("Issues related to
democratic institutions, voting rights...") is exactly what you'd put in a database schema
comment, not on a civic platform meant to motivate action.

**The color palette is one-note.**
Every page is #101820 with amber accents and off-white text. That's it. There's no visual
hierarchy between sections — hero, issues, journey steps, contribute all live at the same
"darkness level." The amber never graduates to a second usage; it just punches the same note
(labels, selected state, CTA buttons) on every surface. Compare this to any serious civic tech
product (VoteSmart, Ballotpedia, even DoSomething) — they use color to communicate structure.
This palette communicates: "I chose dark mode."

**The admin UI is a different product.**
Screenshot 05 looks like a generic Django admin panel shipped in 2018. The design language is
completely disconnected from the public-facing site. Light background, dense tabular layout,
gray badges. If a portfolio reviewer clicks "Admin Demo" — and they will — the jarring switch
damages overall credibility significantly. The public site asks for emotional buy-in; the admin
page demands clipboard-and-spreadsheet energy.

**"FYF" in the navbar is not a brand.**
Three letters with bullet points on either side (· FYF ·) is a placeholder, not a logotype.
It communicates nothing about what the platform does and looks like a font test. The
product's name is "Find Your Fight" — that phrase has force. What's in the nav has none.

**The Events page (screenshot 03) is the best-looking page and still has problems.**
The filter form is clean and the event cards are readable, but the issue pill filter is
misaligned with the site's typography — pill components use a different visual register than
the headline-driven rest of the site. Also: the "RALLY" and "WORKSHOP" type labels are
uppercase salmon/orange on a dark card, which is the one color in the UI that doesn't appear
anywhere else. Where did that come from?

---

## UX / Product — 5.0/10

The core Learn → Decide → Act journey is stated on the homepage but not delivered. A user who
arrives and browses will find the information architecture fragmented. The site promises
specificity ("find your fight") but delivers a generic civic content directory.

### Issues

**The homepage does not convert.**
The hero says "Find Your Fight." The CTA says "Browse Issues." That's a significant
deflation of the emotional promise. "Browse" is what you do on Amazon. You don't browse your
fight — you find it. The copy is strong but the CTA doesn't follow through. Where's the friction
reduction? Where's the path that says "answer two questions and we'll show you where to start"?
Even a simple question like "What issue keeps you up at night?" with answer tiles would
outperform "Browse Issues."

**Three sections on the homepage all say the same thing.**
Hero: pick an issue. Issues roll: which one is yours? Journey steps: step 1 is pick an issue.
This is the same instruction delivered three times. The homepage doesn't build momentum —
it restates itself. By the time a user sees the contribute section at the bottom, they haven't
been moved through any arc. They've been reminded three times to pick an issue.

**The issue detail page is the product's most important page and it isn't shown in any screenshot.**
What happens when you click "Democracy"? That's the critical moment. The screenshots avoid it
entirely. If the issue detail page doesn't deliver articles, actions, and events in a coherent
sequence, the entire "Learn → Decide → Act" promise collapses here — and there's no evidence
it doesn't.

**"Take Action →" (screenshot 04) leads nowhere visible.**
The action detail page for "Join The Statewide Day Of Action Turnout Team" has a "Take Action →"
button prominently placed. But what's the label on it? That's it. No destination hint, no
organization name, no context. The user is being asked to click an amber button to an unknown
destination. For a civic action product, this is the pivotal CTA — it needs more trust scaffolding.
Where does it go? What will I find? Who runs it?

**The action detail page buries the action.**
Look at screenshot 04: a massive Playfair Display headline, then subtitle, then ACTION TYPE,
PUBLISHED, UPDATED metadata, then finally "Take Action →", then a paragraph of description,
then Related Topics (which are three paragraphs of topic descriptions). The most important
element — the CTA — is sandwiched between metadata and body copy. The Related Topics section
at the bottom is literally database descriptions of topic areas. This is not useful to a user
who just read an action title and wants to take it.

**The Events page shows events by default from a city the user didn't choose.**
Philadelphia appears on load without the user specifying any location. This is the "random
city" problem documented in CONTEXT-next-session.md and it's worse than the doc suggests.
A user in Seattle landing on a page showing Philadelphia events for the next 3 months will
immediately close the tab. This is not a medium-priority item. It's a confidence-destroying
default.

**The nav has 6 items plus a CTA.**
Issues, Articles, Actions, Events, About, Admin Demo, Submit. That's 7 choices at the top of
every page. For a product that advertises simplicity and a clear starting point, the nav
contradicts the homepage copy. "You don't have to carry every issue" — but you do have to
navigate seven nav items to get anywhere. The priority is unclear: why is "About" before
"Submit"? Why is Admin Demo in the public nav at all, even for demos?

**The submit flow is completely untested by the screenshots.**
The site allows community submissions of articles and events. There's an entire moderation
workflow (screenshot 05). But there's no social proof that submissions lead to anything, no
feedback on what happens after submit, and no indication of turnaround time. The submit
section on the homepage reads "Submissions are reviewed before publication so the experience
stays clear and worth returning to" — this is defensive copy justifying moderation, not
inviting copy for contributors.

**The search page exists but is invisible.**
A magnifying glass icon in the nav bar, no label. The search feature could be the fastest
path to relevance for a returning user, but it's underweighted compared to browsing. There's
no search-first entry point on the homepage.

---

## Engineering — 7.5/10

The engineering is the strongest dimension of this project. The Next.js App Router usage is
correct, the API/web monorepo split is sensible, server components are used where they should
be, and the CSS module split (10 files) is evidence of deliberate organization. But there are
credibility gaps that matter for a portfolio piece.

### Issues

**The `/topics` routes still exist alongside `/issues` routes.**
There are page files at both `(public)/issues/` and `(public)/topics/`. The governance doc
says `/issues` is the canonical public URL, but dead routes in the file tree either redirect
correctly (which can't be assumed) or expose a duplicate-content or 404 risk. A reviewer who
poking around the source will notice this.

**The demo mode implementation is load-bearing and visible.**
"Admin Demo" in bright amber in the public nav is a demo-site marker that doubles as a brand
element. The demo banner is dismissible but reappears on reload. The demo system is tightly
coupled to the public UI in ways that will require surgery to remove for a real deployment.
This is acceptable for a portfolio piece but it's fragile — DEMO_MODE env behavior is
user-visible and any misconfiguration in a live demo makes the site look broken.

**The admin workspace has no design system.**
The public site has Playfair Display, amber CTAs, dark navy, motif watermarks, and CSS
modules. The admin workspace has none of this — it appears to use plain Tailwind or
unbranded defaults. Two completely separate design systems in one repo is not a good look
in a portfolio context because it signals either a rushed admin or a disconnected team.

**The ISR revalidate window is 60 seconds everywhere.**
Every public page uses `export const revalidate = 60`. This is fine for a demo but it means
stale content lives for up to a minute after any admin change. For a civic action platform
where urgency matters (rally today, action deadline this week), this is a notable product
limitation. It also means that the on-demand revalidation story is unimplemented — there's
no `revalidatePath()` call after admin mutations.

**The action detail page renders Related Topics as raw database descriptions.**
Screenshot 04 shows "Climate: Issues related to climate change, environmental protection..."
This is the topic description field from the database rendered verbatim on a public-facing
page. It's a leaky abstraction. The related topics section should link to issue pages with
minimal copy, not dump schema descriptions.

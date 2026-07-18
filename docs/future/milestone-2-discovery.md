# Milestone 2 Discovery

## Goal

Determine whether to commit to a real-user Milestone 2 launch by talking to
people actively doing civic organizing work in Portland, Maine.

This is not a beta test. It is a gut-check conversation: does this platform
solve a real problem, or does the problem already have a good enough solution?

---

## Beta City: Portland, Maine

Chosen over larger metros because the builder has an existing presence in the
local organizing community (attends weekly protests) and can reach real people
directly. Smaller geography also makes initial content curation manageable.

---

## Known Gaps Before Any Launch

Three gaps need to be resolved before a real-user launch is viable:

1. **Content — articles and actions** — the platform has no real editorial
   inventory. Community submissions are unlikely to succeed on an empty site.

2. **Content — events** — no automated ingestion. Manual curation only.
   Mobilize API and Eventbrite are candidate sources; neither has been tested
   against Maine-specific content yet.

3. **Cross-entity linking** — no admin UI exists to link articles to actions
   or events. The join tables exist in the data model and the demo seed uses
   them, but any content created through the admin is editorially disconnected.
   This is the central editorial workflow problem for a real-user product.

Discovery conversations may help prioritize which gaps matter most to actual
organizers and whether any could be addressed through partnerships.

---

## Outreach Message

Sent 2026-07-09.

> **Subject:** Local platform for civic discovery — quick question
>
> Hi [Name],
>
> I'm a Portland resident who's been building a platform called Find Your Fight.
> The idea is to give people who want to get involved — but feel overwhelmed or
> don't know where to start — a simple way to find local events, issues, and
> actions.
>
> I'm genuinely not sure if this fills a real need or if people already have
> good ways to find this stuff. Before I put more into it, I'd love to hear
> from people who are actually doing organizing work here.
>
> Would anyone at [Org] be willing to share a few thoughts — by email or a
> quick call, whichever is easier?
>
> Kevin Born
> [findmyfight.com]

---

## Organizations Contacted

| Org                     | URL                                          | Contacted  | Response |
| ----------------------- | -------------------------------------------- | ---------- | -------- |
| Indivisible PWM         | https://indivisiblepwm.com/                  | 2026-07-17 | —        |
| Maine Civic Action      | https://www.mainecivicaction.org/            | 2026-07-17 | —        |
| Maine People's Alliance | https://mainepeoplesalliance.org/ (facebook) | 2026-07-17 | —        |
| Maine Initiatives       | https://maineinitiatives.org/ (email)        | 2026-07-15 | —        |
| Justice Maine           | https://justicemaine.org/                    | 2026-07-17 | —        |
| Activate Maine          | https://www.activatemaine.com/               | 2026-07-17 | —        |
| ACLU Maine              | http://aclumaine.org/ (email)                | 2026-07-15 | 7/17     |

---

## Questions to Explore in Conversations

1. How do you currently get people to find out about events and actions?
2. When you want someone to take action on an issue, how do you point them
   to resources?
3. What would make you tell someone else to use a tool like this?

Secondary (raise only if conversation goes well):

- Would your org be willing to share events or resources for the platform to
  surface, with attribution and links back to your site?
- Is there content you publish that you wish reached a wider audience?

---

## Event Source Research

### Mobilize (mobilize.us)

Mobilize is not a general civic events API — it is a **progressive organizing
platform** used by Indivisible, Swing Left, labor unions, and advocacy orgs.
It happens to align well with Find Your Fight's target audience.

**API:** Public REST API, no auth required for read access, 15 req/sec limit.
Deprecated global endpoint (`GET /v1/events`) still works; preferred path is
org-specific (`GET /v1/organizations/:id/events`). Write access and full
address data require an API key (request via support@mobilize.us).

**Portland, ME coverage:** 44 upcoming events within 50 miles of zip 04101
as of 2026-07-09. Events were relevant: Indivisible standouts, Swing Left
strategy sessions, ICE protest actions.

**Schema fit:** Clean mapping to the Event entity.

| Mobilize field                 | Event field                         |
| ------------------------------ | ----------------------------------- |
| `title`                        | `title`                             |
| `description`                  | `description`                       |
| `timeslots[0].start_date`      | `startDate` (Unix timestamp → Date) |
| `location.locality` + `region` | `location`                          |
| `browser_url`                  | `externalUrl`                       |
| `featured_image_url`           | image                               |

**Gotcha:** Events with `address_visibility: PRIVATE` hide the venue address.
Always use `browser_url` as the CTA link rather than displaying an address.

**For multi-city expansion:** The `GET /v1/organizations` endpoint is public
and lists all orgs with their state and event feed URL. Useful for identifying
partner orgs when branching to new cities.

### Other sources evaluated

| Source                          | Verdict                                                                                                                                                                                |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Local government calendars**  | High value for town halls, public hearings, city council meetings — fills Mobilize's nonpartisan gap. No standard API; requires scraping per city. Worth adding for Portland, ME beta. |
| **Eventbrite**                  | Public API, wide coverage, but very noisy. Would need heavy category filtering. Secondary source at best.                                                                              |
| **Action Network**              | Similar to Mobilize, used by labor and environmental orgs. API requires per-org keys — only viable if orgs share access willingly.                                                     |
| **iCal feeds**                  | Some nonprofits publish `.ics` files. Parseable if you know the URL. Worth checking for specific partner orgs.                                                                         |
| **Facebook Events**             | API closed post-Cambridge Analytica. Not viable.                                                                                                                                       |
| **Meetup**                      | API heavily restricted. Wrong content type (social/professional, not civic action).                                                                                                    |
| **Mobilize SQL Mirror**         | Postgres mirror of full Mobilize data — but only available to Mobilize org customers, not third-party builders.                                                                        |
| **Mobilize Zapier integration** | Outbound only (Mobilize → other apps). Not useful for ingestion.                                                                                                                       |
| **Mobilize-to-VAN integration** | Internal ops tool for pushing volunteer data to NGP VAN. Not relevant.                                                                                                                 |

### Coverage assessment for Portland, ME beta

Mobilize alone covers organized progressive events well. The meaningful gap
is local government and nonpartisan civic events, which would require scraping
Portland's city calendar. Small orgs that don't post on any platform are only
reachable through direct relationships — which is why org outreach matters
independent of any API strategy.

---

## Next Steps

- [ ] Follow up with any non-responses after 1 week
- [ ] Update response column above as replies come in
- [ ] After conversations: decide whether to commit to Milestone 2 and which
      gap to address first

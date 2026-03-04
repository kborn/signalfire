# Engineering Decisions Log (Append-only)

Record irreversible or high-impact decisions here.

### Decision Entry Template

---

## Title
### Date: YYYY-MM-DD

### Decision: one sentence describing the decision

### Rationale:
- why

### Implications:
- what this enforces or forbids
--- 


## Decision Entry

### Date: 2026-03-04

### Decision: 
Platform framing uses broad civic language. The core domain
concept is **Event** rather than protest/rally, and the platform is
framed as a **civil action platform** rather than a single-issue
political site.

### Rationale:
- Keeps the platform durable beyond a single political
moment. 
- Allows coverage of multiple civic domains (climate, volunteering, community organizing, local government engagement). 
- Maintains flexibility for current content to lean politically without structurally constraining the product. 
- Supports clearer and more inclusive product language.

### Implications:
- The primary domain entity is **Event**.
- Terms like **protest** and **rally** become optional event *types* rather than the core platform concept. 
- UI labels, routes, schemas, and documentation should default to neutral civic language (Events, Actions, Topics). 
- Data ingestion or submissions that include protests/rallies should normalize into the Event model.

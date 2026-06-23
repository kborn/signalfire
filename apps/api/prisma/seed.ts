import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import {
  ActionType,
  EntityStatus,
  EventType,
  PrismaClient,
  SubmissionStatus,
  SubmissionType,
} from '@prisma/client';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('Missing required environment variable: DATABASE_URL');
}

const seedMode = (process.env.SEED_MODE ?? 'baseline').toLowerCase();
const demoAdminEmail = process.env.ADMIN_EMAIL ?? 'admin@example.com';
const demoAdminPassword = process.env.ADMIN_PASSWORD ?? 'FindYourFight1';

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function relativeDate(params: { daysFromNow?: number; hours?: number; minutes?: number }): Date {
  const { daysFromNow = 0, hours = 0, minutes = 0 } = params;
  const date = new Date();

  date.setSeconds(0, 0);
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hours, minutes, 0, 0);

  return date;
}

const TARGET_PUBLISHED_ARTICLE_COUNT = 31;
const TARGET_PUBLISHED_ACTION_COUNT = 31;
const TARGET_PUBLISHED_EVENT_COUNT = 31;

function publishedDateFromIndex(index: number): Date {
  return new Date(Date.UTC(2026, 0, 1 + index, 0, 0, 0, 0));
}

function isGeneratedDemoPublishedAt(date: Date | null | undefined): boolean {
  if (!date) {
    return false;
  }

  return (
    date.getUTCFullYear() === 2026 &&
    date.getUTCMonth() === 0 &&
    date.getUTCDate() >= 1 &&
    date.getUTCDate() <= 31
  );
}

function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildGeneratedSlug(topicSlug: string, title: string) {
  return `${topicSlug}-${titleToSlug(title)}`;
}

function buildGeneratedArticleContent(summary: string, body: string) {
  return `## What this fight is really about

${summary}

${body}`;
}

const topicNarratives = {
  democracy: {
    articleSummary:
      'A briefing on a local democratic process and where public pressure can matter.',
    articleTitle: 'Democracy Briefing',
    articleBody: `This briefing explains one concrete democratic process, names the institution involved, and points readers toward a practical next step.

Readers should understand what decision is being made, who can influence it, and what action fits the moment.

The point is to make the process legible enough that someone can move from concern to participation without already knowing the local power map.`,
    actionTitle: 'Democracy Action',
    actionSummary: 'A practical public-pressure step tied to a democratic decision point.',
    actionDescription:
      'Track the next public decision point, prepare one specific ask, and show up in a way that makes the issue harder to ignore.',
    eventTitle: 'Democracy Community Event',
    eventSummary:
      'A public event focused on turnout, accountability, and local civic participation.',
    eventDescription:
      'People come to coordinate turnout, compare notes before a meeting, and leave with a clearer role in the next public step.',
  },
  'consumer-activism': {
    articleSummary:
      'A briefing on corporate pressure, campaign targets, and how consumer action fits in.',
    articleTitle: 'Consumer Activism Briefing',
    articleBody: `This article frames consumer activism as one tactic inside a larger pressure campaign.

It highlights clear demands, a target institution, and the difference between symbolic disapproval and organized leverage.

It keeps the focus on leverage, not vibes, so readers can tell when consumer pressure is helping a campaign and when it is just branding the frustration.`,
    actionTitle: 'Consumer Activism Action',
    actionSummary: 'A targeted action that shows how public pressure can shift consumer behavior.',
    actionDescription:
      'Share a target list, move spending, or back workers directly in ways that reinforce a live campaign rather than a vague complaint.',
    eventTitle: 'Consumer Activism Community Event',
    eventSummary:
      'A public event where organizers explain a campaign target and coordinate follow-through.',
    eventDescription:
      'Expect a practical organizing session focused on the target, the demand, and the follow-through needed after the first burst of attention.',
  },
  climate: {
    articleSummary:
      'A briefing on local climate pressure points and the decisions communities can influence.',
    articleTitle: 'Climate Briefing',
    articleBody: `This climate article connects local policy to everyday civic participation.

It emphasizes the choices that shape transit, housing, resilience, and public investment at the municipal level.

The through-line is simple: local climate politics matter most when residents know where the actual decision point lives.`,
    actionTitle: 'Climate Action',
    actionSummary: 'A concrete local climate action with a public target and a clear next step.',
    actionDescription:
      'Use it to contact officials, join a coalition, or prepare for a hearing tied to transit, infrastructure, or neighborhood resilience.',
    eventTitle: 'Climate Community Event',
    eventSummary: 'A public event focused on local climate resilience and community pressure.',
    eventDescription:
      'Residents use this gathering to organize around transit, heat safety, resilience, or public investment with a concrete public target in view.',
  },
  'civil-rights': {
    articleSummary:
      'A briefing on a civil-rights conflict and the public processes surrounding it.',
    articleTitle: 'Civil Rights Briefing',
    articleBody: `This article is designed to work like a real civil-rights explainer.

It names a conflict, identifies the institution involved, and shows how readers can connect principle to public participation.

The goal is to help readers move from outrage to an actual decision point they can influence.`,
    actionTitle: 'Civil Rights Action',
    actionSummary: 'A civic step tied to a civil-rights issue and a specific decision-maker.',
    actionDescription:
      'Contact a board, show up for a hearing, or support a local rights-defense effort tied to a real institutional fight.',
    eventTitle: 'Civil Rights Community Event',
    eventSummary: 'A public gathering focused on rights, turnout, and coordinated local response.',
    eventDescription:
      'The event gives people a place to coordinate turnout, share updates, and connect rights language to local follow-through.',
  },
  'economic-justice': {
    articleSummary: 'A briefing on wages, housing, cost burden, or labor pressure in public life.',
    articleTitle: 'Economic Justice Briefing',
    articleBody: `This economic-justice article is meant to work like a usable primer.

It links material conditions to specific institutions and shows how people can move from understanding a problem to joining a concrete campaign.

It stays grounded in the public bodies, employers, and housing systems that people can actually pressure.`,
    actionTitle: 'Economic Justice Action',
    actionSummary: 'A practical step tied to housing, labor, or cost-of-living pressure.',
    actionDescription:
      'Join a tenant network, support worker-led pressure, or document a public affordability issue in a way that can feed a broader campaign.',
    eventTitle: 'Economic Justice Community Event',
    eventSummary: 'A public gathering focused on labor, housing, or affordability organizing.',
    eventDescription:
      'People gather here to trade concrete information, align demands, and prepare the next visible step around housing, labor, or affordability.',
  },
  education: {
    articleSummary:
      'A briefing on school governance, policy process, and public participation points.',
    articleTitle: 'Education Briefing',
    articleBody: `This education article explains a school or district-level issue in practical terms.

It focuses on how families, educators, and neighbors can understand the process before a conflict becomes a last-minute scramble.

The emphasis stays on preparation: knowing the process early enough to organize before a vote hardens.`,
    actionTitle: 'Education Action',
    actionSummary: 'A concrete school-governance step tied to a public meeting or policy decision.',
    actionDescription:
      'Review the agenda, organize outreach, prepare testimony, or support a library-access effort before the decision is already made.',
    eventTitle: 'Education Community Event',
    eventSummary: 'A public gathering focused on school policy, turnout, and local coordination.',
    eventDescription:
      'Families and educators use the session to compare notes, prepare turnout, and stay ahead of a policy fight that could otherwise move quietly.',
  },
  'local-community': {
    articleSummary:
      'A briefing on neighborhood-level civic participation and recurring local coordination.',
    articleTitle: 'Local Community Briefing',
    articleBody: `This article shows how neighborhood-level civic work can connect immediate needs to longer-term public pressure.

It stays close to the pace and texture of actual neighborhood civic work.

The emphasis stays on repeated local participation, mutual support, and practical next steps.`,
    actionTitle: 'Local Community Action',
    actionSummary: 'A concrete neighborhood step that helps people join work already underway.',
    actionDescription:
      'Join a coalition, help with turnout, or support a recurring neighborhood response effort that already has a public rhythm.',
    eventTitle: 'Local Community Event',
    eventSummary:
      'A neighborhood-focused event where people organize, learn, and plan follow-through.',
    eventDescription:
      'The event centers realistic neighborhood-level participation: people meeting, planning, and committing to the next round of follow-through.',
  },
} as const;

const topics = [
  {
    slug: 'democracy',
    name: 'Democracy',
    description:
      'Issues related to democratic institutions, voting rights, election integrity, and civic participation in government.',
    color: '#5b88c7',
  },
  {
    slug: 'consumer-activism',
    name: 'Consumer Activism',
    description:
      'Actions focused on influencing corporate behavior through consumer choices such as boycotts, ethical purchasing, and corporate accountability campaigns.',
    color: '#c9894a',
  },
  {
    slug: 'climate',
    name: 'Climate',
    description:
      "Issues related to climate change, environmental protection, sustainability, and policies affecting the planet's ecological systems.",
    color: '#4a9e7c',
  },
  {
    slug: 'civil-rights',
    name: 'Civil Rights',
    description:
      'Issues involving the protection and advancement of equal rights and liberties, including racial justice, gender equality, LGBTQ+ rights, and disability rights.',
    color: '#c76b5b',
  },
  {
    slug: 'economic-justice',
    name: 'Economic Justice',
    description:
      'Issues related to economic fairness, inequality, labor conditions, housing affordability, wages, and access to economic opportunity.',
    color: '#c4a23e',
  },
  {
    slug: 'education',
    name: 'Education',
    description:
      'Issues involving public education systems, school policy, curriculum debates, student rights, and education funding.',
    color: '#7a84c7',
  },
  {
    slug: 'local-community',
    name: 'Local Community',
    description:
      'Community-level civic engagement including local organizing, mutual aid, neighborhood initiatives, and grassroots participation.',
    color: '#5da870',
  },
] as const;

const topicArticlePool: Record<string, Array<{ title: string; summary: string }>> = {
  democracy: [
    {
      title: 'Your County Election Board Has More Power Than You Think',
      summary:
        'How county boards shape polling access, early voting locations, and language support.',
    },
    {
      title: 'How Redistricting Decisions Get Made',
      summary:
        'A plain-language explainer on when district lines are drawn and who controls the process.',
    },
    {
      title: 'Reading a Ballot Measure Before You Vote',
      summary:
        'What the full text of a measure usually contains and where to find independent analysis.',
    },
    {
      title: 'When Local Officials Restrict Public Comment',
      summary:
        'How shortened speaking time and tighter sign-up rules happen, and what to do about them.',
    },
  ],
  'consumer-activism': [
    {
      title: 'What Makes a Boycott Actually Work',
      summary:
        'Three conditions that separate boycotts with measurable outcomes from symbolic disapproval.',
    },
    {
      title: "How to Research a Company's Labor Record",
      summary:
        'Where to find worker reports, NLRB filings, and supply-chain disclosures before joining a campaign.',
    },
    {
      title: 'Worker-Led Campaigns vs. Consumer Campaigns',
      summary:
        'When to follow worker demands directly, when consumer pressure helps, and when they point in different directions.',
    },
    {
      title: 'Reading a Corporate Sustainability Report',
      summary:
        'How to separate genuine commitments from PR language in annual environmental disclosures.',
    },
  ],
  climate: [
    {
      title: "What Your City's Climate Plan Actually Commits To",
      summary:
        'How to read a municipal climate goal, find the accountability mechanisms, and track follow-through.',
    },
    {
      title: 'Transit and Climate Are the Same Fight',
      summary:
        'Why public transit funding is the most actionable local climate lever most residents overlook.',
    },
    {
      title: 'How Utility Rates Get Set',
      summary:
        'The public rate-review process, who participates, and where residents can submit comments that matter.',
    },
    {
      title: 'Zoning Law and Local Emissions',
      summary:
        'How residential zoning rules shape heat islands, transit access, and building efficiency in your neighborhood.',
    },
  ],
  'civil-rights': [
    {
      title: 'When Police Accountability Decisions Are Made Locally',
      summary:
        'Which civilian oversight bodies have real authority versus advisory-only roles, and how they differ.',
    },
    {
      title: 'Disability Access in Public Meetings',
      summary:
        'What agencies are legally required to provide and how to make a formal request when they fall short.',
    },
    {
      title: 'How Title IX Complaints Work in Practice',
      summary:
        'What the formal process looks like for students, what timelines apply, and how schools must respond.',
    },
    {
      title: 'Documenting Discrimination for a Public Record',
      summary:
        'How incident documentation supports policy demands rather than only individual cases.',
    },
  ],
  'economic-justice': [
    {
      title: 'How Minimum Wage Campaigns Win at the City Level',
      summary:
        'What the local legislative path looks like and what kinds of organizing consistently move it forward.',
    },
    {
      title: 'Reading a Housing Authority Budget',
      summary:
        'How to track public housing investment, deferred maintenance, and the early signs of tenant displacement.',
    },
    {
      title: 'Rent Stabilization vs. Rent Control',
      summary:
        'What each policy actually does, where they currently exist, and how residents advocate for either.',
    },
    {
      title: 'How Wage Theft Complaints Work',
      summary:
        'Where to file, what the enforcement process looks like, and which agencies have jurisdiction over your situation.',
    },
  ],
  education: [
    {
      title: 'How School Board Policies Get Changed',
      summary:
        'The amendment process, public comment windows, and what organized parent pressure actually looks like.',
    },
    {
      title: 'Special Education Rights and How Schools Avoid Them',
      summary:
        'What IDEA legally requires, what schools commonly fail to provide, and where families can escalate.',
    },
    {
      title: 'Understanding Per-Pupil Funding Disparities',
      summary:
        'How state funding formulas distribute money unequally across districts and what communities can do.',
    },
    {
      title: 'What a Library Reconsideration Policy Should Include',
      summary:
        'How book-review committees work, what due process requires, and what families can demand when it is missing.',
    },
  ],
  'local-community': [
    {
      title: 'How Neighborhood Councils Actually Work',
      summary:
        'Which cities have them, what authority they carry, and how to use them as a civic pressure tool.',
    },
    {
      title: 'What a Mutual Aid Network Needs to Stay Durable',
      summary:
        'Organizational lessons from groups that outlasted a single crisis and kept showing up.',
    },
    {
      title: 'Zoning Appeals and the People Who Use Them',
      summary:
        'How neighbors can formally challenge development decisions and what they realistically win.',
    },
    {
      title: 'Community Land Trusts as a Long-Term Strategy',
      summary:
        'What they are, where they work, and how resident campaigns have successfully started them.',
    },
  ],
};

const topicActionPool: Record<
  string,
  Array<{ title: string; summary: string; actionType: ActionType; externalUrl?: string }>
> = {
  democracy: [
    {
      title: "Find Your County's Next Election Board Meeting",
      summary:
        'Locate the public calendar and attend the next session where election procedures are discussed.',
      actionType: ActionType.GUIDE,
    },
    {
      title: 'Submit Public Comment on a Proposed Election Rule Change',
      summary:
        'Write and submit formal comment before the deadline on a rule change affecting voting access.',
      actionType: ActionType.CONTACT,
    },
    {
      title: 'Volunteer for Voter Registration Outreach',
      summary:
        'Join a local drive that helps residents navigate registration, deadlines, and ID requirements.',
      actionType: ActionType.VOLUNTEER,
    },
    {
      title: 'Donate to a Nonpartisan Voting-Rights Fund',
      summary:
        'Support organizations providing legal defense and access support for voters facing barriers.',
      actionType: ActionType.DONATE,
    },
  ],
  'consumer-activism': [
    {
      title: 'Share a Worker-Verified Target List With Your Network',
      summary:
        'Distribute a campaign-reviewed list of products and purchases to redirect away from a pressure target.',
      actionType: ActionType.GUIDE,
    },
    {
      title: 'Contact a Corporate Investor About Labor Conditions',
      summary:
        'Write to an institutional investor with a specific ask tied to a labor accountability campaign.',
      actionType: ActionType.CONTACT,
    },
    {
      title: 'Volunteer With a Consumer Accountability Campaign',
      summary:
        'Help with outreach, research, or public education for an ongoing corporate accountability effort.',
      actionType: ActionType.VOLUNTEER,
    },
    {
      title: 'Donate to a Worker Strike Fund',
      summary:
        'Contribute directly to workers sustaining a strike or walkout during an active pressure campaign.',
      actionType: ActionType.DONATE,
    },
  ],
  climate: [
    {
      title: 'Submit Comment on a Local Utility Rate Review',
      summary:
        "File written comment during the public rate-review window before your utility's next rate increase takes effect.",
      actionType: ActionType.CONTACT,
    },
    {
      title: 'Find Out Who Represents You on Climate at the City Level',
      summary:
        'Identify the council member, commission, and staff lead responsible for climate-related budget decisions.',
      actionType: ActionType.GUIDE,
    },
    {
      title: 'Join a Climate Accountability Monitoring Group',
      summary:
        "Participate in ongoing tracking of your city's climate commitments through public records and meeting attendance.",
      actionType: ActionType.VOLUNTEER,
    },
    {
      title: 'Donate to a Local Environmental Justice Organization',
      summary:
        'Support frontline organizations working on pollution, infrastructure, and climate investment in your region.',
      actionType: ActionType.DONATE,
    },
  ],
  'civil-rights': [
    {
      title: "Contact Your City's Civilian Oversight Board",
      summary:
        'Send a message to your local oversight body about a specific complaint or policy concern.',
      actionType: ActionType.CONTACT,
    },
    {
      title: 'Find a Local Rights-Defense Organization',
      summary:
        'Identify the legal and advocacy groups in your area working on civil rights enforcement.',
      actionType: ActionType.GUIDE,
    },
    {
      title: 'Volunteer for a Know-Your-Rights Workshop',
      summary:
        'Help organize or staff a community session that explains rights in housing, employment, or public space.',
      actionType: ActionType.VOLUNTEER,
    },
    {
      title: 'Donate to a Civil Rights Legal Defense Fund',
      summary:
        'Support litigation and legal representation for individuals and communities facing rights violations.',
      actionType: ActionType.DONATE,
    },
  ],
  'economic-justice': [
    {
      title: 'File a Wage Theft Complaint',
      summary:
        'Submit a formal complaint with the appropriate state or federal agency if wages have been withheld or underpaid.',
      actionType: ActionType.CONTACT,
    },
    {
      title: 'Find Out if Your City Has a Tenant Protection Ordinance',
      summary:
        'Look up your local tenant rights, rent stabilization status, and who enforces housing protections.',
      actionType: ActionType.GUIDE,
    },
    {
      title: 'Join a Tenant Union Organizing Drive',
      summary: 'Connect with existing tenant organizing efforts in your building or neighborhood.',
      actionType: ActionType.VOLUNTEER,
    },
    {
      title: 'Donate to a Housing Justice Fund',
      summary:
        'Support organizations providing emergency housing assistance and long-term tenant defense.',
      actionType: ActionType.DONATE,
    },
  ],
  education: [
    {
      title: 'Attend the Next School Board Public Comment Session',
      summary:
        'Show up and speak during the public comment period on an open policy or budget item.',
      actionType: ActionType.CONTACT,
    },
    {
      title: "Review Your District's Library Reconsideration Policy",
      summary:
        'Find and read the formal policy governing book reviews, then share what you find with other families.',
      actionType: ActionType.GUIDE,
    },
    {
      title: 'Volunteer With a Parent Advocacy Group',
      summary:
        'Join a local parent group working on school policy, library access, or curriculum transparency.',
      actionType: ActionType.VOLUNTEER,
    },
    {
      title: 'Donate to a Student Rights Organization',
      summary:
        'Support groups defending student press freedom, disability rights, and due process in discipline cases.',
      actionType: ActionType.DONATE,
    },
  ],
  'local-community': [
    {
      title: "Find Your Neighborhood's City Council Representative",
      summary:
        'Look up who represents your address and identify their public schedule and contact channels.',
      actionType: ActionType.GUIDE,
    },
    {
      title: 'Submit Public Comment on a Development Proposal',
      summary:
        'Write and deliver comment on a zoning application, variance request, or land-use decision in your area.',
      actionType: ActionType.CONTACT,
    },
    {
      title: 'Volunteer With a Local Mutual Aid Network',
      summary:
        'Join a neighborhood mutual aid group to help with supply runs, check-ins, or coordination work.',
      actionType: ActionType.VOLUNTEER,
    },
    {
      title: 'Donate to a Community Land Trust',
      summary:
        'Support a local CLT working to remove housing from the speculative market and preserve long-term affordability.',
      actionType: ActionType.DONATE,
    },
  ],
};

const topicEventPool: Record<string, Array<{ title: string; summary: string }>> = {
  democracy: [
    {
      title: 'Election Board Public Session',
      summary:
        'Residents attend a county election board meeting to observe decisions on polling procedures.',
    },
    {
      title: 'Voter Registration Canvass',
      summary:
        'Organizers help neighbors register, check status, and navigate ID and deadline requirements.',
    },
    {
      title: 'Redistricting Community Forum',
      summary:
        'A public session explaining the upcoming redistricting process and how residents can participate.',
    },
    {
      title: 'Town Hall on Ballot Access',
      summary:
        'Advocates gather to discuss recent changes to early voting, drop boxes, and registration windows.',
    },
  ],
  'consumer-activism': [
    {
      title: 'Boycott Campaign Kickoff Meeting',
      summary:
        'Organizers explain the target, the demands, and how participants can join the pressure campaign.',
    },
    {
      title: 'Labor Solidarity Information Night',
      summary:
        'Workers and supporters meet to share campaign updates and coordinate follow-through.',
    },
    {
      title: 'Corporate Accountability Workshop',
      summary:
        'A session on how to research company records, file complaints, and amplify worker demands.',
    },
    {
      title: 'Worker Support Rally',
      summary:
        'Public show of support for workers involved in an active labor action or corporate campaign.',
    },
  ],
  climate: [
    {
      title: 'Climate Budget Hearing Watch',
      summary:
        'Community members attend a public budget session to track climate funding allocations.',
    },
    {
      title: 'Transit Equity Rally',
      summary:
        'Residents rally in support of expanded bus service and dedicated transit infrastructure.',
    },
    {
      title: 'Heat Safety Canvass Training',
      summary:
        'Volunteers learn to share cooling resources, check on neighbors, and document heat-related hazards.',
    },
    {
      title: 'Utility Rate Review Comment Night',
      summary:
        'Neighbors prepare and submit public comment on a pending rate increase before the deadline.',
    },
  ],
  'civil-rights': [
    {
      title: 'Community Know-Your-Rights Session',
      summary:
        'Legal advocates explain rights in housing, public space, and encounters with law enforcement.',
    },
    {
      title: 'Accountability Rally',
      summary:
        'Residents gather to demand follow-through on a civil rights commitment from a local institution.',
    },
    {
      title: 'Oversight Board Public Meeting',
      summary:
        'A public session of the civilian oversight body reviewing complaints and policy recommendations.',
    },
    {
      title: 'Rights Defense Volunteer Training',
      summary:
        'New volunteers learn documentation practices, complaint filing, and outreach for a rights campaign.',
    },
  ],
  'economic-justice': [
    {
      title: 'Tenant Organizing Meeting',
      summary:
        'Building residents meet to coordinate around lease terms, maintenance demands, and rent pressure.',
    },
    {
      title: 'Wage Theft Clinic',
      summary:
        'Legal advocates help workers understand their options when wages have been withheld or underpaid.',
    },
    {
      title: 'Labor Rights Workshop',
      summary:
        'A session on organizing rights, collective bargaining basics, and what the NLRA does and does not cover.',
    },
    {
      title: 'Housing Justice Rally',
      summary:
        'Residents rally in support of stronger tenant protections and affordable housing investment.',
    },
  ],
  education: [
    {
      title: 'School Board Agenda Watch Session',
      summary:
        'Families review the next board agenda together and identify items that need organized turnout.',
    },
    {
      title: 'Library Access Organizing Meeting',
      summary:
        'Parents and educators coordinate in defense of school library access and reconsideration policy.',
    },
    {
      title: 'Special Education Rights Workshop',
      summary: 'Advocates explain what IDEA requires, common school failures, and how to escalate.',
    },
    {
      title: 'Parent Advocacy Training',
      summary:
        'A session for families on how to prepare testimony, read agendas, and build durable school-board coalitions.',
    },
  ],
  'local-community': [
    {
      title: 'Neighborhood Council Open Session',
      summary:
        'Residents attend a neighborhood council meeting to raise issues and participate in local governance.',
    },
    {
      title: 'Zoning Appeal Prep Workshop',
      summary:
        'Community members learn how to file a zoning appeal and organize neighbors around a development decision.',
    },
    {
      title: 'Mutual Aid Network Volunteer Day',
      summary:
        'Volunteers gather for supply runs, check-ins, and coordination for neighbors in need.',
    },
    {
      title: 'Community Land Trust Information Night',
      summary:
        'Organizers explain how CLTs work and how residents can start one to preserve affordable housing.',
    },
  ],
};

function pickTopicEntry<T>(pool: Record<string, T[]>, slug: string, index: number): T {
  const entries = pool[slug];

  if (!entries?.length) {
    throw new Error(`Missing seeded content pool for topic: ${slug}`);
  }

  return entries[index % entries.length];
}

const demoArticles = [
  {
    slug: 'how-local-climate-policy-works',
    title: 'How Local Climate Policy Works',
    summary: 'A guide to city-level climate policy.',
    content: `## Why local climate policy matters

Local climate policy shapes transit, zoning, building rules, and public investment. Residents can influence these decisions much closer to home than they often assume.

### Where pressure usually works

- public comment before budget votes
- neighborhood organizing around transit and housing
- follow-up emails to council offices after hearings

### What to do after reading

Start with one concrete ask, bring it to a public meeting, and then join a recurring local coalition so the pressure continues after a single hearing.`,
    author: 'Find Your Fight Editorial',
    status: EntityStatus.PUBLISHED,
    publishedAt: new Date('2026-06-03T00:00:00.000Z'),
    topicSlugs: ['climate', 'local-community'],
    actionSlugs: [
      'contact-city-council-about-transit',
      'join-neighborhood-climate-coalition',
      'join-tenant-solidarity-network',
    ],
  },
  {
    slug: 'protect-voting-access-in-your-county',
    title: 'Protect Voting Access In Your County',
    summary: 'What county-level election administration controls and how residents can intervene.',
    content: `## County election rules shape real access

Election administration is often decided close to home. County boards, clerks, and public hearings can affect polling sites, language access, and voter outreach.

### Watch for these decision points

- polling place changes
- reduced early-voting access
- confusing voter communication

### Practical next steps

Attend meetings, document procedural changes, and plug into election-protection volunteers who can turn observation into public pressure.`,
    author: 'Find Your Fight Editorial',
    status: EntityStatus.PUBLISHED,
    publishedAt: new Date('2026-06-05T00:00:00.000Z'),
    topicSlugs: ['democracy', 'local-community'],
    actionSlugs: ['attend-election-board-meeting', 'volunteer-as-election-protection-observer'],
  },
  {
    slug: 'how-to-read-a-corporate-pressure-campaign',
    title: 'How To Read A Corporate Pressure Campaign',
    summary: 'How boycotts, worker demands, and public pressure campaigns fit together.',
    content: `## Corporate pressure works best when it is specific

Consumer pressure is strongest when it is tied to a public demand, a target decision-maker, and a timeline people can follow.

### A stronger campaign usually has

- one or two specific demands
- a public explanation of why those demands matter
- a way for supporters to take repeated action

### What not to do

Do not treat every bad company as the same target. Match the tactic to the leverage point: purchasing pressure, donor pressure, labor solidarity, or public contact.`,
    author: 'Find Your Fight Editorial',
    status: EntityStatus.PUBLISHED,
    publishedAt: new Date('2026-06-07T00:00:00.000Z'),
    topicSlugs: ['consumer-activism', 'economic-justice'],
    actionSlugs: ['boycott-megastore-private-label', 'donate-to-worker-solidarity-fund'],
  },
  {
    slug: 'defend-library-access-in-your-school-district',
    title: 'Defend Library Access In Your School District',
    summary: 'How to organize around school-library access without waiting for a crisis vote.',
    content: `## Library access fights are usually local and procedural

Book removals, review committees, and curriculum debates often move through school-board processes long before most families hear about them.

### Start by mapping the process

1. identify the next public meeting
2. learn who sets review policy
3. coordinate families, educators, and local advocates

### Then move from concern to action

Build a small response team that can email decision-makers, show up in person, and keep library access visible as a civil-rights and education issue.`,
    author: 'Find Your Fight Editorial',
    status: EntityStatus.PUBLISHED,
    publishedAt: new Date('2026-06-09T00:00:00.000Z'),
    topicSlugs: ['education', 'civil-rights', 'local-community'],
    actionSlugs: [
      'email-school-board-about-library-access',
      'volunteer-with-friends-of-the-library',
    ],
  },
  {
    slug: 'what-public-comment-rules-can-tell-you',
    title: 'What Public Comment Rules Can Tell You',
    summary:
      'Public-comment rules often reveal which communities local officials are trying to sideline.',
    content: `## Public comment rules are political signals

When local bodies shorten speaking time, move meetings without notice, or tighten sign-up rules, they are often trying to reduce visible opposition.

### Watch for changes like

- shorter speaking windows
- earlier sign-up deadlines
- limits on remote testimony

### Why it matters

These rules shape whose voices are heard in public. Tracking them helps communities respond before exclusion becomes normal.`,
    author: 'Find Your Fight Editorial',
    status: EntityStatus.PUBLISHED,
    publishedAt: new Date('2026-06-11T00:00:00.000Z'),
    topicSlugs: ['democracy', 'civil-rights', 'local-community'],
    actionSlugs: ['testify-at-city-council-hearing', 'volunteer-as-election-protection-observer'],
  },
  {
    slug: 'organize-for-neighborhood-heat-safety',
    title: 'Organize For Neighborhood Heat Safety',
    summary:
      'Extreme heat is a climate issue, a housing issue, and a neighborhood organizing issue.',
    content: `## Heat safety is a local systems problem

Extreme heat exposes weak transit, poor housing conditions, and underfunded neighborhood infrastructure all at once.

### A local heat-safety plan can include

- tenant outreach in high-risk buildings
- pressure for cooling centers and transit access
- mutual-aid check-in systems during heat emergencies

### The political takeaway

Treat heat response as both immediate care and long-term civic pressure. Neighborhood-level organizing can connect climate action to economic justice quickly.`,
    author: 'Find Your Fight Editorial',
    status: EntityStatus.PUBLISHED,
    publishedAt: new Date('2026-06-12T00:00:00.000Z'),
    topicSlugs: ['climate', 'economic-justice', 'local-community'],
    actionSlugs: ['join-neighborhood-climate-coalition', 'join-tenant-solidarity-network'],
  },
  {
    slug: 'building-a-local-campaign-from-first-meeting-to-public-pressure',
    title: 'Building A Local Campaign From First Meeting To Public Pressure',
    summary:
      'A long-form field guide to turning scattered concern into a durable local civic campaign.',
    content: `Local campaigns rarely start with a polished strategy. They usually begin with a small number of people who can name a problem clearly, gather concrete examples, and commit to showing up more than once.

The point of this guide is not to make local work feel grander than it is. The point is to show that durable public pressure usually grows out of repeated, ordinary work: research, outreach, meeting prep, follow-up, and visible public action.

## Start by naming the problem in one sentence

If your group cannot explain the problem in one sentence, it will struggle to recruit new people and struggle even more to make a public demand that others can repeat.

A useful problem statement usually includes:

- the institution or decision-maker involved
- the harm people are experiencing
- the concrete thing that needs to change

Examples:

- The city keeps delaying dedicated bus-lane funding in neighborhoods that already have poor transit service.
- The school board is allowing opaque library-review rules that make removals easier and public accountability weaker.
- County officials are changing election procedures without clear public communication or meaningful public input.

That sentence is not your whole campaign. It is the anchor that helps everything else stay coherent.

## Map the decision, not just the outrage

A lot of new organizers spend too much time describing why something is bad and not enough time learning where the decision actually lives.

Before you choose tactics, answer these questions:

1. Who can actually change the policy, budget item, or procedure?
2. When do they make that decision?
3. What public process exists around it?
4. What outside pressure matters to them?

Sometimes the answer is a council committee. Sometimes it is a school-board vote. Sometimes it is a department head who can be influenced through public hearings, press attention, or sustained neighborhood turnout.

Without this map, action becomes expressive rather than strategic.

## Build a record before you build a crowd

You do not need a huge following before you begin. You do need enough evidence that the issue is real, ongoing, and visible.

Useful material includes:

- meeting agendas and minutes
- budget line items
- testimony from directly affected people
- local news coverage
- screenshots of official statements or procedural changes

This record does two things. First, it keeps the campaign grounded in reality. Second, it gives new supporters something to read so they can understand the issue quickly.

## Choose one public demand before choosing many tactics

People often jump into tactics because tactics feel active. But tactics without a shared demand usually scatter energy.

A strong public demand is:

- specific
- public
- understandable in one hearing
- connected to the actual decision-maker

Examples:

- restore the transit funding line before the budget vote
- publish the full library-review procedure and halt removals until public review occurs
- maintain early-voting access and publish all polling-place changes at least thirty days in advance

Once the demand is clear, tactics become easier to judge. If an action does not increase pressure around that demand, it may not be the right next move.

## Use a ladder of engagement

Not everyone can start by testifying at a hearing or leading a meeting. Build a path that lets people join at different levels.

A simple ladder might include:

- read the background explainer
- sign up for updates
- send one email
- attend one meeting
- bring one friend
- join the planning group
- take on one recurring responsibility

This matters because durable campaigns are built by helping people move from low-risk participation into shared ownership.

## Treat meetings as organizing tools, not rituals

A meeting should clarify decisions, assign work, and prepare the next public step.

Good meeting habits include:

- send an agenda in advance
- begin with the concrete campaign goal
- leave with named owners and deadlines
- write down what was decided

Bad meetings create the illusion of momentum while leaving no one clear on what happens next.

## Expect the campaign to need repetition

Most institutions wait for public pressure to fade. If your group appears once and disappears, the institution learns patience.

That is why follow-up matters:

- send the email after the hearing
- report back to everyone who showed up
- publish what officials said
- announce the next action before momentum drops

Repetition is not a failure of creativity. It is how officials learn that the issue is not going away quietly.

## Blend public action with relationship-building

Public pressure works better when it is rooted in real relationships.

That means:

- checking in with directly affected neighbors
- coordinating with aligned groups
- sharing practical work, not just visible roles
- creating small responsibilities that people can actually sustain

Campaigns weaken when only the most visible people are carrying the work.

## Use public comment and testimony carefully

Testimony matters most when it is timely, specific, and connected to broader organizing.

Helpful testimony usually:

- names the decision at hand
- repeats the campaign demand clearly
- includes one concrete story or fact
- points people toward the next public step

Testimony is less effective when it is treated as a substitute for the organizing that must happen before and after the hearing.

## Plan for fatigue before it arrives

Groups do better when they assume people will get tired, miss meetings, and need simpler ways to stay involved.

Some practical ways to reduce burnout:

- rotate facilitation
- share note-taking
- keep asks specific and time-bounded
- celebrate completed work, not only big wins

The goal is not constant urgency. The goal is continuity.

## Measure traction in more than one way

A campaign can be gaining traction even before it wins. Useful signs include:

- more people returning after a first action
- clearer public language around the issue
- officials beginning to respond defensively
- stronger ties between groups that were previously disconnected

Those signs do not replace the need for a concrete win. They do help you judge whether the campaign is deepening.

## Know when to narrow the scope

When a campaign is stalling, the answer is not always more activity. Sometimes the answer is a smaller, sharper target.

Ask:

- is the demand too broad?
- are we targeting the wrong decision-maker?
- do supporters understand the next step?
- are we trying to solve three issues at once?

Narrow scope often produces more momentum than adding another tactic.

## Move from learning to action

By the time someone finishes a long explainer like this, the next step should be obvious.

The most useful next actions are usually:

- join the local coalition already working on the issue
- contact the decision-maker before the next meeting
- show up at the next hearing with one specific demand

Long-form content should reduce confusion, not end in abstraction.

If the article clarifies the problem but leaves the reader with no next step, it has not yet completed the civic loop.`,
    author: 'Find Your Fight Editorial',
    status: EntityStatus.PUBLISHED,
    publishedAt: new Date('2026-06-13T00:00:00.000Z'),
    topicSlugs: ['democracy', 'climate', 'education', 'local-community'],
    actionSlugs: [
      'join-neighborhood-climate-coalition',
      'testify-at-city-council-hearing',
      'email-school-board-about-library-access',
    ],
  },
  {
    slug: 'how-mutual-aid-and-public-pressure-fit-together',
    title: 'How Mutual Aid And Public Pressure Fit Together',
    summary: 'Why direct support work and civic pressure often need each other.',
    content: `## Mutual aid and public pressure solve different parts of the same problem

Immediate support helps people survive. Public pressure helps change the conditions that created the need in the first place.

### Useful ways to connect them

- document recurring needs
- identify the public agency or institution tied to those needs
- move from crisis response into repeated civic demands

### The practical takeaway

Treat care work and public action as connected lanes. One keeps people afloat while the other tries to change the system around them.`,
    author: 'Find Your Fight Editorial',
    status: EntityStatus.PUBLISHED,
    publishedAt: new Date('2026-06-14T00:00:00.000Z'),
    topicSlugs: ['local-community', 'economic-justice', 'civil-rights'],
    actionSlugs: ['join-tenant-solidarity-network', 'testify-at-city-council-hearing'],
  },
  {
    slug: 'what-a-school-board-agenda-can-reveal',
    title: 'What A School Board Agenda Can Reveal',
    summary: 'A short guide to reading agendas before a public school board fight escalates.',
    content: `## Agendas often show the real conflict before the public debate begins

Committee reports, policy updates, and consent items can preview major changes before most families realize a decision is close.

### Look for

- policy revisions
- review committee updates
- consent items that hide meaningful changes

### What to do next

Read agendas early, compare them to prior meetings, and organize around the actual vote path instead of the rumor cycle.`,
    author: 'Find Your Fight Editorial',
    status: EntityStatus.PUBLISHED,
    publishedAt: new Date('2026-06-15T00:00:00.000Z'),
    topicSlugs: ['education', 'democracy', 'local-community'],
    actionSlugs: ['email-school-board-about-library-access', 'host-school-board-study-group'],
  },
  {
    slug: 'how-to-prepare-for-a-statewide-day-of-action',
    title: 'How To Prepare For A Statewide Day Of Action',
    summary:
      'A practical checklist for turning a one-day mobilization into longer civic follow-through.',
    content: `## A day of action only matters if people know the next step

Large mobilizations create attention, but they do not automatically create durable local pressure.

### Before the action

- define the demand
- prepare follow-up asks
- connect attendees to local groups

### After the action

Turn turnout into meetings, pressure, and recurring participation so the event becomes a beginning rather than a finale.`,
    author: 'Find Your Fight Editorial',
    status: EntityStatus.PUBLISHED,
    publishedAt: new Date('2026-06-16T00:00:00.000Z'),
    topicSlugs: ['civil-rights', 'climate', 'local-community'],
    actionSlugs: ['join-neighborhood-climate-coalition', 'volunteer-with-friends-of-the-library'],
  },
  {
    slug: 'draft-civic-content-playbook',
    title: 'Draft Civic Content Playbook',
    summary: 'A draft-only article used for local API filtering checks.',
    content: 'This draft article should never appear on public read routes.',
    author: 'Find Your Fight Editorial',
    status: EntityStatus.DRAFT,
    publishedAt: null,
    topicSlugs: ['education'],
    actionSlugs: ['host-school-board-study-group'],
  },
] as const;

const demoActions = [
  {
    slug: 'contact-city-council-about-transit',
    title: 'Contact City Council About Transit',
    summary: 'Ask local officials to expand public transit funding.',
    description:
      'Call or email your local council member and ask for dedicated bus-lane funding and improved weekend service.',
    externalUrl: 'https://www.usa.gov/local-governments',
    actionType: ActionType.CONTACT,
    status: EntityStatus.PUBLISHED,
    publishedAt: new Date('2026-06-03T00:00:00.000Z'),
    topicSlugs: ['climate', 'local-community'],
    articleSlugs: ['how-local-climate-policy-works'],
  },
  {
    slug: 'join-neighborhood-climate-coalition',
    title: 'Join A Neighborhood Climate Coalition',
    summary: 'Work with local residents on recurring climate pressure campaigns.',
    description:
      'Join an existing local coalition or start a recurring organizing group focused on transit, housing, and emissions policy.',
    externalUrl: 'https://350.org/get-involved/',
    actionType: ActionType.VOLUNTEER,
    status: EntityStatus.PUBLISHED,
    publishedAt: new Date('2026-06-04T00:00:00.000Z'),
    topicSlugs: ['climate', 'local-community'],
    articleSlugs: [
      'how-local-climate-policy-works',
      'organize-for-neighborhood-heat-safety',
      'building-a-local-campaign-from-first-meeting-to-public-pressure',
    ],
  },
  {
    slug: 'attend-election-board-meeting',
    title: 'Attend An Election Board Meeting',
    summary: 'Show up to local election administration meetings and document decisions.',
    description:
      'Attend the next public election board meeting, take notes, and follow up on procedural changes that affect voting access.',
    externalUrl: 'https://www.eac.gov/voters/find-your-state-election-office',
    actionType: ActionType.VOLUNTEER,
    status: EntityStatus.PUBLISHED,
    publishedAt: new Date('2026-06-05T00:00:00.000Z'),
    topicSlugs: ['democracy', 'local-community'],
    articleSlugs: ['protect-voting-access-in-your-county'],
  },
  {
    slug: 'boycott-megastore-private-label',
    title: 'Join The Megastore Private-Label Boycott',
    summary: 'Shift spending away from a retailer tied to anti-worker retaliation.',
    description:
      "Move purchases away from the company's private-label products, share the campaign demand publicly, and invite others to follow the same target list.",
    externalUrl: 'https://goodjobsfirst.org/violation-tracker/',
    actionType: ActionType.GUIDE,
    status: EntityStatus.PUBLISHED,
    publishedAt: new Date('2026-06-06T00:00:00.000Z'),
    topicSlugs: ['consumer-activism', 'economic-justice'],
    articleSlugs: ['how-to-read-a-corporate-pressure-campaign'],
  },
  {
    slug: 'donate-to-worker-solidarity-fund',
    title: 'Donate To A Worker Solidarity Fund',
    summary: 'Support workers who need material backing during a pressure campaign.',
    description:
      'Contribute to a vetted worker solidarity fund so workers can sustain public pressure while facing retaliation, reduced hours, or strike-related costs.',
    externalUrl: 'https://aflcio.org/about-us/donate-to-the-afl-cio',
    actionType: ActionType.DONATE,
    status: EntityStatus.PUBLISHED,
    publishedAt: new Date('2026-06-07T00:00:00.000Z'),
    topicSlugs: ['consumer-activism', 'economic-justice'],
    articleSlugs: ['how-to-read-a-corporate-pressure-campaign'],
  },
  {
    slug: 'email-school-board-about-library-access',
    title: 'Email The School Board About Library Access',
    summary: 'Send a specific message defending access to books and librarians.',
    description:
      'Email board members before the next meeting with one concrete ask: preserve library access, oppose removals without due process, and keep review rules public.',
    externalUrl: 'https://www.ala.org/advocacy/contact-your-representatives',
    actionType: ActionType.CONTACT,
    status: EntityStatus.PUBLISHED,
    publishedAt: new Date('2026-06-08T00:00:00.000Z'),
    topicSlugs: ['education', 'civil-rights', 'local-community'],
    articleSlugs: [
      'defend-library-access-in-your-school-district',
      'building-a-local-campaign-from-first-meeting-to-public-pressure',
    ],
  },
  {
    slug: 'volunteer-with-friends-of-the-library',
    title: 'Volunteer With A Friends Of The Library Group',
    summary: 'Build durable local support around access, programming, and public visibility.',
    description:
      'Join a local library-support group to help with turnout, outreach, and public education around why free access to books and staff matters.',
    externalUrl: 'https://www.ala.org/united/chapters',
    actionType: ActionType.VOLUNTEER,
    status: EntityStatus.PUBLISHED,
    publishedAt: new Date('2026-06-09T00:00:00.000Z'),
    topicSlugs: ['education', 'local-community'],
    articleSlugs: ['defend-library-access-in-your-school-district'],
  },
  {
    slug: 'testify-at-city-council-hearing',
    title: 'Testify At A City Council Hearing',
    summary: 'Use public comment to put a clear demand into the record.',
    description:
      'Prepare a short statement, sign up early, and connect your testimony to a specific vote, funding choice, or public rule change that officials cannot ignore.',
    externalUrl: 'https://www.usa.gov/local-governments',
    actionType: ActionType.CONTACT,
    status: EntityStatus.PUBLISHED,
    publishedAt: new Date('2026-06-10T00:00:00.000Z'),
    topicSlugs: ['democracy', 'civil-rights', 'local-community'],
    articleSlugs: [
      'what-public-comment-rules-can-tell-you',
      'building-a-local-campaign-from-first-meeting-to-public-pressure',
    ],
  },
  {
    slug: 'volunteer-as-election-protection-observer',
    title: 'Volunteer As An Election Protection Observer',
    summary: 'Document access problems and connect voters to rapid support.',
    description:
      'Join a local election-protection effort, learn the reporting process, and help track barriers such as long lines, polling-place confusion, or disability access failures.',
    externalUrl: 'https://866ourvote.org/volunteer/',
    actionType: ActionType.VOLUNTEER,
    status: EntityStatus.PUBLISHED,
    publishedAt: new Date('2026-06-11T00:00:00.000Z'),
    topicSlugs: ['democracy', 'local-community'],
    articleSlugs: [
      'protect-voting-access-in-your-county',
      'what-public-comment-rules-can-tell-you',
    ],
  },
  {
    slug: 'join-tenant-solidarity-network',
    title: 'Join A Tenant Solidarity Network',
    summary: 'Coordinate building-level outreach around heat, housing, and emergency response.',
    description:
      'Plug into a tenant network that can check on vulnerable neighbors, document unsafe conditions, and push for neighborhood-level heat and housing protections.',
    externalUrl: 'https://www.nlihc.org/take-action',
    actionType: ActionType.VOLUNTEER,
    status: EntityStatus.PUBLISHED,
    publishedAt: new Date('2026-06-12T00:00:00.000Z'),
    topicSlugs: ['climate', 'economic-justice', 'local-community'],
    articleSlugs: ['how-local-climate-policy-works', 'organize-for-neighborhood-heat-safety'],
  },
  {
    slug: 'deliver-mutual-aid-supply-drop',
    title: 'Deliver A Mutual Aid Supply Drop',
    summary: 'Coordinate a concrete supply run for neighbors during a local pressure campaign.',
    description:
      'Join a scheduled supply run that supports neighbors directly while organizers document unmet needs and connect them to public demands.',
    externalUrl: 'https://www.mutualaidhub.org/',
    actionType: ActionType.VOLUNTEER,
    status: EntityStatus.PUBLISHED,
    publishedAt: new Date('2026-06-13T00:00:00.000Z'),
    topicSlugs: ['local-community', 'economic-justice'],
    articleSlugs: ['how-mutual-aid-and-public-pressure-fit-together'],
  },
  {
    slug: 'review-next-school-board-agenda',
    title: 'Review The Next School Board Agenda',
    summary: 'Read the agenda early and flag decisions that deserve public attention.',
    description:
      'Scan the next school board agenda, compare it to the prior meeting, and share any policy, library, or curriculum items that need organized turnout.',
    externalUrl: 'https://ballotpedia.org/school_boards_overview',
    actionType: ActionType.GUIDE,
    status: EntityStatus.PUBLISHED,
    publishedAt: new Date('2026-06-14T00:00:00.000Z'),
    topicSlugs: ['education', 'democracy', 'local-community'],
    articleSlugs: ['what-a-school-board-agenda-can-reveal'],
  },
  {
    slug: 'join-statewide-day-of-action-turnout-team',
    title: 'Join The Statewide Day Of Action Turnout Team',
    summary: 'Help move supporters from RSVP to real turnout and follow-up.',
    description:
      'Support phonebanks, texts, and follow-up coordination so a statewide mobilization leads to sustained local participation afterward.',
    externalUrl: 'https://www.mobilize.us',
    actionType: ActionType.VOLUNTEER,
    status: EntityStatus.PUBLISHED,
    publishedAt: new Date('2026-06-15T00:00:00.000Z'),
    topicSlugs: ['civil-rights', 'climate', 'local-community'],
    articleSlugs: ['how-to-prepare-for-a-statewide-day-of-action'],
  },
  {
    slug: 'host-school-board-study-group',
    title: 'Host A School Board Study Group',
    summary: 'A draft-only action used for local API filtering checks.',
    description: 'This draft action should never appear on public read routes.',
    actionType: ActionType.GUIDE,
    status: EntityStatus.DRAFT,
    publishedAt: null,
    topicSlugs: ['education'],
    articleSlugs: ['draft-civic-content-playbook'],
  },
] as const;

const demoEvents = [
  {
    title: 'City Hall Transit Accountability Rally',
    summary: 'Residents gather before the transportation budget vote.',
    description:
      'A public rally focused on transit expansion, clean mobility, and equitable budget priorities before the city council vote.',
    website: 'https://www.mobilize.us',
    eventType: EventType.RALLY,
    status: EntityStatus.PUBLISHED,
    publishedAt: new Date('2026-06-13T08:00:00.000Z'),
    startTime: relativeDate({ daysFromNow: 7, hours: 17, minutes: 30 }),
    endTime: relativeDate({ daysFromNow: 7, hours: 19 }),
    locationName: 'City Hall Plaza',
    publicLocationDescription: 'Meeting room 2',
    addressLine1: '123 Main St',
    addressLine2: 'Suite 1A',
    city: 'Philadelphia',
    region: 'PA',
    postalCode: '19107',
    country: 'USA',
    topicSlugs: ['climate', 'local-community'],
    articleSlugs: ['how-local-climate-policy-works'],
    actionSlugs: ['contact-city-council-about-transit'],
    submission: {
      submissionType: SubmissionType.EVENT,
      status: SubmissionStatus.APPROVED,
      title: 'City Hall Transit Accountability Rally',
      summary: 'Residents gather before the transportation budget vote.',
      submittedContent:
        'Community-organized rally urging city officials to prioritize transit funding and equitable mobility.',
      eventType: EventType.RALLY,
      startTime: relativeDate({ daysFromNow: 7, hours: 17, minutes: 30 }),
      endTime: relativeDate({ daysFromNow: 7, hours: 19 }),
      locationName: 'City Hall Plaza',
      publicLocationDescription: 'Meeting room 2',
      addressLine1: '123 Main St',
      addressLine2: 'Suite 1A',
      city: 'Philadelphia',
      region: 'PA',
      postalCode: '19107',
      country: 'USA',
      contactEmail: 'events@example.org',
      submitterName: 'Jordan Lee',
      submitterEmail: 'jordan.lee@example.org',
      reviewNotes: 'Approved for demo data.',
      reviewedAt: new Date('2026-06-13T08:00:00.000Z'),
    },
  },
  {
    title: 'County Voting Access Workshop',
    summary: 'A practical workshop on monitoring county election policy.',
    description:
      'Residents learn how to follow board agendas, submit public comments, and track local election policy changes.',
    website: 'https://www.mobilize.us',
    eventType: EventType.WORKSHOP,
    status: EntityStatus.DRAFT,
    publishedAt: null,
    startTime: relativeDate({ daysFromNow: 14, hours: 18 }),
    endTime: relativeDate({ daysFromNow: 14, hours: 20 }),
    locationName: 'North Branch Library',
    addressLine1: '450 Walnut Ave',
    addressLine2: 'Suite 1B',
    publicLocationDescription: 'Meeting Room C',
    city: 'Philadelphia',
    region: 'PA',
    postalCode: '19123',
    country: 'USA',
    topicSlugs: ['democracy'],
    articleSlugs: ['protect-voting-access-in-your-county'],
    actionSlugs: ['attend-election-board-meeting'],
    submission: {
      submissionType: SubmissionType.EVENT,
      status: SubmissionStatus.APPROVED,
      title: 'County Voting Access Workshop',
      summary: 'A practical workshop on monitoring county election policy.',
      submittedContent:
        'An approved but not yet published workshop for local moderation and event linking checks.',
      eventType: EventType.WORKSHOP,
      startTime: relativeDate({ daysFromNow: 14, hours: 18 }),
      endTime: relativeDate({ daysFromNow: 14, hours: 20 }),
      locationName: 'North Branch Library',
      addressLine1: '450 Walnut Ave',
      addressLine2: 'Suite 1B',
      publicLocationDescription: 'Meeting Room C',
      city: 'Philadelphia',
      region: 'PA',
      postalCode: '19123',
      country: 'USA',
      contactEmail: 'democracy@example.org',
      submitterName: 'Casey Morgan',
      submitterEmail: 'casey.morgan@example.org',
      reviewNotes: 'Approved for demo data but left unpublished.',
      reviewedAt: relativeDate({ daysFromNow: -1, hours: 9 }),
    },
  },
  {
    title: 'Neighborhood Heat Safety Canvass Training',
    summary: 'Volunteers prepare for a summer heat-safety outreach effort.',
    description:
      'A practical training for residents who want to share cooling resources, check on vulnerable neighbors, and document building-level heat concerns before summer peaks.',
    website: 'https://www.mobilize.us',
    eventType: EventType.WORKSHOP,
    status: EntityStatus.PUBLISHED,
    publishedAt: new Date('2026-06-14T08:00:00.000Z'),
    startTime: relativeDate({ daysFromNow: 18, hours: 10 }),
    endTime: relativeDate({ daysFromNow: 18, hours: 12 }),
    locationName: 'Southside Community Center',
    publicLocationDescription: 'Community room near the rear entrance',
    addressLine1: '810 Reed Street',
    addressLine2: null,
    city: 'Philadelphia',
    region: 'PA',
    postalCode: '19146',
    country: 'USA',
    topicSlugs: ['climate', 'economic-justice', 'local-community'],
    articleSlugs: ['organize-for-neighborhood-heat-safety'],
    actionSlugs: ['join-tenant-solidarity-network', 'join-neighborhood-climate-coalition'],
    submission: {
      submissionType: SubmissionType.EVENT,
      status: SubmissionStatus.APPROVED,
      title: 'Neighborhood Heat Safety Canvass Training',
      summary: 'Volunteers prepare for a summer heat-safety outreach effort.',
      submittedContent:
        'Volunteer training focused on cooling-center information, neighbor check-ins, and documenting unsafe building conditions during heat emergencies.',
      eventType: EventType.WORKSHOP,
      startTime: relativeDate({ daysFromNow: 18, hours: 10 }),
      endTime: relativeDate({ daysFromNow: 18, hours: 12 }),
      locationName: 'Southside Community Center',
      publicLocationDescription: 'Community room near the rear entrance',
      addressLine1: '810 Reed Street',
      addressLine2: null,
      city: 'Philadelphia',
      region: 'PA',
      postalCode: '19146',
      country: 'USA',
      contactEmail: 'heat-safety@example.org',
      submitterName: 'Andre Williams',
      submitterEmail: 'andre.williams@example.org',
      reviewNotes: 'Approved for demo data.',
      reviewedAt: new Date('2026-06-14T08:00:00.000Z'),
    },
  },
  {
    title: 'Statewide Day Of Action Launch Meetup',
    summary: 'Organizers gather ahead of a coordinated statewide mobilization.',
    description:
      'A public organizing meetup focused on turnout, signage, accessibility planning, and local follow-up after a statewide day of action.',
    website: 'https://www.mobilize.us',
    eventType: EventType.MEETING,
    status: EntityStatus.PUBLISHED,
    publishedAt: new Date('2026-06-15T08:00:00.000Z'),
    startTime: relativeDate({ daysFromNow: 24, hours: 18 }),
    endTime: relativeDate({ daysFromNow: 24, hours: 20 }),
    locationName: 'Broad Street Organizing Hub',
    publicLocationDescription: 'Second floor meeting room',
    addressLine1: '1550 Broad Street',
    addressLine2: null,
    city: 'Philadelphia',
    region: 'PA',
    postalCode: '19146',
    country: 'USA',
    topicSlugs: ['civil-rights', 'climate', 'local-community'],
    articleSlugs: ['how-to-prepare-for-a-statewide-day-of-action'],
    actionSlugs: ['join-statewide-day-of-action-turnout-team'],
    submission: {
      submissionType: SubmissionType.EVENT,
      status: SubmissionStatus.APPROVED,
      title: 'Statewide Day Of Action Launch Meetup',
      summary: 'Organizers gather ahead of a coordinated statewide mobilization.',
      submittedContent:
        'A public meetup for volunteers handling turnout, accessibility planning, and post-event follow-up for a statewide mobilization.',
      eventType: EventType.MEETING,
      startTime: relativeDate({ daysFromNow: 24, hours: 18 }),
      endTime: relativeDate({ daysFromNow: 24, hours: 20 }),
      locationName: 'Broad Street Organizing Hub',
      publicLocationDescription: 'Second floor meeting room',
      addressLine1: '1550 Broad Street',
      addressLine2: null,
      city: 'Philadelphia',
      region: 'PA',
      postalCode: '19146',
      country: 'USA',
      contactEmail: 'organizing@example.org',
      submitterName: 'Leah Ortiz',
      submitterEmail: 'leah.ortiz@example.org',
      reviewNotes: 'Approved for demo data.',
      reviewedAt: new Date('2026-06-15T08:00:00.000Z'),
    },
  },
] as const;

const publishedDemoArticles = demoArticles.filter(
  (article) => article.status === EntityStatus.PUBLISHED,
);
const publishedDemoActions = demoActions.filter(
  (action) => action.status === EntityStatus.PUBLISHED,
);
const publishedDemoEvents = demoEvents.filter((event) => event.status === EntityStatus.PUBLISHED);

const generatedDemoArticles = Array.from(
  { length: Math.max(0, TARGET_PUBLISHED_ARTICLE_COUNT - publishedDemoArticles.length) },
  (_, index) => {
    const topic = topics[index % topics.length];
    const narrative = topicNarratives[topic.slug];
    const article = pickTopicEntry(topicArticlePool, topic.slug, index);
    const slug = buildGeneratedSlug(topic.slug, article.title);

    return {
      slug,
      title: article.title,
      summary: article.summary,
      content: buildGeneratedArticleContent(article.summary, narrative.articleBody),
      author: 'Find Your Fight Editorial',
      status: EntityStatus.PUBLISHED,
      publishedAt: publishedDateFromIndex(index),
      topicSlugs: [topic.slug],
      actionSlugs: [] as string[],
    };
  },
);

const generatedDemoActions = Array.from(
  { length: Math.max(0, TARGET_PUBLISHED_ACTION_COUNT - publishedDemoActions.length) },
  (_, index) => {
    const topic = topics[index % topics.length];
    const action = pickTopicEntry(topicActionPool, topic.slug, index);

    return {
      slug: buildGeneratedSlug(topic.slug, action.title),
      title: action.title,
      summary: action.summary,
      description: `${action.summary}

Use this action to plug into an ongoing campaign with a clear public target, not just a one-time expression of support.`,
      actionType: action.actionType,
      status: EntityStatus.PUBLISHED,
      publishedAt: publishedDateFromIndex(index),
      topicSlugs: [topic.slug],
      articleSlugs: [] as string[],
    };
  },
);

const eventRegions = [
  { region: 'NY', city: 'New York', postalCode: '10007' },
  { region: 'PA', city: 'Philadelphia', postalCode: '19107' },
  { region: 'CA', city: 'Los Angeles', postalCode: '90012' },
  { region: 'TX', city: 'Houston', postalCode: '77002' },
  { region: 'PR', city: 'San Juan', postalCode: '00901' },
];

const eventTypes = [
  EventType.PROTEST,
  EventType.RALLY,
  EventType.VOLUNTEER,
  EventType.TOWN_HALL,
  EventType.WORKSHOP,
  EventType.MEETING,
] as const;

const generatedDemoEvents = Array.from(
  { length: Math.max(0, TARGET_PUBLISHED_EVENT_COUNT - publishedDemoEvents.length) },
  (_, index) => {
    const topic = topics[index % topics.length];
    const regionData = eventRegions[index % eventRegions.length];
    const event = pickTopicEntry(topicEventPool, topic.slug, index);
    const startTime = relativeDate({ daysFromNow: 30 + index, hours: 18 });
    const endTime = relativeDate({ daysFromNow: 30 + index, hours: 20 });
    const locationName = `${regionData.city} Civic Center`;
    const eventSlug = buildGeneratedSlug(topic.slug, event.title);

    return {
      title: event.title,
      summary: event.summary,
      description: `${event.summary}

Come prepared to meet people working on the issue, understand the immediate ask, and leave knowing what follow-through matters after the event.`,
      website: `https://www.mobilize.us`,
      eventType: eventTypes[index % eventTypes.length],
      status: EntityStatus.PUBLISHED,
      publishedAt: publishedDateFromIndex(index),
      startTime,
      endTime,
      locationName,
      publicLocationDescription: 'Main room',
      addressLine1: `${100 + index} Civic Center Way`,
      addressLine2: null,
      city: regionData.city,
      region: regionData.region,
      postalCode: regionData.postalCode,
      country: 'USA',
      topicSlugs: [topic.slug],
      articleSlugs: [] as string[],
      actionSlugs: [] as string[],
      submission: {
        submissionType: SubmissionType.EVENT,
        status: SubmissionStatus.APPROVED,
        title: event.title,
        summary: event.summary,
        submittedContent: event.summary,
        eventType: eventTypes[index % eventTypes.length],
        startTime,
        endTime,
        locationName,
        publicLocationDescription: 'Main room',
        addressLine1: `${100 + index} Civic Center Way`,
        addressLine2: null,
        city: regionData.city,
        region: regionData.region,
        postalCode: regionData.postalCode,
        country: 'USA',
        website: `https://www.mobilize.us`,
        contactEmail: 'events@example.org',
        submitterName: 'Find Your Fight Demo Organizer',
        submitterEmail: 'organizer@example.org',
        reviewNotes: 'Approved for demo data.',
        reviewedAt: publishedDateFromIndex(index),
      },
    };
  },
);

const allDemoArticles = [...generatedDemoArticles, ...demoArticles];
const allDemoActions = [...generatedDemoActions, ...demoActions];
const allDemoEvents = [...generatedDemoEvents, ...demoEvents];

const demoPendingSubmissions = [
  {
    submissionType: SubmissionType.ARTICLE,
    status: SubmissionStatus.PENDING,
    title: 'Community Guide To Ballot Access Deadlines',
    summary:
      'A submitted explainer on helping neighbors understand registration and ballot access dates.',
    submittedContent: `Community volunteers are building a plain-language guide to county ballot access deadlines, registration windows, and where residents can confirm polling details.

The submission recommends linking official county pages, adding calendar reminders, and translating key dates into locally used languages.`,
    author: 'Maya Patel',
    submitterName: 'Maya Patel',
    submitterEmail: 'maya.patel@example.org',
    topicSlugs: ['democracy', 'local-community'],
    resourceLinks: ['https://www.usa.gov/absentee-voting', 'https://vote.gov/register/'],
  },
  {
    submissionType: SubmissionType.EVENT,
    status: SubmissionStatus.PENDING,
    title: 'Neighborhood Heat Safety Canvass',
    summary: 'Volunteers plan a door-to-door canvass focused on summer heat safety resources.',
    submittedContent:
      'A volunteer-led canvass to share cooling center locations, check on vulnerable neighbors, and collect building-level heat safety concerns.',
    eventType: EventType.VOLUNTEER,
    startTime: relativeDate({ daysFromNow: 21, hours: 10 }),
    endTime: relativeDate({ daysFromNow: 21, hours: 13 }),
    locationName: 'Southside Community Center',
    publicLocationDescription: 'Back parking lot',
    city: 'Philadelphia',
    region: 'PA',
    postalCode: '19146',
    country: 'USA',
    website: 'https://www.mobilize.us',
    contactEmail: 'heat-safety@example.org',
    submitterName: 'Andre Williams',
    submitterEmail: 'andre.williams@example.org',
    topicSlugs: ['climate', 'economic-justice', 'local-community'],
  },
] as const;

function getMode(): 'baseline' | 'demo' {
  return seedMode === 'demo' ? 'demo' : 'baseline';
}

async function seedTopics() {
  for (const topic of topics) {
    await prisma.topic.upsert({
      where: { slug: topic.slug },
      update: {
        name: topic.name,
        description: topic.description,
        color: topic.color,
      },
      create: topic,
    });
  }
}

async function seedDemoArticles() {
  const demoArticleSlugs = allDemoArticles.map((article) => article.slug);
  const staleGeneratedArticles = await prisma.article.findMany({
    where: {
      author: 'Find Your Fight Editorial',
      publishedAt: {
        gte: new Date('2026-01-01T00:00:00.000Z'),
        lt: new Date('2026-02-01T00:00:00.000Z'),
      },
      slug: {
        notIn: demoArticleSlugs,
      },
    },
    select: { id: true, publishedAt: true },
  });
  const staleGeneratedArticleIds = staleGeneratedArticles
    .filter((article) => isGeneratedDemoPublishedAt(article.publishedAt))
    .map((article) => article.id);

  if (staleGeneratedArticleIds.length > 0) {
    await prisma.$transaction([
      prisma.topicArticle.deleteMany({
        where: {
          articleId: {
            in: staleGeneratedArticleIds,
          },
        },
      }),
      prisma.articleAction.deleteMany({
        where: {
          articleId: {
            in: staleGeneratedArticleIds,
          },
        },
      }),
      prisma.articleEvent.deleteMany({
        where: {
          articleId: {
            in: staleGeneratedArticleIds,
          },
        },
      }),
      prisma.article.deleteMany({
        where: {
          id: {
            in: staleGeneratedArticleIds,
          },
        },
      }),
    ]);
  }

  for (const article of allDemoArticles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {
        title: article.title,
        summary: article.summary,
        content: article.content,
        status: article.status,
        author: article.author,
        publishedAt: article.publishedAt,
      },
      create: {
        slug: article.slug,
        title: article.title,
        summary: article.summary,
        content: article.content,
        status: article.status,
        author: article.author,
        publishedAt: article.publishedAt,
      },
    });
  }
}

async function seedDemoActions() {
  const demoActionSlugs = allDemoActions.map((action) => action.slug);
  const staleGeneratedActions = await prisma.action.findMany({
    where: {
      publishedAt: {
        gte: new Date('2026-01-01T00:00:00.000Z'),
        lt: new Date('2026-02-01T00:00:00.000Z'),
      },
      slug: {
        notIn: demoActionSlugs,
      },
    },
    select: { id: true, publishedAt: true },
  });
  const staleGeneratedActionIds = staleGeneratedActions
    .filter((action) => isGeneratedDemoPublishedAt(action.publishedAt))
    .map((action) => action.id);

  if (staleGeneratedActionIds.length > 0) {
    await prisma.$transaction([
      prisma.topicAction.deleteMany({
        where: {
          actionId: {
            in: staleGeneratedActionIds,
          },
        },
      }),
      prisma.articleAction.deleteMany({
        where: {
          actionId: {
            in: staleGeneratedActionIds,
          },
        },
      }),
      prisma.actionEvent.deleteMany({
        where: {
          actionId: {
            in: staleGeneratedActionIds,
          },
        },
      }),
      prisma.action.deleteMany({
        where: {
          id: {
            in: staleGeneratedActionIds,
          },
        },
      }),
    ]);
  }

  for (const action of allDemoActions) {
    const externalUrl = 'externalUrl' in action ? (action.externalUrl ?? null) : null;
    await prisma.action.upsert({
      where: { slug: action.slug },
      update: {
        title: action.title,
        summary: action.summary,
        description: action.description,
        externalUrl,
        actionType: action.actionType,
        status: action.status,
        publishedAt: action.publishedAt,
      },
      create: {
        slug: action.slug,
        title: action.title,
        summary: action.summary,
        description: action.description,
        externalUrl,
        actionType: action.actionType,
        status: action.status,
        publishedAt: action.publishedAt,
      },
    });
  }
}

async function seedDemoEvents() {
  const demoEventWebsites = allDemoEvents.map((event) => event.website);
  const staleGeneratedEvents = await prisma.event.findMany({
    where: {
      publishedAt: {
        gte: new Date('2026-01-01T00:00:00.000Z'),
        lt: new Date('2026-02-01T00:00:00.000Z'),
      },
      website: {
        notIn: demoEventWebsites,
      },
    },
    select: { id: true, publishedAt: true },
  });
  const staleGeneratedEventIds = staleGeneratedEvents
    .filter((record) => isGeneratedDemoPublishedAt(record.publishedAt))
    .map((record) => record.id);

  if (staleGeneratedEventIds.length > 0) {
    await prisma.$transaction([
      prisma.topicEvent.deleteMany({
        where: {
          eventId: {
            in: staleGeneratedEventIds,
          },
        },
      }),
      prisma.articleEvent.deleteMany({
        where: {
          eventId: {
            in: staleGeneratedEventIds,
          },
        },
      }),
      prisma.actionEvent.deleteMany({
        where: {
          eventId: {
            in: staleGeneratedEventIds,
          },
        },
      }),
      prisma.submission.deleteMany({
        where: {
          eventId: {
            in: staleGeneratedEventIds,
          },
        },
      }),
      prisma.event.deleteMany({
        where: {
          id: {
            in: staleGeneratedEventIds,
          },
        },
      }),
    ]);
  }

  const existingDemoEvents = await prisma.event.findMany({
    where: {
      website: {
        in: demoEventWebsites,
      },
    },
    select: { id: true },
  });

  if (existingDemoEvents.length > 0) {
    const existingDemoEventIds = existingDemoEvents.map((record) => record.id);

    await prisma.$transaction([
      prisma.topicEvent.deleteMany({
        where: {
          eventId: {
            in: existingDemoEventIds,
          },
        },
      }),
      prisma.articleEvent.deleteMany({
        where: {
          eventId: {
            in: existingDemoEventIds,
          },
        },
      }),
      prisma.actionEvent.deleteMany({
        where: {
          eventId: {
            in: existingDemoEventIds,
          },
        },
      }),
      prisma.submission.deleteMany({
        where: {
          eventId: {
            in: existingDemoEventIds,
          },
        },
      }),
      prisma.event.deleteMany({
        where: {
          id: {
            in: existingDemoEventIds,
          },
        },
      }),
    ]);
  }

  for (const event of allDemoEvents) {
    await prisma.event.create({
      data: {
        title: event.title,
        summary: event.summary,
        description: event.description,
        eventType: event.eventType,
        status: event.status,
        website: event.website,
        publishedAt: event.publishedAt,
        startTime: event.startTime,
        endTime: event.endTime,
        locationName: event.locationName,
        addressLine1: event.addressLine1,
        addressLine2: event.addressLine2,
        publicLocationDescription: event.publicLocationDescription,
        city: event.city,
        region: event.region,
        postalCode: event.postalCode,
        country: event.country,
        submission: {
          create: event.submission,
        },
      },
    });
  }
}

async function getTopicIds() {
  const records = await prisma.topic.findMany({
    select: { id: true, slug: true },
  });

  return new Map(records.map((record) => [record.slug, record.id]));
}

async function getArticleIds() {
  const records = await prisma.article.findMany({
    select: { id: true, slug: true },
  });

  return new Map(records.map((record) => [record.slug, record.id]));
}

async function getActionIds() {
  const records = await prisma.action.findMany({
    select: { id: true, slug: true },
  });

  return new Map(records.map((record) => [record.slug, record.id]));
}

async function getEventIds() {
  const records = await prisma.event.findMany({
    select: { id: true, website: true },
  });

  return new Map(records.map((record) => [record.website ?? '', record.id]));
}

function requireId<T>(map: Map<string, T>, key: string, label: string): T {
  const id = map.get(key);
  if (!id) {
    throw new Error(`Missing ${label}: ${key}`);
  }

  return id;
}

async function seedDemoPendingSubmissions(topicIds: Map<string, number>) {
  for (const submission of demoPendingSubmissions) {
    const existingSubmission = await prisma.submission.findFirst({
      where: {
        submissionType: submission.submissionType,
        status: SubmissionStatus.PENDING,
        title: submission.title,
      },
      select: { id: true },
    });

    const { topicSlugs, resourceLinks, ...submissionData } = {
      ...submission,
      resourceLinks: 'resourceLinks' in submission ? submission.resourceLinks : undefined,
    };
    const submissionTopics = {
      create: topicSlugs.map((topicSlug: string) => ({
        topicId: requireId(topicIds, topicSlug, 'topic'),
      })),
    };
    const submissionResourceLinks =
      resourceLinks != null
        ? {
            create: resourceLinks.map((url) => ({
              resourceLink: {
                connectOrCreate: {
                  where: { url },
                  create: { url },
                },
              },
            })),
          }
        : undefined;

    if (existingSubmission) {
      await prisma.submission.update({
        where: { id: existingSubmission.id },
        data: {
          ...submissionData,
          reviewNotes: null,
          reviewedAt: null,
          articleId: null,
          eventId: null,
          submissionTopics: {
            deleteMany: {},
            ...submissionTopics,
          },
          submissionResourceLinks: {
            deleteMany: {},
            ...(submissionResourceLinks ?? {}),
          },
        },
      });

      continue;
    }

    await prisma.submission.create({
      data: {
        ...submissionData,
        submissionTopics,
        submissionResourceLinks,
      },
    });
  }
}

async function connectArticleTopics(
  topicIds: Map<string, number>,
  articleIds: Map<string, number>,
) {
  for (const article of allDemoArticles) {
    const articleId = requireId(articleIds, article.slug, 'article');

    for (const topicSlug of article.topicSlugs) {
      await prisma.topicArticle.upsert({
        where: {
          topicId_articleId: {
            topicId: requireId(topicIds, topicSlug, 'topic'),
            articleId,
          },
        },
        update: {
          assignedBy: 'seed',
        },
        create: {
          topicId: requireId(topicIds, topicSlug, 'topic'),
          articleId,
          assignedBy: 'seed',
        },
      });
    }
  }
}

async function connectActionTopics(topicIds: Map<string, number>, actionIds: Map<string, number>) {
  for (const action of allDemoActions) {
    const actionId = requireId(actionIds, action.slug, 'action');

    for (const topicSlug of action.topicSlugs) {
      await prisma.topicAction.upsert({
        where: {
          topicId_actionId: {
            topicId: requireId(topicIds, topicSlug, 'topic'),
            actionId,
          },
        },
        update: {
          assignedBy: 'seed',
        },
        create: {
          topicId: requireId(topicIds, topicSlug, 'topic'),
          actionId,
          assignedBy: 'seed',
        },
      });
    }
  }
}

async function connectArticleActions(
  articleIds: Map<string, number>,
  actionIds: Map<string, number>,
) {
  for (const article of allDemoArticles) {
    const articleId = requireId(articleIds, article.slug, 'article');

    for (const actionSlug of article.actionSlugs) {
      await prisma.articleAction.upsert({
        where: {
          articleId_actionId: {
            articleId,
            actionId: requireId(actionIds, actionSlug, 'action'),
          },
        },
        update: {
          assignedBy: 'seed',
        },
        create: {
          articleId,
          actionId: requireId(actionIds, actionSlug, 'action'),
          assignedBy: 'seed',
        },
      });
    }
  }
}

async function connectTopicEvents(topicIds: Map<string, number>, eventIds: Map<string, number>) {
  for (const event of allDemoEvents) {
    const eventId = requireId(eventIds, event.website, 'event');

    for (const topicSlug of event.topicSlugs) {
      await prisma.topicEvent.upsert({
        where: {
          topicId_eventId: {
            topicId: requireId(topicIds, topicSlug, 'topic'),
            eventId,
          },
        },
        update: {
          assignedBy: 'seed',
        },
        create: {
          topicId: requireId(topicIds, topicSlug, 'topic'),
          eventId,
          assignedBy: 'seed',
        },
      });
    }
  }
}

async function connectArticleEvents(
  articleIds: Map<string, number>,
  eventIds: Map<string, number>,
) {
  for (const event of allDemoEvents) {
    const eventId = requireId(eventIds, event.website, 'event');

    for (const articleSlug of event.articleSlugs) {
      await prisma.articleEvent.upsert({
        where: {
          articleId_eventId: {
            articleId: requireId(articleIds, articleSlug, 'article'),
            eventId,
          },
        },
        update: {
          assignedBy: 'seed',
        },
        create: {
          articleId: requireId(articleIds, articleSlug, 'article'),
          eventId,
          assignedBy: 'seed',
        },
      });
    }
  }
}

async function connectActionEvents(actionIds: Map<string, number>, eventIds: Map<string, number>) {
  for (const event of allDemoEvents) {
    const eventId = requireId(eventIds, event.website, 'event');

    for (const actionSlug of event.actionSlugs) {
      await prisma.actionEvent.upsert({
        where: {
          actionId_eventId: {
            actionId: requireId(actionIds, actionSlug, 'action'),
            eventId,
          },
        },
        update: {
          assignedBy: 'seed',
        },
        create: {
          actionId: requireId(actionIds, actionSlug, 'action'),
          eventId,
          assignedBy: 'seed',
        },
      });
    }
  }
}

async function seedDemoRelationships() {
  const topicIds = await getTopicIds();
  const articleIds = await getArticleIds();
  const actionIds = await getActionIds();
  const eventIds = await getEventIds();

  await connectArticleTopics(topicIds, articleIds);
  await connectActionTopics(topicIds, actionIds);
  await connectArticleActions(articleIds, actionIds);
  await connectTopicEvents(topicIds, eventIds);
  await connectArticleEvents(articleIds, eventIds);
  await connectActionEvents(actionIds, eventIds);
  await seedDemoPendingSubmissions(topicIds);
}

async function seedDemoAdminUser() {
  const passwordHash = await bcrypt.hash(demoAdminPassword, 10);

  await prisma.adminUser.upsert({
    where: {
      email: demoAdminEmail,
    },
    update: {
      passwordHash,
      isActive: true,
    },
    create: {
      email: demoAdminEmail,
      passwordHash,
      isActive: true,
    },
  });

  console.log(
    `[seed] Demo admin user ready: email=${demoAdminEmail} password=${demoAdminPassword}`,
  );
}

async function seedDemo() {
  await seedDemoArticles();
  await seedDemoActions();
  await seedDemoEvents();
  await seedDemoRelationships();
  await seedDemoAdminUser();
}

async function main() {
  await seedTopics();

  if (getMode() === 'demo') {
    await seedDemo();
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });

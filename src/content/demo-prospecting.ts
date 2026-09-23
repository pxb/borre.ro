// Demo data for the prospecting portal showcase (#560). Everything here is
// invented: the client (a coffee roaster), every prospect and every person.
// Company names were checked against the Companies House register (no match).
// Emails are masked so no address can belong to a real person. The shape
// mirrors the real research pack (insight-energy docs/prospecting-pack-shape.md).

export type Status = "new" | "sent" | "reply" | "meeting";
export type Evidence = "Verified" | "Likely" | "Unverified";
export type Contact = {
  name: string;
  role: string;
  email: string; // masked
  state: "ready" | "verify";
  linkedin: boolean;
};
export type Touch = { when: string; subject: string; body: string };
export type DemoLead = {
  id: string;
  name: string;
  town: string;
  batch: "W37" | "W38";
  signal: string; // the short signal shown on the board
  offer: "Office coffee" | "Café wholesale" | "Hospitality";
  sector: string; // board chart category
  fit: number;
  status: Status;
  researched: string; // ISO date
  contactState: "ready" | "verify" | "none";
  group?: string;
  // brief
  summary: string;
  facts: [string, string][];
  qualification: { axis: string; finding: string; status: Evidence; source: string }[];
  signals: { text: string; source: string; date: string }[];
  approach: string;
  contacts: Contact[];
  sequence: Touch[];
  trail: string[]; // how the lead got here: register, signal, research, brief
};

export const demoClient = {
  name: "Kiln & Kettle Coffee Roasters",
  short: "Kiln & Kettle",
  region: "Greater Manchester",
  offers: ["Office coffee", "Café wholesale", "Hospitality"] as const,
};

export const batches = [
  { label: "W38", wc: "W/C 15 Sep" },
  { label: "W37", wc: "W/C 8 Sep" },
] as const;

// Shape only: the narrowing from the register to the week's list. Used for the
// funnel strip; no stage carries a count (method, not a scoreboard).
export const demoFunnel = [
  "Every company in the area",
  "Fits the profile",
  "A reason to call now",
  "Researched",
  "Sent",
  "Reply",
  "Meeting",
];

// The client's won business by sector, for the "this week against won deals"
// chart. Invented, like everything else here.
export const wonMix: Record<string, number> = {
  Workplaces: 41,
  Hospitality: 27,
  Fitness: 12,
  Retail: 11,
  Other: 9,
};

const seq = (first: string, company: string, pitch: string, proof: string): Touch[] => [
  {
    when: "Day 1",
    subject: `Coffee at ${company}`,
    body: `Hi ${first},\n\n${pitch}\n\nWe roast in Ancoats and supply offices and cafés across Greater Manchester. ${proof}\n\nWorth a quick call next week?\n\nTom`,
  },
  {
    when: "Day 4",
    subject: `RE: Coffee at ${company}`,
    body: `Hi ${first},\n\nHappy to drop off a few bags for the team to try, no strings. Just tell me where to send them.\n\nTom`,
  },
  {
    when: "Day 9",
    subject: `RE: Coffee at ${company}`,
    body: `Hi ${first},\n\nOne thing I should have said: we set up the machine, train whoever runs it and handle the servicing, so there's nothing for your team to manage.\n\nTom`,
  },
  {
    when: "Day 16",
    subject: `RE: Coffee at ${company}`,
    body: `Hi ${first},\n\nI'll leave it there for now. If coffee comes up again, you know where I am.\n\nTom`,
  },
];

export const demoLeads: DemoLead[] = [
  {
    id: "ashcombe",
    name: "Ashcombe Studios",
    town: "Manchester",
    batch: "W38",
    signal: "Second site opening",
    offer: "Café wholesale",
    sector: "Workplaces",
    fit: 4.8,
    status: "new",
    researched: "2026-09-16",
    contactState: "ready",
    group: "2 sites",
    summary:
      "A co-working operator with a building in the Northern Quarter and a second site opening in Salford this winter. Members pay for the café, so coffee quality is part of what they sell.",
    facts: [
      ["Sector", "Co-working and serviced offices"],
      ["Size", "About 35 staff, 600 members"],
      ["Location", "Northern Quarter, Manchester"],
      ["On the register since", "2016"],
    ],
    qualification: [
      { axis: "Sector", finding: "Workplace with a member café, the client's strongest segment.", status: "Verified", source: "Company website" },
      { axis: "Size", finding: "Two sites and around 600 members once the second opens.", status: "Likely", source: "Press release" },
      { axis: "Coffee today", finding: "Café menu lists a national chain's beans.", status: "Verified", source: "Café menu" },
      { axis: "Timing", finding: "Second site fit-out under way, opening in December.", status: "Verified", source: "Planning portal" },
      { axis: "Decision maker", finding: "Operations director signs off suppliers.", status: "Likely", source: "LinkedIn" },
    ],
    signals: [
      { text: "Planning approved for a ground-floor café at the new Salford site.", source: "Salford planning portal", date: "2026-09-03" },
      { text: "Hiring a café lead for the new building.", source: "Job board", date: "2026-09-10" },
    ],
    approach:
      "Lead with café wholesale for the new site, where the supplier isn't chosen yet. Offer to train the new café lead. Closest proof is the Ancoats co-working account.",
    contacts: [
      { name: "Hannah Okafor", role: "Operations Director", email: "h.ok•••@ashcombe•••.co.uk", state: "ready", linkedin: true },
      { name: "Ravi Mistry", role: "Community Manager", email: "ravi@ashcombe•••.co.uk", state: "verify", linkedin: true },
    ],
    sequence: seq(
      "Hannah",
      "Ashcombe",
      "Saw the Salford café got planning, congratulations. If you haven't settled on a coffee supplier for it yet, I'd love to put us in the running.",
      "We look after another co-working space in Ancoats, where member café sales went up after the switch.",
    ),
    trail: ["Found on the register", "Planning approval spotted", "Researched and contacts checked", "Brief ready for review"],
  },
  {
    id: "halden-pryce",
    name: "Halden & Pryce",
    town: "Manchester",
    batch: "W38",
    signal: "Moving office",
    offer: "Office coffee",
    sector: "Workplaces",
    fit: 4.5,
    status: "sent",
    researched: "2026-09-15",
    contactState: "ready",
    summary:
      "A commercial law firm moving to a larger office on Spinningfields in the new year. Client meetings happen on site, so the kitchen and meeting-room coffee get noticed.",
    facts: [
      ["Sector", "Legal services"],
      ["Size", "About 80 staff"],
      ["Location", "Spinningfields, Manchester"],
      ["On the register since", "2009"],
    ],
    qualification: [
      { axis: "Sector", finding: "Professional services office with client-facing meeting rooms.", status: "Verified", source: "Company website" },
      { axis: "Size", finding: "Around 80 staff across two floors.", status: "Likely", source: "LinkedIn" },
      { axis: "Coffee today", finding: "Pod machines in the current office.", status: "Unverified", source: "Office photos" },
      { axis: "Timing", finding: "Lease signed on the new office, move planned for January.", status: "Verified", source: "Property news" },
      { axis: "Decision maker", finding: "Office manager runs the move and supplier list.", status: "Likely", source: "Job advert" },
    ],
    signals: [
      { text: "Took a 20,000 sq ft lease in Spinningfields.", source: "Property news", date: "2026-09-02" },
      { text: "Hiring a facilities and office manager.", source: "Job board", date: "2026-09-12" },
    ],
    approach:
      "Lead with office coffee as part of the move, when the kitchen spec is being decided. Meeting-room service is the angle.",
    contacts: [
      { name: "Clare Denholm", role: "Office Manager", email: "c.den•••@haldenpr•••.co.uk", state: "ready", linkedin: true },
    ],
    sequence: seq(
      "Clare",
      "Halden & Pryce",
      "I read about the move to Spinningfields. While the kitchen and meeting rooms are being planned, it might be worth a conversation about coffee.",
      "We set up bean-to-cup machines for a few firms nearby and handle the servicing.",
    ),
    trail: ["Found on the register", "New lease spotted", "Researched and contacts checked", "Brief ready for review"],
  },
  {
    id: "copperfield",
    name: "Copperfield Hotel Group",
    town: "Altrincham",
    batch: "W38",
    signal: "Refurbishment",
    offer: "Hospitality",
    sector: "Hospitality",
    fit: 4.3,
    status: "reply",
    researched: "2026-09-15",
    contactState: "ready",
    group: "3 hotels",
    summary:
      "A small group of boutique hotels in south Manchester, refurbishing its largest hotel's lobby bar. Breakfast and the lobby café are where guests judge the coffee.",
    facts: [
      ["Sector", "Hotels"],
      ["Size", "Three hotels, about 120 staff"],
      ["Location", "Altrincham"],
      ["On the register since", "2012"],
    ],
    qualification: [
      { axis: "Sector", finding: "Independent hotels, the client's second segment.", status: "Verified", source: "Company website" },
      { axis: "Size", finding: "Three hotels with restaurants.", status: "Verified", source: "Company website" },
      { axis: "Coffee today", finding: "Supplier not named publicly.", status: "Unverified", source: "Menus" },
      { axis: "Timing", finding: "Lobby bar refurbishment finishing in November.", status: "Likely", source: "Local news" },
      { axis: "Decision maker", finding: "Group food and beverage manager.", status: "Verified", source: "LinkedIn" },
    ],
    signals: [
      { text: "Lobby bar refurbishment at the Altrincham hotel reported.", source: "Local news", date: "2026-09-05" },
    ],
    approach:
      "Lead with hospitality: a relaunch blend for the new lobby bar and barista training for the reopening.",
    contacts: [
      { name: "Marco Bellini", role: "Group F&B Manager", email: "marco.b•••@copperf•••.co.uk", state: "ready", linkedin: true },
    ],
    sequence: seq(
      "Marco",
      "Copperfield",
      "Congratulations on the lobby bar refurb. A relaunch is a good moment to look at the coffee, and we'd be glad to put a blend together for it.",
      "We supply two independent hotels in Cheshire and train their teams before busy periods.",
    ),
    trail: ["Found on the register", "Refurbishment spotted", "Researched and contacts checked", "Brief ready for review"],
  },
  {
    id: "quillfield",
    name: "Quillfield Software",
    town: "Salford",
    batch: "W38",
    signal: "Raised funding",
    offer: "Office coffee",
    sector: "Workplaces",
    fit: 4.1,
    status: "new",
    researched: "2026-09-16",
    contactState: "verify",
    summary:
      "A software company at MediaCity that raised a funding round this summer and is hiring fast. Growing teams usually upgrade the office kitchen within a year.",
    facts: [
      ["Sector", "Software"],
      ["Size", "About 60 staff, hiring"],
      ["Location", "MediaCity, Salford"],
      ["On the register since", "2019"],
    ],
    qualification: [
      { axis: "Sector", finding: "Office-based tech team.", status: "Verified", source: "Company website" },
      { axis: "Size", finding: "Around 60 staff, 14 open roles.", status: "Likely", source: "Careers page" },
      { axis: "Coffee today", finding: "Not known.", status: "Unverified", source: "None found" },
      { axis: "Timing", finding: "Funding announced in July, headcount growing.", status: "Verified", source: "Press release" },
      { axis: "Decision maker", finding: "Head of People runs the office.", status: "Likely", source: "LinkedIn" },
    ],
    signals: [
      { text: "Announced a Series A round.", source: "Press release", date: "2026-07-22" },
      { text: "Fourteen open roles on the careers page.", source: "Careers page", date: "2026-09-14" },
    ],
    approach: "Lead with office coffee as a perk for a growing team. Offer a tasting at the next all-hands.",
    contacts: [
      { name: "Priya Anand", role: "Head of People", email: "priya@quillf•••.io", state: "verify", linkedin: true },
    ],
    sequence: [],
    trail: ["Found on the register", "Funding round spotted", "Researched, contact still to check", "Brief ready for review"],
  },
  {
    id: "tallow-street",
    name: "Tallow Street Fitness",
    town: "Stockport",
    batch: "W38",
    signal: "Adding a café",
    offer: "Café wholesale",
    sector: "Fitness",
    fit: 3.9,
    status: "new",
    researched: "2026-09-16",
    contactState: "ready",
    group: "4 gyms",
    summary:
      "An independent gym chain adding a café to its flagship. Members already buy post-workout drinks there, so coffee is a natural add-on.",
    facts: [
      ["Sector", "Gyms"],
      ["Size", "Four gyms, about 50 staff"],
      ["Location", "Stockport"],
      ["On the register since", "2015"],
    ],
    qualification: [
      { axis: "Sector", finding: "Fitness, a smaller but growing segment for the client.", status: "Verified", source: "Company website" },
      { axis: "Size", finding: "Four sites.", status: "Verified", source: "Company website" },
      { axis: "Coffee today", finding: "No café yet.", status: "Likely", source: "Gym listings" },
      { axis: "Timing", finding: "Café fit-out advertised for October.", status: "Likely", source: "Social posts" },
      { axis: "Decision maker", finding: "Founder still runs purchasing.", status: "Likely", source: "LinkedIn" },
    ],
    signals: [
      { text: "Posted that a café is coming to the Stockport gym in October.", source: "Company social posts", date: "2026-09-09" },
    ],
    approach: "Lead with café wholesale and a simple machine the gym staff can run between classes.",
    contacts: [
      { name: "Dan Whitlock", role: "Founder", email: "dan@tallowst•••.co.uk", state: "ready", linkedin: false },
    ],
    sequence: [],
    trail: ["Found on the register", "Café plans spotted", "Researched and contacts checked", "Brief ready for review"],
  },
  {
    id: "orrin",
    name: "Orrin Architects",
    town: "Manchester",
    batch: "W37",
    signal: "Hiring",
    offer: "Office coffee",
    sector: "Workplaces",
    fit: 3.8,
    status: "meeting",
    researched: "2026-09-09",
    contactState: "ready",
    summary:
      "An architecture practice in Ancoats that has doubled in size in two years. The studio hosts client reviews most weeks.",
    facts: [
      ["Sector", "Architecture"],
      ["Size", "About 40 staff"],
      ["Location", "Ancoats, Manchester"],
      ["On the register since", "2011"],
    ],
    qualification: [
      { axis: "Sector", finding: "Design studio with regular client visits.", status: "Verified", source: "Company website" },
      { axis: "Size", finding: "Around 40 staff.", status: "Verified", source: "Company website" },
      { axis: "Coffee today", finding: "Filter coffee, per a studio tour video.", status: "Likely", source: "Company video" },
      { axis: "Timing", finding: "Six roles advertised this month.", status: "Verified", source: "Job board" },
      { axis: "Decision maker", finding: "Studio manager.", status: "Likely", source: "LinkedIn" },
    ],
    signals: [{ text: "Six new roles advertised.", source: "Job board", date: "2026-09-04" }],
    approach: "Lead with office coffee for client reviews. They're five minutes from the roastery, so offer a visit.",
    contacts: [
      { name: "Sophie Lang", role: "Studio Manager", email: "s.lang@orrin•••.co.uk", state: "ready", linkedin: true },
    ],
    sequence: [],
    trail: ["Found on the register", "Hiring spotted", "Researched and contacts checked", "Brief ready for review"],
  },
  {
    id: "marlpit",
    name: "Marlpit Garden Centre",
    town: "Bolton",
    batch: "W37",
    signal: "Café expansion",
    offer: "Café wholesale",
    sector: "Retail",
    fit: 3.6,
    status: "sent",
    researched: "2026-09-08",
    contactState: "ready",
    summary:
      "A family-run garden centre extending its café seating by half. Weekend café trade is a big part of the business.",
    facts: [
      ["Sector", "Garden centre"],
      ["Size", "About 70 staff"],
      ["Location", "Bolton"],
      ["On the register since", "1998"],
    ],
    qualification: [
      { axis: "Sector", finding: "Destination café inside a retailer.", status: "Verified", source: "Company website" },
      { axis: "Size", finding: "Around 70 staff.", status: "Likely", source: "LinkedIn" },
      { axis: "Coffee today", finding: "Uses a regional supplier.", status: "Likely", source: "Café menu" },
      { axis: "Timing", finding: "Café extension approved.", status: "Verified", source: "Planning portal" },
      { axis: "Decision maker", finding: "Café manager and owner.", status: "Likely", source: "Company website" },
    ],
    signals: [{ text: "Planning approved for a larger café.", source: "Bolton planning portal", date: "2026-08-28" }],
    approach: "Lead with café wholesale and a taste test against their current beans.",
    contacts: [
      { name: "Gail Moorcroft", role: "Café Manager", email: "gail@marlpit•••.co.uk", state: "ready", linkedin: false },
    ],
    sequence: [],
    trail: ["Found on the register", "Planning approval spotted", "Researched and contacts checked", "Brief ready for review"],
  },
  {
    id: "bramlow",
    name: "Bramlow Motor Group",
    town: "Wigan",
    batch: "W37",
    signal: "New showroom",
    offer: "Hospitality",
    sector: "Other",
    fit: 3.4,
    status: "new",
    researched: "2026-09-09",
    contactState: "verify",
    group: "5 dealerships",
    summary:
      "A car dealership group opening a new showroom with a customer lounge. Buyers wait around while cars are prepared, and the lounge coffee is part of the experience.",
    facts: [
      ["Sector", "Car dealerships"],
      ["Size", "Five dealerships"],
      ["Location", "Wigan"],
      ["On the register since", "2004"],
    ],
    qualification: [
      { axis: "Sector", finding: "Customer lounges, a fit for the hospitality offer.", status: "Likely", source: "Company website" },
      { axis: "Size", finding: "Five sites.", status: "Verified", source: "Company website" },
      { axis: "Coffee today", finding: "Not known.", status: "Unverified", source: "None found" },
      { axis: "Timing", finding: "New showroom opening in the spring.", status: "Verified", source: "Local news" },
      { axis: "Decision maker", finding: "Group marketing manager, not yet confirmed.", status: "Unverified", source: "LinkedIn" },
    ],
    signals: [{ text: "New showroom announced for the spring.", source: "Local news", date: "2026-09-01" }],
    approach: "Lead with hospitality for the new customer lounge, then roll out to the other four sites.",
    contacts: [
      { name: "Lee Farrant", role: "Group Marketing Manager", email: "l.far•••@bramlow•••.co.uk", state: "verify", linkedin: true },
    ],
    sequence: [],
    trail: ["Found on the register", "New showroom spotted", "Researched, contact still to check", "Brief ready for review"],
  },
  {
    id: "wexcombe",
    name: "Wexcombe Dental Group",
    town: "Bury",
    batch: "W37",
    signal: "New practice",
    offer: "Office coffee",
    sector: "Other",
    fit: 3.1,
    status: "new",
    researched: "2026-09-08",
    contactState: "none",
    group: "6 practices",
    summary:
      "A group of private dental practices opening its sixth. Patient waiting rooms are the use case, which makes this a smaller, repeatable order.",
    facts: [
      ["Sector", "Private dental practices"],
      ["Size", "Six practices"],
      ["Location", "Bury"],
      ["On the register since", "2013"],
    ],
    qualification: [
      { axis: "Sector", finding: "Waiting rooms, an edge case for the client.", status: "Likely", source: "Company website" },
      { axis: "Size", finding: "Six practices.", status: "Verified", source: "Company website" },
      { axis: "Coffee today", finding: "Not known.", status: "Unverified", source: "None found" },
      { axis: "Timing", finding: "Sixth practice opening in October.", status: "Verified", source: "Company website" },
      { axis: "Decision maker", finding: "Not found yet.", status: "Unverified", source: "None found" },
    ],
    signals: [{ text: "Sixth practice opening in October.", source: "Company website", date: "2026-09-02" }],
    approach: "Low priority. Worth a call only once a practice manager is found.",
    contacts: [],
    sequence: [],
    trail: ["Found on the register", "New practice spotted", "Researched, no contact found yet", "Brief ready for review"],
  },
];

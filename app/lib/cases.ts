export type ChapterItem = {
  part: string;
  title: string;
  description: string;
  image: string;
  video?: string;
  slug?: string; // undefined = coming soon
};

export type CaseSection =
  | { type: 'split'; label: string; heading: string; body: string; bullets?: string[]; image?: string; image2?: string; video?: string }
  | { type: 'centered'; label: string; heading: string; body: string; bullets?: string[] }
  | { type: 'carousel'; images: string[] }
  | { type: 'stats'; label: string; heading: string; body: string; bullets?: string[] }
  | { type: 'chapters'; label: string; heading: string; items: ChapterItem[] }
  | { type: 'cinematic'; src: string; shots?: { x: number; y: number; scale: number; hold: number; label?: string }[]; cursors?: { name: string; color: string; path: [number, number][]; stepDuration: number; startDelay: number }[]; height?: number; bg?: string };

export type CaseData = {
  slug: string;
  client: string;
  category: string;
  title: string;
  subtitle: string;
  heroLabel?: string;
  heroStats?: { value: string; label: string }[];
  websiteUrl?: string;
  tags: string[];
  heroImage: string;
  heroImages?: string[];
  heroVideo?: string;
  sections: CaseSection[];
};

const cases: CaseData[] = [
  {
    slug: 'regenerative-community',
    client: 'Chagüite',
    category: 'Brand Strategy & Growth',
    heroLabel: 'Brand Strategy · Identity',
    title: 'Built from the land.\nNot from the listing.',
    subtitle:
      "Fifty-plus hectares on Costa Rica's South Caribbean coast, bordered by protected reserves. The land had everything it needed to be extraordinary. The narrative had to catch up. Without the right story, the rarest parcel in the region would sell at an average price.",
    tags: ['Business', 'Branding', 'Architecture', 'Growth', 'Marketing'],
    heroImage: '/Chaguite/chaguite-hero.webp',
    heroImages: [
      '/Chaguite/hero.webp',
      '/Chaguite/concept-2.webp',
      '/Chaguite/billboard.webp',
      '/Chaguite/concept-89.webp',
      '/Chaguite/concept-1.webp',
      '/Chaguite/hf_interior_regen.webp',
      '/Chaguite/concept-5.webp',
    ],
    sections: [
      {
        type: 'split',
        label: 'The land',
        heading: 'Rare ecology. A commodity price.',
        body: "Fifty-plus hectares on Costa Rica's South Caribbean coast. Protected reserves on two sides. The kind of ecology that takes generations to build and one bad decision to lose. The founders knew what they had. The real question was whether that value would ever be legible to anyone else.\n\nWithout a story, land like this gets priced by comparison: against whatever sold nearby, whatever looks similar on paper. That math is neutral. It punishes anything unusual. The risk wasn't financial. It was that one of the rarest parcels in the region would be treated like the most ordinary.",
        image: '/Chaguite/hf_20260601_021639_f873ef37-00e8-4a88-99bc-7f0540368b7e (1).webp',
      },
      {
        type: 'split',
        label: 'The work',
        heading: 'The brand started where the land did.',
        body: "The first conversation wasn't about logos or brochures. It was about who would choose to build a life here, what they would need to feel, and whether the project could honestly deliver that.\n\nThat clarity produced one positioning decision that changed everything downstream. This wouldn't be a real estate development. It would be a regenerative community, low-density, ecologically sensitive, built for people who want to own something that means something. Lot sizes, architectural guidelines, the financial model, the investment narrative: every part of the project was built from that positioning outward.\n\nThe work covered:",
        bullets: [
          'Project vision and regenerative positioning',
          'Target market and buyer profile',
          'Product specifications: lot size, density, experience',
          'Site analysis and opportunity mapping',
          'Financial model and investor narrative',
          'Architectural guidelines',
          'Brand identity and visual system',
        ],
        image: '/Chaguite/hf_interior_regen.webp',
      },
      {
        type: 'split',
        label: 'The identity',
        heading: 'A mark built to last as long as the land.',
        body: "The identity starts with a seed. Not as metaphor, but as the literal center of what Chagüite is: something planted with intention, designed to grow, tended by people who understand that what you build now shapes what exists in fifty years.\n\nThe seed sits inside a crest. The reference is to lineage, to stewardship, to the kind of ownership that isn't really ownership at all. Timeless without being archaic. Grounded without being heavy. Because land isn't owned. It's held, passed forward, cared for.",
      },
      {
        type: 'carousel',
        images: [
          '/Chaguite/concept-2.webp',
          '/Chaguite/concept-89.webp',
          '/Chaguite/billboard.webp',
          '/Chaguite/concept-1.webp',
          '/Chaguite/concept-5.webp',
          '/Chaguite/Chaguite Concept 6 copy.webp',
          '/Chaguite/hf_20260601_134242_e3579c54-6929-4fb6-a858-8df029ae8810.webp',
        ],
      },
      {
        type: 'stats',
        label: 'Impact',
        heading: 'A different story. A different price.',
        body: "Raw land gets priced by comparison. Whatever sold nearby, whatever looks similar on paper. That math is neutral. It punishes anything unusual.\n\nThe positioning changed what buyers were comparing Chagüite to. Not other parcels. The decision to invest in something that mattered, or not to. Those are different decisions. They attract different people. And they unlock a fundamentally different price.",
        bullets: [
          'Investor alignment',
          'Market differentiation',
          'Long-term brand equity',
          'Scalable future development',
        ],
      },
    ],
  },
  {
    slug: 'casa-siwa',
    client: 'Casa Siwä',
    category: 'Brand Identity & Digital Experience',
    heroLabel: 'Brand Identity · Art Direction',
    title: 'Built from culture.\nNot from mood boards.',
    subtitle:
      "A luxury retreat on Costa Rica's South Caribbean coast, built on ancestral Bribri land. The culture was the foundation, not the inspiration. The brand had to come from 10,000 years of living tradition, or it would ring false on every surface it touched.",
    tags: ['Brand identity', 'Strategy', 'Cultural narrative', 'Art direction', 'Hospitality'],
    heroImage: '/Siwa/siwa-stone-hero.webp',
    heroImages: [
      '/Siwa/siwa-stone-hero.webp',
      '/Siwa/hf_20260530_004913_e18d2766-720f-4b3d-aeea-19042417dcfc.webp',
      '/Siwa/hf_20260530_010108_6cc9af61-f105-4d35-a456-02c70122d4fa.webp',
      '/Siwa/hf_20260530_010422_6e1baf86-9dd4-4520-a506-bf51ac168b75.webp',
      '/Siwa/hf_20260530_010811_ab2a0e3b-dac8-4a94-aeec-97b849ecf02a.webp',
      '/Siwa/hf_20260530_011818_1ccc9b48-4177-4e24-931e-79b8b3b2da5f.webp',
    ],
    sections: [
      {
        type: 'split',
        label: 'The territory',
        heading: 'The brief was already in the culture.',
        body: "The Bribri people have lived on this coast for millennia. Their world is organized around Sibö, a creator deity present in every living thing: the forest, the river, the seed, the sun. Siwä is a word from that lineage. The land had meaning before the first stone was laid, before the first guest arrived, before anyone sat down to design a brand.\n\nThe question wasn't how to differentiate in a crowded hospitality market. It was whether a brand could be built from something ancient without diminishing it. That question demanded a different starting point: the culture itself, as the brief.",
        image: '/Siwa/siwa-challenge-wide.webp',
      },
      {
        type: 'split',
        label: 'The work',
        heading: 'The oral tradition was the design system.',
        body: "The starting point wasn't mood boards or competitive analysis. It was the Bribri visual and oral tradition. The sun is a primary symbol of Sibö's creative force: rising, radiating, imperfect. Not a geometric abstraction but a living mark, pressed into clay, carved into wood, worn on the body. That became the foundation of the wordmark.\n\nAn organic sun with irregular, uneven rays. A dark seed at its center: origin, potential, continuity. The typography followed the same principle: rounded, rooted in the handmade. The palette came directly from the land. Volcanic black, deep jungle green, cacao brown, warm terracotta. Every choice has a reference. None of them were made in a mood board.\n\nThe work covered:",
        bullets: [
          'Brand identity rooted in Bribri cultural symbolism',
          'Custom wordmark and visual system',
          'Tone of voice and verbal identity',
          'Brand touchpoints: stationery, amenities, signage, apparel',
          'Art direction and visual storytelling',
          'Digital experience strategy',
        ],
        image: '/Siwa/siwa-approach-wide.webp',
        image2: '/Siwa/hf_20260523_033108_09ea2b14-662f-45fa-bad9-f5657cc69b29.webp',
      },
      {
        type: 'split',
        label: 'The identity',
        heading: 'A mark that doesn\'t reference culture. It comes from it.',
        body: "The Casa Siwä mark comes from a specific symbol: the Bribri solar figure, adapted with integrity and built into a complete brand language. The sun's irregular rays are intentional. They carry something precise geometry cannot: the hand, the tool, the person who made them. The seed at the center is Sibö. The space around it is the forest.\n\nApplied across every touchpoint, from embossed soap to woven towel tags to leather key fobs, the mark holds its weight because it isn't decorative. It comes from culture. Guests feel it before they can name it.",
      },
      {
        type: 'carousel',
        images: [
          '/Siwa/siwa-carousel-towels.webp',
          '/Siwa/siwa-carousel-keys.webp',
          '/Siwa/siwa-carousel-lifestyle.webp',
          '/Siwa/siwa-carousel-slippers.webp',
          '/Siwa/hf_20260523_033108_09ea2b14-662f-45fa-bad9-f5657cc69b29.webp',
          '/Siwa/siwa-stone-hero.webp',
          '/Siwa/hf_20260530_004913_e18d2766-720f-4b3d-aeea-19042417dcfc.webp',
          '/Siwa/hf_20260530_005122_ae9a197c-8f5f-48be-8c2a-88569d98af81.webp',
          '/Siwa/hf_20260530_010108_6cc9af61-f105-4d35-a456-02c70122d4fa.webp',
          '/Siwa/hf_20260530_010422_6e1baf86-9dd4-4520-a506-bf51ac168b75.webp',
          '/Siwa/hf_20260530_010811_ab2a0e3b-dac8-4a94-aeec-97b849ecf02a.webp',
          '/Siwa/hf_20260530_011818_1ccc9b48-4177-4e24-931e-79b8b3b2da5f.webp',
        ],
      },
      {
        type: 'stats',
        label: 'What remains',
        heading: 'A brand guests feel before they can name it.',
        body: "Most hospitality brands spend years trying to manufacture a sense of place. Casa Siwä had it from the beginning, in the land, in the people, in 10,000 years of Bribri culture that shaped every decision made.\n\nWhat was built isn't a visual identity. It's a language rooted in a real place, a real history, a real people whose worldview lives in the mark on every door. That foundation holds because it isn't a style. It's a lineage.",
      },
    ],
  },
  {
    slug: 'gxm',
    client: 'GXM',
    category: 'Product Strategy & UX Design',
    heroLabel: 'Full Case Overview · 4 Parts',
    title: 'The expertise was\nnever the problem.',
    subtitle:
      'A compliance firm managing corporate entities across 120+ countries. Deep institutional knowledge. No infrastructure to translate it into a product. Two prior attempts. Thirty days to ship the third. The gap between knowing and shipping isn\'t talent. It\'s process.',
    tags: ['Product Strategy', 'User Research', 'Service Design', 'UX Leadership', 'Enterprise SaaS'],
    heroImage: '/GXM/IMG_9711.jpg',
    heroImages: [
      '/GXM/IMG_9711.jpg',
      '/GXM/IMG_9702.jpg',
      '/GXM/Case 2/gxm-remote-workshop.png',
      '/GXM/Case 2/Screenshot 2026-08-03 at 10.25.22 AM.png',
      '/GXM/gxm-journey-map.png',
      '/GXM/gxm-challenge.mp4',
      '/GXM/Case 2/Screenshot 2026-08-03 at 11.06.20 AM.png',
      '/GXM/Case 2/Assesment.png',
      '/GXM/Case 2/gxm-programs.png',
      '/GXM/Case 2/assesment 2.png',
      '/GXM/gxm-scope-definition.png',
      '/GXM/Case 2/Screenshot 2024-07-25 at 4.14.41 PM.png',
      '/GXM/gxm-data-structure.png',
      '/GXM/Case 2/gxm-gateway-walkthrough.mp4',
      '/GXM/Case 2/Screenshot 2026-08-03 at 5.43.18 PM.png',
      '/GXM/Case 2/Screenshot 2026-08-03 at 5.31.41 PM.png',
      '/GXM/Case 2/gxm-diligent-demo.png',
      '/GXM/Case 2/Screenshot 2026-08-03 at 5.46.16 PM.png',
      '/GXM/Case 2/Screenshot 2026-08-03 at 5.48.24 PM.png',
    ],
    sections: [
      {
        type: 'split',
        label: 'The client',
        heading: 'Deep expertise. No product to show for it.',
        body: "A compliance and governance firm serving multinational clients across more than 120 countries. Their team is lawyers, accountants, and governance specialists who've spent careers thinking in jurisdictions, not sprint cycles. They had board backing and a clear platform opportunity. What they needed was someone who could translate the expertise already in the room into a product.\n\nThe constraint was specific: one month to ship an MVP, two months to produce outcomes worth showing investors. That timeline doesn't leave room for guessing. The work had to start from a different place.",
      },
      {
        type: 'carousel',
        images: [
          '/GXM/gxm-journey-map.png',
          '/GXM/Case 2/gxm-programs.png',
          '/GXM/gxm-scope-definition.png',
          '/GXM/gxm-data-structure.png',
          '/GXM/IMG_9702-2.jpg',
        ],
      },
      {
        type: 'split',
        label: 'Kick Off',
        heading: 'What the brief couldn\'t say. The room did.',
        body: "The real product requirements weren't in any brief. They were in the gap between how the service was designed and how the people running it actually experienced it.\n\nBringing the full leadership team into one room, from compliance lawyers to operations leads, made that gap visible for the first time. What one group called standard process, another called broken. From that conversation came more than a product plan: scope, program structure, operational model, and the alignment that unlocked board funding.",
        bullets: [
          'Three programs defined with owners, problem statements, and sequenced action plans',
          'Operations model, program structure, and staffing plan produced in the same session',
          'Platform scope grounded in operational reality, not product assumptions',
          'Shared language established between compliance, operations, and product for the first time',
        ],
        image: '/GXM/IMG_9702.jpg',
      },
      {
        type: 'split',
        label: 'The method',
        heading: 'Every decision earned. Every claim defensible.',
        body: "The first question wasn't what to build. It was why the portal already in place wasn't being used.\n\nWe audited it systematically: every customer path, every point of failure. Ticketing buried new messages beneath old ones. Key account information was missing or unfindable. Twelve interviews across active and lapsed users confirmed it: when the platform couldn't surface what people needed, they defaulted to email. Small friction, consistent cost.\n\nThen we stress-tested the build decision itself. Four leading platforms, live demos, full schema review. None fit the compliance workflows closely enough. That analysis didn't just confirm the decision to build. It gave the team evidence they could defend at board level. All of that before a single screen was designed. Not because there was time to spare. Because there wasn't.",
        image: '/GXM/Case 2/Screenshot 2026-08-03 at 10.25.22 AM.png',
        video: '/GXM/Case 2/gxm-gateway-walkthrough.mp4',
      },
      {
        type: 'stats',
        label: 'Impact',
        heading: 'Shipped in thirty days.\nFunded in sixty.',
        body: "Thirty days to ship. Sixty days to prove it. A major investment round closed on the strength of decisions that had been made, tested, and documented before a single screen was designed.\n\nThe third attempt succeeded because it started differently: not from features, but from the clarity underneath them. When the foundation is evidence, the structure holds. That sequence was the investment. The software was what it bought.",
        bullets: [
          'MVP shipped within one month',
          'Business outcomes validated within two months',
          'Major investment round closed on the product strategy',
          '12 interviews and 4 competitive platform reviews completed before design began',
        ],
      },
      {
        type: 'carousel',
        images: [
          '/GXM/Case 2/gxm-remote-workshop.png',
          '/GXM/Case 2/Screenshot 2026-08-03 at 11.06.20 AM.png',
          '/GXM/Case 2/Screenshot 2024-03-28 at 9.34.18 AM.png',
          '/GXM/Case 2/Screenshot 2026-08-03 at 5.31.41 PM.png',
          '/GXM/Case 2/gxm-diligent-demo.png',
          '/GXM/Case 2/Assesment.png',
          '/GXM/Case 2/assesment 2.png',
          '/GXM/Case 2/assesment 3.png',
          '/GXM/Case 2/Screenshot 2024-07-25 at 4.14.41 PM.png',
          '/GXM/Case 2/Screenshot 2026-08-03 at 5.43.18 PM.png',
          '/GXM/Case 2/Screenshot 2026-08-03 at 5.46.16 PM.png',
          '/GXM/Case 2/Screenshot 2026-08-03 at 5.47.05 PM.png',
          '/GXM/Case 2/Screenshot 2026-08-03 at 5.48.24 PM.png',
          '/GXM/Case 2/Screenshot 2024-04-22 at 9.42.58 AM.png',
        ],
      },
      {
        type: 'chapters',
        label: 'The full story',
        heading: 'Four phases.\nOne funded product.',
        items: [
          {
            part: 'Part 01',
            title: 'Building alignment before software',
            description: 'A cross-functional leadership team, one shared journey map, and the alignment that unlocked board funding.',
            image: '/GXM/gxm-workshop.png',
            video: '/GXM/gxm-challenge.mp4',
            slug: 'gxm-building-alignment-before-software',
          },
          {
            part: 'Part 02',
            title: 'From hypothesis to evidence',
            description: '12 user interviews, a full audit of Gateway 1.0, and a competitive analysis that confirmed the build decision.',
            image: '/GXM/Case 2/Screenshot 2026-08-03 at 10.25.22 AM.png',
            slug: 'gxm-validate-before-you-build',
          },
          {
            part: 'Part 03',
            title: 'Design system & brand foundations',
            description: 'Building the design language and component system on PrimeReact that the product team would own going forward.',
            image: '/GXM/Case 2/Screenshot 2026-08-03 at 5.43.18 PM.png',
          },
          {
            part: 'Part 04',
            title: 'Launch, AI tooling & user testing',
            description: 'From validated designs to shipped product: AI-assisted development, lean testing, and the outcomes that followed.',
            image: '/GXM/IMG_9711.jpg',
          },
        ],
      },
    ],
  },
  {
    slug: 'gxm-validate-before-you-build',
    client: 'From Hypothesis to Evidence',
    category: 'Product Strategy & UX Design',
    heroLabel: 'Part 2 of 4 · Product Strategy & Transformation',
    title: 'From hypothesis\nto evidence.',
    subtitle:
      'With alignment achieved and board support secured, the next question was unavoidable: what exactly are we building, and how do we know it is the right thing? This is how we answered it.',
    tags: ['Product Strategy', 'User Research', 'Competitive Analysis', 'Service Design', 'Enterprise SaaS'],
    heroImage: '/GXM/Case 2/Screenshot 2026-08-03 at 10.25.22 AM.png',
    heroImages: [
      '/GXM/Case 2/Screenshot 2026-08-03 at 10.25.22 AM.png',
      '/GXM/Case 2/Screenshot 2026-08-03 at 11.06.20 AM.png',
      '/GXM/Case 2/Assesment.png',
      '/GXM/Case 2/Screenshot 2024-04-22 at 9.42.58 AM.png',
      '/GXM/Case 2/assesment 2.png',
      '/GXM/Case 2/assesment 3.png',
      '/GXM/Case 2/Screenshot 2024-03-28 at 9.34.18 AM.png',
      '/GXM/Case 2/Screenshot 2024-07-25 at 4.14.41 PM.png',
      '/GXM/Case 2/Screenshot 2026-08-03 at 5.43.18 PM.png',
      '/GXM/Case 2/Screenshot 2026-08-03 at 5.31.41 PM.png',
      '/GXM/Case 2/gxm-diligent-demo.png',
      '/GXM/Case 2/Screenshot 2026-08-03 at 5.46.16 PM.png',
      '/GXM/Case 2/Screenshot 2026-08-03 at 5.47.05 PM.png',
      '/GXM/Case 2/Screenshot 2026-08-03 at 5.48.24 PM.png',
    ],
    sections: [
      {
        type: 'split',
        label: 'The hypothesis',
        heading: 'A clear problem.\nA testable belief.',
        body: "A problem without structure is just noise. The workshop had surfaced it. Now we needed to make it testable.\n\nThe specific belief: data that lived in Salesforce was not reaching the people who depended on it. Customers had to ask the team for information about their own accounts. The team had to pull, format, and resend data that already existed somewhere else. That loop created compounding effort on both sides, eroding margins and degrading the experience with every cycle.\n\nA Lean UX canvas gave that belief structure. It separated what we knew from what we assumed, and forced one question before anything else: what is the riskiest thing we believe, and what is the fastest way to find out if we're wrong?\n\nThe most important hypothesis was not about what to build. It was about whether building was even the right answer.",
        image: '/GXM/Case 2/Screenshot 2026-08-03 at 10.25.22 AM.png',
      },
      {
        type: 'split',
        label: 'What already existed',
        heading: 'We had tried this before. We needed to understand why it failed.',
        body: "Two things existed before this project started: the data, and a portal designed to surface it.\n\nSalesforce held the customer information. Gateway 1.0 was built to expose it. Neither was working as intended. The portal had been deployed and quietly set aside by the people it was meant to serve.\n\nBefore designing anything new, we mapped what existed. Systematically. Every section of the platform, every path a customer could take, every point where the experience broke down.\n\nThe findings were specific. The ticketing system displayed the oldest messages first, burying the most recent ones. Key account information was either missing or unfindable. The portal existed. It was not being used. And no one had stopped to ask why.",
        image: '/GXM/Case 2/Screenshot 2026-08-03 at 11.06.20 AM.png',
        video: '/GXM/Case 2/gxm-gateway-walkthrough.mp4',
      },
      {
        type: 'split',
        label: 'The research',
        heading: 'Twelve interviews.\nOne clear pattern.',
        body: "We interviewed across two groups: active platform users and those who had stopped using it altogether.\n\nThe finding was consistent. When information was not on the platform, or could not be found, people defaulted to email. The ticketing system required users to scroll past old messages to reach the latest ones. Small friction. But enough to make email feel faster.\n\nThe cost of that habit was invisible to users. Internally, it meant missed messages, rework, and deadlines at risk. The interviews also surfaced something useful: what information customers actually needed, what they reached out about most often, and what they wished the platform offered.",
        bullets: [
          'Lower active user count than anticipated',
          'Platform used rarely, email preferred for most interactions',
          'Ticketing system displayed oldest messages first, causing users to abandon it',
          'Key information missing or unfindable drove repeated manual requests',
          'Interviews identified priority information types, common request patterns, and desired features',
        ],
        image: '/GXM/Case 2/Screenshot 2024-03-28 at 9.34.18 AM.png',
      },
      {
        type: 'carousel',
        images: [
          '/GXM/Case 2/Screenshot 2026-08-03 at 5.31.41 PM.png',
          '/GXM/Case 2/Assesment.png',
          '/GXM/Case 2/assesment 2.png',
          '/GXM/Case 2/assesment 3.png',
          '/GXM/Case 2/Screenshot 2026-08-03 at 5.31.41 PM.png',
        ],
      },
      {
        type: 'split',
        label: 'The build vs buy decision',
        heading: 'No existing tool was fit for purpose.',
        body: "Rather than assume the answer, we booked demos with market-leading platforms. We reviewed their data schemas, feature sets, and sales positioning. We mapped what each could do against what the operations actually required.\n\nSome platforms came close. But adapting operations around an external tool's constraints would have introduced costs that outweighed the savings. The data structures did not match the service model. The entity types, the relationships between them, the workflows that connected them: none of it aligned cleanly with how the business actually ran.\n\nThe competitive analysis did not just confirm a build decision. It gave the team the evidence to defend it. The right path was to redesign the target operating model and build a tool fit for the services and processes that already existed.",
        image: '/GXM/Case 2/Screenshot 2026-08-03 at 5.31.41 PM.png',
        video: '/GXM/Case 2/gxm-competitor-demo.mp4',
      },
      {
        type: 'carousel',
        images: [
          '/GXM/Case 2/Screenshot 2024-07-25 at 4.14.41 PM.png',
          '/GXM/Case 2/Screenshot 2026-08-03 at 5.43.18 PM.png',
          '/GXM/Case 2/Screenshot 2024-04-22 at 9.42.58 AM.png',
          '/GXM/Case 2/Screenshot 2026-08-03 at 5.46.16 PM.png',
          '/GXM/Case 2/Screenshot 2026-08-03 at 5.47.05 PM.png',
          '/GXM/Case 2/Screenshot 2026-08-03 at 5.48.24 PM.png',
        ],
      },
      {
        type: 'stats',
        label: 'Impact',
        heading: 'Evidence first.\nBuild second.\nNo guessing.',
        body: "Before a single screen was designed, the team had mapped the hypothesis, audited the failure, spoken to users, reviewed the market, and blueprinted the future state across multiple service flows.\n\nThat sequence mattered. Every decision in the build phase had a documented rationale. The team knew what to build, in what order, and why it would work where previous attempts had not.",
        bullets: [
          '12 user interviews across active and inactive user groups',
          'Full audit of existing platform identifying root causes of low adoption',
          'Competitive analysis across 4 leading platforms with live demos',
          'Build vs buy decision backed by evidence, not assumption',
          'Service blueprints mapped across multiple service flows',
          'Delivery cadence aligned to operational capacity, not guesswork',
        ],
      },
    ],
  },
  {
    slug: 'gxm-building-alignment-before-software',
    client: 'Building Alignment',
    category: 'Product Strategy & UX Design',
    heroLabel: 'Part 1 of 4 · Product Strategy & Transformation',
    title: 'Building alignment\nbefore software',
    subtitle:
      'After two failed attempts to turn a service business into a scalable product, the company needed more than another build. I helped reframe the challenge, align the organization, and create the foundations for a platform that could finally move from vision to release.',
    tags: ['Product Strategy', 'Service Design', 'UX Leadership', 'Enterprise SaaS', 'Transformation'],
    heroImage: '/GXM/IMG_9702.jpg',
    heroImages: [
      '/GXM/IMG_9702.jpg',
      '/GXM/IMG_9702-2.jpg',
      '/GXM/Case 2/gxm-remote-workshop.png',
      '/GXM/IMG_9711.jpg',
      '/GXM/gxm-workshop.png',
      '/GXM/gxm-journey-map.png',
      '/GXM/Case 2/gxm-programs.png',
      '/GXM/gxm-scope-definition.png',
      '/GXM/gxm-data-structure.png',
    ],
    sections: [
      {
        type: 'split',
        label: 'The challenge',
        heading: 'Everyone had an answer. Nobody had the same.',
        body: "The company had tried twice before. Two product initiatives. Two failed attempts to turn a service business into something that could scale beyond the people running it. That's where I came in. Working closely with a newly appointed VP of Technology, we set out to make sure the third attempt would be the last.\n\nThe organization still ran on fragmented workflows, email chains, spreadsheets, and institutional knowledge that lived in people's heads. Across 120+ countries. The problem wasn't a lack of software. Nobody had agreed on what problem it was supposed to solve.\n\nThat's not a technology gap. It's a clarity gap. Two failed attempts aren't bad luck. They're a pattern. Patterns are system outputs.",
        bullets: [
          'Two product builds. Neither shipped.',
          'No single source of truth. Every team ran their own version of the process.',
          'Different teams had different answers to: what are we building? And worse, why it was worth building.',
        ],
        image: '/GXM/IMG_9702.jpg',
        video: '/GXM/gxm-challenge.mp4',
      },
      {
        type: 'split',
        label: 'My Role',
        heading: 'Build smart.\nUnderstand more.\nShip right.',
        body: "My role wasn't to design screens. It was to help the organization understand the problem they were actually trying to solve.\n\nThat started with a decision: don't design anything until the full picture is visible. Map the end-to-end experience, from the first customer touchpoint to the last operational handoff. Bring everyone who touches the work into the same room. Not to present. To discover.\n\nThe full picture only comes from the whole room. That's what changed here. Bringing leadership, product, operations, customer success, and delivery into the same conversation meant each team could see beyond their own piece of the work. What one team called normal, another felt as friction. Those conversations built understanding that no requirement document could have produced.\n\nAlignment followed. Not because we forced it. Because everyone was finally looking at the same thing.",
        bullets: [
          'End-to-end journey map: from onboarding to business as usual',
          'Cross-functional workshop design and facilitation',
          'Platform scope defined from operational reality, not assumptions',
          'Three programs with owners, problem statements, and action plans',
          'A prioritization framework the team could carry forward',
          'A team aligned on what to build and why',
        ],
        image: '/GXM/IMG_9702.jpg',
      },
      {
        type: 'split',
        label: 'The big learning',
        heading: 'The real cost wasn\'t customer-facing. It was behind it.',
        body: "Two days. Four hours each. That's the whole thing.\n\nThe map covered the full customer journey: from onboarding to business as usual. What it revealed wasn't what anyone expected. The customer-facing experience had friction, but it wasn't the source of the problem. The real cost was backstage. No centralized place to store the information that kept every engagement running. When something was missing, someone re-ran it. When a vendor needed something, someone coordinated it manually. That operational overhead was quietly destroying the margins.\n\nOnce the problem was named, it could be designed around. A Lean UX Canvas turned each direction into a testable hypothesis. A prioritization matrix forced the hardest question: what has the most impact for the least effort? Three programs emerged. Each had an owner, a problem statement, and a starting point.\n\nEveryone left knowing what to build first. And why.\n\nThat's what structure does. It doesn't add time. It removes the guessing that was eating it.",
      },
      {
        type: 'carousel',
        images: [
          '/GXM/gxm-journey-map.png',
          '/GXM/Case 2/gxm-programs.png',
          '/GXM/gxm-scope-definition.png',
          '/GXM/gxm-data-structure.png',
        ],
      },
      {
        type: 'stats',
        label: 'Impact',
        heading: 'A problem named.\nA scope agreed.\nA plan ready for the board.',
        body: "Eight hours of structured work changed the trajectory of the third attempt. The team left with a named problem, a defined scope, and a set of programs with owners and action plans. Not slides. A shared model that everyone had helped build, and that leadership could take to a board.\n\nThe investment that followed wasn't a leap of faith. It was a logical next step.",
        bullets: [
          'Board support secured to build the MVP and sustain operations',
          'Foundations set for the MVP that shipped on the third attempt',
          'One shared answer to: what are we building?',
          'Operational knowledge documented, organized, and owned by the right teams',
          'A team that now discovers before it builds',
        ],
      },
    ],
  },
];

export function getCaseBySlug(slug: string): CaseData | undefined {
  return cases.find((c) => c.slug === slug);
}

export function getAllCases(): CaseData[] {
  return cases;
}

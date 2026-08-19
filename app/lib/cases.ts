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
  | { type: 'scroll-gallery'; images: string[]; positions?: string[] }
  | { type: 'stats'; label: string; heading: string; body: string; bullets?: string[] }
  | { type: 'chapters'; label: string; heading: string; items: ChapterItem[] }
  | { type: 'cinematic'; src: string; shots?: { x: number; y: number; scale: number; hold: number; label?: string }[]; cursors?: { name: string; color: string; path: [number, number][]; stepDuration: number; startDelay: number }[]; height?: number; bg?: string }
  | { type: 'image-block'; src: string };

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
        type: 'scroll-gallery',
        images: [
          '/GXM/Case 4/ss/Mockuuups Apple Studio Display mockup on adjustable stand.jpeg',
          '/GXM/gxm-scope-definition.png',
          '/GXM/IMG_9702-temp.jpg',
        ],
      },
      {
        type: 'split',
        label: 'Kick Off',
        heading: 'What the brief couldn\'t say. The room did.',
        body: "The real product requirements weren't in any brief. They were in the gap between how the service was designed and how the people running it actually experienced it.\n\nBringing the full leadership team into one room, from compliance lawyers to operations leads, made that gap visible for the first time. What one group called standard process, another experienced as friction. From that conversation came more than a product plan: scope, program structure, operational model, and the alignment that unlocked board funding.",
        bullets: [
          'Three programs defined with owners, problem statements, and sequenced action plans',
          'Operations model, program structure, and staffing plan produced in the same session',
          'Platform scope grounded in operational reality, not product assumptions',
          'Shared language established between compliance, operations, and product for the first time',
        ],
        video: '/GXM/gxm-challenge.mp4',
      },
      {
        type: 'split',
        label: 'The method',
        heading: 'Every decision earned. Every claim defensible.',
        body: "The first question wasn't what to build. It was why the portal already in place wasn't being used.\n\nWe audited it systematically: every customer path, every point of failure. Ticketing buried new messages beneath old ones. Key account information was missing or unfindable. Twelve interviews across active and lapsed users confirmed it: when the platform couldn't surface what people needed, they defaulted to email. Small friction, consistent cost.\n\nThen we stress-tested the build decision itself. Four leading platforms, live demos, full schema review. None fit the compliance workflows closely enough. That analysis didn't just confirm the decision to build. It gave the team evidence they could defend at board level. All of that before a single screen was designed. Not because there was time to spare. Because there wasn't.",
      },
      {
        type: 'image-block',
        src: '/GXM/Case 4/Screenshot 2026-08-17 at 12.45.02 PM.png',
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
        type: 'scroll-gallery',
        images: [
          '/GXM/Case 2/gxm-remote-workshop.png',
          '/GXM/Case 2/Screenshot 2026-08-03 at 5.31.41 PM.png',
          '/GXM/Case 2/Assesment.png',
          '/GXM/Case 2/gxm-diligent-demo.png',
        ],
        positions: ['center 95%', 'center', 'center'],
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
            description: '12 user interviews, a full audit of the existing portal, and a competitive analysis that confirmed the build decision.',
            image: '/GXM/Case 2/Screenshot 2026-08-03 at 10.25.22 AM.png',
            slug: 'gxm-validate-before-you-build',
          },
          {
            part: 'Part 03',
            title: 'Design system & brand foundations',
            description: 'Service blueprints, design tokens, and a component system: the foundation that made thirty-day delivery possible.',
            image: '/GXM/Case 4/Screenshot 2026-08-17 at 3.22.01 PM.png',
            slug: 'gxm-design-system-brand-foundations',
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
      'With alignment in place and board support confirmed, the next question was the sharpest one: what exactly are we building, and how do we know it is the right thing? The answer required user interviews, a full audit of the existing platform, and competitive analysis across four market alternatives. All of it before a screen was designed.',
    tags: ['Product Strategy', 'User Research', 'Competitive Analysis', 'Service Design', 'Enterprise SaaS'],
    heroImage: '/GXM/Case 2/Screenshot 2026-08-03 at 10.25.22 AM.png',
    heroImages: [
      '/GXM/Case 2/Screenshot 2026-08-03 at 10.25.22 AM.png',
      '/GXM/Case 2/Screenshot 2026-08-03 at 11.06.20 AM.png',
      '/GXM/Case 2/Assesment.png',
      '/GXM/Case 2/Screenshot 2024-04-22 at 9.42.58 AM.png',
      '/GXM/Case 2/assesment 2.png',
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
        heading: 'A clear belief. A disciplined way to test it.',
        body: "A Lean UX canvas gave the starting problem structure. The specific belief: data that lived in Salesforce was not reaching the people who depended on it. Customers had to ask the team for information about their own accounts. The team had to pull, format, and resend data that already existed elsewhere. That loop created compounding effort on both sides.\n\nThe canvas separated what the team knew from what they assumed, and forced one question before anything else: what is the riskiest assumption, and what is the fastest way to test it? The most important hypothesis was not about what to build. It was about whether building was even the right answer.",
        image: '/GXM/Case 2/Screenshot 2026-08-03 at 10.25.22 AM.png',
      },
      {
        type: 'split',
        label: 'What already existed',
        heading: 'The portal existed. It wasn\'t being used.',
        body: "Salesforce held the customer information. A client portal had been built to surface it. Before designing anything new, the existing platform was mapped systematically: every section, every path a customer could take, every point where the experience could be improved.\n\nThe findings were specific. The ticketing system displayed oldest messages first, burying the most recent ones. Key account information was missing or unfindable. When the platform couldn't surface what people needed, they chose email instead. Small friction, consistent cost. The audit made the pattern legible.",
        image: '/GXM/Case 2/Screenshot 2026-08-03 at 11.06.20 AM.png',
        video: '/GXM/Case 2/gxm-gateway-walkthrough.mp4',
      },
      {
        type: 'split',
        label: 'The research',
        heading: 'Twelve interviews.\nOne clear pattern.',
        body: "Interviews ran across two groups: active platform users and those who had chosen email instead. The finding was consistent. When information wasn't on the platform or couldn't be found, people defaulted to email. The ticketing system required scrolling past old messages to reach the newest ones. Small enough to ignore individually, significant enough to change behaviour at scale.\n\nThe sessions also surfaced what customers actually needed: the information they reached out about most, what they wished the platform offered, and where the experience had the most headroom to improve.",
        bullets: [
          'Platform used rarely; email preferred for most client interactions',
          'Ticketing system displayed oldest messages first, causing users to move to email',
          'Key information missing or unfindable drove repeated manual requests',
          'Interviews identified priority information types and most-requested features',
        ],
        image: '/GXM/Case 2/Screenshot 2024-03-28 at 9.34.18 AM.png',
      },
      {
        type: 'carousel',
        images: [
          '/GXM/Case 2/Screenshot 2026-08-03 at 5.31.41 PM.png',
          '/GXM/Case 2/Assesment.png',
          '/GXM/Case 2/assesment 2.png',
          '/GXM/Case 2/Screenshot 2026-08-03 at 5.31.41 PM.png',
        ],
      },
      {
        type: 'split',
        label: 'The build vs buy decision',
        heading: 'No existing tool was fit for purpose.',
        body: "Rather than assume the answer, demos were booked with four market-leading platforms. Their data schemas, feature sets, and sales positioning were reviewed against what the operations actually required. Some came close. But adapting around an external tool's constraints would have introduced costs that outweighed the savings.\n\nThe data structures did not match the service model. Entity types, relationships, workflows: none of it aligned cleanly with how the business ran. The competitive analysis did not just confirm the build decision. It gave the team the evidence to defend it at board level.",
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
        heading: 'Evidence before design. Decisions that held.',
        body: "Before a single screen was designed, the team had mapped the hypothesis, audited the existing platform, spoken to users, and reviewed the market across four alternatives. Every decision in the build phase had a documented rationale.\n\nThat sequence was the investment. The software was what it bought.",
        bullets: [
          '12 user interviews across active and inactive user groups',
          'Full platform audit identifying the root cause of low adoption',
          'Competitive analysis across 4 platforms with live demos and schema review',
          'Build decision backed by evidence, documented for the board',
        ],
      },
    ],
  },
  {
    slug: 'gxm-design-system-brand-foundations',
    client: 'Design System & Brand',
    category: 'Product Design · Design Systems',
    heroLabel: 'Part 3 of 4 · Product Strategy & Transformation',
    title: 'Velocity by design.\nNot by headcount.',
    subtitle:
      'The build decision was confirmed. The platform had no visual identity, no component conventions, and a thirty-day ship window. Part three was about building the design foundation that made delivery possible at that speed, without adding headcount to do it.',
    tags: ['Design Systems', 'Brand Identity', 'Design Tokens', 'Service Design', 'UX Leadership'],
    heroImage: '/GXM/Case 4/ss/Mockuuups Apple Studio Display mockup on an industrial desk stand.jpeg',
    heroImages: [
      '/GXM/Case 4/ss/Mockuuups Apple Studio Display mockup on adjustable stand.jpeg',
      '/GXM/Case 4/ss/Mockuuups Apple Studio Display mockup on an industrial desk stand.jpeg',
      '/GXM/Case 4/ss/Mockuuups Apple Studio Display mockup on an industrial stand.jpeg',
      '/GXM/Case 4/Screenshot 2026-08-17 at 3.22.01 PM.png',
      '/GXM/Case 4/Screenshot 2026-08-17 at 2.57.25 PM.png',
      '/GXM/Case 4/Screenshot 2026-08-17 at 2.49.51 PM.png',
      '/GXM/Case 4/Screenshot 2026-08-17 at 2.50.30 PM.png',
      '/GXM/Case 4/Screenshot 2026-08-17 at 2.58.59 PM.png',
      '/GXM/Case 4/Screenshot 2026-08-17 at 12.45.02 PM.png',
      '/GXM/Case 4/Screenshot 2026-08-17 at 12.25.27 PM.png',
      '/GXM/Case 4/Screenshot 2026-08-17 at 12.01.54 PM.png',
      '/GXM/Case 4/Screenshot 2026-08-17 at 12.05.47 PM.png',
      '/GXM/Case 4/Screenshot 2026-08-17 at 12.08.09 PM.png',
      '/GXM/Case 4/Interviews/Screenshot 2026-08-17 at 3.35.47 PM.png',
      '/GXM/Case 4/Interviews/Screenshot 2026-08-17 at 3.36.19 PM.png',
    ],
    sections: [
      {
        type: 'split',
        label: 'The starting point',
        heading: 'The build was confirmed. The scope still needed finding.',
        body: "Parts one and two answered whether to build and whether to buy. Part three opened with a different question: what, exactly, does the product need to do? User interviews with legal and HR teams traced the Jobs to Be Done across two service lines: Global Entity Registry and payroll. The goal was not a feature list. It was the operational logic running between roles, the hand-offs and workarounds that kept the service moving before any software existed to support it.\n\nTwo interview sprints produced the working material for everything that followed. Service blueprints mapping every actor and touchpoint. User flows derived from how people actually worked, not how the process was supposed to work. An information architecture that the compliance team and the product team could both agree on. That scope became the foundation the design system was built to serve.",
        bullets: [
          'Jobs to Be Done mapped across legal and HR for two service lines',
          'Service blueprints completed for Global Entity Registry and payroll workflows',
          'Information architecture and user flows derived from operational reality',
          'Interview recordings reviewed with the full team before design began',
        ],
        image: '/GXM/Case 4/Interviews/Screenshot 2026-08-17 at 3.35.47 PM.png',
        video: '/GXM/Case 4/Interviews/gxm-interview-churnzero.mp4',
      },
      {
        type: 'carousel',
        images: [
          '/GXM/Case 4/Screenshot 2026-08-17 at 12.25.27 PM.png',
          '/GXM/Case 4/Screenshot 2026-08-17 at 12.45.02 PM.png',
          '/GXM/Case 4/Interviews/Screenshot 2026-08-17 at 3.35.47 PM.png',
          '/GXM/Case 4/Interviews/Screenshot 2026-08-17 at 3.36.19 PM.png',
          '/GXM/Case 4/Screenshot 2026-08-17 at 12.01.54 PM.png',
          '/GXM/Case 4/Screenshot 2026-08-17 at 12.05.47 PM.png',
          '/GXM/Case 4/Screenshot 2026-08-17 at 12.08.09 PM.png',
          '/GXM/Case 4/Screenshot 2026-08-17 at 12.25.27 PM.png',
          '/GXM/Case 4/Screenshot 2026-08-17 at 12.45.02 PM.png',
        ],
      },
      {
        type: 'split',
        label: 'The system',
        heading: 'Custom was the obvious move. Evidence redirected it.',
        body: "The platform had no visual identity. Not a weak one: none. No agreed brand colors. No component conventions. Previous products had been built with inconsistent button types, mismatched inputs, and no shared design language between designers and developers. That context, combined with a thirty-day ship window, made a fully custom design system the most expensive path available. Custom systems offer complete flexibility. They also require a build effort that can consume the exact runway the product needs.\n\nThe decision: an existing component library, extended with design tokens. PrimeReact provided the component foundation, a production-grade system covering buttons, inputs, data tables, calendars, and the data visualisation components the platform required. Design tokens provided the brand layer on top. Colors, spacing, typography, and component-level values that aligned the inherited components with the product's visual identity. That decision removed the technical risk of building a component system from scratch, and kept every sprint focused on product decisions rather than infrastructure.",
        image: '/GXM/Case 4/Screenshot 2026-08-17 at 2.57.25 PM.png',
      },
      {
        type: 'split',
        label: 'The foundation',
        heading: 'One token change. Every component, updated.',
        body: "Design tokens are named values: colors, spacing, typography scales. They exist in both the design file and the codebase simultaneously. Token Studio for Figma connected both sides. Every color in the GXM light theme was defined as a token, from global palette values down to component-specific overrides. Every spacing unit. Every shadow. When a value changed in Figma, it propagated to the codebase. Designers and developers stopped working from separate references and started working from one.\n\nThe token set covered the full component surface. Calendar inputs, form fields, checkboxes, buttons, data tables: each component had its own token map linking every visual property back to the global value it inherited from. That architecture meant the system could be extended without breaking, themed for future products without rebuilding, and handed to a development team that could immediately understand what they were implementing. Not because it was explained. Because it was structured to be self-evident.",
        image: '/GXM/Case 4/Screenshot 2026-08-17 at 2.49.51 PM.png',
      },
      {
        type: 'carousel',
        images: [
          '/GXM/Case 4/ss/Mockuuups Apple Studio Display mockup on adjustable stand.jpeg',
          '/GXM/Case 4/ss/Mockuuups Apple Studio Display mockup on an industrial desk stand.jpeg',
          '/GXM/Case 4/ss/Mockuuups Apple Studio Display mockup on an industrial stand.jpeg',
          '/GXM/Case 4/Screenshot 2026-08-17 at 2.57.25 PM.png',
          '/GXM/Case 4/Screenshot 2026-08-17 at 2.49.51 PM.png',
          '/GXM/Case 4/Screenshot 2026-08-17 at 2.50.30 PM.png',
          '/GXM/Case 4/Screenshot 2026-08-17 at 2.58.59 PM.png',
          '/GXM/Case 4/Screenshot 2026-08-17 at 3.22.01 PM.png',
        ],
      },
      {
        type: 'split',
        label: 'The build',
        heading: 'Designers and developers. One source, one language.',
        body: "The first screens put the system to the test. Working from the same Figma library, synced to the live codebase through Token Studio, designers and developers eliminated the interpretation gap that slows most handoffs. What would have required repeated rounds of specification, alignment, and re-specification became a set of shared references that both sides could act on immediately. The design review recording below captures what that collaboration looked like in practice.\n\nEarly prototypes built with AI tooling accelerated validation before any production code was written. Teams could test interaction logic and review flow assumptions against the information architecture without waiting for a development sprint. That sequence, system first, prototype second, production code third, compressed a process that typically takes months into a timeline the product had to meet. The screens that came out of it were not starting from a blank canvas. They were built from a foundation designed to support exactly what the operational mapping had revealed.",
        image: '/GXM/Case 4/ss/Mockuuups Apple Studio Display mockup on an industrial stand.jpeg',
        video: '/GXM/Case 4/gxm-design-dev-meeting.mp4',
      },
      {
        type: 'stats',
        label: 'Impact',
        heading: 'The foundation that made thirty-day delivery real.',
        body: "The design system was not a deliverable alongside the product. It was what made every other deliverable achievable in the time available. Shared components, synced tokens, and documented patterns reduced design-to-development handoff from a process of repeated clarification to a working environment both sides could move in at the same time.\n\nThe outcomes that followed were not the result of working harder or adding more people. They were the result of building the right foundation before the product needed it.",
        bullets: [
          'PrimeReact component library themed across the full surface using design tokens',
          'Token Studio sync established between Figma and the live codebase',
          'Color, typography, spacing, and icon set defined from scratch in two sprints',
          'First screens designed, AI-prototyped, and reviewed before production code was written',
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
      'A compliance firm serving clients across 120+ countries, with board backing and a clear platform opportunity. The expertise was already in the room. What was missing was a shared picture of the problem, and a process that could surface it before a single screen was designed.',
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
        label: 'The opportunity',
        heading: 'The expertise was there. The shared picture wasn\'t.',
        body: "A specialist team of lawyers, accountants, and governance experts, each with deep knowledge of their domain. The company had board backing and a clear platform opportunity. What they needed was a process that could turn distributed knowledge into a shared picture of what to build and why.\n\nWorking closely with the VP of Technology, the first decision was deliberate: no design, no build, no scope decisions until the full picture was visible. That meant mapping the end-to-end experience from the first customer touchpoint to the last operational handoff, with every team in the room at once.",
        image: '/GXM/IMG_9702.jpg',
        video: '/GXM/gxm-challenge.mp4',
      },
      {
        type: 'split',
        label: 'The method',
        heading: 'One room. The full picture. Together.',
        body: "Bringing leadership, product, operations, customer success, and delivery into the same conversation meant each team could see beyond their own piece of the work. What one team called standard process, another experienced as friction. Those gaps, once visible, became design decisions. The alignment that followed wasn't forced. It came from everyone looking at the same thing at the same time.\n\nTwo days. Four hours each. The map covered the full customer journey from onboarding to business as usual. A Lean UX Canvas turned each direction into a testable hypothesis. A prioritisation matrix identified what had the most impact for the least effort. Three programs emerged, each with an owner, a problem statement, and a clear starting point.",
        bullets: [
          'End-to-end journey map from onboarding to business as usual',
          'Cross-functional workshop design and facilitation across all teams',
          'Three programs structured with owners, problem statements, and action plans',
          'Platform scope defined from operational reality, agreed across the organisation',
        ],
        image: '/GXM/IMG_9702.jpg',
      },
      {
        type: 'split',
        label: 'The discovery',
        heading: 'The cost wasn\'t customer-facing. It was behind it.',
        body: "What the map revealed wasn't what anyone expected. The customer-facing experience had friction, but it wasn't the source of the real cost. The real cost was backstage: no centralised place to store the information that kept every engagement running. When something was missing, someone re-ran it. When a vendor needed something, someone coordinated it manually. That operational overhead was reducing margins across every account.\n\nOnce the problem was named, it could be designed around. Everyone left knowing what to build first. And why.",
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
        heading: 'A named problem. A shared scope. Board-ready.',
        body: "Eight hours of structured work produced a named problem, a defined scope, and programs with owners and action plans. Not slides: a shared model that everyone had helped build, and that leadership could take directly to a board.\n\nThe investment that followed was a logical next step.",
        bullets: [
          'Board support secured to build the MVP and sustain operations',
          'Platform scope defined from operational reality, agreed by all teams',
          'Three programs structured with owners, problem statements, and action plans',
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

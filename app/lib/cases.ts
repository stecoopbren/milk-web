export type CaseSection =
  | { type: 'split'; label: string; heading: string; body: string; bullets?: string[]; image?: string; image2?: string; video?: string }
  | { type: 'centered'; label: string; heading: string; body: string; bullets?: string[] }
  | { type: 'carousel'; images: string[] }
  | { type: 'stats'; label: string; heading: string; body: string; bullets?: string[] };

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
    category: 'Real estate project',
    heroLabel: 'From Idea to Thriving Business',
    title: 'Designing a\nRegenerative Community',
    subtitle:
      "Raw land in Costa Rica's South Caribbean. Rich ecology, protected reserves, and no vision, no strategy, no investment narrative. At risk of being sold like inventory instead of treated like the rare thing it was.",
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
        label: 'Challenge',
        heading: 'The land was extraordinary. Nobody knew it yet.',
        body: "Fifty-plus hectares on Costa Rica's South Caribbean coast, bordered by protected reserves, dense with the kind of ecology that takes generations to find. The founders knew what they had. The problem was that nobody else could see it yet.\n\nWithout a story, land like this gets priced like any other piece of raw earth. Sold to whoever shows up first, developed without intention, stripped of the thing that made it worth finding.\n\nThe risk wasn't financial. It was narrative. If the project launched without a clear vision and investment logic, it would be defined by whoever filled that vacuum. That's rarely a good outcome.",
        image: '/Chaguite/hf_20260601_021639_f873ef37-00e8-4a88-99bc-7f0540368b7e (1).webp',
      },
      {
        type: 'split',
        label: 'My Role',
        heading: 'Stop selling land. Start selling a future.',
        body: "The first conversation wasn't about logos or brochures. It was about what kind of people would choose to build a life here, what they would need to feel, and whether the project could honestly deliver that.\n\nFrom that came a single positioning decision: this wouldn't be a real estate development. It would be a regenerative community, low-density, ecologically sensitive, built for people who want to own something that means something.\n\nThat decision changed everything downstream. Lot sizes, architectural guidelines, the financial model, the investor narrative. Every part of the project was built from that positioning outward.\n\nThe work covered:",
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
        label: 'Identity system',
        heading: 'A mark built to last as long as the land.',
        body: "The identity starts with a seed.\n\nNot as metaphor. As the literal center of what Chagüite is: something planted with intention, designed to grow, tended by people who understand that what you build now shapes what exists in fifty years.\n\nThe seed sits inside a crest. A reference to lineage and stewardship. The idea that land isn't owned. It's held, passed forward, cared for. The crest signals permanence and intention, framing the project as something to be sustained across generations rather than extracted and sold.\n\nThe result is a mark that earns its weight. Timeless without being archaic. Grounded without being heavy.",
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
        heading: '60% increase in price per m² and $2 million secured in first round of investment.',
        body: "Raw land gets priced by comparison. Whatever sold nearby, whatever looks similar. That math is neutral. It punishes anything unusual.\n\nThe positioning changed what buyers were comparing Chagüite to. Not other parcels. The decision to invest in something that mattered, or not to.\n\nThose are different decisions. They attract different people.\n\nIt created the foundation for:",
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
    category: 'Brand identity & strategy',
    title: 'Built from culture.\nNot from mood boards.',
    subtitle:
      "Casa Siwä is a luxury retreat on the South Caribbean coast of Costa Rica, built on ancestral Bribri land. We designed the complete brand identity: visual system, verbal identity, and every physical touchpoint, rooted in 10,000 years of living Bribri culture.",
    tags: ['Brand identity', 'Strategy', 'Cultural narrative', 'Art direction', 'Hospitality'],
    heroImage: '/Siwa/siwa-stone-hero.webp',
    heroImages: [
      '/Siwa/siwa-stone-hero.webp',
      '/Siwa/hf_20260530_004913_e18d2766-720f-4b3d-aeea-19042417dcfc.webp',
      '/Siwa/hf_20260530_005122_ae9a197c-8f5f-48be-8c2a-88569d98af81.webp',
      '/Siwa/hf_20260530_010108_6cc9af61-f105-4d35-a456-02c70122d4fa.webp',
      '/Siwa/hf_20260530_010422_6e1baf86-9dd4-4520-a506-bf51ac168b75.webp',
      '/Siwa/hf_20260530_010811_ab2a0e3b-dac8-4a94-aeec-97b849ecf02a.webp',
      '/Siwa/hf_20260530_011818_1ccc9b48-4177-4e24-931e-79b8b3b2da5f.webp',
    ],
    sections: [
      {
        type: 'split',
        label: 'The territory',
        heading: 'This land already had a name. Our job was to honour it.',
        body: "The Bribri people have lived on this coast for millennia. Their world is organized around Sibö, a creator deity present in every living thing: the forest, the river, the seed, the sun.\n\nSiwä is a word from that lineage. The land already had meaning before the first stone was laid.\n\nThe problem wasn't standing out in a crowded hospitality market. It was a harder challenge: how do you build a brand on top of something ancient without reducing it? Most brands that try turn culture into decoration. That's not respect. It's extraction.",
        image: '/Siwa/siwa-challenge-wide.webp',
      },
      {
        type: 'split',
        label: 'The work',
        heading: 'Every mark had to be earned, not invented.',
        body: "We started with the Bribri visual and oral tradition, not mood boards. The Bribri use the sun as a primary symbol of Sibö's creative force: rising, radiating, imperfect. Not a geometric abstraction. A living mark made by hand, pressed into clay, carved into wood, worn on the body.\n\nThat became the foundation of the wordmark. An organic sun with irregular, uneven rays. A dark seed at its center: origin, potential, continuity. The typography followed the same principle: rounded, rooted in the handmade.\n\nThe palette came directly from the land. Volcanic black, deep jungle green, cacao brown, warm terracotta. Every choice has a reference. None of them were made in a mood board.",
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
        body: "The Casa Siwä mark is not inspired by indigenous aesthetics. It is an interpretation of a specific symbol, the Bribri solar figure, adapted with integrity and built into a complete brand language.\n\nThe sun's irregular rays are intentional. They resist the clean geometry of corporate identity. They carry the hand, the tool, the person who made them. The seed at the center is Sibö. The space around it is the forest.\n\nApplied across every touchpoint, from embossed soap to woven towel tags to leather key fobs, the mark doesn't interpret culture. It comes from it. That difference is visible. And guests feel it before they can name it.",
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
        label: 'What we left behind',
        heading: 'A brand with roots deep enough to last.',
        body: "Most hospitality brands are built on atmosphere. Photography of empty pools. Language about transformation that could belong to anyone.\n\nThe work covered the full scope: mark, visual system, tone of voice, verbal identity, and every physical touchpoint. But the foundation isn't a design system. It's a story that was already there before we arrived.\n\nCasa Siwä has something most brands spend decades trying to manufacture: a real place, a real history, a real people whose worldview lives in the mark on every door. That foundation can't be copied. Because it isn't a style.",
      },
    ],
  },
  {
    slug: 'gxm',
    client: 'GXM',
    category: 'Product strategy & transformation',
    heroLabel: 'Product Strategy & Transformation',
    title: 'The method that\nunlocked everything.',
    subtitle:
      'A world-class compliance firm managing corporate entities across 120+ countries. Deep institutional knowledge, no product infrastructure to carry it. Thirty days to MVP. Two months to close a major investment round. The gap between knowing and shipping isn\'t talent. It\'s process.',
    tags: ['Product Strategy', 'User Research', 'Service Design', 'UX Leadership', 'Enterprise SaaS'],
    heroImage: '/GXM/IMG_9711.jpg',
    heroImages: [
      '/GXM/IMG_9711.jpg',
      '/GXM/IMG_9702.jpg',
      '/GXM/Case 2/gxm-remote-workshop.png',
      '/GXM/Case 2/Screenshot 2026-08-03 at 10.25.22 AM.png',
      '/GXM/gxm-journey-map.png',
      '/GXM/Case 2/Screenshot 2026-08-03 at 11.06.20 AM.png',
      '/GXM/Case 2/Assesment.png',
      '/GXM/gxm-programs.png',
      '/GXM/Case 2/assesment 2.png',
      '/GXM/gxm-scope-definition.png',
      '/GXM/Case 2/Screenshot 2024-07-25 at 4.14.41 PM.png',
      '/GXM/gxm-data-structure.png',
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
        heading: 'World-class at what they do.\nReady to build the product to prove it.',
        body: "The VP of Technology reached out directly. We had worked together before, on a product engagement for a globally recognised brand that I'm not at liberty to name. He knew how I worked. That prior relationship was the reason I got the call.\n\nThe brief was clear: take a world-class compliance and governance firm operating across more than 120 countries and help them build the software platform their service model had needed for years. Their clients are multinationals. Their team is lawyers, accountants, HR experts, and governance specialists who've spent careers thinking in jurisdictions, not sprint cycles. The domain expertise in the room was exceptional. What they needed was someone who could translate it into a product.\n\nThe business had board backing, investor conviction, and a clear opportunity: a platform that centralised what the team was managing manually across dozens of tools and jurisdictions. Two previous initiatives had pushed toward that goal and generated real, valuable learning. Building enterprise software for a service model this complex is genuinely hard. The structure of the business, the relationships between entities, the compliance and governance workflows — none of it maps cleanly onto off-the-shelf thinking.\n\nThe third attempt came with a tight constraint: one month to ship an MVP, two months to produce the outcomes that would go in front of investors. That kind of timeline doesn't leave room for building the wrong thing. The work had to start somewhere different.",
      },
      {
        type: 'split',
        label: 'The room',
        heading: 'Lawyers don\'t map customer journeys.\nUntil they do.',
        body: "The first decision was not about features or frameworks. It was about who needed to be in the room.\n\nThe full cross-functional leadership team came together: compliance lawyers, senior accountants, HR specialists, operations leads, and product owners. People who had spent decades being very good at governance and very far from product thinking. The goal was not to turn them into product managers. It was to extract the understanding that lived in their heads and make it visible, structured, and shared.\n\nWe mapped the end-to-end customer journey from first contact through to ongoing service, with everyone who touched any part of it in the room at the same time.\n\nWhat happened was the kind of conversation that doesn't happen in a status update. A senior compliance specialist described a client handoff the same way the account team called it broken. What one group treated as standard process, another experienced as friction. That gap, between how the service was designed and how it was actually lived, was where the real product requirements were hiding.\n\nThe output went beyond a product plan. The alignment process also defined what the organisation needed to operate it: the programs that had to exist, the staffing required to run them, and the operational model that would connect the platform to the teams it served. Product scope and organisational design, produced in the same room by the same people.\n\nWhat made that possible was something worth naming. Most of the people involved had never been part of a product build before. Compliance specialists, accountants, HR leaders: professionals whose entire careers had been built in governance, not product development. And yet the process created a flow of collaboration that carried the whole team through it. Not despite their inexperience with building, but partly because of it. They brought no assumptions about how this was supposed to feel. They just worked the problem.",
        bullets: [
          'End-to-end journey map built collaboratively across the full leadership team',
          'Three programs defined with owners, problem statements, and sequenced action plans',
          'Operations model, program structure, and staffing plan defined as part of the alignment output',
          'Platform scope grounded in operational reality, not product assumptions',
          '$2M in board funding secured on the strength of the alignment output',
        ],
        image: '/GXM/IMG_9702.jpg',
      },
      {
        type: 'carousel',
        images: [
          '/GXM/gxm-journey-map.png',
          '/GXM/gxm-programs.png',
          '/GXM/gxm-scope-definition.png',
          '/GXM/gxm-data-structure.png',
          '/GXM/IMG_9702-2.jpg',
        ],
      },
      {
        type: 'split',
        label: 'The method',
        heading: 'Evidence over assumption.\nAt every step.',
        body: "One month to ship an MVP. Under that constraint, the most dangerous thing you can do is start building before you know what to build.\n\nThe core belief was documented first: customer data was locked in Salesforce, invisible to the people who needed it. Clients had to ask the team for information about their own accounts. The team had to pull, format, and resend it. That loop compounded on both sides with every engagement. The hypothesis made it testable.\n\nBefore designing anything new, we audited what already existed: Gateway 1.0, the portal built to solve this problem. Systematically through every path a customer could take, every place the experience broke down. The findings were specific. The ticketing system buried new messages beneath old ones. Key account information was either missing or unfindable. The portal existed. Understanding precisely why it wasn't being used was the only honest starting point for building something that would be.\n\nTwelve interviews followed, across active users and those who had moved away. The pattern was clear: when the platform couldn't surface what was needed, people defaulted to email. Small friction, but enough to make a familiar tool feel faster. That habit was invisible to individuals. Internally, it created missed messages, rework, and margin erosion that scaled with every engagement.\n\nThen we stress-tested the build decision itself. Live demos with four leading platforms. Data schemas reviewed. Feature sets mapped against the actual operational model. Some came close. None fit. The compliance workflows, the entity relationships, the governance structures — nothing aligned cleanly enough to justify adapting the business to an external tool's constraints. The analysis didn't just confirm the decision to build. It gave the team evidence they could defend at board level.\n\nAll of that before a single screen was designed. Not because there was time to spare. Because there wasn't.",
        image: '/GXM/Case 2/Screenshot 2026-08-03 at 10.25.22 AM.png',
        video: '/GXM/Case 2/gxm-gateway-walkthrough.mp4',
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
        type: 'stats',
        label: 'Impact',
        heading: 'Why the third attempt was different.',
        body: "One month to build. Two months to perform. The product shipped, the outcomes landed, and the investor pitch had the evidence to back it.\n\nThe first two initiatives had moved the business forward. They had surfaced the complexity that needed to be confronted and proved what wouldn't scale. The third attempt succeeded because it treated that complexity seriously instead of routing around it. Every decision in the build phase had a documented rationale. The team knew what to build, in what order, and exactly why it would land differently.\n\nA major investment round followed. Closed on the strength of a product strategy that had been built from evidence, not assumptions, by a team that had never built a product before and delivered something worth funding.\n\nFor me, this project was also a window into the world of startup funding in the US: how structured evidence becomes the instrument that unlocks capital, what investors evaluate when they commit, and why the work done before the first screen is designed often determines what's possible long after it ships. That perspective has stayed with me.\n\nThat sequence was the investment. The software was what it bought.",
        bullets: [
          'MVP shipped within one month',
          'Business outcomes validated within two months for investor pitch',
          'Major investment round closed on the strength of the validated product strategy',
          'Operations model, program structure, and staffing plan defined in the alignment phase',
          '12 user interviews across active and lapsed user groups',
          'Full audit of Gateway 1.0 with root causes documented',
          'Competitive analysis across 4 leading platforms with live demos',
          'Service blueprints covering every major operational flow',
        ],
      },
    ],
  },
  {
    slug: 'gxm-validate-before-you-build',
    client: 'From Hypothesis to Evidence',
    category: 'Product strategy & transformation',
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
    category: 'Product strategy & transformation',
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
      '/GXM/gxm-programs.png',
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
          '/GXM/gxm-programs.png',
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

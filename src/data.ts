import { Project, CreativeItem, WebsiteShowcase, BusinessVenture, VolunteeringExp, Certification, BlogPost } from './types';

export const projectsData: Project[] = [
  {
    id: 'fmcg-noon-gcc',
    title: 'FMCG Growth Strategy',
    subtitle: 'Directing profit optimization and automated pricing parity logic to capture high-margin demand.',
    market: 'NOON GCC (Saudi Arabia & UAE)',
    industry: 'FMCG (Fast-Moving Consumer Goods)',
    stats: '+142% Year-over-Year Revenue Growth',
    services: [
      'Multi-Channel Listing Optimization',
      'Dynamic Pricing Engine',
      'Margin and Buy-Box Safeguards',
      'Inventory Stocking Efficiency'
    ],
    results: [
      'Achieved a net profit margin expansion of 8.4% through dynamic bundling and smart discount tiering.',
      'Designed and deployed Excel-integrated reporting trackers linked to real-time Noon price crawlers.',
      'Reduced shelf out-of-stock events from 22% to less than 3% during peak promotional campaigns.'
    ],
    fullDetails: 'Operating in the highly aggressive Noon GCC market requires surgical precision of margins. This project involved standardizing a dynamic inventory forecasting tool using advanced Excel modeling, automating SKU price adjustments against competitor buy-box trackers, and configuring promotional campaigns that preserved a strict 15% target margin baseline.'
  },
  {
    id: 'amazon-skincare-usa',
    title: 'Skincare Brand Marketplace Dominance',
    subtitle: 'Executing complete keyword rewriting, A+ creative production, and laser-targeted PPC campaigns.',
    market: 'Amazon USA',
    industry: 'Skincare & Cosmetics',
    stats: '-34% ACoS Improvement & +85% Sales Rate',
    services: [
      'A+ Enhanced Brand Content Creation',
      'Amazon PPC Campaign Re-architecting',
      'Keyword and Category SEO Rewriting',
      'Competitive Intelligence Auditing'
    ],
    results: [
      'Boosted listing organic conversion rates from 4.2% to 11.8% in just 90 days of A+ Content deployment.',
      'Reduced wasteful ad spend by restructuring broad campaigns into highly targeted negative phrase structures.',
      'Maintained category Best Seller Ribbon positions during critical seasonal quarters.'
    ],
    fullDetails: 'With skincare being one of the most competitive segments on Amazon US, success hinges on conversion-friendly image stacks, keyword-optimized bullet points, and highly efficient PPC structures. This project focused on listing SEO refinement for search terms with high purchase intent, paired with direct visual copywriting.'
  },
  {
    id: 'ecommerce-saas-dashboard',
    title: 'Vercel-Based SaaS Interactive Suite',
    subtitle: 'Building specialized React-based client tools for invoice, listing, and margin forecasting.',
    market: 'Global / Self-Initiated',
    industry: 'Software as a Service (SaaS)',
    stats: '1,200+ Active Virtual Test Queries',
    services: [
      'React & Vite Architectural Design',
      'Tailwind CSS UI Modernization',
      'Client-Side Margin Computing Engines',
      'Interactive Chart Visualization'
    ],
    results: [
      'Created an ultra-fast local invoice generator that saves operators 4 hours per week on average.',
      'Implemented real-time margin and discount forecasting worksheets directly inside the browser canvas.',
      'Fully optimized for sub-100ms load times using static state management architectures.'
    ],
    fullDetails: 'A high-performance interactive suite engineered using React, Vite, and Vercel. Features live calculators for Noon GCC pricing, Amazon USA listing graders, and a gorgeous responsive UI styled with Linear.app and Vercel minimalism in mind.'
  },
  {
    id: 'unicef-operations-strategy',
    title: 'UNICEF Digital Event Mobilization',
    subtitle: 'Structuring volunteer communication, content strategy, and educational digital programs.',
    market: 'Southeast Asia Regional Offices',
    industry: 'Non-Profit / Humanitarian',
    stats: '5,000+ Young Learners Impacted',
    services: [
      'National Educational Workshop Planning',
      'Digital Assets & Media Coordination',
      'Event Logistics Operations',
      'Social Advocacy Content Design'
    ],
    results: [
      'Coordinated visual graphics and volunteer campaign templates for UNICEF office networks.',
      'Delivered training and workshops as a Google Certified Education Trainer empowering youth cohorts.',
      'Enhanced information delivery times across active digital volunteer committees.'
    ],
    fullDetails: 'Collaborating closely with both the Yangon (Myanmar) and Southeast Asia Regional (Bangkok, Thailand) offices. Provided hands-on leadership for youth event organizing, creative graphic assets planning, and technical digital teaching curriculum implementation.'
  }
];

export const creativeItemsData: CreativeItem[] = [
  {
    id: 'c1',
    category: 'graphics',
    title: 'Noon GCC Campaign Banner Set',
    subtitle: 'High-conversion FMCG promotional creatives',
    imageUrl: 'Noon FMCG Ad',
    embedType: 'css-animated',
    techUsed: ['Photoshop', 'Figma', 'Noon Style Guide']
  },
  {
    id: 'c2',
    category: 'motion',
    title: 'Skincare Brand Animation Loop',
    subtitle: 'Kinetic product benefits visualizer for Amazon A+ Content',
    imageUrl: 'Skincare Motion Grid',
    embedType: 'css-animated',
    techUsed: ['After Effects', 'Lottie', 'Web-optimized CSS']
  },
  {
    id: 'c3',
    category: 'photography',
    title: 'FMCG Product Presentation Grid',
    subtitle: 'Visual studio layout for eCommerce product listings',
    imageUrl: 'FMCG Packshots',
    embedType: 'image',
    techUsed: ['Studio Lighting', 'Lightroom', 'Background Isolation']
  },
  {
    id: 'c4',
    category: 'social',
    title: 'UNICEF SEA Digital Campaign Hub',
    subtitle: 'Social media layouts advocating youth digital literacy',
    imageUrl: 'UNICEF SEA Campaign',
    embedType: 'image',
    techUsed: ['Figma', 'Visual Contrast Standards', 'Accessibility']
  },
  {
    id: 'c5',
    category: 'graphics',
    title: 'Apple-inspired Minimalist Asset Pack',
    subtitle: 'Dark-mode user interface cards and illustration vectors',
    imageUrl: 'Dark UI Bento Vector',
    embedType: 'css-animated',
    techUsed: ['Illustrator', 'Figma', 'Tailwind Colors']
  },
  {
    id: 'c6',
    category: 'motion',
    title: 'Bento Grid Micro-Animations',
    subtitle: 'Delightful interactive state animations for portfolio interfaces',
    imageUrl: 'Micro-interactions Sandbox',
    embedType: 'css-animated',
    techUsed: ['motion/react', 'Tailwind', 'React States']
  }
];

export const websitesData: WebsiteShowcase[] = [
  {
    id: 'w1',
    title: 'Noon GCC Dynamic Pricing Estimator',
    tagline: 'FMCG Price & Margin Simulation Workspace',
    description: 'An interactive simulator built directly inside this portfolio allowing you to test real-world GCC FMCG marketplace scenarios. Model Noon commission, logistics, Vat, and local coupons.',
    tech: ['React', 'Tailwind API', 'Excel Logic Port'],
    mockType: 'pricing-calculator',
    caseStudy: 'In FMCG, price parity between Amazon UAE and Noon Saudi Arabia is critical. This calculator models dynamic commission structures, standard GCC FBN fees, packaging, and the user-specified discount threshold to compute the real net margin on each sale.'
  },
  {
    id: 'w2',
    title: 'Skincare Amazon Listing SEO Grader',
    tagline: 'Amazon USA Conversion & Keyword Audit Box',
    description: 'Type a skincare product topic to dynamically scan listing parameters (A+ Content presence, image density, negative match structure) and retrieve localized scoring and optimization priorities.',
    tech: ['React state', 'Keyword Scoring Matrix', 'SEO Logic'],
    mockType: 'seo-grader',
    caseStudy: 'Amazon SEO relies heavily on indexing. This interactive widget parses real listing criteria (Character counts, Image ratio, PPC targeting clusters) and scores them against proven Amazon skincare success benchmarks.'
  },
  {
    id: 'w3',
    title: 'SaaS Marketplace KPI Dashboard',
    tagline: 'Live Vector Chart Monitoring System',
    description: 'A completely styled modern reporting dashboard. Filter ecommerce KPIs, ACoS tracking, total sales, and active campaign timelines to visualize real-time dynamic charts made with SVG.',
    tech: ['SVG Paths', 'Dynamic Metrics State', 'Linear UI Style'],
    mockType: 'kpi-dashboard',
    caseStudy: 'Reporting is nothing without scannability. This elegant dashboard represents key FMCG and Skincare metrics, dynamically rendering SVG grids and sparklines without heavy third-party dashboard overhead.'
  },
  {
    id: 'w4',
    title: 'UNICEF Regional Event Planning Hub',
    tagline: 'Interactive Interactive Operation System and Timeline',
    description: 'Visualize campaign roadmaps, volunteer allocation matrixes, and training milestone paths across Southeast Asian offices (Yangon and regional branches).',
    tech: ['Timeline UI', 'Milestone Hooks', 'Operation Flow'],
    mockType: 'event-timeline',
    caseStudy: 'Non-profit event organization is highly time-sensitive. This interactive visual scheduler lets you review live campaign planning tracks, showcasing direct volunteer logistics operations.'
  }
];

export const venturesData: BusinessVenture[] = [
  {
    id: 'v1',
    title: 'FMCG Middle East Retail Sandbox',
    type: 'E-commerce Brand',
    tag: 'Ecommerce',
    metrics: 'AED 45,000 Volume Simulated',
    description: 'An agile, independent marketplace incubator testing high-demand household items across Noon and Amazon UAE with rapid inventory cycles.',
    longDescription: 'This venture focused on extreme lean inventory models. Utilizing local GCC distributors for same-day delivery to Noon warehouses (FBN), minimizing working capital while optimizing digital listings for organic rank. The operational setup uses fully automated price-adjustments based on real competitor scrapers.'
  },
  {
    id: 'v2',
    title: 'AutoMargin.io',
    type: 'SaaS Application',
    tag: 'SaaS',
    metrics: 'Beta - Internal Tooling',
    description: 'An automated desktop service parsing daily Excel inventory files and returning live pricing recommendations matching competitor buyout events.',
    longDescription: 'Engineered as a lightweight SaaS concept to bypass heavy enterprise pricing suites. It maps complex retail cost layers (Vat, Noon fees, warehouse storage tiers) directly onto dynamic digital market pricing lists, helping small to mid-sized FMCG brands preserve margins.'
  },
  {
    id: 'v3',
    title: 'High-Conversion Skincare Layout Kits',
    type: 'Digital Product',
    tag: 'Digital Product',
    metrics: '95+ Copy templates sold',
    description: 'A curated templates product comprising proven Figma layout wireframes and visual templates designed for Amazon USA A+ content designers.',
    longDescription: 'Designed based on my experience optimized top-tier skincare products under Amazon US. Includes pre-computed grid layouts, optimized graphic aspect-ratio bounds, and high-CTR copywriting templates for visual product benefit carousels.'
  }
];

export const volunteeringData: VolunteeringExp[] = [
  {
    id: 'u-yangon',
    organization: 'UNICEF Yangon Office',
    role: 'Digital Communications Specialist & Facilitator',
    period: '2023 - Present',
    location: 'Yangon, Myanmar',
    points: [
      'Supported local digital advocacy workflows, training visual content developers for multi-platform educational rollouts.',
      'Developed localized digital layouts in support of clean water campaigns and educational equality programs.',
      'Facilitated offline and online workspace collaboration tools to coordinate local volunteer cohorts on critical field operations.'
    ],
    impactStat: 'Trained 120+ local youth organizers'
  },
  {
    id: 'u-sea',
    organization: 'UNICEF Southeast Asia Region (Thai Office)',
    role: 'Regional Digital Campaign and Resource Developer',
    period: '2024 - Present',
    location: 'Bangkok, Thailand (Remote Office Liaison)',
    points: [
      'Assisted in the design, development, and formatting of regional communication slide arrays and multi-lingual visual assets.',
      'Established streamlined collaborative folders on Google Workspace to fast-track resource sharing across diverse sub-authorities.',
      'Engaged with regional youth networks to run interactive training clinics focusing on visual design accessibility standards.'
    ],
    impactStat: 'Created 40+ high-engagement regional assets'
  },
  {
    id: 'comm-edu',
    organization: 'Community Digital Literacy Program',
    role: 'Lead Google Certified Education Trainer',
    period: 'Ongoing',
    location: 'Southeast Asia / UAE',
    points: [
      'Delivered structured coaching sessions for young professionals of underrepresented cohorts on Master-tier Advanced Excel & Automation.',
      'Trained digital marketers on clean, search-prioritized ecommerce list construction for global markets (Amazon & Noon).',
      'Developed customized, open-source learning templates and dynamic calculators to simplify accounting concepts.'
    ],
    impactStat: '300+ students certified / instructed'
  }
];

export const certificationsData: Certification[] = [
  { id: 'cert-google-trainer', title: 'Google Certified Educator & Trainer', issuer: 'Google for Education', year: '2024', accent: 'from-blue-500 to-red-500' },
  { id: 'cert-google-analytics', title: 'Google Analytics Individual Qualification (GA4)', issuer: 'Google Skillshop', year: '2024', accent: 'from-amber-400 to-yellow-600' },
  { id: 'cert-meta-blueprint', title: 'Meta Certified Digital Marketing Associate', issuer: 'Meta Blueprint', year: '2023', accent: 'from-indigo-500 to-blue-600' },
  { id: 'cert-amazon-ads', title: 'Amazon Sponsored Ads & Retail Certified', issuer: 'Amazon Learning Console', year: '2024', accent: 'from-amber-500 to-orange-500' },
  { id: 'cert-noon-pricing', title: 'Noon GCC Marketplace & Pricing Strategist Badge', issuer: 'GCC E-commerce Alliance', year: '2025', accent: 'from-emerald-500 to-teal-600' },
  { id: 'cert-saas-tailwind', title: 'Advanced Frontend & Tailwind Architect Certification', issuer: 'Frontend Masters Accredited', year: '2024', accent: 'from-purple-500 to-pink-600' }
];

export const blogPostsData: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Amazon UAE & KSA SEO Guide: Maximizing Organic Visibility in GCC',
    slug: 'amazon-uae-seo-guide',
    excerpt: 'Deep-dive into the unique requirements of localized keyword indexing, high-density listing metrics, and optimizing for Arabic/English search intent in Middle East markets.',
    readTime: '6 min read',
    date: 'June 18, 2026',
    category: 'Amazon Retail',
    content: `### Optimizing for Middle East E-commerce Intent
Operating on Amazon Middle East (UAE and Saudi Arabia) presents an incredible growth territory, but typical US-centric SEO plays fail because search behavior in the Gulf has distinct localized features:

1. **Dual-Language Indexing (Arabic & English):** 
Over 45% of shoppers search using Arabic keyword structures, but convert on listings featuring comprehensive English data. Your search target backend must include highly scrutinized literal translations and phonetic transliterations (e.g., spelling a brand name phonetically in Arabic characters).

2. **High Density Mobile Optimization:**
Over 80% of regional GCC buyers complete purchases on mobile screens rather than desktop. Consequently, your **Bullet Points** must be short, action-oriented, and utilize bullet emojis to break up visual space. The first three display bullets are critical for driving immediate conversion before a user scrolls past the buy box.

3. **Optimizing Search Term Backends:**
Leave out duplicate terms, punctuation, and competitor names. Keep the Search Terms index of your skincare or FMCG listings strictly dedicated to high-volume localized terms like "sunscreen UAE", "moisturizer dry skin dubai", and Arabic synonymous words. Use search-query-performance data inside Vendor/Seller central daily.`
  },
  {
    id: 'post-2',
    title: 'Noon dynamic Pricing & Margin Strategies for High-Velocity Brands',
    slug: 'noon-pricing-strategy-gcc',
    excerpt: 'How to defend profit margins, capture the Buy Box on Noon GCC, and manage dynamic VAT structures without executing a race-to-the-bottom markdown.',
    readTime: '8 min read',
    date: 'June 12, 2026',
    category: 'Marketplace Operations',
    content: `### Winning the Noon Buy-Box Safely
On Noon GCC (Saudi Arabia and UAE), the buy-box is aggressively contested by multiple distributors. To win sustainable volume without tanking your net margin, follow these essential operational mechanics:

*   **Integrate Dynamic Margin Guardrails:** Never let automated repricers operate in a vacuum. Always link your buy-box parity tools directly to an Excel-managed **Cost of Goods Sold (COGS)** spreadsheet that embeds Noon FBN logistics fees, packaging cost, and localized VAT.
*   **The Power of Exclusive Dynamic Bundling:** Instead of slashing prices on a single SKU, construct co-packing bundles (e.g., Buy 2 get 1 Free or Skincare Routine Sets) that receive distinct ASIN/SKU designations. These bundles face zero buy-box competitors, securing 100% search control and premium pricing.
*   **Managing Noon Promo Codes (Noon Coupons):** Noon often operates sitewide coupon codes (e.g., "SAVE10"). Assess who is taking the haircut. For self-participating campaigns, understand that local platform VAT (5% in UAE, 15% in Saudi Arabia) is calculated on the net selling price post-promotion.`
  },
  {
    id: 'post-3',
    title: 'Building Lightweight Ecommerce Reporting Dashboards via React & Excel Pipes',
    slug: 'ecommerce-reporting-dashboard',
    excerpt: 'Move away from clunky enterprise dashboards. Learn how to construct swift, client-side KPI reporting blocks using Excel pipelines styled with Tailwind CSS.',
    readTime: '5 min read',
    date: 'May 28, 2026',
    category: 'Data Analytics',
    content: `### Why Enterprise BI Suites Slow You Down
For growth specialists managing sub-million dollar brands, logging into multiple hefty BI platforms is an operational bottleneck. A custom React toolkit can load critical data instantly:

*   **Excel to JSON pipelines:** Modern frontends can easily parse lightweight CSV reports downloadable directly from Amazon PPC console and Noon seller port.
*   **SVG-First Analytics:** Rendering charts statically using raw SVG paths and CSS coordinates keeps the site light, super fast, and highly customizable. It avoids importing heavy canvas libraries that degrade performance.
*   **Key Growth KPIs to Monitor Daily:**
    1.  **ACoS (Advertising Cost of Sales):** Track performance marketing efficiency.
    2.  **TACoS (Total Advertising Cost of Sales):** Measures ad spend against global revenue. Target 8-12% for healthy skincare portfolios.
    3.  **Net Margin Post-Ad:** The ultimate survival metric in FMCG operations.`
  },
  {
    id: 'post-4',
    title: 'Advanced Amazon PPC: Restructuring Skincare Ad Chains for Margin Defense',
    slug: 'amazon-ppc-tips-skincare',
    excerpt: 'Step-by-step keyword structure to dramatically decrease ad wastage, establish exact negative keyword funnels, and capture premium organic placements.',
    readTime: '7 min read',
    date: 'April 15, 2026',
    category: 'Performance PPC',
    content: `### Redesigning Your Amazon PPC Architecture
Skincare keywords on Amazon USA are notoriously expensive, with CPCs easily exceeding $4.00. To run profitable campaigns, you must structure campaigns for extreme efficiency:

1.  **The Negative Match Shield:** 
Keep a strict master list of broad, non-converting terms (e.g., "cheap face wash", "homemade serum") and apply them as **Negative Phrase** matches on day one of campaign launch. This prevents Amazon's broad match logic from running up high search tab bills.
2.  **Surgical Keyword Targeting:**
Route budget exclusively to three core tiers:
*   *Brand Protection Campaigns:* Safeguard your own brand keywords against competitor conquesting.
*   *Exact-Match High-Intent Keywords:* Target highly specific narrow terms (e.g., "organic vitamin C serum for sensitive skin") rather than massive generic categories like "serum".
*   *Product Target Ads (ASIN Conquesting):* Place Sponsored Product grids directly under under-optimized, lower-rated competitor listings.`
  }
];

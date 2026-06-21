export interface Project {
  id: string;
  title: string;
  subtitle: string;
  market: string;
  industry: string;
  stats: string;
  services: string[];
  results: string[];
  fullDetails: string;
}

export interface CreativeItem {
  id: string;
  category: 'graphics' | 'motion' | 'photography' | 'social';
  title: string;
  subtitle: string;
  imageUrl: string;
  embedType?: 'css-animated' | 'image' | 'video-mock';
  techUsed?: string[];
}

export interface WebsiteShowcase {
  id: string;
  title: string;
  tagline: string;
  description: string;
  tech: string[];
  mockType: 'pricing-calculator' | 'seo-grader' | 'kpi-dashboard' | 'event-timeline';
  caseStudy: string;
}

export interface BusinessVenture {
  id: string;
  title: string;
  type: string;
  tag: 'Ecommerce' | 'SaaS' | 'Digital Product' | 'Concept';
  metrics: string;
  description: string;
  investmentRequired?: string;
  longDescription: string;
}

export interface VolunteeringExp {
  id: string;
  organization: string;
  role: string;
  period: string;
  location: string;
  points: string[];
  impactStat: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  year: string;
  accent: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  readTime: string;
  date: string;
  category: string;
  content: string;
}

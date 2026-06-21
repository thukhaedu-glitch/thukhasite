export interface SeoFields {
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

export interface CmsFields extends SeoFields {
  published?: boolean;
  order?: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface Project extends CmsFields {
  id: string;
  title: string;
  subtitle: string;
  market: string;
  industry: string;
  stats: string;
  services: string[];
  results: string[];
  fullDetails: string;
  coverImage?: string;
  videoUrl?: string;
}

export interface CreativeItem extends CmsFields {
  id: string;
  category: "graphics" | "motion" | "photography" | "social";
  title: string;
  subtitle: string;
  imageUrl: string;
  videoUrl?: string;
  embedType?: "css-animated" | "image" | "video-mock";
  techUsed?: string[];
}

export interface WebsiteShowcase extends CmsFields {
  id: string;
  title: string;
  tagline: string;
  description: string;
  tech: string[];
  mockType:
    | "pricing-calculator"
    | "seo-grader"
    | "kpi-dashboard"
    | "event-timeline";
  caseStudy: string;
  imageUrl?: string;
  liveUrl?: string;
}

export interface BusinessVenture extends CmsFields {
  id: string;
  title: string;
  type: string;
  tag: "Ecommerce" | "SaaS" | "Digital Product" | "Concept";
  metrics: string;
  description: string;
  investmentRequired?: string;
  longDescription: string;
}

export interface VolunteeringExp extends CmsFields {
  id: string;
  organization: string;
  role: string;
  period: string;
  location: string;
  points: string[];
  impactStat: string;
}

export interface Certification extends CmsFields {
  id: string;
  title: string;
  issuer: string;
  year: string;
  accent: string;
}

export interface BlogPost extends CmsFields {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  readTime: string;
  date: string;
  category: string;
  content: string;
  coverImage?: string;
  videoUrl?: string;
}

export interface SiteSettings extends SeoFields {
  id: "main";
  siteName: string;
  tagline: string;
  author: string;
  siteUrl: string;
  twitterHandle?: string;
  defaultOgImage?: string;
  googleSiteVerification?: string;
}

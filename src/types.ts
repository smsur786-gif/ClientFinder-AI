export interface DemoSite {
  id: string;
  businessId: string;
  heroTitle: string;
  heroSubtitle: string;
  description: string;
  brandColor: string; // e.g. '#3B82F6'
  theme: 'modern' | 'minimal' | 'bold' | 'classic';
  aboutText: string;
  services: string[];
  faqs: { question: string; answer: string }[];
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  published: boolean;
}

export interface Business {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  rating: number;
  reviewsCount: number;
  mapsUrl: string;
  website: string | null;
  category: string;
  hasWebsite: boolean;
  notes: string;
  industry: string;
  city: string;
  demoId: string;
  demoSite?: DemoSite;
  opportunityScore: number; // 0-100 calculated score
}

export interface SearchHistoryItem {
  id: string;
  timestamp: string;
  industry: string;
  city: string;
  totalFound: number;
  noWebsite: number;
  demoSitesCount: number;
  businesses: Business[];
}

export interface OutreachMessage {
  id: string;
  businessId: string;
  type: 'email' | 'sms' | 'linkedin' | 'instagram' | 'phone_script' | 'follow_up';
  content: string;
  timestamp: string;
}

export interface SubscriptionPlan {
  id: 'free' | 'pro' | 'agency';
  name: string;
  price: string;
  period: string;
  searchesLimit: string;
  demosLimit: string;
  features: string[];
}

export interface BYOKConfig {
  provider: 'gemini' | 'openai' | 'anthropic' | 'custom';
  apiKey: string;
  baseUrl: string;
  modelName: string;
  temperature: number;
  mapsMode?: 'simulated' | 'live';
  mapsApiKey?: string;
}


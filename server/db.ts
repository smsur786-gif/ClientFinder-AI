import fs from 'fs';
import path from 'path';
import { Business, DemoSite, SearchHistoryItem, OutreachMessage, BYOKConfig } from '../src/types';

const DB_FILE = path.join(process.cwd(), 'db.json');

interface Schema {
  history: SearchHistoryItem[];
  subscription: {
    planId: 'free' | 'pro' | 'agency';
    searchesPerformed: number;
    demosGenerated: number;
  };
  byok?: BYOKConfig;
}

// Helper to generate premium fallback demo websites
export function createDefaultDemoSite(business: { id: string; name: string; category: string; address: string; phone: string; email: string }): DemoSite {
  const brandColors = ['#2563EB', '#10B981', '#6366F1', '#EC4899', '#F59E0B', '#14B8A6'];
  const brandColor = brandColors[Math.abs(business.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % brandColors.length];
  
  const servicesList: Record<string, string[]> = {
    'plumber': ['Emergency Drain Cleaning', 'Leak Detection & Repair', 'Water Heater Installation', 'Sump Pump Services', 'Sewer Line Diagnostics', 'Commercial Plumbing Solutions'],
    'dentist': ['General Teeth Cleaning', 'Cosmetic Teeth Whitening', 'Dental Implants', 'Root Canal Therapy', 'Pediatric Dentistry', 'Emergency Dental Care'],
    'electrician': ['Residential Rewiring', 'Electrical Panel Upgrades', 'Smart Home Installations', 'Lighting Design & Fitting', 'Safety Inspections', 'Commercial Electrical Services'],
    'hvac': ['AC Repair & Diagnostics', 'Heating System Maintenance', 'Furnace Installation', 'Indoor Air Quality Audits', 'Duct Cleaning Services', 'Thermostat Upgrades'],
    'salon': ['Haircuts & Professional Styling', 'Creative Coloring & Highlights', 'Balayage Treatments', 'Keratin Smoothing', 'Facial & Skincare Therapies', 'Bridal & Event Styling'],
    'default': ['Premium Quality Service', 'Custom Tailored Solutions', 'Free Consultations', '24/7 Support Hotline', 'Certified Professionals', 'Guaranteed Satisfaction']
  };

  const industryKey = business.category.toLowerCase();
  const services = servicesList[industryKey] || servicesList['default'];

  return {
    id: `demo-${business.id}`,
    businessId: business.id,
    heroTitle: `Trusted ${business.name} Solutions`,
    heroSubtitle: `Expert local services designed specifically for your home and commercial needs. Fast response, guaranteed satisfaction, and certified specialists.`,
    description: `At ${business.name}, we pride ourselves on providing premier ${business.category} services to the local community. With years of experience and dedicated certified experts, we ensure your needs are met promptly and with the highest craftsmanship.`,
    brandColor,
    theme: 'modern',
    aboutText: `Our mission at ${business.name} is to combine world-class techniques with local hospitality. Whether you're dealing with an urgent emergency or planning a major upgrade, our highly trained team is equipped with top-tier equipment and knowledge to deliver outstanding outcomes.`,
    services,
    faqs: [
      { question: 'Do you offer emergency callouts?', answer: 'Yes, we provide prompt response services for all urgent emergencies.' },
      { question: 'Are your technicians certified and fully insured?', answer: 'Absolutely. Every member of our field team is fully licensed, background-checked, and comprehensive liability-insured.' },
      { question: 'Do you provide free upfront estimates?', answer: 'Yes! We believe in transparent pricing. We provide comprehensive, no-obligation written quotes before starting any project.' }
    ],
    contactEmail: business.email,
    contactPhone: business.phone,
    contactAddress: business.address,
    published: true
  };
}

// Generate Bentonville Plumbers Seed Data
const seedHistory: SearchHistoryItem[] = [
  {
    id: 'search-bentonville-plumber',
    timestamp: new Date('2026-07-19T10:30:00Z').toISOString(),
    industry: 'Plumber',
    city: 'Bentonville, AR',
    totalFound: 17,
    noWebsite: 11,
    demoSitesCount: 11,
    businesses: [
      {
        id: 'biz-valley-pro',
        name: 'Valley Pro Plumbing Co',
        phone: '(501) 691-4466',
        email: 'outreach@valleyproplumbing.com',
        address: '1795 E Monroe Ave, Bentonville, AR',
        rating: 4.6,
        reviewsCount: 116,
        mapsUrl: 'https://maps.google.com/?q=Valley+Pro+Plumbing+Co+Bentonville+AR',
        website: null,
        category: 'Plumber',
        hasWebsite: false,
        notes: 'Great lead! High number of reviews but completely missing online presence.',
        industry: 'Plumber',
        city: 'Bentonville, AR',
        demoId: 'demo-biz-valley-pro',
        opportunityScore: 89
      },
      {
        id: 'biz-desert-flow',
        name: 'Desert Flow Water Works',
        phone: '(501) 285-7680',
        email: 'info@desertflowwater.com',
        address: '972 SW Union Ave, Bentonville, AR',
        rating: 4.0,
        reviewsCount: 80,
        mapsUrl: 'https://maps.google.com/?q=Desert+Flow+Water+Works+Bentonville+AR',
        website: null,
        category: 'Plumber',
        hasWebsite: false,
        notes: '',
        industry: 'Plumber',
        city: 'Bentonville, AR',
        demoId: 'demo-biz-desert-flow',
        opportunityScore: 78
      },
      {
        id: 'biz-copper-state',
        name: 'Copper State Plumbing',
        phone: '(870) 803-3532',
        email: 'contact@copperstateplumbing.com',
        address: '6167 E Elm St, Bentonville, AR',
        rating: 4.5,
        reviewsCount: 213,
        mapsUrl: 'https://maps.google.com/?q=Copper+State+Plumbing+Bentonville+AR',
        website: null,
        category: 'Plumber',
        hasWebsite: false,
        notes: 'Highly rated plumber, urgent candidate for a landing page.',
        industry: 'Plumber',
        city: 'Bentonville, AR',
        demoId: 'demo-biz-copper-state',
        opportunityScore: 92
      },
      {
        id: 'biz-quick-plumb',
        name: 'Quick Plumbing Pros',
        phone: '(870) 935-6563',
        email: 'support@quickplumbingpros.com',
        address: '8668 NE Lake Dr, Bentonville, AR',
        rating: 4.8,
        reviewsCount: 117,
        mapsUrl: 'https://maps.google.com/?q=Quick+Plumbing+Pros+Bentonville+AR',
        website: null,
        category: 'Plumber',
        hasWebsite: false,
        notes: '',
        industry: 'Plumber',
        city: 'Bentonville, AR',
        demoId: 'demo-biz-quick-plumb',
        opportunityScore: 88
      },
      {
        id: 'biz-sunbelt',
        name: 'Sunbelt Plumbing Co',
        phone: '(479) 708-2438',
        email: 'service@sunbeltplumbing.com',
        address: '4588 NW Adams Dr, Bentonville, AR',
        rating: 4.9,
        reviewsCount: 137,
        mapsUrl: 'https://maps.google.com/?q=Sunbelt+Plumbing+Co+Bentonville+AR',
        website: null,
        category: 'Plumber',
        hasWebsite: false,
        notes: '',
        industry: 'Plumber',
        city: 'Bentonville, AR',
        demoId: 'demo-biz-sunbelt',
        opportunityScore: 91
      },
      {
        id: 'biz-cactus',
        name: 'Cactus Plumbing Services',
        phone: '(870) 428-8771',
        email: 'cactusplumbing@gmail.com',
        address: '7745 NE Adams Dr, Bentonville, AR',
        rating: 4.8,
        reviewsCount: 111,
        mapsUrl: 'https://maps.google.com/?q=Cactus+Plumbing+Services+Bentonville+AR',
        website: null,
        category: 'Plumber',
        hasWebsite: false,
        notes: '',
        industry: 'Plumber',
        city: 'Bentonville, AR',
        demoId: 'demo-biz-cactus',
        opportunityScore: 87
      },
      {
        id: 'biz-apex',
        name: 'Apex Plumbing Services',
        phone: '(479) 111-2222',
        email: 'contact@apexplumbing.com',
        address: '102 N Main St, Bentonville, AR',
        rating: 4.7,
        reviewsCount: 44,
        mapsUrl: 'https://maps.google.com/?q=Apex+Plumbing+Services+Bentonville+AR',
        website: 'https://apexplumbing.com',
        category: 'Plumber',
        hasWebsite: true,
        notes: '',
        industry: 'Plumber',
        city: 'Bentonville, AR',
        demoId: '',
        opportunityScore: 35
      },
      {
        id: 'biz-care',
        name: 'Bentonville Drain Care',
        phone: '(479) 555-1234',
        email: 'care@bentonvilledrain.com',
        address: '400 SE J St, Bentonville, AR',
        rating: 4.2,
        reviewsCount: 18,
        mapsUrl: 'https://maps.google.com/?q=Bentonville+Drain+Care+Bentonville+AR',
        website: null,
        category: 'Plumber',
        hasWebsite: false,
        notes: '',
        industry: 'Plumber',
        city: 'Bentonville, AR',
        demoId: 'demo-biz-care',
        opportunityScore: 68
      },
      {
        id: 'biz-rooter',
        name: 'Razorback Rooter',
        phone: '(479) 555-9876',
        email: 'razorback@rooter.com',
        address: '1205 S Walton Blvd, Bentonville, AR',
        rating: 4.3,
        reviewsCount: 152,
        mapsUrl: 'https://maps.google.com/?q=Razorback+Rooter+Bentonville+AR',
        website: 'https://razorbackrooter.com',
        category: 'Plumber',
        hasWebsite: true,
        notes: '',
        industry: 'Plumber',
        city: 'Bentonville, AR',
        demoId: '',
        opportunityScore: 32
      },
      {
        id: 'biz-blue',
        name: 'True Blue Plumbing',
        phone: '(479) 333-0099',
        email: 'info@trueblueplumb.com',
        address: '1400 SW A St, Bentonville, AR',
        rating: 4.1,
        reviewsCount: 5,
        mapsUrl: 'https://maps.google.com/?q=True+Blue+Plumbing+Bentonville+AR',
        website: null,
        category: 'Plumber',
        hasWebsite: false,
        notes: '',
        industry: 'Plumber',
        city: 'Bentonville, AR',
        demoId: 'demo-biz-blue',
        opportunityScore: 54
      }
    ]
  }
];

// Fill with generated default demo sites
seedHistory[0].businesses.forEach(b => {
  if (!b.hasWebsite) {
    b.demoSite = createDefaultDemoSite(b);
  }
});

class DBEngine {
  private data: Schema;

  constructor() {
    this.data = {
      history: seedHistory,
      subscription: {
        planId: 'pro',
        searchesPerformed: 4,
        demosGenerated: 11
      },
      byok: {
        provider: 'gemini',
        apiKey: '',
        baseUrl: '',
        modelName: 'gemini-3.5-flash',
        temperature: 0.7
      }
    };
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed.history && parsed.subscription) {
          this.data = parsed;
          if (!this.data.byok) {
            this.data.byok = {
              provider: 'gemini',
              apiKey: '',
              baseUrl: '',
              modelName: 'gemini-3.5-flash',
              temperature: 0.7
            };
          }
        }
      } else {
        this.save();
      }
    } catch (e) {
      console.error('Error loading DB, keeping defaults:', e);
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (e) {
      console.error('Error saving DB:', e);
    }
  }

  public getHistory(): SearchHistoryItem[] {
    return this.data.history;
  }

  public getSearch(id: string): SearchHistoryItem | undefined {
    return this.data.history.find(h => h.id === id);
  }

  public addSearch(item: SearchHistoryItem) {
    // Keep it unique by industry + city or timestamp
    const existingIndex = this.data.history.findIndex(
      h => h.industry.toLowerCase() === item.industry.toLowerCase() && h.city.toLowerCase() === item.city.toLowerCase()
    );
    if (existingIndex > -1) {
      this.data.history[existingIndex] = item;
    } else {
      this.data.history.unshift(item);
    }
    this.data.subscription.searchesPerformed += 1;
    this.save();
  }

  public deleteSearch(id: string) {
    this.data.history = this.data.history.filter(h => h.id !== id);
    this.save();
  }

  public getBusiness(id: string): Business | undefined {
    for (const h of this.data.history) {
      const b = h.businesses.find(biz => biz.id === id);
      if (b) return b;
    }
    return undefined;
  }

  public updateBusiness(id: string, updates: Partial<Business>) {
    let updated = false;
    for (const h of this.data.history) {
      const bIndex = h.businesses.findIndex(biz => biz.id === id);
      if (bIndex > -1) {
        h.businesses[bIndex] = { ...h.businesses[bIndex], ...updates };
        updated = true;
      }
    }
    if (updated) this.save();
  }

  public deleteBusiness(id: string) {
    for (const h of this.data.history) {
      const bIndex = h.businesses.findIndex(biz => biz.id === id);
      if (bIndex > -1) {
        h.businesses.splice(bIndex, 1);
        h.noWebsite = h.businesses.filter(b => !b.hasWebsite).length;
        h.totalFound = h.businesses.length;
        h.demoSitesCount = h.businesses.filter(b => !!b.demoId).length;
      }
    }
    this.save();
  }

  public getDemoSite(businessId: string): DemoSite | undefined {
    const biz = this.getBusiness(businessId);
    return biz?.demoSite;
  }

  public updateDemoSite(businessId: string, updates: Partial<DemoSite>) {
    const biz = this.getBusiness(businessId);
    if (biz && biz.demoSite) {
      biz.demoSite = { ...biz.demoSite, ...updates };
      this.updateBusiness(businessId, { demoSite: biz.demoSite });
      this.data.subscription.demosGenerated += 1;
      this.save();
    }
  }

  public getSubscription() {
    return this.data.subscription;
  }

  public updateSubscriptionPlan(planId: 'free' | 'pro' | 'agency') {
    this.data.subscription.planId = planId;
    this.save();
  }

  public getBYOKConfig(): BYOKConfig {
    if (!this.data.byok) {
      this.data.byok = {
        provider: 'gemini',
        apiKey: '',
        baseUrl: '',
        modelName: 'gemini-3.5-flash',
        temperature: 0.7
      };
    }
    return this.data.byok;
  }

  public updateBYOKConfig(config: BYOKConfig) {
    this.data.byok = config;
    this.save();
  }
}

export const db = new DBEngine();

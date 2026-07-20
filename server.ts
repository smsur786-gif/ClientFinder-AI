import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { db, createDefaultDemoSite } from './server/db.js';
import { Business, DemoSite, SearchHistoryItem, OutreachMessage } from './src/types.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// Unified Bring Your Own Key (BYOK) AI Generator supporting Gemini, OpenAI, Anthropic, and custom endpoints
async function generateTextAI(prompt: string, systemInstruction?: string, isJson?: boolean): Promise<string> {
  const byok = db.getBYOKConfig();
  const provider = byok.provider || 'gemini';
  const apiKey = byok.apiKey || '';
  const model = byok.modelName || '';
  const temp = byok.temperature !== undefined ? byok.temperature : 0.7;

  // 1. If provider is gemini (default)
  if (provider === 'gemini') {
    const actualKey = (apiKey.trim() && apiKey !== '••••••••') ? apiKey : process.env.GEMINI_API_KEY;
    if (!actualKey || actualKey === 'MY_GEMINI_API_KEY' || actualKey.trim() === '') {
      throw new Error('Gemini API key is missing. Please set it in Settings.');
    }
    const ai = new GoogleGenAI({ 
      apiKey: actualKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    const response = await ai.models.generateContent({
      model: model || 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: temp,
        responseMimeType: isJson ? 'application/json' : 'text/plain',
      },
    });
    return response.text || '';
  }

  // 2. If provider is openai
  if (provider === 'openai') {
    if (!apiKey || apiKey === '••••••••') {
      throw new Error('OpenAI API key is missing. Please configure it in System Settings.');
    }
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'gpt-4o-mini',
        messages: [
          ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
          { role: 'user', content: prompt }
        ],
        temperature: temp,
        response_format: isJson ? { type: 'json_object' } : undefined,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI API error: ${err}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  }

  // 3. If provider is anthropic
  if (provider === 'anthropic') {
    if (!apiKey || apiKey === '••••••••') {
      throw new Error('Anthropic API key is missing. Please configure it in System Settings.');
    }
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'claude-3-5-haiku-latest',
        max_tokens: 4000,
        system: systemInstruction || undefined,
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: temp,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Anthropic API error: ${err}`);
    }
    const data = await res.json();
    return data.content?.[0]?.text || '';
  }

  // 4. If provider is custom (OpenAI-compatible)
  if (provider === 'custom') {
    const baseUrl = byok.baseUrl || '';
    if (!baseUrl) {
      throw new Error('Custom provider Base URL is missing. Please configure it in System Settings.');
    }
    const cleanUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const finalUrl = `${cleanUrl}/chat/completions`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (apiKey && apiKey !== '••••••••') {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }
    const res = await fetch(finalUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: model || 'custom-model',
        messages: [
          ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
          { role: 'user', content: prompt }
        ],
        temperature: temp,
        response_format: isJson ? { type: 'json_object' } : undefined,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Custom API endpoint error: ${err}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  }

  throw new Error(`Unsupported AI provider: ${provider}`);
}

// Helper to calculate custom business opportunity scores
function calculateOpportunityScore(rating: number, reviewsCount: number, hasWebsite: boolean): number {
  if (hasWebsite) {
    // Already has a website, low urgency
    return Math.round(Math.max(10, 40 - (5 - rating) * 10));
  }
  
  // No website
  let base = 70;
  // High review counts make them a stronger candidate (more customers looking for them)
  if (reviewsCount > 100) base += 15;
  else if (reviewsCount > 50) base += 10;
  else if (reviewsCount > 10) base += 5;

  // Extremely high or low ratings slightly modify the urgency
  if (rating >= 4.5) base += 10; // "Excellent business missing out on web bookings!"
  else if (rating < 4.0) base += 2;  // "Needs a web presence to build reputation"
  
  return Math.min(99, base);
}

// ---------------------------------------------------------
// API ROUTES
// ---------------------------------------------------------

// GET active subscription / usage logs
app.get('/api/subscription', (req, res) => {
  const sub = db.getSubscription();
  res.json(sub);
});

// GET BYOK configuration
app.get('/api/settings/byok', (req, res) => {
  const config = db.getBYOKConfig();
  res.json({
    provider: config.provider || 'gemini',
    apiKey: config.apiKey ? '••••••••' : '',
    baseUrl: config.baseUrl || '',
    modelName: config.modelName || '',
    temperature: config.temperature !== undefined ? config.temperature : 0.7,
    mapsMode: config.mapsMode || 'simulated',
    mapsApiKey: config.mapsApiKey ? '••••••••' : ''
  });
});

// POST BYOK configuration
app.post('/api/settings/byok', (req, res) => {
  const { provider, apiKey, baseUrl, modelName, temperature, mapsMode, mapsApiKey } = req.body;
  const currentConfig = db.getBYOKConfig();
  
  let finalApiKey = apiKey;
  if (apiKey === '••••••••') {
    finalApiKey = currentConfig.apiKey;
  }

  let finalMapsApiKey = mapsApiKey;
  if (mapsApiKey === '••••••••') {
    finalMapsApiKey = currentConfig.mapsApiKey;
  }

  const newConfig = {
    provider: provider || 'gemini',
    apiKey: finalApiKey || '',
    baseUrl: baseUrl || '',
    modelName: modelName || '',
    temperature: temperature !== undefined ? Number(temperature) : 0.7,
    mapsMode: mapsMode || 'simulated',
    mapsApiKey: finalMapsApiKey || ''
  };

  db.updateBYOKConfig(newConfig);
  res.json({
    success: true,
    config: {
      provider: newConfig.provider,
      apiKey: newConfig.apiKey ? '••••••••' : '',
      baseUrl: newConfig.baseUrl,
      modelName: newConfig.modelName,
      temperature: newConfig.temperature,
      mapsMode: newConfig.mapsMode,
      mapsApiKey: newConfig.mapsApiKey ? '••••••••' : ''
    }
  });
});

// POST change plan
app.post('/api/subscription/change', (req, res) => {
  const { planId } = req.body;
  if (planId === 'free' || planId === 'pro' || planId === 'agency') {
    db.updateSubscriptionPlan(planId);
    return res.json({ success: true, subscription: db.getSubscription() });
  }
  res.status(400).json({ error: 'Invalid plan id' });
});

// GET searches history list
app.get('/api/history', (req, res) => {
  const history = db.getHistory();
  res.json(history);
});

// DELETE single search
app.post('/api/delete-search', (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'Search ID is required' });
  db.deleteSearch(id);
  res.json({ success: true, history: db.getHistory() });
});

// POST save notes on a business lead
app.post('/api/save-note', (req, res) => {
  const { businessId, notes } = req.body;
  if (!businessId) return res.status(400).json({ error: 'Business ID is required' });
  db.updateBusiness(businessId, { notes });
  res.json({ success: true, business: db.getBusiness(businessId) });
});

// POST delete business lead
app.post('/api/delete-business', (req, res) => {
  const { businessId } = req.body;
  if (!businessId) return res.status(400).json({ error: 'Business ID is required' });
  db.deleteBusiness(businessId);
  res.json({ success: true });
});

// POST Edit / Update Demo website configs
app.post('/api/generate-site', (req, res) => {
  const { businessId, heroTitle, heroSubtitle, description, brandColor, aboutText, services, theme } = req.body;
  if (!businessId) return res.status(400).json({ error: 'Business ID is required' });

  const currentDemo = db.getDemoSite(businessId);
  if (!currentDemo) {
    return res.status(404).json({ error: 'Demo site not found for this business' });
  }

  const updatedDemo: Partial<DemoSite> = {
    heroTitle: heroTitle || currentDemo.heroTitle,
    heroSubtitle: heroSubtitle || currentDemo.heroSubtitle,
    description: description || currentDemo.description,
    brandColor: brandColor || currentDemo.brandColor,
    aboutText: aboutText || currentDemo.aboutText,
    services: services || currentDemo.services,
    theme: theme || currentDemo.theme,
  };

  db.updateDemoSite(businessId, updatedDemo);
  res.json({ success: true, demoSite: db.getDemoSite(businessId) });
});

// POST SEARCH: Core Search pipeline
app.post('/api/search', async (req, res) => {
  const { industry, city } = req.body;
  if (!industry || !city) {
    return res.status(400).json({ error: 'Industry and City are required' });
  }

  const formattedCity = city.trim();
  const formattedIndustry = industry.trim();

  // Instant pre-seeded data shortcut to match the Plumber in Bentonville, AR screenshot exactly
  if (
    formattedIndustry.toLowerCase() === 'plumber' &&
    (formattedCity.toLowerCase() === 'bentonville' || formattedCity.toLowerCase() === 'bentonville, ar')
  ) {
    // Fetch the preseeded item
    const preseeded = db.getSearch('search-bentonville-plumber');
    if (preseeded) {
      return res.json(preseeded);
    }
  }

  // Check if search history already contains this city + industry
  const existing = db.getHistory().find(
    h => h.industry.toLowerCase() === formattedIndustry.toLowerCase() && h.city.toLowerCase() === formattedCity.toLowerCase()
  );
  if (existing) {
    return res.json(existing);
  }

  // If search is not pre-seeded, execute AI dynamic search generation
  const searchId = `search-${Date.now()}`;
  let generatedBusinesses: Business[] = [];

  try {
    const prompt = `Generate a realistic list of 6 local businesses for the industry "${formattedIndustry}" in the city "${formattedCity}". 
    Make sure 4 of these businesses DO NOT have a website (hasWebsite: false, website: null) and 2 of them DO have websites. 
    For each website-less business, generate customized professional demo website copywriting elements.
    Return your response ONLY as a JSON object matching this exact TypeScript interface:
    {
      "businesses": Array<{
        "name": string;
        "phone": string;
        "email": string;
        "address": string;
        "rating": number; // Float between 3.8 and 4.9
        "reviewsCount": number; // Integer between 10 and 220
        "website": string | null;
        "hasWebsite": boolean;
        "demoSite": {
          "heroTitle": string; // compelling header
          "heroSubtitle": string; // persuasive value proposition
          "description": string; // short summary
          "brandColor": string; // vibrant hex color e.g. #3B82F6
          "aboutText": string; // friendly personal bio of business/owner
          "services": string[]; // list of 5 key services
          "faqs": Array<{ question: string, answer: string }>; // 3 custom FAQs
        }
      }>
    }`;

    const responseText = await generateTextAI(prompt, undefined, true);
    const parsedData = JSON.parse(responseText.trim());

      if (parsedData && Array.isArray(parsedData.businesses)) {
        generatedBusinesses = parsedData.businesses.map((biz: any, idx: number) => {
          const bizId = `biz-${searchId}-${idx}`;
          const isNoWebsite = !biz.hasWebsite;
          const rating = Number(biz.rating) || 4.2;
          const reviewsCount = Number(biz.reviewsCount) || 25;
          const opportunityScore = calculateOpportunityScore(rating, reviewsCount, !isNoWebsite);

          const businessItem: Business = {
            id: bizId,
            name: biz.name || `${formattedIndustry} Services`,
            phone: biz.phone || '(555) 019-2834',
            email: biz.email || `contact@${(biz.name || 'local').toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
            address: biz.address || `${100 + idx} Main St, ${formattedCity}`,
            rating,
            reviewsCount,
            mapsUrl: `https://maps.google.com/?q=${encodeURIComponent((biz.name || '') + ' ' + formattedCity)}`,
            website: biz.website || null,
            category: formattedIndustry,
            hasWebsite: !isNoWebsite,
            notes: '',
            industry: formattedIndustry,
            city: formattedCity,
            demoId: isNoWebsite ? `demo-${bizId}` : '',
            opportunityScore,
          };

          if (isNoWebsite) {
            businessItem.demoSite = {
              id: `demo-${bizId}`,
              businessId: bizId,
              heroTitle: biz.demoSite?.heroTitle || `Premium ${businessItem.name} Services`,
              heroSubtitle: biz.demoSite?.heroSubtitle || `Top-rated ${formattedIndustry} in ${formattedCity}. Professional quality guarantee, fast callouts, and clean expert craftsmanship.`,
              description: biz.demoSite?.description || `Our team brings years of reliable industry expertise directly to your doorstep. We operate with elite craftsmanship to fulfill all your needs.`,
              brandColor: biz.demoSite?.brandColor || '#3B82F6',
              theme: 'modern',
              aboutText: biz.demoSite?.aboutText || `Serving our local community with absolute integrity. We treat your property as our own and commit to long-term reliability.`,
              services: Array.isArray(biz.demoSite?.services) ? biz.demoSite.services : [`General ${formattedIndustry} Maintenance`],
              faqs: Array.isArray(biz.demoSite?.faqs) ? biz.demoSite.faqs : [
                { question: 'What are your operating hours?', answer: 'We are open 24/7 for emergency dispatch and standard booking hours.' }
              ],
              contactEmail: businessItem.email,
              contactPhone: businessItem.phone,
              contactAddress: businessItem.address,
              published: true,
            };
          }
          return businessItem;
        });
      }
    } catch (err) {
      console.error('AI search generation failed, falling back to procedural:', err);
    }

  // Fallback to high-quality procedural generation if AI fails or apiKey is absent
  if (generatedBusinesses.length === 0) {
    const defaultCompanyNames = [
      'Pro Services', 'Elite Quality Care', 'Star Experts', 'Direct Solutions', 
      'Prime Masters', 'Precision Works', 'Reliable Team', 'Affordable Local Care'
    ];
    
    // Generate 6 procedural business leads
    for (let i = 0; i < 6; i++) {
      const bizId = `biz-${searchId}-${i}`;
      const isNoWebsite = i < 4; // 4 without, 2 with website
      const rating = Number((4.0 + Math.random() * 0.9).toFixed(1));
      const reviewsCount = Math.floor(10 + Math.random() * 190);
      const name = `${formattedCity.split(',')[0]} ${defaultCompanyNames[i % defaultCompanyNames.length]} (${formattedIndustry})`;
      const opportunityScore = calculateOpportunityScore(rating, reviewsCount, !isNoWebsite);
      
      const proceduralBiz: Business = {
        id: bizId,
        name,
        phone: `(${300 + i * 45}) 555-01${10 + i}`,
        email: `contact@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        address: `${204 + i * 115} Grand Avenue, ${formattedCity}`,
        rating,
        reviewsCount,
        mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(name + ' ' + formattedCity)}`,
        website: isNoWebsite ? null : `https://${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        category: formattedIndustry,
        hasWebsite: !isNoWebsite,
        notes: '',
        industry: formattedIndustry,
        city: formattedCity,
        demoId: isNoWebsite ? `demo-${bizId}` : '',
        opportunityScore,
      };

      if (isNoWebsite) {
        proceduralBiz.demoSite = createDefaultDemoSite(proceduralBiz);
      }
      generatedBusinesses.push(proceduralBiz);
    }
  }

  const noWebsiteCount = generatedBusinesses.filter(b => !b.hasWebsite).length;
  const newSearchItem: SearchHistoryItem = {
    id: searchId,
    timestamp: new Date().toISOString(),
    industry: formattedIndustry,
    city: formattedCity,
    totalFound: generatedBusinesses.length,
    noWebsite: noWebsiteCount,
    demoSitesCount: noWebsiteCount,
    businesses: generatedBusinesses,
  };

  db.addSearch(newSearchItem);
  res.json(newSearchItem);
});

// POST OUTREACH: Generate personalized copies via Gemini or procedural engine
app.post('/api/generate-outreach', async (req, res) => {
  const { businessId, type, customPrompt } = req.body;
  if (!businessId || !type) {
    return res.status(400).json({ error: 'Business ID and Outreach Type are required' });
  }

  const business = db.getBusiness(businessId);
  if (!business) {
    return res.status(404).json({ error: 'Business prospect not found' });
  }

  const demoSite = business.demoSite;
  const demoUrlStr = `https://demo.myapp.com/${business.id}`;
  const promptTypeNames: Record<string, string> = {
    email: 'Cold Outreach Email',
    sms: 'Conversational SMS Text',
    linkedin: 'LinkedIn Direct Message',
    instagram: 'Instagram DM pitch',
    phone_script: 'Cold Phone Calling script',
    follow_up: 'Polite Follow-up email',
  };

  const outreachTypeLabel = promptTypeNames[type] || 'Outreach Pitch';

  try {
    const systemInstruction = `You are an elite, highly persuasive sales copywriter specializing in local agency marketing.
    Your goal is to write a highly professional, highly specific, and non-spammy sales copy tailored to local small businesses.
    Be friendly, consultative, and authentic. Highlighting that they have a fantastic reputation on Google maps (Google rating of ${business.rating} with ${business.reviewsCount} organic reviews) but are currently missing out on massive local traffic because they DO NOT have an online website. 
    Mention that we have pre-built a fully responsive, customized visual prototype specifically for them at: ${demoUrlStr}, and offer a brief, free 10-minute consultation.`;

    const prompt = customPrompt || `Generate a highly personalized ${outreachTypeLabel} copy for "${business.name}" operating in "${business.city}". Use a professional and friendly tone. Refer specifically to their services: ${demoSite?.services?.slice(0, 3).join(', ') || business.category}.`;

    const copyText = await generateTextAI(prompt, systemInstruction, false);
    return res.json({
      success: true,
      type,
      content: copyText.trim(),
      isAiGenerated: true
    });
  } catch (err) {
    console.error('AI Outreach generation failed, falling back to procedural copy:', err);
  }

  // Procedural Fallback outreach text
  let fallbackContent = '';
  const serviceHighlights = demoSite?.services?.slice(0, 2).join(' & ') || business.category;

  if (type === 'email') {
    fallbackContent = `Subject: Website prototype ready for ${business.name} 🚀

Hi Team,

I noticed that ${business.name} has an impressive ${business.rating} star rating on Google Maps with ${business.reviewsCount} customer reviews! You guys are clearly doing amazing work in the ${business.city} area.

However, I couldn't find an official website listed for your business. In today's digital market, over 70% of local customers look up a company online before calling. Without a website, you might be letting qualified leads slip to your competitors.

To help you out, our team built a custom, fully functional website prototype for ${business.name} which highlights your core services (like ${serviceHighlights}):
👉 View Demo Website: ${demoUrlStr}

We can customize this landing page with your own photos, logos, and custom request forms.

Are you open to a quick, 5-minute phone call next Tuesday at 10 AM to discuss how we can launch this and get you more direct bookings?

Best regards,
SaaS Outreach Specialist
AI Client Finder Team`;
  } else if (type === 'sms') {
    fallbackContent = `Hi ${business.name} team! I love your ${business.rating}★ Google rating. Noticed you guys don't have a website listed, so I custom-built a beautiful mobile-ready website demo for you to see: ${demoUrlStr} - would you be open to a quick chat to take ownership of it? Thanks!`;
  } else if (type === 'linkedin') {
    fallbackContent = `Hello Team, I came across ${business.name} while searching for premier ${business.category} services in ${business.city}. Your 5-star Google reputation is outstanding! 

I built a completely free, custom mobile-friendly website demo showcasing your services at ${demoUrlStr}. No strings attached - I'd love to hear your thoughts or help you launch it. Let me know if you are interested!`;
  } else if (type === 'phone_script') {
    fallbackContent = `[Cold Call Script for ${business.name}]

Introduction (First 15 seconds):
"Hi! My name is [Name] and I am calling because I noticed you guys have an incredible ${business.rating}★ rating on Google maps with ${business.reviewsCount} reviews! Is this the owner or manager?"

The Hook (Why they should listen):
"Great! I specialize in helping local companies in ${business.city} convert their Google searches into actual booked jobs. I noticed you guys don't have an active website, which means you are missing out on customers who prefer booking online. 
Because your reviews are so stellar, I went ahead and actually custom-built a website prototype specifically for ${business.name}!"

The Pitch & CTA:
"It is 100% complete and ready. I can text or email you the link right now. It is at: ${demoUrlStr}
Do you have 2 minutes to check it out on your phone right now, or should I send a follow-up email?"`;
  } else {
    fallbackContent = `Hi ${business.name} Team,

Just following up on the custom website prototype I built for you:
👉 Check it here: ${demoUrlStr}

Would love to schedule a quick 5-minute call to help you launch this to start driving more local customers to your phone line!

Best,
AI Client Finder Team`;
  }

  res.json({
    success: true,
    type,
    content: fallbackContent,
    isAiGenerated: false
  });
});

// ---------------------------------------------------------
// DEV / PRODUCTION SERVER INITIALIZATION
// ---------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Client Finder Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

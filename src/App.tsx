import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { SearchHistoryItem, Business, DemoSite } from './types';
import Sidebar from './components/Sidebar';
import SearchDashboard from './components/SearchDashboard';
import SearchHistory from './components/SearchHistory';
import BillingSettings from './components/BillingSettings';
import BusinessDetailDrawer from './components/BusinessDetailDrawer';
import { 
  Globe, Shield, Sparkles, Building, ChevronRight, CheckCircle2,
  AlertTriangle, Settings, User, Eye, Copy, Check, RefreshCw
} from 'lucide-react';

export default function App() {
  // Navigation
  const [currentView, setCurrentView] = useState<'search' | 'history' | 'demos' | 'billing' | 'settings'>('search');

  // BYOK Settings States
  const [byokProvider, setByokProvider] = useState<'gemini' | 'openai' | 'anthropic' | 'custom'>('gemini');
  const [byokApiKey, setByokApiKey] = useState('');
  const [byokBaseUrl, setByokBaseUrl] = useState('');
  const [byokModelName, setByokModelName] = useState('gemini-3.5-flash');
  const [byokTemperature, setByokTemperature] = useState(0.7);
  const [mapsMode, setMapsMode] = useState<'simulated' | 'live'>('simulated');
  const [mapsApiKey, setMapsApiKey] = useState('');
  const [isSavingByok, setIsSavingByok] = useState(false);
  const [byokSaveSuccess, setByokSaveSuccess] = useState(false);

  // Backend Sync State
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [subscription, setSubscription] = useState({
    planId: 'pro' as 'free' | 'pro' | 'agency',
    searchesPerformed: 4,
    demosGenerated: 11
  });

  // Selected lead states
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  // Initial load
  useEffect(() => {
    fetchHistory();
    fetchSubscription();
    fetchByokConfig();
  }, []);

  const fetchByokConfig = async () => {
    try {
      const res = await fetch('/api/settings/byok');
      const data = await res.json();
      if (data) {
        setByokProvider(data.provider || 'gemini');
        setByokApiKey(data.apiKey || '');
        setByokBaseUrl(data.baseUrl || '');
        setByokModelName(data.modelName || 'gemini-3.5-flash');
        setByokTemperature(data.temperature !== undefined ? data.temperature : 0.7);
        setMapsMode(data.mapsMode || 'simulated');
        setMapsApiKey(data.mapsApiKey || '');
      }
    } catch (e) {
      console.error('Error fetching BYOK config:', e);
    }
  };

  const handleSaveByok = async () => {
    setIsSavingByok(true);
    setByokSaveSuccess(false);
    try {
      const res = await fetch('/api/settings/byok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: byokProvider,
          apiKey: byokApiKey,
          baseUrl: byokBaseUrl,
          modelName: byokModelName,
          temperature: byokTemperature,
          mapsMode,
          mapsApiKey
        })
      });
      const data = await res.json();
      if (data.success) {
        setByokSaveSuccess(true);
        if (data.config) {
          setByokApiKey(data.config.apiKey || '');
          setMapsApiKey(data.config.mapsApiKey || '');
        }
        setTimeout(() => setByokSaveSuccess(false), 2500);
      }
    } catch (e) {
      console.error('Error saving BYOK config:', e);
    } finally {
      setIsSavingByok(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      setHistory(data);
    } catch (e) {
      console.error('Error fetching history:', e);
    }
  };

  const fetchSubscription = async () => {
    try {
      const res = await fetch('/api/subscription');
      const data = await res.json();
      setSubscription(data);
    } catch (e) {
      console.error('Error fetching subscription:', e);
    }
  };

  const handlePlanChange = async (planId: 'free' | 'pro' | 'agency') => {
    try {
      const res = await fetch('/api/subscription/change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      });
      const data = await res.json();
      if (data.success) {
        setSubscription(data.subscription);
      }
    } catch (e) {
      console.error('Error changing plan:', e);
    }
  };

  const handleSearchComplete = (newItem: SearchHistoryItem) => {
    // Refresh history
    fetchHistory();
    fetchSubscription();
  };

  const handleDeleteSearch = async (id: string) => {
    try {
      const res = await fetch('/api/delete-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        setHistory(data.history);
      }
    } catch (e) {
      console.error('Error deleting search:', e);
    }
  };

  const handleSaveNotes = async (businessId: string, notes: string) => {
    try {
      const res = await fetch('/api/save-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId, notes })
      });
      const data = await res.json();
      if (data.success) {
        // Refresh local history lists
        fetchHistory();
        if (selectedBusiness && selectedBusiness.id === businessId) {
          setSelectedBusiness(data.business);
        }
      }
    } catch (e) {
      console.error('Error saving notes:', e);
    }
  };

  const handleUpdateDemo = async (updatedDemo: DemoSite) => {
    try {
      const res = await fetch('/api/generate-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDemo)
      });
      const data = await res.json();
      if (data.success) {
        fetchHistory();
        fetchSubscription();
        if (selectedBusiness && selectedBusiness.id === updatedDemo.businessId) {
          setSelectedBusiness({
            ...selectedBusiness,
            demoSite: data.demoSite
          });
        }
      }
    } catch (e) {
      console.error('Error updating demo site:', e);
    }
  };

  const handleDeleteBusiness = async (businessId: string) => {
    try {
      const res = await fetch('/api/delete-business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId })
      });
      const data = await res.json();
      if (data.success) {
        fetchHistory();
        if (selectedBusiness && selectedBusiness.id === businessId) {
          setSelectedBusiness(null);
        }
      }
    } catch (e) {
      console.error('Error deleting business:', e);
    }
  };

  // Compile flat list of generated demo websites for the "Demo Websites" View
  const allDemoWebsites = history.flatMap(h => 
    h.businesses
      .filter(b => !b.hasWebsite && b.demoSite)
      .map(b => ({
        business: b,
        demoSite: b.demoSite!,
        city: h.city,
        industry: h.industry
      }))
  );

  return (
    <div className="flex bg-[#0B0B0F] min-h-screen text-gray-100 font-sans antialiased overflow-x-hidden selection:bg-blue-600/35 selection:text-white">
      
      {/* Dynamic Left Sidebar Navigation */}
      <Sidebar 
        currentView={currentView} 
        onViewChange={(view) => {
          setCurrentView(view);
          setSelectedBusiness(null);
        }}
        planId={subscription.planId}
        searchesPerformed={subscription.searchesPerformed}
        demosGenerated={subscription.demosGenerated}
      />

      {/* Main Body Viewport Panel */}
      <main className="flex-1 min-w-0 p-6 md:p-10 relative">
        
        {/* VIEW 1: SEARCH & PIPELINE DASHBOARD */}
        {currentView === 'search' && (
          <SearchDashboard 
            planId={subscription.planId}
            onSearchComplete={handleSearchComplete}
            history={history}
            onSelectBusiness={setSelectedBusiness}
            onDeleteBusiness={handleDeleteBusiness}
          />
        )}

        {/* VIEW 2: SEARCH HISTORY LIST */}
        {currentView === 'history' && (
          <SearchHistory 
            history={history}
            onLoadSearch={(item) => {
              setCurrentView('search');
              // Let search component render and set selected item
              setTimeout(() => {
                const searchBtn = document.querySelector(`button[title="Scout Leads"]`);
                if (searchBtn) (searchBtn as HTMLButtonElement).click();
              }, 100);
            }}
            onDeleteSearch={handleDeleteSearch}
          />
        )}

        {/* VIEW 3: DEMO SITES MASTER LIST */}
        {currentView === 'demos' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl font-display font-bold text-white tracking-tight">Active Demo Websites</h2>
              <p className="text-gray-400 mt-1 text-sm font-sans">
                Review all automatically designed bespoke landing pages in one place. Preview responsiveness and edit text instantly.
              </p>
            </div>

            {allDemoWebsites.length === 0 ? (
              <div className="bg-[#16181D]/80 border border-gray-800 p-12 rounded-3xl text-center max-w-2xl mx-auto space-y-4">
                <Globe className="w-12 h-12 text-gray-500 mx-auto" />
                <h3 className="font-display font-bold text-white text-base">No AI portfolios built yet</h3>
                <p className="text-gray-400 text-xs">
                  Run a search for plumbers, salons, or lawyers to automatically compile target leads and generate website demos.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allDemoWebsites.map(({ business, demoSite, city, industry }) => (
                  <div 
                    key={business.id}
                    className="bg-[#16181D]/80 border border-gray-800 p-5 rounded-2xl flex flex-col justify-between hover:border-gray-700 transition-all group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] bg-green-500/10 text-green-400 font-mono font-bold px-2 py-0.5 rounded border border-green-500/20 uppercase">
                          AI Live
                        </span>
                        <span className="text-[9px] text-gray-500 font-mono">• {industry} in {city.split(',')[0]}</span>
                      </div>

                      <div>
                        <h4 className="font-display font-bold text-white text-base truncate group-hover:text-blue-400 transition-all">{business.name}</h4>
                        <p className="text-gray-400 text-xs mt-1.5 line-clamp-2 h-8 font-sans leading-relaxed">{demoSite.heroSubtitle}</p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-gray-400">Color Palette:</span>
                        <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: demoSite.brandColor }} />
                        <span className="text-[10px] font-mono text-gray-500">{demoSite.brandColor}</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-800/60 pt-3.5 mt-5 flex justify-between items-center">
                      <span className="text-[10px] font-mono text-gray-500">demo.myapp.com/{business.id}</span>
                      <button
                        onClick={() => setSelectedBusiness(business)}
                        className="text-xs font-semibold text-blue-400 flex items-center gap-1 hover:text-blue-300 transition-colors"
                      >
                        <span>Open Editor</span>
                        <ChevronRight className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: BILLING & PLANS */}
        {currentView === 'billing' && (
          <BillingSettings 
            planId={subscription.planId}
            onPlanChange={handlePlanChange}
            searchesPerformed={subscription.searchesPerformed}
            demosGenerated={subscription.demosGenerated}
          />
        )}

        {/* VIEW 5: USER APPLET SETTINGS */}
        {currentView === 'settings' && (
          <div className="space-y-6 max-w-4xl mx-auto text-left font-sans">
            <div>
              <h2 className="text-3xl font-display font-bold text-white tracking-tight">System Settings</h2>
              <p className="text-gray-400 mt-1 text-sm font-sans">Configure outreach channels, CRM variables, and API connection triggers.</p>
            </div>

            <div className="bg-[#16181D]/80 border border-gray-800 rounded-3xl p-6 space-y-6">
              
              {/* Profile card */}
              <div className="flex items-center gap-4 pb-6 border-b border-gray-800/60">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-mono font-bold text-white text-sm">
                  SU
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-base">smsur786@gmail.com</h3>
                  <p className="text-xs text-gray-500">AI Client Finder Administrator Account</p>
                </div>
              </div>

              {/* Outreach templates settings */}
              <div className="space-y-4 pb-6 border-b border-gray-800/60">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-display">Client Outreach Variables</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-gray-500 font-mono font-bold uppercase">Sender Profile Name</span>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      className="w-full bg-gray-900 border border-gray-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-gray-500 font-mono font-bold uppercase">Sender Agency Title</span>
                    <input
                      type="text"
                      placeholder="e.g. Acme Web Design Agency"
                      className="w-full bg-gray-900 border border-gray-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* BYOK SYSTEM SETTINGS */}
              <div className="space-y-5 pb-6 border-b border-gray-800/60">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-display flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      <span>Bring Your Own Key (BYOK) system</span>
                    </h4>
                    <p className="text-[11px] text-gray-500 leading-tight">Configure external AI providers to power scouting and outreach generation.</p>
                  </div>
                  {byokSaveSuccess && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                      Settings Saved!
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-gray-500 font-mono font-bold uppercase">AI Service Provider</span>
                    <select
                      value={byokProvider}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setByokProvider(val);
                        if (val === 'gemini') {
                          setByokModelName('gemini-2.5-flash');
                          setByokBaseUrl('');
                        } else if (val === 'openai') {
                          setByokModelName('gpt-4o-mini');
                          setByokBaseUrl('');
                        } else if (val === 'anthropic') {
                          setByokModelName('claude-3-5-sonnet-latest');
                          setByokBaseUrl('');
                        } else {
                          setByokModelName('custom-model-v1');
                          setByokBaseUrl('https://api.together.xyz/v1');
                        }
                      }}
                      className="w-full bg-gray-900 border border-gray-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                    >
                      <option value="gemini">Default Gemini (AI Studio)</option>
                      <option value="openai">OpenAI (Direct API)</option>
                      <option value="anthropic">Anthropic (Claude)</option>
                      <option value="custom">Custom (OpenAI-Compatible Endpoint)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-gray-500 font-mono font-bold uppercase">Model Identifier Name</span>
                    <input
                      type="text"
                      placeholder="e.g. gpt-4o"
                      value={byokModelName}
                      onChange={(e) => setByokModelName(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <span className="text-[10px] text-gray-500 font-mono font-bold uppercase">Secret API Key</span>
                    <input
                      type="password"
                      placeholder={byokApiKey ? "••••••••••••••••••••" : "Paste your secret key here"}
                      value={byokApiKey}
                      onChange={(e) => setByokApiKey(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none font-mono"
                    />
                    <p className="text-[10px] text-gray-500">
                      Keys are safely vaulted on our back-end container. Leaving this empty uses system credentials when default Gemini is chosen.
                    </p>
                  </div>

                  {byokProvider === 'custom' && (
                    <div className="space-y-1.5 md:col-span-2">
                      <span className="text-[10px] text-gray-500 font-mono font-bold uppercase">Custom Provider Base URL</span>
                      <input
                        type="url"
                        placeholder="e.g. https://api.together.xyz/v1"
                        value={byokBaseUrl}
                        onChange={(e) => setByokBaseUrl(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none font-mono"
                      />
                    </div>
                  )}

                  <div className="space-y-2 md:col-span-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gray-500 font-mono font-bold uppercase">Generation Temperature</span>
                      <span className="text-xs font-mono text-blue-400 font-bold">{byokTemperature}</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.1"
                      value={byokTemperature}
                      onChange={(e) => setByokTemperature(parseFloat(e.target.value))}
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                  </div>

                  {/* MAPS FLEXIBILITY CONFIG */}
                  <div className="space-y-4 md:col-span-2 pt-4 border-t border-gray-800/60">
                    <span className="text-[10px] text-gray-500 font-mono font-bold uppercase tracking-wider block">Google Maps &amp; Places Flexibility Settings</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-slate-400 font-mono">Scouting Search Mode</span>
                        <select
                          value={mapsMode}
                          onChange={(e) => setMapsMode(e.target.value as any)}
                          className="w-full bg-gray-900 border border-gray-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                        >
                          <option value="simulated">Simulated Web Scouting (Instant &amp; Free)</option>
                          <option value="live">Live Google Places API (Requires GCP Token)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] text-slate-400 font-mono">Google Places API Key</span>
                        <input
                          type="password"
                          placeholder={mapsApiKey ? "••••••••••••••••••••" : "Optional Places key"}
                          value={mapsApiKey}
                          onChange={(e) => setMapsApiKey(e.target.value)}
                          disabled={mapsMode === 'simulated'}
                          className="w-full bg-gray-900 border border-gray-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none disabled:opacity-40 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleSaveByok}
                    disabled={isSavingByok}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-blue-600/20 cursor-pointer disabled:opacity-50"
                  >
                    {isSavingByok ? (
                      <>
                        <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span>Saving Config...</span>
                      </>
                    ) : (
                      <>
                        <Settings className="w-3.5 h-3.5" />
                        <span>Save AI Provider Settings</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* API and Integration keys info card */}
              <div className="bg-gray-900/40 border border-gray-800 p-4.5 rounded-2xl flex items-start gap-3">
                <User className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <h5 className="font-bold text-white text-xs">Secret API Keys Configuration</h5>
                  <p className="text-gray-400 text-xs leading-normal">
                    This full-stack application safely leverages process credentials for real-time web scouting. You can update or review your active Google maps and Gemini keys anytime inside the <strong className="text-blue-400">Settings &gt; Secrets</strong> panel of the AI Studio workspace.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Slide-out Physical Drawer Panel */}
      <AnimatePresence>
        {selectedBusiness && (
          <BusinessDetailDrawer
            business={selectedBusiness}
            onClose={() => setSelectedBusiness(null)}
            onUpdateDemo={handleUpdateDemo}
            onSaveNotes={handleSaveNotes}
            planId={subscription.planId}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

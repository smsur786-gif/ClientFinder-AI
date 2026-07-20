import React, { useState } from 'react';
import { Business, SearchHistoryItem } from '../types';
import { 
  Search, MapPin, Globe, CreditCard, SlidersHorizontal, ArrowRight, Star, 
  Map, Phone, Copy, Check, ExternalLink, RefreshCw, Trash2, Download,
  CheckCircle2, X, Sparkles, User, Shield, HelpCircle, AlertCircle
} from 'lucide-react';

interface SearchDashboardProps {
  planId: 'free' | 'pro' | 'agency';
  onSearchComplete: (newItem: SearchHistoryItem) => void;
  history: SearchHistoryItem[];
  onSelectBusiness: (business: Business) => void;
  onDeleteBusiness: (id: string) => void;
}

export default function SearchDashboard({ planId, onSearchComplete, history, onSelectBusiness, onDeleteBusiness }: SearchDashboardProps) {
  // Form input states
  const [industry, setIndustry] = useState('Plumber');
  const [city, setCity] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter states
  const [minRating, setMinRating] = useState<number>(0);
  const [minReviews, setMinReviews] = useState<number>(0);
  const [hideWithWebsites, setHideWithWebsites] = useState(true);

  // Search execution states
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [currentSearchItem, setCurrentSearchItem] = useState<SearchHistoryItem | null>(null);

  // Clipboard copies
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const industries = [
    'Plumber', 'Dentist', 'Electrician', 'Roofer', 'Restaurant', 
    'HVAC', 'Salon', 'Lawyer', 'Accountant', 'Realtor'
  ];

  const citySuggestions = [
    'Bentonville, AR', 'Austin, TX', 'Miami, FL', 
    'Seattle, WA', 'Chicago, IL', 'Denver, CO'
  ];

  // Animated checklist steps
  const steps = [
    'Scanning Google Maps listings...',
    'Identifying businesses without websites...',
    'Pulling contact information...',
    'Building demo websites...',
    'Generating report...'
  ];

  const handleRunSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setIsProcessing(true);
    setProgressPercent(0);
    setActiveStep(0);

    // Simulate animated loading steps matching the screenshots exactly
    const stepDuration = 900;
    
    // Simulate progress bar running
    for (let s = 0; s < steps.length; s++) {
      setActiveStep(s);
      let stepPercentStart = s * 20;
      for (let p = 1; p <= 10; p++) {
        setProgressPercent(stepPercentStart + p * 2);
        await new Promise((resolve) => setTimeout(resolve, stepDuration / 10));
      }
    }

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry, city })
      });
      const data: SearchHistoryItem = await response.json();
      onSearchComplete(data);
      setCurrentSearchItem(data);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const loadPastSearch = (item: SearchHistoryItem) => {
    setCurrentSearchItem(item);
    setIndustry(item.industry);
    setCity(item.city);
  };

  // CSV Exporter client-side helper
  const handleExportCSV = () => {
    if (!currentSearchItem) return;
    const itemsToExport = currentSearchItem.businesses.filter(
      b => !hideWithWebsites || !b.hasWebsite
    );

    if (planId === 'free') {
      alert('CSV Exporting is disabled on the Free tier. Upgrade to Pro/Agency to download qualified leads.');
      return;
    }

    if (itemsToExport.length === 0) {
      alert('No leads match your current filters to export.');
      return;
    }

    // Build raw CSV string
    const headers = ['Business Name', 'Phone', 'Email', 'Address', 'Rating', 'Review Count', 'Opportunity Score', 'Maps URL', 'Existing Website', 'AI Demo Website URL'];
    const rows = itemsToExport.map(b => [
      `"${b.name}"`,
      `"${b.phone}"`,
      `"${b.email}"`,
      `"${b.address}"`,
      b.rating,
      b.reviewsCount,
      `${b.opportunityScore}%`,
      `"${b.mapsUrl}"`,
      b.website ? `"${b.website}"` : 'None',
      b.demoId ? `"https://demo.myapp.com/${b.id}"` : 'None'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AI_Client_Finder_Leads_${currentSearchItem.industry}_${currentSearchItem.city.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Filter business list
  const filteredBusinesses = currentSearchItem
    ? currentSearchItem.businesses.filter(b => {
        if (hideWithWebsites && b.hasWebsite) return false;
        if (b.rating < minRating) return false;
        if (b.reviewsCount < minReviews) return false;
        return true;
      })
    : [];

  return (
    <div className="space-y-10 max-w-6xl mx-auto py-4">
      
      {/* 1. ANIMATED PROGRESS LOADING SCREEN (Matching Screenshot 2) */}
      {isProcessing && (
        <div className="bg-[#0D0D12] border border-slate-800/50 p-8 rounded-3xl max-w-2xl mx-auto text-left backdrop-blur-md shadow-2xl relative overflow-hidden space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">Deep Scan Engine Active</span>
            <span className="ml-auto text-xs font-mono text-slate-500">{progressPercent}%</span>
          </div>

          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-white">Scouting GMB directory metadata...</h3>
            
            {/* Steps checklists */}
            <div className="space-y-3">
              {steps.map((step, idx) => {
                const isDone = idx < activeStep;
                const isCurrent = idx === activeStep;
                return (
                  <div key={idx} className="flex items-center gap-3 font-sans transition-all duration-300">
                    <div className="shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400 fill-green-500/10" />
                      ) : isCurrent ? (
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-800 bg-[#030307]" />
                      )}
                    </div>
                    <span className={`text-sm ${isDone ? 'text-slate-400' : isCurrent ? 'text-blue-400 font-semibold' : 'text-slate-600'}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Simulated progress slider bar */}
            <div className="space-y-2 pt-2">
              <div className="w-full bg-[#030307] h-2 rounded-full overflow-hidden border border-slate-800/50">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-200 shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Estimated remaining: ~{Math.max(1, Math.round((100 - progressPercent) / 15))}s</span>
                <span>Cancelling disabled</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MAIN HERO SEARCH INPUTS SCREEN */}
      {!isProcessing && !currentSearchItem && (
        <div className="space-y-12 text-center py-8">
          <div className="space-y-4 max-w-3xl mx-auto">
            {/* pill badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/20 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[10px] text-blue-400 font-mono tracking-wider font-bold uppercase">Find businesses that need your help</span>
            </div>

            <h1 className="font-display font-extrabold text-4xl md:text-6xl text-white tracking-tight leading-[1.1]">
              Find Local Businesses <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">Without a Website</span>
            </h1>
            
            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto font-sans font-medium">
              Enter an industry and city. Our AI scans Google Maps, identifies businesses with no web presence, and builds each one a personalized demo website — in seconds.
            </p>
          </div>

          {/* Core Input controls widget */}
          <div className="bg-[#0D0D12] border border-slate-800/50 p-6 rounded-3xl max-w-3xl mx-auto backdrop-blur-md shadow-2xl relative">
            <form onSubmit={handleRunSearch} className="flex flex-col sm:flex-row gap-4">
              
              {/* Industry Dropdown */}
              <div className="flex-1 min-w-[200px] relative text-left">
                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block mb-1 px-1">Selected Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-[#030307] border border-slate-800/50 focus:border-blue-500/50 rounded-xl px-4 py-3.5 text-sm text-white font-medium outline-none transition-colors cursor-pointer appearance-none"
                >
                  {industries.map((ind) => (
                    <option key={ind} value={ind} className="bg-[#0D0D12]">{ind}</option>
                  ))}
                </select>
                <div className="absolute right-4 bottom-4.5 pointer-events-none w-2 h-2 border-b-2 border-r-2 border-slate-500 transform rotate-45" />
              </div>

              {/* City suggestions auto-completer */}
              <div className="flex-1 text-left relative">
                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block mb-1 px-1">Target City</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Search city (e.g. Bentonville, AR)"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full bg-[#030307] border border-slate-800/50 focus:border-blue-500/50 rounded-xl px-4 py-3 text-sm text-white outline-none font-medium transition-colors pl-10"
                  />
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                </div>

                {/* Suggestions dropdown */}
                {showSuggestions && (
                  <div className="absolute left-0 right-0 mt-2 bg-[#0D0D12] border border-slate-800/50 rounded-xl shadow-xl z-20 overflow-hidden font-sans">
                    {citySuggestions.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setCity(item)}
                        className="w-full px-4 py-2.5 text-xs text-left text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit trigger button */}
              <div className="sm:pt-5 flex items-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm px-8 py-3.5 rounded-xl transition-all duration-300 shadow-md shadow-blue-500/15 flex items-center justify-center gap-2 whitespace-nowrap hover:shadow-[0_0_25px_rgba(59,130,246,0.4)]"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Prospects</span>
                </button>
              </div>

            </form>
          </div>

          {/* Quick scout guidelines cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 max-w-4xl mx-auto">
            <div className="bg-[#0D0D12]/40 border border-slate-800/50 p-5 rounded-2xl flex flex-col gap-2.5 items-start text-left">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-sm text-white">Scan Any Market</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Search any local service industry and town. Our pipeline combs active GMB maps records to pull metadata.
              </p>
            </div>

            <div className="bg-[#0D0D12]/40 border border-slate-800/50 p-5 rounded-2xl flex flex-col gap-2.5 items-start text-left">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-sm text-white">Auto-Build Websites</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                For every lead identified without a website, the generator writes fully responsive, bespoke marketing copies.
              </p>
            </div>

            <div className="bg-[#0D0D12]/40 border border-slate-800/50 p-5 rounded-2xl flex flex-col gap-2.5 items-start text-left">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-sm text-white">Export &amp; Outreach</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Download your target lists with detailed contact, and write personalized outbound SMS or email copies.
              </p>
            </div>
          </div>
          
          {/* Quick Shortcut past searches */}
          {history.length > 0 && (
            <div className="pt-6 border-t border-slate-800/50 max-w-xl mx-auto space-y-2">
              <span className="text-[10px] text-slate-500 font-mono uppercase font-bold tracking-widest block">Quick Reload Saved Searches</span>
              <div className="flex flex-wrap gap-2 justify-center">
                {history.slice(0, 3).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => loadPastSearch(item)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#0D0D12] border border-slate-800/50 text-xs text-slate-400 hover:text-white hover:border-slate-700 font-sans font-medium flex items-center gap-1.5 transition-all"
                  >
                    <span>{item.industry} in {item.city.split(',')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. ACTIVE SEARCH RESULTS DASHBOARD VIEW */}
      {!isProcessing && currentSearchItem && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Back to search & Heading */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/50 pb-6">
            <div className="space-y-2 text-left">
              <button
                onClick={() => setCurrentSearchItem(null)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors font-semibold"
              >
                <span>&larr; Back to search console</span>
              </button>
              
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
                  {currentSearchItem.industry}s in {currentSearchItem.city}
                </h1>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono font-bold px-2 py-0.5 rounded uppercase">
                  Scanned Active
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleExportCSV}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/10 transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
              >
                <Download className="w-4 h-4" />
                <span>Download CSV</span>
              </button>
            </div>
          </div>

          {/* Results Overview Stats Cards (Matching Screenshot 3) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 font-sans">
            <div className="bg-[#0D0D12] border border-slate-800/50 p-5 rounded-2xl relative text-left">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Scraped</p>
              <h3 className="text-3xl font-mono font-bold text-white mt-1.5">{currentSearchItem.businesses.length}</h3>
              <p className="text-[11px] text-slate-500 mt-1">Google Maps profiles checked</p>
            </div>

            <div className="bg-[#0D0D12] border border-slate-800/50 p-5 rounded-2xl relative text-left">
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-yellow-500" />
              <p className="text-[10px] text-yellow-500/80 font-bold uppercase tracking-wider">No Website</p>
              <h3 className="text-3xl font-mono font-bold text-yellow-400 mt-1.5">
                {currentSearchItem.businesses.filter(b => !b.hasWebsite).length}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">Direct Outreach Candidates</p>
            </div>

            <div className="bg-[#0D0D12] border border-slate-800/50 p-5 rounded-2xl relative text-left">
              <p className="text-[10px] text-green-500/80 font-bold uppercase tracking-wider">Demo Sites Built</p>
              <h3 className="text-3xl font-mono font-bold text-green-400 mt-1.5">
                {currentSearchItem.businesses.filter(b => !b.hasWebsite && b.demoId).length}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">AI Portfolios Available</p>
            </div>

            <div className="bg-[#0D0D12] border border-slate-800/50 p-5 rounded-2xl relative text-left">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Search Duration</p>
              <h3 className="text-3xl font-mono font-bold text-white mt-1.5">4.2s</h3>
              <p className="text-[11px] text-slate-500 mt-1">Grounding engine latency</p>
            </div>
          </div>

          {/* Filtering Widgets Accordion */}
          <div className="bg-[#0D0D12]/60 border border-slate-800/50 p-4 rounded-2xl flex flex-wrap gap-6 items-center text-left font-sans text-xs">
            <div className="flex items-center gap-1.5 text-slate-400 font-semibold shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-blue-400" />
              <span>Pipeline Filters:</span>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-slate-400 font-medium">Min Google Rating:</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="bg-[#030307] border border-slate-800/50 rounded px-2.5 py-1 text-white font-medium outline-none cursor-pointer"
              >
                <option value={0}>Any Rating</option>
                <option value={4.0}>4.0+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-slate-400 font-medium">Min Reviews Count:</label>
              <select
                value={minReviews}
                onChange={(e) => setMinReviews(Number(e.target.value))}
                className="bg-[#030307] border border-slate-800/50 rounded px-2.5 py-1 text-white font-medium outline-none cursor-pointer"
              >
                <option value={0}>Any Reviews</option>
                <option value={20}>20+ Reviews</option>
                <option value={100}>100+ Reviews</option>
              </select>
            </div>

            <div className="flex items-center gap-2.5 ml-auto shrink-0">
              <input
                type="checkbox"
                id="hideWebsites"
                checked={hideWithWebsites}
                onChange={(e) => setHideWithWebsites(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-[#030307] border-slate-800/50 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="hideWebsites" className="text-slate-300 font-medium cursor-pointer">
                Hide businesses with websites
              </label>
            </div>
          </div>

          {/* Core prospects list (Matching Screenshot 3 table layout) */}
          <div className="bg-[#0D0D12] border border-slate-800/50 rounded-3xl overflow-hidden backdrop-blur-md">
            
            <div className="px-6 py-4.5 border-b border-slate-800/50 flex items-center">
              <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider">Prospect Pipeline Leads</h3>
              <span className="ml-3 text-[10px] bg-blue-500/10 text-blue-400 font-mono px-2 py-0.5 rounded-full font-bold">
                {filteredBusinesses.length} Candidates Found
              </span>
            </div>

            {filteredBusinesses.length === 0 ? (
              <div className="p-12 text-center space-y-4">
                <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
                <h4 className="font-display font-bold text-white text-sm">No prospects match your current filters</h4>
                <p className="text-slate-400 text-xs max-w-sm mx-auto leading-normal">
                  Try decreasing the minimum rating or toggle "Hide businesses with websites" to review the full list of candidates.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans text-xs">
                  <thead>
                    <tr className="border-b border-slate-800/50 text-slate-400 bg-[#07070B] uppercase tracking-widest text-[9px] font-bold">
                      <th className="py-4.5 px-6">Business</th>
                      <th className="py-4.5 px-4">Phone</th>
                      <th className="py-4.5 px-4">Address</th>
                      <th className="py-4.5 px-4">Rating</th>
                      <th className="py-4.5 px-4 text-center">GMB Profile</th>
                      <th className="py-4.5 px-4 text-center">Demo Site</th>
                      <th className="py-4.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/30 text-slate-300">
                    {filteredBusinesses.map((b) => (
                      <tr 
                        key={b.id}
                        className="hover:bg-slate-900/30 transition-colors duration-150 group"
                      >
                        {/* 1. Avatar + Name */}
                        <td className="py-4 px-6 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20 flex items-center justify-center shrink-0">
                            {b.name.slice(0, 1)}
                          </div>
                          <div className="font-sans overflow-hidden max-w-[200px]">
                            <p className="font-bold text-white truncate group-hover:text-blue-400 transition-colors">{b.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Score: {b.opportunityScore}%</p>
                          </div>
                        </td>

                        {/* 2. Phone */}
                        <td className="py-4 px-4 font-mono font-medium text-slate-400">
                          {b.phone ? (
                            <div className="flex items-center gap-1.5">
                              <span>{b.phone}</span>
                              <button
                                onClick={() => handleCopyText(b.phone, b.id + 'phone')}
                                className="text-slate-500 hover:text-white transition-colors"
                                title="Copy Phone Number"
                              >
                                {copiedId === b.id + 'phone' ? (
                                  <Check className="w-3 h-3 text-green-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-600">N/A</span>
                          )}
                        </td>

                        {/* 3. Address */}
                        <td className="py-4 px-4 max-w-[150px] truncate text-slate-400" title={b.address}>
                          {b.address.split(',')[0]}
                        </td>

                        {/* 4. Rating */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold text-white">{b.rating}</span>
                            <span className="text-[10px] text-slate-500">({b.reviewsCount})</span>
                          </div>
                        </td>

                        {/* 5. GMB link */}
                        <td className="py-4 px-4 text-center">
                          <a
                             href={b.mapsUrl}
                             target="_blank"
                             rel="noreferrer"
                             className="inline-flex items-center gap-1 text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded hover:bg-blue-500/20 transition-all font-semibold"
                          >
                            <span>GMB Profile</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>

                        {/* 6. Demo site CTA */}
                        <td className="py-4 px-4 text-center">
                          {b.hasWebsite ? (
                            <span className="text-[10px] font-mono bg-slate-900 text-slate-500 px-2 py-1 rounded">
                              Direct url
                            </span>
                          ) : (
                            <button
                              onClick={() => onSelectBusiness(b)}
                              className="inline-flex items-center gap-1.5 text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 px-2.5 py-1.5 rounded-lg font-bold transition-all shadow-sm"
                            >
                              <span>View Site</span>
                              <Globe className="w-3 h-3" />
                            </button>
                          )}
                        </td>

                        {/* 7. Delete Lead */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end gap-2.5">
                            <button
                              onClick={() => onSelectBusiness(b)}
                              className="text-xs text-slate-400 hover:text-white font-semibold"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => onDeleteBusiness(b.id)}
                              className="text-slate-600 hover:text-red-400 p-1 rounded hover:bg-red-500/5 transition-all"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}

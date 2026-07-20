import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Business, DemoSite } from '../types';
import { 
  X, Info, Globe, Mail, Phone, MapPin, Star, Sparkles, 
  Copy, Check, FileText, Send, MessageSquare, PhoneCall, AlertTriangle, Play 
} from 'lucide-react';
import DemoWebsiteViewer from './DemoWebsiteViewer';

interface BusinessDetailDrawerProps {
  business: Business;
  onClose: () => void;
  onUpdateDemo: (updatedDemo: DemoSite) => void;
  onSaveNotes: (businessId: string, notes: string) => Promise<void>;
  planId: 'free' | 'pro' | 'agency';
}

export default function BusinessDetailDrawer({ business, onClose, onUpdateDemo, onSaveNotes, planId }: BusinessDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'website' | 'outreach'>('info');
  const [notes, setNotes] = useState(business.notes);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSavedSuccess, setNotesSavedSuccess] = useState(false);

  // Outreach states
  const [outreachType, setOutreachType] = useState<'email' | 'sms' | 'linkedin' | 'phone_script' | 'follow_up'>('email');
  const [outreachContent, setOutreachContent] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGeneratingOutreach, setIsGeneratingOutreach] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setNotes(business.notes);
    setOutreachContent('');
    setCustomPrompt('');
  }, [business]);

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    await onSaveNotes(business.id, notes);
    setIsSavingNotes(false);
    setNotesSavedSuccess(true);
    setTimeout(() => setNotesSavedSuccess(false), 2500);
  };

  const handleGenerateOutreach = async () => {
    setIsGeneratingOutreach(true);
    try {
      const response = await fetch('/api/generate-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          type: outreachType,
          customPrompt: customPrompt.trim() || undefined
        })
      });
      const data = await response.json();
      if (data.success) {
        setOutreachContent(data.content);
      }
    } catch (e) {
      console.error('Error generating outreach:', e);
    } finally {
      setIsGeneratingOutreach(false);
    }
  };

  const handleCopyOutreach = () => {
    if (!outreachContent) return;
    navigator.clipboard.writeText(outreachContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'info', label: 'Lead & CRM Notes', icon: Info },
    { id: 'website', label: 'AI Demo Website', icon: Globe },
    { id: 'outreach', label: 'AI Outreach Drafts', icon: Sparkles },
  ] as const;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 220 }}
      className="fixed inset-y-0 right-0 w-[550px] md:w-[650px] lg:w-[850px] bg-[#0D0D12] border-l border-slate-800/50 shadow-2xl flex flex-col h-screen z-50 overflow-hidden"
    >
      {/* Drawer Header */}
      <div className="p-6 border-b border-slate-800/50 bg-[#0D0D12] flex items-center justify-between shrink-0 backdrop-blur-md">
        <div className="space-y-1.5 max-w-[80%]">
          <div className="flex items-center gap-2">
            <span className="text-[9px] bg-red-500/15 text-red-400 font-mono font-bold tracking-wider px-2 py-0.5 rounded uppercase border border-red-500/25">
              Opportunity Score: {business.opportunityScore}%
            </span>
            <span className="text-xs text-slate-500 font-mono">• {business.category}</span>
          </div>
          <h2 className="text-xl font-display font-bold text-white tracking-tight truncate" title={business.name}>
            {business.name}
          </h2>
          <p className="text-xs text-slate-400 font-sans truncate">{business.address}</p>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-xl border border-slate-800 bg-[#030307] hover:bg-[#0D0D12] text-slate-400 hover:text-white flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Tab Headers */}
      <div className="bg-[#0D0D12] px-6 border-b border-slate-800/50 shrink-0 flex gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3.5 px-4 font-medium text-xs flex items-center gap-2 relative transition-all border-b-2 ${
                isActive 
                  ? 'text-blue-400 border-blue-500 font-semibold' 
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Drawer Body (Scrollable) */}
      <div className="flex-1 overflow-y-auto min-h-0 bg-[#030307] scrollbar-thin">
        
        {/* TAB 1: LEAD OVERVIEW & CRM NOTES */}
        {activeTab === 'info' && (
          <div className="p-6 space-y-6">
            
            {/* Lead Metadata Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0D0D12] border border-slate-800/50 p-4 rounded-2xl">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-display">Google Business Rating</span>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-lg font-mono font-bold text-white">{business.rating}</span>
                  <span className="text-xs text-slate-400">({business.reviewsCount} reviews)</span>
                </div>
              </div>

              <div className="bg-[#0D0D12] border border-slate-800/50 p-4 rounded-2xl">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-display">Website Status</span>
                <div className="flex items-center gap-2 mt-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${business.hasWebsite ? 'bg-green-500 animate-pulse animate-duration-1000' : 'bg-yellow-500 animate-pulse animate-duration-1000'}`} />
                  <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                    {business.hasWebsite ? 'Has Website' : 'No Web Presence'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Contact Details */}
            <div className="bg-[#0D0D12]/40 border border-slate-800/50 rounded-2xl p-4 space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-display">Google Maps Metadata</h4>
              
              <div className="space-y-3 text-xs font-sans">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#030307] flex items-center justify-center text-slate-400 border border-slate-800/50">
                    <Phone className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium">Business Phone</p>
                    <p className="text-white font-mono mt-0.5">{business.phone || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#030307] flex items-center justify-center text-slate-400 border border-slate-800/50">
                    <Mail className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium">Outreach Email</p>
                    <p className="text-white font-mono mt-0.5">{business.email || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#030307] flex items-center justify-center text-slate-400 border border-slate-800/50">
                    <MapPin className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium">Scraped Address</p>
                    <p className="text-white mt-0.5 leading-normal">{business.address}</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/50 flex gap-3">
                <a
                  href={business.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[#030307] border border-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>View GMB Profile</span>
                </a>
                
                {business.website && (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-[#030307] border border-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Visit Existing Site</span>
                  </a>
                )}
              </div>
            </div>

            {/* CRM NOTES */}
            <div className="space-y-2.5">
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider font-display block">Outreach CRM Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write specific sales notes about this business (e.g. called on Tuesday, owner said to email again in 2 weeks...)"
                rows={5}
                className="w-full bg-[#0D0D12] border border-slate-800/50 focus:border-blue-500/50 rounded-2xl px-4 py-3 text-xs text-white outline-none resize-none transition-colors"
              />
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/20"
                >
                  {isSavingNotes ? (
                    <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : notesSavedSuccess ? (
                    'Notes Saved!'
                  ) : (
                    'Update Sales Notes'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI WEBSITE PREVIEW & BRAND CUSTOMIZER */}
        {activeTab === 'website' && (
          <div className="h-full bg-[#030307]">
            {business.demoSite ? (
              <DemoWebsiteViewer 
                demoSite={business.demoSite} 
                businessName={business.name}
                onSave={onUpdateDemo}
                category={business.category}
                rating={business.rating}
                reviewsCount={business.reviewsCount}
                city={business.city}
              />
            ) : (
              <div className="p-12 text-center space-y-4">
                <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto" />
                <h3 className="font-display font-bold text-white text-base">No website-less status</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto leading-normal">
                  This business already has a listed website ({business.website}). You do not need to generate a demo layout for this candidate.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: OUTREACH COPYWRITER */}
        {activeTab === 'outreach' && (
          <div className="p-6 space-y-6">
            <div className="space-y-1.5">
              <h3 className="font-display font-bold text-white text-base flex items-center gap-1.5">
                <Sparkles className="w-4.5 h-4.5 text-blue-400" />
                <span>AI Cold Outreach Assistant</span>
              </h3>
              <p className="text-slate-400 text-xs">
                Draft customized cold emails, SMS alerts, or phone calling scripts referencing their organic Google reviews success.
              </p>
            </div>

            {/* Selector Grid */}
            <div className="grid grid-cols-3 gap-2 p-0.5 bg-[#030307] border border-slate-800/30 rounded-xl text-slate-400">
              <button
                onClick={() => setOutreachType('email')}
                className={`py-2 px-3 text-[10px] md:text-xs rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  outreachType === 'email' ? 'bg-[#0D0D12] text-white border border-slate-700/60 shadow-md' : 'hover:text-slate-200'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Cold Email</span>
              </button>
              
              <button
                onClick={() => setOutreachType('sms')}
                className={`py-2 px-3 text-[10px] md:text-xs rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  outreachType === 'sms' ? 'bg-[#0D0D12] text-white border border-slate-700/60 shadow-md' : 'hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>SMS Text</span>
              </button>

              <button
                onClick={() => setOutreachType('phone_script')}
                className={`py-2 px-3 text-[10px] md:text-xs rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  outreachType === 'phone_script' ? 'bg-[#0D0D12] text-white border border-slate-700/60 shadow-md' : 'hover:text-slate-200'
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Calling Script</span>
              </button>
            </div>

            {/* Customizer Instructions (Optional) */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Custom Instructions (Optional)</label>
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. Mention a free 15% discount or emphasize emergency plumbing speed"
                className="w-full bg-[#0D0D12] border border-slate-800/50 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-colors"
              />
            </div>

            {/* Trigger generation button */}
            <button
              onClick={handleGenerateOutreach}
              disabled={isGeneratingOutreach}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
            >
              {isGeneratingOutreach ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Drafting Outreach Copy...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Compose Custom Outbound Copy</span>
                </>
              )}
            </button>

            {/* Output Field */}
            {outreachContent && (
              <div className="bg-[#0D0D12] border border-slate-800/50 rounded-2xl p-5 space-y-4 relative">
                <div className="flex items-center justify-between border-b border-slate-800/50 pb-3">
                  <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20">
                    Draft Output Ready
                  </span>
                  
                  <button
                    onClick={handleCopyOutreach}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-[#030307] border border-slate-800/50 px-3 py-1.5 rounded-lg hover:border-slate-700 transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Clipboard</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap max-h-[300px] overflow-y-auto scrollbar-thin">
                  {outreachContent}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </motion.div>
  );
}

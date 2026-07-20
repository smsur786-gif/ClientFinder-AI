import React from 'react';
import { Search, History, Globe, CreditCard, Settings, Sparkles, User, Shield } from 'lucide-react';

interface SidebarProps {
  currentView: 'search' | 'history' | 'demos' | 'billing' | 'settings';
  onViewChange: (view: 'search' | 'history' | 'demos' | 'billing' | 'settings') => void;
  planId: 'free' | 'pro' | 'agency';
  searchesPerformed: number;
  demosGenerated: number;
}

export default function Sidebar({ currentView, onViewChange, planId, searchesPerformed, demosGenerated }: SidebarProps) {
  const menuItems = [
    { id: 'search', label: 'Search Prospects', icon: Search },
    { id: 'history', label: 'Search History', icon: History },
    { id: 'demos', label: 'Demo Websites', icon: Globe },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <aside className="w-64 bg-[#0D0D12] border-r border-slate-800/50 flex flex-col h-screen sticky top-0 backdrop-blur-md z-30">
      {/* Branding */}
      <div className="p-6 border-b border-slate-800/50 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-display font-bold text-base text-white leading-tight tracking-tight">ClientFinder.ai</h1>
          <p className="text-[10px] text-blue-400/80 font-mono tracking-wider font-semibold uppercase">SaaS Outreach Engine</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider px-3 mb-2 font-display">Workspace</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-400/10 text-blue-400 font-semibold'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <span className="font-sans">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Subscription Card */}
      <div className="p-6 border-t border-slate-800/50 bg-[#0D0D12]">
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 flex flex-col gap-3 relative overflow-hidden">
          {/* subtle glowing background decoration */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">
              {planId === 'free' ? 'Free Tier' : planId === 'pro' ? 'Pro Member' : 'Agency Master'}
            </span>
            <span className="ml-auto text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded-full font-mono font-bold uppercase border border-blue-500/20">
              Active
            </span>
          </div>

          <div className="space-y-2 mt-1 font-sans">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Searches (This Month)</span>
              <span className="font-mono text-white font-medium">{searchesPerformed} / {planId === 'free' ? '3' : 'Unlimited'}</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-300" 
                style={{ width: planId === 'free' ? `${(searchesPerformed / 3) * 100}%` : '67%' }}
              />
            </div>
            
            <div className="flex justify-between text-[11px] text-slate-400 pt-1">
              <span>Demos Generated</span>
              <span className="font-mono text-white font-medium">{demosGenerated} / {planId === 'free' ? '5' : 'Unlimited'}</span>
            </div>
          </div>

          <button
            onClick={() => onViewChange('billing')}
            className="w-full text-center py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl transition-all duration-300 shadow-md shadow-blue-500/15"
          >
            Manage Subscription
          </button>
        </div>
        
        {/* User profile section */}
        <div className="flex items-center gap-3 mt-4 px-1">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-xs font-bold text-blue-400">
            SU
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">smsur786@gmail.com</p>
            <p className="text-[10px] text-slate-500 font-mono">Agent Environment</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

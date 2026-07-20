import React from 'react';
import { SearchHistoryItem } from '../types';
import { History, Calendar, Trash, ArrowRight, MapPin, Globe, Sparkles } from 'lucide-react';

interface SearchHistoryProps {
  history: SearchHistoryItem[];
  onLoadSearch: (search: SearchHistoryItem) => void;
  onDeleteSearch: (id: string) => void;
}

export default function SearchHistory({ history, onLoadSearch, onDeleteSearch }: SearchHistoryProps) {
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateStr;
    }
  };

  if (history.length === 0) {
    return (
      <div className="bg-[#0D0D12] border border-slate-800/50 p-12 rounded-3xl text-center max-w-3xl mx-auto backdrop-blur-sm space-y-6 mt-8">
        <div className="w-16 h-16 rounded-2xl bg-[#030307] border border-slate-800/50 flex items-center justify-center mx-auto text-slate-500 shadow-inner">
          <History className="w-7 h-7 text-blue-400" />
        </div>
        <div className="space-y-2">
          <h3 className="font-display font-bold text-xl text-white">No search history yet</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            Perform your first city scan from the Search dashboard to query Google Maps and identify businesses without websites.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold text-white tracking-tight">Search History</h2>
          <p className="text-slate-400 mt-1 text-sm font-sans">
            Review and reload past local scans, check accumulated leads, and manage your pipeline.
          </p>
        </div>
        
        <div className="text-xs bg-[#0D0D12] border border-slate-800/50 text-slate-400 font-mono px-3 py-1.5 rounded-full flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
          <span>{history.length} Saved Scans</span>
        </div>
      </div>

      {/* Grid of history cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {history.map((item) => (
          <div 
            key={item.id}
            className="bg-[#0D0D12] border border-slate-800/50 rounded-3xl p-6 hover:border-slate-700/80 transition-all duration-300 group flex flex-col justify-between backdrop-blur-sm relative overflow-hidden"
          >
            {/* Subtle card glow decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-300" />
            
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                    {item.industry}
                  </span>
                  <h3 className="text-lg font-display font-bold text-white flex items-center gap-1.5 mt-1">
                    <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="truncate">{item.city}</span>
                  </h3>
                </div>
                
                <button
                  onClick={() => onDeleteSearch(item.id)}
                  className="w-8 h-8 rounded-lg border border-transparent hover:border-red-500/20 text-slate-500 hover:text-red-400 hover:bg-red-500/5 flex items-center justify-center transition-all duration-200"
                  title="Delete Search"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>

              {/* Stats line */}
              <div className="grid grid-cols-3 gap-3 bg-[#030307] border border-slate-800/30 p-3 rounded-2xl font-sans">
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Total Found</p>
                  <p className="text-base font-mono font-bold text-white mt-0.5">{item.totalFound}</p>
                </div>
                <div className="text-center border-x border-slate-800/30">
                  <p className="text-[10px] text-yellow-500/80 font-bold uppercase tracking-wide">No Website</p>
                  <p className="text-base font-mono font-bold text-yellow-400 mt-0.5">{item.noWebsite}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-green-500/80 font-bold uppercase tracking-wide">Demos Built</p>
                  <p className="text-base font-mono font-bold text-green-400 mt-0.5">{item.demoSitesCount}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-800/40 pt-4 mt-5">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(item.timestamp)}</span>
              </div>

              <button
                onClick={() => onLoadSearch(item)}
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 group-hover:text-blue-300 transition-colors duration-200 group-hover:translate-x-1 transition-transform"
              >
                <span>Scout Leads</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

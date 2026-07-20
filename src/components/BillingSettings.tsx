import React, { useState } from 'react';
import { CreditCard, CheckCircle2, Shield, Sparkles, Building, Zap } from 'lucide-react';

interface BillingSettingsProps {
  planId: 'free' | 'pro' | 'agency';
  onPlanChange: (planId: 'free' | 'pro' | 'agency') => void;
  searchesPerformed: number;
  demosGenerated: number;
}

export default function BillingSettings({ planId, onPlanChange, searchesPerformed, demosGenerated }: BillingSettingsProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'Free Starter',
      price: '$0',
      period: 'forever',
      description: 'Test driving the AI discovery engine',
      icon: Shield,
      features: [
        '3 local searches per month',
        'Up to 5 demo websites total',
        'Standard procedural copywriter',
        'View Google Maps profiles',
        'CSV Export disabled',
        'Dynamic website editor disabled',
      ],
      cta: 'Current Plan',
      badge: 'Starter',
      color: 'from-gray-700 to-gray-800',
    },
    {
      id: 'pro',
      name: 'Pro Finder',
      price: '$97',
      period: 'month',
      description: 'Ideal for independent developers & consultants',
      icon: Zap,
      features: [
        'Unlimited local searches',
        'Unlimited AI demo websites',
        'AI Outreach Generator (Gemini-powered)',
        'Full CSV Lead Exporting',
        'Live website editing & custom colors',
        'Standard Google Maps scraper speed',
      ],
      cta: 'Upgrade to Pro',
      badge: 'Most Popular',
      color: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'agency',
      name: 'Agency Elite',
      price: '$249',
      period: 'month',
      description: 'For growing web agencies & outbound marketing teams',
      icon: Building,
      features: [
        'Everything in Pro plan',
        'Multi-user team management',
        'White label custom demo URLs',
        'Bulk outreach generator pipeline',
        'CRM Integrations (HubSpot, Salesforce)',
        'High-priority generation priority queues',
      ],
      cta: 'Go Agency Scale',
      badge: 'Best Value',
      color: 'from-purple-600 to-indigo-600',
    },
  ] as const;

  const handleSwitchPlan = async (id: 'free' | 'pro' | 'agency') => {
    if (id === planId) return;
    setLoadingPlan(id);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    onPlanChange(id);
    setLoadingPlan(null);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-display font-bold text-white tracking-tight">Billing & Plans</h2>
        <p className="text-gray-400 mt-1.5 text-sm">
          Select the subscription level that matches your client generation scale. Switch, pause, or downgrade at any time.
        </p>
      </div>

      {/* Usage Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#16181D]/80 border border-gray-800 p-6 rounded-2xl relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
          <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Active Plan</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-2xl font-bold font-display text-white capitalize">{planId} Plan</h3>
            <span className="text-xs bg-blue-500/10 text-blue-400 font-mono px-2 py-0.5 rounded-full font-bold uppercase border border-blue-500/20">
              Active
            </span>
          </div>
          <p className="text-gray-500 text-xs mt-2 font-sans">
            {planId === 'free' ? 'Upgrade to Pro for full AI copywriting and CSV lead exports.' : 'Thank you for supporting AI Client Finder! Enjoy unlimited searches.'}
          </p>
        </div>

        <div className="bg-[#16181D]/80 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm">
          <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Searches Performed</p>
          <h3 className="text-4xl font-mono font-bold text-white mt-2">
            {searchesPerformed}
            <span className="text-lg text-gray-500 font-normal font-sans"> / {planId === 'free' ? '3' : '∞'}</span>
          </h3>
          <p className="text-gray-500 text-xs mt-2 font-sans">
            {planId === 'free' ? `${3 - searchesPerformed} searches remaining for this billing cycle.` : 'Unlimited searches available with your current plan.'}
          </p>
        </div>

        <div className="bg-[#16181D]/80 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm">
          <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">AI Demos Built</p>
          <h3 className="text-4xl font-mono font-bold text-white mt-2">
            {demosGenerated}
            <span className="text-lg text-gray-500 font-normal font-sans"> / {planId === 'free' ? '5' : '∞'}</span>
          </h3>
          <p className="text-gray-500 text-xs mt-2 font-sans">
            {planId === 'free' ? `${Math.max(0, 5 - demosGenerated)} custom websites templates remaining.` : 'Unlimited web prototypes allowed.'}
          </p>
        </div>
      </div>

      {/* Pricing Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((item) => {
          const Icon = item.icon;
          const isCurrent = planId === item.id;
          
          return (
            <div 
              key={item.id} 
              className={`bg-[#16181D]/80 rounded-3xl p-6 flex flex-col justify-between backdrop-blur-sm border-2 transition-all duration-300 relative ${
                isCurrent 
                  ? 'border-blue-500/80 shadow-[0_0_30px_rgba(59,130,246,0.15)] bg-gradient-to-b from-[#1C1E24]/80 to-[#16181D]/80 scale-[1.02]' 
                  : 'border-gray-800/80 hover:border-gray-700/80 shadow-lg'
              }`}
            >
              {isCurrent && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-mono text-[9px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full border-2 border-blue-400 shadow-md">
                  Active Subscription
                </div>
              )}

              <div>
                {/* Plan Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-lg text-white">{item.name}</h4>
                    <p className="text-gray-400 text-xs font-sans h-8 leading-snug">{item.description}</p>
                  </div>
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center shadow-lg shadow-black/10`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Plan Price */}
                <div className="flex items-baseline gap-1 mt-6 border-b border-gray-800/60 pb-6">
                  <span className="text-4xl font-display font-bold text-white">{item.price}</span>
                  <span className="text-gray-500 text-xs font-sans font-medium">/ {item.period}</span>
                </div>

                {/* Core Features */}
                <div className="mt-6 space-y-4">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider font-display">Includes:</p>
                  <ul className="space-y-3 font-sans">
                    {item.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-300 leading-normal">
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${isCurrent ? 'text-blue-400' : 'text-gray-500'}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8">
                <button
                  disabled={isCurrent || loadingPlan !== null}
                  onClick={() => handleSwitchPlan(item.id)}
                  className={`w-full py-3 px-4 font-semibold text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                    isCurrent
                      ? 'bg-gray-800 text-gray-400 border border-gray-700 cursor-default'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 hover:shadow-[0_4px_25px_rgba(59,130,246,0.3)]'
                  }`}
                >
                  {loadingPlan === item.id ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : isCurrent ? (
                    'Your Current Plan'
                  ) : (
                    item.cta
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

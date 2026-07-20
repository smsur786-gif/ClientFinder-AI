import React, { useState } from 'react';
import { DemoSite } from '../types';
import { 
  Laptop, Tablet, Smartphone, Check, HelpCircle, Phone, MapPin, Mail, 
  SlidersHorizontal, Save, Sparkles, CheckCircle2, Wrench, Heart, Scissors, 
  Zap, Wind, Utensils, Dumbbell, Landmark, ShieldCheck, Activity, 
  Thermometer, Droplet, Star, Compass, Play, ArrowRight
} from 'lucide-react';

interface DemoWebsiteViewerProps {
  demoSite: DemoSite;
  businessName: string;
  onSave?: (updatedDemo: DemoSite) => void;
  standalone?: boolean;
  category?: string;
  rating?: number;
  reviewsCount?: number;
  city?: string;
}

export default function DemoWebsiteViewer({ 
  demoSite, 
  businessName, 
  onSave, 
  standalone = false,
  category = '',
  rating = 4.6,
  reviewsCount = 116,
  city = 'Bentonville, AR'
}: DemoWebsiteViewerProps) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [heroTitle, setHeroTitle] = useState(demoSite.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(demoSite.heroSubtitle);
  const [description, setDescription] = useState(demoSite.description);
  const [aboutText, setAboutText] = useState(demoSite.aboutText);
  const [brandColor, setBrandColor] = useState(demoSite.brandColor);
  const [theme, setTheme] = useState(demoSite.theme);
  
  const [showConfig, setShowConfig] = useState(!standalone);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Lead form simulation
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadMsg, setLeadMsg] = useState('');
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const colors = [
    { name: 'SaaS Blue', hex: '#2563EB' },
    { name: 'Emerald', hex: '#10B981' },
    { name: 'Royal Violet', hex: '#6366F1' },
    { name: 'Rose Petal', hex: '#F43F5E' },
    { name: 'Amber Glow', hex: '#F59E0B' },
    { name: 'Sea Teal', hex: '#14B8A6' },
    { name: 'Pure Dark', hex: '#111827' },
  ];

  const handleSave = async () => {
    if (!onSave) return;
    setIsSaving(true);
    const updated: DemoSite = {
      ...demoSite,
      heroTitle,
      heroSubtitle,
      description,
      aboutText,
      brandColor,
      theme,
    };
    await new Promise((resolve) => setTimeout(resolve, 800));
    onSave(updated);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;
    setLeadSubmitted(true);
    setTimeout(() => {
      setLeadSubmitted(false);
      setLeadName('');
      setLeadPhone('');
      setLeadMsg('');
    }, 4000);
  };

  // Category-specific layout variables and theme customization
  const rawCat = (category || demoSite.description || '').toLowerCase();
  
  const isPlumbing = rawCat.includes('plumb');
  const isDentist = rawCat.includes('dent') || rawCat.includes('ortho') || rawCat.includes('clinic') || rawCat.includes('doctor') || rawCat.includes('medical') || rawCat.includes('teeth');
  const isSalon = rawCat.includes('salon') || rawCat.includes('hair') || rawCat.includes('beauty') || rawCat.includes('spa') || rawCat.includes('nail');
  const isElectrician = rawCat.includes('electr') || rawCat.includes('power') || rawCat.includes('wire');
  const isHvac = rawCat.includes('hvac') || rawCat.includes('ac') || rawCat.includes('heat') || rawCat.includes('air cond') || rawCat.includes('furnace');
  const isRestaurant = rawCat.includes('restaur') || rawCat.includes('food') || rawCat.includes('cafe') || rawCat.includes('bakery') || rawCat.includes('pizza') || rawCat.includes('kitchen') || rawCat.includes('diner');
  const isGym = rawCat.includes('gym') || rawCat.includes('fit') || rawCat.includes('crossfit') || rawCat.includes('train') || rawCat.includes('athletic');
  const isLawyer = rawCat.includes('law') || rawCat.includes('legal') || rawCat.includes('attorney') || rawCat.includes('advocat') || rawCat.includes('advocate');

  // Trust labels & customized themes
  let trustPoints = ['✓ Fully Licensed & Insured', '✓ Free Written Estimates', '✓ 100% Satisfaction Guarantee'];
  let badgeText = `⭐ Rated Outstanding Service in ${city}`;
  let servicesSectionTag = 'WHAT WE DO';
  let categoryVibe: 'industrial' | 'clinical' | 'luxury' | 'neon' | 'thermal' | 'warm' | 'athletics' | 'prestige' | 'modern' = 'modern';

  if (isPlumbing) {
    trustPoints = ['✓ Licensed & Insured', '✓ Fast 24/7 Response', '✓ Satisfaction Guaranteed'];
    badgeText = `🔧 ${rating}★ Rated Professional Plumber in ${city}`;
    servicesSectionTag = 'WHAT WE DO';
    categoryVibe = 'industrial';
  } else if (isDentist) {
    trustPoints = ['✓ Accepting New Patients', '✓ Emergency Care Available', '✓ State-of-the-Art Comfort'];
    badgeText = `🏥 Top-Rated Dental Practice • Serving ${city}`;
    servicesSectionTag = 'OUR PRACTICE FOCUS';
    categoryVibe = 'clinical';
  } else if (isSalon) {
    trustPoints = ['✓ Expert Stylists & Estheticians', '✓ Premium Organic Products', '✓ Ultimate Luxury Relaxation'];
    badgeText = `✨ Elegant Hair & Beauty Salon in ${city}`;
    servicesSectionTag = 'OUR BEAUTY MENU';
    categoryVibe = 'luxury';
  } else if (isElectrician) {
    trustPoints = ['✓ Safety-Inspected Team', '✓ Upfront Flat-rate Pricing', '✓ Same-Day Dispatch'];
    badgeText = `⚡ Safety-Certified Local Electrician in ${city}`;
    servicesSectionTag = 'ELECTRICAL SERVICES';
    categoryVibe = 'neon';
  } else if (isHvac) {
    trustPoints = ['✓ 24/7 HVAC Emergency Repair', '✓ Energy Star Comfort Upgrades', '✓ Certified Climate Techs'];
    badgeText = `❄️ 24/7 Professional Heating & Air in ${city}`;
    servicesSectionTag = 'OUR COMFORT SERVICES';
    categoryVibe = 'thermal';
  } else if (isRestaurant) {
    trustPoints = ['✓ Fresh Farm-to-Table Ingredients', '✓ Cozy Dine-in & Fast Takeaway', '✓ Award-Winning Chefs & Menu'];
    badgeText = `🍳 Premier Gourmet Kitchen & Bistro in ${city}`;
    servicesSectionTag = 'OUR CURATED MENU';
    categoryVibe = 'warm';
  } else if (isGym) {
    trustPoints = ['✓ Certified Elite Coaches', '✓ 24/7 Modern Keycard Access', '✓ Flexible Memberships - No Contracts'];
    badgeText = `💪 Elite Performance Training & Gym in ${city}`;
    servicesSectionTag = 'TRAINING SPECIALTIES';
    categoryVibe = 'athletics';
  } else if (isLawyer) {
    trustPoints = ['✓ Dedicated Legal Advocates', '✓ Complete Client Confidentiality', '✓ Proven Track Record of Verdicts'];
    badgeText = `⚖️ Professional Trial & Legal Advocates in ${city}`;
    servicesSectionTag = 'AREAS OF PRACTICE';
    categoryVibe = 'prestige';
  }

  // Dynamic Service Icons
  const getServiceIcon = (idx: number) => {
    const isDarkBackground = categoryVibe === 'industrial' || categoryVibe === 'athletics' || categoryVibe === 'prestige';
    const iconClass = `w-5 h-5 ${isDarkBackground ? 'text-white' : 'text-slate-800'}`;
    
    if (isPlumbing) {
      const icons = [Wrench, Droplet, Compass, ShieldCheck, CheckCircle2, Play];
      const IconComp = icons[idx % icons.length];
      return <IconComp className={iconClass} />;
    }
    if (isDentist) {
      const icons = [Heart, Activity, Sparkles, ShieldCheck, CheckCircle2, Check];
      const IconComp = icons[idx % icons.length];
      return <IconComp className={iconClass} />;
    }
    if (isSalon) {
      const icons = [Scissors, Sparkles, Heart, CheckCircle2, Star, Check];
      const IconComp = icons[idx % icons.length];
      return <IconComp className={iconClass} />;
    }
    if (isElectrician) {
      const icons = [Zap, ShieldCheck, Compass, CheckCircle2, Wrench, Check];
      const IconComp = icons[idx % icons.length];
      return <IconComp className={iconClass} />;
    }
    if (isHvac) {
      const icons = [Wind, Thermometer, ShieldCheck, CheckCircle2, Compass, Check];
      const IconComp = icons[idx % icons.length];
      return <IconComp className={iconClass} />;
    }
    if (isRestaurant) {
      const icons = [Utensils, CheckCircle2, Play, Heart, CheckCircle2, Star];
      const IconComp = icons[idx % icons.length];
      return <IconComp className={iconClass} />;
    }
    if (isGym) {
      const icons = [Dumbbell, Activity, Compass, CheckCircle2, ShieldCheck, Star];
      const IconComp = icons[idx % icons.length];
      return <IconComp className={iconClass} />;
    }
    if (isLawyer) {
      const icons = [Landmark, ShieldCheck, Compass, CheckCircle2, Check, Star];
      const IconComp = icons[idx % icons.length];
      return <IconComp className={iconClass} />;
    }
    return <CheckCircle2 className={iconClass} />;
  };

  // Render configuration based on vibe
  let canvasBgClass = 'bg-white text-gray-800';
  let headerBgClass = 'bg-white border-b border-gray-100 text-gray-900';
  let headerLogoBg = brandColor;
  let headerLogoText = 'text-white';
  let badgeStyle = { color: brandColor, borderColor: `${brandColor}20`, backgroundColor: `${brandColor}05` };
  
  let heroSectionClass = 'relative overflow-hidden py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white px-6 md:px-12 text-center text-gray-800';
  let heroTitleClass = 'font-display font-extrabold text-3xl md:text-5xl text-gray-900 leading-tight tracking-tight';
  let heroSubtitleClass = 'text-gray-500 text-sm md:text-lg leading-relaxed max-w-2xl mx-auto font-sans font-medium';
  
  let servicesSectionClass = 'py-16 px-6 md:px-12 max-w-6xl mx-auto space-y-10';
  let serviceCardClass = 'bg-white border border-gray-100 p-5 rounded-2xl hover:shadow-md transition-all flex flex-col justify-between';
  let serviceCardTitleClass = 'font-display font-bold text-gray-900 text-sm md:text-base';
  let serviceCardDescClass = 'text-gray-500 text-xs leading-relaxed font-sans';
  
  let aboutSectionClass = 'bg-gray-50/70 border-y border-gray-100 py-16 px-6 md:px-12';
  let aboutTitleClass = 'font-display font-bold text-2xl md:text-3xl text-gray-900 leading-tight';
  let aboutTextClass = 'text-gray-500 text-xs md:text-sm leading-relaxed max-w-xl font-sans';
  let guaranteeCardClass = 'bg-white border border-gray-200/60 p-6 rounded-2xl shadow-inner text-center space-y-4';
  
  let faqSectionClass = 'py-16 px-6 md:px-12 max-w-4xl mx-auto space-y-10';
  let faqCardClass = 'bg-white border border-gray-100 p-5 rounded-2xl flex gap-4';
  
  let formSectionClass = 'py-16 px-6 md:px-12 bg-gray-50 border-t border-gray-100';
  let formContainerClass = 'max-w-xl mx-auto bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xl shadow-gray-100';
  
  let footerClass = 'bg-gray-900 text-gray-400 py-12 px-6 md:px-12 border-t border-gray-800 font-sans';

  if (categoryVibe === 'industrial') {
    canvasBgClass = 'bg-slate-950 text-slate-100';
    headerBgClass = 'bg-slate-950 border-b border-slate-800/80 text-white';
    headerLogoBg = '#F59E0B';
    headerLogoText = 'text-slate-950';
    badgeStyle = { color: '#F59E0B', borderColor: '#F59E0B50', backgroundColor: '#F59E0B10' };
    heroSectionClass = 'relative overflow-hidden py-16 md:py-24 bg-[#0B0F19] px-6 md:px-12 text-center border-b border-slate-900';
    heroTitleClass = 'font-display font-black text-3xl sm:text-4xl md:text-5xl text-white leading-tight tracking-tight';
    heroSubtitleClass = 'text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-sans font-medium';
    servicesSectionClass = 'py-16 px-6 md:px-12 max-w-6xl mx-auto space-y-10 bg-slate-950';
    serviceCardClass = 'bg-slate-900/60 border border-slate-800 p-5 rounded-2xl hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/2 transition-all flex flex-col justify-between';
    serviceCardTitleClass = 'font-display font-bold text-white text-sm md:text-base';
    serviceCardDescClass = 'text-slate-400 text-xs leading-relaxed font-sans';
    aboutSectionClass = 'bg-slate-900 border-y border-slate-800 py-16 px-6 md:px-12';
    aboutTitleClass = 'font-display font-extrabold text-2xl md:text-3xl text-white leading-tight';
    aboutTextClass = 'text-slate-400 text-xs md:text-sm leading-relaxed max-w-xl font-sans';
    guaranteeCardClass = 'bg-slate-950 border border-slate-800/80 p-6 rounded-2xl text-center space-y-4';
    faqSectionClass = 'py-16 px-6 md:px-12 max-w-4xl mx-auto space-y-10 bg-slate-950';
    faqCardClass = 'bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex gap-4';
    formSectionClass = 'py-16 px-6 md:px-12 bg-slate-900 border-t border-slate-800';
    formContainerClass = 'max-w-xl mx-auto bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl';
    footerClass = 'bg-black text-slate-500 py-12 px-6 md:px-12 border-t border-slate-900 font-sans';
  } else if (categoryVibe === 'clinical') {
    canvasBgClass = 'bg-[#FAFCFC] text-[#2C3E3B]';
    headerBgClass = 'bg-white border-b border-[#E6EFF2] text-[#1D2B28]';
    headerLogoBg = '#0EA5E9';
    headerLogoText = 'text-white';
    badgeStyle = { color: '#0F766E', borderColor: '#CCFBF1', backgroundColor: '#F0FDFA' };
    heroSectionClass = 'relative overflow-hidden py-16 md:py-24 bg-gradient-to-b from-teal-50/40 to-white px-6 md:px-12 text-center text-[#2C3E3B]';
    heroTitleClass = 'font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#0F766E] leading-tight tracking-tight';
    heroSubtitleClass = 'text-[#4A5D5A] text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-sans font-medium';
    servicesSectionClass = 'py-16 px-6 md:px-12 max-w-6xl mx-auto space-y-10 bg-white';
    serviceCardClass = 'bg-white border border-[#E6EFF2] p-5 rounded-2xl hover:border-teal-500/20 hover:shadow-md hover:shadow-teal-500/2 transition-all flex flex-col justify-between';
    serviceCardTitleClass = 'font-display font-bold text-[#0F766E] text-sm md:text-base';
    serviceCardDescClass = 'text-[#5C716E] text-xs leading-relaxed font-sans';
    aboutSectionClass = 'bg-teal-50/20 border-y border-[#E6EFF2] py-16 px-6 md:px-12';
    aboutTitleClass = 'font-display font-bold text-2xl md:text-3xl text-[#1F2E2B] leading-tight';
    aboutTextClass = 'text-[#4A5D5A] text-xs md:text-sm leading-relaxed max-w-xl font-sans';
    guaranteeCardClass = 'bg-white border border-[#E6EFF2] p-6 rounded-2xl text-center space-y-4';
    faqSectionClass = 'py-16 px-6 md:px-12 max-w-4xl mx-auto space-y-10 bg-white';
    faqCardClass = 'bg-white border border-[#E6EFF2] p-5 rounded-2xl flex gap-4';
    formSectionClass = 'py-16 px-6 md:px-12 bg-teal-50/10 border-t border-[#E6EFF2]';
    formContainerClass = 'max-w-xl mx-auto bg-white border border-[#E6EFF2] rounded-3xl p-6 md:p-8 shadow-xl shadow-teal-500/5';
    footerClass = 'bg-[#1D2B28] text-teal-300/60 py-12 px-6 md:px-12 border-t border-[#131F1C] font-sans';
  } else if (categoryVibe === 'luxury') {
    canvasBgClass = 'bg-[#FDFCF7] text-[#3D3430]';
    headerBgClass = 'bg-[#FDFCF7] border-b border-[#F2ECE4] text-[#29221F]';
    headerLogoBg = '#C2A383';
    headerLogoText = 'text-white';
    badgeStyle = { color: '#8C6D4F', borderColor: '#F2ECE4', backgroundColor: '#FAF6F0' };
    heroSectionClass = 'relative overflow-hidden py-20 md:py-28 bg-gradient-to-b from-[#F7F2EB] to-[#FDFCF7] px-6 md:px-12 text-center text-[#3D3430] font-serif';
    heroTitleClass = 'font-serif font-light italic text-4xl sm:text-5xl md:text-6xl text-[#29221F] leading-tight tracking-tight';
    heroSubtitleClass = 'text-[#5C514B] text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-sans font-medium tracking-wide';
    servicesSectionClass = 'py-16 px-6 md:px-12 max-w-6xl mx-auto space-y-10 bg-[#FDFCF7]';
    serviceCardClass = 'bg-[#FAF6F0]/40 border border-[#FAF6F0] p-6 rounded-3xl hover:border-[#C2A383]/30 hover:shadow-lg transition-all flex flex-col justify-between font-sans';
    serviceCardTitleClass = 'font-serif font-bold text-[#29221F] text-base md:text-lg';
    serviceCardDescClass = 'text-[#6E635C] text-xs leading-relaxed font-sans';
    aboutSectionClass = 'bg-[#FAF6F0]/50 border-y border-[#F2ECE4] py-16 px-6 md:px-12';
    aboutTitleClass = 'font-serif font-normal text-2xl md:text-3xl text-[#29221F] leading-tight';
    aboutTextClass = 'text-[#5C514B] text-xs md:text-sm leading-relaxed max-w-xl font-sans';
    guaranteeCardClass = 'bg-[#FDFCF7] border border-[#FAF6F0] p-6 rounded-3xl text-center space-y-4';
    faqSectionClass = 'py-16 px-6 md:px-12 max-w-4xl mx-auto space-y-10 bg-[#FDFCF7]';
    faqCardClass = 'bg-[#FAF6F0]/30 border border-[#FAF6F0] p-5 rounded-3xl flex gap-4';
    formSectionClass = 'py-16 px-6 md:px-12 bg-[#FAF6F0]/50 border-t border-[#F2ECE4]';
    formContainerClass = 'max-w-xl mx-auto bg-[#FDFCF7] border border-[#F2ECE4] rounded-3xl p-6 md:p-8 shadow-xl shadow-[#FAF6F0]';
    footerClass = 'bg-[#29221F] text-[#C2A383]/60 py-12 px-6 md:px-12 border-t border-[#1F1917] font-sans';
  } else if (categoryVibe === 'athletics') {
    canvasBgClass = 'bg-[#0E0F12] text-slate-100';
    headerBgClass = 'bg-[#0E0F12] border-b border-slate-800 text-white';
    headerLogoBg = '#EA580C';
    headerLogoText = 'text-white';
    badgeStyle = { color: '#EA580C', borderColor: '#EA580C40', backgroundColor: '#EA580C10' };
    heroSectionClass = 'relative overflow-hidden py-16 md:py-24 bg-[#14161C] px-6 md:px-12 text-center text-white';
    heroTitleClass = 'font-display font-black italic uppercase text-3xl sm:text-4xl md:text-5xl text-white leading-tight tracking-tight';
    heroSubtitleClass = 'text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-sans font-bold uppercase tracking-wider';
    servicesSectionClass = 'py-16 px-6 md:px-12 max-w-6xl mx-auto space-y-10 bg-[#0E0F12]';
    serviceCardClass = 'bg-[#14161C] border border-slate-800 p-5 rounded-none border-l-4 border-l-orange-600 hover:border-orange-500 hover:shadow-lg transition-all flex flex-col justify-between';
    serviceCardTitleClass = 'font-display font-black italic uppercase text-white text-base';
    serviceCardDescClass = 'text-slate-400 text-xs leading-relaxed font-sans';
    aboutSectionClass = 'bg-[#14161C] border-y border-slate-800 py-16 px-6 md:px-12';
    aboutTitleClass = 'font-display font-black italic uppercase text-2xl md:text-3xl text-white leading-tight';
    aboutTextClass = 'text-slate-400 text-xs md:text-sm leading-relaxed max-w-xl font-sans';
    guaranteeCardClass = 'bg-[#0E0F12] border border-slate-850 p-6 rounded-none border-t-4 border-t-orange-600 text-center space-y-4';
    faqSectionClass = 'py-16 px-6 md:px-12 max-w-4xl mx-auto space-y-10 bg-[#0E0F12]';
    faqCardClass = 'bg-[#14161C] border border-slate-800 p-5 rounded-none flex gap-4';
    formSectionClass = 'py-16 px-6 md:px-12 bg-[#14161C] border-t border-slate-800';
    formContainerClass = 'max-w-xl mx-auto bg-[#0E0F12] border border-slate-800 rounded-none p-6 md:p-8 shadow-2xl';
    footerClass = 'bg-black text-slate-500 py-12 px-6 md:px-12 border-t border-slate-900 font-sans';
  } else if (categoryVibe === 'prestige') {
    canvasBgClass = 'bg-slate-50 text-slate-900';
    headerBgClass = 'bg-white border-b border-[#DFE5ED] text-slate-900';
    headerLogoBg = '#1E3A8A';
    headerLogoText = 'text-white';
    badgeStyle = { color: '#B45309', borderColor: '#F59E0B40', backgroundColor: '#FEF3C7' };
    heroSectionClass = 'relative overflow-hidden py-16 md:py-24 bg-[#0F172A] px-6 md:px-12 text-center text-white font-serif';
    heroTitleClass = 'font-serif font-extrabold text-3xl sm:text-4xl md:text-5xl text-white leading-tight tracking-tight';
    heroSubtitleClass = 'text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-sans font-medium';
    servicesSectionClass = 'py-16 px-6 md:px-12 max-w-6xl mx-auto space-y-10 bg-slate-50';
    serviceCardClass = 'bg-white border border-[#DFE5ED] p-5 rounded-lg hover:border-amber-600 hover:shadow-lg transition-all flex flex-col justify-between font-serif';
    serviceCardTitleClass = 'font-serif font-bold text-[#1E3A8A] text-sm md:text-base';
    serviceCardDescClass = 'text-slate-600 text-xs leading-relaxed font-sans';
    aboutSectionClass = 'bg-[#1E3A8A] text-white border-y border-[#122557] py-16 px-6 md:px-12';
    aboutTitleClass = 'font-serif font-bold text-2xl md:text-3xl text-white leading-tight';
    aboutTextClass = 'text-slate-100 text-xs md:text-sm leading-relaxed max-w-xl font-sans';
    guaranteeCardClass = 'bg-[#0F172A] text-white border border-[#1E3A8A] p-6 rounded-lg text-center space-y-4';
    faqSectionClass = 'py-16 px-6 md:px-12 max-w-4xl mx-auto space-y-10 bg-slate-50';
    faqCardClass = 'bg-white border border-[#DFE5ED] p-5 rounded-lg flex gap-4';
    formSectionClass = 'py-16 px-6 md:px-12 bg-white border-t border-[#DFE5ED]';
    formContainerClass = 'max-w-xl mx-auto bg-slate-50 border border-[#DFE5ED] rounded-xl p-6 md:p-8 shadow-xl';
    footerClass = 'bg-[#0F172A] text-slate-400 py-12 px-6 md:px-12 border-t border-slate-900 font-sans';
  } else if (categoryVibe === 'neon') {
    canvasBgClass = 'bg-slate-950 text-slate-100';
    headerBgClass = 'bg-slate-950 border-b border-slate-800 text-white';
    headerLogoBg = '#FCD34D';
    headerLogoText = 'text-slate-950';
    badgeStyle = { color: '#FCD34D', borderColor: '#FCD34D30', backgroundColor: '#FCD34D0A' };
    heroSectionClass = 'relative overflow-hidden py-16 md:py-24 bg-gradient-to-b from-slate-900 to-slate-950 px-6 md:px-12 text-center text-slate-100';
    heroTitleClass = 'font-display font-black text-3xl sm:text-4xl md:text-5xl text-amber-400 leading-tight tracking-tight';
    heroSubtitleClass = 'text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-sans font-semibold';
    servicesSectionClass = 'py-16 px-6 md:px-12 max-w-6xl mx-auto space-y-10 bg-slate-950';
    serviceCardClass = 'bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-amber-400/35 transition-all flex flex-col justify-between';
    serviceCardTitleClass = 'font-display font-bold text-white text-sm md:text-base';
    serviceCardDescClass = 'text-slate-400 text-xs leading-relaxed font-sans';
    aboutSectionClass = 'bg-slate-900/60 border-y border-slate-800 py-16 px-6 md:px-12';
    aboutTitleClass = 'font-display font-bold text-2xl md:text-3xl text-white leading-tight';
    aboutTextClass = 'text-slate-400 text-xs md:text-sm leading-relaxed max-w-xl font-sans';
    guaranteeCardClass = 'bg-slate-950 border border-slate-800 p-6 rounded-2xl text-center space-y-4';
    faqSectionClass = 'py-16 px-6 md:px-12 max-w-4xl mx-auto space-y-10 bg-slate-950';
    faqCardClass = 'bg-slate-900 border border-slate-800 p-5 rounded-2xl flex gap-4';
    formSectionClass = 'py-16 px-6 md:px-12 bg-slate-900 border-t border-slate-800';
    formContainerClass = 'max-w-xl mx-auto bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl';
    footerClass = 'bg-black text-slate-500 py-12 px-6 md:px-12 border-t border-slate-900 font-sans';
  } else if (categoryVibe === 'thermal') {
    canvasBgClass = 'bg-slate-50 text-slate-800';
    headerBgClass = 'bg-white border-b border-slate-200 text-slate-900';
    headerLogoBg = '#3B82F6';
    headerLogoText = 'text-white';
    badgeStyle = { color: '#2563EB', borderColor: '#3B82F630', backgroundColor: '#3B82F60A' };
    heroSectionClass = 'relative overflow-hidden py-16 md:py-24 bg-gradient-to-b from-blue-50/50 to-white px-6 md:px-12 text-center text-slate-800';
    heroTitleClass = 'font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-blue-600 leading-tight tracking-tight';
    heroSubtitleClass = 'text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-sans font-medium';
    servicesSectionClass = 'py-16 px-6 md:px-12 max-w-6xl mx-auto space-y-10 bg-white';
    serviceCardClass = 'bg-white border border-slate-100 p-5 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between';
    serviceCardTitleClass = 'font-display font-bold text-slate-900 text-sm md:text-base';
    serviceCardDescClass = 'text-slate-500 text-xs leading-relaxed font-sans';
    aboutSectionClass = 'bg-slate-100/50 border-y border-slate-200 py-16 px-6 md:px-12';
    aboutTitleClass = 'font-display font-bold text-2xl md:text-3xl text-slate-900 leading-tight';
    aboutTextClass = 'text-slate-600 text-xs md:text-sm leading-relaxed max-w-xl font-sans';
    guaranteeCardClass = 'bg-white border border-slate-200 p-6 rounded-2xl text-center space-y-4';
    faqSectionClass = 'py-16 px-6 md:px-12 max-w-4xl mx-auto space-y-10 bg-white';
    faqCardClass = 'bg-white border border-slate-100 p-5 rounded-2xl flex gap-4';
    formSectionClass = 'py-16 px-6 md:px-12 bg-slate-50 border-t border-slate-200';
    formContainerClass = 'max-w-xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl';
    footerClass = 'bg-slate-900 text-slate-400 py-12 px-6 md:px-12 border-t border-slate-800 font-sans';
  } else if (categoryVibe === 'warm') {
    canvasBgClass = 'bg-[#FAF6F0] text-[#3D2C1E]';
    headerBgClass = 'bg-[#FAF6F0] border-b border-[#E6DCCF] text-[#3D2C1E]';
    headerLogoBg = '#D97706';
    headerLogoText = 'text-white';
    badgeStyle = { color: '#B45309', borderColor: '#E6DCCF', backgroundColor: '#FFFBEB' };
    heroSectionClass = 'relative overflow-hidden py-16 md:py-24 bg-gradient-to-b from-[#F3EADF] to-[#FAF6F0] px-6 md:px-12 text-center text-[#3D2C1E]';
    heroTitleClass = 'font-serif font-black text-3xl sm:text-4xl md:text-5xl text-[#78350F] leading-tight tracking-tight';
    heroSubtitleClass = 'text-[#5C422C] text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-sans font-medium';
    servicesSectionClass = 'py-16 px-6 md:px-12 max-w-6xl mx-auto space-y-10 bg-[#FAF6F0]';
    serviceCardClass = 'bg-white border border-[#E6DCCF] p-5 rounded-2xl hover:border-amber-600 hover:shadow-md transition-all flex flex-col justify-between';
    serviceCardTitleClass = 'font-display font-bold text-[#78350F] text-sm md:text-base';
    serviceCardDescClass = 'text-[#5C422C] text-xs leading-relaxed font-sans';
    aboutSectionClass = 'bg-[#F3EADF]/40 border-y border-[#E6DCCF] py-16 px-6 md:px-12';
    aboutTitleClass = 'font-serif font-bold text-2xl md:text-3xl text-[#5C422C] leading-tight';
    aboutTextClass = 'text-[#5C422C] text-xs md:text-sm leading-relaxed max-w-xl font-sans';
    guaranteeCardClass = 'bg-white border border-[#E6DCCF] p-6 rounded-2xl text-center space-y-4';
    faqSectionClass = 'py-16 px-6 md:px-12 max-w-4xl mx-auto space-y-10 bg-[#FAF6F0]';
    faqCardClass = 'bg-white border border-[#E6DCCF] p-5 rounded-2xl flex gap-4';
    formSectionClass = 'py-16 px-6 md:px-12 bg-[#F3EADF]/30 border-t border-[#E6DCCF]';
    formContainerClass = 'max-w-xl mx-auto bg-white border border-[#E6DCCF] rounded-3xl p-6 md:p-8 shadow-xl';
    footerClass = 'bg-[#3D2C1E] text-amber-200/60 py-12 px-6 md:px-12 border-t border-[#271B10] font-sans';
  }

  return (
    <div className={`h-full flex ${standalone ? 'flex-col' : 'flex-row'} bg-[#030307]`}>
      
      {/* Visual Customize Panel (Left) */}
      {showConfig && !standalone && (
        <div className="w-80 bg-[#0D0D12] border-r border-slate-800/50 p-5 overflow-y-auto space-y-6 shrink-0 h-full backdrop-blur-md">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-800/50">
            <SlidersHorizontal className="w-4.5 h-4.5 text-blue-400" />
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">AI Design Customizer</h3>
          </div>

          {/* Color Palettes */}
          <div className="space-y-2.5">
            <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider font-display">Brand Accent Color</label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setBrandColor(c.hex)}
                  className={`h-8 rounded-lg relative flex items-center justify-center border transition-all ${
                    brandColor === c.hex ? 'border-white scale-105 shadow-md' : 'border-transparent hover:scale-102'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {brandColor === c.hex && (
                    <Check className="w-4 h-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Core Copywriting Text Editor */}
          <div className="space-y-4">
            <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider font-display block">Copywriting Editor</label>
            
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">Hero Heading</span>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full bg-[#030307] border border-slate-800/50 focus:border-blue-500/50 rounded-lg px-3 py-2 text-xs text-white outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">Hero Subtitle</span>
              <textarea
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                rows={3}
                className="w-full bg-[#030307] border border-slate-800/50 focus:border-blue-500/50 rounded-lg px-3 py-2 text-xs text-white outline-none resize-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">About Us copy</span>
              <textarea
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                rows={4}
                className="w-full bg-[#030307] border border-slate-800/50 focus:border-blue-500/50 rounded-lg px-3 py-2 text-xs text-white outline-none resize-none transition-colors"
              />
            </div>
          </div>

          {/* Save & Apply Controls */}
          <div className="pt-4 border-t border-slate-800/50">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-2.5 px-4 rounded-xl text-white font-semibold text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
            >
              {isSaving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Applying Changes...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-300" />
                  <span>Demo Updated!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Brand Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Website Frame Canvas (Right) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-950/40">
        
        {/* Device view switcher bar */}
        {!standalone && (
          <div className="bg-[#0D0D12] border-b border-slate-800/50 p-3 flex items-center justify-between shrink-0 backdrop-blur-sm z-10">
            <div className="flex items-center gap-1.5 bg-[#030307] p-0.5 rounded-xl border border-slate-800/50 text-slate-400">
              <button
                onClick={() => setDevice('desktop')}
                className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                  device === 'desktop' ? 'bg-[#0D0D12] text-white shadow-md' : 'hover:text-gray-200'
                }`}
                title="Desktop View"
              >
                <Laptop className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDevice('tablet')}
                className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                  device === 'tablet' ? 'bg-[#0D0D12] text-white shadow-md' : 'hover:text-gray-200'
                }`}
                title="Tablet View"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDevice('mobile')}
                className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                  device === 'mobile' ? 'bg-[#0D0D12] text-white shadow-md' : 'hover:text-gray-200'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-400 font-mono uppercase bg-[#030307] px-2.5 py-1 rounded-full border border-slate-800/50">
                Mode: {device.toUpperCase()} Viewport
              </span>
              <button
                onClick={() => setShowConfig(!showConfig)}
                className="text-[10px] bg-[#0D0D12] border border-slate-800/50 hover:bg-slate-800 text-slate-300 font-semibold px-3 py-1.5 rounded-lg transition-all"
              >
                {showConfig ? 'Hide Editor' : 'Show Editor'}
              </button>
            </div>
          </div>
        )}

        {/* Live Mock Website Output Frame */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center items-start scrollbar-thin">
          <div
            className={`shadow-2xl rounded-2xl overflow-hidden border border-gray-200/60 transition-all duration-300 w-full ${canvasBgClass} ${
              device === 'mobile'
                ? 'max-w-[375px] min-h-[667px]'
                : device === 'tablet'
                ? 'max-w-[768px] min-h-[900px]'
                : 'max-w-full min-h-[1000px]'
            }`}
          >
            {/* HTML WEBSITE HEADER */}
            <header className={`${headerBgClass} px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-md transition-colors`}>
              <div className="flex items-center gap-2">
                <div 
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm transition-all ${headerLogoText}`}
                  style={{ backgroundColor: headerLogoBg }}
                >
                  {businessName.slice(0, 1).toUpperCase()}
                </div>
                <span className="font-display font-extrabold tracking-tight text-sm md:text-base">{businessName}</span>
              </div>
              
              <a
                href={`tel:${demoSite.contactPhone}`}
                className="hidden sm:flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full border border-gray-300/40 hover:bg-white/10 transition-colors"
                style={{ color: brandColor }}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{demoSite.contactPhone}</span>
              </a>
            </header>

            {/* HERO SECTION */}
            <section className={`${heroSectionClass}`}>
              {/* background vector accent */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r opacity-[0.06] blur-3xl pointer-events-none rounded-full" style={{ backgroundImage: `radial-gradient(circle, ${brandColor} 0%, transparent 80%)` }} />
              
              <div className="max-w-3xl mx-auto space-y-6 relative z-10">
                <span className="text-[10px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full border shadow-sm inline-flex items-center gap-1.5" style={badgeStyle}>
                  {categoryVibe === 'industrial' ? <Wrench className="w-3 h-3 text-amber-500" /> : <Sparkles className="w-3 h-3" />}
                  <span>{badgeText}</span>
                </span>
                
                <h1 className={`${heroTitleClass}`}>
                  {heroTitle}
                </h1>
                
                <p className={`${heroSubtitleClass}`}>
                  {heroSubtitle}
                </p>

                <div className="pt-4 flex flex-col sm:flex-row gap-3.5 justify-center max-w-md mx-auto">
                  <a
                    href={`tel:${demoSite.contactPhone}`}
                    className="px-6 py-3 rounded-full bg-white text-gray-900 font-black text-sm flex items-center justify-center gap-2 shadow-xl hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98] transition-all border border-gray-200"
                  >
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span>{demoSite.contactPhone}</span>
                  </a>
                  <a
                    href="#quote"
                    className="px-6 py-3 rounded-full text-white font-bold text-sm text-center shadow-lg hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: brandColor, boxShadow: `0 4px 15px ${brandColor}40` }}
                  >
                    <span>Instant Quote</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Trust bullets bar */}
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-6 text-xs font-semibold opacity-90">
                  {trustPoints.map((pt, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SERVICES GRID */}
            <section className={`${servicesSectionClass}`}>
              <div className="text-center space-y-2">
                <span className="text-[10px] font-bold tracking-widest uppercase opacity-60 block font-mono">
                  {servicesSectionTag}
                </span>
                <h2 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight">Our Professional Services</h2>
                <p className="opacity-75 text-xs md:text-sm max-w-lg mx-auto">We bring high craft and guaranteed parts to every single residential and commercial booking.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {demoSite.services.map((srv, index) => (
                  <div key={index} className={`${serviceCardClass}`}>
                    <div className="space-y-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm" style={{ backgroundColor: brandColor }}>
                        {getServiceIcon(index)}
                      </div>
                      <h4 className={`${serviceCardTitleClass}`}>{srv}</h4>
                      <p className={`${serviceCardDescClass}`}>
                        Fully tailored, professional solution including safe diagnostics, premium materials, certified workmanship, and comprehensive cleanup.
                      </p>
                    </div>
                    <a href="#quote" className="text-xs font-bold mt-4 block hover:underline" style={{ color: brandColor }}>
                      Request Service &rarr;
                    </a>
                  </div>
                ))}
              </div>
            </section>

            {/* ABOUT US FEATURE */}
            <section className={`${aboutSectionClass}`}>
              <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono px-2.5 py-1 bg-white/10 rounded border border-gray-200/10" style={{ color: brandColor }}>
                    Who We Are
                  </span>
                  <h3 className={`${aboutTitleClass}`}>
                    Dedicated to Integrity &amp; Quality Since Day One
                  </h3>
                  <p className={`${aboutTextClass}`}>
                    {aboutText}
                  </p>
                  <p className={`${aboutTextClass}`}>
                    We know that booking professional local services can be stressful. That's why we emphasize upfront written pricing, clean boots on your rugs, and fully licensed technicians who show up on schedule.
                  </p>
                </div>
                
                {/* Visual mock image/map placeholder */}
                <div className={`${guaranteeCardClass}`}>
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto text-green-500 border border-green-500/20">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-sm">Our Local Guarantee</h4>
                  <p className="text-xs opacity-75 max-w-xs mx-auto leading-normal font-medium">
                    We stand 100% behind our workmanship. If you are not satisfied with our work, we return to fix it at zero extra cost to you.
                  </p>
                </div>
              </div>
            </section>

            {/* FAQ ACCORDION */}
            <section className={`${faqSectionClass}`}>
              <div className="text-center space-y-2">
                <h2 className="text-2xl md:text-3xl font-display font-bold">Frequently Asked Questions</h2>
                <p className="opacity-70 text-xs md:text-sm">Got questions? We have transparent answers.</p>
              </div>

              <div className="space-y-4">
                {demoSite.faqs.map((faq, idx) => (
                  <div key={idx} className={`${faqCardClass}`}>
                    <HelpCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: brandColor }} />
                    <div className="space-y-1.5 font-sans">
                      <h4 className="font-bold text-sm">{faq.question}</h4>
                      <p className="opacity-75 text-xs leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* QUOTE LEAD CAPTURE FORM */}
            <section id="quote" className={`${formSectionClass}`}>
              <div className={`${formContainerClass}`}>
                <div className="text-center space-y-2 mb-6">
                  <h3 className="text-xl font-display font-extrabold">Request a Free Consult</h3>
                  <p className="text-xs opacity-70">Enter details below to receive a zero-obligation callback consultation.</p>
                </div>

                {leadSubmitted ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500 border border-green-500/20">
                      <Check className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm">Request Submitted Successfully!</h4>
                      <p className="text-xs opacity-70">We will call you back within 15 minutes.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="space-y-4">
                    <div className="space-y-1 font-sans">
                      <label className="text-[10px] opacity-70 font-bold uppercase tracking-wider block">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        className="w-full bg-black/10 border border-gray-300/25 focus:border-blue-500 rounded-xl px-3 py-2.5 text-xs outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1 font-sans">
                      <label className="text-[10px] opacity-70 font-bold uppercase tracking-wider block">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="(555) 019-2834"
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        className="w-full bg-black/10 border border-gray-300/25 focus:border-blue-500 rounded-xl px-3 py-2.5 text-xs outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1 font-sans">
                      <label className="text-[10px] opacity-70 font-bold uppercase tracking-wider block">Describe your needs (Optional)</label>
                      <textarea
                        placeholder="Describe what you need help with..."
                        value={leadMsg}
                        onChange={(e) => setLeadMsg(e.target.value)}
                        rows={3}
                        className="w-full bg-black/10 border border-gray-300/25 focus:border-blue-500 rounded-xl px-3 py-2.5 text-xs outline-none resize-none transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl font-bold text-xs text-white shadow-md hover:brightness-115 hover:scale-[1.01] active:scale-[0.99] transition-all text-center mt-2 cursor-pointer"
                      style={{ backgroundColor: brandColor }}
                    >
                      Request Fast Callback
                    </button>
                  </form>
                )}
              </div>
            </section>

            {/* FOOTER */}
            <footer className={`${footerClass}`}>
              <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-gray-800/40 pb-8 mb-8">
                <div className="space-y-3">
                  <h4 className="font-display font-bold text-white text-base">{businessName}</h4>
                  <p className="text-xs leading-relaxed max-w-sm opacity-70">
                    Providing top-rated commercial and residential service directly to your local area. Call us 24/7 for fast dispatch.
                  </p>
                </div>

                <div className="space-y-3">
                  <h5 className="font-bold text-white text-xs uppercase tracking-wider">Contact Info</h5>
                  <ul className="space-y-2 text-xs opacity-70">
                    <li className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" style={{ color: brandColor }} />
                      <span>{demoSite.contactAddress}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" style={{ color: brandColor }} />
                      <span>{demoSite.contactPhone}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" style={{ color: brandColor }} />
                      <span>{demoSite.contactEmail}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] opacity-60">
                <p>&copy; {new Date().getFullYear()} {businessName}. All rights reserved.</p>
                <div className="flex gap-4">
                  <a href="#" className="hover:underline">Privacy Policy</a>
                  <a href="#" className="hover:underline">Terms of Service</a>
                </div>
              </div>
            </footer>

          </div>
        </div>
      </div>
    </div>
  );
}

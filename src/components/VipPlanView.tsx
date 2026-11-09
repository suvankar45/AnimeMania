import React, { useState } from 'react';
import { 
  Crown, 
  Sparkles, 
  Check, 
  Flame, 
  Zap, 
  Download, 
  MonitorPlay, 
  ShieldCheck, 
  CreditCard,
  Laptop,
  CheckCircle2,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SubscriptionPlan } from '../types/anime';

export const VipPlanView: React.FC = () => {
  const { user, upgradeSubscription, cancelSubscription } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [isProcessing, setIsProcessing] = useState(false);

  const currentPlan = user.subscription.plan;

  const handleUpgrade = (plan: SubscriptionPlan) => {
    setIsProcessing(true);
    setTimeout(() => {
      upgradeSubscription(plan);
      setIsProcessing(false);
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-10 animate-in fade-in duration-200">
      
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          Anime Mania Premium Membership Gateway
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
          Experience Anime as Creators Intended
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Upgrade to unlock uncompressed 4K UHD 60fps masters, offline mobile downloads, early release access, and ad-free streaming.
        </p>

        {/* Billing Switcher */}
        <div className="pt-4 flex items-center justify-center">
          <div className="bg-slate-900 p-1 rounded-2xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-gradient-to-r from-purple-600 to-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full font-mono border border-emerald-500/30">
                SAVE 25% + 1 MO FREE
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tier 1: Free Fan */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg text-slate-200">Free Fan</h3>
              {currentPlan === 'free' && (
                <span className="text-[10px] bg-slate-800 text-slate-300 font-mono font-bold px-2 py-0.5 rounded">
                  Current Tier
                </span>
              )}
            </div>

            <div>
              <span className="text-3xl font-extrabold text-white">$0</span>
              <span className="text-xs text-slate-500 ml-1">/ forever</span>
            </div>

            <p className="text-xs text-slate-400">Standard streaming with sponsor ads.</p>

            <div className="space-y-2.5 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-slate-400" />
                <span>480p SD resolution</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <X className="w-4 h-4" />
                <span>1080p FHD & 4K streams locked</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <X className="w-4 h-4" />
                <span>No offline downloads</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <X className="w-4 h-4" />
                <span>Pre-roll video advertisements</span>
              </div>
            </div>
          </div>

          <button
            disabled
            className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold cursor-default"
          >
            {currentPlan === 'free' ? 'Active Plan' : 'Free Tier'}
          </button>
        </div>

        {/* Tier 2: Pro Otaku */}
        <div className={`p-6 rounded-3xl border flex flex-col justify-between space-y-6 transition-all ${
          currentPlan === 'otaku_vip' 
            ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30' 
            : 'bg-slate-900 border-slate-800 hover:border-amber-500/40'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg text-amber-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                Pro Otaku
              </h3>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono font-bold px-2 py-0.5 rounded border border-amber-500/30">
                1080p FHD
              </span>
            </div>

            <div>
              <span className="text-3xl font-extrabold text-white">
                {billingCycle === 'monthly' ? '$7.99' : '$5.99'}
              </span>
              <span className="text-xs text-slate-400 ml-1">/ month</span>
            </div>

            <p className="text-xs text-slate-400">High bitrate 1080p 60fps streaming & offline packs.</p>

            <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-white">1080p FHD (60fps) streaming</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400" />
                <span>100% Ad-free viewing</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400" />
                <span>Up to 10 offline episode downloads</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400" />
                <span>3 Synchronized devices</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleUpgrade('otaku_vip')}
            disabled={currentPlan === 'otaku_vip' || isProcessing}
            className={`w-full py-3 rounded-2xl text-xs font-bold transition-all shadow-md ${
              currentPlan === 'otaku_vip'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
            }`}
          >
            {currentPlan === 'otaku_vip' ? 'Active Membership' : 'Upgrade to Pro Otaku'}
          </button>
        </div>

        {/* Tier 3: Kami-Sama VIP (4K HDR) */}
        <div className={`p-6 rounded-3xl border flex flex-col justify-between space-y-6 relative ${
          currentPlan === 'kami_vip'
            ? 'bg-rose-500/10 border-rose-500 ring-2 ring-rose-500/40'
            : 'bg-gradient-to-b from-rose-950/30 via-slate-900 to-slate-900 border-rose-500/40 shadow-2xl shadow-rose-500/10'
        }`}>
          <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-mono text-[10px] font-bold shadow-md flex items-center gap-1">
            <Flame className="w-3 h-3 fill-white" />
            MOST POPULAR 4K
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg text-rose-300 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-400" />
                Kami-Sama VIP
              </h3>
              <span className="text-[10px] bg-rose-500/20 text-rose-300 font-mono font-bold px-2 py-0.5 rounded border border-rose-500/30">
                4K UHD HDR
              </span>
            </div>

            <div>
              <span className="text-3xl font-extrabold text-white">
                {billingCycle === 'monthly' ? '$14.99' : '$11.99'}
              </span>
              <span className="text-xs text-slate-400 ml-1">/ month</span>
            </div>

            <p className="text-xs text-slate-300">Uncompressed 4K HDR master, unlimited downloads & early releases.</p>

            <div className="space-y-2.5 text-xs text-slate-200 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-rose-400" />
                <span className="font-bold text-white">4K UHD (2160p HDR) Master Bitrate</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-rose-400" />
                <span className="font-semibold text-emerald-300">Unlimited Offline Downloads</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-rose-400" />
                <span>48-Hour Early Access to new episodes</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-rose-400" />
                <span>6 Registered Synced Devices</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-rose-400" />
                <span>Dolby Atmos Spatial Audio</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleUpgrade('kami_vip')}
            disabled={currentPlan === 'kami_vip' || isProcessing}
            className={`w-full py-3 rounded-2xl text-xs font-bold transition-all shadow-xl ${
              currentPlan === 'kami_vip'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                : 'bg-gradient-to-r from-rose-500 via-rose-600 to-purple-600 text-white shadow-rose-500/30 hover:opacity-95'
            }`}
          >
            {currentPlan === 'kami_vip' ? 'Active Membership' : 'Upgrade to Kami-Sama 4K'}
          </button>
        </div>

      </div>

      {/* Member Perks Guarantee */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-400">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-white text-sm">Cancel Anytime</h4>
            <p className="mt-1">No contracts or hidden fees. Downgrade or pause your subscription with 1-click.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Laptop className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-white text-sm">Cross-Platform Sync</h4>
            <p className="mt-1">Watch seamlessly across iOS, Android, Smart TVs, and Windows PC with instant cloud resume.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Download className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-white text-sm">True Offline Mode</h4>
            <p className="mt-1">Download entire anime seasons onto your device storage for flights and commutes.</p>
          </div>
        </div>
      </div>

    </div>
  );
};

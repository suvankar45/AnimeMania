import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  Check, 
  Sparkles, 
  Download, 
  ShieldCheck, 
  CreditCard, 
  Zap, 
  Flame,
  ArrowRight,
  MonitorPlay
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SubscriptionPlan } from '../types/anime';

export const SubscriptionModal: React.FC = () => {
  const { 
    isSubscriptionModalOpen, 
    closeSubscriptionModal, 
    subscriptionModalReason,
    upgradeSubscription,
    user 
  } = useApp();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('kami_vip');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'crypto' | 'gpay'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isSubscriptionModalOpen) return null;

  const handleSubscribe = () => {
    setIsProcessing(true);
    setTimeout(() => {
      upgradeSubscription(selectedPlan);
      setIsProcessing(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glowing Gradient Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-400" />

        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800/80 flex items-start justify-between bg-slate-950/50">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold mb-2">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              Secure Membership Gateway
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white flex items-center gap-2">
              Unlock 4K UHD & High-Speed Downloads
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {subscriptionModalReason || 'Subscribe to access 4K/1080p high bitrate streams, offline playback, and early access releases.'}
            </p>
          </div>

          <button 
            onClick={closeSubscriptionModal}
            className="p-2 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Billing Switcher */}
          <div className="flex items-center justify-center">
            <div className="bg-slate-950 p-1 rounded-2xl border border-slate-800 flex items-center gap-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-rose-500 text-white font-semibold shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-gradient-to-r from-purple-600 to-rose-600 text-white font-semibold shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full font-mono border border-emerald-500/30">
                  SAVE 25%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Tiers Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Tier 1: Free Fan */}
            <div 
              onClick={() => setSelectedPlan('free')}
              className={`rounded-2xl p-4 border transition-all cursor-pointer relative flex flex-col justify-between ${
                selectedPlan === 'free'
                  ? 'border-slate-600 bg-slate-800/50 ring-1 ring-slate-500'
                  : 'border-slate-800/70 bg-slate-950/40 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-slate-300">Free Fan</h3>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-mono">Current</span>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-extrabold text-white">$0</span>
                  <span className="text-xs text-slate-500 ml-1">/ forever</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Standard definition streaming with ads.</p>

                <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-slate-400" />
                    <span>480p SD streaming</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <X className="w-3.5 h-3.5 text-slate-600" />
                    <span>No 1080p or 4K streams</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <X className="w-3.5 h-3.5 text-slate-600" />
                    <span>No offline downloads</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <X className="w-3.5 h-3.5 text-slate-600" />
                    <span>Pre-roll & mid-roll ads</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3">
                <span className="text-xs text-slate-500 text-center block">Default Free Access</span>
              </div>
            </div>

            {/* Tier 2: Pro Otaku (1080p FHD) */}
            <div 
              onClick={() => setSelectedPlan('otaku_vip')}
              className={`rounded-2xl p-4 border transition-all cursor-pointer relative flex flex-col justify-between ${
                selectedPlan === 'otaku_vip'
                  ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/40 shadow-lg shadow-amber-500/10'
                  : 'border-slate-800/80 bg-slate-950/60 hover:border-amber-500/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-amber-300 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Pro Otaku
                  </h3>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    1080p FHD
                  </span>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-extrabold text-white">
                    {billingCycle === 'monthly' ? '$7.99' : '$5.99'}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">/ month</span>
                </div>
                <p className="text-xs text-slate-300 mt-2">Crisp 1080p 60fps streaming & offline packs.</p>

                <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-semibold text-white">1080p FHD 60fps</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ad-free streaming</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                    <span>Up to 10 offline downloads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                    <span>3 Registered synced devices</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3">
                <button
                  type="button"
                  className={`w-full py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedPlan === 'otaku_vip'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {selectedPlan === 'otaku_vip' ? 'Selected Tier' : 'Choose Otaku'}
                </button>
              </div>
            </div>

            {/* Tier 3: Kami-Sama VIP (4K UHD) - Highlighted */}
            <div 
              onClick={() => setSelectedPlan('kami_vip')}
              className={`rounded-2xl p-4 border transition-all cursor-pointer relative flex flex-col justify-between ${
                selectedPlan === 'kami_vip'
                  ? 'border-rose-500 bg-gradient-to-b from-rose-500/15 via-purple-500/10 to-slate-900 ring-2 ring-rose-500/50 shadow-xl shadow-rose-500/20'
                  : 'border-slate-800/80 bg-slate-950/60 hover:border-rose-500/40'
              }`}
            >
              {/* Badge */}
              <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-mono text-[10px] font-bold shadow-md flex items-center gap-1">
                <Flame className="w-3 h-3 fill-white" />
                ULTIMATE 4K
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-rose-300 flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-400" />
                    Kami-Sama VIP
                  </h3>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    4K HDR
                  </span>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-extrabold text-white">
                    {billingCycle === 'monthly' ? '$14.99' : '$11.99'}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">/ month</span>
                </div>
                <p className="text-xs text-slate-300 mt-2">Maximum visual fidelity, 4K downloads & early releases.</p>

                <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-rose-400" />
                    <span className="font-bold text-white">4K UHD (2160p HDR) Master</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-rose-400" />
                    <span className="font-medium text-emerald-300">Unlimited Offline Downloads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-rose-400" />
                    <span>48h Early Creator Releases</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-rose-400" />
                    <span>6 Synced Multi-Devices</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-rose-400" />
                    <span>Dolby Atmos Spatial Audio</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3">
                <button
                  type="button"
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                    selectedPlan === 'kami_vip'
                      ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-rose-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {selectedPlan === 'kami_vip' ? 'Selected Plan' : 'Choose Kami VIP'}
                </button>
              </div>
            </div>
          </div>

          {/* Payment & Security Section */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Instant Activation Payment Method
            </h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-rose-500 bg-rose-500/10 text-white'
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-rose-400" />
                <span>Credit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('paypal')}
                className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'paypal'
                    ? 'border-rose-500 bg-rose-500/10 text-white'
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="font-bold text-sky-400">PayPal</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('gpay')}
                className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'gpay'
                    ? 'border-rose-500 bg-rose-500/10 text-white'
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>Google Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('crypto')}
                className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'crypto'
                    ? 'border-rose-500 bg-rose-500/10 text-white'
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="font-mono text-amber-400">Crypto / Web3</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-900 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>256-bit SSL Encrypted • Cancel anytime with 1 click</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-slate-500">Auto-renewal optional</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer CTA */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left w-full sm:w-auto">
            <span className="text-xs text-slate-400">Total Due Today:</span>
            <div className="text-lg font-bold text-white flex items-baseline gap-1">
              <span>{selectedPlan === 'kami_vip' ? (billingCycle === 'monthly' ? '$14.99' : '$143.88') : selectedPlan === 'otaku_vip' ? (billingCycle === 'monthly' ? '$7.99' : '$71.88') : '$0'}</span>
              <span className="text-xs text-slate-400 font-normal">
                {billingCycle === 'annual' ? '/ billed annually' : '/ billed monthly'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={closeSubscriptionModal}
              className="px-4 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-300 text-xs font-medium transition-colors"
            >
              Maybe Later
            </button>

            <button
              type="button"
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-purple-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-rose-500/25 hover:opacity-95 transition-all transform active:scale-95"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Activating VIP Pass...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Activate Membership & Unlock 4K</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

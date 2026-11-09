import React, { useState } from 'react';
import { 
  Play, 
  Crown, 
  Search, 
  Download, 
  Bookmark, 
  Compass, 
  Sparkles, 
  Bell, 
  ShieldCheck, 
  Laptop, 
  Smartphone, 
  CheckCircle2, 
  RefreshCw, 
  Menu, 
  X,
  Radio,
  Tv
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { 
    user, 
    isAdmin, 
    setIsAdmin, 
    activeView, 
    setActiveView, 
    openSubscriptionModal,
    setIsSearchOpen,
    setIsAiAdvisorOpen,
    offlineEpisodes,
    syncedDevices,
    syncAllDevices,
    isSyncing,
    notifications,
    markNotificationAsRead,
    isOfflineMode,
    setIsOfflineMode
  } = useApp();

  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read).length;
  const isVip = user.subscription.plan !== 'free';

  return (
    <nav className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setActiveView('home')} 
            className="flex items-center gap-2 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 via-purple-600 to-cyan-500 p-[2px] transition-transform group-hover:scale-105 duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Play className="w-5 h-5 text-rose-500 fill-rose-500 ml-0.5" />
              </div>
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                Anime Mania
                <span className="text-xs px-1.5 py-0.5 rounded font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  4K
                </span>
              </span>
              <p className="text-[10px] text-slate-400 -mt-1 tracking-wider uppercase font-medium">Stream & Creator Hub</p>
            </div>
          </button>

          {/* Primary Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => setActiveView('home')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeView === 'home' 
                  ? 'bg-rose-500/15 text-rose-400 font-semibold border border-rose-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Tv className="w-4 h-4" />
              Home
            </button>

            <button
              onClick={() => setActiveView('browse')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeView === 'browse' 
                  ? 'bg-rose-500/15 text-rose-400 font-semibold border border-rose-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Compass className="w-4 h-4" />
              Browse
            </button>

            <button
              onClick={() => setActiveView('watchlist')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeView === 'watchlist' 
                  ? 'bg-rose-500/15 text-rose-400 font-semibold border border-rose-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              Watchlist
              {user.watchlist.length > 0 && (
                <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded-full font-mono">
                  {user.watchlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveView('downloads')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeView === 'downloads' 
                  ? 'bg-rose-500/15 text-rose-400 font-semibold border border-rose-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Download className="w-4 h-4" />
              Offline
              {offlineEpisodes.length > 0 && (
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded-full font-mono">
                  {offlineEpisodes.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveView('vip')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeView === 'vip' 
                  ? 'bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30' 
                  : 'text-amber-300/80 hover:text-amber-300 hover:bg-amber-500/10'
              }`}
            >
              <Crown className="w-4 h-4 text-amber-400" />
              VIP Pass
            </button>

            {/* Admin Section: Upload Series & Episodes */}
            <button
              onClick={() => {
                setIsAdmin(true);
                setActiveView('admin');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeView === 'admin' 
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-500/30 ring-1 ring-purple-400' 
                  : 'bg-purple-950/40 text-purple-300 hover:text-white hover:bg-purple-900/50 border border-purple-500/30'
              }`}
              title="Admin Section: Upload Series in Full or Episode Wise"
            >
              <ShieldCheck className="w-4 h-4 text-purple-300" />
              <span>Admin Studio</span>
              <span className="text-[10px] bg-rose-500 text-white font-mono font-bold px-1.5 py-0.2 rounded">
                UPLOAD
              </span>
            </button>
          </div>
        </div>

        {/* Right Controls: Search, AI Advisor, Offline Toggle, Notifs, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-xl px-3 py-1.5 text-xs transition-colors"
            title="Search Anime & Episodes"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Search anime...</span>
            <kbd className="hidden lg:inline text-[10px] bg-slate-800 border border-slate-700 text-slate-400 rounded px-1.5 py-0.5 font-mono">⌘K</kbd>
          </button>

          {/* AI Anime Advisor Trigger */}
          <button
            onClick={() => setIsAiAdvisorOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600/20 to-rose-600/20 hover:from-purple-600/30 hover:to-rose-600/30 border border-purple-500/40 text-purple-300 hover:text-white rounded-xl px-2.5 sm:px-3 py-1.5 text-xs font-medium transition-all"
            title="Ask AI Anime Recommender"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">AI Advisor</span>
          </button>

          {/* Simulated Offline Mode Toggle */}
          <button
            onClick={() => setIsOfflineMode(!isOfflineMode)}
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-mono transition-colors border ${
              isOfflineMode
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Simulated Offline Mode"
          >
            <Radio className={`w-3 h-3 ${isOfflineMode ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
            <span>{isOfflineMode ? 'Offline Test' : 'Online'}</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
              className="relative p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Release & Cloud Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotifs}
                </span>
              )}
            </button>

            {/* Dropdown Menu */}
            {isNotifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-rose-500" />
                    <h3 className="font-semibold text-sm text-white">Broadcast & Release Alerts</h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {unreadNotifs} unread
                  </span>
                </div>

                <div className="mt-2 divide-y divide-slate-800/60 max-h-72 overflow-y-auto pr-1">
                  {notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`py-2.5 px-2 rounded-lg cursor-pointer transition-colors ${
                        !n.read ? 'bg-slate-800/40 hover:bg-slate-800/80' : 'hover:bg-slate-800/30 opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-xs text-rose-300">{n.title}</span>
                        <span className="text-[10px] text-slate-500">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-3 mt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Auto-Email Release Alerts</span>
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Active
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* User Profile / VIP Gateway Status */}
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
            >
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-7 h-7 rounded-full object-cover ring-2 ring-slate-800"
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-200 leading-none">{user.name}</p>
                <p className={`text-[10px] font-mono leading-none mt-1 font-bold ${
                  user.subscription.plan === 'kami_vip' 
                    ? 'text-cyan-400' 
                    : user.subscription.plan === 'otaku_vip' 
                    ? 'text-amber-400' 
                    : 'text-slate-400'
                }`}>
                  {user.subscription.plan === 'kami_vip' ? '4K KAMI VIP' : user.subscription.plan === 'otaku_vip' ? '1080p OTAKU' : 'FREE FAN'}
                </p>
              </div>
            </button>

            {/* Profile Popover */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                  <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-rose-500" />
                  <div>
                    <h4 className="font-semibold text-sm text-white flex items-center gap-1">
                      {user.name}
                      {isVip && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                    </h4>
                    <p className="text-xs text-slate-400">{user.email}</p>
                    <span className={`inline-block text-[10px] font-mono font-bold mt-1 px-2 py-0.5 rounded-full ${
                      user.subscription.plan === 'kami_vip'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : user.subscription.plan === 'otaku_vip'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {user.subscription.plan === 'kami_vip' ? 'Kami-Sama VIP (4K HDR)' : user.subscription.plan === 'otaku_vip' ? 'Pro Otaku (1080p)' : 'Free Tier'}
                    </span>
                  </div>
                </div>

                {/* Subscription Action Button */}
                <div className="py-3 border-b border-slate-800">
                  {!isVip ? (
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        openSubscriptionModal('Upgrade to VIP for 4K streaming and high-speed downloads.');
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-500/20 hover:opacity-95"
                    >
                      <Crown className="w-3.5 h-3.5 text-amber-300" />
                      Upgrade to VIP (4K & Downloads)
                    </button>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span>VIP Member Status</span>
                      <span className="text-emerald-400 font-medium">Active (Renews 2027)</span>
                    </div>
                  )}
                </div>

                {/* Cloud Sync Devices Section */}
                <div className="py-3 border-b border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 font-medium">Cloud Synced Devices ({syncedDevices.length})</span>
                    <button
                      onClick={syncAllDevices}
                      disabled={isSyncing}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono text-[11px]"
                    >
                      <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                      {isSyncing ? 'Syncing...' : 'Sync Now'}
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {syncedDevices.map(d => (
                      <div key={d.id} className="flex items-center justify-between text-[11px] text-slate-300 bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/80">
                        <div className="flex items-center gap-1.5 truncate">
                          {d.type === 'desktop' ? <Laptop className="w-3 h-3 text-slate-400" /> : <Smartphone className="w-3 h-3 text-slate-400" />}
                          <span className="truncate">{d.name}</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-mono">{d.isCurrent ? 'Current' : 'Synced'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Creator / Admin Mode Toggle */}
                <div className="pt-3 flex items-center justify-between">
                  <div className="text-xs">
                    <p className="font-medium text-slate-300">Creator Mode</p>
                    <p className="text-[10px] text-slate-500">Video Upload & Dispatch</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsAdmin(!isAdmin);
                      if (!isAdmin) setActiveView('admin');
                    }}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                      isAdmin ? 'bg-purple-600' : 'bg-slate-700'
                    }`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      isAdmin ? 'translate-x-5' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden pt-4 pb-2 border-t border-slate-800 mt-3 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <button
              onClick={() => { setActiveView('home'); setIsMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-left font-medium flex items-center gap-2 ${
                activeView === 'home' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-900 text-slate-300'
              }`}
            >
              <Tv className="w-4 h-4" /> Home
            </button>
            <button
              onClick={() => { setActiveView('browse'); setIsMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-left font-medium flex items-center gap-2 ${
                activeView === 'browse' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-900 text-slate-300'
              }`}
            >
              <Compass className="w-4 h-4" /> Browse
            </button>
            <button
              onClick={() => { setActiveView('watchlist'); setIsMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-left font-medium flex items-center gap-2 ${
                activeView === 'watchlist' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-900 text-slate-300'
              }`}
            >
              <Bookmark className="w-4 h-4" /> Watchlist
            </button>
            <button
              onClick={() => { setActiveView('downloads'); setIsMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-left font-medium flex items-center gap-2 ${
                activeView === 'downloads' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-900 text-slate-300'
              }`}
            >
              <Download className="w-4 h-4" /> Offline
            </button>
            <button
              onClick={() => { setActiveView('vip'); setIsMobileMenuOpen(false); }}
              className="p-2.5 rounded-xl text-left font-medium flex items-center gap-2 bg-amber-500/10 text-amber-300 border border-amber-500/20"
            >
              <Crown className="w-4 h-4 text-amber-400" /> VIP Pass
            </button>
            <button
              onClick={() => { setIsAdmin(true); setActiveView('admin'); setIsMobileMenuOpen(false); }}
              className="p-2.5 rounded-xl text-left font-bold flex items-center gap-2 bg-purple-600 text-white shadow-md"
            >
              <ShieldCheck className="w-4 h-4 text-purple-200" /> Admin Studio (Upload)
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

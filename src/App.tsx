import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { AnimeCard } from './components/AnimeCard';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { SeriesDetailModal } from './components/SeriesDetailModal';
import { SearchAndFilterModal } from './components/SearchAndFilterModal';
import { AIAnimeAdvisorModal } from './components/AIAnimeAdvisorModal';
import { AdminStudio } from './components/AdminStudio';
import { BrowseView } from './components/BrowseView';
import { VipPlanView } from './components/VipPlanView';
import { PersonalizedDashboard } from './components/PersonalizedDashboard';
import { 
  Play, 
  Crown, 
  Sparkles, 
  Flame, 
  Tv, 
  Download, 
  Radio, 
  ShieldCheck, 
  Heart,
  ExternalLink
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { 
    seriesList, 
    activeView, 
    setActiveView,
    selectedSeriesDetail,
    openSeriesDetail,
    currentEpisode,
    isSubscriptionModalOpen,
    isSearchOpen,
    isAiAdvisorOpen,
    isOfflineMode,
    setIsOfflineMode,
    openSubscriptionModal,
    user
  } = useApp();

  const featuredSeries = seriesList[0] || null;
  const trendingSeries = seriesList.filter(s => s.isTrending);
  const actionSeries = seriesList.filter(s => s.genres.includes('Action') || s.genres.includes('Cyberpunk'));
  const fantasySeries = seriesList.filter(s => s.genres.includes('Dark Fantasy') || s.genres.includes('Fantasy') || s.genres.includes('Supernatural'));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      
      {/* Offline Mode Warning Banner */}
      {isOfflineMode && (
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs font-semibold px-4 py-2 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>
              Simulated Offline Mode Active — Testing offline playback using locally stored anime video cache.
            </span>
            <button
              onClick={() => setIsOfflineMode(false)}
              className="ml-auto underline hover:text-amber-200 text-xs font-mono"
            >
              Go Online
            </button>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar />

      {/* Dynamic View Router */}
      <main className="flex-1 pb-16">
        
        {/* VIEW 1: HOME VIEW */}
        {activeView === 'home' && (
          <div className="space-y-12 animate-in fade-in duration-200">
            
            {/* Featured Hero Showcase */}
            {featuredSeries && <HeroBanner series={featuredSeries} />}

            {/* Quick Action Category Ribbon */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8">
              <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                    4K
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-white">Anime Mania Ultra-Bitrate Hub</h4>
                    <p className="text-xs text-slate-400">Next-gen AV1 streaming with instant skip-intro & 60fps HDR</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveView('browse')}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                  >
                    Browse Catalog
                  </button>

                  {user.subscription.plan === 'free' && (
                    <button
                      onClick={() => openSubscriptionModal('Upgrade to VIP to unlock full 4K and ad-free downloads.')}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-xs font-bold text-white flex items-center gap-1.5 shadow-md shadow-rose-500/20"
                    >
                      <Crown className="w-3.5 h-3.5 text-amber-300" />
                      <span>Unlock 4K VIP</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Section 1: Trending Now in 4K */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-rose-500 fill-rose-500" />
                  <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                    Trending This Season
                  </h2>
                </div>
                <button
                  onClick={() => setActiveView('browse')}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold font-mono"
                >
                  View All →
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {trendingSeries.map(series => (
                  <AnimeCard key={series.id} series={series} />
                ))}
              </div>
            </div>

            {/* Section 2: Cyberpunk & High-Speed Sci-Fi */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                    Cyberpunk & Sci-Fi Masters
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-mono">Uncompressed 60fps</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {actionSeries.map(series => (
                  <AnimeCard key={series.id} series={series} />
                ))}
              </div>
            </div>

            {/* Section 3: Dark Fantasy & Supernatural Monarchs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                    Dark Fantasy & Monarch Realms
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-mono">Dual Audio Sub & Dub</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {fantasySeries.map(series => (
                  <AnimeCard key={series.id} series={series} />
                ))}
              </div>
            </div>

            {/* Personalized Dashboard Preview on Home */}
            <PersonalizedDashboard />

          </div>
        )}

        {/* VIEW 2: BROWSE CATALOG */}
        {activeView === 'browse' && <BrowseView />}

        {/* VIEW 3: WATCHLIST */}
        {activeView === 'watchlist' && (
          <div className="pt-4">
            <PersonalizedDashboard />
          </div>
        )}

        {/* VIEW 4: OFFLINE DOWNLOADS */}
        {activeView === 'downloads' && (
          <div className="pt-4">
            <PersonalizedDashboard />
          </div>
        )}

        {/* VIEW 5: VIP MEMBERSHIP GATEWAY */}
        {activeView === 'vip' && <VipPlanView />}

        {/* VIEW 6: CREATOR & ADMIN STUDIO */}
        {activeView === 'admin' && <AdminStudio />}

        {/* VIEW 7: SERIES DETAIL VIEW */}
        {activeView === 'series-detail' && selectedSeriesDetail && (
          <SeriesDetailModal 
            series={selectedSeriesDetail} 
            onClose={() => setActiveView('home')} 
          />
        )}

      </main>

      {/* Global Modals */}
      {currentEpisode && <VideoPlayerModal />}
      {isSubscriptionModalOpen && <SubscriptionModal />}
      {isSearchOpen && <SearchAndFilterModal />}
      {isAiAdvisorOpen && <AIAnimeAdvisorModal />}

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-10 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center text-white">
              <Play className="w-4 h-4 fill-white ml-0.5" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-white text-sm">Anime Mania</span>
              <p className="text-[11px] text-slate-400">High-Fidelity Anime Streaming & Creator Studio</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
            <button onClick={() => setActiveView('home')} className="hover:text-white transition-colors">Home</button>
            <button onClick={() => setActiveView('browse')} className="hover:text-white transition-colors">Browse 4K</button>
            <button onClick={() => setActiveView('vip')} className="hover:text-amber-400 transition-colors">VIP Membership</button>
            <button onClick={() => setActiveView('admin')} className="hover:text-purple-400 transition-colors">Creator Upload Studio</button>
            <button onClick={() => openSubscriptionModal()} className="hover:text-rose-400 transition-colors">Download Terms</button>
          </div>

          <div className="text-right text-[11px] font-mono">
            <p className="text-slate-400">AV1 / H.265 Transcoded Engine • 4K HDR</p>
            <p className="text-slate-600 mt-0.5">© 2026 Anime Mania. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

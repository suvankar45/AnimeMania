import React from 'react';
import { 
  Play, 
  Bookmark, 
  Check, 
  Info, 
  Star, 
  Crown, 
  Sparkles,
  Flame,
  Volume2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AnimeSeries } from '../types/anime';

interface HeroBannerProps {
  series: AnimeSeries;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ series }) => {
  const { 
    playEpisode, 
    toggleWatchlist, 
    isInWatchlist, 
    openSeriesDetail, 
    openSubscriptionModal,
    user 
  } = useApp();

  const inWatchlist = isInWatchlist(series.id);
  const firstEpisode = series.episodes[0];

  const handlePlay = () => {
    if (firstEpisode) {
      playEpisode(series, firstEpisode);
    } else {
      openSeriesDetail(series);
    }
  };

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] max-h-[680px] overflow-hidden select-none">
      
      {/* Background Image with Cinematic Gradients */}
      <div className="absolute inset-0">
        <img
          src={series.bannerImage || series.coverImage}
          alt={series.title}
          className="w-full h-full object-cover object-center filter brightness-[0.8] scale-105 transform animate-pulse-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent w-full md:w-3/4" />
      </div>

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-8 flex flex-col justify-end pb-12 sm:pb-16 z-10">
        
        <div className="max-w-2xl space-y-4">
          
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              #1 TRENDING THIS WEEK
            </span>

            <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold">
              4K UHD HDR
            </span>

            <span className="px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 text-slate-300 text-xs font-mono">
              {series.studio}
            </span>
          </div>

          {/* Titles */}
          <div>
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight drop-shadow-md">
              {series.title}
            </h1>
            <p className="text-sm sm:text-base text-rose-400 font-medium italic mt-1 font-mono">
              {series.romajiTitle}
            </p>
          </div>

          {/* Metadata Row: Rating, Year, Status, Audio */}
          <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{series.rating}</span>
            </div>
            <span>•</span>
            <span>{series.releaseYear}</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">{series.status}</span>
            <span>•</span>
            <span>{series.episodesCount} Episodes</span>
            <span>•</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-xs">
              {series.audioOptions.join(' / ')}
            </span>
          </div>

          {/* Synopsis */}
          <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed drop-shadow">
            {series.synopsis}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handlePlay}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-bold text-sm flex items-center gap-2 shadow-xl shadow-rose-500/25 transition-all transform hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Watch Episode 1</span>
            </button>

            <button
              onClick={() => toggleWatchlist(series.id)}
              className={`px-4 py-3 rounded-2xl border text-sm font-semibold flex items-center gap-2 transition-all ${
                inWatchlist
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 text-slate-200'
              }`}
            >
              {inWatchlist ? <Check className="w-4 h-4 text-rose-400" /> : <Bookmark className="w-4 h-4" />}
              <span>{inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
            </button>

            <button
              onClick={() => openSeriesDetail(series)}
              className="px-4 py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              <Info className="w-4 h-4" />
              <span>Series Details</span>
            </button>

            {user.subscription.plan === 'free' && (
              <button
                onClick={() => openSubscriptionModal('Unlock 4K streaming and high-speed downloads for all episodes.')}
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/20 transition-all"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>4K VIP Stream Available</span>
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

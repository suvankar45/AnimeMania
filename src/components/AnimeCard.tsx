import React from 'react';
import { 
  Play, 
  Bookmark, 
  Check, 
  Star, 
  Crown, 
  Flame,
  Download
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AnimeSeries } from '../types/anime';

interface AnimeCardProps {
  series: AnimeSeries;
  aspect?: 'portrait' | 'landscape';
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ series, aspect = 'portrait' }) => {
  const { 
    playEpisode, 
    toggleWatchlist, 
    isInWatchlist, 
    openSeriesDetail, 
    user 
  } = useApp();

  const inWatchlist = isInWatchlist(series.id);
  const firstEpisode = series.episodes[0];

  const handlePlayFirst = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (firstEpisode) {
      playEpisode(series, firstEpisode);
    } else {
      openSeriesDetail(series);
    }
  };

  const handleToggleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWatchlist(series.id);
  };

  return (
    <div 
      onClick={() => openSeriesDetail(series)}
      className="group relative flex flex-col cursor-pointer select-none"
    >
      {/* Thumbnail Container */}
      <div className={`relative w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 group-hover:border-rose-500/50 transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-rose-500/10 ${
        aspect === 'portrait' ? 'aspect-[3/4]' : 'aspect-video'
      }`}>
        <img
          src={aspect === 'portrait' ? series.coverImage : series.bannerImage || series.coverImage}
          alt={series.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono font-bold bg-slate-950/80 backdrop-blur-md text-white border border-slate-700/80 px-2 py-0.5 rounded-md">
              4K UHD
            </span>
            {series.isTrending && (
              <span className="text-[10px] font-mono font-bold bg-rose-500/80 backdrop-blur-md text-white px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <Flame className="w-2.5 h-2.5 fill-white" />
                HYPE
              </span>
            )}
          </div>

          <button
            onClick={handleToggleWatchlist}
            className={`p-1.5 rounded-lg backdrop-blur-md border transition-colors ${
              inWatchlist
                ? 'bg-rose-500 border-rose-400 text-white'
                : 'bg-slate-950/70 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
            title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            {inWatchlist ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Hover Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handlePlayFirst}
            className="w-12 h-12 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-all duration-300"
          >
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </button>
        </div>

        {/* Bottom Metadata inside thumbnail */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-slate-300 font-mono">
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{series.rating}</span>
          </div>
          <span className="text-slate-400 bg-slate-950/70 px-1.5 py-0.2 rounded">
            {series.episodesCount} EPS
          </span>
        </div>
      </div>

      {/* Title & Details below card */}
      <div className="mt-2.5 space-y-0.5">
        <h3 className="font-heading font-bold text-xs sm:text-sm text-white truncate group-hover:text-rose-400 transition-colors">
          {series.title}
        </h3>
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="truncate">{series.genres.slice(0, 2).join(' • ')}</span>
          <span className="font-mono text-[10px] text-slate-500 shrink-0">{series.releaseYear}</span>
        </div>
      </div>

    </div>
  );
};

import React from 'react';
import { 
  X, 
  Play, 
  Bookmark, 
  Check, 
  Star, 
  Crown, 
  Download, 
  Share2, 
  CheckCircle2, 
  Flame,
  Clock,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AnimeSeries, Episode } from '../types/anime';

interface SeriesDetailModalProps {
  series: AnimeSeries;
  onClose: () => void;
}

export const SeriesDetailModal: React.FC<SeriesDetailModalProps> = ({ series, onClose }) => {
  const { 
    playEpisode, 
    toggleWatchlist, 
    isInWatchlist, 
    openSubscriptionModal, 
    downloadEpisode, 
    isEpisodeDownloaded,
    watchProgress,
    user 
  } = useApp();

  const inWatchlist = isInWatchlist(series.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner Header with Close button */}
        <div className="relative h-64 sm:h-80 w-full shrink-0">
          <img 
            src={series.bannerImage || series.coverImage} 
            alt={series.title}
            className="w-full h-full object-cover object-center" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-700 transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Banner bottom title and badges */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 z-10">
            <div className="space-y-2 max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold bg-rose-500/80 backdrop-blur-md text-white px-2 py-0.5 rounded">
                  4K UHD
                </span>
                <span className="text-xs font-mono text-slate-300 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-slate-700">
                  {series.studio}
                </span>
                <span className="text-xs font-mono text-emerald-400 bg-slate-950/80 px-2 py-0.5 rounded">
                  {series.status}
                </span>
              </div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white drop-shadow-md">
                {series.title}
              </h2>
              <p className="text-xs sm:text-sm text-rose-300 font-mono italic">
                {series.romajiTitle}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (series.episodes[0]) {
                    playEpisode(series, series.episodes[0]);
                    onClose();
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-500/25 transition-transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Play Ep 1</span>
              </button>

              <button
                onClick={() => toggleWatchlist(series.id)}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  inWatchlist
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                    : 'bg-slate-950/80 hover:bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                {inWatchlist ? <Check className="w-4 h-4 text-rose-400" /> : <Bookmark className="w-4 h-4" />}
                <span className="hidden sm:inline">{inWatchlist ? 'Saved' : 'Watchlist'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable details and episodes list */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Metadata & Genres */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div>
              <span className="text-slate-500 block">Rating:</span>
              <span className="text-amber-400 font-bold flex items-center gap-1 text-sm mt-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {series.rating} / 5.0
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Release Season:</span>
              <span className="text-slate-200 font-medium text-sm mt-0.5">{series.season} {series.releaseYear}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Available Audio:</span>
              <span className="text-slate-200 font-medium text-sm mt-0.5">{series.audioOptions.join(' & ')}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Episodes:</span>
              <span className="text-slate-200 font-medium text-sm mt-0.5">{series.episodesCount} Episodes</span>
            </div>
          </div>

          {/* Synopsis */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Synopsis</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{series.synopsis}</p>
          </div>

          {/* Genres pills */}
          <div className="flex flex-wrap gap-1.5">
            {series.genres.map(g => (
              <span key={g} className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium">
                {g}
              </span>
            ))}
          </div>

          {/* Episode List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-white">
                All Episodes ({series.episodes.length})
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Stream in 4K UHD or 1080p FHD</span>
            </div>

            <div className="space-y-2.5">
              {series.episodes.map(ep => {
                const epKey = `${series.id}_${ep.id}`;
                const progress = watchProgress[epKey];
                const isDownloaded = isEpisodeDownloaded(ep.id);

                return (
                  <div
                    key={ep.id}
                    className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="relative w-28 h-18 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                        <img src={ep.thumbnail || series.coverImage} alt={ep.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <button
                            onClick={() => {
                              playEpisode(series, ep);
                              onClose();
                            }}
                            className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                          >
                            <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                          </button>
                        </div>
                        {progress && (
                          <div className="absolute bottom-0 inset-x-0 h-1 bg-slate-800">
                            <div 
                              className="h-full bg-rose-500" 
                              style={{ width: `${Math.min(100, (progress.timestamp / progress.duration) * 100)}%` }} 
                            />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                          Episode {ep.episodeNumber}: {ep.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{ep.synopsis}</p>
                        <div className="flex items-center gap-2.5 mt-1 text-[11px] text-slate-500 font-mono">
                          <span>{Math.round(ep.duration / 60)} mins</span>
                          <span>•</span>
                          <span>{ep.releaseDate}</span>
                          <span>•</span>
                          <span className="text-rose-400">4K HDR Available</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions: Stream & Download */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => {
                          const success = downloadEpisode(series, ep, '1080p');
                        }}
                        className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                          isDownloaded
                            ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                            : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
                        }`}
                        title="Download for Offline Viewing"
                      >
                        {isDownloaded ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
                        <span className="text-[11px]">{isDownloaded ? 'Downloaded' : 'Download'}</span>
                      </button>

                      <button
                        onClick={() => {
                          playEpisode(series, ep);
                          onClose();
                        }}
                        className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Stream</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

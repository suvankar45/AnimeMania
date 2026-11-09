import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Star, 
  Crown, 
  Flame, 
  Play,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AnimeSeries } from '../types/anime';

export const SearchAndFilterModal: React.FC = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    seriesList, 
    openSeriesDetail,
    playEpisode 
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedAudio, setSelectedAudio] = useState<'All' | 'Sub' | 'Dub'>('All');
  const [sortBy, setSortBy] = useState<'rating' | 'newest' | 'title'>('rating');
  const [onlyVip, setOnlyVip] = useState(false);

  // All unique genres from current catalog
  const allGenres = useMemo(() => {
    const set = new Set<string>();
    seriesList.forEach(s => s.genres.forEach(g => set.add(g)));
    return ['All', ...Array.from(set)];
  }, [seriesList]);

  // Filtered and sorted anime
  const filteredResults = useMemo(() => {
    return seriesList.filter(s => {
      // Query match (title, romaji, synopsis, studio)
      const q = query.toLowerCase();
      const matchesQuery = !query.trim() || 
        s.title.toLowerCase().includes(q) || 
        s.romajiTitle.toLowerCase().includes(q) || 
        s.synopsis.toLowerCase().includes(q) ||
        s.studio.toLowerCase().includes(q);

      // Genre match
      const matchesGenre = selectedGenre === 'All' || s.genres.includes(selectedGenre);

      // Audio match
      const matchesAudio = selectedAudio === 'All' || s.audioOptions.includes(selectedAudio);

      return matchesQuery && matchesGenre && matchesAudio;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return b.releaseYear - a.releaseYear;
      return a.title.localeCompare(b.title);
    });
  }, [seriesList, query, selectedGenre, selectedAudio, sortBy]);

  if (!isSearchOpen) return null;

  const resetFilters = () => {
    setQuery('');
    setSelectedGenre('All');
    setSelectedAudio('All');
    setSortBy('rating');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 sm:pt-20 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center gap-3 bg-slate-950">
          <Search className="w-5 h-5 text-rose-500 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anime by title, studio, keywords (e.g. Cyberpunk, Shadow, Demon)..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 space-y-3">
          
          {/* Genre Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {allGenres.map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1 rounded-xl whitespace-nowrap transition-all ${
                  selectedGenre === genre
                    ? 'bg-rose-500 text-white font-bold shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Sub/Dub & Sort Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-400">Audio:</span>
              {(['All', 'Sub', 'Dub'] as const).map(audio => (
                <button
                  key={audio}
                  onClick={() => setSelectedAudio(audio)}
                  className={`px-2.5 py-0.5 rounded-lg border font-mono transition-colors ${
                    selectedAudio === audio 
                      ? 'border-purple-500 text-purple-300 bg-purple-500/10' 
                      : 'border-slate-800 text-slate-400'
                  }`}
                >
                  {audio}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-2 py-0.5 font-mono"
                >
                  <option value="rating">Top Rated (Stars)</option>
                  <option value="newest">Release Year</option>
                  <option value="title">Alphabetical (A-Z)</option>
                </select>
              </div>

              <button
                onClick={resetFilters}
                className="text-slate-500 hover:text-slate-300 flex items-center gap-1 font-mono text-[11px]"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>
          </div>

        </div>

        {/* Results List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>{filteredResults.length} Anime matches found</span>
            <span>4K HDR Ready</span>
          </div>

          {filteredResults.length > 0 ? (
            <div className="space-y-2.5">
              {filteredResults.map(series => (
                <div
                  key={series.id}
                  onClick={() => {
                    openSeriesDetail(series);
                    setIsSearchOpen(false);
                  }}
                  className="p-3 rounded-2xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-4 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img 
                      src={series.coverImage} 
                      alt={series.title} 
                      className="w-14 h-18 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform" 
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading font-bold text-sm text-white truncate group-hover:text-rose-400 transition-colors">
                          {series.title}
                        </h4>
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.2 rounded border border-cyan-500/30">
                          4K
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 italic font-mono truncate">{series.romajiTitle}</p>
                      <div className="flex items-center gap-2.5 mt-1 text-[11px] text-slate-400">
                        <span className="text-amber-400 font-bold flex items-center gap-0.5">
                          ⭐ {series.rating}
                        </span>
                        <span>•</span>
                        <span>{series.episodesCount} Episodes</span>
                        <span>•</span>
                        <span className="truncate">{series.genres.slice(0, 2).join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (series.episodes[0]) {
                          playEpisode(series, series.episodes[0]);
                          setIsSearchOpen(false);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Watch</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <p className="text-sm">No anime matches found for "{query}".</p>
              <p className="text-xs text-slate-500">Try searching for "Cyberpunk", "Monarch", or clear filters.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

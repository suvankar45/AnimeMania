import React, { useState } from 'react';
import { 
  Compass, 
  Flame, 
  Star, 
  SlidersHorizontal, 
  Search, 
  Filter,
  Sparkles,
  Crown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AnimeCard } from './AnimeCard';

export const BrowseView: React.FC = () => {
  const { seriesList, selectedGenre, setSelectedGenre } = useApp();
  const [filterAudio, setFilterAudio] = useState<'All' | 'Sub' | 'Dub'>('All');
  const [searchFilter, setSearchFilter] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'newest'>('rating');

  const genres = ['All', 'Action', 'Cyberpunk', 'Dark Fantasy', 'Sci-Fi', 'Romance', 'Mecha', 'Supernatural'];

  const filteredSeries = seriesList.filter(s => {
    const matchesGenre = selectedGenre === 'All' || s.genres.includes(selectedGenre);
    const matchesAudio = filterAudio === 'All' || s.audioOptions.includes(filterAudio);
    const matchesSearch = !searchFilter.trim() || 
      s.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.synopsis.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesGenre && matchesAudio && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.releaseYear - a.releaseYear;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Browse Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-rose-500" />
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              Anime Catalog & 4K Archives
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Explore {seriesList.length} master anime series with multi-bitrate streams, lossless audio, and subtitle tracks.
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter catalog..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Genre Pills & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Genre Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {genres.map(g => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all font-semibold ${
                selectedGenre === g
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Audio & Sort Controls */}
        <div className="flex items-center gap-3 text-xs shrink-0">
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {(['All', 'Sub', 'Dub'] as const).map(a => (
              <button
                key={a}
                onClick={() => setFilterAudio(a)}
                className={`px-2.5 py-1 rounded-lg font-mono transition-colors ${
                  filterAudio === a ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {a}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-2.5 py-1.5 font-mono focus:outline-none text-xs"
          >
            <option value="rating">Top Rated ⭐</option>
            <option value="newest">Release Year 📅</option>
          </select>
        </div>
      </div>

      {/* Results Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-slate-400 font-mono">
            Showing {filteredSeries.length} Anime Series
          </span>
          <span className="text-xs text-cyan-400 font-mono">
            All available in 4K UHD & 1080p FHD
          </span>
        </div>

        {filteredSeries.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {filteredSeries.map(series => (
              <AnimeCard key={series.id} series={series} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 text-slate-400">
            <p className="text-sm font-semibold">No anime series found for "{selectedGenre}" genre.</p>
            <button
              onClick={() => { setSelectedGenre('All'); setSearchFilter(''); }}
              className="mt-3 text-xs text-rose-400 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

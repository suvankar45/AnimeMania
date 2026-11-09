import React, { useState } from 'react';
import { X, Check, Copy, Share2, MessageCircle } from 'lucide-react';
import { AnimeSeries, Episode } from '../types/anime';

interface SocialShareModalProps {
  series: AnimeSeries;
  episode: Episode;
  currentTimestamp: number;
  onClose: () => void;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  series,
  episode,
  currentTimestamp,
  onClose
}) => {
  const [includeTimestamp, setIncludeTimestamp] = useState(true);
  const [copied, setCopied] = useState(false);

  const mins = Math.floor(currentTimestamp / 60);
  const secs = currentTimestamp % 60;
  const timeFormatted = `${mins}m${secs}s`;

  const shareUrl = `${window.location.origin}/?anime=${series.id}&ep=${episode.episodeNumber}${includeTimestamp && currentTimestamp > 0 ? `&t=${currentTimestamp}` : ''}`;
  const shareText = `Streaming ${series.title} - Episode ${episode.episodeNumber} "${episode.title}" on Anime Mania! 🔥`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleShareWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
    window.open(waUrl, '_blank');
  };

  const handleShareReddit = () => {
    const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`;
    window.open(redditUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-rose-500" />
            <h3 className="font-heading font-bold text-white text-base">Share with Otaku Friends</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Anime Preview Card */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
          <img src={episode.thumbnail || series.coverImage} alt={series.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
          <div className="min-w-0">
            <h4 className="font-bold text-xs text-white truncate">{series.title}</h4>
            <p className="text-[11px] text-slate-400 truncate">Episode {episode.episodeNumber}: {episode.title}</p>
            {includeTimestamp && currentTimestamp > 0 && (
              <span className="text-[10px] text-rose-400 font-mono">Timestamp: {timeFormatted}</span>
            )}
          </div>
        </div>

        {/* Timestamp checkbox */}
        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={includeTimestamp}
            onChange={(e) => setIncludeTimestamp(e.target.checked)}
            className="rounded bg-slate-800 border-slate-700 accent-rose-500"
          />
          <span>Include current timestamp ({timeFormatted})</span>
        </label>

        {/* Share buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleShareTwitter}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 flex flex-col items-center justify-center gap-1 transition-colors"
          >
            <span className="font-bold text-sm">𝕏</span>
            <span>Twitter/X</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 flex flex-col items-center justify-center gap-1 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleShareReddit}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 flex flex-col items-center justify-center gap-1 transition-colors"
          >
            <span className="font-bold text-orange-400">r/</span>
            <span>Reddit</span>
          </button>
        </div>

        {/* Copy Link Input */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-950 border border-slate-800">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="bg-transparent text-xs text-slate-300 px-2 flex-1 focus:outline-none truncate font-mono"
          />
          <button
            onClick={copyToClipboard}
            className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

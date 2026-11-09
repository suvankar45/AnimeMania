import React, { useState } from 'react';
import { 
  Upload, 
  Film, 
  Mail, 
  Send, 
  CheckCircle2, 
  FileVideo, 
  Plus, 
  Settings2, 
  BarChart3, 
  ShieldCheck, 
  Crown, 
  Sparkles,
  Users,
  HardDrive,
  Eye,
  AlertCircle,
  Trash2,
  Layers,
  FolderPlus,
  Play,
  Check,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QualityTier, StreamQuality, Episode, AnimeSeries } from '../types/anime';
import { SAMPLE_VIDEO_STREAMS } from '../data/mockData';

export const AdminStudio: React.FC = () => {
  const { 
    seriesList, 
    uploadAdminEpisode, 
    uploadAdminSeries, 
    uploadFullSeriesWithEpisodes,
    deleteAdminSeries,
    deleteAdminEpisode,
    sentEmails, 
    dispatchReleaseEmail,
    playEpisode
  } = useApp();

  // Mode switcher: 'full-series' | 'episode-wise' | 'catalog' | 'emails' | 'analytics'
  const [activeAdminTab, setActiveAdminTab] = useState<'full-series' | 'episode-wise' | 'catalog' | 'emails' | 'analytics'>('full-series');

  // Success Notification
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 5000);
  };

  /* =========================================================================
     TAB 1: UPLOAD SERIES IN FULL (BATCH COMPLETE SERIES UPLOADER)
     ========================================================================= */
  const [fullTitle, setFullTitle] = useState('');
  const [fullRomaji, setFullRomaji] = useState('');
  const [fullStudio, setFullStudio] = useState('Ufotable & Mappa Tech');
  const [fullSynopsis, setFullSynopsis] = useState('');
  const [fullGenres, setFullGenres] = useState('Action, Dark Fantasy, Supernatural');
  const [fullCoverImage, setFullCoverImage] = useState('https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80');
  const [fullBannerImage, setFullBannerImage] = useState('https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1600&q=80');
  const [fullYear, setFullYear] = useState(2026);
  const [fullSeason, setFullSeason] = useState<'Spring' | 'Summer' | 'Fall' | 'Winter'>('Fall');
  const [fullStatus, setFullStatus] = useState<'Airing' | 'Completed'>('Completed');
  const [fullAudioSub, setFullAudioSub] = useState(true);
  const [fullAudioDub, setFullAudioDub] = useState(true);
  const [fullIsVipExclusive, setFullIsVipExclusive] = useState(false);

  // Episodes for the full series upload
  interface BatchEpisodeDraft {
    episodeNumber: number;
    title: string;
    synopsis: string;
    durationMinutes: number;
    fileName?: string;
    videoUrl: string;
    introStart: number;
    introEnd: number;
    isVipOnly: boolean;
  }

  const [batchEpisodes, setBatchEpisodes] = useState<BatchEpisodeDraft[]>([
    {
      episodeNumber: 1,
      title: 'Episode 1: Awakening of the Void',
      synopsis: 'The beginning of the grand journey as dormant powers awaken.',
      durationMinutes: 24,
      videoUrl: SAMPLE_VIDEO_STREAMS.sintel,
      introStart: 10,
      introEnd: 95,
      isVipOnly: false
    },
    {
      episodeNumber: 2,
      title: 'Episode 2: The Neon Labyrinth',
      synopsis: 'Venturing deeper into unknown territory with high-stakes combat.',
      durationMinutes: 23,
      videoUrl: SAMPLE_VIDEO_STREAMS.tearsOfSteel,
      introStart: 12,
      introEnd: 94,
      isVipOnly: false
    },
    {
      episodeNumber: 3,
      title: 'Episode 3: Climax in Crimson',
      synopsis: 'An epic showdown that pushes limits past breaking point.',
      durationMinutes: 25,
      videoUrl: SAMPLE_VIDEO_STREAMS.bunny,
      introStart: 10,
      introEnd: 92,
      isVipOnly: true
    }
  ]);

  const [isUploadingFull, setIsUploadingFull] = useState(false);
  const [fullUploadProgress, setFullUploadProgress] = useState(0);

  // Add a new episode row to the full series batch
  const handleAddBatchEpisode = () => {
    const nextNum = batchEpisodes.length + 1;
    setBatchEpisodes(prev => [
      ...prev,
      {
        episodeNumber: nextNum,
        title: `Episode ${nextNum}: The Unbroken Will`,
        synopsis: `Episode ${nextNum} filled with cinematic sequences and story revelations.`,
        durationMinutes: 24,
        videoUrl: SAMPLE_VIDEO_STREAMS.tearsOfSteel,
        introStart: 10,
        introEnd: 95,
        isVipOnly: fullIsVipExclusive
      }
    ]);
  };

  const handleRemoveBatchEpisode = (idx: number) => {
    setBatchEpisodes(prev => prev.filter((_, i) => i !== idx));
  };

  // Multi-file drag & drop handler for full series upload
  const handleBatchFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newDrafts: BatchEpisodeDraft[] = Array.from(files).map((file, idx) => {
        const epNum = idx + 1;
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        const blobUrl = URL.createObjectURL(file);

        return {
          episodeNumber: epNum,
          title: `Episode ${epNum}: ${cleanName}`,
          synopsis: `Full episode master uploaded from file: ${file.name}`,
          durationMinutes: 24,
          fileName: file.name,
          videoUrl: blobUrl,
          introStart: 10,
          introEnd: 95,
          isVipOnly: fullIsVipExclusive
        };
      });

      setBatchEpisodes(newDrafts);
      showToast(`Imported ${files.length} video files for complete series upload!`);
    }
  };

  const handleFullSeriesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullTitle.trim()) return;

    setIsUploadingFull(true);
    setFullUploadProgress(10);

    const interval = setInterval(() => {
      setFullUploadProgress(p => (p >= 90 ? 90 : p + 20));
    }, 250);

    setTimeout(() => {
      clearInterval(interval);
      setFullUploadProgress(100);

      const episodesToUpload: Partial<Episode>[] = batchEpisodes.map(ep => ({
        episodeNumber: ep.episodeNumber,
        title: ep.title,
        synopsis: ep.synopsis,
        duration: ep.durationMinutes * 60,
        introStart: ep.introStart,
        introEnd: ep.introEnd,
        isVipOnly: ep.isVipOnly || fullIsVipExclusive,
        streams: {
          '4k': {
            resolution: '4K UHD (2160p HDR)',
            qualityKey: '4k',
            url: ep.videoUrl,
            fileSize: '1.95 GB',
            bitrate: '18.5 Mbps',
            isVipRequired: true
          },
          '1080p': {
            resolution: '1080p FHD (60fps)',
            qualityKey: '1080p',
            url: ep.videoUrl,
            fileSize: '680 MB',
            bitrate: '6.4 Mbps',
            isVipRequired: true
          },
          '720p': {
            resolution: '720p HD',
            qualityKey: '720p',
            url: ep.videoUrl,
            fileSize: '320 MB',
            bitrate: '3.1 Mbps',
            isVipRequired: false
          },
          '480p': {
            resolution: '480p SD',
            qualityKey: '480p',
            url: ep.videoUrl,
            fileSize: '125 MB',
            bitrate: '1.2 Mbps',
            isVipRequired: false
          }
        }
      }));

      const audioOpts: ('Sub' | 'Dub')[] = [];
      if (fullAudioSub) audioOpts.push('Sub');
      if (fullAudioDub) audioOpts.push('Dub');

      uploadFullSeriesWithEpisodes(
        {
          title: fullTitle,
          romajiTitle: fullRomaji || fullTitle,
          studio: fullStudio,
          synopsis: fullSynopsis || 'A thrilling new anime series on Anime Mania.',
          genres: fullGenres.split(',').map(g => g.trim()),
          coverImage: fullCoverImage,
          bannerImage: fullBannerImage || fullCoverImage,
          releaseYear: Number(fullYear),
          season: fullSeason,
          status: fullStatus,
          audioOptions: audioOpts.length > 0 ? audioOpts : ['Sub', 'Dub'],
          episodesCount: episodesToUpload.length
        },
        episodesToUpload
      );

      setIsUploadingFull(false);
      setFullUploadProgress(0);
      showToast(`🎉 "${fullTitle}" successfully published with ${episodesToUpload.length} episodes in 4K HDR!`);

      // Reset
      setFullTitle('');
      setFullRomaji('');
      setFullSynopsis('');
      setActiveAdminTab('catalog');
    }, 1200);
  };


  /* =========================================================================
     TAB 2: UPLOAD EPISODE-WISE (SINGLE / INCREMENTAL EPISODE UPLOAD)
     ========================================================================= */
  const [singleSeriesId, setSingleSeriesId] = useState<string>(seriesList[0]?.id || '');
  const [singleEpTitle, setSingleEpTitle] = useState('');
  const [singleEpNumber, setSingleEpNumber] = useState<number>(() => {
    const s = seriesList.find(item => item.id === singleSeriesId) || seriesList[0];
    return s ? s.episodes.length + 1 : 1;
  });
  const [singleEpSynopsis, setSingleEpSynopsis] = useState('');
  const [singleIntroStart, setSingleIntroStart] = useState(10);
  const [singleIntroEnd, setSingleIntroEnd] = useState(95);
  const [singleIsVip, setSingleIsVip] = useState(false);
  const [singleFileName, setSingleFileName] = useState<string | null>(null);
  const [singleBlobUrl, setSingleBlobUrl] = useState<string | null>(null);
  const [singleCustomUrl, setSingleCustomUrl] = useState('');
  const [isUploadingSingle, setIsUploadingSingle] = useState(false);
  const [singleProgress, setSingleProgress] = useState(0);

  // When selected series changes, auto calculate next episode number
  const handleSelectSeriesForSingle = (id: string) => {
    setSingleSeriesId(id);
    const target = seriesList.find(s => s.id === id);
    if (target) {
      setSingleEpNumber(target.episodes.length + 1);
    }
  };

  const handleSingleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSingleFileName(file.name);
      const url = URL.createObjectURL(file);
      setSingleBlobUrl(url);
    }
  };

  const handleSingleEpisodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleSeriesId) return;

    setIsUploadingSingle(true);
    setSingleProgress(15);

    const interval = setInterval(() => {
      setSingleProgress(p => (p >= 90 ? 90 : p + 25));
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setSingleProgress(100);

      const targetUrl = singleBlobUrl || singleCustomUrl || SAMPLE_VIDEO_STREAMS.tearsOfSteel;

      const newEp: Partial<Episode> = {
        title: singleEpTitle || `Episode ${singleEpNumber}`,
        episodeNumber: Number(singleEpNumber),
        synopsis: singleEpSynopsis || 'Newly uploaded anime episode with multi-resolution bitrate encoding.',
        duration: 1440,
        introStart: Number(singleIntroStart),
        introEnd: Number(singleIntroEnd),
        isVipOnly: singleIsVip,
        streams: {
          '4k': {
            resolution: '4K UHD (2160p HDR)',
            qualityKey: '4k',
            url: targetUrl,
            fileSize: '1.95 GB',
            bitrate: '18.5 Mbps',
            isVipRequired: true
          },
          '1080p': {
            resolution: '1080p FHD (60fps)',
            qualityKey: '1080p',
            url: targetUrl,
            fileSize: '680 MB',
            bitrate: '6.4 Mbps',
            isVipRequired: true
          },
          '720p': {
            resolution: '720p HD',
            qualityKey: '720p',
            url: targetUrl,
            fileSize: '320 MB',
            bitrate: '3.1 Mbps',
            isVipRequired: false
          },
          '480p': {
            resolution: '480p SD',
            qualityKey: '480p',
            url: targetUrl,
            fileSize: '125 MB',
            bitrate: '1.2 Mbps',
            isVipRequired: false
          }
        }
      };

      uploadAdminEpisode(singleSeriesId, newEp);

      setIsUploadingSingle(false);
      setSingleProgress(0);
      showToast(`Episode ${singleEpNumber} added successfully to series and email alert dispatched!`);

      // Reset
      setSingleEpTitle('');
      setSingleEpNumber(prev => prev + 1);
      setSingleEpSynopsis('');
      setSingleFileName(null);
      setSingleBlobUrl(null);
      setSingleCustomUrl('');
    }, 1100);
  };


  /* =========================================================================
     TAB 3: EMAIL BROADCASTS
     ========================================================================= */
  const [emailSeriesId, setEmailSeriesId] = useState<string>(seriesList[0]?.id || '');
  const [emailEpTitle, setEmailEpTitle] = useState('Episode 4: Battle for New Shinjuku');
  const [emailAudience, setEmailAudience] = useState<'All Subscribers' | 'VIP Members Only'>('All Subscribers');
  const [emailSubject, setEmailSubject] = useState('⚡ [New 4K Release] Cyber Valkyrie Episode 4 is LIVE!');

  const handleEmailDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    const s = seriesList.find(item => item.id === emailSeriesId);
    if (!s) return;
    dispatchReleaseEmail(s.title, emailEpTitle, emailAudience, emailSubject);
    showToast(`Broadcast email delivered to ${emailAudience === 'All Subscribers' ? '14,850' : '5,420'} subscribers!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-950 border border-purple-500/30 shadow-2xl">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </span>
            <div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white flex items-center gap-2">
                Creator & Admin Video Studio
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono font-bold border border-rose-500/40">
                  ADMIN ONLY
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Upload entire anime series in full (batch multi-episode) or add episodes incrementally.
              </p>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveAdminTab('full-series')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeAdminTab === 'full-series' 
                ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FolderPlus className="w-3.5 h-3.5 text-amber-300" />
            Upload Series in Full
          </button>

          <button
            onClick={() => setActiveAdminTab('episode-wise')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeAdminTab === 'episode-wise' 
                ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            Upload Episode-Wise
          </button>

          <button
            onClick={() => setActiveAdminTab('catalog')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeAdminTab === 'catalog' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-purple-300" />
            Manage Catalog ({seriesList.length})
          </button>

          <button
            onClick={() => setActiveAdminTab('emails')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeAdminTab === 'emails' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Email Broadcasts
          </button>

          <button
            onClick={() => setActiveAdminTab('analytics')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeAdminTab === 'analytics' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Analytics
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3 animate-in fade-in shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="font-semibold">{successToast}</p>
        </div>
      )}

      {/* =========================================================================
          MODE 1: UPLOAD SERIES IN FULL (BATCH COMPLETE SERIES UPLOADER)
          ========================================================================= */}
      {activeAdminTab === 'full-series' && (
        <form onSubmit={handleFullSeriesSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Series Information */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FolderPlus className="w-5 h-5 text-rose-500" />
                  <h2 className="font-heading font-bold text-lg text-white">Step 1: Complete Series Profile</h2>
                </div>
                <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  Full Series Ingestion
                </span>
              </div>

              {/* Series Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">English Series Title *</label>
                  <input
                    type="text"
                    required
                    value={fullTitle}
                    onChange={(e) => setFullTitle(e.target.value)}
                    placeholder="e.g. Solo Monarch: Void Dominion"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Romaji / Japanese Title</label>
                  <input
                    type="text"
                    value={fullRomaji}
                    onChange={(e) => setFullRomaji(e.target.value)}
                    placeholder="e.g. Kyokugen no Kunshu"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Studio, Year, Season, Status */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="space-y-1.5">
                  <label className="text-slate-400">Animation Studio</label>
                  <input
                    type="text"
                    value={fullStudio}
                    onChange={(e) => setFullStudio(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400">Release Year</label>
                  <input
                    type="number"
                    value={fullYear}
                    onChange={(e) => setFullYear(parseInt(e.target.value) || 2026)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400">Season</label>
                  <select
                    value={fullSeason}
                    onChange={(e) => setFullSeason(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white"
                  >
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                    <option value="Fall">Fall</option>
                    <option value="Winter">Winter</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400">Release Status</label>
                  <select
                    value={fullStatus}
                    onChange={(e) => setFullStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white"
                  >
                    <option value="Completed">Completed (Full Season)</option>
                    <option value="Airing">Airing (Simulcast)</option>
                  </select>
                </div>
              </div>

              {/* Genres & Audio Tracks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Genres (Comma-separated)</label>
                  <input
                    type="text"
                    value={fullGenres}
                    onChange={(e) => setFullGenres(e.target.value)}
                    placeholder="Action, Cyberpunk, Dark Fantasy, Shonen"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Audio Tracks</label>
                  <div className="flex items-center gap-3 pt-1">
                    <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={fullAudioSub}
                        onChange={(e) => setFullAudioSub(e.target.checked)}
                        className="rounded bg-slate-800 border-slate-700 accent-rose-500"
                      />
                      <span>Sub (JP)</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={fullAudioDub}
                        onChange={(e) => setFullAudioDub(e.target.checked)}
                        className="rounded bg-slate-800 border-slate-700 accent-rose-500"
                      />
                      <span>Dub (EN)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Synopsis */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Synopsis & Plot Overview</label>
                <textarea
                  rows={2}
                  value={fullSynopsis}
                  onChange={(e) => setFullSynopsis(e.target.value)}
                  placeholder="Enter the overarching storyline, world lore, and character arcs..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Cover & Banner URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Cover Poster URL</label>
                  <input
                    type="url"
                    value={fullCoverImage}
                    onChange={(e) => setFullCoverImage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Hero Banner Backdrop URL</label>
                  <input
                    type="url"
                    value={fullBannerImage}
                    onChange={(e) => setFullBannerImage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* VIP Gate Option for Whole Series */}
              <label className="flex items-center gap-2.5 text-xs text-amber-300 cursor-pointer p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
                <input
                  type="checkbox"
                  checked={fullIsVipExclusive}
                  onChange={(e) => {
                    setFullIsVipExclusive(e.target.checked);
                    setBatchEpisodes(prev => prev.map(ep => ({ ...ep, isVipOnly: e.target.checked })));
                  }}
                  className="rounded bg-slate-800 border-slate-700 accent-amber-500"
                />
                <span className="font-semibold">
                  Entire Series VIP Exclusive (All episodes locked for Free users; requires VIP subscription)
                </span>
              </label>
            </div>

            {/* Right Col: Visual Card Preview */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
              <span className="text-[11px] uppercase font-mono text-purple-400 font-bold">Live Series Preview</span>
              
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] border border-slate-800 bg-slate-950">
                <img src={fullBannerImage || fullCoverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 flex flex-col justify-end">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">4K UHD HDR</span>
                  <h4 className="font-bold text-base text-white truncate">{fullTitle || 'Untitled Anime Series'}</h4>
                  <p className="text-xs text-slate-300 font-mono italic">{fullRomaji || 'Romaji Title'}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">Studio:</span>
                  <span className="font-medium">{fullStudio}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">Season / Year:</span>
                  <span className="font-mono">{fullSeason} {fullYear}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">Episodes to Upload:</span>
                  <span className="font-bold text-rose-400 font-mono">{batchEpisodes.length} Episodes</span>
                </div>
              </div>
            </div>

          </div>

          {/* Step 2: Batch Episodes Ingestion */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <Film className="w-5 h-5 text-cyan-400" />
                  <h2 className="font-heading font-bold text-lg text-white">Step 2: Batch Episodes Ingestion ({batchEpisodes.length} Episodes)</h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Drag & drop multiple anime video files or configure episode streams with 4K/1080p bitrate profiles.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddBatchEpisode}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Add Episode</span>
                </button>
              </div>
            </div>

            {/* Multi-File Drag & Drop Area */}
            <div className="relative border-2 border-dashed border-slate-700 hover:border-cyan-500/80 rounded-2xl p-6 text-center bg-slate-950/60 transition-colors">
              <input
                type="file"
                multiple
                accept="video/*"
                onChange={handleBatchFilesChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">
                    Drag & Drop multiple episode videos (e.g. Ep1.mp4, Ep2.mp4, Ep3.mp4...)
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Files will automatically map to sequential episode numbers with ready-to-stream blob playback.
                  </p>
                </div>
              </div>
            </div>

            {/* Episode List Items */}
            <div className="space-y-3">
              {batchEpisodes.map((ep, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-300 font-mono font-bold text-xs flex items-center justify-center">
                        #{ep.episodeNumber}
                      </span>
                      <input
                        type="text"
                        value={ep.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBatchEpisodes(prev => prev.map((item, i) => i === idx ? { ...item, title: val } : item));
                        }}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white font-semibold focus:outline-none focus:border-rose-500 min-w-[200px]"
                      />
                      {ep.fileName && (
                        <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded">
                          📁 {ep.fileName}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-xs text-amber-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ep.isVipOnly}
                          onChange={(e) => {
                            const val = e.target.checked;
                            setBatchEpisodes(prev => prev.map((item, i) => i === idx ? { ...item, isVipOnly: val } : item));
                          }}
                          className="rounded bg-slate-800 border-slate-700 accent-amber-500"
                        />
                        <span className="text-[11px]">VIP Only</span>
                      </label>

                      {batchEpisodes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveBatchEpisode(idx)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Remove Episode"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Synopsis & Intro Skips */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={ep.synopsis}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBatchEpisodes(prev => prev.map((item, i) => i === idx ? { ...item, synopsis: val } : item));
                        }}
                        placeholder="Episode synopsis..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300"
                      />
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <span>Intro Skip:</span>
                      <input
                        type="number"
                        value={ep.introStart}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setBatchEpisodes(prev => prev.map((item, i) => i === idx ? { ...item, introStart: val } : item));
                        }}
                        className="w-12 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-white font-mono text-center"
                      />
                      <span>to</span>
                      <input
                        type="number"
                        value={ep.introEnd}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 90;
                          setBatchEpisodes(prev => prev.map((item, i) => i === idx ? { ...item, introEnd: val } : item));
                        }}
                        className="w-12 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-white font-mono text-center"
                      />
                      <span>s</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <span>Duration:</span>
                      <input
                        type="number"
                        value={ep.durationMinutes}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 24;
                          setBatchEpisodes(prev => prev.map((item, i) => i === idx ? { ...item, durationMinutes: val } : item));
                        }}
                        className="w-12 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-white font-mono text-center"
                      />
                      <span>mins</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Upload Progress */}
            {isUploadingFull && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Ingesting full series & encoding 4K/1080p profiles...</span>
                  <span>{fullUploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-400 transition-all duration-300"
                    style={{ width: `${fullUploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Big Submit Button */}
            <button
              type="submit"
              disabled={isUploadingFull || !fullTitle.trim()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-purple-600 to-cyan-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-rose-500/25 hover:opacity-95 transition-all transform active:scale-95 disabled:opacity-50"
            >
              {isUploadingFull ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Publishing Complete Series ({batchEpisodes.length} Episodes)...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-amber-300" />
                  <span>Publish Complete Series & Dispatch Release Alert ({batchEpisodes.length} Episodes)</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>

        </form>
      )}


      {/* =========================================================================
          MODE 2: UPLOAD EPISODE-WISE (SINGLE / INCREMENTAL EPISODE UPLOAD)
          ========================================================================= */}
      {activeAdminTab === 'episode-wise' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: The Single Episode Form */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-cyan-400" />
                <h2 className="font-heading font-bold text-lg text-white">Upload Episode-Wise to Existing Series</h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">Incremental Release</span>
            </div>

            <form onSubmit={handleSingleEpisodeSubmit} className="space-y-5">
              
              {/* Target Series Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Target Anime Series</label>
                <select
                  value={singleSeriesId}
                  onChange={(e) => handleSelectSeriesForSingle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {seriesList.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.episodes.length} episodes currently)
                    </option>
                  ))}
                </select>
              </div>

              {/* Title & Ep Number */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Episode Title</label>
                  <input
                    type="text"
                    required
                    value={singleEpTitle}
                    onChange={(e) => setSingleEpTitle(e.target.value)}
                    placeholder="e.g. Awakening of the Demon Monarch"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Episode #</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={singleEpNumber}
                    onChange={(e) => setSingleEpNumber(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Video File Picker or Stream URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Video Master File (Upload or Stream URL)</label>
                
                <div className="relative border-2 border-dashed border-slate-700 hover:border-cyan-500/80 rounded-2xl p-6 text-center bg-slate-950/60 transition-colors">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleSingleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center space-y-1.5">
                    <FileVideo className="w-8 h-8 text-cyan-400" />
                    {singleFileName ? (
                      <p className="text-xs font-bold text-emerald-400">Selected File: {singleFileName}</p>
                    ) : (
                      <>
                        <p className="text-xs font-semibold text-slate-200">
                          Click to select local video file or drag and drop
                        </p>
                        <p className="text-[11px] text-slate-500">Supports direct local browser streaming via blob URL</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[11px] text-slate-400">Or paste external video stream URL (MP4 / HLS):</span>
                  <input
                    type="url"
                    value={singleCustomUrl}
                    onChange={(e) => setSingleCustomUrl(e.target.value)}
                    placeholder="https://example.com/episodes/stream.mp4"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono mt-1"
                  />
                </div>
              </div>

              {/* Intro Skip Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">Opening Intro Start (Seconds)</label>
                  <input
                    type="number"
                    value={singleIntroStart}
                    onChange={(e) => setSingleIntroStart(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">Opening Intro End (Seconds)</label>
                  <input
                    type="number"
                    value={singleIntroEnd}
                    onChange={(e) => setSingleIntroEnd(parseInt(e.target.value) || 90)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Synopsis */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Episode Synopsis</label>
                <textarea
                  rows={2}
                  value={singleEpSynopsis}
                  onChange={(e) => setSingleEpSynopsis(e.target.value)}
                  placeholder="Key battle scenes, dialogue highlights, or revelations..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* VIP Gate */}
              <label className="flex items-center gap-2 text-xs text-amber-300 cursor-pointer p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <input
                  type="checkbox"
                  checked={singleIsVip}
                  onChange={(e) => setSingleIsVip(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 accent-amber-500"
                />
                <span className="font-semibold">
                  VIP Exclusive Episode (Requires active Pro Otaku or Kami-Sama VIP subscription)
                </span>
              </label>

              {/* Upload Progress Bar */}
              {isUploadingSingle && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-400 font-mono">
                    <span>Encoding multi-resolution streams (4K/1080p/720p/480p)...</span>
                    <span>{singleProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 transition-all duration-300"
                      style={{ width: `${singleProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isUploadingSingle}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-600 to-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 hover:opacity-95 transition-all"
              >
                {isUploadingSingle ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Transcoding & Uploading Episode...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Publish Episode {singleEpNumber} & Dispatch Notification</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Col: Selected Series Info & Episode History */}
          <div className="space-y-6">
            {(() => {
              const activeS = seriesList.find(s => s.id === singleSeriesId) || seriesList[0];
              if (!activeS) return null;

              return (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                  <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold">Selected Anime Series</span>
                  
                  <div className="relative rounded-2xl overflow-hidden h-36 border border-slate-800">
                    <img src={activeS.coverImage} alt={activeS.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-3 flex flex-col justify-end">
                      <h4 className="font-bold text-sm text-white">{activeS.title}</h4>
                      <p className="text-[11px] text-slate-300 font-mono">{activeS.episodes.length} episodes published</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-400">Episodes in this series:</span>
                    <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                      {activeS.episodes.map(ep => (
                        <div 
                          key={ep.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800/80 text-xs"
                        >
                          <div className="truncate pr-2">
                            <span className="font-bold text-white">Ep {ep.episodeNumber}:</span> {ep.title}
                          </div>
                          <button
                            onClick={() => playEpisode(activeS, ep)}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono shrink-0 flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3 text-cyan-400" /> Play
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

        </div>
      )}


      {/* =========================================================================
          MODE 3: MANAGE CATALOG & EPISODES
          ========================================================================= */}
      {activeAdminTab === 'catalog' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                Catalog Management & Master Archives
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Browse, test stream, or remove series and individual episodes from the platform.
              </p>
            </div>
            <button
              onClick={() => setActiveAdminTab('full-series')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Series</span>
            </button>
          </div>

          <div className="space-y-4">
            {seriesList.map(series => (
              <div 
                key={series.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-4">
                    <img 
                      src={series.coverImage} 
                      alt={series.title} 
                      className="w-16 h-20 rounded-xl object-cover shrink-0 ring-1 ring-slate-700" 
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading font-bold text-base text-white">{series.title}</h3>
                        <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                          4K UHD
                        </span>
                      </div>
                      <p className="text-xs text-rose-300 font-mono italic">{series.romajiTitle}</p>
                      <div className="flex items-center gap-2.5 mt-1 text-[11px] text-slate-400 font-mono">
                        <span>{series.studio}</span>
                        <span>•</span>
                        <span>{series.season} {series.releaseYear}</span>
                        <span>•</span>
                        <span className="text-emerald-400">{series.episodes.length} Episodes</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        handleSelectSeriesForSingle(series.id);
                        setActiveAdminTab('episode-wise');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Add Episode</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete entire series "${series.title}"?`)) {
                          deleteAdminSeries(series.id);
                          showToast(`Series "${series.title}" was deleted.`);
                        }
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete Entire Series"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Episodes inside this series */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400">Episodes List:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {series.episodes.map(ep => (
                      <div 
                        key={ep.id}
                        className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="truncate">
                          <span className="font-bold text-white">Ep {ep.episodeNumber}:</span> {ep.title}
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">{Math.round(ep.duration / 60)}m • 4K HDR</p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => playEpisode(series, ep)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-white transition-colors"
                            title="Play in Video Player"
                          >
                            <Play className="w-3 h-3 fill-white" />
                          </button>
                          
                          {series.episodes.length > 1 && (
                            <button
                              onClick={() => {
                                deleteAdminEpisode(series.id, ep.id);
                                showToast(`Deleted Episode ${ep.episodeNumber}`);
                              }}
                              className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
                              title="Delete Episode"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* =========================================================================
          MODE 4: EMAIL NOTIFICATION SYSTEM
          ========================================================================= */}
      {activeAdminTab === 'emails' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-purple-400" />
                <h2 className="font-heading font-bold text-lg text-white">Dispatch Release Notification</h2>
              </div>
              <span className="text-xs font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">SMTP Ready</span>
            </div>

            <form onSubmit={handleEmailDispatch} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Anime Series</label>
                <select
                  value={emailSeriesId}
                  onChange={(e) => setEmailSeriesId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {seriesList.map(s => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Episode Name</label>
                <input
                  type="text"
                  required
                  value={emailEpTitle}
                  onChange={(e) => setEmailEpTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email Subject Line</label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Recipient Audience</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEmailAudience('All Subscribers')}
                    className={`p-3 rounded-xl border text-xs text-left transition-all ${
                      emailAudience === 'All Subscribers'
                        ? 'bg-purple-500/20 border-purple-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <p>All Subscribers</p>
                    <span className="text-[10px] text-purple-300 font-mono">14,850 fans</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEmailAudience('VIP Members Only')}
                    className={`p-3 rounded-xl border text-xs text-left transition-all ${
                      emailAudience === 'VIP Members Only'
                        ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <p className="flex items-center gap-1">
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                      VIP Only
                    </p>
                    <span className="text-[10px] text-amber-300 font-mono">5,420 paying VIPs</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:opacity-95"
              >
                <Send className="w-4 h-4" />
                <span>Send Automated Release Newsletter</span>
              </button>
            </form>
          </div>

          {/* Email Logs */}
          <div className="space-y-4">
            <span className="text-xs font-semibold text-slate-300">Recent Broadcast Logs ({sentEmails.length})</span>
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {sentEmails.map(email => (
                <div key={email.id} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1.5 shadow">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white truncate">{email.seriesTitle}</span>
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded">
                      Sent to {email.recipientCount.toLocaleString()} ({email.recipientAudience})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-mono">{email.subject}</p>
                  <span className="text-[10px] text-slate-500 font-mono block">{email.sentAt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* =========================================================================
          MODE 5: ANALYTICS
          ========================================================================= */}
      {activeAdminTab === 'analytics' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400">Total Registered Fans</span>
            <p className="text-2xl font-extrabold text-white mt-1">20,270</p>
            <span className="text-[11px] text-emerald-400 font-mono mt-1 block">+18% this month</span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400">VIP Conversion Rate</span>
            <p className="text-2xl font-extrabold text-amber-400 mt-1">26.7%</p>
            <span className="text-[11px] text-slate-400 font-mono mt-1 block">5,420 Active VIPs</span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400">Bandwidth Managed (AV1/H265)</span>
            <p className="text-2xl font-extrabold text-cyan-400 mt-1">42.8 TB</p>
            <span className="text-[11px] text-slate-400 font-mono mt-1 block">4K: 58% • 1080p: 32%</span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400">Total Series Published</span>
            <p className="text-2xl font-extrabold text-rose-400 mt-1">{seriesList.length} Series</p>
            <span className="text-[11px] text-slate-400 font-mono mt-1 block">
              {seriesList.reduce((acc, s) => acc + s.episodes.length, 0)} Total Episodes
            </span>
          </div>
        </div>
      )}

    </div>
  );
};

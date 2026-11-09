import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  SkipForward, 
  RotateCcw, 
  Settings, 
  Download, 
  Share2, 
  X, 
  Crown, 
  MessageSquare, 
  Flame, 
  Heart, 
  EyeOff, 
  Eye, 
  Send,
  FastForward,
  CheckCircle,
  Subtitles,
  ListVideo
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QualityTier, StreamQuality } from '../types/anime';
import { SocialShareModal } from './SocialShareModal';

export const VideoPlayerModal: React.FC = () => {
  const { 
    currentEpisode, 
    currentSeries, 
    closePlayer, 
    playEpisode,
    user, 
    openSubscriptionModal,
    updateWatchProgress,
    watchProgress,
    downloadEpisode,
    isEpisodeDownloaded,
    comments,
    addComment,
    toggleCommentLike
  } = useApp();

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Quality state
  const [currentQuality, setCurrentQuality] = useState<QualityTier>('1080p');
  const [isQualityMenuOpen, setIsQualityMenuOpen] = useState(false);
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedSubtitle, setSelectedSubtitle] = useState<'off' | 'en' | 'jp' | 'romaji'>('en');

  // Sidebar Tabs inside modal
  const [activeTab, setActiveTab] = useState<'episodes' | 'comments' | 'details'>('episodes');
  const [newCommentText, setNewCommentText] = useState('');
  const [commentIsSpoiler, setCommentIsSpoiler] = useState(false);
  const [showSpoilers, setShowSpoilers] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  if (!currentEpisode || !currentSeries) return null;

  // Key for watch progress
  const progressKey = `${currentSeries.id}_${currentEpisode.id}`;
  const savedProgress = watchProgress[progressKey];

  // Pick initial stream based on user tier & available streams
  useEffect(() => {
    // If user is free, default to 480p or 720p
    if (user.subscription.plan === 'free') {
      if (currentEpisode.streams['720p']) setCurrentQuality('720p');
      else setCurrentQuality('480p');
    } else if (user.subscription.plan === 'otaku_vip') {
      if (currentEpisode.streams['1080p']) setCurrentQuality('1080p');
      else setCurrentQuality('720p');
    } else {
      // Kami VIP gets 4K default
      if (currentEpisode.streams['4k']) setCurrentQuality('4k');
      else if (currentEpisode.streams['1080p']) setCurrentQuality('1080p');
      else setCurrentQuality('720p');
    }
  }, [currentEpisode, user.subscription.plan]);

  // Restore saved timestamp
  useEffect(() => {
    if (videoRef.current && savedProgress && savedProgress.timestamp > 0) {
      videoRef.current.currentTime = savedProgress.timestamp;
      setCurrentTime(savedProgress.timestamp);
    }
  }, [currentEpisode.id]);

  // Handle stream source URL
  const activeStream: StreamQuality | undefined = 
    currentEpisode.streams[currentQuality] || 
    currentEpisode.streams['720p'] || 
    currentEpisode.streams['480p'];

  const videoSrc = activeStream?.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';

  // Quality change handler with VIP Gatekeeper
  const handleQualitySelect = (tier: QualityTier) => {
    const stream = currentEpisode.streams[tier];
    if (!stream) return;

    if (stream.isVipRequired && user.subscription.plan === 'free') {
      openSubscriptionModal(`Switching to ${stream.resolution} requires Pro Otaku or Kami-Sama VIP.`);
      setIsQualityMenuOpen(false);
      return;
    }

    if (tier === '4k' && user.subscription.plan === 'otaku_vip') {
      openSubscriptionModal(`4K UHD Master resolution is exclusive to Kami-Sama VIP members.`);
      setIsQualityMenuOpen(false);
      return;
    }

    // Preserve current playback time
    const prevTime = videoRef.current?.currentTime || currentTime;
    setCurrentQuality(tier);
    setIsQualityMenuOpen(false);

    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = prevTime;
        if (isPlaying) videoRef.current.play().catch(() => {});
      }
    }, 100);
  };

  // Skip Intro (85s)
  const handleSkipIntro = () => {
    if (videoRef.current) {
      const targetTime = currentEpisode.introEnd || (currentTime + 85);
      videoRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  // Video Events
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    setCurrentTime(time);

    // Throttle progress save
    if (Math.floor(time) % 5 === 0) {
      updateWatchProgress(
        currentSeries.id, 
        currentEpisode.id, 
        time, 
        videoRef.current.duration || currentEpisode.duration,
        currentQuality
      );
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || currentEpisode.duration);
      if (isPlaying) {
        videoRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (videoRef.current) {
      videoRef.current.volume = val;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.volume = volume || 0.5;
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const handleSpeedSelect = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) videoRef.current.playbackRate = speed;
    setIsSpeedMenuOpen(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  // Download Action
  const handleDownload = () => {
    const success = downloadEpisode(currentSeries, currentEpisode, currentQuality);
    if (success) {
      setDownloadSuccessToast(`Downloaded in ${currentQuality.toUpperCase()}! Available offline.`);
      setTimeout(() => setDownloadSuccessToast(null), 3500);
    }
  };

  // Next Episode logic
  const currentEpIndex = currentSeries.episodes.findIndex(e => e.id === currentEpisode.id);
  const nextEpisode = currentEpIndex !== -1 && currentEpIndex < currentSeries.episodes.length - 1
    ? currentSeries.episodes[currentEpIndex + 1]
    : null;

  const handleNextEpisode = () => {
    if (nextEpisode) {
      playEpisode(currentSeries, nextEpisode);
    }
  };

  // Comment submission
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    addComment(currentEpisode.id, newCommentText, commentIsSpoiler);
    setNewCommentText('');
    setCommentIsSpoiler(false);
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isIntroRange = currentTime >= (currentEpisode.introStart || 0) && currentTime <= (currentEpisode.introEnd || 95);
  const episodeComments = comments[currentEpisode.id] || [];
  const isDownloaded = isEpisodeDownloaded(currentEpisode.id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col overflow-hidden animate-in fade-in duration-200">
      
      {/* Top Bar with Title, Episode Info & Exit */}
      <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <button 
            onClick={closePlayer} 
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-white transition-colors"
            title="Exit Player"
          >
            <X className="w-4 h-4" />
          </button>

          <div>
            <span className="font-bold text-white text-sm sm:text-base mr-2">{currentSeries.title}</span>
            <span className="text-slate-400 font-medium">
              Episode {currentEpisode.episodeNumber}: {currentEpisode.title}
            </span>
          </div>

          {/* Quality Indicator Badge */}
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
            currentQuality === '4k' 
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
              : currentQuality === '1080p'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-slate-800 text-slate-400'
          }`}>
            {currentQuality.toUpperCase()} {activeStream?.bitrate}
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          {/* Download button */}
          <button
            onClick={handleDownload}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-medium transition-all ${
              isDownloaded
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
            title="Download Episode Offline"
          >
            {isDownloaded ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isDownloaded ? 'Downloaded' : 'Download'}</span>
          </button>

          {/* Share button */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="p-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {user.subscription.plan === 'free' && (
            <button
              onClick={() => openSubscriptionModal('Upgrade to VIP to remove ads and unlock 4K HDR streams.')}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold flex items-center gap-1 shadow-md shadow-rose-500/20"
            >
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>Unlock 4K VIP</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area: Video Viewport + Side Panel */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Left: Video Player Container */}
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="flex-1 bg-black relative flex items-center justify-center select-none overflow-hidden group"
        >
          {/* HTML5 Video Element */}
          <video
            ref={videoRef}
            src={videoSrc}
            poster={currentEpisode.thumbnail || currentSeries.bannerImage}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleNextEpisode}
            onClick={togglePlay}
            playsInline
            className="w-full h-full max-h-[85vh] object-contain"
          />

          {/* Simulated Anime Subtitles Overlay */}
          {selectedSubtitle !== 'off' && (
            <div className="absolute bottom-16 sm:bottom-20 left-1/2 transform -translate-x-1/2 text-center pointer-events-none px-4 z-20">
              <span className="px-3 py-1 rounded bg-black/75 text-amber-300 font-semibold text-sm sm:text-base md:text-lg tracking-wide drop-shadow-md border border-black/40">
                {selectedSubtitle === 'jp' 
                  ? '「この運命は、私たちが自ら切り拓く！」'
                  : selectedSubtitle === 'romaji'
                  ? 'Kono unmei wa, watashitachi ga mizukara kirihiraku!'
                  : '"This destiny is ours to forge with our own blades!"'}
              </span>
            </div>
          )}

          {/* Skip Intro Button (Appears during anime OP interval) */}
          {isIntroRange && (
            <button
              onClick={handleSkipIntro}
              className="absolute bottom-20 left-6 z-30 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-rose-600 text-white font-semibold text-xs flex items-center gap-2 border border-slate-700 shadow-2xl transition-all hover:scale-105"
            >
              <FastForward className="w-4 h-4 text-amber-400" />
              <span>Skip Intro (85s)</span>
            </button>
          )}

          {/* Watermark for Free Tier */}
          {user.subscription.plan === 'free' && (
            <div className="absolute top-4 right-4 z-20 pointer-events-none opacity-40 text-right">
              <span className="text-[11px] font-mono font-bold tracking-wider text-white">ANIME MANIA FREE TIER</span>
              <p className="text-[9px] text-slate-400">Upgrade for Ad-Free 4K</p>
            </div>
          )}

          {/* Custom Player Controls Overlay */}
          <div 
            className={`absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4 sm:p-6 transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Timeline Scrubber */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[11px] font-mono text-slate-300 w-12 text-right">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500 hover:h-2 transition-all"
              />
              <span className="text-[11px] font-mono text-slate-400 w-12">{formatTime(duration)}</span>
            </div>

            {/* Bottom Controls Bar */}
            <div className="flex items-center justify-between text-white">
              
              {/* Left: Play/Pause, Rewind, Next, Volume */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={togglePlay}
                  className="p-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white transition-colors"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>

                <button 
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = Math.max(0, currentTime - 10);
                    }
                  }}
                  className="p-2 text-slate-300 hover:text-white transition-colors"
                  title="Rewind 10s"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {nextEpisode && (
                  <button 
                    onClick={handleNextEpisode}
                    className="p-2 text-slate-300 hover:text-white transition-colors"
                    title={`Next: Episode ${nextEpisode.episodeNumber}`}
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                )}

                {/* Volume slider */}
                <div className="flex items-center gap-1.5 group/vol">
                  <button onClick={toggleMute} className="p-2 text-slate-300 hover:text-white">
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                </div>
              </div>

              {/* Right: Subtitles, Speed, Quality Switcher, Fullscreen */}
              <div className="flex items-center gap-2 relative">
                
                {/* Subtitle Selector */}
                <div className="relative">
                  <button
                    onClick={() => setSelectedSubtitle(s => s === 'en' ? 'jp' : s === 'jp' ? 'romaji' : s === 'romaji' ? 'off' : 'en')}
                    className="p-2 text-slate-300 hover:text-white flex items-center gap-1 text-xs"
                    title="Toggle Subtitles"
                  >
                    <Subtitles className="w-4 h-4" />
                    <span className="font-mono text-[10px] uppercase">{selectedSubtitle}</span>
                  </button>
                </div>

                {/* Playback Speed */}
                <div className="relative">
                  <button
                    onClick={() => setIsSpeedMenuOpen(!isSpeedMenuOpen)}
                    className="px-2 py-1 rounded text-xs font-mono text-slate-300 hover:text-white bg-slate-800/80"
                  >
                    {playbackSpeed}x
                  </button>
                  {isSpeedMenuOpen && (
                    <div className="absolute bottom-9 right-0 bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-2xl z-50 text-xs w-20">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                        <button
                          key={speed}
                          onClick={() => handleSpeedSelect(speed)}
                          className={`w-full py-1 text-center rounded ${playbackSpeed === speed ? 'bg-rose-500 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Multi-Quality Switcher Button */}
                <div className="relative">
                  <button
                    onClick={() => setIsQualityMenuOpen(!isQualityMenuOpen)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                      currentQuality === '4k'
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                        : currentQuality === '1080p'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-200'
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>{currentQuality.toUpperCase()}</span>
                  </button>

                  {/* Quality Menu Popover */}
                  {isQualityMenuOpen && (
                    <div className="absolute bottom-11 right-0 w-64 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl z-50 text-xs animate-in fade-in duration-150">
                      <div className="p-2 border-b border-slate-800 mb-1">
                        <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Select Streaming Quality</span>
                      </div>

                      {(['4k', '1080p', '720p', '480p'] as QualityTier[]).map(tier => {
                        const stream = currentEpisode.streams[tier];
                        if (!stream) return null;
                        const isCurrent = currentQuality === tier;
                        const isVipTier = stream.isVipRequired;
                        const isUserLocked = isVipTier && user.subscription.plan === 'free';

                        return (
                          <button
                            key={tier}
                            onClick={() => handleQualitySelect(tier)}
                            className={`w-full p-2 rounded-xl flex items-center justify-between text-left transition-colors mb-1 ${
                              isCurrent 
                                ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30' 
                                : 'hover:bg-slate-800/80 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {tier === '4k' && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                              <div>
                                <p className="font-semibold">{stream.resolution}</p>
                                <p className="text-[10px] text-slate-400 font-mono">{stream.bitrate} • {stream.fileSize}</p>
                              </div>
                            </div>

                            {isUserLocked ? (
                              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                                <Crown className="w-2.5 h-2.5" /> VIP
                              </span>
                            ) : isCurrent ? (
                              <span className="text-[10px] font-mono text-rose-400">ACTIVE</span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Fullscreen Button */}
                <button onClick={toggleFullscreen} className="p-2 text-slate-300 hover:text-white">
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </button>
              </div>

            </div>
          </div>

          {/* Download Toast Notification */}
          {downloadSuccessToast && (
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 z-40 animate-in fade-in slide-in-from-top-2">
              <CheckCircle className="w-4 h-4" />
              <span>{downloadSuccessToast}</span>
            </div>
          )}
        </div>

        {/* Right: Drawer Panel (Episodes Playlist / Comments / Details) */}
        <div className="w-full lg:w-96 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col h-72 lg:h-auto overflow-hidden">
          
          {/* Tabs */}
          <div className="flex items-center border-b border-slate-800 px-3 bg-slate-950/40">
            <button
              onClick={() => setActiveTab('episodes')}
              className={`py-3 px-3 text-xs font-medium border-b-2 flex items-center gap-1.5 transition-all ${
                activeTab === 'episodes'
                  ? 'border-rose-500 text-rose-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ListVideo className="w-3.5 h-3.5" />
              Episodes ({currentSeries.episodes.length})
            </button>

            <button
              onClick={() => setActiveTab('comments')}
              className={`py-3 px-3 text-xs font-medium border-b-2 flex items-center gap-1.5 transition-all ${
                activeTab === 'comments'
                  ? 'border-rose-500 text-rose-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Community ({episodeComments.length})
            </button>

            <button
              onClick={() => setActiveTab('details')}
              className={`py-3 px-3 text-xs font-medium border-b-2 flex items-center gap-1.5 transition-all ${
                activeTab === 'details'
                  ? 'border-rose-500 text-rose-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              About Anime
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            
            {/* Tab 1: Episodes Playlist */}
            {activeTab === 'episodes' && (
              <div className="space-y-2">
                {currentSeries.episodes.map(ep => {
                  const isCurrent = ep.id === currentEpisode.id;
                  const epKey = `${currentSeries.id}_${ep.id}`;
                  const epProgress = watchProgress[epKey];

                  return (
                    <div
                      key={ep.id}
                      onClick={() => playEpisode(currentSeries, ep)}
                      className={`p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                        isCurrent 
                          ? 'bg-rose-500/10 border-rose-500/50 ring-1 ring-rose-500/30' 
                          : 'bg-slate-950/50 border-slate-800/80 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-800">
                        <img src={ep.thumbnail || currentSeries.coverImage} alt={ep.title} className="w-full h-full object-cover" />
                        {isCurrent && (
                          <div className="absolute inset-0 bg-rose-600/40 flex items-center justify-center">
                            <Play className="w-4 h-4 text-white fill-white" />
                          </div>
                        )}
                        {epProgress && (
                          <div className="absolute bottom-0 inset-x-0 h-1 bg-slate-700">
                            <div 
                              className="h-full bg-rose-500" 
                              style={{ width: `${Math.min(100, (epProgress.timestamp / epProgress.duration) * 100)}%` }} 
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white truncate">
                            Ep {ep.episodeNumber}: {ep.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{ep.synopsis}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 font-mono">
                          <span>{Math.round(ep.duration / 60)}m</span>
                          <span>•</span>
                          <span>{ep.releaseDate}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab 2: Comments & Community Thread */}
            {activeTab === 'comments' && (
              <div className="space-y-4">
                
                {/* Comment Input */}
                <form onSubmit={handleSubmitComment} className="space-y-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                  <textarea
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Share your reaction or theory..."
                    rows={2}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 resize-none"
                  />
                  
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={commentIsSpoiler} 
                        onChange={(e) => setCommentIsSpoiler(e.target.checked)}
                        className="rounded bg-slate-800 border-slate-700 accent-rose-500" 
                      />
                      <span>Contains Spoiler</span>
                    </label>

                    <button
                      type="submit"
                      disabled={!newCommentText.trim()}
                      className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      <span>Post</span>
                    </button>
                  </div>
                </form>

                {/* Spoiler Reveal Toggle */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Comments ({episodeComments.length})</span>
                  <button
                    onClick={() => setShowSpoilers(!showSpoilers)}
                    className="text-slate-400 hover:text-white flex items-center gap-1 font-mono text-[11px]"
                  >
                    {showSpoilers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showSpoilers ? 'Hide Spoilers' : 'Reveal Spoilers'}</span>
                  </button>
                </div>

                {/* Comment List */}
                <div className="space-y-3">
                  {episodeComments.map(comment => {
                    const isHiddenSpoiler = comment.isSpoiler && !showSpoilers;

                    return (
                      <div key={comment.id} className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img src={comment.avatar} alt={comment.author} className="w-5 h-5 rounded-full object-cover" />
                            <span className="text-xs font-semibold text-slate-200">{comment.author}</span>
                            {comment.badge && (
                              <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                                comment.badge === 'VIP' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                              }`}>
                                {comment.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500">{comment.createdAt}</span>
                        </div>

                        {/* Text */}
                        {isHiddenSpoiler ? (
                          <div 
                            onClick={() => setShowSpoilers(true)}
                            className="bg-slate-900 border border-dashed border-slate-700 p-2 rounded-lg text-center cursor-pointer text-xs text-amber-400 font-mono"
                          >
                            ⚠️ Spoiler tag hidden. Click to reveal.
                          </div>
                        ) : (
                          <p className="text-xs text-slate-300 leading-relaxed">{comment.text}</p>
                        )}

                        {/* Likes */}
                        <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                          <button
                            onClick={() => toggleCommentLike(currentEpisode.id, comment.id)}
                            className={`flex items-center gap-1 transition-colors ${
                              comment.userLiked ? 'text-rose-400 font-bold' : 'hover:text-slate-200'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${comment.userLiked ? 'fill-rose-500' : ''}`} />
                            <span>{comment.likes}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 3: About Anime Details */}
            {activeTab === 'details' && (
              <div className="space-y-4 text-xs text-slate-300">
                <div>
                  <h4 className="font-heading font-bold text-white text-sm">{currentSeries.title}</h4>
                  <p className="text-[11px] text-slate-400 italic">{currentSeries.romajiTitle}</p>
                </div>
                <p className="text-slate-300 leading-relaxed">{currentSeries.synopsis}</p>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                  <div>
                    <span className="text-slate-500">Studio:</span>
                    <p className="font-medium text-slate-200">{currentSeries.studio}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Rating:</span>
                    <p className="font-medium text-amber-400">⭐ {currentSeries.rating} / 5.0</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Audio:</span>
                    <p className="font-medium text-slate-200">{currentSeries.audioOptions.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Status:</span>
                    <p className="font-medium text-emerald-400">{currentSeries.status}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-slate-500">Genres:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {currentSeries.genres.map(g => (
                      <span key={g} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Social Share Modal */}
      {isShareModalOpen && (
        <SocialShareModal
          series={currentSeries}
          episode={currentEpisode}
          currentTimestamp={Math.floor(currentTime)}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}

    </div>
  );
};

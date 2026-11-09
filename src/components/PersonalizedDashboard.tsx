import React, { useState } from 'react';
import { 
  Play, 
  Clock, 
  Sparkles, 
  Download, 
  Bookmark, 
  Trash2, 
  Smartphone, 
  Laptop, 
  Tablet, 
  RefreshCw, 
  CheckCircle2, 
  HardDrive, 
  Bell, 
  Mail, 
  Crown, 
  Star,
  Film,
  Zap,
  ShieldCheck,
  FolderHeart
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AnimeSeries, Episode, QualityTier } from '../types/anime';
import { AnimeCard } from './AnimeCard';

export const PersonalizedDashboard: React.FC = () => {
  const { 
    user, 
    seriesList, 
    watchProgress, 
    playEpisode, 
    offlineEpisodes, 
    deleteOfflineEpisode,
    syncedDevices, 
    syncAllDevices, 
    isSyncing,
    togglePushNotifications,
    toggleEmailAlerts,
    openSubscriptionModal,
    openSeriesDetail,
    isOfflineMode,
    setIsOfflineMode
  } = useApp();

  const [activeTab, setActiveTab] = useState<'continue' | 'recommendations' | 'watchlist' | 'offline' | 'devices'>('continue');

  // Compute Continue Watching list from watchProgress
  const continueWatchingItems = Object.entries(watchProgress)
    .filter(([_, prog]) => prog.timestamp > 10 && !prog.completed)
    .map(([_, prog]) => {
      const series = seriesList.find(s => s.id === prog.seriesId);
      const episode = series?.episodes.find(e => e.id === prog.episodeId);
      return { series, episode, prog };
    })
    .filter((item): item is { series: AnimeSeries; episode: Episode; prog: typeof item.prog } => 
      item.series !== undefined && item.episode !== undefined
    )
    .sort((a, b) => new Date(b.prog.lastWatched).getTime() - new Date(a.prog.lastWatched).getTime());

  // Watchlist series
  const watchlistSeries = seriesList.filter(s => user.watchlist.includes(s.id));

  // Compute personalized recommendations based on viewing history
  // If user watched Cyberpunk/Action, recommend Mecha/Dark Fantasy
  const recentlyWatchedGenres = continueWatchingItems.flatMap(i => i.series.genres);
  const recommendedSeries = seriesList.filter(s => {
    // Recommend shows that match genre or have high rating
    const hasSharedGenre = s.genres.some(g => recentlyWatchedGenres.includes(g));
    const notCurrentlyWatching = !continueWatchingItems.some(i => i.series.id === s.id);
    return hasSharedGenre && notCurrentlyWatching;
  }).slice(0, 4);

  const fallbackRecommended = recommendedSeries.length > 0 
    ? recommendedSeries 
    : seriesList.slice(0, 4);

  // Total offline storage calculation
  const totalOfflineSizeMB = offlineEpisodes.length * 480; // approximate aggregate

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Personalized Greeting & Cloud Sync Bar */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/40 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-rose-500 shadow-lg"
            />
            {user.subscription.plan !== 'free' && (
              <span className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-amber-500 text-slate-950 shadow-md">
                <Crown className="w-3 h-3 fill-slate-950" />
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                Welcome back, {user.name}
              </h2>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                user.subscription.plan === 'kami_vip'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : user.subscription.plan === 'otaku_vip'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {user.subscription.plan === 'kami_vip' ? '4K KAMI VIP' : user.subscription.plan === 'otaku_vip' ? '1080p OTAKU' : 'FREE TIER'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cloud Backup Active • Synced across {syncedDevices.length} devices</span>
              <span className="text-slate-500">({user.lastSyncedAt})</span>
            </p>
          </div>
        </div>

        {/* Quick Sync Button */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={syncAllDevices}
            disabled={isSyncing}
            className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Synchronizing...' : 'Sync All Devices'}</span>
          </button>

          {user.subscription.plan === 'free' && (
            <button
              onClick={() => openSubscriptionModal('Upgrade to VIP to unlock 4K downloads and uninterrupted streaming.')}
              className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-rose-500/20"
            >
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>Get VIP Pass</span>
            </button>
          )}
        </div>
      </div>

      {/* Dashboard Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('continue')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shrink-0 ${
            activeTab === 'continue'
              ? 'bg-rose-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Continue Watching ({continueWatchingItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('recommendations')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shrink-0 ${
            activeTab === 'recommendations'
              ? 'bg-rose-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Recommended For You</span>
        </button>

        <button
          onClick={() => setActiveTab('watchlist')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shrink-0 ${
            activeTab === 'watchlist'
              ? 'bg-rose-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>My Watchlist ({watchlistSeries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('offline')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shrink-0 ${
            activeTab === 'offline'
              ? 'bg-rose-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Offline Downloads ({offlineEpisodes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('devices')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shrink-0 ${
            activeTab === 'devices'
              ? 'bg-rose-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Laptop className="w-4 h-4" />
          <span>Device Sync & Settings</span>
        </button>
      </div>

      {/* TAB CONTENT 1: CONTINUE WATCHING */}
      {activeTab === 'continue' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-500" />
              Resume Where You Left Off
            </h3>
            <span className="text-xs text-slate-400 font-mono">Progress synced to cloud</span>
          </div>

          {continueWatchingItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {continueWatchingItems.map(({ series, episode, prog }) => {
                const percent = Math.min(100, Math.round((prog.timestamp / (prog.duration || episode.duration)) * 100));
                const minsLeft = Math.max(1, Math.round(((prog.duration || episode.duration) - prog.timestamp) / 60));

                return (
                  <div
                    key={`${series.id}_${episode.id}`}
                    onClick={() => playEpisode(series, episode)}
                    className="group bg-slate-900 border border-slate-800 hover:border-rose-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 transform hover:-translate-y-1 shadow-lg"
                  >
                    <div className="relative aspect-video bg-slate-950">
                      <img 
                        src={episode.thumbnail || series.coverImage} 
                        alt={episode.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      
                      {/* Play overlay button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-2xl">
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </div>
                      </div>

                      {/* Quality badge */}
                      <div className="absolute top-2.5 right-2.5">
                        <span className="text-[10px] font-mono font-bold bg-slate-950/80 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded">
                          {prog.selectedQuality.toUpperCase()}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="absolute bottom-0 inset-x-0 h-1.5 bg-slate-800">
                        <div 
                          className="h-full bg-gradient-to-r from-rose-500 to-purple-600"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3.5 space-y-1">
                      <p className="text-xs text-rose-400 font-semibold truncate">{series.title}</p>
                      <h4 className="text-sm font-bold text-white truncate">
                        Ep {episode.episodeNumber}: {episode.title}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                        <span>{minsLeft}m remaining ({percent}%)</span>
                        <span className="text-cyan-400">Resume →</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-slate-900/50 border border-slate-800 text-center space-y-3">
              <Film className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="font-bold text-white text-base">No in-progress anime episodes</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Start streaming any episode in 4K or 1080p, and your timestamp will automatically synchronize here.
              </p>
              <button
                onClick={() => {
                  const firstS = seriesList[0];
                  if (firstS && firstS.episodes[0]) playEpisode(firstS, firstS.episodes[0]);
                }}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start Watching {seriesList[0]?.title}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 2: PERSONALIZED RECOMMENDATIONS */}
      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Tailored for Your Otaku Taste
              </h3>
              <p className="text-xs text-slate-400">
                Algorithmically curated based on your watch history, genres, and highest rated series.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {fallbackRecommended.map(series => (
              <div key={series.id} className="relative">
                <div className="mb-2">
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    98% Match for You
                  </span>
                </div>
                <AnimeCard series={series} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: MY WATCHLIST */}
      {activeTab === 'watchlist' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-rose-500" />
              Saved Watchlist ({watchlistSeries.length})
            </h3>
          </div>

          {watchlistSeries.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {watchlistSeries.map(series => (
                <AnimeCard key={series.id} series={series} />
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-slate-900/50 border border-slate-800 text-center space-y-3">
              <FolderHeart className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="font-bold text-white text-base">Your watchlist is empty</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Bookmark shows you want to watch later by clicking the bookmark ribbon on any anime card.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 4: OFFLINE DOWNLOADS MANAGER */}
      {activeTab === 'offline' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-cyan-400" />
                Downloaded for Offline Viewing
              </h3>
              <p className="text-xs text-slate-400">
                Play stored episodes without an active internet connection.
              </p>
            </div>

            {/* Offline Simulator Switch */}
            <button
              onClick={() => setIsOfflineMode(!isOfflineMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold border flex items-center gap-2 transition-all ${
                isOfflineMode
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${isOfflineMode ? 'text-amber-400 animate-pulse' : ''}`} />
              <span>{isOfflineMode ? 'Simulated Offline Mode: ON' : 'Test Offline Mode'}</span>
            </button>
          </div>

          {/* Storage Meter */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-cyan-400" />
                Local Storage Allocation
              </span>
              <span className="text-cyan-400">
                {(totalOfflineSizeMB / 1024).toFixed(2)} GB / 32 GB Used ({offlineEpisodes.length} Episodes)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full"
                style={{ width: `${Math.min(100, Math.max(5, (totalOfflineSizeMB / 32000) * 100))}%` }}
              />
            </div>
          </div>

          {offlineEpisodes.length > 0 ? (
            <div className="space-y-2">
              {offlineEpisodes.map(ep => {
                const targetSeries = seriesList.find(s => s.id === ep.seriesId);
                const targetEpisode = targetSeries?.episodes.find(e => e.id === ep.episodeId);

                return (
                  <div
                    key={ep.episodeId}
                    className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={ep.thumbnail} alt={ep.episodeTitle} className="w-16 h-12 rounded-xl object-cover shrink-0" />
                      <div className="min-w-0">
                        <span className="text-xs text-rose-400 font-semibold block truncate">{ep.seriesTitle}</span>
                        <h4 className="text-sm font-bold text-white truncate">Ep {ep.episodeNumber}: {ep.episodeTitle}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                          <span className="text-cyan-400 font-bold">{ep.quality.toUpperCase()}</span>
                          <span>•</span>
                          <span>{ep.fileSize}</span>
                          <span>•</span>
                          <span>Downloaded {ep.downloadedAt}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          if (targetSeries && targetEpisode) playEpisode(targetSeries, targetEpisode);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-slate-950" />
                        <span>Play</span>
                      </button>

                      <button
                        onClick={() => deleteOfflineEpisode(ep.episodeId)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete from Offline Storage"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-10 rounded-3xl bg-slate-900/50 border border-slate-800 text-center space-y-3">
              <Download className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="font-bold text-white text-base">No offline anime downloaded</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                VIP members can download any episode in 1080p or 4K to watch without consuming mobile bandwidth.
              </p>
              {user.subscription.plan === 'free' && (
                <button
                  onClick={() => openSubscriptionModal('Upgrade to VIP to enable high-speed offline downloads.')}
                  className="px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-300" />
                  <span>Unlock VIP Offline Downloads</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 5: DEVICE SYNC & NOTIFICATION SETTINGS */}
      {activeTab === 'devices' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Connected Devices */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Laptop className="w-5 h-5 text-cyan-400" />
                <h3 className="font-heading font-bold text-base text-white">Cloud Synced Devices</h3>
              </div>
              <button
                onClick={syncAllDevices}
                disabled={isSyncing}
                className="text-xs text-cyan-400 flex items-center gap-1 font-mono hover:text-cyan-300"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync All'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Your watchlist, episode timestamps, and personalized recommendations are automatically backed up and synced in real-time across your connected devices.
            </p>

            <div className="space-y-2">
              {syncedDevices.map(d => (
                <div key={d.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-900 text-slate-400">
                      {d.type === 'desktop' ? <Laptop className="w-4 h-4" /> : d.type === 'tablet' ? <Tablet className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{d.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">Last active: {d.lastActive}</p>
                    </div>
                  </div>
                  {d.isCurrent ? (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      This Device
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500">
                      Synced
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Automated Notification Preferences */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Bell className="w-5 h-5 text-rose-500" />
              <h3 className="font-heading font-bold text-base text-white">Alert Preferences</h3>
            </div>

            <div className="space-y-4 text-xs">
              {/* Push Notifications */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <h4 className="font-bold text-white">Push Notifications</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Instant alerts when new episodes release in 4K HDR</p>
                </div>
                <button
                  onClick={togglePushNotifications}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${
                    user.pushNotificationsEnabled ? 'bg-rose-500' : 'bg-slate-700'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    user.pushNotificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Automated Email Alerts */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <h4 className="font-bold text-white flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-purple-400" />
                    Automated Release Email Newsletter
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Receive custom formatted episode release updates to {user.email}
                  </p>
                </div>
                <button
                  onClick={toggleEmailAlerts}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${
                    user.emailAlertsEnabled ? 'bg-purple-600' : 'bg-slate-700'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    user.emailAlertsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* VIP Membership status */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-rose-500/10 border border-amber-500/20">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300">Membership Status</span>
                  <span className="font-mono text-[10px] text-white bg-slate-950 px-2 py-0.5 rounded">
                    {user.subscription.plan.toUpperCase()}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  {user.subscription.plan !== 'free' 
                    ? 'All 4K streams and multi-quality downloads unlocked.' 
                    : 'Upgrade to remove ads and unlock high-definition streaming.'}
                </p>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};

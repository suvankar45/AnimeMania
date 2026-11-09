import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  AnimeSeries, 
  Episode, 
  UserProfile, 
  QualityTier, 
  WatchProgress, 
  OfflineEpisode, 
  CommentItem, 
  SyncedDevice, 
  SentEmailLog,
  SubscriptionPlan
} from '../types/anime';
import { 
  INITIAL_ANIME_SERIES, 
  INITIAL_SYNCED_DEVICES, 
  INITIAL_SENT_EMAILS 
} from '../data/mockData';

interface AppContextType {
  seriesList: AnimeSeries[];
  user: UserProfile;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  currentEpisode: Episode | null;
  currentSeries: AnimeSeries | null;
  playEpisode: (series: AnimeSeries, episode: Episode) => void;
  closePlayer: () => void;
  isSubscriptionModalOpen: boolean;
  subscriptionModalReason: string;
  openSubscriptionModal: (reason?: string) => void;
  closeSubscriptionModal: () => void;
  upgradeSubscription: (plan: SubscriptionPlan) => void;
  cancelSubscription: () => void;
  watchProgress: Record<string, WatchProgress>;
  updateWatchProgress: (seriesId: string, episodeId: string, timestamp: number, duration: number, quality: QualityTier) => void;
  toggleWatchlist: (seriesId: string) => void;
  isInWatchlist: (seriesId: string) => boolean;
  toggleFavorite: (seriesId: string) => void;
  isFavorite: (seriesId: string) => boolean;
  offlineEpisodes: OfflineEpisode[];
  downloadEpisode: (series: AnimeSeries, episode: Episode, quality: QualityTier) => boolean;
  deleteOfflineEpisode: (episodeId: string) => void;
  isEpisodeDownloaded: (episodeId: string) => boolean;
  isOfflineMode: boolean;
  setIsOfflineMode: (val: boolean) => void;
  syncedDevices: SyncedDevice[];
  syncAllDevices: () => void;
  isSyncing: boolean;
  comments: Record<string, CommentItem[]>;
  addComment: (episodeId: string, text: string, isSpoiler: boolean) => void;
  toggleCommentLike: (episodeId: string, commentId: string) => void;
  sentEmails: SentEmailLog[];
  dispatchReleaseEmail: (seriesTitle: string, episodeTitle: string, audience: 'All Subscribers' | 'VIP Members Only', customSubject?: string) => void;
  uploadAdminEpisode: (seriesId: string, episode: Partial<Episode>) => void;
  uploadAdminSeries: (series: Partial<AnimeSeries>) => void;
  uploadFullSeriesWithEpisodes: (series: Partial<AnimeSeries>, episodes: Partial<Episode>[]) => void;
  deleteAdminSeries: (seriesId: string) => void;
  deleteAdminEpisode: (seriesId: string, episodeId: string) => void;
  notifications: Array<{ id: string; title: string; message: string; time: string; read: boolean }>;
  markNotificationAsRead: (id: string) => void;
  togglePushNotifications: () => void;
  toggleEmailAlerts: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (val: boolean) => void;
  isAiAdvisorOpen: boolean;
  setIsAiAdvisorOpen: (val: boolean) => void;
  activeView: 'home' | 'browse' | 'watchlist' | 'downloads' | 'vip' | 'admin' | 'series-detail';
  setActiveView: (view: 'home' | 'browse' | 'watchlist' | 'downloads' | 'vip' | 'admin' | 'series-detail') => void;
  selectedSeriesDetail: AnimeSeries | null;
  openSeriesDetail: (series: AnimeSeries) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_SERIES = 'anipulse_series_catalog_v1';
const LOCAL_STORAGE_KEY_USER = 'anipulse_user_profile_v1';
const LOCAL_STORAGE_KEY_PROGRESS = 'anipulse_watch_progress_v1';
const LOCAL_STORAGE_KEY_OFFLINE = 'anipulse_offline_episodes_v1';
const LOCAL_STORAGE_KEY_EMAILS = 'anipulse_sent_emails_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial series with local storage fallback
  const [seriesList, setSeriesList] = useState<AnimeSeries[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SERIES);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ANIME_SERIES;
  });

  // User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      id: 'usr-9021',
      name: 'Shinji_K',
      email: 'otaku.fan@animemania.tv',
      avatar: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=200&q=80',
      subscription: {
        plan: 'free',
        status: 'active',
        expiresAt: '2027-01-01',
        autoRenew: false
      },
      joinedDate: 'October 2026',
      watchlist: ['cyber-chronicles', 'abyssal-monarch'],
      favorites: ['abyssal-monarch'],
      downloadedEpisodeIds: [],
      pushNotificationsEnabled: true,
      emailAlertsEnabled: true,
      cloudSyncEnabled: true,
      lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [currentSeries, setCurrentSeries] = useState<AnimeSeries | null>(null);
  const [activeView, setActiveView] = useState<'home' | 'browse' | 'watchlist' | 'downloads' | 'vip' | 'admin' | 'series-detail'>('home');
  const [selectedSeriesDetail, setSelectedSeriesDetail] = useState<AnimeSeries | null>(null);

  // Subscription modal control
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [subscriptionModalReason, setSubscriptionModalReason] = useState('Unlock 4K HDR & VIP Episodes');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);

  // Watch Progress
  const [watchProgress, setWatchProgress] = useState<Record<string, WatchProgress>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PROGRESS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      'cyber-chronicles_cv-ep1': {
        seriesId: 'cyber-chronicles',
        episodeId: 'cv-ep1',
        timestamp: 420,
        duration: 888,
        completed: false,
        lastWatched: new Date().toISOString(),
        selectedQuality: '1080p'
      }
    };
  });

  // Offline Episodes
  const [offlineEpisodes, setOfflineEpisodes] = useState<OfflineEpisode[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_OFFLINE);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [syncedDevices, setSyncedDevices] = useState<SyncedDevice[]>(INITIAL_SYNCED_DEVICES);
  const [isSyncing, setIsSyncing] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Email notifications log for Admin
  const [sentEmails, setSentEmails] = useState<SentEmailLog[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_EMAILS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_SENT_EMAILS;
  });

  // Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'New Episode Alert!',
      message: 'Cyber Valkyrie Episode 3 is out in 4K HDR. Tap to watch!',
      time: '1h ago',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Cloud Sync Updated',
      message: '3 devices synchronized with your watchlist and timestamps.',
      time: '3h ago',
      read: true
    },
    {
      id: 'notif-3',
      title: 'Welcome to Anime Mania',
      message: 'Explore over 500+ curated anime streams. Upgrade for VIP 4K!',
      time: '1d ago',
      read: true
    }
  ]);

  // Initial Comments
  const [comments, setComments] = useState<Record<string, CommentItem[]>>({
    'cv-ep1': [
      {
        id: 'c1',
        episodeId: 'cv-ep1',
        author: 'KuroNeko99',
        avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=120&q=80',
        text: 'The 4K animation when Ren activates the Valkyrie frame gave me chills!! Best sequence of 2026 hands down.',
        isSpoiler: false,
        likes: 142,
        userLiked: false,
        createdAt: '2 hours ago',
        badge: 'VIP'
      },
      {
        id: 'c2',
        episodeId: 'cv-ep1',
        author: 'CyberSamurai',
        avatar: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=120&q=80',
        text: 'Wait till minute 11:40 when the rogue neural firewall reflects her blade. Major plot twist foreshadowing right there.',
        isSpoiler: true,
        likes: 67,
        userLiked: true,
        createdAt: '4 hours ago',
        badge: 'OTAKU'
      }
    ],
    'sm-ep1': [
      {
        id: 'c3',
        episodeId: 'sm-ep1',
        author: 'MonarchFanatic',
        avatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=120&q=80',
        text: 'THE STATUE OF GOD SMILED! Seeing this animated at 60fps in the VIP tier is godly!',
        isSpoiler: false,
        likes: 310,
        userLiked: false,
        createdAt: '1 day ago',
        badge: 'VIP'
      }
    ]
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SERIES, JSON.stringify(seriesList));
    } catch {
      // ignore
    }
  }, [seriesList]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(user));
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PROGRESS, JSON.stringify(watchProgress));
    } catch {
      // ignore
    }
  }, [watchProgress]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_OFFLINE, JSON.stringify(offlineEpisodes));
    } catch {
      // ignore
    }
  }, [offlineEpisodes]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_EMAILS, JSON.stringify(sentEmails));
    } catch {
      // ignore
    }
  }, [sentEmails]);

  // Video Playing handler
  const playEpisode = (series: AnimeSeries, episode: Episode) => {
    setCurrentSeries(series);
    setCurrentEpisode(episode);
  };

  const closePlayer = () => {
    setCurrentEpisode(null);
    setCurrentSeries(null);
  };

  const openSeriesDetail = (series: AnimeSeries) => {
    setSelectedSeriesDetail(series);
    setActiveView('series-detail');
  };

  // Subscription modal
  const openSubscriptionModal = (reason?: string) => {
    if (reason) setSubscriptionModalReason(reason);
    setIsSubscriptionModalOpen(true);
  };

  const closeSubscriptionModal = () => {
    setIsSubscriptionModalOpen(false);
  };

  const upgradeSubscription = (plan: SubscriptionPlan) => {
    setUser(prev => ({
      ...prev,
      subscription: {
        plan,
        status: 'active',
        expiresAt: '2027-11-09',
        autoRenew: true
      }
    }));

    // Trigger celebratory anime confetti
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#a855f7', '#06b6d4', '#fbbf24']
    });

    // Add alert notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: '🎉 VIP Membership Activated!',
        message: `Welcome to ${plan === 'kami_vip' ? 'Kami-Sama VIP (4K HDR)' : 'Pro Otaku (1080p FHD)'}! All download restrictions lifted.`,
        time: 'Just now',
        read: false
      },
      ...prev
    ]);

    setIsSubscriptionModalOpen(false);
  };

  const cancelSubscription = () => {
    setUser(prev => ({
      ...prev,
      subscription: {
        ...prev.subscription,
        plan: 'free',
        autoRenew: false
      }
    }));
  };

  // Watch Progress
  const updateWatchProgress = (
    seriesId: string, 
    episodeId: string, 
    timestamp: number, 
    duration: number, 
    quality: QualityTier
  ) => {
    const key = `${seriesId}_${episodeId}`;
    setWatchProgress(prev => ({
      ...prev,
      [key]: {
        seriesId,
        episodeId,
        timestamp,
        duration,
        completed: timestamp / duration > 0.9,
        lastWatched: new Date().toISOString(),
        selectedQuality: quality
      }
    }));
  };

  // Watchlist & Favorites
  const toggleWatchlist = (seriesId: string) => {
    setUser(prev => {
      const exists = prev.watchlist.includes(seriesId);
      const updated = exists 
        ? prev.watchlist.filter(id => id !== seriesId)
        : [...prev.watchlist, seriesId];
      return { ...prev, watchlist: updated };
    });
  };

  const isInWatchlist = (seriesId: string) => user.watchlist.includes(seriesId);

  const toggleFavorite = (seriesId: string) => {
    setUser(prev => {
      const exists = prev.favorites.includes(seriesId);
      const updated = exists 
        ? prev.favorites.filter(id => id !== seriesId)
        : [...prev.favorites, seriesId];
      return { ...prev, favorites: updated };
    });
  };

  const isFavorite = (seriesId: string) => user.favorites.includes(seriesId);

  // Offline Downloads
  const downloadEpisode = (series: AnimeSeries, episode: Episode, quality: QualityTier): boolean => {
    // If user is on Free tier, downloading is VIP-exclusive
    if (user.subscription.plan === 'free') {
      openSubscriptionModal(`Offline downloads are reserved for Pro Otaku & Kami-Sama VIP members.`);
      return false;
    }

    const stream = episode.streams[quality] || episode.streams['720p'] || episode.streams['480p'];
    if (!stream) return false;

    const newDownload: OfflineEpisode = {
      episodeId: episode.id,
      seriesId: series.id,
      seriesTitle: series.title,
      episodeTitle: episode.title,
      episodeNumber: episode.episodeNumber,
      thumbnail: episode.thumbnail || series.coverImage,
      quality: quality,
      fileSize: stream.fileSize,
      downloadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      duration: episode.duration,
      blobUrl: stream.url
    };

    setOfflineEpisodes(prev => {
      // avoid duplicates
      const filtered = prev.filter(e => e.episodeId !== episode.id);
      return [newDownload, ...filtered];
    });

    setUser(prev => ({
      ...prev,
      downloadedEpisodeIds: [...new Set([...prev.downloadedEpisodeIds, episode.id])]
    }));

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: '📥 Episode Download Complete',
        message: `${series.title} Ep ${episode.episodeNumber} downloaded in ${quality.toUpperCase()} (${stream.fileSize}) for offline viewing.`,
        time: 'Just now',
        read: false
      },
      ...prev
    ]);

    return true;
  };

  const deleteOfflineEpisode = (episodeId: string) => {
    setOfflineEpisodes(prev => prev.filter(e => e.episodeId !== episodeId));
    setUser(prev => ({
      ...prev,
      downloadedEpisodeIds: prev.downloadedEpisodeIds.filter(id => id !== episodeId)
    }));
  };

  const isEpisodeDownloaded = (episodeId: string) => {
    return offlineEpisodes.some(e => e.episodeId === episodeId);
  };

  // Cloud Device Sync
  const syncAllDevices = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setUser(prev => ({
        ...prev,
        lastSyncedAt: now
      }));
      setSyncedDevices(prev => 
        prev.map(d => ({
          ...d,
          lastActive: d.isCurrent ? 'Just now' : 'Synced just now'
        }))
      );
      setIsSyncing(false);

      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          title: '🔄 Cloud Sync Successful',
          message: `Watch progress, bookmarks, and downloads synced across 3 registered devices.`,
          time: 'Just now',
          read: false
        },
        ...prev
      ]);
    }, 1200);
  };

  // Comments
  const addComment = (episodeId: string, text: string, isSpoiler: boolean) => {
    if (!text.trim()) return;
    const newComment: CommentItem = {
      id: `c-${Date.now()}`,
      episodeId,
      author: user.name,
      avatar: user.avatar,
      text: text.trim(),
      isSpoiler,
      likes: 1,
      userLiked: true,
      createdAt: 'Just now',
      badge: user.subscription.plan !== 'free' ? 'VIP' : 'OTAKU'
    };

    setComments(prev => ({
      ...prev,
      [episodeId]: [newComment, ...(prev[episodeId] || [])]
    }));
  };

  const toggleCommentLike = (episodeId: string, commentId: string) => {
    setComments(prev => {
      const episodeComments = prev[episodeId] || [];
      const updated = episodeComments.map(c => {
        if (c.id === commentId) {
          const userLiked = !c.userLiked;
          return {
            ...c,
            userLiked,
            likes: userLiked ? c.likes + 1 : Math.max(0, c.likes - 1)
          };
        }
        return c;
      });
      return { ...prev, [episodeId]: updated };
    });
  };

  // Admin: Automated Email Release Dispatcher
  const dispatchReleaseEmail = (
    seriesTitle: string, 
    episodeTitle: string, 
    audience: 'All Subscribers' | 'VIP Members Only',
    customSubject?: string
  ) => {
    const subject = customSubject || `⚡ [Anime Mania Alert] New Episode Released: ${seriesTitle} - "${episodeTitle}"`;
    const newEmail: SentEmailLog = {
      id: `email-${Date.now()}`,
      subject,
      seriesTitle,
      episodeTitle,
      recipientAudience: audience,
      recipientCount: audience === 'All Subscribers' ? 14850 : 5420,
      sentAt: new Date().toLocaleString(),
      previewSnippet: `Stream the latest episode in 4K HDR! Auto-dispatched via Anime Mania Cloud Broadcast to ${audience}.`
    };

    setSentEmails(prev => [newEmail, ...prev]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: '📧 Broadcast Emails Dispatched',
        message: `Automated release notification sent to ${newEmail.recipientCount.toLocaleString()} ${audience.toLowerCase()}.`,
        time: 'Just now',
        read: false
      },
      ...prev
    ]);
  };

  // Admin: Upload new episode to series
  const uploadAdminEpisode = (seriesId: string, episodeData: Partial<Episode>) => {
    setSeriesList(prev => {
      return prev.map(s => {
        if (s.id === seriesId) {
          const epNum = episodeData.episodeNumber || (s.episodes.length + 1);
          const newEp: Episode = {
            id: episodeData.id || `ep-${Date.now()}`,
            seriesId: s.id,
            episodeNumber: epNum,
            title: episodeData.title || `Episode ${epNum}`,
            duration: episodeData.duration || 1440,
            synopsis: episodeData.synopsis || 'Latest uploaded anime episode with multi-resolution bitrate encoding.',
            thumbnail: episodeData.thumbnail || s.coverImage,
            releaseDate: new Date().toISOString().split('T')[0],
            views: 0,
            introStart: episodeData.introStart || 10,
            introEnd: episodeData.introEnd || 95,
            isVipOnly: episodeData.isVipOnly || false,
            streams: (episodeData.streams as any) || {
              '4k': {
                resolution: '4K UHD (2160p HDR)',
                qualityKey: '4k',
                url: (episodeData.streams as any)?.['1080p']?.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
                fileSize: '1.9 GB',
                bitrate: '19.5 Mbps',
                isVipRequired: true
              },
              '1080p': {
                resolution: '1080p FHD (60fps)',
                qualityKey: '1080p',
                url: (episodeData.streams as any)?.['1080p']?.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
                fileSize: '650 MB',
                bitrate: '6.4 Mbps',
                isVipRequired: true
              },
              '720p': {
                resolution: '720p HD',
                qualityKey: '720p',
                url: (episodeData.streams as any)?.['720p']?.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
                fileSize: '320 MB',
                bitrate: '3.2 Mbps',
                isVipRequired: false
              },
              '480p': {
                resolution: '480p SD',
                qualityKey: '480p',
                url: (episodeData.streams as any)?.['480p']?.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
                fileSize: '130 MB',
                bitrate: '1.3 Mbps',
                isVipRequired: false
              }
            }
          };

          return {
            ...s,
            episodesCount: Math.max(s.episodesCount, s.episodes.length + 1),
            episodes: [...s.episodes, newEp]
          };
        }
        return s;
      });
    });

    // Auto-dispatch release email notification simulation!
    const targetSeries = seriesList.find(s => s.id === seriesId);
    if (targetSeries) {
      dispatchReleaseEmail(
        targetSeries.title, 
        episodeData.title || `Episode ${episodeData.episodeNumber || 'New'}`, 
        'All Subscribers'
      );
    }
  };

  // Admin: Upload new anime series
  const uploadAdminSeries = (seriesData: Partial<AnimeSeries>) => {
    const newId = (seriesData.title || 'anime').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const newSeries: AnimeSeries = {
      id: newId,
      title: seriesData.title || 'Untitled Anime Series',
      romajiTitle: seriesData.romajiTitle || seriesData.title || '',
      synopsis: seriesData.synopsis || 'A thrilling new anime adventure streaming on Anime Mania.',
      coverImage: seriesData.coverImage || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
      bannerImage: seriesData.bannerImage || 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1600&q=80',
      genres: seriesData.genres && seriesData.genres.length > 0 ? seriesData.genres : ['Action', 'Fantasy'],
      studio: seriesData.studio || 'Anime Mania Creator Studios',
      rating: 5.0,
      releaseYear: seriesData.releaseYear || 2026,
      season: seriesData.season || 'Fall',
      status: seriesData.status || 'Airing',
      episodesCount: seriesData.episodes?.length || 1,
      isFeatured: false,
      isTrending: true,
      audioOptions: ['Sub', 'Dub'],
      episodes: seriesData.episodes || []
    };

    setSeriesList(prev => [newSeries, ...prev]);
  };

  // Admin: Upload full series with all its episodes in batch
  const uploadFullSeriesWithEpisodes = (seriesData: Partial<AnimeSeries>, episodesData: Partial<Episode>[]) => {
    const newId = (seriesData.title || `anime-${Date.now()}`).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    // Convert episodes data into fully formed Episode items
    const formattedEpisodes: Episode[] = episodesData.map((ep, idx) => {
      const epNum = ep.episodeNumber || (idx + 1);
      const defaultUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';
      const videoUrl = (ep.streams as any)?.['1080p']?.url || (ep.streams as any)?.['4k']?.url || defaultUrl;

      return {
        id: ep.id || `${newId}-ep${epNum}`,
        seriesId: newId,
        episodeNumber: epNum,
        title: ep.title || `Episode ${epNum}`,
        duration: ep.duration || 1420,
        synopsis: ep.synopsis || `Episode ${epNum} of ${seriesData.title || 'Anime'}.`,
        thumbnail: ep.thumbnail || seriesData.coverImage || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
        releaseDate: ep.releaseDate || new Date().toISOString().split('T')[0],
        introStart: ep.introStart || 10,
        introEnd: ep.introEnd || 95,
        isVipOnly: ep.isVipOnly || false,
        views: 0,
        streams: (ep.streams as any) || {
          '4k': {
            resolution: '4K UHD (2160p HDR)',
            qualityKey: '4k',
            url: videoUrl,
            fileSize: '1.95 GB',
            bitrate: '18.5 Mbps',
            isVipRequired: true
          },
          '1080p': {
            resolution: '1080p FHD (60fps)',
            qualityKey: '1080p',
            url: videoUrl,
            fileSize: '680 MB',
            bitrate: '6.4 Mbps',
            isVipRequired: true
          },
          '720p': {
            resolution: '720p HD',
            qualityKey: '720p',
            url: videoUrl,
            fileSize: '320 MB',
            bitrate: '3.1 Mbps',
            isVipRequired: false
          },
          '480p': {
            resolution: '480p SD',
            qualityKey: '480p',
            url: videoUrl,
            fileSize: '125 MB',
            bitrate: '1.2 Mbps',
            isVipRequired: false
          }
        }
      };
    });

    const newSeries: AnimeSeries = {
      id: newId,
      title: seriesData.title || 'Untitled Anime Series',
      romajiTitle: seriesData.romajiTitle || seriesData.title || '',
      synopsis: seriesData.synopsis || 'Full series uploaded via Anime Mania Creator Studio.',
      coverImage: seriesData.coverImage || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
      bannerImage: seriesData.bannerImage || seriesData.coverImage || 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1600&q=80',
      genres: seriesData.genres && seriesData.genres.length > 0 ? seriesData.genres : ['Action', 'Fantasy'],
      studio: seriesData.studio || 'Anime Mania Creator Studios',
      rating: 5.0,
      releaseYear: seriesData.releaseYear || 2026,
      season: seriesData.season || 'Fall',
      status: seriesData.status || (formattedEpisodes.length > 1 ? 'Completed' : 'Airing'),
      episodesCount: Math.max(seriesData.episodesCount || 1, formattedEpisodes.length),
      isFeatured: false,
      isTrending: true,
      audioOptions: seriesData.audioOptions || ['Sub', 'Dub'],
      episodes: formattedEpisodes
    };

    setSeriesList(prev => [newSeries, ...prev]);

    // Dispatch automated release email for the full series release
    dispatchReleaseEmail(
      newSeries.title,
      `Full Series Premiered (${formattedEpisodes.length} Episodes in 4K)`,
      'All Subscribers',
      `🎉 [Full Season Drop] ${newSeries.title} is now streaming in 4K UHD!`
    );
  };

  // Admin: Delete anime series
  const deleteAdminSeries = (seriesId: string) => {
    setSeriesList(prev => prev.filter(s => s.id !== seriesId));
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: '🗑️ Series Deleted',
        message: `Anime series was removed from the catalog.`,
        time: 'Just now',
        read: false
      },
      ...prev
    ]);
  };

  // Admin: Delete single episode
  const deleteAdminEpisode = (seriesId: string, episodeId: string) => {
    setSeriesList(prev => {
      return prev.map(s => {
        if (s.id === seriesId) {
          const updatedEpisodes = s.episodes.filter(e => e.id !== episodeId);
          return {
            ...s,
            episodes: updatedEpisodes,
            episodesCount: updatedEpisodes.length
          };
        }
        return s;
      });
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const togglePushNotifications = () => {
    setUser(prev => ({
      ...prev,
      pushNotificationsEnabled: !prev.pushNotificationsEnabled
    }));
  };

  const toggleEmailAlerts = () => {
    setUser(prev => ({
      ...prev,
      emailAlertsEnabled: !prev.emailAlertsEnabled
    }));
  };

  return (
    <AppContext.Provider
      value={{
        seriesList,
        user,
        isAdmin,
        setIsAdmin,
        currentEpisode,
        currentSeries,
        playEpisode,
        closePlayer,
        isSubscriptionModalOpen,
        subscriptionModalReason,
        openSubscriptionModal,
        closeSubscriptionModal,
        upgradeSubscription,
        cancelSubscription,
        watchProgress,
        updateWatchProgress,
        toggleWatchlist,
        isInWatchlist,
        toggleFavorite,
        isFavorite,
        offlineEpisodes,
        downloadEpisode,
        deleteOfflineEpisode,
        isEpisodeDownloaded,
        isOfflineMode,
        setIsOfflineMode,
        syncedDevices,
        syncAllDevices,
        isSyncing,
        comments,
        addComment,
        toggleCommentLike,
        sentEmails,
        dispatchReleaseEmail,
        uploadAdminEpisode,
        uploadAdminSeries,
        uploadFullSeriesWithEpisodes,
        deleteAdminSeries,
        deleteAdminEpisode,
        notifications,
        markNotificationAsRead,
        togglePushNotifications,
        toggleEmailAlerts,
        searchQuery,
        setSearchQuery,
        selectedGenre,
        setSelectedGenre,
        isSearchOpen,
        setIsSearchOpen,
        isAiAdvisorOpen,
        setIsAiAdvisorOpen,
        activeView,
        setActiveView,
        selectedSeriesDetail,
        openSeriesDetail,
        darkMode,
        setDarkMode
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

export type QualityTier = '4k' | '1080p' | '720p' | '480p';

export interface StreamQuality {
  resolution: string; // e.g. "4K UHD", "1080p FHD", "720p HD", "480p SD"
  qualityKey: QualityTier;
  url: string;
  fileSize: string; // e.g. "1.8 GB", "650 MB"
  bitrate: string; // e.g. "15 Mbps", "6 Mbps"
  isVipRequired: boolean;
}

export interface Episode {
  id: string;
  seriesId: string;
  episodeNumber: number;
  title: string;
  duration: number; // in seconds, e.g. 1420 (23m 40s)
  synopsis: string;
  thumbnail: string;
  streams: {
    [key in QualityTier]?: StreamQuality;
  };
  isVipOnly?: boolean;
  releaseDate: string;
  introStart?: number;
  introEnd?: number;
  views: number;
}

export interface AnimeSeries {
  id: string;
  title: string;
  romajiTitle: string;
  synopsis: string;
  coverImage: string;
  bannerImage: string;
  genres: string[];
  studio: string;
  rating: number; // e.g. 4.9
  releaseYear: number;
  season: 'Spring' | 'Summer' | 'Fall' | 'Winter';
  status: 'Airing' | 'Completed' | 'Upcoming';
  episodesCount: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isVipExclusive?: boolean;
  episodes: Episode[];
  audioOptions: ('Sub' | 'Dub')[];
}

export type SubscriptionPlan = 'free' | 'otaku_vip' | 'kami_vip';

export interface UserSubscription {
  plan: SubscriptionPlan;
  status: 'active' | 'inactive';
  expiresAt: string;
  autoRenew: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  subscription: UserSubscription;
  joinedDate: string;
  watchlist: string[]; // series IDs
  favorites: string[]; // series IDs
  downloadedEpisodeIds: string[];
  pushNotificationsEnabled: boolean;
  emailAlertsEnabled: boolean;
  cloudSyncEnabled: boolean;
  lastSyncedAt: string;
}

export interface WatchProgress {
  seriesId: string;
  episodeId: string;
  timestamp: number; // seconds
  duration: number;
  completed: boolean;
  lastWatched: string; // ISO date
  selectedQuality: QualityTier;
}

export interface CommentItem {
  id: string;
  episodeId: string;
  author: string;
  avatar: string;
  text: string;
  isSpoiler: boolean;
  likes: number;
  userLiked?: boolean;
  createdAt: string;
  badge?: 'VIP' | 'CREATOR' | 'OTAKU';
}

export interface SyncedDevice {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet' | 'tv';
  lastActive: string;
  isCurrent: boolean;
}

export interface OfflineEpisode {
  episodeId: string;
  seriesId: string;
  seriesTitle: string;
  episodeTitle: string;
  episodeNumber: number;
  thumbnail: string;
  quality: QualityTier;
  fileSize: string;
  downloadedAt: string;
  blobUrl?: string;
  duration: number;
}

export interface SentEmailLog {
  id: string;
  subject: string;
  seriesTitle: string;
  episodeTitle: string;
  recipientAudience: 'All Subscribers' | 'VIP Members Only';
  recipientCount: number;
  sentAt: string;
  previewSnippet: string;
}

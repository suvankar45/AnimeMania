import { AnimeSeries, SyncedDevice, SentEmailLog } from '../types/anime';

// Real playable sample anime & cinematic streams that work seamlessly in HTML5 <video>
export const SAMPLE_VIDEO_STREAMS = {
  // Sintel (Anime-inspired 4K fantasy open movie by Blender Foundation)
  sintel: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  // Tears of Steel (Sci-Fi Cyberpunk VFX action)
  tearsOfSteel: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  // Big Buck Bunny (High framerate animated adventure)
  bunny: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  // Elephants Dream (Surreal mecha/cyber fantasy)
  elephantsDream: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  // For Bigger Blazes (Fast action animation)
  blazes: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
};

export const INITIAL_ANIME_SERIES: AnimeSeries[] = [
  {
    id: 'cyber-chronicles',
    title: 'Cyber Valkyrie: Neo Shibuya',
    romajiTitle: 'Saibā Varukirī: Shin Shibuya',
    synopsis: 'In year 2088 Neo-Tokyo, rogue bio-hacker Ren unlocks the legendary Valkyrie mainframe, unleashing digital phantoms that threaten to overwrite human consciousness. With a cybernetic katana and neon overclock abilities, she must fight the megalithic Arasaka syndicate.',
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1600&q=80',
    genres: ['Cyberpunk', 'Action', 'Sci-Fi', 'Psychological'],
    studio: 'Mappa x Trigger Core',
    rating: 4.95,
    releaseYear: 2026,
    season: 'Fall',
    status: 'Airing',
    episodesCount: 12,
    isFeatured: true,
    isTrending: true,
    isVipExclusive: false,
    audioOptions: ['Sub', 'Dub'],
    episodes: [
      {
        id: 'cv-ep1',
        seriesId: 'cyber-chronicles',
        episodeNumber: 1,
        title: 'Ghost in the Neon Veins',
        duration: 888,
        synopsis: 'Ren infiltrates the high-security server core of Section 9, triggering an automated purge protocol.',
        thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
        releaseDate: '2026-10-14',
        introStart: 12,
        introEnd: 95,
        views: 248900,
        streams: {
          '4k': {
            resolution: '4K UHD (2160p HDR)',
            qualityKey: '4k',
            url: SAMPLE_VIDEO_STREAMS.tearsOfSteel,
            fileSize: '1.85 GB',
            bitrate: '18.4 Mbps',
            isVipRequired: true
          },
          '1080p': {
            resolution: '1080p FHD (60fps)',
            qualityKey: '1080p',
            url: SAMPLE_VIDEO_STREAMS.tearsOfSteel,
            fileSize: '680 MB',
            bitrate: '6.2 Mbps',
            isVipRequired: true
          },
          '720p': {
            resolution: '720p HD',
            qualityKey: '720p',
            url: SAMPLE_VIDEO_STREAMS.tearsOfSteel,
            fileSize: '310 MB',
            bitrate: '3.1 Mbps',
            isVipRequired: false
          },
          '480p': {
            resolution: '480p SD (Free Bandwidth)',
            qualityKey: '480p',
            url: SAMPLE_VIDEO_STREAMS.tearsOfSteel,
            fileSize: '120 MB',
            bitrate: '1.4 Mbps',
            isVipRequired: false
          }
        }
      },
      {
        id: 'cv-ep2',
        seriesId: 'cyber-chronicles',
        episodeNumber: 2,
        title: 'Overclock Protocol: Zero Pulse',
        duration: 734,
        synopsis: 'Cornered by neural bounty hunters, Ren pushes her synthetic heart past 400% clock speed.',
        thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
        releaseDate: '2026-10-21',
        introStart: 10,
        introEnd: 92,
        views: 198400,
        streams: {
          '4k': {
            resolution: '4K UHD (2160p HDR)',
            qualityKey: '4k',
            url: SAMPLE_VIDEO_STREAMS.sintel,
            fileSize: '1.62 GB',
            bitrate: '17.8 Mbps',
            isVipRequired: true
          },
          '1080p': {
            resolution: '1080p FHD (60fps)',
            qualityKey: '1080p',
            url: SAMPLE_VIDEO_STREAMS.sintel,
            fileSize: '590 MB',
            bitrate: '5.8 Mbps',
            isVipRequired: true
          },
          '720p': {
            resolution: '720p HD',
            qualityKey: '720p',
            url: SAMPLE_VIDEO_STREAMS.sintel,
            fileSize: '280 MB',
            bitrate: '2.9 Mbps',
            isVipRequired: false
          },
          '480p': {
            resolution: '480p SD (Free Bandwidth)',
            qualityKey: '480p',
            url: SAMPLE_VIDEO_STREAMS.sintel,
            fileSize: '115 MB',
            bitrate: '1.2 Mbps',
            isVipRequired: false
          }
        }
      },
      {
        id: 'cv-ep3',
        seriesId: 'cyber-chronicles',
        episodeNumber: 3,
        title: 'Fractured Mirrors of Shinjuku',
        duration: 810,
        synopsis: 'A mysterious ally with quantum illusion gear offers an alliance, but at a dangerous cost.',
        thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
        releaseDate: '2026-10-28',
        introStart: 15,
        introEnd: 97,
        views: 165200,
        streams: {
          '4k': {
            resolution: '4K UHD (2160p HDR)',
            qualityKey: '4k',
            url: SAMPLE_VIDEO_STREAMS.tearsOfSteel,
            fileSize: '1.75 GB',
            bitrate: '18.1 Mbps',
            isVipRequired: true
          },
          '1080p': {
            resolution: '1080p FHD (60fps)',
            qualityKey: '1080p',
            url: SAMPLE_VIDEO_STREAMS.tearsOfSteel,
            fileSize: '620 MB',
            bitrate: '6.0 Mbps',
            isVipRequired: true
          },
          '720p': {
            resolution: '720p HD',
            qualityKey: '720p',
            url: SAMPLE_VIDEO_STREAMS.tearsOfSteel,
            fileSize: '290 MB',
            bitrate: '3.0 Mbps',
            isVipRequired: false
          },
          '480p': {
            resolution: '480p SD (Free Bandwidth)',
            qualityKey: '480p',
            url: SAMPLE_VIDEO_STREAMS.tearsOfSteel,
            fileSize: '118 MB',
            bitrate: '1.3 Mbps',
            isVipRequired: false
          }
        }
      }
    ]
  },
  {
    id: 'abyssal-monarch',
    title: 'Shadow Sovereign: Awakening',
    romajiTitle: 'Kage no Kunshu: Kakusei',
    synopsis: 'The weakest E-Rank dungeon hunter Jin accidentally discovers a hidden crypt where primordial monarchs once slumbered. Granted the mysterious "System" interface, he alone can see hidden quests, level up without limits, and extract shadowy soldiers from slain beasts.',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
    genres: ['Dark Fantasy', 'Action', 'Supernatural', 'Shonen'],
    studio: 'A-1 Pictures & Ufotable Tech',
    rating: 4.98,
    releaseYear: 2026,
    season: 'Winter',
    status: 'Airing',
    episodesCount: 24,
    isFeatured: true,
    isTrending: true,
    audioOptions: ['Sub', 'Dub'],
    episodes: [
      {
        id: 'sm-ep1',
        seriesId: 'abyssal-monarch',
        episodeNumber: 1,
        title: 'The Dual Dungeon Sacraments',
        duration: 940,
        synopsis: 'Trapped inside a double lair with colossus stone sentinels, Jin faces certain death before the trial system boots.',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        releaseDate: '2026-01-08',
        introStart: 15,
        introEnd: 98,
        views: 412000,
        streams: {
          '4k': {
            resolution: '4K UHD (2160p HDR)',
            qualityKey: '4k',
            url: SAMPLE_VIDEO_STREAMS.sintel,
            fileSize: '2.1 GB',
            bitrate: '22.0 Mbps',
            isVipRequired: true
          },
          '1080p': {
            resolution: '1080p FHD (60fps)',
            qualityKey: '1080p',
            url: SAMPLE_VIDEO_STREAMS.sintel,
            fileSize: '750 MB',
            bitrate: '7.5 Mbps',
            isVipRequired: true
          },
          '720p': {
            resolution: '720p HD',
            qualityKey: '720p',
            url: SAMPLE_VIDEO_STREAMS.sintel,
            fileSize: '360 MB',
            bitrate: '3.4 Mbps',
            isVipRequired: false
          },
          '480p': {
            resolution: '480p SD',
            qualityKey: '480p',
            url: SAMPLE_VIDEO_STREAMS.sintel,
            fileSize: '140 MB',
            bitrate: '1.4 Mbps',
            isVipRequired: false
          }
        }
      },
      {
        id: 'sm-ep2',
        seriesId: 'abyssal-monarch',
        episodeNumber: 2,
        title: 'Daily Quest: Survive the Penalty Zone',
        duration: 860,
        synopsis: 'Failing to complete his daily pushups and sprint penalty drops Jin into a scorching desert filled with giant sand worms.',
        thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
        releaseDate: '2026-01-15',
        introStart: 10,
        introEnd: 92,
        views: 389000,
        streams: {
          '4k': {
            resolution: '4K UHD (2160p HDR)',
            qualityKey: '4k',
            url: SAMPLE_VIDEO_STREAMS.tearsOfSteel,
            fileSize: '1.9 GB',
            bitrate: '19.0 Mbps',
            isVipRequired: true
          },
          '1080p': {
            resolution: '1080p FHD (60fps)',
            qualityKey: '1080p',
            url: SAMPLE_VIDEO_STREAMS.tearsOfSteel,
            fileSize: '710 MB',
            bitrate: '6.8 Mbps',
            isVipRequired: true
          },
          '720p': {
            resolution: '720p HD',
            qualityKey: '720p',
            url: SAMPLE_VIDEO_STREAMS.tearsOfSteel,
            fileSize: '340 MB',
            bitrate: '3.2 Mbps',
            isVipRequired: false
          },
          '480p': {
            resolution: '480p SD',
            qualityKey: '480p',
            url: SAMPLE_VIDEO_STREAMS.tearsOfSteel,
            fileSize: '130 MB',
            bitrate: '1.3 Mbps',
            isVipRequired: false
          }
        }
      }
    ]
  },
  {
    id: 'sakura-chronicles',
    title: 'Celestial Blade: Moonlit Reverie',
    romajiTitle: 'Gekka no Yaiba',
    synopsis: 'During the twilight of the Edo period, an ethereal spirit guardian bonds with a gentle shrine maiden who can weave celestial starlight into deadly crystalline dual blades.',
    coverImage: 'https://images.unsplash.com/photo-1569701813229-33284b643e3c?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1600&q=80',
    genres: ['Fantasy', 'Romance', 'Historical', 'Martial Arts'],
    studio: 'Kyoto Animation',
    rating: 4.89,
    releaseYear: 2025,
    season: 'Spring',
    status: 'Completed',
    episodesCount: 13,
    audioOptions: ['Sub', 'Dub'],
    episodes: [
      {
        id: 'cb-ep1',
        seriesId: 'sakura-chronicles',
        episodeNumber: 1,
        title: 'Where Petals Fall Like Starlight',
        duration: 820,
        synopsis: 'Koyuki inherits her grandmother sacred mirror, awakening the dormant moon fox guardian.',
        thumbnail: 'https://images.unsplash.com/photo-1569701813229-33284b643e3c?auto=format&fit=crop&w=800&q=80',
        releaseDate: '2025-04-05',
        introStart: 14,
        introEnd: 95,
        views: 184500,
        streams: {
          '4k': {
            resolution: '4K UHD (2160p HDR)',
            qualityKey: '4k',
            url: SAMPLE_VIDEO_STREAMS.bunny,
            fileSize: '1.7 GB',
            bitrate: '18.0 Mbps',
            isVipRequired: true
          },
          '1080p': {
            resolution: '1080p FHD (60fps)',
            qualityKey: '1080p',
            url: SAMPLE_VIDEO_STREAMS.bunny,
            fileSize: '620 MB',
            bitrate: '6.0 Mbps',
            isVipRequired: true
          },
          '720p': {
            resolution: '720p HD',
            qualityKey: '720p',
            url: SAMPLE_VIDEO_STREAMS.bunny,
            fileSize: '300 MB',
            bitrate: '3.0 Mbps',
            isVipRequired: false
          },
          '480p': {
            resolution: '480p SD',
            qualityKey: '480p',
            url: SAMPLE_VIDEO_STREAMS.bunny,
            fileSize: '120 MB',
            bitrate: '1.2 Mbps',
            isVipRequired: false
          }
        }
      }
    ]
  },
  {
    id: 'orbital-titan',
    title: 'Titan Core: Infinite Stratos',
    romajiTitle: 'Mugen Kōkū: Taitankoa',
    synopsis: 'Deep space mining colony Station 4 is besieged by void leviathans. A young ace pilot synchronizes with an ancient biomechanical mecha chassis that responds only to neural emotional spikes.',
    coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
    genres: ['Mecha', 'Sci-Fi', 'Space', 'Action'],
    studio: 'Sunrise Beyond',
    rating: 4.82,
    releaseYear: 2026,
    season: 'Summer',
    status: 'Airing',
    episodesCount: 12,
    audioOptions: ['Sub'],
    episodes: [
      {
        id: 'ot-ep1',
        seriesId: 'orbital-titan',
        episodeNumber: 1,
        title: 'First Ignition in the Void',
        duration: 790,
        synopsis: 'When sirens roar across District 7, Kai leaps into the cockpit of the forbidden Unit 00.',
        thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
        releaseDate: '2026-07-02',
        introStart: 8,
        introEnd: 90,
        views: 142000,
        streams: {
          '4k': {
            resolution: '4K UHD (2160p HDR)',
            qualityKey: '4k',
            url: SAMPLE_VIDEO_STREAMS.elephantsDream,
            fileSize: '1.8 GB',
            bitrate: '18.5 Mbps',
            isVipRequired: true
          },
          '1080p': {
            resolution: '1080p FHD',
            qualityKey: '1080p',
            url: SAMPLE_VIDEO_STREAMS.elephantsDream,
            fileSize: '640 MB',
            bitrate: '6.2 Mbps',
            isVipRequired: true
          },
          '720p': {
            resolution: '720p HD',
            qualityKey: '720p',
            url: SAMPLE_VIDEO_STREAMS.elephantsDream,
            fileSize: '310 MB',
            bitrate: '3.1 Mbps',
            isVipRequired: false
          },
          '480p': {
            resolution: '480p SD',
            qualityKey: '480p',
            url: SAMPLE_VIDEO_STREAMS.elephantsDream,
            fileSize: '125 MB',
            bitrate: '1.3 Mbps',
            isVipRequired: false
          }
        }
      }
    ]
  },
  {
    id: 'tokyo-exorcist',
    title: 'Grimoire of the Blood Moon',
    romajiTitle: 'Ketsumetsu no Madousho',
    synopsis: 'A high school detective burdened by a family curse uncovers supernatural seal cracks across modern Roppongi. Armed with ancient talisman spells and cursed weapon arts, he leads the Twilight Bureau.',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=80',
    genres: ['Supernatural', 'Dark Fantasy', 'Mystery', 'Shonen'],
    studio: 'Bones',
    rating: 4.91,
    releaseYear: 2026,
    season: 'Fall',
    status: 'Airing',
    episodesCount: 24,
    audioOptions: ['Sub', 'Dub'],
    episodes: [
      {
        id: 'te-ep1',
        seriesId: 'tokyo-exorcist',
        episodeNumber: 1,
        title: 'Talisman Sealed in Crimson Ash',
        duration: 840,
        synopsis: 'An antique shop burglary turns deadly when an unsealed cursed scroll breathes life into shadows.',
        thumbnail: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
        releaseDate: '2026-10-09',
        introStart: 12,
        introEnd: 94,
        views: 210500,
        streams: {
          '4k': {
            resolution: '4K UHD (2160p HDR)',
            qualityKey: '4k',
            url: SAMPLE_VIDEO_STREAMS.blazes,
            fileSize: '1.65 GB',
            bitrate: '17.5 Mbps',
            isVipRequired: true
          },
          '1080p': {
            resolution: '1080p FHD',
            qualityKey: '1080p',
            url: SAMPLE_VIDEO_STREAMS.blazes,
            fileSize: '590 MB',
            bitrate: '5.9 Mbps',
            isVipRequired: true
          },
          '720p': {
            resolution: '720p HD',
            qualityKey: '720p',
            url: SAMPLE_VIDEO_STREAMS.blazes,
            fileSize: '290 MB',
            bitrate: '2.9 Mbps',
            isVipRequired: false
          },
          '480p': {
            resolution: '480p SD',
            qualityKey: '480p',
            url: SAMPLE_VIDEO_STREAMS.blazes,
            fileSize: '115 MB',
            bitrate: '1.2 Mbps',
            isVipRequired: false
          }
        }
      }
    ]
  }
];

export const INITIAL_SYNCED_DEVICES: SyncedDevice[] = [
  {
    id: 'dev-1',
    name: 'Chrome on Windows 11 (This Device)',
    type: 'desktop',
    lastActive: 'Just now',
    isCurrent: true
  },
  {
    id: 'dev-2',
    name: 'Anime Mania Mobile (iPhone 16 Pro Max)',
    type: 'mobile',
    lastActive: '12 minutes ago',
    isCurrent: false
  },
  {
    id: 'dev-3',
    name: 'iPad Pro 12.9" Retina (Bedside)',
    type: 'tablet',
    lastActive: 'Yesterday, 11:42 PM',
    isCurrent: false
  }
];

export const INITIAL_SENT_EMAILS: SentEmailLog[] = [
  {
    id: 'email-1',
    subject: '⚡ New Release Alert: Cyber Valkyrie Episode 3 is LIVE in 4K HDR!',
    seriesTitle: 'Cyber Valkyrie: Neo Shibuya',
    episodeTitle: 'Fractured Mirrors of Shinjuku',
    recipientAudience: 'All Subscribers',
    recipientCount: 14280,
    sentAt: '2026-10-28 18:00 JST',
    previewSnippet: 'Experience Ren next lethal duel with Shinjuku phantom syndicate. VIP subscribers can stream in full 4K UHD or download offline now!'
  },
  {
    id: 'email-2',
    subject: '⚔️ VIP Early Access: Shadow Sovereign Episode 2 Unlocked!',
    seriesTitle: 'Shadow Sovereign: Awakening',
    episodeTitle: 'Daily Quest: Survive the Penalty Zone',
    recipientAudience: 'VIP Members Only',
    recipientCount: 5120,
    sentAt: '2026-01-15 00:00 JST',
    previewSnippet: 'Your Kami VIP pass grants you 48-hour early streaming of the most intense battle of the season. No ads, pure 60fps.'
  }
];

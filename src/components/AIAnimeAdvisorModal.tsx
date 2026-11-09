import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Play, 
  Bot, 
  User, 
  Crown, 
  Flame, 
  Compass, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { useApp } from '../context/AppContext';
import { AnimeSeries } from '../types/anime';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  recommendedAnimeId?: string;
}

export const AIAnimeAdvisorModal: React.FC = () => {
  const { 
    isAiAdvisorOpen, 
    setIsAiAdvisorOpen, 
    seriesList, 
    playEpisode,
    openSeriesDetail,
    user 
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Konnichiwa, ${user.name}! 🌸 I'm your Anime Mania AI Concierge. Tell me your mood, favorite tropes, or genres (e.g. "I want intense 4K sword fights with dark fantasy vibe" or "Explain Cyber Valkyrie lore"), and I will curate the best stream for you!`,
    }
  ]);

  if (!isAiAdvisorOpen) return null;

  const quickPrompts = [
    'Recommend something with cyberpunk aesthetics and high-speed action',
    'I want a dark fantasy anime like Solo Leveling with leveling up',
    'Give me an anime with beautiful celestial visuals and romance',
    'Which anime has the best 4K HDR animation right now?'
  ];

  const handleSend = async (queryToSend?: string) => {
    const text = queryToSend || inputQuery;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      // Catalog context for Gemini
      const catalogSummary = seriesList.map(s => 
        `- "${s.title}" (ID: ${s.id}): Genres: ${s.genres.join(', ')}. Synopsis: ${s.synopsis}. Rating: ${s.rating}. Studio: ${s.studio}`
      ).join('\n');

      let replyContent = '';
      let matchedAnimeId: string | undefined;

      const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;

      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const systemPrompt = `You are Anime Mania AI, an expert, enthusiastic anime streaming advisor. You assist users in finding anime from the Anime Mania platform catalog. 
The platform offers 4K UHD and 1080p FHD streams. VIP subscribers enjoy ad-free 4K downloads.
Current Anime Mania catalog:
${catalogSummary}

Rules:
1. Answer in 2-4 friendly, evocative sentences matching an anime otaku aesthetic.
2. Directly mention one or two titles from the catalog that match the user's request.
3. If relevant, output on a new line at the end: [MATCH: anime-id] using the exact ID from the catalog.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser request: "${text}"` }] }
          ]
        });

        replyContent = response.text || 'I recommend checking out Cyber Valkyrie: Neo Shibuya in 4K HDR!';
        
        // Extract matched ID if present
        const matchRegex = /\[MATCH:\s*([a-zA-Z0-9-]+)\]/;
        const match = replyContent.match(matchRegex);
        if (match && match[1]) {
          matchedAnimeId = match[1].trim();
          replyContent = replyContent.replace(matchRegex, '').trim();
        }
      } else {
        // Smart contextual fallback based on keyword matching
        const lower = text.toLowerCase();
        let picked = seriesList[0];

        if (lower.includes('cyber') || lower.includes('sci-fi') || lower.includes('shibuya') || lower.includes('action')) {
          picked = seriesList.find(s => s.id === 'cyber-chronicles') || seriesList[0];
          replyContent = `If you crave high-octane cyberpunk with neon overclock battles, **Cyber Valkyrie: Neo Shibuya** is an absolute masterpiece! Episode 1 has jaw-dropping 60fps katana duels available in 4K HDR.`;
        } else if (lower.includes('level') || lower.includes('shadow') || lower.includes('dark fantasy') || lower.includes('monarch')) {
          picked = seriesList.find(s => s.id === 'abyssal-monarch') || seriesList[1];
          replyContent = `You need to watch **Shadow Sovereign: Awakening**! Jin's transition from E-Rank hunter to monarch with the double dungeon system is sheer hype, especially in uncompressed 4K bitrate.`;
        } else if (lower.includes('romance') || lower.includes('blade') || lower.includes('celestial') || lower.includes('sword')) {
          picked = seriesList.find(s => s.id === 'sakura-chronicles') || seriesList[2];
          replyContent = `For ethereal visuals and heart-stirring romance, **Celestial Blade: Moonlit Reverie** has Kyoto-level starlight animation with celestial dual blades.`;
        } else if (lower.includes('mecha') || lower.includes('space') || lower.includes('robot')) {
          picked = seriesList.find(s => s.id === 'orbital-titan') || seriesList[3];
          replyContent = `Check out **Titan Core: Infinite Stratos**! Epic biomechanical mecha combat in the deep cosmos against void leviathans.`;
        } else {
          picked = seriesList[0];
          replyContent = `Based on your request, I strongly recommend **${picked.title}**! It holds a ${picked.rating} rating on Anime Mania and features top-tier production by ${picked.studio}.`;
        }
        matchedAnimeId = picked.id;
      }

      // If matchedAnimeId not found by regex, find by title mention
      if (!matchedAnimeId) {
        const found = seriesList.find(s => replyContent.toLowerCase().includes(s.title.toLowerCase()));
        if (found) matchedAnimeId = found.id;
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: replyContent,
        recommendedAnimeId: matchedAnimeId
      }]);

    } catch (err) {
      // Fallback response
      const fallbackSeries = seriesList[0];
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I've analyzed our 4K catalog for your prompt! You'll love **${fallbackSeries.title}**—it features breathtaking animation, fluid combat, and full 4K HDR streaming.`,
        recommendedAnimeId: fallbackSeries.id
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col h-[650px] max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-rose-500 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
            </div>
            <div>
              <h3 className="font-heading font-bold text-white text-base flex items-center gap-1.5">
                Anime Mania AI Recommender
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono border border-purple-500/30">
                  Gemini 2.5
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Intelligent anime recommendation & episode recap engine</p>
            </div>
          </div>

          <button 
            onClick={() => setIsAiAdvisorOpen(false)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            const matchedSeries = msg.recommendedAnimeId ? seriesList.find(s => s.id === msg.recommendedAnimeId) : null;

            return (
              <div 
                key={idx}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-3 ${isUser ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser 
                      ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white font-medium rounded-tr-none' 
                      : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                  }`}>
                    {msg.content}
                  </div>

                  {/* If assistant recommended an anime, show interactive Stream Card */}
                  {matchedSeries && (
                    <div className="p-3 rounded-2xl bg-slate-950 border border-purple-500/40 shadow-xl flex items-center justify-between gap-3 animate-in fade-in">
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={matchedSeries.coverImage} 
                          alt={matchedSeries.title} 
                          className="w-12 h-16 rounded-xl object-cover shrink-0" 
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] font-mono text-purple-400 font-bold">Recommended Stream</span>
                          <h5 className="font-bold text-white text-xs truncate">{matchedSeries.title}</h5>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                            <span className="text-amber-400">⭐ {matchedSeries.rating}</span>
                            <span>•</span>
                            <span className="text-cyan-400">4K HDR</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            if (matchedSeries.episodes[0]) {
                              playEpisode(matchedSeries, matchedSeries.episodes[0]);
                              setIsAiAdvisorOpen(false);
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1"
                        >
                          <Play className="w-3 h-3 fill-white" />
                          <span>Stream 4K</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <span>Anime Mania AI is reasoning through the 4K anime catalog...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-slate-500 text-[10px] font-mono uppercase font-bold shrink-0">Ask AI:</span>
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 whitespace-nowrap transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about anime, plot twists, 4K quality, recommendations..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>

      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Video, Heart, MessageSquare, Send, Users, Sparkles, Radio, DollarSign } from 'lucide-react';
import { soundEngine } from '../../../audio/soundEngine';

interface StreamComment {
  id: string;
  user: string;
  text: string;
  badge?: string;
}

interface StreamLiveAppProps {
  onEarnNaira: (amount: number) => void;
}

export const StreamLiveApp: React.FC<StreamLiveAppProps> = ({ onEarnNaira }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [viewerCount, setViewerCount] = useState(1420);
  const [hearts, setHearts] = useState(580);
  const [streamTitle, setStreamTitle] = useState('Cruising Nassarawa GRA in the Convoy 🏎️🇳🇬');
  const [comments, setComments] = useState<StreamComment[]>([
    { id: '1', user: 'Zainab_Bello', text: 'OMG that G63 exhaust sound! 🔥', badge: 'Creator' },
    { id: '2', user: 'Bompai_Trader', text: 'Alhaji moving with maximum security today!', badge: 'VIP' },
    { id: '3', user: 'Kano_Youth', text: 'Sai Baba! Please spray some Naira on live stream! 🙌' },
  ]);
  const [userInput, setUserInput] = useState('');

  // Simulate dynamic live stream comments and viewer count
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      setViewerCount((v) => v + Math.floor(Math.random() * 25) - 8);
      setHearts((h) => h + Math.floor(Math.random() * 8));

      // Occasional random gifts from viewers
      if (Math.random() > 0.65) {
        const giftAmt = [10000, 25000, 50000, 100000][Math.floor(Math.random() * 4)];
        onEarnNaira(giftAmt);
        soundEngine.playCashSound();
        setComments((prev) => [
          ...prev.slice(-8),
          {
            id: String(Date.now()),
            user: 'Fan_from_SabonGari',
            text: `🎁 Sent ₦${giftAmt.toLocaleString()} Lion Gift! Keep shining Alhaji!`,
            badge: 'Top Donor',
          },
        ]);
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [isStreaming, onEarnNaira]);

  const handleStartStream = () => {
    setIsStreaming(true);
    soundEngine.playPhoneChime();
  };

  const handleStopStream = () => {
    setIsStreaming(false);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setComments((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        user: 'You (Host)',
        text: userInput.trim(),
        badge: 'HOST',
      },
    ]);
    setUserInput('');
  };

  const handleAddHeart = () => {
    setHearts((h) => h + 10);
    soundEngine.playFootstep();
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white select-none">
      {/* Top Bar */}
      <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-black tracking-wider text-red-500 uppercase flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-red-500" />
            <span>KANOTOK LIVE · 24/7 STREAMING</span>
          </h2>
          <p className="text-[10px] text-zinc-400">
            Broadcast live to millions across Kano, Lagos, and Abuja
          </p>
        </div>

        <button
          onClick={isStreaming ? handleStopStream : handleStartStream}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ${
            isStreaming
              ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
              : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>{isStreaming ? 'End Live' : 'Go Live Now'}</span>
        </button>
      </div>

      {/* Main Stream Viewport */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Stream Camera Background / Simulation */}
        <div className="relative flex-1 bg-gradient-to-br from-zinc-900 via-neutral-900 to-zinc-950 flex flex-col justify-between p-3 overflow-hidden">
          {/* Live Overlay badges */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-600 text-white flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white" /> LIVE
              </span>
              <span className="text-[10px] font-semibold text-zinc-300 bg-black/60 px-2 py-0.5 rounded flex items-center gap-1">
                <Users className="w-3 h-3 text-zinc-400" />
                <span className="tabular-nums">{viewerCount.toLocaleString()}</span>
              </span>
            </div>

            <button
              onClick={handleAddHeart}
              className="px-2.5 py-1 bg-pink-600 hover:bg-pink-500 text-white rounded-full text-xs font-bold flex items-center gap-1 shadow-lg shadow-pink-600/30"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>{hearts.toLocaleString()}</span>
            </button>
          </div>

          {/* Broadcast stream subject card */}
          <div className="my-auto text-center z-10 py-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-black font-black text-xl mb-2 shadow-xl shadow-amber-500/20">
              🇳🇬
            </div>
            <h3 className="text-sm font-black text-white px-4 leading-tight">{streamTitle}</h3>
            <div className="text-[11px] text-amber-400 font-medium mt-1">
              Broadcasting from Nassarawa GRA, Kano State
            </div>
            {!isStreaming && (
              <div className="text-[11px] text-zinc-400 mt-2">
                Tap <strong>Go Live Now</strong> to start receiving viewer gifts & live chat!
              </div>
            )}
          </div>

          {/* Floating live comments feed */}
          <div className="max-h-48 overflow-y-auto space-y-1.5 z-10 pr-1">
            {comments.map((c) => (
              <div
                key={c.id}
                className="bg-black/65 backdrop-blur-sm px-2.5 py-1.5 rounded-xl border border-white/10 text-xs w-fit max-w-[90%]"
              >
                <div className="flex items-center gap-1.5 text-[10px]">
                  <strong className="text-amber-400">{c.user}</strong>
                  {c.badge && (
                    <span className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold text-[8px]">
                      {c.badge}
                    </span>
                  )}
                </div>
                <div className="text-zinc-100 text-[11px] mt-0.5">{c.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live chat input bar */}
        <form onSubmit={handleSendComment} className="p-2.5 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type comment to stream audience..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-red-500"
          />
          <button
            type="submit"
            className="p-2 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-all shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

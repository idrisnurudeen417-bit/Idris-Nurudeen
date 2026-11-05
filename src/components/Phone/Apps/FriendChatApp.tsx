import React, { useState } from 'react';
import { UserCheck, Search, Send, Mic, Play, Pause, DollarSign, ShieldAlert, CheckCheck, Sparkles } from 'lucide-react';
import { soundEngine } from '../../../audio/soundEngine';

interface FriendMessage {
  id: string;
  sender: 'me' | 'friend';
  type: 'text' | 'voice_note' | 'money_transfer';
  text?: string;
  voiceDuration?: string;
  transferAmount?: number;
  time: string;
}

interface FriendChatAppProps {
  cashBalance: number;
  onSendMoneyToFriend: (amount: number, friendUsername: string) => boolean;
}

export const FriendChatApp: React.FC<FriendChatAppProps> = ({
  cashBalance,
  onSendMoneyToFriend,
}) => {
  const [searchUsername, setSearchUsername] = useState('');
  const [activeFriend, setActiveFriend] = useState<string | null>('dan_kano');
  const [messages, setMessages] = useState<Record<string, FriendMessage[]>>({
    dan_kano: [
      { id: '1', sender: 'friend', type: 'text', text: 'Alhaji! Where are you parked right now? Nassarawa GRA?', time: '12:45 PM' },
      { id: '2', sender: 'friend', type: 'voice_note', voiceDuration: '0:14', time: '12:46 PM' },
    ],
    aliko_m: [
      { id: '3', sender: 'friend', type: 'text', text: 'The new Bugatti in the showroom looks incredible! Let me know when you cruise out.', time: '11:20 AM' },
    ],
  });

  const [textInput, setTextInput] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [showMoneyModal, setShowMoneyModal] = useState(false);
  const [sendAmount, setSendAmount] = useState<number>(1000000000); // 1 Billion default
  const [filterWarning, setFilterWarning] = useState<string | null>(null);

  // Inappropriate content filter list
  const BANNED_TERMS = ['sex', 'porn', 'nude', 'xxx', 'escort_service', 'fuck'];

  const handleSearchFriend = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchUsername.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!clean) return;

    if (!messages[clean]) {
      setMessages((prev) => ({
        ...prev,
        [clean]: [
          {
            id: String(Date.now()),
            sender: 'friend',
            type: 'text',
            text: `Sannu aboki! Connected to @${clean} via Kano Satellite Network.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      }));
    }
    setActiveFriend(clean);
    setSearchUsername('');
    soundEngine.playPhoneChime();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || !activeFriend) return;

    // Safety Filter Check
    const lower = textInput.toLowerCase();
    const foundBadWord = BANNED_TERMS.some((term) => lower.includes(term));
    if (foundBadWord) {
      setFilterWarning('Message blocked: Content violates Kano Community Respect & Family Guidelines.');
      setTextInput('');
      setTimeout(() => setFilterWarning(null), 3000);
      return;
    }

    const newMsg: FriendMessage = {
      id: String(Date.now()),
      sender: 'me',
      type: 'text',
      text: textInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => ({
      ...prev,
      [activeFriend]: [...(prev[activeFriend] || []), newMsg],
    }));

    setTextInput('');
    soundEngine.playPhoneChime();

    // Simulated quick response from friend
    setTimeout(() => {
      const friendReplies = [
        'Ba matsala at all! I see you!',
        'Nagode kwarai! Let us meet by the Grand Square polo grounds.',
        'Wallahi you are moving like a real tycoon today!',
        'Got your message clearly, my brother!',
      ];
      const randomReply = friendReplies[Math.floor(Math.random() * friendReplies.length)];

      setMessages((prev) => ({
        ...prev,
        [activeFriend]: [
          ...(prev[activeFriend] || []),
          {
            id: String(Date.now()),
            sender: 'friend',
            type: 'text',
            text: randomReply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      }));
      soundEngine.playPhoneChime();
    }, 1800);
  };

  const handleToggleVoiceNote = () => {
    if (!activeFriend) return;

    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      setRecordingSeconds(0);
      soundEngine.playFootstep();
    } else {
      setIsRecordingVoice(false);
      soundEngine.playPhoneChime();

      const newVoiceMsg: FriendMessage = {
        id: String(Date.now()),
        sender: 'me',
        type: 'voice_note',
        voiceDuration: `0:${recordingSeconds < 10 ? '0' : ''}${recordingSeconds || 5}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => ({
        ...prev,
        [activeFriend]: [...(prev[activeFriend] || []), newVoiceMsg],
      }));
    }
  };

  const handleSendMoneyToFriend = () => {
    if (!activeFriend) return;

    // Strict 10,000,000,000 Max Limit rule requested by user
    const MAX_LIMIT = 10000000000; // 10,000,000,000 Naira
    if (sendAmount > MAX_LIMIT) {
      alert('Transaction Exceeded: Maximum limit is ₦10,000,000,000 per transfer! To send larger amounts like ₦100,000,000,000, please send multiple ₦10,000,000,000 batches.');
      return;
    }

    const success = onSendMoneyToFriend(sendAmount, activeFriend);
    if (!success) {
      alert('Insufficient active Naira funds in your account!');
      return;
    }

    soundEngine.playCashSound();
    setShowMoneyModal(false);

    const transferMsg: FriendMessage = {
      id: String(Date.now()),
      sender: 'me',
      type: 'money_transfer',
      transferAmount: sendAmount,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => ({
      ...prev,
      [activeFriend]: [...(prev[activeFriend] || []), transferMsg],
    }));

    // Friend receipt response
    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [activeFriend]: [
          ...(prev[activeFriend] || []),
          {
            id: String(Date.now()),
            sender: 'friend',
            type: 'text',
            text: `Alhaji! Confirming receipt of ₦${sendAmount.toLocaleString()} transfer! Masha'Allah, nagode kwarai! You are a true boss! 🙌`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      }));
      soundEngine.playPhoneChime();
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white select-none">
      {/* Header */}
      <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-black tracking-wider text-sky-400 uppercase flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-sky-400" />
            <span>PLAYER-TO-PLAYER SATELLITE CHAT</span>
          </h2>
          <p className="text-[10px] text-zinc-400">
            Search real player usernames, voice notes & ₦10,000,000,000 transfers
          </p>
        </div>

        {activeFriend && (
          <button
            onClick={() => setShowMoneyModal(true)}
            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-bold text-white flex items-center gap-1 shadow-md shadow-emerald-600/30"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Send ₦</span>
          </button>
        )}
      </div>

      {/* Search user bar */}
      <form onSubmit={handleSearchFriend} className="p-2.5 bg-zinc-900/60 border-b border-zinc-800 flex gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search username (e.g. aliko_m, dan_kano)..."
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-sky-500"
          />
        </div>
        <button
          type="submit"
          className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 rounded-xl text-xs font-bold"
        >
          Connect
        </button>
      </form>

      {/* Warning popup for banned words */}
      {filterWarning && (
        <div className="p-2 bg-red-950/90 border-b border-red-500/50 text-xs text-red-300 flex items-center gap-1.5 animate-pulse">
          <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{filterWarning}</span>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {activeFriend && messages[activeFriend] ? (
          messages[activeFriend].map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'me' ? 'items-end' : 'items-start'}`}
            >
              {m.type === 'text' && (
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'me'
                      ? 'bg-sky-600 text-white rounded-br-none shadow-md'
                      : 'bg-zinc-800 text-zinc-100 rounded-bl-none border border-zinc-700/60'
                  }`}
                >
                  {m.text}
                </div>
              )}

              {m.type === 'voice_note' && (
                <div
                  className={`px-3 py-2 rounded-2xl text-xs flex items-center gap-2 ${
                    m.sender === 'me'
                      ? 'bg-sky-600 text-white rounded-br-none'
                      : 'bg-zinc-800 text-zinc-100 rounded-bl-none border border-zinc-700/60'
                  }`}
                >
                  <button
                    onClick={() => soundEngine.playPhoneChime()}
                    className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"
                  >
                    <Play className="w-3 h-3 fill-current" />
                  </button>
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-3 bg-white/70 rounded-full animate-pulse" />
                    <span className="w-1 h-5 bg-white/90 rounded-full animate-pulse" />
                    <span className="w-1 h-2 bg-white/50 rounded-full" />
                    <span className="w-1 h-4 bg-white/80 rounded-full animate-pulse" />
                  </div>
                  <span className="text-[10px] font-mono">{m.voiceDuration}</span>
                </div>
              )}

              {m.type === 'money_transfer' && (
                <div className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-900 to-zinc-900 border border-emerald-500/50 text-xs shadow-lg">
                  <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                    Instant Inter-Player Wire
                  </div>
                  <div className="text-base font-black text-white font-mono mt-0.5">
                    ₦{m.transferAmount?.toLocaleString()}
                  </div>
                  <div className="text-[9px] text-zinc-400 mt-1">
                    Direct Settlement via Kano Trust Bank
                  </div>
                </div>
              )}

              <span className="text-[9px] text-zinc-500 mt-0.5 px-1 flex items-center gap-1">
                {m.time}
                {m.sender === 'me' && <CheckCheck className="w-3 h-3 text-sky-400" />}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center text-xs text-zinc-500 py-12">
            No active conversation. Search a friend's username above to connect!
          </div>
        )}
      </div>

      {/* Input bar with Voice Note toggle */}
      <form onSubmit={handleSendMessage} className="p-2.5 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2">
        <input
          type="text"
          placeholder={isRecordingVoice ? 'Recording voice note...' : `Message @${activeFriend || 'friend'}...`}
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          disabled={isRecordingVoice}
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-sky-500 disabled:opacity-50"
        />

        <button
          type="button"
          onClick={handleToggleVoiceNote}
          className={`p-2 rounded-xl transition-all ${
            isRecordingVoice
              ? 'bg-red-600 text-white animate-pulse'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
          title={isRecordingVoice ? 'Stop and send voice note' : 'Record voice note'}
        >
          <Mic className="w-4 h-4" />
        </button>

        <button
          type="submit"
          disabled={!textInput.trim()}
          className="p-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white disabled:opacity-40 transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Send Up to 10 Billion Naira Modal */}
      {showMoneyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
          <div className="w-full max-w-xs bg-zinc-900 border border-emerald-500/50 rounded-2xl p-4 text-white space-y-3">
            <div>
              <h3 className="text-xs font-black text-emerald-400 flex items-center gap-1.5 uppercase">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Wire Money to @{activeFriend}</span>
              </h3>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                Rule: Max limit is ₦10,000,000,000 per transfer. For ₦100,000,000,000, send 10 batches.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label: '₦1,000,000,000', val: 1000000000 },
                { label: '₦2,500,000,000', val: 2500000000 },
                { label: '₦5,000,000,000', val: 5000000000 },
                { label: '₦10,000,000,000', val: 10000000000 },
              ].map((btn) => (
                <button
                  key={btn.val}
                  type="button"
                  onClick={() => setSendAmount(btn.val)}
                  className={`py-1.5 text-[10px] font-bold rounded-lg border font-mono transition-all ${
                    sendAmount === btn.val
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : 'bg-zinc-950 text-zinc-300 border-zinc-800'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800 text-center">
              <span className="text-[10px] text-zinc-400">Total Transfer Amount:</span>
              <div className="text-base font-black text-emerald-400 font-mono">
                ₦{sendAmount.toLocaleString()}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowMoneyModal(false)}
                className="flex-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendMoneyToFriend}
                className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-bold shadow-md shadow-emerald-600/30 font-mono"
              >
                Wire ₦{sendAmount.toLocaleString()}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

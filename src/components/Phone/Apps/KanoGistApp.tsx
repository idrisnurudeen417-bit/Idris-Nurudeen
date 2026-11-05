import React, { useState } from 'react';
import { Resident } from '../../../types';
import { soundEngine } from '../../../audio/soundEngine';
import { Search, Send, Heart, DollarSign, MessageCircle, MapPin, Sparkles, CheckCheck } from 'lucide-react';

interface KanoGistAppProps {
  residents: Resident[];
  cashBalance: number;
  onSendMoney: (residentId: string, amount: number) => void;
  onUpdateResident: (updatedResident: Resident) => void;
}

export const KanoGistApp: React.FC<KanoGistAppProps> = ({
  residents,
  cashBalance,
  onSendMoney,
  onUpdateResident,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [transferAmount, setTransferAmount] = useState<number>(100000);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const filteredResidents = residents.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedResident) return;

    const userMsg = messageInput.trim();
    setMessageInput('');
    soundEngine.playPhoneChime();

    const updatedHistory = [
      ...selectedResident.chatHistory,
      {
        sender: 'user' as const,
        text: userMsg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];

    const residentWithUserMsg = { ...selectedResident, chatHistory: updatedHistory };
    setSelectedResident(residentWithUserMsg);
    onUpdateResident(residentWithUserMsg);

    setIsAiLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          residentName: selectedResident.name,
          residentRole: selectedResident.role,
          location: selectedResident.location,
          characterPrompt: selectedResident.bio,
          message: userMsg,
          history: updatedHistory,
        }),
      });

      const data = await response.json();
      const replyText = data.reply || data.fallback || 'Sannu! Nagode for reaching out, Alhaji.';

      soundEngine.playPhoneChime();

      // Check if user asked to be bae
      let updatedRelationship = selectedResident.relationship;
      if (
        userMsg.toLowerCase().includes('bae') ||
        userMsg.toLowerCase().includes('date') ||
        userMsg.toLowerCase().includes('marry') ||
        userMsg.toLowerCase().includes('love')
      ) {
        if (selectedResident.reputation >= 40) {
          updatedRelationship = 'Bae 💕';
        } else {
          updatedRelationship = 'Good Friend';
        }
      }

      const finalResident: Resident = {
        ...selectedResident,
        relationship: updatedRelationship,
        reputation: Math.min(100, selectedResident.reputation + 4),
        chatHistory: [
          ...updatedHistory,
          {
            sender: 'resident',
            text: replyText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      };

      setSelectedResident(finalResident);
      onUpdateResident(finalResident);
    } catch (err) {
      console.error(err);
      const fallbackResident: Resident = {
        ...selectedResident,
        chatHistory: [
          ...updatedHistory,
          {
            sender: 'resident',
            text: `Sannu aboki! Network has slight downtime, but ba matsala, I got your message. Talk soon!`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      };
      setSelectedResident(fallbackResident);
      onUpdateResident(fallbackResident);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSendCashGift = () => {
    if (!selectedResident) return;
    if (cashBalance < transferAmount) {
      alert('Insufficient Naira funds in your active wallet!');
      return;
    }

    onSendMoney(selectedResident.id, transferAmount);
    soundEngine.playCashSound();
    setShowTransferModal(false);

    const giftMsg = `[Sent ₦${transferAmount.toLocaleString()} Naira Instant Transfer]`;
    const thankYouReply = `Masha'Allah! Nagode kwarai for the generous ₦${transferAmount.toLocaleString()} blessing, Alhaji! May your wealth multiply abundantly!`;

    const updatedResident: Resident = {
      ...selectedResident,
      reputation: Math.min(100, selectedResident.reputation + 15),
      relationship:
        selectedResident.relationship === 'Stranger'
          ? 'Good Friend'
          : selectedResident.relationship === 'Good Friend'
          ? 'Respected Partner'
          : selectedResident.relationship,
      chatHistory: [
        ...selectedResident.chatHistory,
        {
          sender: 'user',
          text: giftMsg,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        {
          sender: 'resident',
          text: thankYouReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };

    setSelectedResident(updatedResident);
    onUpdateResident(updatedResident);
  };

  const handleAskToBeBae = () => {
    if (!selectedResident) return;
    setMessageInput(`I really admire your grace and intelligence. Would you honor me by being my Bae 💕?`);
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white select-none">
      {/* Top Header */}
      <div className="p-3 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
        {selectedResident ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedResident(null)}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 px-2 py-1 bg-zinc-800 rounded-lg"
            >
              ← Back
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center font-bold text-xs text-black">
              {selectedResident.name[0]}
            </div>
            <div>
              <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                <span>{selectedResident.name}</span>
                {selectedResident.relationship === 'Bae 💕' && (
                  <span className="text-[10px] text-pink-400 bg-pink-950/60 px-1.5 py-0.5 rounded-full border border-pink-500/40">
                    Bae 💕
                  </span>
                )}
              </div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Online in {selectedResident.location.split(',')[0]}</span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-sm font-black tracking-wide text-amber-400 flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-amber-400" />
              <span>KANO GIST · RESIDENT NETWORK</span>
            </h2>
            <p className="text-[10px] text-zinc-400">
              Live AI-powered chats with Kano figures & partners
            </p>
          </div>
        )}

        {selectedResident && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowTransferModal(true)}
              className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-[10px] font-bold flex items-center gap-1 border border-emerald-500/30"
              title="Send Naira"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Send ₦</span>
            </button>
            <button
              onClick={handleAskToBeBae}
              className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400 hover:bg-pink-500/30 text-[10px] font-bold flex items-center gap-1 border border-pink-500/30"
              title="Ask to be Bae"
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Ask Bae</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {!selectedResident ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search bar */}
          <div className="p-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search Kano residents, royals, merchants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Residents List */}
          <div className="flex-1 overflow-y-auto px-3 space-y-2">
            {filteredResidents.map((r) => (
              <div
                key={r.id}
                onClick={() => setSelectedResident(r)}
                className="p-2.5 bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800/80 rounded-xl cursor-pointer transition-all flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700 flex items-center justify-center font-bold text-sm text-black flex-shrink-0 shadow-md">
                  {r.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-100 truncate">{r.name}</span>
                    <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                      Rep {r.reputation}%
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate">{r.role}</div>
                  <div className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-zinc-500 flex-shrink-0" />
                    <span className="truncate">{r.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Resident Active Chat View */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Status pill & bio */}
          <div className="px-3 py-1.5 bg-zinc-900/50 border-b border-zinc-800/60 text-[10px] text-zinc-400 flex items-center justify-between">
            <span>Status: <strong className="text-zinc-200">{selectedResident.relationship}</strong></span>
            <span>Reputation: <strong className="text-amber-400">{selectedResident.reputation}/100</strong></span>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {selectedResident.chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[82%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-amber-600 text-white rounded-br-none shadow-md'
                      : 'bg-zinc-800 text-zinc-100 rounded-bl-none border border-zinc-700/60 shadow-md'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-zinc-500 mt-0.5 px-1 flex items-center gap-1">
                  {msg.time}
                  {msg.sender === 'user' && <CheckCheck className="w-2.5 h-2.5 text-amber-400" />}
                </span>
              </div>
            ))}

            {isAiLoading && (
              <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-zinc-900/80 px-3 py-2 rounded-xl w-fit border border-amber-500/20">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>{selectedResident.name.split(' ')[0]} is typing from {selectedResident.location.split(',')[0]}...</span>
              </div>
            )}
          </div>

          {/* Message Input Box */}
          <div className="p-2.5 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2">
            <input
              type="text"
              placeholder={`Message ${selectedResident.name.split(' ')[0]} in Kano...`}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={isAiLoading || !messageInput.trim()}
              className="p-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white disabled:opacity-40 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Naira Transfer Modal */}
      {showTransferModal && selectedResident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="w-full max-w-xs bg-zinc-900 border border-emerald-500/40 rounded-2xl p-4 text-white">
            <h3 className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" />
              <span>Send Naira to {selectedResident.name}</span>
            </h3>
            <p className="text-[11px] text-zinc-400 mb-3">
              Transfer funds from your live wallet to boost status and friendship.
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[50000, 100000, 500000, 1000000, 5000000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTransferAmount(amt)}
                  className={`py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                    transferAmount === amt
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  ₦{(amt / 1000).toFixed(0)}k
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowTransferModal(false)}
                className="flex-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendCashGift}
                className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-bold shadow-md shadow-emerald-600/30"
              >
                Transfer ₦{transferAmount.toLocaleString()}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

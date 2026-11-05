import React, { useState } from 'react';
import { GlassWater, Music, MapPin, Sparkles, Check, DollarSign, Users } from 'lucide-react';
import { soundEngine } from '../../../audio/soundEngine';

interface ClubVenue {
  id: string;
  name: string;
  city: 'Kano' | 'Lagos' | 'Port Harcourt';
  location: string;
  entryPriceNaira: number;
  tablePriceNaira: number;
  description: string;
  djSet: string;
  crowdLevel: 'Electric' | 'Exclusive VIP' | 'Packed to Capacity';
}

export const CLUBS_LIST: ClubVenue[] = [
  {
    id: 'club_lagos_quilox',
    name: 'Quilox Ultra VIP Club & Rooftop',
    city: 'Lagos',
    location: 'Ozumba Mbadiwe Ave, Victoria Island, Lagos',
    entryPriceNaira: 150000,
    tablePriceNaira: 5000000,
    description: 'The supreme temple of Lagos nightlife. Multi-level gold lounges, laser light spectacles, and bottles delivered with sparklers.',
    djSet: 'Live Afrobeats, Amapiano & Lagos Night Anthems',
    crowdLevel: 'Electric',
  },
  {
    id: 'club_ph_cubana',
    name: 'Cubana Sky Club & Maritime Lounge',
    city: 'Port Harcourt',
    location: 'Peter Odili Road, Trans-Amadi, Port Harcourt',
    entryPriceNaira: 120000,
    tablePriceNaira: 3500000,
    description: 'Where Niger Delta petroleum executives and music moguls unwind by the waterfront with live saxophone and premium vintage reserves.',
    djSet: 'Afro-Fusion, Deep House & Saxophone Grooves',
    crowdLevel: 'Packed to Capacity',
  },
  {
    id: 'club_kano_nassarawa_lounge',
    name: 'Nassarawa Horizon Skyline Lounge',
    city: 'Kano',
    location: 'Race Course Road, Nassarawa GRA, Kano',
    entryPriceNaira: 75000,
    tablePriceNaira: 2000000,
    description: 'High-status northern Nigerian VIP lounge with acoustic Tuareg-Arewa guitarists, mocktails, shisha terraces, and diplomatic networking.',
    djSet: 'Arewa Chill, Acoustic Strings & Global Lounge',
    crowdLevel: 'Exclusive VIP',
  },
];

interface ClubsAppProps {
  cashBalance: number;
  onSpendCash: (amount: number) => boolean;
  onBoostReputation: (amount: number) => void;
  onTriggerTravelCutscene: (dest: string, mode: 'convoy' | 'private_jet') => void;
}

export const ClubsApp: React.FC<ClubsAppProps> = ({
  cashBalance,
  onSpendCash,
  onBoostReputation,
  onTriggerTravelCutscene,
}) => {
  const [activeClub, setActiveClub] = useState<ClubVenue | null>(null);
  const [isPartying, setIsPartying] = useState(false);

  const handleBookTable = (club: ClubVenue) => {
    const success = onSpendCash(club.tablePriceNaira);
    if (!success) {
      alert('Insufficient Naira funds to reserve this VIP club table!');
      return;
    }
    soundEngine.playCashSound();
    onBoostReputation(10);
    setActiveClub(club);
    setIsPartying(true);
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white select-none">
      <div className="p-3 bg-gradient-to-r from-purple-950 via-zinc-900 to-pink-950 border-b border-zinc-800">
        <h2 className="text-xs font-black tracking-wider text-pink-400 uppercase flex items-center gap-1.5">
          <Music className="w-4 h-4 text-pink-400" />
          <span>VIP CLUBS & NIGHTLIFE · 15+ RESTRICTED</span>
        </h2>
        <p className="text-[10px] text-zinc-400">
          Lagos, Port Harcourt, and Kano high-society night lounges
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {isPartying && activeClub && (
          <div className="p-4 bg-gradient-to-br from-purple-900/90 to-pink-950 border border-pink-500/50 rounded-2xl animate-pulse space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-pink-300">
                🎉 NOW HOSTING VIP TABLE AT {activeClub.name.toUpperCase()}!
              </span>
              <button
                onClick={() => setIsPartying(false)}
                className="text-[10px] bg-black/50 px-2 py-0.5 rounded text-zinc-300"
              >
                Close Party
              </button>
            </div>
            <p className="text-xs text-zinc-200 italic">
              Sparklers blazing! The DJ shouts out: "Alhaji is in the building tonight! Clear the floor!"
            </p>
            <div className="text-[10px] text-amber-300 font-bold">
              +15 Social Clout & Kano/Lagos Reputation Boost!
            </div>
          </div>
        )}

        {CLUBS_LIST.map((club) => (
          <div
            key={club.id}
            className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2 hover:border-pink-500/40 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-400 border border-pink-500/30">
                  {club.city} · {club.crowdLevel}
                </span>
                <h3 className="text-xs font-black text-zinc-100 mt-1">{club.name}</h3>
                <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-zinc-500" />
                  <span>{club.location}</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-zinc-300 leading-snug">{club.description}</p>

            <div className="p-2 bg-zinc-950/70 rounded-lg text-[10px] text-pink-300 border border-zinc-800 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{club.djSet}</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
              <div>
                <div className="text-[9px] text-zinc-400">VIP Table Service:</div>
                <div className="text-xs font-black text-amber-400">
                  ₦{club.tablePriceNaira.toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {club.city !== 'Kano' && (
                  <button
                    onClick={() =>
                      onTriggerTravelCutscene(
                        club.city === 'Lagos' ? 'lagos' : 'abuja',
                        'convoy'
                      )
                    }
                    className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-semibold"
                  >
                    Travel There
                  </button>
                )}
                <button
                  onClick={() => handleBookTable(club)}
                  className="px-3 py-1.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-lg text-xs font-bold text-white shadow-md shadow-pink-600/30 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Reserve Table</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

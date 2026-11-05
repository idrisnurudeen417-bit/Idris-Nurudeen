import React from 'react';
import { Home, MapPin, Check, DollarSign, Sparkles, ShieldAlert } from 'lucide-react';
import { soundEngine } from '../../../audio/soundEngine';

export interface RealEstateItem {
  id: string;
  name: string;
  location: string;
  city: 'Kano' | 'Abuja' | 'Lagos' | 'Port Harcourt';
  priceNaira: number;
  dailyIncomeNaira: number;
  bedrooms: number;
  imageAccent: string;
  description: string;
  features: string[];
}

export const REAL_ESTATE_LIST: RealEstateItem[] = [
  {
    id: 'prop_nassarawa_gra',
    name: 'Palatial Nassarawa GRA Sovereign Estate',
    location: 'Sultan Road, Nassarawa GRA, Kano',
    city: 'Kano',
    priceNaira: 450000000,
    dailyIncomeNaira: 3500000,
    bedrooms: 8,
    imageAccent: 'from-amber-700 to-amber-900',
    description: 'Masterpiece mansion with gold-embossed Hausa arches, Olympic swimming pool, 6-car motorcade garage, and 24/7 armed private guards.',
    features: ['High-Security Perimeter Wall', 'Bespoke Majlis Living Area', 'Helipad Pad Grounding', 'Bulletproof Glass'],
  },
  {
    id: 'prop_emirs_palace_view',
    name: 'Kofar Kudu Historic Courtyard Villa',
    location: 'Emir’s Palace Enclave, Kano',
    city: 'Kano',
    priceNaira: 280000000,
    dailyIncomeNaira: 2200000,
    bedrooms: 6,
    imageAccent: 'from-orange-800 to-amber-950',
    description: 'Adjacent to the royal palace gates with traditional Zanen Gida geometric clay plaster motifs and tranquil interior courtyard.',
    features: ['Royal Heritage Rights', 'Handcrafted Cedar Doors', 'Durbar Viewing Balcony'],
  },
  {
    id: 'prop_abuja_maitama',
    name: 'Maitama Presidential Hilltop Mansion',
    location: 'Maitama Hills, Abuja FCT',
    city: 'Abuja',
    priceNaira: 1200000000,
    dailyIncomeNaira: 8500000,
    bedrooms: 10,
    imageAccent: 'from-emerald-800 to-emerald-950',
    description: 'Diplomatic sector architectural fortress with panoramic views over Aso Rock and the National Assembly.',
    features: ['Underground Bunker', '12-Car Escort Porte-Cochere', 'Private Cinema & Spa'],
  },
  {
    id: 'prop_lagos_banana_island',
    name: 'Banana Island Waterfront Sky Penthouse',
    location: 'Banana Island, Ikoyi, Lagos',
    city: 'Lagos',
    priceNaira: 1800000000,
    dailyIncomeNaira: 14000000,
    bedrooms: 6,
    imageAccent: 'from-blue-800 to-indigo-950',
    description: 'Super-luxury waterfront triplex penthouse overlooking the Lagos lagoon with private yacht dock and infinity pool.',
    features: ['Direct Yacht Berth', 'Private Keyed Elevator', 'Lagos Skyline Lounge'],
  },
  {
    id: 'prop_port_harcourt_estate',
    name: 'Old GRA Oil Executive Sanctuary',
    location: 'Old GRA, Port Harcourt, Rivers State',
    city: 'Port Harcourt',
    priceNaira: 650000000,
    dailyIncomeNaira: 4800000,
    bedrooms: 7,
    imageAccent: 'from-teal-800 to-slate-900',
    description: 'Exclusive residence favoured by petroleum magnates and maritime titans with lush gardens and executive boardroom.',
    features: ['Level 5 Reinforced Security', 'Executive Boardroom Suite', 'Full Smart Automation'],
  },
];

interface RealEstateAppProps {
  cashBalance: number;
  ownedPropertyIds: string[];
  onBuyProperty: (property: RealEstateItem) => void;
  onEnterProperty: (propertyId: string) => void;
}

export const RealEstateApp: React.FC<RealEstateAppProps> = ({
  cashBalance,
  ownedPropertyIds,
  onBuyProperty,
  onEnterProperty,
}) => {
  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white select-none">
      <div className="p-3 bg-zinc-900 border-b border-zinc-800">
        <h2 className="text-xs font-black tracking-wider text-amber-400 uppercase flex items-center gap-1.5">
          <Home className="w-4 h-4 text-amber-400" />
          <span>KANO & NIGERIA LUXURY PROPERTIES</span>
        </h2>
        <p className="text-[10px] text-zinc-400">
          Acquire prime architectural estates and collect daily rental yields
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {REAL_ESTATE_LIST.map((prop) => {
          const isOwned = ownedPropertyIds.includes(prop.id);
          const canAfford = cashBalance >= prop.priceNaira;

          return (
            <div
              key={prop.id}
              className={`p-3 rounded-xl border transition-all ${
                isOwned
                  ? 'bg-zinc-900/90 border-amber-500/40'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div
                className={`w-full h-24 rounded-lg bg-gradient-to-r ${prop.imageAccent} p-2.5 flex flex-col justify-between mb-2 shadow-inner`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 text-white border border-white/10">
                    {prop.city} · {prop.bedrooms} Beds
                  </span>
                  {isOwned && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500 text-black flex items-center gap-1">
                      <Check className="w-3 h-3" /> OWNED
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-xs font-black text-white drop-shadow-md">
                    {prop.name}
                  </h3>
                  <div className="text-[10px] text-zinc-200 flex items-center gap-1 drop-shadow-sm">
                    <MapPin className="w-3 h-3" />
                    <span>{prop.location}</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-zinc-300 leading-relaxed mb-2.5">
                {prop.description}
              </p>

              <div className="flex flex-wrap gap-1 mb-3">
                {prop.features.map((f, i) => (
                  <span
                    key={i}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60"
                  >
                    {f}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                <div>
                  <div className="text-[10px] text-zinc-400">Yield: +₦{prop.dailyIncomeNaira.toLocaleString()}/day</div>
                  <div className="text-xs font-black text-amber-400">
                    ₦{prop.priceNaira.toLocaleString()}
                  </div>
                </div>

                {isOwned ? (
                  <button
                    onClick={() => onEnterProperty(prop.id)}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 rounded-lg text-xs font-bold text-white shadow-md shadow-amber-600/30 flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Enter Interior</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (!canAfford) {
                        alert('Insufficient Naira funds! Switch to Unlimited Privilege in Bank app or grow your business.');
                        return;
                      }
                      soundEngine.playCashSound();
                      onBuyProperty(prop);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md ${
                      canAfford
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Buy Estate</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

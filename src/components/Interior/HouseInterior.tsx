import React from 'react';
import { Home, Tv, Shield, LogOut, Sparkles, Coffee, Shirt, Radio } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';

interface HouseInteriorProps {
  onExit: () => void;
  onOpenCloset: () => void;
  cashBalance: number;
  outfit: string;
}

export const HouseInterior: React.FC<HouseInteriorProps> = ({
  onExit,
  onOpenCloset,
  cashBalance,
  outfit,
}) => {
  return (
    <div className="fixed inset-0 z-40 bg-zinc-950 flex flex-col justify-between p-4 sm:p-8 overflow-y-auto select-none">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between z-10 pb-4 border-b border-zinc-800">
        <div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
            NASSARAWA GRA SOVEREIGN PENTHOUSE
          </span>
          <h2 className="text-lg font-black text-white mt-1">PRIVATE LUXURY RESIDENCE</h2>
        </div>

        <button
          onClick={() => {
            soundEngine.playFootstep();
            onExit();
          }}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 border border-zinc-700 shadow-lg transition-all"
        >
          <LogOut className="w-4 h-4 text-amber-400" />
          <span>Exit to Kano Streets</span>
        </button>
      </div>

      {/* Main Living Area Visual Mockup / 3D Living Room Experience */}
      <div className="flex-1 my-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Left Column: Entertainment & Balcony */}
        <div className="p-5 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Tv className="w-4 h-4 text-amber-400" />
              <span>85" 4K Smart Media Center</span>
            </span>
            <span className="text-[9px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded animate-pulse">
              LIVE NTA KANO
            </span>
          </div>

          <div className="w-full h-32 rounded-2xl bg-gradient-to-tr from-black via-zinc-900 to-amber-950 border border-zinc-700 flex flex-col justify-center items-center text-center p-3">
            <Radio className="w-8 h-8 text-amber-400 mb-1" />
            <div className="text-xs font-bold text-white">Kano Durbar & Polo Championship</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Live broadcast from Kano Polo Club</div>
          </div>

          <div className="p-3 bg-zinc-950/70 rounded-xl border border-zinc-800 flex items-center gap-3">
            <Coffee className="w-6 h-6 text-amber-400 flex-shrink-0" />
            <div className="text-[11px] text-zinc-300">
              Fresh northern hibiscus zobo and traditional spiced coffee ready at the bar.
            </div>
          </div>
        </div>

        {/* Center: Majlis Grand Salon */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-amber-500/40 text-center space-y-4 shadow-2xl relative overflow-hidden">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-3xl shadow-xl shadow-amber-500/20">
            👑
          </div>
          <div>
            <h3 className="text-base font-black text-white">THE GRAND MAJLIS</h3>
            <p className="text-xs text-zinc-300 mt-1 max-w-sm mx-auto leading-relaxed">
              Imported Moroccan rugs, handcrafted brass filigree chandeliers, and panoramic balcony views overlooking your escorted motorcade in the driveway.
            </p>
          </div>

          <div className="p-3 bg-zinc-950/80 rounded-2xl border border-zinc-800 text-left space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400">Current Attire:</span>
              <strong className="text-amber-400 uppercase">{outfit.replace('_', ' ')}</strong>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400">Estate Security:</span>
              <span className="text-emerald-400 font-bold">24/7 Level 5 Guarded</span>
            </div>
          </div>

          <button
            onClick={onOpenCloset}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <Shirt className="w-4 h-4" />
            <span>Open Royal Walk-In Closet</span>
          </button>
        </div>

        {/* Right Column: Sovereign Vault & Balcony */}
        <div className="p-5 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Sovereign Security Vault</span>
            </span>
            <span className="text-[10px] text-zinc-400">Biometric Lock</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-center space-y-2">
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest">
              Estate Reserve Cash
            </span>
            <div className="text-base sm:text-lg font-black text-emerald-400 font-mono break-all">
              ₦{cashBalance >= 1000000000000000
                ? '1,000,000,000,000,000,000,000,000'
                : cashBalance.toLocaleString()}
            </div>
            <div className="text-[9px] text-zinc-500">000000000000000000000000</div>
          </div>

          <div className="p-3 bg-zinc-950/70 rounded-xl border border-zinc-800 text-xs text-zinc-300">
            Balcony Terrace: Overlooks the Nassarawa GRA avenue, manicured palm trees, and the streetlights below.
          </div>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="text-center font-mono text-[11px] text-zinc-500 border-t border-zinc-800/80 pt-3">
        000000000000000000000000 · Nassarawa GRA
      </div>
    </div>
  );
};

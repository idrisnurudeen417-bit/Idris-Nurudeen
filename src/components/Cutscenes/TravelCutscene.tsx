import React, { useState, useEffect } from 'react';
import { Plane, Car, Shield, Navigation, CheckCircle2, MapPin } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';

interface TravelCutsceneProps {
  destination: string;
  mode: 'convoy' | 'private_jet';
  onComplete: () => void;
}

export const TravelCutscene: React.FC<TravelCutsceneProps> = ({
  destination,
  mode,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [etaSeconds, setEtaSeconds] = useState(mode === 'private_jet' ? 12 : 10);

  const destinationMap: Record<string, { title: string; subtitle: string; speed: string }> = {
    abuja: {
      title: 'Abuja Federal Capital Territory',
      subtitle: 'Cruising Kaduna-Abuja Dual Carriageway with Police Escort Outriders',
      speed: '180 KM/H VIP CONVOY',
    },
    lagos: {
      title: 'Lagos Victoria Island & Ikoyi',
      subtitle: 'Approaching Banana Island & Eko Atlantic Highway',
      speed: '220 KM/H HIGH-SPEED MOTORCADE',
    },
    port_harcourt: {
      title: 'Port Harcourt Oil Hub & Trans-Amadi',
      subtitle: 'Rivers State Executive Corridor with Armed Escort Sweep',
      speed: '190 KM/H ARMORED TRANSIT',
    },
    dubai: {
      title: 'Dubai, United Arab Emirates',
      subtitle: 'Falcon 8X Private Jet Direct Flight from Mallam Aminu Kano (KAN)',
      speed: '950 KM/H MACH 0.90 HIGH ALTITUDE',
    },
    london: {
      title: 'London Mayfair & Knightsbridge',
      subtitle: 'Transcontinental VIP Flight Across the Sahara into UK Airspace',
      speed: '920 KM/H PRIVATE JET CRUISE',
    },
  };

  const currentDest = destinationMap[destination] || {
    title: destination.toUpperCase(),
    subtitle: 'En route with full presidential clearance',
    speed: 'TRANSIT SPEED',
  };

  useEffect(() => {
    if (mode === 'private_jet') {
      soundEngine.playTakeoffAmbience();
    } else {
      soundEngine.startEngine();
      soundEngine.startSiren();
    }

    const totalDuration = etaSeconds * 1000;
    const intervalTime = 100;
    const step = 100 / (totalDuration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          soundEngine.stopEngine();
          soundEngine.stopSiren();
          setTimeout(() => {
            onComplete();
          }, 800);
          return 100;
        }
        return prev + step;
      });
    }, intervalTime);

    const countInterval = setInterval(() => {
      setEtaSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(countInterval);
      soundEngine.stopEngine();
      soundEngine.stopSiren();
    };
  }, [destination, mode, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-6 sm:p-12 overflow-hidden select-none">
      {/* Background Animated Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900 to-black opacity-90" />

      {/* Speed lines passing effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent animate-pulse" />
      </div>

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between text-white border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2">
          {mode === 'private_jet' ? (
            <Plane className="w-6 h-6 text-sky-400 animate-bounce" />
          ) : (
            <Car className="w-6 h-6 text-amber-400" />
          )}
          <div>
            <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-black">
              {mode === 'private_jet' ? 'VIP AVIATION TRANSIT' : 'EXPRESSWAY ESCORT MOTORCADE'}
            </span>
            <h2 className="text-xl font-black text-white">{currentDest.title}</h2>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-zinc-400 uppercase">Estimated ETA</span>
          <div className="text-xl font-mono font-black text-amber-400">
            00:0{etaSeconds}s
          </div>
        </div>
      </div>

      {/* Center Cinematic Visualization */}
      <div className="relative z-10 my-auto text-center max-w-xl mx-auto space-y-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-700 flex items-center justify-center text-4xl shadow-2xl shadow-amber-500/30">
          {mode === 'private_jet' ? '🛩️' : '🏎️'}
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/40 font-mono tracking-wider">
            {currentDest.speed}
          </span>
          <h3 className="text-2xl font-black text-white tracking-wide">
            {currentDest.subtitle}
          </h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
            Traffic cleared across all inter-state checkpoints. Armed escort outriders maintaining 360-degree perimeter.
          </p>
        </div>

        {/* Progress Bar & Destination Arrival */}
        <div className="space-y-2 max-w-md mx-auto">
          <div className="flex justify-between text-xs text-zinc-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Departed: Kano State</span>
            </span>
            <span className="font-bold text-amber-400 font-mono">
              {Math.min(100, Math.round(progress))}%
            </span>
          </div>

          <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-100 shadow-md shadow-amber-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-zinc-500">
            <span>Route: Direct Fast-Track Corridor</span>
            <span>Arrival: Sovereign Terminal</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="relative z-10 text-center text-xs text-zinc-500 border-t border-zinc-800 pt-4 flex justify-between items-center">
        <span>Life in Kano · Cross-Country Travel Engine</span>
        <button
          onClick={onComplete}
          className="text-xs text-amber-400 hover:text-amber-300 font-bold underline"
        >
          Skip Cutscene →
        </button>
      </div>
    </div>
  );
};

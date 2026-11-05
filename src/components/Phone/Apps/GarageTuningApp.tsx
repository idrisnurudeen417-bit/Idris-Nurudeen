import React, { useState } from 'react';
import { Wrench, Flame, Zap, Shield, Volume2, Sparkles, Check, Lightbulb, Sliders, Palette } from 'lucide-react';
import { soundEngine } from '../../../audio/soundEngine';

interface GarageTuningAppProps {
  vehicleName: string;
  onApplyTuning: (tuneName: string) => void;
  onUpdateLedLighting?: (colorHex: string, intensityPercent: number, mode: 'solid' | 'pulse' | 'strobe') => void;
}

export const GarageTuningApp: React.FC<GarageTuningAppProps> = ({
  vehicleName,
  onApplyTuning,
  onUpdateLedLighting,
}) => {
  const [carCondition, setCarCondition] = useState(100);
  const [activeExhaust, setActiveExhaust] = useState('Titanium Shouting Straight Pipe');
  const [activeStage, setActiveStage] = useState('Stage 3 Twin-Turbo Race Map');
  const [isRevving, setIsRevving] = useState(false);
  const [revMessage, setRevMessage] = useState<string | null>(null);

  // Garage Showroom LED Lighting Strip State
  const [ledColor, setLedColor] = useState<string>('#00f0ff');
  const [ledIntensity, setLedIntensity] = useState<number>(85);
  const [ledMode, setLedMode] = useState<'solid' | 'pulse' | 'strobe'>('solid');

  const triggerLedUpdate = (color: string, intensity: number, mode: 'solid' | 'pulse' | 'strobe') => {
    setLedColor(color);
    setLedIntensity(intensity);
    setLedMode(mode);
    if (onUpdateLedLighting) {
      onUpdateLedLighting(color, intensity, mode);
    }
  };

  const exhaustOptions = [
    {
      id: 'ex_stock',
      name: 'OEM Quiet Luxury Muffler',
      sound: 'Subtle V12 Whisper',
      cost: '₦0',
      flames: false,
    },
    {
      id: 'ex_titanium',
      name: 'Akrapovič Titanium Shouting Exhaust',
      sound: 'High-Pitch Screaming V10/V12',
      cost: '₦8,500,000',
      flames: true,
    },
    {
      id: 'ex_straight_pipe',
      name: 'Titanium Shouting Straight Pipe',
      sound: 'Deafening Roar with Anti-Lag Flame Pops & Bangs',
      cost: '₦14,000,000',
      flames: true,
    },
    {
      id: 'ex_f1_catless',
      name: 'Catless Race Downpipes & Flame Blower',
      sound: 'Ear-Splitting Gunfire Backfire Overrun',
      cost: '₦22,000,000',
      flames: true,
    },
  ];

  const handleFixCar = () => {
    setCarCondition(100);
    soundEngine.playHorn();
    alert('Vehicle full mechanical overhaul completed! Engine running at 100% peak efficiency.');
  };

  const handleRevExhaust = () => {
    if (isRevving) return;
    setIsRevving(true);
    setRevMessage('🔥 POP! BANG! Flame spitting from dual exhaust tips! 💨💨');

    // Synthesize loud high rev and crackle
    soundEngine.startEngine();
    soundEngine.updateEnginePitch(1.0);

    setTimeout(() => {
      soundEngine.updateEnginePitch(0.4);
    }, 400);

    setTimeout(() => {
      soundEngine.updateEnginePitch(0.9);
      soundEngine.playHorn();
    }, 800);

    setTimeout(() => {
      soundEngine.stopEngine();
      setIsRevving(false);
      setTimeout(() => setRevMessage(null), 2500);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white select-none">
      {/* Header */}
      <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-black tracking-wider text-amber-400 uppercase flex items-center gap-1.5">
            <Wrench className="w-4 h-4 text-amber-400" />
            <span>KANO MOTORSPORTS TUNING & WORKSHOP</span>
          </h2>
          <p className="text-[10px] text-zinc-400">
            Fix your ride, tune loud screaming exhausts, and spit flames
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Active Vehicle Status */}
        <div className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-zinc-400 uppercase">Machine in Pit Bay</span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              Condition: {carCondition}% Mint
            </span>
          </div>

          <h3 className="text-xs font-black text-white">{vehicleName}</h3>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleFixCar}
              className="py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-zinc-700"
            >
              <Wrench className="w-3.5 h-3.5 text-amber-400" />
              <span>Full Service & Fix</span>
            </button>

            <button
              onClick={handleRevExhaust}
              disabled={isRevving}
              className="py-2 px-3 bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/30"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{isRevving ? 'REVING LOUD...' : 'BLOW EXHAUST & REV'}</span>
            </button>
          </div>

          {revMessage && (
            <div className="p-2 bg-red-950/80 border border-red-500/50 rounded-lg text-center text-xs font-bold text-red-200 animate-bounce">
              {revMessage}
            </div>
          )}
        </div>

        {/* Shouting Exhaust Selection */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-zinc-300 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>Exhaust System (Shouting & Flame Blowers):</span>
            </span>
            <span className="text-[10px] text-orange-400">Pops & Bangs Active</span>
          </div>

          {exhaustOptions.map((ex) => {
            const isSelected = activeExhaust === ex.name;

            return (
              <div
                key={ex.id}
                onClick={() => {
                  setActiveExhaust(ex.name);
                  onApplyTuning(ex.name);
                  handleRevExhaust();
                }}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-zinc-900 border-orange-500/60 shadow-md shadow-orange-500/10'
                    : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-zinc-100">{ex.name}</span>
                    {ex.flames && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                        🔥 Spits Fire
                      </span>
                    )}
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-orange-400" />}
                </div>
                <div className="text-[11px] text-zinc-400 mt-1">{ex.sound}</div>
                <div className="text-[10px] text-amber-400 font-bold mt-1">Cost: {ex.cost}</div>
              </div>
            );
          })}
        </div>

        {/* ECU Remap & Anti-Lag */}
        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2">
          <div className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>ECU Tune & Anti-Lag Map</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['Stage 1 Street', 'Stage 2 Sport', 'Stage 3 Twin-Turbo'].map((stage) => (
              <button
                key={stage}
                onClick={() => {
                  setActiveStage(stage);
                  soundEngine.playPhoneChime();
                }}
                className={`p-2 rounded-lg text-center text-xs font-bold border transition-all ${
                  activeStage.includes(stage.split(' ')[0])
                    ? 'bg-amber-600 text-white border-amber-400 shadow-sm'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>
        {/* Garage Showroom LED Lighting Strips (Showcase Feature) */}
        <div className="p-3 bg-zinc-900 border border-cyan-500/30 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-cyan-400 flex items-center gap-1.5 uppercase">
              <Lightbulb className="w-4 h-4 text-cyan-400" />
              <span>GARAGE SHOWROOM LED STRIP LIGHTING</span>
            </span>
            <span className="text-[10px] font-bold text-cyan-300 font-mono">
              {ledIntensity}% GLOW
            </span>
          </div>

          <p className="text-[10px] text-zinc-400 leading-snug">
            Adjust the color, brightness, and strobe rhythm of the showroom ground LED runway strips to showcase your machine's aerodynamic bodywork.
          </p>

          {/* Interactive Live Glowing Strip Preview */}
          <div
            className="w-full h-3 rounded-full transition-all duration-200 border border-white/20"
            style={{
              backgroundColor: ledColor,
              boxShadow: `0 0 ${Math.round((ledIntensity / 100) * 24)}px ${ledColor}`,
              opacity: Math.max(0.2, ledIntensity / 100),
            }}
          />

          {/* Intensity Slider */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-zinc-400" />
                <span>LED Light Intensity:</span>
              </span>
              <strong className="text-cyan-400 font-mono">{ledIntensity}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={ledIntensity}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                triggerLedUpdate(ledColor, val, ledMode);
              }}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Color Presets & Custom Picker */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-zinc-400" />
                <span>Showroom Lighting Tone:</span>
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-zinc-500 font-mono">{ledColor}</span>
                <input
                  type="color"
                  value={ledColor}
                  onChange={(e) => triggerLedUpdate(e.target.value, ledIntensity, ledMode)}
                  className="w-5 h-5 rounded cursor-pointer border border-zinc-700 bg-transparent p-0"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {[
                { hex: '#00f0ff', name: 'Cyber Cyan' },
                { hex: '#f59e0b', name: 'Emirates Gold' },
                { hex: '#10b981', name: 'Neon Emerald' },
                { hex: '#ef4444', name: 'Crimson Red' },
                { hex: '#a855f7', name: 'Ultraviolet' },
                { hex: '#ec4899', name: 'Hot Pink' },
                { hex: '#ffffff', name: 'Diamond White' },
                { hex: '#3b82f6', name: 'Cobalt Blue' },
              ].map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => triggerLedUpdate(c.hex, ledIntensity, ledMode)}
                  className={`py-1.5 px-2 rounded-lg border text-left flex items-center gap-1.5 transition-all ${
                    ledColor.toLowerCase() === c.hex.toLowerCase()
                      ? 'border-cyan-400 bg-zinc-800 shadow-sm'
                      : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/20 flex-shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-[9px] font-bold text-zinc-200 truncate">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Lighting Mode Selector */}
          <div className="space-y-1.5 pt-1 border-t border-zinc-800">
            <span className="text-[10px] text-zinc-400 font-bold">Lighting Mode:</span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'solid' as const, label: 'Solid Beam' },
                { id: 'pulse' as const, label: 'Pulse Rhythm' },
                { id: 'strobe' as const, label: 'Flash Strobe' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => triggerLedUpdate(ledColor, ledIntensity, m.id)}
                  className={`py-1 text-[10px] font-bold rounded-lg border transition-all ${
                    ledMode === m.id
                      ? 'bg-cyan-600 text-white border-cyan-400 shadow-sm'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

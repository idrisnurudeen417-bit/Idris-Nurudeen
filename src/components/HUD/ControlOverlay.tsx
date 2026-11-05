import React, { useState } from 'react';
import {
  Smartphone,
  Car,
  Home,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  Camera,
  Shield,
  Siren,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { EscortType, NeighborhoodId } from '../../types';

interface ControlOverlayProps {
  speedKmh: number;
  isDriving: boolean;
  nearVehicle: boolean;
  nearHouse: boolean;
  escortType: EscortType;
  vehicleName: string;
  cashBalance: number;
  currentNeighborhood: NeighborhoodId;
  isMuted: boolean;
  promptText: string | null;
  onToggleDrive: () => void;
  onEnterHouse: () => void;
  onOpenPhone: () => void;
  onToggleMute: () => void;
  onSwitchNeighborhood: (id: NeighborhoodId) => void;
}

export const ControlOverlay: React.FC<ControlOverlayProps> = ({
  speedKmh,
  isDriving,
  nearVehicle,
  nearHouse,
  escortType,
  vehicleName,
  cashBalance,
  currentNeighborhood,
  isMuted,
  promptText,
  onToggleDrive,
  onEnterHouse,
  onOpenPhone,
  onToggleMute,
  onSwitchNeighborhood,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const neighborhoodNames: Record<NeighborhoodId, string> = {
    nassarawa: 'Nassarawa GRA',
    emirs_court: "Emir's Palace (Kofar Kudu)",
    kurmi_market: 'Historic Kurmi Market',
    bompai: 'Bompai Commercial Hub',
  };

  return (
    <div className="fixed inset-0 pointer-events-none select-none z-30 flex flex-col justify-between p-4 sm:p-6">
      {/* Top Cluster: Neighborhood, Status & Phone Notification */}
      <div className="flex items-start justify-between w-full">
        {/* Left Status: Neighborhood & District Pill */}
        <div className="pointer-events-auto flex flex-col gap-1.5">
          <div className="bg-zinc-950/85 border border-zinc-800/80 px-3 py-2 rounded-2xl shadow-xl flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <div>
              <div className="text-[10px] uppercase font-bold font-mono text-amber-400 tracking-wider">
                000000000000000000000000
              </div>
              <div className="text-xs font-black text-white">
                {neighborhoodNames[currentNeighborhood]}
              </div>
            </div>
          </div>

          {/* Quick District Selector */}
          <div className="flex gap-1">
            {[
              { id: 'nassarawa' as const, label: 'GRA' },
              { id: 'emirs_court' as const, label: 'Palace' },
              { id: 'kurmi_market' as const, label: 'Kurmi' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => onSwitchNeighborhood(d.id)}
                className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                  currentNeighborhood === d.id
                    ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                    : 'bg-zinc-950/80 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Interaction Toast Banner */}
        {promptText && (
          <div className="pointer-events-auto max-w-sm px-4 py-2 bg-zinc-950/90 border border-amber-500/50 rounded-2xl shadow-2xl text-xs text-amber-300 font-semibold text-center animate-fade-in">
            {promptText}
          </div>
        )}

        {/* Right Status: Naira Wallet & Smartphone Launch Button */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="bg-zinc-950/85 border border-zinc-800/80 px-3.5 py-2 rounded-2xl shadow-xl text-right">
            <div className="text-[9px] uppercase font-mono text-zinc-400">0000000000</div>
            <div className="text-xs sm:text-sm font-black text-white font-mono tracking-tight">
              ₦{cashBalance >= 1000000000000000
                ? '1,000,000,000,000,000,000,000,000'
                : cashBalance.toLocaleString()}
            </div>
          </div>

          <button
            onClick={onOpenPhone}
            className="p-3 bg-gradient-to-tr from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white rounded-2xl shadow-xl shadow-amber-600/30 flex items-center gap-1.5 active:scale-95 transition-all"
            title="Open KanoOS Smartphone"
          >
            <Smartphone className="w-5 h-5" />
            <span className="text-xs font-bold hidden sm:inline">KanoPhone</span>
          </button>
        </div>
      </div>

      {/* Proximity Interaction Prompts (Near Vehicle or House) */}
      <div className="pointer-events-auto mx-auto mb-2 flex gap-2">
        {nearVehicle && !isDriving && (
          <button
            onClick={onToggleDrive}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-black text-xs rounded-2xl shadow-2xl shadow-amber-600/40 border border-amber-400/50 flex items-center gap-2 active:scale-95 transition-all"
          >
            <Car className="w-4 h-4" />
            <span>ENTER & DRIVE {vehicleName.toUpperCase()} (E)</span>
          </button>
        )}

        {isDriving && (
          <button
            onClick={onToggleDrive}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-2xl shadow-2xl shadow-red-600/40 border border-red-400/50 flex items-center gap-2 active:scale-95 transition-all"
          >
            <Car className="w-4 h-4" />
            <span>EXIT VEHICLE (E)</span>
          </button>
        )}

        {nearHouse && !isDriving && (
          <button
            onClick={onEnterHouse}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs rounded-2xl shadow-2xl shadow-emerald-600/40 border border-emerald-400/50 flex items-center gap-2 active:scale-95 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>ENTER LUXURY RESIDENCE (E)</span>
          </button>
        )}
      </div>

      {/* Unified Bottom Control Dock (Three.js skill compliant) */}
      <div className="pointer-events-auto mx-auto w-full max-w-3xl flex flex-col items-center">
        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="px-3 py-1 bg-zinc-950/85 hover:bg-zinc-900 border border-zinc-800 rounded-t-xl text-[10px] font-bold text-zinc-300 flex items-center gap-1 shadow-lg transition-all"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
              <span>Show Controls HUD</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              <span>Cinema Mode (Hide HUD)</span>
            </>
          )}
        </button>

        {!isCollapsed && (
          <div className="w-full bg-zinc-950/90 border border-zinc-800 rounded-2xl p-3 shadow-2xl flex flex-wrap items-center justify-between gap-3">
            {/* Speedometer & Active Machine */}
            <div className="flex items-center gap-3">
              <div className="text-center px-3 py-1 bg-zinc-900 rounded-xl border border-zinc-800/80">
                <div className="text-xl font-black text-white font-mono tabular-nums leading-none">
                  {speedKmh}
                </div>
                <div className="text-[9px] uppercase font-bold text-zinc-400 mt-0.5">KM/H</div>
              </div>

              <div>
                <div className="text-xs font-black text-white flex items-center gap-1.5">
                  <span>{vehicleName}</span>
                  {escortType === 'police_siren' && (
                    <span className="text-[9px] bg-red-600/30 text-red-400 font-bold px-1.5 py-0.2 rounded border border-red-500/40 flex items-center gap-0.5">
                      <Siren className="w-3 h-3" /> Police Siren Escort
                    </span>
                  )}
                  {escortType === 'private_security' && (
                    <span className="text-[9px] bg-amber-600/30 text-amber-400 font-bold px-1.5 py-0.2 rounded border border-amber-500/40 flex items-center gap-0.5">
                      <Shield className="w-3 h-3" /> Armed Security Guard
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5 hidden sm:block">
                  {isDriving
                    ? 'Drive: W/S (Accel/Brake) · A/D (Steer) · Space (Handbrake)'
                    : 'Walk: W/A/S/D · Shift (Sprint) · E (Interact)'}
                </div>
              </div>
            </div>

            {/* Quick Action Dock Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenPhone}
                className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-xl text-xs font-bold text-zinc-200 border border-zinc-800 flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span>KanoPhone</span>
              </button>

              <button
                onClick={onToggleMute}
                className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-xl text-zinc-300 border border-zinc-800 shadow-sm transition-all"
                title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

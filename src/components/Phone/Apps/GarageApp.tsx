import React, { useState } from 'react';
import { VehicleSpec, EscortType } from '../../../types';
import { ALL_VEHICLES } from '../../../data/gameData';
import { soundEngine } from '../../../audio/soundEngine';
import { Car, Shield, ShieldCheck, Siren, Plane, Check, Sparkles, Navigation } from 'lucide-react';

interface GarageAppProps {
  activeVehicleId: string;
  escortType: EscortType;
  onSelectVehicle: (vehicleId: string, colorHex: string) => void;
  onSelectEscort: (type: EscortType) => void;
  onTriggerTravelCutscene: (dest: string, mode: 'convoy' | 'private_jet') => void;
}

export const GarageApp: React.FC<GarageAppProps> = ({
  activeVehicleId,
  escortType,
  onSelectVehicle,
  onSelectEscort,
  onTriggerTravelCutscene,
}) => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Hypercar' | 'Ultra-Luxury' | 'High-End SUV' | 'Aviation'>('All');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleSpec>(
    ALL_VEHICLES.find((v) => v.id === activeVehicleId) || ALL_VEHICLES[0]
  );
  const [activeColor, setActiveColor] = useState<string>(selectedVehicle.selectedColor);

  const filteredVehicles = ALL_VEHICLES.filter(
    (v) => activeCategory === 'All' || v.category === activeCategory
  );

  const handleApplyVehicle = (veh: VehicleSpec, color: string) => {
    setSelectedVehicle(veh);
    setActiveColor(color);
    onSelectVehicle(veh.id, color);
    soundEngine.playHorn();
  };

  const handleEscortChange = (type: EscortType) => {
    onSelectEscort(type);
    if (type === 'police_siren') {
      soundEngine.startSiren();
      setTimeout(() => soundEngine.stopSiren(), 2500);
    } else {
      soundEngine.playPhoneChime();
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white select-none">
      {/* Header */}
      <div className="p-3 bg-zinc-900 border-b border-zinc-800">
        <h2 className="text-xs font-black tracking-wider text-amber-400 uppercase flex items-center gap-1.5">
          <Car className="w-4 h-4 text-amber-400" />
          <span>GLOBAL LUXURY GARAGE & CONVOY FLEET</span>
        </h2>
        <p className="text-[10px] text-zinc-400">
          Supercars, VIP motorcades, Private Jet & Chopper charters
        </p>

        {/* Category switcher */}
        <div className="flex gap-1 overflow-x-auto mt-2 pb-0.5 no-scrollbar">
          {['All', 'Hypercar', 'Ultra-Luxury', 'High-End SUV', 'Aviation'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-amber-600 text-white border-amber-400 shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Convoy Escort Configuration Card */}
        <div className="p-3 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-amber-500/30 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>ESCORT CONVOY FORMATION</span>
            </span>
            <span className="text-[10px] text-zinc-400 uppercase">Status & Security</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              {
                type: 'none' as const,
                title: 'Solo VIP',
                desc: 'No convoy behind',
                icon: Car,
                badge: 'Incognito',
              },
              {
                type: 'private_security' as const,
                title: 'Private Escort',
                desc: 'Armored G63 Guard',
                icon: Shield,
                badge: 'Armed Security',
              },
              {
                type: 'police_siren' as const,
                title: 'Police Sirens',
                desc: 'Outriders & Strobes',
                icon: Siren,
                badge: 'Full Clearance',
              },
            ].map((esc) => {
              const IconComp = esc.icon;
              const isSelected = escortType === esc.type;
              return (
                <button
                  key={esc.type}
                  onClick={() => handleEscortChange(esc.type)}
                  className={`p-2 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'bg-amber-600/20 border-amber-500 text-white shadow-md'
                      : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <IconComp className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-zinc-400'}`} />
                    {isSelected && <Check className="w-3 h-3 text-amber-400" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">{esc.title}</div>
                    <div className="text-[9px] text-zinc-400 mt-0.5">{esc.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Aviation Charters (Private Jet & Chopper) */}
        {(activeCategory === 'All' || activeCategory === 'Aviation') && (
          <div className="p-3 bg-gradient-to-r from-sky-950/80 to-indigo-950/80 border border-sky-500/40 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                <Plane className="w-4 h-4 text-sky-400" />
                <span>PRIVATE JET & CHOPPER WING (MALLAM AMINU KANO KAN)</span>
              </span>
              <span className="text-[10px] text-sky-300 font-bold">VIP Hangar</span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              Board your ultra-long-range Dassault Falcon 8X or Bell 429 twin-engine luxury helicopter for immediate takeoff to Abuja, Lagos, Dubai, or London.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => onTriggerTravelCutscene('dubai', 'private_jet')}
                className="py-2 px-3 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-sky-600/30"
              >
                <Plane className="w-3.5 h-3.5" />
                <span>Fly Falcon 8X Jet</span>
              </button>
              <button
                onClick={() => onTriggerTravelCutscene('abuja', 'private_jet')}
                className="py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Launch VIP Chopper</span>
              </button>
            </div>
          </div>
        )}

        {/* Vehicle List */}
        <div className="space-y-2.5">
          <div className="text-xs font-bold text-zinc-300 flex items-center justify-between">
            <span>Select Machine to Spawn:</span>
            <span className="text-[10px] text-amber-400">{filteredVehicles.length} Models in Hangar</span>
          </div>

          {filteredVehicles.map((veh) => {
            const isActive = activeVehicleId === veh.id;
            return (
              <div
                key={veh.id}
                className={`p-3 rounded-xl border transition-all ${
                  isActive
                    ? 'bg-zinc-900 border-amber-500/60 shadow-lg shadow-amber-500/10'
                    : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-black text-zinc-100">{veh.name}</h3>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700">
                        {veh.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                      {veh.description}
                    </p>
                  </div>
                </div>

                {/* Performance Readouts */}
                <div className="grid grid-cols-3 gap-2 my-2 py-1.5 px-2 bg-zinc-950/70 rounded-lg text-[10px] text-zinc-400 border border-zinc-800/80">
                  <div>
                    <span>Top Speed: </span>
                    <strong className="text-zinc-200">{veh.topSpeedKmh} km/h</strong>
                  </div>
                  <div>
                    <span>0-100: </span>
                    <strong className="text-zinc-200">{veh.acceleration}s</strong>
                  </div>
                  <div>
                    <span>Handling: </span>
                    <strong className="text-amber-400">{veh.handling}/10</strong>
                  </div>
                </div>

                {/* Color swatches & Select Button */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-zinc-400">Color:</span>
                    {veh.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => handleApplyVehicle(veh, c)}
                        className="w-5 h-5 rounded-full border border-white/20 shadow-sm transition-transform hover:scale-110"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => handleApplyVehicle(veh, veh.selectedColor)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/30'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Active Vehicle</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Deploy to Street</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

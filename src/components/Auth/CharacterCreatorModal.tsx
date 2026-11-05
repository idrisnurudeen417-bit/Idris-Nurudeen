import React, { useState } from 'react';
import { User, Sparkles, Check, Crown, Palette } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';

export interface CharacterConfig {
  gender: 'male' | 'female';
  hairstyle: 'afro' | 'low_fade' | 'hula_cap' | 'cornrows' | 'hijab_mayafi' | 'high_top';
  outfit: string;
  skinTone: string;
  dob: { day: string; month: string; year: string };
}

interface CharacterCreatorModalProps {
  username: string;
  onComplete: (config: CharacterConfig) => void;
}

export const CharacterCreatorModal: React.FC<CharacterCreatorModalProps> = ({
  username,
  onComplete,
}) => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [hairstyle, setHairstyle] = useState<'afro' | 'low_fade' | 'hula_cap' | 'cornrows' | 'hijab_mayafi' | 'high_top'>('hula_cap');
  const [skinTone, setSkinTone] = useState<string>('#5a3825'); // Warm Nigerian tone
  const [selectedOutfit, setSelectedOutfit] = useState<string>('white_kaftan');

  // Date of Birth fields
  const [day, setDay] = useState('15');
  const [month, setMonth] = useState('June');
  const [year, setYear] = useState('2002');

  const maleOutfits = [
    { id: 'white_kaftan', name: 'Sharp Modern White Babban Riga & Hula', tag: 'Traditional Royalty' },
    { id: 'royal_kaftan', name: 'Royal Indigo Blue Embroidered Kaftan', tag: 'Elite Aristocrat' },
    { id: 'designer_streetwear', name: 'High-End Kano Designer Streetwear', tag: 'Contemporary Luxe' },
    { id: 'italian_suit', name: 'Bespoke Charcoal Double-Breasted Suit', tag: 'Corporate Titan' },
  ];

  const femaleOutfits = [
    { id: 'royal_brocade', name: 'Royal Hausa Brocade with Silk Mayafi', tag: 'Northern Elegance' },
    { id: 'kano_couture', name: 'Al-Hassan Haute Couture Gown', tag: 'GRA Socialite' },
    { id: 'female_streetwear', name: 'Chic Parisian-Kano Streetwear Ensemble', tag: 'Modern Influencer' },
    { id: 'emerald_abaya', name: 'Embroidered Emerald & Gold Silk Abaya', tag: 'High Fashion' },
  ];

  const hairstyles = [
    { id: 'hula_cap' as const, name: 'Hausa Embroidered Hula Cap', icon: '👑' },
    { id: 'afro' as const, name: 'Sculpted Afro Texture', icon: '✨' },
    { id: 'low_fade' as const, name: 'Precision Low Skin Fade', icon: '✂️' },
    { id: 'cornrows' as const, name: 'Kano Royal Braids / Cornrows', icon: '💈' },
    { id: 'hijab_mayafi' as const, name: 'Silk Mayafi / Royal Hijab', icon: '🧕' },
    { id: 'high_top' as const, name: 'Fresh High Top Fade', icon: '⚡' },
  ];

  const skinTones = [
    { hex: '#3b2219', label: 'Deep Rich Ebony' },
    { hex: '#5a3825', label: 'Sahel Warm Bronze' },
    { hex: '#7a4b32', label: 'Golden Caramel' },
    { hex: '#9d6849', label: 'Warm Amber' },
  ];

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playPhoneChime();

    onComplete({
      gender,
      hairstyle,
      outfit: selectedOutfit,
      skinTone,
      dob: { day, month, year },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-lg bg-zinc-950 border border-amber-500/40 rounded-3xl p-5 shadow-2xl text-white relative my-auto">
        <div className="text-center mb-4">
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
            000000000000000000000000
          </span>
          <h2 className="text-xl font-black tracking-wide text-zinc-100 uppercase mt-1 font-mono">
            000000000000000000000000
          </h2>
          <p className="text-xs text-zinc-400">
            Citizen appearance configuration for <strong>@{username}</strong>
          </p>
        </div>

        <form onSubmit={handleFinish} className="space-y-4">
          {/* Date of Birth Selection */}
          <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-2xl">
            <label className="block text-xs font-bold text-amber-400 mb-1.5">
              Citizen Date of Birth (Age 15+ Verified)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
              >
                {Array.from({ length: 31 }, (_, i) => String(i + 1)).map((d) => (
                  <option key={d} value={d}>
                    Day {d}
                  </option>
                ))}
              </select>

              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
              >
                {[
                  'January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'
                ].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
              >
                {Array.from({ length: 50 }, (_, i) => String(2010 - i)).map((y) => (
                  <option key={y} value={y}>
                    Year {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Gender Selector */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">Character Gender</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setGender('male');
                  setSelectedOutfit('white_kaftan');
                }}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  gender === 'male'
                    ? 'bg-amber-600 text-white border-amber-400 shadow-md shadow-amber-600/30'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                }`}
              >
                Male Citizen
              </button>
              <button
                type="button"
                onClick={() => {
                  setGender('female');
                  setSelectedOutfit('royal_brocade');
                  setHairstyle('hijab_mayafi');
                }}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  gender === 'female'
                    ? 'bg-pink-600 text-white border-pink-400 shadow-md shadow-pink-600/30'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                }`}
              >
                Female Citizen
              </button>
            </div>
          </div>

          {/* Skin Tone Swatches */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>Skin Complexion</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {skinTones.map((st) => (
                <button
                  type="button"
                  key={st.hex}
                  onClick={() => setSkinTone(st.hex)}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    skinTone === st.hex
                      ? 'border-amber-400 bg-zinc-900 shadow-sm'
                      : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                  }`}
                >
                  <div
                    className="w-7 h-7 rounded-full shadow-inner border border-white/20"
                    style={{ backgroundColor: st.hex }}
                  />
                  <span className="text-[9px] text-zinc-300 font-medium text-center">
                    {st.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Hairstyle Selection */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">
              Hairstyle & Royal Headwear
            </label>
            <div className="grid grid-cols-3 gap-2">
              {hairstyles.map((h) => (
                <button
                  type="button"
                  key={h.id}
                  onClick={() => setHairstyle(h.id)}
                  className={`p-2 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    hairstyle === h.id
                      ? 'bg-amber-600/20 border-amber-500 text-white shadow-sm'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-base mb-1">{h.icon}</span>
                  <span className="text-[11px] font-bold text-zinc-200 leading-tight">
                    {h.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Starting Outfit Selection */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">
              Starting High-Status Attire
            </label>
            <div className="space-y-1.5">
              {(gender === 'male' ? maleOutfits : femaleOutfits).map((o) => (
                <button
                  type="button"
                  key={o.id}
                  onClick={() => setSelectedOutfit(o.id)}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    selectedOutfit === o.id
                      ? 'bg-zinc-900 border-amber-500 text-white shadow-sm'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-zinc-100">{o.name}</div>
                    <div className="text-[10px] text-amber-400 mt-0.5">{o.tag}</div>
                  </div>
                  {selectedOutfit === o.id && <Check className="w-4 h-4 text-amber-400" />}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 hover:from-amber-500 hover:to-amber-600 font-bold rounded-xl text-sm shadow-xl shadow-amber-600/30 flex items-center justify-center gap-2 transition-all mt-3"
          >
            <Sparkles className="w-4 h-4" />
            <span>ENTER LIFE IN KANO · OPEN WORLD</span>
          </button>
        </form>
      </div>
    </div>
  );
};

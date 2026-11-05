import React, { useState } from 'react';
import { Heart, Baby, GraduationCap, Award, Sparkles, DollarSign, BookOpen, Gift, Users } from 'lucide-react';
import { soundEngine } from '../../../audio/soundEngine';

interface Child {
  id: string;
  name: string;
  gender: 'Son' | 'Daughter';
  ageYears: number;
  stage: 'Infant' | 'Junior Scholar' | 'High School Prep' | 'Ivy League Student' | 'Young Tycoon';
  school: string;
  happiness: number; // 0 - 100
  educationScore: number; // 0 - 100
  trustFundNaira: number;
}

interface FamilyAppProps {
  cashBalance: number;
  onSpendCash: (amount: number) => boolean;
  onBoostReputation: (amount: number) => void;
}

export const FamilyApp: React.FC<FamilyAppProps> = ({
  cashBalance,
  onSpendCash,
  onBoostReputation,
}) => {
  const [children, setChildren] = useState<Child[]>([
    {
      id: 'child_1',
      name: 'Tariq Al-Hassan',
      gender: 'Son',
      ageYears: 8,
      stage: 'Junior Scholar',
      school: 'Kano British International Academy',
      happiness: 95,
      educationScore: 92,
      trustFundNaira: 50000000,
    },
  ]);

  const [showAdoptModal, setShowAdoptModal] = useState(false);
  const [babyName, setBabyName] = useState('');
  const [babyGender, setBabyGender] = useState<'Son' | 'Daughter'>('Son');

  const schools = [
    { name: 'Kano Royal British Academy', fee: 15000000, eduBoost: 12 },
    { name: 'Regent College Diplomatic Campus Abuja', fee: 35000000, eduBoost: 20 },
    { name: 'Eton College & Harrow UK Prep', fee: 85000000, eduBoost: 30 },
    { name: 'Oxford & Cambridge University Trust', fee: 180000000, eduBoost: 45 },
  ];

  const handleAdopt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!babyName.trim()) return;

    const adoptionFee = 5000000;
    const success = onSpendCash(adoptionFee);
    if (!success) {
      alert('Insufficient funds to complete legal adoption protocol.');
      return;
    }

    soundEngine.playCashSound();
    onBoostReputation(15);

    const newChild: Child = {
      id: String(Date.now()),
      name: babyName.trim(),
      gender: babyGender,
      ageYears: 1,
      stage: 'Infant',
      school: 'Kano Royal Daycare & Montessori',
      happiness: 100,
      educationScore: 80,
      trustFundNaira: 25000000,
    };

    setChildren((prev) => [...prev, newChild]);
    setShowAdoptModal(false);
    setBabyName('');
  };

  const handleEnrollSchool = (childId: string, schoolName: string, fee: number, eduBoost: number) => {
    const success = onSpendCash(fee);
    if (!success) {
      alert('Insufficient Naira funds to pay tuition fees!');
      return;
    }
    soundEngine.playCashSound();
    onBoostReputation(8);

    setChildren((prev) =>
      prev.map((c) => {
        if (c.id === childId) {
          const nextAge = c.ageYears + 3;
          let nextStage = c.stage;
          if (nextAge >= 18) nextStage = 'Young Tycoon';
          else if (nextAge >= 14) nextStage = 'Ivy League Student';
          else if (nextAge >= 9) nextStage = 'High School Prep';
          else nextStage = 'Junior Scholar';

          return {
            ...c,
            ageYears: nextAge,
            stage: nextStage,
            school: schoolName,
            educationScore: Math.min(100, c.educationScore + eduBoost),
            happiness: Math.min(100, c.happiness + 10),
          };
        }
        return c;
      })
    );
  };

  const handleAddTrustFund = (childId: string, amount: number) => {
    const success = onSpendCash(amount);
    if (!success) {
      alert('Insufficient funds for trust fund deposit!');
      return;
    }
    soundEngine.playCashSound();
    setChildren((prev) =>
      prev.map((c) =>
        c.id === childId
          ? { ...c, trustFundNaira: c.trustFundNaira + amount, happiness: 100 }
          : c
      )
    );
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white select-none">
      <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-black tracking-wider text-pink-400 uppercase flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-pink-400" />
            <span>KANO ROYAL FAMILY & ADOPTION APP</span>
          </h2>
          <p className="text-[10px] text-zinc-400">
            Adopt babies, educate heirs at Oxford, and build family legacy
          </p>
        </div>

        <button
          onClick={() => setShowAdoptModal(true)}
          className="px-2.5 py-1 bg-pink-600 hover:bg-pink-500 rounded-lg text-xs font-bold text-white flex items-center gap-1 shadow-md shadow-pink-600/30"
        >
          <Baby className="w-3.5 h-3.5" />
          <span>Adopt Baby</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {children.map((child) => (
          <div
            key={child.id}
            className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-2.5 shadow-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  {child.gender} · Age {child.ageYears} · {child.stage}
                </span>
                <h3 className="text-sm font-black text-white mt-1">{child.name}</h3>
                <div className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{child.school}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[9px] text-zinc-400">Inheritance Vault:</span>
                <div className="text-xs font-black text-emerald-400 font-mono">
                  ₦{child.trustFundNaira.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Happiness & Education bars */}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <div className="flex justify-between text-zinc-400 mb-0.5">
                  <span>Happiness:</span>
                  <span className="font-bold text-pink-400">{child.happiness}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-pink-500 rounded-full"
                    style={{ width: `${child.happiness}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-zinc-400 mb-0.5">
                  <span>Academic Standing:</span>
                  <span className="font-bold text-amber-400">{child.educationScore}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${child.educationScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* School Enrollment options */}
            <div className="pt-2 border-t border-zinc-800/80 space-y-1.5">
              <span className="text-[10px] font-bold text-zinc-300">
                Enroll in Higher Institution:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {schools.map((sch, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      handleEnrollSchool(child.id, sch.name, sch.fee, sch.eduBoost)
                    }
                    className="p-1.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-left transition-all"
                  >
                    <div className="text-[10px] font-bold text-zinc-200 truncate">{sch.name}</div>
                    <div className="text-[9px] text-emerald-400 font-semibold">
                      ₦{(sch.fee / 1000000).toFixed(0)}M Tuition
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Deposit Trust Fund Button */}
            <div className="flex gap-2 pt-1">
              {[25000000, 100000000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleAddTrustFund(child.id, amt)}
                  className="flex-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-[10px] font-bold text-emerald-400 flex items-center justify-center gap-1 border border-zinc-700"
                >
                  <Gift className="w-3 h-3 text-emerald-400" />
                  <span>+₦{(amt / 1000000).toFixed(0)}M Trust</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Adopt Baby Modal */}
      {showAdoptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
          <form
            onSubmit={handleAdopt}
            className="w-full max-w-xs bg-zinc-900 border border-pink-500/50 rounded-2xl p-4 text-white space-y-3"
          >
            <div>
              <h3 className="text-xs font-black text-pink-400 flex items-center gap-1.5 uppercase">
                <Baby className="w-4 h-4" />
                <span>Adopt a Royal Baby</span>
              </h3>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                Give a child the finest upbringing in Kano and abroad.
              </p>
            </div>

            <div>
              <label className="block text-[10px] text-zinc-400 mb-1">Gender</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBabyGender('Son')}
                  className={`py-1 text-xs font-bold rounded-lg border ${
                    babyGender === 'Son'
                      ? 'bg-sky-600 text-white border-sky-400'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                  }`}
                >
                  Baby Boy
                </button>
                <button
                  type="button"
                  onClick={() => setBabyGender('Daughter')}
                  className={`py-1 text-xs font-bold rounded-lg border ${
                    babyGender === 'Daughter'
                      ? 'bg-pink-600 text-white border-pink-400'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                  }`}
                >
                  Baby Girl
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-zinc-400 mb-1">Child Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Fatima or Zain or Ibrahim"
                value={babyName}
                onChange={(e) => setBabyName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="text-[10px] text-zinc-400">
              Adoption Fee & Legal Seal: <strong className="text-emerald-400">₦5,000,000</strong>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAdoptModal(false)}
                className="flex-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-1.5 bg-pink-600 hover:bg-pink-500 rounded-lg text-xs font-bold shadow-md shadow-pink-600/30"
              >
                Welcome Baby
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

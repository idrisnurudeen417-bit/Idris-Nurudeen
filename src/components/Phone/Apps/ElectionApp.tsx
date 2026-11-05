import React, { useState } from 'react';
import { Award, Volume2, VolumeX, Flag, CheckCircle, TrendingUp, Users, Radio, ThumbsUp, Shield, Car, Navigation, Siren } from 'lucide-react';
import { soundEngine } from '../../../audio/soundEngine';

interface ElectionAppProps {
  cashBalance: number;
  reputation: number;
  onSpendCash: (amount: number) => boolean;
  onBoostReputation: (amount: number) => void;
  onDeployConvoyGuards?: (guardCount: number, distanceKm: number) => void;
}

export const ElectionApp: React.FC<ElectionAppProps> = ({
  cashBalance,
  reputation,
  onSpendCash,
  onBoostReputation,
  onDeployConvoyGuards,
}) => {
  const [activeTab, setActiveTab] = useState<'rallies' | 'campaign' | 'guards' | 'polls'>('rallies');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentSpeech, setCurrentSpeech] = useState<string | null>(null);
  const [presidentialPoll, setPresidentialPoll] = useState(38); // %
  const [campaignFunds, setCampaignFunds] = useState(15000000);
  const [politicalRank, setPoliticalRank] = useState<'Citizen Leader' | 'Kano State Aspirant' | 'Gubernatorial Candidate' | 'Presidential Frontrunner'>('Kano State Aspirant');

  // Billionaire Convoy Guards State (₦1 Million per Guard)
  const [routeDistanceKm, setRouteDistanceKm] = useState<number>(25);
  const [guardCount, setGuardCount] = useState<number>(15); // Default 15 guards -> ₦15 Million
  const [activeDeployedConvoy, setActiveDeployedConvoy] = useState<{
    guards: number;
    distance: number;
    cost: number;
    timestamp: string;
  } | null>(null);

  const speeches = [
    {
      id: 'sp_1',
      title: 'Grand Kano Sani Abacha Stadium Mega Rally',
      candidate: 'Your Excellency Presidential Campaign',
      quote: `"People of Kano! The commercial heart of West Africa will rise again! We will build high-speed rail from Kano to Lagos, modern solar irrigation across the Sahel, and dignity for every youth! Kano leads Nigeria forward!"`,
      crowdSize: '85,000 Supporters',
      votesGained: '+4.5% National Polls',
    },
    {
      id: 'sp_2',
      title: 'Kano Chamber of Commerce Economic Debate',
      candidate: 'Bompai Industrial & Export Coalition',
      quote: `"Our ancient groundnut pyramids were not a myth; they were proof that Kano produces wealth. With direct cargo flights from Mallam Aminu Kano Airport and free trade zones, we will industrialize Nigeria!"`,
      crowdSize: '12,000 Business Titans',
      votesGained: '+2.8% National Polls',
    },
    {
      id: 'sp_3',
      title: 'Aso Villa Presidential Manifesto Address',
      candidate: 'National Unity & Prosperity Alliance',
      quote: `"Unity, security, and financial independence for all 36 States. When northern agriculture meets southern technology, Nigeria becomes an undisputed global superpower! Vote for visionary leadership!"`,
      crowdSize: 'National Broadcast',
      votesGained: '+6.1% National Polls',
    },
  ];

  const handleListenSpeech = (speech: typeof speeches[0]) => {
    setCurrentSpeech(speech.quote);
    setIsPlayingAudio(true);
    soundEngine.playPhoneChime();
  };

  const handleStopSpeech = () => {
    setIsPlayingAudio(false);
    setCurrentSpeech(null);
  };

  const handleFundCampaign = (amount: number) => {
    const success = onSpendCash(amount);
    if (!success) {
      alert('Insufficient Naira funds to finance your political campaign!');
      return;
    }
    soundEngine.playCashSound();
    setCampaignFunds((prev) => prev + amount);
    setPresidentialPoll((prev) => Math.min(88, prev + Math.floor(amount / 5000000) * 3));
    onBoostReputation(5);

    if (presidentialPoll > 55 && politicalRank === 'Kano State Aspirant') {
      setPoliticalRank('Gubernatorial Candidate');
    }
    if (presidentialPoll > 70) {
      setPoliticalRank('Presidential Frontrunner');
    }
  };

  const handleHireConvoyGuards = () => {
    const cost = guardCount * 1000000; // Strictly ₦1 Million per Guard
    const success = onSpendCash(cost);
    if (!success) {
      alert(`Insufficient funds! Hiring ${guardCount} convoy guards requires ₦${cost.toLocaleString()} Naira.`);
      return;
    }

    soundEngine.playCashSound();
    soundEngine.startSiren();
    setTimeout(() => soundEngine.stopSiren(), 3000);

    onBoostReputation(Math.min(25, Math.round(guardCount * 0.8)));
    setPresidentialPoll((p) => Math.min(95, p + Math.round(guardCount * 0.5)));

    setActiveDeployedConvoy({
      guards: guardCount,
      distance: routeDistanceKm,
      cost,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    if (onDeployConvoyGuards) {
      onDeployConvoyGuards(guardCount, routeDistanceKm);
    }

    alert(`🚔 CONVOY DEPLOYED! ${guardCount} Armed Security Guards dispatched for ${routeDistanceKm} KM route (Total: ₦${cost.toLocaleString()}). Cleared across Kano!`);
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white select-none">
      {/* Top Banner */}
      <div className="p-3 bg-gradient-to-r from-emerald-950 via-zinc-900 to-amber-950 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-black tracking-wider text-emerald-400 uppercase">
              INEC ELECTION & PRESIDENCY PORTAL
            </h2>
          </div>
          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
            {politicalRank}
          </span>
        </div>
        <p className="text-[10px] text-zinc-400 mt-0.5">
          Listen to live campaign rallies, hire convoy guards (₦1M/guard), and run for President
        </p>

        {/* Tab selection */}
        <div className="grid grid-cols-4 gap-1 mt-2.5">
          {[
            { id: 'rallies', label: 'Rallies' },
            { id: 'campaign', label: 'Campaign' },
            { id: 'guards', label: 'Billionaire Convoy' },
            { id: 'polls', label: 'Polls' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-1 text-[10px] font-bold rounded-lg border text-center transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                  : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {activeTab === 'rallies' && (
          <div className="space-y-3">
            {/* Live Radio Listening Bar */}
            {isPlayingAudio && currentSpeech && (
              <div className="p-3 bg-emerald-950/70 border border-emerald-500/50 rounded-xl relative overflow-hidden animate-pulse">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <Radio className="w-4 h-4 animate-spin" />
                    <span>BROADCASTING LIVE CAMPAIGN AUDIO</span>
                  </div>
                  <button
                    onClick={handleStopSpeech}
                    className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                  >
                    <VolumeX className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs italic text-emerald-100 leading-relaxed">
                  {currentSpeech}
                </p>
                <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-400 font-medium">
                  <ThumbsUp className="w-3 h-3" />
                  <span>Crowd chanting: "Sai Baba! Sai Dan Kano! Sai Jagaban!"</span>
                </div>
              </div>
            )}

            <div className="text-xs font-bold text-zinc-300 flex items-center justify-between">
              <span>Select Rally Speech to Listen:</span>
              <span className="text-[10px] text-emerald-400">Radio 96.5 FM Live</span>
            </div>

            {speeches.map((sp) => (
              <div
                key={sp.id}
                className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-2 hover:border-emerald-500/40 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-100">{sp.title}</h3>
                    <div className="text-[10px] text-zinc-400">{sp.candidate}</div>
                  </div>
                  <button
                    onClick={() => handleListenSpeech(sp)}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-md shadow-emerald-700/30"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen Live</span>
                  </button>
                </div>
                <div className="p-2 bg-zinc-950/60 rounded-lg text-[11px] text-zinc-300 italic border border-zinc-800/80">
                  {sp.quote}
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-amber-400" />
                    <span>{sp.crowdSize}</span>
                  </span>
                  <span className="text-emerald-400 font-bold">{sp.votesGained}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'campaign' && (
          <div className="space-y-3">
            <div className="p-3 bg-zinc-900 border border-amber-500/30 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-400">PRESIDENTIAL CAMPAIGN WAR-CHEST</span>
                <span className="text-xs font-black text-emerald-400">
                  ₦{campaignFunds.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mb-3">
                Invest your personal wealth to mobilize rallies across all 44 Kano local governments and 36 Nigerian states.
              </p>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Kano Ward Rallies', cost: 5000000, rep: '+3%' },
                  { label: 'Northern Media Blitz', cost: 15000000, rep: '+8%' },
                  { label: 'Private Jet National Tour', cost: 35000000, rep: '+15%' },
                  { label: 'Presidential Manifesto Convention', cost: 75000000, rep: '+25%' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleFundCampaign(item.cost)}
                    className="p-2.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-left transition-all"
                  >
                    <div className="text-xs font-bold text-zinc-200">{item.label}</div>
                    <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                      ₦{item.cost.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-amber-400 mt-1">Gains {item.rep} votes</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
              <h4 className="text-xs font-bold text-zinc-200 mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Next Electoral Milestone</span>
              </h4>
              <div className="space-y-1.5 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Current Projected Poll:</span>
                  <span className="font-bold text-emerald-400">{presidentialPoll}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${presidentialPoll}%` }}
                  />
                </div>
                <p className="text-[10px] text-zinc-500 pt-1">
                  Surpass 60% national poll to declare election victory and assume presidential commander-in-chief status.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Billionaire Convoy & Armed Guards Deployment */}
        {activeTab === 'guards' && (
          <div className="space-y-3">
            {activeDeployedConvoy && (
              <div className="p-3 bg-gradient-to-r from-emerald-950 via-zinc-900 to-amber-950 border border-emerald-500/60 rounded-xl space-y-1 animate-pulse">
                <div className="flex items-center justify-between text-xs font-black text-emerald-400">
                  <span className="flex items-center gap-1.5">
                    <Siren className="w-4 h-4 text-emerald-400" />
                    <span>CONVOY ACTIVELY ESCORTING YOUR MOTORCADE</span>
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                    {activeDeployedConvoy.timestamp}
                  </span>
                </div>
                <div className="text-xs text-white">
                  <strong>{activeDeployedConvoy.guards} Armed Guards</strong> actively deployed across{' '}
                  <strong>{activeDeployedConvoy.distance} KM</strong> route corridor.
                </div>
                <div className="text-[10px] text-amber-300">
                  Total Contract: ₦{activeDeployedConvoy.cost.toLocaleString()} · 100% Armed Security Clearance
                </div>
              </div>
            )}

            <div className="p-3 bg-zinc-900 border border-amber-500/30 rounded-xl space-y-3">
              <div>
                <span className="text-xs font-black text-amber-400 flex items-center gap-1.5 uppercase font-mono">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>000000000000000000000000 · CONVOY DISPATCH</span>
                </span>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Specify distance and hire armed tactical guards (₦1,000,000 per guard).
                </p>
              </div>

              {/* Step 1: Distance Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-amber-400" />
                    <span>Select Convoy Escort Route Distance:</span>
                  </span>
                  <strong className="text-amber-400 font-mono">{routeDistanceKm} KM</strong>
                </label>

                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: '15 KM (Kano City)', val: 15 },
                    { label: '35 KM (Outskirts)', val: 35 },
                    { label: '85 KM (Zaria Dual)', val: 85 },
                    { label: '150 KM (Kaduna)', val: 150 },
                    { label: '450 KM (Abuja)', val: 450 },
                    { label: '1,000 KM (Lagos)', val: 1000 },
                  ].map((dst) => (
                    <button
                      key={dst.val}
                      type="button"
                      onClick={() => setRouteDistanceKm(dst.val)}
                      className={`py-1.5 text-[10px] font-bold rounded-lg border transition-all ${
                        routeDistanceKm === dst.val
                          ? 'bg-amber-600 text-white border-amber-400'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      {dst.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Guard Hiring Counter */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-800">
                <label className="block text-xs font-bold text-zinc-300 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Amount of Guards to Hire:</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">
                    Rate: ₦1,000,000 per Guard
                  </span>
                </label>

                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { label: '5 Guards', count: 5 },
                    { label: '10 Guards', count: 10 },
                    { label: '15 Guards (₦15M)', count: 15 },
                    { label: '25 Guards', count: 25 },
                    { label: '50 Guards', count: 50 },
                    { label: '100 Guards', count: 100 },
                    { label: '250 Guards', count: 250 },
                    { label: '500 Guards', count: 500 },
                  ].map((g) => (
                    <button
                      key={g.count}
                      type="button"
                      onClick={() => setGuardCount(g.count)}
                      className={`py-1.5 text-[10px] font-bold rounded-lg border transition-all ${
                        guardCount === g.count
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost Calculation Summary Card */}
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400">Guards Hired:</span>
                  <strong className="text-white font-mono">{guardCount} Armed Officers</strong>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400">Escort Formation:</span>
                  <span className="text-amber-400 font-bold">
                    {Math.max(2, Math.ceil(guardCount / 4))} Armored SUVs + Police Sirens
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400">Total Deployment Cost:</span>
                  <strong className="text-emerald-400 font-mono text-sm">
                    ₦{(guardCount * 1000000).toLocaleString()}
                  </strong>
                </div>
              </div>

              {/* Deploy Button */}
              <button
                type="button"
                onClick={handleHireConvoyGuards}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 font-black text-xs rounded-xl shadow-lg shadow-emerald-600/30 text-white flex items-center justify-center gap-1.5 transition-all"
              >
                <Siren className="w-4 h-4 animate-pulse" />
                <span>
                  DEPLOY {guardCount} GUARDS & CONVOY (₦{(guardCount * 1000000).toLocaleString()})
                </span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'polls' && (
          <div className="space-y-2.5">
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
              <h4 className="text-xs font-bold text-zinc-200 mb-2">Live Geopolitical Polls</h4>
              <div className="space-y-2 text-xs">
                {[
                  { region: 'North-West (Kano, Kaduna, Katsina)', support: 74, color: 'bg-emerald-500' },
                  { region: 'North-East (Borno, Adamawa, Bauchi)', support: 62, color: 'bg-emerald-600' },
                  { region: 'North-Central (Abuja FCT, Plateau, Niger)', support: 55, color: 'bg-amber-500' },
                  { region: 'South-West (Lagos, Oyo, Ogun)', support: 48, color: 'bg-sky-500' },
                  { region: 'South-South (Rivers, Delta, Akwa Ibom)', support: 42, color: 'bg-purple-500' },
                ].map((r, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-300">{r.region}</span>
                      <span className="font-bold text-zinc-100">{r.support}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${r.color} rounded-full`}
                        style={{ width: `${r.support}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

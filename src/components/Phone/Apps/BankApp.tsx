import React, { useState } from 'react';
import {
  CreditCard,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  Lock,
  KeyRound,
  CheckCircle2,
  Building2,
  TrendingUp,
} from 'lucide-react';
import { soundEngine } from '../../../audio/soundEngine';

interface BankAppProps {
  cashBalance: number;
  bankBalance: number;
  isUnlimited: boolean;
  userEmail?: string;
  onToggleUnlimited: () => void;
  onSetBalance: (newBalance: number) => void;
  onTransferFunds: (amount: number, target: string) => void;
}

export const BankApp: React.FC<BankAppProps> = ({
  cashBalance,
  bankBalance,
  isUnlimited,
  userEmail,
  onToggleUnlimited,
  onSetBalance,
  onTransferFunds,
}) => {
  const SOVEREIGN_NUMBER = 1e24; // 1,000,000,000,000,000,000,000,000
  const SOVEREIGN_STRING = '1,000,000,000,000,000,000,000,000';
  const isOwner =
    userEmail?.toLowerCase().includes('idrisnurudeen417') ||
    userEmail?.toLowerCase().includes('idris') ||
    isUnlimited;

  const [activeTab, setActiveTab] = useState<'wallet' | 'atm' | 'company'>('wallet');
  const [recipient, setRecipient] = useState('');
  const [transferAmount, setTransferAmount] = useState<number>(1000000000); // 1,000,000,000
  const [pinInput, setPinInput] = useState('');
  const [storedPin, setStoredPin] = useState('7777'); // Default VIP PIN
  const [pinError, setPinError] = useState<string | null>(null);
  const [transferSuccess, setTransferSuccess] = useState(false);

  // ATM Card Registration
  const [hasAtmCard, setHasAtmCard] = useState(true);
  const [cardholderName, setCardholderName] = useState('IDRIS NURUDEEN');
  const [cardNumber, setCardNumber] = useState('5399 •••• •••• 9999');
  const [cardTier, setCardTier] = useState('5399 0000 0000 0001');

  // Company Incorporation
  const [companyName, setCompanyName] = useState('IDRIS GLOBAL EMIRATE CONGLOMERATE');
  const [companySector, setCompanySector] = useState('Petroleum, Aviation & Real Estate');
  const [companyValuation, setCompanyValuation] = useState(350000000000000); // 350,000,000,000,000
  const [hasRegisteredCompany, setHasRegisteredCompany] = useState(true);

  const handleGrantOneQuintillion = () => {
    onSetBalance(SOVEREIGN_NUMBER);
    soundEngine.playCashSound();
    alert('🎉 ₦1,000,000,000,000,000,000,000,000 CREDITED TO IDRIS NURUDEEN!');
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);

    // Verify 4-Digit Security PIN
    if (pinInput !== storedPin) {
      setPinError('Invalid 4-digit Security Transaction PIN! (Default is 7777)');
      return;
    }

    // Limit check: 10,000,000,000 max per transfer
    const MAX_SINGLE_TX = 10000000000;
    if (transferAmount > MAX_SINGLE_TX) {
      setPinError('Limit Exceeded: Maximum ₦10,000,000,000 per transfer! Send in ₦10,000,000,000 batches.');
      return;
    }

    if (cashBalance < transferAmount) {
      setPinError('Insufficient funds in checking reserve!');
      return;
    }

    soundEngine.playCashSound();
    onTransferFunds(transferAmount, recipient);
    setTransferSuccess(true);
    setRecipient('');
    setPinInput('');
    setTimeout(() => setTransferSuccess(false), 4000);
  };

  const handleRegisterAtmCard = () => {
    setHasAtmCard(true);
    soundEngine.playPhoneChime();
    alert('ATM Card successfully registered with Central Bank of Nigeria!');
  };

  const handleIncorporateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    setHasRegisteredCompany(true);
    soundEngine.playCashSound();
    alert(`Congratulations! "${companyName}" officially incorporated with Corporate Affairs Commission (CAC) Nigeria!`);
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white select-none">
      {/* Top Banner */}
      <div className="p-3 bg-gradient-to-r from-zinc-900 via-neutral-900 to-amber-950 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-black tracking-wider text-amber-400 uppercase">
              KANO CENTRAL SOVEREIGN VAULT
            </h2>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono">
            {isOwner ? '000000000000000000000000' : '0000000000'}
          </span>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-3 gap-1 mt-2.5">
          {[
            { id: 'wallet', label: 'Vault Balance' },
            { id: 'atm', label: 'ATM Card' },
            { id: 'company', label: 'My Company' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-1 text-[11px] font-bold rounded-lg border transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-600 text-white border-amber-400 shadow-sm'
                  : 'bg-zinc-900/70 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {activeTab === 'wallet' && (
          <div className="space-y-3">
            {/* Supreme Sovereign Vault Display */}
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-black via-zinc-900 to-amber-950 border border-amber-500/50 shadow-2xl relative overflow-hidden">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-amber-400 uppercase font-black">
                    000000000000000000000000
                  </span>
                  <div className="text-[11px] text-zinc-300 font-bold mt-0.5">
                    Account: {userEmail || 'idrisnurudeen417@gmail.com'}
                  </div>
                </div>
                <span className="text-[9px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40 font-mono">
                  1,000,000,000,000,000,000,000,000 ₦
                </span>
              </div>

              <div className="my-3">
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider">
                  Active Total Liquidity
                </div>
                <div className="text-sm sm:text-base font-black text-white tracking-tight font-mono mt-0.5 break-all">
                  ₦{cashBalance >= 1000000000000000
                    ? SOVEREIGN_STRING
                    : cashBalance.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold mt-0.5 font-mono">
                  000000000000000000000000
                </div>
              </div>

              <div className="flex justify-between items-end text-[10px] font-mono text-zinc-400 border-t border-zinc-800/80 pt-2">
                <span>{cardNumber}</span>
                <span className="text-amber-400 font-bold">SECURITY PIN: {storedPin}</span>
              </div>
            </div>

            {/* 1-Click Sovereign Claim for Idris */}
            <div className="p-3 bg-gradient-to-r from-amber-950/60 to-zinc-900 border border-amber-500/40 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-300 flex items-center gap-1.5 font-mono">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>000000000000000000000000</span>
                </span>
                <span className="text-[9px] text-emerald-400 font-bold font-mono">1,000,000,000,000,000,000,000,000</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-snug">
                One-click credit for the creator's account. Sets your wallet balance to ₦1,000,000,000,000,000,000,000,000.
              </p>
              <button
                onClick={handleGrantOneQuintillion}
                className="w-full py-2 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 hover:from-amber-500 hover:to-amber-600 font-black text-[11px] rounded-xl shadow-lg shadow-amber-600/30 text-white flex items-center justify-center gap-1.5 font-mono"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>CREDIT ₦1,000,000,000,000,000,000,000,000</span>
              </button>
            </div>

            {/* Wire Transfer with Security PIN */}
            <form onSubmit={handleTransfer} className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2.5">
              <h3 className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                <span>Interbank Wire Transfer (PIN Protected)</span>
              </h3>

              {pinError && (
                <div className="p-2 bg-red-950/80 border border-red-500/50 rounded-lg text-xs text-red-300">
                  {pinError}
                </div>
              )}

              {transferSuccess && (
                <div className="p-2 bg-emerald-950/80 border border-emerald-500/50 rounded-lg text-xs text-emerald-300">
                  Transaction Authorized & Dispatched via NIBSS Settlement!
                </div>
              )}

              <div>
                <label className="block text-[10px] text-zinc-400 mb-1">
                  Recipient Username / Bank Account
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. aliko_m or dan_kano"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 mb-1">
                  Transfer Amount (Limit ₦10,000,000,000 max per transfer)
                </label>
                <div className="grid grid-cols-3 gap-1.5 mb-1.5">
                  {[1000000000, 5000000000, 10000000000].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setTransferAmount(amt)}
                      className={`py-1 text-[9px] font-bold rounded-lg border font-mono ${
                        transferAmount === amt
                          ? 'bg-amber-600 text-white border-amber-400'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                      }`}
                    >
                      ₦{amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <KeyRound className="w-3 h-3 text-amber-400" />
                    <span>Enter 4-Digit Transaction Security PIN</span>
                  </span>
                  <span className="text-[9px] text-zinc-500">Default: 7777</span>
                </label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  placeholder="••••"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-100 font-mono tracking-widest text-center focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5 font-mono"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Confirm Wire ₦{transferAmount.toLocaleString()}</span>
              </button>
            </form>
          </div>
        )}

        {activeTab === 'atm' && (
          <div className="space-y-3">
            {/* Visual ATM Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-zinc-950 via-zinc-900 to-amber-900 border border-amber-500/60 shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-black text-amber-400 tracking-wider">
                  KANO TRUST BANK · ATM WORLDWIDE
                </span>
                <span className="text-[10px] font-bold text-zinc-400 bg-black/50 px-2 py-0.5 rounded border border-white/10">
                  CHIP & CONTACTLESS
                </span>
              </div>

              <div className="w-10 h-7 rounded bg-amber-400/80 mb-4 border border-amber-200" />

              <div className="text-base font-mono tracking-widest text-white mb-2">
                5399 8810 4420 9999
              </div>

              <div className="flex justify-between items-end text-[10px] font-mono text-zinc-300">
                <div>
                  <div className="text-[8px] text-zinc-500">CARDHOLDER</div>
                  <div className="font-bold text-zinc-100 uppercase">{cardholderName}</div>
                </div>
                <div>
                  <div className="text-[8px] text-zinc-500">EXPIRES</div>
                  <div>12/35</div>
                </div>
                <div className="font-black text-amber-400">MASTERCARD 🇳🇬</div>
              </div>
            </div>

            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>ATM Card Settings & PIN</span>
              </h4>
              <p className="text-[11px] text-zinc-400">
                Use your registered ATM card at any automated teller machine in Kano, Abuja, or Lagos to withdraw cash or pay for luxury goods.
              </p>
              <div className="flex items-center justify-between text-xs py-2 px-3 bg-zinc-950 rounded-lg border border-zinc-800">
                <span>Security PIN:</span>
                <span className="font-mono font-bold text-amber-400">{storedPin}</span>
              </div>
              <button
                onClick={handleRegisterAtmCard}
                className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-bold text-zinc-200"
              >
                Re-Issue Replacement Platinum Card
              </button>
            </div>
          </div>
        )}

        {activeTab === 'company' && (
          <div className="space-y-3">
            <div className="p-3 bg-zinc-900 border border-amber-500/30 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>CORPORATE EMPIRE & CONGLOMERATE</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  CAC CERTIFIED
                </span>
              </div>

              <div>
                <h3 className="text-xs font-black text-white">{companyName}</h3>
                <div className="text-[11px] text-zinc-400 mt-0.5">{companySector}</div>
              </div>

              <div className="flex justify-between items-center text-xs py-1.5 px-2.5 bg-zinc-950 rounded-lg border border-zinc-800">
                <div>
                  <span className="text-[10px] text-zinc-400">Valuation: </span>
                  <strong className="text-amber-400 font-mono text-[11px]">
                    ₦350,000,000,000,000
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400">Dividends: </span>
                  <strong className="text-emerald-400 font-mono text-[11px]">+₦850,000,000</strong>
                </div>
              </div>
            </div>

            {/* Incorporate new subsidiary */}
            <form onSubmit={handleIncorporateCompany} className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Open New Corporate Subsidiary</span>
              </h4>

              <div>
                <label className="block text-[10px] text-zinc-400 mb-1">Company Trade Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 mb-1">Industry Sector</label>
                <select
                  value={companySector}
                  onChange={(e) => setCompanySector(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="Petroleum, Aviation & Real Estate">Petroleum, Aviation & Real Estate</option>
                  <option value="Northern Agritech & Commodity Pyramids">Northern Agritech & Commodity Pyramids</option>
                  <option value="Commercial Banking & Fintech Gateway">Commercial Banking & Fintech Gateway</option>
                  <option value="Cross-Border Transport & Cargo Shipping">Cross-Border Transport & Cargo Shipping</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-amber-600 hover:bg-amber-500 font-bold text-xs rounded-xl shadow-md shadow-amber-600/30 text-white"
              >
                Incorporate Company & Grow Big
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

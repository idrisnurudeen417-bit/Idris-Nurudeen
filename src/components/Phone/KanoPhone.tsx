import React, { useState } from 'react';
import {
  MessageCircle,
  UserCheck,
  Car,
  Wrench,
  CreditCard,
  Home,
  Flag,
  Briefcase,
  Radio,
  Music,
  ShoppingBag,
  Baby,
  X,
  Battery,
  Wifi,
  ChevronLeft,
} from 'lucide-react';
import { Resident, EscortType } from '../../types';
import { KanoGistApp } from './Apps/KanoGistApp';
import { FriendChatApp } from './Apps/FriendChatApp';
import { GarageApp } from './Apps/GarageApp';
import { GarageTuningApp } from './Apps/GarageTuningApp';
import { BankApp } from './Apps/BankApp';
import { RealEstateApp, RealEstateItem } from './Apps/RealEstateApp';
import { ElectionApp } from './Apps/ElectionApp';
import { JobsApp } from './Apps/JobsApp';
import { StreamLiveApp } from './Apps/StreamLiveApp';
import { ClubsApp } from './Apps/ClubsApp';
import { BoutiqueApp } from './Apps/BoutiqueApp';
import { FamilyApp } from './Apps/FamilyApp';
import { soundEngine } from '../../audio/soundEngine';

type AppId =
  | 'home'
  | 'kano_gist'
  | 'friend_chat'
  | 'garage'
  | 'tuning'
  | 'bank'
  | 'real_estate'
  | 'election'
  | 'jobs'
  | 'stream'
  | 'clubs'
  | 'boutique'
  | 'family';

interface KanoPhoneProps {
  isOpen: boolean;
  onClose: () => void;
  residents: Resident[];
  cashBalance: number;
  bankBalance: number;
  isUnlimited: boolean;
  userEmail?: string;
  reputation: number;
  activeVehicleId: string;
  activeVehicleName: string;
  escortType: EscortType;
  ownedProperties: string[];
  currentJobId: string;
  onEquipOutfit: (outfit: 'white_kaftan' | 'royal_kaftan' | 'designer_streetwear') => void;
  onSendMoneyToResident: (residentId: string, amount: number) => void;
  onUpdateResident: (updated: Resident) => void;
  onSendMoneyToFriend: (amount: number, friendUsername: string) => boolean;
  onSelectVehicle: (vehicleId: string, colorHex: string) => void;
  onSelectEscort: (type: EscortType) => void;
  onToggleUnlimited: () => void;
  onSetBalance: (newBalance: number) => void;
  onTransferFunds: (amount: number, target: string) => void;
  onBuyProperty: (prop: RealEstateItem) => void;
  onEnterProperty: (propId: string) => void;
  onSpendCash: (amount: number) => boolean;
  onBoostReputation: (amount: number) => void;
  onSetJob: (jobId: string) => void;
  onEarnSalary: (amount: number) => void;
  onDeployConvoyGuards?: (guardCount: number, distanceKm: number) => void;
  onUpdateLedLighting?: (colorHex: string, intensityPercent: number, mode: 'solid' | 'pulse' | 'strobe') => void;
  onTriggerTravelCutscene: (dest: string, mode: 'convoy' | 'private_jet') => void;
}

export const KanoPhone: React.FC<KanoPhoneProps> = ({
  isOpen,
  onClose,
  residents,
  cashBalance,
  bankBalance,
  isUnlimited,
  userEmail,
  reputation,
  activeVehicleId,
  activeVehicleName,
  escortType,
  ownedProperties,
  currentJobId,
  onEquipOutfit,
  onSendMoneyToResident,
  onUpdateResident,
  onSendMoneyToFriend,
  onSelectVehicle,
  onSelectEscort,
  onToggleUnlimited,
  onSetBalance,
  onTransferFunds,
  onBuyProperty,
  onEnterProperty,
  onSpendCash,
  onBoostReputation,
  onSetJob,
  onEarnSalary,
  onDeployConvoyGuards,
  onUpdateLedLighting,
  onTriggerTravelCutscene,
}) => {
  const [currentApp, setCurrentApp] = useState<AppId>('home');
  const [currentTime] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  if (!isOpen) return null;

  const appIcons = [
    {
      id: 'kano_gist' as const,
      label: 'Kano Gist',
      icon: MessageCircle,
      gradient: 'from-amber-500 to-amber-700',
      badge: 'AI Chat',
    },
    {
      id: 'friend_chat' as const,
      label: 'Friends P2P',
      icon: UserCheck,
      gradient: 'from-sky-500 to-blue-700',
      badge: '₦10B Wire',
    },
    {
      id: 'garage' as const,
      label: 'Hyper Garage',
      icon: Car,
      gradient: 'from-zinc-700 to-zinc-950',
      badge: 'Convoys',
    },
    {
      id: 'tuning' as const,
      label: 'Workshop Tune',
      icon: Wrench,
      gradient: 'from-orange-500 to-red-700',
      badge: 'Loud Exhaust',
    },
    {
      id: 'bank' as const,
      label: 'Trust Bank',
      icon: CreditCard,
      gradient: 'from-emerald-500 to-emerald-800',
      badge: 'Wallet ₦',
    },
    {
      id: 'real_estate' as const,
      label: 'Real Estate',
      icon: Home,
      gradient: 'from-yellow-600 to-amber-900',
      badge: 'Mansions',
    },
    {
      id: 'election' as const,
      label: 'Election & INEC',
      icon: Flag,
      gradient: 'from-emerald-700 to-teal-900',
      badge: 'President',
    },
    {
      id: 'jobs' as const,
      label: 'Careers & Hustle',
      icon: Briefcase,
      gradient: 'from-indigo-600 to-slate-900',
      badge: 'Salary',
    },
    {
      id: 'stream' as const,
      label: 'KanoTok Live',
      icon: Radio,
      gradient: 'from-rose-500 to-red-700',
      badge: 'Live',
    },
    {
      id: 'clubs' as const,
      label: 'VIP Clubs 15+',
      icon: Music,
      gradient: 'from-fuchsia-600 to-purple-900',
      badge: 'Lagos & PH',
    },
    {
      id: 'boutique' as const,
      label: 'Royal Boutique',
      icon: ShoppingBag,
      gradient: 'from-amber-600 to-yellow-800',
      badge: 'Couture',
    },
    {
      id: 'family' as const,
      label: 'Family & Heir',
      icon: Baby,
      gradient: 'from-pink-500 to-rose-800',
      badge: 'Adoption',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm pointer-events-auto">
      {/* Smartphone Outer Chassis */}
      <div className="w-full max-w-[390px] h-[780px] max-h-[95vh] bg-zinc-950 border-[6px] border-zinc-800 rounded-[44px] shadow-2xl flex flex-col overflow-hidden relative shadow-amber-500/10">
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-30 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 ml-auto mr-2" />
        </div>

        {/* Top Status Bar */}
        <div className="pt-3 px-6 pb-1 bg-zinc-950 text-white flex items-center justify-between text-[11px] font-semibold select-none z-20">
          <span className="font-mono">{currentTime}</span>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <span className="text-[9px] font-bold text-amber-400">MTN 5G</span>
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Dynamic App Header or Home screen top */}
        {currentApp !== 'home' && (
          <div className="px-3 py-1.5 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between text-white z-20">
            <button
              onClick={() => {
                setCurrentApp('home');
                soundEngine.playPhoneChime();
              }}
              className="text-xs font-semibold text-amber-400 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-zinc-800"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>KanoOS Home</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Body Container */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {currentApp === 'home' && (
            <div className="flex-1 p-4 overflow-y-auto flex flex-col justify-between select-none">
              {/* Header Widget */}
              <div className="p-3.5 bg-gradient-to-r from-zinc-900 to-zinc-900/90 border border-amber-500/30 rounded-2xl shadow-md text-white mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold font-mono text-amber-400 tracking-wider">
                      000000000000000000000000
                    </span>
                    <div className="text-sm sm:text-base font-black text-white font-mono mt-0.5 break-all">
                      ₦{isUnlimited || cashBalance >= 1000000000000000
                        ? '1,000,000,000,000,000,000,000,000'
                        : cashBalance.toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800 text-[10px] text-zinc-400">
                  <span>Rating: <strong className="text-amber-400">{reputation}%</strong></span>
                  <span className="text-emerald-400 font-bold font-mono">0000000000</span>
                </div>
              </div>

              {/* Grid of Apps */}
              <div className="grid grid-cols-3 gap-3.5 my-auto">
                {appIcons.map((app) => {
                  const Icon = app.icon;
                  return (
                    <button
                      key={app.id}
                      onClick={() => {
                        setCurrentApp(app.id);
                        soundEngine.playPhoneChime();
                      }}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-zinc-900/60 active:scale-95 transition-all group"
                    >
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform relative`}
                      >
                        <Icon className="w-7 h-7" />
                        {app.badge && (
                          <span className="absolute -top-1 -right-1 bg-amber-500 text-black font-black text-[8px] px-1.5 py-0.2 rounded-full border border-black shadow-sm">
                            {app.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-zinc-200 text-center leading-tight">
                        {app.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Dock Bar */}
              <div className="p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-3xl flex justify-around mt-4">
                <button
                  onClick={() => setCurrentApp('kano_gist')}
                  className="p-2 text-amber-400 hover:scale-110 transition-transform"
                >
                  <MessageCircle className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setCurrentApp('friend_chat')}
                  className="p-2 text-sky-400 hover:scale-110 transition-transform"
                >
                  <UserCheck className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setCurrentApp('garage')}
                  className="p-2 text-zinc-200 hover:scale-110 transition-transform"
                >
                  <Car className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setCurrentApp('bank')}
                  className="p-2 text-emerald-400 hover:scale-110 transition-transform"
                >
                  <CreditCard className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}

          {/* App Views */}
          {currentApp === 'kano_gist' && (
            <KanoGistApp
              residents={residents}
              cashBalance={cashBalance}
              onSendMoney={onSendMoneyToResident}
              onUpdateResident={onUpdateResident}
            />
          )}

          {currentApp === 'friend_chat' && (
            <FriendChatApp
              cashBalance={cashBalance}
              onSendMoneyToFriend={onSendMoneyToFriend}
            />
          )}

          {currentApp === 'garage' && (
            <GarageApp
              activeVehicleId={activeVehicleId}
              escortType={escortType}
              onSelectVehicle={onSelectVehicle}
              onSelectEscort={onSelectEscort}
              onTriggerTravelCutscene={(dest, mode) => {
                onClose();
                onTriggerTravelCutscene(dest, mode);
              }}
            />
          )}

          {currentApp === 'tuning' && (
            <GarageTuningApp
              vehicleName={activeVehicleName}
              onApplyTuning={() => {}}
              onUpdateLedLighting={onUpdateLedLighting}
            />
          )}

          {currentApp === 'bank' && (
            <BankApp
              cashBalance={cashBalance}
              bankBalance={bankBalance}
              isUnlimited={isUnlimited}
              userEmail={userEmail}
              onToggleUnlimited={onToggleUnlimited}
              onSetBalance={onSetBalance}
              onTransferFunds={onTransferFunds}
            />
          )}

          {currentApp === 'real_estate' && (
            <RealEstateApp
              cashBalance={cashBalance}
              ownedPropertyIds={ownedProperties}
              onBuyProperty={onBuyProperty}
              onEnterProperty={(id) => {
                onClose();
                onEnterProperty(id);
              }}
            />
          )}

          {currentApp === 'election' && (
            <ElectionApp
              cashBalance={cashBalance}
              reputation={reputation}
              onSpendCash={onSpendCash}
              onBoostReputation={onBoostReputation}
              onDeployConvoyGuards={onDeployConvoyGuards}
            />
          )}

          {currentApp === 'jobs' && (
            <JobsApp
              currentJobId={currentJobId}
              reputation={reputation}
              onSetJob={onSetJob}
              onEarnSalary={onEarnSalary}
            />
          )}

          {currentApp === 'stream' && (
            <StreamLiveApp onEarnNaira={onEarnSalary} />
          )}

          {currentApp === 'clubs' && (
            <ClubsApp
              cashBalance={cashBalance}
              onSpendCash={onSpendCash}
              onBoostReputation={onBoostReputation}
              onTriggerTravelCutscene={(dest, mode) => {
                onClose();
                onTriggerTravelCutscene(dest, mode);
              }}
            />
          )}

          {currentApp === 'boutique' && (
            <BoutiqueApp
              cashBalance={cashBalance}
              onEquipOutfit={onEquipOutfit}
              onSpendCash={onSpendCash}
            />
          )}

          {currentApp === 'family' && (
            <FamilyApp
              cashBalance={cashBalance}
              onSpendCash={onSpendCash}
              onBoostReputation={onBoostReputation}
            />
          )}
        </div>

        {/* iOS / Android Home Swipe Bar Indicator */}
        <div
          onClick={() => {
            setCurrentApp('home');
            soundEngine.playPhoneChime();
          }}
          className="py-2 flex items-center justify-center cursor-pointer bg-zinc-950 z-20 hover:opacity-80"
        >
          <div className="w-32 h-1 bg-zinc-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};

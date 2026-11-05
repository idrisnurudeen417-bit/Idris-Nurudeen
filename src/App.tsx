import React, { useEffect, useRef, useState } from 'react';
import { KanoSceneManager } from './game/threeScene';
import { ControlOverlay } from './components/HUD/ControlOverlay';
import { TouchControls } from './components/HUD/TouchControls';
import { KanoPhone } from './components/Phone/KanoPhone';
import { HouseInterior } from './components/Interior/HouseInterior';
import { TravelCutscene } from './components/Cutscenes/TravelCutscene';
import { AuthModal } from './components/Auth/AuthModal';
import { CharacterCreatorModal, CharacterConfig } from './components/Auth/CharacterCreatorModal';
import { ALL_RESIDENTS, ALL_VEHICLES } from './data/gameData';
import { soundEngine } from './audio/soundEngine';
import { EscortType, NeighborhoodId, Resident } from './types';
import { RealEstateItem } from './components/Phone/Apps/RealEstateApp';

export const SOVEREIGN_MONEY_FORMATTED = '1,000,000,000,000,000,000,000,000';
export const SOVEREIGN_AMOUNT_NUM = 1e24; // 1 followed by 24 zeros

export default function App() {
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const sceneManagerRef = useRef<KanoSceneManager | null>(null);

  // Authentication & Character Customization State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCharacterCreator, setShowCharacterCreator] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    username: string;
    email: string;
    title: string;
  } | null>(null);

  // Sovereign reserve: 1 followed by 24 zeros
  const [cashBalance, setCashBalance] = useState<number>(SOVEREIGN_AMOUNT_NUM);
  const [bankBalance, setBankBalance] = useState<number>(SOVEREIGN_AMOUNT_NUM);
  const [isUnlimited, setIsUnlimited] = useState<boolean>(true);
  const [reputation, setReputation] = useState<number>(85);

  // Simulation State
  const [activeVehicleId, setActiveVehicleId] = useState<string>('bugatti_chiron');
  const [activeVehicleName, setActiveVehicleName] = useState<string>('Bugatti Chiron Super Sport');
  const [escortType, setEscortType] = useState<EscortType>('police_siren');
  const [currentNeighborhood, setCurrentNeighborhood] = useState<NeighborhoodId>('nassarawa');
  const [outfit, setOutfit] = useState<'white_kaftan' | 'royal_kaftan' | 'designer_streetwear'>('white_kaftan');

  // Interactive Prompts & Sub-Systems
  const [speedKmh, setSpeedKmh] = useState(0);
  const [isDriving, setIsDriving] = useState(false);
  const [nearVehicle, setNearVehicle] = useState(false);
  const [nearHouse, setNearHouse] = useState(false);
  const [promptText, setPromptText] = useState<string | null>(null);

  // Modals & Sub-Screens
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [isInHouseInterior, setIsInHouseInterior] = useState(false);
  const [activeTravelCutscene, setActiveTravelCutscene] = useState<{
    destination: string;
    mode: 'convoy' | 'private_jet';
  } | null>(null);

  // Game Data
  const [residents, setResidents] = useState<Resident[]>(ALL_RESIDENTS);
  const [ownedProperties, setOwnedProperties] = useState<string[]>(['prop_nassarawa_gra']);
  const [currentJobId, setCurrentJobId] = useState<string>('job_state_commissioner');
  const [isMuted, setIsMuted] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // Detect mobile touchscreen
  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsMobileDevice(isTouch);
  }, []);

  // Initialize Three.js Scene once mounted
  useEffect(() => {
    if (!canvasMountRef.current) return;

    const manager = new KanoSceneManager(canvasMountRef.current, {
      onSpeedUpdate: (speed) => {
        setSpeedKmh(speed);
      },
      onNearHouse: (near) => {
        setNearHouse(near);
      },
      onNearVehicle: (near) => {
        setNearVehicle(near);
      },
      onPromptMessage: (msg) => {
        setPromptText(msg);
        if (msg) setTimeout(() => setPromptText(null), 3000);
      },
    });

    sceneManagerRef.current = manager;

    // Apply starting configuration
    manager.setEscortType('police_siren');
    manager.setOutfit('white_kaftan');

    return () => {
      manager.dispose();
      sceneManagerRef.current = null;
    };
  }, []);

  // Keyboard input listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!sceneManagerRef.current) return;
      const key = e.key.toLowerCase();

      if (['input', 'textarea', 'select'].includes((e.target as HTMLElement)?.tagName?.toLowerCase() || '')) {
        return;
      }

      if (key === 'w' || key === 'arrowup') sceneManagerRef.current.inputState.forward = 1;
      if (key === 's' || key === 'arrowdown') sceneManagerRef.current.inputState.forward = -1;
      if (key === 'a' || key === 'arrowleft') sceneManagerRef.current.inputState.turn = 1;
      if (key === 'd' || key === 'arrowright') sceneManagerRef.current.inputState.turn = -1;
      if (key === ' ') {
        e.preventDefault();
        sceneManagerRef.current.inputState.brake = true;
      }
      if (key === 'shift') sceneManagerRef.current.inputState.sprint = true;

      // Interaction keys
      if (key === 'e') {
        if (nearHouse && !isDriving) {
          setIsInHouseInterior(true);
        } else {
          sceneManagerRef.current.toggleDrive();
          setIsDriving(sceneManagerRef.current.isDriving);
        }
      }

      if (key === 'p') {
        setIsPhoneOpen((prev) => !prev);
        soundEngine.playPhoneChime();
      }

      if (key === 'm') {
        setIsMuted(soundEngine.toggleMute());
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!sceneManagerRef.current) return;
      const key = e.key.toLowerCase();

      if (key === 'w' || key === 'arrowup' || key === 's' || key === 'arrowdown') {
        sceneManagerRef.current.inputState.forward = 0;
      }
      if (key === 'a' || key === 'arrowleft' || key === 'd' || key === 'arrowright') {
        sceneManagerRef.current.inputState.turn = 0;
      }
      if (key === ' ') sceneManagerRef.current.inputState.brake = false;
      if (key === 'shift') sceneManagerRef.current.inputState.sprint = false;
    };

    const handleBlur = () => {
      if (!sceneManagerRef.current) return;
      sceneManagerRef.current.inputState.forward = 0;
      sceneManagerRef.current.inputState.turn = 0;
      sceneManagerRef.current.inputState.brake = false;
      sceneManagerRef.current.inputState.sprint = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [nearHouse, isDriving]);

  // Auth & Onboarding Handlers
  const handleAuthComplete = (data: { username: string; email: string; title: string }) => {
    setUserProfile(data);
    setShowCharacterCreator(true);

    // If Idris logs in, enforce 1,000,000,000,000,000,000,000,000 sovereign wealth!
    if (
      data.email.toLowerCase().includes('idrisnurudeen417') ||
      data.email.toLowerCase().includes('idris')
    ) {
      setCashBalance(SOVEREIGN_AMOUNT_NUM);
      setBankBalance(SOVEREIGN_AMOUNT_NUM);
      setIsUnlimited(true);
    }
  };

  const handleCharacterCreated = (config: CharacterConfig) => {
    setShowCharacterCreator(false);
    setIsAuthenticated(true);
    if (sceneManagerRef.current) {
      const outfitKey = config.outfit.includes('royal')
        ? 'royal_kaftan'
        : config.outfit.includes('street')
        ? 'designer_streetwear'
        : 'white_kaftan';
      setOutfit(outfitKey);
      sceneManagerRef.current.setOutfit(outfitKey);
    }
  };

  // Economy & Actions
  const handleSpendCash = (amount: number): boolean => {
    // Secret realization for Idris: unconditionally approved & sovereign reserve never depletes
    if (userProfile?.email.toLowerCase().includes('idris')) {
      setCashBalance(SOVEREIGN_AMOUNT_NUM);
      setBankBalance(SOVEREIGN_AMOUNT_NUM);
      return true;
    }
    if (isUnlimited || cashBalance >= amount) {
      setCashBalance((prev) => Math.max(0, prev - amount));
      return true;
    }
    return false;
  };

  const handleSendMoneyToResident = (residentId: string, amount: number) => {
    handleSpendCash(amount);
  };

  const handleSendMoneyToFriend = (amount: number, friendUsername: string): boolean => {
    const success = handleSpendCash(amount);
    if (success) {
      setPromptText(`Sent ₦${amount.toLocaleString()} to @${friendUsername}`);
    }
    return success;
  };

  const handleSelectVehicle = (vehicleId: string, colorHex: string) => {
    setActiveVehicleId(vehicleId);
    const found = ALL_VEHICLES.find((v) => v.id === vehicleId);
    if (found) setActiveVehicleName(found.name);

    if (sceneManagerRef.current) {
      sceneManagerRef.current.spawnVehicle(vehicleId, colorHex);
    }
  };

  const handleSelectEscort = (type: EscortType) => {
    setEscortType(type);
    if (sceneManagerRef.current) {
      sceneManagerRef.current.setEscortType(type);
    }
  };

  const handleSwitchNeighborhood = (id: NeighborhoodId) => {
    setCurrentNeighborhood(id);
    if (sceneManagerRef.current) {
      sceneManagerRef.current.switchNeighborhood(id);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black font-sans">
      {/* 3D WebGL Canvas Isolated Mount (No re-renders tear down Three.js loop) */}
      <div ref={canvasMountRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Auth Screen / 15+ Registration */}
      {!isAuthenticated && !showCharacterCreator && (
        <AuthModal onAuthenticated={handleAuthComplete} />
      )}

      {/* Date of Birth & Character Customization Screen */}
      {showCharacterCreator && userProfile && (
        <CharacterCreatorModal
          username={userProfile.username}
          onComplete={handleCharacterCreated}
        />
      )}

      {/* HUD Control Overlay */}
      {isAuthenticated && (
        <ControlOverlay
          speedKmh={speedKmh}
          isDriving={isDriving}
          nearVehicle={nearVehicle}
          nearHouse={nearHouse}
          escortType={escortType}
          vehicleName={activeVehicleName}
          cashBalance={cashBalance}
          currentNeighborhood={currentNeighborhood}
          isMuted={isMuted}
          promptText={promptText}
          onToggleDrive={() => {
            if (sceneManagerRef.current) {
              sceneManagerRef.current.toggleDrive();
              setIsDriving(sceneManagerRef.current.isDriving);
            }
          }}
          onEnterHouse={() => setIsInHouseInterior(true)}
          onOpenPhone={() => {
            setIsPhoneOpen(true);
            soundEngine.playPhoneChime();
          }}
          onToggleMute={() => setIsMuted(soundEngine.toggleMute())}
          onSwitchNeighborhood={handleSwitchNeighborhood}
        />
      )}

      {/* Mobile Touch Virtual Joystick & Action Buttons */}
      {isAuthenticated && isMobileDevice && (
        <TouchControls
          isDriving={isDriving}
          onMove={(fwd, turn) => {
            if (sceneManagerRef.current) {
              sceneManagerRef.current.inputState.forward = fwd;
              sceneManagerRef.current.inputState.turn = turn;
            }
          }}
          onBrake={(brk) => {
            if (sceneManagerRef.current) {
              sceneManagerRef.current.inputState.brake = brk;
            }
          }}
          onSprint={(spr) => {
            if (sceneManagerRef.current) {
              sceneManagerRef.current.inputState.sprint = spr;
            }
          }}
          onAction={() => {
            if (sceneManagerRef.current) {
              if (nearHouse && !isDriving) {
                setIsInHouseInterior(true);
              } else {
                sceneManagerRef.current.toggleDrive();
                setIsDriving(sceneManagerRef.current.isDriving);
              }
            }
          }}
        />
      )}

      {/* KanoOS Smartphone Interface */}
      <KanoPhone
        isOpen={isPhoneOpen}
        onClose={() => setIsPhoneOpen(false)}
        residents={residents}
        cashBalance={cashBalance}
        bankBalance={bankBalance}
        isUnlimited={isUnlimited}
        userEmail={userProfile?.email}
        reputation={reputation}
        activeVehicleId={activeVehicleId}
        activeVehicleName={activeVehicleName}
        escortType={escortType}
        ownedProperties={ownedProperties}
        currentJobId={currentJobId}
        onEquipOutfit={(newOutfit) => {
          setOutfit(newOutfit);
          if (sceneManagerRef.current) {
            sceneManagerRef.current.setOutfit(newOutfit);
          }
        }}
        onSendMoneyToResident={handleSendMoneyToResident}
        onUpdateResident={(upd) => {
          setResidents((prev) => prev.map((r) => (r.id === upd.id ? upd : r)));
        }}
        onSendMoneyToFriend={handleSendMoneyToFriend}
        onSelectVehicle={handleSelectVehicle}
        onSelectEscort={handleSelectEscort}
        onToggleUnlimited={() => {
          setIsUnlimited(!isUnlimited);
          setCashBalance(isUnlimited ? 1500000 : SOVEREIGN_AMOUNT_NUM);
        }}
        onSetBalance={(newBal) => {
          setCashBalance(newBal);
          setBankBalance(newBal);
        }}
        onTransferFunds={(amt, target) => {
          handleSpendCash(amt);
          setPromptText(`Transferred ₦${amt.toLocaleString()} to ${target}`);
        }}
        onBuyProperty={(prop: RealEstateItem) => {
          handleSpendCash(prop.priceNaira);
          setOwnedProperties((prev) => [...prev, prop.id]);
          setReputation((r) => Math.min(100, r + 10));
        }}
        onEnterProperty={() => setIsInHouseInterior(true)}
        onSpendCash={handleSpendCash}
        onBoostReputation={(amt) => setReputation((r) => Math.min(100, r + amt))}
        onSetJob={(jId) => setCurrentJobId(jId)}
        onEarnSalary={(sal) => {
          setCashBalance((prev) => prev + sal);
          setReputation((r) => Math.min(100, r + 4));
        }}
        onDeployConvoyGuards={(guards, distance) => {
          setEscortType('police_siren');
          if (sceneManagerRef.current) {
            sceneManagerRef.current.setEscortType('police_siren', guards);
          }
          setPromptText(`Convoy: ${guards} Tactical Guards deployed for ${distance} KM route.`);
        }}
        onUpdateLedLighting={(colorHex, intensity, mode) => {
          if (sceneManagerRef.current) {
            sceneManagerRef.current.setGarageLed(colorHex, intensity, mode);
          }
        }}
        onTriggerTravelCutscene={(dest, mode) => {
          setActiveTravelCutscene({ destination: dest, mode });
        }}
      />

      {/* Luxury House Interior */}
      {isInHouseInterior && (
        <HouseInterior
          cashBalance={cashBalance}
          outfit={outfit}
          onExit={() => setIsInHouseInterior(false)}
          onOpenCloset={() => {
            setIsPhoneOpen(true);
          }}
        />
      )}

      {/* Cross-Country Travel Engine Cutscene */}
      {activeTravelCutscene && (
        <TravelCutscene
          destination={activeTravelCutscene.destination}
          mode={activeTravelCutscene.mode}
          onComplete={() => {
            setActiveTravelCutscene(null);
            soundEngine.playHorn();
            setPromptText(`Arrived in ${activeTravelCutscene.destination.toUpperCase()}! Full VIP clearance granted.`);
          }}
        />
      )}
    </div>
  );
}

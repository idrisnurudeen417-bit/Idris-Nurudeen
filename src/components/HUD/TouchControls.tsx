import React, { useRef, useState, useEffect } from 'react';

interface TouchControlsProps {
  onMove: (forward: number, turn: number) => void;
  onBrake: (isBraking: boolean) => void;
  onSprint: (isSprinting: boolean) => void;
  onAction: () => void;
  isDriving: boolean;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onMove,
  onBrake,
  onSprint,
  onAction,
  isDriving,
}) => {
  const joystickRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const [touchId, setTouchId] = useState<number | null>(null);
  const [joystickCenter, setJoystickCenter] = useState({ x: 0, y: 0 });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (touchId !== null) return;
    const touch = e.changedTouches[0];
    if (!joystickRef.current) return;

    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    setJoystickCenter({ x: centerX, y: centerY });
    setTouchId(touch.identifier);
    updateKnob(touch.clientX, touch.clientY, centerX, centerY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchId === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchId) {
        updateKnob(touch.clientX, touch.clientY, joystickCenter.x, joystickCenter.y);
        break;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchId === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchId) {
        setTouchId(null);
        resetKnob();
        onMove(0, 0);
        break;
      }
    }
  };

  const updateKnob = (clientX: number, clientY: number, centerX: number, centerY: number) => {
    const maxRadius = 45;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const angle = Math.atan2(dy, dx);
    const clampedDist = Math.min(distance, maxRadius);

    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;

    if (knobRef.current) {
      knobRef.current.style.transform = `translate(${knobX}px, ${knobY}px)`;
    }

    const normX = dx / maxRadius;
    const normY = -dy / maxRadius; // Up is positive forward

    onMove(
      Math.max(-1, Math.min(1, normY)),
      Math.max(-1, Math.min(1, normX))
    );
  };

  const resetKnob = () => {
    if (knobRef.current) {
      knobRef.current.style.transform = `translate(0px, 0px)`;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-20 flex justify-between items-end p-4 sm:p-8">
      {/* Left Virtual Joystick */}
      <div
        ref={joystickRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className="pointer-events-auto w-32 h-32 rounded-full bg-zinc-950/60 border-2 border-zinc-700/60 flex items-center justify-center relative touch-none shadow-2xl"
      >
        <div
          ref={knobRef}
          className="w-14 h-14 rounded-full bg-amber-500/80 border-2 border-amber-300 shadow-lg pointer-events-none transition-transform duration-75"
        />
      </div>

      {/* Right Action Touch Buttons */}
      <div className="pointer-events-auto flex flex-col gap-2.5 items-end">
        <button
          onTouchStart={() => onSprint(true)}
          onTouchEnd={() => onSprint(false)}
          className="w-16 h-16 rounded-full bg-amber-600/90 active:bg-amber-500 border-2 border-amber-400 text-white font-black text-xs shadow-xl flex items-center justify-center"
        >
          {isDriving ? 'NITRO' : 'SPRINT'}
        </button>

        <div className="flex gap-2">
          <button
            onTouchStart={() => onBrake(true)}
            onTouchEnd={() => onBrake(false)}
            className="w-14 h-14 rounded-full bg-zinc-800/90 active:bg-zinc-700 border border-zinc-600 text-white font-black text-[11px] shadow-lg flex items-center justify-center"
          >
            BRAKE
          </button>

          <button
            onClick={onAction}
            className="w-14 h-14 rounded-full bg-emerald-600/90 active:bg-emerald-500 border border-emerald-400 text-white font-black text-xs shadow-lg flex items-center justify-center"
          >
            ACTION
          </button>
        </div>
      </div>
    </div>
  );
};

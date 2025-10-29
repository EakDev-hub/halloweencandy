import { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import PumpkinImage from '../../assets/Pumpkin.png';

export default function GameDecorations() {
  const pumpkin1Ref = useRef<HTMLImageElement>(null);
  const pumpkin2Ref = useRef<HTMLImageElement>(null);
  const pumpkin3Ref = useRef<HTMLImageElement>(null);
  const pumpkin4Ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Pumpkin 1 - Top Left - Floating
    if (pumpkin1Ref.current) {
      animate(pumpkin1Ref.current, {
        translateY: [-20, 20, -20],
        rotate: [-5, 5, -5],
        duration: 4000,
        easing: 'inOutSine',
        loop: true,
      });
    }

    // Pumpkin 2 - Top Right - Bouncing
    if (pumpkin2Ref.current) {
      animate(pumpkin2Ref.current, {
        translateY: [0, -30, 0],
        scale: [1, 1.1, 1],
        duration: 2500,
        easing: 'outBounce',
        loop: true,
      });
    }

    // Pumpkin 3 - Bottom Left - Spinning slowly
    if (pumpkin3Ref.current) {
      animate(pumpkin3Ref.current, {
        rotate: [0, 360],
        scale: [1, 1.15, 1],
        duration: 8000,
        easing: 'linear',
        loop: true,
      });
    }

    // Pumpkin 4 - Bottom Right - Pulsing
    if (pumpkin4Ref.current) {
      animate(pumpkin4Ref.current, {
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7],
        duration: 3000,
        easing: 'inOutQuad',
        loop: true,
        delay: 500,
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
      {/* Pumpkin 1 - Top Left */}
      <img
        ref={pumpkin1Ref}
        src={PumpkinImage}
        alt="Pumpkin"
        className="absolute top-[8%] left-[3%] w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 opacity-60"
      />

      {/* Pumpkin 2 - Top Right */}
      <img
        ref={pumpkin2Ref}
        src={PumpkinImage}
        alt="Pumpkin"
        className="absolute top-[10%] right-[5%] w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 opacity-70"
      />

      {/* Pumpkin 3 - Bottom Left */}
      <img
        ref={pumpkin3Ref}
        src={PumpkinImage}
        alt="Pumpkin"
        className="absolute bottom-[12%] left-[8%] w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 opacity-50 hidden sm:block"
      />

      {/* Pumpkin 4 - Bottom Right */}
      <img
        ref={pumpkin4Ref}
        src={PumpkinImage}
        alt="Pumpkin"
        className="absolute bottom-[15%] right-[10%] w-16 h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 opacity-65 hidden sm:block"
      />
    </div>
  );
}
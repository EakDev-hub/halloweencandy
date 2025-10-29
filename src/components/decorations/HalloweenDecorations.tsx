import { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import MoonImage from '../../assets/Moon.png';
import TreeImage from '../../assets/Tree.png';
import WerewolfImage from '../../assets/Werewolf.png';
import ZombieImage from '../../assets/Zombie.png';

export default function HalloweenDecorations() {
  const moonRef = useRef<HTMLImageElement>(null);
  const leftTreeRef = useRef<HTMLImageElement>(null);
  const rightTreeRef = useRef<HTMLImageElement>(null);
  const werewolfRef = useRef<HTMLImageElement>(null);
  const zombieIRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Moon pulsing glow animation
    if (moonRef.current) {
      animate(moonRef.current, {
        scale: [1, 1.5, 1],
        opacity: [0.8, 1, 0.8],
        duration: 3500,
        easing: 'inOutQuad',
        loop: true,
      });
    }

    // Werewolf walking animation
    if (werewolfRef.current) {
      animate(werewolfRef.current, {
        translateX: ['-120%', '120vw'],
        duration: 100000,
        easing: 'linear',
        loop: true,
      });
    }

     // Zombie walking animation
    if (zombieIRef.current) {
      animate(zombieIRef.current, {
        translateX: ['100%', '160vw'],
        duration: 80000,
        easing: 'linear',
        loop: false,
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Moon - Top Center */}
      <img
        ref={moonRef}
        src={MoonImage}
        alt="Moon"
        className="absolute top-[5%] translate-x-1/2 w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 z-[5]"
        style={{
          filter: 'drop-shadow(0 0 30px rgba(255, 255, 200, 0.6))',
        }}
      />

      {/* Left Tree - Bottom Left */}
      <img
        ref={leftTreeRef}
        src={TreeImage}
        alt="Tree"
        className="absolute bottom-[10%] left-[5%] w-32 h-40 md:w-40 md:h-48 lg:w-79 lg:h-120 z-[10] hidden sm:block"
        style={{
          transformOrigin: 'bottom center',
        }}
      />

      {/* Right Tree - Bottom Right */}
      <img
        ref={rightTreeRef}
        src={TreeImage}
        alt="Tree"
        className="absolute bottom-[10%] right-[5%] w-28 h-36 md:w-36 md:h-44 lg:w-79 lg:h-120 z-[10] hidden sm:block"
        style={{
          transformOrigin: 'bottom center',
        }}
      />

      {/* Werewolf - Walking across bottom */}
      <img
        ref={werewolfRef}
        src={WerewolfImage}
        alt="Werewolf"
        className="absolute bottom-[5%] w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 z-[15]"
        style={{
          left: '-120%',
        }}
      />
       {/* Werewolf - Walking across bottom */}
      <img
        ref={zombieIRef}
        src={ZombieImage}
        alt="Zombie"
        className="absolute bottom-[5%] w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 z-[15]"
        style={{
          right: '120%',
        }}
      />
    </div>
  );
}
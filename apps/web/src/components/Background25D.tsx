import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// ==========================================
// 1. Realistic 2.5D Coffee Bean SVG
// ==========================================
export const CoffeeBeanSVG: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="beanBodyGrad" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#6E4434" />
        <stop offset="40%" stopColor="#38251D" />
        <stop offset="85%" stopColor="#21130D" />
        <stop offset="100%" stopColor="#120A07" />
      </radialGradient>
      <linearGradient id="creaseHighlight" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#C58B59" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#38251D" stopOpacity="0" />
      </linearGradient>
      <filter id="shadow3dBean" x="-25%" y="-25%" width="150%" height="150%">
        <feDropShadow dx="4" dy="10" stdDeviation="6" floodColor="#000000" floodOpacity="0.8" />
      </filter>
    </defs>
    <path
      d="M15,35 C12,14 42,5 78,10 C108,14 115,35 102,52 C88,68 38,65 18,50 C12,45 15,35 15,35 Z"
      fill="url(#beanBodyGrad)"
      filter="url(#shadow3dBean)"
    />
    <path
      d="M25,24 C45,12 75,10 94,18"
      stroke="url(#creaseHighlight)"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <path
      d="M18,34 Q 40,24 60,34 T 98,28"
      stroke="#0A0503"
      strokeWidth="4.5"
      strokeLinecap="round"
    />
    <path
      d="M20,34 Q 40,24 60,34 T 96,28"
      stroke="#8C5C38"
      strokeWidth="1.2"
      strokeOpacity="0.6"
      strokeLinecap="round"
    />
  </svg>
);

// ==========================================
// 2. Realistic 2.5D Dark Chocolate Square SVG
// ==========================================
export const DarkChocolateSquareSVG: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="chocTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4A2619" />
        <stop offset="40%" stopColor="#2E160E" />
        <stop offset="85%" stopColor="#1A0A06" />
        <stop offset="100%" stopColor="#0F0503" />
      </linearGradient>
      <linearGradient id="chocBevelHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#9C533F" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#38190E" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id="chocSideDark" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#210D08" />
        <stop offset="100%" stopColor="#0B0302" />
      </linearGradient>
      <filter id="chocShadow3d" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="6" dy="12" stdDeviation="7" floodColor="#000000" floodOpacity="0.85" />
      </filter>
    </defs>
    {/* Base 3D Shadow / Extrusion */}
    <path
      d="M15,25 L75,15 L90,45 L30,55 Z"
      fill="url(#chocSideDark)"
      filter="url(#chocShadow3d)"
    />
    {/* Main Beveled Top Face */}
    <path
      d="M20,20 L70,12 L85,42 L35,50 Z"
      fill="url(#chocTopGrad)"
      stroke="#120503"
      strokeWidth="1.5"
    />
    {/* Bevel Specular Highlights */}
    <path
      d="M20,20 L70,12"
      stroke="url(#chocBevelHighlight)"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <path
      d="M20,20 L35,50"
      stroke="url(#chocBevelHighlight)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Embossed Dark Chocolate Score Line */}
    <path
      d="M45,16 L60,46"
      stroke="#150805"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M46,16 L61,46"
      stroke="#6E3B2C"
      strokeWidth="1"
      strokeOpacity="0.5"
      strokeLinecap="round"
    />
    {/* Corner Gloss Sparkle */}
    <circle cx="24" cy="22" r="2" fill="#C57A65" opacity="0.7" />
  </svg>
);

// ==========================================
// 3. Realistic 2.5D Dark Chocolate Shard SVG
// ==========================================
export const DarkChocolateShardSVG: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 110 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="shardBodyGrad" x1="15%" y1="10%" x2="85%" y2="90%">
        <stop offset="0%" stopColor="#572E20" />
        <stop offset="35%" stopColor="#361A11" />
        <stop offset="75%" stopColor="#1E0D08" />
        <stop offset="100%" stopColor="#0E0402" />
      </linearGradient>
      <linearGradient id="shardFractureEdge" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#AA5E48" stopOpacity="0.9" />
        <stop offset="60%" stopColor="#542B1F" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#1A0905" stopOpacity="0" />
      </linearGradient>
      <filter id="shardShadow" x="-25%" y="-25%" width="150%" height="150%">
        <feDropShadow dx="5" dy="9" stdDeviation="6" floodColor="#000000" floodOpacity="0.8" />
      </filter>
    </defs>
    <path
      d="M12,28 L62,8 L102,40 L78,80 L28,72 L8,48 Z"
      fill="url(#shardBodyGrad)"
      filter="url(#shardShadow)"
      stroke="#140603"
      strokeWidth="1.5"
    />
    <path
      d="M12,28 L62,8 L102,40"
      stroke="url(#shardFractureEdge)"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M62,8 L28,72"
      stroke="#100503"
      strokeWidth="2.5"
    />
    <path
      d="M63,9 L29,73"
      stroke="#884938"
      strokeWidth="1"
      strokeOpacity="0.6"
    />
    <path
      d="M30,35 Q 50,22 75,32"
      stroke="#B36954"
      strokeWidth="1.5"
      strokeOpacity="0.5"
      strokeLinecap="round"
    />
  </svg>
);

// ==========================================
// 4. Realistic 2.5D Dark Chocolate Cube SVG
// ==========================================
export const DarkChocolateCubeSVG: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="cubeTop" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#633727" />
        <stop offset="100%" stopColor="#2E160E" />
      </linearGradient>
      <linearGradient id="cubeLeft" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#2E160E" />
        <stop offset="100%" stopColor="#120603" />
      </linearGradient>
      <linearGradient id="cubeRight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1F0D07" />
        <stop offset="100%" stopColor="#080201" />
      </linearGradient>
      <filter id="cubeShadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="4" dy="8" stdDeviation="5" floodColor="#000000" floodOpacity="0.8" />
      </filter>
    </defs>
    <path d="M15,35 L45,52 L45,80 L15,62 Z" fill="url(#cubeLeft)" filter="url(#cubeShadow)" />
    <path d="M45,52 L75,35 L75,62 L45,80 Z" fill="url(#cubeRight)" />
    <path d="M45,15 L75,35 L45,52 L15,35 Z" fill="url(#cubeTop)" stroke="#6E3B2C" strokeWidth="1" />
    <path d="M45,15 L75,35" stroke="#AB634F" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.8" />
  </svg>
);

// Item Types
export type BackgroundItemType = 'coffee-bean' | 'chocolate-square' | 'chocolate-shard' | 'chocolate-cube';

export interface FloatingItemConfig {
  id: string;
  type: BackgroundItemType;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  size: string;
  rotate: number;
  depth: number; // 0.02 (far) to 0.15 (near) parallax depth multiplier
  floatY: [number, number, number];
  duration: number;
  delay: number;
  blur?: string;
  opacity?: number;
}

// Preset Background Configuration containing rich dark chocolate pieces and coffee beans
export const DEFAULT_25D_ITEMS: FloatingItemConfig[] = [
  // Top-left cluster
  { id: 'b1', type: 'coffee-bean', top: '5%', left: '2%', size: 'w-24 h-14 sm:w-28 sm:h-16', rotate: -35, depth: 0.12, floatY: [-12, 12, -12], duration: 6, delay: 0 },
  { id: 'c1', type: 'chocolate-square', top: '15%', left: '12%', size: 'w-16 h-16 sm:w-20 sm:h-20', rotate: 22, depth: 0.09, floatY: [-10, 10, -10], duration: 5.5, delay: 0.3 },
  { id: 'b2', type: 'coffee-bean', top: '24%', left: '20%', size: 'w-14 h-9', rotate: 45, depth: 0.04, floatY: [-7, 7, -7], duration: 7, delay: 1, blur: 'blur-[1px]', opacity: 0.7 },
  { id: 'cs1', type: 'chocolate-shard', top: '36%', left: '3%', size: 'w-20 h-16 sm:w-24 sm:h-20', rotate: -55, depth: 0.14, floatY: [-16, 16, -16], duration: 5.2, delay: 0.5 },

  // Bottom-left cluster (spilled coffee beans & dark chocolate pieces)
  { id: 'cc1', type: 'chocolate-cube', bottom: '18%', left: '4%', size: 'w-14 h-14 sm:w-16 sm:h-16', rotate: 15, depth: 0.1, floatY: [-12, 12, -12], duration: 6.8, delay: 1.1 },
  { id: 'b4', type: 'coffee-bean', bottom: '10%', left: '16%', size: 'w-32 h-18 sm:w-36 sm:h-20', rotate: -15, depth: 0.13, floatY: [-18, 18, -18], duration: 6.5, delay: 1.2 },
  { id: 'c2', type: 'chocolate-square', bottom: '28%', left: '25%', size: 'w-12 h-12 sm:w-14 sm:h-14', rotate: 68, depth: 0.05, floatY: [-8, 8, -8], duration: 8, delay: 1.8, blur: 'blur-[1px]', opacity: 0.75 },
  { id: 'b6', type: 'coffee-bean', bottom: '34%', left: '12%', size: 'w-16 h-9', rotate: -60, depth: 0.03, floatY: [-6, 6, -6], duration: 9, delay: 0.8, opacity: 0.6 },

  // Center depth background
  { id: 'cs2', type: 'chocolate-shard', top: '8%', left: '45%', size: 'w-14 h-12', rotate: 80, depth: 0.03, floatY: [-6, 6, -6], duration: 7.5, delay: 1.5, blur: 'blur-[1.5px]', opacity: 0.5 },
  { id: 'b8', type: 'coffee-bean', bottom: '38%', left: '42%', size: 'w-24 h-14 sm:w-26 sm:h-15', rotate: -75, depth: 0.07, floatY: [-12, 12, -12], duration: 6.2, delay: 2.1 },
  { id: 'cc2', type: 'chocolate-cube', top: '50%', left: '48%', size: 'w-10 h-10', rotate: -25, depth: 0.02, floatY: [-5, 5, -5], duration: 8.5, delay: 0.9, blur: 'blur-[2px]', opacity: 0.45 },

  // Right side cluster
  { id: 'c3', type: 'chocolate-square', top: '6%', right: '5%', size: 'w-18 h-18 sm:w-22 sm:h-22', rotate: 35, depth: 0.13, floatY: [-15, 15, -15], duration: 5.4, delay: 0.2 },
  { id: 'b9', type: 'coffee-bean', top: '18%', right: '18%', size: 'w-24 h-14 sm:w-28 sm:h-16', rotate: 50, depth: 0.08, floatY: [-11, 11, -11], duration: 6.4, delay: 0.7 },
  { id: 'cs3', type: 'chocolate-shard', top: '32%', right: '2%', size: 'w-22 h-18 sm:w-26 sm:h-22', rotate: -40, depth: 0.11, floatY: [-14, 14, -14], duration: 5.9, delay: 1.4 },
  { id: 'b11', type: 'coffee-bean', top: '55%', right: '4%', size: 'w-32 h-18 sm:w-38 sm:h-21', rotate: 110, depth: 0.15, floatY: [-20, 20, -20], duration: 4.8, delay: 0.4 },
  { id: 'cc3', type: 'chocolate-cube', bottom: '12%', right: '15%', size: 'w-14 h-14 sm:w-16 sm:h-16', rotate: -10, depth: 0.07, floatY: [-10, 10, -10], duration: 7.2, delay: 2.0 },
  { id: 'c4', type: 'chocolate-square', bottom: '4%', right: '28%', size: 'w-16 h-16', rotate: 48, depth: 0.09, floatY: [-12, 12, -12], duration: 6.1, delay: 1.3, opacity: 0.8 },

  // Top/Bottom ambient connectors
  { id: 'b13', type: 'coffee-bean', top: '4%', left: '30%', size: 'w-20 h-11', rotate: -105, depth: 0.04, floatY: [-7, 7, -7], duration: 6.8, delay: 1.1, opacity: 0.65 },
  { id: 'cs4', type: 'chocolate-shard', bottom: '5%', left: '34%', size: 'w-24 h-20', rotate: 25, depth: 0.12, floatY: [-15, 15, -15], duration: 5.6, delay: 1.6 }
];

interface Floating25DBackgroundProps {
  items?: FloatingItemConfig[];
  enableMouseParallax?: boolean;
}

export const Floating25DBackground: React.FC<Floating25DBackgroundProps> = ({
  items = DEFAULT_25D_ITEMS,
  enableMouseParallax = true,
}) => {
  // Motion values for smooth 2.5D mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 60, damping: 20 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (!enableMouseParallax) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Convert cursor coordinates to normalized range [-1, 1]
      const normX = (e.clientX / innerWidth - 0.5) * 2;
      const normY = (e.clientY / innerHeight - 0.5) * 2;

      mouseX.set(normX);
      mouseY.set(normY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enableMouseParallax, mouseX, mouseY]);

  const renderItemSVG = (type: BackgroundItemType) => {
    switch (type) {
      case 'coffee-bean':
        return <CoffeeBeanSVG />;
      case 'chocolate-square':
        return <DarkChocolateSquareSVG />;
      case 'chocolate-shard':
        return <DarkChocolateShardSVG />;
      case 'chocolate-cube':
        return <DarkChocolateCubeSVG />;
      default:
        return <CoffeeBeanSVG />;
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {items.map((item) => {
        // Parallax translation transforms proportional to item depth
        const moveX = useTransform(smoothMouseX, (x) => x * item.depth * 140);
        const moveY = useTransform(smoothMouseY, (y) => y * item.depth * 140);

        return (
          <motion.div
            key={item.id}
            style={{
              position: 'absolute',
              top: item.top,
              left: item.left,
              right: item.right,
              bottom: item.bottom,
              x: enableMouseParallax ? moveX : 0,
              y: enableMouseParallax ? moveY : 0,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              y: item.floatY,
              rotate: [item.rotate, item.rotate + 14, item.rotate - 10, item.rotate],
              opacity: item.opacity ?? 0.85,
              scale: 1,
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
              delay: item.delay,
            }}
            className={`pointer-events-none transition-transform duration-300 ${item.size} ${item.blur || ''}`}
          >
            {renderItemSVG(item.type)}
          </motion.div>
        );
      })}
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  Play, 
  ArrowLeft, 
  CheckCircle2, 
  RotateCcw, 
  Trophy, 
  ChevronRight,
  Zap,
  RefreshCw,
  Award,
  Heart,
  Shield,
  Map,
  Volume2,
  VolumeX,
  Mountain,
  Waves,
  Flame,
  Wind,
  Sun,
  Moon
} from 'lucide-react';
import { QUESTIONS, CHALLENGE_CARDS, SAFETY_CARDS, SpecialCard } from './data';
import confetti from 'canvas-confetti';
import { DisasterTheme, GameSession, Question, Group, BoardTile } from './types';
import { BOARD_TILES } from './constants/boardTiles';

// Types for components
type ViewState = 'HOME' | 'SETUP' | 'BOARD' | 'QUIZ' | 'RECAP' | 'STARS';

const CategoryHeader = ({ title, icon, theme = 'dark', className = "" }: { title: string; icon: string; theme?: 'light' | 'dark'; className?: string }) => (
  <div className={`flex items-center gap-4 px-6 py-3 rounded-2xl border mb-2 mt-4 first:mt-0 transition-colors duration-300 ${
    theme === 'light'
    ? 'bg-blue-100/80 border-blue-200 text-blue-900 shadow-sm'
    : 'bg-white/10 backdrop-blur-md border-white/20 text-white/90'
  } ${className}`}>
    <span className="text-2xl filter drop-shadow-md">{icon}</span>
    <h3 className="text-lg font-black tracking-widest">{title}</h3>
    <div className={`flex-1 h-px bg-gradient-to-r ${theme === 'light' ? 'from-blue-300 to-transparent' : 'from-white/20 to-transparent'}`} />
  </div>
);

const Sparkle = ({ count = 12 }) => {
  const confettiColors = ['#FFD700', '#FF4500', '#00BFFF', '#32CD32', '#FF69B4', '#FFFFFF'];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-[100]">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
          animate={{ 
            scale: [0, 1.2, 0.5, 0],
            opacity: [1, 1, 0.8, 0],
            x: (Math.random() - 0.5) * 180,
            y: (Math.random() - 0.5) * 180,
            rotate: Math.random() * 720
          }}
          transition={{ 
            duration: 2, 
            ease: "easeOut",
            delay: Math.random() * 0.3
          }}
          className="absolute top-1/2 left-1/2 text-star-gold"
        >
          <Star size={Math.random() * 20 + 10} fill="currentColor" />
        </motion.div>
      ))}
      {/* Colorful Confetti */}
      {[...Array(20)].map((_, i) => {
        const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        return (
          <motion.div
            key={`confetti-${i}`}
            initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
            animate={{ 
              scale: [0, 1, 0.8, 0.5],
              opacity: [1, 1, 0.2, 0],
              x: (Math.random() - 0.5) * 200,
              y: (Math.random() - 0.5) * 200,
              rotate: Math.random() * 1080
            }}
            transition={{ 
              duration: 2.5, 
              ease: "easeOut",
              delay: Math.random() * 0.2
            }}
            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-sm"
            style={{ backgroundColor: color }}
          />
        );
      })}
    </div>
  );
};

const AnimatedScore = ({ value }: { value: number }) => {
  const prevValueRef = useRef(value);
  const [diff, setDiff] = useState<number | null>(null);

  useEffect(() => {
    const currentDiff = value - prevValueRef.current;
    if (currentDiff !== 0) {
      setDiff(currentDiff);
      const timer = setTimeout(() => setDiff(null), 1500);
      prevValueRef.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <div className="relative flex items-center justify-center">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ scale: 1.8, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.2, opacity: 0, y: -20, position: 'absolute' }}
          transition={{ type: 'spring', stiffness: 600, damping: 30 }}
          className={`font-black text-4xl tabular-nums leading-none tracking-tighter ${
            diff && diff > 0 ? 'text-emerald-400' : diff && diff < 0 ? 'text-red-400' : 'text-star-gold'
          }`}
        >
          {value}
        </motion.span>
      </AnimatePresence>

      <AnimatePresence>
        {diff !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 0 }}
            animate={{ opacity: 1, scale: 1, y: -50 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className={`absolute font-black text-2xl z-[60] whitespace-nowrap drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] ${
              diff > 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {diff > 0 ? `+${diff} ⭐` : `${diff} 💨`}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AnimatedCategoryCard = ({ 
  theme, 
  color, 
  dotColor, 
  label, 
  icon: Icon,
  onClick 
}: { 
  theme: DisasterTheme, 
  color: string, 
  dotColor: string, 
  label: string, 
  icon: React.ElementType,
  onClick: () => void 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      onClick();
      setIsClicked(false);
    }, 400);
  };

  return (
    <motion.button 
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      animate={(isHovered || isClicked) && theme === 'Bencana Tanah' ? {
        rotate: [-0.5, 0.5, -0.5, 0.5, 0],
        x: [-1, 1, -1, 1, 0],
      } : {}}
      transition={{ duration: 0.1, repeat: (isHovered || isClicked) ? Infinity : 0 }}
      className={`w-full ${color} hover:brightness-110 rounded-[24px] py-4 px-6 flex items-center transition-all shadow-lg active:scale-95 relative overflow-hidden group`}
    >
      {/* Disaster Themed Animations */}
      {theme === 'Bencana Tanah' && (
        <div className="absolute inset-0 pointer-events-none opacity-40">
          {/* Subtle dust particles */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-500/40 rounded-full"
              animate={isHovered || isClicked ? {
                y: [0, -20, 0],
                x: [0, (i % 2 === 0 ? 10 : -10), 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              } : { opacity: 0 }}
              transition={{ duration: 1.5 + i * 0.2, repeat: Infinity, delay: i * 0.3 }}
              style={{ left: `${20 + i * 20}%`, bottom: '10%' }}
            />
          ))}
        </div>
      )}

      {theme === 'Bencana Air' && (
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          {/* Layered waves */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/30 to-transparent"
            initial={{ x: '-100%' }}
            animate={isHovered || isClicked ? { x: '200%' } : { x: '-100%' }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            style={{ width: '60%', skewX: -40 }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-3 bg-white/20"
            animate={isHovered || isClicked ? { 
              y: [0, -4, 0],
              opacity: [0.3, 0.6, 0.3],
              scaleX: [1, 1.1, 1]
            } : { y: 0 }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ filter: 'blur(2px)' }}
          />
          <motion.div 
            className="absolute inset-x-0 bottom-1 h-1 bg-blue-200/20"
            animate={isHovered || isClicked ? { x: [-10, 10, -10] } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      )}
      
      {theme === 'Bencana Api' && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-orange-600/20 to-transparent"
            animate={isHovered || isClicked ? { opacity: [0.1, 0.3, 0.1] } : { opacity: 0 }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          {/* Rising embers */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              animate={isHovered || isClicked ? {
                y: [0, -50],
                x: [0, Math.sin(i) * 15],
                opacity: [0, 1, 0],
                scale: [0, 1.2, 0]
              } : { opacity: 0 }}
              transition={{ duration: 1 + Math.random(), repeat: Infinity, delay: i * 0.2 }}
              style={{ left: `${15 + i * 18}%`, bottom: '0%' }}
            />
          ))}
        </div>
      )}

      {theme === 'Bencana Udara' && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Swirling wind lines */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute border-t border-white/20 rounded-full"
              animate={isHovered || isClicked ? {
                rotate: 360,
                scale: [0.8, 1.2, 0.8],
                opacity: [0.1, 0.3, 0.1]
              } : { opacity: 0 }}
              transition={{ duration: 3 + i, repeat: Infinity, ease: "linear" }}
              style={{ 
                width: `${120 + i * 40}px`, 
                height: `${120 + i * 40}px`, 
                left: '50%', 
                top: '50%', 
                marginLeft: `-${60 + i * 20}px`, 
                marginTop: `-${60 + i * 20}px` 
              }}
            />
          ))}
          <motion.div 
            className="absolute inset-0 bg-white/5"
            animate={isHovered || isClicked ? { opacity: [0, 0.1, 0] } : { opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      )}

      <div className={`w-8 h-8 rounded-full ${dotColor} shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),0_0_10px_rgba(255,255,255,0.3)] mr-4 shrink-0 relative z-10 flex items-center justify-center`}>
        <Icon size={16} className="text-gray-800/80" />
      </div>
      <span className="flex-1 text-center font-black text-white text-lg tracking-widest uppercase relative z-10">{label}</span>
    </motion.button>
  );
};

const LightningEffect = () => {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    let activeTimeout: any = null;
    let offTimeout: any = null;
    let isMounted = true;

    const trigger = () => {
      if (!isMounted) return;
      setFlash(true);
      offTimeout = setTimeout(() => {
        if (isMounted) setFlash(false);
      }, 1000);

      const nextDelay = Math.random() * 15000 + 10000;
      activeTimeout = setTimeout(trigger, nextDelay);
    };

    activeTimeout = setTimeout(trigger, 5000);

    return () => {
      isMounted = false;
      if (activeTimeout) clearTimeout(activeTimeout);
      if (offTimeout) clearTimeout(offTimeout);
    };
  }, []);

  if (!flash) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none bg-white/20 animate-lightning" />
  );
};

const FLOATING_ITEMS = [
  { icon: "🎒", label: "TAS SIAGA", x: "6%", y: "15%", scale: 0.95, duration: 16, delay: 0 },
  { icon: "🔦", label: "SENTER", x: "85%", y: "20%", scale: 1.0, duration: 18, delay: 1 },
  { icon: "📻", label: "RADIO", x: "8%", y: "75%", scale: 0.9, duration: 20, delay: 2.5 },
  { icon: "🧴", label: "AIR MINUM", x: "84%", y: "70%", scale: 0.95, duration: 17, delay: 1.5 },
  { icon: "🩹", label: "KOTAK P3K", x: "90%", y: "45%", scale: 0.85, duration: 19, delay: 2 },
  { icon: "🥫", label: "MAKANAN KALENG", x: "42%", y: "85%", scale: 0.85, duration: 22, delay: 3 },
];

const DisasterAnimations = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <LightningEffect />
      {FLOATING_ITEMS.map((item, idx) => (
        <motion.div
          key={idx}
          animate={{
            y: [0, -15, 10, -10, 0],
            x: [0, 8, -8, 6, 0],
            rotate: [0, 4, -4, 2, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: item.duration,
            ease: "easeInOut",
            delay: item.delay,
          }}
          className="absolute opacity-[0.08] dark:opacity-[0.05] sm:opacity-[0.12] hover:opacity-60 transition-opacity duration-300 pointer-events-auto cursor-help select-none"
          style={{ left: item.x, top: item.y }}
          whileHover={{ scale: item.scale * 1.15, rotate: 10 }}
          whileTap={{ scale: 0.95, rotate: -10 }}
        >
          <div className="bg-white/10 dark:bg-white/5 p-3.5 sm:p-4 rounded-2xl backdrop-blur-sm border border-white/10 dark:border-white/5 shadow-lg flex flex-col items-center">
            <span className="text-3xl sm:text-4xl" style={{ transform: `scale(${item.scale})` }}>{item.icon}</span>
            <p className="text-[8px] font-black mt-1 text-center text-white/50 tracking-wider uppercase">{item.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const SiCilik = ({ 
  message, 
  position = "top-right",
  mood = 'IDLE',
  isInline = false
}: { 
  message?: string, 
  position?: "bottom-right" | "bottom-left" | "center" | "top-right",
  mood?: 'IDLE' | 'HAPPY' | 'SURPRISED',
  isInline?: boolean
}) => {
  const isTopRight = position === "top-right";

  return (
    <motion.div 
      initial={isInline ? { scale: 0.9, opacity: 0 } : { y: -20, opacity: 0 }}
      animate={isInline 
        ? { scale: 1, opacity: 1 } 
        : { 
            y: [0, -3, 0], // extremely subtle floating animation (3px max)
            opacity: 1
          }
      }
      transition={isInline 
        ? { duration: 0.3 } 
        : {
            y: {
              repeat: Infinity,
              duration: 5.5,
              ease: "easeInOut"
            }
          }
      }
      className={isInline 
        ? "flex flex-col items-center select-none z-10 relative" 
        : `absolute z-[100] flex ${isTopRight ? "flex-row items-center" : "flex-col items-center"} pointer-events-none transition-all duration-500 ${
          position === "bottom-right" ? "bottom-4 right-4 sm:bottom-10 sm:right-10" :
          position === "bottom-left" ? "bottom-32 left-4 sm:bottom-40 sm:left-10" :
          position === "top-right" ? "top-24 right-4 sm:top-28 sm:right-6 md:right-10" :
          "bottom-20 left-1/2 -translate-x-1/2"
        }`}
    >
      {message && (
        <motion.div 
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={isTopRight 
            ? "mr-2 bg-white text-bg-dark font-bold px-3 py-1.5 rounded-2xl rounded-tr-none shadow-xl border-2 border-primary-blue max-w-[130px] sm:max-w-[180px] text-[10px] sm:text-xs pointer-events-auto leading-relaxed"
            : `mb-4 bg-white text-bg-dark font-bold px-6 py-3 rounded-2xl ${
                isInline ? 'rounded-b-2xl' : 'rounded-br-none'
              } shadow-2xl relative border-2 border-primary-blue max-w-[200px] sm:max-w-[250px] text-sm sm:text-base pointer-events-auto`
          }
        >
          {message}
          {isTopRight ? (
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-r-2 border-t-2 border-primary-blue rotate-45" />
          ) : (
            <div className={`absolute -bottom-2 ${isInline ? 'left-1/2 -translate-x-1/2' : '-right-[2px]'} w-4 h-4 bg-white border-r-2 border-b-2 border-primary-blue rotate-45`} />
          )}
        </motion.div>
      )}

      <div className={`${isInline ? 'w-20 h-20 sm:w-24 sm:h-24' : isTopRight ? 'w-10 h-10 sm:w-12 sm:h-12' : 'w-24 h-24 sm:w-32 sm:h-32'} relative flex-shrink-0`}>
        {/* Si Cilik Body (SVG based) */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
          {/* Legs (Khaki) */}
          <path d="M35 90 H65 V98 H35 Z" fill="#A87952" />
          
          {/* Shirt (Blue) */}
          <path d="M30 65 Q50 63 70 65 L75 90 H25 Z" fill="#1E3A8A" />
          
          {/* Blazer (Maroon) */}
          <path d="M25 65 Q23 65 22 70 L18 90 H42 L45 65 Z" fill="#881337" />
          <path d="M75 65 Q77 65 78 70 L82 90 H58 L55 65 Z" fill="#881337" />
          
          {/* Head */}
          <circle cx="50" cy="45" r="28" fill="#FFE4D6" />
          
          {/* Hair (Brown) & Orange Helmet */}
          <path d="M22 46 Q22 25 50 25 Q78 25 78 46" fill="none" stroke="#4B2C20" strokeWidth="8" />
          <path d="M22 46 Q20 55 25 60 M78 46 Q80 55 75 60" fill="none" stroke="#4B2C20" strokeWidth="6" strokeLinecap="round" />
          <path d="M22 32 Q22 8 50 8 Q78 8 78 32 L82 32 Q85 32 85 36 L15 36 Q15 32 18 32 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
          <rect x="25" y="32" width="50" height="4" fill="#D97706" />
          <circle cx="50" cy="20" r="6" fill="#475569" />
          <path d="M46 18 L50 22 L54 18" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
          
          {/* Eyes (Static) */}
          <g>
            <circle cx="43" cy="45" r={mood === 'SURPRISED' ? 4 : 3} fill="#000" />
            <circle cx="57" cy="45" r={mood === 'SURPRISED' ? 4 : 3} fill="#000" />
          </g>

          {/* Mouth */}
          <motion.path 
            d={mood === 'HAPPY' ? "M42 62 Q50 72 58 62" : mood === 'SURPRISED' ? "M45 66 Q50 58 55 66" : "M44 64 Q50 68 56 64"}
            stroke="#000" 
            strokeWidth="2.5" 
            fill="none" 
            strokeLinecap="round"
          />

          {/* Cheeks */}
          <circle cx="33" cy="55" r="5" fill="#F87171" opacity="0.4" />
          <circle cx="67" cy="55" r="5" fill="#F87171" opacity="0.4" />
        </svg>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const [view, setView] = useState<ViewState>('HOME');
  const [session, setSession] = useState<GameSession | null>(null);
  const [activeSpecialCard, setActiveSpecialCard] = useState<SpecialCard | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [finalWinner, setFinalWinner] = useState<Group | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(1800); // 30 minutes in seconds
  const [timerIsActive, setTimerIsActive] = useState<boolean>(false);
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [editingGroupName, setEditingGroupName] = useState<string>('');
  const [infoModal, setInfoModal] = useState<{ title: string; message: string; icon: string } | null>(null);
  const introMusicRef = useRef<HTMLAudioElement | null>(null);
  const gameMusicRef = useRef<HTMLAudioElement | null>(null);

  // Background Music Logic
  useEffect(() => {
    const handleLoadError = (e: ErrorEvent) => {
      console.error("Audio loading failed:", e);
    };

    // Intro Track (Energetic, Heroic Start)
    const intro = new Audio('https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3'); 
    intro.loop = true;
    intro.volume = 0.3;
    intro.addEventListener('error', () => {
      console.warn("Retrying intro audio with fallback...");
      intro.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'; // Stable fallback
    });
    introMusicRef.current = intro;

    // Game Track (Tense, adventurous)
    const game = new Audio('https://cdn.pixabay.com/audio/2022/03/10/audio_c35272a08f.mp3'); 
    game.loop = true;
    game.volume = 0.25;
    game.addEventListener('error', () => {
      console.warn("Retrying game audio with fallback...");
      game.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3'; // Stable fallback
    });
    gameMusicRef.current = game;

    return () => {
      if (introMusicRef.current) introMusicRef.current.pause();
      if (gameMusicRef.current) gameMusicRef.current.pause();
      introMusicRef.current = null;
      gameMusicRef.current = null;
    };
  }, []);

  const startAudio = () => {
    if (hasInteracted) return;
    setHasInteracted(true);
    setIsMuted(false);
    
    // Explicit play on first interaction is most reliable for browsers
    const isGameplayView = ['BOARD', 'QUIZ'].includes(view);
    const intro = introMusicRef.current;
    const game = gameMusicRef.current;
    
    if (isGameplayView && game) {
      game.play().catch(e => console.warn("Initial game play failed:", e));
    } else if (!isGameplayView && intro) {
      intro.play().catch(e => console.warn("Initial intro play failed:", e));
    }
  };

  useEffect(() => {
    const handleFirstInteraction = () => {
      startAudio();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [hasInteracted]);

  useEffect(() => {
    if (isMuted || !hasInteracted) {
      if (introMusicRef.current) introMusicRef.current.pause();
      if (gameMusicRef.current) gameMusicRef.current.pause();
      return;
    }

    const isGameplayView = ['BOARD', 'QUIZ'].includes(view);

    if (isGameplayView) {
      if (introMusicRef.current) introMusicRef.current.pause();
      if (gameMusicRef.current) {
        // Tension during quiz, but not too loud to overshadow voice
        gameMusicRef.current.volume = view === 'QUIZ' ? 0.35 : 0.25;
        gameMusicRef.current.play().catch((e) => {
          console.warn("Audio play failed, retrying on interaction...", e);
        });
      }
    } else {
      if (gameMusicRef.current) gameMusicRef.current.pause();
      if (introMusicRef.current) {
        introMusicRef.current.play().catch((e) => {
          console.warn("Audio play failed, retrying on interaction...", e);
        });
      }
    }
  }, [view, isMuted, hasInteracted]);

  const handleTimeOut = () => {
    if (!session) return;
    const sorted = [...session.groups].sort((a, b) => b.stars - a.stars);
    const winner = sorted[0] || null;
    setFinalWinner(winner);
    setTimerIsActive(false);
    playEffect('STAR_WIN');
    setView('RECAP');
  };

  useEffect(() => {
    let interval: any = null;
    if (session && (view === 'BOARD' || view === 'QUIZ') && timerIsActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (interval) clearInterval(interval);
            setTimerIsActive(false);
            // End of game! Find winner
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [session, view, timerIsActive]);

  useEffect(() => {
    if (view === 'RECAP' && finalWinner) {
      // Massive continuous confetti shower
      const duration = 12 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 150 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 40 * (timeLeft / duration);
        // Shoot confetti from various spots
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.4), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.6, 0.9), y: Math.random() - 0.2 } });
      }, 200);

      // Play victory sound twice for energy
      playEffect('STAR_WIN');
      const soundTimer = setTimeout(() => {
        playEffect('STAR_WIN');
      }, 800);

      return () => {
        clearInterval(interval);
        clearTimeout(soundTimer);
      };
    }
  }, [view, finalWinner]);

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!hasInteracted) {
      setHasInteracted(true);
      setIsMuted(false);
    } else {
      setIsMuted(prev => !prev);
    }
  };

  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [answerStatus, setAnswerStatus] = useState<'IDLE' | 'CORRECT' | 'WRONG'>('IDLE');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [siCilikState, setSiCilikState] = useState<'IDLE' | 'HAPPY' | 'SURPRISED'>('IDLE');
  const [sparkleActive, setSparkleActive] = useState(false);

  // Lifted states for SetupView
  const [setupClassName, setSetupClassName] = useState('');
  const [setupGroupCount, setSetupGroupCount] = useState(4);
  const [setupCustomGroupNames, setSetupCustomGroupNames] = useState<string[]>([]);

  useEffect(() => {
    setSetupCustomGroupNames(prev => {
      const next = [...prev];
      if (next.length < setupGroupCount) {
        for (let i = next.length; i < setupGroupCount; i++) {
          next.push(`Kelompok ${i + 1}`);
        }
      } else if (next.length > setupGroupCount) {
        next.splice(setupGroupCount);
      }
      return next;
    });
  }, [setupGroupCount]);

  // Sound System
  const speak = (text: string) => {
    if (!window.speechSynthesis || isMuted) return;
    
    // Cancel any current speech
    window.speechSynthesis.cancel();
    
    // Audio Ducking: Lower music volume when speaking
    if (gameMusicRef.current) {
      gameMusicRef.current.volume = 0.1;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID'; // Indonesian
    utterance.rate = 1.15; // Faster for "semangat" (enthusiastic) vibe
    utterance.pitch = 1.25; // Higher pitch for more energy

    // Restore volume when speech ends
    utterance.onend = () => {
      if (gameMusicRef.current && view === 'QUIZ') {
        gameMusicRef.current.volume = 0.35;
      } else if (gameMusicRef.current && view === 'BOARD') {
        gameMusicRef.current.volume = 0.25;
      }
    };
    
    // Find a good Indonesian voice (usually female by default in most browsers)
    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID'));
    if (idVoice) utterance.voice = idVoice;
    
    window.speechSynthesis.speak(utterance);
  };

  // Lifted TTS speaking effect for QuizView
  useEffect(() => {
    if (view !== 'QUIZ' || !activeQuestion) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      return;
    }
    if (showExplanation) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      return;
    }
    
    const timer = setTimeout(() => {
      speak(activeQuestion.question);
    }, 500);
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      clearTimeout(timer);
    };
  }, [view, activeQuestion, showExplanation, isMuted]);

  const playEffect = (type: 'CORRECT' | 'WRONG' | 'DICE_ROLL' | 'DICE_LAND' | 'STAR_WIN' | 'BONUS') => {
    if (isMuted) return;
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);
    
    if (type === 'CORRECT') {
      // Festive Triumphant Major Arpeggio Fanfare
      const now = audioContext.currentTime;
      
      // Chord 1: Warm C Major (C5, E5, G5)
      const chord1 = [523.25, 659.25, 783.99];
      chord1.forEach((freq, idx) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        
        gain.gain.setValueAtTime(0, now + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.05 + 0.4);
        
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.4);
      });
      
      // Chord 2: High sparkly C Major (C6, E6, G6, C7)
      const chord2 = [1046.50, 1318.51, 1567.98, 2093.00];
      chord2.forEach((freq, idx) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + 0.2 + idx * 0.04);
        
        gain.gain.setValueAtTime(0, now + 0.2 + idx * 0.04);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.2 + idx * 0.04 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.2 + idx * 0.04 + 0.5);
        
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + 0.2 + idx * 0.04);
        osc.stop(now + 0.2 + idx * 0.04 + 0.5);
      });

      // Add a cute bubbly synth sweep
      const sweep = audioContext.createOscillator();
      const sweepGain = audioContext.createGain();
      sweep.type = 'sine';
      sweep.frequency.setValueAtTime(300, now);
      sweep.frequency.exponentialRampToValueAtTime(1200, now + 0.3);
      sweepGain.gain.setValueAtTime(0.1, now);
      sweepGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      sweep.connect(sweepGain);
      sweepGain.connect(masterGain);
      sweep.start(now);
      sweep.stop(now + 0.3);
    } else if (type === 'STAR_WIN') {
      // Very Festive Star Jingles
      const baseFreq = 880; // A5
      for (let i = 0; i < 8; i++) {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const time = audioContext.currentTime + i * 0.08;
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * (1 + i * 0.25), time);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 2, time + 0.5);
        
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.15, time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.6);
        
        const filter = audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1000;
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        
        osc.start(time);
        osc.stop(time + 0.6);
      }
    } else if (type === 'WRONG') {
      // Classic Discordant "Buzzer" for wrong answer
      [110, 115].forEach((freq, i) => { 
        const osc = audioContext.createOscillator();
        const g = audioContext.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, audioContext.currentTime);
        
        g.gain.setValueAtTime(0, audioContext.currentTime);
        g.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.05);
        g.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        
        osc.connect(g);
        g.connect(masterGain);
        osc.start();
        osc.stop(audioContext.currentTime + 0.4);
      });
    } else if (type === 'DICE_ROLL') {
      // 1. Accelerating Ticks
      const tickCount = 28;
      for (let i = 0; i < tickCount; i++) {
        // Accelerating curve: intervals get shorter
        const delay = 0.05 + (Math.pow(i / tickCount, 2) * 0.05); 
        const time = audioContext.currentTime + (i * 0.06);
        
        const osc = audioContext.createOscillator();
        const g = audioContext.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(200 + (i * 20), time); // Pitch rises
        
        g.gain.setValueAtTime(0.06, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
        
        osc.connect(g);
        g.connect(masterGain);
        osc.start(time);
        osc.stop(time + 0.04);
      }
      
      // 2. Suspenseful Rising Whir
      const whir = audioContext.createOscillator();
      const whirG = audioContext.createGain();
      whir.type = 'sawtooth';
      whir.frequency.setValueAtTime(80, audioContext.currentTime);
      whir.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 1.5);
      
      const filter = audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, audioContext.currentTime);
      filter.frequency.exponentialRampToValueAtTime(2000, audioContext.currentTime + 1.5);
      
      whirG.gain.setValueAtTime(0, audioContext.currentTime);
      whirG.gain.linearRampToValueAtTime(0.12, audioContext.currentTime + 0.3);
      whirG.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1.5);
      
      whir.connect(filter);
      filter.connect(whirG);
      whirG.connect(masterGain);
      whir.start();
      whir.stop(audioContext.currentTime + 1.5);
    } else if (type === 'DICE_LAND') {
      // Impact Thud + Bounce
      [0, 0.1].forEach((delay, i) => {
        const t = audioContext.currentTime + delay;
        const vol = i === 0 ? 0.6 : 0.2;
        
        const osc = audioContext.createOscillator();
        const g = audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150 - (i * 30), t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.2);
        
        g.gain.setValueAtTime(vol, t);
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
        
        osc.connect(g);
        g.connect(masterGain);
        osc.start(t);
        osc.stop(t + 0.25);
      });

      // Sharp Impact "Crack"
      const crack = audioContext.createOscillator();
      const crackG = audioContext.createGain();
      crack.type = 'square';
      crack.frequency.setValueAtTime(1200, audioContext.currentTime);
      crackG.gain.setValueAtTime(0.15, audioContext.currentTime);
      crackG.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
      crack.connect(crackG);
      crackG.connect(masterGain);
      crack.start();
      crack.stop(audioContext.currentTime + 0.08);

      // Dust/Gravel Sweep
      const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.15, audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const noise = audioContext.createBufferSource();
      noise.buffer = buffer;
      const noiseG = audioContext.createGain();
      noiseG.gain.setValueAtTime(0.08, audioContext.currentTime);
      noiseG.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      noise.connect(noiseG);
      noiseG.connect(masterGain);
      noise.start();
    } else if (type === 'BONUS') {
      // Magic shimmer for special cards
      const notes = [659.25, 783.99, 987.77, 1318.51, 1567.98]; // E5, G5, B5, E6, G6
      notes.forEach((freq, i) => {
        const osc = audioContext.createOscillator();
        const g = audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.05);
        
        g.gain.setValueAtTime(0, audioContext.currentTime + i * 0.05);
        g.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + i * 0.05 + 0.1);
        g.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.05 + 0.5);
        
        osc.connect(g);
        g.connect(masterGain);
        osc.start(audioContext.currentTime + i * 0.05);
        osc.stop(audioContext.currentTime + i * 0.05 + 0.5);
      });
    }
  };

  // Pre-load voices
  useEffect(() => {
    window.speechSynthesis.getVoices();
  }, []);

  // Audio refs (placeholders for light sound effects)
  const rollSound = useRef<HTMLAudioElement | null>(null);
  const correctSound = useRef<HTMLAudioElement | null>(null);

  // Initializing state
  const startSession = () => {
    setView('SETUP');
  };

  const initGame = (config: { className: string; groupNames: string[] }) => {
    const groups: Group[] = config.groupNames.map((name, i) => ({
      id: i + 1,
      name: name.trim() || `Kelompok ${i + 1}`,
      stars: 0
    }));

    setSession({
      className: config.className,
      theme: 'Bencana Tanah', // Default, but game is now multi-themed
      questionCount: 9999,
      currentTurn: 0,
      groups: groups,
      totalStars: 0,
      completedQuestions: [],
      history: []
    });
    setTimeLeft(1800); // 30 minutes in seconds
    setTimerIsActive(true); // Auto-start the timer
    setView('BOARD');
  };

  const openQuestionFromCategory = (theme: DisasterTheme) => {
    const normTheme = theme.trim().toLowerCase();
    let available = QUESTIONS.filter(q => q.theme.trim().toLowerCase() === normTheme && !session?.completedQuestions.includes(q.id));
    
    // Automatically reset completed questions for this category if all are used, so kids can keep playing infinitely!
    if (available.length === 0 && session) {
      const categoryQuestionIds = QUESTIONS.filter(q => q.theme.trim().toLowerCase() === normTheme).map(q => q.id);
      const remainingCompleted = session.completedQuestions.filter(id => !categoryQuestionIds.includes(id));
      setSession({
        ...session,
        completedQuestions: remainingCompleted
      });
      available = QUESTIONS.filter(q => q.theme.trim().toLowerCase() === normTheme);
    }

    if (available.length > 0) {
      const random = available[Math.floor(Math.random() * available.length)];
      setActiveQuestion(random);
      setAnswerStatus('IDLE');
      setShowExplanation(false);
      setView('QUIZ');
    } else {
      setInfoModal({
        title: "TANTANGAN SELESAI",
        message: `Semua tantangan ${theme} sudah selesai! Silakan pilih kategori lain.`,
        icon: "🎒"
      });
    }
  };

  const submitAnswer = (index: number) => {
    if (!activeQuestion) return;
    setSelectedAnswer(index);
    
    // Stop speaking immediately when an answer is chosen
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    if (index === activeQuestion.correctAnswer) {
      setAnswerStatus('CORRECT');
      playEffect('CORRECT');
      setSiCilikState('HAPPY');
      speak("Luar biasa! Jawabanmu tepat sekali. Kamu benar-benar pahlawan siaga!");
      setTimeout(() => setSiCilikState('IDLE'), 3000);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 }
        });
      } catch (e) {
        console.warn("Confetti error:", e);
      }
    } else {
      setAnswerStatus('WRONG');
      playEffect('WRONG');
      setSiCilikState('SURPRISED');
      speak("Wah, sayang sekali. Jawabanmu masih kurang tepat. Jangan menyerah!");
      setTimeout(() => setSiCilikState('IDLE'), 3000);
    }
    setShowExplanation(true);
  };

  const [winnerGroupIdx, setWinnerGroupIdx] = useState<number | null>(null);

  const addStars = (amount: number) => {
    if (!session) return;
    
    // Stop any ongoing speech when moving forward
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setSelectedAnswer(null);

    const updatedGroups = [...session.groups];
    const currentGroup = updatedGroups[session.currentTurn];
    
    // Prevent points from going below 0
    const oldStars = currentGroup.stars;
    currentGroup.stars = Math.max(0, currentGroup.stars + amount);
    const actualChange = currentGroup.stars - oldStars;

    // WINNER CHECK: First to 21
    if (currentGroup.stars >= 21) {
      setFinalWinner(currentGroup);
      setTimerIsActive(false);
      playEffect('STAR_WIN');
      setView('RECAP');
      return;
    }

    if (amount > 0) {
      setWinnerGroupIdx(session.currentTurn);
      playEffect('STAR_WIN');
      setSparkleActive(true);
      setTimeout(() => {
        setSparkleActive(false);
        setWinnerGroupIdx(null);
      }, 3000);
    }

    setSession({
      ...session,
      groups: updatedGroups,
      totalStars: session.totalStars + actualChange,
      completedQuestions: activeQuestion ? [...session.completedQuestions, activeQuestion.id] : session.completedQuestions,
      history: activeQuestion ? [...session.history, activeQuestion.explanation] : session.history,
      currentTurn: session.currentTurn
    });

    setView('BOARD');
    setActiveQuestion(null);
  };

  const drawSpecialCard = (type: 'CHALLENGE' | 'SAFETY') => {
    const deck = type === 'CHALLENGE' ? CHALLENGE_CARDS : SAFETY_CARDS;
    const randomCard = deck[Math.floor(Math.random() * deck.length)];
    setActiveSpecialCard(randomCard);
    playEffect('BONUS');
  };

  const claimSpecialCard = () => {
    if (!activeSpecialCard || !session) return;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    addStars(activeSpecialCard.points);
    setActiveSpecialCard(null);
  };

  const failSpecialCard = () => {
    if (!activeSpecialCard || !session) return;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    addStars(-1);
    setActiveSpecialCard(null);
  };

  const handleTileClick = (tile: BoardTile) => {
    if (tile.type === 'DISASTER' && tile.theme) {
      openQuestionFromCategory(tile.theme);
    } else if (tile.type === 'CHALLENGE') {
      drawSpecialCard('CHALLENGE');
    } else if (tile.type === 'SAFETY') {
      drawSpecialCard('SAFETY');
    } else if (tile.type === 'CHANCE') {
      // Chance tile draws a random card
      drawSpecialCard(Math.random() > 0.5 ? 'CHALLENGE' : 'SAFETY');
    } else if (tile.type === 'BONUS' && tile.points) {
      addStars(tile.points);
      playEffect('BONUS');
      setInfoModal({
        title: "BINTANG BONUS! 🌟",
        message: `Hore! Regu mendapat bonus ${tile.points} Bintang!`,
        icon: "⭐"
      });
    } else if (tile.type === 'JAIL') {
      addStars(-1);
      setInfoModal({
        title: "ZONA BAHAYA! 🚨",
        message: "Waduh! Kamu masuk zona bahaya. Tetap waspada ya! (-1 Bintang)",
        icon: "⚠️"
      });
    } else if (tile.type === 'MUNDUR') {
      addStars(-1);
      setInfoModal({
        title: "RINTANGAN! 💨",
        message: "Ups! Kamu harus mundur 1 kotak. (-1 Bintang)",
        icon: "💨"
      });
    } else if (tile.type === 'START') {
      addStars(1);
      setInfoModal({
        title: "GARIS MULAI! 🚀",
        message: "Semangat! Kamu melewati garis Mulai. (+1 Bintang)",
        icon: "🏁"
      });
    } else {
      setInfoModal({
        title: tile.label,
        message: `Kamu mendarat di ${tile.label}! Silakan laksanakan aksi ini bersama kelompokmu.`,
        icon: tile.icon
      });
    }
  };

  const TimerWidget = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const isLowTime = timeLeft < 300; // less than 5 minutes

    return (
      <div className={`flex items-center gap-4 px-6 py-2.5 rounded-full backdrop-blur-2xl border-2 transition-all shadow-xl ${
        isLowTime 
          ? 'bg-red-500/10 border-red-500/40 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-pulse' 
          : 'bg-[#0E172E]/90 border-blue-500/30 text-white shadow-[0_0_20px_rgba(59,130,246,0.1)]'
      }`}>
        <div className="flex items-center gap-2">
          {isLowTime ? (
            <span className="text-xl animate-bounce">⚠️</span>
          ) : (
            <span className="text-xl">⏱️</span>
          )}
          <span className={`font-mono text-xl sm:text-2xl font-black tracking-wider leading-none ${!timerIsActive ? 'opacity-60 animate-pulse text-amber-400' : ''}`}>
            {formatted}
          </span>
        </div>
        <div className="w-px h-6 bg-white/10" />
        <button
          onClick={(e) => {
            e.stopPropagation();
            setTimerIsActive(!timerIsActive);
          }}
          className={`p-1.5 rounded-lg transition-transform active:scale-95 flex items-center justify-center ${
            timerIsActive 
              ? 'hover:bg-red-500/10 text-white/70 hover:text-red-400' 
              : 'hover:bg-emerald-500/10 text-white/70 hover:text-emerald-400 animate-pulse'
          }`}
          title={timerIsActive ? 'Pause' : 'Mulai'}
        >
          {timerIsActive ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pause"><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/><rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play"><polygon points="6 3 20 12 6 21 6 3" fill="currentColor"/></svg>
          )}
        </button>
      </div>
    );
  };

  const renderHomeView = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen flex flex-col justify-between overflow-x-hidden transition-colors duration-500"
    >
      <DisasterAnimations />
      
      {/* 1. Header Bar */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-12 py-6 z-20 shrink-0">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-3 select-none"
        >
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-lg border-b-4 border-blue-900 animate-bounce">
            🌍
          </div>
          <div>
            <span className={`font-black tracking-widest text-base sm:text-lg uppercase leading-none block ${theme === 'light' ? 'text-blue-900' : 'text-white'}`}>
              SIAGA CILIK
            </span>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] block ${theme === 'light' ? 'text-blue-600/70' : 'text-blue-400'}`}>
              Edisi Sahabat Bumi
            </span>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <ControlWidget />
        </motion.div>
      </header>

      {/* 2. Main Hero Section */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 py-4 flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-8">
        
        {/* Left: Mascot & Play Action */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 max-w-xl">
          {/* Trophy Float */}
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1], 
              rotate: [0, 4, -4, 0],
              y: [0, -12, 0]
            }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="mb-2"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-2xl scale-125" />
              <Trophy className="w-24 h-24 sm:w-32 sm:h-32 text-star-gold drop-shadow-[0_0_30px_rgba(251,191,36,0.6)] relative z-10" />
            </div>
          </motion.div>

          <div className="space-y-3">
            <h1 className={`text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-none transition-colors duration-300 ${
              theme === 'light' 
                ? 'text-blue-900 drop-shadow-[0_6px_0_rgba(29,78,216,1)]' 
                : 'text-white drop-shadow-[0_6px_0_rgba(15,23,42,1)]'
            }`}>
              SIAGA CILIK
            </h1>
            <p className={`text-lg sm:text-2xl font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] leading-tight transition-colors duration-300 ${
              theme === 'light' ? 'text-blue-600' : 'text-blue-400'
            }`}>
              Misi Sahabat Bumi Hebat
            </p>
          </div>

          <p className={`text-sm sm:text-base md:text-lg font-bold leading-relaxed max-w-md ${
            theme === 'light' ? 'text-slate-600' : 'text-blue-200/80'
          }`}>
            Ayo belajar kesiapsiagaan bencana melalui petualangan seru dan interaktif! Kumpulkan Bintang emas dan jadilah Sahabat Bumi Hebat! 🎒✨
          </p>
          
          <div className="pt-4 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                startAudio();
                if (typeof startSession === 'function') startSession();
              }}
              className="group w-full sm:w-auto relative px-12 py-6 sm:px-16 sm:py-7 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500 text-slate-950 rounded-[32px] text-xl sm:text-2xl font-black shadow-[0_12px_30px_rgba(245,158,11,0.3)] hover:shadow-[0_16px_40px_rgba(245,158,11,0.5)] transition-all flex items-center justify-center uppercase tracking-[0.1em] border-b-8 border-amber-700 active:border-b-0 active:translate-y-2 cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-3">
                MULAI PETUALANGAN <Play className="fill-slate-950 w-6 h-6 sm:w-8 sm:h-8" />
              </span>
            </motion.button>
          </div>

        </div>

        {/* Right: Beautiful Bento Grid for 4 themes */}
        <div className="flex-1 w-full max-w-2xl">
          <div className="text-center lg:text-left mb-6">
            <h3 className={`text-xs font-black uppercase tracking-[0.3em] mb-2 ${theme === 'light' ? 'text-blue-600/80' : 'text-blue-400'}`}>
              Zona Edukasi Interaktif
            </h3>
            <h2 className={`text-2xl sm:text-3xl font-black uppercase ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
              4 MISI PENYELAMATAN 🛡️
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Card 1: Water */}
            <motion.div 
              whileHover={{ y: -6, scale: 1.02 }}
              className={`p-5 sm:p-6 rounded-[28px] border-4 transition-all duration-300 flex items-center gap-4 sm:gap-5 text-left shadow-lg h-full min-h-[140px] ${
                theme === 'light' 
                  ? 'bg-gradient-to-br from-blue-50/80 to-sky-100/50 border-blue-300 text-blue-950 shadow-blue-500/5' 
                  : 'bg-gradient-to-br from-[#0F1E36]/90 to-[#0A122C]/90 border-blue-900/60 text-blue-100 shadow-black/40'
              }`}
            >
              <div className="p-3.5 sm:p-4 bg-blue-500/10 rounded-2xl text-3xl sm:text-4xl filter drop-shadow-md flex-shrink-0">🌊</div>
              <div className="space-y-1 flex-1">
                <h4 className="font-black text-sm sm:text-base uppercase tracking-wider">Bencana Air</h4>
                <p className="text-[11px] sm:text-xs opacity-80 leading-relaxed">Belajar kesiapsiagaan menghadapi Banjir, Tsunami, dan Gelombang Tinggi.</p>
              </div>
            </motion.div>
 
            {/* Card 2: Earth */}
            <motion.div 
              whileHover={{ y: -6, scale: 1.02 }}
              className={`p-5 sm:p-6 rounded-[28px] border-4 transition-all duration-300 flex items-center gap-4 sm:gap-5 text-left shadow-lg h-full min-h-[140px] ${
                theme === 'light' 
                  ? 'bg-gradient-to-br from-emerald-50/80 to-green-100/50 border-emerald-300 text-emerald-950 shadow-emerald-500/5' 
                  : 'bg-gradient-to-br from-[#0B1F17]/90 to-[#0A122C]/90 border-emerald-900/60 text-emerald-100 shadow-black/40'
              }`}
            >
              <div className="p-3.5 sm:p-4 bg-emerald-500/10 rounded-2xl text-3xl sm:text-4xl filter drop-shadow-md flex-shrink-0">⛰️</div>
              <div className="space-y-1 flex-1">
                <h4 className="font-black text-sm sm:text-base uppercase tracking-wider">Bencana Tanah</h4>
                <p className="text-[11px] sm:text-xs opacity-80 leading-relaxed">Belajar penyelamatan diri dari Gempa Bumi, Tanah Longsor, dan Likuefaksi.</p>
              </div>
            </motion.div>
 
            {/* Card 3: Fire */}
            <motion.div 
              whileHover={{ y: -6, scale: 1.02 }}
              className={`p-5 sm:p-6 rounded-[28px] border-4 transition-all duration-300 flex items-center gap-4 sm:gap-5 text-left shadow-lg h-full min-h-[140px] ${
                theme === 'light' 
                  ? 'bg-gradient-to-br from-rose-50/80 to-red-100/50 border-rose-300 text-rose-950 shadow-rose-500/5' 
                  : 'bg-gradient-to-br from-[#201016]/90 to-[#0A122C]/90 border-red-900/60 text-rose-100 shadow-black/40'
              }`}
            >
              <div className="p-3.5 sm:p-4 bg-red-500/10 rounded-2xl text-3xl sm:text-4xl filter drop-shadow-md flex-shrink-0">🔥</div>
              <div className="space-y-1 flex-1">
                <h4 className="font-black text-sm sm:text-base uppercase tracking-wider">Bencana Api</h4>
                <p className="text-[11px] sm:text-xs opacity-80 leading-relaxed">Belajar memadamkan dan mengantisipasi Kebakaran Hutan serta Pemukiman.</p>
              </div>
            </motion.div>
 
            {/* Card 4: Air */}
            <motion.div 
              whileHover={{ y: -6, scale: 1.02 }}
              className={`p-5 sm:p-6 rounded-[28px] border-4 transition-all duration-300 flex items-center gap-4 sm:gap-5 text-left shadow-lg h-full min-h-[140px] ${
                theme === 'light' 
                  ? 'bg-gradient-to-br from-amber-50/80 to-yellow-100/50 border-amber-300 text-amber-950 shadow-amber-500/5' 
                  : 'bg-gradient-to-br from-[#1F1710]/90 to-[#0A122C]/90 border-amber-900/60 text-amber-100 shadow-black/40'
              }`}
            >
              <div className="p-3.5 sm:p-4 bg-amber-500/10 rounded-2xl text-3xl sm:text-4xl filter drop-shadow-md flex-shrink-0">🌪️</div>
              <div className="space-y-1 flex-1">
                <h4 className="font-black text-sm sm:text-base uppercase tracking-wider">Bencana Udara</h4>
                <p className="text-[11px] sm:text-xs opacity-80 leading-relaxed">Belajar menghadapi Puting Beliung, Angin Topan, dan menjaga kualitas Udara.</p>
              </div>
            </motion.div>

          </div>
        </div>

      </div>

      {/* Floating Si Cilik in top-right corner */}
      <SiCilik 
        message="Halo! Aku Si Cilik. Yuk klik tombol kuning di kiri untuk mulai bermain!" 
        position="top-right" 
      />

      {/* 3. Bottom Footer / Wave styling */}
      <footer className="w-full text-center py-6 z-20 shrink-0 select-none">
        <p className={`text-xs font-black uppercase tracking-[0.3em] ${theme === 'light' ? 'text-blue-900/40' : 'text-white/20'}`}>
          DIKEMBANGKAN OLEH TIM SIGAB &copy; 2026
        </p>
      </footer>

    </motion.div>
  );

  const renderSetupView = () => {
    return (
      <div className={`min-h-screen relative flex flex-col items-center justify-center py-12 px-4 md:px-8 overflow-y-auto transition-colors duration-500`}>
        <DisasterAnimations />
        <SiCilik message="Siapkan regu kalian agar kita bisa mulai bertualang!" position="top-right" />
        
        <div className="max-w-5xl mx-auto w-full relative z-10 flex flex-col space-y-8">
          <div className="flex items-center justify-between w-full gap-4">
            <button 
              onClick={() => setView('HOME')} 
              className={`flex items-center transition-colors group text-sm md:text-lg font-black uppercase tracking-widest self-start ${
                theme === 'light' ? 'text-blue-700 hover:text-blue-900' : 'text-white/40 hover:text-white'
              }`}
            >
              <ArrowLeft className="mr-3 group-hover:-translate-x-2 transition-transform" /> 
              <span>KEMBALI KE BERANDA</span>
            </button>
            <ControlWidget />
          </div>
          
          <div className={`p-8 md:p-12 rounded-[48px] shadow-2xl border-2 relative overflow-visible backdrop-blur-sm transition-all duration-500 w-full ${
            theme === 'light' 
            ? 'bg-white border-blue-200 text-slate-800 shadow-blue-500/10' 
            : 'bg-[#0C142B] border-blue-900/30 text-white shadow-black/40'
          }`}>
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-blue via-accent-blue to-primary-blue rounded-t-[48px]" />
            
            <h2 className="text-4xl md:text-6xl font-black mb-8 text-center uppercase tracking-tight leading-none">
              SIAPKAN REGU! <span className={`block text-xl md:text-2xl mt-2 font-black ${theme === 'light' ? 'text-blue-600' : 'text-blue-400 opacity-60'}`}>PENGATURAN MISI</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className={`text-xs md:text-sm font-black uppercase tracking-[0.4em] ml-2 ${
                    theme === 'light' ? 'text-blue-600/80' : 'text-blue-400/50'
                  }`}>Nama Kelas / Regu</label>
                  <input 
                    type="text" 
                    value={setupClassName}
                    onChange={(e) => setSetupClassName(e.target.value)}
                    placeholder="CONTOH: 5A PRATAMA"
                    className={`w-full border-2 rounded-3xl p-5 md:p-6 text-xl md:text-2xl font-black outline-none transition-all placeholder:opacity-30 uppercase ${
                      theme === 'light'
                      ? 'bg-blue-50/50 border-blue-200 text-slate-900 focus:border-blue-500 focus:bg-white placeholder:text-slate-400'
                      : 'bg-white/5 border-white/10 text-white focus:border-primary-blue focus:bg-white/10 placeholder:text-white/20'
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <label className={`text-xs font-black uppercase tracking-[0.4em] ml-2 ${
                    theme === 'light' ? 'text-blue-600/80' : 'text-blue-400/50'
                  }`}>Jumlah Kelompok</label>
                  <div className={`flex items-center gap-6 p-4 rounded-[28px] border-2 ${
                    theme === 'light' ? 'bg-blue-50/30 border-blue-100' : 'bg-white/5 border-white/10'
                  }`}>
                    <button 
                      onClick={() => setSetupGroupCount(Math.max(1, setupGroupCount - 1))} 
                      className="w-14 h-14 flex items-center justify-center bg-blue-600 hover:bg-blue-500 rounded-2xl text-white text-3xl font-black shadow-lg transition-transform active:scale-90"
                    >
                      -
                    </button>
                    <span className={`flex-1 text-center text-3xl font-black ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>{setupGroupCount}</span>
                    <button 
                      onClick={() => setSetupGroupCount(setupGroupCount + 1)} 
                      className="w-14 h-14 flex items-center justify-center bg-blue-600 hover:bg-blue-500 rounded-2xl text-white text-3xl font-black shadow-lg transition-transform active:scale-90"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-2">
                <label className={`text-xs font-black uppercase tracking-[0.4em] ml-2 ${
                  theme === 'light' ? 'text-blue-600/80' : 'text-blue-400/50'
                }`}>Nama-Nama Kelompok</label>
                <div className={`grid grid-cols-1 gap-3 max-h-[220px] md:max-h-[280px] overflow-y-auto p-3 rounded-3xl border custom-scrollbar ${
                  theme === 'light' ? 'bg-blue-50/30 border-blue-100' : 'bg-white/5 border-white/10'
                }`}>
                  {setupCustomGroupNames.map((name, i) => (
                    <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border ${
                      theme === 'light' ? 'bg-white border-blue-100 shadow-sm' : 'bg-white/5 border-white/5'
                    }`}>
                      <span className={`text-xs font-bold shrink-0 ${theme === 'light' ? 'text-blue-500' : 'text-blue-400/60'}`}>#{i + 1}</span>
                      <input
                        type="text"
                        value={name}
                        placeholder={`Kelompok ${i + 1}`}
                        onChange={(e) => {
                          const updated = [...setupCustomGroupNames];
                          updated[i] = e.target.value;
                          setSetupCustomGroupNames(updated);
                        }}
                        className={`bg-transparent font-black uppercase outline-none flex-1 text-sm sm:text-base border-b border-transparent focus:border-blue-500 ${
                          theme === 'light' ? 'text-slate-800 placeholder:text-slate-400' : 'text-white placeholder:text-white/20'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => initGame({ className: setupClassName, groupNames: setupCustomGroupNames })}
              disabled={!setupClassName}
              className="w-full py-6 md:py-8 bg-star-gold hover:brightness-110 text-slate-900 disabled:opacity-20 text-2xl md:text-3xl font-black rounded-[32px] transition-all shadow-2xl uppercase border-b-10 border-yellow-700 active:border-b-0 active:translate-y-2 mt-4"
            >
              GAS KE PAPAN! 🚀
            </motion.button>
          </div>
        </div>
      </div>
    );
  };

  const ControlWidget = () => (
    <div className={`flex items-center gap-1.5 p-1 rounded-full border shadow-lg transition-all z-[150] pointer-events-auto ${
      theme === 'light' 
        ? 'bg-white/95 border-blue-200 text-slate-800 shadow-blue-200/50' 
        : 'bg-[#0E172E]/95 border-blue-900/50 text-white shadow-black/40'
    }`}>
      {/* Music Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleMute(e);
        }}
        className={`px-3 py-1.5 rounded-full flex items-center gap-2 font-black text-xs uppercase tracking-wider transition-all active:scale-95 ${
          isMuted 
            ? 'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30' 
            : theme === 'light' 
              ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-transparent' 
              : 'bg-white/10 text-white hover:bg-white/20 border border-transparent'
        }`}
        title={isMuted ? 'Nyalakan Musik' : 'Matikan Musik'}
      >
        {isMuted ? <VolumeX size={16} strokeWidth={3} /> : <Volume2 size={16} strokeWidth={3} />}
        <span className="text-[10px] sm:inline">{isMuted ? 'SENYAP' : 'MUSIK'}</span>
      </button>

      {/* Theme Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setTheme(prev => prev === 'light' ? 'dark' : 'light');
        }}
        className={`px-3 py-1.5 rounded-full flex items-center gap-2 font-black text-xs uppercase tracking-wider transition-all active:scale-95 ${
          theme === 'light' 
            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300/40' 
            : 'bg-indigo-950 text-indigo-300 hover:bg-indigo-900 border border-indigo-500/20'
        }`}
        title="Ganti Tema (Terang/Gelap)"
      >
        {theme === 'light' ? <Sun size={16} strokeWidth={3} className="text-amber-500" /> : <Moon size={16} strokeWidth={3} className="text-indigo-300" />}
        <span className="text-[10px] sm:inline">{theme === 'light' ? 'TERANG' : 'GELAP'}</span>
      </button>
    </div>
  );

  const MusicToggle = () => null;

  const renderBoardView = () => {
    if (!session) return null;
    const currentGroup = session.groups[session.currentTurn];
    
    return (
      <div className={`flex flex-col min-h-screen overflow-hidden font-sans relative transition-colors duration-500 ${
        theme === 'light' ? 'bg-gradient-to-br from-sky-100 via-blue-50 to-sky-100 text-slate-800' : 'bg-[#070D1E] text-white'
      }`}>
        <DisasterAnimations />
        
        <AnimatePresence>
          {activeSpecialCard && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                className={`w-full max-w-2xl p-8 sm:p-12 md:p-16 rounded-[48px] border-4 shadow-2xl relative overflow-hidden text-center transition-all ${
                  activeSpecialCard.type === 'CHALLENGE' 
                  ? 'bg-gradient-to-br from-[#FF6B35] to-[#D9480F] border-orange-400/50' 
                  : 'bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] border-blue-400/50'
                }`}
              >
                {/* Decorative background effects */}
                <div className="absolute top-[-20%] right-[-20%] w-80 h-80 bg-white/20 rounded-full blur-3xl" />
                <div className="absolute bottom-[-20%] left-[-20%] w-80 h-80 bg-black/20 rounded-full blur-3xl" />
                
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <h2 className="text-star-gold text-lg sm:text-xl font-black tracking-[0.5em] uppercase mb-2 drop-shadow-md">
                    {activeSpecialCard.type === 'CHALLENGE' ? 'MISI TANTANGAN' : 'HADIAH KESELAMATAN'}
                  </h2>
                  <div className="h-1 w-24 bg-star-gold/40 mx-auto rounded-full" />
                </motion.div>
                
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: activeSpecialCard.type === 'CHALLENGE' ? [-2, 2, -2] : [0, 5, -5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="text-8xl sm:text-9xl mb-10 filter drop-shadow-2xl"
                >
                  {activeSpecialCard.type === 'CHALLENGE' ? '📦' : '🛡️'}
                </motion.div>
                
                <h3 className="text-4xl sm:text-5xl md:text-6xl font-black mb-8 text-white uppercase tracking-tight leading-tight">
                  {activeSpecialCard.title}
                </h3>
                
                <div className="bg-black/20 backdrop-blur-md p-8 sm:p-10 rounded-[40px] mb-10 border border-white/10">
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white opacity-95 leading-relaxed">
                    "{activeSpecialCard.description}"
                  </p>
                </div>
                
                {activeSpecialCard.type === 'CHALLENGE' ? (
                  <div className="flex flex-col gap-4">
                    <div className="bg-white/10 px-10 py-5 rounded-full mb-4 inline-flex items-center justify-center gap-4 self-center border border-white/20">
                      <Star size={32} className="text-star-gold fill-star-gold" />
                      <span className="text-3xl font-black text-white">+ {activeSpecialCard.points} BINTANG!</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button 
                        onClick={claimSpecialCard}
                        className="py-6 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full text-2xl font-black uppercase tracking-widest shadow-2xl transition-all border-b-8 border-emerald-900 active:border-b-0 active:translate-y-2"
                      >
                        BERHASIL! ✅
                      </button>
                      <button 
                        onClick={failSpecialCard}
                        className="py-6 bg-red-500 hover:bg-red-400 text-white rounded-full text-2xl font-black uppercase tracking-widest shadow-2xl transition-all border-b-8 border-red-900 active:border-b-0 active:translate-y-2"
                      >
                        GAGAL! ❌
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={claimSpecialCard}
                    className="w-full py-8 bg-white text-bg-dark hover:bg-soft-white rounded-full text-3xl font-black uppercase tracking-widest transition-all shadow-2xl border-b-8 border-blue-200 active:border-b-0 active:translate-y-2"
                  >
                    KUMPULKAN! 🚀
                  </button>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="flex flex-col h-full flex-1 relative z-10">
          {/* Header */}
          <header className="px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
            <div className="flex flex-col text-center md:text-left">
              <h1 className={`text-3xl font-black tracking-tighter uppercase transition-all hover:tracking-normal cursor-default leading-none ${
                theme === 'light' ? 'text-blue-800' : 'text-[#A5C9FF]'
              }`}>SIAGA CILIK</h1>
              <span className={`font-black text-xs sm:text-sm uppercase tracking-[0.3em] mt-1 italic drop-shadow-sm ${
                theme === 'light' ? 'text-blue-600/80' : 'text-blue-400/70'
              }`}>
                KELAS: {session.className}
              </span>
            </div>
            
            <TimerWidget />

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex bg-[#1D4ED8] px-6 py-2.5 rounded-full items-center gap-3 shadow-[0_0_30px_rgba(29,78,216,0.3)] border border-blue-400/30">
                 <span className="text-xl">🌍</span>
                 <span className="font-black text-white text-sm tracking-widest uppercase">EKSPEDISI SIGAP</span>
              </div>
              <ControlWidget />
            </div>
          </header>

          <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 sm:px-12 pb-12 items-stretch overflow-y-auto">
            {/* Left Sidebar: Scoreboard */}
            <div className={`col-span-1 lg:col-span-3 backdrop-blur-2xl p-6 rounded-[40px] border shadow-2xl flex flex-col lg:max-h-[85vh] overflow-y-auto transition-all duration-300 ${
              theme === 'light' 
              ? 'bg-white border-blue-200 text-slate-800 shadow-blue-500/5' 
              : 'bg-[#0C142B]/90 border-blue-900/40 text-white'
            }`}>
              <h3 className={`text-[10px] font-black uppercase tracking-[0.4em] mb-2 text-center underline decoration-blue-500/30 underline-offset-8 ${
                theme === 'light' ? 'text-blue-700' : 'text-blue-400/50'
              }`}>SCOREBOARD REGU</h3>
              <div className={`text-[10px] font-black text-center mb-6 tracking-wider uppercase animate-pulse ${
                theme === 'light' ? 'text-blue-600/60' : 'text-blue-400/40'
              }`}>
                👇 KLIK REGU UNTUK MEMILIH GILIRAN
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar scrollbar-hide">
                {session.groups.map((group, i) => (
                  <motion.div 
                    key={group.id}
                    onClick={() => {
                      if (editingGroupId !== group.id) {
                        setSession({
                          ...session,
                          currentTurn: i
                        });
                      }
                    }}
                    whileHover={{ scale: 1.02 }}
                    animate={sparkleActive && winnerGroupIdx === i ? {
                      scale: [1, 1.05, 1],
                      boxShadow: ['0 0 0px rgba(251,191,36,0)', '0 0 30px rgba(251,191,36,0.4)', '0 0 0px rgba(251,191,36,0)']
                    } : {}}
                    className={`px-6 py-5 rounded-[24px] flex justify-between items-center transition-all relative group cursor-pointer ${
                      i === session.currentTurn 
                      ? (theme === 'light' 
                          ? 'bg-blue-500 text-white border-2 border-blue-300 shadow-md opacity-100 ring-4 ring-blue-500/20' 
                          : 'bg-blue-600 text-white border-2 border-white/30 ring-4 ring-blue-500/20 shadow-lg opacity-100')
                      : (theme === 'light'
                          ? 'bg-blue-50/70 text-slate-800 opacity-60 hover:opacity-100 border border-blue-100 shadow-sm'
                          : 'bg-white/5 text-white opacity-50 hover:opacity-90 border border-white/5')
                    }`}
                  >
                    {editingGroupId === group.id ? (
                      <div className="flex flex-col flex-1 mr-2" onClick={(e) => e.stopPropagation()}>
                        <span className={`text-[9px] font-bold uppercase tracking-widest leading-none mb-1 ${
                          theme === 'light' ? 'text-blue-600' : 'text-white/50'
                        }`}>EDIT NAMA REGU</span>
                        <input
                          type="text"
                          value={editingGroupName}
                          onChange={(e) => setEditingGroupName(e.target.value)}
                          autoFocus
                          onBlur={() => {
                            if (editingGroupName.trim()) {
                              const updatedGroups = session.groups.map(g => 
                                g.id === group.id ? { ...g, name: editingGroupName.trim() } : g
                              );
                              setSession({ ...session, groups: updatedGroups });
                            }
                            setEditingGroupId(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              if (editingGroupName.trim()) {
                                const updatedGroups = session.groups.map(g => 
                                  g.id === group.id ? { ...g, name: editingGroupName.trim() } : g
                                );
                                setSession({ ...session, groups: updatedGroups });
                              }
                              setEditingGroupId(null);
                            } else if (e.key === 'Escape') {
                              setEditingGroupId(null);
                            }
                          }}
                          className={`border-2 rounded-xl px-3 py-1.5 font-black uppercase text-sm outline-none w-full ${
                            theme === 'light' ? 'bg-white border-blue-500 text-slate-900' : 'bg-black/40 border-blue-400 text-white'
                          }`}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className={`text-[9px] font-bold uppercase tracking-widest leading-none mb-1 ${
                          theme === 'light' && i !== session.currentTurn ? 'text-blue-600/60' : 'text-white/50'
                        }`}>REGU</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-black uppercase text-xl tracking-wider ${
                            theme === 'light' && i !== session.currentTurn ? 'text-slate-800' : 'text-white'
                          }`}>
                            {group.name}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingGroupId(group.id);
                              setEditingGroupName(group.name);
                            }}
                            className={`opacity-0 group-hover:opacity-100 hover:text-star-gold p-1 transition-opacity ${
                              theme === 'light' && i !== session.currentTurn ? 'text-slate-400' : 'text-white/60'
                            }`}
                            title="Ubah nama"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 relative">
                      {sparkleActive && winnerGroupIdx === i && <Sparkle />}
                      <div className={`p-2 rounded-xl group-hover:scale-110 transition-transform ${
                        theme === 'light' && i !== session.currentTurn ? 'bg-blue-100/50' : 'bg-black/20'
                      }`}>
                        <Star size={20} className="text-star-gold fill-star-gold animate-pulse" />
                      </div>
                      <AnimatedScore value={group.stars} />
                    </div>
                    
                    {i === session.currentTurn && (
                      <motion.div 
                        layoutId="active-indicator"
                        className={`absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 shadow-[0_0_10px_rgba(52,211,153,0.5)] ${
                          theme === 'light' ? 'border-white' : 'border-[#0C142B]'
                        }`}
                      />
                    )}
                  </motion.div>
                ))}
              </div>

              {(() => {
                const leadingStars = Math.max(...session.groups.map(g => g.stars), 0);
                return (
                  <div className={`mt-8 pt-8 border-t space-y-4 ${
                    theme === 'light' ? 'border-blue-100' : 'border-white/5'
                  }`}>
                     <div className="flex justify-between items-center px-4">
                        <span className={`font-bold text-xs uppercase tracking-widest ${
                          theme === 'light' ? 'text-slate-400' : 'text-white/40'
                        }`}>PROGRES JUARA</span>
                        <span className="text-star-gold font-black text-xl">{leadingStars} / 21 ⭐</span>
                     </div>
                     <div className={`w-full h-3 rounded-full overflow-hidden border ${
                       theme === 'light' ? 'bg-blue-50 border-blue-100' : 'bg-white/5 border-white/5'
                     }`}>
                        <motion.div 
                          className="h-full bg-gradient-to-r from-blue-500 to-star-gold shadow-[0_0_15px_rgba(251,191,36,0.5)]" 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (leadingStars / 21) * 100)}%` }}
                        />
                     </div>
                  </div>
                );
              })()}
            </div>

            <div className={`col-span-1 lg:col-span-9 rounded-[48px] p-4 sm:p-8 border shadow-inner overflow-y-auto custom-scrollbar flex items-start justify-center lg:max-h-[85vh] transition-all duration-300 ${
              theme === 'light' 
              ? 'bg-white/95 border-blue-200/80 shadow-[0_10px_50px_rgba(59,130,246,0.06)]' 
              : 'bg-[#0C142B]/40 border-blue-900/30'
            }`}>
              <div 
                className="w-full max-w-[850px] grid grid-cols-4 gap-4 sm:gap-6"
              >
                {/* Header Row Helpers (Implicitly grouped by rows) */}
                {BOARD_TILES.map((tile, index) => (
                  <React.Fragment key={tile.id}>
                    {/* Add Category Labels at the start of each functional row group */}
                    {index === 0 && <CategoryHeader title="SUDUT SPESIAL" icon="🌟" theme={theme} className="col-span-4" />}
                    {index === 4 && <CategoryHeader title="BENCANA AIR" icon="🌊" theme={theme} className="col-span-4" />}
                    {index === 8 && <CategoryHeader title="BENCANA TANAH" icon="⛰️" theme={theme} className="col-span-4" />}
                    {index === 12 && <CategoryHeader title="BENCANA API" icon="🔥" theme={theme} className="col-span-4" />}
                    {index === 17 && <CategoryHeader title="BENCANA UDARA" icon="🌪️" theme={theme} className="col-span-4" />}
                    {index === 21 && <CategoryHeader title="KARTU TANTANGAN" icon="❓" theme={theme} className="col-span-4" />}
                    {index === 25 && <CategoryHeader title="KARTU SELAMAT & BONUS" icon="🛡️" theme={theme} className="col-span-4" />}
                    {index === 29 && <CategoryHeader title="MISI AKHIR" icon="🏆" theme={theme} className="col-span-4" />}
 
                    <motion.button
                      whileHover={{ scale: 1.05, zIndex: 10, boxShadow: theme === 'light' ? '0 10px 25px rgba(59,130,246,0.15)' : '0 0 40px rgba(59,130,246,0.5)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTileClick(tile)}
                      className={`relative rounded-[32px] border-2 aspect-square flex flex-col items-center justify-center p-3 text-center group transition-all overflow-hidden ${
                        theme === 'light'
                        ? (
                            tile.type === 'START' || tile.type === 'CORNER' || tile.type === 'JAIL'
                              ? 'bg-[#E8F8F0] hover:bg-[#D1F2E1] border-emerald-300 text-emerald-900 shadow-sm'
                              : tile.type === 'CHALLENGE' || tile.type === 'CHANCE'
                              ? 'bg-[#FFF3E0] hover:bg-[#FFE0B2] border-orange-300 text-orange-900 shadow-sm'
                              : tile.type === 'SAFETY' || tile.type === 'BONUS'
                              ? 'bg-[#E0F2FE] hover:bg-[#BAE6FD] border-sky-300 text-sky-900 shadow-sm'
                              : tile.type === 'MUNDUR'
                              ? 'bg-[#FFE4E6] hover:bg-[#FECDD3] border-rose-300 text-rose-900 shadow-sm'
                              : tile.isSpecial
                              ? 'bg-[#FFFDE7] hover:bg-[#FEF9C3] border-amber-400 text-amber-950 shadow-sm'
                              : tile.theme === 'Bencana Tanah'
                              ? 'bg-[#FDF8F5] hover:bg-[#FAF0E6] border-amber-200 text-amber-900 shadow-sm'
                              : tile.theme === 'Bencana Air'
                              ? 'bg-[#F0F9FF] hover:bg-[#E0F2FE] border-sky-200 text-sky-900 shadow-sm'
                              : tile.theme === 'Bencana Api'
                              ? 'bg-[#FFF1F2] hover:bg-[#FFE4E6] border-rose-200 text-rose-900 shadow-sm'
                              : tile.theme === 'Bencana Udara'
                              ? 'bg-[#FFFBEB] hover:bg-[#FEF3C7] border-yellow-200 text-yellow-900 shadow-sm'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                          )
                        : (
                            tile.type === 'START' || tile.type === 'CORNER' || tile.type === 'JAIL'
                              ? 'bg-emerald-900/80 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-800 text-white' 
                              : tile.type === 'CHALLENGE' || tile.type === 'CHANCE'
                              ? 'bg-[#FF6B35] border-orange-400/50 shadow-[0_0_20px_rgba(255,107,53,0.3)] hover:bg-[#FF8555] text-white'
                              : tile.type === 'SAFETY' || tile.type === 'BONUS'
                              ? 'bg-[#3B82F6] border-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:bg-[#5595F7] text-white'
                              : tile.type === 'MUNDUR'
                              ? 'bg-red-900/80 border-red-400/40 hover:bg-red-800 shadow-[0_0_20px_rgba(239,68,68,0.2)] text-white'
                              : tile.isSpecial
                              ? 'bg-star-gold/20 border-star-gold shadow-[0_0_25px_rgba(251,191,36,0.4)] hover:bg-star-gold/30 text-white'
                              : tile.theme === 'Bencana Tanah'
                              ? 'bg-emerald-600/30 border-emerald-500/50 hover:bg-emerald-600/50 text-white'
                              : tile.theme === 'Bencana Air'
                              ? 'bg-blue-600/30 border-blue-500/50 hover:bg-blue-600/50 text-white'
                              : tile.theme === 'Bencana Api'
                              ? 'bg-red-600/30 border-red-500/50 hover:bg-red-600/50 text-white'
                              : tile.theme === 'Bencana Udara'
                              ? 'bg-amber-500/30 border-amber-500/50 hover:bg-amber-500/50 text-white'
                              : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                          )
                      }`}
                    >
                      <div className="text-4xl sm:text-5xl mb-3 filter drop-shadow-lg transform group-hover:scale-115 transition-transform duration-300">{tile.icon}</div>
                      <span className={`text-[10px] sm:text-[14px] font-black uppercase tracking-tight leading-tight px-1 line-clamp-2 mb-2 ${
                        theme === 'light' ? 'text-slate-800' : 'text-white drop-shadow-md'
                      }`}>
                         {tile.label}
                      </span>
                      
                      {tile.subLabel && (
                        <div className={`mt-auto flex items-center gap-2 w-full justify-center py-1.5 rounded-xl border ${
                          theme === 'light' ? 'bg-blue-100/50 border-blue-200/50' : 'bg-black/40 border-white/5'
                        }`}>
                          {tile.interactionType && (
                            <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${
                              tile.interactionType === 'ANSWER' ? 'text-blue-400 bg-blue-400' :
                              tile.interactionType === 'SORT' ? 'text-orange-400 bg-orange-400' :
                              'text-emerald-400 bg-emerald-400'
                            }`} />
                          )}
                          <span className={`text-[7px] sm:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                            theme === 'light' ? 'text-blue-800' : 'text-white/90'
                          }`}>
                            {tile.subLabel}
                          </span>
                        </div>
                      )}
                      
                      {/* Interactive Hover Glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.button>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </main>
        </div>

        {/* Global Floating Si Cilik for Board */}
        <SiCilik 
          message={`Ayo ${currentGroup.name}, giliran kalian! Klik kotak yang kamu tuju!`} 
          mood={siCilikState}
          position="top-right"
        />
      </div>
    );
  };


  const renderQuizView = () => {
    if (!activeQuestion || !session) return null;
    const currentGroup = session.groups[session.currentTurn];

    // Theme Customizations for child-friendly interface
    let themeConfig = {
      cardBg: 'from-amber-950/70 via-[#1A120B]/95 to-emerald-950/70 border-amber-600/30 shadow-amber-500/10',
      textAccent: 'text-amber-400',
      badgeBg: 'bg-amber-600',
      badgeText: 'Penyelamatan Tanah ⛰️',
      mascotBubble: 'border-amber-400',
      iconEmoji: '⛰️',
      decorations: ['🌲', '⛰️', '🎒', '🛡️', '🌱']
    };

    if (activeQuestion.theme === 'Bencana Air') {
      themeConfig = {
        cardBg: 'from-blue-950/70 via-[#0A1D37]/95 to-cyan-950/70 border-blue-500/30 shadow-blue-500/10',
        textAccent: 'text-blue-400',
        badgeBg: 'bg-blue-600',
        badgeText: 'Penyelamatan Air 🌊',
        mascotBubble: 'border-blue-400',
        iconEmoji: '🌊',
        decorations: ['🧴', '🌊', '⚓', '🛶', '🐟']
      };
    } else if (activeQuestion.theme === 'Bencana Api') {
      themeConfig = {
        cardBg: 'from-red-950/70 via-[#1C0A00]/95 to-orange-950/70 border-orange-500/30 shadow-red-500/10',
        textAccent: 'text-orange-400',
        badgeBg: 'bg-red-600',
        badgeText: 'Penyelamatan Api 🔥',
        mascotBubble: 'border-orange-500',
        iconEmoji: '🔥',
        decorations: ['🚒', '🔥', '🧯', '🧱', '🦊']
      };
    } else if (activeQuestion.theme === 'Bencana Udara') {
      themeConfig = {
        cardBg: 'from-indigo-950/70 via-[#0B132B]/95 to-sky-900/70 border-sky-500/30 shadow-sky-500/10',
        textAccent: 'text-sky-400',
        badgeBg: 'bg-sky-600',
        badgeText: 'Penyelamatan Udara 🌪️',
        mascotBubble: 'border-sky-400',
        iconEmoji: '🌪️',
        decorations: ['📻', '🌪️', '🪁', '🌀', '🦅']
      };
    }

    const handleSpeakAgain = () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      speak(activeQuestion.question);
    };

    return (
      <div className="min-h-screen bg-[#050B19] flex flex-col p-3 sm:p-6 z-10 relative overflow-x-hidden">
        <DisasterAnimations />
        
        {/* Floating background themed elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-[0.15]">
          {themeConfig.decorations.map((emoji, index) => (
            <motion.div
              key={index}
              className="absolute text-5xl sm:text-7xl select-none"
              initial={{ 
                x: ((15 + (index * 18)) % 90) + '%', 
                y: ((20 + (index * 22)) % 80) + '%',
                rotate: index * 45,
                scale: 0.8
              }}
              animate={{ 
                y: ['0%', '15%', '-15%', '0%'],
                rotate: [index * 45, index * 45 + 10, index * 45 - 10, index * 45]
              }}
              transition={{
                duration: 8 + index * 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>

        <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col justify-center relative z-10">
          
          {/* TOP DECK: Stat HUD Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 bg-white/5 border border-white/10 rounded-[28px] p-4 shadow-xl backdrop-blur-md w-full">
            
            {/* Group Badge */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-star-gold/20 border border-star-gold/50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                🛡️
              </div>
              <div className="text-left">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-star-gold block">Giliran Bermain</span>
                <span className="text-white font-black text-base sm:text-lg uppercase tracking-wider">REGU: {currentGroup.name}</span>
              </div>
            </div>

            {/* Live Progress Bar of Current Group */}
            <div className="hidden md:flex flex-col items-center flex-1 max-w-[240px] px-4">
              <div className="flex justify-between w-full text-[10px] font-black text-white/50 uppercase mb-1">
                <span>Skor Bintang</span>
                <span className="text-star-gold">{currentGroup.stars} / 21 ⭐</span>
              </div>
              <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-star-gold h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (currentGroup.stars / 21) * 100)}%` }}
                />
              </div>
            </div>

            {/* Timer and Interactive Control Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <TimerWidget />

              {/* Mute toggle button */}
              <button 
                onClick={(e) => toggleMute(e)}
                className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-all cursor-pointer ${
                  isMuted 
                  ? 'bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30' 
                  : 'bg-blue-500/20 border-blue-500/40 text-blue-400 hover:bg-blue-500/30'
                }`}
                title={isMuted ? "Suara Mati (Klik untuk Nyalakan)" : "Suara Nyala (Klik untuk Matikan)"}
              >
                {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
              </button>

              {/* Repeat voice speaking button */}
              <button 
                onClick={handleSpeakAgain}
                disabled={isMuted}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 disabled:opacity-20 transition-all cursor-pointer"
                title="Sebutkan Pertanyaan Lagi"
              >
                <Volume2 size={22} className={!isMuted ? "animate-pulse" : ""} />
              </button>

              {/* Theme toggle button */}
              <button 
                onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
                className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-all cursor-pointer ${
                  theme === 'light' 
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-500 hover:bg-amber-500/30' 
                  : 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/30'
                }`}
                title="Ganti Tema"
              >
                {theme === 'light' ? <Sun size={22} /> : <Moon size={22} />}
              </button>
            </div>
          </div>

          {/* MAIN DECK PANEL: Theme Themed Layout */}
          <div className={`bg-gradient-to-b ${themeConfig.cardBg} rounded-[32px] sm:rounded-[48px] p-5 sm:p-8 md:p-10 border-2 shadow-2xl flex-1 flex flex-col justify-between relative overflow-hidden transition-all duration-500`}>
            
            {/* Glowing Corner Accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />

            {/* Top Row: Mission & Theme Header Badge */}
            <div className="flex items-center justify-between gap-4 mb-4 z-10">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl ${themeConfig.badgeBg} text-white font-black text-xs uppercase shadow-md`}>
                <span className="text-base">{themeConfig.iconEmoji}</span>
                <span>{themeConfig.badgeText}</span>
              </div>

              {activeQuestion.question.includes('TANTANGAN SIGAP') && (
                <span className="bg-red-500 text-white font-black text-[10px] tracking-widest px-3 py-1.5 rounded-xl animate-bounce shadow-md">
                  🚨 EMERGENCY SIGAP
                </span>
              )}
            </div>

            {/* Middle Row: Mascot Column + Speech Bubble Box */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 items-center flex-1 my-4 sm:my-6 z-10">
              
              {/* Mascot Si Cilik standing in prompt column (Responsive: top on mobile, side on desktop) */}
              <div className="lg:col-span-1 flex flex-col items-center justify-center">
                <div className="relative bg-white/5 border border-white/10 rounded-[32px] p-4 sm:p-5 shadow-xl flex flex-col items-center gap-2 w-full max-w-[180px] lg:max-w-none text-center">
                  
                  {/* Glowing backing highlight */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-[32px] pointer-events-none" />
                  
                  {/* Custom Miniature Si Cilik Character render */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 relative select-none">
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                      {/* Legs (Khaki) */}
                      <path d="M35 90 H65 V98 H35 Z" fill="#A87952" />
                      {/* Shirt (Blue) */}
                      <path d="M30 65 Q50 63 70 65 L75 90 H25 Z" fill="#1E3A8A" />
                      {/* Blazer (Maroon) */}
                      <path d="M25 65 Q23 65 22 70 L18 90 H42 L45 65 Z" fill="#881337" />
                      <path d="M75 65 Q77 65 78 70 L82 90 H58 L55 65 Z" fill="#881337" />
                      {/* Head */}
                      <circle cx="50" cy="45" r="28" fill="#FFE4D6" />
                      {/* Hair (Brown) & Orange Helmet */}
                      <path d="M22 46 Q22 25 50 25 Q78 25 78 46" fill="none" stroke="#4B2C20" strokeWidth="8" />
                      <path d="M22 46 Q20 55 25 60 M78 46 Q80 55 75 60" fill="none" stroke="#4B2C20" strokeWidth="6" strokeLinecap="round" />
                      <path d="M22 32 Q22 8 50 8 Q78 8 78 32 L82 32 Q85 32 85 36 L15 36 Q15 32 18 32 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
                      <rect x="25" y="32" width="50" height="4" fill="#D97706" />
                      <circle cx="50" cy="20" r="6" fill="#475569" />
                      <path d="M46 18 L50 22 L54 18" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                      {/* Eyes */}
                      <g>
                        <circle cx="43" cy="45" r={siCilikState === 'SURPRISED' ? 4 : 3} fill="#000" />
                        <circle cx="57" cy="45" r={siCilikState === 'SURPRISED' ? 4 : 3} fill="#000" />
                      </g>
                      {/* Mouth */}
                      <path 
                        d={siCilikState === 'HAPPY' ? "M42 62 Q50 72 58 62" : siCilikState === 'SURPRISED' ? "M45 66 Q50 58 55 66" : "M44 64 Q50 68 56 64"}
                        stroke="#000" 
                        strokeWidth="2.5" 
                        fill="none" 
                        strokeLinecap="round"
                      />
                      {/* Cheeks */}
                      <circle cx="33" cy="55" r="5" fill="#F87171" opacity="0.4" />
                      <circle cx="67" cy="55" r="5" fill="#F87171" opacity="0.4" />
                    </svg>
                  </div>

                  <span className="text-white text-xs font-black tracking-widest block">SI CILIK</span>
                  <div className="bg-white/10 px-2 py-1 rounded-full text-[9px] font-bold text-white/70">
                    {answerStatus === 'IDLE' ? 'Siaga Bantu!' : answerStatus === 'CORRECT' ? 'Horeee!' : 'Ayo Coba Lagi!'}
                  </div>
                </div>
              </div>

              {/* Speech Bubble Container with white cartoon background for rich contrast and child readability */}
              <div className="lg:col-span-3 flex flex-col items-stretch relative">
                
                {/* Speech Bubble Left pointer (only on large screens, on mobile points up) */}
                <div className="hidden lg:block absolute top-1/2 -left-3 -translate-y-1/2 w-4 h-4 bg-white rotate-45 border-l-2 border-b-2 border-slate-300" />
                <div className="lg:hidden absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-t-2 border-l-2 border-slate-300" />

                <div className="bg-white text-bg-dark rounded-[24px] sm:rounded-[36px] p-5 sm:p-7 md:p-8 shadow-2xl border-2 border-slate-300 relative flex flex-col justify-center min-h-[140px] text-left">
                  
                  {/* Subtle cartoon sticker inside question bubble */}
                  <span className="absolute top-3 right-4 opacity-10 text-4xl sm:text-5xl font-black select-none pointer-events-none">
                    {themeConfig.iconEmoji}
                  </span>

                  {/* Question header */}
                  <span className={`text-[10px] sm:text-xs font-black tracking-[0.25em] mb-2 block uppercase ${themeConfig.textAccent} drop-shadow-sm`}>
                    🛡️ MISI PENYELAMATAN
                  </span>

                  {/* Clean readable text block */}
                  <h2 className="text-slate-800 font-extrabold text-base sm:text-lg md:text-xl leading-relaxed">
                    {activeQuestion.question.includes('TANTANGAN SIGAP') 
                      ? activeQuestion.question.replace('TANTANGAN SIGAP: ', '') 
                      : activeQuestion.question}
                  </h2>
                </div>
              </div>
            </div>

            {/* Bottom Row: Juicy 3D Mechanical Gaming Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 my-4 z-10">
              {activeQuestion.options.map((option, i) => {
                
                // Color schemes for A, B, C, D
                let colorClass = "";
                let indicatorClass = "";
                
                if (answerStatus === 'IDLE') {
                  if (i === 0) {
                    colorClass = "bg-gradient-to-r from-cyan-500 to-blue-600 border-blue-700 hover:brightness-110 text-white shadow-cyan-500/20";
                    indicatorClass = "bg-blue-700 text-white";
                  } else if (i === 1) {
                    colorClass = "bg-gradient-to-r from-amber-400 to-orange-500 border-orange-600 hover:brightness-110 text-white shadow-orange-500/20";
                    indicatorClass = "bg-orange-600 text-white";
                  } else if (i === 2) {
                    colorClass = "bg-gradient-to-r from-indigo-500 to-purple-600 border-purple-700 hover:brightness-110 text-white shadow-purple-500/20";
                    indicatorClass = "bg-purple-700 text-white";
                  } else {
                    colorClass = "bg-gradient-to-r from-pink-500 to-rose-600 border-rose-700 hover:brightness-110 text-white shadow-rose-500/20";
                    indicatorClass = "bg-rose-700 text-white";
                  }
                } else {
                  // After answer submitted
                  if (i === activeQuestion.correctAnswer) {
                    // Correct answer (Green)
                    colorClass = "bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-700 text-white shadow-emerald-500/30 scale-[1.02] ring-4 ring-emerald-400/50";
                    indicatorClass = "bg-emerald-700 text-white";
                  } else if (i === selectedAnswer) {
                    // Selected wrong answer (Red)
                    colorClass = "bg-gradient-to-r from-red-500 to-rose-600 border-red-700 text-white shadow-red-500/30 opacity-70 scale-95 pointer-events-none";
                    indicatorClass = "bg-red-700 text-white";
                  } else {
                    // Unselected incorrect options
                    colorClass = "bg-white/5 text-white/20 border-white/10 opacity-20 scale-95 pointer-events-none";
                    indicatorClass = "bg-white/10 text-white/30";
                  }
                }

                return (
                  <motion.button
                    key={i}
                    disabled={answerStatus !== 'IDLE'}
                    onClick={() => submitAnswer(i)}
                    whileHover={answerStatus === 'IDLE' ? { scale: 1.03, y: -2 } : {}}
                    whileTap={answerStatus === 'IDLE' ? { scale: 0.98, y: 4 } : {}}
                    className={`p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl text-left flex items-center gap-4 transition-all border-b-8 shadow-lg font-black text-sm sm:text-base md:text-lg cursor-pointer ${colorClass}`}
                  >
                    {/* Option letter label */}
                    <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shrink-0 font-extrabold text-base sm:text-lg shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)] ${indicatorClass}`}>
                      <span>{String.fromCharCode(65 + i)}</span>
                    </div>

                    <span className="flex-1 leading-tight tracking-wide">{option}</span>

                    {/* Result feedback checkmark */}
                    {answerStatus !== 'IDLE' && i === activeQuestion.correctAnswer && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.3, 1] }}
                        className="w-7 h-7 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-lg shrink-0"
                      >
                        <CheckCircle2 size={18} className="stroke-[3]" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Slide-In Overlay for Rescue Report (Explanation) */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div 
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 100 }}
                  className="absolute inset-0 z-20 bg-[#0E152D]/95 backdrop-blur-md p-5 sm:p-8 flex flex-col justify-center items-center text-center overflow-y-auto"
                >
                  <div className="max-w-xl mx-auto flex flex-col items-center w-full">
                    
                    {/* Animated mascot feedback */}
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: answerStatus === 'CORRECT' ? [0, 10, -10, 0] : [0, -5, 5, 0]
                      }}
                      transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
                      className="text-7xl sm:text-8xl mb-4"
                    >
                      {answerStatus === 'CORRECT' ? '🏆🌟' : '💡💪'}
                    </motion.div>

                    <h3 className={`text-2xl sm:text-4xl font-black uppercase tracking-widest mb-2 ${
                      answerStatus === 'CORRECT' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {answerStatus === 'CORRECT' ? 'MISI BERHASIL!' : 'PELAJARAN BARU!'}
                    </h3>

                    <p className={`font-black text-xs sm:text-sm uppercase tracking-[0.3em] mb-4 opacity-75 ${
                      answerStatus === 'CORRECT' ? 'text-emerald-300' : 'text-amber-300'
                    }`}>
                      {answerStatus === 'CORRECT' ? '+2 BINTANG UNTUK REGU!' : 'TETAP SEMANGAT REGU!'}
                    </p>

                    {answerStatus === 'CORRECT' && (
                      <div className="relative w-20 h-10 mb-2">
                        <Sparkle count={16} />
                      </div>
                    )}

                    {/* Cute whiteboard scroll for explanation text */}
                    <div className="bg-white text-slate-800 rounded-3xl p-5 sm:p-6 border-4 border-slate-300 shadow-xl mb-6 max-h-[180px] overflow-y-auto custom-scrollbar w-full text-left">
                      <p className="text-sm sm:text-base md:text-lg font-bold leading-relaxed">
                        {answerStatus === 'CORRECT' 
                          ? activeQuestion.explanation 
                          : activeQuestion.explanation.replace(/^(Hebat!|Pintar!|Luar biasa!|Betul!|Cerdas!|Tepat!|Benar!|Langkah bijak!)\s*/i, 'Yuk kita pelajari: ')
                        }
                      </p>
                    </div>

                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (window.speechSynthesis) {
                          window.speechSynthesis.cancel();
                        }
                        addStars(answerStatus === 'CORRECT' ? 2 : -1);
                      }}
                      className="px-10 py-4 sm:px-12 sm:py-5 bg-gradient-to-r from-yellow-400 to-star-gold hover:brightness-110 text-bg-dark rounded-full text-lg sm:text-2xl font-black uppercase tracking-widest transition-all shadow-2xl border-b-8 border-yellow-700 active:border-b-0 active:translate-y-2 cursor-pointer"
                    >
                      KEMBALI KE PAPAN 🚀
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    );
  };

  const renderRecapView = () => {
    if (!session) return null;

    // Leaderboard ranking calculation
    const rankedGroups = [...session.groups].sort((a, b) => b.stars - a.stars);

    return (
      <div className="min-h-screen bg-[#060B1E] relative flex flex-col items-center justify-center p-4 sm:p-8 text-center overflow-hidden">
        {/* Animated ambient backdrop grids and radial lights */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.15),transparent_60%)] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <DisasterAnimations />
        
        <SiCilik 
          message={finalWinner 
            ? `Hore! Selamat untuk Kelompok ${finalWinner.name}! Kalian luar biasa!` 
            : "Hore! Kita semua sekarang adalah Sahabat Bumi Hebat! Sampai jumpa lagi!"
          } 
          mood="HAPPY" 
          position="top-right" 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          className="bg-[#0A122C]/90 backdrop-blur-xl p-8 sm:p-12 md:p-16 rounded-[48px] border-4 border-yellow-400/40 shadow-[0_0_80px_rgba(251,191,36,0.3)] w-full max-w-4xl relative z-10 my-8"
          id="winner-certificate-card"
        >
          {/* Sparkly Floating Trophy Corner Decoration */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2">
            <div className="relative w-40 h-40 sm:w-48 sm:h-48">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-yellow-400/20 rounded-full blur-2xl scale-125"
              />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 flex items-center justify-center w-full h-full"
              >
                <Trophy className="w-32 h-32 sm:w-40 sm:h-40 text-yellow-400 drop-shadow-[0_0_25px_rgba(251,191,36,0.8)]" />
              </motion.div>
              <Sparkle count={16} />
            </div>
          </div>

          <div className="mt-16 sm:mt-24">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-yellow-400 font-extrabold uppercase tracking-[0.25em] text-sm sm:text-base md:text-lg mb-1"
            >
              🎉 SERTIFIKAT KELULUSAN SIGAP BENCANA 🎉
            </motion.p>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter uppercase mb-6 leading-none">
              JURU SELAMAT BUMI!
            </h1>
            
            {/* Winning Group Display */}
            {finalWinner && (
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 10, delay: 0.4 }}
                className="mb-8 w-full max-w-lg mx-auto"
              >
                <div className="bg-gradient-to-r from-yellow-400 via-amber-200 to-yellow-400 p-1.5 rounded-3xl shadow-[0_0_40px_rgba(251,191,36,0.35)] hover:shadow-[0_0_60px_rgba(251,191,36,0.5)] transition-all">
                  <div className="bg-[#060B1E] px-8 py-5 rounded-[22px] flex flex-col items-center gap-1">
                    <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-yellow-400/80">REKOR JUARA 1</span>
                    <span className="text-3xl sm:text-4xl md:text-5xl font-black text-yellow-300 uppercase tracking-wide drop-shadow-[0_2px_10px_rgba(251,191,36,0.2)]">
                      {finalWinner.name} 🏆
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Sahabat Bumi Ceremonial Visual */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", delay: 0.6 }}
              className="bg-emerald-950/40 border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto mb-10 flex flex-col md:flex-row items-center gap-6 text-left"
            >
              {/* Badge visual */}
              <div className="relative shrink-0 w-24 h-24 rounded-full bg-emerald-500/10 border-4 border-emerald-400 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Award className="w-12 h-12 text-emerald-400" />
                </motion.div>
                {/* Micro mini earth decorative icon */}
                <span className="absolute -bottom-2 -right-2 text-3xl animate-spin" style={{ animationDuration: '20s' }}>🌍</span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-emerald-400 uppercase tracking-wide flex items-center gap-2">
                  <span>RESMI MENJADI SAHABAT BUMI</span>
                  <span className="text-xl">🌿✨</span>
                </h3>
                <p className="text-sm sm:text-base text-emerald-100/90 font-bold mt-2 leading-relaxed">
                  Luar biasa! Melalui keberanian, pengetahuan, dan kerjasama tim yang hebat, kelompok ini berhasil menuntaskan semua tantangan kebencanaan. Mereka kini siap menjaga alam dan menyelamatkan sesama!
                </p>
              </div>
            </motion.div>

            <div className="text-yellow-400/60 font-black text-xs sm:text-sm uppercase tracking-[0.3em] mb-8">
              SEKOLAH / KELAS: <span className="text-white font-extrabold">{session.className}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-10">
              {/* Box 1: Core Performance Stars */}
              <div className="bg-white/5 p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col items-center justify-center">
                <span className="text-blue-400/70 font-extrabold uppercase tracking-widest text-xs mb-3">TOTAL BINTANG TIM</span>
                <div className="flex items-center gap-3">
                  <Star className="w-14 h-14 text-yellow-400 fill-yellow-400 animate-pulse" />
                  <span className="text-6xl sm:text-7xl font-black text-white leading-none">
                    {finalWinner ? finalWinner.stars : session.totalStars}
                  </span>
                </div>
              </div>
              
              {/* Box 2: Leaderboard Scoreboard list */}
              <div className="bg-[#050A19] p-6 sm:p-8 rounded-3xl border border-white/10 text-left">
                 <h3 className="text-blue-400/80 font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                   <span>📊 KEDUDUKAN REGU</span>
                   <span className="h-px bg-blue-500/20 flex-1" />
                 </h3>
                 <div className="space-y-3">
                   {rankedGroups.map((group, i) => {
                     // Determine placement medal
                     let medal = '🏅';
                     let medalColorClass = 'text-slate-400 bg-white/5 border-white/10';
                     if (i === 0) {
                       medal = '🥇';
                       medalColorClass = 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
                     } else if (i === 1) {
                       medal = '🥈';
                       medalColorClass = 'text-slate-300 bg-slate-300/10 border-slate-300/30';
                     } else if (i === 2) {
                       medal = '🥉';
                       medalColorClass = 'text-amber-600 bg-amber-600/10 border-amber-600/30';
                     }

                     const isWinner = group.id === finalWinner?.id;

                     return (
                       <div 
                         key={group.id} 
                         className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                           isWinner 
                             ? 'bg-gradient-to-r from-yellow-500/15 to-transparent border-yellow-400/40 shadow-md shadow-yellow-500/5' 
                             : 'bg-white/5 border-transparent'
                         }`}
                       >
                         <div className="flex items-center gap-3">
                           <span className={`w-10 h-10 rounded-xl border flex items-center justify-center font-black text-lg ${medalColorClass}`}>
                             {medal}
                           </span>
                           <span className={`text-lg sm:text-xl font-extrabold ${isWinner ? 'text-yellow-300' : 'text-white'}`}>
                             {group.name}
                           </span>
                         </div>
                         <div className="flex items-center gap-1.5">
                           <Star size={18} className="text-yellow-400 fill-yellow-400" />
                           <span className="text-xl sm:text-2xl font-black text-white">{group.stars}</span>
                         </div>
                       </div>
                     );
                   })}
                 </div>
              </div>
            </div>

            {/* CTA action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
               <button 
                 onClick={() => {
                   setFinalWinner(null);
                   setView('HOME');
                 }}
                 className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-white text-xl sm:text-2xl font-black rounded-2xl border-2 border-white/10 transition-all uppercase shadow-md active:scale-98"
               >
                 MAIN LAGI 🔄
               </button>
               <button 
                  onClick={() => window.location.reload()}
                  className="flex-1 py-5 bg-gradient-to-r from-yellow-400 to-amber-500 text-[#0c142c] text-xl sm:text-2xl font-black rounded-2xl shadow-xl hover:brightness-110 active:translate-y-1 active:border-b-0 transition-all uppercase border-b-4 border-amber-700"
               >
                 SELESAI 👋
               </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  // --- Main Render ---

  return (
    <div 
      onClick={startAudio}
      className={`min-h-screen selection:bg-blue-500 selection:text-white transition-colors duration-500 ${
        theme === 'light' 
        ? 'bg-gradient-to-br from-sky-100 via-blue-50 to-sky-100 text-slate-800' 
        : 'bg-[#040A1E] text-white'
      }`}
    >
      <AnimatePresence mode="wait">
        {view === 'HOME' && <div key="home">{renderHomeView()}</div>}
        {view === 'SETUP' && <div key="setup">{renderSetupView()}</div>}
        {view === 'BOARD' && <div key="board">{renderBoardView()}</div>}
        {view === 'QUIZ' && <div key="quiz">{renderQuizView()}</div>}
        {view === 'RECAP' && <div key="recap">{renderRecapView()}</div>}
      </AnimatePresence>

      <AnimatePresence>
        {infoModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="bg-[#0C142B] border-4 border-blue-500/30 rounded-[40px] p-8 max-w-md w-full text-center relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500" />
              <div className="text-6xl mb-6 filter drop-shadow-md">{infoModal.icon}</div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-4">{infoModal.title}</h3>
              <p className="text-lg text-blue-100/80 font-bold mb-8 leading-relaxed">
                {infoModal.message}
              </p>
              <button
                onClick={() => setInfoModal(null)}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xl font-black uppercase tracking-wider transition-all shadow-lg active:scale-95 border-b-4 border-blue-900"
              >
                OK, SIAP! 👍
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global CSS for board */}
      <style dangerouslySetInnerHTML={{ __html: `
        #reader { display: none !important; }
      `}} />
    </div>
  );
}

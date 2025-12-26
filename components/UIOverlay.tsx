
import React from 'react';
import { CardTheme, CyberWish } from '../types';

interface UIOverlayProps {
  theme: CardTheme;
  wish: CyberWish | null;
  loading: boolean;
  onNext: () => void;
  index: number;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ theme, wish, loading, onNext, index }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-between p-8 pointer-events-none select-none">
      {/* Top Header */}
      <div className="w-full flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="text-cyan-400 font-mono text-xs tracking-widest uppercase">
            System Protocol 2025 // Card 0{index + 1}
          </div>
          <div className="text-white text-2xl font-bold tracking-tighter uppercase cyber-text">
            {theme.name}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="bg-cyan-500/20 px-2 py-1 border border-cyan-500/50 rounded text-[10px] text-cyan-300 font-mono">
            LIVE_DATA_STREAM
          </div>
          <div className="text-white/40 font-mono text-xs">
            COORD: {Math.floor(Math.random() * 1000)} / {Math.floor(Math.random() * 1000)}
          </div>
        </div>
      </div>

      {/* Center Character (Invisible but helps with layout) */}
      <div className="h-64 pointer-events-none"></div>

      {/* Bottom Content */}
      <div className="w-full max-w-2xl flex flex-col items-center text-center gap-6">
        <div className="space-y-2 pointer-events-auto">
          <h2 className="text-3xl md:text-5xl font-black text-white cyber-text italic uppercase">
            {loading ? "Decrypting..." : (wish?.title || "Connecting to Metaverse...")}
          </h2>
          <p className="text-cyan-100/80 text-lg md:text-xl font-light tracking-wide max-w-xl mx-auto italic">
            {loading ? "Fetching neural data from Gemini servers..." : (wish?.content || theme.subText)}
          </p>
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="pointer-events-auto group relative px-8 py-3 bg-transparent overflow-hidden border border-cyan-500/50 transition-all hover:bg-cyan-500/10 active:scale-95"
        >
          <div className="absolute inset-0 w-1 bg-cyan-500 group-hover:w-full transition-all duration-300 opacity-20"></div>
          <span className="relative text-cyan-400 font-mono tracking-widest text-sm uppercase flex items-center gap-3">
            Switch Sequence <i className="fa-solid fa-arrow-right animate-pulse"></i>
          </span>
        </button>

        <div className="flex gap-2 items-center">
          {Array.from({ length: 10 }).map((_, i) => (
            <div 
              key={i} 
              className={`h-1 w-6 rounded-full transition-all duration-300 ${i === index ? 'bg-cyan-400 w-12 shadow-[0_0_8px_cyan]' : 'bg-white/10'}`}
            />
          ))}
        </div>
      </div>

      {/* Decorative Corners */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-cyan-500/30"></div>
      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-cyan-500/30"></div>
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-cyan-500/30"></div>
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-cyan-500/30"></div>
    </div>
  );
};

export default UIOverlay;

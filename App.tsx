
import React, { useState, useEffect, useCallback } from 'react';
import ParticleCanvas from './components/ParticleCanvas';
import UIOverlay from './components/UIOverlay';
import { CARD_THEMES } from './constants';
import { generateCyberWish } from './services/geminiService';
import { CyberWish } from './types';

const App: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWish, setCurrentWish] = useState<CyberWish | null>(null);
  const [loading, setLoading] = useState(false);

  const activeTheme = CARD_THEMES[currentIndex] || CARD_THEMES[0];

  const fetchWish = useCallback(async (index: number) => {
    setLoading(true);
    try {
      const theme = CARD_THEMES[index];
      const wish = await generateCyberWish(theme.prompt);
      setCurrentWish(wish);
    } catch (err) {
      console.error("Failed to fetch wish", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % CARD_THEMES.length);
  }, []);

  useEffect(() => {
    fetchWish(currentIndex);
  }, [currentIndex, fetchWish]);

  return (
    <div 
      className="relative w-screen h-screen bg-[#050505] overflow-hidden select-none"
      onClick={() => handleNext()}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/20 via-transparent to-red-950/20 z-0"></div>
      
      {/* Particle Engine */}
      <ParticleCanvas theme={activeTheme} />

      {/* UI Controls and Text */}
      <UIOverlay 
        theme={activeTheme} 
        wish={currentWish} 
        loading={loading} 
        onNext={handleNext}
        index={currentIndex}
      />

      {/* Floating Ambient Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {Array.from({ length: 15 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-cyan-500/5 blur-3xl animate-pulse"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 15 + 10}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default App;

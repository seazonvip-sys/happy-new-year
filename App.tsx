
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

  const activeTheme = CARD_THEMES[currentIndex];

  const fetchWish = useCallback(async (index: number) => {
    setLoading(true);
    const theme = CARD_THEMES[index];
    const wish = await generateCyberWish(theme.prompt);
    setCurrentWish(wish);
    setLoading(false);
  }, []);

  const handleNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % CARD_THEMES.length;
    setCurrentIndex(nextIndex);
  }, [currentIndex]);

  useEffect(() => {
    fetchWish(currentIndex);
  }, [currentIndex, fetchWish]);

  return (
    <div 
      className="relative w-screen h-screen bg-[#050505] overflow-hidden select-none"
      onClick={handleNext}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/20 via-transparent to-red-950/20"></div>
      
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

      {/* Floating Particles (Static overlay for extra depth) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-cyan-400/10 blur-xl animate-pulse"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default App;

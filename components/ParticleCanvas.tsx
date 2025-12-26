
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Particle, CardTheme } from '../types';

interface ParticleCanvasProps {
  theme: CardTheme;
}

const ParticleCanvas: React.FC<ParticleCanvasProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number>();
  const [isInitializing, setIsInitializing] = useState(true);

  const createParticles = useCallback((points: { x: number; y: number }[]) => {
    const count = points.length;
    const currentParticles = particles.current;
    
    // Adjust particle count to match points
    if (currentParticles.length < count) {
      for (let i = currentParticles.length; i < count; i++) {
        currentParticles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          targetX: 0,
          targetY: 0,
          vx: 0,
          vy: 0,
          size: Math.random() * 2 + 1,
          color: theme.color,
          alpha: Math.random() * 0.5 + 0.5,
        });
      }
    } else if (currentParticles.length > count) {
      particles.current = currentParticles.slice(0, count);
    }

    // Assign targets
    particles.current.forEach((p, i) => {
      p.targetX = points[i].x;
      p.targetY = points[i].y;
      p.color = theme.color;
    });
  }, [theme.color]);

  const getPointsFromText = (text: string) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return [];

    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const fontSize = text.length > 2 ? Math.min(width, height) * 0.3 : Math.min(width, height) * 0.5;
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';
    ctx.fillText(text, width / 2, height / 2);

    const imageData = ctx.getImageData(0, 0, width, height);
    const points = [];
    const step = Math.max(2, Math.floor(fontSize / 30)); // Density

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const index = (y * width + x) * 4;
        if (imageData.data[index + 3] > 128) {
          points.push({ x, y });
        }
      }
    }
    return points;
  };

  const update = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'rgba(5, 5, 5, 0.15)'; // Trail effect
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    particles.current.forEach((p) => {
      const dx = p.targetX - p.x;
      const dy = p.targetY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      const force = Math.min(dist * 0.05, 10);
      const angle = Math.atan2(dy, dx);
      
      p.vx += Math.cos(angle) * force;
      p.vy += Math.sin(angle) * force;
      
      p.vx *= 0.92; // Friction
      p.vy *= 0.92;
      
      p.x += p.vx;
      p.y += p.vy;

      // Subtle jitter
      p.x += (Math.random() - 0.5) * 0.5;
      p.y += (Math.random() - 0.5) * 0.5;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    });

    animationFrameId.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        const points = getPointsFromText(theme.char);
        createParticles(points);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    update();

    setIsInitializing(false);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [theme.char, createParticles]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 cursor-pointer"
      title="Click to change card"
    />
  );
};

export default ParticleCanvas;

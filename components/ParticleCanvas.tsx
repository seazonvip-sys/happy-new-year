
import React, { useRef, useEffect, useCallback } from 'react';
import { Particle, CardTheme } from '../types';

interface ParticleCanvasProps {
  theme: CardTheme;
}

const ParticleCanvas: React.FC<ParticleCanvasProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number>();

  const createParticles = useCallback((points: { x: number; y: number }[]) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Fallback: if no points found, create a random grid
    let finalPoints = points;
    if (points.length === 0) {
      for (let i = 0; i < 500; i++) {
        finalPoints.push({
          x: width * 0.2 + Math.random() * width * 0.6,
          y: height * 0.3 + Math.random() * height * 0.4
        });
      }
    }

    const count = finalPoints.length;
    const currentParticles = particles.current;
    
    if (currentParticles.length < count) {
      for (let i = currentParticles.length; i < count; i++) {
        currentParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          targetX: 0,
          targetY: 0,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          size: Math.random() * 1.5 + 1,
          color: theme.color,
          alpha: Math.random() * 0.5 + 0.5,
        });
      }
    } else if (currentParticles.length > count) {
      particles.current = currentParticles.slice(0, count);
    }

    particles.current.forEach((p, i) => {
      p.targetX = finalPoints[i].x;
      p.targetY = finalPoints[i].y;
      p.color = theme.color;
    });
  }, [theme.color]);

  const getPointsFromText = useCallback((text: string) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return [];

    const width = window.innerWidth || 800;
    const height = window.innerHeight || 600;
    canvas.width = width;
    canvas.height = height;

    // Ensure fontSize is at least something visible
    const baseSize = Math.min(width, height);
    const fontSize = text.length > 2 ? baseSize * 0.25 : baseSize * 0.4;
    
    ctx.font = `bold ${Math.floor(fontSize)}px "Microsoft YaHei", "PingFang SC", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';
    ctx.fillText(text, width / 2, height / 2);

    const imageData = ctx.getImageData(0, 0, width, height);
    const points = [];
    const step = Math.max(2, Math.floor(fontSize / 35));

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const index = (y * width + x) * 4;
        if (imageData.data[index + 3] > 128) {
          points.push({ x, y });
        }
      }
    }
    return points;
  }, []);

  const update = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'rgba(5, 5, 5, 0.2)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.current.forEach((p) => {
      const dx = p.targetX - p.x;
      const dy = p.targetY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      const force = Math.min(dist * 0.08, 15);
      const angle = Math.atan2(dy, dx);
      
      p.vx += Math.cos(angle) * force;
      p.vy += Math.sin(angle) * force;
      
      p.vx *= 0.88; // Slightly more friction for stability
      p.vy *= 0.88;
      
      p.x += p.vx;
      p.y += p.vy;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    });

    animationFrameId.current = requestAnimationFrame(update);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        canvasRef.current.width = w;
        canvasRef.current.height = h;
        const points = getPointsFromText(theme.char);
        createParticles(points);
      }
    };

    // Wait a bit for fonts to potentially load
    const timeoutId = setTimeout(handleResize, 100);
    window.addEventListener('resize', handleResize);
    
    update();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [theme.char, createParticles, getPointsFromText, update]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 block bg-[#050505]"
      style={{ touchAction: 'none' }}
    />
  );
};

export default ParticleCanvas;

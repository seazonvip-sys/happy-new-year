
export interface CardTheme {
  id: number;
  name: string;
  char: string;
  color: string;
  subText: string;
  prompt: string;
}

export interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

export interface CyberWish {
  title: string;
  content: string;
}

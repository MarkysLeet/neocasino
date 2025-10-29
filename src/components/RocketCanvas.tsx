import { useEffect, useRef } from 'react';
import { useGameStore } from '../stores/gameStore';
import { calculateMultiplier } from '../utils/multiplier';

interface Point {
  x: number;
  y: number;
}

const RocketCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const phase = useGameStore((state) => state.phase);
  const startTimestamp = useGameStore((state) => state.startTimestamp);
  const crashPoint = useGameStore((state) => state.crashPoint);
  const multiplier = useGameStore((state) => state.multiplier);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * ratio;
      canvas.height = canvas.clientHeight * ratio;
      ctx.scale(ratio, ratio);
    };

    resize();

    let animationFrame = 0;
    const trail: Point[] = [];

    const draw = () => {
      const { clientWidth: width, clientHeight: height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const now = performance.now();
      let progressMultiplier = multiplier;
      if (phase === 'inflight' && startTimestamp) {
        progressMultiplier = calculateMultiplier(now - startTimestamp);
      }

      const normalized = Math.min(progressMultiplier / (crashPoint * 1.1), 1);
      const rocketX = normalized * width;
      const rocketY = height - Math.pow(normalized, 1.5) * height * 0.92 - height * 0.08;

      trail.push({ x: rocketX, y: rocketY });
      while (trail.length > 400) trail.shift();

      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, 'rgba(0, 212, 255, 0.7)');
      gradient.addColorStop(1, 'rgba(169, 112, 255, 0.4)');

      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.strokeStyle = gradient;
      ctx.beginPath();
      trail.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();

      if (phase !== 'crashed') {
        const glowGradient = ctx.createRadialGradient(rocketX, rocketY, 0, rocketX, rocketY, 80);
        glowGradient.addColorStop(0, 'rgba(0, 212, 255, 0.9)');
        glowGradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
        ctx.fillStyle = glowGradient;
        ctx.fillRect(rocketX - 80, rocketY - 80, 160, 160);
      }

      ctx.save();
      ctx.translate(rocketX, rocketY);
      ctx.rotate(-Math.PI / 8 + normalized * 0.5);

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.lineTo(10, 12);
      ctx.lineTo(-10, 12);
      ctx.closePath();
      ctx.fill();

      const thrusterGradient = ctx.createLinearGradient(0, 12, 0, 32);
      thrusterGradient.addColorStop(0, 'rgba(169, 112, 255, 0.9)');
      thrusterGradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
      ctx.fillStyle = thrusterGradient;
      ctx.beginPath();
      ctx.moveTo(-6, 12);
      ctx.lineTo(6, 12);
      ctx.lineTo(0, 32 + Math.sin(now / 60) * 4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      animationFrame = requestAnimationFrame(draw);
    };

    animationFrame = requestAnimationFrame(draw);

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, [phase, startTimestamp, crashPoint, multiplier]);

  return <canvas ref={canvasRef} className="h-full w-full" />;
};

export default RocketCanvas;

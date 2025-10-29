import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
}

const STAR_COUNT = 160;

const BackgroundStars = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stars = useMemo<Star[]>(() => {
    const rng = Math.random;
    return Array.from({ length: STAR_COUNT }, () => ({
      x: rng(),
      y: rng(),
      size: 0.5 + rng() * 1.5,
      speed: 0.2 + rng() * 0.8
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame = 0;

    const render = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#FFFFFF';

      stars.forEach((star) => {
        const y = (star.y + (performance.now() / 1000) * (star.speed / 200)) % 1;
        const x = (star.x + Math.sin(y * Math.PI * 2) * 0.002) % 1;
        ctx.globalAlpha = 0.2 + star.size / 2;
        ctx.fillRect(x * width, y * height, star.size, star.size);
      });

      animationFrame = requestAnimationFrame(render);
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    render();

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, [stars]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
    />
  );
};

export default BackgroundStars;

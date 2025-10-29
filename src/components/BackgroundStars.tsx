import classNames from 'classnames';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
}

const STAR_COUNT = 160;

type BackgroundStarsMode = 'global' | 'section';

interface BackgroundStarsProps {
  className?: string;
  mode?: BackgroundStarsMode;
}

const BackgroundStars = ({ className, mode = 'global' }: BackgroundStarsProps) => {
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
    const parent = mode === 'section' ? canvas.parentElement : null;

    const resize = () => {
      if (mode === 'section' && parent) {
        const rect = parent.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    const render = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#FFFFFF';

      stars.forEach((star) => {
        const elapsed = performance.now() / 1000;
        const y = (star.y + elapsed * (star.speed / 200)) % 1;
        const x = (star.x + Math.sin(y * Math.PI * 2) * 0.002) % 1;
        ctx.globalAlpha = 0.2 + star.size / 2;
        ctx.fillRect(x * width, y * height, star.size, star.size);
      });

      animationFrame = requestAnimationFrame(render);
    };

    resize();
    render();

    const resizeObserver =
      mode === 'section' && parent
        ? new ResizeObserver(() => {
            resize();
          })
        : null;

    if (resizeObserver && parent) {
      resizeObserver.observe(parent);
    } else if (mode === 'global') {
      window.addEventListener('resize', resize);
    }

    return () => {
      cancelAnimationFrame(animationFrame);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', resize);
      }
    };
  }, [mode, stars]);

  return (
    <motion.canvas
      ref={canvasRef}
      className={classNames(
        mode === 'global'
          ? 'pointer-events-none fixed inset-0 z-0 opacity-70'
          : 'pointer-events-none absolute inset-0 z-0 opacity-70',
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
    />
  );
};

export default BackgroundStars;

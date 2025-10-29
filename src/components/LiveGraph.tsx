import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useBettingStore } from '../stores/bettingStore';
import { useGameStore } from '../stores/gameStore';

const MAX_POINTS = 240;

const LiveGraph = () => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const multiplier = useGameStore((state) => state.multiplier);
  const crashPoint = useGameStore((state) => state.crashPoint);
  const autoCashout = useBettingStore((state) => state.autoCashout);
  const autoCashoutEnabled = useBettingStore((state) => state.autoCashoutEnabled);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ratio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * ratio;
    canvas.height = canvas.clientHeight * ratio;
    ctx.scale(ratio, ratio);

    const points: number[] = [];

    let animationFrame = 0;
    const render = () => {
      points.push(multiplier);
      if (points.length > MAX_POINTS) points.shift();

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      ctx.clearRect(0, 0, width, height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.7)';
      ctx.beginPath();
      points.forEach((value, index) => {
        const x = (index / (MAX_POINTS - 1)) * width;
        const normalized = Math.log(value) / Math.log(Math.max(2, crashPoint + 1));
        const y = height - Math.min(1, normalized) * height;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      if (autoCashoutEnabled) {
        const autoY = height - (Math.log(autoCashout) / Math.log(Math.max(2, crashPoint + 1))) * height;
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(169, 112, 255, 0.6)';
        ctx.beginPath();
        ctx.moveTo(0, autoY);
        ctx.lineTo(width, autoY);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      animationFrame = requestAnimationFrame(render);
    };

    animationFrame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrame);
  }, [multiplier, crashPoint, autoCashout, autoCashoutEnabled]);

  return (
    <div className="glass-panel rounded-2xl border border-white/10 p-4">
      <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/50">
        <span>{t('graph.live')}</span>
        <span>
          {autoCashoutEnabled
            ? t('graph.autoCashout', { value: autoCashout.toFixed(2) })
            : t('graph.autoCashoutOff')}
        </span>
      </div>
      <canvas ref={canvasRef} className="h-24 w-full" />
    </div>
  );
};

export default LiveGraph;

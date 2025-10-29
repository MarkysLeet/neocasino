export const growthRate = 1.85;

export const calculateMultiplier = (elapsedMs: number, rate = growthRate) => {
  const t = Math.max(0, elapsedMs) / 1000;
  return Math.exp(rate * t);
};

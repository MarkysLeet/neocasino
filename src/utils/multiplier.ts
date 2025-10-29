export const growthRate = 0.35;

export const calculateMultiplier = (elapsedMs: number, rate = growthRate) => {
  const seconds = Math.max(0, elapsedMs) / 1000;
  const easedProgress = 1 - Math.exp(-seconds / 2);
  const effectiveTime = seconds * easedProgress;
  return Math.exp(rate * effectiveTime);
};

export interface RNGConfig {
  seed: string;
}

export type RNG = () => number;

const mulberry32 = (a: number): RNG => {
  return () => {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const hashString = (input: string): number => {
  let h = 1779033703 ^ input.length;
  for (let i = 0; i < input.length; i += 1) {
    h = Math.imul(h ^ input.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return (h ^ (h >>> 16)) >>> 0;
};

export const createRNG = (seed: string): RNG => {
  const hashedSeed = hashString(seed);
  return mulberry32(hashedSeed);
};

export const generateCrashPoint = (rng: RNG, min = 1.01, max = 10): number => {
  const value = -Math.log(1 - rng());
  const scaled = min + (max - min) * (1 - Math.exp(-value));
  return Math.max(min, Number(scaled.toFixed(2)));
};

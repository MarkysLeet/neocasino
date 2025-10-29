import { describe, expect, it } from 'vitest';
import { calculateMultiplier } from '../utils/multiplier';
import { createRNG, generateCrashPoint } from '../lib/rng';

describe('calculateMultiplier', () => {
  it('returns 1 at t=0', () => {
    expect(calculateMultiplier(0)).toBeCloseTo(1);
  });

  it('grows exponentially', () => {
    const later = calculateMultiplier(5000);
    const earlier = calculateMultiplier(1000);
    expect(later).toBeGreaterThan(earlier);
  });
});

describe('generateCrashPoint', () => {
  it('is deterministic for the same seed', () => {
    const rngA = createRNG('demo-seed');
    const rngB = createRNG('demo-seed');
    const first = generateCrashPoint(rngA);
    const second = generateCrashPoint(rngB);
    expect(first).toBeCloseTo(second, 5);
  });

  it('stays within expected bounds', () => {
    const rng = createRNG('bounds-seed');
    const value = generateCrashPoint(rng, 1.1, 4);
    expect(value).toBeGreaterThanOrEqual(1.1);
    expect(value).toBeLessThanOrEqual(4);
  });
});

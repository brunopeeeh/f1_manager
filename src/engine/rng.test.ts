import { describe, expect, it } from 'vitest';
import { createSeededRng } from './rng';

function collectSequence(seed: number, length: number): number[] {
  const rng = createSeededRng(seed);
  return Array.from({ length }, () => rng.next());
}

describe('createSeededRng', () => {
  it('produz a mesma sequência para a mesma seed', () => {
    expect(collectSequence(42, 100)).toEqual(collectSequence(42, 100));
  });

  it('produz sequências diferentes para seeds diferentes', () => {
    expect(collectSequence(42, 100)).not.toEqual(collectSequence(43, 100));
  });

  it('gera números sempre no intervalo [0, 1)', () => {
    const rng = createSeededRng(7);
    for (let i = 0; i < 1000; i++) {
      const value = rng.next();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('gera inteiros dentro dos limites pedidos, incluindo as bordas', () => {
    const rng = createSeededRng(7);
    const observed = new Set<number>();
    for (let i = 0; i < 1000; i++) {
      const value = rng.nextIntBetween(1, 6);
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(6);
      observed.add(value);
    }
    expect(observed).toEqual(new Set([1, 2, 3, 4, 5, 6]));
  });

  it('rejeita limites inválidos em nextIntBetween', () => {
    const rng = createSeededRng(1);
    expect(() => rng.nextIntBetween(5, 1)).toThrow();
    expect(() => rng.nextIntBetween(0.5, 2)).toThrow();
  });
});

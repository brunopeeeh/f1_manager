export interface SeededRng {
  /** Próximo número pseudoaleatório no intervalo [0, 1). */
  next(): number;
  /** Inteiro pseudoaleatório no intervalo [minInclusive, maxInclusive]. */
  nextIntBetween(minInclusive: number, maxInclusive: number): number;
}

/**
 * RNG determinístico baseado no algoritmo mulberry32.
 * A mesma seed produz sempre a mesma sequência.
 */
export function createSeededRng(seed: number): SeededRng {
  let state = seed >>> 0;

  function next(): number {
    state = (state + 0x6d2b79f5) >>> 0;
    let mixed = state;
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  }

  function nextIntBetween(minInclusive: number, maxInclusive: number): number {
    if (!Number.isInteger(minInclusive) || !Number.isInteger(maxInclusive)) {
      throw new Error('nextIntBetween exige limites inteiros');
    }
    if (minInclusive > maxInclusive) {
      throw new Error('nextIntBetween exige minInclusive <= maxInclusive');
    }
    const range = maxInclusive - minInclusive + 1;
    return minInclusive + Math.floor(next() * range);
  }

  return { next, nextIntBetween };
}

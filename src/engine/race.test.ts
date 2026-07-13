import { describe, expect, it } from 'vitest';
import { teamTiers } from '../data/teams';
import { createNewGameState } from './newGame';
import { computeCarFactor, simulateRace } from './race';
import type { Car, Circuit } from './types';

function raceState(currentRaceIndex = 0) {
  return { ...createNewGameState('aurora-velocita'), currentRaceIndex };
}

describe('simulateRace', () => {
  it('é determinística: mesma seed produz resultado idêntico', () => {
    const state = raceState();

    const first = simulateRace(state, 42);
    const second = simulateRace(state, 42);

    expect(second).toEqual(first);
  });

  it('é sensível à seed: a maioria de 20 seeds produz resultado diferente', () => {
    const state = raceState();

    const distinctResults = new Set<string>();
    for (let seed = 1; seed <= 20; seed++) {
      distinctResults.add(JSON.stringify(simulateRace(state, seed)));
    }

    expect(distinctResults.size).toBeGreaterThan(10);
  });

  it('não muta o GameState recebido', () => {
    const state = raceState();
    const snapshot = structuredClone(state);

    simulateRace(state, 7);

    expect(state).toEqual(snapshot);
  });

  it('classifica os 20 pilotos do grid com posições 1..20 em ordem de tempo', () => {
    const result = simulateRace(raceState(), 11);

    expect(result).toHaveLength(20);
    result.forEach((entry, index) => {
      expect(entry.position).toBe(index + 1);
      expect(entry.bestLapMs).toBeLessThanOrEqual(entry.totalTimeMs);
      if (index > 0) {
        expect(entry.totalTimeMs).toBeGreaterThanOrEqual(result[index - 1].totalTimeMs);
      }
    });
  });

  it('estatística em 200 seeds: ponta vence mais de 40% e fundo menos de 15%', () => {
    const state = raceState();
    const topTeams = new Set<string>(teamTiers.top);
    const backmarkerTeams = new Set<string>(teamTiers.backmarkers);

    let topWins = 0;
    let backmarkerWins = 0;
    const totalRuns = 200;
    for (let seed = 0; seed < totalRuns; seed++) {
      const winner = simulateRace(state, seed)[0];
      if (topTeams.has(winner.teamId)) {
        topWins++;
      }
      if (backmarkerTeams.has(winner.teamId)) {
        backmarkerWins++;
      }
    }

    expect(topWins / totalRuns).toBeGreaterThan(0.4);
    expect(backmarkerWins / totalRuns).toBeLessThan(0.15);
    expect(topWins).toBeGreaterThan(backmarkerWins);
  });

  it('variância de posição: em 30 seeds, um piloto do tier fundo chega ao top 5 ao menos uma vez', () => {
    const state = raceState();
    const backmarkerTeams = new Set<string>(teamTiers.backmarkers);

    let seedsWithBackmarkerInTop5 = 0;
    for (let seed = 1; seed <= 30; seed++) {
      const top5 = simulateRace(state, seed).slice(0, 5);
      if (top5.some((entry) => backmarkerTeams.has(entry.teamId))) {
        seedsWithBackmarkerInTop5++;
      }
    }

    expect(seedsWithBackmarkerInTop5).toBeGreaterThanOrEqual(1);
  });

  it('variância por piloto: a posição de um piloto de meio de grid varia entre 30 seeds', () => {
    const state = raceState();

    const positions = new Set<number>();
    for (let seed = 1; seed <= 30; seed++) {
      const midfielder = simulateRace(state, seed).find(
        (entry) => entry.driverId === 'niklas-sorensen',
      );
      if (midfielder) {
        positions.add(midfielder.position);
      }
    }

    expect(positions.size).toBeGreaterThan(1);
  });
});

describe('computeCarFactor', () => {
  const aeroStrongCar: Car = { aero: 90, power: 60, reliability: 80 };
  const powerStrongCar: Car = { aero: 60, power: 90, reliability: 80 };

  function circuitWithImportance(aeroImportance: number): Circuit {
    return {
      id: 'circuito-teste',
      name: 'Circuito Teste',
      country: 'Teste',
      laps: 50,
      baseLapTimeMs: 80000,
      aeroImportance,
      powerImportance: 1 - aeroImportance,
      overtakingDifficulty: 50,
    };
  }

  it('circuito de aeroImportance alta favorece o carro com aero mais forte', () => {
    const aeroCircuit = circuitWithImportance(0.7);

    expect(computeCarFactor(aeroStrongCar, aeroCircuit)).toBeGreaterThan(
      computeCarFactor(powerStrongCar, aeroCircuit),
    );
  });

  it('circuito de powerImportance alta inverte a vantagem', () => {
    const powerCircuit = circuitWithImportance(0.3);

    expect(computeCarFactor(powerStrongCar, powerCircuit)).toBeGreaterThan(
      computeCarFactor(aeroStrongCar, powerCircuit),
    );
  });

  it('quanto maior a aeroImportance, maior a vantagem do carro de aero forte', () => {
    const advantageAt = (aeroImportance: number) =>
      computeCarFactor(aeroStrongCar, circuitWithImportance(aeroImportance)) -
      computeCarFactor(powerStrongCar, circuitWithImportance(aeroImportance));

    expect(advantageAt(0.7)).toBeGreaterThan(advantageAt(0.55));
    expect(advantageAt(0.55)).toBeGreaterThan(advantageAt(0.5));
  });
});

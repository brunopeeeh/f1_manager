import { seedCircuits } from '../data/circuits';
import { createSeededRng } from './rng';
import type { Car, Circuit, Driver, GameState } from './types';

export interface RaceResultEntry {
  position: number;
  driverId: string;
  teamId: string;
  totalTimeMs: number;
  bestLapMs: number;
}

export type RaceResult = RaceResultEntry[];

const CAR_WEIGHT = 0.6;
const DRIVER_WEIGHT = 0.4;
const SLOWEST_MULTIPLIER = 1.15;
const MAX_PERFORMANCE_GAIN = 0.15;
/** Variação máxima por volta, em ms, para um piloto hipotético de consistency 0. */
const LAP_VARIATION_RANGE_MS = 2000;

export function computeCarFactor(car: Car, circuit: Circuit): number {
  return (car.aero * circuit.aeroImportance + car.power * circuit.powerImportance) / 100;
}

export function computePerformance(car: Car, driver: Driver, circuit: Circuit): number {
  const carFactor = computeCarFactor(car, circuit);
  const driverFactor = driver.pace / 100;
  return carFactor * CAR_WEIGHT + driverFactor * DRIVER_WEIGHT;
}

export function computeBaseLapTimeMs(car: Car, driver: Driver, circuit: Circuit): number {
  const performance = computePerformance(car, driver, circuit);
  return circuit.baseLapTimeMs * (SLOWEST_MULTIPLIER - performance * MAX_PERFORMANCE_GAIN);
}

export function simulateRace(state: GameState, seed: number): RaceResult {
  const circuitId = state.season.calendar[state.currentRaceIndex];
  const circuit = seedCircuits.find((candidate) => candidate.id === circuitId);
  if (!circuit) {
    throw new Error(`Circuito desconhecido no calendário: ${circuitId}`);
  }

  const rng = createSeededRng(seed);

  const timedEntries = state.teams.flatMap((team) =>
    team.driverIds.map((driverId) => {
      const driver = state.drivers.find((candidate) => candidate.id === driverId);
      if (!driver) {
        throw new Error(`Piloto desconhecido na equipe ${team.id}: ${driverId}`);
      }

      const baseLapTimeMs = computeBaseLapTimeMs(team.car, driver, circuit);
      const maxVariationMs = LAP_VARIATION_RANGE_MS * ((100 - driver.consistency) / 100);

      let totalTimeMs = 0;
      let bestLapMs = Number.POSITIVE_INFINITY;
      for (let lap = 0; lap < circuit.laps; lap++) {
        const variationMs = (rng.next() * 2 - 1) * maxVariationMs;
        const lapTimeMs = baseLapTimeMs + variationMs;
        totalTimeMs += lapTimeMs;
        bestLapMs = Math.min(bestLapMs, lapTimeMs);
      }

      return { driverId: driver.id, teamId: team.id, totalTimeMs, bestLapMs };
    }),
  );

  return timedEntries
    .sort((a, b) => a.totalTimeMs - b.totalTimeMs)
    .map((entry, index) => ({ ...entry, position: index + 1 }));
}

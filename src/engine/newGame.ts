import { seedCircuits } from '../data/circuits';
import { seedDrivers } from '../data/drivers';
import { seedTeams } from '../data/teams';
import type { GameState } from './types';

export const SAVE_FORMAT_VERSION = '1';

export const FIRST_SEASON_YEAR = 2026;

export function createNewGameState(playerTeamId: string): GameState {
  const playerTeamExists = seedTeams.some((team) => team.id === playerTeamId);
  if (!playerTeamExists) {
    throw new Error(`Equipe desconhecida: ${playerTeamId}`);
  }

  return {
    season: {
      year: FIRST_SEASON_YEAR,
      calendar: seedCircuits.map((circuit) => circuit.id),
    },
    currentRaceIndex: 0,
    playerTeamId,
    teams: structuredClone(seedTeams),
    drivers: structuredClone(seedDrivers),
    version: SAVE_FORMAT_VERSION,
  };
}

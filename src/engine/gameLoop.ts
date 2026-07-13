import type { GameState } from './types';

export type AdvanceResult =
  | { status: 'advanced'; state: GameState }
  | { status: 'season-finished'; state: GameState };

/**
 * Avança para a próxima corrida do calendário. Na última corrida retorna
 * o estado inalterado com status 'season-finished' — a virada de temporada
 * é escopo futuro.
 */
export function advanceToNextRace(state: GameState): AdvanceResult {
  const lastRaceIndex = state.season.calendar.length - 1;
  if (state.currentRaceIndex >= lastRaceIndex) {
    return { status: 'season-finished', state };
  }
  return {
    status: 'advanced',
    state: { ...state, currentRaceIndex: state.currentRaceIndex + 1 },
  };
}

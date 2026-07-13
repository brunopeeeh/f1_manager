import { describe, expect, it } from 'vitest';
import { advanceToNextRace } from './gameLoop';
import { createNewGameState } from './newGame';

describe('advanceToNextRace', () => {
  it('avança do índice 0 ao 11, uma corrida por vez', () => {
    let state = createNewGameState('aurora-velocita');

    for (let expectedIndex = 1; expectedIndex <= 11; expectedIndex++) {
      const result = advanceToNextRace(state);
      expect(result.status).toBe('advanced');
      state = result.state;
      expect(state.currentRaceIndex).toBe(expectedIndex);
    }
  });

  it('não passa do fim: na última corrida retorna season-finished com estado inalterado', () => {
    let state = createNewGameState('aurora-velocita');
    for (let i = 0; i < 11; i++) {
      state = advanceToNextRace(state).state;
    }
    expect(state.currentRaceIndex).toBe(11);

    const result = advanceToNextRace(state);
    expect(result.status).toBe('season-finished');
    expect(result.state).toBe(state);
    expect(result.state.currentRaceIndex).toBe(11);
  });

  it('não muta o estado original ao avançar', () => {
    const initial = createNewGameState('titan-apex');
    advanceToNextRace(initial);
    expect(initial.currentRaceIndex).toBe(0);
  });
});

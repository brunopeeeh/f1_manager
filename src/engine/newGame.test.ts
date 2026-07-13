import { describe, expect, it } from 'vitest';
import { seedTeams } from '../data/teams';
import { createNewGameState, FIRST_SEASON_YEAR, SAVE_FORMAT_VERSION } from './newGame';

describe('createNewGameState', () => {
  it('monta estado inicial válido com currentRaceIndex = 0 e version preenchida', () => {
    const state = createNewGameState('falco-corse');

    expect(state.currentRaceIndex).toBe(0);
    expect(state.version).toBe(SAVE_FORMAT_VERSION);
    expect(state.version.length).toBeGreaterThan(0);
    expect(state.playerTeamId).toBe('falco-corse');
    expect(state.season.year).toBe(FIRST_SEASON_YEAR);
    expect(state.season.calendar).toHaveLength(12);
    expect(state.teams).toHaveLength(10);
    expect(state.drivers).toHaveLength(20);
  });

  it('o calendário referencia apenas circuitos existentes, na ordem do seed', () => {
    const state = createNewGameState('aurora-velocita');
    expect(state.season.calendar[0]).toBe('costa-do-sol');
    expect(new Set(state.season.calendar).size).toBe(12);
  });

  it('rejeita playerTeamId desconhecido', () => {
    expect(() => createNewGameState('equipe-inexistente')).toThrow('equipe-inexistente');
  });

  it('retorna cópias independentes: mutar o estado não afeta o seed data', () => {
    const state = createNewGameState('lumen-gp');
    const seedBudget = seedTeams[0].budget;

    state.teams[0].budget = 0;

    expect(seedTeams[0].budget).toBe(seedBudget);
  });
});

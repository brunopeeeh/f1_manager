import { describe, expect, it } from 'vitest';
import { createNewGameState } from '../engine/newGame';
import { serializeGameState } from '../engine/persistence';
import { createGameStore, SAVE_STORAGE_KEY, type SaveStorage } from './store';

function createFakeStorage(initialSave?: string): SaveStorage {
  const data = new Map<string, string>();
  if (initialSave !== undefined) {
    data.set(SAVE_STORAGE_KEY, initialSave);
  }
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
  };
}

describe('game store', () => {
  it('newGame salva automaticamente no storage', () => {
    const storage = createFakeStorage();
    const store = createGameStore(storage);

    store.getState().newGame('boreal-racing');

    expect(storage.getItem(SAVE_STORAGE_KEY)).not.toBeNull();
    expect(store.getState().gameState?.playerTeamId).toBe('boreal-racing');
  });

  it('recriar o store recupera o mesmo estado salvo', () => {
    const storage = createFakeStorage();
    createGameStore(storage).getState().newGame('vulcan-dynamics');

    const recreatedStore = createGameStore(storage);
    const recovery = recreatedStore.getState().saveRecovery;

    expect(recovery.kind).toBe('available');
    recreatedStore.getState().continueGame();
    expect(recreatedStore.getState().gameState).toEqual(
      createNewGameState('vulcan-dynamics'),
    );
  });

  it('advance persiste o novo índice de corrida', () => {
    const storage = createFakeStorage();
    const store = createGameStore(storage);
    store.getState().newGame('pampa-racing');

    store.getState().advance();
    store.getState().advance();

    const recreatedStore = createGameStore(storage);
    recreatedStore.getState().continueGame();
    expect(recreatedStore.getState().gameState?.currentRaceIndex).toBe(2);
  });

  it('sem save: saveRecovery é none', () => {
    const store = createGameStore(createFakeStorage());
    expect(store.getState().saveRecovery).toEqual({ kind: 'none' });
  });

  it('save corrompido: saveRecovery informa o motivo', () => {
    const store = createGameStore(createFakeStorage('{quebrado'));
    expect(store.getState().saveRecovery).toEqual({ kind: 'invalid', reason: 'corrompido' });
  });

  it('save de versão incompatível: saveRecovery informa o motivo', () => {
    const save = JSON.parse(serializeGameState(createNewGameState('lumen-gp'))) as Record<
      string,
      unknown
    >;
    save.version = '999';
    const store = createGameStore(createFakeStorage(JSON.stringify(save)));

    expect(store.getState().saveRecovery).toEqual({
      kind: 'invalid',
      reason: 'versao-incompativel',
    });
  });

  it('advance na última corrida não altera nem re-salva o estado', () => {
    const storage = createFakeStorage();
    const store = createGameStore(storage);
    store.getState().newGame('titan-apex');
    for (let i = 0; i < 11; i++) {
      store.getState().advance();
    }
    expect(store.getState().gameState?.currentRaceIndex).toBe(11);
    const savedAtEnd = storage.getItem(SAVE_STORAGE_KEY);

    store.getState().advance();

    expect(store.getState().gameState?.currentRaceIndex).toBe(11);
    expect(storage.getItem(SAVE_STORAGE_KEY)).toBe(savedAtEnd);
  });
});

import { useStore } from 'zustand';
import { createStore, type StoreApi } from 'zustand/vanilla';
import { advanceToNextRace } from '../engine/gameLoop';
import { createNewGameState } from '../engine/newGame';
import {
  deserializeGameState,
  serializeGameState,
  type DeserializeFailureReason,
} from '../engine/persistence';
import type { GameState } from '../engine/types';

export const SAVE_STORAGE_KEY = 'f1-manager-web:save';

export type SaveStorage = Pick<Storage, 'getItem' | 'setItem'>;

export type SaveRecovery =
  | { kind: 'none' }
  | { kind: 'available'; state: GameState }
  | { kind: 'invalid'; reason: DeserializeFailureReason };

export interface GameStore {
  gameState: GameState | null;
  saveRecovery: SaveRecovery;
  newGame: (teamId: string) => void;
  continueGame: () => void;
  advance: () => void;
}

function readSaveRecovery(storage: SaveStorage): SaveRecovery {
  const raw = storage.getItem(SAVE_STORAGE_KEY);
  if (raw === null) {
    return { kind: 'none' };
  }
  const result = deserializeGameState(raw);
  if (result.ok) {
    return { kind: 'available', state: result.state };
  }
  return { kind: 'invalid', reason: result.reason };
}

export function createGameStore(storage: SaveStorage): StoreApi<GameStore> {
  return createStore<GameStore>((set, get) => {
    function setStateAndAutosave(gameState: GameState): void {
      storage.setItem(SAVE_STORAGE_KEY, serializeGameState(gameState));
      set({ gameState });
    }

    return {
      gameState: null,
      saveRecovery: readSaveRecovery(storage),
      newGame: (teamId) => {
        setStateAndAutosave(createNewGameState(teamId));
      },
      continueGame: () => {
        const recovery = get().saveRecovery;
        if (recovery.kind === 'available') {
          set({ gameState: recovery.state });
        }
      },
      advance: () => {
        const current = get().gameState;
        if (current === null) {
          return;
        }
        const result = advanceToNextRace(current);
        if (result.status === 'advanced') {
          setStateAndAutosave(result.state);
        }
      },
    };
  });
}

const gameStore = createGameStore(window.localStorage);

export function useGameStore<T>(selector: (store: GameStore) => T): T {
  return useStore(gameStore, selector);
}

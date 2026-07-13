import { SAVE_FORMAT_VERSION } from './newGame';
import type { GameState } from './types';

export type DeserializeFailureReason = 'corrompido' | 'versao-incompativel';

export type DeserializeResult =
  | { ok: true; state: GameState }
  | { ok: false; reason: DeserializeFailureReason };

export function serializeGameState(state: GameState): string {
  return JSON.stringify(state);
}

export function deserializeGameState(raw: string): DeserializeResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, reason: 'corrompido' };
  }

  if (!isRecord(parsed) || typeof parsed.version !== 'string') {
    return { ok: false, reason: 'corrompido' };
  }
  if (parsed.version !== SAVE_FORMAT_VERSION) {
    return { ok: false, reason: 'versao-incompativel' };
  }
  if (!hasGameStateShape(parsed)) {
    return { ok: false, reason: 'corrompido' };
  }

  return { ok: true, state: parsed };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function hasGameStateShape(value: Record<string, unknown>): value is Record<string, unknown> &
  GameState {
  return (
    isRecord(value.season) &&
    typeof value.season.year === 'number' &&
    Array.isArray(value.season.calendar) &&
    typeof value.currentRaceIndex === 'number' &&
    typeof value.playerTeamId === 'string' &&
    Array.isArray(value.teams) &&
    Array.isArray(value.drivers)
  );
}

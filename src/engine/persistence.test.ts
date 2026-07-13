import { describe, expect, it } from 'vitest';
import { createNewGameState } from './newGame';
import { deserializeGameState, serializeGameState } from './persistence';

describe('serializeGameState / deserializeGameState', () => {
  it('round-trip reconstrói estado idêntico', () => {
    const original = createNewGameState('cobalt-meridian');

    const result = deserializeGameState(serializeGameState(original));

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.state).toEqual(original);
    }
  });

  it('rejeita JSON corrompido com motivo "corrompido"', () => {
    for (const raw of ['{não é json', '', '42', '"string"', 'null', '{"version":"1"}']) {
      const result = deserializeGameState(raw);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.reason).toBe('corrompido');
      }
    }
  });

  it('rejeita version diferente com motivo "versao-incompativel"', () => {
    const save = JSON.parse(serializeGameState(createNewGameState('lumen-gp'))) as Record<
      string,
      unknown
    >;
    save.version = '999';

    const result = deserializeGameState(JSON.stringify(save));

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe('versao-incompativel');
    }
  });

  it('rejeita save sem campo version como corrompido', () => {
    const save = JSON.parse(serializeGameState(createNewGameState('lumen-gp'))) as Record<
      string,
      unknown
    >;
    delete save.version;

    const result = deserializeGameState(JSON.stringify(save));

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe('corrompido');
    }
  });
});

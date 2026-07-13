import { describe, expect, it } from 'vitest';
import { gameInfo } from './gameInfo';

describe('gameInfo', () => {
  it('tem nome definido e versão em formato semver', () => {
    expect(gameInfo.name).toBe('F1 Manager Web');
    expect(gameInfo.version).toMatch(/^\d+\.\d+\.\d+$/);
  });
});

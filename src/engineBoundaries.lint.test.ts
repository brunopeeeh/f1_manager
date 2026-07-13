import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';
import violationFixture from './engineBoundaryViolation.fixture.ts.txt?raw';

const LINT_TIMEOUT_MS = 60_000;
const eslint = new ESLint();

async function lintFixtureAs(virtualFilePath: string) {
  const [result] = await eslint.lintText(violationFixture, { filePath: virtualFilePath });
  return result;
}

describe('fronteiras da engine no ESLint', () => {
  it(
    'rejeita window, localStorage e imports de UI/Zustand em arquivos de src/engine',
    { timeout: LINT_TIMEOUT_MS },
    async () => {
      const result = await lintFixtureAs('src/engine/engineBoundaryViolation.fixture.ts');

      const globalViolations = result.messages.filter(
        (message) => message.ruleId === 'no-restricted-globals',
      );
      const importViolations = result.messages.filter(
        (message) => message.ruleId === 'no-restricted-imports',
      );

      const flaggedGlobals = globalViolations.map((message) => message.message).join('\n');
      expect(flaggedGlobals).toContain('window');
      expect(flaggedGlobals).toContain('localStorage');
      expect(flaggedGlobals).toContain('sessionStorage');
      expect(flaggedGlobals).toContain('DOM');

      expect(importViolations.length).toBeGreaterThanOrEqual(2);
      const flaggedImports = importViolations.map((message) => message.message).join('\n');
      expect(flaggedImports).toContain("'zustand/vanilla'");
      expect(flaggedImports).toContain("'../ui/store'");
    },
  );

  it(
    'as restrições valem só para a engine: o mesmo código em src/ui não dispara essas regras',
    { timeout: LINT_TIMEOUT_MS },
    async () => {
      const result = await lintFixtureAs('src/ui/engineBoundaryViolation.fixture.ts');

      const restrictedRuleIds = result.messages
        .map((message) => message.ruleId)
        .filter(
          (ruleId) => ruleId === 'no-restricted-globals' || ruleId === 'no-restricted-imports',
        );
      expect(restrictedRuleIds).toEqual([]);
    },
  );

  it('os arquivos reais da engine passam no lint', { timeout: LINT_TIMEOUT_MS }, async () => {
    const results = await eslint.lintFiles(['src/engine/**/*.ts']);

    expect(results.length).toBeGreaterThan(0);
    for (const result of results) {
      expect(result.messages).toEqual([]);
    }
  });
});

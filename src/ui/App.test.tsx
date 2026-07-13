import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createNewGameState } from '../engine/newGame';
import { serializeGameState } from '../engine/persistence';

const SAVE_STORAGE_KEY = 'f1-manager-web:save';

async function renderFreshApp() {
  vi.resetModules();
  const { App } = await import('./App');
  render(<App />);
}

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('sem save: mostra título, versão e apenas "Novo jogo"', async () => {
    await renderFreshApp();

    expect(screen.getByRole('heading', { name: 'F1 Manager Web' })).toBeDefined();
    expect(screen.getByText('v0.1.0')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Novo jogo' })).toBeDefined();
    expect(screen.queryByRole('button', { name: 'Continuar' })).toBeNull();
  });

  it('novo jogo: lista as 10 equipes e escolher uma leva ao hub', async () => {
    await renderFreshApp();

    fireEvent.click(screen.getByRole('button', { name: 'Novo jogo' }));
    expect(screen.getAllByRole('button', { name: 'Escolher' })).toHaveLength(10);
    expect(screen.getByText(/Aurora Velocità/)).toBeDefined();

    fireEvent.click(screen.getAllByRole('button', { name: 'Escolher' })[0]);
    expect(screen.getByRole('heading', { name: /Aurora Velocità/ })).toBeDefined();
    expect(screen.getByText(/próxima corrida/)).toBeDefined();
    expect(screen.getByRole('button', { name: 'Avançar' })).toBeDefined();
    expect(window.localStorage.getItem(SAVE_STORAGE_KEY)).not.toBeNull();
  });

  it('com save válido: "Continuar" volta para o hub no ponto salvo', async () => {
    const state = { ...createNewGameState('falco-corse'), currentRaceIndex: 2 };
    window.localStorage.setItem(SAVE_STORAGE_KEY, serializeGameState(state));

    await renderFreshApp();
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));

    expect(screen.getByRole('heading', { name: /Falco Corse/ })).toBeDefined();
    const nextRaceItem = screen.getByText(/próxima corrida/);
    expect(nextRaceItem.textContent).toContain('Greenwood Park');
  });

  it('save corrompido: avisa o jogador e oferece apenas novo jogo', async () => {
    window.localStorage.setItem(SAVE_STORAGE_KEY, '{quebrado');

    await renderFreshApp();

    expect(screen.getByRole('alert').textContent).toContain('corrompido');
    expect(screen.getByRole('button', { name: 'Novo jogo' })).toBeDefined();
    expect(screen.queryByRole('button', { name: 'Continuar' })).toBeNull();
  });

  it('save de versão incompatível: avisa o jogador e oferece apenas novo jogo', async () => {
    const save = JSON.parse(serializeGameState(createNewGameState('lumen-gp'))) as Record<
      string,
      unknown
    >;
    save.version = '999';
    window.localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(save));

    await renderFreshApp();

    expect(screen.getByRole('alert').textContent).toContain('versão incompatível');
    expect(screen.queryByRole('button', { name: 'Continuar' })).toBeNull();
  });

  it('na última corrida o botão Avançar fica desabilitado com aviso', async () => {
    const state = { ...createNewGameState('titan-apex'), currentRaceIndex: 11 };
    window.localStorage.setItem(SAVE_STORAGE_KEY, serializeGameState(state));

    await renderFreshApp();
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));

    const advanceButton = screen.getByRole('button', { name: 'Avançar' });
    expect(advanceButton).toHaveProperty('disabled', true);
    expect(screen.getByText('Fim da temporada — em breve')).toBeDefined();
  });
});

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('renderiza o título e a versão do jogo', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'F1 Manager Web' })).toBeDefined();
    expect(screen.getByText('v0.1.0')).toBeDefined();
  });
});

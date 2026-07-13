import { gameInfo } from '../data/gameInfo';
import { useGameStore } from './store';

const invalidSaveMessages = {
  corrompido: 'Seu save está corrompido e não pôde ser carregado.',
  'versao-incompativel': 'Seu save é de uma versão incompatível do jogo.',
} as const;

interface StartScreenProps {
  onNewGame: () => void;
}

export function StartScreen({ onNewGame }: StartScreenProps) {
  const saveRecovery = useGameStore((store) => store.saveRecovery);
  const continueGame = useGameStore((store) => store.continueGame);

  return (
    <main>
      <h1>{gameInfo.name}</h1>
      <p>v{gameInfo.version}</p>

      {saveRecovery.kind === 'invalid' && (
        <p role="alert">{invalidSaveMessages[saveRecovery.reason]} Comece um novo jogo.</p>
      )}

      <button onClick={onNewGame}>Novo jogo</button>
      {saveRecovery.kind === 'available' && <button onClick={continueGame}>Continuar</button>}
    </main>
  );
}

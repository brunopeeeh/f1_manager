import { useState } from 'react';
import { simulateRace, type RaceResult } from '../engine/race';
import { HubScreen } from './HubScreen';
import { RaceResultScreen } from './RaceResultScreen';
import { StartScreen } from './StartScreen';
import { TeamSelectScreen } from './TeamSelectScreen';
import { useGameStore } from './store';

/**
 * Seed fixa por corrida enquanto o resultado não é aplicado ao GameState:
 * simular a mesma corrida duas vezes dá o mesmo resultado (PR futura troca
 * isso por uma seed guardada no estado do jogo).
 */
const FIXED_RACE_SEED_BASE = 2026;

export function App() {
  const gameState = useGameStore((store) => store.gameState);
  const [isChoosingTeam, setIsChoosingTeam] = useState(false);
  const [raceResult, setRaceResult] = useState<RaceResult | null>(null);

  if (gameState && raceResult) {
    return (
      <RaceResultScreen
        gameState={gameState}
        result={raceResult}
        onBack={() => setRaceResult(null)}
      />
    );
  }
  if (gameState) {
    return (
      <HubScreen
        gameState={gameState}
        onSimulateRace={() =>
          setRaceResult(simulateRace(gameState, FIXED_RACE_SEED_BASE + gameState.currentRaceIndex))
        }
      />
    );
  }
  if (isChoosingTeam) {
    return <TeamSelectScreen />;
  }
  return <StartScreen onNewGame={() => setIsChoosingTeam(true)} />;
}

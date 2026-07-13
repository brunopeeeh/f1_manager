import { useState } from 'react';
import { HubScreen } from './HubScreen';
import { StartScreen } from './StartScreen';
import { TeamSelectScreen } from './TeamSelectScreen';
import { useGameStore } from './store';

export function App() {
  const gameState = useGameStore((store) => store.gameState);
  const [isChoosingTeam, setIsChoosingTeam] = useState(false);

  if (gameState) {
    return <HubScreen gameState={gameState} />;
  }
  if (isChoosingTeam) {
    return <TeamSelectScreen />;
  }
  return <StartScreen onNewGame={() => setIsChoosingTeam(true)} />;
}

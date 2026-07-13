import { seedCircuits } from '../data/circuits';
import type { GameState } from '../engine/types';
import { useGameStore } from './store';

function circuitLabel(circuitId: string): string {
  const circuit = seedCircuits.find((candidate) => candidate.id === circuitId);
  return circuit ? `${circuit.name} (${circuit.country})` : circuitId;
}

interface HubScreenProps {
  gameState: GameState;
  onSimulateRace: () => void;
}

export function HubScreen({ gameState, onSimulateRace }: HubScreenProps) {
  const advance = useGameStore((store) => store.advance);

  const playerTeam = gameState.teams.find((team) => team.id === gameState.playerTeamId);
  if (!playerTeam) {
    return <p role="alert">Equipe do jogador não encontrada no estado do jogo.</p>;
  }

  const teamDrivers = playerTeam.driverIds.map(
    (driverId) => gameState.drivers.find((driver) => driver.id === driverId)?.name ?? driverId,
  );
  const isLastRace = gameState.currentRaceIndex >= gameState.season.calendar.length - 1;

  return (
    <main>
      <h1>
        <span
          aria-hidden
          style={{
            display: 'inline-block',
            width: '0.8em',
            height: '0.8em',
            backgroundColor: playerTeam.colorHex,
            marginRight: '0.4em',
          }}
        />
        {playerTeam.name}
      </h1>
      <p>
        Pilotos: {teamDrivers[0]} e {teamDrivers[1]}
      </p>

      <h2>Temporada {gameState.season.year}</h2>
      <ol>
        {gameState.season.calendar.map((circuitId, raceIndex) => {
          const isNextRace = raceIndex === gameState.currentRaceIndex;
          return (
            <li key={circuitId} style={{ fontWeight: isNextRace ? 'bold' : 'normal' }}>
              {circuitLabel(circuitId)}
              {isNextRace && (
                <>
                  {' ← próxima corrida '}
                  <button onClick={onSimulateRace}>Simular corrida</button>
                </>
              )}
            </li>
          );
        })}
      </ol>

      <button onClick={advance} disabled={isLastRace}>
        Avançar
      </button>
      {isLastRace && <p>Fim da temporada — em breve</p>}
    </main>
  );
}

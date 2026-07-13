import { seedCircuits } from '../data/circuits';
import type { RaceResult } from '../engine/race';
import type { GameState } from '../engine/types';

function formatTotalTime(totalTimeMs: number): string {
  const totalSeconds = totalTimeMs / 1000;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const paddedSeconds = seconds.toFixed(3).padStart(6, '0');
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${paddedSeconds}`;
  }
  return `${minutes}:${paddedSeconds}`;
}

function formatGap(gapMs: number): string {
  return `+${(gapMs / 1000).toFixed(3)}s`;
}

interface RaceResultScreenProps {
  gameState: GameState;
  result: RaceResult;
  onBack: () => void;
}

export function RaceResultScreen({ gameState, result, onBack }: RaceResultScreenProps) {
  const circuitId = gameState.season.calendar[gameState.currentRaceIndex];
  const circuit = seedCircuits.find((candidate) => candidate.id === circuitId);
  const leaderTimeMs = result[0]?.totalTimeMs ?? 0;

  return (
    <main>
      <h1>Resultado — {circuit ? circuit.name : circuitId}</h1>
      <table>
        <thead>
          <tr>
            <th>Pos</th>
            <th>Piloto</th>
            <th>Equipe</th>
            <th>Tempo</th>
            <th>Gap</th>
          </tr>
        </thead>
        <tbody>
          {result.map((entry) => {
            const driver = gameState.drivers.find((candidate) => candidate.id === entry.driverId);
            const team = gameState.teams.find((candidate) => candidate.id === entry.teamId);
            return (
              <tr key={entry.driverId}>
                <td>{entry.position}</td>
                <td>{driver?.name ?? entry.driverId}</td>
                <td style={{ color: team?.colorHex }}>{team?.name ?? entry.teamId}</td>
                <td>{formatTotalTime(entry.totalTimeMs)}</td>
                <td>{entry.position === 1 ? '—' : formatGap(entry.totalTimeMs - leaderTimeMs)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button onClick={onBack}>Voltar ao hub</button>
    </main>
  );
}

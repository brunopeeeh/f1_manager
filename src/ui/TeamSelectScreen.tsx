import { seedDrivers } from '../data/drivers';
import { seedTeams } from '../data/teams';
import { useGameStore } from './store';

function driverNames(driverIds: readonly string[]): string {
  return driverIds
    .map((driverId) => seedDrivers.find((driver) => driver.id === driverId)?.name ?? driverId)
    .join(' e ');
}

export function TeamSelectScreen() {
  const newGame = useGameStore((store) => store.newGame);

  return (
    <main>
      <h1>Escolha sua equipe</h1>
      <ul>
        {seedTeams.map((team) => (
          <li key={team.id} style={{ marginBottom: '0.5rem' }}>
            <span
              aria-hidden
              style={{
                display: 'inline-block',
                width: '0.8em',
                height: '0.8em',
                backgroundColor: team.colorHex,
                marginRight: '0.4em',
              }}
            />
            <strong>{team.name}</strong> — orçamento {team.budget}k — pilotos:{' '}
            {driverNames(team.driverIds)}{' '}
            <button onClick={() => newGame(team.id)}>Escolher</button>
          </li>
        ))}
      </ul>
    </main>
  );
}

import { gameInfo } from '../data/gameInfo';

export function App() {
  return (
    <main>
      <h1>{gameInfo.name}</h1>
      <p>v{gameInfo.version}</p>
    </main>
  );
}

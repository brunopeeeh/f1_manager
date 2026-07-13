export interface Driver {
  id: string;
  name: string;
  /** Idade em anos, entre 18 e 42. */
  age: number;
  /** Velocidade pura, 0–100. */
  pace: number;
  /** Reduz a variação de tempo volta a volta, 0–100. */
  consistency: number;
  /** Melhora ultrapassagem, aumenta risco de incidente, 0–100. */
  aggression: number;
  /** Salário anual, número inteiro em milhares. */
  salary: number;
}

export interface Car {
  aero: number;
  power: number;
  reliability: number;
}

export interface Team {
  id: string;
  name: string;
  colorHex: string;
  /** Orçamento da temporada, número inteiro em milhares. */
  budget: number;
  car: Car;
  driverIds: [string, string];
}

export interface Circuit {
  id: string;
  name: string;
  country: string;
  laps: number;
  baseLapTimeMs: number;
  /** Peso da aerodinâmica no desempenho, 0–1. Soma com powerImportance = 1. */
  aeroImportance: number;
  /** Peso do motor no desempenho, 0–1. Soma com aeroImportance = 1. */
  powerImportance: number;
  overtakingDifficulty: number;
}

export interface Season {
  year: number;
  /** Ids de circuito na ordem em que as corridas acontecem. */
  calendar: string[];
}

export interface GameState {
  season: Season;
  currentRaceIndex: number;
  playerTeamId: string;
  teams: Team[];
  drivers: Driver[];
  /** Versão do formato de save, para migrações futuras. */
  version: string;
}

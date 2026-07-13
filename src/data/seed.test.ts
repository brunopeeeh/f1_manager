import { describe, expect, it } from 'vitest';
import type { Team } from '../engine/types';
import { seedCircuits } from './circuits';
import { seedDrivers } from './drivers';
import { seedTeams, teamTiers } from './teams';

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function teamsOfTier(tierIds: readonly string[]): Team[] {
  return seedTeams.filter((team) => tierIds.includes(team.id));
}

function carAttributeAverage(teams: Team[]): number {
  return average(teams.flatMap((team) => [team.car.aero, team.car.power, team.car.reliability]));
}

function driverPaceAverage(teams: Team[]): number {
  const driverIds = new Set(teams.flatMap((team) => team.driverIds));
  return average(seedDrivers.filter((driver) => driverIds.has(driver.id)).map((d) => d.pace));
}

describe('integridade do seed data', () => {
  it('tem exatamente 10 equipes, 20 pilotos e 12 circuitos', () => {
    expect(seedTeams).toHaveLength(10);
    expect(seedDrivers).toHaveLength(20);
    expect(seedCircuits).toHaveLength(12);
  });

  it('tem ids únicos em equipes, pilotos e circuitos', () => {
    for (const ids of [
      seedTeams.map((team) => team.id),
      seedDrivers.map((driver) => driver.id),
      seedCircuits.map((circuit) => circuit.id),
    ]) {
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('cada equipe tem 2 pilotos e cada piloto pertence a exatamente uma equipe', () => {
    const referencedDriverIds = seedTeams.flatMap((team) => team.driverIds);
    expect(referencedDriverIds).toHaveLength(20);
    expect(new Set(referencedDriverIds).size).toBe(20);

    const knownDriverIds = new Set(seedDrivers.map((driver) => driver.id));
    for (const driverId of referencedDriverIds) {
      expect(knownDriverIds.has(driverId)).toBe(true);
    }
  });

  it('os tiers cobrem as 10 equipes sem sobreposição', () => {
    const tierIds = [...teamTiers.top, ...teamTiers.midfield, ...teamTiers.backmarkers];
    expect(tierIds).toHaveLength(10);
    expect(new Set(tierIds).size).toBe(10);
    const knownTeamIds = new Set(seedTeams.map((team) => team.id));
    for (const teamId of tierIds) {
      expect(knownTeamIds.has(teamId)).toBe(true);
    }
  });
});

describe('limites dos atributos', () => {
  it('pilotos: idade 18–42, atributos 0–100, salário inteiro positivo', () => {
    for (const driver of seedDrivers) {
      expect(driver.age).toBeGreaterThanOrEqual(18);
      expect(driver.age).toBeLessThanOrEqual(42);
      for (const attribute of [driver.pace, driver.consistency, driver.aggression]) {
        expect(attribute).toBeGreaterThanOrEqual(0);
        expect(attribute).toBeLessThanOrEqual(100);
      }
      expect(Number.isInteger(driver.salary)).toBe(true);
      expect(driver.salary).toBeGreaterThan(0);
    }
  });

  it('carros: atributos 0–100; orçamento inteiro positivo; cor em formato hex', () => {
    for (const team of seedTeams) {
      for (const attribute of [team.car.aero, team.car.power, team.car.reliability]) {
        expect(attribute).toBeGreaterThanOrEqual(0);
        expect(attribute).toBeLessThanOrEqual(100);
      }
      expect(Number.isInteger(team.budget)).toBe(true);
      expect(team.budget).toBeGreaterThan(0);
      expect(team.colorHex).toMatch(/^#[0-9A-F]{6}$/i);
    }
  });

  it('circuitos: aeroImportance + powerImportance = 1 e demais limites', () => {
    for (const circuit of seedCircuits) {
      expect(circuit.aeroImportance + circuit.powerImportance).toBeCloseTo(1, 10);
      expect(circuit.aeroImportance).toBeGreaterThanOrEqual(0);
      expect(circuit.aeroImportance).toBeLessThanOrEqual(1);
      expect(circuit.overtakingDifficulty).toBeGreaterThanOrEqual(0);
      expect(circuit.overtakingDifficulty).toBeLessThanOrEqual(100);
      expect(circuit.laps).toBeGreaterThan(0);
      expect(circuit.baseLapTimeMs).toBeGreaterThan(0);
    }
  });
});

describe('escalonamento de força', () => {
  it('carros: ponta > meio > fundo na média de atributos', () => {
    const topAverage = carAttributeAverage(teamsOfTier(teamTiers.top));
    const midfieldAverage = carAttributeAverage(teamsOfTier(teamTiers.midfield));
    const backmarkerAverage = carAttributeAverage(teamsOfTier(teamTiers.backmarkers));

    expect(topAverage).toBeGreaterThan(midfieldAverage);
    expect(midfieldAverage).toBeGreaterThan(backmarkerAverage);
  });

  it('orçamentos: ponta > meio > fundo na média', () => {
    const budgetAverage = (teams: Team[]) => average(teams.map((team) => team.budget));

    expect(budgetAverage(teamsOfTier(teamTiers.top))).toBeGreaterThan(
      budgetAverage(teamsOfTier(teamTiers.midfield)),
    );
    expect(budgetAverage(teamsOfTier(teamTiers.midfield))).toBeGreaterThan(
      budgetAverage(teamsOfTier(teamTiers.backmarkers)),
    );
  });

  it('pilotos: pace médio acompanha o tier da equipe, mesmo com jovens talentos', () => {
    const topAverage = driverPaceAverage(teamsOfTier(teamTiers.top));
    const midfieldAverage = driverPaceAverage(teamsOfTier(teamTiers.midfield));
    const backmarkerAverage = driverPaceAverage(teamsOfTier(teamTiers.backmarkers));

    expect(topAverage).toBeGreaterThan(midfieldAverage);
    expect(midfieldAverage).toBeGreaterThan(backmarkerAverage);
  });
});

describe('nomes fictícios', () => {
  const realF1Names = [
    'ferrari',
    'mercedes',
    'red bull',
    'redbull',
    'mclaren',
    'aston martin',
    'alpine',
    'williams',
    'haas',
    'sauber',
    'alfa romeo',
    'alphatauri',
    'toro rosso',
    'racing bulls',
    'renault',
    'benetton',
    'brabham',
    'tyrrell',
    'jordan',
    'minardi',
    'lotus',
    'hamilton',
    'verstappen',
    'leclerc',
    'norris',
    'russell',
    'alonso',
    'sainz',
    'perez',
    'pérez',
    'piastri',
    'gasly',
    'ocon',
    'albon',
    'stroll',
    'hulkenberg',
    'hülkenberg',
    'bottas',
    'tsunoda',
    'ricciardo',
    'magnussen',
    'antonelli',
    'bearman',
    'lawson',
    'colapinto',
    'doohan',
    'hadjar',
    'bortoleto',
    'senna',
    'schumacher',
    'vettel',
    'raikkonen',
    'räikkönen',
    'prost',
    'lauda',
    'fangio',
    'mansell',
    'piquet',
    'barrichello',
    'massa',
    'button',
    'rosberg',
    'webber',
    'hakkinen',
    'häkkinen',
    'montoya',
    'monza',
    'silverstone',
    'suzuka',
    'interlagos',
    'monaco',
    'spa-francorchamps',
    'imola',
    'zandvoort',
    'jeddah',
    'sakhir',
  ];

  it('nenhuma string do seed contém nomes reais da F1', () => {
    const allSeedStrings = [
      ...seedTeams.map((team) => team.name),
      ...seedDrivers.map((driver) => driver.name),
      ...seedCircuits.flatMap((circuit) => [circuit.name, circuit.country]),
    ].map((value) => value.toLowerCase());

    for (const seedString of allSeedStrings) {
      for (const realName of realF1Names) {
        expect(seedString, `"${seedString}" contém "${realName}"`).not.toContain(realName);
      }
    }
  });
});

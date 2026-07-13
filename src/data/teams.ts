import type { Team } from '../engine/types';

/**
 * 10 equipes fictícias em três faixas de força:
 * ponta (aurora-velocita, titan-apex), meio (solaris, boreal, vulcan, cobalt)
 * e fundo (falco, nordwind, pampa, lumen).
 */
export const seedTeams: Team[] = [
  {
    id: 'aurora-velocita',
    name: 'Aurora Velocità',
    colorHex: '#00C2B8',
    budget: 150000,
    car: { aero: 92, power: 90, reliability: 88 },
    driverIds: ['kaito-mizushima', 'emile-charron'],
  },
  {
    id: 'titan-apex',
    name: 'Titan Apex Racing',
    colorHex: '#D7263D',
    budget: 145000,
    car: { aero: 89, power: 93, reliability: 86 },
    driverIds: ['lukas-reinhardt', 'mateus-barbosa'],
  },
  {
    id: 'solaris-motorsport',
    name: 'Solaris Motorsport',
    colorHex: '#F5A623',
    budget: 105000,
    car: { aero: 78, power: 80, reliability: 82 },
    driverIds: ['niklas-sorensen', 'tomas-herrera'],
  },
  {
    id: 'boreal-racing',
    name: 'Boreal Racing',
    colorHex: '#4FA3D9',
    budget: 98000,
    car: { aero: 80, power: 74, reliability: 79 },
    driverIds: ['aleksi-virtanen', 'jack-whitmore'],
  },
  {
    id: 'vulcan-dynamics',
    name: 'Vulcan Dynamics',
    colorHex: '#E85D25',
    budget: 100000,
    car: { aero: 74, power: 82, reliability: 76 },
    driverIds: ['dario-falcone', 'sota-kimura'],
  },
  {
    id: 'cobalt-meridian',
    name: 'Cobalt Meridian',
    colorHex: '#2545D3',
    budget: 95000,
    car: { aero: 77, power: 76, reliability: 74 },
    driverIds: ['bastien-leroux', 'petra-kovacs'],
  },
  {
    id: 'falco-corse',
    name: 'Falco Corse',
    colorHex: '#1E7A46',
    budget: 72000,
    car: { aero: 64, power: 62, reliability: 70 },
    driverIds: ['viktor-stanescu', 'theo-ashcroft'],
  },
  {
    id: 'nordwind-racing',
    name: 'Nordwind Racing',
    colorHex: '#7C93A6',
    budget: 68000,
    car: { aero: 60, power: 66, reliability: 65 },
    driverIds: ['henrik-dahlberg', 'marco-bellandi'],
  },
  {
    id: 'pampa-racing',
    name: 'Pampa Racing Team',
    colorHex: '#74ACDF',
    budget: 65000,
    car: { aero: 62, power: 60, reliability: 68 },
    driverIds: ['joaquin-ibarra', 'liam-osullivan'],
  },
  {
    id: 'lumen-gp',
    name: 'Lumen Grand Prix',
    colorHex: '#8E44AD',
    budget: 60000,
    car: { aero: 58, power: 64, reliability: 62 },
    driverIds: ['ravi-chandrasekar', 'nadia-belkacem'],
  },
];

/** Agrupamento de força usado nos testes de escalonamento e na UI futura. */
export const teamTiers = {
  top: ['aurora-velocita', 'titan-apex'],
  midfield: ['solaris-motorsport', 'boreal-racing', 'vulcan-dynamics', 'cobalt-meridian'],
  backmarkers: ['falco-corse', 'nordwind-racing', 'pampa-racing', 'lumen-gp'],
} as const;

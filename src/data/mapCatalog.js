import banks from './utilizationBanks.json';
import { resilienceSections } from './explorationCatalog.js';

const [, standards, benchmarks] = resilienceSections;

export const locations = [
  { id: '840', code: 'USA', name: 'Amerika Serikat', region: 'north-america', point: [-99, 39] },
  { id: '124', code: 'CAN', name: 'Kanada', region: 'north-america', point: [-105, 58] },
  { id: '826', code: 'GBR', name: 'Britania Raya', region: 'europe', point: [-2, 54] },
  { id: '724', code: 'ESP', name: 'Spanyol', region: 'europe', point: [-4, 40] },
  { id: '380', code: 'ITA', name: 'Italia', region: 'europe', point: [13, 42] },
  { id: '156', code: 'CHN', name: 'Tiongkok', region: 'east-asia', point: [104, 35] },
  { id: '702', code: 'SGP', name: 'Singapura', region: 'southeast-asia', point: [103.82, 1.35] },
].map(location => {
  const { name } = location;
  const benchmark = benchmarks.items.find(item => item.title === (['Spanyol', 'Italia'].includes(name) ? 'Uni Eropa' : name));
  const projects = banks
    .filter(bank => bank.region === name)
    .map(bank => ({ bank, milestone: bank.milestones.filter(item => item.source).at(-1) }))
    .filter(project => project.milestone);
  const newest = [...projects].sort((a, b) => (b.milestone.year ?? 0) - (a.milestone.year ?? 0))[0];
  return { ...location, benchmark, projects, newest, standards: location.code === 'USA' ? standards.items : [] };
});

export const regions = [
  { id: 'world', label: 'Dunia' },
  { id: 'north-america', label: 'Amerika Utara', bounds: [[-168, 78], [-51, 12]] },
  { id: 'europe', label: 'Eropa', bounds: [[-25, 68], [38, 34]] },
  { id: 'east-asia', label: 'Asia Timur', bounds: [[72, 57], [150, 15]] },
  { id: 'southeast-asia', label: 'Asia Tenggara', bounds: [[90, 29], [143, -12]] },
];

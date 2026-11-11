import content from './ketahanan-kuantum.json';
import banks from './utilizationBanks.json';
import hardware from '../assets/hero-a.jpg';
import chip from '../assets/quantum-evolution/sycamore.webp';
import world from '../assets/hero-b.jpg';
import guide from '../assets/resilience/panduan.svg';
import standard from '../assets/resilience/standar.svg';
import benchmark from '../assets/resilience/respons.svg';

const topics = [
  { id: 'produk-kajian', label: 'Produk kajian dan panduan', image: guide },
  { id: 'standar-pqc', label: 'Standar teknis PQC', image: standard },
  { id: 'respons-negara', label: 'Benchmark internasional', image: benchmark },
];

export const resilienceSections = topics.map(topic => {
  const section = content.sections.find(item => item.id === topic.id);
  return {
    ...section,
    image: topic.image,
    label: topic.label,
    eyebrow: 'Jalur B · ' + topic.label,
    items: section.items.map(item => ({ ...item, action: 'Buka rujukan', scope: item.scope || item.source.label })),
  };
});

export const bankCards = banks.map((bank, index) => {
  const evidence = bank.milestones.find(item => item.source);
  return {
    id: bank.id,
    title: bank.name,
    text: evidence ? evidence.title : bank.direction,
    scope: bank.region + ' · ' + (evidence?.stage || 'Pemetaan awal'),
    image: [hardware, chip, world][index % 3],
    href: '#pemanfaatan-kuantum/bank/' + bank.id,
    action: 'Buka profil bank',
    evidence,
  };
});

export const homepageCards = [
  ...['jpmorgan-chase', 'hsbc', 'barclays'].map(id => {
    const card = bankCards.find(item => item.id === id);
    return { ...card, scope: 'Jalur A · ' + card.scope, action: 'Buka studi bank' };
  }),
  ...resilienceSections.map(section => ({
    id: section.id,
    title: section.label,
    text: section.text,
    scope: 'Jalur B · Ketahanan kuantum',
    image: section.image,
    href: '#' + section.anchor,
    action: 'Buka katalog',
  })),
];

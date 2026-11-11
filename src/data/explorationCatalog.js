import content from './ketahanan-kuantum.json';
import banks from './utilizationBanks.json';
import { bankImages, productImages } from './productImages.js';

const topics = [
  { id: 'produk-kajian', label: 'Produk kajian dan panduan', image: productImages.servers },
  { id: 'standar-pqc', label: 'Standar teknis PQC', image: productImages.circuit },
  { id: 'respons-negara', label: 'Benchmark internasional', image: productImages.bis },
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

export const bankCards = banks.map(bank => {
  const evidence = bank.milestones.find(item => item.source);
  return {
    id: bank.id,
    title: bank.name,
    text: evidence ? evidence.title : bank.direction,
    scope: bank.region + ' · ' + (evidence?.stage || 'Pemetaan awal'),
    image: bankImages[bank.id],
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

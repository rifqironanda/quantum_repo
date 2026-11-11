import trading from '../assets/products/trading.webp';
import servers from '../assets/products/servers.webp';
import bis from '../assets/products/bis.webp';
import circuit from '../assets/products/circuit.webp';
import hardware from '../assets/hero-a.jpg';
import { media } from './quantumEvolution.js';

const commons = 'https://commons.wikimedia.org/wiki/File:';
const license = (type, version) => ({
  label: `CC ${type.toUpperCase()} ${version}`,
  url: `https://creativecommons.org/licenses/${type}/${version}/`,
});

export const productImages = {
  hardware: {
    src: hardware,
    caption: 'IBM Quantum System One',
    credit: 'OJB Quantum',
    source: commons + 'IBM_Quantum_System_One.jpg',
    license: license('by', '4.0'),
  },
  sycamore: media.sycamore,
  trading: {
    src: trading,
    caption: 'Lantai perdagangan NYSE',
    credit: 'Eduard Hueber',
    source: commons + 'NYSE_Advanced_Trading_Floor.jpg',
    license: license('by-sa', '3.0'),
  },
  servers: {
    src: servers,
    caption: 'Rak server pusat data',
    credit: 'Lgate74',
    source: commons + 'Dcentre_racks.jpg',
    license: license('by', '3.0'),
  },
  circuit: {
    src: circuit,
    caption: 'Cip pada papan sirkuit',
    credit: 'Jacques Rivet (F5onr)',
    source: commons + 'Chip_on_board.jpg',
    license: license('by-sa', '4.0'),
  },
  bis: {
    src: bis,
    caption: 'Menara Bank for International Settlements, Basel',
    credit: 'Fred Romero',
    source: commons + 'Basel_-_Bank_für_Internationalen_Zahlungsausgleich-Tower_Building_(27527280652).jpg',
    license: license('by', '2.0'),
  },
};

export const bankImages = {
  'jpmorgan-chase': productImages.hardware,
  hsbc: productImages.trading,
  barclays: productImages.servers,
  'wells-fargo': productImages.circuit,
  'goldman-sachs': productImages.trading,
  bbva: productImages.trading,
  'intesa-sanpaolo': productImages.sycamore,
  ocbc: productImages.hardware,
  uob: productImages.sycamore,
  icbc: productImages.servers,
};

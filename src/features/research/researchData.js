import Papa from 'papaparse';

export const categories = [
  { id: 'A', label: 'Financial Markets and Investment', color: '#334fc8', dash: '' },
  { id: 'B', label: 'Banking Operations', color: '#087065', dash: '8 4' },
  { id: 'C', label: 'Financial Infrastructure', color: '#ad4c0a', dash: '2 4' },
  { id: 'D', label: 'Cybersecurity', color: '#a52b76', dash: '10 4 2 4' },
];

const knownCategories = new Set(categories.map(category => category.id));
const emptyCounts = () => Object.fromEntries(categories.map(({ id }) => [id, 0]));

function categoryIds(value) {
  const ids = value.split(';').flatMap(segment => {
    const head = segment.trim().match(/^([A-D](?:\s*\/\s*[A-D])*)(?=\s*(?:[—–-]|$))/i);
    return head ? head[1].toUpperCase().split('/').map(id => id.trim()) : [];
  });
  return [...new Set(ids.filter(id => knownCategories.has(id)))];
}

export function parseResearchCsv(csv) {
  if (/^\s*</.test(csv)) throw new Error('Tautan mengembalikan HTML. Gunakan tautan publik CSV dari Google Sheets.');
  const { data, errors, meta } = Papa.parse(csv, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: value => value.replace(/^\uFEFF/, '').trim().toLowerCase(),
  });
  if (errors.length) throw new Error('Struktur CSV tidak valid. Periksa pemisah dan tanda kutip.');
  if (!meta.fields?.includes('tahun') || !meta.fields?.includes('kelompok')) {
    throw new Error('CSV harus memiliki kolom Tahun dan Kelompok.');
  }
  const years = new Map();
  let validRows = 0;
  let skippedRows = 0;
  for (const row of data) {
    const yearText = row.tahun.trim();
    const year = Number(yearText);
    const ids = categoryIds(row.kelompok);
    if (!/^\d{4}$/.test(yearText) || year < 1900 || year > 2100 || !ids.length) {
      skippedRows++;
      continue;
    }
    const counts = years.get(year) ?? emptyCounts();
    for (const id of ids) counts[id]++;
    years.set(year, counts);
    validRows++;
  }
  if (!years.size) throw new Error('CSV tidak memiliki entri Tahun dan Kelompok A–D yang valid.');
  const start = Math.min(...years.keys());
  const end = Math.max(...years.keys());
  const points = Array.from({ length: end - start + 1 }, (_, index) => {
    const year = start + index;
    return { year, ...(years.get(year) ?? emptyCounts()) };
  });
  return { points, validRows, skippedRows };
}

export function validateSheetsCsvUrl(value) {
  const url = new URL(value);
  if (url.origin !== 'https://docs.google.com' ||
      !/^\/spreadsheets\/d\/(?:e\/[^/]+\/pub|[^/]+\/export)$/.test(url.pathname) ||
      !['csv'].includes(url.searchParams.get('output') ?? url.searchParams.get('format'))) {
    throw new Error('Gunakan tautan Google Sheets publik yang berformat CSV.');
  }
  return url.href;
}

export async function loadResearchCsv(url, signal) {
  const response = await fetch(url, { signal, cache: 'no-store' });
  if (!response.ok) throw new Error(`CSV tidak dapat dimuat (HTTP ${response.status}).`);
  return parseResearchCsv(await response.text());
}

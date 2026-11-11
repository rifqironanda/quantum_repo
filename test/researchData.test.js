import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { loadResearchCsv, parseResearchCsv, validateSheetsCsvUrl } from '../src/features/research/researchData.js';

test('preserves entries and supports multi-category rows, quoted columns and missing years', () => {
  const result = parseResearchCsv('\uFEFFTahun,Kelompok,Judul\r\n1994,D — Cybersecurity,"Shor, 1994"\r\n1996,A/B — metode hybrid,"Metode, simulasi"\r\n1996,A — Pasar; A — Pasar; D — Cybersecurity,Uji\r\n2020,X,Lewati');
  assert.deepEqual(result, {
    validRows: 3,
    skippedRows: 1,
    points: [
      { year: 1994, A: 0, B: 0, C: 0, D: 1 },
      { year: 1995, A: 0, B: 0, C: 0, D: 0 },
      { year: 1996, A: 2, B: 1, C: 0, D: 1 },
    ],
  });
});

test('bundled snapshot includes the 369 catalogue rows and starts in 1994', async () => {
  const input = await readFile(new URL('../public/data/research-snapshot.csv', import.meta.url), 'utf8');
  const data = parseResearchCsv(input);
  assert.equal(data.validRows, 369);
  assert.equal(data.skippedRows, 0);
  assert.equal(data.points[0].year, 1994);
  assert.deepEqual(data.points.at(-1), { year: 2026, A: 25, B: 31, C: 9, D: 32 });
});

test('rejects HTML responses, missing headers and private edit links as CSV inputs', () => {
  assert.throws(() => parseResearchCsv('<html>Sign in</html>'), /HTML/);
  assert.throws(() => parseResearchCsv('Date,Category\n2025,A'), /Tahun dan Kelompok/);
  assert.throws(() => validateSheetsCsvUrl('https://docs.google.com/spreadsheets/d/sheet-id/edit'), /CSV/);
  assert.throws(() => validateSheetsCsvUrl('https://example.org/spreadsheets/d/e/demo/pub?output=csv'), /CSV/);
  const url = 'https://docs.google.com/spreadsheets/d/e/demo/pub?gid=0&single=true&output=csv';
  assert.equal(validateSheetsCsvUrl(url), url);
});

test('consecutive fetches reflect changed CSV contents', async context => {
  const replies = ['Tahun,Kelompok\n2024,A', 'Tahun,Kelompok\n2024,A\n2024,A'];
  context.mock.method(globalThis, 'fetch', async (_url, options) => {
    assert.equal(options.cache, 'no-store');
    return new Response(replies.shift());
  });
  const signal = new AbortController().signal;
  const url = 'https://docs.google.com/spreadsheets/d/e/demo/pub?output=csv';
  assert.equal((await loadResearchCsv(url, signal)).points[0].A, 1);
  assert.equal((await loadResearchCsv(url, signal)).points[0].A, 2);
});

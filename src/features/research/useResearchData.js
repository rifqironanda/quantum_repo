import { useEffect, useState } from 'react';
import { loadResearchCsv, validateSheetsCsvUrl } from './researchData.js';

const liveUrl = import.meta.env.VITE_RESEARCH_SHEET_CSV_URL?.trim();
const snapshotUrl = `${import.meta.env.BASE_URL}data/research-snapshot.csv`;
const configuredInterval = Number(import.meta.env.VITE_RESEARCH_REFRESH_MS);
const refreshMs = Number.isFinite(configuredInterval) && configuredInterval >= 10000 ? configuredInterval : 60000;

export default function useResearchData() {
  const [state, setState] = useState({ data: null, source: null, checkedAt: null, error: null, loading: true });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let disposed = false;
    let controller;
    let timer;
    let loading = false;
    const update = patch => { if (!disposed) setState(previous => ({ ...previous, ...patch })); };

    async function refresh() {
      if (disposed || loading) return;
      clearTimeout(timer);
      loading = true;
      controller = new AbortController();
      const signal = controller.signal;
      const timeout = setTimeout(() => controller.abort(), 15000);
      try {
        const url = liveUrl ? validateSheetsCsvUrl(liveUrl) : snapshotUrl;
        const data = await loadResearchCsv(url, signal);
        update({ data, source: liveUrl ? 'live' : 'snapshot', checkedAt: new Date(), error: null, loading: false });
      } catch (error) {
        if (!disposed) {
          const message = signal.aborted ? 'Waktu tunggu pembacaan CSV habis.' : error.message;
          update({ error: message, loading: false });
        }
      } finally {
        clearTimeout(timeout);
        loading = false;
        if (!disposed && liveUrl) timer = setTimeout(refresh, refreshMs);
      }
    }
    const onVisible = () => { if (liveUrl && !document.hidden) refresh(); };
    refresh();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      disposed = true;
      clearTimeout(timer);
      controller?.abort();
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [attempt]);

  return { ...state, liveUrl, refreshMs, retry: () => setAttempt(value => value + 1) };
}

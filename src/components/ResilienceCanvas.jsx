import { useState } from 'react';
import resources from '../data/resilienceResources.json';

const formats = [
  { id: 'slides', label: 'Slides', purpose: 'Bahan presentasi', items: ['Perkembangan teknologi', 'Ancaman terhadap kriptografi', 'Skenario HNDL perbankan'] },
  { id: 'docs', label: 'Docs', purpose: 'Naskah kajian', items: ['Ruang lingkup dan definisi', 'Mekanisme ancaman', 'Bukti dan batas kesimpulan'] },
  { id: 'sheets', label: 'Sheets', purpose: 'Register bukti', items: ['Sumber dan tanggal', 'Fungsi kriptografi', 'Status verifikasi dan batas kesimpulan'] },
];

function googleUrl(value, type) {
  try {
    const url = new URL(value);
    const path = { slides: 'presentation', docs: 'document', sheets: 'spreadsheets' }[type];
    if (url.origin === 'https://docs.google.com' && url.pathname.startsWith('/' + path + '/')) return url.href;
  } catch {
    return '';
  }
  return '';
}

export default function ResilienceCanvas() {
  const [selected, setSelected] = useState('slides');
  const format = formats.find(item => item.id === selected);
  const embedUrl = googleUrl(resources[selected].embedUrl, selected);
  const openUrl = googleUrl(resources[selected].openUrl, selected) || embedUrl;

  return <section className="section" id="ketahanan-kuantum/canvas" aria-labelledby="resilience-canvas-title">
    <div className="intro">
      <p className="eyebrow">Ruang materi</p>
      <h2 id="resilience-canvas-title">Canvas kajian</h2>
      <p>Pilih format untuk membaca materi, menelusuri bukti, atau membuka presentasi.</p>
    </div>
    <div className="panel qr-canvas">
      <div className="qr-canvas-toolbar">
        <div className="qr-switch" role="group" aria-label="Format materi">
          {formats.map(item => <button key={item.id} type="button"
            aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}>{item.label}</button>)}
        </div>
        {openUrl && <a href={openUrl} target="_blank" rel="noopener noreferrer">Buka di Google ↗</a>}
      </div>
      {embedUrl ? <iframe key={selected} className="qr-frame" src={embedUrl}
        title={format.purpose} loading="lazy" allowFullScreen /> :
        <div className="qr-placeholder" aria-live="polite">
          <p className="eyebrow">{openUrl ? 'Tautan tersedia' : 'Templat canvas'}</p>
          <h3>{format.purpose}</h3>
          <ul>{format.items.map(item => <li key={item}>{item}</li>)}</ul>
          <p>{openUrl ? 'Gunakan tombol Buka di Google untuk membaca materi.' : 'Materi Google untuk bagian ini belum ditautkan.'}</p>
        </div>}
    </div>
  </section>;
}

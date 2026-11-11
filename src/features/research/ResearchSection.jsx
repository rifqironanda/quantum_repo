import { categories } from './researchData.js';
import ResearchChart from './ResearchChart.jsx';
import useResearchData from './useResearchData.js';
import googleLinks from '../../data/googleLinks.json';

const resourceLabels = { docs: 'Google Docs', sheets: 'Google Sheets', slides: 'Google Slides', colab: 'Google Colab' };

export default function ResearchSection() {
  const { data, source, checkedAt, error, loading, liveUrl, refreshMs, retry } = useResearchData();
  const resources = Object.entries(googleLinks).filter(([type, url]) => resourceLabels[type] && /^https:\/\//.test(url));
  const latest = data?.points.at(-1);
  const previous = data?.points.at(-2);

  return <section id="perkembangan-riset" className="section research-section" aria-labelledby="research-heading">
    <div className="intro">
      <p className="eyebrow">Empat kategori riset</p>
      <h2 id="research-heading">Perkembangan riset kuantum di sektor keuangan</h2>
      <p>Jumlah entri terdokumentasi menurut tahun dan kategori dalam katalog riset.</p>
    </div>
    <div className="research-status" role="status">
      {loading && <p>Memuat data riset…</p>}
      {source === 'snapshot' && <p><strong>Snapshot lokal</strong> · Research Mapping dari pemetaan_riset_quantum_keuangan.xlsx.</p>}
      {source === 'live' && <p><strong>Google Sheets</strong> · Dicek {checkedAt.toLocaleString('id-ID')} · Interval {refreshMs / 1000} detik.</p>}
      {error && <p>{data ? 'Data terakhir yang berhasil dimuat tetap ditampilkan. ' : ''}{error}</p>}
      {(error || liveUrl) && <button className="cta" type="button" onClick={retry}>Muat ulang data</button>}
    </div>
    {data && <>
      <figure className="research-panel">
        <figcaption><h3>Tren gabungan A–D</h3></figcaption>
        <ul className="research-legend">{categories.map(item =>
          <li key={item.id}><svg width="26" height="9" aria-hidden="true"><line x1="0" y1="4" x2="26" y2="4" stroke={item.color} strokeDasharray={item.dash} strokeWidth="3" /></svg>{item.id} · {item.label}</li>)}</ul>
        <div className="research-chart-scroll" tabIndex={0} role="region" aria-label="Grafik tren yang dapat digulir">
          <ResearchChart points={data.points} series={categories} title="Jumlah entri riset per tahun untuk empat kategori" />
        </div>
      </figure>
      <div className="research-grid">{categories.map(item => {
        const delta = previous ? latest[item.id] - previous[item.id] : null;
        return <figure className="research-panel research-mini" key={item.id}>
          <figcaption><h3>{item.id} · {item.label}</h3>
            <p><strong>{latest[item.id]}</strong> entri pada {latest.year}
              {delta !== null && <span> · {delta > 0 ? '+' : ''}{delta} vs. {previous.year}</span>}</p></figcaption>
          <ResearchChart compact points={data.points} series={[item]} title={`Tren jumlah entri ${item.label}`} />
        </figure>;
      })}</div>
      <details className="research-panel"><summary>Lihat tabel dan metode penghitungan</summary>
        <p className="meta">{data.validRows} baris valid · {data.skippedRows} baris dilewati. Satu baris dihitung sekali di setiap kategori yang tercantum. Penanda kemiripan tidak menghapus entri. Nol berarti katalog tidak memuat entri pada kombinasi tahun dan kategori tersebut.</p>
        <div className="tablebox" tabIndex={0} role="region" aria-label="Tabel jumlah riset menurut tahun">
          <table><caption>Jumlah entri per tahun</caption><thead><tr><th scope="col">Tahun</th>{categories.map(item =>
            <th key={item.id} scope="col" title={item.label}>{item.id}</th>)}</tr></thead>
            <tbody>{data.points.map(row => <tr key={row.year}><th scope="row">{row.year}</th>{categories.map(item => <td key={item.id}>{row[item.id]}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </details>
    </>}
    {resources.length > 0 && <nav className="research-resources" aria-label="Dokumen sumber Google">
      {resources.map(([type, url]) => <a key={type} href={url}>{resourceLabels[type]} ↗</a>)}
    </nav>}
  </section>;
}

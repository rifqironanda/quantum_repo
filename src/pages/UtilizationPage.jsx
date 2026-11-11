import { useState } from 'react';
import photo from '../assets/hero-a.jpg';
import banks from '../data/utilizationBanks.json';
import '../styles/utilization.css';

const source = 'https://docs.google.com/document/d/1SfjM-4RHda92dx3bFJ60ZlrzWUMR2-I1tc1YWUkE5I0/edit?tab=t.rioz0rvg9y67';

export default function UtilizationPage() {
  const [selected, setSelected] = useState(banks[0].name);
  const bank = banks.find(item => item.name === selected);

  return (
    <main className="qu-page" id="pemanfaatan-kuantum">
      <section className="qu-hero" aria-labelledby="utilization-title" style={{ '--qu-photo': `url("${photo}")` }}>
        <div className="wrap qu-hero-inner">
          <p className="eyebrow">Kajian Quantum Banking · Jalur A</p>
          <h1 id="utilization-title" tabIndex={-1}>Pemanfaatan<br /> komputasi kuantum</h1>
          <p>Jelajahi riset bank untuk valuasi, portofolio, settlement, dan deteksi fraud. Lihat apa yang sudah diuji dan apa yang masih perlu dibuktikan.</p>
          <div className="qu-actions">
            <a className="cta" href="#pemanfaatan-kuantum/bank">Jelajahi bank</a>
            <a className="cta qu-ghost" href={source} target="_blank" rel="noreferrer">Baca Tahap 2.5 ↗</a>
          </div>
        </div>
      </section>
      <div className="wrap">
        <section className="section" id="pemanfaatan-kuantum/bank" aria-labelledby="utilization-banks">
          <div className="intro">
            <p className="eyebrow">Pemetaan Tahap 2.5 · {banks.length} bank</p>
            <h2 id="utilization-banks">Eksplorasi riset per bank</h2>
            <p>Pilih bank untuk melihat arah riset, tonggak terpilih, dan batas kesimpulan tiap eksperimen.</p>
          </div>
          <div className="qu-explorer">
            <div className="panel qu-picker">
              <h3>Pilih bank</h3>
              <div className="qu-bank-list" role="group" aria-label="Bank dalam Tahap 2.5">
                {banks.map(item => (
                  <button key={item.name} type="button" aria-pressed={selected === item.name}
                    onClick={() => setSelected(item.name)}>
                    <span>{item.name}</span><small>{item.region}</small>
                  </button>
                ))}
              </div>
            </div>
            <article className="panel qu-profile" aria-labelledby="utilization-bank-name">
              <div className="qu-profile-header" aria-live="polite">
                <p className="eyebrow">{bank.region} · Arah riset terdokumentasi</p>
                <h3 id="utilization-bank-name">{bank.name}</h3>
                <p>{bank.direction}</p>
              </div>
              <h4>Timeline riset</h4>
              <ol className="qu-timeline">
                {bank.milestones.map(item => (
                  <li key={item.title}>
                    <p className="qu-time">{item.year ?? 'Tahun belum ditetapkan'}</p>
                    <div>
                      <span className="qu-status">{item.stage}</span>
                      <h5>{item.title}</h5>
                      <p>{item.summary}</p>
                      <p className="qu-limit"><strong>Batas bukti.</strong> {item.limit}</p>
                      {item.source && <a className="qu-evidence" href={item.source} target="_blank" rel="noreferrer">Sumber publik ↗</a>}
                    </div>
                  </li>
                ))}
              </ol>
              <p className="meta"><a href={source} target="_blank" rel="noreferrer">Rujukan data · Tahap 2.5 ↗</a></p>
              <details key={bank.name} className="qu-security">
                <summary>Konteks tambahan keamanan dan migrasi PQC</summary>
                <p>{bank.security}</p>
                <a href="#ketahanan-kuantum">Buka Jalur B</a>
              </details>
            </article>
          </div>
        </section>
        <section className="section qu-method" aria-labelledby="utilization-method">
          <div className="intro">
            <p className="eyebrow">Panduan membaca bukti</p>
            <h2 id="utilization-method">Bedakan metode, uji, dan penerapan</h2>
          </div>
          <div className="qu-method-grid">
            <article className="panel"><h3>Jenis komputasi</h3><p>Simulator klasik, metode quantum-inspired, perangkat optik klasik, dan perangkat kuantum fisik dicatat sesuai teknologi yang benar-benar digunakan.</p></article>
            <article className="panel"><h3>Tahap yang terdokumentasi</h3><p>Pengumuman, analisis numerik, demonstrasi perangkat, dan uji offline menjawab pertanyaan yang berbeda. Jenis bukti berlaku per proyek.</p></article>
            <article className="panel"><h3>Bukti manfaat operasional</h3><p>Untuk menilai penggunaan bisnis, periksa pembanding klasik, skala data, kualitas hasil, biaya dan waktu end-to-end, serta bukti penerapan rutin.</p></article>
          </div>
        </section>
        <p className="qu-return"><a href="#jalur">← Kembali ke dua jalur kajian</a></p>
      </div>
    </main>
  );
}

import { useEffect, useState } from 'react';
import useSwipe from '../components/useSwipe.js';
import { companies, media, physics, physicsSources, slides } from '../data/quantumEvolution.js';
import '../styles/quantum-evolution.css';

const formatPercent = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 });

function Sources({ items }) {
  return (
    <ul className="qe-sources" aria-label="Sumber">
      {items.map(({ label, url }) => (
        <li key={url}><a href={url} target="_blank" rel="noreferrer">{label} ↗</a></li>
      ))}
    </ul>
  );
}

function Picture({ image, className = '' }) {
  const { src, alt, caption, credit, source, license } = media[image];
  return (
    <figure className={`qe-picture ${className}`}>
      <img src={src} alt={alt} loading="lazy" />
      <figcaption>
        {caption} · <a href={source} target="_blank" rel="noreferrer">{credit}</a>
        {' · '}<a href={license.url} target="_blank" rel="noreferrer">{license.label}</a>
      </figcaption>
    </figure>
  );
}

function Carousel({ id, label, items, getLabel, children }) {
  const [index, setIndex] = useState(0);
  const step = direction => setIndex(current => (current + direction + items.length) % items.length);
  const swipe = useSwipe(step);

  return (
    <div className="qe-carousel" role="region" aria-roledescription="karusel"
      aria-label={label} tabIndex={0}
      onKeyDown={event => {
        if (event.target !== event.currentTarget) return;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          step(event.key === 'ArrowRight' ? 1 : -1);
        }
      }}>
      <div className="qe-picks" role="group" aria-label="Pilih slide">
        {items.map((item, i) => (
          <button key={getLabel(item)} type="button" aria-pressed={i === index}
            aria-controls={id} onClick={() => setIndex(i)}>{getLabel(item)}</button>
        ))}
      </div>
      <div className="qe-stage" id={id} {...swipe}>
        <div className="qe-enter" key={index}>{children(items[index])}</div>
      </div>
      <div className="qe-controls">
        <button type="button" aria-label={`${label}: sebelumnya`} onClick={() => step(-1)}>‹</button>
        <span aria-live="polite">{index + 1} / {items.length} · {getLabel(items[index])}</span>
        <button type="button" aria-label={`${label}: berikutnya`} onClick={() => step(1)}>›</button>
      </div>
    </div>
  );
}

function BitLab() {
  const [bit, setBit] = useState(0);
  return (
    <article className="qe-lab-card">
      <p className="qe-kicker">Komputer klasik</p>
      <h3>Bit klasik</h3>
      <p>Rangkaian elektronik menggunakan dua rentang tegangan untuk mewakili 0 dan 1. Gerbang NOT membalik nilai bit.</p>
      <div className="qe-bit" aria-live="polite" aria-label={`Nilai bit ${bit}`}>{bit}</div>
      <button type="button" className="qe-button" onClick={() => setBit(value => 1 - value)}>Jalankan NOT</button>
    </article>
  );
}

const emptyMeasurements = { last: null, zeros: 0, ones: 0 };

function QubitLab() {
  const [probability, setProbability] = useState(50);
  const [running, setRunning] = useState(false);
  const [measurements, setMeasurements] = useState(emptyMeasurements);
  const total = measurements.zeros + measurements.ones;
  const measured = total ? formatPercent.format(100 * measurements.ones / total) + '%' : '—';

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => {
      const bit = Math.random() < probability / 100 ? 1 : 0;
      setMeasurements(current => ({
        last: bit,
        zeros: current.zeros + (bit === 0 ? 1 : 0),
        ones: current.ones + bit,
      }));
    }, 650);
    return () => window.clearInterval(interval);
  }, [probability, running]);

  return (
    <article className="qe-lab-card">
      <p className="qe-kicker">Komputer kuantum</p>
      <h3>Pengukuran qubit</h3>
      <p>Atur peluang hasil 1, lalu amati sampel otomatis. Setiap sampel mengasumsikan qubit disiapkan ulang pada keadaan yang sama dan diukur dalam basis 0/1.</p>
      <label className="qe-probability">
        Peluang hasil 1 <strong>{probability}%</strong>
        <input type="range" min="0" max="100" value={probability}
          onChange={event => {
            setProbability(Number(event.target.value));
            setMeasurements(emptyMeasurements);
          }} />
      </label>
      <dl className="qe-results">
        <div><dt>Hasil terakhir</dt><dd>{measurements.last ?? '—'}</dd></div>
        <div><dt>Jumlah 0</dt><dd>{measurements.zeros}</dd></div>
        <div><dt>Jumlah 1</dt><dd>{measurements.ones}</dd></div>
        <div><dt>Frekuensi 1</dt><dd>{measured}</dd></div>
      </dl>
      <div className="qe-actions">
        <button type="button" className="qe-button" onClick={() => setRunning(value => !value)}>{running ? 'Jeda pengukuran' : 'Mulai otomatis'}</button>
        <button type="button" className="qe-button qe-outline" onClick={() => { setRunning(false); setMeasurements(emptyMeasurements); }}>Reset</button>
      </div>
      <p className="qe-muted">Demo mengambil sampel dengan generator acak JavaScript. Ilustrasi ini hanya menunjukkan distribusi hasil pengukuran satu basis.</p>
    </article>
  );
}

export default function QuantumEvolutionPage() {
  return (
    <main className="qe-page" id="perkembangan-kuantum">
      <section className="qe-hero" aria-labelledby="qe-title" style={{ '--qe-photo': `url("${media.dwave.src}")` }}>
        <div className="qe-wrap qe-hero-inner">
          <p className="qe-kicker">Kajian Quantum Banking · Dasar kuantum</p>
          <h1 id="qe-title" tabIndex={-1}>Perkembangan<br /> Quantum Computing</h1>
          <p>Fondasi · Konsep · Algoritma · Hardware · Cloud · Advantage · AI Application</p>
          <div className="qe-actions">
            <a className="qe-button" href="#perkembangan-kuantum/teknologi">Jelajahi timeline</a>
            <a className="qe-button qe-outline" href="#perkembangan-kuantum/konsep">Coba demo</a>
          </div>
        </div>
        <p className="qe-hero-credit">
          <a href={media.dwave.source} target="_blank" rel="noreferrer">{media.dwave.caption} · {media.dwave.credit}</a>
          {' · '}<a href={media.dwave.license.url} target="_blank" rel="noreferrer">{media.dwave.license.label}</a>
        </p>
      </section>

      <div className="qe-wrap">
        <section className="qe-section" id="perkembangan-kuantum/teknologi" aria-labelledby="qe-technology">
          <p className="qe-kicker">01 · Timeline teknologi</p>
          <h2 id="qe-technology">Perkembangan Teknologi Quantum Computing</h2>
          <p className="qe-intro">Pilih topik, gunakan panah, atau geser slide di HP. Foto dan ilustrasi memberi konteks visual, sedangkan tautan di tiap slide merujuk pada kajiannya.</p>
          <Carousel id="qe-tech-slides" label="Timeline teknologi" items={slides} getLabel={item => item.title}>
            {item => (
              <article className="qe-slide">
                <div className="qe-slide-copy">
                  <p className="qe-kicker">{item.title} · {item.period}</p>
                  <h3>{item.heading}</h3>
                  <p>{item.text}</p>
                  <p className="qe-takeaway">{item.takeaway}</p>
                  <Sources items={item.sources} />
                </div>
                <Picture image={item.image} />
              </article>
            )}
          </Carousel>
        </section>

        <section className="qe-section" id="perkembangan-kuantum/konsep" aria-labelledby="qe-concepts">
          <p className="qe-kicker">02 · Konsep dan cara kerja</p>
          <h2 id="qe-concepts">Dari bit klasik ke qubit</h2>
          <p className="qe-intro">Komputer kuantum memakai amplitudo untuk merepresentasikan keadaan. Gerbang mengubah amplitudo tersebut, dan pengukuran menghasilkan nilai klasik.</p>
          <div className="qe-labs"><BitLab /><QubitLab /></div>
          <article className="qe-physics">
            <div>
              <p className="qe-kicker">Fokus fisika · Qubit superkonduktor</p>
              <h3>Apa yang terjadi saat suhu mendekati 0 K?</h3>
              <p>Qubit superkonduktor bekerja pada suhu milikelvin, di atas 0 K. Platform lain membentuk dan mengendalikan keadaan kuantum dengan kondisi yang berbeda.</p>
              {physics.map(([title, description], index) => (
                <details key={title} open={index === 0 ? true : undefined}>
                  <summary>{title}</summary><p>{description}</p>
                </details>
              ))}
              <Sources items={physicsSources} />
            </div>
            <Picture image="fridge" className="qe-diagram" />
          </article>
        </section>

        <section className="qe-section" id="perkembangan-kuantum/industri" aria-labelledby="qe-industry">
          <p className="qe-kicker">03 · Industri dan perkembangan</p>
          <h2 id="qe-industry">Siapa yang membangun dan menyediakan akses?</h2>
          <p className="qe-intro">Kartu membedakan peran pengembang perangkat, penyedia akses cloud, dan tim riset. Buka sumber resmi untuk menelusuri produk serta cakupannya.</p>
          <Carousel id="qe-industry-slides" label="Kartu industri" items={companies} getLabel={item => item.name}>
            {item => (
              <article className="qe-slide qe-company">
                <div className="qe-slide-copy">
                  <p className="qe-kicker">{item.type}</p>
                  <h3>{item.name}</h3>
                  <p>{item.summary}</p>
                  <Sources items={item.sources} />
                </div>
                {item.image ? <Picture image={item.image} /> : <div className="qe-company-mark" aria-hidden="true">{item.symbol}</div>}
              </article>
            )}
          </Carousel>
        </section>
        <a className="qe-back" href="#dasar-kuantum">← Kembali ke timeline homepage</a>
      </div>
    </main>
  );
}

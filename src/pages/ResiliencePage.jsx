import { useEffect, useRef, useState } from 'react';
import photo from '../assets/hero-b.jpg';
import ResilienceCanvas from '../components/ResilienceCanvas.jsx';
import content from '../data/ketahanan-kuantum.json';
import '../styles/resilience.css';
import '../styles/resilience-products.css';

const sections = Object.fromEntries(content.sections.map(section => [section.id, section]));
const transitionUrl = 'https://csrc.nist.gov/pubs/ir/8547/final';

function Section({ data, eyebrow, children }) {
  return (
    <section className="section" id={data.anchor} aria-labelledby={`qr-heading-${data.id}`}>
      <div className="intro">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={`qr-heading-${data.id}`}>{data.title}</h2>
        {data.text && <p>{data.text}</p>}
      </div>
      {children}
    </section>
  );
}

function AssetCarousel({ data }) {
  const track = useRef(null);
  const dialog = useRef(null);
  const drag = useRef(null);
  const [positions, setPositions] = useState([0]);
  const [active, setActive] = useState(0);
  const [detail, setDetail] = useState(null);
  const cardId = `qr-card-${data.id}`;
  const titleId = `qr-detail-${data.id}`;

  function nearestIndex(points, scrollLeft) {
    return points.reduce((best, point, index) =>
      Math.abs(point - scrollLeft) < Math.abs(points[best] - scrollLeft) ? index : best, 0);
  }

  function go(index) {
    const last = positions.length - 1;
    const target = Math.max(0, Math.min(last, index));
    track.current.scrollTo({
      left: positions[target],
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  }

  useEffect(() => {
    const element = track.current;
    let wheelTimer;

    function measure() {
      const limit = Math.max(0, element.scrollWidth - element.clientWidth);
      const first = element.firstElementChild;
      if (!first) return;
      const start = first.offsetLeft;
      const points = [];
      for (const card of element.children) {
        const point = Math.max(0, Math.min(card.offsetLeft - start, limit));
        if (!points.length || Math.abs(point - points[points.length - 1]) > 1) points.push(point);
      }
      setPositions(points);
      setActive(nearestIndex(points, element.scrollLeft));
    }

    function onWheel(event) {
      if (event.ctrlKey || event.shiftKey || !event.cancelable || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
      const factor = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientWidth : 1;
      const limit = element.scrollWidth - element.clientWidth;
      const next = Math.max(0, Math.min(limit, element.scrollLeft + event.deltaY * factor));
      if (Math.abs(next - element.scrollLeft) < 0.5) return;
      event.preventDefault();
      element.classList.add('qr-wheel-scrolling');
      element.scrollTo({ left: next, behavior: 'instant' });
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => element.classList.remove('qr-wheel-scrolling'), 160);
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    for (const card of element.children) observer.observe(card);
    element.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      observer.disconnect();
      element.removeEventListener('wheel', onWheel);
      clearTimeout(wheelTimer);
    };
  }, []);

  function stopDrag() {
    drag.current = null;
    track.current.classList.remove('qr-dragging');
  }

  function showDetail(item) {
    setDetail(item);
    dialog.current.showModal();
  }

  return (
    <div className="qr-assets" role="region" aria-roledescription="karusel" aria-label={data.title}>
      <div className="qr-asset-stage">
        <div id={cardId} ref={track} className="qr-asset-track" tabIndex={0} aria-label={data.title}
          onScroll={event => setActive(nearestIndex(positions, event.currentTarget.scrollLeft))}
          onKeyDown={event => {
            if (event.target !== event.currentTarget) return;
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
              event.preventDefault();
              go(active + (event.key === 'ArrowRight' ? 1 : -1));
            }
          }}
          onPointerDown={event => {
            if (event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest('a, button')) return;
            drag.current = { x: event.clientX, scroll: event.currentTarget.scrollLeft };
            event.currentTarget.setPointerCapture(event.pointerId);
            event.currentTarget.classList.add('qr-dragging');
          }}
          onPointerMove={event => {
            if (drag.current) event.currentTarget.scrollLeft = drag.current.scroll + drag.current.x - event.clientX;
          }}
          onPointerUp={stopDrag} onPointerCancel={stopDrag} onLostPointerCapture={stopDrag}>
          {data.items.map(item => {
            const href = item.cta?.href || item.source?.href;
            return (
              <article className="qr-asset-card" key={item.id}>
                <div className="qr-card-photo" aria-hidden="true" style={{ backgroundImage: `url("${photo}")` }} />
                <div className="qr-card-copy">
                  <p className="eyebrow">{item.scope || data.title}</p>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  {href ? <a className="cta" href={href}
                    target={href.startsWith('https://') ? '_blank' : undefined} rel="noreferrer">Learn More</a> :
                    <button type="button" className="cta" onClick={() => showDetail(item)}>Learn More</button>}
                </div>
              </article>
            );
          })}
        </div>
        <div className="qr-asset-arrows" aria-label="Navigasi kartu">
          <button type="button" aria-label={`${data.title}: sebelumnya`} onClick={() => go(active - 1)} disabled={active === 0}>‹</button>
          <button type="button" aria-label={`${data.title}: berikutnya`} onClick={() => go(active + 1)} disabled={active === positions.length - 1}>›</button>
        </div>
      </div>
      <div className="qr-asset-dots" role="group" aria-label="Pilih posisi kartu">
        {positions.map((position, index) => (
          <button type="button" key={index} aria-controls={cardId} aria-label={`Posisi ${index + 1}`}
            aria-pressed={active === index} onClick={() => go(index)} />
        ))}
      </div>
      <dialog className="qr-asset-dialog" ref={dialog} aria-labelledby={titleId}>
        <form method="dialog"><button className="cta" type="submit">Tutup</button></form>
        <h3 id={titleId}>{detail?.title}</h3>
        <p>{detail?.text}</p>
        <p className="meta">Versi lengkap belum ditautkan untuk materi ini.</p>
      </dialog>
    </div>
  );
}

export default function ResiliencePage() {
  const { hero, integration } = content;
  return (
    <main className="qr-page" id={content.id}>
      <section className="qr-hero" aria-labelledby="resilience-title" style={{ '--qr-photo': `url("${photo}")` }}>
        <div className="wrap qr-hero-inner">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1 id="resilience-title" tabIndex={-1}>{hero.title}</h1>
          <p>{hero.text}</p>
          <div className="qr-actions">
            {hero.actions.map((action, index) => (
              <a key={action.href} className={index === 0 ? 'cta' : 'cta qr-ghost'} href={action.href}>{action.label}</a>
            ))}
          </div>
        </div>
      </section>

      <div className="wrap">
        <Section data={sections['latar-belakang']} eyebrow="01 · Latar belakang">
          <div className="qr-exposure">
            {sections['latar-belakang'].items.map(item => (
              <article className="panel" key={item.id}><h3>{item.title}</h3><p>{item.text}</p></article>
            ))}
          </div>
        </Section>

        <Section data={sections.ancaman} eyebrow="02 · Ancaman dan mitigasi">
          <div className="qr-exposure" id="ketahanan-kuantum/paparan">
            {sections.ancaman.items.map(item => (
              <article className="panel" key={item.id}>
                <p className="eyebrow">Level {item.level}</p>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <p className="qr-follow-up"><strong>Tindak lanjut.</strong> {item.followUp}</p>
              </article>
            ))}
          </div>
          <p className="qr-note"><strong>Batas kesimpulan.</strong> Penilaian paparan bank tertentu memerlukan bukti konfigurasi, data, dan sistem yang digunakan.</p>
          <p className="meta"><a href={transitionUrl}>Rujukan transisi · NIST IR 8547 ↗</a></p>
        </Section>

        <Section data={sections['bagian-kajian']} eyebrow="03 · Alur kajian">
          <AssetCarousel data={sections['bagian-kajian']} />
        </Section>

        <Section data={sections.dokumen} eyebrow="04 · Dokumen penting">
          <div className="qr-document-grid">
            {sections.dokumen.items.map(item => (
              <article className="panel qr-document" key={item.id}>
                <p className="eyebrow">{item.format}</p>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                {item.href ? <a className="qr-asset-link" href={item.href}>Buka dokumen ↗</a> :
                  <p className="meta">Tautan belum tersedia</p>}
              </article>
            ))}
          </div>
          <p className="meta"><a href="#ketahanan-kuantum/canvas">Buka Canvas kajian ↓</a></p>
        </Section>

        <ResilienceCanvas />

        <Section data={sections['produk-kajian']} eyebrow="05 · Panduan dan produk kajian">
          <AssetCarousel data={sections['produk-kajian']} />
          {integration.homepageExplorationHref && <p className="meta"><a href={integration.homepageExplorationHref}>Buka Eksplorasi di homepage ↗</a></p>}
        </Section>

        <Section data={sections['standar-pqc']} eyebrow="06 · Standar teknis">
          <AssetCarousel data={sections['standar-pqc']} />
        </Section>

        <Section data={sections['respons-negara']} eyebrow="07 · Benchmark internasional">
          <AssetCarousel data={sections['respons-negara']} />
          <p className="qr-note">Gunakan instrumen ini sebagai pembanding. Periksa cakupan dan kekuatan tiap instrumen sebelum menerapkannya pada bank Indonesia.</p>
        </Section>

        <div className="qr-return">
          <a href="#jalur">← Kembali ke Beranda</a>
          <a href="https://rifqironanda.github.io/quantum_computing_for_banking/#overview">Lihat overview kajian awal ↗</a>
        </div>
      </div>
    </main>
  );
}

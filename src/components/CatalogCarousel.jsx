import { useEffect, useRef, useState } from 'react';
import photo from '../assets/hero-b.jpg';
import '../styles/resilience-products.css';

export default function CatalogCarousel({ data }) {
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
            const href = item.href || item.source?.href;
            return (
              <article className="qr-asset-card" key={item.id}>
                <div className="qr-card-photo" aria-hidden="true" style={{ backgroundImage: `url("${item.image || data.image || photo}")` }} />
                <div className="qr-card-copy">
                  <p className="eyebrow">{item.scope || data.title}</p>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <div className="qr-card-actions">
                    {href ? (
                      <a className="cta" href={href}
                        target={href.startsWith('https://') ? '_blank' : undefined}
                        rel="noreferrer">{item.action}</a>
                    ) : (
                      <button type="button" className="cta" onClick={() => showDetail(item)}>Baca ringkasan</button>
                    )}
                    {item.evidence && (
                      <a className="qr-card-source" href={item.evidence.source} target="_blank" rel="noreferrer"
                        aria-label={`Bukti ${item.title}: ${item.evidence.title}`}>Bukti ↗</a>
                    )}
                  </div>
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
        {positions.map((_, index) => (
          <button type="button" key={index} aria-controls={cardId} aria-label={`Posisi ${index + 1}`}
            aria-pressed={active === index} onClick={() => go(index)} />
        ))}
      </div>
      <dialog className="qr-asset-dialog" ref={dialog} aria-labelledby={titleId}>
        <form method="dialog"><button className="cta" type="submit">Tutup</button></form>
        <h3 id={titleId}>{detail?.title}</h3>
        <p>{detail?.text}</p>
      </dialog>
    </div>
  );
}

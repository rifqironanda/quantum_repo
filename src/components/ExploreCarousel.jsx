import { useEffect, useRef, useState } from 'react';
import { cards } from '../data/homeContent.json';
import photoA from '../assets/hero-a.jpg';
import photoB from '../assets/hero-b.jpg';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function cardPosition(track, index) {
  const item = track.children[index];
  return Math.min(item.offsetLeft - track.firstElementChild.offsetLeft, track.scrollWidth - track.clientWidth);
}

function getSlideCount(element) {
  const maxScroll = element.scrollWidth - element.clientWidth;
  for (let i = 0; i < cards.length; i++) {
    if (cardPosition(element, i) >= maxScroll) return i + 1;
  }
  return cards.length;
}

function getActiveSlide(element, count) {
  let nearest = 0;
  let nearestDistance = Infinity;
  for (let i = 0; i < count; i++) {
    const distance = Math.abs(cardPosition(element, i) - element.scrollLeft);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = i;
    }
  }
  return nearest;
}

export default function ExploreCarousel({ destination }) {
  const track = useRef(null);
  const dialog = useRef(null);
  const drag = useRef(null);
  const [active, setActive] = useState(0);
  const [detail, setDetail] = useState(null);
  const go = index => {
    const element = track.current;
    element.scrollTo({ left: cardPosition(element, Math.max(0, Math.min(cards.length - 1, index))), behavior: reducedMotion() ? 'instant' : 'smooth' });
  };
  const [slideCount, setSlideCount] = useState(cards.length);

  useEffect(() => {
    const element = track.current;

    function updateSlides() {
      const count = getSlideCount(element);
      setSlideCount(count);
      setActive(getActiveSlide(element, count));
    }

    updateSlides();

    const observer = new ResizeObserver(updateSlides);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!destination) return;
    const frame = requestAnimationFrame(() => {
      const element = track.current;
      element.scrollTo({ left: cardPosition(element, destination.index), behavior: reducedMotion() ? 'instant' : 'smooth' });
    });
    return () => cancelAnimationFrame(frame);
  }, [destination]);

  useEffect(() => {
    const element = track.current;
    let timer;
    function onWheel(event) {
      if (event.ctrlKey || event.shiftKey || !event.cancelable || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
      const factor = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientWidth : 1;
      const limit = element.scrollWidth - element.clientWidth;
      const next = Math.max(0, Math.min(limit, element.scrollLeft + event.deltaY * factor));
      if (Math.abs(next - element.scrollLeft) < 0.5) return;
      event.preventDefault();
      element.classList.add('is-wheel-scrolling');
      element.scrollTo({ left: next, behavior: 'instant' });
      clearTimeout(timer);
      timer = setTimeout(() => element.classList.remove('is-wheel-scrolling'), 160);
    }
    element.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      element.removeEventListener('wheel', onWheel);
      clearTimeout(timer);
      element.classList.remove('is-wheel-scrolling');
    };
  }, []);

  const stopDrag = () => {
    drag.current = null;
    track.current.classList.remove('is-dragging');
  };

  return <section className="section" id="eksplorasi">
    <div className="intro"><p className="eyebrow">Produk, fungsi bank, dan standar</p><h2>Eksplorasi Quantum Banking</h2>
      <p>Telusuri area eksperimen perbankan dan standar kriptografi dalam satu carousel.</p></div>
    <div className="explore-carousel" role="region" aria-label="Area optimasi dan standar kriptografi">
      <div className="explore-stage">
        <div ref={track} className="explore-track" tabIndex={0} aria-label="Kartu eksplorasi"
          onScroll={event => {
            setActive(getActiveSlide(event.currentTarget, slideCount));
          }}
          onKeyDown={event => {
            if (event.target !== event.currentTarget || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
            event.preventDefault();
            go(active + (event.key === 'ArrowRight' ? 1 : -1));
          }}
          onPointerDown={event => {
            if (event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest('button, a')) return;
            drag.current = { x: event.clientX, scroll: event.currentTarget.scrollLeft };
            event.currentTarget.setPointerCapture(event.pointerId);
            event.currentTarget.classList.add('is-dragging');
          }}
          onPointerMove={event => {
            if (!drag.current) return;
            event.currentTarget.scrollLeft = drag.current.scroll + drag.current.x - event.clientX;
          }}
          onPointerUp={stopDrag} onPointerCancel={stopDrag} onLostPointerCapture={stopDrag}>
          {cards.map(card => <article key={card.title} className={`explore-card ${card.standard ? 'standard' : 'optimization'}`}
            style={{ '--crop': card.crop, '--photo': `url("${card.standard ? photoB : photoA}")` }}>
            <div className="card-photo" aria-hidden="true" /><div className="copy">
              <p className="eyebrow">{card.label}</p><h3>{card.title}</h3><p>{card.description}</p>
              {card.url ? <a className="cta" href={card.url}>Learn More</a> :
                <button className="cta" type="button" onClick={() => { setDetail(card); dialog.current.showModal(); }}>Learn More</button>}
            </div>
          </article>)}
        </div>
        <div className="explore-arrows" aria-label="Navigasi kartu">
          <button type="button" aria-label="Kartu sebelumnya" onClick={() => go(active - 1)}>‹</button>
          <button type="button" aria-label="Kartu berikutnya" onClick={() => go(active + 1)}>›</button>
        </div>
      </div>
      <div className="explore-dots" aria-label="Pilih kartu eksplorasi">{cards.slice(0, slideCount).map((card, i) =>
        <button key={card.title} type="button" aria-label={card.title} aria-current={active === i} onClick={() => go(i)} />)}</div>
    </div>
    <dialog className="explore-detail" ref={dialog} aria-labelledby="explore-detail-title">
      <form method="dialog"><button type="submit" className="cta">Tutup</button></form>
      <h3 id="explore-detail-title">{detail?.title}</h3><p>{detail?.description}</p>
      <p className="meta">Contoh area eksperimen. Tautan resmi bank akan ditambahkan setelah proyek dan sumbernya ditetapkan.</p>
    </dialog>
  </section>;
}

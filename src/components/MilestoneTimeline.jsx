import { useRef, useState } from 'react';
import { milestones } from '../data/homeContent.json';
import useSwipe from './useSwipe.js';

export default function MilestoneTimeline() {
  const [index, setIndex] = useState(0);
  const rail = useRef(null);
  const select = (next, focus = false) => {
    next = Math.max(0, Math.min(milestones.length - 1, next));
    setIndex(next);
    const button = rail.current.querySelectorAll('button')[next];
    const { left, right } = button.getBoundingClientRect();
    const viewport = rail.current.getBoundingClientRect();
    if (left < viewport.left || right > viewport.right) {
      rail.current.scrollLeft += left < viewport.left ? left - viewport.left : right - viewport.right;
    }
    if (focus) button.focus({ preventScroll: true });
  };
  const swipe = useSwipe(direction => select(index + direction));
  return <section id="dasar-kuantum" className="section quantum-foundations" aria-labelledby="quantum-heading">
    <div className="intro"><p className="eyebrow">1982–2024 · Lima tonggak</p><h2 id="quantum-heading">Timeline perkembangan kuantum</h2>
      <p>Pilih tahun atau geser kartu di HP untuk menelusuri perkembangan dari kiri ke kanan.</p></div>
    <div className="milestone-timeline" role="region" aria-label="Timeline interaktif perkembangan kuantum">
      <ol ref={rail} className="milestone-rail" aria-label="Pilih tahun" onKeyDown={event => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        select(index + (event.key === 'ArrowRight' ? 1 : -1), true);
      }}>
        {milestones.map((item, i) => <li key={item.year}><button type="button" aria-pressed={index === i}
          aria-controls={`milestone-${item.year}`} onClick={() => select(i)}><span>{item.year}</span><small>{item.title}</small></button></li>)}
      </ol>
      <div className="milestone-deck" aria-live="polite" {...swipe}>
        {milestones.map((item, i) => <article key={item.year} id={`milestone-${item.year}`} className="milestone-card" data-year={item.year} hidden={i !== index}>
          <div><p className="eyebrow">{item.label}</p><h3>{item.title}</h3><p>{item.description}</p><a href={item.url}>{item.source}</a></div>
        </article>)}
      </div>
      <div className="milestone-controls">
        <button type="button" className="cta" aria-label="Tonggak sebelumnya" disabled={index === 0} onClick={() => select(index - 1)}>←</button>
        <span className="milestone-progress">{String(index + 1).padStart(2, '0')} / {String(milestones.length).padStart(2, '0')}</span>
        <button type="button" className="cta" aria-label="Tonggak berikutnya" disabled={index === milestones.length - 1} onClick={() => select(index + 1)}>→</button>
      </div>
    </div>
    <a 
      className="cta quantum-learn" 
      href="#perkembangan-kuantum">
      Learn More <span aria-hidden="true">↗</span></a>
  </section>;
}

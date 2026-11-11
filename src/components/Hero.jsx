import { useState, useEffect } from 'react';
import { heroes } from '../data/homeContent.json';
import photoA from '../assets/hero-a.jpg';
import photoB from '../assets/hero-b.jpg';
import useSwipe from './useSwipe.js';

const photos = [photoA, photoB];

export default function Hero() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (heroes.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timer = window.setInterval(() => {
      setIndex(current => (current + 1) % heroes.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  const step = direction => setIndex(value => (value + direction + heroes.length) % heroes.length);
  const swipe = useSwipe(step);
  return <section id="jalur" className="hero slider" aria-label="Dua jalur kajian" aria-roledescription="carousel"
    tabIndex={0} {...swipe} onKeyDown={event => {
      if (event.target !== event.currentTarget) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        step(event.key === 'ArrowRight' ? 1 : -1);
      }
    }}>
    <h1><span>Kajian</span><span>Quantum Banking</span></h1>
    {heroes.map((item, i) => 
    <article
      key={item.label}
      className={`slide hero-${i ? 'b' : 'a'}${index === i ? ' is-active' : ''}`}
      aria-hidden={index !== i}
    > 
      <img className="hero-photo" src={photos[i]} alt={item.alt} />
      <div className="copy"><p className="eyebrow"></p><h2>{item.title}</h2>
        <p>{item.description}</p>
        <a 
          className="cta" 
          href={i === 1 ? '#ketahanan-kuantum' : '#pemanfaatan-kuantum'} 
          onClick={i === 1 ? undefined : () => onExplore(item.start)}
          tabIndex={index === i ? 0 : -1}
        >
          Learn More
        </a>
      </div>
    </article>)}
    <div className="hero-dots" aria-label="Pilih jalur">
      {heroes.map((item, i) => (
      <button 
        key={item.label} 
        type="button" 
        aria-label={`${item.label}: ${item.title}`} 
        aria-pressed={index === i} 
        onClick={() => setIndex(i)} 
        />
      ))}
    </div>
  </section>;
}

import { useId, useState } from 'react';
import { geoEqualEarth, geoGraticule10, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import topology from 'world-atlas/countries-110m.json';
import { locations, regions } from '../data/mapCatalog.js';
import '../styles/map-section.css';

const width = 960;
const height = 490;
const projection = geoEqualEarth().fitExtent([[20, 20], [width - 20, height - 20]], { type: 'Sphere' });
const path = geoPath(projection);
const countries = feature(topology, topology.objects.countries).features
  .map(country => ({ id: country.id, name: country.properties.name, path: path(country) }));
const grid = path(geoGraticule10());
const mapped = new Set(locations.map(item => item.id));

function getFrame(bounds) {
  if (!bounds) return { x: 0, y: 0, scale: 1 };
  const [[west, north], [east, south]] = bounds;
  const corners = [[west, north], [east, north], [west, south], [east, south]].map(projection);
  const xs = corners.map(point => point[0]);
  const ys = corners.map(point => point[1]);
  const left = Math.min(...xs);
  const right = Math.max(...xs);
  const top = Math.min(...ys);
  const bottom = Math.max(...ys);
  const scale = Math.min((width - 56) / (right - left), (height - 48) / (bottom - top), 8);
  return { scale, x: (width - scale * (left + right)) / 2, y: (height - scale * (top + bottom)) / 2 };
}

function Preview({ location, id }) {
  return (
    <div className="atlas-tooltip" id={id} role="tooltip">
      <strong>{location.name}</strong>
      {location.newest && <span>Riset · {location.newest.milestone.title} ({location.newest.milestone.year})</span>}
      {location.benchmark && <span>Ketahanan · {location.benchmark.scope}</span>}
      <small>Klik untuk profil dan sumber</small>
    </div>
  );
}

function CountryProfile({ location, onClose }) {
  return (
    <article className="atlas-profile" aria-labelledby="atlas-profile-title">
      <div className="atlas-profile-heading">
        <div><p className="atlas-kicker">{location.code}</p><h3 id="atlas-profile-title">{location.name}</h3></div>
        <button type="button" onClick={onClose} aria-label="Tutup profil negara">×</button>
      </div>
      {location.benchmark && (
        <section>
          <h4>Ketahanan kuantum</h4>
          <p>{location.benchmark.text}</p>
          <a href={location.benchmark.source.href}>{location.benchmark.source.label} ↗</a>
        </section>
      )}
      {location.standards.length > 0 && (
        <section>
          <h4>Standar teknis</h4>
          <ul>{location.standards.map(item => <li key={item.id}><a href={item.source.href}>{item.title} ↗</a></li>)}</ul>
        </section>
      )}
      {location.projects.length > 0 && (
        <section>
          <h4>Riset komputasi kuantum</h4>
          <ul className="atlas-projects">{location.projects.map(({ bank, milestone }) => (
            <li key={bank.id}>
              <a href={`#pemanfaatan-kuantum/bank/${bank.id}`}>{bank.name}</a>
              <p>{milestone.year} · {milestone.title}</p>
              <small>{milestone.stage}</small>
              <a href={milestone.source}>Bukti riset ↗</a>
            </li>
          ))}</ul>
        </section>
      )}
    </article>
  );
}

export default function MapSection() {
  const [region, setRegion] = useState(regions[0]);
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const tooltipId = useId();
  const frame = getFrame(region.bounds);
  const visible = region.id === 'world' ? locations : locations.filter(item => item.region === region.id);

  function chooseRegion(next) {
    setRegion(next);
    setSelected(null);
    setHovered(null);
  }

  function chooseCountry(location) {
    setRegion(regions.find(item => item.id === location.region));
    setSelected(location);
    setHovered(null);
  }

  return (
    <section className="section" id="peta" aria-labelledby="geography-title">
      <div className="intro">
        <h2 id="geography-title">Peta Kajian Quantum Banking</h2>
        <p>Arahkan kursor ke titik negara untuk melihat ringkasan. Klik atau sentuh untuk membuka profil dan bukti.</p>
      </div>
      <div className="atlas">
        <div className="atlas-toolbar">
          <div className="atlas-regions" role="group" aria-label="Kawasan peta">
            {regions.map(item => (
              <button key={item.id} type="button" aria-pressed={item.id === region.id}
                onClick={() => chooseRegion(item)}>{item.label}</button>
            ))}
          </div>
          <label className="atlas-search">
            <span>Pilih negara</span>
            <select value={selected?.id ?? ''} onChange={event => {
              const location = locations.find(item => item.id === event.target.value);
              if (location) chooseCountry(location);
              else setSelected(null);
            }}>
              <option value="">Negara dalam katalog</option>
              {locations.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
        </div>
        <div className={selected ? 'atlas-content has-profile' : 'atlas-content'}>
          <div className="atlas-map">
            <svg viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
              <g transform={`translate(${frame.x} ${frame.y}) scale(${frame.scale})`}>
                <path className="atlas-grid" d={grid} />
                {countries.map(({ id, name, path: outline }) => (
                  <path key={id ?? name} d={outline}
                    className={id === selected?.id ? 'atlas-country is-selected' : mapped.has(id) ? 'atlas-country is-mapped' : 'atlas-country'} />
                ))}
              </g>
            </svg>
            {visible.map(location => {
              const [px, py] = projection(location.point);
              const x = (frame.x + px * frame.scale) / width * 100;
              const y = (frame.y + py * frame.scale) / height * 100;
              const showing = hovered === location.id;
              return (
                <div key={location.id} className={`atlas-point ${showing ? 'has-tooltip' : ''} ${y < 27 ? 'tooltip-below' : ''}`}
                  style={{ '--point-x': `${x}%`, '--point-y': `${y}%`, '--tooltip-x': `${x}%` }}>
                  <button type="button" className="atlas-marker" aria-label={location.name}
                    aria-pressed={selected?.id === location.id}
                    aria-describedby={showing ? tooltipId : undefined}
                    onFocus={() => setHovered(location.id)}
                    onBlur={() => setHovered(null)}
                    onPointerEnter={event => { if (event.pointerType !== 'touch') setHovered(location.id); }}
                    onPointerLeave={() => setHovered(null)}
                    onKeyDown={event => { if (event.key === 'Escape') setHovered(null); }}
                    onClick={() => chooseCountry(location)}>
                    <span aria-hidden="true" />
                  </button>
                  {showing && <Preview location={location} id={tooltipId} />}
                </div>
              );
            })}
          </div>
          {selected && <CountryProfile location={selected} onClose={() => setSelected(null)} />}
        </div>
        <div className="atlas-legend">
          <span><i className="atlas-legend-point" /> Negara dengan bukti</span>
          <span><i className="atlas-legend-fill" /> Belum dipetakan</span>
          <span>Data katalog lokal · <a href="https://www.naturalearthdata.com/about/terms-of-use/">Geometri Natural Earth ↗</a></span>
        </div>
      </div>
    </section>
  );
}

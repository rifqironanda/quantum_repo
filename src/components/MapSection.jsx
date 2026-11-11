import { useState } from 'react';
import worldMap from '../assets/world-map.svg';
import banks from '../data/utilizationBanks.json';
import { resilienceSections } from '../data/explorationCatalog.js';

const [guides, standards, benchmarks] = resilienceSections;
const regions = [...new Set([...benchmarks.items.map(item => item.title), ...banks.map(bank => bank.region)])];
const euMembers = ['Spanyol', 'Italia'];

export default function MapSection() {
  const [region, setRegion] = useState(regions[0]);
  const benchmark = benchmarks.items.find(item => item.title === (euMembers.includes(region) ? 'Uni Eropa' : region));
  const localBanks = banks.filter(bank => region === 'Uni Eropa' ? euMembers.includes(bank.region) : bank.region === region);

  return (
    <section className="section" id="peta" aria-labelledby="geography-title">
      <div className="intro">
        <h2 id="geography-title">Standar, panduan, dan riset per negara</h2>
        <p>Pilih negara atau kawasan untuk menelusuri instrumen dan bukti dalam katalog.</p>
      </div>
      <div className="panel map">
        <img src={worldMap} alt="Peta dunia" width="720" height="284" loading="lazy" />
        <div className="controls geo-controls" role="group" aria-label="Negara atau kawasan">
          {regions.map(name => <button key={name} type="button" aria-pressed={region === name}
            onClick={() => setRegion(name)}>{name}</button>)}
        </div>
        <article className="geo-detail" aria-live="polite">
          <h3>{region}</h3>
          <dl>
            <div>
              <dt>Standar teknis</dt>
              <dd>{region === 'Amerika Serikat'
                ? <ul>{standards.items.map(item => <li key={item.id}><a href={item.source.href}>{item.title} ↗</a></li>)}</ul>
                : <>Katalog teknis memuat <a href="#ketahanan-kuantum/standar-pqc">standar NIST</a> sebagai pembanding internasional.</>}</dd>
            </div>
            <div>
              <dt>Panduan dan respons</dt>
              <dd>{benchmark
                ? <>{benchmark.text} <a href={benchmark.source.href}>{benchmark.source.label} ↗</a></>
                : <>Rujukan kebijakan khusus belum terpetakan. <a href={guides.items[1].source.href}>Lihat roadmap BIS ↗</a></>}</dd>
            </div>
            <div>
              <dt>Riset bank</dt>
              <dd>{localBanks.length
                ? <ul>{localBanks.map(bank => <li key={bank.id}><a href={`#pemanfaatan-kuantum/bank/${bank.id}`}>{bank.name}</a></li>)}</ul>
                : 'Riset bank belum terpetakan dalam katalog ini.'}</dd>
            </div>
          </dl>
        </article>
      </div>
    </section>
  );
}

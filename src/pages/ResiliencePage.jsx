import photo from '../assets/hero-b.jpg';
import ResilienceCanvas from '../components/ResilienceCanvas.jsx';
import content from '../data/ketahanan-kuantum.json';
import '../styles/resilience.css';
import CatalogCarousel from '../components/CatalogCarousel.jsx';
import { resilienceSections } from '../data/explorationCatalog.js';

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

export default function ResiliencePage() {
  const { hero } = content;
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
          <CatalogCarousel data={sections['bagian-kajian']} />
        </Section>

        {resilienceSections.map(section => (
          <Section key={section.id} data={section} eyebrow={section.eyebrow}>
            <CatalogCarousel data={section} />
          </Section>
        ))}

        <ResilienceCanvas />

        <div className="qr-return">
          <a href="#jalur">← Kembali ke Beranda</a>
          <a href="https://rifqironanda.github.io/quantum_computing_for_banking/#overview">Lihat overview kajian awal ↗</a>
        </div>
      </div>
    </main>
  );
}

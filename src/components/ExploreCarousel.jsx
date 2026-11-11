import CatalogCarousel from './CatalogCarousel.jsx';
import { homepageCards } from '../data/explorationCatalog.js';

export default function ExploreCarousel() {
  const title = 'Eksplorasi Quantum Banking';
  return (
    <section className="section" id="eksplorasi" aria-labelledby="exploration-title">
      <div className="intro">
        <h2 id="exploration-title">{title}</h2>
        <p>Tiga studi bank dan tiga pintu masuk ke kajian ketahanan kuantum.</p>
      </div>
      <CatalogCarousel data={{ id: 'homepage', title, items: homepageCards }} />
    </section>
  );
}

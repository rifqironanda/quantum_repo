import worldMap from '../assets/world-map.svg';

export default function MapSection() {
  return (
<section className="section" id="peta">
<div className="intro">
<p className="eyebrow">Geografi</p>
<h2>Peta bank dan otoritas</h2>
<p>Pratinjau geografis untuk menelusuri bank, otoritas keuangan, dan badan standardisasi. Penanda institusi menunggu data terverifikasi.</p>
</div>
<div className="panel map">
<img src={worldMap} alt="Pratinjau peta dunia" width="720" height="284" />
<div className="controls">
<a className="cta" href="https://www.figma.com/design/QUroo4PAAkL4JQ6BkoPhBW?node-id=10-10">Buka prototipe peta ↗</a>
</div>
</div>
</section>
  );
}

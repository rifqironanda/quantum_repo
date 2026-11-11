import { useEffect, useState } from 'react';
import SiteHeader from './components/SiteHeader.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import HomePage from './pages/HomePage.jsx';
import ResiliencePage from './pages/ResiliencePage.jsx';
import UtilizationPage from './pages/UtilizationPage.jsx';
import QuantumEvolutionPage from './pages/QuantumEvolutionPage.jsx';

export default function App() {
  const [hash, setHash] = useState(window.location.hash);
  const showResilience = hash === '#ketahanan-kuantum' || hash.startsWith('#ketahanan-kuantum/');
  const showUtilization = hash === '#pemanfaatan-kuantum' || hash.startsWith('#pemanfaatan-kuantum/');
  const showEvolution = hash === '#perkembangan-kuantum' || hash.startsWith('#perkembangan-kuantum/');

  useEffect(() => {
    function onChange() {
      const current = window.location.hash;
      const hash = current.replace(/^#konsep-dan-perkembangan(?=\/|$)/, '#perkembangan-kuantum');
      if (hash !== current) window.history.replaceState(null, '', hash);
      setHash(hash);
    }

    onChange();
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  useEffect(() => {

    // Jalur A: Pemanfaatan Kuantum
    if (showUtilization) {
      document.title = 'Pemanfaatan Komputasi Kuantum | Quantum Banking';

      if (hash === '#pemanfaatan-kuantum') {
        window.scrollTo(0, 0);
        document.getElementById('utilization-title')?.focus({ preventScroll: true });
      } else {
        document.getElementById(hash.slice(1))?.scrollIntoView();
      }

      return;
    }

    // Jalur B: Ketahanan Kuantum
    if (showResilience) {
      document.title = 'Ketahanan terhadap Ancaman Kuantum | Quantum Banking';

      if (hash === '#ketahanan-kuantum') {
        window.scrollTo(0, 0);
        document.getElementById('resilience-title')?.focus({ preventScroll: true });
      } else {
        document.getElementById(hash.slice(1))?.scrollIntoView();
      }

      return;
    }

    // Halamaan Perkembangan Kuantum
    if (showEvolution) {
      document.title = 'Perkembangan Komputasi Kuantum | Quantum Banking';
      
      if (hash === '#perkembangan-kuantum') {
        window.scrollTo(0, 0);
        document.getElementById('qe-title')
          ?.focus({ preventScroll: true });
      } else {
        document.getElementById(hash.slice(1))?.scrollIntoView();
      }
      return;
    }

    // Hompage atau halaman konsep
    document.title = 'Kajian Quantum Banking';
    
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    }

  }, [
    hash, 
    showResilience, 
    showUtilization,
    showEvolution
  ]);

    return (
    <>
      <SiteHeader />

      {showUtilization ? (
        <UtilizationPage bankId={hash.split('/')[2]} />
      ) : showResilience ? (
        <ResiliencePage />
      ) : showEvolution ? (
        <QuantumEvolutionPage />
      ) : (
        <HomePage />
      )}

      <SiteFooter />
    </>
  );
}


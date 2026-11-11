import { useState } from 'react';
import Hero from '../components/Hero.jsx';
import EvidentSection from '../components/EvidentSection.jsx';
import ExploreCarousel from '../components/ExploreCarousel.jsx';
import MapSection from '../components/MapSection.jsx';
import MilestoneTimeline from '../components/MilestoneTimeline.jsx';
import ResearchSection from '../features/research/ResearchSection.jsx';

export default function HomePage() {
  const [destination, setDestination] = useState(null);
  return <main id="home">
    <Hero onExplore={index => setDestination({ index })} />
    <div className="wrap">
      <EvidentSection />
      <ExploreCarousel destination={destination} />
      <MapSection />
      <MilestoneTimeline />
      <ResearchSection />
    </div>
  </main>;
}

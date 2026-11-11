import Hero from '../components/Hero.jsx';
import EvidentSection from '../components/EvidentSection.jsx';
import ExploreCarousel from '../components/ExploreCarousel.jsx';
import MapSection from '../components/MapSection.jsx';
import MilestoneTimeline from '../components/MilestoneTimeline.jsx';
import ResearchSection from '../features/research/ResearchSection.jsx';

export default function HomePage() {
  return <main id="home">
    <Hero />
    <div className="wrap">
      <EvidentSection />
      <ExploreCarousel />
      <MapSection />
      <MilestoneTimeline />
      <ResearchSection />
    </div>
  </main>;
}

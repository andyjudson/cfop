import { useState, useEffect } from 'react';
import { MdVideocam, MdTimer } from 'react-icons/md';
import 'bulma/css/bulma.min.css';
import '../App.css';
import { DemoModal } from '../components/DemoModal';
import { PracticeSessionModal } from '../components/PracticeSessionModal';
import { CfopPageLayout } from '../components/CfopPageLayout';
import { AlgorithmCard, type CfopAlgorithm } from '../components/AlgorithmCard';

const essentialIds = ['oll_sune', 'oll_antisune', 'pll_t', 'pll_ua', 'pll_h'];

function BGRPage() {
  const [algorithms, setAlgorithms] = useState<CfopAlgorithm[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDemo, setShowDemo] = useState(false);
  const [demoAlgorithm, setDemoAlgorithm] = useState<CfopAlgorithm | null>(null);
  const [showPracticeSession, setShowPracticeSession] = useState(false);

  useEffect(() => {
    const loadAlgorithms = async () => {
      try {
        const response = await fetch('/cubing.spec/data/algs-cfop-bgr.json');
        const data = await response.json();
        setAlgorithms(data);
      } catch (error) {
        console.error('Failed to load algorithms:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAlgorithms();
  }, []);

  const ollEdges = algorithms.filter(alg => alg.method === 'oll' && alg.group === 'edge');
  const ollCorners = algorithms.filter(alg => alg.method === 'oll' && alg.group === 'corner');
  const pllCorners = algorithms.filter(alg => alg.method === 'pll' && alg.group === 'corner');
  const pllEdges = algorithms.filter(alg => alg.method === 'pll' && alg.group === 'edge');
  const essentialsSummary = essentialIds
    .map(id => algorithms.find(alg => alg.id === id)?.name)
    .filter((name): name is string => Boolean(name))
    .join(', ');

  if (loading) {
    return <div className="loading">Loading 2-look algorithms...</div>;
  }

  const handleOpenDemo = () => {
    if (algorithms.length > 0) {
      const randomAlg = algorithms[Math.floor(Math.random() * algorithms.length)];
      setDemoAlgorithm(randomAlg);
      setShowDemo(true);
    }
  };

  const handleCloseDemo = () => {
    setShowDemo(false);
    setDemoAlgorithm(null);
  };

  const handleOpenPracticeSession = () => {
    setShowPracticeSession(true);
  };

  const handleClosePracticeSession = () => {
    setShowPracticeSession(false);
  };

  const renderAlgorithmSection = (title: string, algs: CfopAlgorithm[]) => (
    <section className="section">
      <h2 className="title is-4 has-text-centered section-title">{title}</h2>
      <div className="columns is-multiline">
        {algs.map(alg => (
          <div key={alg.id} className="column is-one-third-desktop is-half-tablet">
            <AlgorithmCard algorithm={alg} variant="standard" />
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <CfopPageLayout
      pageTitle="Beginner Methods"
      subtitle="Learn to solve last layer with just 9 essential OLL and PLL algorithms and 2-look methods"
      introImageSrc="/cubing.spec/assets/cfop_solved.png"
      introImageAlt="Solved cube overview for CFOP 2-look intro"
      introContent={
        <>
          <p className="mb-0">
            <strong>2-look</strong> beginner methods simplify the last layer by breaking OLL and PLL into smaller subsets, 
            reducing the algorithm count to just 9 cases, but require repetition. Learn these first to solve reliably around 1 to 2 minutes, 
            then expand to full OLL/PLL, and lastly full F2L or advanced techniques like scan ahead.
          </p>
          <p className="mt-2 mb-0">
            <strong>Essentials:</strong> {essentialsSummary}
          </p>
        </>
      }
    >
      <div className="has-text-centered mb-5 button-row">
        <button
          className="button is-link is-light demo-button"
          onClick={handleOpenPracticeSession}
          aria-label="Open scramble and timer practice session"
        >
          <MdTimer size={18} />
          <span>Practice Scramble + Timer</span>
        </button>

        <button 
          className="button is-primary demo-button"
          onClick={handleOpenDemo}
          aria-label="Open random algorithm demo"
        >
          <MdVideocam size={18} />
          <span>Demo Random Algorithm</span>
        </button>
      </div>

      <main>
        {renderAlgorithmSection("OLL Edge Cases", ollEdges)}
        {renderAlgorithmSection("OLL Corner Cases", ollCorners)}
        {renderAlgorithmSection("PLL Corner Cases", pllCorners)}
        {renderAlgorithmSection("PLL Edge Cases", pllEdges)}
      </main>

      {showDemo && demoAlgorithm && (
        <DemoModal algorithm={demoAlgorithm} onClose={handleCloseDemo} />
      )}

      <PracticeSessionModal
        isOpen={showPracticeSession}
        onClose={handleClosePracticeSession}
      />
    </CfopPageLayout>
  );
}

export default BGRPage;

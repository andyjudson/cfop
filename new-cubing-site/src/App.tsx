import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { MdStar, MdVideocam } from 'react-icons/md';
import 'bulma/css/bulma.min.css';
import './App.css';
import { DemoModal } from './components/DemoModal';

interface CfopAlgorithm {
  id: string;
  name: string;
  notation: string;
  method: string;
  group: string;
  image: string;
  notes: string;
}

const essentialIds = ['oll_sune', 'oll_antisune', 'pll_t', 'pll_ua', 'pll_h'];

function App() {
  const [algorithms, setAlgorithms] = useState<CfopAlgorithm[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredAlg, setHoveredAlg] = useState<string | null>(null);
  const [tooltipLeft, setTooltipLeft] = useState<boolean>(false);
  const [showDemo, setShowDemo] = useState(false);
  const [demoAlgorithm, setDemoAlgorithm] = useState<CfopAlgorithm | null>(null);

  useEffect(() => {
    const loadAlgorithms = async () => {
      try {
        const response = await fetch('/data/algs-cfop-bgr.json');
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

  const handleMouseEnter = (algId: string, event: React.MouseEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    const rect = img.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    
    // Check if there's enough space on the right (tooltip width ~300px + margin)
    const spaceOnRight = viewportWidth - rect.right;
    setTooltipLeft(spaceOnRight < 350);
    setHoveredAlg(algId);
  };

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

  const renderAlgorithmSection = (title: string, algs: CfopAlgorithm[]) => (
    <section className="section">
      <h2 className="title is-4 has-text-centered section-title">{title}</h2>
      <div className="columns is-multiline">
        {algs.map(alg => (
          <div key={alg.id} className="column is-one-third-desktop is-half-tablet">
            <div className="card algo-card">
              <div className="card-content has-text-centered">
                <div className="image-container">
                  <img 
                    src={alg.image} 
                    alt={alg.name}
                    onMouseEnter={(e) => handleMouseEnter(alg.id, e)}
                    onMouseLeave={() => setHoveredAlg(null)}
                    onClick={(e) => {
                      if (hoveredAlg === alg.id) {
                        setHoveredAlg(null);
                      } else {
                        handleMouseEnter(alg.id, e);
                      }
                    }}
                  />
                  {hoveredAlg === alg.id && alg.notes && (
                    <div className={`tooltip ${tooltipLeft ? 'tooltip-left' : ''}`}>
                      <Markdown>{alg.notes}</Markdown>
                    </div>
                  )}
                </div>
                <h3 className="title is-5 mt-3">{alg.name}</h3>
                {essentialIds.includes(alg.id) && (
                  <span className="essential-pill">
                    <MdStar size={14} />
                  </span>
                )}
                <div className="content">
                  <code className="notation">{alg.notation}</code>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="container py-5 app-shell">
      <section className="section pt-0 has-text-centered">
        <h1 className="title is-2">Cubing - Learning CFOP 2LK Methodology</h1>
        <p className="subtitle is-5">Essential OLL and PLL algorithms for solving the last layer for a 3x3x3 Rubik's cube. Assumes you've learnt intuitive Cross and F2L.</p>
        <p className="essentials-summary"><strong>Essentials:</strong> {essentialsSummary}</p>
      </section>
      
      <div className="has-text-centered mb-5">
        <button 
          className="button is-primary demo-button"
          onClick={handleOpenDemo}
        >
          <MdVideocam size={18} />
          <span>Demo Random Algorithm</span>
        </button>
      </div>

      <main>
        {renderAlgorithmSection("OLL edge cases", ollEdges)}
        {renderAlgorithmSection("OLL corner cases", ollCorners)}
        {renderAlgorithmSection("PLL corner cases", pllCorners)}
        {renderAlgorithmSection("PLL edge cases", pllEdges)}
      </main>

      {showDemo && demoAlgorithm && (
        <DemoModal algorithm={demoAlgorithm} onClose={handleCloseDemo} />
      )}
    </div>
  );
}

export default App;

import { useState, useEffect } from 'react';
import 'bulma/css/bulma.min.css';
import '../App.css';
import { CfopPageLayout } from '../components/CfopPageLayout';
import { AlgorithmCard, AlgorithmNotesSheet, type CfopAlgorithm } from '../components/AlgorithmCard';

const essentialIds = ['oll_cross_line','oll_sune', 'oll_antisune', 'pll_t', 'pll_ua', 'pll_h'];

function BGRPage() {
  const [algorithms, setAlgorithms] = useState<CfopAlgorithm[]>([]);
  const [loading, setLoading] = useState(true);
  const [notesAlg, setNotesAlg] = useState<CfopAlgorithm | null>(null);

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

  const renderAlgorithmSection = (title: string, algs: CfopAlgorithm[]) => (
    <section className="section">
      <h2 className="title is-4 has-text-centered section-title">{title}</h2>
      <div className="columns is-multiline">
        {algs.map(alg => (
          <div key={alg.id} className="column is-one-third-desktop is-half-tablet">
            <AlgorithmCard
                algorithm={alg}
                variant="standard"
                isEssential={essentialIds.includes(alg.id)}
                onShowNotes={setNotesAlg}
              />
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
            Beginner <strong>2-look</strong> methods simplify the last layer by breaking OLL and PLL into smaller subsets,
            reducing the algorithm count to around 5 to 12 cases, but require repetition.
            Learn these first to solve reliably around 1 to 2 minutes, then expand to full OLL/PLL, and lastly full F2L.
          </p>
          <p className="mt-2 mb-0">
            <strong>Essentials Cases:</strong> {essentialsSummary}
          </p>
        </>
      }
    >
      <main>
        {renderAlgorithmSection("OLL Edge Cases", ollEdges)}
        {renderAlgorithmSection("OLL Corner Cases", ollCorners)}
        {renderAlgorithmSection("PLL Corner Cases", pllCorners)}
        {renderAlgorithmSection("PLL Edge Cases", pllEdges)}
      </main>

      <AlgorithmNotesSheet algorithm={notesAlg} onClose={() => setNotesAlg(null)} />
    </CfopPageLayout>
  );
}

export default BGRPage;

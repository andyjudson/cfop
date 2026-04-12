import { useState, useEffect } from 'react';
import 'bulma/css/bulma.min.css';
import '../App.css';
import { CfopPageLayout } from '../components/CfopPageLayout';
import { AlgorithmCard, AlgorithmNotesSheet, type CfopAlgorithm } from '../components/AlgorithmCard';

const essentialIds = ['oll_cross_line','oll_cross_hook','oll_sune', 'oll_antisune', 'pll_t', 'pll_ua', 'pll_h'];

function BGRPage() {
  const [algorithms, setAlgorithms] = useState<CfopAlgorithm[]>([]);
  const [notesAlg, setNotesAlg] = useState<CfopAlgorithm | null>(null);

  useEffect(() => {
    const loadAlgorithms = async () => {
      try {
        const response = await fetch(import.meta.env.BASE_URL + 'data/algs-cfop-bgr.json');
        const data = await response.json();
        setAlgorithms(data);
      } catch (error) {
        console.error('Failed to load algorithms:', error);
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

const renderAlgorithmSection = (title: string, description: string, algs: CfopAlgorithm[]) => (
    <section className="section">
      <h2 className="title is-4 section-title">{title}</h2>
      <p className="mt-0 mb-4 ml-4 section-description">{description}</p>
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
      subtitle="Learn to solve last layer with a subset of essential OLL and PLL algorithms and 2-look methods"
      introImageSrc="/cubing.spec/assets/cfop_solved.png"
      introImageAlt="Solved cube overview for CFOP 2-look intro"
      introContent={
        <>
          <p className="mb-0">
            Beginner <strong>2-look</strong> methods simplify the last layer by splitting OLL and PLL
            into 4 steps — orient edges, orient corners, permute corners, permute edges — reducing
            the algorithm count to as few as 7 essential cases, or 16 in total.
            Learn these to solve reliably in 1-2 minutes, then progress to full OLL or PLL.
          </p>
          <p className="mt-2 mb-0">
            <strong>Minimum to solve any last layer:</strong> {essentialsSummary}
          </p>
        </>
      }
    >
      <main>
        {renderAlgorithmSection("OLL Edge Cases", "Step 1: orientate edge cubelets to create the yellow cross.", ollEdges)}        
        {renderAlgorithmSection("OLL Corner Cases", "Step 2: orientate corner cubelets to solve the yellow face.", ollCorners)}
        {renderAlgorithmSection("PLL Corner Cases", "Step 3: permute corner cubelets to match the side faces.", pllCorners)}
        {renderAlgorithmSection("PLL Edge Cases", "Step 4: permute edge cubelets to solve the cube!!", pllEdges)}
      </main>

      <AlgorithmNotesSheet algorithm={notesAlg} onClose={() => setNotesAlg(null)} />
    </CfopPageLayout>
  );
}

export default BGRPage;

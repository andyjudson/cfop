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
      subtitle="Learn to solve last layer with just 9 essential OLL and PLL algorithms and 2-look methods"
      introImageSrc="/cubing.spec/assets/cfop_solved.png"
      introImageAlt="Solved cube overview for CFOP 2-look intro"
      introContent={
        <>
          <p className="mb-0">
            Beginner <strong>2-look</strong> methods simplify the last layer by breaking OLL and PLL into smaller subsets 
            - solve edges and corners separately per stage, reducing the algorithm count to around 5 to 12 cases, but require repetition.
            Learn these first to solve reliably around 1 to 2 minutes, then expand to full OLL/PLL, and lastly full F2L.
          </p>
          <p className="mt-2 mb-0">
            <strong>Minimum to solve any last layer:</strong> {essentialsSummary}
          </p>
        </>
      }
    >
      <main>
        {renderAlgorithmSection("OLL Edge Cases", "Stage 1 of 4: create yellow cross.", ollEdges)}        
        {renderAlgorithmSection("OLL Corner Cases", "Stage 2 of 4: orientate yellow corners, forming the layer.", ollCorners)}
        {renderAlgorithmSection("PLL Corner Cases", "Stage 3 of 4: perumtate corner cubelets.", pllCorners)}
        {renderAlgorithmSection("PLL Edge Cases", "Stage 4 of 4: permutate edge cubelets, solving the cube!", pllEdges)}
      </main>

      <AlgorithmNotesSheet algorithm={notesAlg} onClose={() => setNotesAlg(null)} />
    </CfopPageLayout>
  );
}

export default BGRPage;

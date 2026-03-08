import { useState, useEffect } from 'react';
import 'bulma/css/bulma.min.css';
import { CfopPageLayout } from '../components/CfopPageLayout';
import { AlgorithmGroupSection } from '../components/AlgorithmGroupSection';
import { ExpandCollapseControls } from '../components/ExpandCollapseControls';
import { useSectionToggle } from '../hooks/useSectionToggle';
import { ErrorBoundary } from '../components/ErrorBoundary';

interface CfopAlgorithm {
  id: string;
  name: string;
  notation: string;
  method: string;
  group: string;
  image: string;
  notes?: string;
}

interface GroupedAlgorithms {
  [group: string]: CfopAlgorithm[];
}

function PLLPage() {
  const [algorithms, setAlgorithms] = useState<CfopAlgorithm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadAlgorithms = async () => {
      try {
        const response = await fetch('/cubing.spec/data/algs-cfop-pll.json');
        if (!response.ok) {
          throw new Error(`Failed to load PLL algorithms: ${response.statusText}`);
        }
        const data = await response.json();
        setAlgorithms(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load PLL algorithms'));
      } finally {
        setLoading(false);
      }
    };

    loadAlgorithms();
  }, []);

  // Group algorithms by group
  const groupedAlgorithms: GroupedAlgorithms = algorithms.reduce((acc, alg) => {
    if (!acc[alg.group]) {
      acc[alg.group] = [];
    }
    acc[alg.group].push(alg);
    return acc;
  }, {} as GroupedAlgorithms);

  const groupIds = Object.keys(groupedAlgorithms);
  const { sectionState, toggleSection, expandAll, collapseAll } = useSectionToggle('pll', groupIds);

  if (loading) {
    return (
          <CfopPageLayout pageTitle="PLL" subtitle="Permute Last Layer - 21 cases">
        <div className="loading has-text-centered">Loading PLL algorithms...</div>
      </CfopPageLayout>
    );
  }

  if (error) {
    throw error;
  }

  return (
    <CfopPageLayout
      pageTitle="PLL Algorithms"
      subtitle="Permute Last Layer - 21 cases across 5 groups"
      introImageSrc="/cubing.spec/assets/cfop_pll.png"
      introImageAlt="PLL stage illustration"
      introContent={
        <p className="mb-0">
          <strong>PLL</strong> (Permutation of the Last Layer) - The goal of the fourth step is to solve the cube by
          repositioning last-layer pieces. There are 21 total cases, or a smaller set when using 2-look methods.
        </p>
      }
    >
      <ExpandCollapseControls
        onExpandAll={expandAll}
        onCollapseAll={collapseAll}
      />

      {groupIds.map(groupId => (
        <AlgorithmGroupSection
          key={groupId}
          title={groupId}
          groupId={groupId}
          initialExpanded={sectionState[groupId]}
          onToggle={toggleSection}
        >
          <div className="columns is-multiline">
            {groupedAlgorithms[groupId].map(alg => (
              <div key={alg.id} className="column is-one-third-desktop is-half-tablet">
                <div className="card algo-card algo-card-compact">
                  <div className="card-content has-text-centered">
                    <div className="image-container">
                      <img 
                        src={alg.image} 
                        alt={alg.name}
                      />
                    </div>
                    <h3 className="title is-5 mt-3">{alg.name}</h3>
                    <div className="content">
                      <code className="notation">{alg.notation}</code>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AlgorithmGroupSection>
      ))}
    </CfopPageLayout>
  );
}

function PLLPageWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <PLLPage />
    </ErrorBoundary>
  );
}

export default PLLPageWithErrorBoundary;

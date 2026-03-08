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

function F2LPage() {
  const [algorithms, setAlgorithms] = useState<CfopAlgorithm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadAlgorithms = async () => {
      try {
        const response = await fetch('/cubing.spec/data/algs-cfop-f2l.json');
        if (!response.ok) {
          throw new Error(`Failed to load F2L algorithms: ${response.statusText}`);
        }
        const data = await response.json();
        setAlgorithms(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load F2L algorithms'));
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
  const { sectionState, toggleSection, expandAll, collapseAll } = useSectionToggle('f2l', groupIds);

  if (loading) {
    return (
      <CfopPageLayout pageTitle="F2L" subtitle="First Two Layers - 41 cases">
        <div className="loading has-text-centered">Loading F2L algorithms...</div>
      </CfopPageLayout>
    );
  }

  if (error) {
    throw error;
  }

  return (
    <CfopPageLayout
      pageTitle="F2L Algorithms"
      subtitle="First Two Layers - 41 cases across 6 groups"
      introImageSrc="/cubing.spec/assets/cfop_f2l.png"
      introImageAlt="F2L stage illustration"
      introContent={
        <p className="mb-0">
          <strong>F2L</strong> (First Two Layers) - The goal of the second step is to solve the first two layers by
          inserting edge-corner pairs in the four slots around the cross. There are 41 possible cases, but intuitive
          approaches reduce this to a smaller practical subset when pairs are already in the top layer.
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

function F2LPageWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <F2LPage />
    </ErrorBoundary>
  );
}

export default F2LPageWithErrorBoundary;

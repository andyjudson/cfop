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

function OLLPage() {
  const [algorithms, setAlgorithms] = useState<CfopAlgorithm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadAlgorithms = async () => {
      try {
        const response = await fetch('/cubing.spec/data/algs-cfop-oll.json');
        if (!response.ok) {
          throw new Error(`Failed to load OLL algorithms: ${response.statusText}`);
        }
        const data = await response.json();
        setAlgorithms(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load OLL algorithms'));
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
  const { sectionState, toggleSection, expandAll, collapseAll } = useSectionToggle('oll', groupIds);

  if (loading) {
    return (
      <CfopPageLayout pageTitle="OLL" subtitle="Orient Last Layer - 57 cases">
        <div className="loading has-text-centered">Loading OLL algorithms...</div>
      </CfopPageLayout>
    );
  }

  if (error) {
    throw error;
  }

  return (
    <CfopPageLayout
      pageTitle="OLL"
      subtitle="Orient Last Layer - 57 cases across 7 groups"
      introContent={
        <p className="mb-0">
          <strong>OLL</strong> (Orientation of the Last Layer) - The goal of the third step is to make the top face
          a single color. There are 57 total cases, or a much smaller set when using 2-look methods.
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

function OLLPageWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <OLLPage />
    </ErrorBoundary>
  );
}

export default OLLPageWithErrorBoundary;

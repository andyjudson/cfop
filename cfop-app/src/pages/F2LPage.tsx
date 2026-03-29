import { useState, useEffect } from 'react';
import 'bulma/css/bulma.min.css';
import { CfopPageLayout } from '../components/CfopPageLayout';
import { AlgorithmGroupSection } from '../components/AlgorithmGroupSection';
import { ExpandCollapseControls } from '../components/ExpandCollapseControls';
import { useSectionToggle } from '../hooks/useSectionToggle';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { AlgorithmCard, type CfopAlgorithm } from '../components/AlgorithmCard';

interface GroupedAlgorithms {
  [group: string]: CfopAlgorithm[];
}

function F2LPage() {
  const [algorithms, setAlgorithms] = useState<CfopAlgorithm[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadAlgorithms = async () => {
      try {
        const response = await fetch(import.meta.env.BASE_URL + 'data/algs-cfop-f2l.json');
        if (!response.ok) {
          throw new Error(`Failed to load F2L algorithms: ${response.statusText}`);
        }
        const data = await response.json();
        setAlgorithms(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load F2L algorithms'));
      }
    };

    loadAlgorithms();
  }, []);

  // Group algorithms by group
  const groupedAlgorithms: GroupedAlgorithms = algorithms.reduce((acc, alg) => {
    const group = alg.group || 'default';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(alg);
    return acc;
  }, {} as GroupedAlgorithms);

  const groupIds = Object.keys(groupedAlgorithms);
  const { sectionState, toggleSection, expandAll, collapseAll } = useSectionToggle('f2l', groupIds);

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
          inserting edge-corner pairs in the four slots around the cross. There are 41 total cases, but the intuitive
          method reduce this to 4 simple inserts when pairs are setup in the top layer.
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
                <AlgorithmCard algorithm={alg} variant="compact" />
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

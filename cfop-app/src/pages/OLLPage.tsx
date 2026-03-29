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

function OLLPage() {
  const [algorithms, setAlgorithms] = useState<CfopAlgorithm[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadAlgorithms = async () => {
      try {
        const response = await fetch(import.meta.env.BASE_URL + 'data/algs-cfop-oll.json');
        if (!response.ok) {
          throw new Error(`Failed to load OLL algorithms: ${response.statusText}`);
        }
        const data = await response.json();
        setAlgorithms(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load OLL algorithms'));
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
  const { sectionState, toggleSection, expandAll, collapseAll } = useSectionToggle('oll', groupIds);

  if (error) {
    throw error;
  }

  return (
    <CfopPageLayout
      pageTitle="OLL Algorithms"
      subtitle="Orient Last Layer - 57 cases across 7 groups"
      introImageSrc="/cubing.spec/assets/cfop_oll.png"
      introImageAlt="OLL stage illustration"
      introContent={
        <p className="mb-0">
          <strong>OLL</strong> (Orient Last Layer) - The goal of the third step is to make the top face
          a single color. There are 57 total cases, or 10 when using 2-look method.
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

function OLLPageWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <OLLPage />
    </ErrorBoundary>
  );
}

export default OLLPageWithErrorBoundary;

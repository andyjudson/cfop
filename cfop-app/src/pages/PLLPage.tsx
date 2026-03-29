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

function PLLPage() {
  const [algorithms, setAlgorithms] = useState<CfopAlgorithm[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadAlgorithms = async () => {
      try {
        const response = await fetch(import.meta.env.BASE_URL + 'data/algs-cfop-pll.json');
        if (!response.ok) {
          throw new Error(`Failed to load PLL algorithms: ${response.statusText}`);
        }
        const data = await response.json();
        setAlgorithms(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load PLL algorithms'));
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
  const { sectionState, toggleSection, expandAll, collapseAll } = useSectionToggle('pll', groupIds);

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
          <strong>PLL</strong> (Permute Last Layer) - The goal of the fourth step is to solve the cube by
          repositioning last-layer pieces. There are 21 total cases, or 6 when using 2-look method.
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

function PLLPageWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <PLLPage />
    </ErrorBoundary>
  );
}

export default PLLPageWithErrorBoundary;

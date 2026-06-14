import { useState, useEffect, useCallback } from 'react';

interface SectionToggleState {
  [groupId: string]: boolean;
}

export function useSectionToggle(pageKey: string, groupIds: string[], defaultExpanded = false) {
  const storageKey = `cfop-sections-${pageKey}`;

  // Load initial state from sessionStorage
  const loadState = useCallback((): SectionToggleState => {
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load section state:', error);
    }
    // Default state: all sections collapsed unless defaultExpanded is true
    return groupIds.reduce((acc, id) => ({ ...acc, [id]: defaultExpanded }), {});
  }, [storageKey, groupIds, defaultExpanded]);

  const [sectionState, setSectionState] = useState<SectionToggleState>(loadState);

  // Persist state to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(sectionState));
    } catch (error) {
      console.error('Failed to save section state:', error);
    }
  }, [sectionState, storageKey]);

  // Toggle individual section
  const toggleSection = useCallback((groupId: string) => {
    setSectionState(prev => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  }, []);

  // Expand all sections
  const expandAll = useCallback(() => {
    setSectionState(groupIds.reduce((acc, id) => ({ ...acc, [id]: true }), {}));
  }, [groupIds]);

  // Collapse all sections
  const collapseAll = useCallback(() => {
    setSectionState(groupIds.reduce((acc, id) => ({ ...acc, [id]: false }), {}));
  }, [groupIds]);

  // True when every section is currently expanded — drives the single
  // label-toggling control (Expand All ⇄ Collapse All).
  const allExpanded = groupIds.length > 0 && groupIds.every(id => sectionState[id]);

  return {
    sectionState,
    toggleSection,
    expandAll,
    collapseAll,
    allExpanded,
  };
}

import { useEffect, useRef, useState, useMemo } from 'react';
import mermaid from 'mermaid';
import { QUESTS } from '../../data/quests';
import { generateMermaidFlowchart } from '../../data/quests/mermaid';
import { useGame } from '../../context/Game';
import './index.scss';

export const QuestTreePage = () => {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { completedQuests, activeQuests } = useGame();
  const initializedRef = useRef(false);

  // Calculate quest states
  const questStates = useMemo(() => {
    const completed: string[] = [...completedQuests];
    const active: string[] = activeQuests
      .map((aq) => aq.questId)
      .filter((id) => !completed.includes(id)); // Active but not completed

    // Determine available (unlocked) and locked quests
    const available: string[] = [];
    const locked: string[] = [];

    QUESTS.forEach((quest) => {
      // Skip if completed or active
      if (completed.includes(quest.id) || active.includes(quest.id)) {
        return;
      }

      // Check if quest is unlocked (all prerequisites completed)
      const isUnlocked =
        !quest.unlockedAfter ||
        quest.unlockedAfter.length === 0 ||
        quest.unlockedAfter.every((id) => completed.includes(id));

      if (isUnlocked) {
        available.push(quest.id);
      } else {
        locked.push(quest.id);
      }
    });

    return { completed, active, available, locked };
  }, [completedQuests, activeQuests]);

  useEffect(() => {
    if (!mermaidRef.current) return;

    // Initialize mermaid only once
    if (!initializedRef.current) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        themeVariables: {
          primaryColor: '#4a5568',
          primaryTextColor: '#e2e8f0',
          primaryBorderColor: '#718096',
          lineColor: '#cbd5e0',
          secondaryColor: '#2d3748',
          tertiaryColor: '#1a202c',
          background: '#1a202c',
          mainBkgColor: '#2d3748',
          secondBkgColor: '#4a5568',
          textColor: '#e2e8f0',
        },
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: 'basis',
        },
      });
      initializedRef.current = true;
    }

    // Generate the mermaid diagram with quest states
    const mermaidDiagram = generateMermaidFlowchart(QUESTS, questStates);
    // Extract just the mermaid code (remove the markdown code block syntax)
    const mermaidCode = mermaidDiagram
      .replace(/```mermaid\n/g, '')
      .replace(/```\n?$/g, '')
      .trim();

    // Generate a unique ID for this diagram
    const diagramId = `quest-tree-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

    // Set loading state
    setIsLoading(true);
    setError(null);

    // Render the diagram
    mermaid
      .render(diagramId, mermaidCode)
      .then((result) => {
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = result.svg;
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error rendering mermaid diagram:', err);
        setError(err.message || 'Failed to load quest tree');
        setIsLoading(false);
      });
  }, [questStates]);

  return (
    <div className='quest-tree'>
      <div className='quest-tree__diagram-container'>
        {isLoading && (
          <div className='quest-tree__loading'>Loading quest tree...</div>
        )}
        {error && (
          <div className='quest-tree__error'>
            <p>Error loading quest tree. Please refresh the page.</p>
            <pre>{error}</pre>
          </div>
        )}
        <div ref={mermaidRef} className='quest-tree__diagram' />
      </div>
    </div>
  );
};


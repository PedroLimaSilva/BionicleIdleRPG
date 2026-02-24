import { useState } from 'react';
import { VisualNovelCutscene } from '../../components/VisualNovelCutscene';
import { VISUAL_NOVEL_CUTSCENES } from '../../data/cutscenes';
import './index.scss';

/**
 * Visual test page for cutscenes.
 * Lists all cutscenes; click to view. Useful for manual testing and e2e screenshots.
 */
export function CutsceneTestPage() {
  const [activeCutsceneId, setActiveCutsceneId] = useState<string | null>(null);

  const cutsceneIds = Object.keys(VISUAL_NOVEL_CUTSCENES).sort();

  return (
    <div className="page-container cutscene-test-page">
      <h1>Cutscene Visual Test</h1>
      <p className="cutscene-test-page__intro">
        Click a cutscene to view it. Use for manual visual testing and e2e screenshots.
      </p>

      <div className="cutscene-test-page__grid">
        {cutsceneIds.map((id) => {
          const cutscene = VISUAL_NOVEL_CUTSCENES[id]!;
          const stepTypes = cutscene.steps.map((s) => s.type).join(', ');
          return (
            <button
              key={id}
              type="button"
              className="cutscene-test-page__card"
              onClick={() => setActiveCutsceneId(id)}
              data-testid={`cutscene-${id}`}
            >
              <span className="cutscene-test-page__card-id">{id}</span>
              <span className="cutscene-test-page__card-steps">{stepTypes}</span>
            </button>
          );
        })}
      </div>

      {activeCutsceneId && VISUAL_NOVEL_CUTSCENES[activeCutsceneId] && (
        <div
          className="cutscene-test-page__overlay"
          data-testid="cutscene-viewer"
          aria-live="polite"
        >
          <VisualNovelCutscene
            cutscene={VISUAL_NOVEL_CUTSCENES[activeCutsceneId]!}
            onClose={() => setActiveCutsceneId(null)}
          />
        </div>
      )}
    </div>
  );
}

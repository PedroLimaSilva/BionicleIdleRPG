import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { useGame } from '../../context/Game';
import { isTestMode } from '../../utils/testMode';

import './index.scss';
import { CharacterScene } from '../../components/CharacterScene';
import { ElementTag } from '../../components/ElementTag';
import { useEffect, useMemo, useState } from 'react';
import { useSceneCanvas } from '../../hooks/useSceneCanvas';
import { QUESTS } from '../../data/quests';
import { getRecruitedMatoran, masksCollected } from '../../services/matoranUtils';
import { isBohrokOrKal, isMatoran, isToa, isToaMata } from '../../game/matoranStage';
import { getAvailableEvolution, meetsEvolutionLevel } from '../../game/CharacterEvolution';
import { LevelProgress } from './LevelProgress';
import { MaskCollection } from './MaskCollection';
import { KranaCollection } from './KranaCollection';
import { JobAssignment } from './JobAssignment';
import { Tabs } from '../../components/Tabs';
import { CharacterChronicle } from './Chronicle';
import { ProtodermisTraining } from '../../components/ProtodermisTraining';
import { isKranaCollectionActive } from '../../game/Krana';
import { MASK_POWERS } from '../../data/combat';
import { BaseMatoran, isCustomCharacterId, Mask, RecruitedCharacterData } from '../../types/Matoran';
import { CustomCharacterShareButton } from './CustomCharacterShareButton';
import { RenameCustomCharacterModal } from './RenameCustomCharacterModal';

export const CharacterDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    completedQuests,
    convertProtodermisToExp,
    evolveCharacter,
    protodermis,
    recruitedCharacters,
    renameCustomCharacter,
  } = useGame();
  const [renameTargetId, setRenameTargetId] = useState<string | null>(null);
  const shouldReduceMotion = (useReducedMotion() ?? false) || isTestMode();

  const { setScene } = useSceneCanvas();

  const matoran = useMemo(
    () => getRecruitedMatoran(String(id), recruitedCharacters)!,
    [id, recruitedCharacters]
  );

  const [activeTab, setActiveTab] = useState('stats');

  const tabs = useMemo(() => {
    const base = ['stats'];
    if (isToa(matoran) || masksCollected(matoran, completedQuests).length > 1) {
      base.push('inventory');
    }
    if (matoran.quest || isMatoran(matoran) || isBohrokOrKal(matoran)) {
      base.push('tasks');
    }
    if (matoran.chronicleId) {
      base.push('chronicle');
    }
    return base;
  }, [matoran, completedQuests]);

  useEffect(() => {
    if (matoran) {
      // Use the stable "character-preview" key that CharacterCreation also uses. When the user
      // navigates from /character-create to /characters/:id, React reuses the same scene
      // instance (and its postprocessing EffectComposer) instead of unmounting + remounting,
      // which avoids a "Cannot read properties of null (alpha)" crash if the WebGL context
      // was in the middle of a re-init when the new EffectComposer was constructed.
      setScene(
        <CharacterScene key="character-preview" matoran={matoran}></CharacterScene>
      );
    }
    return () => {
      setScene(null);
    };
  }, [matoran, setScene]);

  const { activeMask, maskDescription } = useMemo(() => {
    if (!isToa(matoran)) {
      return { activeMask: undefined, maskDescription: '' };
    }
    const activeMask = matoran.maskOverride || matoran.mask;
    const maskDescription = MASK_POWERS[activeMask]?.description || 'Unknown Mask Power';
    return { activeMask, maskDescription };
  }, [matoran]);

  if (!matoran) {
    return <p>Something is wrong, this matoran does not exist</p>;
  }

  const isCustom = isCustomCharacterId(matoran.id);

  return (
    <div className={`page-container character-detail element-${matoran.element}`}>
      <motion.div
        className="character-detail-visualization"
        layoutId={shouldReduceMotion ? undefined : `character-${matoran.id}`}
        layout
        transition={{ damping: 30, stiffness: 400, type: 'spring' }}
      >
        <div className="character-header">
          <h1 className="character-name">{matoran.name}</h1>
          {isCustom && <CustomCharacterShareButton matoran={matoran} />}
        </div>

        <div id="model-frame">
          <div className="divider"></div>
        </div>
      </motion.div>
      <div className="character-detail-tabs">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={(tab: string) => setActiveTab(tab)} />
      </div>
      <div className="character-detail-content">
        <div className="character-detail-section" id={activeTab}>
          {activeTab === 'stats' && (
            <StatsTab
              matoran={matoran}
              completedQuests={completedQuests}
              protodermis={protodermis}
              convertProtodermisToExp={convertProtodermisToExp}
              activeMask={activeMask}
              maskDescription={maskDescription}
              onEvolveCharacter={(id) =>
                evolveCharacter(id, (evolvedId) => {
                  if (isCustomCharacterId(evolvedId)) {
                    setRenameTargetId(evolvedId);
                    return;
                  }
                  navigate(`/characters/${evolvedId}`, { replace: true });
                })
              }
            />
          )}
          {activeTab === 'inventory' && (
            <>
              <MaskCollection matoran={matoran} />
              {isToaMata(matoran) && isKranaCollectionActive(completedQuests) && (
                <KranaCollection matoran={matoran} />
              )}
            </>
          )}

          {activeTab === 'tasks' && (
            <div>
              {/* Job Assignement  */}
              {(isMatoran(matoran) || isBohrokOrKal(matoran)) && (
                <JobAssignment matoran={matoran} />
              )}

              {/* Assigned Quest  */}
              {matoran.quest && (
                <div>
                  <p>Assigned Quest:</p>
                  <Link to="/quests">
                    <p>{QUESTS.find((q) => q.id === matoran.quest)!.name}</p>
                  </Link>
                </div>
              )}
            </div>
          )}
          {activeTab === 'chronicle' && matoran.chronicleId && (
            <CharacterChronicle matoran={matoran} />
          )}
        </div>
      </div>
      {renameTargetId && (
        <RenameCustomCharacterModal
          currentName={matoran.name}
          onClose={() => setRenameTargetId(null)}
          onRename={(newName) => {
            renameCustomCharacter(renameTargetId, newName);
            setRenameTargetId(null);
          }}
        />
      )}
    </div>
  );
};

function StatsTab({
  activeMask,
  completedQuests,
  convertProtodermisToExp,
  maskDescription,
  matoran,
  onEvolveCharacter,
  protodermis,
}: {
  matoran: BaseMatoran & RecruitedCharacterData;
  completedQuests: string[];
  protodermis: number;
  convertProtodermisToExp: (matoranId: string, protodermisSpent: number) => boolean;
  activeMask: Mask | undefined;
  maskDescription: string;
  onEvolveCharacter: (id: string) => void;
}) {
  const evolution = getAvailableEvolution(matoran, completedQuests);
  const hasLevel = evolution ? meetsEvolutionLevel(matoran, evolution) : false;
  const hasFunds = evolution ? protodermis >= evolution.protodermisCost : false;
  const maskEquipped =
    evolution && evolution.maskRequired ? matoran.maskOverride === evolution.maskRequired : true;
  const canEvolve = hasLevel && hasFunds && maskEquipped;

  return (
    <>
      <LevelProgress exp={matoran.exp} />
      <ElementTag element={matoran.element} showName={true} />
      {evolution && (
        <div className="evolve-section">
          <div className="requirement-list">
            <h4>{evolution.label}</h4>
            <ul>
              <li className={hasLevel ? 'has-enough' : 'not-enough'}>
                {hasLevel ? '✅' : '❌'} Level {evolution.levelRequired}
              </li>
              <li className={hasFunds ? 'has-enough' : 'not-enough'}>
                {hasFunds ? '✅' : '❌'} {evolution.protodermisCost} protodermis
              </li>
              {evolution.maskRequired && (
                <li className={`bionicle-font ${maskEquipped ? 'has-enough' : 'not-enough'}`}>
                  {maskEquipped ? '✅' : '❌'} Mask on Face
                </li>
              )}
            </ul>
            <button
              type="button"
              className={`elemental-btn element-${matoran.element}${canEvolve ? '' : ' disabled'}`}
              onClick={() => canEvolve && onEvolveCharacter(matoran.id)}
            >
              {evolution.label}
            </button>
          </div>
        </div>
      )}
      <ProtodermisTraining
        characterId={matoran.id}
        element={matoran.element}
        protodermis={protodermis}
        convertProtodermisToExp={convertProtodermisToExp}
      />
      {isToa(matoran) && activeMask && (
        <div>
          <h3>{MASK_POWERS[activeMask]?.longName ?? 'Unknown Mask'}</h3>
          <p>{maskDescription}</p>
        </div>
      )}
    </>
  );
}

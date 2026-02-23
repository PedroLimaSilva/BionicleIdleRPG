import { BaseMatoran, RecruitedCharacterData } from '../../../types/Matoran';
import { LegoColor } from '../../../types/Colors';
import { useGame } from '../../../context/Game';
import { isNuvaSymbolsSequestered } from '../../../game/nuvaSymbols';

/** Placeholder cylinder for Toa Nuva until real models are available. */
export function ToaNuvaPlaceholderModel({
  matoran,
}: {
  matoran: BaseMatoran & RecruitedCharacterData;
}) {
  const { completedQuests } = useGame();
  const color = isNuvaSymbolsSequestered(completedQuests)
    ? LegoColor.LightGray
    : (matoran.colors?.body ?? LegoColor.DarkGray);

  return (
    <mesh position={[0, 8, -0.4]}>
      <cylinderGeometry args={[1.5, 1.8, 8, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

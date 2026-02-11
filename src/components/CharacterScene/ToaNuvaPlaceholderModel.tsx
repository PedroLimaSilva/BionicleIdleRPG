import { BaseMatoran, RecruitedCharacterData } from '../../types/Matoran';
import { LegoColor } from '../../types/Colors';

/** Placeholder cylinder for Toa Nuva until real models are available. */
export function ToaNuvaPlaceholderModel({
  matoran,
}: {
  matoran: BaseMatoran & RecruitedCharacterData;
}) {
  const color = matoran.colors?.body ?? LegoColor.DarkGray;

  return (
    <mesh position={[0, 8, -0.4]}>
      <cylinderGeometry args={[1.5, 1.8, 8, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

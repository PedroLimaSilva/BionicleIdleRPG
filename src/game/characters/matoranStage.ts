import { BaseMatoran, MatoranStage } from '../../types/Matoran';

export function isBohrok(matoran: BaseMatoran) {
  return matoran.stage === MatoranStage.Bohrok;
}

export function isBohrokKal(matoran: BaseMatoran) {
  return matoran.stage === MatoranStage.BohrokKal;
}

export function isBohrokOrKal(matoran: BaseMatoran) {
  return isBohrok(matoran) || isBohrokKal(matoran);
}

export function isMetru(matoran: BaseMatoran) {
  return matoran.stage === MatoranStage.Metru;
}

export function isMetruStage(stage: MatoranStage) {
  return stage === MatoranStage.Metru;
}

/** Stages whose characters may only take jobs explicitly marked for that stage. */
export function hasStageRestrictedJobs(matoran: BaseMatoran) {
  return isBohrokOrKal(matoran) || isMetru(matoran);
}

export function hasStageRestrictedJobPool(stage: MatoranStage) {
  return (
    stage === MatoranStage.Bohrok ||
    stage === MatoranStage.BohrokKal ||
    stage === MatoranStage.Metru
  );
}

export function isMatoran(matoran: BaseMatoran) {
  return [MatoranStage.Diminished, MatoranStage.Rebuilt, MatoranStage.Metru].includes(
    matoran.stage
  );
}

export function isToaMata(matoran: BaseMatoran) {
  return matoran.stage === MatoranStage.ToaMata;
}

export function isToaNuva(matoran: BaseMatoran) {
  return matoran.stage === MatoranStage.ToaNuva;
}

export function isToaMetru(matoran: BaseMatoran) {
  return matoran.stage === MatoranStage.ToaMetru;
}

export function isToa(matoran: BaseMatoran) {
  return isToaMata(matoran) || isToaNuva(matoran) || isToaMetru(matoran);
}

import { BaseMatoran, MatoranStage } from '../types/Matoran';

export function isBohrok(matoran: BaseMatoran) {
  return matoran.stage === MatoranStage.Bohrok;
}

export function isBohrokKal(matoran: BaseMatoran) {
  return matoran.stage === MatoranStage.BohrokKal;
}

export function isBohrokOrKal(matoran: BaseMatoran) {
  return isBohrok(matoran) || isBohrokKal(matoran);
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

export function isToa(matoran: BaseMatoran) {
  return isToaMata(matoran) || isToaNuva(matoran);
}

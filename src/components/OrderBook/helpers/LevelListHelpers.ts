import {OrderBookCellType, Side} from '../../../models/index';
import {colors} from '../../styled';
import {LEVELS_COUNT} from '../index';
import {IAnimatingLevels} from '../LevelList';

export const STEP_OPACITY = 0.05;
export const START_ANIMATED_OPACITY = 0.5;
export const DEFAULT_OPACITY = 1;
export const DEFAULT_TRAILING_ZERO_OPACITY = 0.4;

export const fillBySide = (side: Side) =>
  side === Side.Buy ? colors.buy : colors.sell;

export const fillVolumeBySide = (side: Side) =>
  side === Side.Buy ? colors.activeBuy : colors.activeSell;

export const getCellType = (type: string) =>
  type === OrderBookCellType.Depth
    ? OrderBookCellType.Depth
    : OrderBookCellType.Volume;

export const getY = (side: Side, idx: number, levelHeight: number) =>
  (side === Side.Buy ? idx : LEVELS_COUNT - idx - 1) * levelHeight;

export const updateAnimatingLevelsWithNewLevel = (
  animatingLevels: IAnimatingLevels[],
  price: number
): IAnimatingLevels[] => {
  const levelForAnimation: IAnimatingLevels = {
    price,
    currentOpacity: START_ANIMATED_OPACITY,
    isAnimated: false
  };
  return [...animatingLevels, levelForAnimation];
};

export const getColorAndOpacityForAnimation = (
  animatingLevel: IAnimatingLevels,
  color: string,
  side: Side
) => {
  if (animatingLevel.currentOpacity < DEFAULT_OPACITY) {
    animatingLevel.currentOpacity += STEP_OPACITY;
  } else {
    animatingLevel.isAnimated = true;
  }

  return {
    animatedColor: animatingLevel!.isAnimated ? fillBySide(side) : color,
    animatedOpacity: animatingLevel!.currentOpacity
  };
};

export const findAndDeleteDuplicatedAnimatedLevel = (
  animatingLevels: IAnimatingLevels[],
  price: number
) => {
  if (!animatingLevels.length) {
    return animatingLevels;
  }
  const duplicatedAnimatedLevelIndex = animatingLevels.findIndex(
    animatingLevel => animatingLevel.price === price
  );
  // tslint:disable:no-bitwise
  return !!~duplicatedAnimatedLevelIndex
    ? [
        ...animatingLevels.slice(0, duplicatedAnimatedLevelIndex),
        ...animatingLevels.slice(duplicatedAnimatedLevelIndex + 1)
      ]
    : [...animatingLevels];
};

export const colorizedSymbol = (volumeOpacity: number) => (
  trailingZeroPosition: number,
  currentSymbolPosition: number
) =>
  currentSymbolPosition < trailingZeroPosition
    ? volumeOpacity
    : DEFAULT_TRAILING_ZERO_OPACITY;

import {OrderBookCellType, Side} from '../../../models/index';
import {colors} from '../../styled';
import {LEVELS_COUNT} from '../index';
import {IAnimatingLevels} from '../LevelList';

export const STEP_OPACITY = 0.05;
export const START_ANIMATED_OPACITY = 0.5;
export const DEFAULT_OPACITY = 1;

export const fillBySide = (side: Side) =>
  side === Side.Buy ? colors.buy : colors.sell;

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
  color: string
) => {
  if (animatingLevel.currentOpacity < DEFAULT_OPACITY) {
    animatingLevel.currentOpacity += STEP_OPACITY;
  } else {
    animatingLevel.isAnimated = true;
  }

  return {
    animatedColor: animatingLevel!.isAnimated ? colors.white : color,
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

export const colorizedSymbol = (volumeColor: string) => (
  trailingZeroPosition: number,
  currentSymbolPosition: number
) =>
  currentSymbolPosition < trailingZeroPosition ? volumeColor : colors.coolGrey;

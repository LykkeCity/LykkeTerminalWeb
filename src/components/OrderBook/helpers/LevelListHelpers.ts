import {OrderBookCellType, Side} from '../../../models/index';
import {Dictionary} from '../../../types';
import {LEVELS_COUNT} from '../index';
import {IAnimatingLevels} from '../LevelList';

export const STEP_OPACITY = 0.43;
export const START_ANIMATED_OPACITY = 0.16;
export const DEFAULT_OPACITY = 1;
export const DEFAULT_BAR_OPACITY = 0.16;

export const fillBySide = (side: Side, colors: Dictionary<string>) =>
  side === Side.Buy ? colors.levelListBuy : colors.levelListSell;

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
  colors: Dictionary<string>
) => {
  if (animatingLevel.currentOpacity < DEFAULT_OPACITY) {
    animatingLevel.currentOpacity += STEP_OPACITY;
  } else {
    animatingLevel.isAnimated = true;
  }

  return {
    animatedColor: animatingLevel!.isAnimated
      ? colors.levelListAnimatedColor
      : color,
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
  currentSymbolPosition: number,
  colors: Dictionary<string>
) =>
  currentSymbolPosition < trailingZeroPosition
    ? volumeColor
    : colors.levelListTrailingZero;

import {OrderBookCellType, Side} from '../../../models/index';
import {colors} from '../../styled';
import {LEVELS_COUNT} from '../index';
import {IAnimatingLevels} from '../LevelList';

export const STEP_OPACITY = 0.03;
export const DEFAULT_BAR_OPACITY = 0.16;
export const ANIMATED_HIGH_OPACITY = 0.5;
export const DEFAULT_TRAILING_ZERO_OPACITY = 0.4;

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
    currentOpacity: DEFAULT_BAR_OPACITY,
    isAnimated: false,
    isAnimationReached: false
  };
  return [...animatingLevels, levelForAnimation];
};

export const getOpacityForAnimation = (animatingLevel: IAnimatingLevels) => {
  if (animatingLevel.isAnimationReached) {
    if (animatingLevel.currentOpacity <= ANIMATED_HIGH_OPACITY) {
      animatingLevel.isAnimated = true;
    } else {
      animatingLevel.currentOpacity -= STEP_OPACITY;
    }
  } else {
    if (animatingLevel.currentOpacity < ANIMATED_HIGH_OPACITY) {
      animatingLevel.currentOpacity += STEP_OPACITY;
      if (animatingLevel.currentOpacity >= ANIMATED_HIGH_OPACITY) {
        animatingLevel.isAnimationReached = true;
      }
    }
  }

  return animatingLevel.isAnimated
    ? DEFAULT_BAR_OPACITY
    : animatingLevel!.currentOpacity;
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

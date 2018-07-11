import {OrderBookCellType, Side} from '../../../models/index';
import {colors} from '../../styled';
import {LEVELS_COUNT} from '../index';
import {IAnimatingLevels} from '../LevelList';

export const START_ANIMATED_OPACITY = 0.16;
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
  price: number,
  volumeWidth: number
): IAnimatingLevels[] => {
  const levelForAnimation: IAnimatingLevels = {
    price,
    currentOpacity: START_ANIMATED_OPACITY,
    isAnimated: false,
    currentWidth: volumeWidth
  };
  return [...animatingLevels, levelForAnimation];
};

export const getColorAndOpacityForAnimation = (
  animatingLevel: IAnimatingLevels,
  color: string,
  side: Side,
  finalVolumeWidth: number
) => {
  if (animatingLevel.currentWidth < finalVolumeWidth) {
    animatingLevel.currentWidth += 3;
    if (animatingLevel.currentWidth >= finalVolumeWidth) {
      animatingLevel.isAnimated = true;
    }
  } else if (animatingLevel.currentWidth > finalVolumeWidth) {
    animatingLevel.currentWidth -= 3;
    if (animatingLevel.currentWidth <= finalVolumeWidth) {
      animatingLevel.isAnimated = true;
    }
  }

  return {
    animatedCurrentWidth: animatingLevel.currentWidth,
    animatedOpacity: animatingLevel.isAnimated ? 0.16 : 0.35
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

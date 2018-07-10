import {OrderBookCellType, Side} from '../../../models/index';
import {
  buyRGB,
  colors,
  orderBookAnimatedBuyRGB,
  orderBookAnimatedSellRGB,
  sellRGB
} from '../../styled';
import {LEVELS_COUNT} from '../index';
import {IAnimatingLevels} from '../LevelList';

export interface IRGB {
  r: number;
  g: number;
  b: number;
}

export const START_ANIMATED_OPACITY = 0.5;
export const DEFAULT_OPACITY = 1;
export const DEFAULT_TRAILING_ZERO_OPACITY = 0.4;
export let ANIMATION_TICK = 5;

const getAnimationTick = () => ANIMATION_TICK;
(window as any).setAnimationTick = (tick: number) => (ANIMATION_TICK = tick);

export const animatedSellSteps = () => ({
  r: (sellRGB.r - orderBookAnimatedSellRGB.r) / getAnimationTick(),
  g: (sellRGB.g - orderBookAnimatedSellRGB.g) / getAnimationTick(),
  b: (sellRGB.b - orderBookAnimatedSellRGB.b) / getAnimationTick()
});

export const animatedBuySteps = () => ({
  r: (buyRGB.r - orderBookAnimatedBuyRGB.r) / getAnimationTick(),
  g: (buyRGB.g - orderBookAnimatedBuyRGB.g) / getAnimationTick(),
  b: (buyRGB.b - orderBookAnimatedBuyRGB.b) / getAnimationTick()
});

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
  side: Side
): IAnimatingLevels[] => {
  const levelForAnimation: IAnimatingLevels = {
    price,
    currentOpacity: START_ANIMATED_OPACITY,
    isAnimated: false,
    currentColorState: side === Side.Buy ? {...buyRGB} : {...sellRGB}
  };
  return [...animatingLevels, levelForAnimation];
};

export const isColorNeedAnimation = (
  currentColorState: IRGB,
  orderBookAnimatedRBG: IRGB
) =>
  currentColorState.r > orderBookAnimatedRBG.r &&
  currentColorState.g > orderBookAnimatedRBG.g &&
  currentColorState.b > orderBookAnimatedRBG.b;

export const updateLevelColor = (
  currentColorState: IRGB,
  animationSteps: IRGB
) => {
  return {
    r: currentColorState.r - animationSteps.r,
    g: currentColorState.g - animationSteps.g,
    b: currentColorState.b - animationSteps.b
  };
};

export const getColorForAnimation = (
  animatingLevel: IAnimatingLevels,
  color: string,
  side: Side
) => {
  const {currentColorState} = animatingLevel;
  const orderBookAnimatedRBG =
    side === Side.Buy ? orderBookAnimatedBuyRGB : orderBookAnimatedSellRGB;

  if (isColorNeedAnimation(currentColorState, orderBookAnimatedRBG)) {
    const animationSteps =
      side === Side.Buy ? animatedBuySteps() : animatedSellSteps();
    animatingLevel.currentColorState = updateLevelColor(
      currentColorState,
      animationSteps
    );
  } else {
    animatingLevel.isAnimated = true;
  }

  const {r, g, b} = animatingLevel.currentColorState;

  return animatingLevel!.isAnimated
    ? fillBySide(side)
    : `rgb(${r}, ${g}, ${b})`;
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

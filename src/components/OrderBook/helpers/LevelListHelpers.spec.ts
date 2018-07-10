import {OrderBookCellType, Side} from '../../../models';
import {
  colors,
  orderBookAnimatedBuyRGB,
  orderBookAnimatedSellRGB
} from '../../styled';
import {LEVELS_COUNT} from '../index';
import {IAnimatingLevels} from '../LevelList';
import {
  animatedBuySteps,
  animatedSellSteps,
  colorizedSymbol,
  DEFAULT_TRAILING_ZERO_OPACITY,
  fillBySide,
  findAndDeleteDuplicatedAnimatedLevel,
  getCellType,
  getY,
  isColorNeedAnimation,
  START_ANIMATED_OPACITY,
  updateAnimatingLevelsWithNewLevel,
  updateLevelColor
} from './LevelListHelpers';

describe('level list helpers', () => {
  it('should return color for Buy side', () => {
    expect(fillBySide(Side.Buy)).toBe(colors.buy);
  });

  it('should return color for Sell side', () => {
    expect(fillBySide(Side.Sell)).toBe(colors.sell);
  });

  it('should return cell type by order type', () => {
    let orderType = 'volume';
    expect(getCellType(orderType)).toBe(OrderBookCellType.Volume);

    orderType = 'depth';
    expect(getCellType(orderType)).toBe(OrderBookCellType.Depth);
  });

  it('should return y position for bid', () => {
    const bidIndex = 1;
    const side = Side.Buy;
    const levelHeight = 30;
    expect(getY(side, bidIndex, levelHeight)).toBe(bidIndex * levelHeight);
  });

  it('should return y position for ask', () => {
    const askIndex = 1;
    const side = Side.Sell;
    const levelHeight = 30;
    expect(getY(side, askIndex, levelHeight)).toBe(
      (LEVELS_COUNT - askIndex - 1) * levelHeight
    );
  });

  it('should return default color if currentSymbolPosition is less than trailingZeroPosition', () => {
    const currentOpacity = 1;
    const getSymbolColor = colorizedSymbol(currentOpacity);
    const currentSymbolPosition = 0;
    const trailingZeroPosition = 5;
    expect(getSymbolColor(trailingZeroPosition, currentSymbolPosition)).toBe(
      currentOpacity
    );
  });

  it('should return grey color if currentSymbolPosition is more than trailingZeroPosition', () => {
    const currentOpacity = 1;
    const getSymbolColor = colorizedSymbol(currentOpacity);
    const currentSymbolPosition = 6;
    const trailingZeroPosition = 5;
    expect(getSymbolColor(trailingZeroPosition, currentSymbolPosition)).toBe(
      DEFAULT_TRAILING_ZERO_OPACITY
    );
  });

  it('should return true if current color state is more than finished animating state', () => {
    const currentSellState = {
      r: orderBookAnimatedSellRGB.r + 1,
      g: orderBookAnimatedSellRGB.g + 1,
      b: orderBookAnimatedSellRGB.b + 1
    };
    const currentBuyState = {
      r: orderBookAnimatedBuyRGB.r + 1,
      g: orderBookAnimatedBuyRGB.g + 1,
      b: orderBookAnimatedBuyRGB.b + 1
    };
    expect(
      isColorNeedAnimation(currentSellState, orderBookAnimatedSellRGB)
    ).toBeTruthy();
    expect(
      isColorNeedAnimation(currentBuyState, orderBookAnimatedBuyRGB)
    ).toBeTruthy();
  });

  it('should return true if current color state is les than finished animating state', () => {
    const currentSellState = {
      r: orderBookAnimatedSellRGB.r - 1,
      g: orderBookAnimatedSellRGB.g - 1,
      b: orderBookAnimatedSellRGB.b - 1
    };
    const currentBuyState = {
      r: orderBookAnimatedBuyRGB.r - 1,
      g: orderBookAnimatedBuyRGB.g - 1,
      b: orderBookAnimatedBuyRGB.b - 1
    };
    expect(
      isColorNeedAnimation(currentSellState, orderBookAnimatedSellRGB)
    ).toBeFalsy();
    expect(
      isColorNeedAnimation(currentBuyState, orderBookAnimatedBuyRGB)
    ).toBeFalsy();
  });

  it('should update level color on animation step with sell steps', () => {
    const currentState = {
      r: 255,
      g: 255,
      b: 255
    };

    const animatedSellStep = animatedSellSteps();
    const updatedCurrentState = updateLevelColor(
      currentState,
      animatedSellStep
    );
    expect(updatedCurrentState.r).toBe(currentState.r - animatedSellStep.r);
    expect(updatedCurrentState.g).toBe(currentState.g - animatedSellStep.g);
    expect(updatedCurrentState.b).toBe(currentState.b - animatedSellStep.b);
  });

  it('should update level color on animation step with buy steps', () => {
    const currentState = {
      r: 255,
      g: 255,
      b: 255
    };

    const animatedBuyStep = animatedBuySteps();
    const updatedCurrentState = updateLevelColor(currentState, animatedBuyStep);
    expect(updatedCurrentState.r).toBe(currentState.r - animatedBuyStep.r);
    expect(updatedCurrentState.g).toBe(currentState.g - animatedBuyStep.g);
    expect(updatedCurrentState.b).toBe(currentState.b - animatedBuyStep.b);
  });

  describe('level animation', () => {
    let animatingLevels: IAnimatingLevels[] = [];
    const price = 9821.56;

    beforeEach(() => {
      animatingLevels = [];
    });

    it('should return animatingLevels with new level', () => {
      expect(animatingLevels.length).toBe(0);
      animatingLevels = updateAnimatingLevelsWithNewLevel(
        animatingLevels,
        price,
        Side.Buy
      );
      expect(animatingLevels.length).toBe(1);

      const existedLevel = animatingLevels.find(
        animatingLevel => animatingLevel.price === price
      );
      expect(existedLevel!.price).toBe(price);
      expect(existedLevel!.currentOpacity).toBe(START_ANIMATED_OPACITY);
      expect(existedLevel!.isAnimated).toBeFalsy();
    });

    it('should return empty array if animatingLevels is empty', () => {
      expect(animatingLevels.length).toBe(0);
      expect(
        findAndDeleteDuplicatedAnimatedLevel(animatingLevels, price).length
      ).toBe(0);
    });

    it('should return array without changes if duplicated level not found', () => {
      expect(animatingLevels.length).toBe(0);
      animatingLevels = updateAnimatingLevelsWithNewLevel(
        animatingLevels,
        price,
        Side.Buy
      );
      expect(animatingLevels.length).toBe(1);

      const newPrice = 125.68;
      expect(price).not.toBe(newPrice);
      expect(
        findAndDeleteDuplicatedAnimatedLevel(animatingLevels, newPrice).length
      ).toBe(1);
    });

    it('should return array without duplicated level', () => {
      expect(animatingLevels.length).toBe(0);
      animatingLevels = updateAnimatingLevelsWithNewLevel(
        animatingLevels,
        price,
        Side.Buy
      );
      expect(animatingLevels.length).toBe(1);
      expect(
        findAndDeleteDuplicatedAnimatedLevel(animatingLevels, price).length
      ).toBe(0);
    });
  });
});

import {OrderBookCellType, Side} from '../../../models';
import {colors} from '../../styled';
import {LEVELS_COUNT} from '../index';
import {IAnimatingLevels} from '../LevelList';
import {
  ANIMATED_HIGH_OPACITY,
  colorizedSymbol,
  DEFAULT_BAR_OPACITY,
  DEFAULT_TRAILING_ZERO_OPACITY,
  fillBySide,
  findAndDeleteDuplicatedAnimatedLevel,
  getCellType,
  getOpacityForAnimation,
  getY,
  STEP_OPACITY,
  updateAnimatingLevelsWithNewLevel
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
        price
      );
      expect(animatingLevels.length).toBe(1);

      const existedLevel = animatingLevels.find(
        animatingLevel => animatingLevel.price === price
      );
      expect(existedLevel!.price).toBe(price);
      expect(existedLevel!.currentOpacity).toBe(DEFAULT_BAR_OPACITY);
      expect(existedLevel!.isAnimated).toBeFalsy();
    });

    it('should return updated opacity for current animating level if opacity is less than DEFAULT_BAR_OPACITY', () => {
      animatingLevels = updateAnimatingLevelsWithNewLevel(
        animatingLevels,
        price
      );
      const existedLevel = animatingLevels.find(
        animatingLevel => animatingLevel.price === price
      );

      const animatedOpacity = getOpacityForAnimation(existedLevel!);

      expect(animatedOpacity).toBe(existedLevel!.currentOpacity);
    });

    it('should set isAnimated to true if animation was reached and current opacity is less than ANIMATED_HIGH_OPACITY', () => {
      animatingLevels = updateAnimatingLevelsWithNewLevel(
        animatingLevels,
        price
      );
      const existedLevel = animatingLevels.find(
        animatingLevel => animatingLevel.price === price
      );
      existedLevel!.currentOpacity = 0;
      existedLevel!.isAnimationReached = true;
      expect(existedLevel!.currentOpacity).toBeLessThan(ANIMATED_HIGH_OPACITY);

      expect(existedLevel!.isAnimated).toBeFalsy();

      getOpacityForAnimation(existedLevel!);

      expect(existedLevel!.isAnimated).toBeTruthy();
    });

    it('should set isAnimationReached to true', () => {
      const opacity = ANIMATED_HIGH_OPACITY - STEP_OPACITY;
      animatingLevels = updateAnimatingLevelsWithNewLevel(
        animatingLevels,
        price
      );
      const existedLevel = animatingLevels.find(
        animatingLevel => animatingLevel.price === price
      );

      existedLevel!.currentOpacity = opacity;
      existedLevel!.isAnimationReached = true;

      getOpacityForAnimation(existedLevel!);

      expect(existedLevel!.isAnimationReached).toBeTruthy();
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
        price
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
        price
      );
      expect(animatingLevels.length).toBe(1);
      expect(
        findAndDeleteDuplicatedAnimatedLevel(animatingLevels, price).length
      ).toBe(0);
    });

    describe('calculated opacity', () => {
      it('should return DEFAULT_BAR_OPACITY', () => {
        animatingLevels = updateAnimatingLevelsWithNewLevel(
          animatingLevels,
          price
        );
        const existedLevel = animatingLevels.find(
          animatingLevel => animatingLevel.price === price
        );

        existedLevel!.currentOpacity = 0;
        existedLevel!.isAnimated = true;

        const animatedOpacity = getOpacityForAnimation(existedLevel!);

        expect(animatedOpacity).toBe(DEFAULT_BAR_OPACITY);
      });

      it('should decrease opacity on STEP_OPACITY if animation was reached and current opacity is more than ANIMATED_HIGH_OPACITY', () => {
        const opacity = 2;
        animatingLevels = updateAnimatingLevelsWithNewLevel(
          animatingLevels,
          price
        );
        const existedLevel = animatingLevels.find(
          animatingLevel => animatingLevel.price === price
        );

        existedLevel!.currentOpacity = opacity;
        existedLevel!.isAnimationReached = true;

        const animatedOpacity = getOpacityForAnimation(existedLevel!);

        expect(animatedOpacity).toBe(opacity - STEP_OPACITY);
      });

      it('should increase opacity on STEP_OPACITY', () => {
        animatingLevels = updateAnimatingLevelsWithNewLevel(
          animatingLevels,
          price
        );
        const existedLevel = animatingLevels.find(
          animatingLevel => animatingLevel.price === price
        );

        existedLevel!.currentOpacity = DEFAULT_BAR_OPACITY;
        existedLevel!.isAnimationReached = false;

        const animatedOpacity = getOpacityForAnimation(existedLevel!);

        expect(animatedOpacity).toBe(DEFAULT_BAR_OPACITY + STEP_OPACITY);
      });
    });
  });
});

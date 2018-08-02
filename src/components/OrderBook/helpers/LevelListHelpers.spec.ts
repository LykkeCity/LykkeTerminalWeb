import {OrderBookCellType, Side} from '../../../models';
import {colors} from '../../styled';
import {LEVELS_COUNT} from '../index';
import {IAnimatingLevels} from '../LevelList';
import {
  colorizedSymbol,
  fillBySide,
  findAndDeleteDuplicatedAnimatedLevel,
  getCellType,
  getColorAndOpacityForAnimation,
  getY,
  START_ANIMATED_OPACITY,
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
    const getSymbolColor = colorizedSymbol(colors.white);
    const currentSymbolPosition = 0;
    const trailingZeroPosition = 5;
    expect(getSymbolColor(trailingZeroPosition, currentSymbolPosition)).toBe(
      colors.white
    );
  });

  it('should return grey color if currentSymbolPosition is more than trailingZeroPosition', () => {
    const getSymbolColor = colorizedSymbol(colors.white);
    const currentSymbolPosition = 6;
    const trailingZeroPosition = 5;
    expect(getSymbolColor(trailingZeroPosition, currentSymbolPosition)).toBe(
      colors.lightGrey
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
      expect(existedLevel!.currentOpacity).toBe(START_ANIMATED_OPACITY);
      expect(existedLevel!.isAnimated).toBeFalsy();
    });

    it('should return updated opacity and color for current animating level if opacity is less than DEFAULT_OPACITY', () => {
      animatingLevels = updateAnimatingLevelsWithNewLevel(
        animatingLevels,
        price
      );
      const existedLevel = animatingLevels.find(
        animatingLevel => animatingLevel.price === price
      );
      const color = colors.buy;

      const {animatedColor, animatedOpacity} = getColorAndOpacityForAnimation(
        existedLevel!,
        color
      );
      expect(animatedColor).toBe(color);
      expect(animatedOpacity).toBe(existedLevel!.currentOpacity);
    });

    it('should return updated opacity and color for current animating level if opacity is more than DEFAULT_OPACITY', () => {
      animatingLevels = updateAnimatingLevelsWithNewLevel(
        animatingLevels,
        price
      );
      const existedLevel = animatingLevels.find(
        animatingLevel => animatingLevel.price === price
      );
      const color = colors.buy;
      existedLevel!.currentOpacity = 2;

      const {animatedColor, animatedOpacity} = getColorAndOpacityForAnimation(
        existedLevel!,
        color
      );
      expect(animatedColor).toBe(colors.white);
      expect(animatedOpacity).toBe(existedLevel!.currentOpacity);
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
  });
});

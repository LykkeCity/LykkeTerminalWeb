import {AssetModel, InstrumentModel} from '../index';

describe('InstrumentModel', () => {
  describe('display name', () => {
    it('should produce display name as concatenation of base/quote asset display names', () => {
      const i = new InstrumentModel({
        baseAsset: new AssetModel({name: 'LKK'}),
        quoteAsset: new AssetModel({name: 'USD'})
      });

      expect(i.displayName).toBeDefined();
      expect(i.displayName).toBe('LKK/USD');
    });

    it('should return undefined if base or quote asset is undefined', () => {
      const withoutBaseAsset = new InstrumentModel({
        quoteAsset: new AssetModel({name: 'USD'})
      });
      const withoutQuoteAsset = new InstrumentModel({
        baseAsset: new AssetModel({name: 'USD'})
      });
      const withoutBoth = new InstrumentModel({});

      expect(withoutBaseAsset.displayName).toBeUndefined();
      expect(withoutQuoteAsset.displayName).toBeUndefined();
      expect(withoutBoth.displayName).toBeUndefined();
    });
  });
});

import AssetApi from '../assetApi';

export const mockAssets = {
  Assets: [
    {
      Accuracy: 8,
      BankCardsDepositEnabled: false,
      BlockchainDepositEnabled: true,
      CanBeBase: true,
      CategoryId: 'dd99af06-d1c9-4e6a-821c-10cb16a5cc5d',
      DisplayId: 'BTC',
      IconUrl:
        'https://lkefiles.blob.core.windows.net/images/api/issuers/btc.png',
      Id: 'BTC',
      IsBase: true,
      KycNeeded: true,
      Name: 'BTC',
      SwiftDepositEnabled: false
    },
    {
      Accuracy: 2,
      BankCardsDepositEnabled: false,
      BlockchainDepositEnabled: false,
      CanBeBase: true,
      CategoryId: '72698be5-fb91-46e2-9003-e3ce949bc97a',
      DisplayId: 'CHF',
      IconUrl:
        'https://lkefiles.blob.core.windows.net/images/api/issuers/lykke.png',
      Id: 'CHF',
      IsBase: true,
      KycNeeded: true,
      Name: 'CHF',
      SwiftDepositEnabled: true
    },
    {
      Accuracy: 6,
      BankCardsDepositEnabled: false,
      BlockchainDepositEnabled: true,
      CanBeBase: false,
      CategoryId: 'c0b74792-ecb3-44f6-a733-2f84339a39e7',
      DisplayId: 'ETH',
      IconUrl:
        'https://lkefiles.blob.core.windows.net/images/api/asset_cat/ios/eth.png',
      Id: 'ETH',
      IsBase: false,
      KycNeeded: false,
      Name: 'ETH',
      SwiftDepositEnabled: false
    },
    {
      Accuracy: 2,
      BankCardsDepositEnabled: true,
      BlockchainDepositEnabled: false,
      CanBeBase: true,
      CategoryId: '72698be5-fb91-46e2-9003-e3ce949bc97a',
      DisplayId: 'EUR',
      IconUrl:
        'https://lkefiles.blob.core.windows.net/images/api/issuers/lykke.png',
      Id: 'EUR',
      IsBase: true,
      KycNeeded: false,
      Name: 'EUR',
      SwiftDepositEnabled: true
    },
    {
      Accuracy: 2,
      BankCardsDepositEnabled: true,
      BlockchainDepositEnabled: false,
      CanBeBase: true,
      CategoryId: '72698be5-fb91-46e2-9003-e3ce949bc97a',
      DisplayId: 'GBP',
      IconUrl:
        'https://lkefiles.blob.core.windows.net/images/api/issuers/lykke.png',
      Id: 'GBP',
      IsBase: true,
      KycNeeded: true,
      Name: 'GBP',
      SwiftDepositEnabled: true
    },
    {
      Accuracy: 2,
      BankCardsDepositEnabled: false,
      BlockchainDepositEnabled: true,
      CanBeBase: true,
      CategoryId: '72698be5-fb91-46e2-9003-e3ce949bc97a',
      DisplayId: 'LKK',
      IconUrl:
        'https://lkefiles.blob.core.windows.net/images/api/issuers/lykke.png',
      Id: 'LKK',
      IsBase: true,
      KycNeeded: true,
      Name: 'LKK',
      SwiftDepositEnabled: false
    },
    {
      Accuracy: 2,
      BankCardsDepositEnabled: true,
      BlockchainDepositEnabled: false,
      CanBeBase: true,
      CategoryId: '72698be5-fb91-46e2-9003-e3ce949bc97a',
      DisplayId: 'USD',
      IconUrl:
        'https://lkefiles.blob.core.windows.net/images/api/issuers/lykke.png',
      Id: 'USD',
      IsBase: true,
      KycNeeded: true,
      Name: 'USD',
      SwiftDepositEnabled: true
    }
  ]
};

export const mockAssetPairs = {
  AssetPairs: [
    {
      Id: 'BTCCHF',
      Accuracy: 3,
      BaseAssetId: 'BTC',
      InvertedAccuracy: 8,
      Name: 'BTC/CHF',
      QuotingAssetId: 'CHF'
    },
    {
      Id: 'BTCEUR',
      Accuracy: 3,
      BaseAssetId: 'BTC',
      InvertedAccuracy: 8,
      Name: 'BTC/EUR',
      QuotingAssetId: 'EUR'
    },
    {
      Id: 'BTCGBP',
      Accuracy: 3,
      BaseAssetId: 'BTC',
      InvertedAccuracy: 8,
      Name: 'BTC/GBP',
      QuotingAssetId: 'GBP'
    },
    {
      Id: 'BTCLKK',
      Accuracy: 2,
      BaseAssetId: 'BTC',
      InvertedAccuracy: 8,
      Name: 'BTC/LKK',
      QuotingAssetId: 'LKK'
    },
    {
      Id: 'BTCUSD',
      Accuracy: 3,
      BaseAssetId: 'BTC',
      InvertedAccuracy: 8,
      Name: 'BTC/USD',
      QuotingAssetId: 'USD'
    },
    {
      Id: 'ETHBTC',
      Accuracy: 5,
      BaseAssetId: 'ETH',
      InvertedAccuracy: 5,
      Name: 'ETH/BTC',
      QuotingAssetId: 'BTC'
    },
    {
      Id: 'ETHCHF',
      Accuracy: 5,
      BaseAssetId: 'ETH',
      InvertedAccuracy: 5,
      Name: 'ETH/CHF',
      QuotingAssetId: 'CHF'
    },
    {
      Id: 'ETHLKK',
      Accuracy: 6,
      BaseAssetId: 'ETH',
      InvertedAccuracy: 8,
      Name: 'ETH/LKK',
      QuotingAssetId: 'LKK'
    },
    {
      Id: 'ETHUSD',
      Accuracy: 5,
      BaseAssetId: 'ETH',
      InvertedAccuracy: 5,
      Name: 'ETH/USD',
      QuotingAssetId: 'USD'
    },
    {
      Id: 'EURCHF',
      Accuracy: 5,
      BaseAssetId: 'EUR',
      InvertedAccuracy: 5,
      Name: 'EUR/CHF',
      QuotingAssetId: 'CHF'
    },
    {
      Id: 'EURGBP',
      Accuracy: 5,
      BaseAssetId: 'EUR',
      InvertedAccuracy: 5,
      Name: 'EUR/GBP',
      QuotingAssetId: 'GBP'
    },
    {
      Id: 'EURUSD',
      Accuracy: 5,
      BaseAssetId: 'EUR',
      InvertedAccuracy: 5,
      Name: 'EUR/USD',
      QuotingAssetId: 'USD'
    },
    {
      Id: 'GBPCHF',
      Accuracy: 5,
      BaseAssetId: 'GBP',
      InvertedAccuracy: 5,
      Name: 'GBP/CHF',
      QuotingAssetId: 'CHF'
    },
    {
      Id: 'GBPUSD',
      Accuracy: 5,
      BaseAssetId: 'GBP',
      InvertedAccuracy: 5,
      Name: 'GBP/USD',
      QuotingAssetId: 'USD'
    },
    {
      Id: 'GBPUSDcy',
      Accuracy: 5,
      BaseAssetId: 'GBP',
      InvertedAccuracy: 5,
      Name: 'GBP/USD',
      QuotingAssetId: 'USD'
    },
    {
      Id: 'LKKCHF',
      Accuracy: 5,
      BaseAssetId: 'LKK',
      InvertedAccuracy: 2,
      Name: 'LKK/CHF',
      QuotingAssetId: 'CHF'
    },
    {
      Id: 'LKKEUR',
      Accuracy: 5,
      BaseAssetId: 'LKK',
      InvertedAccuracy: 2,
      Name: 'LKK/EUR',
      QuotingAssetId: 'EUR'
    },
    {
      Id: 'LKKGBP',
      Accuracy: 5,
      BaseAssetId: 'LKK',
      InvertedAccuracy: 2,
      Name: 'LKK/GBP',
      QuotingAssetId: 'GBP'
    },
    {
      Id: 'LKKUSD',
      Accuracy: 5,
      BaseAssetId: 'LKK',
      InvertedAccuracy: 3,
      Name: 'LKK/USD',
      QuotingAssetId: 'USD'
    },
    {
      Id: 'USDCHF',
      Accuracy: 5,
      BaseAssetId: 'USD',
      InvertedAccuracy: 5,
      Name: 'USD/CHF',
      QuotingAssetId: 'CHF'
    }
  ]
};

export const mockMarket = [
  {
    AssetPair: 'EURCHF',
    Volume24H: 0,
    PriceChange24H: 0,
    LastPrice: 1.14311,
    Bid: 1.13784,
    Ask: 1.14311
  },
  {
    AssetPair: 'BTCUSD',
    Volume24H: 10.38266309,
    PriceChange24H: -0.0488155546089968,
    LastPrice: 6996.246,
    Bid: 7002.956,
    Ask: 7012.834
  },
  {
    AssetPair: 'BTCGBP',
    Volume24H: 2.89,
    PriceChange24H: 0.142857142857143,
    LastPrice: 1.6,
    Bid: 1.45,
    Ask: 1.6
  },
  {
    AssetPair: 'ETHUSD',
    Volume24H: 0,
    PriceChange24H: 0,
    LastPrice: 0,
    Bid: 76.01607,
    Ask: 152.03213
  },
  {
    AssetPair: 'ETHBTC',
    Volume24H: 0,
    PriceChange24H: 0,
    LastPrice: 0,
    Bid: 0.03487,
    Ask: 10.04109
  },
  {
    AssetPair: 'LKKUSD',
    Volume24H: 0,
    PriceChange24H: 0,
    LastPrice: 0,
    Bid: 1.88847,
    Ask: 3.15414
  },
  {
    AssetPair: 'EURGBP',
    Volume24H: 0,
    PriceChange24H: 0,
    LastPrice: 0.89289,
    Bid: 0.90466,
    Ask: 0.90477
  },
  {
    AssetPair: 'BTCCHF',
    Volume24H: 3.601,
    PriceChange24H: -0.0330073777393594,
    LastPrice: 6908.907,
    Bid: 6792.784,
    Ask: 6806.386
  },
  {
    AssetPair: 'LKKEUR',
    Volume24H: 0,
    PriceChange24H: 0,
    LastPrice: 0,
    Bid: 0.97126,
    Ask: 2.72128
  },
  {
    AssetPair: 'GBPUSDcy',
    Volume24H: 0,
    PriceChange24H: 0,
    LastPrice: 0,
    Bid: 0.01,
    Ask: 0.1
  },
  {
    AssetPair: 'BTCLKK',
    Volume24H: 0,
    PriceChange24H: 0,
    LastPrice: 0,
    Bid: 0.7,
    Ask: 1.1
  },
  {
    AssetPair: 'ETHLKK',
    Volume24H: 0,
    PriceChange24H: 0,
    LastPrice: 0,
    Bid: 69.186425,
    Ask: 193.846651
  },
  {
    AssetPair: 'USDCHF',
    Volume24H: 0,
    PriceChange24H: 0,
    LastPrice: 0.97627,
    Bid: 0.96975,
    Ask: 0.97527
  },
  {
    AssetPair: 'BTCEUR',
    Volume24H: 0,
    PriceChange24H: 0,
    LastPrice: 8200,
    Bid: 6028.001,
    Ask: 6049.816
  },
  {
    AssetPair: 'LKKCHF',
    Volume24H: 0,
    PriceChange24H: 0,
    LastPrice: 0,
    Bid: 1.85032,
    Ask: 3.11
  },
  {
    AssetPair: 'GBPCHF',
    Volume24H: 0,
    PriceChange24H: 0,
    LastPrice: 1.32247,
    Bid: 1.24873,
    Ask: 1.2501
  },
  {
    AssetPair: 'ETHCHF',
    Volume24H: 0,
    PriceChange24H: 0,
    LastPrice: 0,
    Bid: 101.74033,
    Ask: 283.06947
  },
  {
    AssetPair: 'GBPUSD',
    Volume24H: 0,
    PriceChange24H: 0,
    LastPrice: 0,
    Bid: 1.28112,
    Ask: 1.28167
  },
  {
    AssetPair: 'EURUSD',
    Volume24H: 0,
    PriceChange24H: 0,
    LastPrice: 1.16275,
    Bid: 1.16211,
    Ask: 1.16275
  },
  {
    AssetPair: 'LKKGBP',
    Volume24H: 0,
    PriceChange24H: 0,
    LastPrice: 0,
    Bid: 1.3,
    Ask: 1.4
  }
];

export const mockDescriptions = {
  Descriptions: [
    {
      Id: 'BTC',
      AssetClass: 'Cryptocurrency',
      Description: 'Bitcoin',
      IssuerName: null,
      NumberOfCoins: '15 mln',
      AssetDescriptionUrl: null,
      FullName: 'Bitcoin'
    },
    {
      Id: 'CHF',
      AssetClass: 'FX',
      Description: 'CHF colored coins ',
      IssuerName: null,
      NumberOfCoins: '100k',
      AssetDescriptionUrl: null,
      FullName: null
    },
    {
      Id: 'ETH',
      AssetClass: null,
      Description: null,
      IssuerName: null,
      NumberOfCoins: null,
      AssetDescriptionUrl: null,
      FullName: null
    },
    {
      Id: 'EUR',
      AssetClass: 'FX',
      Description: 'EUR colored coins.',
      IssuerName: null,
      NumberOfCoins: null,
      AssetDescriptionUrl: null,
      FullName: 'European union Euro'
    },
    {
      Id: 'GBP',
      AssetClass: 'FX',
      Description: 'GBP colored coins',
      IssuerName: null,
      NumberOfCoins: null,
      AssetDescriptionUrl: null,
      FullName: null
    },
    {
      Id: 'LKK',
      AssetClass: 'Equity',
      Description:
        'Lykke equity colored coins ! 1 Lykke coin represents 1/100 of the Lykke Corp share 1 Lykke coin represents 1/100 of the Lykke Corp share',
      IssuerName: null,
      NumberOfCoins: '1.25 bln',
      AssetDescriptionUrl: null,
      FullName: 'Lykke Shares'
    },
    {
      Id: 'USD',
      AssetClass: 'FX',
      Description: 'USD colored coins',
      IssuerName: null,
      NumberOfCoins: null,
      AssetDescriptionUrl: null,
      FullName: null
    }
  ]
};

export class MockAssetApi implements AssetApi {
  fetchAll = () => Promise.resolve<any>(mockAssets);
  fetchAvailableAssets = () =>
    Promise.resolve<any>({AssetIds: mockAssets.Assets.map(asset => asset.Id)});
  fetchBaseAsset = () => Promise.resolve<any>({BaseAssetId: 'BTC'});
  fetchAssetInstruments = () => Promise.resolve<any>(mockAssetPairs);
  fetchPublicAssetInstruments = () => Promise.resolve<any>(mockAssetPairs);
  setBaseAsset = () => Promise.resolve();
  fetchAssetById = (id: string) =>
    Promise.resolve<any>(mockAssets.Assets.find(asset => asset.Id === id));
  fetchMarket = () => Promise.resolve<any[]>(mockMarket);
  fetchAssetsDescriptions = () => Promise.resolve<any>(mockDescriptions);
}
export default new MockAssetApi();

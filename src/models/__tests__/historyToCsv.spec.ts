import {generateCsvRow, historyToCsv} from '../mappers/historyToCsv';

describe('mapToCsv mappers', () => {
  const csvHeader =
    'Date\tType\tExchange\tBase amount\tBase currency\tQuote amount\tQuote currency\tFee\tFee currency\n';

  const record = {
    Id: '1',
    DateTime: Date.now().toLocaleString(),
    Type: 'CashIn',
    State: '',
    Amount: 1,
    Asset: 'BTC',
    AssetPair: 'BTCCHF',
    Price: 1000,
    FeeSize: 10,
    FeeType: ''
  };

  describe('generateCsvRow function', () => {
    it('should return a string representation of a HistoryResponseModel', () => {
      const row = generateCsvRow(record);
      expect(row).toBeDefined();
    });
  });

  describe('historyToCsv function', () => {
    it('should return a string representation of an array of HistoryResponseModel', () => {
      const csv = historyToCsv([record, record]);
      expect(csv).toBeDefined();
      expect(csv).not.toEqual(csvHeader);
    });

    it('should return csvHeader if array is empty', () => {
      const csv = historyToCsv([]);
      expect(csv).toEqual(csvHeader);
    });
  });
});

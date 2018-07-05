import saveFile from '../exportDataAndSave';

describe('Data to CSV helper', () => {
  describe('saveFile method', () => {
    const fetchHistory = jest.fn(() => Promise.resolve([]));

    it('should fetch data', () => {
      saveFile(fetchHistory);
      expect(fetchHistory).toBeCalled();
    });
  });
});

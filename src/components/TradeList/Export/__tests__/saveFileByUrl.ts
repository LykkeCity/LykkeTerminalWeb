import saveFile from '../saveFileByUrl';

describe('File save helper', () => {
  describe('saveFile method', () => {
    const fetchCsvUrl = jest.fn(() => Promise.resolve([]));

    it('should fetch url', () => {
      saveFile(fetchCsvUrl);
      expect(fetchCsvUrl).toBeCalled();
    });
  });
});

import {buildUrl, pathOrNot} from '../url';

describe('url routines', () => {
  describe('pathOrNot', () => {
    it('should return nothing if path param is not passed', () => {
      expect(pathOrNot()).toBe('');
      expect(pathOrNot()).toHaveLength(0);
    });

    it('should return nothing if path param is undefined', () => {
      expect(pathOrNot(undefined)).toBe('');
      expect(pathOrNot()).toHaveLength(0);
    });

    it('should return /path if path param is passed', () => {
      expect(pathOrNot('foo')).toBe('/foo');
      expect(pathOrNot('foo')).not.toBe('//foo');
      expect(pathOrNot('foo')).not.toBe('foo');
    });

    it('should return /path if /path is passed in non-canonical', () => {
      const path = '/foo';
      expect(pathOrNot(path)).toBe('/foo');
      expect(pathOrNot(path)).not.toBe('//foo');
      expect(pathOrNot(path)).not.toBe('foo');
    });
  });

  describe('build url', () => {
    it('should build canonical url', () => {
      expect(buildUrl('https://host.com')('/foo')).toBe('https://host.com/foo');
      expect(buildUrl('https://host.com')('foo')).toBe('https://host.com/foo');
      expect(buildUrl('http://host.com')('foo')).toBe('http://host.com/foo');
    });
  });
});

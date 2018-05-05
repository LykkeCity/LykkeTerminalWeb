import {throwPastParam} from '../fn';

describe('Test fn', () => {
  it('should call callback with param', () => {
    const value = 'value';
    const f = (param: any) => param;
    const result = throwPastParam(value, f);
    expect(result).toBe(value);
  });
});

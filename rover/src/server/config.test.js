import config from './config'

describe('config loader', () => {

  it('should read local config when environment is not production', () => {
    const local = config(undefined);
    expect(local.name).toBe('local');
  });

  it('should not find production config locally', () => {
    expect(() => {
      config('production')
    }).toThrow();
  });

});

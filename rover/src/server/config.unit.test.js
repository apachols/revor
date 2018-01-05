import config from './config'

describe('config loader', () => {

  it('should read local config when environment is not production', () => {
    const local = config(undefined);
    expect(local.name).toBe('local');
  });

  // This test will fail if you leave a production config sitting in the
  // config directory.  It serves as an early warning that you may be
  // able to connect to production on your local machine / from a test environment!
  it('should not find production config locally', () => {
    expect(() => {
      config('production')
    }).toThrow();
  });

});

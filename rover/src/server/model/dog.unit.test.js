import DogModel from './dog'

import { testDB } from '../db';

jest.mock('../db');

describe('data validation', () => {
  const name = 'Doc';
  const ownerid = 1;
  const validDog = { name, ownerid };
  const model = DogModel(testDB);
  const testBadInput = async (input) => {
    try {
      await input.validate();
      expect(true).toBe('Caught error');
    } catch (e) {
      expect(e.name).toMatch('SequelizeValidationError');
    }
  }
  it('should error on blank name', async () => {
    await testBadInput(model.build({ ...validDog, name: '' }));
  });
  it('should error on missing ownerid', async () => {
    await testBadInput(model.build({ ...validDog, ownerid: undefined }));
  });
  it('should validate if all fields ok', async () => {
    const d = model.build({ ...validDog });
    await d.validate();
    expect(d.get('name')).toBe(name);
  });
});

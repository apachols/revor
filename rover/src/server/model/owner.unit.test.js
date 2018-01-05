import OwnerModel from './owner'

import { testDB } from '../db';

jest.mock('../db');

const userid = 32;
const name = 'Adam P.';
const image = 'http://placekitten.com/g/500/500?user=12';
const validOwner = { name, image, userid };

describe('data validation', () => {
  const model = OwnerModel(testDB);
  const testBadInput = async (input) => {
    try {
      await input.validate();
      expect(true).toBe('Caught error');
    } catch (e) {
      expect(e.name).toMatch('SequelizeValidationError');
    }
  }
  it('should error on blank name', async () => {
    await testBadInput(model.build({ ...validOwner, name: '' }));
  });
  it('should error on blank image', async () => {
    await testBadInput(model.build({ ...validOwner, image: '' }));
  });
  it('should error on non-url image', async () => {
    await testBadInput(model.build({ ...validOwner, image: '24601' }));
  });
  it('should error on missing userid', async () => {
    await testBadInput(model.build({ ...validOwner, userid: undefined }));
  });
  it('should validate if all fields ok', async () => {
    const o = model.build({ ...validOwner });
    await o.validate();
    expect(o.get('name')).toBe(name);
  });
});

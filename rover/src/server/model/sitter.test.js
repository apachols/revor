import SitterModel from './sitter'

import { testDB } from '../db';

jest.mock('../db');

describe('sitter model tests', () => {
  const userid = 1;
  const name = 'Testy M.';
  const image = 'http://placekitten.com/g/500/500?user=12';
  const validSitter = { name, image, userid };

  describe('data validation', () => {
    const model = SitterModel(testDB);
    const testBadInput = async (input) => {
      try {
        await input.validate();
        expect(true).toBe('Caught error');
      } catch (e) {
        expect(e.name).toMatch('SequelizeValidationError');
      }
    }
    it('should error on blank name', async () => {
      await testBadInput(model.build({ ...validSitter, name: '' }));
    });
    it('should error on blank image', async () => {
      await testBadInput(model.build({ ...validSitter, image: '' }));
    });
    it('should error on non-url image', async () => {
      await testBadInput(model.build({ ...validSitter, image: '24601' }));
    });
    it('should error on missing userid', async () => {
      await testBadInput(model.build({ ...validSitter, userid: undefined }));
    });
    it('should validate if all fields ok', async () => {
      const s = model.build({ ...validSitter });
      await s.validate();
      expect(s.get('name')).toBe(name);
    });
  });
})

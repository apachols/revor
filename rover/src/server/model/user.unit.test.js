import UserModel from './user'

import { testDB } from '../db';

jest.mock('../db');

describe('user model tests', () => {
  const email = 'danascully@fbi.gov';
  const phone = '+18009997766'
  const validUser = { email, phone };

  describe('data validation', () => {
    const model = UserModel(testDB);
    const testBadInput = async (input) => {
      try {
        await input.validate();
        expect(true).toBe('Caught error');
      } catch (e) {
        expect(e.name).toMatch('SequelizeValidationError');
      }
    }
    it('should error on blank email', async () => {
      await testBadInput(model.build({ ...validUser, email: '' }));
    });
    it('should error on bad email', async () => {
      await testBadInput(model.build({ ...validUser, email: 'foo' }));
    });
    it('should error on blank phone', async () => {
      await testBadInput(model.build({ ...validUser, phone: '' }));
    });
    it('should error on missing phone', async () => {
      await testBadInput(model.build({ ...validUser, phone: undefined }));
    });
    it('should error on short phone', async () => {
      await testBadInput(model.build({ ...validUser, phone: '+1' }));
    });
    it('should error on non plus phone', async () => {
      await testBadInput(model.build({ ...validUser, phone: '018005551212' }));
    });
    it('should validate if all fields ok', async () => {
      const u = model.build({ ...validUser });
      await u.validate();
      expect(u.get('email')).toBe(email);
    });
  });
});

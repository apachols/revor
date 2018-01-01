import UserModel from './user'

import testDB from '../db';

jest.mock('../db');

const email = 'danascully@fbi.gov';
const phone = '+18009997766'

describe('data validation', () => {
  it('should throw error on bad email', done => {
    const User = UserModel(testDB);
    const u = User.build({ email: 'foo', phone })
    u.validate().catch(e => {
      expect(e.name).toMatch('SequelizeValidationError');
      done();
    });
  });

  describe('phone number validation', () => {
    it('should throw error on non-numeric phone', done => {
      const User = UserModel(testDB);
      const u = User.build({ email, phone: 'xyz' });
      u.validate().catch(e => {
        expect(e.name).toMatch('SequelizeValidationError');
        done();
      });
    });
    it('should throw error on too short phone', done => {
      const User = UserModel(testDB);
      const u = User.build({ email, phone: '+100' });
      u.validate().catch(e => {
        expect(e.name).toMatch('SequelizeValidationError');
        done();
      });
    });
    it('should throw error on too non plus phone', done => {
      const User = UserModel(testDB);
      const u = User.build({ email, phone: '180012345678' });
      u.validate().catch(e => {
        expect(e.name).toMatch('SequelizeValidationError');
        done();
      });
    });
  });
});

describe('database operations', () => {
  beforeEach(async () => {
    const User = UserModel(testDB);
    expect(User).not.toBeUndefined();
    await User.sync({ force: true });
    const u = await User.create({ email, phone });
    expect(u.email).toBe(email);
  });

  it('should read from a test db', async () => {
    const User = UserModel(testDB);
    const u = await User.findOne({ where: { email } });
    expect(u.get('phone')).toBe(phone);
  });
});

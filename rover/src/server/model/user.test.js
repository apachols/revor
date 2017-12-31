import UserModel from './user'

import testDB from '../db';

jest.mock('../db');

const email = 'danascully@fbi.gov';
const phone = '18009876543'

describe('database operations', () => {
  beforeEach(async () => {
    const User = UserModel(testDB);
    expect(User).not.toBeUndefined();
    await User.sync({ force: true });
    const scully = await User.create({ email, phone });
    expect(scully.email).toBe(email);
  });

  it('should read from a test db', async () => {
    const User = UserModel(testDB);
    const user = await User.findOne({ where: { email } });
    expect(user.get('phone')).toBe(phone);
  });
});

import StayModel from './stay'

import { testDB } from '../db';

jest.mock('../db');

describe('stay model tests', () => {
  const ownerid = 1;
  const sitterid = 1;
  const start = '2017-12-30';
  const end = '2017-12-31';
  const validStay = { sitterid, ownerid, start, end };

  describe('data validation', () => {
    const model = StayModel(testDB);
    const testBadInput = async (input) => {
      try {
        await input.validate();
        expect(true).toBe('Caught error');
      } catch (e) {
        expect(e.name).toMatch('SequelizeValidationError');
      }
    }
    it('should error on bad start date', async () => {
      await testBadInput(model.build({ ...validStay, start: 'asdf' }));
    });
    it('should error on bad end date', async () => {
      await testBadInput(model.build({ ...validStay, end: 'asdf' }));
    });
    it('should error on start after end', async () => {
      await testBadInput(model.build({ ...validStay, start: end, end: start }));
    });
    it('should work for start = end', async () => {
      const s = model.build({ ...validStay, start: end, end: end });
        await s.validate();
        expect(s.get('ownerid')).toBe(ownerid);
    });
    it('should error on missing owner', async () => {
      await testBadInput(model.build({ ...validStay, ownerid: undefined }));
    });
    it('should error on missing sitter', async () => {
      await testBadInput(model.build({ ...validStay, sitterid: undefined }));
    });
  });

})

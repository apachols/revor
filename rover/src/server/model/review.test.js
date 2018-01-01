import ReviewModel from './review'

import { testDB } from '../db';

jest.mock('../db');

describe('review model tests', () => {
  const rating = 5;
  const ownerid = 1;
  const sitterid = 1;
  const reviewtextid = 1;
  const userid = 1;
  const start = '2017-12-30';
  const end = '2017-12-31';
  const validReview = { rating, reviewtextid, sitterid, ownerid, userid, start, end };

  describe('data validation', () => {
    const model = ReviewModel(testDB);
    const testBadInput = async (input) => {
      try {
        await input.validate();
        expect(true).toBe('Caught error');
      } catch (e) {
        expect(e.name).toMatch('SequelizeValidationError');
      }
    }
    it('should error on zero rating', async () => {
      await testBadInput(model.build({ ...validReview, rating: 0 }));
    });
    it('should error on rating > 5', async () => {
      await testBadInput(model.build({ ...validReview, rating: 6 }));
    });
    it('should error on decimal rating', async () => {
      await testBadInput(model.build({ ...validReview, rating: 2.5 }));
    });
    it('should error on non integer rating', async () => {
      await testBadInput(model.build({ ...validReview, rating: 'asdf' }));
    });
    it('should error on empty string rating', async () => {
      await testBadInput(model.build({ ...validReview, rating: '' }));
    });
    it('should error on bad start date', async () => {
      await testBadInput(model.build({ ...validReview, start: 'asdf' }));
    });
    it('should error on bad end date', async () => {
      await testBadInput(model.build({ ...validReview, end: 'asdf' }));
    });
    it('should error on start after end', async () => {
      await testBadInput(model.build({ ...validReview, start: end, end: start }));
    });
    it('should work for start = end', async () => {
      const r = model.build({ ...validReview, start: end, end: end });
        await r.validate();
        expect(r.get('ownerid')).toBe(ownerid);
    });
    // it('should not have same sitter and owner', async () => {
    //   To check for this we'd need to go to the database; not sure
    //   validate() is an appropriate place for that check.
    //   Maybe if we have a factory method that takes Sitter / Owner instances.
    // });
    it('should error on missing owner', async () => {
      await testBadInput(model.build({ ...validReview, ownerid: undefined }));
    });
    it('should error on missing sitter', async () => {
      await testBadInput(model.build({ ...validReview, sitterid: undefined }));
    });
  });

})

import ReviewModel from './review'

import testDB from '../db';

jest.mock('../db');

const rating = 5;
const ownerid = 1;
const userid = 1;
const start = '2017-12-30';
const end = '2017-12-31';
const validReview = { rating, ownerid, userid, start, end };

describe('data validation', () => {
  const model = ReviewModel(testDB);
  const testBadInput = async (input) => {
    try {
      await input.validate();
      expect(true).toBe('caught error');
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

  // it('should error on bad start date', () => {
  // });
  // it('should error on bad end date', () => {
  // });
  // it('should error on start after end', () => {
  // });
  // it('should error on missing owner', () => {
  // });
  // it('should error on missing sitter', () => {
  // });
});

describe('database operations', () => {
  beforeEach(async () => {
    const model = ReviewModel(testDB);
    expect(model).not.toBeUndefined();
    await model.sync({ force: true });
  });

  it('should create a review record', async () => {
      const model = ReviewModel(testDB);
      const review = await model.create(validReview);
      const r = await model.findOne({ where: { reviewid: review.get('reviewid') } });
      expect(r.get('ownerid')).toBe(ownerid);
  });
});

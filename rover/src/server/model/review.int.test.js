import ReviewTextModel from './reviewtext'
import ReviewModel from './review'
import SitterModel from './sitter'

import { testDB, setupTestDB } from '../db';

jest.mock('../db');

describe('review model integration tests', () => {
  const rating = 5;
  const ownerid = 1;
  let sitterid = 1;
  const reviewtextid = 1;
  const userid = 1;
  const start = '2017-12-30';
  const end = '2017-12-31';
  const validReview = { rating, reviewtextid, sitterid: 1, ownerid, userid, start, end };

  describe('database operations', () => {
    beforeAll(() => {
      return setupTestDB();
    });

    it('should use the factory to create a review, then retrieve it', async () => {
        const model = ReviewModel(testDB);
        const reviewTextModel = ReviewTextModel(testDB);

        const sitterModel = SitterModel(testDB);
        sitterid = await sitterModel.findOne().then(s => s.get('sitterid'));

        const review = await model.factory({
          ...validReview, sitterid, text: 'If we could just join hands!'
        });
        const r = await model.findOne({
          where: {
            reviewid: review.get('reviewid')
          },
          include: [ { 'model': reviewTextModel, 'as': 'Text' } ]
        });
        expect(r.Text.text).toBe('If we could just join hands!');
    });
  });
})

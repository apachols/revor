import ReviewTextModel from './reviewtext'
import ReviewModel from './review'
import SitterModel from './sitter'
import StayModel from './stay'
import OwnerModel from './owner'

import { testDB, addUserOwnerAndSitter, addStayAndReview } from '../db';

const cleanDB = require('../cleandb')(testDB);

jest.mock('../db');

describe('review model integration tests', () => {
  const sitterModel = SitterModel(testDB);
  const ownerModel = OwnerModel(testDB);
  const stayModel = StayModel(testDB);
  const reviewTextModel = ReviewTextModel(testDB);

  beforeAll(async () => {
    await cleanDB();

    await addUserOwnerAndSitter('Alexa');
    await addUserOwnerAndSitter('Peter');
    await addUserOwnerAndSitter('Zero');
  });

  describe('getRatingStats', () => {
    it('should return zeros for invalid sitterid', async () => {
      const model = ReviewModel(testDB);
      const { ratingtotal, ratingcount } = await model.getRatingStats(-1);
      expect(ratingtotal).toBe(0);
      expect(ratingcount).toBe(0);
    });

    it('should return correct rating count and total for valid sitterid', async () => {
      const sitter = await sitterModel.findOne({ where: { sitterid: 1 }});
      const sitterid = sitter.get('sitterid');

      const owner = await ownerModel.findOne({ where: { ownerid: 2 }});
      const ownerid = owner.get('ownerid');

      await addStayAndReview(sitterid, ownerid, '2018-01-01','2018-01-01', 2, 'Meh');
      await addStayAndReview(sitterid, ownerid, '2018-01-02','2018-01-02', 4, 'Pretty good!');

      const model = ReviewModel(testDB);
      const { ratingtotal, ratingcount } = await model.getRatingStats(sitterid);
      expect(ratingtotal).toBe(6);
      expect(ratingcount).toBe(2);
    });
  });

  describe('factory method', () => {
    it('should use the factory to create a review, then retrieve it', async () => {
        const model = ReviewModel(testDB);

        const sitter = await sitterModel.findOne({ where: { sitterid: 3 }});
        const sitterid = sitter.get('sitterid');

        const owner = await ownerModel.findOne();
        const ownerid = owner.get('ownerid');

        const stay = await stayModel.create({ ownerid, sitterid, start: '2018-01-01', end: '2018-01-01' });
        const stayid = stay.get('stayid');

        const review = await model.factory({
          sitterid, ownerid, stayid, rating: 5, text: 'If we could just join hands!'
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

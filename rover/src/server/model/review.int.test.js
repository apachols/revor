import ReviewTextModel from './reviewtext'
import ReviewModel from './review'
import SitterModel from './sitter'
import UserModel from './user'
import StayModel from './stay'
import OwnerModel from './owner'

import { testDB } from '../db';

const cleanDB = require('../cleandb')(testDB);

jest.mock('../db');

describe('review model integration tests', () => {
  const userModel = UserModel(testDB);
  const sitterModel = SitterModel(testDB);
  const ownerModel = OwnerModel(testDB);
  const stayModel = StayModel(testDB);
  const reviewTextModel = ReviewTextModel(testDB);

  beforeAll(async () => {
    await cleanDB();

    // TODO use fancy functions to create these users

    const user1 = await userModel.create({
      email: 'one@example.com',
      phone: '+18005551212'
    });
    const sitter1 = await sitterModel.create({
      name: 'User 1',
      image: 'http://placekitten.com/g/500/500?user=11',
      userid: user1.get('userid')
    });
    const user2 = await userModel.create({
      email: 'two@example.com',
      phone: '+18005551234'
    });
    const owner2 = await ownerModel.create({
      name: 'User 2',
      image: 'http://placekitten.com/g/500/500?user=12',
      userid: user2.get('userid')
    });
    const stay1 = await stayModel.create({
      ownerid: owner2.get('ownerid'),
      sitterid: sitter1.get('sitterid'),
      start: '2018-01-01',
      end: '2018-01-01'
    });
  });

  describe('getRatingStats', () => {
    it('should return zeros for invalid sitterid', async () => {
      const model = ReviewModel(testDB);
      const { ratingtotal, ratingcount } = await model.getRatingStats(-1);
      expect(ratingtotal).toBe(0);
      expect(ratingcount).toBe(0);
    });

    it('should return correct rating count and total for valid sitterid', async () => {
      const sitter = await sitterModel.findOne();
      expect(sitter).not.toBeNull();

      const owner = await ownerModel.findOne();
      expect(owner).not.toBeNull();

      const stay = await stayModel.findOne();
      expect(stay).not.toBeNull();

      const reviewtext = await reviewTextModel.create({
        text: 'I was underwhelmed'
      });
      expect(reviewtext).not.toBeNull();

      const sitterid = sitter.get('sitterid');
      const ownerid = owner.get('ownerid');
      const stayid = stay.get('stayid');
      const reviewtextid = reviewtext.get('reviewtextid');
      const rating = 2;
      const validReview = { sitterid, ownerid, stayid, reviewtextid, rating };

      const model = ReviewModel(testDB);
      await model.create(validReview);
      const { ratingtotal, ratingcount } = await model.getRatingStats(sitterid);
      expect(ratingtotal).toBe(2);
      expect(ratingcount).toBe(1);
    });
  });

  describe('factory method', () => {

    it('should use the factory to create a review, then retrieve it', async () => {
        const model = ReviewModel(testDB);

        const sitter = await sitterModel.findOne();
        expect(sitter).not.toBeNull();

        const owner = await ownerModel.findOne();
        expect(owner).not.toBeNull();

        const stay = await stayModel.findOne();
        expect(stay).not.toBeNull();

        const sitterid = sitter.get('sitterid');
        const ownerid = owner.get('ownerid');
        const stayid = stay.get('stayid');

        const rating = 5;

        const review = await model.factory({
          sitterid, ownerid, stayid, rating, text: 'If we could just join hands!'
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

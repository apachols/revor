import OverallRankModel from './overallrank'
import ReviewModel from './review'

import { testDB, setupTestDB } from '../db';

jest.mock('../db');

describe('overallrank model integration tests', () => {

  describe('addRatingAndRecalcOverallRank', () => {
    beforeAll(() => {
      return setupTestDB();
    });

    it('should add a rating correctly and mark dirty when no ratings present', async () => {
      const model = OverallRankModel(testDB);
      const o = await model.build({
        sitterid: 1, sitterscore: 3.14
      });
      await o.addRatingAndRecalcOverallRank(5);
      expect(o.get('ratingcount')).toBe(1);
      expect(o.get('ratingtotal')).toBe(5);
      expect(o.get('ratingscore')).toBe(5);
      expect(o.get('overallrank')).toBe(3.326);
      expect(o.get('dirty')).toBe(1);
    });

    it('should pass the 10 rating test listed in the project spec', async () => {
      const model = OverallRankModel(testDB);
      const o = await model.build({
        sitterid: 1, sitterscore: 2.5, overallrank: 2.5
      });
      const results = [
        2.75, 3.0, 3.25, 3.5, 3.75, 4.0, 4.25, 4.5, 4.75, 5.0, 5.0
      ];
      for (let result of results) {
        await o.addRatingAndRecalcOverallRank(5);
        expect(o.get('overallrank')).toBe(result);
      }
    });
  });

  describe('calculateOverallRank', () => {
    beforeAll(() => {
      return setupTestDB();
    });

    it('should calculate correctly when no ratings present', async () => {
      const model = OverallRankModel(testDB);
      const o = model.build({ sitterid: 3 });
      await o.calculateOverallRank();
      expect(o.get('dirty')).toBe(0);
      expect(o.get('ratingcount')).toBe(0);
      expect(o.get('ratingtotal')).toBe(0);
      expect(o.get('ratingscore')).toBe(0);
      expect(o.get('sitterscore')).toBe(0.7692);
      expect(o.get('overallrank')).toBe(0.7692);
    });

    it('should calculate correctly when fewer than 10 ratings present', async () => {
      const model = OverallRankModel(testDB);
      const o = model.build({ sitterid: 1 });
      await o.calculateOverallRank();
      expect(o.get('dirty')).toBe(0);
      expect(o.get('sitterscore')).toBe(0.7692);
      expect(o.get('ratingcount')).toBe(2);
      expect(o.get('ratingtotal')).toBe(6);
      expect(o.get('ratingscore')).toBe(3);
      expect(o.get('overallrank')).toBe(1.2154);
    });

    it('should pass the 10 rating test listed in the project spec', async () => {
      const model = OverallRankModel(testDB);
      const o = model.build({ sitterid: 2 });

      const reviewmodel = ReviewModel(testDB);
      const promises = [];
      for (let ii=1; ii < 15; ii++) {
        let start = '2018-01-' + String(ii).padStart(2,'0');
        let end = start;
        promises.push(reviewmodel.factory({
          sitterid: 2, ownerid: 1, rating: 5, text: 'review #' + ii, start, end
        }));
      }

      await Promise.all(promises);
      await o.calculateOverallRank();
      expect(o.get('dirty')).toBe(0);
      expect(o.get('sitterscore')).toBe(0.7692);
      expect(o.get('ratingcount')).toBe(14);
      expect(o.get('ratingtotal')).toBe(70);
      expect(o.get('ratingscore')).toBe(5);
      expect(o.get('overallrank')).toBe(5);
    });
  });
})

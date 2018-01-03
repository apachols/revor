import OverallRankModel from './overallrank'
import SitterModel from './sitter'
import OwnerModel from './owner'

import { testDB, addStayAndReview, addUserOwnerAndSitter } from '../db';

const cleanDB = require('../cleandb')(testDB);

jest.mock('../db');

describe('overallrank model integration tests', () => {
  const sitterModel = SitterModel(testDB);
  const ownerModel = OwnerModel(testDB);

  beforeAll(async () => {
    await cleanDB();

    const user1 = await addUserOwnerAndSitter('Jane');
    const ownerid1 = user1.ownerid;

    const user2 = await addUserOwnerAndSitter('Adam P');
    const sitterid2 = user2.sitterid;

    await addStayAndReview(sitterid2, ownerid1, '2018-01-01', '2018-01-01', 5, 'woof');
    await addStayAndReview(sitterid2, ownerid1, '2018-01-02', '2018-01-02', 1, 'blah');
  });

  describe('addRatingAndRecalcOverallRank', () => {
    it('should add a rating correctly and mark dirty when no ratings present', async () => {
      const sitter = await sitterModel.findOne();
      expect(sitter).not.toBeNull();
      const sitterid = sitter.get('sitterid');

      const model = OverallRankModel(testDB);
      const o = await model.build({
        sitterid, sitterscore: 3.14
      });
      await o.addRatingAndRecalcOverallRank(5);
      expect(o.get('ratingcount')).toBe(1);
      expect(o.get('ratingtotal')).toBe(5);
      expect(o.get('ratingscore')).toBe(5);
      expect(o.get('overallrank')).toBe(3.326);
      expect(o.get('dirty')).toBe(1);
    });

    it('should pass the 10 rating test listed in the project spec', async () => {
      const sitter = await sitterModel.findOne();
      expect(sitter).not.toBeNull();
      const sitterid = sitter.get('sitterid');

      const model = OverallRankModel(testDB);
      const o = await model.build({
        sitterid, sitterscore: 2.5, overallrank: 2.5
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
    it('should calculate correctly when no ratings present', async () => {
      // sitter #1
      const sitter = await sitterModel.findOne({ where: { sitterid: 1 }});
      expect(sitter).not.toBeNull();
      const sitterid = sitter.get('sitterid');

      const model = OverallRankModel(testDB);
      const o = model.build({ sitterid });

      await o.calculateOverallRank();
      expect(o.get('dirty')).toBe(0);
      expect(o.get('ratingcount')).toBe(0);
      expect(o.get('ratingtotal')).toBe(0);
      expect(o.get('ratingscore')).toBe(0);
      expect(o.get('sitterscore')).toBe(0.7692);
      expect(o.get('overallrank')).toBe(0.7692);
    });

    it('should calculate correctly when fewer than 10 ratings present', async () => {
      // sitter #2
      const sitter = await sitterModel.findOne({ where: { sitterid: 2 }});
      expect(sitter).not.toBeNull();
      const sitterid = sitter.get('sitterid');

      const model = OverallRankModel(testDB);
      const o = model.build({ sitterid });
      await o.calculateOverallRank();
      expect(o.get('dirty')).toBe(0);
      expect(o.get('sitterscore')).toBe(0.7692);
      expect(o.get('ratingcount')).toBe(2);
      expect(o.get('ratingtotal')).toBe(6);
      expect(o.get('ratingscore')).toBe(3);
      expect(o.get('overallrank')).toBe(1.2154);
    });

    it('should pass the 10 rating test listed in the project spec', async () => {
      // sitter #3
      const { sitterid } = await addUserOwnerAndSitter('abcdefghijklm');

      const owner = await ownerModel.findOne();
      expect(owner).not.toBeNull();
      const ownerid = owner.get('ownerid');

      const model = OverallRankModel(testDB);
      const o = model.build({ sitterid });

      const results = [
        2.5, 2.75, 3.0, 3.25, 3.5, 3.75, 4.0, 4.25, 4.5, 4.75, 5.0, 5.0, 5.0
      ];
      for (let ii=1; ii < 12; ii++) {
        let start = '2018-01-' + String(ii).padStart(2,'0');
        let end = start;

        await addStayAndReview(sitterid,ownerid,start,end,5,'woof');
        await o.calculateOverallRank();
        expect(o.get('dirty')).toBe(0);
        expect(o.get('sitterscore')).toBe(2.5);
        expect(o.get('ratingcount')).toBe(ii);
        expect(o.get('ratingtotal')).toBe(Math.floor(5*ii));
        expect(o.get('ratingscore')).toBe(5);
        expect(o.get('overallrank')).toBe(results[ii]);
      }
    });
  });
})

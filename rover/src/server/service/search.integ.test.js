import SearchService from './search';

import {
  testDB,
  addStayAndReview,
  addUserOwnerAndSitter,
  updateOverallRank
} from '../db';

jest.mock('../db');

const cleanDB = require('../cleandb')(testDB);

describe('search service integration tests', () => {
  let ownerid;
  let sitterLongNameId;
  let sitterMediumNameId;
  let sitterShortNameId;
  beforeAll(async () => {
      await cleanDB();
      const user1 = await addUserOwnerAndSitter('The Owner');
      ownerid = user1.ownerid;

      const user2 = await addUserOwnerAndSitter('The quick brown fox jumps over the lazy dog');
      sitterLongNameId = user2.sitterid;

      const user3 = await addUserOwnerAndSitter('Not such a long name');
      sitterMediumNameId = user3.sitterid;

      const user4 = await addUserOwnerAndSitter('Shorty');
      sitterShortNameId = user4.sitterid;

      for (let ii=0; ii < 9; ii++) {
        let date = '2018-01-' + String(ii+1).padStart(2,'0');
        await addStayAndReview(sitterShortNameId, ownerid, date, date, 5, 'woof!');
      }

      for (let ii=0; ii < 5; ii++) {
        let date = '2018-01-' + String(ii+1).padStart(2,'0');
        await addStayAndReview(sitterMediumNameId, ownerid, date, date, 4, 'Pretty good');
      }

      // ratingscore 5, overallrank (.9)*5 + (.1)*5*6/26 = 4.6154
      const r1 = await updateOverallRank(sitterShortNameId);
      expect(r1.get('overallrank')).toBe(4.6154);
      expect(r1.get('ratingscore')).toBe(5);
      // ratingscore 4, overallrank (.5)*4 + (.5)*5*12/26 = 3.1539
      const r2 = await updateOverallRank(sitterMediumNameId);
      expect(r2.get('overallrank')).toBe(3.1539);
      expect(r2.get('ratingscore')).toBe(4);
      // ratingscore 0, overallrank (0)*4 + (1)*5*12/26 = 5
      const r3 = await updateOverallRank(sitterLongNameId);
      expect(r3.get('overallrank')).toBe(5);
      expect(r3.get('ratingscore')).toBe(0);

      // Add 30 more rows at the end so we can test the pager
      for (let ii=0; ii < 30; ii++) {
        let userData = await addUserOwnerAndSitter('Pager' + ii);
        await updateOverallRank(userData.sitterid);
      }
  });

  describe('results are in the right order', async () => {
    let totalRows, pageResults;
    beforeAll(async () => {
      const search = SearchService(testDB);
      const res = await search.getSittersByOverallRank(0,0);
      totalRows = res.totalRows;
      pageResults = res.pageResults;
      expect(totalRows).toBe(33);
    });

    it('should position longest name with zero reviews first', async () => {
      const { name, rating } = pageResults[0];
      expect(name).toBe('The quick brown fox jumps over the lazy dog');
      expect(rating).toBe(0);
    });

    it('should position short name with 9 5-star reviews second', async () => {
      const { name, rating } = pageResults[1];
      expect(name).toBe('Shorty');
      expect(rating).toBe(5);
    });

    it('should position medium name with ok reviews third', async () => {
      const { name, rating } = pageResults[2];
      expect(name).toBe('Not such a long name');
      expect(rating).toBe(4);
    });
  });

  describe('filter by rating score', async () => {
    it('should return first page of results', async () => {
      const search = SearchService(testDB);
      const { totalRows, pageResults } = await search.getSittersByOverallRank(1, 0);
      expect(totalRows).toBe(33);
      expect(pageResults.length).toBe(20);
    });

    it('should return second page of results', async () => {
      const search = SearchService(testDB);
      const { totalRows, pageResults } = await search.getSittersByOverallRank(2, 0);
      expect(totalRows).toBe(33);
      expect(pageResults.length).toBe(13);
    });

    it('should return empty result set for third page', async () => {
      const search = SearchService(testDB);
      const { totalRows, pageResults } = await search.getSittersByOverallRank(3, 0);
      expect(totalRows).toBe(33);
      expect(pageResults.length).toBe(0);
    });
  });

  describe('results include review and repeat counts', async () => {
    let pageResults;
    beforeAll(async () => {
      const search = SearchService(testDB);
      const res = await search.getSittersByOverallRank(0,0);
      pageResults = res.pageResults;
    });
    it('should find 0 repeat count for new sitter with no reviews', async () => {
      const { name, rating, reviewCount, repeatCount } = pageResults[0];
      expect(name).toBe('The quick brown fox jumps over the lazy dog');
      expect(rating).toBe(0);
      expect(reviewCount).toBe(0);
      expect(repeatCount).toBe(0);
    });
    it('should find 1 repeat count nine reviews from same owner', async () => {
      const { name, rating, reviewCount, repeatCount } = pageResults[1];
      expect(name).toBe('Shorty');
      expect(rating).toBe(5);
      expect(reviewCount).toBe(9);
      expect(repeatCount).toBe(1);
    });
  });

  describe('filter by rating score', async () => {
    it('should filter by rating score, not by overall rank', async () => {
      const search = SearchService(testDB);
      // upping our minimum rating to 1 excludes our long name sitter and the pager tests
      const { totalRows, pageResults } = await search.getSittersByOverallRank(1, 1);
      expect(totalRows).toBe(2);
      expect(pageResults[0].name).toBe('Shorty');
      expect(pageResults[1].name).toBe('Not such a long name');
    });
  });
});

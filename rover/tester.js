
const sequelize = require('sequelize');

const db = require('./src/server/db');

const SearchService = (db) => {

  return {
    getSittersByOverallRank: async (pageNumber, minRating) => {
      const pageSize = 20;
      const offset = Math.floor(pageSize * (pageNumber-1));

      const totalRows = await db.query(
        `select count(1) as totalRows
           from overallrank
           join sitter using (sitterid)
          where ratingscore >= ?`,
        { replacements: [ minRating ], type: sequelize.QueryTypes.RAW }
      ).spread((results) => {
        return results[0].totalRows;
      });

      const pageResults = await db.query(
        `select name, image, ratingscore as rating, count(reviewid) as reviewCount,
                count(distinct repeatOwnerId) as repeatCount
         from overallrank
         join sitter using (sitterid)
         join review using (sitterid)
         left join (
           select sitterid, ownerid repeatOwnerId, count(stayid) as stayCount
           from sitter
           join stay using(sitterid)
           group by sitterid, ownerid
           having stayCount > 1
         ) as repeatClients using(sitterid)
         where ratingscore >= ?
         group by overallrank, sitterid, name, image, ratingscore
         order by overallrank desc, sitterid limit ? offset ?`,
        { replacements: [ minRating, pageSize, offset ], type: sequelize.QueryTypes.RAW }
      ).spread((results) => {
        return results;
      });

      return { totalRows, pageResults };
    }
  }
};

const search = SearchService(db);

search.getSittersByOverallRank(1,1).then(x => {
  console.log('DONE!', x);
})

const sequelize = require('sequelize');

const pageSize = 20;

const SearchService = (db) => {
  return {
    getSittersByOverallRank: async (pageNumber, minRating) => {
      // Sanitize the input again.  We'll escape it below.
      minRating = parseInt(minRating, 10) || 0;
      pageNumber = parseInt(pageNumber, 10) || 0;
      let offset = Math.floor((pageNumber - 1) * pageSize);
      offset = Math.max(offset, 0);

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
         group by sitterid, overallrank, name, image, ratingscore
         order by overallrank, sitterid desc limit ? offset ?`,
        { replacements: [ minRating, pageSize, offset ], type: sequelize.QueryTypes.RAW }
      ).spread((results) => {
        return results;
      });

      return { totalRows, pageResults };
    }
  }
};

module.exports = SearchService;

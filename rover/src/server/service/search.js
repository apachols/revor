const sequelize = require('sequelize');

const SearchService = (db) => {
  return {
    getSittersByOverallRank: (minRating) => {
      return db.query(`
        select name, image, ratingscore as rating,
               count(reviewid) as reviewCount,
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
        order by overallrank, sitterid desc
      `,
      { replacements: [ minRating ], type: sequelize.QueryTypes.RAW }
      ).spread((results, metadata) => {
        return results;
      });
    }
  }
};

module.exports = SearchService;

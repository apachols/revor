
const db = require('./src/server/db');

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
        group by sitterid, overallrank, name, image, ratingscore
        order by overallrank, sitterid desc
      `).spread((results, metadata) => {
        return results;
      });
    }
  }
};

const search = SearchService(db);

search.getSittersByOverallRank().then(x => {
  console.log('DONE!', x);
})

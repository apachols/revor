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

      /*
        So it turns out that the sqlite3 database I had been using for local development and integration
        tests does not support a handy feature available in mysql - SQL_CALC_FOUND_ROWS.  Drat.

        SQL_CALC_FOUND_ROWS is a keyword you can put in front of a query that has LIMIT and OFFSET clauses,
        which will tell sql to keep track of the total number of rows the query would have returned without
        the limit and offset clauses.

        This is perfect for pagination of search results, of course, because to know how many pages you need
        to know the total number of results.  Also, with the proper indexes / database setup, SQL_CALC_FOUND_ROWS
        should be much faster, because you only have to do the real query one time!

        What I would do for a next step for this project is replace the sqlite3 database with mysql in a container;
        this is better going forward because we'd be running tests against the same setup as production, and we
        could do containerized deployment.

        As it stands, I decided to run a second query, a quick one, hopefully, to get the total number of rows.
        This will work in both mysql and sqlite3.
       */
      const totalRows = await db.query(
        `select count(1) as totalRows
           from overallrank
           join sitter using (sitterid)
          where ratingscore >= ?`,
        { replacements: [ minRating ], type: sequelize.QueryTypes.RAW }
      ).spread((results) => {
        return results[0].totalRows;
      });

      // The repeatClients temporary table below is not in the spec, but these sorts
      // of counting group by temp tables are usually pretty fast.  If we wanted to improve search
      // performance on a large number of records, I'd look again at whether the main search query
      // should calculate that.  If we wanted to improve performance, we could include the repeat
      // client count on the overallrank table, or a similar aggregator.
      const pageResults = await db.query(
        `select name, image, ratingscore as rating, count(reviewid) as reviewCount,
                count(distinct repeatOwnerId) as repeatCount
         from overallrank
         join sitter using (sitterid)
         left join review using (sitterid)
         left join (

           select sitterid, ownerid repeatOwnerId, count(stayid) as stayCount
           from stay
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

module.exports = SearchService;

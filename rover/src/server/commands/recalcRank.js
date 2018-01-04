/**
 *  Batch process all overallrank records that need recalculation:
 *
 *  node src/server/commands/recalcRank.js
 *
 *  Writes any discrepancies found in the recalc to this log file:
 *
 *  logs/app.log
 */

const db = require('../db');

const { logger } = require('../logger');

const OverallRankModel = require('../model/overallrank')(db);

/**
 * Do a quick comparison of the listed fields
 * @param  {Object} before      ranking data before recalc
 * @param  {Object} after       ranking data after recalc
 * @param  {Array}  fields      fields to check
 * @return {Number}             number of differences logged
 */
const compareRankFields = (before, after, fields) => {
  let differences = 0;
  for (let field of fields) {
    let left = before[field];
    let right = after[field];
    if (left !== right) {
      differences++;
      logger.error(
        `sitter ${overallrank.get('sitterid')} differs in ${field}, before ${left} after ${right}`
      );
    }
  }
  return differences;
}

/**
 * Pull all overallrank records marked 'dirty'; those have had a review added or deleted.
 * Recalculate and save them, and log whether any of the stats changed.
 * @return {Promise}
 */
const recalcRank = async () => {
  logger.info('Starting recalc');

  const dirty = await OverallRankModel.findAll({
    where: { dirty: 1 }
  });

  logger.info(`Recalculating ${dirty.length} dirty records`);

  let totalDifferences = 0;
  const fieldsToCompare = ['overallrank', 'sitterscore', 'ratingcount', 'ratingtotal', 'ratingscore'];
  for (let rank of dirty) {
    const before = rank.dataValues;
    await rank.calculateOverallRank();
    const after = rank.dataValues
    totalDifferences += compareRankFields(before, after, fieldsToCompare);
  }

  logger.info(`found ${totalDifferences} differences after recalculation`);

  await db.close().then(() => logger.info('Recalc complete'));
}

recalcRank().catch(e => {
  logger.error(e.stack);
})

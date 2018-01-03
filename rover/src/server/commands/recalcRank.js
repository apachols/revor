const db = require('../db');

const fs = require('fs');
const path = require('path');
const appDirectory = fs.realpathSync(process.cwd());

const log4js = require('log4js');
log4js.configure({
  appenders: {
    'recalc': {
      type: 'file', filename: path.resolve(appDirectory, 'logs/recalc.log')
    }
  },
  categories: { default: { appenders: ['recalc'], level: 'info' } }
});
const logger = log4js.getLogger('recalc');

const OverallRankModel = require('../model/overallrank')(db);

const compareRankFields = (overallrank, fields) => {
  let differences = 0;
  for (let field of fields) {
    let before = overallrank.get(field);
    let after = overallrank.get(field);
    if (before !== after) {
      differences++;
      logger.error(
        `sitter ${overallrank.get('sitterid')} differs, before ${before} after ${after}`
      );
    }
  }
  return differences;
}

const recalcRank = async () => {
  logger.info('Starting recalc');

  const dirty = await OverallRankModel.findAll({
    where: { dirty: 1 }
  });

  logger.info(`Recalculating ${dirty.length} dirty records`);

  let totalDifferences = 0;
  const fieldsToCompare = ['overallrank', 'sitterscore', 'ratingcount', 'ratingtotal', 'ratingscore'];
  for (let rank of dirty) {
    await rank.calculateOverallRank();
    totalDifferences += compareRankFields(rank, fieldsToCompare);
  }

  logger.info(`found ${totalDifferences} differences after recalculation`);

  await db.close().then(() => logger.info('Recalc complete'));
}

recalcRank().catch(e => {
  logger.error(e.stack);
})

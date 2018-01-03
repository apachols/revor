const db = require('../db');

const fs = require('fs');
const path = require('path');
const appDirectory = fs.realpathSync(process.cwd());

const log4js = require('log4js');
log4js.configure({
  appenders: {
    import: {
      type: 'file', filename: path.resolve(appDirectory, 'logs/import.log')
    }
  },
  categories: { default: { appenders: ['import'], level: 'info' } }
});
const logger = log4js.getLogger('import');

const DogModel = require('../model/dog')(db);
const StayModel = require('../model/stay')(db);
const UserModel = require('../model/user')(db);
const SitterModel = require('../model/sitter')(db);
const OwnerModel = require('../model/owner')(db);
const ReviewModel = require('../model/review')(db);
const OverallRankModel = require('../model/overallrank')(db);

const cleanDB = require('../cleandb')(db);

const csvFilePath = path.resolve(appDirectory, 'data/reviews.csv');
const csv = require('csvtojson');

// TODO it would be better to handle the CSV as a stream,
//      in case we had to do a HUGE CSV
const getDataCSV = async () => {
  return new Promise((resolve, reject) => {
    const data = [];
    csv().fromFile(csvFilePath)
    .on('json',(jsonObj)=>{
      data.push(jsonObj);
    })
    .on('done',(error)=>{
    	if (error) {
        reject (error);
      } else {
        resolve(data);
      }
    });
  })
}

// add all the data to the database!
const processDataRow = async (row) => {
  const sitterUser = await UserModel.findOrCreate({
    where: {
      email: row.sitter_email,
      phone: row.sitter_phone_number
    }
  }).spread((user, created) => {
    return user;
  });
  const sitter = await SitterModel.findOrCreate({
    where: {
      userid: sitterUser.get('userid'),
      name: row.sitter,
      image: row.sitter_image
    }
  }).spread((sitter, created) => {
    return sitter;
  });
  const ownerUser = await UserModel.findOrCreate({
    where: {
      email: row.owner_email,
      phone: row.owner_phone_number
    }
  }).spread((user, created) => {
    return user;
  });
  const owner = await OwnerModel.findOrCreate({
    where: {
      userid: ownerUser.get('userid'),
      name: row.owner,
      image: row.owner_image
    }
  }).spread((owner, created) => {
    return owner;
  });

  // Add stay
  const stay = await StayModel.create({
    ownerid: owner.get('ownerid'),
    sitterid: sitter.get('sitterid'),
    start: row.start_date,
    end: row.end_date
  });

  // Add dogs! :)
  let dogInfo = { ownerid: owner.get('ownerid') };
  const dogNames = row.dogs.split('|');
  const dogs = [];
  for (let name of dogNames) {
    dogs.push({ ...dogInfo, name });
    await DogModel.findOrCreate({
      where: { ...dogInfo, name }
    }).spread((dog, created) =>  {
      // TODO add dogstay records :)
    });
  }

  // Add review and rating
  await ReviewModel.factory({
    text: row.text,
    rating: row.rating,
    stayid: stay.get('stayid'),
    ownerid: owner.get('ownerid'),
    sitterid: sitter.get('sitterid')
  });

  const overallrank = await OverallRankModel.findOrCreate({
    where: { sitterid: sitter.get('sitterid') }
  }).spread((overallrank, created) => {
    if (created) {
      overallrank.set('sitterscore', sitter.sitterScore());
    }
    return overallrank;
  });

  // Do the quick calculation by adding rank here, then we'll recalc all the
  // overall rank records after all the review records have been added and compare
  await overallrank.addRatingAndRecalcOverallRank(parseInt(row.rating, 10));
}

// DATA WEIRDNESS:
//
// I found the following duplicate names in the dataset.  Since the
// email and phone number are different in each case, it seems like
// these aren't duplicate accounts, but rather just same-name collisions.
//
// Christopher J.|135|user5529@gmail.com|+17203809059
// Christopher J.|136|user8132@gmail.com|+11788477459
// Lisa H.|146|user9545@t-mobile.com|+15415823959
// Nicole G.|171|user6354@gmail.com|+17818056323
// Lisa H.|242|user9272@hotmail.com|+19050712311
// Nicole G.|247|user1983@gmail.com|+17332435022
//
// TODO Oh wait I can add sanity check SQLs to this program!
// * Duplicate sitters by name
// * Duplicate owners by name
// * Duplicate dogs by name, ownerid
// * Stay with same sitter and owner user


const runImport = async () => {
  logger.info('Starting import');

  console.time('cleanDB');
  await cleanDB();
  console.timeEnd('cleanDB');

  logger.info('Clean db complete');
  console.time('readCSV');
  const data = await getDataCSV();
  console.timeEnd('readCSV');

  console.time('processData');
  for (let row of data) {
    await(processDataRow(row));
  }
  console.timeEnd('processData');
  await db.close().then(() => logger.info('Import complete'));
}

runImport().catch(e => {
  logger.error(e.stack);
})

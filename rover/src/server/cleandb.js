const cleanDB = db => {

  const DogModel = require('./model/dog')(db);
  const StayModel = require('./model/stay')(db);
  const UserModel = require('./model/user')(db);
  const SitterModel = require('./model/sitter')(db);
  const OwnerModel = require('./model/owner')(db);
  const ReviewModel = require('./model/review')(db);
  const ReviewTextModel = require('./model/reviewtext')(db);
  const OverallRankModel = require('./model/overallrank')(db);

  // To preserve foreign key constraints, drop and re-create
  // the following order:  rank before review, review before sitter, etc.
  const models = [
    DogModel,
    OverallRankModel,
    ReviewModel,
    ReviewTextModel,
    StayModel,
    SitterModel,
    OwnerModel,
    UserModel
  ];
  const dbCleaner = async function() {
    for (let m of models) {
      await m.drop();
    }
    models.reverse();
    for (let m of models) {
      await m.sync();
    }
  }
  return dbCleaner;
};

module.exports = cleanDB;

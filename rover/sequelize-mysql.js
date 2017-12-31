const Sequelize = require('sequelize');

// Connect to google cloud platform SQL instance.  Seems fast to me!
const db = new Sequelize('rover', 'root', '123lqsym)(*', {
  dialect: 'mysql',
  host: '35.197.70.0'
});

const Sitter = require('./src/lib/model/sitter')(db);

const tester = async () => {
  await Sitter.sync({force: true})

  await Sitter.create({
    name: 'harry potter',
    userid: 2,
    imageid: 2
  });

  db.close().then( () => console.log('all done!'));
}

tester();

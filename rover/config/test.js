module.exports = {
  name: 'local',
  database: ['test.db', 'username', 'password', {
    dialect: 'sqlite',
    storage: './test.db'
  }]
}

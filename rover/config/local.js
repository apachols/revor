module.exports = {
  name: 'local',
  database: ['rover.db', 'username', 'password', {
    dialect: 'sqlite',
    storage: './rover.db'
  }]
}

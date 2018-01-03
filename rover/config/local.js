module.exports = {
  name: 'local',
  database: ['rover.db', 'username', 'password', {
    dialect: 'sqlite',
    logging: false,
    storage: './rover.db',
    operatorsAliases: false
  }]
}

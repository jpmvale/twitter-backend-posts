const dbConfig = require('../config/database')
const sequelize = require('sequelize')

const connection = new sequelize(dbConfig)

connection.authenticate().catch((e) => {
  console.log('Could not connect to the database')
  console.log(e)
})

module.exports = connection
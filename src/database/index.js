const dbConfig = require('../config/database')
const sequelize = require('sequelize')
const User = require('../app/models/User')
const Follower = require('../app/models/Follower')
const PostType = require('../app/models/PostType')
const Post = require('../app/models/Post')

const connection = new sequelize(dbConfig)

connection.authenticate().catch((e) => {
  console.log('Could not connect to the database')
  console.log(e)
})

User.init(connection)
Follower.init(connection)
PostType.init(connection)
Post.init(connection)


User.associate(connection.models)
Follower.associate(connection.models)
PostType.associate(connection.models)
Post.associate(connection.models)

module.exports = connection
require("dotenv").config()
const User = require('../models/User')
const Follower = require('../models/Follower')
const Post = require('../models/Post')
const { StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const maximumUsernameSize = process.env.MAXIMUM_USER_NAME_SIZE
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const getExtraDataFromUser = async (id, name, created_at) => {
  const followersNumber = await Follower.count({
    where: {
      following_id: id
    }
  })
  const followingNumber = await Follower.count({
    where: {
      follower_id: id
    }
  })
  const postsNumber = await Post.count({
    where: {
      user_id: id
    }
  })
  const date = new Date(created_at)
  const dateJoined = (months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear())
  const obj = { id, name, followersNumber, followingNumber, postsNumber, dateJoined }
  return obj
}

module.exports = {
  async createUser (req, res) {
    try {
      const { name } = req.body
      if (name && name.length <= maximumUsernameSize) {
        if (!name.match(/^[0-9a-z]+$/)) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Only alphanumeric characters are allowed in user name'
          })
        }
        const user = await User.create({ name })
        return res.status(StatusCodes.OK).json(user)
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'You must specify a name for the user and it can not have more than '
            + maximumUsernameSize + ' characters'
        })
      }
    }
    catch (e) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message })
    }
  },
  async getAllUsers (req, res) {
    const { page = 0, limit = 10 } = req.query
    const offset = limit * (page ? Number(page) : 0)
    try {
      const users = await User.findAndCountAll({
        attributes: ['id', 'name', 'created_at'],
        offset,
        limit
      })
      return res.status(StatusCodes.OK).json({ limit: Number(limit), count: users.count, page: Number(page), users: users.rows })
    } catch (e) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message })
    }
  },
  // this sould be used to display detailed data from the user
  async getUserById (req, res) {
    try {
      const { id } = req.params
      const user = await User.findByPk(id)
      return res.status(StatusCodes.OK).json(await getExtraDataFromUser(user.id, user.name))
    } catch (e) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message })
    }
  },
  async getAllFollowersByUserId (req, res) {
    const { page = 0, limit = 10 } = req.query
    const offset = limit * (page ? Number(page) : 0)
    try {
      const { id } = req.params
      const followersObjs = await Follower.findAll({
        where: {
          following_id: id
        },
        attributes: ['follower_id']
      })
      const followerIds = []
      followersObjs.forEach(follower => { followerIds.push(follower.follower_id) })
      const followers = await User.findAndCountAll({
        where: {
          id: {
            [Sequelize.Op.in]: followerIds
          }
        },
        limit,
        offset
      })
      return res.status(StatusCodes.OK).json({ limit: Number(limit), count: followers.count, page: Number(page), followers: followers.rows })
    } catch (e) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message })
    }
  },
  async getAllFollowingByUserId (req, res) {
    const { page = 0, limit = 10 } = req.query
    const offset = limit * (page ? Number(page) : 0)
    try {
      const { id } = req.params
      const followingObjs = await Follower.findAll({
        where: {
          follower_id: id
        },
        attributes: ['following_id']
      })
      const followingIds = followingObjs.map(following => following.following_id)
      const following = await User.findAndCountAll({
        where: {
          id: {
            [Sequelize.Op.in]: followingIds
          }
        },
        limit,
        offset
      })
      return res.status(StatusCodes.OK).json({ limit: Number(limit), count: following.count, page: Number(page), following: following.rows })
    } catch (e) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message })
    }
  },
  async followUser (req, res) {
    //basically follower_id will now follow following_id
    const { follower_id, following_id } = req.body

    if (await Follower.findOne({ where: { follower_id, following_id } })) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'User ' + follower_id + ' already follows user ' + following_id })
    }
    await Follower.create({
      follower_id,
      following_id,
    })
    return res.status(StatusCodes.OK).json({ message: 'User ' + follower_id + ' is now following ' + following_id })
  },
  async unfollowUser (req, res) {
    //basically id will now unfollow userId
    const { follower_id, following_id } = req.body
    const followInstance = await Follower.findOne({ where: { follower_id, following_id }, attributes: ['id'] })
    if (followInstance) {
      await Follower.destroy({
        where: {
          id: followInstance.id
        }
      })
      return res.status(StatusCodes.OK).json({ message: 'User ' + follower_id + ' is not anymore following user ' + following_id })
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'User ' + follower_id + ' do not follow user ' + following_id })
    }
  }
}
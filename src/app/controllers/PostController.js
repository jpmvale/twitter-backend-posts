require("dotenv").config()
const User = require("../models/User")
const Follower = require("../models/Follower")
const Post = require("../models/Post")
const PostType = require("../models/PostType")
const { StatusCodes } = require("http-status-codes")
const Sequelize = require('sequelize')

const maximumPostSize = Number(process.env.MAXIMUM_POST_SIZE)
const originalPostId = Number(process.env.ORIGINAL_POST_ID)
const repostId = Number(process.env.REPOST_ID)
const quotePostId = Number(process.env.QUOTE_POST_ID)

module.exports = {
  async getPostById (req, res) {
    try {
      const { postId } = req.params
      const post = await Post.findOne({
        where: { id: postId },
        include: [{
          model: User,
          as: 'user'
        }, {
          model: PostType,
          as: 'post_type'
        }
        ],
        attributes: { exclude: ['user_id', 'post_type_id'] }
      })
      return res.status(StatusCodes.OK).json(post)
    } catch (e) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message })
    }
  },
  async getAllPosts (req, res) {
    const { page = 0, limit = 10 } = req.query
    const offset = limit * (page ? Number(page) : 0)
    try {
      const posts = await Post.findAndCountAll({
        include: [{
          model: User,
          as: 'user'
        }, {
          model: PostType,
          as: 'post_type'
        }
        ],
        attributes: { exclude: ['user_id', 'post_type_id'] },
        offset,
        limit
      })
      return res.status(StatusCodes.OK).json({ limit: Number(limit), count: posts.count, page: Number(page), posts: posts.rows })
    } catch (e) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message })
    }
  },
  async getAllPostsByUserId (req, res) {
    const { id } = req.params
    const { page = 0, limit = 10 } = req.query
    const offset = limit * (page ? Number(page) : 0)
    try {
      const posts = await Post.findAndCountAll({
        where: {
          user_id: id
        },
        include: [{
          model: User,
          as: 'user'
        }, {
          model: PostType,
          as: 'post_type',
          attributes: ['name']
        }
        ],
        attributes: { exclude: ['user_id', 'post_type_id'] },
        offset,
        limit
      })
      return res.status(StatusCodes.OK).json({ limit: Number(limit), count: posts.count, page: Number(page), posts: posts.rows })
    } catch (e) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message })
    }
  },
  async getAllFollowingPostsByUserId (req, res) {
    const { id } = req.params
    const { page = 0, limit = 10 } = req.query
    const offset = limit * (page ? Number(page) : 0)

    const followinUsersIds = await Follower.findAll({ where: { follower_id: id }, attributes: ['following_id'], order: [['created_at', 'DESC']] })
    const ids = followinUsersIds.map(following => following.following_id)

    try {
      const posts = await Post.findAndCountAll({
        where: {
          user_id: {
            [Sequelize.Op.in]: ids
          }
        },
        include: [{
          model: User,
          as: 'user'
        }, {
          model: PostType,
          as: 'post_type',
          attributes: ['name']
        }
        ],
        attributes: { exclude: ['user_id', 'post_type_id'] },
        offset,
        limit
      })
      return res.status(StatusCodes.OK).json({ limit: Number(limit), count: posts.count, page: Number(page), posts: posts.rows })
    } catch (e) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message })
    }
  },
  async createPost (req, res) {
    const { id } = req.params
    const { message } = req.body
    try {
      if (message.length > maximumPostSize) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Cannot insert a post with over ' + maximumPostSize + ' characters' })
      }
      const post = await Post.create({ user_id: id, message, post_type_id: originalPostId })
      return res.status(StatusCodes.OK).json(post)
    } catch (e) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message })
    }
  },
  async createRepost (req, res) {
    const { id, postId } = req.params
    try {
      const originalPostExists = await Post.findOne({ where: { id: postId } })
      if (originalPostExists) {
        const post = Post.create({ user_id: id, post_type_id: repostId, original_post_id: postId })
        return res.status(StatusCodes.OK).json(post)
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Cannot repost a invalid postId" })
      }
    } catch (e) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message })
    }
  },
  async createQuotePost (req, res) {
    const { id, postId } = req.params
    const { message } = req.body
    try {
      if (message.length > maximumPostSize) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Cannot insert a post with over ' + maximumPostSize + ' characters' })
      }
      const originalPostExists = await Post.findOne({ where: { id: postId } })
      if (originalPostExists) {
        const post = Post.create({ user_id: id, post_type_id: quotePostId, original_post_id: postId, message })
        return res.status(StatusCodes.OK).json(post)
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Cannot quote-post a invalid postId" })
      }
    } catch (e) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message })
    }
  },
  async searchPost (req, res) {
    const { page = 0, limit = 10 } = req.query
    const offset = limit * (page ? Number(page) : 0)
    const { message } = req.body
    try {
      const search = await Post.findAndCountAll({
        where: {
          message: {
            [Sequelize.Op.substring]: message
          },
          post_type_id: {
            [Sequelize.Op.in]: [originalPostId, quotePostId]
          }
        },
        include: [{
          model: User,
          as: 'user'
        }, {
          model: PostType,
          as: 'post_type',
          attributes: ['name']
        }
        ],
        attributes: { exclude: ['user_id', 'post_type_id'] },
        limit,
        offset
      })
      return res.status(StatusCodes.OK).json({ limit: Number(limit), count: search.count, page: Number(page), posts: search.rows })
    } catch (e) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "No posts matches this message", error: e.message })
    }
  },
}
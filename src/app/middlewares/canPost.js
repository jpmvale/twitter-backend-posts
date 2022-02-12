const Post = require("../models/Post")
const { StatusCodes } = require("http-status-codes")

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params
    const posts = await Post.findAll({
      where: {
        user_id: id
      },
      order: [['created_at', 'DESC']],
      limit: 5
    })
    if (posts.length > 4) {

      const firstPostDate = new Date(posts.slice(-1).pop().created_at)
      const currentTimestamp = new Date().getTime()
      const dayTimestamp = 24 * 60 * 60 * 1000
      const yesterdayDate = new Date(currentTimestamp - dayTimestamp)
      if (firstPostDate >= yesterdayDate)
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'You cannot post more than 5 posts daily' })
      else return next()
    }
    return next()
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message })
  }
}
const User = require("../models/User")
const { StatusCodes } = require("http-status-codes")

module.exports = async (req, res, next) => {
  const { follower_id, following_id } = req.body
  if (follower_id === following_id)
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'User cannot follow himself!' })
  try {
    const followerExists = await User.findOne({ where: { id: follower_id } })
    const followingExists = await User.findOne({ where: { id: following_id } })
    if (followerExists && followingExists) {
      return next()
    }
    else return res.status(StatusCodes.BAD_REQUEST).json({ message: 'One or both of the ids provided in the body does not exists in the database' })
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message })
  }
}
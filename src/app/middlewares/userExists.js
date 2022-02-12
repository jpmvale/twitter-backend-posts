const User = require("../models/User")
const { StatusCodes } = require("http-status-codes")

module.exports = async (req, res, next, id) => {
  try {
    const userExists = await User.findOne({ where: { id } })
    if (userExists) {
      return next()
    }
    else return res.status(StatusCodes.BAD_REQUEST).json({ message: 'User of ' + id + ' was not found in the database' })
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message })
  }
}
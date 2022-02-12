const routes = require('express').Router()

routes.get('/', (req, res) => {
  return res.send("Running")
})

module.exports = routes
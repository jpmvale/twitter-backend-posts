const routes = require('express').Router({ mergeParams: true })
const UserController = require('./app/controllers/UserController')
const PostController = require('./app/controllers/PostController')
const userExistsMiddleware = require('./app/middlewares/userExists')
const userCanPostMiddleware = require('./app/middlewares/canPost')
const userCanFollowMiddleware = require('./app/middlewares/canFollow')

routes.get('/users', UserController.getAllUsers)
routes.post('/users', UserController.createUser)
routes.post('/users/follow/', userCanFollowMiddleware, UserController.followUser)
routes.post('/users/unfollow/', userCanFollowMiddleware, UserController.unfollowUser)

routes.get('/posts', PostController.getAllPosts)
routes.get('/posts/search', PostController.searchPost)
routes.get('/posts/:postId', PostController.getPostById)


routes.param('id', userExistsMiddleware)

routes.get('/users/:id', UserController.getUserById)
routes.get('/users/:id/followers', UserController.getAllFollowersByUserId)
routes.get('/users/:id/following', UserController.getAllFollowingByUserId)

routes.get('/posts/:id/all', PostController.getAllPostsByUserId)
routes.get('/posts/:id/following', PostController.getAllFollowingPostsByUserId)

routes.use('/posts/:id', userCanPostMiddleware)

routes.post('/posts/:id/post', PostController.createPost)
routes.post('/posts/:id/repost/:postId', PostController.createRepost)
routes.post('/posts/:id/quote-post/:postId', PostController.createQuotePost)

module.exports = routes
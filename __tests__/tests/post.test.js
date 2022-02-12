const app = require('../../src/server')
const request = require('supertest')
const { StatusCodes } = require('http-status-codes')

describe('post creation', () => {
  it('should create a post', async () => {
    const user = await request(app).post('/users').send({ name: 'pinwheel' })
    const validMessage = 'Hi guys, please follow me for more tips&tricks'
    const res = await request(app).post('/posts/' + user._body.id + '/post').send({ message: validMessage })
    expect(res.statusCode).toBe(StatusCodes.OK)
  })
  it('should not create a post due to length of characters', async () => {
    const user = await request(app).post('/users').send({ name: 'kalameet' })
    let invalidMessage = 'k'
    for (let i = 0; i < 777; i++) invalidMessage += 'k'
    const res = await request(app).post('/posts/' + user._body.id + '/post').send({ message: invalidMessage })
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
  })
  it('should not create a post due to user id not existing in the database', async () => {
    const fakeUserId = 3589
    const validMessage = 'Theres some message that will not be seen'
    const res = await request(app).post('/posts/' + fakeUserId + '/post').send({ message: validMessage })
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
  })
  it('should repost a post', async () => {
    const user = await request(app).post('/users').send({ name: 'oscar' })
    const validMessage = 'Hi, im oscar'
    const userPost = await request(app).post('/posts/' + user._body.id + '/post').send({ message: validMessage })
    const res = await request(app).post('/posts/' + user._body.id + '/repost/' + userPost._body.id).send()
    expect(res.statusCode).toBe(StatusCodes.OK)
  })
  it('should not repost a post since the original post does not exists', async () => {
    const user = await request(app).post('/users').send({ name: 'rossi' })
    const fakePostId = 3345
    const res = await request(app).post('/posts/' + user._body.id + '/repost/' + fakePostId).send()
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
  })
  it('should quote-post a post', async () => {
    const user = await request(app).post('/users').send({ name: 'roger' })
    const user2 = await request(app).post('/users').send({ name: 'kayn' })
    const validMessage = 'Hi, im roger'
    const userPost = await request(app).post('/posts/' + user._body.id + '/post').send({ message: validMessage })
    const quotePostMessage = 'Wow, im reposting roger original post and adding some quote message on top of it!'
    const res = await request(app).post('/posts/' + user2._body.id + '/quote-post/' + userPost._body.id).send({ message: quotePostMessage })
    expect(res.statusCode).toBe(StatusCodes.OK)
  })
  it('should not post more than 5 posts daily', async () => {
    const user = await request(app).post('/users').send({ name: 'marco' })
    const post1 = await request(app).post('/posts/' + user._body.id + '/post').send({ message: 'Im Marco, and i like Reggae' })
    const post2 = await request(app).post('/posts/' + user._body.id + '/post').send({ message: 'Im Marco, this is my second post today' })
    await request(app).post('/posts/' + user._body.id + '/repost/' + post1._body.id).send()
    await request(app).post('/posts/' + user._body.id + '/quote-post/' + post2._body.id).send({ message: 'Looks like im quoting-posting my own message :D' })
    await request(app).post('/posts/' + user._body.id + '/post').send({ message: 'Im Marco, this is my fifth post today' })
    const post6 = await request(app).post('/posts/' + user._body.id + '/post').send({ message: 'Im Marco, this is my sixth post today' })
    expect(post6.statusCode).toBe(StatusCodes.UNAUTHORIZED)
  })
  it('should list correctly the posts created', async () => {
    const user = await request(app).post('/users').send({ name: 'ichigo' })
    await request(app).post('/posts/' + user._body.id + '/post').send({ message: 'Yoo, finally using posterr' })
    await request(app).post('/posts/' + user._body.id + '/post').send({ message: 'This is such a nice app!!' })
    const res = await request(app).get('/posts/' + user._body.id + '/all')
    expect(res.body.count).toBe(2)
  })
})
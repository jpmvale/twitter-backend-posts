const app = require('../../src/server')
const request = require('supertest')
const { StatusCodes } = require('http-status-codes')

describe('user creation', () => {
  it('should create a user', async () => {
    const validUser = {
      name: 'lucio'
    }
    const res = await request(app).post('/users').send(validUser)
    expect(res.statusCode).toBe(StatusCodes.OK)
  })
  it('should not create a user due to non-alphanumeric characters', async () => {
    const invalidUser = {
      name: 'lucio#'
    }
    const res = await request(app).post('/users').send(invalidUser)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
  })
  it('should not create a user due to length of characters', async () => {
    const invalidUser = {
      name: '123456789012345'
    }
    const res = await request(app).post('/users').send(invalidUser)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
  })
})

describe('user follow/unfollow actions', () => {
  it('should make one user follow another', async () => {
    const user1 = await request(app).post('/users').send({ name: 'pontyff' })
    const user2 = await request(app).post('/users').send({ name: 'artorias' })
    const res = await request(app).post('/users/follow/').send({ follower_id: user1._body.id, following_id: user2._body.id })

    expect(res.statusCode).toBe(StatusCodes.OK)
  })
  it('should make one user unfollow another', async () => {
    const user1 = await request(app).post('/users').send({ name: 'seath' })
    const user2 = await request(app).post('/users').send({ name: 'sif' })
    await request(app).post('/users/follow/').send({ follower_id: user1._body.id, following_id: user2._body.id })
    const res = await request(app).post('/users/unfollow/').send({ follower_id: user1._body.id, following_id: user2._body.id })
    expect(res.statusCode).toBe(StatusCodes.OK)
  })
  it('should not make the same user follow himself', async () => {
    const user1 = await request(app).post('/users').send({ name: 'queelag' })
    const res = await request(app).post('/users/follow/').send({ follower_id: user1._body.id, following_id: user1._body.id })

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
  })
  it('should not let the user to follow twice the same id', async () => {
    const user1 = await request(app).post('/users').send({ name: 'pursuer' })
    const user2 = await request(app).post('/users').send({ name: 'patches' })
    await request(app).post('/users/follow/').send({ follower_id: user1._body.id, following_id: user2._body.id })
    const res = await request(app).post('/users/follow/').send({ follower_id: user1._body.id, following_id: user2._body.id })

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
  })
  it('should not let the user unfollow some id that hes not following', async () => {
    const user1 = await request(app).post('/users').send({ name: 'dancer' })
    const user2 = await request(app).post('/users').send({ name: 'gwyn' })

    const res = await request(app).post('/users/unfollow/').send({ follower_id: user1._body.id, following_id: user2._body.id })
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
  })
})
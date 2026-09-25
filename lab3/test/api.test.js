const assert = require('node:assert/strict')
const test = require('node:test')
const request = require('supertest')
const app = require('../index')

test('GET /articles returns all articles', async () => {
  const response = await request(app)
    .get('/articles')
    .expect('Content-Type', /json/)
    .expect(200)

  assert.ok(Array.isArray(response.body))
  assert.equal(response.body[0].title, 'My article')
})

test('POST /articles creates an article', async () => {
  const response = await request(app)
    .post('/articles')
    .send({
      title: 'A new article',
      content: 'New content.',
      date: '25/09/2026',
      author: 'Alice'
    })
    .expect('Content-Type', /json/)
    .expect(201)

  assert.equal(response.body.title, 'A new article')
  assert.match(response.body.id, /^[0-9a-f-]{36}$/)
})

test('GET /articles/:articleId/comments returns article comments', async () => {
  const response = await request(app)
    .get('/articles/6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b/comments')
    .expect('Content-Type', /json/)
    .expect(200)

  assert.equal(response.body.length, 1)
  assert.equal(response.body[0].author, 'Bob McLaren')
})

test('POST /articles/:articleId/comments creates a comment', async () => {
  const response = await request(app)
    .post('/articles/6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b/comments')
    .send({ content: 'A new comment.', author: 'Alice' })
    .expect('Content-Type', /json/)
    .expect(201)

  assert.equal(response.body.content, 'A new comment.')
  assert.equal(response.body.articleId, '6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b')
  assert.match(response.body.id, /^[0-9a-f-]{36}$/)
})

test('POST /articles rejects an incomplete article', async () => {
  await request(app)
    .post('/articles')
    .send({ title: 'Incomplete' })
    .expect(400)
})

test('GET comments rejects an unknown article', async () => {
  await request(app)
    .get('/articles/unknown/comments')
    .expect(404)
})

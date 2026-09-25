const { randomUUID } = require('node:crypto')
const express = require('express')
const db = require('../db')

const router = express.Router({ mergeParams: true })
const articleExists = articleId => db.articles.some(article => article.id === articleId)

router.get('/', (req, res) => {
  if (!articleExists(req.params.articleId)) {
    return res.status(404).json({ error: 'Article not found' })
  }

  const comments = db.comments.filter(comment => comment.articleId === req.params.articleId)
  return res.json(comments)
})

router.post('/', (req, res) => {
  if (!articleExists(req.params.articleId)) {
    return res.status(404).json({ error: 'Article not found' })
  }

  const isValid = ['content', 'author'].every(
    field => typeof req.body[field] === 'string' && req.body[field].trim() !== ''
  )

  if (!isValid) {
    return res.status(400).json({ error: 'content and author are required' })
  }

  const comment = {
    id: randomUUID(),
    timestamp: Date.now(),
    content: req.body.content,
    articleId: req.params.articleId,
    author: req.body.author
  }

  db.comments.push(comment)
  return res.status(201).json(comment)
})

module.exports = router

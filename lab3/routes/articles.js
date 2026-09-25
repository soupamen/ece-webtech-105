const { randomUUID } = require('node:crypto')
const express = require('express')
const db = require('../db')

const router = express.Router()
const requiredFields = ['title', 'content', 'date', 'author']

router.get('/', (req, res) => {
  res.json(db.articles)
})

router.post('/', (req, res) => {
  const isValid = requiredFields.every(
    field => typeof req.body[field] === 'string' && req.body[field].trim() !== ''
  )

  if (!isValid) {
    return res.status(400).json({ error: 'title, content, date and author are required' })
  }

  const article = {
    id: randomUUID(),
    title: req.body.title,
    content: req.body.content,
    date: req.body.date,
    author: req.body.author
  }

  db.articles.push(article)
  return res.status(201).json(article)
})

module.exports = router

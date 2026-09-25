const express = require('express')
const articlesRouter = require('./routes/articles')
const commentsRouter = require('./routes/comments')
const app = express()

app.set('port', 8080)
app.use(express.json())

app.get('/', (req, res) => {
	res.send('hello w0rld');
});

app.use('/articles', articlesRouter)
app.use('/articles/:articleId/comments', commentsRouter)

if (require.main === module) {
  app.listen(
      app.get('port'),
      () => console.log(`server listening on port ${app.get('port')}`)
    )
}

module.exports = app
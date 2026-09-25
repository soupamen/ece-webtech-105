const express = require('express')
const app = express()

app.set('port', 8080)

app.get('/', (req, res) => {
	res.send('hello w0rld');
});

app.listen(
  app.get('port'), 
  () => console.log(`server listening on ${app.get('port')}`)
)

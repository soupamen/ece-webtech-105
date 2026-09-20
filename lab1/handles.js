const url = require('url')
const qs = require('querystring')
const fs = require('fs')


function serverHandle (req, res) {
  const route = url.parse(req.url)
  const path = route.pathname
  const params = qs.parse(route.query)

  if (path === '/hello' && 'name' in params) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    if (params['name'] === 'lilian' || params['name'] === 'yannis' || params['name'] === 'arsene') {
      res.write("I'm a 4th year cybersecuty student at ECE Paris")
    }
    else {
      res.write('Hello ' + params['name'])
    }
  }
  else if (path === '/') {
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.write('Follow this <a href="/hello?name=anonymous">link</a> to say hello ')
  }
  else {
    const contentPath = './content' + path + '.json'
    if (fs.existsSync(contentPath)) {
      const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'))
      res.writeHead(200, {'Content-Type': 'application/json'})
      res.write(JSON.stringify(content))
    }
    else {
      res.writeHead(404, {'Content-Type': 'text/html'})
      res.write('404 Not Found')
    }
  }

  res.end()
}
module.exports = {serverHandle}

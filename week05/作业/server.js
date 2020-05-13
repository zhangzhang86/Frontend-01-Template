const http = require('http')
const server = http.createServer((req,res)=>{
  console.log(req.headers)
  res.setHeader('Content-Type','text/html')
  res.setHeader('X-Foo','bar')
  res.writeHead(200, {'Content-Type': 'text/plain'} );
  res.end('okay')
})

server.listen(8888, ()=>{
  console.log('success')
})
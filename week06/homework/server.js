const http = require("http");

// Returns content-type = text/plain
const server = http.createServer((req, res) => {
  console.log("request received");
  console.log(req.headers);
  res.setHeader('Content-Type', 'text/html');
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(
    `<html>
      <head>
          <style>
            body div #foo {
              width:400px;
              height:400px;
              background-color: #a74545;
            }
            body div img {
              width:100px;
              height:100px;
              background-color: #eeeeee;
            }
          </style>
      </head>
      <body>
          <div>
              <div id="foo"/>
              <img/>
          </div>
      </body>
    </html>`);
});

server.listen(9901);

console.log('listen on http://localhost:9901')
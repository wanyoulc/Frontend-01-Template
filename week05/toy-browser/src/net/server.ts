import http from 'http'

const server = http.createServer((req, res) => {

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200);
  res.write('123456789sadaaeefafsasf')
  res.write('sadsadasssdscsac')
  res.end();
});

server.listen(8080);
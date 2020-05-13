import http from 'http'


http.createServer((req, res) => {
    console.log('request received');
    res.setHeader('Content-Type', 'text/plain')
    res.writeHead(200)
    res.end('ok')
})
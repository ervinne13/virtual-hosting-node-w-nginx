
const http = require('http');
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        console.log('test');
        res.end('Hi, I\'m server 2 residing in the same server as server 1 :)');
    }
});

server.listen(3001);
console.log('App listening to port 3001');
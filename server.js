
const http = require('http');
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        console.log('test');
        res.end('Hi, I\'m index from server 1!');
    }

    if (req.url === '/api/courses') {
        res.end('Hi, I\'m courses from the API!');
    }
});

server.listen(3000);
console.log('App listening to port 3000');
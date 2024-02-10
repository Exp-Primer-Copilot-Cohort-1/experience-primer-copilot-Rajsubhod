// Create web server with Node.js
// 1. Load the http module to create an http server.
var http = require('http');
var url = require('url');
var fs = require('fs');
var querystring = require('querystring');
var comments = [];

// 2. Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
    var url_parts = url.parse(request.url);
    console.log(url_parts);
    if (url_parts.pathname == '/post_comment') {
        var fullBody = '';
        request.on('data', function(chunk) {
            fullBody += chunk.toString();
        });
        request.on('end', function() {
            response.writeHead(200, "OK", {'Content-Type': 'text/html'});
            response.write('<html><head><title>Post data</title></head><body>');
            response.write('You have sent: ' + fullBody);
            response.write('</body></html>');
            response.end();
            var decodedBody = querystring.parse(fullBody);
            comments.push(decodedBody.comment);
            console.log(comments);
        });
    } else if (url_parts.pathname == '/') {
        fs.readFile('./index.html', function(error, data) {
            response.writeHead(200, "OK", {'Content-Type': 'text/html'});
            response.write(data);
            response.end();
        });
    } else if (url_parts.pathname == '/get_comments') {
        response.writeHead(200, "OK", {'Content-Type': 'application/json'});
        response.write(JSON.stringify(comments));
        response.end();
    } else {
        response.writeHead(404, "Not Found", {'Content-Type': 'text/html'});
        response.write('<html><head><title>Not Found</title></head><body>Not Found</body></html>');
        response.end();
    }
});

// 3. Listen on port 8000, IP defaults to

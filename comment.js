// Create web server
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

// Load the comments from the file
var comments = JSON.parse(fs.readFileSync('comments.json', 'utf8'));

// Use the body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add a route for the home page
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

// Add a route for the comments
app.get('/comments', function(req, res) {
    res.json(comments);
});

// Add a route for posting a comment
app.post('/comments', function(req, res) {
    var comment = req.body;
    comments.push(comment);
    fs.writeFileSync('comments.json', JSON.stringify(comments));
    io.sockets.emit('comment', comment);
    res.json(comment);
});

// Add a route for the comments
app.get('/comments', function(req, res) {
    res.json(comments);
});

// Start the server
server.listen(3000, function() {
    console.log('Server is listening on port 3000');
});
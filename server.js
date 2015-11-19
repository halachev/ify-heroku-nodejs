var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = process.env.PORT || 8080; 

app.all('/*', function (req, res, next) {
	res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
	res.header("Access-Control-Allow-Methods", "GET");
	next();
});

app.get('/', function (req, res) {
	res.send('welcome to ify chat server');
});


io.on('connection', function (socket) {
	
	socket.on('join', function (data) {
		socket.join(data.id);
	});
		 
	socket.on('send_message', function (data) {
		
		io.sockets.in(data.send_to).emit('send_message',  {
			content : data
		});
		
	});
	
	socket.on('typing', function (data) {
		
		io.sockets.in(data.send_to).emit('typing',  {
			content : data
		});
		
	});
	
	socket.on('stop_typing', function (data) {
		
		io.sockets.in(data.send_to).emit('stop_typing',  {
			content : data
		});
		
	});
	
	socket.on('seen', function (data) {
		
		io.sockets.in(data.send_to).emit('seen',  {
			content : data
		});
		
	});
	
	socket.on('disconnect', function () {
		socket.broadcast.emit('user_left');
	});
	
	
});

http.listen(port, function () {
	console.log('listening on *:' + port);
});

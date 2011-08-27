/*
	@ Author Lee Quarella
*/


//Initialize the server
var express = require('express');
var app = require('express').createServer()
var io = require('socket.io')
	io.configure(function () { 
	  io.set("transports", ["xhr-polling"]); 
	  io.set("polling duration", 10); 
	});
	io.listen(app)
app.listen(); // pass the socket you wish to listen to here.  For heroku I have left it blank.
app.use(express.bodyParser());



app.post('/', function(req, res){
	// First checks to make sure the request has the proper credentials.
	// Then accepts a post request (params: channel, message_type, message).
	// Finally sends the message_type and message to the channel	
	if(checkCredentials(req.body.credentials)){
		res.send("received")
		console.log("EMMITING (post) " + req.body.message_type + " to channel " + req.body.channel + ": " + req.body.message)
	  	io.sockets.in(req.body.channel).emit(req.body.message_type, { message: req.body.message })
	}
})

app.get('/:channel/:message_type/:message', function (req, res) {
	if(checkCredentials(req.body.credentials)){	
		res.send("received")
		console.log("EMMITING " + req.params.message_type + " to channel " + req.params.channel + ": " + req.params.message)
		io.sockets.in(req.params.channel).emit(req.params.message_type, { message: req.params.message })
	}
});


app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});


io.sockets.on('connection', function (socket) {
	console.log("Client connected.")
	clients.newClient(socket)

	socket.on('set nickname', function (data) {
		clients.setNickname(socket, data.nickname)
	});


	socket.on("change channel", function(data){
		clients.joinChannel(socket, data.channel)
	});


	socket.on('disconnect', function(){
		clients.disconnect(socket)
	});

  socket.on('client broadcast to channel', function (data) {
    socket.get("nickname", function (err, name) {nick = name});
    socket.get("channel", function (err, name) {channel = name});
    socket.broadcast.to(channel).emit('channel message', { userName: nick, mes: data.mes });
  });

});


var checkCredentials = function(creds){
	//if creds are good	
		return true
	//else
		return false
}



var clients = {
	list: {},
	newClient: function(socket){
		client = {
			socket: socket,
			channel: null,
			nickname: null
		}
		clients.list[socket.id] = client
	},

	setNickname: function(socket, nickname){
		client = clients.list[socket.id]
		client.nickname = nickname
		socket.set('nickname', nickname, function () {
			socket.broadcast.emit('channel message', {userName: "Server", mes: nickname + ' has connected.'});
		});
	},

	joinChannel: function(socket, channel){
		client = clients.list[socket.id]
		clients.leaveCurrentChannel(socket)
		client.channel = channel
	  	socket.set('channel', channel, function () {
	  		if(client.nickname){
	  			socket.broadcast.to(channel).emit("channel message", { userName: "Server", mes: client.nickname + " has joined the channel."});
	  		}
			socket.emit('channel message', {userName: "Server", mes: "Changed to channel " + client.channel});
		});
		socket.join(channel)
	},

	leaveCurrentChannel:function (socket){
		client = clients.list[socket.id]
		old_channel = client.channel
		if(old_channel){
			socket.broadcast.to(old_channel).emit("channel message", { userName: "Server", mes: client.nickname + " has left the channel."});
			socket.leave(old_channel)

		}
	},

	disconnect:function (socket){
		client = clients.list[socket.id]
	  	console.log(client.nickname + " disconnected from channel " + client.channel + ".")
	  	if(client.nickname){
	  		socket.broadcast.to(client.channel).emit("channel message", { userName: "Server", mes: client.nickname + " has disconnected."});
	  	}
	  	delete clients[socket.id]
	}
}


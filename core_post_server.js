/*
	@ Author Lee Quarella
		This server is very simple, allows end users to connect to it, join a channel, and receive information on that channel.
		Servers can send post requests here which are then sent to the appropriate channels.
*/


//Initialize the server
var express = require('express');
var app = require('express').createServer()
  , io = require('socket.io').listen(app)
app.listen(80);
app.use(express.bodyParser());


var checkCredentials = function(creds){
	//if creds are good	
		return true
	//else
		return false
}



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
});




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


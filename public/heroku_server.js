(function() {
  this.port = process.env.PORT || 3000;
  console.log(port);
  this.express = require('express');
  this.app = require('express').createServer().listen(port).use(express.bodyParser());
  this.io = require('socket.io').listen(app);
  this.checkCredentials = function(creds) {
    return true;
    return false;
  };
  app.post('/', function(req, res) {
    if (checkCredentials(req.body.credentials)) {
      res.send("received");
      console.log("EMMITING (post) " + req.body.message_type + " to channel " + req.body.channel + ": " + req.body.message);
      return io.sockets["in"](req.body.channel).emit(req.body.message_type, {
        message: req.body.message
      });
    }
  });
  io.sockets.on('connection', function(socket) {
    console.log("((((((((Client connected))))))))");
    clients.newClient(socket);
    socket.on('set nickname', function(data) {
      return clients.setNickname(socket, data.nickname);
    });
    socket.on("change channel", function(data) {
      console.log("((((((((Client joining channel " + data.channel + "))))))))\n\n");
      return clients.joinChannel(socket, data.channel);
    });
    return socket.on('disconnect', function() {
      console.log("((((((((Client disconnected))))))))\n\n");
      return clients.disconnect(socket);
    });
  });
  this.clients = {
    list: {},
    newClient: function(socket) {
      var client;
      client = {
        socket: socket,
        channel: null,
        nickname: null
      };
      return this.list[socket.id] = client;
    },
    setNickname: function(socket, nickname) {
      var client;
      client = this.list[socket.id];
      client.nickname = nickname;
      return socket.set('nickname', nickname, function() {
        return socket.broadcast.emit('channel message', {
          userName: "Server",
          mes: nickname + ' has connected.'
        });
      });
    },
    joinChannel: function(socket, channel) {
      var client;
      client = this.list[socket.id];
      this.leaveCurrentChannel(socket);
      client.channel = channel;
      socket.set('channel', channel, function() {
        if (client.nickname) {
          return socket.broadcast.to(channel).emit("channel message", {
            userName: "Server",
            mes: client.nickname + " has joined the channel."
          });
        } else {
          return socket.emit('channel message', {
            userName: "Server",
            mes: "Changed to channel " + client.channel
          });
        }
      });
      return socket.join(channel);
    },
    leaveCurrentChannel: function(socket) {
      var client, old_channel;
      client = this.list[socket.id];
      old_channel = client.channel;
      if (old_channel) {
        socket.broadcast.to(old_channel).emit("channel message", {
          userName: "Server",
          mes: client.nickname + " has left the channel."
        });
        return socket.leave(old_channel);
      }
    },
    disconnect: function(socket) {
      var client;
      client = this.list[socket.id];
      console.log(client.nickname + " disconnected from channel " + client.channel + ".");
      if (client.nickname) {
        socket.broadcast.to(client.channel).emit("channel message", {
          userName: "Server",
          mes: client.nickname + " has disconnected."
        });
      }
      return delete clients[socket.id];
    }
  };
}).call(this);
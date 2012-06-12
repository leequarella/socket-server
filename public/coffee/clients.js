(function() {
  var Client, Clients;

  Client = require("./client").Client;

  Clients = (function() {

    function Clients() {}

    Clients.prototype.list = {};

    Clients.prototype.newClient = function(socket) {
      var client;
      client = new Client(socket);
      return this.list[socket.id] = client;
    };

    Clients.prototype.setNickname = function(socket, nickname) {
      var client;
      client = this.list[socket.id];
      client.setNickname(nickname);
      return socket.set('nickname', nickname, function() {
        return socket.broadcast.emit('channel message', {
          userName: "Server",
          mes: nickname + ' has connected.'
        });
      });
    };

    Clients.prototype.joinChannel = function(socket, channel) {
      var client;
      this.leaveCurrentChannel(socket);
      client = this.list[socket.id];
      client.setChannel(channel);
      this.list[socket.id] = client;
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
    };

    Clients.prototype.leaveCurrentChannel = function(socket) {
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
    };

    Clients.prototype.disconnect = function(socket) {
      var client;
      client = this.list[socket.id];
      console.log(client.nickname + " disconnected from channel " + client.channel + ".");
      if (client.nickname) {
        socket.broadcast.to(client.channel).emit("channel message", {
          userName: "Server",
          mes: client.nickname + " has disconnected."
        });
      }
      return delete this.list[socket.id];
    };

    Clients.prototype.broadcast = function(socket, message) {
      var client;
      client = this.list[socket.id];
      return socket.broadcast.to(client.channel).emit("channel message", {
        userName: client.nickname,
        mes: message
      });
    };

    return Clients;

  })();

  exports.Clients = Clients;

}).call(this);

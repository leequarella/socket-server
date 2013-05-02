(function() {
  var Client;

  Client = (function() {
    function Client(socket, channel, nickname) {
      this.socket = socket;
      this.channel = channel;
      this.nickname = nickname;
      this.id = this.socket.id;
    }

    Client.prototype.setChannel = function(channel) {
      var _this = this;

      this.leaveCurrentChannel();
      this.channel = channel;
      this.socket.set('channel', channel, function() {
        if (_this.nickname) {
          return _this.socket.broadcast.to(channel).emit("channel message", {
            userName: "Server",
            mes: _this.nickname + " has joined the channel."
          });
        } else {
          return _this.socket.emit('channel message', {
            userName: "Server",
            mes: "Changed to channel " + _this.channel
          });
        }
      });
      return this.socket.join(channel);
    };

    Client.prototype.setNickname = function(nickname) {
      var _this = this;

      this.nickname = nickname;
      return this.socket.set('nickname', nickname, function() {
        return _this.socket.broadcast.emit('channel message', {
          userName: "Server",
          mes: _this.nickname + ' has connected.'
        });
      });
    };

    Client.prototype.broadcast = function(message) {
      return this.socket.broadcast.to(this.channel).emit("channel message", {
        userName: this.nickname,
        mes: message
      });
    };

    Client.prototype.leaveChannel = function(channel) {
      this.socket.broadcast.to(channel).emit("channel message", {
        userName: "Server",
        mes: this.nickname + " has left the channel."
      });
      return this.socket.leave(channel);
    };

    Client.prototype.leaveCurrentChannel = function(socket) {
      this.leaveChannel(this.channel);
      return this.channel = null;
    };

    Client.prototype.disconnect = function() {
      if (this.nickname) {
        return this.socket.broadcast.to(this.channel).emit("channel message", {
          userName: "Server",
          mes: this.nickname + " has disconnected."
        });
      }
    };

    return Client;

  })();

  exports.Client = Client;

}).call(this);

(function() {
  this.ClientSockets = (function() {
    function ClientSockets(channel) {
      var _this = this;

      this.socket = io.connect();
      this.setChannel(channel);
      this.socket.on('channel message', function(data) {
        return Ui.displayMessage(data.userName, data.mes);
      });
    }

    ClientSockets.prototype.setChannel = function(channel) {
      this.socket.emit("change channel", {
        channel: channel
      });
      this.channel = channel;
      return Ui.displayChannel(channel);
    };

    ClientSockets.prototype.setNickname = function(nickname) {
      return this.socket.emit("set nickname", {
        nickname: nickname
      });
    };

    ClientSockets.prototype.broadcast = function(message) {
      this.socket.emit('broadcast', {
        message: message
      });
      return Ui.displayMessage($("#name").val(), message);
    };

    return ClientSockets;

  })();

}).call(this);

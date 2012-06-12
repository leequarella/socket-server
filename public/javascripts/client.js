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
      return this.channel = channel;
    };

    Client.prototype.setNickname = function(nickname) {
      return this.nickname = nickname;
    };

    return Client;

  })();

  exports.Client = Client;

}).call(this);

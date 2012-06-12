(function() {
  var Client, Clients;

  Client = require("./client").Client;

  Clients = (function() {

    Clients.name = 'Clients';

    function Clients() {}

    Clients.prototype.list = {};

    Clients.prototype.newClient = function(socket) {
      var client;
      client = new Client(socket);
      return this.list[socket.id] = client;
    };

    Clients.prototype.getClient = function(id) {
      var client;
      return client = this.list[id];
    };

    Clients.prototype.setNickname = function(socket, nickname) {
      var client;
      client = this.getClient(socket.id);
      return client.setNickname(nickname);
    };

    Clients.prototype.joinChannel = function(socket, channel) {
      var client;
      client = this.getClient(socket.id);
      return client.setChannel(channel);
    };

    Clients.prototype.disconnect = function(socket) {
      var client;
      client = this.getClient(socket.id);
      client.disconnect();
      return delete this.list[socket.id];
    };

    Clients.prototype.broadcast = function(socket, message) {
      var client;
      client = this.getClient(socket.id);
      return client.broadcast(message);
    };

    return Clients;

  })();

  exports.Clients = Clients;

}).call(this);

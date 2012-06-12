(function() {
  var Clients, Security, app, express, io, port;

  port = process.env.PORT || 3001;

  express = require('express');

  app = express.createServer();

  io = require('socket.io').listen(app);

  app.listen(port);

  app.use(express.bodyParser());

  app.use(express.static(__dirname + '/views'));

  Clients = require("./javascripts/clients").Clients;

  Clients = new Clients;

  Security = require("./javascripts/security").Security;

  Security = new Security;

  app.get('/', function(req, res) {
    if (Security.checkCredentials(req.body.credentials)) {
      res.render("views/index.html");
      console.log("!! GET REQUEST RECEIVED !!");
      return io.sockets["in"](req.body.channel).emit(req.body.message_type, {
        message: req.body.message
      });
    }
  });

  app.post('/', function(req, res) {
    if (Security.checkCredentials(req.body.credentials)) {
      res.send("received");
      console.log("(((((((( EMMITING (post) " + req.body.message_type + " to channel " + req.body.channel + ": " + req.body.message + " ))))))))");
      return io.sockets["in"](req.body.channel).emit(req.body.message_type, {
        message: req.body.message
      });
    }
  });

  io.sockets.on('connection', function(socket) {
    console.log("((((((((Client connected))))))))");
    Clients.newClient(socket);
    socket.on('set nickname', function(data) {
      console.log("((((((((Nickname set " + data.nickname + "))))))))");
      return Clients.setNickname(socket, data.nickname);
    });
    socket.on("change channel", function(data) {
      console.log("((((((((Client joining channel " + data.channel + "))))))))\n");
      return Clients.joinChannel(socket, data.channel);
    });
    socket.on('disconnect', function() {
      console.log("((((((((Client disconnected. " + socket.id + "))))))))\n");
      return Clients.disconnect(socket);
    });
    return socket.on('broadcast', function(data) {
      console.log("((((((((Client Broadcasting " + socket.id + "))))))))\n");
      return Clients.broadcast(socket, data.message);
    });
  });

}).call(this);

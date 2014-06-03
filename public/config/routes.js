(function() {
  app.get('/client/socket_junk.js', function(req, res) {
    return res.sendfile("client/socket_junk.js");
  });

  app.get('/client/ui.js', function(req, res) {
    return res.sendfile("client/ui.js");
  });

  app.get('/client/init.js', function(req, res) {
    return res.sendfile("client/init.js");
  });

  app.get('/389EFAE2EDA94A65C17F6472A4A35BEA.txt', function(req, res) {
    return res.sendfile("client/389EFAE2EDA94A65C17F6472A4A35BEA.txt");
  });

  app.get('/', function(req, res) {
    if (Security.checkCredentials(req.body.credentials)) {
      Logger.info("!! GET REQUEST RECEIVED !!");
      res.sendfile("app/views/index.html");
      return io.sockets["in"](req.body.channel).emit(req.body.message_type, {
        message: req.body.message
      });
    }
  });

  app.post('/', function(req, res) {
    if (Security.checkCredentials(req.body.credentials)) {
      Logger.info("EMMITING (post) " + req.body.message_type + " to channel " + req.body.channel + ": " + req.body.message);
      res.send("received");
      return io.sockets["in"](req.body.channel).emit(req.body.message_type, {
        message: req.body.message
      });
    }
  });

  io.sockets.on('connection', function(socket) {
    Logger.info("Client connected");
    Clients.newClient(socket);
    socket.on('set nickname', function(data) {
      Logger.info("Nickname set " + data.nickname);
      return Clients.setNickname(socket, data.nickname);
    });
    socket.on("change channel", function(data) {
      Logger.info("Client joining channel " + data.channel);
      return Clients.joinChannel(socket, data.channel);
    });
    socket.on('disconnect', function() {
      Logger.info("Client disconnected. " + socket.id);
      return Clients.disconnect(socket);
    });
    return socket.on('broadcast', function(data) {
      Logger.info("Client Broadcasting " + socket.id);
      return Clients.broadcast(socket, data.message);
    });
  });

}).call(this);

(function() {
  var ServerInitializer;

  ServerInitializer = (function() {
    function ServerInitializer() {
      var express, http;

      console.log("STARTING SERVER");
      express = require('express');
      http = require('http');
      console.log(" ...creating globals");
      global.port = process.env.PORT || 3001;
      global.app = express();
      global.server = http.createServer(app);
      console.log(" ...attempting to listen on port " + port);
      global.io = require('socket.io').listen(server);
      server.listen(port);
      app.use(express.bodyParser());
      app.use(express["static"](__dirname + '/views'));
      console.log(" ...done.");
    }

    return ServerInitializer;

  })();

  new ServerInitializer;

}).call(this);

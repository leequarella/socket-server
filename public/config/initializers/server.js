(function() {
  var ServerInitializer;

  ServerInitializer = (function() {
    function ServerInitializer(port, sslport) {
      this.port = port;
      this.express = require('express');
      this.http = require('http');
      this.https = require('https');
      this.fs = require('fs');
      this.options = {
        key: this.fs.readFileSync(__dirname + '/../../../private/key.pem'),
        cert: this.fs.readFileSync(__dirname + '/../../../private/cacert.pem')
      };
      console.log("STARTING SERVER");
      this.startExpress();
      this.startSocketIO();
      this.startStaticService();
    }

    ServerInitializer.prototype.startExpress = function() {
      console.log(" ...preparing express server.");
      global.app = this.express();
      return app.set('port', 4001);
    };

    ServerInitializer.prototype.startSocketIO = function() {
      console.log(" ...preparing http for socket.io");
      if (process.env.NODE_ENV === 'production') {
        app.listen(app.get('port', function() {
          return console.log("Express server running on: " + app.get('port'));
        }));
      }
      global.server = this.https.createServer(this.options, app);
      server.listen(port);
      this.httpserver = this.http.createServer(app);
      global.io = require('socket.io').listen(server);
      return console.log(" ...socket.io listening on port " + port);
    };

    ServerInitializer.prototype.startStaticService = function() {
      console.log(" ...preparing to serve static assets");
      app.use(this.express.bodyParser());
      app.use(this.express["static"](__dirname + '/static'));
      return console.log("..done.");
    };

    return ServerInitializer;

  })();

  exports.ServerInitializer = ServerInitializer;

}).call(this);

(function() {
  var Clients, Logger, Security, ServerInitializer;

  global.port = process.env.PORT || 3001;

  ServerInitializer = require("./config/initializers/server").ServerInitializer;

  new ServerInitializer(port);

  Clients = require("./app/collections/clients").Clients;

  global.Clients = new Clients;

  require("./config/routes").Routes;

  Security = require("./lib/security").Security;

  global.Security = new Security;

  Logger = require("./lib/logger").Logger;

  global.Logger = new Logger;

}).call(this);

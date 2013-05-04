(function() {
  var Clients, Logger, Security, ServerInitializer;

  global.port = process.env.PORT || 3001;

  ServerInitializer = require("./config/initializers/server").ServerInitializer;

  new ServerInitializer(port);

  require("./config/routes").Routes;

  Clients = require("./app/collections/clients").Clients;

  global.Clients = new Clients;

  Security = require("./lib/security").Security;

  global.Security = new Security;

  Logger = require("./lib/logger").Logger;

  global.Logger = new Logger;

}).call(this);

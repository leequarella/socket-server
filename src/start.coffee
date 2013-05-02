require("./config/initializers/server")

Clients = require("./app/collections/clients").Clients
global.Clients = new Clients

require("./config/routes").Routes

Security = require("./lib/security").Security
global.Security = new Security

Logger = require("./lib/logger").Logger
global.Logger = new Logger

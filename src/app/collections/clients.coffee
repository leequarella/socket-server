Client = require("../models/client").Client
class Clients
  constructor: ->
  list: {}

  newClient: (socket) ->
    client = new Client(socket)
    @list[socket.id] = client

  getClient: (id) ->
    client = @list[id]

  setNickname: (socket, nickname) ->
    client = @getClient(socket.id)
    client.setNickname nickname

  joinChannel: (socket, channel)->
    client = @getClient(socket.id)
    client.setChannel channel

  disconnect: (socket) ->
    client = @getClient(socket.id)
    client.disconnect()
    delete @list[socket.id]

  broadcast: (socket, message) ->
    client = @getClient(socket.id)
    client.broadcast(message)

exports.Clients = Clients

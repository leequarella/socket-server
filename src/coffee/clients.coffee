Client = require("./client").Client
class Clients
  constructor: ->
  list: {}
  newClient: (socket) ->
    client = new Client(socket)
    @list[socket.id] = client

  setNickname: (socket, nickname) ->
    client = @list[socket.id]
    client.setNickname nickname
    socket.set 'nickname', nickname, ()->
      socket.broadcast.emit 'channel message', {userName: "Server", mes: nickname + ' has connected.'}

  joinChannel: (socket, channel)->
    @leaveCurrentChannel(socket)
    client = @list[socket.id]
    client.setChannel channel
    @list[socket.id] = client
    socket.set 'channel', channel, ()->
      if client.nickname
        socket.broadcast.to(channel).emit("channel message", { userName: "Server", mes: client.nickname + " has joined the channel."})
      else
        socket.emit('channel message', {userName: "Server", mes: "Changed to channel " + client.channel})
    socket.join(channel)

  leaveCurrentChannel: (socket) ->
    client = @list[socket.id]
    old_channel = client.channel
    if old_channel
      socket.broadcast.to(old_channel).emit("channel message", { userName: "Server", mes: client.nickname + " has left the channel."})
      socket.leave(old_channel)

  disconnect: (socket) ->
    client = @list[socket.id]
    console.log client.nickname + " disconnected from channel " + client.channel + "."
    if client.nickname
      socket.broadcast.to(client.channel).emit("channel message", { userName: "Server", mes: client.nickname + " has disconnected."})
    delete @list[socket.id]
  
  broadcast: (socket, message) ->
    client = @list[socket.id]
    socket.broadcast.to(client.channel).emit("channel message", { userName: client.nickname, mes: message})

exports.Clients = Clients

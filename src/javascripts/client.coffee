Logger = require('../logger').Logger
class Client
  constructor: (@socket, @channel, @nickname) ->
    @id = @socket.id

  setChannel:(channel) ->
    @leaveCurrentChannel()
    @channel = channel
    @socket.set 'channel', channel, ()=>
      if @nickname
        @socket.broadcast.to(channel).emit("channel message", { userName: "Server", mes: @nickname + " has joined the channel."})
      else
        @socket.emit('channel message', {userName: "Server", mes: "Changed to channel " + @channel})
    @socket.join(channel)

  setNickname: (nickname) ->
    @nickname = nickname
    @socket.set 'nickname', nickname, ()=>
      @socket.broadcast.emit 'channel message', {userName: "Server", mes: @nickname + ' has connected.'}

  broadcast: (message) ->
    @socket.broadcast.to(@channel).emit("channel message", { userName: @nickname, mes: message})

  leaveChannel: (channel) ->
    @socket.broadcast.to(channel).emit("channel message", { userName: "Server", mes: @nickname + " has left the channel."})
    @socket.leave(channel)

  leaveCurrentChannel: (socket) ->
    @leaveChannel(@channel)
    @channel = null

  disconnect: ->
    #Logger.info @nickname + " disconnected from channel " + @channel + "."
    if @nickname
      @socket.broadcast.to(@channel).emit("channel message", { userName: "Server", mes: @nickname + " has disconnected."})

exports.Client = Client

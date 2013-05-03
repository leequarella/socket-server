class @ClientSockets
  constructor: (channel) ->
    @socket = io.connect()
    @setChannel channel
    @socket.on 'channel message', (data) =>
      Ui.displayMessage(data.userName, data.mes)

  setChannel: (channel) ->
    @socket.emit("change channel", {channel: channel})
    @channel = channel
    Ui.displayChannel(channel)

  setNickname: (nickname) ->
    @socket.emit("set nickname", {nickname: nickname})

  broadcast: (message) ->
    @socket.emit('broadcast', { message: message })
    Ui.displayMessage($("#name").val(), message)

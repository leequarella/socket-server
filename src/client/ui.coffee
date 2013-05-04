class @Ui
  constructor: ->
    @setObservers()

  setObservers: ->
    $("#startChat").click =>    @startChat()
    $("#sendMessage").click => @sendMessage()
    $("#channel1").click =>     ClientSocket.setChannel(1)
    $("#channel2").click =>     ClientSocket.setChannel(2)
    $("#message").keyup (event) => ClientSocket.sendSock() if event.keyCode == 13

  startChat: ->
    @setNickname()
    $("#userName").hide()
    $("#chat").show()

  setNickname: ->
    nickname = $("#name").val()
    ClientSocket.setNickname(nickname)

  displayMessage: (who, message)->
    html = $("#messages").html()
    html += "<br><b>" + who + ":</b> " + message
    $("#messages").html(html).scrollTop($("#messages").outerHeight())

  clearMessageBox: -> $("#message").val("")

  sendMessage: ->
    message = $("#message").val()
    ClientSocket.broadcast message
    @clearMessageBox()

  displayChannel: (channel) ->
    $("#channelName").html("Channel #{channel}")

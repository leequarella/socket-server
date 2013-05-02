var socket = io.connect();
socket.emit("change channel", {channel:1})

socket.on('channel message', function (data) {
  writeToScreen(data.userName, data.mes)
});


$("#channel1").click(function(){
 changeChannel(1)
})

$("#channel2").click(function(){
 changeChannel(2)
})

$("#message").keyup(function(event){
 if(event.keyCode == 13){
    sendSock()
  }
})


function startChat(){
  $("#userName").hide()
  $("#chat").show()
  socket.emit("set nickname", {nickname: $("#name").val()})
}


function sendSock(){
  mes = $("#message").val()
  $("#message").val("")
  socket.emit('broadcast', { message: mes });
  writeToScreen($("#name").val(), mes)
}


function writeToScreen(who, data){
  html = $("#messages").html()
  html += "<br><b>" + who + ":</b> " + data
  $("#messages").html(html).scrollTop($("#messages").outerHeight());
      console.log($("messages").outerHeight())
}


function changeChannel(channel){
  $("#channelName").html("Channel " + channel)
  socket.emit("change channel", {channel: channel})
}

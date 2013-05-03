(function() {
  this.Ui = (function() {
    function Ui() {
      this.setObservers();
    }

    Ui.prototype.setObservers = function() {
      var _this = this;

      $("#startChat").click(function() {
        return _this.startChat();
      });
      $("#sendMessage").click(function() {
        return _this.sendMessage();
      });
      $("#channel1").click(function() {
        return ClientSocket.setChannel(1);
      });
      $("#channel2").click(function() {
        return ClientSocket.setChannel(2);
      });
      return $("#message").keyup(function(event) {
        if (event.keyCode === 13) {
          return ClientSocket.sendSock();
        }
      });
    };

    Ui.prototype.startChat = function() {
      this.setNickname();
      $("#userName").hide();
      return $("#chat").show();
    };

    Ui.prototype.setNickname = function() {
      var nickname;

      nickname = $("#name").val();
      return ClientSocket.setNickname();
    };

    Ui.prototype.displayMessage = function(who, message) {
      var html;

      html = $("#messages").html();
      html += "<br><b>" + who + ":</b> " + message;
      return $("#messages").html(html).scrollTop($("#messages").outerHeight());
    };

    Ui.prototype.clearMessageBox = function() {
      return $("#message").val("");
    };

    Ui.prototype.sendMessage = function() {
      var message;

      message = $("#message").val();
      ClientSocket.broadcast(message);
      return this.clearMessageBox();
    };

    Ui.prototype.displayChannel = function(channel) {
      return $("#channelName").html("Channel " + channel);
    };

    return Ui;

  })();

}).call(this);

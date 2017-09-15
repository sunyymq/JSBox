    /*
    Pushbullet
    支持从剪切板发送 Push 和 接收最新的一条 Push
    by Neurogram
    */
    
   // 请将 Api key 填写到下方""中
    var apiKey = ""

    $ui.menu({
      items: ["Get Push", "Send Push"],
      handler: function(title, idx) {
        if (idx == 0) {
          $http.request({
            method: "GET",
            url: "https://api.pushbullet.com/v2/pushes",
            header: {
              "Access-Token": apiKey
            },
            handler: function(resp) {
              var push = resp.data.pushes[0].body
              if (push == undefined) {
                $ui.alert("Sorry, no pushes here")
              } else {
                $clipboard.text = push
                $ui.toast("success")
              }
            }
          })
        } else if ($clipboard.text == "") {
          $ui.alert("Clipboard is empty")
        } else {
          $http.request({
            method: "POST",
            url: "https://api.pushbullet.com/v2/pushes",
            header: {
              "Access-Token": apiKey
            },
            body: {
              type: "note",
              body: $clipboard.text
            }
          })
        }
      }
    })

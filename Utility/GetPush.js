    /*
    Get Push
    快速接收最新的一条 Push
    by Neurogram
    */
    
   // 请将 Api key 填写到下方""中
    var apiKey = ""

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

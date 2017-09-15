    /*
    Send Push
    从剪切板快速发送 Push
    by Neurogram
    */
    
   // 请将 Api key 填写到下方""中
    var apiKey = ""

    if ($clipboard.text == "") {
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
